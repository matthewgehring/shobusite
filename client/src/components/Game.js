import React from 'react'
import {motion,AnimatePresence} from 'framer-motion';
import Board from './Board';
import Stats from './Stats';
import Announcement from './Announcement';
import socket from './../apis/port';
import Chat from './Chat';

const initialState={
    announcement: false,
    message: "",
    OpponentDisconnected: false
  }

const Game = (props) => {
    const [state, setState] = React.useState(initialState);
    const [pulse, setPulse] = React.useState([0,0,1,1].map((x)=>x ^ props.isPlayer_one));

    

    React.useEffect(()=>{
        socket.on("announcement", (text)=>{
            switch (text){
              case "player_one":
                if(props.isPlayer_one){
                    setState({
                        ...state,
                        announcement:true,
                        message: "You Won!"
                    });
                }
                else{
                    setState({
                        ...state,
                        announcement:true,
                        message: "You Lost"
                    }
                  );
                }
                break;
              case "player_two":
                if(props.isPlayer_one){
                    setState({
                        ...state,
                        announcement:true,
                        message: "You Lost"
                    });
                }
                else{
                    setState({
                        ...state,
                        announcement:true,
                        message: "You Won!"
                    });
                }
                break;
              case "tie":
                  setState({
                    ...state,
                    announcement:true,
                    message: "Tie"
                    });
                break;
                //no default
            }

            setTimeout(()=>{
                setState({...state, announcement: false});
            }, 1250);
          })
      
          socket.on("user-disconnected", ()=>{
            setState({...state, OpponentDisconnected:true});
          })
    }, [state, props.isPlayer_one])

    return(
        <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:"100%"}}>
        {state.OpponentDisconnected &&
          <AnimatePresence>
            <motion.div style={{display:"flex", alignItems:"center", justifyContent:"center",height:"100%",position:"absolute",left:"0%",top:"0%",width:"100%"}}
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <h6>Opponent Disconnected :( </h6>
            </motion.div>
          </AnimatePresence>}
        {!state.OpponentDisconnected && 
        <div className="game">
          <div className={"board-container" + (props.isPlayer_one ? " rotate": "")}>
            <Board pulse = {pulse} region={0} gameState={props.gameState} isPlayer_one={props.isPlayer_one}/>
            <Board pulse = {pulse} region={1} gameState={props.gameState} isPlayer_one={props.isPlayer_one}/>
            <Board pulse = {pulse} region={2} gameState={props.gameState} isPlayer_one={props.isPlayer_one}/>
            <Board pulse = {pulse} region={3} gameState={props.gameState} isPlayer_one={props.isPlayer_one}/>
            
          </div>
          <div className="stats-container">
            {state.announcement && <Announcement>{state.message}</Announcement>}
            {!state.announcement && <Stats gameState={props.gameState} isPlayer_one={props.isPlayer_one}/>}
          </div>
          <div className="chat-container">
            <Chat props={props}/>
          </div>
        </div>
        }
        </div>
      )
}

export default Game;