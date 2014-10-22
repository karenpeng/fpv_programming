var canvas = document.getElementById("canvas2d");
var context = canvas.getContext("2d");
var point1 = {
  x: null,
  y: null
};
var point2 = {
  x: null,
  y: null
};
var isMouseDown = false;

canvas.onmousedown = function (e) {
  if (show2dcanvas) {
    isMouseDown = true;
    point1.x = e.pageX;
    point1.y = e.pageY;
  }
};

canvas.onmouseup = function (e) {
  if (show2dcanvas) {
    isMouseDown = false;
    point2.x = e.pageX;
    point2.y = e.pageY;
    context.beginPath();
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);
    context.stroke();
  }
};

canvas.onmousemove = function (e) {
  if (show2dcanvas && isMouseDown) {
    point2.x = e.pageX;
    point2.y = e.pageY;
    context.beginPath();
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);
    context.lineWidth = 10;
    context.strokeStyle = "#ffffff";
    context.stroke();
  }

};