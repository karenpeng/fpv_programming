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
    context.clearRect(0, 0, canvas.width, canvas.height);
    point2.x = e.pageX;
    point2.y = e.pageY;
    context.beginPath();
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);
    context.closePath();
    context.lineWidth = 10;
    console.log(point1.x, point1.y, point2.x, point2.y);
    context.strokeStyle = "#ffffff";
    context.stroke();
  }

};