const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const ApiError = require('../utils/ApiError');

const checkout = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod = 'Mock Payment' } = req.body;

  let orderItems = [];
  let totalPrice = 0;

  for (const it of items) {
    const product = await Product.findById(it.product);
    if (!product) throw new ApiError(404, `Product not found: ${it.product}`);
    if (product.stock < it.quantity) throw new ApiError(400, `Not enough stock for ${product.name}`);
    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: it.quantity,
      image_url: product.image_url,
    });
    totalPrice += product.price * it.quantity;
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
    status: 'Paid',
    isPaid: true,
    paidAt: new Date(),
  });

  for (const it of items) {
    await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.quantity } });
  }
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  res.status(201).json({ success: true, data: order });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }
  res.json({ success: true, data: order });
});

module.exports = { checkout, getMyOrders, getOrder };