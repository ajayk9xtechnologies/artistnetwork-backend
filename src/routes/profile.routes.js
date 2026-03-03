const express = require("express");
const { profileController } = require("../controllers");
const { validateRequest } = require("../middleware");
const { artistProfileValidation } = require("../validations");
const router = express.Router();
  
//if{} pathname , thn middleware if middleware failed then controller will not call, if middleware passed then controller will call,
router.get('/',profileController.getProfile);   
router.post('/update-artist-profile',validateRequest(artistProfileValidation),profileController.updateArtistProfile);

module.exports = router;