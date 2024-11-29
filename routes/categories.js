const express = require('express');
const router = express.Router();
const Category = require('../models/category');

router.get('/', async (req, res) => {
    try {
        const categories = await Category.fetchAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;