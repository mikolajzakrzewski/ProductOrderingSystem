const prisma = require('../config/database');
const { StatusCodes } = require('http-status-codes');
const initData = require('../data/initData.json');

exports.init = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        if (products.length > 0) {
            return res.status(StatusCodes.CONFLICT).json({
                error: 'Database already contains products and cannot be initialized.',
            });
        } else {
            for (const item of initData) {
                await prisma.product.create({
                    data: {
                        name: item.name,
                        description: item.description,
                        unitPrice: item.unitPrice,
                        unitWeight: item.unitWeight,
                        categoryId: item.categoryId,
                    },
                });
            }
            res.status(StatusCodes.OK).json({ message: 'Database initialized.' });
        }
    } catch (error) {
        next(error);
    }
}
