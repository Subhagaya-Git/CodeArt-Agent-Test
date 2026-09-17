const { body } = require('express-validator');

const updateItem = [
  body('productId').notEmpty().withMessage('Product id is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

module.exports = { updateItem };