const multer = require('multer');
const path = require('path');

// تنظیمات ذخیره‌سازی
const storage = multer.memoryStorage(); // ذخیره در حافظه برای آپلود به Cloudinary

// فیلتر کردن فایل‌ها - فقط تصاویر
const fileFilter = (req, file, cb) => {
  // انواع فایل مجاز
  const allowedTypes = /jpeg|jpg|png|gif|webp/;

  // بررسی extension
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  // بررسی mimetype
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('فقط فایل‌های تصویری (jpg, png, gif, webp) مجاز هستند'), false);
  }
};

// تنظیمات multer
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // محدودیت 5MB
  },
  fileFilter
});

/**
 * آپلود تک تصویر
 */
const uploadSingleImage = upload.single('image');

/**
 * آپلود چند تصویر (حداکثر 10 تا)
 */
const uploadMultipleImages = upload.array('images', 10);

/**
 * آپلود تصاویر محصول
 */
const uploadProductImages = upload.array('images', 10);

/**
 * آپلود آواتار کاربر
 */
const uploadAvatar = upload.single('avatar');

/**
 * آپلود تصویر دسته‌بندی
 */
const uploadCategoryImage = upload.single('image');

/**
 * آپلود تصاویر نظر/ریویو
 */
const uploadReviewImages = upload.array('images', 5);

/**
 * Middleware برای handle کردن خطاهای multer
 */
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'حجم فایل نباید بیشتر از 5MB باشد'
      });
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'تعداد فایل‌ها بیش از حد مجاز است'
      });
    }

    return res.status(400).json({
      success: false,
      message: 'خطا در آپلود فایل: ' + err.message
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'خطا در آپلود فایل'
    });
  }

  next();
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  uploadProductImages,
  uploadAvatar,
  uploadCategoryImage,
  uploadReviewImages,
  handleMulterError
};
