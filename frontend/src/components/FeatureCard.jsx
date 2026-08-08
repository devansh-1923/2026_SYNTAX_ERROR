export default function FeatureCard({ title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-card__bar" />
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__desc">{description}</p>

      <style>{`
        .feature-card {
          position: relative;
          border: 1px solid var(--border-faint);
          padding: 1.6rem 1.5rem;
          background: var(--bg-panel);
          transition: border-color 0.3s ease, transform 0.2s ease;
        }
        .feature-card:hover {
          border-color: var(--border-mid);
          transform: translateY(-2px);
        }
        .feature-card__bar {
          width: 20px; height: 2px;
          background: var(--accent-dim);
          margin-bottom: 1rem;
          transition: width 0.3s ease, background 0.3s ease;
        }
        .feature-card:hover .feature-card__bar {
          width: 36px;
          background: var(--accent);
        }
        .feature-card__title {
          font-family: var(--font-display);
          font-size: 0.98rem;
          font-weight: 600;
          margin-bottom: 0.6rem;
          letter-spacing: -0.01em;
        }
        .feature-card__desc {
          color: var(--text-secondary);
          font-size: 0.88rem;
          line-height: 1.65;
        }
      `}</style>
    </div>
  )
}