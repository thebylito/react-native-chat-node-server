const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cors = require('cors');
const io = require('socket.io')();

app.set('port', process.env.PORT || 3001);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use((req, res, next) => {
  req.io = io;
  next();
});

require('./src/app/controllers/index')(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

const server = app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
  io.attach(server);
});

let clients = {};

io.on('connection', (socket) => {
  socket.on('join', (name) => {
    console.log('Joined: ' + name);
    clients[socket.id] = name;
   socket.emit('update', 'You have connected to the server.');
   socket.broadcast.emit('update', name + ' has joined the server.');
  });

  socket.on('message', (msg) => {
    console.log('Message: ' + msg);
   socket.broadcast.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Disconnect');
    io.emit('update', clients[socket.id] + ' has left the server.');
    delete clients[socket.id];
  });
});

module.exports = app; // for testing
