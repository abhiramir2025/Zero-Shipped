export default function History({ items }) {
  if (!items.length) return null;

  return (
    <section className="history">
      <h3>Recent analyses</h3>
      <ul className="history-list">
        {items.map((it) => (
          <li key={it._id} className="history-item">
            <span>
              <strong>{it.fileName}</strong> · {it.jdExcerpt}
            </span>
            <strong>{it.score}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
