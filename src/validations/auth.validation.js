const Joi = require("joi");

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("artist", "organisation", "admin").required(),
});

const verifyEmailSchema = Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().required(),
});

const verifyPhoneSchema = Joi.object({
    phone: Joi.string().required(),
    code: Joi.string().required(),
});

const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().min(6).required().valid(Joi.ref("password")),
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

const verifyOtpSchema = Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email(),
    phone: Joi.string(),
    password: Joi.string().min(6).required(),
}).or("email", "phone");

const otpLoginSchema = Joi.object({
    email: Joi.string().email(),
    phone: Joi.string(),
    otp: Joi.string().required(),
}).or("email", "phone");

module.exports = {
    registerSchema,
    verifyEmailSchema,
    verifyPhoneSchema,
    resetPasswordSchema,
    forgotPasswordSchema,
    verifyOtpSchema,
    loginSchema,
    otpLoginSchema,
};