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
io.on('connection', function (socket) {
  socket.on('event', function (data) {});
  socket.on('disconnect', function () {});
});

server.listen(port);