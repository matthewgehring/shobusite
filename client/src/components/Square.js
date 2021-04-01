import React from 'react';
import socket from './../apis/port';

let moves = []

const Square = (props) => {
        
    
    const playerMove = (props) => {
        console.log("in moves");
        if (moves.length < 3){
            moves.push([ props.region, props.index])
            console.log(moves, "2")
        }else if(props.gameState.p1_turn === props.isPlayer_one
            && moves.length === 3){
                if(props.isPlayer_one){
                    console.log(3)
                    socket.emit("player-move", 'b', moves);
                    moves = [];
                    console.log("X");
                }
                else{
                    socket.emit("player-move", 'w', moves);
                    moves = [];
                    console.log("O");
                }
            }
        }

        const renderValue = (val) => { //converts a value index to a string
            if (val === "1"){
                //return "✖"
                return "/assets/black.png"
                
            }
            else if (val === "-1"){
                return "/assets/white.png"
                //return "○"
            }
            else{
                return false
            }
        }
    
    return(
        <div className="square-inner" onClick={playerMove.bind(null, props)}>
            {/* {this.renderValue(this.props.val)} */}
            {renderValue(props.val) && <img className="piece" src={renderValue(props.val)} alt="" />}
        </div>
    
    )
}
 
export default Square;