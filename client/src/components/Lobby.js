import React from 'react'
import Game from './Game'
import Waiting from './Waiting'
import socket from './../apis/port';

const Lobby = (props) => {
  
  const [state, setState] = React.useState(props);

  React.useEffect(()=>{
    socket.on("update",(gs)=> {
      setState({
        ...state,
        gameState: gs
      })
    })
  }, []);

      
    return(
      <div>
        {props.waiting && <Waiting code={state.code}/>}
        {!props.waiting && <Game p1_name={props.p1_name} code={state.code} gameState={state.gameState} isPlayer_one={state.isPlayer_one}/>}
      </div>
  )
}

export default Lobby;