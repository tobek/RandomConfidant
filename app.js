/**
 * Module dependencies.
 */

var express = require('express')
  , controllers = require('./controllers')
  , path = require('path')
  , io = require('socket.io')
  , jade = require('jade')
  , clientSessions = require("client-sessions")
  , sanitize = require('validator').sanitize;

var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(clientSessions({
  secret: 'YFoay9o1VKJkR17mTvnpyGajleuhLwlzuTeoiFUG', // random string
  cookieName: "sesh",
  duration: 7 * 24 * 60 * 60 * 1000 // 1 week. how long the session will stay valid in ms
  // TODO check/ensure this gets renewed every time you visit
  // TODO accommodate "don't remember me" setting
}));
app.use(app.router); // has to come after clientSessions

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

io.set('log level', 1); // reduce logging
io.sockets.on('connection', function (socket) {
  socket.on('submit', function (data, fn) {
    var msg = sanitize(data.message).xss();
    console.log("received message: " + msg);
    socket.broadcast.emit('received', { message: msg }); // tell everyone
    fn(); // tell the client there was no error
  });
});

app.get('/', controllers.index);
app.get('/login', controllers.login);
app.get('/logout', controllers.logout);

server.listen(app.get('port'), function(){
  console.log('Listening on port ' + app.get('port'));
});


/*

app.use(function(req, res, next) {
  if (req.session.seenyou) {
    console.log("header set");
    res.setHeader('X-Seen-You', 'true');
  } else {
    console.log("setting header");
    // setting a property will automatically cause a Set-Cookie response to be sent
    req.session.seenyou = true;
    res.setHeader('X-Seen-You', 'false');
    console.log("set the header");
  }
});
*/