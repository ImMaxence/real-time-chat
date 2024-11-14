import React from 'react';

const GroupCard = ({ isPrivate, maxMembers, name, image }) => {
    return (
        <div className='group_card_container'>
            <ul>
                <li><img src={image} alt="group" /></li>
                <li>{isPrivate ? "yes" : 'no'}</li>
                <li>{maxMembers}</li>
                <li>{name}</li>
            </ul>
        </div>
    );
};

export default GroupCard;