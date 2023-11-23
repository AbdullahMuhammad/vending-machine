module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('deposits', {
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
          },
          amount: {
              type: Sequelize.INTEGER,
              allowNull: false,
          },
          user_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'users',
                  key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
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
      await queryInterface.dropTable('deposits');
  },
};