const SuperDao = require('./SuperDao');
const models = require('../models');

const Product = models.product; // Assuming your Product model is named 'product'

class ProductsDao extends SuperDao {
    constructor() {
        super(Product);
    }

    // Find a product by its ID
    async findById(productId) {
        return Product.findById(productId);
    }

    // Find all products
    async findAll() {
        return Product.findAll();
    }

    // Create a product
    async create(productBody) {
        return Product.create(productBody);
    }

    // Update a product
    async update(productId, updateData) {
        const product = await Product.findById(productId);
        if (product) {
            return product.updateById(productId, updateData);
        }
        return null;
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
