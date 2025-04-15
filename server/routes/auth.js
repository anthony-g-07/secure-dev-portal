// server/routes/auth.js
const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const db = require("../models/db");
const ROLES = require("../constants/roles");

const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;

        if (!email) {
          return done(new Error("No email found in Google profile"), null);
        }

        console.log("🔍 Checking for user with email:", email);

        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
          email,
        ]);
        let user = rows[0];

        if (!user) {
          const [result] = await db.query(
            "INSERT INTO users (email, name, role) VALUES (?, ?, ?)",
            [email, name, ROLES.VIEWER]
          );
          user = { id: result.insertId, email, name, role: ROLES.VIEWER };
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Start Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Callback route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await db.query(
      "INSERT INTO audit_logs (user_id, action, resource, metadata) VALUES (?, ?, ?, ?)",
      [
        user.id,
        "login",
        null,
        JSON.stringify({
          ip: req.ip,
          ua: req.headers["user-agent"],
        }),
      ]
    );

    // Store token in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set to true with HTTPS
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    // Redirect back to React
    const redirectUrl = process.env.CLIENT_REDIRECT_URL || "http://localhost:5173/dashboard";
    res.redirect(redirectUrl);
  }
);

// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  req.logout(() => res.sendStatus(200));
});

module.exports = router;
