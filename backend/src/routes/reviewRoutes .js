const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  voteHelpful,
  voteUnhelpful,
  addResponse,
  updateReviewStatus,
  getAllReviews
} = require('../controllers/reviewController');

const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { uploadMultiple } = require('../middleware/upload');
const { processImage } = require('../middleware/upload');
const {
  validateCreateReview,
  validateMongoId,
  validatePagination
} = require('../middleware/validation');

// مسیرهای عمومی
router.get('/product/:productId', validateMongoId('productId'), getProductReviews);

// مسیرهای کاربر (نیاز به احراز هویت)
router.use(protect);

router.post(
  '/',
  uploadMultiple('images', 5),
  processImage,
  validateCreateReview,
  createReview
);

router.put(
  '/:id',
  uploadMultiple('images', 5),
  processImage,
  validateMongoId('id'),
  updateReview
);

router.delete('/:id', validateMongoId('id'), deleteReview);

router.post('/:id/helpful', validateMongoId('id'), voteHelpful);
router.post('/:id/unhelpful', validateMongoId('id'), voteUnhelpful);

// مسیرهای ادمین
router.use(admin);

router.get('/', validatePagination, getAllReviews);
router.post('/:id/response', validateMongoId('id'), addResponse);
router.put('/:id/status', validateMongoId('id'), updateReviewStatus);

module.exports = router;