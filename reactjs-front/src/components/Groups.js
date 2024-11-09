import { React, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import ManagerGroup from './ManageGroup'

const Groups = ({ userId }) => {
    const socketRef = useRef(null);

    useEffect(() => {
        // Créer une connexion Socket.io une seule fois au montage du composant
        socketRef.current = io(process.env.REACT_APP_URL_SOCKET, {
            withCredentials: true, // Assurez-vous que les cookies sont envoyés avec la connexion
        });

        // Écoute l'événement 'test' du serveur
        socketRef.current.on('test', (data) => {
            console.log('Données reçues :', data);  // Affiche les données reçues du backend
        });

        // Cleanup: déconnexion lorsque le composant est démonté
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const handleTest = () => {
        console.log('Test emit triggered');
        // Utilisez socketRef pour émettre l'événement 'test'
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
