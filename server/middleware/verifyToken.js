// server/middleware/verifyToken.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  console.log("TOKEN FOUND:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🧪 Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
