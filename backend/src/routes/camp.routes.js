
const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth.middleware");

const {
  createCamp,
  getCamps,
  getCampById,
  updateCamp,
  publishCamp,
  cancelCamp
} = require("../controllers/camp.controller");

// -----------------------------------------------------
// PUBLIC ROUTES
// -----------------------------------------------------

// Get all published camps
router.get("/", getCamps);

// Get published camp details
router.get("/:campId", getCampById);

// -----------------------------------------------------
// PROTECTED ROUTES
// -----------------------------------------------------

// Create a camp
router.post("/", requireAuth, createCamp);

// Update a camp
router.patch("/:campId", requireAuth, updateCamp);

// Publish a camp
router.post("/:campId/publish", requireAuth, publishCamp);

// Cancel a camp
router.post("/:campId/cancel", requireAuth, cancelCamp);

router.post("/:campId/register", optionalAuth, registerForCamp);

module.exports = router;