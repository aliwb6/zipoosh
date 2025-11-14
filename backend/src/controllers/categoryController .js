const Category = require('../models/Category');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { uploadImage, deleteImage } = require('../utils/cloudinary');

/**
 * @desc    دریافت تمام دسته‌بندی‌ها
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = asyncHandler(async (req, res) => {
  const { showInMenu, showInHome, isActive = true } = req.query;

  const query = {};
  if (showInMenu !== undefined) query.showInMenu = showInMenu === 'true';
  if (showInHome !== undefined) query.showInHome = showInHome === 'true';
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const categories = await Category.find(query)
    .sort('order')
    .lean();

  res.json({
    success: true,
    count: categories.length,
    data: {
      categories
    }
  });
});

/**
 * @desc    دریافت یک دسته‌بندی
 * @route   GET /api/categories/:identifier
 * @access  Public
 */
const getCategory = asyncHandler(async (req, res, next) => {
  const { identifier } = req.params;

  const query = identifier.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: identifier }
    : { slug: identifier };

  const category = await Category.findOne(query);

  if (!category) {
    return next(new ErrorResponse('دسته‌بندی یافت نشد', 404));
  }

  // محاسبه تعداد محصولات
  const productCount = await Product.countDocuments({
    category: category._id,
    status: 'active'
  });

  res.json({
    success: true,
    data: {
      category: {
        ...category.toObject(),
        productCount
      }
    }
  });
});

/**
 * @desc    ایجاد دسته‌بندی جدید
 * @route   POST /api/categories
 * @access  Private/Admin
 */
const createCategory = asyncHandler(async (req, res, next) => {
  const { name, description, parent, subCategories, icon, order, showInMenu, showInHome } = req.body;

  // بررسی تصویر
  if (!req.file) {
    return next(new ErrorResponse('لطفا تصویر دسته‌بندی را آپلود کنید', 400));
  }

  // آپلود تصویر
  const result = await uploadImage(req.file.base64, 'zipoosh/categories');

  // ایجاد دسته‌بندی
  const category = await Category.create({
    name,
    description,
    image: {
      url: result.url,
      publicId: result.publicId
    },
    parent,
    subCategories: subCategories ? JSON.parse(subCategories) : [],
    icon,
    order,
    showInMenu,
    showInHome
  });

  res.status(201).json({
    success: true,
    message: 'دسته‌بندی با موفقیت ایجاد شد',
    data: {
      category
    }
  });
});

/**
 * @desc    بروزرسانی دسته‌بندی
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
const updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse('دسته‌بندی یافت نشد', 404));
  }

  // اگر تصویر جدید آپلود شده
  if (req.file) {
    // حذف تصویر قدیمی
    try {
      await deleteImage(category.image.publicId);
    } catch (error) {
      console.error('خطا در حذف تصویر قدیمی:', error);
    }

    // آپلود تصویر جدید
    const result = await uploadImage(req.file.base64, 'zipoosh/categories');
    req.body.image = {
      url: result.url,
      publicId: result.publicId
    };
  }

  // پردازش subCategories
  if (req.body.subCategories) {
    req.body.subCategories = JSON.parse(req.body.subCategories);
  }

  // بروزرسانی
  category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'دسته‌بندی با موفقیت بروزرسانی شد',
    data: {
      category
    }
  });
});

/**
 * @desc    حذف دسته‌بندی
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse('دسته‌بندی یافت نشد', 404));
  }

  // بررسی اینکه محصولی در این دسته وجود نداشته باشه
  const productCount = await Product.countDocuments({ category: category._id });
  
  if (productCount > 0) {
    return next(
      new ErrorResponse(
        `نمی‌توانید این دسته‌بندی را حذف کنید. ${productCount} محصول در این دسته وجود دارد`,
        400
      )
    );
  }

  // حذف تصویر
  try {
    await deleteImage(category.image.publicId);
  } catch (error) {
    console.error('خطا در حذف تصویر:', error);
  }

  await category.deleteOne();

  res.json({
    success: true,
    message: 'دسته‌بندی با موفقیت حذف شد'
  });
});

/**
 * @desc    دریافت محصولات یک دسته‌بندی
 * @route   GET /api/categories/:id/products
 * @access  Public
 */
const getCategoryProducts = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse('دسته‌بندی یافت نشد', 404));
  }

  const { page = 1, limit = 20, sortBy = 'createdAt', order = 'desc' } = req.query;

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find({ category: category._id, status: 'active' })
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Product.countDocuments({ category: category._id, status: 'active' })
  ]);

  res.json({
    success: true,
    count: products.length,
    total,
    data: {
      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug
      },
      products
    }
  });
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts
};