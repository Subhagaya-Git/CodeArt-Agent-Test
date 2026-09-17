const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { register: regVal, login: loginVal } = require('../validators/authValidator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

router.post('/register', regVal, validate, register);
router.post('/login', loginVal, validate, login);
router.get('/me', protect, getMe);

module.exports = router;