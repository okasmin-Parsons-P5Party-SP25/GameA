const nPlayers = 2;
const playerColors = ["#EE4934", "#E6D040"];

//constants
const nRows = 20;
const nCols = 20;
const gridWidth = 500;
const gridHeight = 500;
const w = gridWidth / nCols; //cell width
const h = gridHeight / nRows; //cell height

//starting position of players -- temporary
const starting = [undefined, undefined];

/**
 * Creates the Grid structure
 */
function createGrid() {
	//template states
	let all_enabled = [];
	let all_disabled = [];
	let playerPaths = [];
	let playerKeys = [];
	for (let playerNum = 0; playerNum < nPlayers; playerNum++) {
		all_enabled.push(true);
		all_disabled.push(false);
		let playerPath = makePath(nRows, nCols);

		let tries = 0;
		while (tries < 5 && playerPath.length < 2 * nRows) {
			playerPath = makePath(nRows, nCols);
			tries++;
		}
		playerPaths.push(playerPath);

		//select a key location
		let key = random(playerPath);
		playerKeys.push(key);
	}

	//create the grid
	let grid = [];
	for (let rowNum = 0; rowNum < nRows; rowNum++) {
		let row = [];
		for (let colNum = 0; colNum < nCols; colNum++) {
			//set the enabled list to random right now
			let enabled_list = [...all_disabled];
			let key = false;
			for (let playerNum = 0; playerNum < nPlayers; playerNum++) {
				for (let [px, py] of playerPaths[playerNum]) {
					if (px == rowNum && py == colNum) {
						enabled_list[playerNum] = true;
						break;
					}
				}

				//check if its a key
				if (
					rowNum == playerKeys[playerNum][0] &&
					colNum == playerKeys[playerNum][1]
				) {
					key = playerNum;
					// console.log("KEY", key, rowNum, colNum);
				}
			}

			let grid_entry = {
				//position info
				row: rowNum,
				col: colNum,

				//drawing info
				w: w,
				h: h,
				x: w * colNum,
				y: h * rowNum,

				//determines the background
				type: "grass",

				//objects
				key: key, //the index of a player if it is and false otherwise

				enabled: enabled_list,
			};

			row.push(grid_entry);

			// set starting values for players
			// will need to update for more than 2 players
			if (!starting[0] && enabled_list[0] && !enabled_list[1]) {
				starting[0] = { row: rowNum, col: colNum };
			}
			if (!starting[1] && enabled_list[1] && !enabled_list[0]) {
				starting[1] = { row: rowNum, col: colNum };
			}
		}
		grid.push(row);
	}
	return grid;
}

/**
 * draws the grid and all its elements
 */
function drawGrid(grid) {
	stroke("white");
	for (const row of grid) {
		for (const entry of row) {
			//background
			if (entry.type == "grass") {
				fill("#BFD281");
			}

			//enabled status drawing
			if (entry.enabled.every((e) => e == false)) {
				//all false
				fill("black");
				rect(entry.x, entry.y, entry.w, entry.h);
			} else if (entry.enabled.every((e) => e == true)) {
				rect(entry.x, entry.y, entry.w, entry.h);
			} else {
				for (let playerNum = 0; playerNum < nPlayers; playerNum++) {
					if (entry.enabled[playerNum]) {
						fill(playerColors[playerNum]);
						rect(entry.x, entry.y, entry.w, entry.h);
					}
				}
			}

			if (typeof entry.key === "number") {
				push();
				fill(playerColors[entry.key]);
				ellipse(entry.x + entry.w / 2, entry.y + entry.h / 2, 10, 10);
				pop();
			}
		}
	}
}

/**
 * Check cell to validate a player's move
 * returns an object to determine if the player can move to that cell
 * and if the cell holds the player's key
 */
function checkCell(grid, playerIdx, rIdx, cIdx) {
	const entry = grid[rIdx][cIdx];
	const validMove = entry.enabled[playerIdx];
	const isMyKey = entry.key === playerIdx;
	return { validMove, isMyKey };
}
