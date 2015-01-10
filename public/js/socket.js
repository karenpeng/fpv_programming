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
    document.getElementById('blackout').style.visibility = "visible";
    document.getElementById('ruready').style.visibility = "visible";
    document.getElementById('instruction').style.visibility = "hidden";
    document.getElementById('editor2').style.visibility = "visible";
    editor1.setValue("");
    consoleLog.setValue("");
    document.getElementById('bg').pause();
    //document.getElementById('bgSource').setAttribute("src", "");
  }
  exports.waitingForReady = waitingForReady;

  //start counting down and then game starts
  function startGame(data) {
    //document.getElementById('waiting').style.visibility = "visible";
    document.getElementById('ruready').style.visibility = "hidden";
    document.getElementById('countDown').style.visibility = "visible";
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
      document.getElementById('blackout').style.visibility = "hidden";
      document.getElementById('countDown').style.visibility = "hidden";
      exports.realGame = true;
      editor1.focus();
      document.getElementById('editor1').style.opacity = '0.9';
      document.getElementById('console').style.opacity = '0.9';

      document.getElementById('gap').style.opacity = '0.9';
      document.getElementById('timer1').style.visibility = "visible";
      document.getElementById('timer2').style.visibility = "visible";
      clockStartOver();
      runTimes = 0;
      document.getElementById('timer3').innerHTML = '0';

      //document.getElementById('bgSource').setAttribute("src", "sound/ComeAndFindMe.wav");
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
    document.getElementById('ready1').style.visibility = "hidden";
    setTimeout(function () {
      socket.emit("i'm ready", {
        'url': exports.myURL,
        'data': true
      });
    }, 1000);
  };

  document.getElementById('anotherRound').onclick = function () {
    socket.emit('reduce me', {
      'url': exports.myURL,
      'data': true
    });
    document.getElementById('ready1').style.visibility = "visible";
    document.getElementById('giveURL').style.visibility = "hidden";
    document.getElementById('result').style.visibility = "hidden";
    waitingForReady();
  };

})(this);