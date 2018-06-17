var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var ui = {};
ui.menu = document.getElementById('menu');
ui.menu.ip = document.getElementById('ip');
ui.menu.pname = document.getElementById('pname');

var ws;
var state = 0;
var foods = [];
var mybody = [];
var myid = -1;
var BODY_LENGTH = 1;
var SPEED = 0;

function onopen(e) {
	ws.send(ui.menu.pname.value);
}

function onmessage(e) {
	obj = JSON.parse(e.data);
	if (state == 0) { // foods and position coming from server
		foods = obj.f;
		mybody = obj.b;
		BODY_LENGTH = obj.l;
		myid = obj.i;
		SPEED = obj.s;
		sh = obj.sh;
		state = 1;
	}
}

function onclose(e) {
	state = 0;
}

function onerror(e) {
	//
}


var play = function() {
	ws = new WebSocket("ws://" + menu.ip.value);
	ws.onopen = onopen;
	ws.onmessage = onmessage;
	ws.onclose = onclose;
	ws.onerror = onerror;
}

window.onresize = function(e) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

window.onload = function(e) {
	window.onresize();
}