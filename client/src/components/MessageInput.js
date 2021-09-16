import React from 'react'
import messageSocket from './../apis/messagePort';

const MessageInput = (props) => {
    const [message, setMessage] = React.useState("")

    const handleSubmit = (event) => {
        event.preventDefault();
        messageSocket.emit('message', message)
        setMessage('')
    }

    return (
        <form onChange={e => setMessage(e.target.value)} onSubmit={handleSubmit} className="message-input">
            <input type="text" value={message} placeholder="input here"></input>
        </form>
    )
}

export default MessageInput