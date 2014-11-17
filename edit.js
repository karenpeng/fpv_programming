var editor1 = ace.edit("editor1");
editor1.setTheme("ace/theme/monokai");
editor1.getSession().setMode("ace/mode/javascript");
var editor2 = ace.edit("editor2");
editor2.setTheme("ace/theme/monokai");
editor2.getSession().setMode("ace/mode/javascript");

document.getElementById('run').onclick = function evaluate() {
  var str = editor1.getValue();
  //console.log(value);
  eval(str);
  // var value = parse(str);
  // eval(value);

  // camera.position.x = 0;
  // camera.position.y = 0;
  // camera.position.z = 0;
  // you.add(camera);

};

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
  var step = 0;
  //attachCamera();
  for (var i = step; i < step + 50 / unit + 1; i++) {
    console.log(i)
    if (i < step + 50 / unit) {
      setTimeout(function () {
        you.idle = false;
        you.position.z -= unit;
        //change color here
      }, i);
    } else {
      console.log("yay!");
      setTimeout(function () {
        you.idle = true;
        // releaseCamera();
        console.log("yay!");
        if (callback) {
          callback();
        }
      }, step + 50 / unit + 1000);
    }
  }
  //you.position.z -= 50;
}

function parse(str) {
  // pattern = //g;
  // if you see the word "forward()", change it into "forward(counter)"
  //   so i nee to count how many times i encounter it, to increase counter
}

// var dictionary = {
//   "":
// }