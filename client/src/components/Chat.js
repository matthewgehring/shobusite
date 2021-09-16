import React from 'react'
import MessageInput from './MessageInput'
import Messages from './Messages'
import socket from './../apis/port';

const Chat = (props) => {
    
    return (
        <div className="chat">
            <Messages code={props.code}/>
            <MessageInput code={props.code}/>
        </div>
    )
}

export default Chat