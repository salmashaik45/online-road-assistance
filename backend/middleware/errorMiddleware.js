// Global Error Handling Middleware
const errorHandler = (err, req, res, next) => {

    // If no status code is set, default to 500 (Internal Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Send error response
    res.status(statusCode).json({

        // Error message
        message: err.message,

        // Show stack trace only in development mode
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

// Export the error handler middleware
module.exports = { errorHandler };