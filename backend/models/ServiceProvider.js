// Import mongoose for creating schema and model
const mongoose = require('mongoose');

// Import bcrypt for hashing passwords before saving
const bcrypt = require('bcrypt');

// Create Service Provider Schema
const ServiceProviderSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    // Password will be hashed before storing in database
    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true,
        unique: true
    },

    // Service provider category
    serviceType: {
        type: String,
        enum: ['towing', 'fuel', 'tire', 'mechanic', 'battery'],
        required: true
    },

    profileImage: {
        type: String,
        default: null
    },

    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: null
    },

    dateOfBirth: {
        type: Date,
        default: null
    },

    // Years of experience
    experience: {
        type: Number,
        default: 0
    },

    bio: {
        type: String,
        default: null
    },

    // Provider Address
    // (Changed from "Address" to "address")
    address: {
        street: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        },
        state: {
            type: String,
            default: null
        },
        pincode: {
            type: String,
            default: null
        }
    },

    // Vehicle details used by provider
    vehicleInfo: {
        vehicleNumber: {
            type: String,
            default: null
        },
        vehicleType: {
            type: String,
            default: null
        },
        vehicleModel: {
            type: String,
            default: null
        }
    },

    // Verification documents
    documents: {
        license: {
            type: String,
            default: null
        },
        certificate: {
            type: String,
            default: null
        },
        idProof: {
            type: String,
            default: null
        }
    },

    // Availability Status
    isAvailable: {
        type: Boolean,
        default: true
    },

    // Working Hours
    workingHours: {
        from: {
            type: String,
            default: '08:00'
        },
        to: {
            type: String,
            default: '20:00'
        }
    },

    // Account Status
    isVerified: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isBanned: {
        type: Boolean,
        default: false
    },

    // Rating Information
    rating: {
        type: Number,
        default: 0
    },

    totalReviews: {
        type: Number,
        default: 0
    },

    completedJobs: {
        type: Number,
        default: 0
    },

    cancelledJobs: {
        type: Number,
        default: 0
    },

    totalEarnings: {
        type: Number,
        default: 0
    },

    // Service Charges
    charges: {
        baseCharge: {
            type: Number,
            default: 0
        },

        perKmCharge: {
            type: Number,
            default: 0
        }
    },

    // OTP for verification/login
    otp: {
        type: String,
        default: null
    },

    otpExpiry: {
        type: Date,
        default: null
    },

    // Password reset
    resetToken: {
        type: String,
        default: null
    },

    resetTokenExpiry: {
        type: Date,
        default: null
    },

    // Last Login Time
    lastLogin: {
        type: Date,
        default: null
    }

},
{
    // Automatically creates createdAt and updatedAt
    timestamps: true
});


// ---------------------------------------------------
// Middleware: Hash password before saving
// ---------------------------------------------------
// Runs automatically whenever a provider is saved.
// Password is hashed only if it was modified.
ServiceProviderSchema.pre('save', async function () {

    if (!this.isModified('password')) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});


// ---------------------------------------------------
// Instance Method
// Compare entered password with hashed password
// ---------------------------------------------------
ServiceProviderSchema.methods.matchPassword = async function (enteredPassword) {

    return await bcrypt.compare(enteredPassword, this.password);

};


// ---------------------------------------------------
// Export the Mongoose Model
// ---------------------------------------------------
// This is VERY IMPORTANT.
// Without module.exports, other files cannot use:
// ServiceProvider.findOne()
// ServiceProvider.create()
// ServiceProvider.findById()
// etc.
module.exports = mongoose.model('ServiceProvider', ServiceProviderSchema);