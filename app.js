var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 4000;

var ejs = require('ejs');

app.set("views", __dirname);

app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index.html');
});

//how can i set url?
var players = 0;
var playerReady = 0;
//var ids = [];
io.on('connection', function (socket) {
  players++;
  //ids.push(socket.id);
  if (players === 2) {
    console.log("they're together.( ˘ ³˘)♥");
    socket.emit('everybody is here');
    socket.broadcast.emit('everybody is here');
  }

  socket.on("i'm ready", function () {
    playerReady++;
    console.log(playerReady);
    if (playerReady === 2) {
      socket.emit("Let's start!");
      socket.broadcast.emit("Let's start!");
    }
  });

  socket.on('typing code', function (data) {
    socket.broadcast.emit('code', data);
  });
  socket.on('disconnect', function () {
    players--;
  });
});

server.listen(port);