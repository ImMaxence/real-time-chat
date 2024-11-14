import { React, useEffect, useState } from 'react';
import { getUserGroups } from '../services/groupService';
import GroupCard from './GroupCard';

const Groups = ({ userId }) => {

    const [error, setError] = useState(null)
    const [groups, setGroups] = useState([])

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await getUserGroups(userId)
                setGroups(res.data.groups)
            } catch (error) {
                setError(error)
            }
        }

        fetchGroups()
    }, [])

    return (
        <div style={{ backgroundColor: 'blue' }}>
            <h2>Groups</h2>
            {error && <p className='error'>{error}</p>}
            <ul>
                {groups.length > 0 ? (
                    groups.map((group) => (
                        <GroupCard key={group.id} name={group.name} maxMembers={group.maxMembers} isPrivate={group.isPrivate} image={group.image} />
                    ))
                ) : (
                    <p>No groups available.</p>
                )}
            </ul>
        </div>
    );
}
export default Groups;
