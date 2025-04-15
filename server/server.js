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

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: isProduction ? "strict" : "lax",
    secure: isProduction,
  },
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // optional: disable CSP in dev for easier testing
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 100 : 200, // allow more requests during dev
  standardHeaders: true,
  legacyHeaders: false,
  message: "⚠️ Too many requests from this IP, please try again later.",
});

// Apply rate limiting globally (or only to specific routes if preferred)
app.use(limiter);

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

app.get("/", (req, res) => {
  res.send("Secure Dev Portal Backend Running");
});

app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});


const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const configsRouter = require("./routes/configs");
const logsRouter = require("./routes/logs");

app.get("/api/user", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

app.use("/api/users", csrfProtection, usersRouter); // Mount test route
app.use("/api/auth", authRouter);
app.use("/api/configs", csrfProtection, configsRouter); // ✅ Protected!
app.use("/api/logs", logsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
