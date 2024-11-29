const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

router.get('/', async (req, res) => {
    try {
        const products = await Product.fetchAll();
        res.status(StatusCodes.OK).json(products);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.where({ product_id: req.params.id }).fetch({ require: false });

        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
        } else {
            res.status(StatusCodes.OK).json(product);
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(StatusCodes.CREATED).json(product);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const product = await Product.where({ product_id: req.params.id }).fetch({ require: false });

        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
        } else {
            await product.save(req.body, { update: true });
            res.status(StatusCodes.OK).json(product);
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

module.exports = router;