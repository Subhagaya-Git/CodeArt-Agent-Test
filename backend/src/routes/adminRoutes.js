const express = require('express');
const router = express.Router();
const { getAllOrders, updateOrderStatus, getStats } = require('../controllers/adminController');
const { updateStatus } = require('../validators/orderValidator');
const validate = require('../middleware/validate');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin);
router.get('/stats', getStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateStatus, validate, updateOrderStatus);

module.exports = router;