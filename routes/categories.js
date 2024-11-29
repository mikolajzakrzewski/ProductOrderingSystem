const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

router.get('/', async (req, res) => {
    try {
        const categories = await Category.fetchAll();
        res.status(StatusCodes.OK).json(categories);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

module.exports = router;