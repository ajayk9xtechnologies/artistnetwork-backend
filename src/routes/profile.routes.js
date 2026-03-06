const express = require("express");
const { artistProfileValidation, updateArtistProfileValidation } = require("../validations/profile.validation");
const { profileController, authController } = require("../controllers");
const router = express.Router();
const { validateRequest, requireAuth } = require("../middleware");

router.get('/fetch-user', requireAuth, authController.fetchUser);

router.post(
    '/create-artist-profile',
    requireAuth,
    validateRequest(artistProfileValidation),
    profileController.upsertArtistProfile,
);
router.put(
    '/update-artist-profile',
    requireAuth,
    validateRequest(updateArtistProfileValidation),
    profileController.upsertArtistProfile,
);
// router.post('/create-gallery',requireAuth,validateRequest(galleryValidation.galleryData),profileController.createGallery);
// router.put('/update-gallery',requireAuth,validateRequest(galleryValidation.galleryData),profileController.updateGallery);
module.exports = router;