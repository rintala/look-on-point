const express = require('express');
const app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);

const port = 3000

app.get('/', (req, res) => res.send('Hello Worldd!'))

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  //socket.emit('news', { hello: 'world' });
  socket.on('comment-channel', function (data) {
    console.log("WOO. ", data);
    socket.broadcast.emit('comment-channel', data);
  });
});