const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3333;

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');

app.use(cors());
app.use(router);

// Register clients joining and leaving chat room
io.on('connection', (socket) => {
  console.log('new connection! ');

  socket.on('join', ({ name, room }, callback) => {
    console.log('name', name);
    console.log('room', room);
    console.log('id', socket.id);

    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    // Join user in a given room
    socket.join(user.room);

    // Send welcome message to the client
    socket.emit('message', { user: '', text: `${user.name}, Welcome to room ${user.room}.`});

    // Sends message to everyone in room except that user
    socket.broadcast.to(user.room).emit('message', { user: '', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  // user generated messages
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  // Client leaves room
  socket.on('disconnect', () => {
    let id = socket.id
    const user = removeUser(id);

    if(user) {
      io.to(user.room).emit('message', { user: '', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

server.listen(PORT, () => console.log(`Server has started on http://localhost:${PORT}`));