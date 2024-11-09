import React from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {

    const navigate = useNavigate()

    return (
        <Layout>
            <h1>Error page</h1>
            <button onClick={() => navigate('/')}>Home page</button>
        </Layout>
    );
};

export default ErrorPage;