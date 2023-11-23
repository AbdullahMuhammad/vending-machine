module.exports = {
  up: async (queryInterface, Sequelize) => {
      // Query to get all sellers from the users table
      const sellers = await queryInterface.sequelize.query(
          `SELECT id FROM users WHERE role = 'seller'`,
          { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      // Map through the sellers and create products for each
      const products = sellers.map(seller => ({
          quantity: 10,
          cost: 50, // Assuming cost is in cents
          productName: 'Sample Product',
          sellerId: seller.id, // Use the ID from the sellers query
          created_at: new Date(),
          updated_at: new Date(),
      }));

      // Bulk insert products
      return queryInterface.bulkInsert('products', products);
  },

  down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('products', null, {});
  },
};
