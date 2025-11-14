const Product = require('../models/Product');
const Category = require('../models/Category');
const { asyncHandler } = require('../middleware/errorHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { uploadMultipleImages, deleteImage } = require('../utils/cloudinary');
const { paginate, getPaginationInfo } = require('../utils/helpers');

/**
 * @desc    دریافت تمام محصولات با فیلتر و جستجو
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    sort = '-createdAt',
    category,
    minPrice,
    maxPrice,
    gender,
    size,
    color,
    brand,
    search,
    isFeatured,
    isNewArrival,
    status = 'active'
  } = req.query;

  // ساخت query
  const query = { status };

  // فیلتر دسته‌بندی
  if (category) {
    query.category = category;
  }

  // فیلتر قیمت
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // فیلتر جنسیت
  if (gender) {
    query.gender = gender;
  }

  // فیلتر سایز
  if (size) {
    query['sizes.name'] = size;
  }

  // فیلتر رنگ
  if (color) {
    query['colors.name'] = color;
  }

  // فیلتر برند
  if (brand) {
    query.brand = new RegExp(brand, 'i');
  }

  // جستجو
  if (search) {
    query.$text = { $search: search };
  }

  // فیلتر ویژه
  if (isFeatured) {
    query.isFeatured = isFeatured === 'true';
  }

  // فیلتر تازه‌ها
  if (isNewArrival) {
    query.isNewArrival = isNewArrival === 'true';
  }

  // اجرای query با pagination
  const result = await paginate(Product, query, {
    page: Number(page),
    limit: Number(limit),
    sort,
    populate: 'category'
  });

  res.json({
    success: true,
    count: result.data.length,
    pagination: result.pagination,
    data: {
      products: result.data
    }
  });
});

/**
 * @desc    دریافت یک محصول با ID یا slug
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // جستجو با ID یا slug
  const product = await Product.findOne({
    $or: [{ _id: id }, { slug: id }]
  })
    .populate('category')
    .populate({
      path: 'reviews',
      populate: { path: 'user', select: 'name avatar' }
    });

  if (!product) {
    return next(new ErrorResponse('محصول یافت نشد', 404));
  }

  // افزایش تعداد بازدید
  product.viewCount += 1;
  await product.save();

  res.json({
    success: true,
    data: {
      product
    }
  });
});

/**
 * @desc    ایجاد محصول جدید
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    category,
    subCategory,
    price,
    discountPrice,
    colors,
    sizes,
    brand,
    material,
    weight,
    gender,
    features,
    sizeGuide,
    tags,
    isFeatured,
    isNewArrival,
    metaTitle,
    metaDescription,
    metaKeywords
  } = req.body;

  // بررسی وجود دسته‌بندی
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return next(new ErrorResponse('دسته‌بندی یافت نشد', 404));
  }

  // محاسبه موجودی کل
  let totalStock = 0;
  if (sizes && Array.isArray(sizes)) {
    totalStock = sizes.reduce((sum, size) => sum + (size.stock || 0), 0);
  }

  // ایجاد محصول
  const product = await Product.create({
    name,
    description,
    category,
    subCategory,
    price,
    discountPrice,
    colors: colors || [],
    sizes: sizes || [],
    totalStock,
    brand,
    material,
    weight,
    gender,
    features: features || [],
    sizeGuide,
    tags: tags || [],
    isFeatured: isFeatured || false,
    isNewArrival: isNewArrival !== false,
    metaTitle,
    metaDescription,
    metaKeywords,
    images: [],
    thumbnail: 'https://via.placeholder.com/400x500'
  });

  res.status(201).json({
    success: true,
    message: 'محصول با موفقیت ایجاد شد',
    data: {
      product
    }
  });
});

/**
 * @desc    بروزرسانی محصول
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let product = await Product.findById(id);

  if (!product) {
    return next(new ErrorResponse('محصول یافت نشد', 404));
  }

  // اگر دسته‌بندی تغییر کرد، بررسی وجود آن
  if (req.body.category && req.body.category !== product.category.toString()) {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return next(new ErrorResponse('دسته‌بندی یافت نشد', 404));
    }
  }

  // بروزرسانی
  product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  }).populate('category');

  res.json({
    success: true,
    message: 'محصول با موفقیت بروزرسانی شد',
    data: {
      product
    }
  });
});

/**
 * @desc    حذف محصول
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorResponse('محصول یافت نشد', 404));
  }

  // حذف تصاویر از Cloudinary (اگر وجود داشته باشد)
  if (product.images && product.images.length > 0) {
    for (const image of product.images) {
      if (image.publicId) {
        try {
          await deleteImage(image.publicId);
        } catch (error) {
          console.error('خطا در حذف تصویر:', error);
        }
      }
    }
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: 'محصول با موفقیت حذف شد',
    data: {}
  });
});

/**
 * @desc    آپلود تصاویر محصول
 * @route   POST /api/products/:id/images
 * @access  Private/Admin
 */
const uploadProductImages = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorResponse('محصول یافت نشد', 404));
  }

  if (!req.files || req.files.length === 0) {
    return next(new ErrorResponse('لطفا حداقل یک تصویر انتخاب کنید', 400));
  }

  console.log(`📷 در حال آپلود ${req.files.length} تصویر برای محصول ${product.name}`);

  // فعلاً URLs موقت استفاده میکنیم (بعداً با Cloudinary جایگزین میشه)
  const images = req.files.map((file, index) => ({
    url: `https://via.placeholder.com/400x500?text=Product+Image+${index + 1}`,
    publicId: `temp_${Date.now()}_${index}`,
    alt: product.name
  }));

  product.images.push(...images);

  // اگر thumbnail نداره، اولین تصویر رو به عنوان thumbnail تنظیم کن
  if (!product.thumbnail || product.thumbnail.includes('placeholder')) {
    product.thumbnail = images[0].url;
  }

  await product.save();

  res.json({
    success: true,
    message: 'تصاویر با موفقیت آپلود شدند',
    data: {
      product
    }
  });
});

