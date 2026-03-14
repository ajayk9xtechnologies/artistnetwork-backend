const jwt = require("jsonwebtoken");

function setAuthCookie(res, userId, role) {
  const token = jwt.sign(
    { userId, role }, // ✅ add role
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie("auth", "true", {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return token;
}
function verifyToken(token, options = {}) {
  if (!token) throw new Error("Unauthorized");
  return jwt.verify(token, process.env.JWT_SECRET, options);
}

module.exports = { setAuthCookie, verifyToken };