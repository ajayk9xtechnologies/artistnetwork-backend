const { verifyToken, apiResponse } = require("../utils");

/**
 * Middleware to require a valid JWT and attach the userId to req.userId.
 * Looks for the token in HttpOnly cookie `token`.
 */
async function requireAuth(req, res, next) {
  try {
 
    const token = req.cookies?.token;
    if (!token) {
      return apiResponse.failure(res, "Not authenticated", 401);
    }

    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    console.log("decoded", decoded);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = requireAuth;