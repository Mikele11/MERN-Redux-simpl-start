var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var post = require('./routes/post');
var auth = require('./routes/auth');
var app = express();

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
//mongodb://localhost/mern-b
const MongoClient = require('mongodb').MongoClient;
mongoose.connect('mongodb://Mikele11:face112358@ds255262.mlab.com:55262/mern-redux', { promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/post', post);
app.use('/api/auth', auth);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

//module.exports = app;
var debug = require('debug')('mean-app:server');
var http = require('http');

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {

    return val;
  }

  if (port >= 0) {

    return port;
  }

  return false;
}
var server = http.createServer(app);

server.listen(port);