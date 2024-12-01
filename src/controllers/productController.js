const prisma = require('../config/database');
const { StatusCodes } = require('http-status-codes');

exports.getAllProducts = async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (product) res.json(product);
  else res.status(404).json({ error: 'Product not found' });
};

exports.addProduct = async (req, res, next) => {
    try {
      const { name, description, unitPrice, unitWeight, categoryId } = req.body;
  
      // Walidacja
      if (!name || name.trim() === '') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Product name cannot be empty.',
        });
      }

      if (!description || description.trim() === '') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Product description cannot be empty',
        });
      }

      if ( unitPrice <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Product unit price must be greater then 0',
        });
      }

      if ( unitWeight <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Product unit weight must be greater then 0',
        });
      }
  
      const newProduct = await prisma.product.create({
        data: { name, description, unitPrice, unitWeight, categoryId },
      });
      res.status(StatusCodes.CREATED).json(newProduct);
    } catch (error) {
      next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description, unitPrice, unitWeight, categoryId } = req.body;

      // Walidacja
      if (!name || name.trim() === '') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Product name cannot be empty.',
        });
      }

      if (!description || description.trim() === '') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Product description cannot be empty',
        });
      }

      if ( unitPrice <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Product unit price must be greater then 0',
        });
      }

      if ( unitWeight <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Product unit weight must be greater then 0',
        });
      }
  
      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: { name, description, unitPrice, unitWeight, categoryId },
      });
  
      res.json(updatedProduct);
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found.' });
      }
      next(error);
    }
  };
