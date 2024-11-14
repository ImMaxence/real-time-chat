const { Server } = require("socket.io");
const sharp = require('sharp');
const { removeMemberFromGroupSOCKET } = require('./controllers/groupController')

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.URL_FRONTEND,
            credentials: true,
        }
    });

    io.on('connection', (socket) => {
        console.log('📱SOCKET - User connected', socket.id);

        // Étape 2 : Authentification de l'utilisateur
        socket.on('authenticateUser', (userId) => {
            // Assigner l'userId au socket pour référence future
            socket.userId = userId;
            console.log(`📱SOCKET - User authenticated: ${userId}`);
        });

        socket.on('createGroup', async (groupData) => {
            const { id, name, isPrivate, maxMembers, image } = groupData;

            let imageBase64 = null;
            if (image) {
                try {
                    const imageBuffer = Buffer.from(image, 'base64');
                    const resizedImageBuffer = await sharp(imageBuffer)
                        .resize(400, 400)
                        .jpeg({ quality: 100 })
                        .rotate()
                        .toBuffer()
                    imageBase64 = `data:image/jpeg;base64,${resizedImageBuffer.toString('base64')}`;
                } catch (error) {
                    console.error("📱SOCKET - Error during image processing : ", error);
                }
            }

            io.emit('newGroupCreated', { id, name, isPrivate, maxMembers, image: imageBase64 });
            console.log(`📱SOCKET - New group created: ${name} with ID: ${id}`);
        });

        socket.on('joinGroup', (groupId) => {
            socket.join(groupId);
            console.log(`📱SOCKET - ${socket.id} joined group ${groupId}`);
        });

        socket.on('sendMessage', async (data) => {
            const { groupId, message, username, userId, image } = data;
            let imageBase64 = null;

            if (image) {
                try {
                    const imageBuffer = Buffer.from(image, 'base64');
                    const resizedImageBuffer = await sharp(imageBuffer)
                        .resize(400, 400)
                        .jpeg({ quality: 100 })
                        .rotate()
                        .toBuffer()
                    imageBase64 = `data:image/jpeg;base64,${resizedImageBuffer.toString('base64')}`;
                } catch (error) {
                    console.error("📱SOCKET - Error during image processing : ", error);
                }
            }

            io.to(groupId).emit('receiveMessage', {
                groupId,
                message,
                senderId: socket.id,
                username,
                userId,
                image: imageBase64,
                timestamp: new Date(),
            });
        });

        socket.on('userTyping', (data) => {
            const { groupId, isTyping, username } = data;
            socket.to(groupId).emit('userTyping', { groupId, isTyping, username });
        });

        socket.on('disconnect', async () => {
            console.log(`📱SOCKET - User disconnected: ${socket.id}`);

            const groupId = 1;
            const userId = socket.userId;

            if (userId) {
                try {
                    await removeMemberFromGroupSOCKET({ params: { groupId }, body: { userId } });
                    console.log(`✅ - User ${userId} removed from group ${groupId}`);
                } catch (error) {
                    console.error("❌ - Error removing user from group on disconnect : ", error);
                }
            }

            socket.leave('general');
        });
    });

    return io;
};

module.exports = setupSocket;
