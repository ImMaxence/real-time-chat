const { Server } = require('socket.io');
const Message = require('./models/Message');

const socketConfig = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.URL_FRONTEND,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('✅ - User connected with socket ID:', socket.id);

        const user = socket.request.user;

        socket.on('sendMessage', async (data) => {
            try {
                const { text, image, file } = data;
                const username = user.username;

                const message = await Message.create({
                    text,
                    image,
                    file,
                    username,
                });

                console.log('✅ - Message saved : ', message);
                io.emit('receiveMessage', message);
            } catch (error) {
                console.error('❌ - Error saving message : ', error);
            }
        });

        socket.on('editMessage', async (data) => {
            try {
                const message = await Message.findByPk(data.id);
                if (message) {
                    message.text = data.text || message.text;
                    message.image = data.image || message.image;
                    message.file = data.file || message.file;
                    await message.save();
                    console.log('✅ - Message updated : ', message);
                    io.emit('messageUpdated', message);
                }
            } catch (error) {
                console.error('❌ - Error editing message : ', error);
            }
        });

        socket.on('deleteMessage', async (data) => {
            try {
                const message = await Message.findByPk(data.id);
                if (message) {
                    await message.destroy();
                    console.log('✅ - Message deleted : ', message);
                    io.emit('messageDeleted', data.id);
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
