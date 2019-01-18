const express = require('express'); //we are calling it as module now
const bodyParser = require('body-parser');
const users = require('../route/userAuthentication');


module.exports = function (app) {

    //Middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.use('/', users);
}