import React, { Component } from 'react'
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
                    grid0: [0,0,0,
                        0,0,0,
                        0,0,0]
            
                }
    
            }

const Container = () => {
    const [state, setState] = React.useState(initialState)

    React.useEffect(()=>{
        socket.on("session-created",(user,code)=>{setState({
            ...state,
            landing:false,
            lobby:true,
            lobby_waiting:true,
            pl_one_name: user,
            code:code,
            isPlayer_one:true //if you created the session, you are player one. 
        })})

        socket.on("valid-code",(gs)=>{
            console.log("gs", gs)
            setState({
                ...state,
                lobby_waiting: false,
                landing:false,
                lobby:true,
                gameState: {...gs}
           })       
        })
    }, [state]);

    return (
        <div>
            {state.landing && <Landing/>}
     
            {state.lobby && <Lobby gamestate={state.gameState} waiting={state.lobby_waiting} code={state.code} isPlayer_one={state.isPlayer_one} /> }
        </div>
    )
}
export default Container;