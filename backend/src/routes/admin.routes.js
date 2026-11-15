const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth.middleware");
const { requireAdmin } = require("../middleware/admin.middleware");

const {
  getPendingOrganizations,
  updateOrganizationVerification
} = require("../controllers/admin.controller");

// All admin routes require authentication and ADMIN role
router.use(requireAuth, requireAdmin);

// List organizations awaiting verification
router.get("/organizations", getPendingOrganizations);

// Approve or reject an organization
router.patch(
  "/organizations/:organizationId/verification",
  updateOrganizationVerification
);

module.exports = router;
