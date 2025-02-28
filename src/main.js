let shared;
let me;
let guests;
let timer;
let time_max = 2 * 60;
let door0;
let door1;
const doorRow = 0;
let player0Img;
let player1Img;
let key0Img;
let key1Img;

let grass_images = []

let tile_mode = 1 //1 is light, 2 is dark, 3 is medium
let tile_images = []

// update
const playerColors = [
	"#22697e", //blue
	"#f083ab", //pink
];

// https://github.com/jbakse/p5party_foundation/blob/main/src/js/main.js
Object.assign(window, {
	preload,
	setup,
	draw,
	keyPressed,
	handleMove,
	drawPlayers,
	drawGrid,
});

//delete this later just for testing
function preload() {
	partyConnect("wss://demoserver.p5party.org", "gameA_groupB");

	shared = partyLoadShared("shared", {
		grid: createGrid(),
		time_val: time_max,
	});

	guests = partyLoadGuestShareds();
	me = partyLoadMyShared({
		row: 0, //current grid position, initiate at 0 and set in setup
		col: 0, //current grid position, initiate at 0 and set in setup
		gameState: 0, //0 for started, 1 for key found, 2 for door opened, 3 for lose
		idx: 0, // initiate at 0 and set in setup
	});
	timer = document.getElementById("timer-val");

	player0Img = loadImage("images/BlueFrog-Front.png");
	player1Img = loadImage("images/PinkFrog-Front.png");

	key0Img = loadImage("images/Key-Blue.png");
	key1Img = loadImage("images/Key-Pink.png");

	for(let grassImgIdx = 0; grassImgIdx<4; grassImgIdx++){
		let grassImg = loadImage(`images/Grass-${grassImgIdx}.png`)
		grass_images.push(grassImg)

	}

	//water tiles
	for(let tile_mode=1; tile_mode<=3; tile_mode++){
		let imgs={}
		for(let tile_type of ['a', 'b', 'c','d']){
			img_path = `./images/Tiles/Tiles-${tile_mode}${tile_type}.png`
			imgs[tile_type] = loadImage(img_path);
		}
		tile_images.push(imgs)
	}
	
}

function setup() {
	createCanvas(gridWidth, gridHeight);
	noStroke();
	background("white");

	// partyToggleInfo(true);

	setPlayerStarts();
	setUp_UI();

	door0 = { row: doorRow, col: Math.floor(random(1, nRows / 2)) };
	door1 = { row: doorRow, col: Math.floor(random(nRows / 2, nRows - 1)) };
}

function draw() {
	image(grass_images[2], 0, 0, gridWidth, gridHeight);
	drawGrid(shared.grid);
	drawPlayers(guests);
	drawDoors();
	updateTimer();

	if (shared.time_val === 0) {
		drawLose();
	}

	// can only win/lose if there are 2 players
	if (
		guests[0] &&
		guests[0].gameState >= 0 &&
		guests[1] &&
		guests[1].gameState >= 0
	) {
		if (guests[0].gameState === 2 && guests[1].gameState === 2) {
			drawWin();
		}
		if (guests[0].gameState === 3 || guests[1].gameState === 3) {
			drawLose();
		}
	}
}

function setPlayerStarts() {
	const playerStarts = [
		[0, 0],
		[0, nCols - 1],
	];

	const maxIdx = iterateGuestsIdx(guests);
	for (let i = 0; i < maxIdx; i++) {
		if (guests[i] === me) {
			me.idx = i;
			me.row = playerStarts[i][0];
			me.col = playerStarts[i][1];
		}
	}
}

function keyPressed() {
	let newRow = me.row;
	let newCol = me.col;

	if (keyCode == UP_ARROW) {
		if (me.row === 0) return;
		newRow = me.row - 1;
	}
	if (keyCode == DOWN_ARROW) {
		if (me.row === nRows - 1) return;
		newRow = me.row + 1;
	}
	if (keyCode == LEFT_ARROW) {
		if (me.col === 0) return;
		newCol = me.col - 1;
	}
	if (keyCode == RIGHT_ARROW) {
		if (me.col === nCols - 1) return;
		newCol = me.col + 1;
	}

	const valid = handleMove(newRow, newCol);
	if (valid) {
		me.row = newRow;
		me.col = newCol;
	}
}

function handleMove(newRow, newCol) {
	if (me.gameState === 1) {
		checkCellDoor(newRow, newCol);
		return true;
	}
	const { validMove, isMyKey } = checkCell(shared.grid, me.idx, newRow, newCol);
	if (isMyKey) me.gameState = 1;
	return validMove;
}

function drawPlayers(guests) {
	const maxIdx = iterateGuestsIdx(guests);
	for (let i = 0; i < maxIdx; i++) {
		const guest = guests[i];
		const x = guest.col * h;
		const y = guest.row * w;

		if (i === 0) {
			image(player0Img, x, y, w, h);
		}
		if (i === 1) {
			image(player1Img, x, y, w, h);
		}
	}
}

