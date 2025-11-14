const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addAddress,
  updateAddress,
  deleteAddress,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getUserStats
} = require('../controllers/userController');

const { protect } = require('../middleware/auth');
const { admin, canModifyUser } = require('../middleware/admin');
const {
  validateMongoId,
  validatePagination
} = require('../middleware/validation');

// مسیرهای کاربر (نیاز به احراز هویت)
router.use(protect);

// مدیریت آدرس‌ها
router.post('/addresses', addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

// لیست علاقه‌مندی‌ها
router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', validateMongoId('productId'), addToWishlist);
router.delete('/wishlist/:productId', validateMongoId('productId'), removeFromWishlist);

// مسیرهای ادمین
router.use(admin);

router.get('/', validatePagination, getUsers);
router.get('/stats/dashboard', getUserStats);
router.get('/:id', validateMongoId('id'), getUser);
router.put('/:id', validateMongoId('id'), updateUser);
router.delete('/:id', validateMongoId('id'), canModifyUser, deleteUser);

module.exports = router;