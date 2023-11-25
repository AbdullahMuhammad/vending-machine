const httpStatus = require('http-status');
const ProductsDao = require('../dao/ProductsDao');
const UserDao = require('../dao/UserDao');
const DepositDao = require('../dao/DepositDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
// I dont think we need enumroles here because we will check for user type at middleware
const { userConstant } = require('../config/constant');

class ProductsService {
    constructor() {
        this.productsDao = new ProductsDao();
        this.userDao = new UserDao();
        this.depositDao = new DepositDao();
    }

    /**
     * Create a product
     * @param {Object} productBody
     * @returns {Object}
     */
    // IMP NOTE: ALL VALIDATIONS GO AT MIDDLE LVL WITH JOI //
    createProduct = async (productBody) => {
        try {
            let message = 'Product created successfully.'; // Put all constants at one place. no magic strings please.
            let productData = await this.productsDao.create(productBody);

            if (!productData) {
                message = 'Product Creation Failed! Please Try again.'; // Again no magic strings
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
            }

            return responseHandler.returnSuccess(httpStatus.CREATED, message, productData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    };

    /**
     * Get products
     * @param {}
     * @returns {Object}
     */
    // No pagination in this version ;) //
    getProducts = async () => {
        try {
            let message = 'Product created successfully.'; // Put all constants at one place. no magic strings please.
            let productsData = await this.productsDao.findAll();

            if (!productsData) {
                message = 'No products found.'; // Again no magic strings
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
            }

            return responseHandler.returnSuccess(httpStatus.OK, message, productsData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    };

    /**
     * Get product by its ID
     * @param {Number} productId - The ID of the product to retrieve
     * @returns {Object} Response object containing the status code, message, and product data if found
     */
    getProductById = async (productId) => {
        try {
            let productData = await this.productsDao.findById(productId);

            if (!productData) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Product not found.');
            }

            return responseHandler.returnSuccess(httpStatus.OK, 'Product found.', productData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong!');
        }
    };

    /**
     * Update a product
     * @param {Number} productId - The ID of the product to update
     * @param {Object} updateData - Object containing the product data to update
     * @returns {Object} Response object containing the status code, message, and updated product data
     */
    updateProductById = async (updateData, productId) => {
        try {
            let updatedProduct = await this.productsDao.updateById(updateData, productId);

            if (!updatedProduct) {
                return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, 'Product failed to update.');
            }

            return responseHandler.returnSuccess(httpStatus.OK, 'Product updated successfully.', updatedProduct);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong!');
        }
    };

    /**
     * Delete a product
     * @param {Number} productId - The ID of the product to delete
     * @returns {Object} Response object containing the status code and deletion confirmation message
     */
    deleteProduct = async (productId) => {
        try {
            const product = await this.productsDao.findById(productId);

            if (!product) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Product not found.');
            }

            await this.productsDao.delete(productId);

            return responseHandler.returnSuccess(httpStatus.OK, 'Product deleted successfully.');
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong!');
        }
    };

    /**
     * Buy a product
     * @param {Number} productId - The ID of the product to delete
     * @param {Number} userId - The userId of the buyer
     * @returns {Object} Response object containing the status code and deletion confirmation message
     */
    buyProduct = async (productId, userId) => {
        try {

            console.log('LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL');
            console.log('productId', productId);
            console.log('userId', userId);
            console.log('LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL');


            const product = await this.productsDao.findById(productId);
            if (!product) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Product not found.');
            }

            if (product.quantity < 1) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Product is out of stock.');
            }

            const user = await this.userDao.findById(userId);
            if (!user || user.role !== 'buyer') {
                return responseHandler.returnError(httpStatus.FORBIDDEN, 'Only buyers can purchase products.');
            }

            const deposit = await this.depositDao.findByUserId(userId);

            console.log('*'.repeat(100));
            console.log('deposit');
            // console.log(deposit);
            // console.log('product');
            // console.log(product);
            console.log('*'.repeat(100));
            if (!deposit || deposit.amount < product.cost) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Insufficient funds to purchase the product.');
            }

            // Deduct the cost from the user's deposit and update the product quantity
            await this.depositDao.updateAmount(userId, deposit.amount - product.cost);
            await this.productsDao.updateQuantity(productId, product.quantity - 1);

            return responseHandler.returnSuccess(httpStatus.OK, 'Product purchased successfully.');
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to complete the purchase.');
        }
    };

}

module.exports = ProductsService;
