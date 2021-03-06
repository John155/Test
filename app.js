var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var database = require('./routes/database.js');

var app = express();


//Userverwaltung
var morgan = require('morgan');
var usersmysql = require('mysql');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
//var userconfig = require('./database.js'); // get our config file
//var User   = require('./app/models/user'); // get our mysql model

app.set('superSecret', database.secret);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.use(express.static(__dirname + '/public'));
app.use('/views',  express.static(__dirname + '/public/views'));

app.use(express.static(__dirname + '/public'));
app.use('/stylesheets',  express.static(__dirname + '/public/stylesheets'));


var fs = require('fs');

var key = fs.readFileSync('encryption/private.key');
var cert = fs.readFileSync( 'encryption/example.crt');

var options = {
    key: key,
    cert: cert
};
var https = require('https');
https.createServer(options, app).listen(443 ,function () {
    console.log("https worked");
});



var forceSsl = require('express-force-ssl');
app.use(forceSsl);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/*
var port = 3000;
app.listen(port, function () {
    console.log('app listening on port ' +port);
});
*/
module.exports = app;




