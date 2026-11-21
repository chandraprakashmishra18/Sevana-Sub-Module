const express = require("express");
const { requireAuth, requirePlatformAdmin } = require("../middleware/auth.middleware");
const controller = require("../controllers/admin.controller");

const router = express.Router();
router.use(requireAuth, requirePlatformAdmin);
router.get("/summary", controller.getSummary);
router.get("/organizations", controller.listOrganizations);
router.patch("/organizations/:id/verification", controller.moderateOrganization);
router.get("/campaigns", controller.listCampaigns);
router.patch("/campaigns/:id/moderation", controller.moderateCampaign);
router.get("/contact-messages", controller.listContactMessages);
router.patch("/contact-messages/:id", controller.reviewContactMessage);
router.get("/users", controller.listAdminUsers);
router.patch("/users/:id/platform-role", controller.updatePlatformRole);
router.get("/audit-logs", controller.listAuditLogs);

module.exports = router;
