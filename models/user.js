const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },

    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ name: this.name }, 'mysecretkey');
    return token;
}
//The model
const User = mongoose.model('UsersLogin', userSchema);

//Function to validate
function validateUser(user) {
    let schema = {
        name: Joi.string().min(1).max(50).required(),
        password: Joi.string().min(1).max(50).required()
    };
    return Joi.validate(user, schema);
}


exports.User = User;
exports.validate = validateUser;