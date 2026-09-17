const { body } = require('express-validator');

const register = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const login = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { register, login };