import React, { Component, useState } from 'react'
import {motion,AnimatePresence} from 'framer-motion';
import {Button, Spinner} from 'reactstrap';
import Game from './Game'
import Waiting from './Waiting'
import Board from './Board';
import Stats from './Stats';
import Announcement from './Announcement';
import socket from './../apis/port';


export default class Lobby extends Component {
    
    constructor(props){
      console.log("hello mojo", props)
      super(props);
      this.state = {
    
        isPlayer_one:this.props.isPlayer_one,
        code: this.props.code,
        gamestate: this.props.gamestate
        
        
      }
    }



    componentDidMount=()=>{
      console.log(this.state.gamestate)
      socket.on("update",(gamestate)=> {
        console.log("passed", gamestate)
        this.setState({gamestate: gamestate})
        
      })
    }


    
    render=()=>{

      
      const gamestate = this.state.gamestate;
      
      return(
        <div>
          {this.props.waiting && <Waiting code={this.state.code}/>}
          {!this.props.waiting && <Game gamestate={gamestate} isPlayer_one={this.props.isPlayer_one}/>}
        </div>
    )
      
    }
}