var canvas = document.getElementById('textureCanvas');
var ctx = canvas.getContext('2d');
var data = document.getElementById('editor');
for (var key in data) {
		//console.log(key, data[key]);
}
console.log(data);
var dataStr = objToString(data);
console.log(dataStr);

var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
		'<foreignObject width="100%" height="100%">' +
		'<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">' +
		data +
		'</div>' +
		'</foreignObject>' +
		'</svg>';

var DOMURL = window.URL || window.webkitURL || window;

var img = new Image();
var svg = new Blob([svg], {
		type: 'image/svg+xml;charset=utf-8'
});
var url = DOMURL.createObjectURL(svg);

img.onload = function () {
		ctx.drawImage(img, 0, 0);
		DOMURL.revokeObjectURL(url);
}

img.src = url;

function objToString(obj) {
		var str = '';
		for (var p in obj) {
				if (obj.hasOwnProperty(p)) {
						str += p + '::' + obj[p] + '\n';
				}
		}
		return str;
}