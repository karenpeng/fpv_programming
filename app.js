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
      var info = initObstacles();
      socket.emit("Let's start!", info);
      socket.broadcast.emit("Let's start!", info);
    }
  });

  socket.on('typing code', function (data) {
    socket.broadcast.emit('code', data);
  });

  socket.on('disconnect', function () {
    players--;
    if (playerReady < 0) {
      playerReady = 0;
    }
    //console.log(playerReady);
  });

  socket.on('x', function (data) {
    socket.broadcast.emit('x', data);
    //console.log('z' + data);
  });
  socket.on('y', function (data) {
    socket.broadcast.emit('y', data);
    //console.log('z' + data);
  });
  socket.on('z', function (data) {
    socket.broadcast.emit('z', data);
    //console.log('z' + data);
  });

  socket.on('whole', function (data) {
    socket.broadcast.emit('whole', data);
    //console.log('z' + data);
  });

});

function initObstacles() {
  var obsInfo = [];
  for (j = 0; j < 20; j++) {
    var x = -475 + Math.floor(Math.pow(Math.random(), 2) * 20) * 50;
    //var y = 25 * (j % 2 + 1);
    //var y = 25;
    var y;
    if (Math.random() > 0.7) {
      y = 25 + Math.floor(Math.random() * 6) * 50;
    } else {
      y = 25;
    }
    var z = -475 + Math.floor(Math.pow(Math.random(), 2) * 20) * 50;

    if (x === -475 && z === -475 && y < 150) {} else {
      if (x === -475 && y === 25 & z === 475) {} else {
        obsInfo.push({
          "x": x,
          "y": y,
          "z": z
        });
      }
    }

    if (Math.random() > 0.5) {
      obsInfo.push({
        "x": x,
        "y": 75,
        "z": z
      });
    }

  }

  return obsInfo;
}

server.listen(port);