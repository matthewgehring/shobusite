import React from 'react';
import socket from './../apis/port';

let moves = []

const Square = (props) => {
        
    const [highlight, setHighlight] = React.useState(false);
    const [invalidMove, setInvalidMove] = React.useState(false);
    //this might be an issue
    const playerMove = (props) => {
        setHighlight(!highlight);
        if (moves.length < 2){
            moves.push([ props.region*16 + props.index])
        }else if(props.gameState.p1_turn === props.isPlayer_one
            && moves.length === 2){
                moves.push([ props.region*16 + props.index])
                if(props.isPlayer_one){
                    setHighlight(!highlight);
                    socket.emit("player-move", 'b', moves);
                    moves.length = 0;
                }
                else{
                    setHighlight(!highlight);
                    socket.emit("player-move", 'w', moves);
                    moves.length = 0;
                }
            }
        }

        const renderValue = (val) => { //converts a value index to a string
            if (val === "b"){
                //return "✖"
                return "/assets/black.png"
                
            }
            else if (val === "w"){
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
                moves.length = 0;
            }, 50);
        }, [props.gameState.p1_turn])

        React.useEffect(()=>{
            socket.on("invalid-move", ()=>{
                setInvalidMove(true)
                moves.length = 0;
            })
        }, [])

        React.useEffect(()=>{
                setTimeout(()=>{
                    setInvalidMove(false)
                    setHighlight(false)
                    moves.length = 0;
                }, 300);
            }, [invalidMove])
    
    return(
        <div className={"square-inner" + (highlight ? " highlight" : "") + (highlight & invalidMove ? " invalidMove" : "")} onClick={playerMove.bind(null, props)}>
            {renderValue(props.val) && <img className="piece" src={renderValue(props.val)} alt="" />}
        </div>
    
    )
}
 
export default Square;