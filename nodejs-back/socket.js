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

        socket.on('join_group', (groupName) => {
            socket.join(groupName);
            console.log(`📱 - User ${socket.id} joined group ${groupName}`);
        });

        socket.on('leave_group', (groupName) => {
            socket.leave(groupName);
            console.log(`📱 - User ${socket.id} left group ${groupName}`);
        });

        socket.on('send_message', ({ group, message, username }) => {
            const timestamp = new Date().toISOString();
            io.to(group).emit('receive_message', { message, group, senderId: socket.id, username, timestamp });
            console.log(`📱 - Message sent to group ${group}:`, message);
        });

        socket.on('disconnect', () => {
            console.log('📱 - User disconnected', socket.id);
        });
    });

    return io;
};

module.exports = setupSocket;
