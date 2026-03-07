const mongoose = require("mongoose");

const mediaItemSchema = new mongoose.Schema({
    url: { type: String, required: true },
    thumbnail: { type: String },        // for videos only
    type: { type: String, enum: ["photo", "video"], required: true },
    isPublic: { type: Boolean, default: true },
}, { timestamps: true });

const artistGallerySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    media: [mediaItemSchema],
}, { timestamps: true });

module.exports = mongoose.model("ArtistGallery", artistGallerySchema);