// Non-AI comparison: the JD's skills are pulled out with a lexicon of known
// skills + aliases (word-boundary matching), then the resume text is matched
// against them. The AI part will replace extractJdSkills later — the function
// signatures below are the seam it plugs into.

const { matches } = require("../utils");

const SKILL_LEXICON = [
  { skill: "JavaScript", variants: ["javascript", "js"] },
  { skill: "TypeScript", variants: ["typescript", "ts"] },
  { skill: "React", variants: ["react", "reactjs", "react.js"] },
  { skill: "Vue", variants: ["vue", "vuejs"] },
  { skill: "Angular", variants: ["angular"] },
  { skill: "HTML", variants: ["html"] },
  { skill: "CSS", variants: ["css", "scss"] },
  { skill: "Tailwind", variants: ["tailwind", "tailwindcss"] },
  { skill: "Node.js", variants: ["node.js", "nodejs", "node"] },
  { skill: "Python", variants: ["python"] },
  { skill: "Java", variants: ["java"] },
  { skill: "C++", variants: ["c++"] },
  { skill: "C#", variants: ["c#", "csharp"] },
  { skill: "SQL", variants: ["sql"] },
  { skill: "MongoDB", variants: ["mongodb", "mongo"] },
  { skill: "PostgreSQL", variants: ["postgresql", "postgres"] },
  { skill: "MySQL", variants: ["mysql"] },
  { skill: "Redis", variants: ["redis"] },
  { skill: "REST APIs", variants: ["rest", "rest api", "rest apis", "api"] },
  { skill: "GraphQL", variants: ["graphql"] },
  { skill: "Docker", variants: ["docker"] },
  { skill: "Kubernetes", variants: ["kubernetes", "k8s"] },
  { skill: "Git", variants: ["git"] },
  { skill: "Linux", variants: ["linux"] },
  { skill: "AWS", variants: ["aws", "amazon web services"] },
  { skill: "CI/CD", variants: ["ci/cd", "ci cd", "jenkins", "github actions"] },
  { skill: "Testing", variants: ["testing", "jest", "pytest", "vitest", "unit test"] },
  { skill: "Excel", variants: ["excel"] },
  { skill: "Pandas", variants: ["pandas", "numpy"] },
  { skill: "Data Visualization", variants: ["data visualization", "tableau", "power bi", "powerbi", "matplotlib"] },
  { skill: "Machine Learning", variants: ["machine learning", "ml"] },
  { skill: "Statistics", variants: ["statistics", "statistical"] },
];

// 1) JD side: which lexicon skills does the job description ask for?
function extractJdSkills(jdText) {
  const found = [];
  for (const { skill, variants } of SKILL_LEXICON) {
    if (variants.some((v) => matches(jdText, v))) found.push(skill);
    if (found.length >= 30) break;
  }
  return found;
}

// 2) Resume side: of those, which does the resume text actually show?
function analyzeResume(resumeText, jdSkills) {
  const present = [];
  const missing = [];
  for (const skill of jdSkills) {
    const entry = SKILL_LEXICON.find((e) => e.skill === skill);
    (entry.variants.some((v) => matches(resumeText, v)) ? present : missing).push(skill);
  }
  const score = jdSkills.length ? Math.round((present.length / jdSkills.length) * 100) : 0;
  return { score, present, missing };
}

module.exports = { extractJdSkills, analyzeResume };
