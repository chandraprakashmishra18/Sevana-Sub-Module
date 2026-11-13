function notFound(req, res) {
  res.status(404).json({
    error: "Not Found",
    message: `No route matches ${req.method} ${req.originalUrl}`,
  });
}

module.exports = notFound;
