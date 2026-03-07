const express = require("express");

const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/profile", require("./profile.routes"));
router.use("/kyc", require("./kyc.routes"));
module.exports = router;