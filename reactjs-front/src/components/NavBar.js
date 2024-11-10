import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {

    const navigate = useNavigate()

    return (
        <nav>
            <button onClick={() => navigate('/home')}>Home</button>
            <button onClick={() => navigate('/public-groups')}>Public groups</button>
            <button onClick={() => navigate('/profile')}>Profil</button>
        </nav>
    );
};

export default NavBar;