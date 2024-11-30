const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Status = require('../models/status');
const Product = require('../models/product');
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
    const { approval_date, status_id, username, email, phone, order_items } = req.body;

    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (!status_id) {
        return res.status(StatusCodes.BAD_REQUEST).send("Field 'status_id' is required");
    } else if (!username) {
        return res.status(StatusCodes.BAD_REQUEST).send("Field 'username' is required");
    } else if (!email) {
        return res.status(StatusCodes.BAD_REQUEST).send("Field 'email' is required");
    } else if (!emailRegex.test(email)) {
        return res.status(StatusCodes.BAD_REQUEST).send('Invalid email address');
    } else if (!phone) {
        return res.status(StatusCodes.BAD_REQUEST).send("Field 'phone' is required");
    }  else if (!phoneRegex.test(phone)) {
        return res.status(StatusCodes.BAD_REQUEST).send('Invalid phone number');
    }

    try {
        const order = new Order({ approval_date, status_id, username, email, phone });
        await order.save();

        if (Array.isArray(order_items) && order_items.length > 0) {
            for (let i = 0; i < order_items.length; i++) {
                const orderItem = order_items[i];
                const { product_id, quantity } = orderItem;
                const product = await Product.where({ product_id: product_id }).fetch({ require: false });

                if (!product_id) {
                    return res.status(StatusCodes.BAD_REQUEST).send(`Field 'product_id' is required for order item ${i + 1}`);
                } else if (!product) {
                    return res.status(StatusCodes.BAD_REQUEST).send(`Product with ID ${product_id} for order item ${i + 1} does not exist`);
                } else if (!quantity) {
                    return res.status(StatusCodes.BAD_REQUEST).send(`Field 'quantity' is required for order item ${i + 1}`);
                } else if (quantity < 1) {
                    return res.status(StatusCodes.BAD_REQUEST).send(`Quantity must be greater than 0 for order item ${i + 1}`);
                }

                await order.related('products').attach({
                    product_id: product_id,
                    quantity: quantity
                });
            }
        }

        res.status(StatusCodes.CREATED).json(order);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

router.patch('/:id', async (req, res) => {
    const { approval_date, status_id, username, email, phone, order_items } = req.body;

    try {
        const order = await Order.where({ order_id: req.params.id }).fetch({
            withRelated: ['status'],
            require: false
        });

        if (!order) {
            res.status(StatusCodes.NOT_FOUND).send('Order with the specified ID does not exist');
        } else {
            const orderStatusName = order.related('status').get('name');

            // Prevent updating a canceled order
            if (orderStatusName === 'CANCELLED') {
                res.status(StatusCodes.BAD_REQUEST).send('A cancelled order cannot be updated');
            }

            let newOrderStatus = null;
            if (status_id) {
                newOrderStatus = await Status.where({ status_id: status_id }).fetch({ require: false });
                let newOrderStatusName = null;

                if (newOrderStatus) {
                    newOrderStatusName = newOrderStatus.get('name');

                    const validChanges = {
                        'NOT_APPROVED': ['APPROVED', 'CANCELLED', 'COMPLETED'],
                        'APPROVED': ['CANCELLED', 'COMPLETED']
                    };

                    // Prevent changing the order status to an 'earlier' status
                    if (!validChanges[orderStatusName].includes(newOrderStatusName)) {
                        return res.status(StatusCodes.BAD_REQUEST).send(`Cannot change order status from ${orderStatusName} to ${newOrderStatusName}`);
                    }
                }
            }

            await order.save(req.body, { patch: true });
            res.status(StatusCodes.NO_CONTENT).json(order);
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