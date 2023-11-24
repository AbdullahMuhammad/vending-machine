const SuperDao = require('./SuperDao');
const models = require('../models');

const Product = models.product; // Assuming your Product model is named 'product'

class ProductsDao extends SuperDao {
    constructor() {
        super(Product);
    }

    // Delete a product
    async delete(productId) {
        const product = await Product.findById(productId);
        if (product) {
            return product.destroy();
        }
        return null;
    }

    // Method to get the first product
    async first() {
        return await Product.findOne();
    }
}

module.exports = ProductsDao;
