var editor1 = ace.edit("editor1");
editor1.setTheme("ace/theme/monokai");
editor1.getSession().setMode("ace/mode/javascript");
var editor2 = ace.edit("editor2");
editor2.setTheme("ace/theme/monokai");
editor2.getSession().setMode("ace/mode/javascript");

document.getElementById('run').onclick = function evaluate() {
  var value = editor1.getValue();
  console.log(value);
}