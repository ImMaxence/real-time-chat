import React, { useState, useEffect } from 'react';
import { logOut } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '../services/userService';
import { useAuth } from '../components/ProtectedRoute';
import { removeMemberFromGroup } from '../services/groupService';

const Profile = () => {
    const data = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [dataUser, setDataUser] = useState(null);

    useEffect(() => {
        const fetchDataUser = async () => {
            try {
                const res = await getUserById(data.data.userId);
                setDataUser(res.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchDataUser();
    }, [data.data.userId]);

    const handleLogOut = async () => {
        setError(null);
        try {
            await removeMemberFromGroup(1, { userId: data.data.userId })
            await logOut();
            navigate('/');
        } catch (error) {
            setError(error);
        }
    };

    return (
        <div>
            <h1>Profile</h1>
            {error && <p className="error">{error}</p>}

            {dataUser ? (
                <div>
                    <h3>Username: {dataUser.username}</h3>
                    <p>Role: {dataUser.role}</p>

                    {dataUser.image ? (
                        <img src={dataUser.image} alt="Profile" style={{ width: '200px', height: '200px' }} />
                    ) : (
                        <p>No profile image</p>
                    )}

                    <p>Account created at: {new Date(dataUser.createdAt).toLocaleDateString()}</p>
                    <p>Last updated at: {new Date(dataUser.updatedAt).toLocaleDateString()}</p>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}

            <button onClick={() => handleLogOut()}>Log out</button>
        </div>
    );
};

export default Profile;
