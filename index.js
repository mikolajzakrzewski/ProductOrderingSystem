const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const categoriesRouter = require('./routes/categories');
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');
const statusRouter = require('./routes/status');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/categories', categoriesRouter);
app.use('/orders', ordersRouter);
app.use('/products', productsRouter);
app.use('/status', statusRouter);

module.exports = app;
