const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { username, password, image } = req.body;
        // role maybe later for admin

        if (!username) {
            console.log("❌ - Please enter a username")
            return res.status(401).json({ message: '❌ - Please enter a username' });
        }

        if (!password) {
            console.log("❌ - Please enter a password")
            return res.status(401).json({ message: '❌ - Please enter a password' });
        }

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            console.log("❌ - Username already taken")
            return res.status(400).json({ message: '❌ - Username already taken' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = await User.create({
            username,
            password: hashedPassword,
            role: 1,
            image
        });

        const token = jwt.sign({ id: newUser.id, username: newUser.username, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000,
        });

        req.io.on('connection', (socket) => {
            console.log(socket.id)
        })

        console.log("✅ - User registered and logged in successfully");
        res.status(201).json({ message: '✅ - User registered and logged in successfully' });
    } catch (error) {
        console.error('❌ - Error during registration : ');
        return res.status(500).json({ message: '❌ - Server error during registration' });
    }
};

exports.logIn = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username) {
            console.log("❌ - Please enter a username")
            return res.status(401).json({ message: '❌ - Please enter a username' });
        }

        if (!password) {
            console.log("❌ - Please enter a password")
            return res.status(401).json({ message: '❌ - Please enter a password' });
        }

        const user = await User.findOne({ where: { username } });
        if (!user) {
            console.log("❌ - User not found")
            return res.status(404).json({ message: '❌ - User not found' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ - Invalid password")
            return res.status(401).json({ message: '❌ - Invalid password' });
        }

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000,
        });

        console.log("✅ - Login successful")
        res.json({ message: '✅ - Log in successful' });
    } catch (error) {
        console.log("❌ - Internal server error");
        res.status(500).json({ message: '❌ - Internal server error' });
    }
};

exports.logOut = (req, res) => {
    if (!req.cookies.token) {
        console.log("❌ - No active session found")
        return res.status(400).json({ message: '❌ - No active session found' });
    }

    res.clearCookie('token');
    console.log("✅ - Logout successful")
    res.json({ message: '✅ - Log out successful' });
};

exports.verifyToken = (req, res) => {
    console.log("✅ - Verify token successful")
    res.json({ userId: req.user.id, role: req.user.role, username: req.user.username, image: req.user.image, password: req.user.password });
};