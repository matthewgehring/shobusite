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
            2,2,2,2],
            [1,1,1,1,
            0,0,0,0,
            0,0,0,0,
            2,2,2,2],
            [1,1,1,1,
            0,0,0,0,
            0,0,0,0,
            2,2,2,2],
            [1,1,1,1,
            0,0,0,0,
            0,0,0,0,
            2,2,2,2]]
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
        let moveArr = moves.map(move => `${move[0]}, ${ ~~(move[1]/4)}, ${move[1]%4}`)
        console.log(moves)
        let board = this.getBoard(player, moveArr)
        //this.gameState.grids[region][index]=value;
        this.gameState.p1_turn = !this.gameState.p1_turn
    }

    updateBoard = (data) => {
        // console.log(data);
        for(let idx=0; idx<4; idx++){
            this.gameState.grids[idx] = data[idx].split('')
        }
        this.Broadcast("update",this.gameState);
    }

    getBoard = (player, moveArr) => {
        var dataToSend;
        // console.log(moveArr)
        // spawn new child process to call the python script
        // console.log(['legality_check.py', player, moveArr[0], moveArr[1], moveArr[2], `${this.gameState.grids[0]}`, `${this.gameState.grids[1]}`, `${this.gameState.grids[2]}`, `${this.gameState.grids[3]}`])
        const python = spawn('python', ['legality_check.py', player, moveArr[0], moveArr[1], moveArr[2], `${this.gameState.grids[0]}`, `${this.gameState.grids[1]}`, `${this.gameState.grids[2]}`, `${this.gameState.grids[3]}`]);
        // collect data from script
        python.stdout.on('data', (data) => {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
        dataToSend = dataToSend.replace(/(\r\n|\r|\n)/, '')
        if(!dataToSend.includes("Error")){
            this.updateBoard(dataToSend.split('$'));
        } else {
            this.Broadcast("update",this.gameState);
        }
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