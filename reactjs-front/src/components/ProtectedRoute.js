import { React, useState, useEffect, useContext, createContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { verifyToken } from '../services/authService';
import { Spin } from 'antd';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const ProtectedRoute = () => {

    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [data, setData] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchVerifyToken = async () => {
            try {
                const response = await verifyToken();
                setData(response.data);
                setIsAuthenticated(true);
            } catch (error) {
                console.log(error)
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        setTimeout(() => { fetchVerifyToken(); }, 2000);
    }, [location]);

    return (
        <>
            {loading ? (
                <Spin />
            ) : isAuthenticated ? (
                <AuthContext.Provider value={{ data }}>
                    <Outlet />
                </AuthContext.Provider>
            ) : (
                <Navigate to="/" />
            )}
        </>
    );
};

export default ProtectedRoute;