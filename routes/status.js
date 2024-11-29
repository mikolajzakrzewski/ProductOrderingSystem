const express = require('express');
const router = express.Router();
const Status = require('../models/status');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

router.get('/', async (req, res) => {
    try {
        const statuses = await Status.fetchAll();
        res.status(StatusCodes.OK).json(statuses);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

module.exports = router;