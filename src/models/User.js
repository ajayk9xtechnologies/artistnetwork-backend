const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
    },
    phone: { type: String, unique: true, sparse: true, match: /^\+?[1-9]\d{1,14}$/ },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["artist", "organisation", "admin"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "deactivated"],
      default: "pending",
    },
    kycStatus: {
      type: String,
      enum: ["not_submitted", "pending", "approved", "rejected"],
      default: "not_submitted",
    },
    emailVerifiedAt: { type: Date, default: null },
    phoneVerifiedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);

// understnd use status 

// pending: just registered / not fully verified yet (default).
// active: normal user, can use the platform.
// suspended: temporarily blocked (maybe for review, payment issues, abuse).
// deactivated: permanently closed account (by user or admin).
// terminated (optional): if you want a stronger word for “removed for violation”, you can:
// either reuse deactivated for that, and store the reason elsewhere (e.g. suspensionReason, deactivationReason),
// or add "terminated" to the same enum if you really want a separate state.