const mongoose = require('mongoose');

const OrganisationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
 
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    logo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    categories: [{
        type: String,
        trim: true
    }],  // min: 1 in validation
 
    website: { type: String, default: null },
    address: { type: String, default: null },
    socialLinks: {
        instagram: { type: String, default: null },
        facebook: { type: String, default: null },
        linkedin: { type: String, default: null },
        twitter: { type: String, default: null },
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArtistProfile"
    }],
    employeeCount: { type: Number, default: null },
    foundedYear: { type: Number, default: null },
    isVerified: { type: Boolean, default: false },
    verificationDate: { type: Date, default: null },
    subscriptionTier: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        default: "free"
    },

}, { timestamps: true });

module.exports = mongoose.model("OrganisationProfile", OrganisationSchema);
