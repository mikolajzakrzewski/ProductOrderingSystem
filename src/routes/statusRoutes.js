const express = require('express');
const { getAllStatuses } = require('../controllers/statusController');

const router = express.Router();

router.get('/', getAllStatuses);

module.exports = router;
