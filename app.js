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
  // var a = Math.round(Math.random() * 25) + 97;
  // var b = Math.round(Math.random() * 25) + 97;
  // var c = Math.round(Math.random() * 25) + 97;
  // var d = Math.round(Math.random() * 25) + 97;
  // roomNum += String.fromCharCode(a, b, c, d);
  for (var i = 0; i < 4; i++) {
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
var gameTime = {};
var playing = {};
var refreshIntervalId = {};

io.on('connection', function (socket) {

  var info = require('./serverJs/init.js').initTargetandObstacles();
  socket.emit('init', info);

  socket.emit('who are you');

  socket.on('i am', function (data) {

    //console.log(data.url);

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

    if (socketIsInLookUpTable(data.url, socket.id)) {

      //console.log(isNaN(playerReady[data.url]));
      //why...NAN????
      if (isNaN(playerReady[data.url])) {
        playerReady[data.url] = 0;
      }
      playerReady[data.url] ++;

      console.log("player ready " + playerReady[data.url]);

      if (playerReady[data.url] === 2) {

        var info = require('./serverJs/init.js').initTargetandObstacles();

        sendDataToPair(data.url, "Let's start!", info);
        //io.to(data.url).emit("Let's start!", info);
      }

    }
  });

  socket.on("i'm playing", function (data) {

    if (socketIsInLookUpTable(data.url, socket.id)) {

      if (isNaN(playing[data.url])) {
        playing[data.url] = 0;
      }
      playing[data.url] ++;

      console.log("playing " + playing[data.url]);

      if (playing[data.url] === 2) {
        moveTargetEvery30Secends(data.url);
      }

    }
  });

  socket.on('disconnect', function () {
    // console.log('wow');
    for (var url in lookUpTable) {
      for (var i = 0; i < lookUpTable[url].length; i++) {
        if (lookUpTable[url][i] === socket.id) {
          if (playerReady[url] > 0) playerReady[url] --;
          if (playing[url] > 0) playing[url] --;
          lookUpTable[url].splice(i, 1);

          if (lookUpTable[url].length === 0) {
            delete lookUpTable[url];
            delete playerReady[url];
            delete playing[url];
          }
          break;
        }
      }
    }

  });

  function socketIsInLookUpTable(url, id) {
    for (var i = 0; i < lookUpTable[url].length; i++) {
      if (lookUpTable[url][i] === id) {
        return true;
      }
    }
    return false;
  }

  function sendDataToPair(url, msg, data) {
    var id1 = lookUpTable[url][0];
    var id2 = lookUpTable[url][1];
    for (var j = 0; j < io.sockets.sockets.length; j++) {
      if (io.sockets.sockets[j].id === id1 || io.sockets.sockets[j].id === id2) {
        io.sockets.sockets[j].emit(msg, data);
      }
    }
  }

  function moveTargetEvery30Secends(url) {
    var choices = ['d', 'l', 'f', 'r', 'b', 'u'];
    if (isNaN(refreshIntervalId[url])) {
      refreshIntervalId[url] = setInterval(function () {
        var steps = Math.round(Math.random() * 2) + 1;
        var instructions = [];
        for (var i = 0; i < steps; i++) {
          instructions.push(choices[Math.round(Math.random() * 5)]);
        }
        sendDataToPair(url, 'moveTarget', instructions);

        // now i know i can't send function via socket
        // sendDataToPair(url, 'test', foo);

      }, 30000);
    }
  }

  // function foo() {
  //   console.log('empty');
  // }

  function sendDataToYourPartner(data, msg) {
    var partnerId;
    for (var i = 0; i < 2; i++) {
      //find the partner id of the this socket user
      if (lookUpTable[data.url][i] !== socket.id) {
        partnerId = lookUpTable[data.url][i];
        break;
      }
    }
    // find the partner's socket index inside all the sockets
    for (var j = 0; j < io.sockets.sockets.length; j++) {

      if (io.sockets.sockets[j].id === partnerId) {
        io.sockets.sockets[j].emit(msg, data.data);
        break;
      }
    }
  }

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

  socket.on('result', function (data) {
    sendDataToYourPartner(data, 'result');
    clearInterval(refreshIntervalId[data.url]);
  });

  socket.on('reduce me', function (data) {
    if (socketIsInLookUpTable(data.url, socket.id)) {
      if (playerReady[data.url] > 0) playerReady[data.url] --;
      if (playing[data.url] > 0) playing[data.url] --;
      console.log('reduce ' + playerReady[data.url] + playing[data.url]);
    }
  });

});

server.listen(port);