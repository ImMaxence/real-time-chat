import { React, useEffect, useState } from 'react';
import { getAllGroups } from '../services/groupService'
import PublicGroupCard from '../components/PublicGroupCard';

const PublicGroups = () => {

    const [error, setError] = useState(null)
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllGroups()
                setData(res.data.groups)
            } catch (error) {
                setError(error)
            }
        }

        fetchData()
    }, [])

    return (
        <div>
            <h1>public groups</h1>
            {error && <p className='error'>{error}</p>}
            {data.map((item) => (
                <PublicGroupCard
                    key={item.id}
                    name={item.name}
                    createdAt={item.createdAt}
                    maxMembers={item.maxMembers}
                    isPrivate={item.isPrivate}
                />
            ))}
        </div>
    );
};

export default PublicGroups;