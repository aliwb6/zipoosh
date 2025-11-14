const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { asyncHandler } = require('../middleware/errorHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { uploadMultipleImages, deleteImage } = require('../utils/cloudinary');
const { paginate, getPaginationInfo } = require('../utils/helpers');

/**
 * @desc    دریافت نظرات یک محصول
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
const getProductReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

  const query = {
    product: req.params.productId,
    status: 'approved'
  };

  const { skip, limit: pageLimit } = paginate(page, limit);

  const [reviews, total] = await Promise.all([
    Review.find(query)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(pageLimit)
      .lean(),
    Review.countDocuments(query)
  ]);

  const pagination = getPaginationInfo(total, Number(page), Number(pageLimit));

  res.json({
    success: true,
    count: reviews.length,
    pagination,
    data: {
      reviews
    }
  });
});

/**
 * @desc    ایجاد نظر جدید
 * @route   POST /api/reviews
 * @access  Private
 */
const createReview = asyncHandler(async (req, res, next) => {
  const {
    product: productId,
    rating,
    title,
    comment,
    pros,
    cons,
    qualityRating,
    valueRating,
    wouldRecommend,
    wouldBuyAgain
  } = req.body;

  // بررسی اینکه کاربر قبلا نظر نداده
  const existingReview = await Review.findOne({
    product: productId,
    user: req.user._id
  });

  if (existingReview) {
    return next(new ErrorResponse('شما قبلا برای این محصول نظر ثبت کرده‌اید', 400));
  }

  // بررسی اینکه کاربر محصول رو خریده
  const order = await Order.findOne({
    user: req.user._id,
    'orderItems.product': productId,
    orderStatus: 'delivered'
  });

  const isVerifiedPurchase = !!order;

  // آپلود تصاویر (اگر وجود داشته باشه)
  let images = [];
  if (req.files && req.files.length > 0) {
    const imageFiles = req.files.map(file => file.base64);
    const uploadedImages = await uploadMultipleImages(imageFiles, 'zipoosh/reviews');
    images = uploadedImages.map(img => ({
      url: img.url,
      publicId: img.publicId
    }));
  }

  // ایجاد نظر
  const review = await Review.create({
    product: productId,
    user: req.user._id,
    order: order?._id,
    rating,
    title,
    comment,
    pros: pros ? JSON.parse(pros) : [],
    cons: cons ? JSON.parse(cons) : [],
    images,
    qualityRating,
    valueRating,
    wouldRecommend,
    wouldBuyAgain,
    isVerifiedPurchase,
    status: 'pending' // نیاز به تایید ادمین
  });

  res.status(201).json({
    success: true,
    message: 'نظر شما ثبت شد و پس از تایید نمایش داده می‌شود',
    data: {
      review
    }
  });
});

/**
 * @desc    بروزرسانی نظر
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
const updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('نظر یافت نشد', 404));
  }

  // بررسی مالکیت
  if (review.user.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('شما مجاز به ویرایش این نظر نیستید', 403));
  }

  // آپلود تصاویر جدید (اگر وجود داشته باشه)
  if (req.files && req.files.length > 0) {
    // حذف تصاویر قدیمی
    const deletePromises = review.images.map(img =>
      deleteImage(img.publicId).catch(err => console.error('خطا در حذف تصویر:', err))
    );
    await Promise.all(deletePromises);

    const imageFiles = req.files.map(file => file.base64);
    const uploadedImages = await uploadMultipleImages(imageFiles, 'zipoosh/reviews');
    req.body.images = uploadedImages.map(img => ({
      url: img.url,
      publicId: img.publicId
    }));
  }

  // پردازش آرایه‌ها
  if (req.body.pros) req.body.pros = JSON.parse(req.body.pros);
  if (req.body.cons) req.body.cons = JSON.parse(req.body.cons);

  // بروزرسانی و تنظیم وضعیت به pending برای تایید مجدد
  req.body.status = 'pending';

  review = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'نظر شما بروزرسانی شد و پس از تایید نمایش داده می‌شود',
    data: {
      review
    }
  });
});

/**
 * @desc    حذف نظر
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('نظر یافت نشد', 404));
  }

  // بررسی مالکیت یا ادمین بودن
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse('شما مجاز به حذف این نظر نیستید', 403));
  }

  // حذف تصاویر
  const deletePromises = review.images.map(img =>
    deleteImage(img.publicId).catch(err => console.error('خطا در حذف تصویر:', err))
  );
  await Promise.all(deletePromises);

  await review.deleteOne();

  // بروزرسانی امتیاز محصول
  const Product = require('../models/Product');
  const product = await Product.findById(review.product);
  
  if (product) {
    const reviews = await Review.find({
      product: review.product,
      status: 'approved'
    });
    
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      product.rating = Math.round(avgRating * 10) / 10;
      product.numReviews = reviews.length;
    } else {
      product.rating = 0;
      product.numReviews = 0;
    }
    
    await product.save();
  }

  res.json({
    success: true,
    message: 'نظر با موفقیت حذف شد'
  });
});

/**
 * @desc    رای مفید به نظر
 * @route   POST /api/reviews/:id/helpful
 * @access  Private
 */
const voteHelpful = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('نظر یافت نشد', 404));
  }

  await review.addHelpfulVote(req.user._id);

  res.json({
    success: true,
    message: 'رای شما ثبت شد',
    data: {
      helpfulCount: review.helpfulCount,
      unhelpfulCount: review.unhelpfulCount
    }
  });
});

/**
 * @desc    رای غیرمفید به نظر
 * @route   POST /api/reviews/:id/unhelpful
 * @access  Private
 */
const voteUnhelpful = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('نظر یافت نشد', 404));
  }

  await review.addUnhelpfulVote(req.user._id);

  res.json({
    success: true,
    message: 'رای شما ثبت شد',
    data: {
      helpfulCount: review.helpfulCount,
      unhelpfulCount: review.unhelpfulCount
    }
  });
});

/**
 * @desc    پاسخ به نظر (ادمین)
 * @route   POST /api/reviews/:id/response
 * @access  Private/Admin
 */
const addResponse = asyncHandler(async (req, res, next) => {
  const { text } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('نظر یافت نشد', 404));
  }

  await review.addResponse(text, req.user._id);

  res.json({
    success: true,
    message: 'پاسخ شما ثبت شد',
    data: {
      review
    }
  });
});

/**
 * @desc    تایید/رد نظر (ادمین)
 * @route   PUT /api/reviews/:id/status
 * @access  Private/Admin
 */
const updateReviewStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!review) {
    return next(new ErrorResponse('نظر یافت نشد', 404));
  }

  res.json({
    success: true,
    message: 'وضعیت نظر بروزرسانی شد',
    data: {
      review
    }
  });
});

/**
 * @desc    دریافت تمام نظرات (ادمین)
 * @route   GET /api/reviews
 * @access  Private/Admin
 */
const getAllReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;

  const query = {};
  if (status) query.status = status;

  const { skip, limit: pageLimit } = paginate(page, limit);

  const [reviews, total] = await Promise.all([
    Review.find(query)
      .populate('product', 'name thumbnail')
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(pageLimit)
      .lean(),
    Review.countDocuments(query)
  ]);

  const pagination = getPaginationInfo(total, Number(page), Number(pageLimit));

  res.json({
    success: true,
    count: reviews.length,
    pagination,
    data: {
      reviews
    }
  });
});

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  voteHelpful,
  voteUnhelpful,
  addResponse,
  updateReviewStatus,
  getAllReviews
};