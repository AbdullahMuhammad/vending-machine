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
}

module.exports = ProductsDao;
