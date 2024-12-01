const express = require('express');
const { init } = require('../controllers/initController');

const router = express.Router();

router.post('/', init);

module.exports = router;
