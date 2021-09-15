import React from 'react'
import MessageInput from './MessageInput'
import Messages from './Messages'
import socket from './../apis/port';

const Chat = (props) => {
    return (
        <div className="chat">
            <Messages/>
            <MessageInput/>
        </div>
    )
}

export default Chat