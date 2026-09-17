const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');

const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.category) filter.category = req.query.category.toLowerCase();
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

  res.json({
    success: true,
    data: products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const cats = await Product.distinct('category');
  res.json({ success: true, data: cats.sort() });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, data: product });
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  Object.assign(product, req.body);
  const updated = await product.save();
  res.json({ success: true, data: updated });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, message: 'Product removed' });
});

const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  const already = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
  if (already) throw new ApiError(400, 'You already reviewed this product');

  product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((a, r) => a + r.rating, 0) / product.numReviews;
  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
});

module.exports = {
  getProducts,
  getCategories,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
};