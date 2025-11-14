const cloudinary = require('cloudinary').v2;

// تنظیم Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * آپلود تصویر به Cloudinary
 * @param {String} file - مسیر فایل یا base64
 * @param {String} folder - نام پوشه در Cloudinary
 * @returns {Object} - اطلاعات تصویر آپلود شده
 */
const uploadImage = async (file, folder = 'zipoosh') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' }, // محدود کردن سایز
        { quality: 'auto' }, // بهینه‌سازی خودکار کیفیت
        { fetch_format: 'auto' } // فرمت بهینه (WebP در مرورگرهای پشتیبان)
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error) {
    throw new Error(`خطا در آپلود تصویر: ${error.message}`);
  }
};

/**
 * آپلود چند تصویر به Cloudinary
 * @param {Array} files - آرایه‌ای از فایل‌ها
 * @param {String} folder - نام پوشه در Cloudinary
 * @returns {Array} - آرایه‌ای از اطلاعات تصاویر آپلود شده
 */
const uploadMultipleImages = async (files, folder = 'zipoosh') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`خطا در آپلود تصاویر: ${error.message}`);
  }
};

/**
 * حذف تصویر از Cloudinary
 * @param {String} publicId - شناسه عمومی تصویر
 * @returns {Object} - نتیجه حذف
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`خطا در حذف تصویر: ${error.message}`);
  }
};

/**
 * حذف چند تصویر از Cloudinary
 * @param {Array} publicIds - آرایه‌ای از شناسه‌های عمومی
 * @returns {Array} - نتایج حذف
 */
const deleteMultipleImages = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(publicId => deleteImage(publicId));
    return await Promise.all(deletePromises);
  } catch (error) {
    throw new Error(`خطا در حذف تصاویر: ${error.message}`);
  }
};

/**
 * بروزرسانی تصویر (حذف قدیمی و آپلود جدید)
 * @param {String} oldPublicId - شناسه عمومی تصویر قدیمی
 * @param {String} newFile - فایل جدید
 * @param {String} folder - نام پوشه
 * @returns {Object} - اطلاعات تصویر جدید
 */
const updateImage = async (oldPublicId, newFile, folder = 'zipoosh') => {
  try {
    // حذف تصویر قدیمی
    if (oldPublicId) {
      await deleteImage(oldPublicId);
    }
    
    // آپلود تصویر جدید
    return await uploadImage(newFile, folder);
  } catch (error) {
    throw new Error(`خطا در بروزرسانی تصویر: ${error.message}`);
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
  updateImage
};