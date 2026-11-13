const express = require("express");
const { getHealth, getReadiness } = require("../controllers/healthController");

const router = express.Router();

router.get("/", getHealth);
router.get("/ready", getReadiness);

module.exports = router;
