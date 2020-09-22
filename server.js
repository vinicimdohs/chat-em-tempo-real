const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname,'public')));


//run when client connects
io.on('connection',socket =>{
    //single client
    socket.emit('message','Welcome to chatCord');

    //Broadcast when a user connects
    //all clients except for the connecting client
    socket.broadcast.emit('message','A user has joined the chat');

    //everyone
    //io.emit();

    //Runs when client disconnects
    socket.on('disconnect',()=>{
        io.emit('message','A user has left the chat');
    });

    //Listen for chatMessage
    socket.on('chatMessage',(msg)=>{
        io.emit('message',msg);
    })

});

const PORT = process.env.PORT || 3000;

server.listen(PORT,()=> console.log(`Server start on port ${PORT}`));
