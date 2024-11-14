import React from 'react';

const GroupCard = ({ id, isPrivate, maxMembers, name, image, onGroupSelect }) => {

    const passGroupId = () => {
        onGroupSelect(id);
    };

    return (
        <div className='group_card_container'>
            <ul>
                <li><img src={image} alt="group img" /></li>
                <li>id : {id}</li>
                <li>private : {isPrivate ? "yes" : 'no'}</li>
                <li>max member : {maxMembers}</li>
                <li>name : {name}</li>
                <li><button onClick={() => passGroupId(id)}>discuter ici</button></li>
            </ul>
        </div>
    );
};

export default GroupCard;