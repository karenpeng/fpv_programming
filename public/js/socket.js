(function (exports) {
  //---------------------------------------------------------------
  //------------------------set up socket--------------------------
  //---------------------------------------------------------------
  exports.weRtogether = false;
  exports.socket = io.connect('http://' + location.host);

  socket.on('everybody is here', function () {
    console.log("i'm with you.( ˘ ³˘)♥");
    exports.weRtogether = true;

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
    }, 1000);
    setTimeout(function () {
      document.getElementById('countDown').innerHTML = "2";
    }, 3000);
    setTimeout(function () {
      document.getElementById('countDown').innerHTML = "1";
    }, 5000);
    setTimeout(function () {
      document.getElementById('countDown').innerHTML = "start";
    }, 7000);
    setTimeout(function () {
      document.getElementById('blackout').style.display = "none";
      document.getElementById('countDown').style.display = "none";
      exports.realGame = true;
      document.getElementById('timer1').style.display = "block";
      document.getElementById('timer2').style.display = "block";
      document.getElementById('bg').play();
      restart(data);
      clock1Run();
    }, 9000);
  }

  document.getElementById('ready1').onclick = function () {
    document.getElementById('ready1').style.display = "none";
    socket.emit("i'm ready");
  };

})(this);