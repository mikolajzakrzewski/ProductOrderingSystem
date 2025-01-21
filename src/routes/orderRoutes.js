const express = require('express');
const {
  getAllOrders,
  addOrder,
  updateOrder,
  getOrdersByStatus,
  addOrderOpinion,
  getAllOpinions,
  getOrdersByClientId,
} = require('../controllers/orderController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticate, getAllOrders);
router.post('/', authenticate, addOrder);
router.patch('/:id', authenticate, authorize(['PRACOWNIK']), updateOrder);
router.get('/status/:id', authenticate, getOrdersByStatus);
router.post('/:id/opinions', authenticate, addOrderOpinion);
router.get('/opinions', authenticate, getAllOpinions);
router.get('/:id', authenticate, getOrdersByClientId);
module.exports = router;
