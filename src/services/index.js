// Export shared services here, e.g.
// module.exports.otpService = require("./otp.service");
const { uploadToS3, deleteFromS3 } = require("./uploadToS3");

module.exports = {
    generateOtpService: require("./generateOtp"),
    uploadToS3,
    deleteFromS3,
};