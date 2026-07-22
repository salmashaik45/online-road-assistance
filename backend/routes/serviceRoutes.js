const express = require('express');
const router = express.Router();

// ====================================
// Import Service Controller Functions
// ====================================
const {
  createServiceRequest,
  getUserRequests,
  getRequestById,
  acceptRequest,
  startService,
  completeService,
  cancelRequest,
  getPendingRequests
} = require('../controllers/serviceController');

// ====================================
// Import Authentication Middleware
// ====================================
const { protect } = require('../middleware/authMiddleware');


// ======================================================
// Service Request Routes (User)
// ======================================================

// Create a new roadside assistance request
router.post('/request', protect, createServiceRequest);

// Get all service requests of the logged-in user
router.get('/my-requests', protect, getUserRequests);


// ======================================================
// Service Request Routes (Provider)
// ======================================================

// Get all pending requests available for providers
router.get('/pending', protect, getPendingRequests);

// Accept a service request
router.put('/:id/accept', protect, acceptRequest);

// Start the service after OTP verification
router.put('/:id/start', protect, startService);

// Mark the service as completed
router.put('/:id/complete', protect, completeService);

// Cancel a service request
router.put('/:id/cancel', protect, cancelRequest);


// ======================================================
// Common Route
// ======================================================

// Get details of a specific service request
router.get('/:id', protect, getRequestById);


// Export Router
module.exports = router;