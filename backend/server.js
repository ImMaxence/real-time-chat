const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('./config/passport')(passport);
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const sequelize = require('./config/db');
const http = require('http');
const socketConfig = require('./socket');

dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use(cors({
    origin: process.env.URL_FRONTEND,
    credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);

sequelize.sync()
    .then(async () => {
        app.listen(process.env.PORT_BACKEND, () => {
            console.log(`🚀 - Server running on port ${process.env.PORT_BACKEND}`);
        });
    })
    .catch((err) => {
        console.error('❌ - Database connection failed : ', err);
    });