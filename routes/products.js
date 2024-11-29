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
    const { name, description, unit_price, unit_weight, category_id } = req.body;

    if (!name) {
        return res.status(StatusCodes.BAD_REQUEST).send('Name is required');
    } else if (!description) {
        return res.status(StatusCodes.BAD_REQUEST).send('Description is required');
    } else if  (!unit_price) {
        return res.status(StatusCodes.BAD_REQUEST).send('Unit price is required');
    } else if (!unit_weight) {
        return res.status(StatusCodes.BAD_REQUEST).send('Unit weight is required');
    } else if (unit_price <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).send('Unit price must be greater than 0');
    } else if (unit_weight <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).send('Unit weight must be greater than 0');
    } else if (!category_id) {
        return res.status(StatusCodes.BAD_REQUEST).send('Category ID is required');
    }

    try {
        const product = new Product(req.body);
        await product.save();
        res.status(StatusCodes.CREATED).json(product);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

router.put('/:id', async (req, res) => {
    const { name, description, unit_price, unit_weight, category_id } = req.body;
    if (unit_price !== undefined && unit_price <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).send('Unit price must be greater than 0');
    } else if (unit_weight !== undefined && unit_weight <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).send('Unit weight must be greater than 0');
    }

    try {
        const product = await Product.where({ product_id: req.params.id }).fetch({ require: false });

        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).send('Product with the specified ID does not exist');
        } else {
            await product.save(req.body, { patch: true });
            res.status(StatusCodes.OK).json(product);
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

module.exports = router;