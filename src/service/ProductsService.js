const httpStatus = require('http-status');
const ProductsDao = require('../dao/ProductsDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
// I dont think we need enumroles here because we will check for user type at middleware
const { userConstant } = require('../config/constant');

class ProductsService {
    constructor() {
        this.productsDao = new ProductsDao();
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
          
            return responseHandler.returnSuccess(httpStatus.CREATED, message, productsData);
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
    updateProduct = async (productId, updateData) => {
        try {
            const product = await this.productsDao.findById(productId);
    
            if (!product) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Product not found.');
            }
    
            let updatedProduct = await this.productsDao.update(productId, updateData);
    
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
    
}

module.exports = ProductsService;
