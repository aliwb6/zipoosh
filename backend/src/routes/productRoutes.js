const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  updateStock
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');
const { uploadProductImages } = require('../middleware/upload');
const {
  validateCreateProduct,
  validateUpdateProduct,
  validateMongoId,
  validatePagination
} = require('../middleware/validation');

// 🔍 اضافه کن این خطوط برای دیباگ:
console.log('=== Debugging Middleware ===');
console.log('protect:', typeof protect);
console.log('authorize:', typeof authorize);
console.log('uploadProductImages:', typeof uploadProductImages);
console.log('validateCreateProduct:', typeof validateCreateProduct);
console.log('validateUpdateProduct:', typeof validateUpdateProduct);
console.log('validateMongoId:', typeof validateMongoId);
console.log('validatePagination:', typeof validatePagination);
console.log('=== Controllers ===');
console.log('createProduct:', typeof createProduct);
console.log('updateProduct:', typeof updateProduct);
console.log('deleteProduct:', typeof deleteProduct);
console.log('updateStock:', typeof updateStock);
console.log('===========================');




const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  updateStock
} = require('../controllers/productController');

const { protect } = require('../middleware/auth');
const { uploadProductImages } = require('../middleware/upload');
const {
  validateCreateProduct,
  validateUpdateProduct,
  validateMongoId,
  validatePagination
} = require('../middleware/validation');

// مسیرهای ویژه (قبل از مسیرهای کلی)
router.get('/featured/list', getFeaturedProducts);
router.get('/new-arrivals/list', getNewArrivals);
router.get('/best-sellers/list', getBestSellers);

// مسیرهای عمومی
router.get('/', validatePagination, getProducts);
router.get('/:identifier', getProduct);
router.get('/:id/related', validateMongoId('id'), getRelatedProducts);

// مسیرهای ادمین
router.post(
  '/',
  protect,
  authorize('admin'),
  uploadProductImages,
  validateCreateProduct,
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  uploadProductImages,
  validateUpdateProduct,
  updateProduct
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  validateMongoId('id'),
  deleteProduct
);

router.put(
  '/:id/stock',
  protect,
  authorize('admin'),
  validateMongoId('id'),
  updateStock
);

module.exports = router;
