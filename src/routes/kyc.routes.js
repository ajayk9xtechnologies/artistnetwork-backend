const express = require("express");
const { kycController } = require("../controllers");
const { requireAuth, validateRequest } = require("../middleware");
const { submitKycSchema } = require("../validations/kyc.validation");

const router = express.Router();

router.get("/status", requireAuth, kycController.getKycStatus);
router.post("/submit", requireAuth, validateRequest(submitKycSchema), kycController.submitKyc);

module.exports = router;
