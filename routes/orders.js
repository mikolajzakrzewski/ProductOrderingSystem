const express = require('express');
const router = express.Router();
const Order = require('../models/order');

router.get('/', async (req, res) => {
    try {
        const orders = await Order.fetchAll();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const order = await Order.where({ id: req.params.id }).fetch();
        await order.save(req.body);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/status/:id', async (req, res) => {
    try {
        const orders = await Order.where({ status_id: req.params.id }).fetchAll();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;