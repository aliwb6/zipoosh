const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // اطلاعات اصلی
    name: {
      type: String,
      required: [true, 'لطفا نام خود را وارد کنید'],
      trim: true,
      maxlength: [50, 'نام نباید بیشتر از 50 کاراکتر باشد']
    },

    email: {
      type: String,
      required: [true, 'لطفا ایمیل خود را وارد کنید'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'لطفا یک ایمیل معتبر وارد کنید'
      ]
    },

    phone: {
      type: String,
      required: [true, 'لطفا شماره تلفن خود را وارد کنید'],
      unique: true,
      match: [
        /^09[0-9]{9}$/,
        'لطفا یک شماره تلفن معتبر وارد کنید (مثال: 09123456789)'
      ]
    },

    password: {
      type: String,
      required: [true, 'لطفا رمز عبور خود را وارد کنید'],
      minlength: [6, 'رمز عبور باید حداقل 6 کاراکتر باشد'],
      select: false // رمز عبور در query ها نمایش داده نمیشه
    },

    // نقش کاربر
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    // آواتار
    avatar: {
      type: String,
      default: 'https://res.cloudinary.com/zipoosh/image/upload/v1/defaults/avatar.png'
    },

    // آدرس‌ها
    addresses: [
      {
        title: {
          type: String,
          required: true,
          trim: true
        },
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
        },
        isDefault: {
          type: Boolean,
          default: false
        }
      }
    ],

    // لیست علاقه‌مندی‌ها
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],

    // وضعیت حساب
    isActive: {
      type: Boolean,
      default: true
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },

    isPhoneVerified: {
      type: Boolean,
      default: false
    },

    // توکن بازیابی رمز عبور
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // توکن تایید ایمیل
    emailVerificationToken: String,
    emailVerificationExpire: Date
  },
  {
    timestamps: true // createdAt و updatedAt خودکار اضافه میشه
  }
);

// Hash کردن رمز عبور قبل از ذخیره
userSchema.pre('save', async function (next) {
  // اگه رمز عبور تغییر نکرده، ادامه بده
  if (!this.isModified('password')) {
    next();
  }

  // Hash کردن رمز عبور
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// متد برای مقایسه رمز عبور
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// متد برای دریافت اطلاعات عمومی کاربر (بدون رمز عبور)
userSchema.methods.getPublicProfile = function () {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpire;
  delete user.emailVerificationToken;
  delete user.emailVerificationExpire;
  return user;
};

// ایندکس برای جستجوی سریع‌تر
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

module.exports = mongoose.model('User', userSchema);