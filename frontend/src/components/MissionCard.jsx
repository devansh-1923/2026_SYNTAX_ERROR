export default function MissionCard({ title, description, index }) {
  return (
    <div className="mission-card">
      <span className="mission-card__corner mission-card__corner--tl" />
      <span className="mission-card__corner mission-card__corner--br" />
      {index && <span className="mission-card__index">{index}</span>}
      <span className="mission-card__title">{title}</span>
      <p className="mission-card__desc">{description}</p>

      <style>{`
        .mission-card {
          position: relative;
          background: var(--bg-panel);
          border: 1px solid var(--border-faint);
          padding: 2.2rem 1.8rem 1.8rem;
          backdrop-filter: blur(8px);
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .mission-card:hover {
          border-color: var(--border-mid);
          background: var(--bg-panel-strong);
        }
        .mission-card:hover .mission-card__corner { opacity: 1; }
        .mission-card__corner {
          position: absolute;
          width: 10px; height: 10px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .mission-card__corner--tl { top: -1px; left: -1px; border-top: 1px solid var(--accent); border-left: 1px solid var(--accent); }
        .mission-card__corner--br { bottom: -1px; right: -1px; border-bottom: 1px solid var(--accent); border-right: 1px solid var(--accent); }
        .mission-card__index {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--text-tertiary);
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
        }
        .mission-card__title {
          display: block;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.16em;
          color: var(--accent);
          margin-bottom: 0.9rem;
        }
        .mission-card__desc {
          color: var(--text-secondary);
          line-height: 1.65;
          font-size: 0.92rem;
        }
      `}</style>
    </div>
  )
}