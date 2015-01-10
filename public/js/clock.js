(function (exports) {

  function MyClock(_h, _m, _s, _id) {
    this.startH = _h;
    this.startM = _m;
    this.startS = _s;
    this.recordH = 0;
    this.recordM = 0;
    this.recordS = 0;
    this.selector = document.getElementById(_id);
    //console.log(this.selector);
    this.isTicking = true;
  }

  MyClock.prototype.setStart = function (_h, _m, _s) {
    this.startH = _h;
    this.startM = _m;
    this.startS = _s;
  };

  MyClock.prototype.update = function () {
    var s, m, h;
    // console.log(that)

    var currentTime = new Date();
    var currentHours = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();
    var currentSeconds = currentTime.getSeconds();

    s = currentSeconds - this.startS + this.recordS;

    if (s < 0) {
      s += 60;
      currentMinutes--;
    }
    if (s < 10) {
      s = "0" + s;
    }

    m = currentMinutes - this.startM + this.recordM;

    if (m < 0) {
      m += 60;
      currentHours--;
    }
    if (m < 10) {
      m = "0" + m;
    }

    h = currentHours - this.startH + this.recordH;

    if (h < 10) {
      h = "0" + h;
    }
    this.selector.innerHTML = h + ":" + m + ":" + s;

    //Weird requestAnimationFrame Scope problem!!!
    if (this.isTicking) {
      var that = this;
      requestAnimationFrame(function () {
        that.update();
      });
    } else {
      //if the clock is not ticking anymore,
      //just record the time and then stop the clock
      this.recordS = parseInt(s);
      this.recordM = parseInt(m);
      this.recordH = parseInt(h);
      return;
    }
  };

  //-----------------------------------------------------------------
  //---------------------  set up clock logic   ---------------------
  //-----------------------------------------------------------------

  var clock1, clock2;

  //make the clock counting coding time run
  function clock1Run() {
    document.getElementById('timer1').style.visibility = "visible";
    document.getElementById('timer2').style.visibility = "visible";
    document.getElementById('timer3').style.visibility = "visible";
    document.getElementById('timer1').style.color = "#dd2222";
    document.getElementById('timer2').style.color = "#bcbcbc";
    var currentTime = new Date();
    startH = currentTime.getHours();
    startM = currentTime.getMinutes();
    startS = currentTime.getSeconds();
    clock1 = new MyClock(startH, startM, startS, "timer1");
    clock1.update();
    exports.clock1 = clock1;
  }

  //make the clock counting running time run
  function clock2Run() {
    if (document.getElementById('timer1').style.display === "block") {
      document.getElementById('timer2').style.visibility = "visible";
      document.getElementById('timer1').style.color = "#bcbcbc";
      document.getElementById('timer2').style.color = "#dd2222";

      clock1.isTicking = false;
      var currentTime = new Date();
      startH = currentTime.getHours();
      startM = currentTime.getMinutes();
      startS = currentTime.getSeconds();
      if (clock2 === undefined) {
        clock2 = new MyClock(startH, startM, startS, "timer2");
      } else {
        clock2.setStart(startH, startM, startS);
        clock2.isTicking = true;
      }
      clock2.update();
      exports.clock2 = clock2;
    }
  }

  //both clocks stop
  function bothStop() {
    clock1.isTicking = false;
    clock2.isTicking = false;
    document.getElementById('timer1').style.color = "#bcbcbc";
    document.getElementById('timer2').style.color = "#bcbcbc";
  }

  //start over
  function clockStartOver() {
    if (clock1) {
      clock1.startH = 0;
      clock1.startM = 0;
      clock1.startS = 0;
      clock1.recordH = 0;
      clock1.recordM = 0;
      clock1.recordS = 0;
      clock1.isTicking = false;
      clock1 = null;
    }
    if (clock2) {
      clock2.startH = 0;
      clock2.startM = 0;
      clock2.startS = 0;
      clock2.recordH = 0;
      clock2.recordM = 0;
      clock2.recordS = 0;
      clock2.isTicking = false;
      clock2 = null;
    }
    document.getElementById('timer1').innerHTML = '00:00:00';
    document.getElementById('timer2').innerHTML = '00:00:00';
  }

  //make the runing clock stop, coding clock run
  function tryAgain() {
    var currentTime = new Date();
    startH = currentTime.getHours();
    startM = currentTime.getMinutes();
    startS = currentTime.getSeconds();
    clock1.setStart(startH, startM, startS);
    clock1.isTicking = true;
    clock1.update();
    clock2.isTicking = false;
    document.getElementById('timer1').style.color = "#dd2222";
    document.getElementById('timer2').style.color = "#bcbcbc";
  }

  exports.clock1Run = clock1Run;
  exports.clock2Run = clock2Run;
  exports.tryAgain = tryAgain;
  exports.bothStop = bothStop;
  exports.clockStartOver = clockStartOver;

})(this);