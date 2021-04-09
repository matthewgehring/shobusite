import React from 'react';
import socket from './../apis/port';

let moves = []

const Square = (props) => {
        
    const [highlight, setHighlight] = React.useState(false);

    const playerMove = (props) => {
        console.log("17 Square.js setstate");
        setHighlight(!highlight);
        if (moves.length < 2){
            moves.push([ props.region, props.index])
        }else if(props.gameState.p1_turn === props.isPlayer_one
            && moves.length === 2){
                moves.push([ props.region, props.index])
                if(props.isPlayer_one){
                    console.log("18 Square.js setstate");
                    setHighlight(!highlight);
                    socket.emit("player-move", '1', moves);
                    moves.length = 0;
                }
                else{
                    console.log("19 Square.js setstate");
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
            console.log("#4 Square.js Useeffect")
            setTimeout(()=>{
                console.log("20 Square.js setstate");
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