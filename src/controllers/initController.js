const prisma = require('../config/database');
const { StatusCodes } = require('http-status-codes');
const initData = require('../data/initData.json');
const { addProduct } = require('./productController');

exports.init = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();
    if (products.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        error: 'Database already contains products and cannot be initialized.',
      });
    } else {
      for (const item of initData) {
        await addProduct(
          {
            body: {
              name: item.name,
              description: item.description,
              unitPrice: item.unitPrice,
              unitWeight: item.unitWeight,
              categoryId: item.categoryId,
            },
          },
          { status: () => ({ json: () => {} }) },
          next
        );
      }
      res.status(StatusCodes.OK).json({ message: 'Database initialized.' });
    }
  } catch (error) {
    next(error);
  }
};

exports.initCustom = async (req, res, next) => {
  const { products } = req.body;
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Invalid product list provided.',
    });
  }

  try {
    const existingProducts = await prisma.product.findMany();
    if (existingProducts.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        error: 'Database already contains products and cannot be initialized.',
      });
    } else {
      for (const item of products) {
        await addProduct(
          {
            body: {
              name: item.name,
              description: item.description,
              unitPrice: item.unitPrice,
              unitWeight: item.unitWeight,
              categoryId: item.categoryId,
            },
          },
          { status: () => ({ json: () => {} }) },
          next
        );
      }
      res.status(StatusCodes.OK).json({ message: 'Database initialized with custom products.' });
    }
  } catch (error) {
    next(error);
  }
};
