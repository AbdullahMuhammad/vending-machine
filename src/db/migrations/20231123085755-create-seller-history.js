module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('seller_history', {
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
          },
          seller_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'users',
                  key: 'id',
              },
          },
          product_name: {
              type: Sequelize.STRING,
              allowNull: false,
          },
          quantity_added: {
              type: Sequelize.INTEGER,
              allowNull: false,
          },
          price_per_item: {
              type: Sequelize.INTEGER,
              allowNull: false,
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
      await queryInterface.dropTable('seller_history');
  },
};
