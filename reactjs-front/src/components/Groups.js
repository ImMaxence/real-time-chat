import React, { useEffect, useState, useRef } from 'react';
import GroupCard from './GroupCard';
import { getUserGroups, createGroup } from '../services/groupService';

const Groups = ({ currentGroupId, userId, socket, onGroupSelect }) => {
    const [groups, setGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');
    const [error, setError] = useState(null);
    const [imageInput, setProfileImage] = useState(null);
    const fileInputRef = useRef();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await getUserGroups(userId);
                setGroups(res.data.groups);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchGroups();

        socket.on('newGroupCreated', (group) => {
            setGroups((prevGroups) => [...prevGroups, group]);
        });

        return () => {
            socket.off('newGroupCreated');
        };
    }, [socket, userId]);

    const handleCreateGroup = async () => {
        try {
            const formData = new FormData();
            formData.append('name', newGroupName);
            if (imageInput) {
                formData.append('image', imageInput);
            }

            const res = await createGroup(formData)

            socket.emit('createGroup', { id: res.data.groupId, name: newGroupName, isPrivate: false, maxMembers: 10, image: imageInput });
            setNewGroupName('');
            setError(null)
            setProfileImage(null);
            fileInputRef.current.value = null;
        } catch (error) {
            setError(error)
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setProfileImage(file);
        } else {
            setError('❌ - Please upload a valid image file');
        }
    };

    const handleRemoveImage = () => {
        setProfileImage(null);
        fileInputRef.current.value = null;
    };

    const handleLeaveGroup = (groupId) => {
        setGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
    };

    return (
        <div style={{ backgroundColor: 'blue', padding: 10 }}>
            <h2>Groups</h2>
            {error && <p className='error'>{error}</p>}

            <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Nom du groupe"
            />
            <input type='file' accept='image/*' onChange={handleImageChange} ref={fileInputRef} />
            {imageInput && (
                <button type="button" onClick={handleRemoveImage}>Remove Image</button>
            )}
            <button onClick={handleCreateGroup}>Créer un groupe</button>

            <ul>
                {groups.length > 0 ? (
                    groups.map((group) => (
                        <GroupCard key={group.id} id={group.id} name={group.name} maxMembers={group.maxMembers} isPrivate={group.isPrivate} image={group.image} onGroupSelect={onGroupSelect} userId={userId} onLeaveGroup={handleLeaveGroup} />
                    ))
                ) : (
                    <p>No groups available.</p>
                )}
            </ul>
        </div>
    );
};

export default Groups;
