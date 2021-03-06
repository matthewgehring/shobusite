import React from 'react'
import Landing from "./landing";
import Lobby from './Lobby';
import socket from './../apis/port';

let initialState = {
                landing:true,
                lobby:false,
    
                pl_one_name:"",
                lobby_waiting:true,
                code:"",
                isPlayer_one:false,
    
                gameState: {            
                    p1_name: "",
                    p2_name: "",
                    p1_score: 0,
                    p2_score: 0,
                    ties: 0,
                    p1_turn: true,
                    grids: [['b','b','b','b',
                    'x','x','x','x',
                    'x','x','x','x',
                    'w','w','w','w'],
                    ['b','b','b','b',
                    'x','x','x','x',
                    'x','x','x','x',
                    'w','w','w','w'],
                    ['b','b','b','b',
                    'x','x','x','x',
                    'x','x','x','x',
                    'w','w','w','w'],
                    ['b','b','b','b',
                    'x','x','x','x',
                    'x','x','x','x',
                    'w','w','w','w']]
            
                }
    
            }

const Container = () => {
    let [state, setState] = React.useState(initialState);
    let [didMount, setDidMount] = React.useState(false);    
    React.useEffect(()=>{
        setDidMount(true)
        socket.on("session-created",(user,serverCode)=>{
            setState({
            ...state,
            landing:false,
            lobby:true,
            lobby_waiting:true,
            pl_one_name: user,
            code:serverCode,
            isPlayer_one:true //if you created the session, you are player one. 
        })
    }
    
    )

        socket.on("valid-code", (gs) =>{ 
            //setClientCode(serverCode)
            setState({
                ...state,
                code: gs.code,
                lobby_waiting: false,
                landing:false,
                lobby:true,
                gameState: {...gs}
           })
        })      
        return () => {
            setDidMount(false);
        }
    }, [state]);

    if(!didMount){
        return null;
    }

    return (
        <div>
            {state.landing && <Landing/>}
     
            {state.lobby && <Lobby p1_name={state.pl_one_name} gameState={state.gameState} waiting={state.lobby_waiting} code={state.code} isPlayer_one={state.isPlayer_one} /> }
        </div>
    )
}
export default Container;