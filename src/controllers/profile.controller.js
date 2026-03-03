const { User, ArtistProfile, OrganisationProfile } = require("../models");
const { apiResponse } = require("../utils");

const profileController = {
  async getProfile(req, res, next) {
    try {
      const { userId } = req.user;
      const user = await User.findById(userId);
      if (!user) return apiResponse.failure(res, "User not found", 404);
      const artistProfile = await ArtistProfile.findOne({ user: user._id });
      if (!artistProfile) return apiResponse.failure(res, "Artist profile not found", 404);
      return apiResponse.success(res, {
        user,
        artistProfile,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateArtistProfile(req, res, next) {
    try {
      const { userId } = req.user;
      const { firstName, lastName, username, bio, profilePhoto, dateOfBirth, gender, country, city, travelPreference, category, skills, experienceYears, expectedRateMin, expectedRateMax, currency, photos, videos, availableDates, preferredWorkingHours, socialLinks } = req.body;
      const artistProfile = await ArtistProfile.findOneAndUpdate({ user: userId }, { firstName, lastName, username, bio, profilePhoto, dateOfBirth, gender, country, city, travelPreference, category, skills, experienceYears, expectedRateMin, expectedRateMax, currency, photos, videos, availableDates, preferredWorkingHours, socialLinks }, { new: true });
      if (!artistProfile) return apiResponse.failure(res, "Artist profile not found", 404);
      return apiResponse.success(res, artistProfile, "Artist profile updated successfully", 200);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = profileController;