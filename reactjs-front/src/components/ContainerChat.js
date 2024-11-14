import React, { useEffect, useState } from 'react';
import { getGroupMessages } from '../services/groupService';

const ContainerChat = ({ currentGroupId, socket }) => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await getGroupMessages(currentGroupId);
                setMessages(res.data.messages);
            } catch (error) {
                setError(error);
            }
        };

        fetchMessages();

        if (socket) {
            socket.on('receiveMessage', (newMessage) => {
                if (newMessage.groupId === currentGroupId) {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            id: newMessage.id || new Date().getTime(),
                            text: newMessage.message,
                            username: newMessage.username,
                            createdAt: newMessage.timestamp,
                            image: newMessage.image
                        }
                    ]);
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('receiveMessage');
            }
        };

    }, [currentGroupId, socket]);

    return (
        <div style={{ background: 'red', padding: '10px' }}>
            <p>Container chat - Groupe {currentGroupId}</p>
            {error && <p className='error'>{error}</p>}
            {messages.map((msg) => (
                <div key={msg.id} style={{ marginBottom: '10px' }}>
                    <strong>{msg.username}</strong> - <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    <p>{msg.text}</p>
                    {msg.image && <img src={msg.image} alt="msg" />}
                </div>
            ))}
        </div>
    );
};

export default ContainerChat;
