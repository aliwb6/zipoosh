/**
 * فرمت کردن قیمت به تومان
 * @param {number} price - قیمت
 * @returns {string} - قیمت فرمت شده
 */
export const formatPrice = (price) => {
  if (!price && price !== 0) return '0 تومان';
  
  return new Intl.NumberFormat('fa-IR', {
    style: 'decimal',
  }).format(price) + ' تومان';
};

/**
 * فرمت کردن قیمت با تخفیف
 * @param {number} originalPrice - قیمت اصلی
 * @param {number} discountedPrice - قیمت با تخفیف
 * @returns {object} - قیمت‌های فرمت شده
 */
export const formatPriceWithDiscount = (originalPrice, discountedPrice) => {
  const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  
  return {
    original: formatPrice(originalPrice),
    discounted: formatPrice(discountedPrice),
    percentage: discountPercentage,
  };
};