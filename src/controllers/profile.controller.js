const { ArtistProfile } = require("../models");
const { apiResponse } = require("../utils");

const profileController = {
    // async getProfile(req, res, next) {
    //     try {
    //         const profile = await ArtistProfile.findOne({ user: req.user.id }).populate("gallery");
    //         return apiResponse.success(res, profile, "Profile fetched successfully");
    //     } catch (error) {
    //         next(error);
    //     }
    // },

    async upsertArtistProfile(req, res, next) {
        try {
            const data = req.body.artistProfileData;
            const userId = req.userId;
            if (!data || typeof data !== "object") {
                return apiResponse.failure(res, "Invalid profile data", 400);
            }
            const existing = await ArtistProfile.findOne({ user: userId });

            if (existing) {
                const updated = await ArtistProfile.findOneAndUpdate(
                    { user: userId },
                    { $set: data },
                    { new: true }
                );
                return apiResponse.success(res, updated, "Artist profile updated successfully");
            }

            const newArtistProfile = new ArtistProfile({ user: userId, ...data });
            await newArtistProfile.save();
            return apiResponse.success(res, newArtistProfile, "Artist profile created successfully");
        } catch (error) {
            next(error);
        }
    },
};

module.exports = profileController;