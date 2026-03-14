const express = require("express");
const { authController } = require("../controllers");
const { validateRequest, requireAuth } = require("../middleware");
const { authValidations } = require("../validations");
const passport = require("passport");
const router = express.Router();

// normal code 
router.get('/register', async (req, res) => {
    try {
        res.status(200).json({ message: "Hello World" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// using controller
router.get('/fetch-user', requireAuth, authController.fetchUser);
//if{} pathname , thn middleware if middleware failed then controller will not call, if middleware passed then controller will call,
router.post('/register', validateRequest(authValidations.registerSchema), authController.register);
router.post('/generate-otp', validateRequest(authValidations.generateOtpSchema), authController.generateOtp);
router.post('/verify-otp', validateRequest(authValidations.verifyOtpSchema), authController.verifyOtp);
router.post('/login', validateRequest(authValidations.loginSchema), authController.loginEmailOrPhone);
router.post('/login-with-otp', validateRequest(authValidations.loginWithOtpSchema), authController.loginWithOtp);
router.post('/reset-password', validateRequest(authValidations.resetPasswordSchema), authController.resetPassword);
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
        prompt: "select_account" 
    }),
);
router.get("/google/callback",
    (req, res, next) => {
        passport.authenticate("google", { session: false }, (err, user, info) => {
            if (err) return next(err);
            req.user = user || null;
            req.authInfo = info || {};
            next();
        })(req, res, next);
    },
    authController.googleCallback,
);

router.post("/google/complete", authController.googleComplete);
module.exports = router;