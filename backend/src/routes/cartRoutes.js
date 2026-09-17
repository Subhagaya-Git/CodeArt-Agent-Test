const express = require('express');
const router = express.Router();
const { getCart, addItem, updateItem, removeItem, clearCart } = require('../controllers/cartController');
const { updateItem: updateVal } = require('../validators/cartValidator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getCart).delete(clearCart);
router.post('/items', addItem);
router.put('/items', updateVal, validate, updateItem);
router.delete('/items/:productId', removeItem);

module.exports = router;