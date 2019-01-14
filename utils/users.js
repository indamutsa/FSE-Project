class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, username, group_name) {
        var user = { id, username, group_name };
        this.users.push(user);

        return user;
    }

    removeUser(id) {
        var user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserList(group_name) {
        //This will filter the user in the same group_name from the whole list
        var users = this.users.filter((user) => user.group_name === group_name);

        //We again extract only the name  of these users in a given group_name
        var namesArray = users.map((user) => user.username);

        return namesArray;
    }
}

module.exports = { Users };