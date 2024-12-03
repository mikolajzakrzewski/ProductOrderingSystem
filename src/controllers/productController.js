const prisma = require('../config/database');
const { StatusCodes } = require('http-status-codes');
const axios = require('axios');

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

      if (name !== undefined && name.trim() === '') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Product name cannot be an empty string.',
        });
      }
  
      if (description !== undefined && description.trim() === '') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Product description cannot be an empty string.',
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

    // Pobranie danych produktu z bazy
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const prompt = `
      You are an SEO expert. Generate a concise, keyword-rich HTML description for a product:
      - Name: ${product.name}
      - Description: ${product.description}
      - Price: ${product.unitPrice}
      - Category: ${product.category.name}
      - Use <div> tags to structure the output.
      - Limit to 300 tokens.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY_1}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an SEO expert generating product descriptions.' },
          { role: 'user', content: prompt.trim() },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.choices || !data.choices[0]?.message?.content) {
      console.error('OpenAI API Error:', data);
      throw new Error(`OpenAI API returned an error: ${data.error?.message || 'Unknown error'}`);
    }

    const seoDescription = data.choices[0].message.content.trim();

    // Zapisanie opisu SEO w bazie
    await prisma.product.update({
      where: { id: Number(id) },
      data: { descriptionHTML: seoDescription },
    });

    // Zwracanie opisu w formacie JSON
    res.json({ seoDescription });
  } catch (error) {
    console.error('Error generating SEO description:', error.message);
    next(error); // Obsługa błędów przez middleware
  }
};