const prisma = require('../config/database');

exports.getAllCategories = async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
};
