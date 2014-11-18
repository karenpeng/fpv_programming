var editor1 = ace.edit("editor1");
editor1.setTheme("ace/theme/monokai");
editor1.getSession().setMode("ace/mode/javascript");
var editor2 = ace.edit("editor2");
editor2.setTheme("ace/theme/monokai");
editor2.getSession().setMode("ace/mode/javascript");

document.getElementById('run').onclick = function evaluate() {
  var str = editor1.getValue();
  //console.log(str);
  parse(str);
  //eval(str);
  // var value = parse(str);
  // eval(value);

  // camera.position.x = 0;
  // camera.position.y = 0;
  // camera.position.z = 0;
  // you.add(camera);

};

//(function (exports) {

function attachCamera() {
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 0;
  you.add(camera);
}

function releaseCamera() {
  you.remove(camera);
  camera.position.x = 500;
  camera.position.y = 800;
  camera.position.z = 1300;
}

// var dictionary = {
//   'forward': 'you.position.z -= 50;',
//   'backward': 'you.position.z += 50;',
//   'left': 'you.position.x -= 50;',
//   'right': 'you.position.x += 50;',
//   'up': 'you.position.y += 50;',
//   'down': 'you.position.y -= 50;'
// };

// non-sense
var unit = 0.25;

function beginExecution(callback) {
  attachCamera();
  //how do i create a callback myself?!
  callback();
}

function endExecution() {
  releaseCamera();
}

function forward(callback) {

  for (var i = 0; i < 50 / unit + 1; i++) {

    if (i < 50 / unit) {
      setTimeout(function () {
        you.idle = false;
        you.position.z -= unit;
      }, i);
    } else {
      setTimeout(function () {
        you.idle = true;
        //if callback is passed in
        if (callback) {
          callback();
        }
      }, 50 / unit + 1000);
    }
  }
}

function backward(callback) {

  for (var i = 0; i < 50 / unit + 1; i++) {

    if (i < 50 / unit) {
      setTimeout(function () {
        you.idle = false;
        you.position.z += unit;
      }, i);
    } else {
      setTimeout(function () {
        you.idle = true;
        //if callback is passed in
        if (callback) {
          callback();
        }
      }, 50 / unit + 1000);
    }
  }
}

function parse(str) {
  var tasks = [];
  var postStr = str.replace(/forward\(\)/g, "tasks.push('f')");
  postStr = str.replace(/backward\(\)/g, "tasks.push('b')");
  //console.log(postStr);
  eval(postStr);
  console.log(tasks + tasks.length);
  var hellStr = "";
  if (tasks.length < 1) {
    return;
  } else if (tasks.length === 1) {
    hellStr += "forward()";
  } else if (tasks.length === 2) {
    hellStr += "forward(forward)";
  } else {
    for (var j = 2; j < tasks.length; j++) {
      hellStr += "forward(function(){";
    }
    hellStr += "forward(forward)";
    for (var k = 2; k < tasks.length; k++) {
      hellStr += "})";
    }
  }
  console.log(hellStr);
  eval(hellStr);
}

var dictionary = {
  "f": "forward",
  "b": "backward",
  "l": "left",
  "r": "right",
  "u": "up",
  "d": "down"
}

//})(this);