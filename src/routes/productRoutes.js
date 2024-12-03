const express = require('express');
const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  generateSeoDescription,
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', addProduct);
router.put('/:id', updateProduct);
router.get('/:id/seo-description', generateSeoDescription);

module.exports = router;
