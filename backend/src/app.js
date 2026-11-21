
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth.routes");
const campRoutes = require("./routes/camp.routes");
const campaignRoutes = require("./routes/campaign.routes");
const donationRoutes = require("./routes/donation.routes");
const organizationRoutes = require("./routes/organization.routes");
const userRoutes = require("./routes/user.routes");
const notificationRoutes = require("./routes/notification.routes");
const adminRoutes = require("./routes/admin.routes");
const contactRoutes = require("./routes/contact.routes");
const healthRoutes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

function parseCorsOrigins(value) {
  return (value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      let parsed;
      try {
        parsed = new URL(entry);
      } catch {
        throw new Error("CORS_ALLOWED_ORIGINS must contain comma-separated HTTP(S) origins.");
      }

      if (
        !["http:", "https:"].includes(parsed.protocol) ||
        parsed.username ||
        parsed.password ||
        parsed.pathname !== "/" ||
        parsed.search ||
        parsed.hash
      ) {
        throw new Error("CORS_ALLOWED_ORIGINS entries must be exact origins without paths or credentials.");
      }

      return parsed.origin;
    });
}

const allowedOrigins = new Set(parseCorsOrigins(
  process.env.CORS_ALLOWED_ORIGINS ||
  "https://sevana-sub-module.vercel.app"
));
if (process.env.NODE_ENV !== "production") {
  [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
  ].forEach((origin) => allowedOrigins.add(origin));
}

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header are not browser cross-origin requests.
    callback(null, !origin || allowedOrigins.has(origin));
  },
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Accept", "Authorization", "Content-Type"],
}));
app.use("/api/contact", contactRoutes.contactSubmissionLimit);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication routes
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/camps", campRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

app.use(errorHandler);

// 404 handler - MUST remain last
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

module.exports = app;
