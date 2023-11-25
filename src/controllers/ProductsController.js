const ProductsService = require('../service/ProductsService');

const productsService = new ProductsService();

class ProductsController {

    // Handle POST request to create a new product
    async createProduct(req, res) {
        const productBody = req.body;
        const { response, statusCode } = await productsService.createProduct(productBody);
        return res.status(statusCode).json({
            message: response.message,
            data: response.data,
        });
    }

    // Handle GET request to retrieve all products
    async getProducts(req, res) {
        const { response, statusCode } = await productsService.getProducts();
        return res.status(statusCode).json({
            message: response.message,
            data: response.data,
        });
    }

    // Handle GET request to retrieve a product by ID
    async getProductById(req, res) {
        const productId = parseInt(req.params.id, 10);
        const { response, statusCode } = await productsService.getProductById(productId);
        return res.status(statusCode).json({
            message: response.message,
            data: response.data,
        });
    }

    // Handle PUT request to update a product by ID
    async updateProduct(req, res) {
        const productId = parseInt(req.params.id, 10);
        const updateData = req.body;
        const { response, statusCode } = await productsService.updateProductById(updateData, productId);
        return res.status(statusCode).json({
            message: response.message,
            data: response.data,
        });
    }

    // Handle DELETE request to delete a product by ID
    async deleteProduct(req, res) {
        const productId = parseInt(req.params.id, 10);
        const { response, statusCode } = await productsService.deleteProduct(productId);
        return res.status(statusCode).json({
            message: response.message,
            data: response.data,
        });
    }

    // Handle buy request to buy a product by ID
    async buy(req, res) {
        const productId = parseInt(req.params.id, 10);
        const { userId } = req.body;
        const { response, statusCode } = await productsService.buyProduct(productId, userId);
        return res.status(statusCode).json({
            message: response.message,
            data: response.data,
        });
    }
}

module.exports = new ProductsController();
