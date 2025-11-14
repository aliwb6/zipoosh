/**
 * اعتبارسنجی ایمیل
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * اعتبارسنجی شماره موبایل ایران
 */
export const validatePhone = (phone) => {
  const re = /^09[0-9]{9}$/;
  return re.test(phone);
};

/**
 * اعتبارسنجی رمز عبور
 * حداقل 6 کاراکتر
 */
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * اعتبارسنجی کد ملی
 */
export const validateNationalCode = (code) => {
  if (!code || code.length !== 10) return false;
  
  const check = parseInt(code[9]);
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    sum += parseInt(code[i]) * (10 - i);
  }
  
  const remainder = sum % 11;
  
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
};

/**
 * اعتبارسنجی کد پستی
 */
export const validatePostalCode = (code) => {
  const re = /^[0-9]{10}$/;
  return re.test(code);
};