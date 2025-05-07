const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        user: {
            type: Number,
            default: 2001 // Default role for user
        },
        admin: Number
    },
    refreshToken: String // Store refreshToken for the user
});

module.exports = mongoose.model('User', userSchema);
