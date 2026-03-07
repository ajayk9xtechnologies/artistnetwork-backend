const { User, KycDocument } = require("../models");
const { apiResponse } = require("../utils");
const { KYC_STATUS } = require("../constants/userStatus");

const kycController = {
  async submitKyc(req, res, next) {
    try {
      const userId = req.userId;
      const { documents } = req.body;

      if (!documents || !Array.isArray(documents) || documents.length === 0) {
        return apiResponse.failure(res, "At least one document is required", 400);
      }

      const user = await User.findById(userId);
      if (!user) return apiResponse.failure(res, "User not found", 404);
      if (user.kycStatus === KYC_STATUS.APPROVED) {
        return apiResponse.failure(res, "KYC already approved", 400);
      }

      let kyc = await KycDocument.findOne({ user: userId });
      const docEntries = documents.map((d) => ({
        type: d.type,
        url: d.url,
        uploadedAt: new Date(),
      }));

      if (kyc) {
        kyc.documents = docEntries;
        kyc.rejectionHistory = [];
        kyc.reviewedBy = null;
        kyc.reviewedAt = null;
        await kyc.save();
      } else {
        kyc = await KycDocument.create({
          user: userId,
          documents: docEntries,
        });
      }

      await User.updateOne({ _id: userId }, { $set: { kycStatus: KYC_STATUS.PENDING } });

      return apiResponse.success(res, { kyc, kycStatus: KYC_STATUS.PENDING }, "KYC submitted for review", 200);
    } catch (error) {
      next(error);
    }
  },

  async getKycStatus(req, res, next) {
    try {
      const userId = req.userId;
      const user = await User.findById(userId).select("kycStatus");
      if (!user) return apiResponse.failure(res, "User not found", 404);

      const kyc = await KycDocument.findOne({ user: userId });
      return apiResponse.success(
        res,
        { kycStatus: user.kycStatus, kyc: kyc || null },
        "KYC status fetched",
        200
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = kycController;
