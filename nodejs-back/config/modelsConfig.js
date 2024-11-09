const User = require('../models/User');
const Group = require('../models/Group');
const Message = require('../models/Message');

const models = {
    User,
    Group,
    Message,
};

Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});

module.exports = models;
