const {spawn} = require('child_process');

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
        grids: [[1,1,1,1,
            0,0,0,0,
            0,0,0,0,
            -1,-1,-1,-1],
            [1,1,1,1,
            0,0,0,0,
            0,0,0,0,
            -1,-1,-1,-1],
            [1,1,1,1,
            0,0,0,0,
            0,0,0,0,
            -1,-1,-1,-1],
            [1,1,1,1,
            0,0,0,0,
            0,0,0,0,
            -1,-1,-1,-1]]
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
        console.log("moves", moves[0][0])
        let moveArr = moves.map(move => `${move[0]}, ${ ~~(move[1]/4)}, ${move[1]%4}`)
        console.log(moveArr)
        let board = this.getBoard(player, moveArr)
        console.log("made it", board);
        //this.gameState.grids[region][index]=value;
        //this.gameState.p1_turn = !this.gameState.p1_turn
    }

    getBoard = (player, moveArr) => {
        console.log("here", player)
        var dataToSend = [];
        // spawn new child process to call the python script
        const python = spawn('python', ['legality_check.py', player, moveArr[0], moveArr[1], moveArr[2]]);
        // collect data from script
        python.stdout.on('data', (data) => {
        console.log('Pipe data from python script ...');
        dataToSend.push(data.toString());
        console.log(dataToSend);
        });
        // in close event we are sure that stream from child process is closed
        python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        })
    }

    checkWinner = () => {
        return "ongoing";
    }
        
}



module.exports = {
    Session:Session
}