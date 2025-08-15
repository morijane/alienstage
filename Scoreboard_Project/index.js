
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('updateScore', (data) => {
    io.emit('scoreUpdate', data);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
