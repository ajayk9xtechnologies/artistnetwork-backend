const { User } = require("../models");
const { apiResponse } = require("../utils");
const bcrypt = require("bcrypt");
const authController = {
 
  async register(req, res, next) {
    try {
      const { email, phone, password,username, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return apiResponse.failure(res, "Email already exists, please login with email", 400);
      }
      const existingUserByPhone = await User.findOne({ phone });
      if (existingUserByPhone) {
        return apiResponse.failure(res, "Phone number already exists, please login with phone number", 400);
      }
      const newUser = await User.create({
        email,
        phone,
        password: hashedPassword,
        role,
      });
      return apiResponse.success(res, { userId: newUser._id, email: newUser.email, phone: newUser.phone, role: newUser.role }, "User registered successfully", 201);
    } catch (err) {
      next(err)
    }
  },


  async loginWithPassword(req, res, next) {
    try {
      const { email, phone, password } = req.body;
      const user = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone: phone }] });
      if (!user) {
        return apiResponse.failure(res, "User not found", 404);
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return apiResponse.failure(res, "Invalid password", 400);
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return apiResponse.success(res, { token }, "Login successful", 200);
    } catch (err) {
      next(err)
    }
  },
};

module.exports = authController;