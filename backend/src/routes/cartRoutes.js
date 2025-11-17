const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon
} = require('../controllers/cartController');

const { protect } = require('../middleware/auth');
const {
  validateAddToCart,
  validateMongoId
} = require('../middleware/validation');

// همه مسیرهای سبد خرید نیاز به احراز هویت دارند
router.use(protect);

router.get('/', getCart);
router.post('/', validateAddToCart, addToCart);
router.put('/:itemId', updateCartItem);
router.delete('/:itemId', removeFromCart);
router.delete('/', clearCart);

// کد تخفیف
router.post('/apply-coupon', applyCoupon);
router.delete('/remove-coupon', removeCoupon);

module.exports = router;