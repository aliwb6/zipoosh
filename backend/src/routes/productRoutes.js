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
  admin,
  uploadProductImages,
  validateCreateProduct,
  createProduct
);

router.put(
  '/:id',
  protect,
  admin,
  uploadProductImages,
  validateUpdateProduct,
  updateProduct
);

router.delete(
  '/:id',
  protect,
  admin,
  validateMongoId('id'),
  deleteProduct
);

router.put(
  '/:id/stock',
  protect,
  admin,
  validateMongoId('id'),
  updateStock
);

module.exports = router;
