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

    const handleGroupSelect = (selectedGroupId) => {
        setGroupId(selectedGroupId); // props
        socketRef.current.emit('joinGroup', selectedGroupId);
    };

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

            if (groupId) {
                socketRef.current.emit('joinGroup', groupId); // join general on load
            }
        });

        socketRef.current.on('disconnect', () => {
            setIsSocketConnected(false);
            console.log('❌ Déconnecté du serveur Socket.IO');
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);


    return (
        <div>
            <h1>Home Page</h1>
            {isSocketConnected ? (
                <>
                    <Groups currentGroupId={groupId} userId={data.data.userId} socket={socketRef.current} onGroupSelect={handleGroupSelect} />
                    <ContainerChat currentGroupId={groupId} socket={socketRef.current} />
                    <SendMessage currentGroupId={groupId} socket={socketRef.current} userId={data.data.userId} username={data.data.username} />
                </>
            ) : (
                <p>Connexion au serveur en cours...</p>
            )}
        </div>
    );
};

export default HomePage;
