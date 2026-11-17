
const express = require("express");
const { rateLimit } = require("express-rate-limit");
const cors = require("cors");
const helmet = require("helmet");

// Route imports
const authRoutes = require("./routes/auth.routes");
const campRoutes = require("./routes/camp.routes");
const adminRoutes = require("./routes/admin.routes");
const communityRoutes = require("./routes/community.routes");
const healthRoutes = require("./routes/healthRoutes");

const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
const app = express();

// Render terminates public traffic at one trusted reverse-proxy hop. This
// keeps IP-based rate limits keyed to the forwarded client address.
app.set("trust proxy", 1);

// -----------------------------------------------------
// GLOBAL MIDDLEWARE
// -----------------------------------------------------

app.use(helmet());
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // Keep a finite general API ceiling, while leaving room for the app's
  // multi-request dashboards and normal navigation. Auth routes have stricter
  // route-specific limits in auth.routes.js.
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  },
  handler: (req, res) => {
    const route = req.originalUrl.split("?")[0];
    console.warn(`API rate limit exceeded: ${req.method} ${route}`);
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later."
    });
  }
});

// -----------------------------------------------------
// Liveness and database-readiness health checks
// -----------------------------------------------------

app.use("/api/health", healthRoutes);

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

// --------------------------------------------------
// CENTRALIZED ERROR HANDLER - MUST REMAIN LAST
// --------------------------------------------------

app.use((err, req, res, next) => {
  console.error("API Error:", err);

  const prismaCode = err.code;
  const prismaValidationError = err.name === "PrismaClientValidationError";
  const statusCode = err.statusCode || err.status || (
    prismaValidationError || prismaCode === "P2003" ? 400 :
    prismaCode === "P2002" ? 409 :
    prismaCode === "P2025" ? 404 : 500
  );
  const message = statusCode === 500
    ? (process.env.NODE_ENV === "production" ? "Internal server error." : err.message || "Internal server error.")
    : prismaValidationError ? "Campaign or request data is invalid. Check the submitted fields." :
      prismaCode === "P2003" ? "A referenced organization or user is invalid." :
      prismaCode === "P2002" ? "A record with these details already exists." :
      prismaCode === "P2025" ? "The requested record was not found." :
      err.message || "Something went wrong.";

  res.status(statusCode).json({
    success: false,
    message
  });
});

module.exports = app;
