const mongoose = require("mongoose");
const { TRAVEL_PREFERENCE, PREFERRED_WORKING_HOURS, CURRENCY } = require("../constants/userStatus");
const artistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    bio: { type: String, maxlength: 1000 },
    profilePhoto: { type: String },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ["male", "female", "prefer_not_to_say"],
    },
    languages: {
      type: [String],
      required: true,
    },
    country: { type: String },
    city: { type: String },
    travelPreference: {
      type: String,
      enum: Object.values(TRAVEL_PREFERENCE),
      default: TRAVEL_PREFERENCE.LOCAL_ONLY,
    },
    categories: {
      type: [String],
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    experienceYears: { type: Number, min: 0, default: 0 },
    expectedRateMin: { type: Number, min: 0 },
    expectedRateMax: { type: Number, min: 0 },
    currency: { type: String, enum: Object.values(CURRENCY), default: CURRENCY.USD },
    gallery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gallery",
    },
    availableDates: [{ type: Date }],
    preferredWorkingHours: {
      type: String,
      enum: Object.values(PREFERRED_WORKING_HOURS),
      default: PREFERRED_WORKING_HOURS.FLEXIBLE,
    },
    socialLinks: {
      instagram: { type: String },
      tiktok: { type: String },
      youtube: { type: String },
      spotify: { type: String },
      website: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Artist", artistSchema);