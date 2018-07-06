const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.set('port', process.env.PORT || 3001);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Express only serves static assets in production
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./../client/build'));
  //app.use(express.static(__dirname, '../client', 'build'));
}

require('./app/controllers/index')(app);

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
