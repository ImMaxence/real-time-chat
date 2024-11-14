const bcrypt = require('bcryptjs');
const User = require('../../models/User');

exports.createDefaultAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ where: { username: 'admin' } });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);

            const adminUser = await User.create({
                username: process.env.ADMIN_ID,
                password: hashedPassword,
                role: 2
            });
            console.log('✅ - Default admin user created!');
            return adminUser;
        } else {
            console.log('✅ - Default admin user already exists!');
            return existingAdmin;
        }
    } catch (error) {
        console.error('❌ - Error creating default admin user: ', error);
    }
};
