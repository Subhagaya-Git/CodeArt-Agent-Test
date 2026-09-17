const { body } = require('express-validator');

const checkout = [
  body('items').isArray({ min: 1 }).withMessage('Items are required'),
  body('items.*.product').notEmpty().withMessage('Product id is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.address').trim().notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.postalCode').trim().notEmpty().withMessage('Postal code is required'),
  body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
];

const updateStatus = [
  body('status')
    .isIn(['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'])
    .withMessage('Invalid status'),
];

module.exports = { checkout, updateStatus };