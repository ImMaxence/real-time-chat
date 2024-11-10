import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const Groups = ({ userId, username }) => {
    const socketRef = useRef(null);
    const [group, setGroup] = useState('');
    const [currentGroup, setCurrentGroup] = useState('');
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);

    useEffect(() => {

        socketRef.current = io(process.env.REACT_APP_URL_SOCKET, {
            withCredentials: true,
            reconnection: true,             // Activer la reconnexion automatique
            reconnectionAttempts: 10,       // Nombre de tentatives de reconnexion
            reconnectionDelay: 1000,        // Délai entre les tentatives de reconnexion
            timeout: 5000                   // Timeout avant d'abandonner la connexion
        });

        socketRef.current.on('receive_message', (data) => {
            setChat((prevChat) => [...prevChat, data]);
        });

        socketRef.current.on('connect', () => {
            console.log('🔌 - Connecté au serveur Socket.IO');
            if (currentGroup) {
                socketRef.current.emit('join_group', currentGroup);
            }
        });

        socketRef.current.on('disconnect', () => {
            console.log('❌ Déconnecté du serveur Socket.IO');
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [currentGroup]);

    const joinGroup = () => {
        if (group) {
            socketRef.current.emit('join_group', group);
            setCurrentGroup(group);
            setGroup('');
            setChat([]);
        }
    };

    const leaveGroup = () => {
        if (currentGroup) {
            socketRef.current.emit('leave_group', currentGroup);
            setCurrentGroup('');
            setChat([]);
        }
    };

    const sendMessage = () => {
        if (message && currentGroup) {
            const messageData = { group: currentGroup, message, username };
            socketRef.current.emit('send_message', messageData);
            setMessage('');
        }
    };

    return (
        <div>
            <h1>Groupes de l'utilisateur</h1>
            <p>ID utilisateur : {userId}</p>
            <p>Nom d'utilisateur : {username}</p>

            <div>
                <input
                    type="text"
                    placeholder="Nom du groupe"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                />
                <button onClick={joinGroup}>Rejoindre le groupe</button>
                <button onClick={leaveGroup} disabled={!currentGroup}>Quitter le groupe</button>
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage} disabled={!currentGroup}>Envoyer le message</button>
            </div>

            <div>
                <h2>Groupe Actuel : {currentGroup || 'Aucun'}</h2>
                <div>
                    {chat.map((msg, index) => (
                        <div key={index}>
                            <p>
                                <strong>{msg.username}</strong> ({new Date(msg.timestamp).toLocaleString()}):<br />
                                {msg.message}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Groups;
