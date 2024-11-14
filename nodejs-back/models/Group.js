const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Group = sequelize.define('Group', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isPrivate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    maxMembers: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: true,
});

Group.associate = (models) => {
    Group.belongsToMany(models.User, { through: 'UserGroups', foreignKey: 'groupId' });
    Group.hasMany(models.Message, { foreignKey: 'groupId' });
};

module.exports = Group;
