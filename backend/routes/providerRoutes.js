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

// Public Routes
router.get('/', getAllProviders);

// Dashboard
router.get('/dashboard', protect, getProviderDashboard);

// Profile
router.put('/profile', protect, updateProviderProfile);

// Availability
router.put('/availability', protect, toggleAvailability);

// Requests
router.get('/my-requests', protect, getProviderRequests);

// Notifications
router.get('/notifications', protect, getProviderNotifications);
router.put('/notifications/read', protect, markProviderNotificationsRead);

// Keep this LAST
router.get('/:id', getProviderById);

// Export Router
module.exports = router;