const express = require('express');
const router = express.Router();

// ====================================
// Import Review Controller Functions
// ====================================
const {
  createReview,
  getProviderReviews,
  getMyReviews,
  replyToReview,
  markHelpful,
  deleteReview
} = require('../controllers/reviewController');

// ====================================
// Import Authentication Middleware
// ====================================
const { protect } = require('../middleware/authMiddleware');


// ======================================================
// Review Routes
// ======================================================

// Submit a new review
router.post('/', protect, createReview);

// Get all reviews submitted by the logged-in user
router.get('/my-reviews', protect, getMyReviews);

// Get all reviews for a specific provider
router.get('/provider/:id', getProviderReviews);

// Provider replies to a review
router.put('/:id/reply', protect, replyToReview);

// Mark a review as helpful
router.put('/:id/helpful', protect, markHelpful);

// Delete (soft delete) a review
router.delete('/:id', protect, deleteReview);


// Export Router
module.exports = router;