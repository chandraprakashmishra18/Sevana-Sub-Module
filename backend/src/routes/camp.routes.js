
const express = require("express");
const router = express.Router();

const {
  requireAuth,
  optionalAuth
} = require("../middleware/auth.middleware");

const {
  createCamp,
  getCamps,
  getMyCamps,
  getCampById,
  updateCamp,
  publishCamp,
  cancelCamp,
  registerForCamp,
  getCampRegistrations,
  updateRegistration,
  markAttendance,
  submitCampOutcome
} = require("../controllers/camp.controller");

// Public routes
router.get("/", getCamps);
router.get("/mine", requireAuth, getMyCamps);
router.get("/:campId", getCampById);

// Guest or authenticated registration
router.post("/:campId/register", optionalAuth, registerForCamp);

// Organization manager routes
router.post("/", requireAuth, createCamp);
router.patch("/:campId", requireAuth, updateCamp);
router.post("/:campId/publish", requireAuth, publishCamp);
router.post("/:campId/cancel", requireAuth, cancelCamp);

// View camp registrations
router.get("/:campId/registrations", requireAuth, getCampRegistrations);

// Mark participant attendance
router.patch(
  "/:campId/registrations/:registrationId/attendance",
  requireAuth,
  markAttendance
);

// Update camp registration
router.patch(
  "/registrations/:registrationId",
  requireAuth,
  updateRegistration
);

// Submit camp outcome
router.post("/:campId/outcomes", requireAuth, submitCampOutcome);

module.exports = router;
