import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

const RegisterPage = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (username.length < 1) {
            setError('❌ - Please enter your username')
        } else if (password.length < 1) {
            setError('❌ - Please enter your password')
        } else {
            try {
                await register({ username, password });
                navigate('/home');
            } catch (error) {
                setError(error)
            }
        }
    };

    return (
        <>
            <h1>Register Page</h1>
            {error && <p className='error'>{error}</p>}
            <form onSubmit={handleSubmit}>
                <h4>Name</h4>
                <input onChange={(e) => setUsername(e.target.value)} />

                <h4>Password</h4>
                <input type='password' onChange={(e) => setPassword(e.target.value)} />

                <button>Register</button>
                <button onClick={() => navigate('/')}>Sign in</button>
            </form>
        </>
    );
};

export default RegisterPage;