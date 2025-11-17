const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    // کد تخفیف (یونیک)
    code: {
      type: String,
      required: [true, 'کد تخفیف الزامی است'],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [4, 'کد تخفیف باید حداقل 4 کاراکتر باشد'],
      maxlength: [20, 'کد تخفیف نباید بیشتر از 20 کاراکتر باشد']
    },

    // توضیحات
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'توضیحات نباید بیشتر از 200 کاراکتر باشد']
    },

    // نوع تخفیف
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: [true, 'نوع تخفیف الزامی است']
    },

    // مقدار تخفیف
    discountValue: {
      type: Number,
      required: [true, 'مقدار تخفیف الزامی است'],
      min: [0, 'مقدار تخفیف نمی‌تواند منفی باشد']
    },

    // حداکثر مبلغ تخفیف (برای درصدی)
    maxDiscountAmount: {
      type: Number,
      min: [0, 'حداکثر مبلغ تخفیف نمی‌تواند منفی باشد']
    },

    // حداقل مبلغ خرید
    minPurchaseAmount: {
      type: Number,
      default: 0,
      min: [0, 'حداقل مبلغ خرید نمی‌تواند منفی باشد']
    },

    // تاریخ شروع
    startDate: {
      type: Date,
      required: [true, 'تاریخ شروع الزامی است']
    },

    // تاریخ انقضا
    expiryDate: {
      type: Date,
      required: [true, 'تاریخ انقضا الزامی است'],
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: 'تاریخ انقضا باید بعد از تاریخ شروع باشد'
      }
    },

    // تعداد کل استفاده
    usageLimit: {
      type: Number,
      min: [1, 'محدودیت استفاده باید حداقل 1 باشد']
    },

    // تعداد استفاده به ازای هر کاربر
    usageLimitPerUser: {
      type: Number,
      min: [1, 'محدودیت استفاده به ازای هر کاربر باید حداقل 1 باشد'],
      default: 1
    },

    // تعداد استفاده شده
    usedCount: {
      type: Number,
      default: 0,
      min: [0, 'تعداد استفاده نمی‌تواند منفی باشد']
    },

    // کاربرانی که استفاده کردند
    usedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        usedAt: {
          type: Date,
          default: Date.now
        },
        orderAmount: Number
      }
    ],

    // محدودیت‌های استفاده
    restrictions: {
      // فقط برای کاربران خاص
      specificUsers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
      
      // فقط برای محصولات خاص
      specificProducts: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        }
      ],
      
      // فقط برای دسته‌بندی‌های خاص
      specificCategories: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Category'
        }
      ],
      
      // فقط برای اولین خرید
      firstPurchaseOnly: {
        type: Boolean,
        default: false
      }
    },

    // وضعیت
    isActive: {
      type: Boolean,
      default: true
    },

    // ساخته شده توسط
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// متد برای محاسبه مبلغ تخفیف
couponSchema.methods.calculateDiscount = function (orderAmount) {
  if (this.discountType === 'percentage') {
    const discount = (orderAmount * this.discountValue) / 100;
    // اعمال حداکثر تخفیف
    if (this.maxDiscountAmount) {
      return Math.min(discount, this.maxDiscountAmount);
    }
    return discount;
  } else {
    // تخفیف ثابت
    return Math.min(this.discountValue, orderAmount);
  }
};

// متد برای بررسی اعتبار کد تخفیف
couponSchema.methods.isValid = function (userId, orderAmount) {
  const now = new Date();
  
  // بررسی فعال بودن
  if (!this.isActive) {
    return { valid: false, message: 'این کد تخفیف غیرفعال است' };
  }
  
  // بررسی تاریخ
  if (now < this.startDate) {
    return { valid: false, message: 'این کد تخفیف هنوز فعال نشده است' };
  }
  
  if (now > this.expiryDate) {
    return { valid: false, message: 'این کد تخفیف منقضی شده است' };
  }
  
  // بررسی تعداد کل استفاده
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return { valid: false, message: 'ظرفیت استفاده از این کد تخفیف تمام شده است' };
  }
  
  // بررسی حداقل مبلغ خرید
  if (orderAmount < this.minPurchaseAmount) {
    return {
      valid: false,
      message: `حداقل مبلغ خرید برای استفاده از این کد ${this.minPurchaseAmount.toLocaleString()} تومان است`
    };
  }
  
  // بررسی محدودیت به ازای کاربر
  const userUsage = this.usedBy.filter(
    (usage) => usage.user.toString() === userId.toString()
  ).length;
  
  if (userUsage >= this.usageLimitPerUser) {
    return {
      valid: false,
      message: 'شما قبلا از این کد تخفیف استفاده کرده‌اید'
    };
  }
  
  // بررسی کاربران خاص
  if (
    this.restrictions.specificUsers.length > 0 &&
    !this.restrictions.specificUsers.includes(userId)
  ) {
    return { valid: false, message: 'این کد تخفیف برای شما قابل استفاده نیست' };
  }
  
  return { valid: true, message: 'کد تخفیف معتبر است' };
};

// متد برای ثبت استفاده از کد تخفیف
couponSchema.methods.use = async function (userId, orderAmount) {
  this.usedCount += 1;
  this.usedBy.push({
    user: userId,
    usedAt: new Date(),
    orderAmount
  });
  await this.save();
  return this;
};

// ایندکس‌ها
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, expiryDate: 1 });
couponSchema.index({ startDate: 1, expiryDate: 1 });

module.exports = mongoose.model('Coupon', couponSchema);