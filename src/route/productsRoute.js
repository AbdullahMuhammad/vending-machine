const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth');

router.get('/products');
router.get('/products/:id');
router.post('/products', auth());
router.put('/products/:id', auth());
router.delete('/products/:id', auth());

module.exports = router;
