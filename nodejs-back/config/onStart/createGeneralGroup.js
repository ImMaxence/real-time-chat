const Group = require('../../models/Group');

exports.createGeneralGroup = async () => {
    try {
        const generalGroup = await Group.findOne({ where: { name: 'general' } });

        if (!generalGroup) {
            await Group.create({
                name: 'general',
                maxMembers: 500,
                isDefault: true,
                isProtected: true,
            });
            console.log('✅ - General group created !');
        } else {
            console.log('✅ - General group already exists !');
        }
    } catch (error) {
        console.error('❌ - Error creating general group : ', error);
    }
};
