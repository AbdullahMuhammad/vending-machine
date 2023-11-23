module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'email_verified', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'email_verified', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0 // or whatever the previous default was
    });
  },
};
