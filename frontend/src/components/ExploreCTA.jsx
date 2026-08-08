export default function ExploreCTA({ onEnterExplorer }) {
  return (
    <section className="explore-cta">
      <div className="grid-overlay explore-cta__grid" aria-hidden="true" />
      <span className="explore-cta__corner explore-cta__corner--tl" aria-hidden="true" />
      <span className="explore-cta__corner explore-cta__corner--br" aria-hidden="true" />

      <span className="section-kicker">Begin</span>
      <h2 className="explore-cta__heading">
        WHICH WORLD<br />WILL YOU EXPLORE?
      </h2>
      <button className="btn btn--primary explore-cta__btn" onClick={onEnterExplorer}>
        Enter the Explorer <span className="btn__arrow">→</span>
      </button>

      <style>{`
        .explore-cta {
          position: relative;
          text-align: center;
          padding: 8rem 6vw;
          margin: 2rem 6vw 0;
          overflow: hidden;
          border: 1px solid var(--border-faint);
          background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(90, 110, 150, 0.06), transparent 70%);
        }
        .explore-cta__grid { opacity: 0.6; }
        .explore-cta__corner {
          position: absolute;
          width: 22px; height: 22px;
        }
        .explore-cta__corner--tl { top: 16px; left: 16px; border-top: 1px solid var(--accent-dim); border-left: 1px solid var(--accent-dim); }
        .explore-cta__corner--br { bottom: 16px; right: 16px; border-bottom: 1px solid var(--accent-dim); border-right: 1px solid var(--accent-dim); }
        .explore-cta__heading {
          position: relative;
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 4.6vw, 2.9rem);
          font-weight: 600;
          line-height: 1.15;
          margin: 1.2rem 0 2.4rem;
        }
        .explore-cta__btn {
          position: relative;
          font-size: 0.95rem;
          padding: 0.95rem 2.1rem;
        }
      `}</style>
    </section>
  )
}