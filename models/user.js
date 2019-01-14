const mongoose = require('mongoose');
require('mongoose-unique-validator');
const Joi = require('joi');

//Create a schema
const userSChema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    group_name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    time: {
        type: String
    }
});

//Function to validate
function validateUser(user) {
    let schema = {
        name: Joi.string().min(1).max(50).required(),
        group_name: Joi.string().min(1).max(50).required()
    };

    return Joi.validate(user, schema);
}

//The model
const User = mongoose.model('User', userSChema);

exports.User = User;
exports.validate = validateUser;