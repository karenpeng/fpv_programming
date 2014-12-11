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

  function clock1Run() {
    document.getElementById('timer1').style.display = "block";
    document.getElementById('timer2').style.display = "block";
    var currentTime = new Date();
    startH = currentTime.getHours();
    startM = currentTime.getMinutes();
    startS = currentTime.getSeconds();
    clock1 = new MyClock(startH, startM, startS, "timer1");
    clock1.update();
    exports.clock1 = clock1;
  }

  function clock2Run() {
    if (document.getElementById('timer1').style.display === "block") {
      document.getElementById('timer2').style.display = "block";
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

  function tryAgain() {
    var currentTime = new Date();
    startH = currentTime.getHours();
    startM = currentTime.getMinutes();
    startS = currentTime.getSeconds();
    clock1.setStart(startH, startM, startS);
    clock1.isTicking = true;
    clock1.update();
    clock2.isTicking = false;
  }

  exports.clock1Run = clock1Run;
  exports.clock2Run = clock2Run;
  exports.tryAgain = tryAgain;

})(this);