const express = require('express');
const router = express.Router();

// ===============================
// Import User Controller Functions
// ===============================
const {
  getUserProfile,
  updateUserProfile,
  addVehicle,
  getUserVehicles,
  updateVehicle,
  deleteVehicle,
  getUserDashboard,
  getNotifications,
  markNotificationsRead,
  deleteAccount
} = require('../controllers/userController');

// ===============================
// Import Authentication Middleware
// ===============================
const { protect } = require('../middleware/authMiddleware');


// ======================================================
// Dashboard Routes
// ======================================================

// Get dashboard statistics
router.get('/dashboard', protect, getUserDashboard);


// ======================================================
// Profile Routes
// ======================================================

// Get logged-in user's profile
router.get('/profile', protect, getUserProfile);

// Update logged-in user's profile
router.put('/profile', protect, updateUserProfile);

// Deactivate/Delete account
router.delete('/account', protect, deleteAccount);


// ======================================================
// Vehicle Routes
// ======================================================

// Add a new vehicle
router.post('/vehicles', protect, addVehicle);

// Get all vehicles of logged-in user
router.get('/vehicles', protect, getUserVehicles);

// Update vehicle details
router.put('/vehicles/:id', protect, updateVehicle);

// Soft delete a vehicle
router.delete('/vehicles/:id', protect, deleteVehicle);


// ======================================================
// Notification Routes
// ======================================================

// Get all notifications
router.get('/notifications', protect, getNotifications);

// Mark all notifications as read
router.put('/notifications/read', protect, markNotificationsRead);


// Export Router
module.exports = router;