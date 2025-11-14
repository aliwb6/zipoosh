// فایل موقت برای جلوگیری از خطا
// بعداً می‌تونیم nodemailer رو فعال کنیم

const sendEmail = async (options) => {
  console.log('📧 ایمیل (شبیه‌سازی):', options.to, '-', options.subject);
  return { success: true };
};

const sendWelcomeEmail = async (email, name) => {
  console.log(`✉️ ایمیل خوش‌آمدگویی به ${name} (${email})`);
  return { success: true };
};

const sendPasswordResetEmail = async (email, resetToken) => {
  console.log(`🔐 ایمیل بازیابی رمز به ${email} - توکن: ${resetToken}`);
  return { success: true };
};

const sendOrderConfirmationEmail = async (email, order) => {
  console.log(`📦 ایمیل تایید سفارش ${order.orderNumber} به ${email}`);
  return { success: true };
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail
};