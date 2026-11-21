const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const controller = require("../controllers/notification.controller");
const router = express.Router();
router.use(requireAuth);
router.get("/", controller.list);
router.patch("/read-all", controller.markAllRead);
router.patch("/:id/read", controller.markRead);
module.exports = router;
