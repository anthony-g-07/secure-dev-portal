// server/server.js
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const csrf = require("csurf");
require("dotenv").config();

const verifyToken = require("./middleware/verifyToken");

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

// 🛡️ Optional CSRF only if NOT in test
const maybeProtect = isTest
  ? (req, res, next) => next()
  : csrf({
      cookie: {
        httpOnly: true,
        sameSite: isProduction ? "strict" : "lax",
        secure: isProduction,
      },
    });
    
// 🔐 Security
app.use(helmet({ contentSecurityPolicy: false }));

// 🔄 Rate limiting (relaxed in dev)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 100 : 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: "⚠️ Too many requests from this IP, please try again later.",
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: isProduction
      ? "https://your-production-url.com"
      : "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction, // only true in production (HTTPS)
      sameSite: isProduction ? "strict" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 🧪 CSRF route (used by frontend only)
app.get("/api/csrf-token", maybeProtect, (req, res) => {
  res.json({ csrfToken: req.csrfToken?.() || null });
});

const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const configsRouter = require("./routes/configs");
const logsRouter = require("./routes/logs");

app.get("/", (req, res) => {
  res.send("Secure Dev Portal Backend Running");
});

app.get("/api/user", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// 🔐 Apply maybeProtect (CSRF bypass in test)
app.use("/api/users", maybeProtect, usersRouter);
app.use("/api/configs", maybeProtect, configsRouter);
app.use("/api/auth", authRouter);
app.use("/api/logs", logsRouter);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
