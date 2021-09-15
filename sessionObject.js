const Rules = require("./Rules.js").Rules;

//the sesssion object
class Session{
    //each session has 2 players represented by these sockets which are created in server.js
    player_one_socket;
    player_two_socket;

    //packaged data sent to frontend
    gameState = {            
        p1_name: "",
        p2_name: "",
        p1_score: 0,
        p2_score: 0,
        ties: 0,
        p1_turn: true,
        grids: [['b','b','b','b',
            'x','x','x','x',
            'x','x','x','x',
            'w','w','w','w'],
            ['b','b','b','b',
            'x','x','x','x',
            'x','x','x','x',
            'w','w','w','w'],
            ['b','b','b','b',
            'x','x','x','x',
            'x','x','x','x',
            'w','w','w','w'],
            ['b','b','b','b',
            'x','x','x','x',
            'x','x','x','x',
            'w','w','w','w']]
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
    
    SwitchTurn=() => {
        this.player_one_socket.emit("player-turn", this.gameState.p1_turn)
        this.player_two_socket.emit("player-turn", !this.gameState.p1_turn)
    }
    
    Broadcast=(event,data) => {
        this.player_one_socket.emit(event, data);
        this.player_two_socket.emit(event, data);
        this.SwitchTurn()
    }

    InvalidBroadcast=(event, player) => {
        if(player == "b"){
            this.player_one_socket.emit(event, player)
        } else{
            this.player_two_socket.emit(event, player)
        }
    }
  
    PlayerMove=(player, moves)=> {
        this.getBoard(player, moves)
    }

    updateBoard = (board) => {
        // console.log(data);
        //takes a list of lists and then sets each corresponding region to the array
        let counter = 0
        for(let idx=0; idx<4; idx++){
            for(let index=0; index<16; index++){
                this.gameState.grids[idx][index] = board[counter]
                counter += 1
            }
        }
        this.gameState.p1_turn = !this.gameState.p1_turn
        this.Broadcast("update",this.gameState);
    }

    getBoard = (player, moves) => {
        let flatBoard = this.gameState.grids.flat()
        let rules = new Rules(flatBoard)
        let board = rules.updateBoard(moves[0][0], moves[1][0], moves[2][0], player, flatBoard)
        if(typeof(board) == "boolean"){
            console.log("here we should broadcast error and cause the board to do something")
            this.InvalidBroadcast("invalid-move", player);
        } else {
            this.updateBoard(board)
        }
    }

    checkWinner = () => {
        return "ongoing";
    }
        
}

module.exports = {
    Session:Session
}