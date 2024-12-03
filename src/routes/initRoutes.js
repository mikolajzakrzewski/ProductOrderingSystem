const express = require('express');
const { init } = require('../controllers/initController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticate, authorize(['PRACOWNIK']), init);

module.exports = router;
