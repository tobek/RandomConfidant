/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , path = require('path')
  , io = require('socket.io')
  , jade = require('jade')
  , sanitize = require('validator').sanitize;


var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

io.set('log level', 1); // reduce logging
io.sockets.on('connection', function (socket) {
  socket.on('submit', function (data, fn) {
    var msg = sanitize(data.message).xss();
    console.log("received message: " + msg);
    socket.broadcast.emit('received', { message: msg }); // tell everyone
    fn(); // tell the client there was no error
  });
});

server.listen(app.get('port'), function(){
  console.log('Listening on port ' + app.get('port'));
});