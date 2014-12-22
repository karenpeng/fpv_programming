(function (exports) {
  //---------------------------------------------------------------
  //------------------------set up socket--------------------------
  //---------------------------------------------------------------
  var socket = io.connect('http://' + location.host);
  exports.socket = socket;

  socket.on('everybody is here', function () {
    console.log("i'm with you.( ˘ ³˘)♥");

    socket.on("Let's start!", function (data) {
      startGame(data);
    });

  });

  //---------------------------------------------------------------
  //------------------------ start a game -------------------------
  //---------------------------------------------------------------

  exports.realGame = false;

  document.getElementById('skip').onclick = waitingForReady;
  //this shouldn't be put here
  //
  function waitingForReady() {
    document.getElementById('blackout').style.display = "block";
    document.getElementById('ruready').style.display = "block";
    document.getElementById('instruction').style.display = "none";
    document.getElementById('editor2').style.display = "block";
    editor1.setValue("");
    consoleLog.setValue("");
  }
  exports.waitingForReady = waitingForReady;

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
      document.getElementById('timer1').style.display = "block";
      document.getElementById('timer2').style.display = "block";
      document.getElementById('bg').play();
      restart(data);
      clock1Run();
    }, 4600);
  }

  document.getElementById('ready1').onclick = function () {
    document.getElementById('ready1').style.display = "none";
    socket.emit("i'm ready");
  };

})(this);