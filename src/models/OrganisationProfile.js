const mongoose = require('mongoose');

const OrganisationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String, required: true },
})

module.exports = mongoose.model("organisation", OrganisationSchema);
