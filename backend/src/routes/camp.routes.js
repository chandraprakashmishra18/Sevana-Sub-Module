
const express = require("express");
const router = express.Router();

const {
  requireAuth,
  optionalAuth
} = require("../middleware/auth.middleware");

const {
  createCamp,
  getCamps,
  getCampById,
  updateCamp,
  publishCamp,
  cancelCamp,
  registerForCamp,
  updateRegistration,
  submitCampOutcome
} = require("../controllers/camp.controller");

// Public routes
router.get("/", getCamps);
router.get("/:campId", getCampById);

// Guest or authenticated registration
router.post("/:campId/register", optionalAuth, registerForCamp);

// Organization manager routes
router.post("/", requireAuth, createCamp);
router.patch("/:campId", requireAuth, updateCamp);
router.post("/:campId/publish", requireAuth, publishCamp);
router.post("/:campId/cancel", requireAuth, cancelCamp);

// Update camp registration
router.patch(
  "/registrations/:registrationId",
  requireAuth,
  updateRegistration
);

// Submit camp outcome
router.post("/:campId/outcomes", requireAuth, submitCampOutcome);

module.exports = router;
