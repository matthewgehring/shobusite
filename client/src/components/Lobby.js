import React from 'react'
import Game from './Game'
import Waiting from './Waiting'
import socket from './../apis/port';

const Lobby = (props) => {
  
  const [state, setState] = React.useState(props);

  React.useEffect(()=>{
    socket.on("update",(gs)=> {
      console.log("got hit")
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