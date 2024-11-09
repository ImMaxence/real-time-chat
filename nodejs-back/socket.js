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

        socket.on('test', () => {
            io.emit('test', "data");
        });

        socket.on('disconnect', () => {
            console.log('📱 - User disconnected', socket.id);
        });
    });

    return io;
};

module.exports = setupSocket;
