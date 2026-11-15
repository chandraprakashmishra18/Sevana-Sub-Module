const express = require("express");
const controller = require("../controllers/community.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

// Campaigns
router.get("/campaigns", controller.getCampaigns);
router.get("/campaigns/mine", requireAuth, controller.getOrganizationCampaigns);
router.get("/campaigns/:campaignId", controller.getCampaignById);
router.post("/campaigns", requireAuth, controller.createCampaign);
router.patch("/campaigns/:campaignId", requireAuth, controller.updateCampaign);
router.patch("/campaigns/:campaignId/status", requireAuth, controller.updateCampaignStatus);

// Donations
router.post("/donations", requireAuth, controller.createDonation);
router.get("/donations", requireAuth, controller.getDonations);

// Aid requests
router.post("/aid-requests", requireAuth, controller.createAidRequest);
router.get("/aid-requests", requireAuth, controller.getAidRequests);
router.patch("/aid-requests/:requestId/review", requireAuth, controller.reviewAidRequest);

// Aid distributions
router.post("/distributions", requireAuth, controller.createDistribution);
router.get("/distributions", requireAuth, controller.getDistributions);

module.exports = router;
