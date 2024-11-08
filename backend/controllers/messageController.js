const Message = require('../models/Message');

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
    try {
        const { text, image, file } = req.body;

        if (!text) {
            return res.status(400).json({ message: '❌ - Message cannot be empty' });
        }

        const username = req.user.username;

        const newMessage = await Message.create({
            text,
            image,
            file,
            username,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log('✅ - New message created');
        res.status(201).json({ message: '✅ - Message created', newMessage });
    } catch (error) {
        console.error('❌ - Error creating message : ', error);
        res.status(500).json({ message: '❌ - Error creating message' });
    }
};

exports.editMessage = async (req, res) => {
    try {
        const { id, text, image, file } = req.body;

        const message = await Message.findByPk(id);
        if (!message) {
            return res.status(404).json({ message: '❌ - Message not found' });
        }

        if (message.username !== req.user.username) {
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
        console.error('❌ - Error editing message : ', error);
        res.status(500).json({ message: '❌ - Error editing message' });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.body;

        const message = await Message.findByPk(id);
        if (!message) {
            return res.status(404).json({ message: '❌ - Message not found' });
        }

        if (message.username !== req.user.username) {
            return res.status(403).json({ message: '❌ - You are not authorized to delete this message' });
        }

        await message.destroy();

        console.log('✅ - Message deleted');
        res.status(200).json({ message: '✅ - Message deleted' });
    } catch (error) {
        console.error('❌ - Error deleting message : ', error);
        res.status(500).json({ message: '❌ - Error deleting message' });
    }
};
