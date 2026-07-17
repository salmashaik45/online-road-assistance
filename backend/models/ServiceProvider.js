const mongoose = require('mongoose');
const bcrypt = require(bcrypt);
const ServiceProviderSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    serviceType: {
        type: String,
        enum: ['towing','fuel', 'tire', 'mechanic', ]
    }

})