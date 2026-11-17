require("dotenv").config();

const app = require("./src/app");
const prisma = require("./src/config/prisma");

const PORT = process.env.PORT || 5000;

function validateRuntimeConfiguration() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters.");
  }

  if (process.env.NODE_ENV === "production") {
    if (!process.env.CLIENT_URL) {
      throw new Error("CLIENT_URL must be configured in production.");
    }

    let clientUrl;
    try {
      clientUrl = new URL(process.env.CLIENT_URL);
    } catch {
      throw new Error("CLIENT_URL must be a valid HTTPS URL in production.");
    }

    if (clientUrl.protocol !== "https:") {
      throw new Error("CLIENT_URL must use HTTPS in production.");
    }
  }
}

async function startServer() {
  try {
    validateRuntimeConfiguration();
    await prisma.$connect();
    console.log("PostgreSQL connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
