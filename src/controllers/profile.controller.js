const { ArtistProfile,ArtistGallery } = require("../models");
const { apiResponse, verifyToken } = require("../utils");
const { uploadToS3, deleteFromS3 } = require("../services");

const profileController = {
    async getProfile(req, res, next) {
        try {
            const profile = await ArtistProfile.findOne({ user: req.user.id }).populate("gallery");
            return apiResponse.success(res, profile, "Profile fetched successfully");
        } catch (error) {
            next(error);
        }
    },

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
    async addToGallery(req, res, next) {
        try {
            const token = verifyToken(req.cookies.token);
            if (!token) {
                return apiResponse.failure(res, "Unauthorized", 401);
            }
            const userId = token.userId;
            const files = req.files; // array of files from multer

            if (!files || files.length === 0) {
                return apiResponse.failure(res, "No files uploaded", 400);
            }

            if (files.length > 20) {
                return apiResponse.failure(res, "Max 20 files per upload", 400);
            }

            // Upload all to S3 in parallel
            const uploaded = await Promise.all(files.map(uploadToS3));

            let gallery = await ArtistGallery.findOne({ user: userId });
            if (!gallery) {
                gallery = new ArtistGallery({ user: userId, media: [] });
            }

            gallery.media.push(...uploaded);
            await gallery.save();

            return apiResponse.success(res, gallery, "Media uploaded successfully");
        } catch (error) {
            next(error);
        }
    },
    async getGallery(req, res, next) {
        try {

            const token = verifyToken(req.cookies.token);
            if (!token) {
                return apiResponse.failure(res, "Unauthorized", 401);
            }
            const userId = token.userId;
            const gallery = await ArtistGallery.findOne({ user: userId }).populate("media");
            return apiResponse.success(res, gallery, "Gallery fetched successfully");
        } catch (error) {
            next(error);
        }
    },
    async deleteFromGallery(req, res, next) {
        try {
            const token = verifyToken(req.cookies.token);
            if (!token) {
                return apiResponse.failure(res, "Unauthorized", 401);
            }
            const userId = token.userId;
            const { mediaIds } = req.body; // array of _ids

            // mediaIds = ["id1", "id2", "id3"]
            if (!mediaIds || !Array.isArray(mediaIds) || mediaIds.length === 0) {
                return apiResponse.failure(res, "mediaIds array is required", 400);
            }

            const gallery = await ArtistGallery.findOne({ user: userId }); // ✅ findOne not findManyAndDelete
            if (!gallery) {
                return apiResponse.failure(res, "Gallery not found", 404);
            }

            // Find media items to delete
            const toDelete = gallery.media.filter(m => mediaIds.includes(m._id.toString()));
            if (toDelete.length === 0) {
                return apiResponse.failure(res, "No matching media found", 404);
            }

            // Delete all from S3 in parallel
            await Promise.all(toDelete.map(m => deleteFromS3(m.key)));

            // Remove from gallery
            gallery.media = gallery.media.filter(m => !mediaIds.includes(m._id.toString()));
            await gallery.save();

            return apiResponse.success(res, gallery, "Media deleted successfully");
        } catch (error) {
            next(error);
        }
    }

};

module.exports = profileController;