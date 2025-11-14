const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { paginate, getPaginationInfo } = require('../utils/helpers');

/**
 * @desc    دریافت تمام کاربران (ادمین)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role, isActive } = req.query;

  const query = {};
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const { skip, limit: pageLimit } = paginate(page, limit);

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(pageLimit)
      .lean(),
    User.countDocuments(query)
  ]);

  const pagination = getPaginationInfo(total, Number(page), Number(pageLimit));

  res.json({
    success: true,
    count: users.length,
    pagination,
    data: {
      users
    }
  });
});

/**
 * @desc    دریافت یک کاربر (ادمین)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new ErrorResponse('کاربر یافت نشد', 404));
  }

  res.json({
    success: true,
    data: {
      user
    }
  });
});

/**
 * @desc    بروزرسانی کاربر (ادمین)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, phone, role, isActive } = req.body;

  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('کاربر یافت نشد', 404));
  }

  // بروزرسانی
  user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, phone, role, isActive },
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'کاربر با موفقیت بروزرسانی شد',
    data: {
      user
    }
  });
});

/**
 * @desc    حذف کاربر (ادمین)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('کاربر یافت نشد', 404));
  }

  // ادمین نمی‌تونه خودش رو حذف کنه
  if (user._id.toString() === req.user._id.toString()) {
    return next(new ErrorResponse('شما نمی‌توانید حساب خود را حذف کنید', 400));
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: 'کاربر با موفقیت حذف شد'
  });
});

/**
 * @desc    افزودن آدرس
 * @route   POST /api/users/addresses
 * @access  Private
 */
const addAddress = asyncHandler(async (req, res) => {
  const address = req.body;

  const user = await User.findById(req.user._id);

  // اگر آدرس پیش‌فرض باشه، بقیه رو غیرپیش‌فرض کن
  if (address.isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  user.addresses.push(address);
  await user.save();

  res.status(201).json({
    success: true,
    message: 'آدرس با موفقیت اضافه شد',
    data: {
      addresses: user.addresses
    }
  });
});

/**
 * @desc    بروزرسانی آدرس
 * @route   PUT /api/users/addresses/:addressId
 * @access  Private
 */
const updateAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    return next(new ErrorResponse('آدرس یافت نشد', 404));
  }

  // اگر آدرس پیش‌فرض شده، بقیه رو غیرپیش‌فرض کن
  if (req.body.isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  Object.assign(address, req.body);
  await user.save();

  res.json({
    success: true,
    message: 'آدرس با موفقیت بروزرسانی شد',
    data: {
      addresses: user.addresses
    }
  });
});

/**
 * @desc    حذف آدرس
 * @route   DELETE /api/users/addresses/:addressId
 * @access  Private
 */
const deleteAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  user.addresses = user.addresses.filter(
    addr => addr._id.toString() !== req.params.addressId
  );
  
  await user.save();

  res.json({
    success: true,
    message: 'آدرس با موفقیت حذف شد',
    data: {
      addresses: user.addresses
    }
  });
});

/**
 * @desc    افزودن به لیست علاقه‌مندی‌ها
 * @route   POST /api/users/wishlist/:productId
 * @access  Private
 */
const addToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // بررسی اینکه قبلا اضافه نشده باشه
  if (user.wishlist.includes(req.params.productId)) {
    return next(new ErrorResponse('این محصول قبلا به لیست علاقه‌مندی‌ها اضافه شده', 400));
  }

  user.wishlist.push(req.params.productId);
  await user.save();

  const updatedUser = await User.findById(req.user._id)
    .populate('wishlist', 'name slug thumbnail price discountPrice rating');

  res.json({
    success: true,
    message: 'محصول به لیست علاقه‌مندی‌ها اضافه شد',
    data: {
      wishlist: updatedUser.wishlist
    }
  });
});

/**
 * @desc    حذف از لیست علاقه‌مندی‌ها
 * @route   DELETE /api/users/wishlist/:productId
 * @access  Private
 */
const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.wishlist = user.wishlist.filter(
    id => id.toString() !== req.params.productId
  );

  await user.save();

  const updatedUser = await User.findById(req.user._id)
    .populate('wishlist', 'name slug thumbnail price discountPrice rating');

  res.json({
    success: true,
    message: 'محصول از لیست علاقه‌مندی‌ها حذف شد',
    data: {
      wishlist: updatedUser.wishlist
    }
  });
});

/**
 * @desc    دریافت لیست علاقه‌مندی‌ها
 * @route   GET /api/users/wishlist
 * @access  Private
 */
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('wishlist', 'name slug thumbnail price discountPrice rating numReviews totalStock');

  res.json({
    success: true,
    count: user.wishlist.length,
    data: {
      wishlist: user.wishlist
    }
  });
});

/**
 * @desc    آمار کاربران (ادمین)
 * @route   GET /api/users/stats/dashboard
 * @access  Private/Admin
 */
const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const adminUsers = await User.countDocuments({ role: 'admin' });
  
  const recentUsers = await User.find()
    .select('name email createdAt')
    .sort('-createdAt')
    .limit(10)
    .lean();

  res.json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      adminUsers,
      inactiveUsers: totalUsers - activeUsers,
      recentUsers
    }
  });
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addAddress,
  updateAddress,
  deleteAddress,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getUserStats
};