/**
 * @desc    حذف تصویر محصول
 * @route   DELETE /api/products/:id/images/:imageId
 * @access  Private/Admin
 */
const deleteProductImage = asyncHandler(async (req, res, next) => {
  const { id, imageId } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorResponse('محصول یافت نشد', 404));
  }

  // پیدا کردن تصویر
  const imageIndex = product.images.findIndex(
    img => img._id.toString() === imageId
  );

  if (imageIndex === -1) {
    return next(new ErrorResponse('تصویر یافت نشد', 404));
  }

  const image = product.images[imageIndex];

  // حذف از Cloudinary (اگر publicId داشته باشد)
  if (image.publicId && !image.publicId.startsWith('temp_')) {
    try {
      await deleteImage(image.publicId);
    } catch (error) {
      console.error('خطا در حذف تصویر از Cloudinary:', error);
    }
  }

  // حذف از آرایه
  product.images.splice(imageIndex, 1);

  await product.save();

  res.json({
    success: true,
    message: 'تصویر با موفقیت حذف شد',
    data: {
      product
    }
  });
});

/**
 * @desc    دریافت محصولات مرتبط
 * @route   GET /api/products/:id/related
 * @access  Public
 */
const getRelatedProducts = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const limit = Number(req.query.limit) || 4;

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorResponse('محصول یافت نشد', 404));
  }

  // پیدا کردن محصولات مرتبط (همان دسته‌بندی، به جز خود محصول)
  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    status: 'active'
  })
    .limit(limit)
    .sort('-rating -soldCount')
    .select('name slug thumbnail price discountPrice rating numReviews');

  res.json({
    success: true,
    count: relatedProducts.length,
    data: {
      products: relatedProducts
    }
  });
});

/**
 * @desc    بروزرسانی موجودی محصول
 * @route   PUT /api/products/:id/stock
 * @access  Private/Admin
 */
const updateStock = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { sizes } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorResponse('محصول یافت نشد', 404));
  }

  if (!sizes || !Array.isArray(sizes)) {
    return next(new ErrorResponse('لطفا اطلاعات موجودی را ارسال کنید', 400));
  }

  // بروزرسانی موجودی
  product.sizes = sizes;
  await product.save();

  res.json({
    success: true,
    message: 'موجودی با موفقیت بروزرسانی شد',
    data: {
      product
    }
  });
});

/**
 * @desc    دریافت محصولات ویژه
 * @route   GET /api/products/featured/list
 * @access  Public
 */
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 8;

  const products = await Product.find({
    isFeatured: true,
    status: 'active'
  })
    .limit(limit)
    .sort('-rating -soldCount')
    .select('name slug thumbnail price discountPrice rating numReviews isFeatured');

  res.json({
    success: true,
    count: products.length,
    data: {
      products
    }
  });
});

/**
 * @desc    دریافت محصولات جدید
 * @route   GET /api/products/new-arrivals/list
 * @access  Public
 */
const getNewArrivals = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 8;

  const products = await Product.find({
    isNewArrival: true,
    status: 'active'
  })
    .limit(limit)
    .sort('-createdAt')
    .select('name slug thumbnail price discountPrice rating numReviews isNewArrival');

  res.json({
    success: true,
    count: products.length,
    data: {
      products
    }
  });
});

/**
 * @desc    دریافت پرفروش‌ترین محصولات
 * @route   GET /api/products/best-sellers/list
 * @access  Public
 */
const getBestSellers = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 8;

  const products = await Product.find({
    status: 'active'
  })
    .limit(limit)
    .sort('-soldCount -rating')
    .select('name slug thumbnail price discountPrice rating numReviews soldCount');

  res.json({
    success: true,
    count: products.length,
    data: {
      products
    }
  });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
  getRelatedProducts,
  updateStock,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers
};
