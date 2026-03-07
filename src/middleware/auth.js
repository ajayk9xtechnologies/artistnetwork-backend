const { verifyToken, apiResponse } = require("../utils");
const { User } = require("../models");

/**
 * Middleware to require a valid JWT and attach the userId to req.userId.
 * Updates lastSeenAt for "online" status (consider online if lastSeenAt within ~5 min).
 */
async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return apiResponse.failure(res, "Not authenticated", 401);
    }

    const decoded = verifyToken(token);
    req.userId = decoded.userId;

    // Refresh "online" status (fire-and-forget; don't block response)
    User.updateOne({ _id: decoded.userId }, { $set: { lastSeenAt: new Date() } }).catch(() => {});

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = requireAuth;