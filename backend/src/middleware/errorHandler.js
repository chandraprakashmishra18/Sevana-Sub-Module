function errorHandler(error, _req, res, _next) {
  const status = Number.isInteger(error.status) ? error.status : 500;
  const message = status >= 500 && process.env.NODE_ENV === "production"
    ? "Internal server error"
    : error.message || "Internal server error";

  if (status >= 500) console.error(error);
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
