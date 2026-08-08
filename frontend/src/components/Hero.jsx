import { useRef, useCallback } from 'react'
import StarField from './StarField.jsx'

export default function Hero({ onEnterExplorer, onLearnMore }) {
  const sceneRef = useRef(null)

  const handleMove = useCallback((e) => {
    const el = sceneRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--tx', `${px * 10}px`)
    el.style.setProperty('--ty', `${py * 10}px`)
  }, [])

  return (
    <section id="top" className="hero" onMouseMove={handleMove}>
      <StarField />
      <div className="hero__vignette" aria-hidden="true" />
      <div className="grid-overlay hero__grid" aria-hidden="true" />

      <div className="hero__scene" ref={sceneRef} aria-hidden="true">
        <div className="hero__star" />
        <div className="hero__haze" />

        <div className="hero__orbit hero__orbit--outer">
          <div className="hero__planet-wrap">
            <div className="hero__ring" />
            <div className="hero__planet">
              <div className="hero__terminator" />
              <div className="hero__rim" />
            </div>
          </div>
        </div>
        <div className="hero__orbit hero__orbit--inner" />

        <div className="hero__annotation hero__annotation--1">
          <span className="hero__tick" />
          RADIUS · 1.2 R⊕
        </div>
        <div className="hero__annotation hero__annotation--2">
          <span className="hero__tick" />
          ORBITAL PERIOD · ANALYZED
        </div>
        <div className="hero__annotation hero__annotation--3">
          <span className="hero__tick" />
          HOST STAR · G-TYPE
        </div>
      </div>

      <div className="hero__content">
        <span className="hero__eyebrow">EXPLAINABLE EXOPLANET ANALYSIS</span>
        <h1 className="hero__headline">
          THE SEARCH<br />
          FOR HABITABLE WORLDS<br />
          STARTS WITH DATA.
        </h1>
        <p className="hero__subtitle">
          Explore confirmed exoplanets through planetary, orbital, and stellar
          properties — with every classification explained.
        </p>
        <div className="hero__actions">
          <button className="btn btn--primary" onClick={onEnterExplorer}>
            Explore Exoplanets <span className="btn__arrow">→</span>
          </button>
          <button className="btn btn--ghost" onClick={onLearnMore}>
            How It Works
          </button>
        </div>
      </div>

      <div className="hero__scroll-cue" aria-hidden="true">
        <span>SCROLL</span>
        <div className="hero__scroll-line" />
      </div>

      <style>{`
        .hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 8rem 6vw 4rem;
          background: var(--bg-void);
          overflow: hidden;
        }
        .hero__vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 55% 45% at 50% 24%, rgba(70, 90, 130, 0.14), transparent 70%),
            radial-gradient(ellipse 70% 60% at 50% 100%, rgba(3,4,8,0.9), transparent 60%);
          pointer-events: none;
        }
        .hero__grid { opacity: 0.5; }

        .hero__content { position: relative; z-index: 3; max-width: 760px; }
        .hero__eyebrow {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.28em;
          color: var(--accent);
          opacity: 0.85;
          margin-bottom: 1.6rem;
        }
        .hero__eyebrow::before {
          content: '';
          display: inline-block;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--accent);
          margin-right: 0.7em;
          vertical-align: middle;
          box-shadow: 0 0 8px var(--accent);
        }
        .hero__headline {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(2rem, 5.4vw, 3.8rem);
          line-height: 1.1;
          letter-spacing: -0.015em;
          color: var(--text-primary);
        }
        .hero__subtitle {
          margin: 1.7rem auto 0;
          max-width: 520px;
          color: var(--text-secondary);
          font-size: 1.02rem;
          line-height: 1.7;
          font-weight: 400;
        }
        .hero__actions {
          margin-top: 2.5rem;
          display: flex;
          gap: 0.9rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn {
          border-radius: 4px;
          padding: 0.85rem 1.7rem;
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          border: 1px solid transparent;
          transition: box-shadow 0.3s ease, background 0.3s ease, transform 0.2s ease, border-color 0.3s ease, color 0.3s ease;
        }
        .btn--primary {
          background: var(--text-primary);
          color: #05070d;
        }
        .btn--primary:hover {
          box-shadow: 0 0 0 1px var(--accent), 0 0 28px var(--accent-glow);
          transform: translateY(-1px);
        }
        .btn__arrow { display: inline-block; transition: transform 0.25s ease; }
        .btn--primary:hover .btn__arrow { transform: translateX(3px); }
        .btn--ghost {
          background: transparent;
          border-color: var(--border-mid);
          color: var(--text-primary);
        }
        .btn--ghost:hover {
          border-color: var(--accent-dim);
          color: var(--accent);
        }

        .hero__scene {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          --tx: 0px; --ty: 0px;
        }
        .hero__star {
          position: absolute;
          top: 14%;
          right: 20%;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff6e4;
          box-shadow: 0 0 2px 1px #fff6e4, 0 0 22px 4px rgba(255, 236, 190, 0.45);
          animation: pulse-star 5s ease-in-out infinite;
          transform: translate(var(--tx), var(--ty));
        }
        .hero__haze {
          position: absolute;
          top: 6%;
          right: 10%;
          width: 420px;
          height: 420px;
          background: radial-gradient(circle, rgba(232, 201, 136, 0.06), transparent 70%);
          pointer-events: none;
        }
        .hero__orbit {
          border: 1px solid var(--border-faint);
          border-radius: 50%;
        }
        .hero__orbit--outer {
          width: min(50vw, 580px);
          height: min(50vw, 580px);
          display: flex;
          align-items: center;
          animation: spin 140s linear infinite;
          transform: translate(calc(var(--tx) * -0.6), calc(var(--ty) * -0.6));
        }
        .hero__orbit--inner {
          position: absolute;
          width: min(30vw, 360px);
          height: min(30vw, 360px);
          border-style: dashed;
          opacity: 0.4;
        }
        .hero__planet-wrap {
          position: relative;
          width: 96px;
          height: 96px;
          animation: float 7s ease-in-out infinite;
        }
        .hero__ring {
          position: absolute;
          top: 50%; left: 50%;
          width: 168px; height: 42px;
          transform: translate(-50%, -50%) rotate(-14deg);
          border: 1px solid rgba(150, 175, 210, 0.28);
          border-radius: 50%;
          pointer-events: none;
        }
        .hero__planet {
          position: relative;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 28%, #b6c4e6 0%, #7d8bc4 34%, #454f86 62%, #1c2148 100%);
          box-shadow:
            0 0 0 1px rgba(150,175,220,0.08),
            0 0 40px 6px rgba(90, 110, 180, 0.14);
          overflow: hidden;
        }
        .hero__terminator {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle at 78% 74%, rgba(0,0,0,0.75), transparent 62%);
        }
        .hero__rim {
          position: absolute;
          inset: -1px;
          border-radius: 50%;
          box-shadow: inset -3px -2px 4px rgba(140, 220, 255, 0.25);
        }

        .hero__annotation {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 0.5em;
          font-family: var(--font-mono);
          font-size: 0.64rem;
          letter-spacing: 0.1em;
          color: var(--text-tertiary);
        }
        .hero__tick {
          width: 12px;
          height: 1px;
          background: var(--accent-dim);
        }
        .hero__annotation--1 { top: 32%; left: 12%; }
        .hero__annotation--2 { bottom: 24%; right: 10%; }
        .hero__annotation--3 { top: 16%; right: 22%; }

        .hero__scroll-cue {
          position: absolute;
          bottom: 2.4rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.24em;
          color: var(--text-tertiary);
          z-index: 3;
        }
        .hero__scroll-line {
          width: 1px;
          height: 26px;
          background: linear-gradient(180deg, var(--text-tertiary), transparent);
          animation: scroll-cue 2.2s ease-in-out infinite;
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulse-star { 0%, 100% { opacity: 0.75; } 50% { opacity: 1; } }
        @keyframes scroll-cue { 0% { transform: scaleY(0.3); opacity: 0.3; } 50% { transform: scaleY(1); opacity: 1; } 100% { transform: scaleY(0.3); opacity: 0.3; } }

        @media (prefers-reduced-motion: reduce) {
          .hero__orbit--outer, .hero__planet-wrap, .hero__star, .hero__scroll-line { animation: none !important; }
        }
        @media (max-width: 768px) {
          .hero__annotation { display: none; }
          .hero__scroll-cue { display: none; }
        }
      `}</style>
    </section>
  )
}