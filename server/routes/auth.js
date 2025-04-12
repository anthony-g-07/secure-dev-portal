const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const db = require("../models/db");
const jwt = require("jsonwebtoken");

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
router.post("/google", async (req, res) => {
  console.log("🔐 Received Google login request");
  console.log("📦 Token payload:", req.body);

  const { id_token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // 🔍 Log payload (optional)
    console.log('✅ Verified payload:', payload);

    // Check if user exists
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    let user = rows[0];
    if (!user) {
      const [result] = await db.query(
        "INSERT INTO users (email, name, role) VALUES (?, ?, ?)",
        [email, name, "viewer"]
      );
      user = { id: result.insertId, email, name, role: "viewer" };
    }

    // Issue JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ error: "Invalid Google token" });
  }
});

module.exports = router;
