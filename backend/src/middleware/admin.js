/**
 * بررسی اینکه کاربر ادمین است
 * باید بعد از protect استفاده بشه
 */
const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'احراز هویت لازم است'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'دسترسی محدود - فقط ادمین‌ها مجاز هستند'
    });
  }

  next();
};

/**
 * بررسی سطح دسترسی ادمین
 * برای آینده اگه بخوایم ادمین‌های مختلف با سطح دسترسی متفاوت داشته باشیم
 */
const checkAdminPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'دسترسی محدود - فقط ادمین‌ها مجاز هستند'
      });
    }

    // در حال حاضر همه ادمین‌ها همه دسترسی‌ها رو دارن
    // بعدا می‌تونیم سیستم permissions اضافه کنیم
    
    // const hasPermission = req.user.permissions?.includes(requiredPermission);
    // if (!hasPermission) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'شما مجوز این عملیات را ندارید'
    //   });
    // }

    next();
  };
};

/**
 * لاگ کردن اعمال ادمین
 * برای امنیت و پیگیری تغییرات
 */
const logAdminAction = (action) => {
  return (req, res, next) => {
    const logData = {
      admin: req.user._id,
      adminName: req.user.name,
      action: action,
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.get('user-agent'),
      method: req.method,
      path: req.path,
      body: req.body
    };

    // در حال حاضر فقط console.log می‌کنیم
    // بعدا می‌تونیم به دیتابیس ذخیره کنیم
    console.log('📝 Admin Action:', JSON.stringify(logData, null, 2));

    // TODO: ذخیره در دیتابیس
    // await AdminLog.create(logData);

    next();
  };
};

/**
 * محدود کردن عملیات حساس
 * مثلا حذف محصولات، تغییر قیمت‌ها، و...
 */
const requireConfirmation = (req, res, next) => {
  // بررسی وجود confirmation token در header
  const confirmationToken = req.headers['x-confirmation-token'];

  if (!confirmationToken) {
    return res.status(400).json({
      success: false,
      message: 'این عملیات نیاز به تایید دارد',
      requireConfirmation: true
    });
  }

  // TODO: بررسی اعتبار confirmation token
  // در حال حاضر فقط بررسی می‌کنیم که وجود داشته باشه

  next();
};

/**
 * بررسی اینکه ادمین می‌تونه کاربر دیگه‌ای رو ویرایش کنه
 */
const canModifyUser = async (req, res, next) => {
  const targetUserId = req.params.id || req.body.userId;

  if (!targetUserId) {
    return res.status(400).json({
      success: false,
      message: 'شناسه کاربر الزامی است'
    });
  }

  // ادمین نمی‌تونه خودش رو حذف کنه
  if (req.method === 'DELETE' && targetUserId === req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'شما نمی‌توانید حساب خود را حذف کنید'
    });
  }

  next();
};

/**
 * بررسی دسترسی ادمین به بخش‌های مختلف
 */
const adminSections = {
  products: (req, res, next) => admin(req, res, next),
  orders: (req, res, next) => admin(req, res, next),
  users: (req, res, next) => admin(req, res, next),
  categories: (req, res, next) => admin(req, res, next),
  reviews: (req, res, next) => admin(req, res, next),
  coupons: (req, res, next) => admin(req, res, next),
  settings: (req, res, next) => admin(req, res, next),
  reports: (req, res, next) => admin(req, res, next)
};

module.exports = {
  admin,
  checkAdminPermission,
  logAdminAction,
  requireConfirmation,
  canModifyUser,
  adminSections
};