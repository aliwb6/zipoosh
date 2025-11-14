const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const { asyncHandler } = require('../middleware/errorHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { paginate } = require('../utils/helpers');
const { sendOrderConfirmationEmail } = require('../utils/sendEmail');
const { sendOrderSMS } = require('../utils/sendSMS');

/**
 * @desc    دریافت تمام سفارشات کاربر
 * @route   GET /api/orders
 * @access  Private
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { user: req.user._id };

  if (status) {
    query.status = status;
  }

  const result = await paginate(Order, query, {
    page: Number(page),
    limit: Number(limit),
    sort: '-createdAt',
    populate: 'items.product'
  });

  res.json({
    success: true,
    count: result.data.length,
    pagination: result.pagination,
    data: {
      orders: result.data
    }
  });
});

/**
 * @desc    دریافت تمام سفارشات (ادمین)
 * @route   GET /api/orders/all
 * @access  Private/Admin
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, user, startDate, endDate } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (user) {
    query.user = user;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const result = await paginate(Order, query, {
    page: Number(page),
    limit: Number(limit),
    sort: '-createdAt',
    populate: 'user items.product'
  });

  res.json({
    success: true,
    count: result.data.length,
    pagination: result.pagination,
    data: {
      orders: result.data
    }
  });
});

/**
 * @desc    دریافت جزئیات یک سفارش
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id)
    .populate('user', 'name email phone')
    .populate('items.product');

  if (!order) {
    return next(new ErrorResponse('سفارش یافت نشد', 404));
  }

  // بررسی دسترسی (فقط صاحب سفارش یا ادمین)
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse('شما اجازه دسترسی به این سفارش را ندارید', 403));
  }

  res.json({
    success: true,
    data: {
      order
    }
  });
});

/**
 * @desc    ایجاد سفارش جدید
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = asyncHandler(async (req, res, next) => {
  const {
    items,
    shippingAddress,
    paymentMethod = 'cashOnDelivery',
    couponCode
  } = req.body;

  // بررسی آیتم‌ها
  if (!items || items.length === 0) {
    return next(new ErrorResponse('سفارش خالی است', 400));
  }

  // بررسی موجودی و محاسبه قیمت
  let itemsPrice = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      return next(new ErrorResponse(`محصول با ID ${item.product} یافت نشد`, 404));
    }

    if (product.status !== 'active') {
      return next(new ErrorResponse(`محصول ${product.name} در دسترس نیست`, 400));
    }

    // بررسی موجودی سایز
    const sizeStock = product.sizes.find(s => s.name === item.size);

    if (!sizeStock) {
      return next(new ErrorResponse(`سایز ${item.size} برای ${product.name} موجود نیست`, 400));
    }

    if (sizeStock.stock < item.quantity) {
      return next(new ErrorResponse(`موجودی کافی برای ${product.name} سایز ${item.size} وجود ندارد`, 400));
    }

    const price = product.discountPrice || product.price;
    itemsPrice += price * item.quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.thumbnail,
      price,
      quantity: item.quantity,
      size: item.size,
      color: item.color
    });
  }

  // محاسبه هزینه ارسال
  const shippingPrice = itemsPrice >= 500000 ? 0 : 50000; // ارسال رایگان برای خرید بالای 500 هزار تومان

  // اعمال کد تخفیف
  let discount = 0;
  let appliedCoupon = null;

  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode,
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });

    if (!coupon) {
      return next(new ErrorResponse('کد تخفیف نامعتبر یا منقضی شده است', 400));
    }

    // بررسی حداقل خرید
    if (coupon.minPurchase && itemsPrice < coupon.minPurchase) {
      return next(
        new ErrorResponse(
          `حداقل مبلغ خرید برای این کد تخفیف ${coupon.minPurchase.toLocaleString()} تومان است`,
          400
        )
      );
    }

    // بررسی تعداد استفاده
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return next(new ErrorResponse('ظرفیت استفاده از این کد تخفیف تکمیل شده است', 400));
    }

    // بررسی استفاده توسط کاربر
    if (coupon.usagePerUser) {
      const userUsageCount = await Order.countDocuments({
        user: req.user._id,
        'coupon.code': couponCode
      });

      if (userUsageCount >= coupon.usagePerUser) {
        return next(new ErrorResponse('شما قبلاً از این کد تخفیف استفاده کرده‌اید', 400));
      }
    }

    // محاسبه تخفیف
    if (coupon.discountType === 'percentage') {
      discount = Math.min((itemsPrice * coupon.discountValue) / 100, coupon.maxDiscount || Infinity);
    } else {
      discount = coupon.discountValue;
    }

    appliedCoupon = {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: discount
    };

    // افزایش تعداد استفاده از کوپن
    coupon.usedCount += 1;
    await coupon.save();
  }

  // محاسبه قیمت نهایی
  const taxPrice = Math.round(itemsPrice * 0.09); // 9% مالیات
  const totalPrice = itemsPrice + shippingPrice + taxPrice - discount;

  // ایجاد سفارش
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    discount,
    totalPrice,
    coupon: appliedCoupon
  });

  // کم کردن موجودی محصولات
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    const sizeIndex = product.sizes.findIndex(s => s.name === item.size);
    product.sizes[sizeIndex].stock -= item.quantity;
    product.soldCount += item.quantity;
    await product.save();
  }

  // پاک کردن سبد خرید
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items: [] }
  );

  // ارسال ایمیل و پیامک تایید (غیر مسدودکننده)
  try {
    await Promise.all([
      sendOrderConfirmationEmail(req.user.email, order),
      sendOrderSMS(req.user.phone, order.orderNumber)
    ]);
  } catch (error) {
    console.error('خطا در ارسال تایید سفارش:', error);
  }

  res.status(201).json({
    success: true,
    message: 'سفارش با موفقیت ثبت شد',
    data: {
      order
    }
  });
});

/**
 * @desc    بروزرسانی وضعیت سفارش
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorResponse('سفارش یافت نشد', 404));
  }

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return next(new ErrorResponse('وضعیت نامعتبر است', 400));
  }

  // بررسی امکان لغو
  if (status === 'cancelled' && ['shipped', 'delivered'].includes(order.status)) {
    return next(new ErrorResponse('امکان لغو سفارش ارسال شده یا تحویل داده شده وجود ندارد', 400));
  }

  order.status = status;

  // تنظیم تاریخ‌های مربوطه
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    // اگر پرداخت در محل باشه، پرداخت رو کامل علامت بزن
    if (order.paymentMethod === 'cashOnDelivery') {
      order.isPaid = true;
      order.paidAt = Date.now();
    }
  }

  await order.save();

  res.json({
    success: true,
    message: 'وضعیت سفارش با موفقیت بروزرسانی شد',
    data: {
      order
    }
  });
});

/**
 * @desc    لغو سفارش توسط کاربر
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
const cancelOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorResponse('سفارش یافت نشد', 404));
  }

  // بررسی مالکیت
  if (order.user.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('شما اجازه لغو این سفارش را ندارید', 403));
  }

  // بررسی امکان لغو
  if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
    return next(new ErrorResponse('امکان لغو این سفارش وجود ندارد', 400));
  }

  order.status = 'cancelled';
  await order.save();

  // بازگرداندن موجودی محصولات
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      const sizeIndex = product.sizes.findIndex(s => s.name === item.size);
      if (sizeIndex !== -1) {
        product.sizes[sizeIndex].stock += item.quantity;
        product.soldCount -= item.quantity;
        await product.save();
      }
    }
  }

  res.json({
    success: true,
    message: 'سفارش با موفقیت لغو شد',
    data: {
      order
    }
  });
});

/**
 * @desc    بروزرسانی وضعیت پرداخت
 * @route   PUT /api/orders/:id/pay
 * @access  Private
 */
const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { paymentResult } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorResponse('سفارش یافت نشد', 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = paymentResult;

  await order.save();

  res.json({
    success: true,
    message: 'پرداخت با موفقیت ثبت شد',
    data: {
      order
    }
  });
});

/**
 * @desc    دریافت آمار سفارشات (ادمین)
 * @route   GET /api/orders/stats
 * @access  Private/Admin
 */
const getOrderStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const processingOrders = await Order.countDocuments({ status: 'processing' });
  const shippedOrders = await Order.countDocuments({ status: 'shipped' });
  const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
  const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

  const totalRevenue = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' }, isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    }
  });
});

module.exports = {
  getMyOrders,
  getAllOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  updateOrderToPaid,
  getOrderStats
};
