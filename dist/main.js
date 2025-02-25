let shared;
let me;
let guests;

// https://github.com/jbakse/p5party_foundation/blob/main/src/js/main.js
Object.assign(window, {
	preload,
	setup,
	draw,
	keyPressed,
	handleMove,
	drawPlayers,
});

//delete this later just for testing
function preload() {
	partyConnect("wss://demoserver.p5party.org", "gameA_groupB");

	shared = partyLoadShared("shared", {
		grid: createGrid(),
	});
	// shared = partyLoadShared("globals");

	guests = partyLoadGuestShareds();
	me = partyLoadMyShared({
		row: undefined, //current grid position
		col: undefined, //current grid position
		gameState: 0, //0 for started, 1 for key found, 2 for door opened
		idx: undefined,
	});
}

function setup() {
	createCanvas(500, 500);
	noStroke();
	background("white");

	partyToggleInfo(true);

	// if (partyIsHost()) {
	// 	// shared.grid = createGrid();
	// 	partySetShared(shared, { grid: createGrid() });
	// }

	for (let i = 0; i < guests.length; i++) {
		if (guests[i] === me) {
			me.idx = i;
			// me.row = starting[i].row;
			// me.col = starting[i].col;
			me.row = 0;
			me.col = 0;
		}
	}
}

function draw() {
	drawGrid(shared.grid);
	drawPlayers(guests);
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
	const { validMove, isMyKey } = checkCell(shared.grid, me.idx, newRow, newCol);
	if (isMyKey) me.gameState === 1;
	return validMove;
}

function drawPlayers(guests) {
	for (let i = 0; i < guests.length; i++) {
		const guest = guests[i];
		push();
		fill(playerColors[i]);
		stroke("blue");
		// for some reason row and col seem to be switched
		ellipse(guest.col * h + h / 2, guest.row * w + w / 2, 10, 10);
		pop();
	}
}
