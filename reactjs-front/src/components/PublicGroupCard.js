import React from 'react';

const PublicGroupCard = ({ image, isPrivate, maxMembers, name, createdAt }) => {
    return (
        <div style={{ backgroundColor: 'orange' }}>
            <img src={image} alt="group img" />
            <ul>
                <li>private : {isPrivate ? "yes" : 'no'}</li>
                <li>{maxMembers}</li>
                <li>{name}</li>
                <li>{createdAt}</li>
            </ul>
        </div>
    );
};

export default PublicGroupCard;