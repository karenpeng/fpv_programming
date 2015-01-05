(function (exports) {
  //---------------------------------------------------------------
  //------------------------set up socket--------------------------
  //---------------------------------------------------------------
  var socket = io.connect('http://' + location.host);
  exports.socket = socket;

  socket.on('who are you', function () {

    // var myRe = /\d\d\d\d\d\d/;
    // var myRoomNum = document.location.href.match(myRe);
    // var myRoomNum = myRe.exec(document.location.href);

    //exports.myURL = myRoomNum[0];

    exports.myURL = document.location.pathname.slice(1);

    socket.emit('i am', {
      'url': exports.myURL,
      'data': true
    });

    socket.on("Let's start!", function (data) {
      startGame(data);
    });

  });

  //---------------------------------------------------------------
  //------------------------ start a game -------------------------
  //---------------------------------------------------------------

  exports.realGame = false;
  document.getElementById('skip').onclick = function () {
    waitingForReady();
  };

  //wait for everybody to click on the ready button
  function waitingForReady() {
    document.getElementById('blackout').style.display = "block";
    document.getElementById('ruready').style.display = "block";
    document.getElementById('instruction').style.display = "none";
    document.getElementById('editor2').style.display = "block";
    editor1.setValue("");
    consoleLog.setValue("");
  }
  exports.waitingForReady = waitingForReady;

  //start counting down and then game starts
  function startGame(data) {
    //document.getElementById('waiting').style.display = "block";
    document.getElementById('ruready').style.display = "none";
    document.getElementById('countDown').style.display = "block";
    setTimeout(function () {
      document.getElementById('countDown').innerHTML = "3";
    }, 600);
    setTimeout(function () {
      document.getElementById('countDown').innerHTML = "2";
    }, 1600);
    setTimeout(function () {
      document.getElementById('countDown').innerHTML = "1";
    }, 2600);
    setTimeout(function () {
      document.getElementById('countDown').innerHTML = "start";
    }, 3600);
    setTimeout(function () {
      document.getElementById('blackout').style.display = "none";
      document.getElementById('countDown').style.display = "none";
      exports.realGame = true;
      editor1.focus();
      document.getElementById('editor1').style.opacity = '0.9';
      document.getElementById('console').style.opacity = '0.9';
      document.getElementById('gap').style.opacity = '0.9';
      document.getElementById('timer1').style.display = "block";
      document.getElementById('timer2').style.display = "block";
      document.getElementById('bg').play();
      restart(data);
      socket.emit("i'm playing", {
        'url': exports.myURL,
        'data': true
      });
      clock1Run();
    }, 4600);
  }

  //click to start a game
  document.getElementById('ready1').onclick = function () {
    document.getElementById('ready1').style.display = "none";
    socket.emit("i'm ready", {
      'url': exports.myURL,
      'data': true
    });
  };

  document.getElementById('anotherRound').onclick = function () {
    socket.emit('reduce me', {
      'url': exports.myURL,
      'data': true
    });
    document.getElementById('giveURL').style.display = 'none';
    document.getElementById('result').style.display = 'none';
    waitingForReady();
  };

})(this);