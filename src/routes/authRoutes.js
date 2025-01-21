const express = require('express');
const { register, login, refreshToken } = require('../controllers/authController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Endpointy
router.post('/register', register); // Dodany endpoint
router.post('/login', login);
router.post('/refresh-token', authenticate, refreshToken);

module.exports = router;
