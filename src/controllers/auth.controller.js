const { User, ArtistProfile, OrganisationProfile } = require("../models");
const { apiResponse, setAuthCookie, verifyToken } = require("../utils");
const bcrypt = require("bcrypt");
const { generateOtpService } = require("../services");
const redisClient = require("../config/redis");
const { ACCOUNT_STATUS, KYC_STATUS } = require("../constants/userStatus");


const authController = {

  async generateOtp(req, res, next) {
    try {
      const { email = "", phone = "", purpose = "" } = req.body;
      const existingUser = await User.findOne({
        $or: [
          ...(email ? [{ email: email?.toLowerCase() }] : []),
          ...(phone ? [{ phone: phone?.trim() }] : []),
        ],
      });
      console.log("existingUser", existingUser);
      if (purpose === "login") {
        if (!existingUser) return apiResponse.failure(res, "User not found, please register first", 404);
      } else if (purpose === "register") {
        if (existingUser) return apiResponse.failure(res, `User with this ${email ? "email" : "phone"} already exists`, 400);
      }
      const prefix = purpose === "login" ? "otp:login" : "otp";
      const key = email
        ? `${prefix}:email:${email.toLowerCase()}`
        : `${prefix}:phone:${phone.trim()}`;

      const existingOtp = await redisClient.client.get(key);
      if (existingOtp) {
        const ttl = await redisClient.client.ttl(key);
        return apiResponse.failure(
          res,
          `OTP already sent. Please wait ${ttl > 0 ? ttl : 120} seconds before requesting a new one.`,
          429,
        );
      }
      const otp = generateOtpService();
      await redisClient.client.set(key, otp, { EX: 60 * 5 });
      return apiResponse.success(res, { message: "OTP sent successfully" }, "OTP sent successfully", 200);
    } catch (err) {
      next(err);
    }
  },

  async verifyOtp(req, res, next) {
    try {

      const { email, phone, code } = req.body;
      if (email) {
        const otp = await redisClient.client.get(`otp:email:${email.toLowerCase()}`);
        if (!otp) return apiResponse.failure(res, "Email OTP expired or invalid", 400);
        if (otp !== code) return apiResponse.failure(res, "Email OTP invalid", 400);
        await redisClient.client.del(`otp:email:${email.toLowerCase()}`);
        await redisClient.client.set(
          `verified:email:${email.toLowerCase()}`,
          new Date().toISOString(),
          { EX: 60 * 5 }
        );
      }

      if (phone) {
        const otp = await redisClient.client.get(`otp:phone:${phone}`);
        if (!otp) return apiResponse.failure(res, "Phone OTP expired or invalid", 400);
        if (otp !== code) return apiResponse.failure(res, "Phone OTP invalid", 400);
        await redisClient.client.del(`otp:phone:${phone}`);

        // ✅ store verified status in Redis for 5 min
        await redisClient.client.set(
          `verified:phone:${phone}`,
          new Date().toISOString(),
          { EX: 60 * 5 }
        );
      }
      return apiResponse.success(res, { message: "OTP verified successfully" }, "OTP verified successfully", 200);
    } catch (err) {
      next(err);
    }
  },

  async register(req, res, next) {
    try {
      const { email, phone, password, role } = req.body;
      const existingUser = await User.findOne({ $or: [{ email: email?.toLowerCase() }, { phone: phone?.trim() }] });
      if (existingUser) return apiResponse.failure(res, `User with this ${email ? "email" : "phone"} already exists`, 400);

      if (!email && !phone) {
        return apiResponse.failure(res, "Email or phone is required", 400);
      }

      const verifiedEmail = email
        ? await redisClient.client.get(`verified:email:${email.toLowerCase()}`)
        : null;

      const verifiedPhone = phone
        ? await redisClient.client.get(`verified:phone:${phone}`)
        : null;

      if (!verifiedEmail && !verifiedPhone) {
        return apiResponse.failure(res, "Please verify your email or phone before registering", 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      if (role !== "artist" && role !== "organisation") {
        return apiResponse.failure(res, "Only artist and organisation roles are allowed", 400);
      }
      const newUser = await User.create({
        ...(email && { email: email.toLowerCase() }),
        ...(phone && { phone }),
        password: hashedPassword,
        role,
        status: ACCOUNT_STATUS.PENDING,
        kycStatus: KYC_STATUS.NOT_SUBMITTED,
        // correct data when email or phone is verified
        ...(email && { emailVerifiedAt: new Date() }),
        ...(phone && { phoneVerifiedAt: new Date() }),
      });
      return apiResponse.success(res, { userId: newUser._id, email: newUser.email, phone: newUser.phone, role: newUser.role }, "User registered successfully", 201);
    } catch (err) {
      next(err)
    }
  },

  async loginEmailOrPhone(req, res, next) {
    try {
      const { email, phone, password } = req.body;
      const user = await User.findOne({
        $or: [{ email: email?.toLowerCase() }, { phone: phone?.trim() }]
      }).select("+password");
      if (!user) return apiResponse.failure(res, "User not found", 404);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(isPasswordValid);
      if (!isPasswordValid) return apiResponse.failure(res, "Invalid password", 400);
      setAuthCookie(res, user._id); // set auth cookie
      const userObject = user.toObject();
      delete userObject.password;

      return apiResponse.success(res, { user: userObject }, "Login successful", 200);
    } catch (err) {
      next(err)
    }
  },

  async loginWithOtp(req, res, next) {
    try {
      const { email, phone, code } = req.body;
      const user = await User.findOne({ $or: [{ email: email?.toLowerCase() }, { phone: phone?.trim() }] });
      if (!user) return apiResponse.failure(res, "User not found, please register first", 404);
      const otp = email ? await redisClient.client.get(`otp:login:email:${email.toLowerCase()}`) : await redisClient.client.get(`otp:login:phone:${phone.trim()}`);
      if (!otp) return apiResponse.failure(res, "Login OTP expired or invalid, please generate OTP again", 400);
      if (otp !== code) return apiResponse.failure(res, "Login OTP invalid, please try again", 400);
      // inside login or register
      setAuthCookie(res, user._id); // set auth cookie
      const userObject = user.toObject();
      delete userObject.password;
      await redisClient.client.del(email ? `otp:login:email:${email.toLowerCase()}` : `otp:login:phone:${phone.trim()}`);
      return apiResponse.success(res, { user: userObject }, "Login successful", 200);
    } catch (err) {
      next(err)
    }
  },
  async googleCallback(req, res, next) {
    try {
      if (req.user) {
        const token = jwt.sign(
          { userId: req.user._id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
        );
        res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Secure; SameSite=Strict`);
        return res.redirect(process.env.FRONTEND_URL);
      }

      const { googleId, email } = req.authInfo || {};
      if (!googleId) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
      }

      const tempToken = jwt.sign(
        { googleId, email, isTemp: true },
        process.env.JWT_SECRET,
        { expiresIn: "10m" },
      );

      return res.redirect(
        `${process.env.FRONTEND_URL}/onboarding?tempToken=${encodeURIComponent(tempToken)}`,
      );
    } catch (err) {
      next(err);
    }
  },

  async googleComplete(req, res, next) {
    try {
      const { tempToken, role } = req.body;
      const allowedRoles = ["artist", "organisation"];

      if (!allowedRoles.includes(role)) {
        return apiResponse.failure(res, "Invalid role", 400);
      }

      let decoded;
      try {
        decoded = verifyToken(tempToken);
      } catch (e) {
        return apiResponse.failure(res, "Invalid or expired token", 400);
      }

      if (!decoded.isTemp) {
        return apiResponse.failure(res, "Invalid token", 400);
      }

      const { googleId, email } = decoded;

      const existingUser = await User.findOne({
        $or: [
          { googleId },
          ...(email ? [{ email }] : []),
        ],
      });
      if (existingUser) {
        return apiResponse.failure(res, "User already exists", 400);
      }

      const user = await User.create({
        googleId,
        email,
        role,
        emailVerifiedAt: email ? new Date() : null,
      });
      setAuthCookie(res, user._id);
      return apiResponse.success(res, { user: user }, "Registration successful", 201);
    } catch (err) {
      next(err);
    }
  },

  // for common user details, artist and organisation details are different
  async fetchUser(req, res, next) {
    try {
      // take token from http only cookie header
      const token = req.cookies?.token;
      console.log("token", token);
      const decoded = verifyToken(token);
      const user = await User.findOne({ _id: decoded.userId, role: { $in: ["artist", "organisation"] } });
      const artistProfile = user.role === "artist" ? await ArtistProfile.findOne({ user: user._id }) : null;
      const organisationProfile = user.role === "organisation" ? await OrganisationProfile.findOne({ user: user._id }) : null;
      if (!user) return apiResponse.failure(res, "User not found", 404);
      return apiResponse.success(res, { user, artistProfile, organisationProfile }, "User fetched successfully", 200);
    } catch (err) { next(err); }
  },
};

module.exports = authController;