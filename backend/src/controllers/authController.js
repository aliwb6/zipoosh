const User = require('../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// ═══════════════════════════════════════════════════════════
// توابع کمکی (Inline)
// ═══════════════════════════════════════════════════════════

/**
 * تولید JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'zipoosh_secret_key_2025', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

/**
 * Wrapper برای async functions
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * کلاس خطای سفارشی
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// ═══════════════════════════════════════════════════════════
// Controller Functions
// ═══════════════════════════════════════════════════════════

/**
 * @desc    ثبت نام کاربر جدید
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  // بررسی وجود کاربر
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }]
  });

  if (existingUser) {
    if (existingUser.email === email) {
      const error = new ErrorResponse('این ایمیل قبلا ثبت شده است', 400);
      return next(error);
    }
    if (existingUser.phone === phone) {
      const error = new ErrorResponse('این شماره تلفن قبلا ثبت شده است', 400);
      return next(error);
    }
  }

  // ایجاد کاربر جدید
  const user = await User.create({
    name,
    email,
    phone,
    password
  });

  console.log(`✅ کاربر جدید ثبت شد: ${name} (${email})`);

  // تولید توکن
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'ثبت نام با موفقیت انجام شد',
    data: {
      user: user.getPublicProfile(),
      token
    }
  });
});

/**
 * @desc    ورود کاربر
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // یافتن کاربر
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    const error = new ErrorResponse('ایمیل یا رمز عبور اشتباه است', 401);
    return next(error);
  }

  // بررسی رمز عبور
  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    const error = new ErrorResponse('ایمیل یا رمز عبور اشتباه است', 401);
    return next(error);
  }

  // بررسی فعال بودن حساب
  if (!user.isActive) {
    const error = new ErrorResponse('حساب کاربری شما غیرفعال شده است', 403);
    return next(error);
  }

  // تولید توکن
  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'ورود موفقیت‌آمیز بود',
    data: {
      user: user.getPublicProfile(),
      token
    }
  });
});

/**
 * @desc    دریافت اطلاعات کاربر جاری
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('wishlist', 'name slug thumbnail price discountPrice');

  res.json({
    success: true,
    data: {
      user: user.getPublicProfile()
    }
  });
});

/**
 * @desc    بروزرسانی پروفایل کاربر
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, email, phone } = req.body;

  // بررسی تکراری نبودن ایمیل
  if (email && email !== req.user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new ErrorResponse('این ایمیل قبلا ثبت شده است', 400);
      return next(error);
    }
  }

  // بررسی تکراری نبودن شماره
  if (phone && phone !== req.user.phone) {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      const error = new ErrorResponse('این شماره تلفن قبلا ثبت شده است', 400);
      return next(error);
    }
  }

  // بروزرسانی
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: name || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone,
      ...(email && email !== req.user.email && { isEmailVerified: false }),
      ...(phone && phone !== req.user.phone && { isPhoneVerified: false })
    },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'پروفایل با موفقیت بروزرسانی شد',
    data: {
      user: user.getPublicProfile()
    }
  });
});

/**
 * @desc    تغییر رمز عبور
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // دریافت کاربر با رمز عبور
  const user = await User.findById(req.user._id).select('+password');

  // بررسی رمز عبور فعلی
  const isPasswordMatch = await user.matchPassword(currentPassword);

  if (!isPasswordMatch) {
    const error = new ErrorResponse('رمز عبور فعلی اشتباه است', 401);
    return next(error);
  }

  // تنظیم رمز عبور جدید
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'رمز عبور با موفقیت تغییر یافت'
  });
});

/**
 * @desc    درخواست بازیابی رمز عبور
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const error = new ErrorResponse('کاربری با این ایمیل یافت نشد', 404);
    return next(error);
  }

  // تولید توکن بازیابی
  const resetToken = crypto.randomBytes(32).toString('hex');

  // هش کردن و ذخیره
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 دقیقه

  await user.save({ validateBeforeSave: false });

  console.log(`🔐 توکن بازیابی برای ${email}: ${resetToken}`);

  res.json({
    success: true,
    message: 'توکن بازیابی رمز عبور ایجاد شد',
    ...(process.env.NODE_ENV === 'development' && { resetToken })
  });
});

/**
 * @desc    بازیابی رمز عبور
 * @route   PUT /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  // هش کردن توکن
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // یافتن کاربر
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    const error = new ErrorResponse('توکن نامعتبر یا منقضی شده است', 400);
    return next(error);
  }

  // تنظیم رمز جدید
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // تولید توکن جدید
  const authToken = generateToken(user._id);

  res.json({
    success: true,
    message: 'رمز عبور با موفقیت تغییر یافت',
    data: {
      user: user.getPublicProfile(),
      token: authToken
    }
  });
});

/**
 * @desc    آپلود آواتار
 * @route   PUT /api/auth/avatar
 * @access  Private
 */
const uploadAvatar = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    const error = new ErrorResponse('لطفا یک تصویر انتخاب کنید', 400);
    return next(error);
  }

  console.log('📷 آواتار آپلود شد:', req.file.originalname);

  // بروزرسانی (فعلاً با URL موقت)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: 'https://via.placeholder.com/200' },
    { new: true }
  );

  res.json({
    success: true,
    message: 'آواتار با موفقیت بروزرسانی شد',
    data: {
      user: user.getPublicProfile()
    }
  });
});

/**
 * @desc    حذف حساب کاربری
 * @route   DELETE /api/auth/account
 * @access  Private
 */
const deleteAccount = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  // دریافت کاربر
  const user = await User.findById(req.user._id).select('+password');

  // بررسی رمز
  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    const error = new ErrorResponse('رمز عبور اشتباه است', 401);
    return next(error);
  }

  // غیرفعال کردن
  user.isActive = false;
  await user.save();

  res.json({
    success: true,
    message: 'حساب کاربری با موفقیت غیرفعال شد'
  });
});

// ═══════════════════════════════════════════════════════════
// Export
// ═══════════════════════════════════════════════════════════

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  uploadAvatar,
  deleteAccount
};