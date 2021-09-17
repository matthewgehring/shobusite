import React, {useState, useEffect} from 'react'
import messageSocket from './../apis/messagePort';

function Messages(props) {
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const messageListener = (message) => {
      setMessages((prevMessages) => {
        console.log(prevMessages)
        const newMessages = {...prevMessages};
        newMessages[message.id] = message;
        return newMessages;
      });
      console.log(messages)
    };
  
    const deleteMessageListener = (messageID) => {
      setMessages((prevMessages) => {
        const newMessages = {...prevMessages};
        delete newMessages[messageID];
        return newMessages;
      });
    };
  
    messageSocket.on('message', messageListener);
    messageSocket.on('deleteMessage', deleteMessageListener);
    messageSocket.emit('getMessages');

    return () => {
      messageSocket.off('message', messageListener);
      messageSocket.off('deleteMessage', deleteMessageListener);
    };
  }, []);

  return (
    <div className="message-list">
      {[...Object.values(messages)]
        .sort((a, b) => a.time - b.time)
        .map((message) => (
          <div
            key={message.id}
            className="message-container"
            title={`Sent at ${new Date(message.time).toLocaleTimeString()}`}
          >
            <span className="user">{message.user.name}:</span>
            <span className="message">{message.value}</span>
            <span className="date">{new Date(message.time).toLocaleTimeString()}</span>
          </div>
        ))
      }
    </div>
  );
}

export default Messages;