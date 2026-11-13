const { checkDatabase } = require("../services/healthService");

function getHealth(_req, res) {
  res.status(200).json({ status: "ok", service: "sevana-api" });
}

async function getReadiness(_req, res, next) {
  try {
    await checkDatabase();
    res.status(200).json({ status: "ready", database: "connected" });
  } catch (error) {
    next(error);
  }
}

module.exports = { getHealth, getReadiness };
