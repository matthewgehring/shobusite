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
    const [secondClick, setSecondClick] = React.useState(false)
    const name = props.isPlayer_one ? props.p1_name : props.gameState.p2_name

    React.useEffect(()=>{
      socket.on("invalid-move", ()=>{
        setPulse([0,0,1,1].map((x)=>x ^ props.isPlayer_one))
        setSecondClick(false)
      })
      socket.on("player-turn", ()=>{
        setPulse([0,0,1,1].map((x)=>x ^ props.isPlayer_one))
        setSecondClick(false)
      })    
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

    const regionClick = (props, region) => {
      const board = props.isPlayer_one ? 'b' : 'w';
      const validBoards = {'b' : {0 : [0,1,0,1],
                                  1 : [1,0,1,0],
                                  2 : [1,1,0,0],
                                  3 : [1,1,0,0]},  
                          'w' : { 0 : [0,0,1,1],
                                  1 : [0,0,1,1],
                                  2 : [0,1,0,1],
                                 3 : [1,0,1,0]}
                              } 
      if(secondClick){
        setPulse(validBoards[board][region])
      } else {
        setSecondClick(true)
      }
    }

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
            <div onClick={() => regionClick(props, 0)}><Board pulse = {pulse} region={0} gameState={props.gameState} isPlayer_one={props.isPlayer_one}/></div>
            <div onClick={() => regionClick(props, 1)}><Board pulse = {pulse} region={1} gameState={props.gameState} isPlayer_one={props.isPlayer_one}/></div>
            <div onClick={() => regionClick(props, 2)}><Board pulse = {pulse} region={2} gameState={props.gameState} isPlayer_one={props.isPlayer_one}/></div>
            <div onClick={() => regionClick(props, 3)}><Board pulse = {pulse} region={3} gameState={props.gameState} isPlayer_one={props.isPlayer_one}/></div>
            
          </div>
          <div className="stats-container">
            {state.announcement && <Announcement>{state.message}</Announcement>}
            {!state.announcement && <Stats gameState={props.gameState} isPlayer_one={props.isPlayer_one}/>}
          </div>
          <div className="chat-container">
            <Chat name = {name} code={props.code} props={props}/>
          </div>
        </div>
        }
        </div>
      )
}

export default Game;