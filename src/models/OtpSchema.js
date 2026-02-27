const otpSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      code: {
        type: String,
        required: true,
      },
      purpose: {
        type: String,
        enum: ["login", "verify_email", "verify_phone", "reset_password"],
        required: true,
      },
      expiresAt: {
        type: Date,
        required: true,
      },
      verifiedAt: {
        type: Date,
        default: null,
      },
      isUsed: {
        type: Boolean,
        default: false,
      },
      attemptsCount: {
        type: Number,
        default: 0,
      },
    },
    { timestamps: true },
  );
  
  otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  
  module.exports = mongoose.model("Otp", otpSchema);