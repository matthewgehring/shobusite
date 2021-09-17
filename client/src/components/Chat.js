import React from 'react'
import MessageInput from './MessageInput'
import Messages from './Messages'
import messageSocket from './../apis/messagePort';

const Chat = ({code, name}) => {
    React.useEffect(()=>{
        messageSocket.emit("joined-chat", code)
    },[])
    return (
    <>
        <div className="chat-messages">
            <Messages code={code}/>
        </div>
        <div className="chat-input">
            <MessageInput name={name} code={code}/>
        </div>
    </>
    )
}

export default Chat