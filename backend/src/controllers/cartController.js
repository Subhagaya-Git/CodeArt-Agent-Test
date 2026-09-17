const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');

const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  res.json({ success: true, data: cart });
});

const addItem = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  if (product.stock < quantity) throw new ApiError(400, 'Not enough stock');

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, product.stock);
  } else {
    cart.items.push({ product: productId, quantity });
  }
  await cart.save();
  const populated = await cart.populate('items.product');
  res.json({ success: true, data: populated });
});

const updateItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  if (product.stock < quantity) throw new ApiError(400, 'Not enough stock');

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');
  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) throw new ApiError(404, 'Item not in cart');
  item.quantity = quantity;
  await cart.save();
  const populated = await cart.populate('items.product');
  res.json({ success: true, data: populated });
});

const removeItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  const populated = await cart.populate('items.product');
  res.json({ success: true, data: populated });
});

const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ success: true, message: 'Cart cleared' });
});

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };