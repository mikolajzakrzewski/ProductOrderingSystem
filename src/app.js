const express = require('express');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const statusRoutes = require('./routes/statusRoutes');
const initRoutes = require('./routes/initRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/status', statusRoutes);
app.use('/init', initRoutes);
app.use('/auth', authRoutes);
app.use(errorHandler);
module.exports = app;
