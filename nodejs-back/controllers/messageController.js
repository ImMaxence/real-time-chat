const Message = require('../models/Message');
const Group = require('../models/Group');

exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.findAll({
            order: [['createdAt', 'ASC']] // trier date
        });

        console.log('✅ - Messages retrieved');
        res.status(200).json({ messages });
    } catch (error) {
        console.error('❌ - Error retrieving messages : ', error);
        res.status(500).json({ message: '❌ - Error retrieving messages' });
    }
};

exports.createMessage = async (req, res) => {
    const { groupId, text } = req.body;

    const imageBase64 = req.body.image || null;

    try {
        const group = await Group.findByPk(groupId);

        if (!group) {
            console.log("❌ - Group not found")
            return res.status(404).json({ message: '❌ - Group not found' });
        }

        const username = req.user.username;

        await Message.create({
            text,
            image: imageBase64,
            userId: req.user.id,
            groupId: group.id,
            username: username,
        });

        console.log("✅ - Message sent successfully !")
        res.status(201).json({ message: '✅ - Message sent successfully !' });
    } catch (error) {
        console.log("❌ - Error sending message : ", error)
        res.status(500).json({ message: '❌ - Error sending message' });
    }
};


exports.editMessage = async (req, res) => {
    try {
        const { id, text, image, file } = req.body;

        const message = await Message.findByPk(id);
        if (!message) {
            console.log("❌ - Message not found")
            return res.status(404).json({ message: '❌ - Message not found' });
        }

        if (message.username !== req.user.username) {
            console.log("❌ - You are not authorized to edit this message")
            return res.status(403).json({ message: '❌ - You are not authorized to edit this message' });
        }

        message.text = text || message.text;
        message.image = image || message.image;
        message.file = file || message.file;
        message.updatedAt = new Date();
        await message.save();

        console.log('✅ - Message updated');
        res.status(200).json({ message: '✅ - Message updated' });
    } catch (error) {
        console.error('❌ - Error editing message');
        res.status(500).json({ message: '❌ - Error editing message' });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.body;

        const message = await Message.findByPk(id);
        if (!message) {
            console.log("❌ - Message not found")
            return res.status(404).json({ message: '❌ - Message not found' });
        }

        if (message.username !== req.user.username) {
            console.log("❌ - You are not authorized to delete this message")
            return res.status(403).json({ message: '❌ - You are not authorized to delete this message' });
        }

        await message.destroy();

        console.log('✅ - Message deleted');
        res.status(200).json({ message: '✅ - Message deleted' });
    } catch (error) {
        console.error('❌ - Error deleting message');
        res.status(500).json({ message: '❌ - Error deleting message' });
    }
};
