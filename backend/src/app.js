
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
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors());
app.use("/api/contact", contactRoutes.contactSubmissionLimit);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Sevana Community API is running",
  });
});

// Authentication routes
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
