const express = require('express');
const router = express.Router();
const Status = require('../models/status');

router.get('/', async (req, res) => {
    try {
        const statuses = await Status.fetchAll();
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;