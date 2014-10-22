var canvas = document.getElementById("canvas2d");
var context = canvas.getContext("2d");
var point1, point2;
var isMouseDown = false;

window.onmousedown = function (e) {
  console.log("ss")
  if (show2dcanvas) {
    isMouseDown = true;
    point1.x = e.pageX;
    point1.y = e.pageY;
  }
};

window.onmouseup = function (e) {
  if (show2dcanvas) {
    isMouseDown = false;
    console.log("jjj")
    point2.x = e.pageX;
    point2.y = e.pageY;
    context.beginPath();
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);
    context.stroke();
  }
};

window.onmousemove = function (e) {
  if (show2dcanvas && isMouseDown) {
    point2.x = e.pageX;
    point2.y = e.pageY;
    context.beginPath();
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);
    context.strokeStyle = "#ffffff";
    console.log("ouch")
    context.stroke();
  }

};