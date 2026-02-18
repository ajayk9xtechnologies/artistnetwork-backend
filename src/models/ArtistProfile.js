const mongoose = require("mongoose");

firstname, lastname, displayName, bio, profilepic,dateofbirth, gender, country, city, travelPreference,cateory, skills , photos, videos ,availableDates, preferredWorkingHours, socialLinks

const artistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    firstName:    { type: String, required: true, trim: true },
    lastName:     { type: String, required: true, trim: true },
    displayName:  { type: String, trim: true },
    bio:          { type: String, maxlength: 1000 },
    profilePhoto: { type: String },
    dateOfBirth:  { type: Date },
    gender: {
      type: String,
      enum: ["male", "female", "prefer_not_to_say"],
    },
    country: { type: String },
    city:    { type: String },
    travelPreference: {
      type: String,
      enum: ["local_only", "national", "international"],
      default: "local_only",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill", 
      }
    ],
    experienceYears: { type: Number, min: 0, default: 0 },

    expectedRateMin: { type: Number, min: 0 },
    expectedRateMax: { type: Number, min: 0 },
    currency:        { type: String, default: "USD" },
    photos: {
      type: [String],
      validate: {
        validator: (v) => v.length <= 9,
        message: "Maximum 9 photos allowed",
      },
    },
    videos: {
      type: [String],
      validate: {
        validator: (v) => v.length <= 9,
        message: "Maximum 9 videos allowed",
      },
    },
    availableDates: [{ type: Date }],
    preferredWorkingHours: {
      type: String,
      enum: ["morning", "evening", "night", "flexible"],
      default: "flexible",
    },
    socialLinks: {
      instagram: { type: String },
      tiktok:    { type: String },
      youtube:   { type: String },
      spotify:   { type: String },
      website:   { type: String },
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Artist", artistSchema);