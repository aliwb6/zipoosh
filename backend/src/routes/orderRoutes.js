const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats
} = require('../controllers/orderController');

const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const {
  validateCreateOrder,
  validateMongoId,
  validatePagination
} = require('../middleware/validation');

// مسیرهای کاربر
router.use(protect); // همه مسیرها نیاز به احراز هویت دارند

router.post('/', validateCreateOrder, createOrder);
router.get('/my-orders', validatePagination, getMyOrders);
router.get('/:id', validateMongoId('id'), getOrder);
router.put('/:id/cancel', validateMongoId('id'), cancelOrder);

// مسیرهای ادمین
router.get('/', admin, validatePagination, getAllOrders);
router.put('/:id/status', admin, validateMongoId('id'), updateOrderStatus);
router.get('/stats/dashboard', admin, getOrderStats);

module.exports = router;