const { runAnalysis, getHistory } = require("../services/analysis.service");

// POST /api/analyze — validates the request, delegates to the service layer.
async function analyze(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please attach a resume PDF (field name: 'resume')." });
    }
    const jd = (req.body.jd || "").trim();
    if (jd.length < 20) {
      return res.status(400).json({ error: "Please paste the job description (at least ~20 characters)." });
    }
    const result = await runAnalysis(req.file.originalname, req.file.buffer, jd);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// GET /api/history
async function history(req, res, next) {
  try {
    res.json(await getHistory());
  } catch (err) {
    next(err);
  }
}

module.exports = { analyze, history };
