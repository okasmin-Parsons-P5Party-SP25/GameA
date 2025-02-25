let allow_overlap_prob = 0;

Object.assign(window, {
	makePath,
	overlaps,
	sortPath,
});

function makePath(num_rows, num_cols, playerIdx) {
	//starting positions for players by index
  	let player_start_pos = [[0,0], [0,num_cols-1]]

	//helper function
	function getNbrs(p) {
		let nbrs = [];
		let pcol = p[0];
		let prow = p[1];

		if (prow > 0) {
			nbrs.push([pcol, prow - 1]);
		}

		if (prow < num_rows - 1) {
			nbrs.push([pcol, prow + 1]);
		}
		if (pcol > 0) {
			nbrs.push([pcol - 1, prow]);
		}

		if (pcol < num_cols - 1) {
			nbrs.push([pcol + 1, prow]);
		}
		return nbrs;
	}

	//start the maze creation with a node in the top row

	let p = player_start_pos[0];
  let colBoundary = [num_rows *3/4, num_rows]
  if(playerIdx == 1){
    p = player_start_pos[1]
    colBoundary = [0,num_rows /4]
    
  }

	let path = [p];
  
  //keep creating the path while its outside the finish boundary
  function isFinished(p){
    let row_condition = p[0] >= num_rows*3/4 //end of the map
    let col_condition = colBoundary[0]<p[1] && p[1]<colBoundary[1] //other side of the board

    return row_condition && col_condition
  }
	while (!isFinished(p) ) {
		//before the end is hit
		let nbrs = getNbrs(p);
		let noncycle_nbrs = [];
		for (let nbr of nbrs) {
			let nbr_nbrs = getNbrs(nbr);
			let overlap_bool = overlaps(nbr_nbrs, path);
			if (!overlap_bool || random() < allow_overlap_prob) {
				noncycle_nbrs.push(nbr);
			}
		}

		//now select a random non cycle neightbor to add
		if (noncycle_nbrs.length == 0) {
			let r = random()
			if(r< .5 && nbrs.length >=1){
				console.log('here')
				noncycle_nbrs = [nbrs[0]]
			}else if (r< .8){
				noncycle_nbrs = nbrs
			}else{
				break;
			}
      		
			// break;
		}

		p = random(noncycle_nbrs);
		path.push(p);
	}

	// console.log("path", path);
	const sorted = sortPath(path);
	console.log("sorted path", sorted);
	return path;
}
function overlaps(l1, l2) {
	//returns true if more than one overlap
	let overlap_count = 0;
	for (const p1 of l1) {
		for (const p2 of l2) {
			if (p1[0] == p2[0] && p1[1] == p2[1]) {
				overlap_count += 1;
				if (overlap_count > 1) {
					return true;
				} else {
					break;
				}
			}
		}
	}
	return false;
}

// find the "first" cell on the player's path
// "first" is the cell closest to [0,0]
// function findMinCell(path) {
// 	let min = path[0];
// 	let distance = dist(0, 0, min[0], min[1]);
// 	for (let i = 1; i < path.length; i++) {
// 		if (dist(0, 0, path[i][0], path[i][i]) < distance) {
// 			min = path[i];
// 		}
// 	}
// 	console.log("min", min);
// 	console.log("distance", distance);
// 	return min;
// }

// find the "last" cell on the player's path
// "last" is the cell closest to [gridWidth, gridLength]
// function findMaxCell(path) {
// 	let max = path[0];
// 	let distance = dist(0, 0, max[0], max[1]);
// 	for (let i = 1; i < path.length; i++) {
// 		if (dist(0, 0, path[i][0], path[i][i]) > distance) {
// 			max = path[i];
// 		}
// 	}
// 	console.log("max", max);
// 	console.log("distance", distance);
// 	return max;
// }

function sortPath(path) {
	return path.sort((a, b) => {
		const dist1 = dist(0, 0, a[0], a[1]);
		const dist2 = dist(0, 0, b[0], b[1]);
		// console.log({ dist1, dist2 });
		if (dist1 < dist2) {
			return -1;
		} else return 1;
	});
}
