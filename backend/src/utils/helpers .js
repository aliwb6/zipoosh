const crypto = require('crypto');

/**
 * تولید رشته تصادفی
 * @param {Number} length - طول رشته
 * @returns {String} - رشته تصادفی
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * تولید کد عددی تصادفی
 * @param {Number} digits - تعداد رقم (پیش‌فرض: 6)
 * @returns {String} - کد عددی
 */
const generateRandomCode = (digits = 6) => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

/**
 * فرمت کردن قیمت به تومان با جداکننده
 * @param {Number} price - قیمت
 * @returns {String} - قیمت فرمت شده
 */
const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
};

/**
 * فرمت کردن تاریخ به فارسی
 * @param {Date} date - تاریخ
 * @returns {String} - تاریخ فرمت شده
 */
const formatDate = (date) => {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

/**
 * تبدیل تاریخ میلادی به شمسی (ساده)
 * @param {Date} date - تاریخ میلادی
 * @returns {String} - تاریخ شمسی (ساده)
 */
const toJalali = (date) => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('fa-IR').format(d);
};

/**
 * اعتبارسنجی شماره موبایل ایران
 * @param {String} phone - شماره موبایل
 * @returns {Boolean} - معتبر یا نامعتبر
 */
const isValidIranianPhone = (phone) => {
  const phoneRegex = /^09[0-9]{9}$/;
  return phoneRegex.test(phone);
};

/**
 * اعتبارسنجی کد ملی ایران
 * @param {String} nationalCode - کد ملی
 * @returns {Boolean} - معتبر یا نامعتبر
 */
const isValidNationalCode = (nationalCode) => {
  if (!/^\d{10}$/.test(nationalCode)) return false;
  
  const check = parseInt(nationalCode[9]);
  const sum = nationalCode
    .split('')
    .slice(0, 9)
    .reduce((acc, digit, index) => acc + parseInt(digit) * (10 - index), 0);
  
  const remainder = sum % 11;
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
};

/**
 * اعتبارسنجی کد پستی ایران
 * @param {String} postalCode - کد پستی
 * @returns {Boolean} - معتبر یا نامعتبر
 */
const isValidPostalCode = (postalCode) => {
  const postalCodeRegex = /^[0-9]{10}$/;
  return postalCodeRegex.test(postalCode);
};

/**
 * حذف کاراکترهای غیرفارسی
 * @param {String} str - رشته ورودی
 * @returns {String} - رشته پاک شده
 */
const removeNonPersian = (str) => {
  return str.replace(/[^\u0600-\u06FF\s]/g, '');
};

/**
 * حذف کاراکترهای غیرعددی
 * @param {String} str - رشته ورودی
 * @returns {String} - رشته فقط عدد
 */
const removeNonNumeric = (str) => {
  return str.replace(/[^0-9]/g, '');
};

/**
 * محاسبه درصد تخفیف
 * @param {Number} originalPrice - قیمت اصلی
 * @param {Number} discountPrice - قیمت با تخفیف
 * @returns {Number} - درصد تخفیف
 */
const calculateDiscountPercent = (originalPrice, discountPrice) => {
  if (!discountPrice || discountPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

/**
 * محاسبه قیمت نهایی با درصد تخفیف
 * @param {Number} price - قیمت اصلی
 * @param {Number} discountPercent - درصد تخفیف
 * @returns {Number} - قیمت نهایی
 */
const applyDiscount = (price, discountPercent) => {
  if (!discountPercent || discountPercent <= 0) return price;
  return Math.round(price - (price * discountPercent) / 100);
};

/**
 * ساخت Slug از متن فارسی
 * @param {String} text - متن
 * @returns {String} - slug
 */
const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
};

/**
 * صفحه‌بندی
 * @param {Number} page - شماره صفحه
 * @param {Number} limit - تعداد در هر صفحه
 * @returns {Object} - skip و limit
 */
const paginate = (page = 1, limit = 20) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const skip = (pageNum - 1) * limitNum;
  
  return {
    skip,
    limit: limitNum,
    page: pageNum
  };
};

/**
 * ساخت اطلاعات صفحه‌بندی کامل
 * @param {Number} total - تعداد کل
 * @param {Number} page - صفحه فعلی
 * @param {Number} limit - تعداد در صفحه
 * @returns {Object} - اطلاعات pagination
 */
const getPaginationInfo = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};

/**
 * هش کردن رشته با SHA256
 * @param {String} str - رشته ورودی
 * @returns {String} - هش SHA256
 */
const hashString = (str) => {
  return crypto.createHash('sha256').update(str).digest('hex');
};

/**
 * مرتب‌سازی براساس فیلد
 * @param {String} sortBy - فیلد مرتب‌سازی
 * @param {String} order - ترتیب (asc یا desc)
 * @returns {Object} - آبجکت sort برای mongoose
 */
const getSortObject = (sortBy = 'createdAt', order = 'desc') => {
  const sortOrder = order === 'asc' ? 1 : -1;
  return { [sortBy]: sortOrder };
};

/**
 * پاکسازی آبجکت از فیلدهای null و undefined
 * @param {Object} obj - آبجکت
 * @returns {Object} - آبجکت پاک شده
 */
const cleanObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value != null)
  );
};

/**
 * تاخیر (برای تست یا rate limiting)
 * @param {Number} ms - میلی‌ثانیه
 * @returns {Promise}
 */
const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * محاسبه هزینه ارسال (مثال ساده)
 * @param {String} province - استان
 * @param {Number} weight - وزن (گرم)
 * @returns {Number} - هزینه ارسال (تومان)
 */
const calculateShippingCost = (province, weight = 500) => {
  const basePrice = 30000; // قیمت پایه
  const perKg = 10000; // هر کیلو
  
  // استان‌های دور: +20000
  const farProvinces = ['سیستان و بلوچستان', 'خوزستان', 'هرمزگان'];
  const distanceFee = farProvinces.includes(province) ? 20000 : 0;
  
  // محاسبه بر اساس وزن
  const kg = Math.ceil(weight / 1000);
  const weightFee = kg > 1 ? (kg - 1) * perKg : 0;
  
  return basePrice + distanceFee + weightFee;
};

/**
 * بررسی اینکه آیا تاریخ گذشته است
 * @param {Date} date - تاریخ
 * @returns {Boolean}
 */
const isPast = (date) => {
  return new Date(date) < new Date();
};

/**
 * بررسی اینکه آیا تاریخ در آینده است
 * @param {Date} date - تاریخ
 * @returns {Boolean}
 */
const isFuture = (date) => {
  return new Date(date) > new Date();
};

module.exports = {
  generateRandomString,
  generateRandomCode,
  formatPrice,
  formatDate,
  toJalali,
  isValidIranianPhone,
  isValidNationalCode,
  isValidPostalCode,
  removeNonPersian,
  removeNonNumeric,
  calculateDiscountPercent,
  applyDiscount,
  createSlug,
  paginate,
  getPaginationInfo,
  hashString,
  getSortObject,
  cleanObject,
  delay,
  calculateShippingCost,
  isPast,
  isFuture
};