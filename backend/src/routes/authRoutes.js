const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  uploadAvatar,
  deleteAccount
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validateChangePassword
} = require('../middleware/validation');

// مسیرهای عمومی (بدون نیاز به احراز هویت)
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// مسیرهای محافظت شده (نیاز به احراز هویت)
router.use(protect); // همه مسیرهای زیر نیاز به احراز هویت دارند

router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/change-password', validateChangePassword, changePassword);
router.put('/avatar', uploadAvatar);
router.delete('/account', deleteAccount);

module.exports = router;