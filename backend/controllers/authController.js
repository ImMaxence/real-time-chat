const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { username, password, role, image } = req.body;

        if (!username) {
            return res.status(401).json({ message: '❌ - Please enter a username' });
        }

        if (!password) {
            return res.status(401).json({ message: '❌ - Please enter a password' });
        }

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
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

        console.log("✅ - User registered and logged in successfully");
        res.status(201).json({ message: '✅ - User registered and logged in successfully' });
    } catch (error) {
        console.error('❌ - Error during registration : ', error);
        return res.status(500).json({ message: '❌ - Server error during registration' });
    }
};

exports.logIn = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username) {
            return res.status(401).json({ message: '❌ - Please enter a username' });
        }

        if (!password) {
            return res.status(401).json({ message: '❌ - Please enter a password' });
        }

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: '❌ - User not found' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
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
        res.json({ message: '✅ - Login successful' });
    } catch (error) {
    }
};

exports.logOut = (req, res) => {
    if (!req.cookies.token) {
        return res.status(400).json({ message: '❌ - No active session found' });
    }

    res.clearCookie('token');
    console.log("✅ - Logout successful")
    res.json({ message: '✅ - Logout successful' });
};

exports.verifyToken = (req, res) => {
    res.json({ userId: req.user.id, role: req.user.role, username: req.user.username, image: req.user.image, password: req.user.password });
};