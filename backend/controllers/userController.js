const User = require('../models/User');
const bcryptjs = require('bcryptjs');

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.findAll();
        console.log('✅ - Users retrieved');
        res.json(users);
    } catch (err) {
        console.error("❌ - Error retrieving users");
        res.status(500).json({ message: '❌ - Error retrieving users' });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            console.log("❌ - User not found");
            return res.status(404).json({ message: '❌ - User not found' });
        }

        console.log('✅ - User retrieved');
        res.json(user);
    } catch (err) {
        console.error("❌ - Error retrieving user");
        res.status(500).json({ message: '❌ - Error retrieving user' });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, role, image } = req.body;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            console.log("❌ - User not found");
            return res.status(404).json({ message: '❌ - User not found' });
        }

        user.username = username || user.username;
        user.role = role || user.role;
        user.image = image || user.image;

        if (password) {
            const hashedPassword = await bcryptjs.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        console.log('✅ - User updated successfully');
        res.json({ message: '✅ - User updated successfully', user });
    } catch (err) {
        console.error("❌ - Error updating user", err);
        res.status(500).json({ message: '❌ - Error updating user', error: err.message || err });
    }
};


exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            console.log("❌ - User not found");
            return res.status(404).json({ message: '❌ - User not found' });
        }

        await user.destroy();
        console.log('✅ - User deleted successfully');
        res.json({ message: '✅ - User deleted successfully' });
    } catch (err) {
        console.error("❌ - Error deleting user");
        res.status(500).json({ message: '❌ - Error deleting user' });
    }
};