const express = require('express');
const {
  getAllOrders,
  addOrder,
  updateOrder,
  getOrdersByStatus,
  addOrderOpinion,
} = require('../controllers/orderController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticate, getAllOrders); // Pobierz wszystkie zamówienia
router.post('/', authenticate, addOrder); // Dodaj nowe zamówienie
router.patch('/:id', authenticate, authorize(['PRACOWNIK']), updateOrder); // Zmień status zamówienia
router.get('/status/:id', authenticate, getOrdersByStatus); // Pobierz zamówienia z określonym stanem
router.post('/:id/opinions', authenticate, addOrderOpinion); // Dodaj opinię do zamówienia

module.exports = router;
