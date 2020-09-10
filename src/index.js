const http = require('http');
const path = require('path')
const express = require('express');
const socketio = require('socket.io');

const { addMessageToTime } = require('./utility/message');

const {
    addUser,
    removeUser,
    getUser,
    getRoomUser
} = require('./utility/user');
const { callbackify } = require('util');

const app = express()
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3000;



const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {


    //room chat
    socket.on('join', (option, callback) => {
        let { user, error } = addUser({ id: socket.id, ...option })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('server msg', addMessageToTime('Admin', `Hello ${user.username} welcome to chat room`));
        socket.broadcast.to(user.room).emit('server msg', addMessageToTime('Admin', `Recently ${user.username} has join to this chat room`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getRoomUser(user.room)
        })
        callback()
    })
    socket.on('client msg', (msg, callback) => {
            let user = getUser(socket.id);
            if (user) {
                io.to(user.room).emit('server msg', addMessageToTime(user.username, msg))
            }
            callback()
        })
        //location
    socket.on('sendLocation', (msg, callback) => {
        let user = getUser(socket.id);
        if (user) {

            io.emit('Locationurl', addMessageToTime(user.username, `http://google.com/maps?q=${msg.latitude},${msg.longitude}`))
        }
        callback()
    })

    //leave user
    socket.on('disconnect', () => {
        let user = removeUser(socket.id)
            // room chat user list

        if (user) {
            io.to(user.room).emit('server msg', addMessageToTime('Admin', `${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getRoomUser(user.room)
            })
        }
    })


});


server.listen(PORT, () => console.log('port connected successfully', PORT))