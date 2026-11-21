const express = require("express");
const rateLimit = require("express-rate-limit");
const controller = require("../controllers/contact.controller");

const router = express.Router();
const contactSubmissionLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many contact submissions. Please try again later." },
});

router.post("/", controller.submit);

module.exports = router;
module.exports.contactSubmissionLimit = contactSubmissionLimit;
