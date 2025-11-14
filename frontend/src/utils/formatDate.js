/**
 * فرمت کردن تاریخ به شمسی
 * @param {string} date - تاریخ
 * @returns {string} - تاریخ فرمت شده
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    calendar: 'persian',
  };
  
  return new Intl.DateTimeFormat('fa-IR', options).format(new Date(date));
};

/**
 * فرمت کردن تاریخ و ساعت
 * @param {string} date - تاریخ
 * @returns {string} - تاریخ و ساعت فرمت شده
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    calendar: 'persian',
  };
  
  return new Intl.DateTimeFormat('fa-IR', options).format(new Date(date));
};

/**
 * محاسبه زمان گذشته (مثلاً "2 روز پیش")
 * @param {string} date - تاریخ
 * @returns {string} - زمان گذشته
 */
export const timeAgo = (date) => {
  if (!date) return '';
  
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  const intervals = {
    سال: 31536000,
    ماه: 2592000,
    هفته: 604800,
    روز: 86400,
    ساعت: 3600,
    دقیقه: 60,
    ثانیه: 1,
  };
  
  for (const [name, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return `${interval} ${name} پیش`;
    }
  }
  
  return 'هم‌اکنون';
};