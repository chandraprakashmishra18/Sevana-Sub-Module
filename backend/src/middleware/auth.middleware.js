
const jwt = require("jsonwebtoken");

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

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.sub,
      platformRole: decoded.platformRole
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token."
    });
  }
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

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token required."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.sub,
      platformRole: decoded.platformRole
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token."
    });
  }
}

// -----------------------------------------------------
// EXPORTS
// -----------------------------------------------------

module.exports = {
  requireAuth,
  optionalAuth
};