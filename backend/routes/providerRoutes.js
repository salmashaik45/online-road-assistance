const express = require('express');
const router = express.Router();

// ====================================
// Import Provider Controller Functions
// ====================================
const {
  getAllProviders,
  getProviderById,
  getProviderDashboard,
  updateProviderProfile,
  toggleAvailability,
  getProviderRequests,
  getProviderNotifications,
  markProviderNotificationsRead
} = require('../controllers/providerController');

// ====================================
// Import Authentication Middleware
// ====================================
const { protect } = require('../middleware/authMiddleware');


// ======================================================
// Public Routes
// ======================================================

// Get all available service providers
router.get('/', getAllProviders);

// Get details of a specific provider
router.get('/:id', getProviderById);


// ======================================================
// Provider Dashboard Routes
// ======================================================

// Get provider dashboard statistics
router.get('/dashboard', protect, getProviderDashboard);


// ======================================================
// Provider Profile Routes
// ======================================================

// Update provider profile
router.put('/profile', protect, updateProviderProfile);

// Toggle provider availability (Available / Unavailable)
router.put('/availability', protect, toggleAvailability);


// ======================================================
// Service Request Routes
// ======================================================

// Get all service requests assigned to the logged-in provider
router.get('/my-requests', protect, getProviderRequests);


// ======================================================
// Notification Routes
// ======================================================

// Get provider notifications
router.get('/notifications', protect, getProviderNotifications);

// Mark all notifications as read
router.put('/notifications/read', protect, markProviderNotificationsRead);


// Export Router
module.exports = router;