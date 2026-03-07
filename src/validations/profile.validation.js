const Joi = require("joi");
const { CURRENCY, PREFERRED_WORKING_HOURS, TRAVEL_PREFERENCE } = require("../constants/userStatus");
// firstName, lastName, bio, profilePhoto, dateOfBirth, gender,
// languages, country, city, travelPreference,
// categories, skills, experienceYears, expectedRateMin/Max,
// currency, photos, videos, availableDates,
// preferredWorkingHours, socialLinks.*, status

const artistProfileFieldsOptional = Joi.object({
  firstName: Joi.string().trim().min(1),
  lastName: Joi.string().trim().min(1),
  categories: Joi.array().items(Joi.string().trim()).min(1),
  skills: Joi.array().items(Joi.string().trim()).min(1),
  country: Joi.string().trim().min(1),
  city: Joi.string().trim().min(1),
  bio: Joi.string().max(1000).allow("", null),
  profilePhoto: Joi.string().uri().allow("", null),
  dateOfBirth: Joi.date().allow(null),
  gender: Joi.string().valid("male", "female", "prefer_not_to_say").allow(null),
  languages: Joi.array().items(Joi.string().trim()),
  travelPreference: Joi.string().valid(...Object.values(TRAVEL_PREFERENCE)),
  experienceYears: Joi.number().min(0).allow(null),
  expectedRateMin: Joi.number().min(0).allow(null),
  expectedRateMax: Joi.number().min(0).allow(null),
  currency: Joi.string().valid(...Object.values(CURRENCY)),
  availableDates: Joi.array().items(Joi.date()),
  preferredWorkingHours: Joi.string()
    .valid(...Object.values(PREFERRED_WORKING_HOURS))
    .allow(null),
  socialLinks: Joi.object({
    instagram: Joi.string().uri().allow("", null),
    tiktok: Joi.string().uri().allow("", null),
    youtube: Joi.string().uri().allow("", null),
    spotify: Joi.string().uri().allow("", null),
    website: Joi.string().uri().allow("", null),
  }),
  status: Joi.string().valid("active", "inactive", "pending", "blocked").allow(null),
}).min(1);

const updateArtistProfileValidation = Joi.object({
  artistProfileData: artistProfileFieldsOptional,
});

const artistProfileValidation = Joi.object({
  artistProfileData: Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    categories: Joi.array().items(Joi.string().trim()).min(1).required(),
    skills: Joi.array().items(Joi.string().trim()).min(1).required(),
    country: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    bio: Joi.string().max(1000).allow("", null),
    profilePhoto: Joi.string().uri().allow("", null),
    dateOfBirth: Joi.date().allow(null),
    gender: Joi.string().valid("male", "female", "prefer_not_to_say").allow(null),
    languages: Joi.array().items(Joi.string().trim()).default([]),
    travelPreference: Joi.string()
      .valid(...Object.values(TRAVEL_PREFERENCE))
      .default(TRAVEL_PREFERENCE.LOCAL_ONLY),
    experienceYears: Joi.number().min(0).allow(null),
    expectedRateMin: Joi.number().min(0).allow(null),
    expectedRateMax: Joi.number().min(0).allow(null),
    currency: Joi.string().valid(...Object.values(CURRENCY)).default(CURRENCY.USD),
    availableDates: Joi.array().items(Joi.date()).default([]),
    preferredWorkingHours: Joi.string()
      .valid(...Object.values(PREFERRED_WORKING_HOURS))
      .default(PREFERRED_WORKING_HOURS.FLEXIBLE)
      .allow(null),
    socialLinks: Joi.object({
      instagram: Joi.string().uri().allow("", null),
      tiktok: Joi.string().uri().allow("", null),
      youtube: Joi.string().uri().allow("", null),
      spotify: Joi.string().uri().allow("", null),
      website: Joi.string().uri().allow("", null),
    }).default({}),
    status: Joi.string().valid("active", "inactive", "pending", "blocked").allow(null),
  }),
});


// Organisation profile: one validation for both create and update (org must fill full profile)
const organisationProfileValidation = Joi.object({
  organisationProfileData: Joi.object({
    name: Joi.string().trim().min(3).required(),
    description: Joi.string().trim().max(1000).required(),
    logo: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    categories: Joi.array().items(Joi.string().trim()).min(1).required(),
    website: Joi.string().uri().allow("", null),
    address: Joi.string().trim().allow("", null),
    socialLinks: Joi.object({
      instagram: Joi.string().uri().allow("", null),
      facebook: Joi.string().uri().allow("", null),
      linkedin: Joi.string().uri().allow("", null),
      twitter: Joi.string().uri().allow("", null),
    }).default({}),
    employeeCount: Joi.number().min(0).allow(null),
    foundedYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).allow(null),
    subscriptionTier: Joi.string().valid("free", "pro", "enterprise").default("free"),
  }),
});

module.exports = {
  artistProfileValidation,
  updateArtistProfileValidation,
  organisationProfileValidation,
};