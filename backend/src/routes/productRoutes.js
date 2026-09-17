const express = require('express');
const router = express.Router();
const {
  getProducts,
  getCategories,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
} = require('../controllers/productController');
const { create, update, review } = require('../validators/productValidator');
const validate = require('../middleware/validate');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(getProducts).post(protect, admin, create, validate, createProduct);
router.get('/categories', getCategories);
router.route('/:id').get(getProduct).put(protect, admin, update, validate, updateProduct).delete(protect, admin, deleteProduct);
router.post('/:id/reviews', protect, review, validate, createReview);

module.exports = router;