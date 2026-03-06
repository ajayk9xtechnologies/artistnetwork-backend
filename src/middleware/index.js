// Export middleware here, e.g.
// module.exports.authMiddleware = require("./auth.middleware");
const requireAuth = require("./auth");
require("dotenv").config();
module.exports = {
  validateRequest: require("./validateRequest"),
  requireAuth: requireAuth,
};
