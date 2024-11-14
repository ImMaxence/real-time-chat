import React, { useEffect, useState } from 'react';
import { getGroupMessages } from '../services/groupService'

const ContainerChat = ({ currentGroupId, socket }) => {

    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await getGroupMessages(currentGroupId)
                setMessages(res.data.messages);
            } catch (error) {
                setError(error)
            }
        }

        fetchMessages()

        // Vérifie que le socket est défini avant d'ajouter l'écouteur
        if (socket) {
            socket.on('receiveMessage', (newMessage) => {
                console.log("📩 Nouveau message reçu dans ContainerChat:", newMessage);
                if (newMessage.groupId === currentGroupId) {
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                }
            });
        }

        // Supprime l'écouteur pour éviter des conflits
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
                <p key={msg.id}>Message : {msg.text}</p>
            ))}
        </div>
    );
};

export default ContainerChat;