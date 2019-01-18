const { message } = require('../utils/message');
const validateStr = require('../utils/validation');

const {
    addUser,
    removeUser,
    getUserList, getUser } = require('../utils/userOperations');


module.exports = function (io) {

    io.on('connect', (socket) => {
        console.log('New user connected');

        socket.on('join', (params, callback) => {
            console.log(params.username, params.group_name);

            if (!validateStr(params.username) && !validateStr(params.group_name)) {
                return callback('Username and group name are required');
            }

            socket.join(params.group_name);

            //We make sure he joins only one room, so the previous joint is erased
            removeUser(socket.io);

            addUser(socket.id, params.username, params.group_name);

            io.to(params.group_name).emit('updateUserList', getUserList(params.group_name));

            socket.broadcast.to(params.group_name).emit('newMessage', message("", `${params.username} has joined`));

            callback();
        });

        socket.on('leave', (params, callback) => {
            if (!validateStr(params.username) && !validateStr(params.group_name)) {
                return callback('Username and group name are required');
            }

            //The user can leave a room
            socket.leave(params.group_name);

            //We make sure he joins only one room, so the previous joint is erased
            removeUser(socket.id);

            io.to(params.group_name).emit('updateUserList', getUserList(params.group_name));

            socket.broadcast.to(params.group_name).emit('newMessage', message("", `${params.username} has left`));

            callback();
        });

        //This callback is the client passed in function
        socket.on('createMessage', (IncomingMessage, callback) => {
            console.log('createMessage event from client: ', IncomingMessage);

            var user = getUser(socket.id);

            if (user && validateStr(IncomingMessage.text)) {
                //The second scenario, is when you broadcast a message but not to you
                io.to(user.group).emit('newMessage', message(user.name, IncomingMessage.text));
            }
            callback();
        });

        socket.on("typing", (data) => {
            var user = getUser(socket.id);
            io.to(user.group).emit('typing', data);
        });



        socket.on('disconnect', () => {
            console.log('User disconnected');

            var user = removeUser(socket.id);

            if (user) {
                io.to(user.group).emit('updateUserList', getUserList(user.group));
                io.to(user.group).emit('newMessage', message('', `${user.name} has left `));
            }
        });
    });
}