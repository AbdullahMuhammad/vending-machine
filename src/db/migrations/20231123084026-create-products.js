module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('products', {
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
          },
          quantity: {
              type: Sequelize.INTEGER,
              allowNull: false,
          },
          cost: {
              type: Sequelize.INTEGER,
              allowNull: false,
          },
          productName: {
              type: Sequelize.STRING,
              allowNull: false,
          },
          sellerId: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'users',
                  key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
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
      await queryInterface.dropTable('products');
  },
};
