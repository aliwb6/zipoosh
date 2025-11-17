const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Cart = require('../models/Cart');
const { asyncHandler } = require('../middleware/errorHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { paginate, getPaginationInfo, calculateShippingCost } = require('../utils/helpers');

/**
 * @desc    ایجاد سفارش جدید
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = asyncHandler(async (req, res, next) => {
  const {
    contactInfo,
    shippingAddress,
    orderItems,
    paymentMethod,
    shipping,
    coupon,
    customerNote
  } = req.body;

  // بررسی وجود آیتم‌ها
  if (!orderItems || orderItems.length === 0) {
    return next(new ErrorResponse('سفارش شما خالی است', 400));
  }

  // محاسبه قیمت‌ها و بررسی موجودی
  let itemsPrice = 0;
  const processedItems = [];

  for (const item of orderItems) {
    // یافتن محصول
    const product = await Product.findById(item.product);

    if (!product) {
      return next(new ErrorResponse(`محصول با شناسه ${item.product} یافت نشد`, 404));
    }

    // بررسی وضعیت محصول
    if (product.status !== 'active') {
      return next(new ErrorResponse(`محصول ${product.name} در حال حاضر فعال نیست`, 400));
    }

    // یافتن سایز مورد نظر
    const size = product.sizes.find(s => s.name === item.size);

    if (!size) {
      return next(new ErrorResponse(`سایز ${item.size} برای محصول ${product.name} یافت نشد`, 400));
    }

    // بررسی موجودی
    if (size.stock < item.quantity) {
      return next(
        new ErrorResponse(
          `موجودی کافی برای محصول ${product.name} با سایز ${item.size} وجود ندارد. موجودی: ${size.stock}`,
          400
        )
      );
    }

    // محاسبه قیمت
    const price = product.discountPrice || product.price;
    itemsPrice += price * item.quantity;

    // آیتم پردازش شده
    processedItems.push({
      product: product._id,
      name: product.name,
      image: product.thumbnail,
      price: product.price,
      discountPrice: product.discountPrice,
      quantity: item.quantity,
      size: item.size,
      color: item.color
    });

    // کاهش موجودی
    size.stock -= item.quantity;
    product.soldCount += item.quantity;
    await product.save();
  }

  // محاسبه هزینه ارسال
  const shippingPrice = calculateShippingCost(shippingAddress.province);

  // محاسبه تخفیف کوپن
  let discountAmount = 0;
  if (coupon && coupon.discount) {
    discountAmount = coupon.discount;
  }

  // محاسبه مالیات (9 درصد)
  const taxAmount = Math.round(itemsPrice * 0.09);

  // محاسبه قیمت کل
  const totalPrice = itemsPrice + shippingPrice - discountAmount + taxAmount;

  // ایجاد سفارش
  const order = await Order.create({
    user: req.user._id,
    contactInfo: contactInfo || {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone
    },
    shippingAddress,
    orderItems: processedItems,
    paymentMethod,
    pricing: {
      itemsPrice,
      shippingPrice,
      discountAmount,
      taxAmount,
      totalPrice
    },
    shipping: {
      method: shipping?.method || 'standard'
    },
    coupon,
    customerNote,
    orderStatus: paymentMethod === 'online' ? 'pending' : 'confirmed'
  });

  // اضافه کردن اولین وضعیت به تاریخچه
  order.statusHistory.push({
    status: order.orderStatus,
    note: 'سفارش ایجاد شد',
    changedBy: req.user._id
  });
  await order.save();

  // خالی کردن سبد خرید کاربر
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      await cart.clearCart();
    }
  } catch (error) {
    console.error('خطا در خالی کردن سبد خرید:', error);
  }

  // Populate کردن سفارش برای نمایش
  const populatedOrder = await Order.findById(order._id)
    .populate('user', 'name email phone')
    .populate('orderItems.product', 'name slug thumbnail');

  res.status(201).json({
    success: true,
    message: 'سفارش با موفقیت ثبت شد',
    data: {
      order: populatedOrder
    }
  });
});

/**
 * @desc    دریافت سفارشات کاربر
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  // ساخت query
  const query = { user: req.user._id };

  if (status) {
    query.orderStatus = status;
  }

  // صفحه‌بندی
  const { skip, limit: limitNum, page: pageNum } = paginate(page, limit);

  // دریافت سفارشات
  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('orderItems.product', 'name slug thumbnail')
      .lean(),
    Order.countDocuments(query)
  ]);

  // اطلاعات pagination
  const pagination = getPaginationInfo(total, pageNum, limitNum);

  res.json({
    success: true,
    count: orders.length,
    pagination,
    data: {
      orders
    }
  });
});

/**
 * @desc    دریافت جزئیات یک سفارش
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone avatar')
    .populate('orderItems.product', 'name slug thumbnail price discountPrice')
    .populate('statusHistory.changedBy', 'name');

  if (!order) {
    return next(new ErrorResponse('سفارش یافت نشد', 404));
  }

  // بررسی دسترسی (فقط کاربر خود سفارش یا ادمین)
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse('شما مجاز به مشاهده این سفارش نیستید', 403));
  }

  res.json({
    success: true,
    data: {
      order
    }
  });
});

/**
 * @desc    لغو سفارش
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
const cancelOrder = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('سفارش یافت نشد', 404));
  }

  // بررسی مالکیت سفارش
  if (order.user.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('شما مجاز به لغو این سفارش نیستید', 403));
  }

  // بررسی وضعیت سفارش (فقط سفارشات pending و confirmed قابل لغو هستند)
  if (!['pending', 'confirmed', 'processing'].includes(order.orderStatus)) {
    return next(
      new ErrorResponse(
        'این سفارش قابل لغو نیست. فقط سفارشات در حالت در انتظار، تایید شده یا در حال پردازش قابل لغو هستند',
        400
      )
    );
  }

  // بازگرداندن موجودی محصولات
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      const size = product.sizes.find(s => s.name === item.size);
      if (size) {
        size.stock += item.quantity;
        product.soldCount = Math.max(0, product.soldCount - item.quantity);
        await product.save();
      }
    }
  }

  // بروزرسانی وضعیت سفارش
  order.updateStatus('cancelled', reason || 'لغو توسط کاربر', req.user._id);
  order.cancellation = {
    reason: reason || 'لغو توسط کاربر',
    cancelledBy: req.user._id,
    cancelledAt: new Date()
  };

  await order.save();

  res.json({
    success: true,
    message: 'سفارش با موفقیت لغو شد',
    data: {
      order
    }
  });
});

/**
 * @desc    دریافت تمام سفارشات (ادمین)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    paymentStatus,
    search,
    startDate,
    endDate,
    sortBy = 'createdAt',
    order = 'desc'
  } = req.query;

  // ساخت query
  const query = {};

  // فیلتر وضعیت سفارش
  if (status) {
    query.orderStatus = status;
  }

  // فیلتر وضعیت پرداخت
  if (paymentStatus) {
    query['paymentInfo.isPaid'] = paymentStatus === 'paid';
  }

  // جستجو در شماره سفارش یا نام مشتری
  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'contactInfo.name': { $regex: search, $options: 'i' } },
      { 'contactInfo.email': { $regex: search, $options: 'i' } },
      { 'contactInfo.phone': { $regex: search, $options: 'i' } }
    ];
  }

  // فیلتر تاریخ
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  // صفحه‌بندی
  const { skip, limit: limitNum, page: pageNum } = paginate(page, limit);

  // مرتب‌سازی
  const sort = { [sortBy]: order === 'asc' ? 1 : -1 };

  // دریافت سفارشات
  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name slug thumbnail')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Order.countDocuments(query)
  ]);

  // اطلاعات pagination
  const pagination = getPaginationInfo(total, pageNum, limitNum);

  res.json({
    success: true,
    count: orders.length,
    pagination,
    data: {
      orders
    }
  });
});

/**
 * @desc    بروزرسانی وضعیت سفارش (ادمین)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, note, trackingNumber, estimatedDelivery } = req.body;

  if (!status) {
    return next(new ErrorResponse('وضعیت جدید الزامی است', 400));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('سفارش یافت نشد', 404));
  }

  // بررسی معتبر بودن وضعیت
  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
  if (!validStatuses.includes(status)) {
    return next(new ErrorResponse('وضعیت نامعتبر است', 400));
  }

  // بروزرسانی وضعیت
  order.updateStatus(status, note, req.user._id);

  // اگر وضعیت ارسال شده باشد
  if (status === 'shipped') {
    order.shipping.shippedAt = new Date();
    if (trackingNumber) {
      order.shipping.trackingNumber = trackingNumber;
    }
    if (estimatedDelivery) {
      order.shipping.estimatedDelivery = new Date(estimatedDelivery);
    }
  }

  // اگر وضعیت تحویل داده شده باشد
  if (status === 'delivered') {
    order.shipping.deliveredAt = new Date();
    order.paymentInfo.isPaid = true;
    order.paymentInfo.paidAt = new Date();
  }

  // اگر وضعیت تایید شده باشد و روش پرداخت آنلاین است
  if (status === 'confirmed' && order.paymentMethod === 'online') {
    order.paymentInfo.isPaid = true;
    order.paymentInfo.paidAt = new Date();
  }

  await order.save();

  // Populate کردن
  const populatedOrder = await Order.findById(order._id)
    .populate('user', 'name email phone')
    .populate('orderItems.product', 'name slug thumbnail')
    .populate('statusHistory.changedBy', 'name');

  res.json({
    success: true,
    message: 'وضعیت سفارش با موفقیت بروزرسانی شد',
    data: {
      order: populatedOrder
    }
  });
});

/**
 * @desc    دریافت آمار سفارشات (ادمین)
 * @route   GET /api/orders/stats/dashboard
 * @access  Private/Admin
 */
const getOrderStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  // تعیین بازه زمانی (پیش‌فرض: 30 روز گذشته)
  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();

  const dateQuery = {
    createdAt: {
      $gte: start,
      $lte: end
    }
  };

  // آمار کلی
  const [
    totalOrders,
    pendingOrders,
    confirmedOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue,
    paidOrders
  ] = await Promise.all([
    Order.countDocuments(dateQuery),
    Order.countDocuments({ ...dateQuery, orderStatus: 'pending' }),
    Order.countDocuments({ ...dateQuery, orderStatus: 'confirmed' }),
    Order.countDocuments({ ...dateQuery, orderStatus: 'processing' }),
    Order.countDocuments({ ...dateQuery, orderStatus: 'shipped' }),
    Order.countDocuments({ ...dateQuery, orderStatus: 'delivered' }),
    Order.countDocuments({ ...dateQuery, orderStatus: 'cancelled' }),
    Order.aggregate([
      {
        $match: {
          ...dateQuery,
          orderStatus: { $nin: ['cancelled', 'returned'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$pricing.totalPrice' }
        }
      }
    ]),
    Order.countDocuments({ ...dateQuery, 'paymentInfo.isPaid': true })
  ]);

  // محصولات پرفروش
  const topProducts = await Order.aggregate([
    {
      $match: {
        ...dateQuery,
        orderStatus: { $nin: ['cancelled'] }
      }
    },
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        totalSold: { $sum: '$orderItems.quantity' },
        totalRevenue: {
          $sum: {
            $multiply: [
              { $ifNull: ['$orderItems.discountPrice', '$orderItems.price'] },
              '$orderItems.quantity'
            ]
          }
        }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        _id: 1,
        name: '$product.name',
        slug: '$product.slug',
        thumbnail: '$product.thumbnail',
        totalSold: 1,
        totalRevenue: 1
      }
    }
  ]);

  // سفارشات اخیر
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name thumbnail')
    .select('orderNumber user contactInfo pricing orderStatus createdAt')
    .lean();

  // آمار روزانه (7 روز گذشته)
  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const dailyStats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: last7Days }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        orders: { $sum: 1 },
        revenue: { $sum: '$pricing.totalPrice' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json({
    success: true,
    data: {
      summary: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        paidOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        averageOrderValue: totalOrders > 0 ? Math.round((totalRevenue[0]?.total || 0) / totalOrders) : 0
      },
      topProducts,
      recentOrders,
      dailyStats,
      period: {
        start,
        end
      }
    }
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats
};
