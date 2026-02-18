const mongoose = require("mongoose");
const kycSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    documents: [
      {
        type: {
          type: String,
          enum: ["national_id", "passport", "trade_license", "other"],
        },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    status: {
      type: String,
      enum: ["not_submitted", "pending", "approved", "rejected"],
      default: "not_submitted",
    },

    rejectionHistory: [
      {
        reason: { type: String },
        rejectedAt: { type: Date, default: Date.now },
        rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose .model("Kyc", kycSchema)