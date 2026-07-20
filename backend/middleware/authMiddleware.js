const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');

// Middleware to protect routes using JWT authentication
const protect = async (req, res, next) => {
    let token;

    // Check if Authorization header exists and starts with "Bearer"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract token from the Authorization header
            token = req.headers.authorization.split(' ')[1];

            // Verify the JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by decoded ID and exclude the password
            req.user = await User.findById(decoded.id).select('-password');

            // If not found in User collection, check ServiceProvider collection
            if (!req.user) {
                req.user = await ServiceProvider
                    .findById(decoded.id)
                    .select('-password');
            }

            // Continue to the next middleware/controller
            next();

        } catch (error) {
            return res.status(401).json({
                message: 'Not authorized, token failed'
            });
        }
    } else {
        return res.status(401).json({
            message: 'Not authorized, no token'
        });
    }
};

module.exports = { protect };