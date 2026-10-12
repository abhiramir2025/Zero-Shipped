// pdf-parse is required from its lib path because its index.js runs a debug
// block when loaded directly as the package root.
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

async function extractPdfText(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

module.exports = { extractPdfText };
