const { Server } = require('socket.io');
const Message = require('./models/Message');
const Group = require('./models/Group');

const socketConfig = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.URL_FRONTEND,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', async (socket) => {
        console.log('✅ - User connected with socket ID:', socket.id);

        const user = socket.request.user;
        const generalGroup = await Group.findOne({ where: { name: 'general' } });

        if (generalGroup) {
            const userInGroup = await generalGroup.hasUser(user.id);

            if (!userInGroup) {
                await generalGroup.addUser(user.id);
                console.log(`✅ - User ${user.username} added to the general group`);
            }

            socket.join(generalGroup.id);
        } else {
            console.log('❌ - General group not found');
        }

        socket.on('joinGroup', async (groupId) => {
            const group = await Group.findByPk(groupId);
            if (group) {
                socket.join(groupId);
                console.log(`✅ - User ${user.username} joined group ${groupId}`);
            }
        });

        socket.on('leaveGroup', async (groupId) => {
            socket.leave(groupId);
            console.log(`✅ - User ${user.username} left group ${groupId}`);
        });

        socket.on('sendMessage', async (data) => {
            try {
                const { text, image, file, groupId } = data;
                const username = user.username;

                const group = await Group.findByPk(groupId);
                if (!group) {
                    return console.error('❌ - Group not found');
                }

                const message = await Message.create({
                    text,
                    image,
                    file,
                    username,
                    groupId,
                    userId: user.id,
                });

                console.log('✅ - Message saved : ', message);
                io.to(groupId).emit('receiveMessage', message);

            } catch (error) {
                console.error('❌ - Error saving message : ', error);
            }
        });

        socket.on('editMessage', async (data) => {
            try {
                const message = await Message.findByPk(data.id);
                if (message && message.userId === user.id) {
                    message.text = data.text || message.text;
                    message.image = data.image || message.image;
                    message.file = data.file || message.file;
                    await message.save();
                    console.log('✅ - Message updated : ', message);

                    io.to(message.groupId).emit('messageUpdated', message);
                } else {
                    console.error('❌ - Unauthorized or message not found');
                }
            } catch (error) {
                console.error('❌ - Error editing message : ', error);
            }
        });

        socket.on('deleteMessage', async (data) => {
            try {
                const message = await Message.findByPk(data.id);
                if (message && message.userId === user.id) {
                    await message.destroy();
                    console.log('✅ - Message deleted : ', message);
                    io.to(message.groupId).emit('messageDeleted', data.id);
                } else {
                    console.error('❌ - Unauthorized or message not found');
                }
            } catch (error) {
                console.error('❌ - Error deleting message : ', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('✅ - User disconnected from socket : ', socket.id);
        });
    });

    return io;
};

module.exports = socketConfig;
