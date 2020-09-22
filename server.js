const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname,'public')));

const botName = 'ChatCord Bot';
//run when client connects
io.on('connection',socket =>{
    socket.on('joinRoom',({username,room})=>{
        //single client
        socket.emit('message',formatMessage(botName,'Welcome to chatCord'));

        //Broadcast when a user connects
        //all clients except for the connecting client
        socket.broadcast.emit('message',formatMessage(botName,'A user has joined the chat'));
    })
    
    //everyone
    //io.emit();

    //Runs when client disconnects
    socket.on('disconnect',()=>{
        io.emit('message',formatMessage(botName,'A user has left the chat'));
    });

    //Listen for chatMessage
    socket.on('chatMessage',(msg)=>{
        io.emit('message',formatMessage('User',msg));
    })

});

const PORT = process.env.PORT || 3000;

server.listen(PORT,()=> console.log(`Server start on port ${PORT}`));
