const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    // محصول
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'محصول الزامی است']
    },

    // کاربر
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'کاربر الزامی است']
    },

    // سفارش (برای اطمینان که کاربر واقعا محصول رو خریده)
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },

    // امتیاز
    rating: {
      type: Number,
      required: [true, 'امتیاز الزامی است'],
      min: [1, 'امتیاز باید حداقل 1 باشد'],
      max: [5, 'امتیاز باید حداکثر 5 باشد']
    },

    // عنوان نظر
    title: {
      type: String,
      required: [true, 'عنوان نظر الزامی است'],
      trim: true,
      maxlength: [100, 'عنوان نباید بیشتر از 100 کاراکتر باشد']
    },

    // متن نظر
    comment: {
      type: String,
      required: [true, 'متن نظر الزامی است'],
      trim: true,
      minlength: [10, 'نظر باید حداقل 10 کاراکتر باشد'],
      maxlength: [1000, 'نظر نباید بیشتر از 1000 کاراکتر باشد']
    },

    // نقاط مثبت
    pros: [
      {
        type: String,
        trim: true,
        maxlength: [200, 'هر نقطه مثبت نباید بیشتر از 200 کاراکتر باشد']
      }
    ],

    // نقاط منفی
    cons: [
      {
        type: String,
        trim: true,
        maxlength: [200, 'هر نقطه منفی نباید بیشتر از 200 کاراکتر باشد']
      }
    ],

    // تصاویر نظر
    images: [
      {
        url: String,
        publicId: String
      }
    ],

    // امتیازات جزئی
    qualityRating: {
      type: Number,
      min: [1, 'امتیاز کیفیت باید حداقل 1 باشد'],
      max: [5, 'امتیاز کیفیت باید حداکثر 5 باشد']
    },

    valueRating: {
      type: Number,
      min: [1, 'امتیاز ارزش خرید باید حداقل 1 باشد'],
      max: [5, 'امتیاز ارزش خرید باید حداکثر 5 باشد']
    },

    // توصیه به دیگران
    wouldRecommend: {
      type: Boolean,
      default: true
    },

    // خرید مجدد
    wouldBuyAgain: {
      type: Boolean,
      default: true
    },

    // وضعیت نظر
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },

    // تایید خرید
    isVerifiedPurchase: {
      type: Boolean,
      default: false
    },

    // پاسخ فروشنده
    response: {
      text: String,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      respondedAt: Date
    },

    // تعداد لایک/دیسلایک
    helpfulCount: {
      type: Number,
      default: 0,
      min: [0, 'تعداد لایک نمی‌تواند منفی باشد']
    },

    unhelpfulCount: {
      type: Number,
      default: 0,
      min: [0, 'تعداد دیسلایک نمی‌تواند منفی باشد']
    },

    // کاربرانی که مفید/غیرمفید رای دادن
    helpfulVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    unhelpfulVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    // گزارش تخلف
    reports: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        reason: String,
        reportedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// هر کاربر فقط یک بار برای هر محصول می‌تونه نظر بده
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// متد برای رای مفید
reviewSchema.methods.addHelpfulVote = async function (userId) {
  // بررسی که قبلا رای نداده
  if (!this.helpfulVotes.includes(userId)) {
    this.helpfulVotes.push(userId);
    this.helpfulCount += 1;
    
    // اگه قبلا غیرمفید رای داده، حذفش کن
    const unhelpfulIndex = this.unhelpfulVotes.indexOf(userId);
    if (unhelpfulIndex > -1) {
      this.unhelpfulVotes.splice(unhelpfulIndex, 1);
      this.unhelpfulCount = Math.max(0, this.unhelpfulCount - 1);
    }
    
    await this.save();
  }
  return this;
};

// متد برای رای غیرمفید
reviewSchema.methods.addUnhelpfulVote = async function (userId) {
  // بررسی که قبلا رای نداده
  if (!this.unhelpfulVotes.includes(userId)) {
    this.unhelpfulVotes.push(userId);
    this.unhelpfulCount += 1;
    
    // اگه قبلا مفید رای داده، حذفش کن
    const helpfulIndex = this.helpfulVotes.indexOf(userId);
    if (helpfulIndex > -1) {
      this.helpfulVotes.splice(helpfulIndex, 1);
      this.helpfulCount = Math.max(0, this.helpfulCount - 1);
    }
    
    await this.save();
  }
  return this;
};

// متد برای پاسخ فروشنده
reviewSchema.methods.addResponse = async function (text, userId) {
  this.response = {
    text,
    respondedBy: userId,
    respondedAt: new Date()
  };
  await this.save();
  return this;
};

// متد برای گزارش نظر
reviewSchema.methods.reportReview = async function (userId, reason) {
  // بررسی که قبلا گزارش نداده
  const alreadyReported = this.reports.some(
    (report) => report.user.toString() === userId.toString()
  );
  
  if (!alreadyReported) {
    this.reports.push({
      user: userId,
      reason,
      reportedAt: new Date()
    });
    await this.save();
  }
  return this;
};

// بروزرسانی امتیاز محصول بعد از تایید نظر
reviewSchema.post('save', async function () {
  if (this.status === 'approved') {
    const Product = mongoose.model('Product');
    const product = await Product.findById(this.product);
    
    if (product) {
      // محاسبه میانگین امتیاز
      const Review = mongoose.model('Review');
      const reviews = await Review.find({
        product: this.product,
        status: 'approved'
      });
      
      if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        product.rating = Math.round(avgRating * 10) / 10; // گرد کردن به یک رقم اعشار
        product.numReviews = reviews.length;
        await product.save();
      }
    }
  }
});

// Populate کاربر به صورت خودکار
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name avatar'
  });
  next();
});

// ایندکس‌ها
reviewSchema.index({ product: 1, status: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ helpfulCount: -1 });

module.exports = mongoose.model('Review', reviewSchema);