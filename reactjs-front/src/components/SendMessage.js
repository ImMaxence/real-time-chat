import React, { useState, useRef } from 'react';
import { createMessage } from '../services/messageService'

const SendMessage = ({ currentGroupId, socket }) => {

    const [imageInput, setProfileImage] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef();
    const [message, setMessage] = useState('')

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
        if (!message) return;

        try {
            const savedMessage = await createMessage({ text: message, groupId: currentGroupId, image: imageInput });
            setMessage('');
            fileInputRef.current.value = null;
            setError(null);

            if (socket) {
                socket.emit('sendMessage', {
                    groupId: currentGroupId,
                    message: savedMessage.data,
                });
            } else {
                console.error("Socket is not connected");
            }
        } catch (error) {
            setError(error.message || 'Erreur lors de l\'envoi du message');
        }
    };


    return (
        <div style={{ backgroundColor: 'green', padding: 10 }}>
            <input value={message} type="text" placeholder='your message' onChange={(e) => setMessage(e.target.value)} />
            <input type='file' accept='image/*' onChange={handleImageChange} ref={fileInputRef} />
            {imageInput && (
                <button type="button" onClick={handleRemoveImage}>Remove Image</button>
            )}
            {error && <p className='error'>{error}</p>}
            <button onClick={() => handleSendMessage()}>send</button>
        </div>
    );
};

export default SendMessage;