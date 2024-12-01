const express = require('express');
const {
  getAllOrders,
  addOrder,
  updateOrderStatus,
  getOrdersByStatus,
  addOrderOpinion,
} = require('../controllers/orderController');

const router = express.Router();

router.get('/', getAllOrders); // Pobierz wszystkie zamówienia
router.post('/', addOrder); // Dodaj nowe zamówienie
router.patch('/:id', updateOrderStatus); // Zmień status zamówienia
router.get('/status/:id', getOrdersByStatus); // Pobierz zamówienia z określonym stanem
router.post('/:id/opinions', addOrderOpinion); // Dodaj opinię do zamówienia

module.exports = router;
