const nodemailer = require('nodemailer');

/**
 * ایجاد transporter برای ارسال ایمیل
 */
const createTransporter = () => {
  // تنظیمات برای Gmail (می‌تونی تغییر بدی)
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

/**
 * ارسال ایمیل
 * @param {Object} options - تنظیمات ایمیل
 * @param {String} options.to - ایمیل گیرنده
 * @param {String} options.subject - موضوع ایمیل
 * @param {String} options.html - محتوای HTML ایمیل
 * @returns {Object} - اطلاعات ارسال
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'زی‌پوش'} <${process.env.EMAIL_USERNAME}>`,
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('خطا در ارسال ایمیل:', error);
    throw new Error(`خطا در ارسال ایمیل: ${error.message}`);
  }
};

/**
 * ارسال ایمیل خوش‌آمدگویی
 * @param {String} email - ایمیل کاربر
 * @param {String} name - نام کاربر
 */
const sendWelcomeEmail = async (email, name) => {
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Tahoma', Arial, sans-serif; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; }
        .header { text-align: center; background: #3B82F6; color: white; padding: 20px; }
        .content { padding: 20px; text-align: right; }
        .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>به زی‌پوش خوش آمدید!</h1>
        </div>
        <div class="content">
          <h2>سلام ${name} عزیز،</h2>
          <p>از اینکه به خانواده بزرگ زی‌پوش پیوستید خوشحالیم! 🎉</p>
          <p>حالا می‌تونید از تمام امکانات فروشگاه ما استفاده کنید:</p>
          <ul>
            <li>خرید آسان محصولات</li>
            <li>پیگیری سفارشات</li>
            <li>مدیریت آدرس‌ها</li>
            <li>ذخیره محصولات مورد علاقه</li>
          </ul>
          <a href="${process.env.FRONTEND_URL}" class="button">شروع خرید</a>
        </div>
        <div class="footer">
          <p>این ایمیل از طرف زی‌پوش ارسال شده است.</p>
          <p>اگر این حساب را شما ایجاد نکرده‌اید، لطفا این ایمیل را نادیده بگیرید.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'به زی‌پوش خوش آمدید!',
    html
  });
};

/**
 * ارسال ایمیل بازیابی رمز عبور
 * @param {String} email - ایمیل کاربر
 * @param {String} resetToken - توکن بازیابی
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Tahoma', Arial, sans-serif; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; }
        .header { text-align: center; background: #EF4444; color: white; padding: 20px; }
        .content { padding: 20px; text-align: right; }
        .button { display: inline-block; background: #EF4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        .warning { background: #FEF2F2; border-right: 4px solid #EF4444; padding: 15px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>بازیابی رمز عبور</h1>
        </div>
        <div class="content">
          <p>درخواست بازیابی رمز عبور شما دریافت شد.</p>
          <p>برای تنظیم رمز عبور جدید، روی دکمه زیر کلیک کنید:</p>
          <a href="${resetUrl}" class="button">تنظیم رمز عبور جدید</a>
          <p style="font-size: 12px; color: #666;">یا این لینک را در مرورگر خود کپی کنید:</p>
          <p style="font-size: 12px; color: #3B82F6; word-break: break-all;">${resetUrl}</p>
          <div class="warning">
            <strong>⚠️ توجه:</strong> این لینک فقط برای <strong>10 دقیقه</strong> معتبر است.
          </div>
        </div>
        <div class="footer">
          <p>اگر شما این درخواست را ارسال نکرده‌اید، لطفا این ایمیل را نادیده بگیرید.</p>
          <p>رمز عبور شما بدون تایید نهایی تغییر نخواهد کرد.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'بازیابی رمز عبور - زی‌پوش',
    html
  });
};

/**
 * ارسال ایمیل تایید سفارش
 * @param {String} email - ایمیل کاربر
 * @param {Object} order - اطلاعات سفارش
 */
const sendOrderConfirmationEmail = async (email, order) => {
  const itemsList = order.orderItems
    .map(
      item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${(item.discountPrice || item.price).toLocaleString()} تومان</td>
      </tr>
    `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Tahoma', Arial, sans-serif; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; }
        .header { text-align: center; background: #10B981; color: white; padding: 20px; }
        .content { padding: 20px; text-align: right; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f3f4f6; padding: 10px; text-align: right; }
        .total { background: #f9fafb; padding: 15px; margin: 20px 0; font-size: 18px; font-weight: bold; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ سفارش شما ثبت شد!</h1>
        </div>
        <div class="content">
          <p>سفارش شما با شماره <strong>${order.orderNumber}</strong> با موفقیت ثبت شد.</p>
          
          <h3>جزئیات سفارش:</h3>
          <table>
            <thead>
              <tr>
                <th>محصول</th>
                <th>تعداد</th>
                <th>قیمت</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
          
          <div class="total">
            <p>جمع کل: ${order.pricing.totalPrice.toLocaleString()} تومان</p>
          </div>
          
          <p>سفارش شما در حال پردازش است و به زودی ارسال خواهد شد.</p>
          <p>می‌توانید وضعیت سفارش خود را از پنل کاربری پیگیری کنید.</p>
        </div>
        <div class="footer">
          <p>با تشکر از خرید شما از زی‌پوش</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: `تایید سفارش ${order.orderNumber} - زی‌پوش`,
    html
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail
};