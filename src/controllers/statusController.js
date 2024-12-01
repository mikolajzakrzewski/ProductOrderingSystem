const prisma = require('../config/database');

exports.getAllStatuses = async (req, res) => {
  const statuses = await prisma.orderStatus.findMany();
  res.json(statuses);
};
