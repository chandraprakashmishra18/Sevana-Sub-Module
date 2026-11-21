const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const controller = require("../controllers/donation.controller");
const router = express.Router();
router.get("/mine", requireAuth, controller.myDonations);
router.post("/intents", requireAuth, controller.createIntent);
module.exports = router;
