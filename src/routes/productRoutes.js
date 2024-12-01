const express = require('express');
const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', addProduct);
router.put('/:id', updateProduct);

module.exports = router;
