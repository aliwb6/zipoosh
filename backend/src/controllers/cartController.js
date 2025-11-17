const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');
const { ErrorResponse } = require('../middleware/errorHandler');

/**
 * @desc    دریافت سبد خرید کاربر
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // ایجاد سبد خرید جدید
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.json({
    success: true,
    data: {
      cart
    }
  });
});

/**
 * @desc    افزودن محصول به سبد خرید
 * @route   POST /api/cart
 * @access  Private
 */
const addToCart = asyncHandler(async (req, res, next) => {
  const { product: productId, quantity, size, color } = req.body;

  // بررسی محصول
  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorResponse('محصول یافت نشد', 404));
  }

  if (product.status !== 'active') {
    return next(new ErrorResponse('این محصول در دسترس نیست', 400));
  }

  // بررسی موجودی سایز
  const sizeStock = product.sizes.find(s => s.name === size);
  
  if (!sizeStock) {
    return next(new ErrorResponse(`سایز ${size} برای این محصول وجود ندارد`, 400));
  }

  if (sizeStock.stock < quantity) {
    return next(
      new ErrorResponse(
        `موجودی کافی نیست. موجودی فعلی: ${sizeStock.stock}`,
        400
      )
    );
  }

  // دریافت یا ایجاد سبد خرید
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  // افزودن محصول
  const price = product.price;
  const discountPrice = product.discountPrice;

  await cart.addItem(productId, quantity, size, color, price, discountPrice);

  // دریافت سبد خرید با populate
  cart = await Cart.findOne({ user: req.user._id });

  res.status(201).json({
    success: true,
    message: 'محصول به سبد خرید اضافه شد',
    data: {
      cart
    }
  });
});

/**
 * @desc    بروزرسانی تعداد محصول در سبد
 * @route   PUT /api/cart/:itemId
 * @access  Private
 */
const updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ErrorResponse('سبد خرید یافت نشد', 404));
  }

  const item = cart.items.id(itemId);

  if (!item) {
    return next(new ErrorResponse('محصول در سبد خرید یافت نشد', 404));
  }

  // بررسی موجودی
  const product = await Product.findById(item.product);
  const sizeStock = product.sizes.find(s => s.name === item.size);

  if (sizeStock.stock < quantity) {
    return next(
      new ErrorResponse(
        `موجودی کافی نیست. موجودی فعلی: ${sizeStock.stock}`,
        400
      )
    );
  }

  await cart.updateItemQuantity(itemId, quantity);

  res.json({
    success: true,
    message: 'تعداد محصول بروزرسانی شد',
    data: {
      cart
    }
  });
});

/**
 * @desc    حذف محصول از سبد خرید
 * @route   DELETE /api/cart/:itemId
 * @access  Private
 */
const removeFromCart = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ErrorResponse('سبد خرید یافت نشد', 404));
  }

  await cart.removeItem(itemId);

  res.json({
    success: true,
    message: 'محصول از سبد خرید حذف شد',
    data: {
      cart
    }
  });
});

/**
 * @desc    خالی کردن سبد خرید
 * @route   DELETE /api/cart
 * @access  Private
 */
const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ErrorResponse('سبد خرید یافت نشد', 404));
  }

  await cart.clearCart();

  res.json({
    success: true,
    message: 'سبد خرید خالی شد',
    data: {
      cart
    }
  });
});

/**
 * @desc    اعمال کد تخفیف
 * @route   POST /api/cart/apply-coupon
 * @access  Private
 */
const applyCoupon = asyncHandler(async (req, res, next) => {
  const { code } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ErrorResponse('سبد خرید یافت نشد', 404));
  }

  if (cart.items.length === 0) {
    return next(new ErrorResponse('سبد خرید خالی است', 400));
  }

  // بررسی کد تخفیف
  const Coupon = require('../models/Coupon');
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    return next(new ErrorResponse('کد تخفیف نامعتبر است', 404));
  }

  // بررسی اعتبار کد
  const validation = coupon.isValid(req.user._id, cart.subtotal);

  if (!validation.valid) {
    return next(new ErrorResponse(validation.message, 400));
  }

  // محاسبه تخفیف
  const discount = coupon.calculateDiscount(cart.subtotal);

  // اعمال کد تخفیف
  await cart.applyCoupon(code.toUpperCase(), discount, coupon.expiryDate);

  res.json({
    success: true,
    message: 'کد تخفیف با موفقیت اعمال شد',
    data: {
      cart,
      discount
    }
  });
});

/**
 * @desc    حذف کد تخفیف
 * @route   DELETE /api/cart/remove-coupon
 * @access  Private
 */
const removeCoupon = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ErrorResponse('سبد خرید یافت نشد', 404));
  }

  await cart.removeCoupon();

  res.json({
    success: true,
    message: 'کد تخفیف حذف شد',
    data: {
      cart
    }
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon
};