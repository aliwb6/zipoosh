/**
 * کلاس سفارشی برای خطاهای API
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware اصلی مدیریت خطا
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode;

  // لاگ کردن خطا در console (فقط در development)
  if (process.env.NODE_ENV === 'development') {
    console.log('❌ خطا:', err);
  }

  // خطای Mongoose - ID نامعتبر
  if (err.name === 'CastError') {
    const message = 'شناسه وارد شده نامعتبر است';
    error = new ErrorResponse(message, 400);
  }

  // خطای Mongoose - فیلد تکراری
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${field} با مقدار "${value}" قبلاً ثبت شده است`;
    error = new ErrorResponse(message, 400);
  }

  // خطای Mongoose - اعتبارسنجی
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    const message = messages.join(', ');
    error = new ErrorResponse(message, 400);
  }

  // خطای JWT - توکن نامعتبر
  if (err.name === 'JsonWebTokenError') {
    const message = 'توکن احراز هویت نامعتبر است';
    error = new ErrorResponse(message, 401);
  }

  // خطای JWT - توکن منقضی شده
  if (err.name === 'TokenExpiredError') {
    const message = 'توکن احراز هویت منقضی شده است';
    error = new ErrorResponse(message, 401);
  }

  // خطای Multer - سایز فایل
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'حجم فایل بیش از حد مجاز است';
    error = new ErrorResponse(message, 400);
  }

  // خطای Multer - تعداد فایل
  if (err.code === 'LIMIT_FILE_COUNT') {
    const message = 'تعداد فایل‌ها بیش از حد مجاز است';
    error = new ErrorResponse(message, 400);
  }

  // خطای Multer - نوع فایل نامعتبر
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'نوع فایل مجاز نیست';
    error = new ErrorResponse(message, 400);
  }

  // پاسخ خطا
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'خطای سرور',
    ...(process.env.NODE_ENV === 'development' && {
      error: err,
      stack: err.stack
    })
  });
};

/**
 * Middleware برای مدیریت روت‌های پیدا نشده (404)
 */
const notFound = (req, res, next) => {
  const message = `مسیر ${req.originalUrl} یافت نشد`;
  res.status(404).json({
    success: false,
    message: message
  });
};

/**
 * Wrapper برای async functions
 * جلوگیری از تکرار try-catch
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * اعتبارسنجی نتیجه validation
 * برای استفاده با express-validator
 */
const validateRequest = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    return res.status(400).json({
      success: false,
      message: 'خطای اعتبارسنجی',
      errors: messages
    });
  }

  next();
};

/**
 * مدیریت خطاهای همزمان (Concurrent errors)
 */
const handleConcurrentError = (err, req, res, next) => {
  if (err.name === 'VersionError') {
    return res.status(409).json({
      success: false,
      message: 'این منبع توسط کاربر دیگری تغییر یافته است. لطفا صفحه را رفرش کنید'
    });
  }
  next(err);
};

/**
 * لاگ کردن خطاها
 * برای ذخیره در فایل یا سرویس لاگ
 */
const logError = (err, req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?._id,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack
    }
  };

  // TODO: ذخیره در فایل یا سرویس لاگ
  if (process.env.NODE_ENV === 'production') {
    console.error('Error Log:', JSON.stringify(logData));
  }

  next(err);
};

/**
 * مدیریت خطاهای دیتابیس
 */
const handleDatabaseError = (err, req, res, next) => {
  // اتصال به دیتابیس قطع شده
  if (err.name === 'MongoNetworkError') {
    return res.status(503).json({
      success: false,
      message: 'خطا در اتصال به دیتابیس. لطفا بعدا تلاش کنید'
    });
  }

  // دیتابیس در دسترس نیست
  if (err.name === 'MongooseServerSelectionError') {
    return res.status(503).json({
      success: false,
      message: 'سرور دیتابیس در دسترس نیست'
    });
  }

  next(err);
};

/**
 * خطاهای سفارشی برای موارد مختلف
 */
const createError = {
  notFound: (message = 'منبع یافت نشد') => {
    return new ErrorResponse(message, 404);
  },
  
  unauthorized: (message = 'احراز هویت نشده') => {
    return new ErrorResponse(message, 401);
  },
  
  forbidden: (message = 'دسترسی ممنوع') => {
    return new ErrorResponse(message, 403);
  },
  
  badRequest: (message = 'درخواست نامعتبر') => {
    return new ErrorResponse(message, 400);
  },
  
  conflict: (message = 'تضاد در داده‌ها') => {
    return new ErrorResponse(message, 409);
  },
  
  serverError: (message = 'خطای سرور') => {
    return new ErrorResponse(message, 500);
  },
  
  tooManyRequests: (message = 'تعداد درخواست‌ها بیش از حد مجاز است') => {
    return new ErrorResponse(message, 429);
  },
  
  paymentRequired: (message = 'پرداخت الزامی است') => {
    return new ErrorResponse(message, 402);
  }
};

module.exports = {
  ErrorResponse,
  errorHandler,
  notFound,
  asyncHandler,
  validateRequest,
  handleConcurrentError,
  logError,
  handleDatabaseError,
  createError
};