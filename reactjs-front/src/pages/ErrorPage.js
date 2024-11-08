import React from 'react';
import Layout from '../components/Layout';
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {

    const navigate = useNavigate()

    return (
        <Layout>
            <h1>Error page</h1>
            <Button type='primary' onClick={(e) => navigate('/')}>Home page</Button>
        </Layout>
    );
};

export default ErrorPage;