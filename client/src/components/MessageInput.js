import React from 'react'
import socket from './../apis/port';

const MessageInput = (props) => {
    return (
        <div className="message-input">
            <input placeholder="input here"></input>
        </div>
    )
}

export default MessageInput