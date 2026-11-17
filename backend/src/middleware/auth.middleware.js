
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

async function authenticateToken(token, req, res, next) {
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"]
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token."
    });
  }

  if (typeof decoded.sub !== "string") {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token."
    });
  }

  try {
    // Do not trust authorization claims from a token after the account is
    // disabled or its role changes. The database remains the source of truth.
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, platformRole: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User account is unavailable."
      });
    }

    req.user = { id: user.id, platformRole: user.platformRole };
    return next();
  } catch (error) {
    return next(error);
  }
}

// -----------------------------------------------------
// REQUIRED AUTHENTICATION
// Used for protected routes.
// -----------------------------------------------------

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token required."
    });
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token required."
    });
  }
  return authenticateToken(token, req, res, next);
}

// -----------------------------------------------------
// OPTIONAL AUTHENTICATION
// Allows both guest and authenticated users.
// -----------------------------------------------------

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  // No token: continue as a guest.
  if (!authHeader) {
    req.user = null;
    return next();
  }

  // Authorization header must use Bearer format.
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization header."
    });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token required."
    });
  }

  return authenticateToken(token, req, res, next);
}

// -----------------------------------------------------
// EXPORTS
// -----------------------------------------------------

module.exports = {
  requireAuth,
  optionalAuth
};
