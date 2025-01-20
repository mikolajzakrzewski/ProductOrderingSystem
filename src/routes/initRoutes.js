const express = require('express');
const { init, initCustom } = require('../controllers/initController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/'/*, authenticate, authorize(['PRACOWNIK'])*/, init);
router.post('/custom'/*, authenticate, authorize(['PRACOWNIK'])*/, initCustom);

module.exports = router;
