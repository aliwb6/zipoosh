const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { asyncHandler } = require('../middleware/errorHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const {
  validateCreateCoupon,
  validateMongoId,
  validatePagination
} = require('../middleware/validation');
const { paginate, getPaginationInfo } = require('../utils/helpers');

/**
 * @desc    دریافت تمام کدهای تخفیف (ادمین)
 * @route   GET /api/coupons
 * @access  Private/Admin
 */
const getCoupons = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isActive } = req.query;

  const query = {};
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const { skip, limit: pageLimit } = paginate(page, limit);

  const [coupons, total] = await Promise.all([
    Coupon.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(pageLimit)
      .lean(),
    Coupon.countDocuments(query)
  ]);

  const pagination = getPaginationInfo(total, Number(page), Number(pageLimit));

  res.json({
    success: true,
    count: coupons.length,
    pagination,
    data: {
      coupons
    }
  });
});

/**
 * @desc    دریافت یک کد تخفیف (ادمین)
 * @route   GET /api/coupons/:id
 * @access  Private/Admin
 */
const getCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new ErrorResponse('کد تخفیف یافت نشد', 404));
  }

  res.json({
    success: true,
    data: {
      coupon
    }
  });
});

/**
 * @desc    ایجاد کد تخفیف (ادمین)
 * @route   POST /api/coupons
 * @access  Private/Admin
 */
const createCoupon = asyncHandler(async (req, res) => {
  req.body.createdBy = req.user._id;

  const coupon = await Coupon.create(req.body);

  res.status(201).json({
    success: true,
    message: 'کد تخفیف با موفقیت ایجاد شد',
    data: {
      coupon
    }
  });
});

/**
 * @desc    بروزرسانی کد تخفیف (ادمین)
 * @route   PUT /api/coupons/:id
 * @access  Private/Admin
 */
const updateCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!coupon) {
    return next(new ErrorResponse('کد تخفیف یافت نشد', 404));
  }

  res.json({
    success: true,
    message: 'کد تخفیف با موفقیت بروزرسانی شد',
    data: {
      coupon
    }
  });
});

/**
 * @desc    حذف کد تخفیف (ادمین)
 * @route   DELETE /api/coupons/:id
 * @access  Private/Admin
 */
const deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new ErrorResponse('کد تخفیف یافت نشد', 404));
  }

  await coupon.deleteOne();

  res.json({
    success: true,
    message: 'کد تخفیف با موفقیت حذف شد'
  });
});

/**
 * @desc    بررسی اعتبار کد تخفیف (کاربر)
 * @route   POST /api/coupons/validate
 * @access  Private
 */
const validateCoupon = asyncHandler(async (req, res, next) => {
  const { code, orderAmount } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    return next(new ErrorResponse('کد تخفیف نامعتبر است', 404));
  }

  const validation = coupon.isValid(req.user._id, orderAmount);

  if (!validation.valid) {
    return next(new ErrorResponse(validation.message, 400));
  }

  const discount = coupon.calculateDiscount(orderAmount);

  res.json({
    success: true,
    message: 'کد تخفیف معتبر است',
    data: {
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      },
      discount
    }
  });
});

// Routes
router.use(protect);

// مسیر کاربر
router.post('/validate', validateCoupon);

// مسیرهای ادمین
router.use(admin);

router.get('/', validatePagination, getCoupons);
router.get('/:id', validateMongoId('id'), getCoupon);
router.post('/', validateCreateCoupon, createCoupon);
router.put('/:id', validateMongoId('id'), updateCoupon);
router.delete('/:id', validateMongoId('id'), deleteCoupon);

module.exports = router;