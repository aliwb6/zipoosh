const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    // اطلاعات اصلی
    name: {
      type: String,
      required: [true, 'لطفا نام دسته‌بندی را وارد کنید'],
      unique: true,
      trim: true,
      maxlength: [50, 'نام دسته‌بندی نباید بیشتر از 50 کاراکتر باشد']
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true
    },

    description: {
      type: String,
      maxlength: [500, 'توضیحات نباید بیشتر از 500 کاراکتر باشد']
    },

    // تصویر دسته‌بندی
    image: {
      url: {
        type: String,
        required: [true, 'لطفا تصویر دسته‌بندی را آپلود کنید']
      },
      publicId: {
        type: String,
        required: true
      }
    },

    // آیکون (برای منو و نمایش)
    icon: {
      type: String
    },

    // دسته‌بندی والد (برای ساخت سلسله مراتب)
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },

    // زیر دسته‌بندی‌ها
    subCategories: [
      {
        type: String,
        trim: true
      }
    ],

    // ترتیب نمایش
    order: {
      type: Number,
      default: 0
    },

    // وضعیت
    isActive: {
      type: Boolean,
      default: true
    },

    // نمایش در منوی اصلی
    showInMenu: {
      type: Boolean,
      default: true
    },

    // نمایش در صفحه اصلی
    showInHome: {
      type: Boolean,
      default: false
    },

    // تعداد محصولات (محاسبه می‌شود)
    productCount: {
      type: Number,
      default: 0,
      min: [0, 'تعداد محصولات نمی‌تواند منفی باشد']
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

// ایجاد slug خودکار از نام
categorySchema.pre('save', function (next) {
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

// Virtual برای دریافت محصولات این دسته‌بندی
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category'
});

// متد برای دریافت زیر دسته‌بندی‌ها
categorySchema.methods.getChildren = async function () {
  return await this.model('Category').find({ parent: this._id });
};

// متد برای دریافت مسیر کامل دسته‌بندی (breadcrumb)
categorySchema.methods.getBreadcrumb = async function () {
  const breadcrumb = [{ name: this.name, slug: this.slug }];
  let current = this;

  while (current.parent) {
    current = await this.model('Category').findById(current.parent);
    if (current) {
      breadcrumb.unshift({ name: current.name, slug: current.slug });
    }
  }

  return breadcrumb;
};

// ایندکس‌ها
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('Category', categorySchema);