import React, {Component} from 'react';
import socket from './../apis/port';

 export default class Square extends Component{
    moves = []
    
    renderValue = (val) => { //converts a value index to a string
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

    playerMove = () => {
        if (this.moves.length < 3){
            this.moves.push([this.props.region, this.props.val])
        }else if(this.props.gameState.p1_turn === this.props.isPlayer_one
            && this.moves.length === 3){
                if(this.props.isPlayer_one){
                    socket.emit("player-move", 'b', this.moves);
                    console.log("X");
                }
                else{
                    socket.emit("player-move", 'w', this.moves);
                    console.log("O");
                }
        }
    }
    
    render(){
        return(
            <div className="square-inner" onClick={this.playerMove}>
                {/* {this.renderValue(this.props.val)} */}
                {this.renderValue(this.props.val) && <img className="piece" src={this.renderValue(this.props.val)} alt="" />}
            </div>
        
        )
    }
}
