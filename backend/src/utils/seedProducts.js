import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';

dotenv.config();

// محصولات نمونه
const products = [
  {
    name: 'تیشرت مشکی ساده',
    description: 'تیشرت مشکی ساده با پارچه نخ پنبه درجه یک مناسب برای استفاده روزمره',
    price: 250000,
    oldPrice: 350000,
    category: 'men',
    subcategory: 'tshirt',
    image: '👕',
    images: ['👕', '👕', '👕'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['مشکی', 'سفید', 'خاکستری'],
    inStock: true,
    badge: 'تخفیف',
    rating: 4.5,
    reviews: 23
  },
  {
    name: 'شلوار جین آبی',
    description: 'شلوار جین آبی با پارچه مرغوب',
    price: 520000,
    oldPrice: null,
    category: 'men',
    subcategory: 'pants',
    image: '👖',
    images: ['👖', '👖', '👖'],
    sizes: ['30', '32', '34'],
    colors: ['آبی'],
    inStock: true,
    badge: null,
    rating: 5,
    reviews: 42
  },
  {
    name: 'کت و شلوار مشکی',
    description: 'کت و شلوار مشکی مجلسی',
    price: 1850000,
    oldPrice: 2200000,
    category: 'men',
    subcategory: 'suit',
    image: '🤵',
    images: ['🤵', '🤵', '🤵'],
    sizes: ['M', 'L', 'XL'],
    colors: ['مشکی', 'سرمه‌ای'],
    inStock: true,
    badge: 'تخفیف',
    rating: 4.8,
    reviews: 37
  },
  {
    name: 'مانتو بلند مشکی',
    description: 'مانتو بلند مشکی با پارچه درجه یک',
    price: 680000,
    oldPrice: null,
    category: 'women',
    subcategory: 'manteau',
    image: '🧥',
    images: ['🧥', '🧥', '🧥'],
    sizes: ['S', 'M', 'L'],
    colors: ['مشکی', 'سرمه‌ای'],
    inStock: true,
    badge: 'جدید',
    rating: 4.6,
    reviews: 33
  },
  {
    name: 'شلوار جین زنانه',
    description: 'شلوار جین زنانه با برش عالی',
    price: 480000,
    oldPrice: null,
    category: 'women',
    subcategory: 'pants',
    image: '👖',
    images: ['👖', '👖', '👖'],
    sizes: ['26', '28', '30', '32'],
    colors: ['آبی'],
    inStock: true,
    badge: 'پرفروش',
    rating: 4.8,
    reviews: 45
  }
];

// تابع Seed
const seedProducts = async () => {
  try {
    await connectDB();

    // پاک کردن محصولات قبلی
    await Product.deleteMany();
    console.log('🗑️  محصولات قبلی پاک شدند');

    // اضافه کردن محصولات جدید
    await Product.insertMany(products);
    console.log('✅ محصولات با موفقیت اضافه شدند');

    process.exit();
  } catch (error) {
    console.error(`❌ خطا: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();