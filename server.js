const express = require('express');

const http = require('http');

require('express-async-errors');

//Server side socket
const socketIO = require('socket.io');

const { message } = require('./utils/message');
const validateStr = require('./utils/validation');
const { Users } = require('./utils/users');

const mongo = require('./startup/db');

const port = process.env.PORT || 4600;
const app = express();
mongo();

const server = http.createServer(app);

var io = socketIO(server);

users = new Users();


io.on('connect', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        console.log(params.username, params.group_name);

        if (!validateStr(params.username) && !validateStr(params.group_name)) {
            return callback('Username and group name are required');
        }

        socket.join(params.group_name);

        //We make sure he joins only one room, so the previous joint is erased
        users.removeUser(socket.io);

        users.addUser(socket.id, params.username, params.group_name);
        io.to(params.group_name).emit('updateUserList', users.getUserList(params.group_name));

        socket.broadcast.to(params.group_name).emit('newMessage', message("Server", `${params.username} has joined`));
        callback();
    });

    socket.on('leave', (params, callback) => {
        if (!validateStr(params.username) && !validateStr(params.group_name)) {
            return callback('Username and group name are required');
        }

        //The user can leave a room
        socket.leave(params.group_name);

        //We make sure he joins only one room, so the previous joint is erased
        users.removeUser(socket.io);

        io.to(params.group_name).emit('updateUserList', users.getUserList(params.group_name));

        socket.broadcast.to(params.group_name).emit('newMessage', message("Server", `${params.username} has joined`));

        callback();
    });

    //This callback is the client passed in function
    socket.on('createMessage', (IncomingMessage, callback) => {
        console.log('createMessage event from client: ', IncomingMessage);

        var user = users.getUser(socket.id);

        console.log(user.username + "--------------");

        if (user && validateStr(IncomingMessage.text)) {
            //The second scenario, is when you broadcast a message but not to you
            io.to(user.group_name).emit('newMessage', message(user.username, IncomingMessage.text));
        }
        callback();
    });


    socket.on('disconnect', () => {
        console.log('User disconnected');

        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.group_name).emit('updateUserList', users.getUserList(user.group_name));
            io.to(user.group_name).emit('newMessage', message('Server', `${user.username} has left `));
        }
    });
});

//Middleware
app.use(express.static('public'));

server.listen(port, console.log(`App listening on port ${port}`));
