import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setProfileImage(file);  // On garde juste le fichier, pas en base64
        } else {
            setError('❌ - Please upload a valid image file');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (username.length < 1) {
            setError('❌ - Please enter your username');
        } else if (password.length < 1) {
            setError('❌ - Please enter your password');
        } else {
            try {
                const formData = new FormData();
                formData.append('username', username);
                formData.append('password', password);
                if (profileImage) {
                    formData.append('image', profileImage);  // Envoi de l'image en tant que fichier
                }

                await register(formData);  // Envoi via le service
                navigate('/home');
            } catch (error) {
                setError(error);
            }
        }
    };

    const handleRemoveImage = () => {
        setProfileImage(null);
    };

    return (
        <>
            <h1>Register Page</h1>
            {error && <p className='error'>{error}</p>}
            <form onSubmit={handleSubmit}>
                <h4>Username</h4>
                <input onChange={(e) => setUsername(e.target.value)} />

                <h4>Password</h4>
                <input type='password' onChange={(e) => setPassword(e.target.value)} />

                <h4>Profile Image</h4>
                <input type='file' accept='image/*' onChange={handleImageChange} />

                {profileImage && (
                    <>
                        <div style={{ width: 300, height: 300, overflow: 'hidden' }}>
                            <img src={URL.createObjectURL(profileImage)} alt="Profile Preview" style={{ width: '100%' }} />
                        </div>
                        <button type="button" onClick={handleRemoveImage}>Remove Image</button>
                    </>
                )}

                <button type="submit">Register</button>
                <button type="button" onClick={() => navigate('/')}>Sign in</button>
            </form>
        </>
    );
};

export default RegisterPage;
