(function (exports) {
  //---------------------------------------------------------------
  //------------------------set up socket--------------------------
  //---------------------------------------------------------------
  exports.weRtogether = false;
  exports.socket = io.connect('http://localhost');

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
  }
  exports.waitingForReady = waitingForReady;

  function startGame(data) {
    //document.getElementById('waiting').style.display = "block";
    document.getElementById('blackout').style.display = "none";
    document.getElementById('ruready').style.display = "none";
    exports.realGame = true;
    restart(data);
    clock1Run();
  }

  document.getElementById('ready1').onclick = function () {
    document.getElementById('ready1').style.display = "none";
    socket.emit("i'm ready");
  };

})(this);