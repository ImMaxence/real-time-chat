import { React, useState, useEffect, useRef } from 'react';
import Groups from '../components/Groups';
import { useAuth } from '../components/ProtectedRoute';
import ContainerChat from '../components/ContainerChat';
import SendMessage from '../components/SendMessage';
import { io } from 'socket.io-client';

const HomePage = () => {
    const data = useAuth(); // id, username, image, password, role of current user
    const [groupId, setGroupId] = useState(1); // 1 is the general group
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(process.env.REACT_APP_URL_SOCKET, {
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            timeout: 5000,
        });

        socketRef.current.on('connect', () => {
            setIsSocketConnected(true);
            console.log('📱 - Socket connecté:', socketRef.current.id);
        });

        socketRef.current.on('disconnect', () => {
            setIsSocketConnected(false);
            console.log('❌ Déconnecté du serveur Socket.IO');
        });

        socketRef.current.on('receiveMessage', (message) => {
            console.log('📩 Message reçu dans HomePage:', message);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Home Page</h1>
            <Groups userId={data.data.userId} />
            {isSocketConnected ? (
                <>
                    <ContainerChat currentGroupId={groupId} socket={socketRef.current} />
                    <SendMessage currentGroupId={groupId} socket={socketRef.current} />
                </>
            ) : (
                <p>Connexion au serveur en cours...</p>
            )}
        </div>
    );
};

export default HomePage;
