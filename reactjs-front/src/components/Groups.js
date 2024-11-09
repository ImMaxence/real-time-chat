import { React, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import ManagerGroup from './ManageGroup'

const Groups = ({ userId }) => {
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(process.env.REACT_APP_URL_SOCKET, {
            withCredentials: true,
        });

        socketRef.current.on('test', (data) => {
            console.log('Données reçues :', data);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const handleTest = () => {
        socketRef.current.emit('test');
    };

    return (
        <div>
            <h1>Groupes de l'utilisateur</h1>
            <p>ID utilisateur : {userId}</p>
            <button onClick={handleTest}>test emit</button>
            <ManagerGroup />
        </div>
    );
};

export default Groups;
