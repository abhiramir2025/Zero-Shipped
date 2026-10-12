// Smoke test for the skill-matching logic — no server or DB needed.
// Run from the project root:  node backend/smoke-test.cjs
const { extractJdSkills, analyzeResume } = require("./services/analyzer.service.js");

const jd =
  "We are looking for a front-end developer with strong React, TypeScript and CSS skills. " +
  "Experience with REST APIs and Git required. Testing with Jest is a plus.";

const resume =
  "Skills: HTML, CSS, JavaScript, React, Git. " +
  "Built REST APIs with Node.js and tested them with Jest.";

const skills = extractJdSkills(jd);
const r = analyzeResume(resume, skills);

console.log("JD skills  :", skills.join(", "));
console.log("score      :", r.score);
console.log("present    :", r.present.join(", "));
console.log("missing    :", r.missing.join(", "));

// --- assertions ---
const assert = require("assert");
assert(skills.includes("React"), "React should be extracted from the JD");
assert(skills.includes("TypeScript"), "TypeScript should be extracted");
assert(skills.includes("REST APIs"), "REST APIs should be extracted");
assert(!skills.includes("Java"), "'JavaScript' must not match the 'Java' skill");
assert(r.score > 0 && r.score <= 100, "score must be a percentage");
console.log("SMOKE TEST PASSED");
