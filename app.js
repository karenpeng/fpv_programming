var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 4000;

var ejs = require('ejs');

app.set('views', __dirname);

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
// the format of lookUpTable will be:
// var lookUpTable = {
//   'someURL': ['socketID1', 'socketID2'],
//   'otherURL': ['socketID1', 'socketID2']
// };
var playerReady = {};

io.on('connection', function (socket) {

  socket.emit('who are you');

  socket.on('i am', function (data) {

    //socket.join(data.url);
    if (lookUpTable[data.url] === undefined) {
      lookUpTable[data.url] = [];
      lookUpTable[data.url].push(socket.id);
    } else if (lookUpTable[data.url].length < 2) {
      lookUpTable[data.url].push(socket.id);
    }

    console.log('adding ' + lookUpTable[data.url].length);

  });

  socket.on("i'm ready", function (data) {
    //console.log(isNaN(playerReady[data.url]));
    //why...NAN????
    if (isNaN(playerReady[data.url])) {
      playerReady[data.url] = 0;
      console.log("ouch");
    }
    playerReady[data.url] ++;
    console.log(playerReady[data.url]);
    if (playerReady[data.url] === 2) {
      var info = initObstacles();
      // console.log(io.sockets);
      for (var i = 0; i < 2; i++) {
        var id = lookUpTable[data.url][i];
        for (var j = 0; j < io.sockets.sockets.length; j++) {

          if (io.sockets.sockets[j].id === id) {
            io.sockets.sockets[j].emit("Let's start!", info);
          }
        }
      }
      //io.to(data.url).emit("Let's start!", info);
    }
  });

  function sendDataToYourPartner(data, msg) {
    for (var i = 0; i < 2; i++) {
      //find the partner id of the this socket user
      if (lookUpTable[data.url][i] !== socket.id) {

        // find the partner's socket index inside all the sockets
        for (var j = 0; j < io.sockets.sockets.length; j++) {

          if (io.sockets.sockets[j].id === lookUpTable[data.url][i]) {
            io.sockets.sockets[j].emit(msg, data.data);
          }
        }
      }
    }
  }

  socket.on('disconnect', function () {
    // console.log('wow');
    for (var url in lookUpTable) {
      for (var i = 0; i < lookUpTable[url].length; i++) {
        if (lookUpTable[url][i] === socket.id) {
          playerReady[url] --;
          lookUpTable[url].splice(i, 1);
        }
      }
    }

  });

  socket.on('typing code', function (data) {
    sendDataToYourPartner(data, 'code');
  });

  socket.on('x', function (data) {
    sendDataToYourPartner(data, 'x');
  });

  socket.on('y', function (data) {
    sendDataToYourPartner(data, 'y');
  });

  socket.on('z', function (data) {
    sendDataToYourPartner(data, 'z');
  });

  socket.on('whole', function (data) {
    sendDataToYourPartner(data, 'whole');
  });

  socket.on('result', function (data) {
    sendDataToYourPartner(data, 'result');
  });

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