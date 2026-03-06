const jwt = require("jsonwebtoken");

function setAuthCookie(res, userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
  console.log("token", token);
  // ✅ Use res.cookie() instead of setHeader
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,  // set to false for localhost (HTTPS not required)
    sameSite: "lax",
    path: "/",      // ← KEY! Makes it work for ALL routes
    maxAge: 3600000 // 1 hour
  });

  return token;
}

function verifyToken(token, options = {}) {
  if (!token) throw new Error("Unauthorized");
  return jwt.verify(token, process.env.JWT_SECRET, options);
}

module.exports = { setAuthCookie, verifyToken };