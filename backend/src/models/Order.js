const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // شماره سفارش (یونیک)
    orderNumber: {
      type: String,
      unique: true,
      required: true
    },

    // کاربر
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'کاربر الزامی است']
    },

    // اطلاعات تماس
    contactInfo: {
      name: {
        type: String,
        required: [true, 'نام الزامی است'],
        trim: true
      },
      email: {
        type: String,
        required: [true, 'ایمیل الزامی است'],
        trim: true,
        lowercase: true
      },
      phone: {
        type: String,
        required: [true, 'شماره تلفن الزامی است']
      }
    },

    // آدرس ارسال
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
        trim: true
      },
      phone: {
        type: String,
        required: true
      },
      province: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      postalCode: {
        type: String,
        required: true,
        match: [/^[0-9]{10}$/, 'کد پستی باید 10 رقم باشد']
      }
    },

    // آیتم‌های سفارش
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        name: {
          type: String,
          required: true
        },
        image: {
          type: String,
          required: true
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
        quantity: {
          type: Number,
          required: true,
          min: [1, 'تعداد باید حداقل 1 باشد']
        },
        size: {
          type: String,
          required: true
        },
        color: {
          name: String,
          hexCode: String
        }
      }
    ],

    // روش پرداخت
    paymentMethod: {
      type: String,
      required: [true, 'روش پرداخت الزامی است'],
      enum: ['online', 'cashOnDelivery']
    },

    // اطلاعات پرداخت
    paymentInfo: {
      transactionId: String,
      authority: String,
      refId: String,
      cardNumber: String,
      isPaid: {
        type: Boolean,
        default: false
      },
      paidAt: Date
    },

    // قیمت‌ها
    pricing: {
      itemsPrice: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'مبلغ کالاها نمی‌تواند منفی باشد']
      },
      shippingPrice: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'هزینه ارسال نمی‌تواند منفی باشد']
      },
      discountAmount: {
        type: Number,
        default: 0,
        min: [0, 'مبلغ تخفیف نمی‌تواند منفی باشد']
      },
      taxAmount: {
        type: Number,
        default: 0,
        min: [0, 'مالیات نمی‌تواند منفی باشد']
      },
      totalPrice: {
        type: Number,
        required: true,
        min: [0, 'مبلغ کل نمی‌تواند منفی باشد']
      }
    },

    // کد تخفیف
    coupon: {
      code: String,
      discount: Number
    },

    // وضعیت سفارش
    orderStatus: {
      type: String,
      enum: [
        'pending',           // در انتظار پرداخت
        'confirmed',         // تایید شده
        'processing',        // در حال پردازش
        'shipped',           // ارسال شده
        'delivered',         // تحویل داده شده
        'cancelled',         // لغو شده
        'returned'           // مرجوع شده
      ],
      default: 'pending'
    },

    // تاریخچه وضعیت
    statusHistory: [
      {
        status: {
          type: String,
          required: true
        },
        note: String,
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        changedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // اطلاعات ارسال
    shipping: {
      method: {
        type: String,
        enum: ['standard', 'express'],
        default: 'standard'
      },
      carrier: String,
      trackingNumber: String,
      estimatedDelivery: Date,
      shippedAt: Date,
      deliveredAt: Date
    },

    // یادداشت مشتری
    customerNote: {
      type: String,
      maxlength: [500, 'یادداشت نباید بیشتر از 500 کاراکتر باشد']
    },

    // یادداشت ادمین
    adminNote: {
      type: String,
      maxlength: [500, 'یادداشت نباید بیشتر از 500 کاراکتر باشد']
    },

    // فاکتور
    invoice: {
      invoiceNumber: String,
      invoiceUrl: String,
      generatedAt: Date
    },

    // لغو/مرجوعی
    cancellation: {
      reason: String,
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      cancelledAt: Date
    },

    returnInfo: {
      reason: String,
      requestedAt: Date,
      approvedAt: Date,
      refundAmount: Number,
      refundStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed']
      }
    }
  },
  {
    timestamps: true
  }
);

// ایجاد شماره سفارش خودکار
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await this.model('Order').countDocuments();
    const randomNum = Math.floor(Math.random() * 1000);
    this.orderNumber = `ZP${Date.now()}${count}${randomNum}`;
  }
  next();
});

// اضافه کردن وضعیت جدید به تاریخچه
orderSchema.methods.updateStatus = function (status, note, changedBy) {
  this.orderStatus = status;
  this.statusHistory.push({
    status,
    note,
    changedBy,
    changedAt: new Date()
  });
};

// محاسبه قیمت کل
orderSchema.methods.calculateTotalPrice = function () {
  const itemsPrice = this.orderItems.reduce((total, item) => {
    const price = item.discountPrice || item.price;
    return total + price * item.quantity;
  }, 0);

  this.pricing.itemsPrice = itemsPrice;
  this.pricing.totalPrice =
    itemsPrice +
    this.pricing.shippingPrice -
    this.pricing.discountAmount +
    this.pricing.taxAmount;
};

// Virtual برای محاسبه تعداد کل آیتم‌ها
orderSchema.virtual('totalItems').get(function () {
  return this.orderItems.reduce((total, item) => total + item.quantity, 0);
});

// ایندکس‌ها
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ 'paymentInfo.isPaid': 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);