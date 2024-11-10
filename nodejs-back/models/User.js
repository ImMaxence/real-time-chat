const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

User.associate = (models) => {
    User.belongsToMany(models.Group, { through: 'UserGroups', foreignKey: 'userId' });
};

module.exports = User;
