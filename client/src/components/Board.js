import React from 'react';
import Square from './Square';

const Board = (props) => {
    
    return (
        <div className="board">
            {props.gameState.grids[props.region].map((value,index) => {
                return <Square region={props.region} val={value.toString()} key={index} index={index} isPlayer_one={props.isPlayer_one} gameState={props.gameState}/>
            }) }
        </div>
    )  
}
export default Board; 