const Analysis = require("../models/Analysis");
const { extractPdfText } = require("./pdf.service");
const { extractJdSkills, analyzeResume } = require("./analyzer.service");

// Orchestrates one analysis: PDF text → JD skill extraction → matching → DB save.
async function runAnalysis(fileName, pdfBuffer, jdText) {
  const resumeText = await extractPdfText(pdfBuffer);
  const jdSkills = extractJdSkills(jdText);
  if (jdSkills.length < 3) {
    const err = new Error("Couldn't recognize enough skills in that JD. AI matching will improve this later.");
    err.status = 422;
    throw err;
  }
  const { score, present, missing } = analyzeResume(resumeText, jdSkills);
  const doc = await Analysis.create({
    fileName,
    jdExcerpt: jdText.slice(0, 140),
    score,
    jdSkills,
    presentSkills: present,
    missingSkills: missing,
  });
  return { id: doc._id, fileName, score, present, missing, jdSkills };
}

async function getHistory() {
  return Analysis.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select("fileName score jdExcerpt createdAt");
}

module.exports = { runAnalysis, getHistory };
