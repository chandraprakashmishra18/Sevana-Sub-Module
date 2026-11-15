
const express = require("express");
const { rateLimit } = require("express-rate-limit");

const {
  register,
  login,
  getMe,
} = require("../controllers/auth.controller");

const { requireAuth } = require("../middleware/auth.middleware");

// Login: maximum 10 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later."
  }
});

// Registration: maximum 5 attempts per hour per IP
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again later."
  }
});

const router = express.Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.get("/me", requireAuth, getMe);

module.exports = router;
