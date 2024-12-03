const prisma = require('../config/database');
const { StatusCodes } = require('http-status-codes');

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: { status: true, orderItems: { include: { product: true } } },
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.addOrder = async (req, res, next) => {
  try {
    const { approvalDate, statusId = 1, customerName, email, phoneNumber, items } = req.body;

    if (!customerName || !email || !phoneNumber) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Customer name, email, and phone number are required.',
      });
    }

    if (!/^\d{9,15}$/.test(phoneNumber)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Phone number must contain only digits and be between 9-15 characters.',
      });
    }

    if (!items || items.length === 0 || items.some((item) => item.quantity <= 0)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Order items must have positive quantities.',
      });
    }

    const productIds = items.map((item) => item.productId);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (existingProducts.length !== productIds.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'One or more product IDs do not exist in the database.',
      });
    }

    const newOrder = await prisma.order.create({
      data: {
        approvalDate,
        statusId,
        customerName,
        email,
        phoneNumber,
        orderItems: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });

    res.status(StatusCodes.CREATED).json(newOrder);
  } catch (error) {
    next(error);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { statusId, customerName, email, phoneNumber, approvalDate, items } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: { status: true },
    });

    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Order not found.' });
    }

    if (statusId) {
      if (order.status.name === 'CANCELED') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Cannot modify a canceled order.',
        });
      }

      const validTransitions = {
        UNCONFIRMED: ['CONFIRMED', 'CANCELED'],
        CONFIRMED: ['CANCELED', 'COMPLETED'],
        COMPLETED: [],
        CANCELED: [],
      };

      const newStatus = await prisma.orderStatus.findUnique({ where: { id: statusId } });

      if (!newStatus) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Status not found.',
        });
      }

      if (!validTransitions[order.status.name].includes(newStatus.name)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: `Invalid status transition from "${order.status.name}" to "${newStatus.name}".`,
        });
      }
    }

    if (items && items.length > 0) {
      if (items.some((item) => item.quantity <= 0)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'All items must have positive quantities.',
        });
      }

      const productIds = items.map((item) => item.productId);
      const existingProducts = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      if (existingProducts.length !== productIds.length) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'One or more product IDs do not exist in the database.',
        });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: {
        ...(statusId && { statusId }),
        ...(customerName && { customerName }),
        ...(email && { email }),
        ...(phoneNumber && { phoneNumber }),
        ...(approvalDate && { approvalDate }),
      },
    });

    if (items && items.length > 0) {
      await prisma.orderItem.deleteMany({ where: { orderId: Number(id) } });
      await prisma.orderItem.createMany({
        data: items.map((item) => ({
          orderId: Number(id),
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

exports.getOrdersByStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const orders = await prisma.order.findMany({
      where: { statusId: Number(id) },
      include: { status: true, orderItems: true },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.addOrderOpinion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, text } = req.body;

    if (!rating || !text) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Rating and text are required.',
        });
    }

    if (rating < 1 || rating > 5) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Rating must be an integer between 1 and 5.',
        });
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { status: true },
    });

    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Order not found.' });
    }

    if (order.status.name !== 'COMPLETED' && order.status.name !== 'CANCELED') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'An opinion can only be added to completed or canceled orders.',
      });
    }

    const previousReview = await prisma.review.findFirst({
        where: { orderId: Number(id) },
    });

    if (previousReview) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'An opinion already exists for this order.',
        });
    }

    const newReview = await prisma.review.create({
        data: {
            orderId: Number(id),
            rating: rating,
            text: text,
        },
    });

    res.status(StatusCodes.CREATED).json(newReview);
  } catch (error) {
    next(error);
  }
};
