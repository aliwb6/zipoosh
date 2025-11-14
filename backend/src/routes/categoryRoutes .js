const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts
} = require('../controllers/categoryController');

const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { uploadCategoryImage } = require('../middleware/upload');
const {
  validateCreateCategory,
  validateMongoId
} = require('../middleware/validation');

// مسیرهای عمومی
router.get('/', getCategories);
router.get('/:identifier', getCategory);
router.get('/:id/products', validateMongoId('id'), getCategoryProducts);

// مسیرهای ادمین
router.post(
  '/',
  protect,
  admin,
  uploadCategoryImage,
  validateCreateCategory,
  createCategory
);

router.put(
  '/:id',
  protect,
  admin,
  uploadCategoryImage,
  validateMongoId('id'),
  updateCategory
);

router.delete(
  '/:id',
  protect,
  admin,
  validateMongoId('id'),
  deleteCategory
);

module.exports = router;