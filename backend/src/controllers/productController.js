const Product = require('../models/Product');
const Category = require('../models/Category');
const { asyncHandler } = require('../middleware/errorHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { uploadImage, deleteImage } = require('../utils/cloudinary');
const { paginate, getPaginationInfo, getSortObject } = require('../utils/helpers');

/**
 * @desc    دریافت لیست محصولات با فیلتر و جستجو
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    category,
    minPrice,
    maxPrice,
    gender,
    brand,
    sizes,
    colors,
    inStock = true,
    sortBy = 'createdAt',
    order = 'desc'
  } = req.query;

  // ساخت query
  const query = { status: 'active' };

  // جستجو در نام، توضیحات و تگ‌ها
  if (search) {
    query.$text = { $search: search };
  }

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

  // فیلتر برند
  if (brand) {
    query.brand = brand;
  }

  // فیلتر سایزها
  if (sizes) {
    const sizeArray = sizes.split(',');
    query['sizes.name'] = { $in: sizeArray };
  }

  // فیلتر رنگ‌ها
  if (colors) {
    const colorArray = colors.split(',');
    query['colors.name'] = { $in: colorArray };
  }

  // فیلتر موجودی
  if (inStock === 'true') {
    query.totalStock = { $gt: 0 };
  }

  // صفحه‌بندی
  const { skip, limit: limitNum, page: pageNum } = paginate(page, limit);

  // مرتب‌سازی
  const sort = getSortObject(sortBy, order);

  // اجرای query
  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(query)
  ]);

  // اطلاعات pagination
  const pagination = getPaginationInfo(total, pageNum, limitNum);

  res.json({
    success: true,
    count: products.length,
    pagination,
    data: {
      products
    }
  });
});

/**
 * @desc    دریافت یک محصول با ID یا slug
 * @route   GET /api/products/:identifier
 * @access  Public
 */
const getProduct = asyncHandler(async (req, res, next) => {
  const { identifier } = req.params;

  // تشخیص ID یا slug
  const query = identifier.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: identifier }
    : { slug: identifier };

  const product = await Product.findOne(query)
    .populate('category', 'name slug')
    .populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'name avatar'
      },
      options: {
        sort: { createdAt: -1 },
        limit: 10
      }
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

  // بررسی تصاویر
  if (!req.files || req.files.length === 0) {
    return next(new ErrorResponse('لطفا حداقل یک تصویر برای محصول آپلود کنید', 400));
  }

  // آپلود تصاویر به Cloudinary
  const uploadedImages = [];
  for (const file of req.files) {
    const result = await uploadImage(file.base64, 'zipoosh/products');
    uploadedImages.push({
      url: result.url,
      publicId: result.publicId,
      alt: name
    });
  }

  // تصویر شاخص اولین تصویر است
  const thumbnail = uploadedImages[0].url;

  // پردازش colors و sizes از JSON string
  const parsedColors = colors ? JSON.parse(colors) : [];
  const parsedSizes = sizes ? JSON.parse(sizes) : [];
  const parsedFeatures = features ? JSON.parse(features) : [];
  const parsedTags = tags ? JSON.parse(tags) : [];
  const parsedMetaKeywords = metaKeywords ? JSON.parse(metaKeywords) : [];

  // ایجاد محصول
  const product = await Product.create({
    name,
    description,
    category,
    subCategory,
    price,
    discountPrice,
    images: uploadedImages,
    thumbnail,
    colors: parsedColors,
    sizes: parsedSizes,
    brand,
    material,
    weight,
    gender,
    features: parsedFeatures,
    sizeGuide,
    tags: parsedTags,
    isFeatured,
    isNewArrival,
    metaTitle,
    metaDescription,
    metaKeywords: parsedMetaKeywords
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
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('محصول یافت نشد', 404));
  }

  // اگر تصاویر جدید آپلود شده
  if (req.files && req.files.length > 0) {
    // حذف تصاویر قدیمی
    for (const image of product.images) {
      try {
        await deleteImage(image.publicId);
      } catch (error) {
        console.error('خطا در حذف تصویر قدیمی:', error);
      }
    }

    // آپلود تصاویر جدید
    const uploadedImages = [];
    for (const file of req.files) {
      const result = await uploadImage(file.base64, 'zipoosh/products');
      uploadedImages.push({
        url: result.url,
        publicId: result.publicId,
        alt: req.body.name || product.name
      });
    }

    req.body.images = uploadedImages;
    req.body.thumbnail = uploadedImages[0].url;
  }

  // پردازش JSON fields
  if (req.body.colors) req.body.colors = JSON.parse(req.body.colors);
  if (req.body.sizes) req.body.sizes = JSON.parse(req.body.sizes);
  if (req.body.features) req.body.features = JSON.parse(req.body.features);
  if (req.body.tags) req.body.tags = JSON.parse(req.body.tags);
  if (req.body.metaKeywords) req.body.metaKeywords = JSON.parse(req.body.metaKeywords);

  // بروزرسانی
  product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('category', 'name slug');

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
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('محصول یافت نشد', 404));
  }

  // حذف تصاویر از Cloudinary
  for (const image of product.images) {
    try {
      await deleteImage(image.publicId);
    } catch (error) {
      console.error('خطا در حذف تصویر:', error);
    }
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: 'محصول با موفقیت حذف شد'
  });
});

