const mongoose = require("mongoose");
const { ACCOUNT_STATUS, KYC_STATUS } = require("../constants/userStatus");

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
    password: { type: String, required: function() { return !this.googleId; }, },
    role: {
      type: String,
      enum: ["artist", "organisation", "admin"],
      required: true,
    }, 
    googleId: {
      type: String,
      unique: true,
      sparse: true,   // allows others users without googleId
    },
    status: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: ACCOUNT_STATUS.PENDING,
    },
    lastSeenAt: { type: Date, default: null }, // for "online" status: consider online if within ~5 min
    kycStatus: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: KYC_STATUS.NOT_SUBMITTED,
    },
    emailVerifiedAt: { type: Date, default: null },
    phoneVerifiedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);