let shared;
let me;
let guests;

//delete this later just for testing
function preload(){
    partyConnect("wss://demoserver.p5party.org", "gameA_groupB");

    shared = partyLoadShared("shared", {
        grid:createGrid(500,500)
    })
    guests = partyLoadGuestShareds();
    me = partyLoadMyShared({
		row:0, //current grid position
		col:0, //current grid position
        gameState:0, //0 for started, 1 for key found, 2 for door opened
    })

}

function setup() {
	createCanvas(500, 500);
	noStroke();
	background("white")
	drawGrid(shared.grid)
}

// function draw() {
// 	background("pink");

// 	drawRectangle();

// 	fill("white");
// 	ellipse(x, y, 50, 50);
// }

function mouseClicked() {
	x = mouseX;
	y = mouseY;
}
function keyPressed(){
    if(keyCode == UP_ARROW){
        console.log('up')
    }
    if(keyCode == DOWN_ARROW){
        console.log('down')
    }
    if(keyCode == LEFT_ARROW){
        console.log('left')
    }
    if(keyCode == RIGHT_ARROW){
        console.log('right')
    }
}
