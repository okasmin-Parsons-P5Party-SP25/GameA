
const nPlayers = 2
const playerColors = ['#EE4934', '#E6D040']


//constants
const nRows = 10
const nCols = 10




/**
 * Creates the Grid structure
 */
function createGrid(gridWidth,gridHeight){
    //cell sizes
    let w = gridWidth/nCols
    let h = gridHeight/nRows

    //template states
    let all_enabled= []
    let all_disabled= []
    let playerPaths = []
    for(let playerNum = 0; playerNum < nPlayers; playerNum ++){
        all_enabled.push(true)
        all_disabled.push(false)
        let playerPath = makePath(nRows, nCols)
        console.log("made path",playerPath)
        playerPaths.push(playerPath)
    }

    //create the grid
    let grid = []
    for(let rowNum = 0; rowNum < nRows; rowNum++){
        let row = []
        for(let colNum = 0; colNum < nCols; colNum++){
            //set the enabled list to random right now
            let enabled_list = [...all_disabled]
            for(let playerNum = 0; playerNum < nPlayers; playerNum ++){
            
                for(let [px, py] of playerPaths[playerNum]){
                    if(px == rowNum && py == colNum){
                        enabled_list[playerNum] = true
                        break
                    }
                }
            }
            console.log("row, col", rowNum, colNum, enabled_list)
            
            

            let grid_entry = {
                //position info
                "row":rowNum,
                "col":colNum,

                //drawing info
                "w":w,
                'h': h,
                'x':w *colNum,
                'y':h*rowNum,

                //determines the background
                "type": "grass",

                //objects
                "key": false, //the index of a player if it is and false otherwise

                'enabled':enabled_list,
            }
            
            row.push(grid_entry)
        
        }
        grid.push(row)
    }


    //set the key  to random right now
    let existingKeys = []
    for(let playerNum = 0; playerNum < nPlayers; playerNum ++){
        let keyPlaced = false
        let attempt_count = 0
        // console.log("PLAYER NUM", playerNum)
        while(!keyPlaced && attempt_count<5){
            let rand_row = floor(random(nRows));
            let rand_col = floor(random(nCols));
            if(! existingKeys.includes(`${rand_row}${rand_col}`)){
                grid[rand_row][rand_col].key = playerNum
                existingKeys.push(`${rand_row}${rand_col}`)
                keyPlaced = true
            }
            attempt_count++
            

        }
    }
    console.log("keys at:", existingKeys)
        
    return grid
}


/**
 * draws the grid and all its elements
 */
function drawGrid(grid){
    stroke('white')
    for(const row of grid){
        for(const entry of row){
            //background
            if(entry.type == 'grass'){
                fill('#BFD281')
            }

            //enabled status drawing
            if(entry.enabled.every(e=> e==false)){ //all false
                fill('black')
                rect(entry.x,entry.y,entry.w,entry.h)
            }else if(entry.enabled.every(e=> e==true)){
                rect(entry.x,entry.y,entry.w,entry.h)
            }else{
                for(let playerNum = 0; playerNum < nPlayers; playerNum ++){
                    if(entry.enabled[playerNum]){
                        fill(playerColors[playerNum])
                        rect(entry.x,entry.y,entry.w,entry.h)
                
                    }
                }
            }

            
                

            if(entry.key!=false){
                fill(playerColors[entry.key])
                ellipse(entry.x + entry.w/2,entry.y + entry.h/2,10,10)    

            }
        }
    }
}

/**
 * Return true if the grid entry is valid for the player to move to and false if it isnt
 * the grid entry is specified by the row, col index
 */
function checkCellValid(grid, playerIdx, rIdx, cIdx){
    let entry = grid[rIdx][cIdx]
    return entry.enabled[playerIdx]
}



