import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:3000"; // Mets ici l'URL de ton backend

const HomePage = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        console.log('Cookie envoyé:', document.cookie);

        const socketInstance = io(SOCKET_URL, {
            withCredentials: true,
        });

        socketInstance.on("connect", () => {
            console.log("Connecté au serveur Socket.IO");
        });

        socketInstance.on("message", (message) => {
            console.log("Message reçu du serveur:", message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socketInstance.on("connect_error", (error) => {
            console.error("Erreur de connexion Socket.IO:", error);
        });

        socketInstance.on("disconnect", () => {
            console.log("Déconnecté du serveur Socket.IO");
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);


    const sendMessage = () => {
        if (socket && newMessage) {
            socket.emit("message", newMessage);
            setNewMessage(""); // Réinitialiser le champ de message
        }
    };

    return (
        <div>
            <h2>Chat en temps réel</h2>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écris un message..."
            />
            <button onClick={sendMessage}>Envoyer</button>
        </div>
    );
};

export default HomePage;
