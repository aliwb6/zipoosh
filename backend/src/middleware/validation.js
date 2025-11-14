const { body, param, query, validationResult } = require('express-validator');

/**
 * بررسی نتایج اعتبارسنجی
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    
    return res.status(400).json({
      success: false,
      message: 'خطای اعتبارسنجی',
      errors: errorMessages
    });
  }
  
  next();
};

/**
 * اعتبارسنجی ثبت نام
 */
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('نام الزامی است')
    .isLength({ min: 2, max: 50 }).withMessage('نام باید بین 2 تا 50 کاراکتر باشد'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('ایمیل الزامی است')
    .isEmail().withMessage('ایمیل نامعتبر است')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('شماره تلفن الزامی است')
    .matches(/^09[0-9]{9}$/).withMessage('شماره تلفن نامعتبر است (مثال: 09123456789)'),
  
  body('password')
    .trim()
    .notEmpty().withMessage('رمز عبور الزامی است')
    .isLength({ min: 6 }).withMessage('رمز عبور باید حداقل 6 کاراکتر باشد'),
  
  validate
];

/**
 * اعتبارسنجی ورود
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('ایمیل الزامی است')
    .isEmail().withMessage('ایمیل نامعتبر است'),
  
  body('password')
    .trim()
    .notEmpty().withMessage('رمز عبور الزامی است'),
  
  validate
];

/**
 * اعتبارسنجی تغییر رمز عبور
 */
const validateChangePassword = [
  body('currentPassword')
    .trim()
    .notEmpty().withMessage('رمز عبور فعلی الزامی است'),
  
  body('newPassword')
    .trim()
    .notEmpty().withMessage('رمز عبور جدید الزامی است')
    .isLength({ min: 6 }).withMessage('رمز عبور جدید باید حداقل 6 کاراکتر باشد')
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('رمز عبور جدید نباید با رمز عبور فعلی یکسان باشد'),
  
  validate
];

/**
 * اعتبارسنجی ایجاد محصول
 */
const validateCreateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('نام محصول الزامی است')
    .isLength({ min: 3, max: 100 }).withMessage('نام محصول باید بین 3 تا 100 کاراکتر باشد'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('توضیحات محصول الزامی است')
    .isLength({ min: 10, max: 2000 }).withMessage('توضیحات باید بین 10 تا 2000 کاراکتر باشد'),
  
  body('price')
    .notEmpty().withMessage('قیمت الزامی است')
    .isFloat({ min: 0 }).withMessage('قیمت باید عدد مثبت باشد'),
  
  body('category')
    .notEmpty().withMessage('دسته‌بندی الزامی است')
    .isMongoId().withMessage('شناسه دسته‌بندی نامعتبر است'),
  
  body('totalStock')
    .notEmpty().withMessage('موجودی الزامی است')
    .isInt({ min: 0 }).withMessage('موجودی باید عدد صحیح مثبت باشد'),
  
  body('gender')
    .notEmpty().withMessage('جنسیت الزامی است')
    .isIn(['مردانه', 'زنانه', 'دخترانه', 'پسرانه', 'یونیسکس'])
    .withMessage('جنسیت نامعتبر است'),
  
  validate
];

/**
 * اعتبارسنجی بروزرسانی محصول
 */
