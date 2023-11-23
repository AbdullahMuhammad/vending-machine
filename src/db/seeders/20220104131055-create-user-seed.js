const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { rolesEnum } = require('../../config/constant');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('users', [
            {
                uuid: uuidv4(),
                first_name: 'John',
                last_name: 'Doe',
                email: 'buyer@example.com',
                password: bcrypt.hashSync('buyer123', 8),
                status: 1,
                email_verified: 1,
                address: '123 Buyer St',
                phone_number: '123-456-7890',
                role: rolesEnum.BUYER, // Use RolesEnum for buyer
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                uuid: uuidv4(),
                first_name: 'Jane',
                last_name: 'Smith',
                email: 'seller@example.com',
                password: bcrypt.hashSync('seller123', 8),
                status: 1,
                email_verified: 1,
                address: '456 Seller Ave',
                phone_number: '987-654-3210',
                role: rolesEnum.SELLER, // Use RolesEnum for seller
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('users', null, {});
    },
};
