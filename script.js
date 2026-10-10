/* ===== 0 to Shipped — resume parser mock =====
   No backend: everything below runs in the browser.
   The PDF is never really parsed — we simulate the
   analysis so the UI can be built and demoed first. */

// ---------- role skill maps (what the "parser" matches against) ----------

const ROLE_SKILLS = {
  frontend: {
    label: "Frontend Developer",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Git", "REST APIs", "Responsive Design", "Testing"],
  },
  backend: {
    label: "Backend Developer",
    skills: ["Node.js", "Python", "SQL", "REST APIs", "Git", "Docker", "Testing", "Databases", "Linux"],
  },
  data: {
    label: "Data Analyst",
    skills: ["SQL", "Python", "Excel", "Pandas", "Data Visualization", "Statistics", "Dashboards", "Communication"],
  },
};

// ---------- fake resume texts for the demo button ----------

const SAMPLE_RESUME = `
ABHIRAMI R — Aspiring Frontend Developer
Skills: HTML, CSS, JavaScript, Git, Figma, Responsive Design
Projects:
- Built a personal portfolio site with HTML, CSS and JavaScript
- Created a to-do app using vanilla JS and localStorage
- Styled a multi-page blog layout, mobile-first
Education: B.Tech Computer Science
`;

// ---------- dom handles ----------

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const dropText = document.getElementById("dropText");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const ringFg = document.getElementById("ringFg");
const scoreNumber = document.getElementById("scoreNumber");
const verdictEl = document.getElementById("verdict");
const presentCountEl = document.getElementById("presentCount");
const totalCountEl = document.getElementById("totalCount");
const presentList = document.getElementById("presentList");
const missingList = document.getElementById("missingList");
const missingHint = document.getElementById("missingHint");
const parsedFileEl = document.getElementById("parsedFile");
const rolePills = document.getElementById("rolePills");
const demoBtn = document.getElementById("demoBtn");

// ---------- state ----------

let currentRole = "frontend";
const RING_LENGTH = 326.7; // 2π × r(52), matches the CSS dasharray

// ---------- role picker ----------

rolePills.addEventListener("click", (e) => {
  const pill = e.target.closest(".pill");
  if (!pill) return;
  rolePills.querySelectorAll(".pill").forEach((p) => p.classList.remove("is-active"));
  pill.classList.add("is-active");
  currentRole = pill.dataset.role;
});

// ---------- upload + drag & drop ----------

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("is-drag");
});

dropZone.addEventListener("dragleave", () => dropZone.classList.remove("is-drag"));

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("is-drag");
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

fileInput.addEventListener("change", () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

function handleFile(file) {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    setStatus("That's not a PDF — export your resume as PDF and try again.", true);
    return;
  }
  setStatus(`Reading ${file.name}…`);
  // Mock "parsing": in the real build a server extracts the PDF text here.
  setTimeout(() => runAnalysis(SAMPLE_RESUME, file.name), 900);
}

// ---------- demo button ----------

demoBtn.addEventListener("click", () => {
  setStatus("Parsing sample resume…");
  setTimeout(() => runAnalysis(SAMPLE_RESUME, "sample-resume.pdf"), 700);
});

// ---------- the "parser" ----------

function runAnalysis(resumeText, fileName) {
  const { skills } = ROLE_SKILLS[currentRole];
  const text = resumeText.toLowerCase();

  const present = [];
  const missing = [];
  for (const skill of skills) {
    // naive keyword match: does the skill name appear anywhere in the text?
    (text.includes(skill.toLowerCase()) ? present : missing).push(skill);
  }

  const score = Math.round((present.length / skills.length) * 100);
  renderResult(score, present, missing, fileName);
  setStatus("");
}

// ---------- rendering ----------

function renderResult(score, present, missing, fileName) {
  resultsEl.classList.remove("hidden");

  // animate the ring + count
  const offset = RING_LENGTH * (1 - score / 100);
  ringFg.style.strokeDashoffset = offset;
  animateNumber(scoreNumber, score, 900);

  presentCountEl.textContent = present.length;
  totalCountEl.textContent = present.length + missing.length;

  verdictEl.textContent =
    score >= 80 ? "Strong match — go apply." :
    score >= 55 ? "Decent match — a few gaps to close." :
    "Early days — several key skills are missing.";

  fillChips(presentList, present, "is-present");
  fillChips(missingList, missing, "is-missing");

  missingHint.textContent = missing.length
    ? "Add projects or coursework that use these and the score moves up."
    : "Nothing missing — this role's core skills are all covered.";

  parsedFileEl.textContent = `Parsed: ${fileName} · target role: ${ROLE_SKILLS[currentRole].label} (mock analysis)`;

  resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

function fillChips(list, skills, cssClass) {
  list.innerHTML = "";
  for (const skill of skills) {
    const li = document.createElement("li");
    li.className = `chip ${cssClass}`;
    li.textContent = skill;
    list.appendChild(li);
  }
}

function animateNumber(el, target, duration) {
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * t);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.style.color = isError ? "var(--red)" : "";
}
