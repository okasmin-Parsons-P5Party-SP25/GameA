const nPlayers = 2;

//constants
const nRows = 6;
const nCols = nRows;
const gridWidth = 500;
const gridHeight = 500;
const w = gridWidth / nCols; //cell width
const h = gridHeight / nRows; //cell height

Object.assign(window, {
	createGrid,
	checkCell,
});

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
		let playerPath = makePath(nRows, nCols, playerNum);

		let tries = 0;
		while (tries < 5 && playerPath.length < 2 * nRows) {
			playerPath = makePath(nRows, nCols, playerNum);
			tries++;
			console.log("tries", tries);
		}
		playerPaths.push(playerPath);
		console.log(playerPath[playerPath.length - 1]);
		let key = playerPath[playerPath.length - 1];
		playerKeys.push(key);
	}

	//checks if the inputed rowNum, colNum is a corner of any path
	function tileInfo(rowNum, colNum, playerNum){
		let nbrs = getNbrs([rowNum, colNum]) 
		let nbr_above = false
		let nbr_below= false
		let nbr_left= false
		let nbr_right= false
		let nbr_types = []

		for(let [nbr_rowNum, nbr_col] of nbrs){
			for (let [path_rowNum, path_col] of playerPaths[playerNum]){
				//only interested if the nbr is in the path
				if(nbr_rowNum == path_rowNum && nbr_col == path_col){
					if(nbr_rowNum == rowNum){ //same row so check left and right
						if(nbr_col<colNum){
							nbr_types.push('left')
							nbr_left= true
						}else if(nbr_col>colNum){
							nbr_types.push('right')
							nbr_right= true
						}

					}else if(nbr_col == colNum){ //same row so check above and below
						if(nbr_rowNum<rowNum){
							nbr_above = true
							nbr_types.push('top')
						}else if(nbr_rowNum>rowNum){
							nbr_below= true
							nbr_types.push('bottom')
						}

					}	
				}

			}
		}	
		nbr_types = [... new Set(nbr_types)]
		if(nbr_types.length == 4){
			return ['d',0]
		}else if(nbr_types.length == 3){
			if(nbr_below == false){
				return ['c',180]

			}else if(nbr_above == false){
				return ['c',0]

			}else if(nbr_left == false){
				return ['c',-90]
			}else{
				return ['c',90]
			}
			
		}else if(nbr_types.length == 2){
			if((nbr_left &&nbr_right)){ //in a line
				return ['b',0]
			}else if((nbr_above && nbr_below)){
				return ["b",90]
			}else{
				if(nbr_below == false && nbr_left == false){ //bottom left
					return ["a", -90]
				}else if(nbr_below == false&& nbr_right == false){
					return ["a", -180]
				}else if(nbr_above == false&& nbr_right == false){			
					return ["a",90]
				}else if(nbr_above == false && nbr_left == false){	
					return ["a",0]
				}
			}
		}else{
			return ['b',90]
		}

	}

	//create the grid
	let grid = [];
	for (let rowNum = 0; rowNum < nRows; rowNum++) {
		let row = [];
		for (let colNum = 0; colNum < nCols; colNum++) {
			//set the enabled list based on the paths
			let enabled_list = [...all_disabled];
			let key = false;
			let type = 'grass'
			let tileType = false

			for (let playerNum = 0; playerNum < nPlayers; playerNum++) { //check if its in each player path
				for (let [px, py] of playerPaths[playerNum]) {
					if (px == rowNum && py == colNum) { //if its in the paths
						type = 'water'
						tileType = tileInfo(rowNum, colNum,playerNum);
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
				type: type,
				tile_info:tileType,

				//objects
				key: key, //the index of a player if it is and false otherwise

				enabled: enabled_list,
			};

			row.push(grid_entry);
		}
		grid.push(row);
	}
	return grid;
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


function getNbrs(p) {
	let nbrs = [];
	let pcol = p[0];
	let prow = p[1];

	if (prow > 0) {
		nbrs.push([pcol, prow - 1]);
	}

	if (prow < nRows - 1) {
		nbrs.push([pcol, prow + 1]);
	}
	if (pcol > 0) {
		nbrs.push([pcol - 1, prow]);
	}

	if (pcol < nCols - 1) {
		nbrs.push([pcol + 1, prow]);
	}
	return nbrs;
}