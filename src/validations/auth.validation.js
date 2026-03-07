const Joi = require("joi");

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().min(8).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    role: Joi.string().valid("artist", "organisation", "admin").required(),
});

const generateOtpSchema = Joi.object({
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
    purpose: Joi.string().valid("forgot-password", "login", "register").required(),
}).xor("email", "phone").required();

const verifyOtpSchema = Joi.object({
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
    code: Joi.string().required(),
    purpose: Joi.string().valid("register", "forgot-password").default("register"),
}).xor("email", "phone").required();

const loginSchema = Joi.object({
    email: Joi.string().email().pattern(/^\S+@\S+\.\S+$/),
    phone: Joi.string().required(),
    password: Joi.string().min(8).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
}).xor("email", "phone").required();

const loginWithOtpSchema = Joi.object({
    email: Joi.string().email().pattern(/^\S+@\S+\.\S+$/),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
    code: Joi.string().required(),
    purpose: Joi.string().valid("forgot-password", "login").required(),
}).xor("email", "phone").required();

const resetPasswordSchema = Joi.object({
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
    newPassword: Joi.string().min(8).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
}).xor("email", "phone").required();

module.exports = {
    registerSchema,
    generateOtpSchema,
    verifyOtpSchema,
    loginSchema,
    loginWithOtpSchema,
    resetPasswordSchema,
};