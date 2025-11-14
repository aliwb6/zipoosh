const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    // کاربر
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'کاربر الزامی است'],
      unique: true
    },

    // آیتم‌های سبد خرید
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'تعداد باید حداقل 1 باشد'],
          default: 1
        },
        size: {
          type: String,
          required: [true, 'سایز الزامی است']
        },
        color: {
          name: {
            type: String,
            required: true
          },
          hexCode: {
            type: String,
            required: true
          }
        },
        price: {
          type: Number,
          required: true,
          min: [0, 'قیمت نمی‌تواند منفی باشد']
        },
        discountPrice: {
          type: Number,
          min: [0, 'قیمت تخفیف نمی‌تواند منفی باشد']
        },
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // کد تخفیف
    appliedCoupon: {
      code: String,
      discount: Number,
      expiresAt: Date
    },

    // یادداشت
    note: {
      type: String,
      maxlength: [500, 'یادداشت نباید بیشتر از 500 کاراکتر باشد']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual برای محاسبه تعداد کل آیتم‌ها
cartSchema.virtual('totalItems').get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual برای محاسبه مبلغ کل (بدون تخفیف)
cartSchema.virtual('subtotal').get(function () {
  return this.items.reduce((total, item) => {
    const price = item.discountPrice || item.price;
    return total + price * item.quantity;
  }, 0);
});

// Virtual برای محاسبه مبلغ تخفیف کل
cartSchema.virtual('totalDiscount').get(function () {
  const itemsDiscount = this.items.reduce((total, item) => {
    if (item.discountPrice) {
      return total + (item.price - item.discountPrice) * item.quantity;
    }
    return total;
  }, 0);

  const couponDiscount = this.appliedCoupon?.discount || 0;
  return itemsDiscount + couponDiscount;
});

// Virtual برای محاسبه مبلغ نهایی
cartSchema.virtual('total').get(function () {
  const subtotal = this.subtotal;
  const couponDiscount = this.appliedCoupon?.discount || 0;
  return Math.max(0, subtotal - couponDiscount);
});

// متد برای افزودن محصول به سبد
cartSchema.methods.addItem = async function (productId, quantity, size, color, price, discountPrice) {
  // بررسی اینکه آیا محصول با همین سایز و رنگ قبلا اضافه شده
  const existingItem = this.items.find(
    (item) =>
      item.product.toString() === productId.toString() &&
      item.size === size &&
      item.color.hexCode === color.hexCode
  );

  if (existingItem) {
    // افزایش تعداد
    existingItem.quantity += quantity;
  } else {
    // اضافه کردن آیتم جدید
    this.items.push({
      product: productId,
      quantity,
      size,
      color,
      price,
      discountPrice
    });
  }

  await this.save();
  return this;
};

// متد برای حذف محصول از سبد
cartSchema.methods.removeItem = async function (itemId) {
  this.items = this.items.filter((item) => item._id.toString() !== itemId.toString());
  await this.save();
  return this;
};

// متد برای بروزرسانی تعداد محصول
cartSchema.methods.updateItemQuantity = async function (itemId, quantity) {
  const item = this.items.find((item) => item._id.toString() === itemId.toString());
  
  if (item) {
    if (quantity <= 0) {
      // اگر تعداد صفر یا منفی شد، آیتم رو حذف کن
      this.items = this.items.filter((item) => item._id.toString() !== itemId.toString());
    } else {
      item.quantity = quantity;
    }
    await this.save();
  }
  
  return this;
};

// متد برای خالی کردن سبد
cartSchema.methods.clearCart = async function () {
  this.items = [];
  this.appliedCoupon = undefined;
  this.note = undefined;
  await this.save();
  return this;
};

// متد برای اعمال کد تخفیف
cartSchema.methods.applyCoupon = async function (code, discount, expiresAt) {
  this.appliedCoupon = {
    code,
    discount,
    expiresAt
  };
  await this.save();
  return this;
};

// متد برای حذف کد تخفیف
cartSchema.methods.removeCoupon = async function () {
  this.appliedCoupon = undefined;
  await this.save();
  return this;
};

// Populate محصولات به صورت خودکار
cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items.product',
    select: 'name slug images thumbnail price discountPrice totalStock status'
  });
  next();
});

// ایندکس
cartSchema.index({ user: 1 });

module.exports = mongoose.model('Cart', cartSchema);