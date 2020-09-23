const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname,'public')));

const botName = 'ChatCord Bot';
//run when client connects
io.on('connection',socket =>{
    socket.on('joinRoom',({username,room})=>{
        const user = userJoin(socket.id,username,room);

        socket.join(user.room);

        //single client
        socket.emit('message',formatMessage(botName,'Welcome to chatCord'));

        //Broadcast when a user connects
        //all clients except for the connecting client
        socket.broadcast.
        to(user.room)
        .emit('message',formatMessage(botName,`${user.username} has joined the chat`));

        //Send users and room info
        io.to(user.room).emit('roomUsers',{
        room:user.room,
        users: getRoomUsers(user.room)
    })
    })

    //everyone
    //io.emit();

    //Runs when client disconnects
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
        }

        //Send users and room info
    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users: getRoomUsers(user.room)
    })

        
    });

    //Listen for chatMessage
    socket.on('chatMessage',(msg)=>{
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message',formatMessage(user.username,msg));
    })

});

const PORT = process.env.PORT || 3000;

server.listen(PORT,()=> console.log(`Server start on port ${PORT}`));
