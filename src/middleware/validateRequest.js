// src/middleware/validateRequest.js
const { apiResponse } = require("../utils");
const validateRequest = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
  
    if (error) {
      return apiResponse.failure(res, "Validation error", 400, error.details.map((d) => d.message));
    }
    req.body = value;
    next();
  };
  
  module.exports = validateRequest;