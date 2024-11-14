import React, { useState, useRef } from 'react';
import { createMessage } from '../services/messageService';

const SendMessage = ({ currentGroupId, socket, userId, username, setTypingInfo }) => {

    const [imageInput, setProfileImage] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef();
    const [message, setMessage] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setProfileImage(file);
        } else {
            setError('❌ - Please upload a valid image file');
        }
    };

    const handleRemoveImage = () => {
        setProfileImage(null);
        fileInputRef.current.value = null;
    };

    const handleSendMessage = async () => {

        try {
            const formData = new FormData();
            formData.append('text', message);
            formData.append('groupId', currentGroupId);
            if (imageInput) {
                formData.append('image', imageInput);
            }

            await createMessage(formData);

            if (socket && socket.connected) {
                socket.emit('sendMessage', {
                    groupId: currentGroupId,
                    message: message,
                    username: username,
                    userId: userId,
                    image: imageInput,
                });
            } else {
                console.error("Socket is not connected");
            }

            setMessage('');
            fileInputRef.current.value = null;
            setError(null);

            socket.emit('userTyping', { groupId: currentGroupId, isTyping: false, username: username });
        } catch (error) {
            setError(error);
        }
    };

    const handleTyping = () => {
        setTypingInfo(true);
        if (typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(setTimeout(() => {
            setTypingInfo(false);
            socket.emit('userTyping', { groupId: currentGroupId, isTyping: false, username: username });
        }, 3000));

        socket.emit('userTyping', { groupId: currentGroupId, isTyping: true, username: username });
    };


    return (
        <div style={{ backgroundColor: 'green', padding: 10 }}>
            <input value={message} type="text" placeholder="Votre message" onChange={(e) => {
                setMessage(e.target.value);
                handleTyping(e);
            }} />
            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
            {imageInput && (
                <button type="button" onClick={handleRemoveImage}>Remove Image</button>
            )}
            {error && <p className="error">{error}</p>}
            <button onClick={handleSendMessage}>Envoyer</button>
        </div>
    );
};


export default SendMessage;
