const express = require('express');
const router = express.Router();
const { checkout, getMyOrders, getOrder } = require('../controllers/orderController');
const { checkout: checkoutVal } = require('../validators/orderValidator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', checkoutVal, validate, checkout);
router.get('/', getMyOrders);
router.get('/:id', getOrder);

module.exports = router;