var canvasWidth = 800;
var canvasHeight = 600;
var canvasClipRaduis = 40;
var canvasDiagonal = Math.ceil(Math.sqrt(Math.pow(canvasWidth, 2) + Math.pow(canvasHeight, 2)));

var canvas = document.getElementById("blur-canvas");
var context = canvas.getContext('2d');

canvas.width = canvasWidth;
canvas.height = canvasHeight;

var img = new Image();
img.src = 'image.jpg'
img.onload = function() {
	initCanvas();
}

var clipRegion = {
	x: Math.floor(Math.random() * (canvasWidth - canvasClipRaduis * 2)) + canvasClipRaduis + 1,
	y: Math.floor(Math.random() * (canvasHeight - canvasClipRaduis * 2)) + canvasClipRaduis + 1,
	r: canvasClipRaduis
};

function initCanvas() {
	draw(img, clipRegion);
}

function draw(img, clipRegion) {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	context.save();
	setCliplingRegion(clipRegion)
	context.drawImage(img, 0, 0);
	context.restore();
}


function setCliplingRegion(clipRegion) {
	context.beginPath();
	context.arc(clipRegion.x, clipRegion.y, clipRegion.r, 0, Math.PI * 2, false);
	context.clip()
}

$("#reset").click(function() {
	clipRegion.x = Math.floor(Math.random() * (canvasWidth - canvasClipRaduis * 2)) + canvasClipRaduis + 1;
	clipRegion.y = Math.floor(Math.random() * (canvasHeight - canvasClipRaduis * 2)) + canvasClipRaduis + 1;
	clipRegion.r = 40;
	clearInterval(timeout);
	initCanvas();
})

var timeout = null;
$("#show").click(function() {
	timeout = setInterval(function() {
		clipRegion.r += 30;
		initCanvas();
		if (clipRegion.r >=canvasDiagonal) {
			clearInterval(timeout);
		}
	}, 40)
})

var x, y;

$("#blur-canvas").mousedown(function(e) {
	x = e.clientX - canvas.getBoundingClientRect().left;
	y = e.clientY - canvas.getBoundingClientRect().top;
	if (context.isPointInPath(x, y)) {
		var disX = x - clipRegion.x;
		var disY = y - clipRegion.y;
		$("#blur-canvas").mousemove(function(e) {
			clipRegion.x = e.clientX - canvas.getBoundingClientRect().left - disX;
			clipRegion.y = e.clientY - canvas.getBoundingClientRect().top - disY;
			clipRegion.r = 40;
			clearInterval(timeout);
			context.save();
			setCliplingRegion(clipRegion)
			context.drawImage(img, 0, 0);
			context.restore();
		})
	}
})

$("#blur-canvas").mouseup(function(e) {
	$("#blur-canvas").unbind("mousemove");
})

$("body").mouseup(function(e) {
	$("#blur-canvas").unbind("mousemove");
})