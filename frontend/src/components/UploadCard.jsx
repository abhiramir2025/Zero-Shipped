import { useState } from "react";

export default function UploadCard({ onResult }) {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);

  function pickFile(f) {
    if (!f) return;
    const isPdf = f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setError("That's not a PDF — export your resume as PDF and try again.");
      setFile(null);
      return;
    }
    setFile(f);
    setError("");
  }

  async function submit() {
    if (!file) { setError("Attach a resume PDF first."); return; }
    if (jd.trim().length < 20) { setError("Paste the job description (at least ~20 characters)."); return; }

    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("resume", file);
      form.append("jd", jd);
      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");
      onResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="upload" className="upload-card">
      <label
        className={"drop-zone" + (drag ? " is-drag" : "")}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files[0]); }}
      >
        <input
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={(e) => pickFile(e.target.files[0])}
        />
        <svg className="drop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 16V4m0 0l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" />
        </svg>
        <span className="drop-text">
          {file ? <strong>{file.name}</strong> : <><strong>Click to upload</strong> or drag &amp; drop your resume</>}
        </span>
        <span className="drop-hint">PDF only · max 10MB · sent to your local backend</span>
      </label>

      <label className="jd-label" htmlFor="jdInput">Job description</label>
      <textarea
        id="jdInput"
        className="jd-textarea"
        placeholder="Paste the full job description here — the skills the employer asks for become the checklist your resume is scored against."
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      />

      <button className="submit-btn" type="button" onClick={submit} disabled={loading}>
        {loading ? "Analyzing…" : "Analyze resume vs JD"}
      </button>

      {error && <p className="error-text">{error}</p>}
    </section>
  );
}
