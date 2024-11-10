const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Message = sequelize.define('Message', {
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    file: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

Message.associate = (models) => {
    Message.belongsTo(models.Group, { foreignKey: 'groupId' });
    Message.belongsTo(models.User, { foreignKey: 'userId' });
};

module.exports = Message;