const validateUpdateProduct = [
  param('id').isMongoId().withMessage('شناسه محصول نامعتبر است'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('نام محصول باید بین 3 تا 100 کاراکتر باشد'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('قیمت باید عدد مثبت باشد'),
  
  body('discountPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('قیمت تخفیف باید عدد مثبت باشد')
    .custom((value, { req }) => {
      if (req.body.price && value >= req.body.price) {
        throw new Error('قیمت تخفیف باید کمتر از قیمت اصلی باشد');
      }
      return true;
    }),
  
  validate
];

/**
 * اعتبارسنجی ایجاد سفارش
 */
const validateCreateOrder = [
  body('orderItems')
    .isArray({ min: 1 }).withMessage('حداقل یک محصول باید وجود داشته باشد'),
  
  body('orderItems.*.product')
    .isMongoId().withMessage('شناسه محصول نامعتبر است'),
  
  body('orderItems.*.quantity')
    .isInt({ min: 1 }).withMessage('تعداد باید حداقل 1 باشد'),
  
  body('shippingAddress.fullName')
    .trim()
    .notEmpty().withMessage('نام و نام خانوادگی الزامی است'),
  
  body('shippingAddress.phone')
    .trim()
    .matches(/^09[0-9]{9}$/).withMessage('شماره تلفن نامعتبر است'),
  
  body('shippingAddress.address')
    .trim()
    .notEmpty().withMessage('آدرس الزامی است')
    .isLength({ min: 10 }).withMessage('آدرس باید حداقل 10 کاراکتر باشد'),
  
  body('shippingAddress.postalCode')
    .trim()
    .matches(/^[0-9]{10}$/).withMessage('کد پستی باید 10 رقم باشد'),
  
  body('paymentMethod')
    .notEmpty().withMessage('روش پرداخت الزامی است')
    .isIn(['online', 'cashOnDelivery']).withMessage('روش پرداخت نامعتبر است'),
  
  validate
];

/**
 * اعتبارسنجی ایجاد نظر
 */
const validateCreateReview = [
  body('product')
    .notEmpty().withMessage('شناسه محصول الزامی است')
    .isMongoId().withMessage('شناسه محصول نامعتبر است'),
  
  body('rating')
    .notEmpty().withMessage('امتیاز الزامی است')
    .isInt({ min: 1, max: 5 }).withMessage('امتیاز باید بین 1 تا 5 باشد'),
  
  body('title')
    .trim()
    .notEmpty().withMessage('عنوان نظر الزامی است')
    .isLength({ min: 5, max: 100 }).withMessage('عنوان باید بین 5 تا 100 کاراکتر باشد'),
  
  body('comment')
    .trim()
    .notEmpty().withMessage('متن نظر الزامی است')
    .isLength({ min: 10, max: 1000 }).withMessage('نظر باید بین 10 تا 1000 کاراکتر باشد'),
  
  validate
];

/**
 * اعتبارسنجی افزودن به سبد خرید
 */
const validateAddToCart = [
  body('product')
    .notEmpty().withMessage('شناسه محصول الزامی است')
    .isMongoId().withMessage('شناسه محصول نامعتبر است'),
  
  body('quantity')
    .notEmpty().withMessage('تعداد الزامی است')
    .isInt({ min: 1, max: 50 }).withMessage('تعداد باید بین 1 تا 50 باشد'),
  
  body('size')
    .notEmpty().withMessage('سایز الزامی است')
    .isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'فری سایز'])
    .withMessage('سایز نامعتبر است'),
  
  body('color.name')
    .notEmpty().withMessage('رنگ الزامی است'),
  
  body('color.hexCode')
    .notEmpty().withMessage('کد رنگ الزامی است')
    .matches(/^#[0-9A-F]{6}$/i).withMessage('کد رنگ باید به فرمت hex باشد'),
  
  validate
];

/**
 * اعتبارسنجی ایجاد دسته‌بندی
 */
const validateCreateCategory = [
  body('name')
    .trim()
    .notEmpty().withMessage('نام دسته‌بندی الزامی است')
    .isLength({ min: 2, max: 50 }).withMessage('نام باید بین 2 تا 50 کاراکتر باشد'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('توضیحات نباید بیشتر از 500 کاراکتر باشد'),
  
  body('parent')
    .optional()
    .isMongoId().withMessage('شناسه دسته‌بندی والد نامعتبر است'),
  
  validate
];

/**
 * اعتبارسنجی ایجاد کد تخفیف
 */
const validateCreateCoupon = [
  body('code')
    .trim()
    .notEmpty().withMessage('کد تخفیف الزامی است')
    .isLength({ min: 4, max: 20 }).withMessage('کد تخفیف باید بین 4 تا 20 کاراکتر باشد')
    .toUpperCase(),
  
  body('discountType')
    .notEmpty().withMessage('نوع تخفیف الزامی است')
    .isIn(['percentage', 'fixed']).withMessage('نوع تخفیف نامعتبر است'),
  
  body('discountValue')
    .notEmpty().withMessage('مقدار تخفیف الزامی است')
    .isFloat({ min: 0 }).withMessage('مقدار تخفیف باید عدد مثبت باشد'),
  
  body('startDate')
    .notEmpty().withMessage('تاریخ شروع الزامی است')
    .isISO8601().withMessage('تاریخ شروع نامعتبر است'),
  
  body('expiryDate')
    .notEmpty().withMessage('تاریخ انقضا الزامی است')
    .isISO8601().withMessage('تاریخ انقضا نامعتبر است')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('تاریخ انقضا باید بعد از تاریخ شروع باشد');
      }
      return true;
    }),
  
  validate
];

/**
 * اعتبارسنجی شناسه MongoDB
 */
const validateMongoId = (paramName = 'id') => [
  param(paramName).isMongoId().withMessage('شناسه نامعتبر است'),
  validate
];

/**
 * اعتبارسنجی صفحه‌بندی
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('شماره صفحه باید عدد مثبت باشد'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('تعداد در صفحه باید بین 1 تا 100 باشد'),
  
  validate
];

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateCreateProduct,
  validateUpdateProduct,
  validateCreateOrder,
  validateCreateReview,
  validateAddToCart,
  validateCreateCategory,
  validateCreateCoupon,
  validateMongoId,
  validatePagination
};