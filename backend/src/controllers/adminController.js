const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const getAllOrders = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;
  const total = await Order.countDocuments();
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  res.json({
    success: true,
    data: orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  order.status = req.body.status;
  if (req.body.status === 'Delivered') {
    order.isPaid = true;
    if (!order.paidAt) order.paidAt = new Date();
  }
  await order.save();
  res.json({ success: true, data: order });
});

const getStats = asyncHandler(async (req, res) => {
  const [totalProducts, totalOrders, totalUsers, revenueAgg] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
  ]);
  res.json({
    success: true,
    data: {
      totalProducts,
      totalOrders,
      totalUsers,
      revenue: revenueAgg[0]?.total || 0,
    },
  });
});

module.exports = { getAllOrders, updateOrderStatus, getStats };