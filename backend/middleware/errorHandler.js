// Central error handler: multer errors first, then service errors that carry
// an HTTP status, then everything else as a 500.
function errorHandler(err, req, res, next) {
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "PDF too large (max 10MB)." });
  }
  if (err.message === "Only PDF files are accepted") {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong." });
}

module.exports = { errorHandler };
