import React from 'react';
import { removeMemberFromGroup } from '../services/groupService';

const GroupCard = ({ id, isPrivate, maxMembers, name, image, onGroupSelect, userId, onLeaveGroup }) => {

    const passGroupId = () => {
        onGroupSelect(id);
    };

    const leaveThisGroup = async (id) => {
        try {
            await removeMemberFromGroup(id, { userId: userId });
            onLeaveGroup(id);
        } catch (error) {
            console.error("❌ - Error leaving the group:", error);
        }
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
                {id === 1 || isPrivate === 'no' ? (
                    null
                ) : <li><button onClick={() => leaveThisGroup(id)}>leave group</button></li>}
            </ul>
        </div>
    );
};

export default GroupCard;