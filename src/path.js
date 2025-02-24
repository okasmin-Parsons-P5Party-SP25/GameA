function makePath(num_rows,num_cols){
    function getNbrs(p){
      let nbrs = []
      let pcol = p[0]
      let prow= p[1]
    
      if(prow>0){
        nbrs.push([pcol,prow-1])
      }
      
      if(prow<num_rows-1){
         nbrs.push([pcol,prow+1])
     
      }
      if(pcol>0){
        nbrs.push([pcol-1,prow])
      }
      
      if(pcol<num_cols-1){
         nbrs.push([pcol+1,prow])
      }
      return nbrs
    }
    
    //start the maze creation with a node in the top row
    let p_col = floor(random(0,num_rows-1))
    let p =[p_col, 0]
  
    let path = [p]
    while(p[1]<num_rows-1 && p!=undefined){ //before the end is hit
      let nbrs = getNbrs(p)
      let noncycle_nbrs = []
      for(let nbr of nbrs){
        let nbr_nbrs = getNbrs(nbr)
        let overlap_bool = overlaps(nbr_nbrs, path)
        if(!overlap_bool){
            noncycle_nbrs.push(nbr)
        }
  
      }
      
      //now select a random non cycle neightbor to add 
      if(noncycle_nbrs.length == 0){
        break
      }
      p = random(noncycle_nbrs)
      path.push(p)
    }

    console.log('path', path)
    return path


}
function overlaps(l1, l2){//returns true if more than one overlap
    let overlap_count = 0
    for(const p1 of l1){
        for(const p2 of l2){
            if(p1[0]==p2[0] && p1[1]==p2[1]){
            overlap_count+=1
            if(overlap_count >1){
                return true
            }else{
                break
            }
            
        }
        }
        
    }
    return false
}
