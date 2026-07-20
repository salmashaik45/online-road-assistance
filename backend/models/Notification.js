const mongoose = require('mongoose');

// Notification Schema
const notificationSchema = new mongoose.Schema(
{
    // ID of the user/provider/admin who receives the notification
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    // Specifies who the receiver is
    receiverType: {
        type: String,
        enum: ['user', 'provider', 'admin'],
        required: true
    },

    // Short heading of the notification
    title: {
        type: String,
        required: true
    },

    // Detailed notification message
    message: {
        type: String,
        required: true
    },

    // Type of notification
    type: {
        type: String,
        enum: [
            'request_created',
            'request_accepted',
            'request_ongoing',
            'request_completed',
            'request_cancelled',
            'payment_received',
            'review_received',
            'account_verified',
            'general'
        ],
        default: 'general'
    },

    // Stores the related document ID
    // Example: Service Request ID, Payment ID, Review ID
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },

    // Specifies which collection referenceId belongs to
    referenceType: {
        type: String,
        enum: ['ServiceRequest', 'Payment', 'Review', null],
        default: null
    },

    // Whether the notification has been read
    isRead: {
        type: Boolean,
        default: false
    },

    // Time when the notification was read
    readAt: {
        type: Date,
        default: null
    }

},
{
    // Automatically adds createdAt and updatedAt
    timestamps: true
}
);

// Export Notification model
module.exports = mongoose.model('Notification', notificationSchema);