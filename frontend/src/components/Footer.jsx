export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__brand">HABITAX</div>
      <p className="footer__tagline">Explainable Exoplanet Habitability Explorer</p>
      <p className="footer__source">Data source: NASA Exoplanet Archive</p>
      <p className="footer__disclaimer">
        Scientific classifications are exploratory and should not be interpreted
        as confirmation of habitability or life.
      </p>

      <style>{`
        .footer {
          border-top: 1px solid var(--border-faint);
          padding: 3.5rem 6vw 2.5rem;
          text-align: center;
          color: var(--text-tertiary);
        }
        .footer__brand {
          font-family: var(--font-display);
          letter-spacing: 0.16em;
          color: var(--text-secondary);
          margin-bottom: 0.6rem;
        }
        .footer__tagline { font-size: 0.85rem; margin-bottom: 1rem; }
        .footer__source { font-size: 0.78rem; margin-bottom: 0.4rem; }
        .footer__disclaimer {
          font-size: 0.75rem;
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.5;
        }
      `}</style>
    </footer>
  )
}