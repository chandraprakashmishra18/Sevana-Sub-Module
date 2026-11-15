
const express = require("express");
const { rateLimit } = require("express-rate-limit");
const cors = require("cors");
const helmet = require("helmet");

// Route imports
const authRoutes = require("./routes/auth.routes");
const campRoutes = require("./routes/camp.routes");
const adminRoutes = require("./routes/admin.routes");
const communityRoutes = require("./routes/community.routes");

const app = express();

// -----------------------------------------------------
// GLOBAL MIDDLEWARE
// -----------------------------------------------------

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

// -----------------------------------------------------
// HEALTH CHECK
// -----------------------------------------------------

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Sevana Community API is running"
  });
});

app.use("/api", apiLimiter);

// -----------------------------------------------------
// API ROUTES
// -----------------------------------------------------

// Authentication routes
app.use("/api/auth", authRoutes);

// Educational & Medical Camps routes
app.use("/api/camps", campRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// Community routes
app.use("/api", communityRoutes);

// -----------------------------------------------------
// 404 HANDLER - MUST REMAIN LAST
// -----------------------------------------------------

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found."
  });
});

module.exports = app;
