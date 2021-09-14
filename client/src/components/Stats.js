import React, { Component} from 'react'
import { Spinner,Table } from 'reactstrap';
import {AnimatePresence, motion} from 'framer-motion';

export default class Stats extends Component {
    centeredStyle = {
        display:"flex",
        alignItems: "center",
        justifyContent:"center"
    }

    render() {
        const gameState = this.props.gameState;
        const isPlayer_one = this.props.isPlayer_one;
        const opponent_name = (isPlayer_one)? gameState.p2_name : gameState.p1_name;
        const wins = (isPlayer_one)?gameState.p1_score:gameState.p2_score;
        const losses = (isPlayer_one)?gameState.p2_score:gameState.p1_score;
        const ties = gameState.ties;
        return (
            <AnimatePresence>
            <motion.div className="stats bg-moon-gray br4 ba b--black-10 mv4 w-100 w-50 shadow-5 w-100  center" initial={{opacity:1}} animate={{opacity:1}} exit={{opacity:0}}>
                {gameState.p1_turn === isPlayer_one &&
                    <div className="turn" >
                        <h5>Your Turn</h5>
                    </div>}

                {gameState.p1_turn !== isPlayer_one &&
                    <div className="turn" >
                        <h5>{opponent_name}'s Turn</h5>
                        
                        {/* this can be used for loading <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                            <Spinner color="dark" ></Spinner>
                        </div> */}
                    </div>}

                <div style={{width:"100%", height:"100%", display:"grid", gridTemplateRows:"1fr 1fr",gridTemplateColumns:"1fr 1fr 1fr"}}>
                    <div style={this.centeredStyle}>
                        <p>Wins</p>    
                    </div>
                    <div style={this.centeredStyle}>
                        <p>Ties</p>    
                    </div>
                    <div style={this.centeredStyle}>
                        <p>Losses</p>    
                    </div>

                    <div style={this.centeredStyle}>
                        <p>{wins}</p>    
                    </div>
                    <div style={this.centeredStyle}>
                        <p>{ties}</p>    
                    </div>
                    <div style={this.centeredStyle}>
                        <p>{losses}</p>    
                    </div>
                    
                </div>
                    
            </motion.div>
            </AnimatePresence>
        )
    }
}
