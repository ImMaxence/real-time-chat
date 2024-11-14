import { React, useState } from 'react';
import { addMemberToGroup, removeMemberFromGroup } from '../services/groupService';

const ManageGroup = ({ onGroupChange }) => {

    const [addUser, setAddUser] = useState(null)
    const [addGroup, setAddGroup] = useState(null)

    const [reUser, setReUser] = useState(null)
    const [reGroup, setReGroup] = useState(null)

    const handleAdd = async () => {
        try {
            console.log(addGroup, addUser)
            const data = { userId: addUser };
            await addMemberToGroup(addGroup, data);
            onGroupChange();
        } catch (error) {
            console.log(error)
        }
    };

    const handleRe = async () => {
        try {
            console.log(reGroup, reUser)
            const data = { userId: reUser };
            await removeMemberFromGroup(reGroup, data);
            onGroupChange();
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div style={{ backgroundColor: 'violet' }}>
            <h1>manage groups component</h1>

            <div>
                <input type="number" placeholder='GROUP ID' onChange={(e) => setAddGroup(e.target.value)} />
                <input type="number" placeholder='USER ID' onChange={(e) => setAddUser(e.target.value)} />
                <button onClick={handleAdd}>add member</button>
            </div>

            <div>
                <input type="number" placeholder='GROUP ID' onChange={(e) => setReGroup(e.target.value)} />
                <input type="number" placeholder='USER ID' onChange={(e) => setReUser(e.target.value)} />
                <button onClick={handleRe}>remove member</button>
            </div>

        </div>
    );
};

export default ManageGroup;