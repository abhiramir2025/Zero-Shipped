const express = require("express");
const { analyze, history } = require("../controllers/analysis.controller");
const { upload } = require("../middleware/upload");

const router = express.Router();

// POST /api/analyze — multipart form: "resume" (PDF file) + "jd" (text)
router.post("/analyze", upload.single("resume"), analyze);

// GET /api/history — last 10 analyses
router.get("/history", history);

module.exports = router;
