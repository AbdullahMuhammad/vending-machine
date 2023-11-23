module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('buyer_history', {
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
          },
          buyer_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'users',
                  key: 'id',
              },
          },
          product_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'products',
                  key: 'id',
              },
          },
          created_at: {
              allowNull: false,
              type: Sequelize.DATE,
          },
          updated_at: {
              allowNull: false,
              type: Sequelize.DATE,
          },
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('buyer_history');
  },
};
