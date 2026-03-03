const Joi = require("joi");
const { PREFERRED_WORKING_HOURS } = require("../constants/userStatus");

const artistProfileValidation  = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().required(),
    username: Joi.string().trim().required(),
    bio: Joi.string().max(1000).optional(),
    profilePhoto: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid("male", "female", "prefer_not_to_say").required(),
    country: Joi.string().optional(),
    city: Joi.string().optional(),
    travelPreference: Joi.number().valid(0, 1, 2, 3).optional(),
    category: Joi.string().required(),
    skills: Joi.array().items(Joi.string()).optional(),
    experienceYears: Joi.number().min(0).optional(),
    expectedRateMin: Joi.number().min(0).optional(),
    expectedRateMax: Joi.number().min(0).optional(),
    currency: Joi.string().valid(Object.values(CURRENCY)).optional(),
    photos: Joi.array().items(Joi.string()).optional(),
    videos: Joi.array().items(Joi.string()).optional(),
    availableDates: Joi.array().items(Joi.date()).optional(),
    preferredWorkingHours: Joi.string().valid(Object.values(PREFERRED_WORKING_HOURS)).optional(),
    socialLinks: Joi.object({
        instagram: Joi.string().optional(),
        tiktok: Joi.string().optional(),
        youtube: Joi.string().optional(),
        spotify: Joi.string().optional(),
        website: Joi.string().optional(),
    }).optional(),
});

module.exports = {
    artistProfileValidation
};