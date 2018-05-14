var canv = document.getElementById('canvas');
var ctx = canv.getContext('2d');
var isMouseDown = false;
var brushSize = 5;
var color = '#000';
var coords = [];
var img = '';


document.getElementById('settings').onclick = function() {

	document.getElementById('brush').value = brushSize;
	document.getElementById('color').value = color;
	document.getElementById('url').value = img;

	document.getElementById('costomize').style.display = 'block';

	document.getElementById('save').onclick = function() {
		brushSize = document.getElementById('brush').value;
		color = document.getElementById('color').value;
		img = document.getElementById('url').value;
		ctx.lineWidth = brushSize*2;
		if (img.length > 0) {
			document.body.style.background = 'url(' + img + ')';
			document.body.style.backgroundRepeat = 'no-repeat';
			document.body.style.backgroundPosition = 'center';
		}
		document.getElementById('costomize').style.display = 'none';
	}
}

canv.width = window.innerWidth;
canv.height = window.innerHeight;

canv.addEventListener('mousedown', function(){
	isMouseDown = true;
});

canv.addEventListener('mouseup', function(){
	isMouseDown = false;
	ctx.beginPath();
	coords.push('mouseup');
});

canv.addEventListener('mousemove', function(e){
	if (isMouseDown) {
		ctx.lineWidth = brushSize*2;
		ctx.strokeStyle = color;
		coords.push([e.clientX, e.clientY, color, brushSize]);
		ctx.lineTo(e.clientX, e.clientY);
		ctx.stroke();

		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(e.clientX, e.clientY, brushSize, 0, Math.PI*2);
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY);
	}
});

function Clear() {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canv.width, canv.height);
	ctx.beginPath();
	ctx.fillStyle = color;
}

function Save() {
	localStorage.setItem('coords', JSON.stringify(coords));
}
function Replay() {
	var timer = setInterval(function(){
		if (!coords.length) {
			clearInterval(timer);
			ctx.beginPath();
			return;
		}
		var
		 crd = coords.shift(),
		 e = {
			clientX: crd['0'],
			clientY: crd['1'],
			color: crd['2'],
			brushSize: crd['3'],
		};

		ctx.lineWidth = e.brushSize*2;

		ctx.strokeStyle = e.color;
		ctx.lineTo(e.clientX, e.clientY);
		ctx.stroke();

		ctx.fillStyle = e.color;
		ctx.beginPath();
		ctx.arc(e.clientX, e.clientY, Number(e.brushSize), 0, Math.PI*2);
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY);
	}, 15);
}


document.addEventListener('keydown', function(e){
	if (e.keyCode == 83) {
		Save();
		console.log('Saved');
	}
	if (e.keyCode == 67) {
		Clear();
		console.log('Cleared');
	}
	if (e.keyCode == 82) {
		console.log('Replaying...');
		coords = JSON.parse(localStorage.getItem('coords'));
		Clear();
		Replay();
	}
	if (e.keyCode == 221) {
		brushSize++;
		ctx.lineWidth = brushSize*2;
	}
	if (e.keyCode == 219) {
		if (brushSize > 1) {
			brushSize--;
			ctx.lineWidth = brushSize*2;
		}
	}
});
// save : 83 S
// clear : 67 C
// Replay : 82 R
// brush++ : 221 ]
//brush-- : 219 [