import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import UploadCard from "./components/UploadCard.jsx";
import Results from "./components/Results.jsx";
import History from "./components/History.jsx";

export default function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  async function loadHistory() {
    try {
      const res = await fetch("/api/history");
      if (res.ok) setHistory(await res.json());
    } catch {
      /* backend not running — the page still works as a mock */
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <p className="eyebrow">Resume vs job description</p>
          <h1>
            Know exactly what your resume is <span className="grad">missing</span>.
          </h1>
          <p className="sub">
            Upload your resume PDF, paste the job description you're applying for, and get a
            match score with the skills you already show — and the ones you don't.
          </p>
        </section>

        <UploadCard onResult={(r) => { setResult(r); loadHistory(); }} />
        {result && <Results result={result} />}
        <History items={history} />
      </main>
      <footer className="site-footer">
        <p>0 to Shipped — resume parser · React + Express + MongoDB</p>
      </footer>
    </>
  );
}
