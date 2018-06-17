var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var ui = {};
ui.menu = document.getElementById('menu');
ui.menu.ip = document.getElementById('ip');
ui.menu.pname = document.getElementById('pname');


///////////////////////////////////////////////////////////
///////////////////// NETWORKING //////////////////////////
///////////////////////////////////////////////////////////

var ws;
var state = 0;
var foods = [];
var players = {};
var myid = -1;

function onopen(e) {
	ws.send(ui.menu.pname.value);
}

function onmessage(e) {
	obj = JSON.parse(e.data);
	if (state == 0) { // foods and position coming from server
		foods = obj.f;
		myid = obj.i;
		players = obj.p;
		ui.menu.style.display = "none";
		state = 1;
		requestAnimationFrame(render);
	}
}

function onclose(e) {
	ui.menu.style.display = "block";
	state = 0;
}

function onerror(e) {
	//
}

function play() {
	ws = new WebSocket("ws://" + menu.ip.value);
	ws.onopen = onopen;
	ws.onmessage = onmessage;
	ws.onclose = onclose;
	ws.onerror = onerror;
}

///////////////////////////////////////////////////////////
////////////////////// RENDERING //////////////////////////
///////////////////////////////////////////////////////////

var laststamp = 0;
var camera = { x: 0, y: 0, scale: 1 };

function worldToScreen(x, y) {
	var p = {};
	p.x = (x + canvas.width/2 - camera.x) * camera.scale;
	p.y = (y + canvas.height/2 - camera.y) * camera.scale;
	return p
}

function screenToWorld(x, y) {
	var p = {};
	p.x = x / camera.scale - canvas.width/2 + camera.x;
	p.y = y / camera.scale - canvas.height/2 + camera.y;
	return p
}

function render(timestamp) {
	if (state == 0) return;
	var dt = (timestamp - laststamp)/1000;
	laststamp = timestamp;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	camera.x = players[myid].p[0];
	camera.y = players[myid].p[1];

	draw_foods();
	draw_balls();

	requestAnimationFrame(render);
}

function draw_foods() {
	for (var i = 0; i < foods.length; i++) {
		var p = worldToScreen(foods[i][0], foods[i][1]);
		ctx.beginPath();
		ctx.arc(p.x, p.y, 10*camera.scale, 0, 2 * Math.PI);
		ctx.fill();
	}
}

function draw_balls() {
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = "20px sans-serif"
	for (var key in players) {
	    // check if the property/key is defined in the object itself, not in parent
	    if (players.hasOwnProperty(key)) {           
			var p = worldToScreen(players[key].p[0], players[key].p[1]);
			ctx.beginPath();
			ctx.arc(p.x, p.y, players[key].s*camera.scale, 0, 2 * Math.PI);
			ctx.stroke();

			ctx.fillText(players[key].n, p.x, p.y);
	    }
	}
}

window.onresize = function(e) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

window.onload = function(e) {
	window.onresize();
}