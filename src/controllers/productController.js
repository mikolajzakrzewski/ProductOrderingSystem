const prisma = require('../config/database');
const { StatusCodes } = require('http-status-codes');
const openai = require('../config/openai');

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

exports.generateSeoDescription = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      // Pobranie danych produktu z bazy danych
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
        include: { category: true }, // Pobierz również kategorię produktu
      });
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Przygotowanie prompta dla modelu OpenAI
      const prompt = `
        Generate a search engine optimized (SEO) HTML description for a product with the following details:
        - Name: ${product.name}
        - Description: ${product.description}
        - Price: ${product.unitPrice}
        - Category: ${product.category.name}
        Ensure the description uses proper HTML tags and includes keywords relevant to the product.
      `;
  
      // Wywołanie OpenAI
      const response = await openai.createCompletion({
        model: 'text-davinci-003', // Możesz użyć odpowiedniego modelu
        prompt,
        max_tokens: 300,
      });
  
      const seoDescription = response.data.choices[0].text.trim();
  
      // Zwrócenie opisu SEO
      res.json({ seoDescription });
    } catch (error) {
      next(error);
    }
};