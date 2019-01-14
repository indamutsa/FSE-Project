//Importing mongoose for the database
const mongoose = require('mongoose');

module.exports = function () {
    const db = 'mongodb://localhost/chatapp';
    mongoose.connect(db, { useNewUrlParser: true })
        .then(() => console.log(`Connected to ${db}...`));
}