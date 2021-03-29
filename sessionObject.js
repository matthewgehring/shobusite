class Session{
    
    player_one_socket;
    player_two_socket;

    gameState = {            //packaged data sent to frontend
        p1_name: "",
        p2_name: "",
        p1_score: 0,
        p2_score: 0,
        ties: 0,
        p1_turn: true,
        grid0: [0,0,0,
            0,0,0,
            0,0,0]

    }
    

    constructor(pl_one_name,pl_one_socket,code){
        this.gameState.p1_name = pl_one_name;
        this.player_one_socket = pl_one_socket;
        this.code = code;
        
        
        
    }

    JoinSession=(name,socket)=>{
        this.gameState.p2_name = name;
        this.player_two_socket = socket;
    }
    
    Broadcast=(event,data) => {
        this.player_one_socket.emit(event, data);
        this.player_two_socket.emit(event, data);
    }
  
    PlayerMove=(index,value)=> {
        this.gameState.grid0[index]=value;
        this.gameState.p1_turn = !this.gameState.p1_turn
    }

    checkWinner = () => {

        const grid0 = this.gameState.grid0;
    
    
        if(grid0[0]===grid0[1] &&
            grid0[1]===grid0[2]){
            
            if(grid0[0]===1){
                this.gameState.p1_score += 1;
                this.gameState.grid0 = [0,0,0,0,0,0,0,0,0];
                this.gameState.p1_turn = false;
                return "player_one";
            }
            else if(grid0[0]===-1){
                this.gameState.p2_score += 1;
                this.gameState.grid0 = [0,0,0,0,0,0,0,0,0];
                this.gameState.p1_turn = true;
                return "player_two";
            }
        }

        if(grid0[3]===grid0[4] &&
            grid0[4]===grid0[5]){
            
            if(grid0[3]===1){
                this.gameState.p1_score += 1;
                this.gameState.grid0 = [0,0,0,0,0,0,0,0,0];
                this.gameState.p1_turn = false;
                return "player_one";
            }
            else if(grid0[3]===-1){
                this.gameState.p2_score += 1;
                this.gameState.grid0 = [0,0,0,0,0,0,0,0,0];
                this.gameState.p1_turn = true;
                return "player_two";
            }
        }

        if(grid0[6]===grid0[7] &&
            grid0[7]===grid0[8]){
            
            if(grid0[6]===1){
                this.gameState.p1_score += 1;
                this.gameState.grid0 = [0,0,0,0,0,0,0,0,0];
                this.gameState.p1_turn = false;
                return "player_one";
            }
            else if(grid0[6]===-1){
                this.gameState.p2_score += 1;
                this.gameState.grid0 = [0,0,0,0,0,0,0,0,0];
                this.gameState.p1_turn = true;
                return "player_two";
            }
        }
    
    
        //vertical lines
        for(let j=0; j<3; j++){
            if(grid0[j]===grid0[j+3] &&
                grid0[j+3]===grid0[j+6] &&
                grid0[j]===grid0[j+6]
                ){
                    if(grid0[j] === 1){
                        this.gameState.p1_score += 1;
                        this.gameState.grid0 = [0,0,0,0,0,0,0,0,0];
                        this.gameState.p1_turn = false;
                        return "player_one";
                    }
                    else if(grid0[j]===-1){
                        this.gameState.p2_score += 1;
                        this.gameState.grid0 = [0,0,0,0,0,0,0,0,0];
                        this.gameState.p1_turn = true;
                        return "player_two";
                    }
                }
        }
        //diagonals
        if(grid0[0] === grid0[4] &&
            grid0[4] === grid0[8]){
                if(grid0[0] === 1){
                    this.gameState.p1_score += 1;
                    this.gameState.grid0 = [0,0,0,0,0,0,0,0,0];
                    this.gameState.p1_turn = false;
                    return "player_one";
                }
                else if(grid0[0] === -1){
                    this.gameState.p2_score += 1;
                    this.gameState.grid0 = [0,0,0,0,0,0,0,0,0];
                    this.gameState.p1_turn = true;
                    return "player_two";
                }
            }
    
        else if(grid0[2] === grid0[4] &&
                grid0[4] === grid0[6]){
                    if(grid0[2] === 1){
                        this.gameState.p1_score += 1;
                        this.gameState.grid0 = [0,0,0,0,0,0,0,0,0];
                        this.gameState.p1_turn = false;
                        return "player_one";
                    }
                    else if (grid0[2] === -1){
                        this.gameState.p2_score += 1;
                        this.gameState.grid0 = [0,0,0,0,0,0,0,0,0];
                        this.gameState.p1_turn = true;
                        return "player_two";
                    }
            }
    
        else{
            if(this.isFullBoard()){
                this.gameState.ties += 1;
                this.gameState.grid0 = [0,0,0,0,0,0,0,0,0];
                this.gameState.p1_turn = !this.gameState.p1_turn;
                return "tie";
            }
            

            
        }

        return "ongoing";
    
    

        
    }
    

    isFullBoard =()=> {
        for(let i=0;i<9;i++){
            if(this.gameState.grid0[i] === 0){
                
                return false;
            }
        }
    
        return true;
    }
        
}



module.exports = {
    Session:Session
}