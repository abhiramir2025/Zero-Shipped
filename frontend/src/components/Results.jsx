import { useEffect, useState } from "react";

export default function Results({ result }) {
  const { fileName, score, present, missing } = result;

  return (
    <section className="results" aria-live="polite">
      <div className="result-grid">
        <div className="score-panel">
          <h2>Match score</h2>
          <ScoreRing score={score} />
          <p className="verdict">
            {score >= 80 ? "Strong match — go apply." :
             score >= 55 ? "Decent match — a few gaps to close." :
             "Early days — several key skills are missing."}
          </p>
          <p className="score-meta">
            <span>{present.length}</span> of <span>{present.length + missing.length}</span> JD skills found
          </p>
        </div>

        <div className="skills-panel">
          <div className="skill-group">
            <h3><span className="dot dot-green"></span> Skills present</h3>
            <ul className="chip-list">
              {present.map((s) => <li key={s} className="chip is-present">{s}</li>)}
            </ul>
          </div>
          <div className="skill-group">
            <h3><span className="dot dot-red"></span> Skills missing</h3>
            <ul className="chip-list">
              {missing.map((s) => <li key={s} className="chip is-missing">{s}</li>)}
            </ul>
            <p className="missing-hint">
              {missing.length
                ? "Add projects or experience using these, and the score moves up."
                : "Nothing missing — every skill in this JD is covered."}
            </p>
          </div>
        </div>
      </div>
      <p className="parsed-file">Parsed: {fileName} · skills extracted from the job description</p>
    </section>
  );
}

function ScoreRing({ score }) {
  const RING = 326.7; // 2π × 52, matches the CSS dasharray
  const [offset, setOffset] = useState(RING);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setOffset(RING * (1 - score / 100)));
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="ring-wrap">
      <svg viewBox="0 0 120 120" className="ring">
        <circle className="ring-bg" cx="60" cy="60" r="52" />
        <circle
          className="ring-fg"
          cx="60" cy="60" r="52"
          strokeDasharray={RING}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ring-number">{score}</div>
    </div>
  );
}
