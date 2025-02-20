console.log("hello from main.js!");

let x = 200;
let y = 200;

// https://github.com/jbakse/p5party_foundation/blob/main/src/js/main.js
Object.assign(window, {
	preload,
	setup,
	draw,
	mouseClicked,
});

function preload() {
	// connect to p5 party server
}

function setup() {
	createCanvas(500, 500);
	noStroke();
}

function draw() {
	background("pink");
	ellipse(x, y, 50, 50);
}

function mouseClicked() {
	x = mouseX;
	y = mouseY;
}
