const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const couponRoutes = require('./routes/couponRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '✅ به API زی‌پوش خوش آمدید!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      users: '/api/users',
      cart: '/api/cart',
      reviews: '/api/reviews',
      coupons: '/api/coupons'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Import error handlers
const { notFound, errorHandler } = require('./middleware/errorHandler');

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n');
  console.log('═══════════════════════════════════════════════════');
  console.log('🚀 سرور زی‌پوش با موفقیت راه‌اندازی شد!');
  console.log('═══════════════════════════════════════════════════');
  console.log(`📍 آدرس: http://localhost:${PORT}`);
  console.log(`🌍 محیط: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 دیتابیس: MongoDB ${process.env.MONGO_URI ? '✅ متصل' : '❌ غیرمتصل'}`);
  console.log('═══════════════════════════════════════════════════');
  console.log('\n📡 API Endpoints:');
  console.log(`   - Auth:       http://localhost:${PORT}/api/auth`);
  console.log(`   - Products:   http://localhost:${PORT}/api/products`);
  console.log(`   - Categories: http://localhost:${PORT}/api/categories`);
  console.log(`   - Orders:     http://localhost:${PORT}/api/orders`);
  console.log(`   - Users:      http://localhost:${PORT}/api/users`);
  console.log(`   - Cart:       http://localhost:${PORT}/api/cart`);
  console.log(`   - Reviews:    http://localhost:${PORT}/api/reviews`);
  console.log(`   - Coupons:    http://localhost:${PORT}/api/coupons`);
  console.log('\n💡 برای متوقف کردن سرور: Ctrl + C');
  console.log('═══════════════════════════════════════════════════\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('\n❌ خطای Unhandled Promise Rejection:');
  console.error(err);
  console.log('\n🔄 سرور در حال بسته شدن...\n');
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('\n❌ خطای Uncaught Exception:');
  console.error(err);
  console.log('\n🔄 سرور در حال بسته شدن...\n');
  process.exit(1);
});