
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token required.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET);

    req.user = {
      id: decoded.sub,
      platformRole: decoded.platformRole,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Invalid or expired authentication token." });
  }

  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET);
    req.user = { id: decoded.sub, platformRole: decoded.platformRole };
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired authentication token." });
  }
}

async function requirePlatformAdmin(req, res, next) {
  if (!req.user?.id) {
    return res.status(401).json({ success: false, message: "Authentication token required." });
  }

  try {
    // Re-read the role from the database so revoked or stale JWT role claims
    // cannot retain administrative access.
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { platformRole: true, isActive: true },
    });
    if (!user?.isActive) {
      return res.status(401).json({ success: false, message: "User account is unavailable." });
    }
    if (user.platformRole !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Platform administrator access required." });
    }
    req.user.platformRole = user.platformRole;
    return next();
  } catch (error) {
    console.error("Platform admin authorization query failed.", error?.code || "unknown");
    return res.status(503).json({ success: false, message: "Unable to verify platform administrator access." });
  }
}

module.exports = { requireAuth, optionalAuth, requirePlatformAdmin };
