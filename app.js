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
  var roomNum = '/';
  for (var i = 0; i < 6; i++) {
    var num = Math.round(Math.random() * 9);
    roomNum += num;
  }
  res.redirect(roomNum);
});

app.get('/:roomNum', function (req, res) {
  res.render('index.html');
});

var lookUpTable = {};
var playerReady = {};
// var lookUpTable = {
//   'someURL': ['socketID1', 'socketID2'],
//   'otherURL': ['socketID1', 'socketID2']
// };

io.on('connection', function (socket) {

  socket.emit('who are you');

  socket.on('i am', function (data) {
    //if (lookUpTable[data.url].length < 2) {
    if (lookUpTable[data.url] === undefined) {
      lookUpTable[data.url] = [];
      lookUpTable[data.url].push(socket.id);
    } else if (lookUpTable[data.url].length < 2) {
      lookUpTable[data.url].push(socket.id);
    }

  });

  socket.on("i'm ready", function (data) {

    if (playerReady[data.url] === undefined) {
      playerReady[data.url] = 0;
    }
    playerReady[data.url] ++;
    if (playerReady[data.url] === 2) {
      var info = initObstacles();
      console.log(io.sockets);
      for (var i = 0; i < 2; i++) {
        io.sockets.sockets[i].emit("Let's start!", info);
      }
    }
  });

  socket.on('typing code', function (data) {
    for (var i = 0; i < 2; i++) {
      if (lookUpTable[data.url][i] !== socket.id) {
        for (var j = 0; j < 2; j++) {
          if (io.sockets.sockets[j].id === lookUpTable[data.url][i]) {
            io.sockets.sockets[j].emit("code", data.data);
          }
        }
      }
    }
  });

  socket.on('disconnect', function () {
    // players--;
    // playerReady--;
    // if (playerReady <= 0) {
    //   playerReady = 0;
    //   playing = false;
    // }
    // console.log(playerReady);
  });

  // socket.on('x', function (data) {
  //   socket.broadcast.emit('x', data);
  //   //console.log('z' + data);
  // });
  // socket.on('y', function (data) {
  //   socket.broadcast.emit('y', data);
  //   //console.log('z' + data);
  // });
  // socket.on('z', function (data) {
  //   if (playing) {
  //     socket.broadcast.emit('z', data);
  //   }
  //   //console.log('z' + data);
  // });

  // socket.on('whole', function (data) {
  //   if (playing) {
  //     socket.broadcast.emit('whole', data);
  //   }
  //   //console.log('z' + data);
  // });

  // socket.on('result', function (data) {
  //   if (playing) {
  //     socket.broadcast.emit('result', data);
  //   }
  //   //console.log('z' + data);
  // });

});

function initObstacles() {
  var obsInfo = [];
  for (j = 0; j < 40; j++) {
    var x = -475 + Math.floor(Math.pow(Math.random(), 2) * 20) * 50;
    //var y = 25 * (j % 2 + 1);
    //var y = 25;
    var y;
    if (Math.random() > 0.7) {
      y = 25 + Math.floor(Math.random() * 6) * 50;
    } else if (Math.random() > 0.4) {
      y = 25;
    } else {
      y = 75;
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

  }

  return obsInfo;
}

server.listen(port);