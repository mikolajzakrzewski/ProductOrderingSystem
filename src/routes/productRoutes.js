const express = require('express');
const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  generateSeoDescription,
} = require('../controllers/productController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, authorize(['PRACOWNIK']), addProduct);
router.put('/:id', authenticate, authorize(['PRACOWNIK']), updateProduct);
router.get('/:id/seo-description', authenticate, authorize(['PRACOWNIK']), generateSeoDescription);

module.exports = router;
