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

        /**
     * Update the quantity of a product.
     * @param {number} productId - The ID of the product to be updated.
     * @param {number} newQuantity - The new quantity for the product.
     * @returns {Promise<Model>} A promise that resolves with the updated product.
     */
    async updateQuantity(productId, newQuantity) {
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        product.quantity = newQuantity;
        return await product.save();
    }
}

module.exports = ProductsDao;
