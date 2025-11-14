const User = require('../models/User ');
const { generateToken } = require('../utils/generateToken');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/sendEmail');
const { sendWelcomeSMS, sendOTP } = require('../utils/sendSMS');
const { asyncHandler } = require('../middleware/errorHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const crypto = require('crypto');

/**
 * @desc    ثبت نام کاربر جدید
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  // بررسی وجود کاربر با این ایمیل یا شماره تلفن
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }]
  });

  if (existingUser) {
    if (existingUser.email === email) {
      return next(new ErrorResponse('این ایمیل قبلا ثبت شده است', 400));
    }
    if (existingUser.phone === phone) {
      return next(new ErrorResponse('این شماره تلفن قبلا ثبت شده است', 400));
    }
  }

  // ایجاد کاربر جدید
  const user = await User.create({
    name,
    email,
    phone,
    password
  });

  // ارسال ایمیل و پیامک خوش‌آمدگویی (غیر مسدودکننده)
  try {
    await Promise.all([
      sendWelcomeEmail(email, name),
      sendWelcomeSMS(phone, name)
    ]);
  } catch (error) {
    console.error('خطا در ارسال پیام خوش‌آمدگویی:', error);
    // ادامه می‌دهیم حتی اگر ارسال پیام با خطا مواجه شد
  }

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

  // بررسی وجود کاربر
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('ایمیل یا رمز عبور اشتباه است', 401));
  }

  // بررسی رمز عبور
  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorResponse('ایمیل یا رمز عبور اشتباه است', 401));
  }

  // بررسی فعال بودن حساب
  if (!user.isActive) {
    return next(new ErrorResponse('حساب کاربری شما غیرفعال شده است', 403));
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

  // اگر ایمیل یا شماره تلفن تغییر کرده، بررسی تکراری نبودن
  if (email && email !== req.user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('این ایمیل قبلا ثبت شده است', 400));
    }
  }

  if (phone && phone !== req.user.phone) {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return next(new ErrorResponse('این شماره تلفن قبلا ثبت شده است', 400));
    }
  }

  // بروزرسانی اطلاعات
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: name || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone,
      // اگر ایمیل یا شماره تغییر کرد، تایید را false کن
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
    return next(new ErrorResponse('رمز عبور فعلی اشتباه است', 401));
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
    return next(new ErrorResponse('کاربری با این ایمیل یافت نشد', 404));
  }

  // تولید توکن بازیابی
  const resetToken = crypto.randomBytes(32).toString('hex');

  // هش کردن و ذخیره توکن
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // تنظیم زمان انقضا (10 دقیقه)
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  // ارسال ایمیل
  try {
    await sendPasswordResetEmail(user.email, resetToken);

    res.json({
      success: true,
      message: 'لینک بازیابی رمز عبور به ایمیل شما ارسال شد'
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('خطا در ارسال ایمیل', 500));
  }
});

/**
 * @desc    بازیابی رمز عبور
 * @route   PUT /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  // هش کردن توکن برای مقایسه
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // پیدا کردن کاربر با توکن معتبر
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('توکن نامعتبر یا منقضی شده است', 400));
  }

  // تنظیم رمز عبور جدید
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // تولید توکن جدید برای ورود خودکار
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
 * @desc    ارسال کد تایید شماره تلفن
 * @route   POST /api/auth/send-otp
 * @access  Private
 */
const sendPhoneOTP = asyncHandler(async (req, res, next) => {
  const user = req.user;

  // تولید و ارسال کد OTP
  const otp = await sendOTP(user.phone);

  // ذخیره کد در session یا cache (فعلا در متغیر موقت)
  // TODO: استفاده از Redis برای ذخیره OTP
  // await redis.set(`otp:${user._id}`, otp, 'EX', 300); // 5 دقیقه

  res.json({
    success: true,
    message: 'کد تایید به شماره شما ارسال شد',
    // در production این رو نباید برگردونیم
    ...(process.env.NODE_ENV === 'development' && { otp })
  });
});

/**
 * @desc    تایید شماره تلفن با کد OTP
 * @route   POST /api/auth/verify-phone
 * @access  Private
 */
const verifyPhone = asyncHandler(async (req, res, next) => {
  const { otp } = req.body;

  // TODO: بررسی کد OTP از Redis
  // const savedOtp = await redis.get(`otp:${req.user._id}`);
  // if (!savedOtp || savedOtp !== otp) {
  //   return next(new ErrorResponse('کد تایید نامعتبر یا منقضی شده است', 400));
  // }

  // فعلا فقط بررسی ساده
  if (!otp) {
    return next(new ErrorResponse('کد تایید الزامی است', 400));
  }

  // تایید شماره
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { isPhoneVerified: true },
    { new: true }
  );

  // حذف کد از cache
  // await redis.del(`otp:${req.user._id}`);

  res.json({
    success: true,
    message: 'شماره تلفن با موفقیت تایید شد',
    data: {
      user: user.getPublicProfile()
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
    return next(new ErrorResponse('لطفا یک تصویر انتخاب کنید', 400));
  }

  const { uploadImage, deleteImage } = require('../utils/cloudinary');

  // حذف آواتار قبلی (اگر وجود داشته باشه و از Cloudinary باشه)
  if (req.user.avatar && req.user.avatar.includes('cloudinary')) {
    const oldPublicId = req.user.avatar.split('/').pop().split('.')[0];
    try {
      await deleteImage(`zipoosh/avatars/${oldPublicId}`);
    } catch (error) {
      console.error('خطا در حذف آواتار قبلی:', error);
    }
  }

  // آپلود تصویر جدید
  const result = await uploadImage(req.file.base64, 'zipoosh/avatars');

  // بروزرسانی کاربر
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: result.url },
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

  // دریافت کاربر با رمز عبور
  const user = await User.findById(req.user._id).select('+password');

  // بررسی رمز عبور
  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorResponse('رمز عبور اشتباه است', 401));
  }

  // به جای حذف، غیرفعال می‌کنیم
  user.isActive = false;
  await user.save();

  // یا می‌تونیم کاملا حذف کنیم:
  // await user.remove();

  res.json({
    success: true,
    message: 'حساب کاربری با موفقیت حذف شد'
  });
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  sendPhoneOTP,
  verifyPhone,
  uploadAvatar,
  deleteAccount
};