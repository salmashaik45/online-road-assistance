// ========================================
// Import Required Packages
// ========================================
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env
dotenv.config();

// ========================================
// Import Middleware
// ========================================
const { errorHandler } = require('./middleware/errorMiddleware');

// ========================================
// Import Route Files
// ========================================
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const providerRoutes = require('./routes/providerRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// ========================================
// Create Express App
// ========================================
const app = express();

// ========================================
// Global Middleware
// ========================================

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// ========================================
// Test Route
// ========================================

// Used to check whether the backend is running
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Online Road Assistance API is running!'
    });
});

// ========================================
// Register API Routes
// ========================================

// Authentication Routes
app.use('/api/auth', authRoutes);

// User Routes
app.use('/api/users', userRoutes);

// Provider Routes
// Corrected: provider -> providers
app.use('/api/providers', providerRoutes);

// Service Request Routes
app.use('/api/services', serviceRoutes);

// Review Routes
// Corrected: review -> reviews
app.use('/api/reviews', reviewRoutes);

// ========================================
// Global Error Handler
// ========================================

// Handles all errors thrown in controllers
app.use(errorHandler);

// ========================================
// Connect to MongoDB
// ========================================
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });