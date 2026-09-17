const { body } = require('express-validator');

const create = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('image_url').optional().isString(),
];

const update = [
  body('name').optional().trim().notEmpty().isLength({ max: 120 }),
  body('description').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('category').optional().trim().notEmpty(),
  body('image_url').optional().isString(),
];

const review = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required').isLength({ max: 500 }),
];

module.exports = { create, update, review };