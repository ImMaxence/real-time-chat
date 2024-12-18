const Group = require('../models/Group');
const User = require('../models/User');
const Message = require('../models/Message');

exports.createGroup = async (req, res) => {
    const { name, isPrivate, maxMembers } = req.body;

    const imageBase64 = req.body.image || null;

    if (!name) {
        return res.status(400).json({ message: '❌ - Group name is required' });
    }

    try {
        const newGroup = await Group.create({
            name,
            isPrivate: isPrivate || true,
            maxMembers: maxMembers || 10,
            image: imageBase64,
            createdBy: req.user.id,
            memberCount: 1 // add creator
        });

        console.log('✅ - Group created in DB');

        if (req.user && req.user.id) {
            await newGroup.addUser(req.user.id);
            console.log('✅ - User added to group successfully !');
            return res.status(201).json({
                message: '✅ - Group created and user added successfully !',
                groupId: newGroup.id
            });
        } else {
            return res.status(400).json({ message: '❌ - User is not authenticated' });
        }
    } catch (err) {
        console.error("❌ - Error creating group", err);
        res.status(500).json({ message: '❌ - Error creating group:', err });
    }
};

exports.getGroupMessages = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await Group.findByPk(groupId, {
            include: [
                { model: Message, include: User },
            ],
        });

        if (!group) {
            console.log("❌ - Group not found")
            return res.status(404).json({ message: '❌ - Group not found' });
        }

        res.json({ messages: group.Messages, });
    } catch (err) {
        console.log("❌ - Error fetching messages")
        res.status(500).json({ message: '❌ - Error fetching messages : ', err });
    }
};

exports.addMemberToGroup = async (req, res) => {
    const { groupId } = req.params;
    const { userId } = req.body;

    try {
        const group = await Group.findByPk(groupId);

        if (!group) {
            console.log("❌ -  Group not found")
            return res.status(404).json({ message: '❌ -  Group not found' });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            console.log("❌ -  User not found")
            return res.status(404).json({ message: '❌ -  User not found' });
        }

        await group.addUser(user);

        group.memberCount += 1;
        await group.save();

        console.log("✅ - User added to the group")
        res.json({ message: '✅ - User added to the group' });
    } catch (err) {
        console.log("❌ - Error adding member")
        res.status(500).json({ message: '❌ - Error adding member', err });
    }
};

exports.addMemberToGroupSOCKET = async (req, res) => {
    const { groupId } = req.params;
    const { userId } = req.body;

    try {
        const group = await Group.findByPk(groupId);

        if (!group) {
            console.log("❌ -  Group not found")
        }

        const user = await User.findByPk(userId);

        if (!user) {
            console.log("❌ -  User not found")
        }

        await group.addUser(user);

        group.memberCount += 1;
        await group.save();

        console.log("✅ - User added to the group")
    } catch (err) {
        console.log("❌ - Error adding member")
    }
};

exports.removeMemberFromGroup = async (req, res) => {
    const { groupId } = req.params;
    const { userId } = req.body;

    try {
        const group = await Group.findByPk(groupId);

        if (!group) {
            console.log("❌ - Group not found")
            return res.status(404).json({ message: '❌ - Group not found' });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            console.log("❌ - User not found")
            return res.status(404).json({ message: '❌ - User not found' });
        }

        await group.removeUser(user);

        group.memberCount = Math.max(0, group.memberCount - 1);
        await group.save();

        console.log("✅ - User removed from the group")
        res.json({ message: '✅ - User removed from the group' });
    } catch (err) {
        console.log("❌ - Error removing member")
        res.status(500).json({ message: '❌ - Error removing member : ', err });
    }
};

// exports.removeMemberFromGroupSOCKET = async (req, res) => {
//     const { groupId } = req.params;
//     const { userId } = req.body;

//     try {
//         const group = await Group.findByPk(groupId);

//         if (!group) {
//             console.log("❌ - Group not found")
//         }

//         const user = await User.findByPk(userId);

//         if (!user) {
//             console.log("❌ - User not found")
//         }

//         await group.removeUser(user);

//         group.memberCount = Math.max(0, group.memberCount - 1);
//         await group.save();

//         console.log("✅ - User removed from the group")
//     } catch (err) {
//         console.log("❌ - Error removing member")
//     }
// };

exports.updateGroup = async (req, res) => {
    const { groupId } = req.params;
    const { name, isPrivate, maxMembers } = req.body;

    try {
        const group = await Group.findByPk(groupId);

        if (!group) {
            console.log("❌ - Group not found");
            return res.status(404).json({ message: '❌ - Group not found' });
        }

        if (name) group.name = name;
        if (typeof isPrivate !== 'undefined') group.isPrivate = isPrivate;
        if (maxMembers) group.maxMembers = maxMembers;

        await group.save();

        console.log("✅ - Group updated successfully");
        res.json({ message: '✅ - Group updated successfully', group });
    } catch (err) {
        console.error("❌ - Error updating group", err);
        res.status(500).json({ message: '❌ - Error updating group : ', err });
    }
};

exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.findAll({
            where: {
                isPrivate: false,
            },
        });

        console.log("✅ - Groups fetched successfully");
        res.json({ groups });
    } catch (err) {
        console.error("❌ - Error fetching groups", err);
        res.status(500).json({ message: '❌ - Error fetching groups : ', err });
    }
};

exports.deleteGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await Group.findByPk(groupId);

        if (!group) {
            console.log("❌ - Group not found");
            return res.status(404).json({ message: '❌ - Group not found' });
        }

        if (group.isProtected) {
            console.log("❌ - Cannot delete protected group");
            return res.status(403).json({ message: '❌ - Cannot delete protected group' });
        }

        await group.destroy();

        console.log("✅ - Group deleted successfully");
        res.json({ message: '✅ - Group deleted successfully' });
    } catch (err) {
        console.error("❌ - Error deleting group", err);
        res.status(500).json({ message: '❌ - Error deleting group : ', err });
    }
};

exports.getGroupUsers = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await Group.findByPk(groupId, {
            include: {
                model: User,
                attributes: ['id', 'username', 'role', 'image'],
            },
        });

        if (!group) {
            console.log("❌ - Group not found");
            return res.status(404).json({ message: '❌ - Group not found' });
        }

        const users = group.Users;

        console.log("✅ - Users found");
        res.json({ users });
    } catch (err) {
        console.error("❌ - Error fetching users", err);
        res.status(500).json({ message: '❌ - Error fetching users : ', err });
    }
};

exports.getUserGroups = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findByPk(userId, {
            include: {
                model: Group,
                through: { attributes: [] },
            }
        });

        if (!user) {
            console.log("❌ - User not found");
            return res.status(404).json({ message: '❌ - User not found' });
        }

        console.log("✅ - User's groups retrieved");
        res.json({ groups: user.Groups });
    } catch (err) {
        console.error("❌ - Error fetching user groups", err);
        res.status(500).json({ message: '❌ - Error fetching user groups : ', err });
    }
};
