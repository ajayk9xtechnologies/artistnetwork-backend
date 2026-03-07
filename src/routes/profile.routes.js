const express = require("express");
const { artistProfileValidation, updateArtistProfileValidation } = require("../validations/profile.validation");
const { profileController } = require("../controllers");
const router = express.Router();
const { validateRequest, requireAuth,uploadMiddleware } = require("../middleware");

router.get('/fetch-user', requireAuth, profileController.getProfile);

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
router.post('/create-gallery',requireAuth,uploadMiddleware,profileController.addToGallery);
router.get('/fetch-gallery',requireAuth,profileController.getGallery);
router.delete('/delete-gallery-item',requireAuth,profileController.deleteFromGallery);

// router.put('/update-gallery',requireAuth,validateRequest(galleryValidation.galleryData),profileController.updateGallery);
module.exports = router;