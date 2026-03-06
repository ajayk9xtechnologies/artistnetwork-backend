const mongoose = require("mongoose");

const artistGallerySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    media: [
        {
            url: { type: String, required: true },
            type: { type: String, enum: ["photo", "video"], required: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("ArtistGallery", artistGallerySchema);