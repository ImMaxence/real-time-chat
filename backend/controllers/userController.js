const User = require('../models/User');

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        console.log(err)
    }
};