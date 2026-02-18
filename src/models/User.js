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
    passwordHash: { type: String, required: true, select: false },
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
    emailVerifiedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
