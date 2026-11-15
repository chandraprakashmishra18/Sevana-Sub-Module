const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.platformRole !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required."
    });
  }

  return next();
};

module.exports = { requireAdmin };
