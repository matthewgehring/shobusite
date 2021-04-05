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
            <InputGroup style={{width:"95%", margin:"0 auto"}}>
                <Input placeholder="username" onChange={updateForm}/>
            </InputGroup>
                <Button className="session-btn" color="primary" onClick={createSession}>Create & Join</Button>
        </div>
    )
}

export default CreateSession;