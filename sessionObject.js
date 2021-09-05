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
    
    Broadcast=(event,data) => {
        this.player_one_socket.emit(event, data);
        this.player_two_socket.emit(event, data);
    }
  
    PlayerMove=(player, moves)=> {
        console.log(player, moves)
        this.getBoard(player, moves)
        this.gameState.p1_turn = !this.gameState.p1_turn
    }

    updateBoard = (data) => {
        // console.log(data);
        //takes a list of lists and then sets each corresponding region to the array
        for(let idx=0; idx<4; idx++){
            this.gameState.grids[idx] = data[idx].split('')
        }
        this.Broadcast("update",this.gameState);
    }

    getBoard = (player, moves) => {
        let flatBoard = this.gameState.grids.flat()
        console.log(flatBoard)
        let rules = new Rules(flatBoard)
        let board = rules.updateBoard(moves[0], moves[1], moves[2], player, flatBoard)
        console.log(board)
    }

    checkWinner = () => {
        return "ongoing";
    }
        
}

module.exports = {
    Session:Session
}