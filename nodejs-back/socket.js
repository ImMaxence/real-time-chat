const { Server } = require("socket.io");

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.URL_FRONTEND,
            credentials: true,
        }
    });

    io.on('connection', (socket) => {
        console.log('📱 - User connected', socket.id);

        socket.join('general'); // if user connected join general

        socket.on('sendMessage', (data) => {
            const { groupId, message } = data;

            io.to(groupId).emit('receiveMessage', {
                groupId,
                message,
                senderId: socket.id,
                timestamp: new Date(),
            });
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            socket.leave('general');
        });

    });

    return io;
};

module.exports = setupSocket;
