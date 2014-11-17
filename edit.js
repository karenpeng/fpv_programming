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
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 0;
  you.add(camera);
};

// var dictionary = {
//   'forward': 'you.position.z -= 50;',
//   'backward': 'you.position.z += 50;',
//   'left': 'you.position.x -= 50;',
//   'right': 'you.position.x += 50;',
//   'up': 'you.position.y += 50;',
//   'down': 'you.position.y -= 50;'
// };

function forward() {
  for (var i = 0; i < 200; i++) {
    setTimeout(function () {
      you.position.z -= 0.25;
      //change color here

    }, i);
  }
  //you.position.z -= 50;
}

function backward() {
  for (var i = 0; i < 200; i++) {
    setTimeout(function () {
      you.position.z += 0.25;
    }, i);
  }
}

function left() {
  for (var i = 0; i < 200; i++) {
    setTimeout(function () {
      you.position.x -= 0.25;
    }, i);
  }
}

function right() {
  for (var i = 0; i < 200; i++) {
    setTimeout(function () {
      you.position.z += 0.25;
    }, i);
  }
}

function up() {
  for (var i = 0; i < 200; i++) {
    setTimeout(function () {
      you.position.y += 0.25;
    }, i);
  }
}

function down() {
  for (var i = 0; i < 200; i++) {
    setTimeout(function () {
      you.position.y -= 0.25;
    }, i);
  }
}