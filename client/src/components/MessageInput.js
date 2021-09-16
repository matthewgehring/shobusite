import React from 'react'
import messageSocket from './../apis/messagePort';

const MessageInput = (props) => {
    const [message, setMessage] = React.useState("")

    const handleSubmit = (event) => {
        event.preventDefault();
        messageSocket.emit('message', props.code, message, `${props.name}`)
        setMessage('')
    }

    return (
        <form onChange={e => setMessage(e.target.value)} onSubmit={handleSubmit} className="message-input">
            <input className="input pa2 w-100" type="text" value={message} placeholder="input here"></input>
        </form>
    )
}

export default MessageInput