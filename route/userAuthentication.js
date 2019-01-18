const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const _ = require('lodash');

const { User, validate } = require('../models/user');

//-------------------------------------------Registration of a new user --------------------
router.post('/signup', async (req, res) => {
    try {
        console.log(req.body);
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Make sure he is not already registered
        let user = await User.findOne({ name: req.body.name });
        if (user) return res.status(400).send('User already registered.')

        user = new User(_.pick(req.body, ['name', 'password']));

        //Generating a salt to strengthen our password
        const salt = await bcrypt.genSalt(10);

        //Hashing the password
        user.password = await bcrypt.hash(user.password, salt);

        //Saving the user
        await user.save();

        //Generating the token
        const token = user.generateAuthToken();

        let objClient = _.pick(user, ['name', 'email']);
        console.log(user);

        //We send the token to the user in the header with some chosen details (objClient)
        res.header('x-auth-token', token).send(_.pick(objClient))

    } catch (error) {
        console.log(error);
    }
});

//Login
router.post('/signin', async (req, res) => {
    try {
        console.log("Server signin: ", req.body);
        const { error } = validateUser(req.body);
        if (error) console.log(error)
        if (error) return res.status(400).send(error.details[0].message);

        // Make sure he is already registered
        let user = await User.findOne({ name: req.body.name });
        if (!user) return res.status(400).send('Could not find that user');

        //This will compare
        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword)
            if (!validPassword) return res.status(400).send('Invalid email or password');

        let token = user.generateAuthToken();
        res.send(token);

    } catch (error) {
        console.log(error);
    }
});

//Login
router.post('/signout', async (req, res) => {
    try {
        console.log("Server sign-out: ", req.body);
        if (!req.body.name)
            return res.status(400).send('Could not sign you out!');

        // Make sure he is deleted
        let user = await User.findOne({ name: req.body.name });

        if (user) {
            await User.findOneAndDelete({ name: req.body.name })
            res.send("Successfully signed out");
        }
        else
            res.send("No such user!");

    } catch (error) {
        console.log(error);
    }
});

//Function to validate
function validateUser(req) {
    let schema = {
        name: Joi.string().min(1).max(50).required(),
        password: Joi.string().min(1).max(50).required()
    };
    return Joi.validate(req, schema);
}

module.exports = router;