/**
 * @desc    دریافت محصولات مرتبط
 * @route   GET /api/products/:id/related
 * @access  Public
 */
const getRelatedProducts = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('محصول یافت نشد', 404));
  }

  const { limit = 8 } = req.query;

  // پیدا کردن محصولات مرتبط (همون دسته‌بندی، جنسیت و برند)
  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    gender: product.gender,
    status: 'active',
    totalStock: { $gt: 0 }
  })
    .limit(Number(limit))
    .sort({ rating: -1, soldCount: -1 })
    .select('name slug thumbnail price discountPrice rating numReviews')
    .lean();

  res.json({
    success: true,
    count: relatedProducts.length,
    data: {
      products: relatedProducts
    }
  });
});

/**
 * @desc    دریافت محصولات ویژه
 * @route   GET /api/products/featured/list
 * @access  Public
 */
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const { limit = 12 } = req.query;

  const products = await Product.find({
    isFeatured: true,
    status: 'active',
    totalStock: { $gt: 0 }
  })
    .limit(Number(limit))
    .sort({ rating: -1, soldCount: -1 })
    .populate('category', 'name slug')
    .lean();

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
  const { limit = 12 } = req.query;

  const products = await Product.find({
    isNewArrival: true,
    status: 'active',
    totalStock: { $gt: 0 }
  })
    .limit(Number(limit))
    .sort({ createdAt: -1 })
    .populate('category', 'name slug')
    .lean();

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
  const { limit = 12 } = req.query;

  const products = await Product.find({
    status: 'active',
    totalStock: { $gt: 0 },
    soldCount: { $gt: 0 }
  })
    .limit(Number(limit))
    .sort({ soldCount: -1, rating: -1 })
    .populate('category', 'name slug')
    .lean();

  res.json({
    success: true,
    count: products.length,
    data: {
      products
    }
  });
});

/**
 * @desc    بروزرسانی موجودی محصول
 * @route   PUT /api/products/:id/stock
 * @access  Private/Admin
 */
const updateStock = asyncHandler(async (req, res, next) => {
  const { sizes } = req.body;

  if (!sizes || !Array.isArray(sizes)) {
    return next(new ErrorResponse('لطفا اطلاعات موجودی سایزها را به درستی ارسال کنید', 400));
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('محصول یافت نشد', 404));
  }

  // بروزرسانی موجودی سایزها
  product.sizes = sizes;
  await product.save();

  res.json({
    success: true,
    message: 'موجودی محصول با موفقیت بروزرسانی شد',
    data: {
      product
    }
  });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  updateStock
};
