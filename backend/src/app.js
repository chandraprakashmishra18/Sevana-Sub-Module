
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// Route imports
const authRoutes = require("./routes/auth.routes");
const campRoutes = require("./routes/camp.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// -----------------------------------------------------
// GLOBAL MIDDLEWARE
// -----------------------------------------------------

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -----------------------------------------------------
// HEALTH CHECK
// -----------------------------------------------------

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Sevana Community API is running"
  });
});

// -----------------------------------------------------
// API ROUTES
// -----------------------------------------------------

// Authentication routes
app.use("/api/auth", authRoutes);

// Educational & Medical Camps routes
app.use("/api/camps", campRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

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
