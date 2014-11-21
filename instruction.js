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
    break;
  case 5:
    strs = level5;
    question.style.display = "none";
    break;
  case 6:
    strs = level6;
    start.style.display = "block";
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
  processBar.style.width = level * 20 + 20 + "px";

}

var level1 = [
  "There're only 6 instructions, which are:",
  "forward()",
  "backward()",
  "left()",
  "right()",
  "up()",
  "That's it.",
  "Try type some of them in the editor, when you finish, click the 'run' button."
];

var level2 = [
  "What if you want to move it forward ten steps?",
  "Well, you don't have to type it 10 times.",
  "Here's how a 'loop' can help you:",
  "",
  "for(var i = 0; i < 6; i++){",
  " forward()",
  "}",
  "Try it in the editor, if you like, try with different iterate times and instrunctions"
];

var level3 = [
  "If you make the iterator as a reusable tool, you don't have to remake it over and over again.",
  "Here's how a 'function' works as a 'tool':",
  "function myLoop(steps){",
  " for(var i = 0; i < steps; i++){",
  "   forward()",
  " }",
  "}",
  "And here's how to 'use' this tool:",
  "myLoop(4)",
  "myLoop(6)"
];

var level4 = [
  "You could also make the direction changable, making this tool more flexible:",
  "function myStep(steps, direction){",
  " for(var i = 0; i < steps; i++){",
  "if(direction === 'f'){",
  "   forward()",
  " }",
  "if(direction === 'l'){",
  "   left()",
  " }",
  "}",
  "}",
];

var level5 = [
  "There's always obstacles:)",
  "See the yellow cubes? They're obstacles which will get in your way.",
  "Try to go through them and see what happens."
];

var level6 = [
  "Clock Ticking!",
  "In the real game, you need to get to the target as soon as possible.",
  "Wanna give it a try?",
  "Click 'start' when you're ready."
];