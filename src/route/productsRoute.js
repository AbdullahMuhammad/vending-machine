const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth');
const productValidator = require('../validator/ProductValidator');
const productsController = require('../controllers/ProductsController');

router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);
router.post('/', auth(), productValidator.productCreateValidator, productsController.createProduct);
router.put('/:id', auth(), productValidator.productUpdateValidator, productsController.updateProduct);
router.delete('/:id', auth(), productsController.deleteProduct);

module.exports = router;
