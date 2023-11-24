'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('deposits', 'user_id', 'userId');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('deposits', 'userId', 'user_id');
    }
};
