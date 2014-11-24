(function (exports) {
  var canvas = document.getElementsByTagName("CANVAS")[0];
  canvas.style.cursor = "url('img/drag.png'), default";

  var next = document.getElementById('next');
  var content = document.getElementById('content');
  var processBar = document.getElementById('processBar');
  var question = document.getElementById('question');
  var start = document.getElementById('start');
  var timer1 = document.getElementById('timer1');
  var run = document.getElementById('run');
  var level = 0;
  var clock1, clock2;

  //----------------------------------------------------------------
  //---------------------  set up clock logic   ---------------------
  //-----------------------------------------------------------------

  function MyClock(_h, _m, _s, _id) {
    this.startH = _h;
    this.startM = _m;
    this.startS = _s;
    this.recordH = _h;
    this.recordM = _m;
    this.recordS = _s;
    this.selector = document.getElementById(_id);
    //console.log(this.selector);
    this.isTicking = true;
  }
  MyClock.prototype.update = function () {
    var s, m, h;
    var that = this;
    // console.log(that)

    //Weird requestAnimationFrame Scope problem!!!
    if (this.isTicking) {
      requestAnimationFrame(function () {
        that.update();
      });
    }
    // if (this.isTicking) {

    var currentTime = new Date();
    var currentHours = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();
    var currentSeconds = currentTime.getSeconds();

    s = currentSeconds - this.startS;

    if (s < 0) {
      s += 60;
      currentMinutes--;
    } else if (s < 10) {
      s = "0" + s;
    }

    m = currentMinutes - this.startM;
    if (m < 0) {
      m += 60;
      currentHours--;
    } else if (m < 10) {
      m = "0" + m;
    }

    h = currentHours - this.startH;
    if (h < 10) {
      h = "0" + h;
    }

    // }
    this.selector.innerHTML = h + ":" + m + ":" + s;
  };

  start.onclick = function () {
    start.style.display = "none";
    document.getElementById('blackout').style.display = "none";
    timer1.style.display = "block";
    var currentTime = new Date();
    startH = currentTime.getHours();
    startM = currentTime.getMinutes();
    startS = currentTime.getSeconds();
    clock1 = new MyClock(startH, startM, startS, "timer1");
    clock1.update();
  };

  function clockclockclock() {
    if (document.getElementById('timer1').style.display === "block") {
      document.getElementById('timer2').style.display = "block";
      clock1.isTicking = false;
      var currentTime = new Date();
      startH = currentTime.getHours();
      startM = currentTime.getMinutes();
      startS = currentTime.getSeconds();
      clock2 = new MyClock(startH, startM, startS, "timer2");
      clock2.update();
    }
  }
  exports.clockclockclock = clockclockclock;

  function tryAgain() {
    clock1.isTicking = true;
    clock1.update();
    clock2.isTicking = false;
  }
  exports.tryAgain = tryAgain;

  //----------------------------------------------------------------
  //---------------------  change instruction   --------------------
  //----------------------------------------------------------------

  next.onclick = function () {
    level++;
    //console.log(level)
    changeContent(level);
  };

  function changeContent(number) {
    var strs;
    switch (number) {
    case 1:
      strs = level1;
      break;
    case 2:
      strs = level2;
      question.style.display = "block";
      break;
    case 3:
      strs = level3;
      break;
    case 4:
      strs = level4;
      question.style.display = "none";
      break;
    case 5:
      strs = level5;
      start.style.display = "block";
      document.getElementById('blackout').style.display = "block";
      break;
    case 6:
      strs = level6;
      document.getElementById('instruction').style.display = "none";
      document.getElementById('editor2').style.display = "block";
      break;
    default:
      str = "";
      break;
    }
    var str = "";
    strs.forEach(function (l) {
      str += "<p>";
      str += l;
      str += "</p>";
    });
    content.innerHTML = str;
    processBar.style.width = level * 30 + 30 + "px";

  }

  var level1 = [
    "There're only 6 instructions, which are:",
    "forward()",
    "backward()",
    "left()",
    "right()",
    "up()",
    "down()",
    "That's it.",
    "Try type them in the editor, when you finish, click the 'run' button."
  ];

  var level2 = [
    "What if you want to move it forward ten steps?",
    "Well, you don't have to type it 10 times.",
    "Here's how a 'loop' can help you:",
    "",
    "for(var i = 0; i < 10; i++){",
    " forward()",
    "}",
    "Try it in the editor, if you like, try with different iterate times and instrunctions"
  ];

  var level3 = [
    "If you make the iterator as a reusable tool, you don't have to remake it over and over again.",
    "Here's how a 'function' works as a 'tool':",
    "function f(steps){",
    " for(var i = 0; i < steps; i++){",
    "   forward()",
    " }",
    "}",
    "And here's how to 'use' this tool:",
    "f(4)",
    "f(6)"
  ];

  var level4 = [
    "There's always obstacles:)",
    "See the CAT cubes? They're obstacles which will get in your way.",
    "Try to go through them and see what happens."
  ];

  var level5 = [
    "Clock's Ticking!",
    "In the real game, you need to compete with other to get to the target as soon as possible.",
    "Wanna give it a try?",
    "Click 'start' when you're ready."
  ];

  var level6 = [
    "Are you ready to for a real game?",
    "Invite your friend, give them this url"
  ];

})(this);