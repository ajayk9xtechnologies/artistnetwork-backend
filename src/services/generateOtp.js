const generateOtpService = (length = 6) => {
    // 4 digit otp
    return Math.floor(1000 + Math.random() * 9000).toString();
};
module.exports = generateOtpService;