import React from 'react'
import Game from './Game'
import Waiting from './Waiting'
import socket from './../apis/port';

const Lobby = (props) => {
  
  const [state, setState] = React.useState(props);

  React.useEffect(()=>{
    console.log("#3 Lobby.js Useeffect")
    socket.on("update",(gs)=> {
      console.log("16 Lobby.js setstate");
      setState({
        ...state,
        gameState: gs
      })
    })
  }, [state.gameState]);

      
    return(
      <div>
        {props.waiting && <Waiting code={state.code}/>}
        {!props.waiting && <Game gameState={state.gameState} isPlayer_one={state.isPlayer_one}/>}
      </div>
  )
}

export default Lobby;