const { User } = require("../models");
const { apiResponse } = require("../utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateOtpService } = require("../services");
const redisClient = require("../config/redis");
const { ACCOUNT_STATUS, KYC_STATUS } = require("../constants/userStatus");

const authController = {

  async register(req, res, next) {
    try {
      const { email, phone, password, role } = req.body;
      const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone: phone }] });
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

  async generateOtp(req, res, next) {
    try {
      const { email, phone, purpose } = req.body;
      if (!email && !phone) return apiResponse.failure(res, "Email or phone is required", 400);
      const existingUser = await User.findOne({
        $or: [
          ...(email ? [{ email: email.toLowerCase() }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      });
      if (purpose === "login") {
        if (!existingUser) return apiResponse.failure(res, "User not found, please register first", 404);
      } else if (purpose === "register") {
        // default → register
        if (existingUser) return apiResponse.failure(res, `User with this ${email ? "email" : "phone"} already exists`, 400);
      }
      const prefix = purpose === "login" ? "otp:login" : "otp";
      const otp = generateOtpService();
      if (email) await redisClient.client.set(`${prefix}:email:${email.toLowerCase()}`, otp, { EX: 60 * 5 });
      if (phone) await redisClient.client.set(`${prefix}:phone:${phone}`, otp, { EX: 60 * 5 });
      return apiResponse.success(res, { message: "OTP sent successfully" }, "OTP sent successfully", 200);
    } catch (err) {
      next(err);
    }
  },

  async verifyOtp(req, res, next) {
    try {
      // try after 1 minute, if the code is not verified, delete the otp and return error

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

  async loginEmailOrPhone(req, res, next) {
    try {
      const { email, phone, password } = req.body;
      const user = await User.findOne({
        $or: [{ email: email?.toLowerCase() }, { phone }]
      }).select("+password");
      console.log(user);
      if (!user) return apiResponse.failure(res, "User not found", 404);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return apiResponse.failure(res, "Invalid password", 400);
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      const httpOnlyCookie = `token=${token}; HttpOnly; Secure; SameSite=Strict`;
      res.setHeader("Set-Cookie", httpOnlyCookie);
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
      const user = await User.findOne({ $or: [{ email: email?.toLowerCase() }, { phone: phone?.trim() }] }).select("+password");
      if (!user) return apiResponse.failure(res, "User not found, please register first", 404);
      const otp = email ? await redisClient.client.get(`otp:login:email:${email.toLowerCase()}`) : await redisClient.client.get(`otp:login:phone:${phone.trim()}`);
      if (!otp) return apiResponse.failure(res, "Login OTP expired or invalid, please generate OTP again", 400);
      if (otp !== code) return apiResponse.failure(res, "Login OTP invalid, please try again", 400);
      await redisClient.client.del(email ? `otp:login:email:${email.toLowerCase()}` : `otp:login:phone:${phone.trim()}`);
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      const httpOnlyCookie = `token=${token}; HttpOnly; Secure; SameSite=Strict`;
      res.setHeader("Set-Cookie", httpOnlyCookie);
      return apiResponse.success(res, { user: userObject }, "Login successful", 200);
    } catch (err) {
      next(err)
    }
  }
};

module.exports = authController;