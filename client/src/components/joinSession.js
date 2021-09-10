import React, { Component } from 'react';
import {InputGroup,InputGroupAddon,Input,InputGroupText, Button} from 'reactstrap';
import {motion,AnimatePresence} from 'framer-motion';
import socket from './../apis/port';
import io from 'socket.io-client';

export default class joinSession extends Component {
    state = {
        "code": "",
        "name": "",
        invalid: false
    }
    updateForm = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        
    }

    submitForm = () => {
        if(this.state["code"] !== "" && this.state["name"] !== "" ){
            socket.emit("join-session",this.state.code,this.state.name);
        }
        // TODO: else give a prompt
    }

    componentDidMount(){
        socket.on("invalid-code",()=>{
            this.setState({invalid:true});
        })
        
    }

    render() {
        return (
            
            <div className="session-page" >
                
                <InputGroup style={{width:"50%", margin:"0 auto"}}>
                    <Input className="input-reset ba b--black-20 mt2 pa2 mb2 db w-100" onChange={this.updateForm} name="name" placeholder="username"/>
                </InputGroup>
                <InputGroup style={{width:"50%", margin:"0 auto"}}>
                    <Input className="input-reset ba b--black-20 pa2 mb2 db w-100"onChange={this.updateForm} name="code" placeholder="session code"/>
                </InputGroup>
                <Button className="f6 link dim ba br2 bw1 ph3 pv2 mb2 dib black bg-moon-gray" onClick={this.submitForm} style={{width:"30%", margin:"0 auto"}}  color="primary">Join Session</Button>
                
                {this.state.invalid &&
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                     <p style={{color:"red"}}>Invalid Session Code</p>
                </motion.div>}
                
            </div>
            
        )
    }
}
