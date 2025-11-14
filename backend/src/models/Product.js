const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // اطلاعات اصلی
    name: {
      type: String,
      required: [true, 'لطفا نام محصول را وارد کنید'],
      trim: true,
      maxlength: [100, 'نام محصول نباید بیشتر از 100 کاراکتر باشد']
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true
    },

    description: {
      type: String,
      required: [true, 'لطفا توضیحات محصول را وارد کنید'],
      maxlength: [2000, 'توضیحات نباید بیشتر از 2000 کاراکتر باشد']
    },

    // دسته‌بندی
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'لطفا دسته‌بندی محصول را انتخاب کنید']
    },

    subCategory: {
      type: String,
      trim: true
    },

    // قیمت
    price: {
      type: Number,
      required: [true, 'لطفا قیمت محصول را وارد کنید'],
      min: [0, 'قیمت نمی‌تواند منفی باشد']
    },

    discountPrice: {
      type: Number,
      min: [0, 'قیمت تخفیف نمی‌تواند منفی باشد'],
      validate: {
        validator: function (value) {
          return !value || value < this.price;
        },
        message: 'قیمت تخفیف باید کمتر از قیمت اصلی باشد'
      }
    },

    discountPercent: {
      type: Number,
      min: [0, 'درصد تخفیف نمی‌تواند منفی باشد'],
      max: [100, 'درصد تخفیف نمی‌تواند بیشتر از 100 باشد']
    },

    // تصاویر
    images: [
      {
        url: {
          type: String,
          required: true
        },
        publicId: {
          type: String,
          required: true
        },
        alt: String
      }
    ],

    thumbnail: {
      type: String,
      required: [true, 'لطفا تصویر شاخص محصول را آپلود کنید']
    },

    // رنگ‌ها و سایزها
    colors: [
      {
        name: {
          type: String,
          required: true
        },
        hexCode: {
          type: String,
          required: true,
          match: [/^#[0-9A-F]{6}$/i, 'کد رنگ باید به فرمت hex باشد']
        }
      }
    ],

    sizes: [
      {
        name: {
          type: String,
          required: true,
          enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'فری سایز']
        },
        stock: {
          type: Number,
          required: true,
          min: [0, 'موجودی نمی‌تواند منفی باشد'],
          default: 0
        }
      }
    ],

    // موجودی کل
    totalStock: {
      type: Number,
      required: true,
      min: [0, 'موجودی نمی‌تواند منفی باشد'],
      default: 0
    },

    // برند
    brand: {
      type: String,
      trim: true
    },

    // مشخصات فنی
    material: {
      type: String,
      trim: true
    },

    weight: {
      type: Number,
      min: [0, 'وزن نمی‌تواند منفی باشد']
    },

    // جنسیت
    gender: {
      type: String,
      enum: ['مردانه', 'زنانه', 'دخترانه', 'پسرانه', 'یونیسکس'],
      required: true
    },

    // ویژگی‌ها
    features: [
      {
        type: String,
        trim: true
      }
    ],

    // راهنمای سایز
    sizeGuide: {
      type: String
    },

    // تگ‌ها
    tags: [
      {
        type: String,
        trim: true
      }
    ],

    // امتیاز و نظرات
    rating: {
      type: Number,
      default: 0,
      min: [0, 'امتیاز نمی‌تواند منفی باشد'],
      max: [5, 'امتیاز نمی‌تواند بیشتر از 5 باشد']
    },

    numReviews: {
      type: Number,
      default: 0,
      min: [0, 'تعداد نظرات نمی‌تواند منفی باشد']
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],

    // آمار فروش
    soldCount: {
      type: Number,
      default: 0,
      min: [0, 'تعداد فروش نمی‌تواند منفی باشد']
    },

    viewCount: {
      type: Number,
      default: 0,
      min: [0, 'تعداد بازدید نمی‌تواند منفی باشد']
    },

    // وضعیت محصول
    status: {
      type: String,
      enum: ['active', 'inactive', 'outOfStock'],
      default: 'active'
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    isNewArrival: {
      type: Boolean,
      default: true
    },

    // SEO
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ایجاد slug خودکار از نام محصول
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
  next();
});

// محاسبه درصد تخفیف
productSchema.pre('save', function (next) {
  if (this.discountPrice && this.price) {
    this.discountPercent = Math.round(
      ((this.price - this.discountPrice) / this.price) * 100
    );
  }
  next();
});

// محاسبه موجودی کل
productSchema.pre('save', function (next) {
  if (this.sizes && this.sizes.length > 0) {
    this.totalStock = this.sizes.reduce((total, size) => total + size.stock, 0);
  }
  next();
});

// بروزرسانی وضعیت محصول بر اساس موجودی
productSchema.pre('save', function (next) {
  if (this.totalStock === 0) {
    this.status = 'outOfStock';
  } else if (this.status === 'outOfStock' && this.totalStock > 0) {
    this.status = 'active';
  }
  next();
});

// Virtual برای قیمت نهایی (با تخفیف)
productSchema.virtual('finalPrice').get(function () {
  return this.discountPrice || this.price;
});

// Virtual برای محاسبه میزان تخفیف (تومان)
productSchema.virtual('discountAmount').get(function () {
  return this.discountPrice ? this.price - this.discountPrice : 0;
});

// ایندکس‌ها برای جستجوی سریع‌تر
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ soldCount: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 });

module.exports = mongoose.model('Product', productSchema);