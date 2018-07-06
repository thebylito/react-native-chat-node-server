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

//if (process.env.ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
//} // so assim pra fucionar no heroku

const server = app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
  io.attach(server);
});

io.on('connection', (socket) => {
  socket.on('subscribe', (room) => {
    console.log('joining room', room);
    socket.join(room);
  });

  socket.on('unsubscribe', (room) => {
    console.log('leaving room', room);
    socket.leave(room);
  });
});

module.exports = app; // for testing
