import React from 'react';
import {InputGroup,Input, Button} from 'reactstrap';
import socket from '../apis/port';

const CreateSession = () => {

    const [state, setState] = React.useState({player1_name:""});

    const updateForm = (e) => {
        setState({
            player1_name: e.target.value
            }
        );

    }
    
    const createSession = (e) => {
        if(state.player1_name !== ""){
            socket.emit("create-session", state.player1_name);
        }
        else{
            e.preventDefault();
        }
    }

    return (
        <div className="session-page">
            <InputGroup  style={{width:"50%", margin:"auto"}}>
                <Input className="input-reset ba b--black-20 mt2 pa2 mb2 db w-100" placeholder="username" onChange={updateForm}/>
            </InputGroup>
                <Button className="f6 link dim ba br2 bw1 ph3 pv2 mb2 dib black bg-moon-gray" style={{width:"50%", margin:"auto"}} color="primary" onClick={createSession}>Create & Join</Button>
        </div>
    )
}

export default CreateSession;