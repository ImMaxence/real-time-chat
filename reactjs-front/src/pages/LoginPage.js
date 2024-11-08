import { React, useState } from 'react';
import Layout from '../components/Layout';
import { Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { logIn } from '../services/authService';

const LoginPage = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('')
        setLoading(true);
        setTimeout(async () => {

            if (username.length < 1) {
                setError('Please enter your username')
                setLoading(false);
            } else if (password.length < 1) {
                setError('Please enter your password')
                setLoading(false);
            } else {
                try {
                    await logIn({ username, password });
                    navigate('/home');
                } catch (error) {
                    setError(error)
                    setLoading(false);
                }
            }
        }, 2000);
    };

    return (
        <Layout>
            <h1>Log in Page</h1>
            {error && <p className='error'>{error}</p>}
            <form onSubmit={handleSubmit}>
                <h4>Name</h4>
                <Input onChange={(e) => setUsername(e.target.value)} />

                <h4>Mot de passe</h4>
                <Input.Password onChange={(e) => setPassword(e.target.value)} />

                <Button type="primary" loading={loading} htmlType="submit">Sign in</Button>
                <Button type='primary' onClick={() => navigate('/register')}>Register</Button>
            </form>
        </Layout>
    );
};

export default LoginPage;