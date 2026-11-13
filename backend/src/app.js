const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
console.log("LOADED: backend/src/app.js");

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  console.log("HEALTH ROUTE HIT");

  return res.status(200).json({
    success: true,
    message: "Sevana Community API is running",
  });
});

module.exports = app;
