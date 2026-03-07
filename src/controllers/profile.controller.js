const { User, ArtistProfile, ArtistGallery, OrganisationProfile } = require("../models");
const { apiResponse, verifyToken } = require("../utils");
const { uploadToS3, deleteFromS3 } = require("../services");

// ✅ Helper to extract userId from token
function userIdFromToken(req) {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return { success: false, message: "Unauthorized please login again", status: 401 };
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            return { success: false, message: "Unauthorized please login again", status: 401 };
        }
        return { success: true, userId: decoded.userId, status: 200 };
    } catch (error) {
        return { success: false, message: "Unauthorized please login again", status: 401 };
    }
}

const profileController = {
    async getProfile(req, res, next) {
        try {
            const { success, userId, message, status } = userIdFromToken(req);
            if (!success) return apiResponse.failure(res, message, status);
            
            const user = await User.findById(userId).select("role");
            if (!user) return apiResponse.failure(res, "User not found", 404);

            if (user.role === "organisation") {
                const organisationProfile = await OrganisationProfile.findOne({ user: userId });
                return apiResponse.success(res, { profile: organisationProfile, role: "organisation" }, "Profile fetched successfully");
            }
            
            // ✅ Fixed: "galleries" not "gallery"
            const artistProfile = await ArtistProfile.findOne({ user: userId }).populate("galleries");
            return apiResponse.success(res, { profile: artistProfile, role: "artist" }, "Profile fetched successfully");
        } catch (error) {
            next(error);
        }
    },

    async upsertArtistProfile(req, res, next) {
        try {
            const { success, userId, message, status } = userIdFromToken(req);  // ✅ Fixed
            if (!success) return apiResponse.failure(res, message, status);
            
            const data = req.body.artistProfileData;
            if (!data || typeof data !== "object") {
                return apiResponse.failure(res, "Invalid profile data", 400);
            }
            
            const existing = await ArtistProfile.findOne({ user: userId });

            if (existing) {
                const updated = await ArtistProfile.findOneAndUpdate(
                    { user: userId },
                    { $set: data },
                    { new: true, runValidators: true }  // ✅ Added runValidators
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

    async upsertOrganisationProfile(req, res, next) {
        try {
            const { success, userId, message, status } = userIdFromToken(req);  // ✅ Fixed
            if (!success) return apiResponse.failure(res, message, status);
            
            const data = req.body.organisationProfileData;
            if (!data || typeof data !== "object") {
                return apiResponse.failure(res, "Invalid profile data", 400);
            }
            
            const existing = await OrganisationProfile.findOne({ user: userId });
            if (existing) {
                const updated = await OrganisationProfile.findOneAndUpdate(
                    { user: userId },
                    { $set: data },
                    { new: true, runValidators: true }  // ✅ Added runValidators
                );
                return apiResponse.success(res, updated, "Organisation profile updated successfully");
            }
            
            const newOrgProfile = new OrganisationProfile({ user: userId, ...data });
            await newOrgProfile.save();
            return apiResponse.success(res, newOrgProfile, "Organisation profile created successfully");
        } catch (error) {
            next(error);
        }
    },

    async addToGallery(req, res, next) {
        try {
            const { success, userId, message, status } = userIdFromToken(req);  // ✅ Fixed
            if (!success) return apiResponse.failure(res, message, status);
            
            const files = req.files;

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
            const { success, userId, message, status } = userIdFromToken(req);  // ✅ Fixed
            if (!success) return apiResponse.failure(res, message, status);
            
            const gallery = await ArtistGallery.findOne({ user: userId }).populate("media");
            if (!gallery) return apiResponse.failure(res, "Gallery not found", 404);  // ✅ Added check
            
            return apiResponse.success(res, gallery, "Gallery fetched successfully");
        } catch (error) {
            next(error);
        }
    },

    async deleteFromGallery(req, res, next) {
        try {
            const { success, userId, message, status } = userIdFromToken(req);  // ✅ Use helper
            if (!success) return apiResponse.failure(res, message, status);
            
            const { mediaIds } = req.body;

            if (!mediaIds || !Array.isArray(mediaIds) || mediaIds.length === 0) {
                return apiResponse.failure(res, "mediaIds array is required", 400);
            }

            const gallery = await ArtistGallery.findOne({ user: userId });
            if (!gallery) {
                return apiResponse.failure(res, "Gallery not found", 404);
            }

            // Find media items to delete
            const toDelete = gallery.media.filter(m => mediaIds.includes(m._id.toString()));
            if (toDelete.length === 0) {
                return apiResponse.failure(res, "No matching media found", 404);
            }

            // Delete from S3
            const withKey = toDelete.filter(m => m.key);
            await Promise.all(withKey.map(m => deleteFromS3(m.key)));

            // Remove from gallery
            gallery.media = gallery.media.filter(m => !mediaIds.includes(m._id.toString()));
            await gallery.save();

            return apiResponse.success(res, null, "Media deleted successfully", 200);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = profileController;