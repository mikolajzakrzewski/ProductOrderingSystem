const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

router.get('/', async (req, res) => {
    try {
        const orders = await Order.fetchAll();
        res.status(StatusCodes.OK).json(orders);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

router.post('/', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(StatusCodes.CREATED).json(order);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const order = await Order.where({ order_id: req.params.id }).fetch({ require: false });

        if (!order) {
            res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
        } else {
            await order.save(req.body, { patch: true });
            res.status(StatusCodes.OK).json(order);
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

router.get('/status/:id', async (req, res) => {
    try {
        const orders = await Order.where({ status_id: req.params.id }).fetchAll();
        res.status(StatusCodes.OK).json(orders);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

module.exports = router;