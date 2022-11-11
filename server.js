const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { joinRoom, getUsersInRoom, getRoom, removeUser, startRoom, roomStarted } = require('./utils/rooms');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, 'client/dist');

app.use(express.static(publicDirectoryPath));

io.on('connection', socket => {
  console.log('New WebSocket connection');

  socket.on('join', ({ username }) => {
    console.log(username, ':', socket.id )
    joinRoom(socket.id, username);

    socket.join(getRoom(socket.id));

    io.to(getRoom(socket.id)).emit('roomData', {
      users: getUsersInRoom(getRoom(socket.id)),
      started: roomStarted(getRoom(socket.id))
    });
  });

  socket.on('time', data => {
    io.to(getRoom(socket.id)).emit('time', data)
  });

  socket.on('startGame', () => {
    io.to(getRoom(socket.id)).emit('startGame');
    startRoom(socket.id);
  });

  socket.on('roundData', data => {
    io.to(getRoom(socket.id)).emit('roundData', data);
  });

  socket.on('gameData', data => {
    io.to(getRoom(socket.id)).emit('gameData', data);
  });

  socket.on('gameOver', () => {
    io.to(getRoom(socket.id)).emit('gameOver');
  });

  socket.on('disconnect', reason => {
    console.log(socket.id, 'left:', reason);
    let room = getRoom(socket.id)
    const user = removeUser(socket.id);
    if (typeof user !== 'undefined' && user !== -1) {
      io.to(room).emit('roomData', {
        users: getUsersInRoom(room),
        started: roomStarted(room),
        user
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
