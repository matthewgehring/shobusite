import React from 'react';
import socket from './../apis/port';

let moves = []

const Square = (props) => {
        
    const [highlight, setHighlight] = React.useState(false);

    const playerMove = (props) => {
        setHighlight(!highlight);
        if (moves.length < 2){
            moves.push([ props.region, props.index])
        }else if(props.gameState.p1_turn === props.isPlayer_one
            && moves.length === 2){
                moves.push([ props.region, props.index])
                if(props.isPlayer_one){
                    setHighlight(!highlight);
                    socket.emit("player-move", '1', moves);
                    moves.length = 0;
                }
                else{
                    setHighlight(!highlight);
                    socket.emit("player-move", '2', moves);
                    moves.length = 0;
                }
            }
        }

        const renderValue = (val) => { //converts a value index to a string
            if (val === "1"){
                //return "✖"
                return "/assets/black.png"
                
            }
            else if (val === "2"){
                return "/assets/white.png"
                //return "○"
            }
            else{
                return false
            }
        }

        React.useEffect(()=>{
            setTimeout(()=>{
                setHighlight(false);
            }, 1000);
        }, [props])
    
    return(
        <div className={"square-inner" + (highlight ? " highlight" : "")} onClick={playerMove.bind(null, props)}>
            {renderValue(props.val) && <img className="piece" src={renderValue(props.val)} alt="" />}
        </div>
    
    )
}
 
export default Square;