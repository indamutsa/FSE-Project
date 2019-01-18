const { User, validate } = require('../models/userdata');

require('express-async-errors');
let users = [];


let addUser = function (id, name, group) {

    try {
        let user = { id, name, group };

        if (id && name && group) {
            users.push(user);
            dbSync(users);
        }

        return users;
    } catch (error) {
        console.log(error);
    }
}

let removeUser = function (id) {
    let user = getUser(id);

    if (user) {
        users = users.filter((user) => user.id !== id);
        console.log("User==> : " + JSON.stringify(users));
        dbSync(users);
    }

    return user;
}

let getUser = function (id) {

    if (users.length > 0)
        return users.filter((user) => user.id === id)[0];
}

let getUserList = function (group) {

    if (users.length > 0) {
        let data = users.filter((user) => user.group === group);

        // We again extract only the name  of these users in a given group
        let namesArray = data.map((user) => user.name);
        return namesArray;
    }
}


var dbSync = async function (users) {


    try {
        await User.deleteMany();

        if (users)
            users.forEach(async (newUser) => {

                const { error } = validate({
                    name: newUser.name,
                    group: newUser.group
                });

                if (error) {
                    console.log("Problem saving the user: " + error);
                    return;
                }

                let user = new User({
                    id: newUser.id,
                    name: newUser.name,
                    group: newUser.group,
                    time: newUser.time
                });

                s = await User.find({ name: newUser.name, group: newUser.group });

                if (s.length === 0) {
                    await user.save();
                }
            });

        var dbData = await User.find();
        return dbData;

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addUser,
    removeUser,
    getUserList, getUser, dbSync
};
