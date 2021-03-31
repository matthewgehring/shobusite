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
        let row = ~~(index/4);
        let col = index % 4;

        this.gameState.grids[region][index]=value;
        this.gameState.p1_turn = !this.gameState.p1_turn
    }

    getBoard = (region, row, col, player) => {
        var dataToSend = [];
        // spawn new child process to call the python script
        const python = spawn('python', ['legality_check.py', player, region, row]);
        // collect data from script
        python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend.push(data.toString());
        });
        // in close event we are sure that stream from child process is closed
        python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        })
        return dataToSend;
    }

    checkWinner = () => {
        return "ongoing";
    }
        
}



module.exports = {
    Session:Session
}