function setUp_UI() {
	//UI
	reset_button = document.getElementById("reset-button");
	reset_button.addEventListener("click", function () {
		reset();
	});

	info_button = document.getElementById("info-button");
	info_button.addEventListener("click", function () {
		console.log("info clicked");
	});
}

function reset() {
	console.log("reset clicked");
	console.log();

	//reset shared grid and time value
	shared.grid = createGrid();
	shared.time_val = time_max;

	//reset player states
	for (const guest of guests) {
		guest.row = 0;
		guest.col = 0;
		guest.gameState = 0;
		guest.idx = 0;
	}
	setPlayerStarts();
}

function showInfo() {}

function updateTimer() {
	if (partyIsHost()) {
		if (frameCount % 60 == 0) {
			shared.time_val = Math.max(shared.time_val - 1, 0);
		}
	}
	let s = shared.time_val;
	let m = Math.floor(s / 60);
	let s_str = `${s % 60}`;
	if (s_str.length == 1) {
		s_str = `0${s % 60}`;
	}

	timer.textContent = `${m}:${s_str}`;
}
function iterateGuestsIdx(guests) {
	if (guests.length === 1) {
		("return 1");
		return 1;
	} else {
		return nPlayers;
	}
}

function drawDoors() {
	push();
	fill("#007fff");
	if (guests[0] && guests[0].gameState > 0) {
		ellipse(door1.col * h + h / 2, door1.row * w + w / 2, 15, 15);
	}
	if (guests[1] && guests[1].gameState > 0) {
		ellipse(door0.col * h + h / 2, door0.row * w + w / 2, 15, 15);
	}
	pop();
}

function checkCellDoor(newRow, newCol) {
	if (newRow !== doorRow) {
		return;
	}
	// win states - go to correct door
	if (me.idx === 0 && newCol === door0.col) {
		me.gameState = 2;
		return;
	}
	if (me.idx === 1 && newCol === door1.col) {
		me.gameState = 2;
		return;
	}
	// lose states - go to the wrong door
	if (me.idx === 0 && newCol === door1.col) {
		me.gameState = 3;
		return;
	}
	if (me.idx === 1 && newCol === door0.col) {
		me.gameState = 3;
		return;
	}
	return;
}

function drawWin() {
	push();
	fill("black");
	rect(0, 0, gridWidth, gridHeight);
	textAlign(CENTER);
	fill("white");
	textSize(50);
	textFont("Verdana");
	text("YOU WIN :)", gridWidth / 2, gridHeight / 2);
	pop();
}

function drawLose() {
	push();
	fill("black");
	rect(0, 0, gridWidth, gridHeight);
	textAlign(CENTER);
	fill("white");
	textSize(50);
	textFont("Verdana");
	text("YOU LOSE :(", gridWidth / 2, gridHeight / 2);
	pop();
}

/**
 * draws the grid and all its elements
 */
function drawGrid(grid) {
	stroke("white");
	for (const row of grid) {
		for (const entry of row) {
			//background
			image(grass_images[1], entry.x, entry.y, entry.w, entry.h);
			

			//enabled status drawing
			if (entry.enabled.every((e) => e == false)) {
		
			} else {
				for (let playerNum = 0; playerNum < nPlayers; playerNum++) {
					if (entry.enabled[playerNum]) {
						fill(playerColors[playerNum]);
						push()
						imageMode(CENTER);
						angleMode(DEGREES);
						translate(entry.x + entry.w/2, entry.y + entry.h/2)
						if(!entry.corner.includes('horizontal') && !entry.corner.includes('vertical')){
							
							if(entry.corner.includes('bottom') && entry.corner.includes('left')){
								rotate(180+90)
							}else if(entry.corner.includes('bottom') && entry.corner.includes('right')){
								rotate(180)
							}else if(entry.corner.includes('top') && entry.corner.includes('right')){			
								rotate(90)
							}else if(entry.corner.includes('top') && entry.corner.includes('left')){	
								rotate(0)
							}
							image(tile_images[playerNum]['a'], 0,0, entry.w, entry.h);
						}else{
							if(entry.corner.includes('vertical')){
								rotate(90)
							}
							image(tile_images[playerNum]['b'], 0,0, entry.w, entry.h);
						}
						pop()
						
					}
				}
				
			}
			
			
			

			if (typeof entry.key === "number") {
				push();
				const x = entry.x;
				const y = entry.y;

				if (entry.key === 0) {
					image(grass_images[2], entry.x, entry.y, entry.w, entry.h);
					image(key0Img, x, y, w, h);
				}
				if (entry.key === 1) {
					image(grass_images[2], entry.x, entry.y, entry.w, entry.h);
					image(key1Img, x, y, w, h);
				}
				pop();
			}

			
		}
	}
}
