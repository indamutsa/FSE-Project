//External modules
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

//Internal modules
const chatService = require('./chat-sevice/chat-service');
const startup = require('./startup/routes');
const mongo = require('./startup/db');

//Variables
const app = express();
const port = process.env.PORT || 4600;
const server = http.createServer(app);
var io = socketIO(server);

//Functiions
mongo();
startup(app);
chatService(io);

//Listening to the server
server.listen(port, console.log(`App listening on port ${port}`));
