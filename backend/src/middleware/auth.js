const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * محافظت از روت‌ها - بررسی احراز هویت
 * کاربر باید لاگین کرده باشه
 */
const protect = async (req, res, next) => {
  let token;

  // بررسی وجود token در header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // دریافت token از header
      token = req.headers.authorization.split(' ')[1];

      // تایید token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // دریافت اطلاعات کاربر (بدون رمز عبور)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'کاربر یافت نشد'
        });
      }

      // بررسی فعال بودن حساب کاربری
      if (!req.user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'حساب کاربری شما غیرفعال شده است'
        });
      }

      next();
    } catch (error) {
      console.error('خطا در احراز هویت:', error);
      
      // بررسی نوع خطا
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'توکن منقضی شده است. لطفا مجددا وارد شوید'
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'توکن نامعتبر است'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'احراز هویت ناموفق بود'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'دسترسی غیرمجاز - توکن یافت نشد'
    });
  }
};

/**
 * بررسی اینکه کاربر لاگین کرده یا نه (اختیاری)
 * اگه لاگین کرده، اطلاعاتش رو اضافه می‌کنه
 * اگه نکرده، ادامه میده بدون خطا
 */
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // در صورت خطا، فقط لاگ می‌کنه و ادامه میده
      console.log('توکن اختیاری نامعتبر است:', error.message);
    }
  }

  next();
};

/**
 * بررسی تایید ایمیل کاربر
 */
const requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'لطفا ابتدا ایمیل خود را تایید کنید'
    });
  }
  next();
};

/**
 * بررسی تایید شماره تلفن کاربر
 */
const requirePhoneVerification = (req, res, next) => {
  if (!req.user.isPhoneVerified) {
    return res.status(403).json({
      success: false,
      message: 'لطفا ابتدا شماره تلفن خود را تایید کنید'
    });
  }
  next();
};

/**
 * محدود کردن دسترسی به نقش‌های خاص
 * @param  {...String} roles - نقش‌های مجاز (مثلا 'admin', 'user')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `نقش ${req.user.role} مجاز به دسترسی به این بخش نیست`
      });
    }
    next();
  };
};

/**
 * بررسی اینکه کاربر صاحب منبع است (مثلا صاحب سفارش)
 * @param {String} resourceModel - نام مدل (مثلا 'Order', 'Review')
 * @param {String} paramName - نام پارامتر در req.params (مثلا 'id', 'orderId')
 */
const isOwner = (resourceModel, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const Model = require(`../models/${resourceModel}`);
      const resource = await Model.findById(req.params[paramName]);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'منبع یافت نشد'
        });
      }

      // بررسی اینکه کاربر صاحب منبع است یا ادمین
      if (
        resource.user.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          success: false,
          message: 'شما مجاز به دسترسی به این منبع نیستید'
        });
      }

      // اضافه کردن منبع به request برای استفاده بعدی
      req.resource = resource;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'خطا در بررسی مالکیت'
      });
    }
  };
};

/**
 * Rate Limiting ساده (محدود کردن تعداد درخواست)
 * @param {Number} maxRequests - حداکثر تعداد درخواست
 * @param {Number} windowMs - بازه زمانی (میلی‌ثانیه)
 */
const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const identifier = req.user ? req.user._id.toString() : req.ip;
    const now = Date.now();
    
    // دریافت اطلاعات درخواست‌های قبلی
    const userRequests = requests.get(identifier) || [];
    
    // حذف درخواست‌های قدیمی
    const recentRequests = userRequests.filter(
      timestamp => now - timestamp < windowMs
    );

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفا بعدا تلاش کنید'
      });
    }

    // اضافه کردن درخواست جدید
    recentRequests.push(now);
    requests.set(identifier, recentRequests);

    next();
  };
};

module.exports = {
  protect,
  optionalAuth,
  requireEmailVerification,
  requirePhoneVerification,
  authorize,
  isOwner,
  rateLimit
};