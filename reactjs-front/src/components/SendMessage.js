import React, { useState, useRef } from 'react';
import { createMessage } from '../services/messageService';

const SendMessage = ({ currentGroupId, socket, userId, username }) => {

    const [imageInput, setProfileImage] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef();
    const [message, setMessage] = useState('');

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
        } catch (error) {
            setError(error);
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
