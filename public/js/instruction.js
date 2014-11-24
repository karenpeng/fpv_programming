var next = document.getElementById('next');
var content = document.getElementById('content');
var processBar = document.getElementById('processBar');
var question = document.getElementById('question');
var start = document.getElementById('start');
var timer = document.getElementById('timer');
var level = 0;

next.onclick = function () {
  level++;
  //console.log(level)
  changeContent(level);
};

start.onclick = function () {
  start.style.display = "none";
  timer.style.display = "block";
  var currentTime = new Date();
  var currentHours = currentTime.getHours();
  var currentMinutes = currentTime.getMinutes();
  var currentSeconds = currentTime.getSeconds();
  console.log(currentHours, currentMinutes, currentSeconds);
  timer.innerHTML = "00:00:00";
  //update(currentHours, currentMinutes, currentSeconds);
};

var startH, startM, startS;

function update(_h, _m, _s) {
  requestAnimationFrame(update);
  if (_h) startH = _h;
  if (_m) startM = _m;
  if (_s) startS = _s;

  var currentTime = new Date();
  var currentHours = currentTime.getHours();
  var currentMinutes = currentTime.getMinutes();
  var currentSeconds = currentTime.getSeconds();

  var h = currentHours - startH;
  var m = currentMinutes - startM;
  var s = currentSeconds - startS;

  timer.innerHTML = h + ":" + m + ":" + s;
}

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
  "See the yellow cubes? They're obstacles which will get in your way.",
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