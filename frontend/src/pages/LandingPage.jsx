import { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import MissionCard from '../components/MissionCard.jsx'
import FeatureCard from '../components/FeatureCard.jsx'
import ExploreCTA from '../components/ExploreCTA.jsx'
import Footer from '../components/Footer.jsx'

const MISSION_CARDS = [
  { index: '01', title: 'PLANET', description: 'Size and physical properties' },
  { index: '02', title: 'ORBIT', description: 'Orbital environment and received stellar energy' },
  { index: '03', title: 'STAR', description: 'Host-star environment' },
]

const PIPELINE_STEPS = [
  'NASA EXOPLANET DATA',
  'PLANET + STAR PARAMETERS',
  'SCIENTIFIC ANALYSIS',
  'EXPLAINABLE CLASSIFICATION',
  'INTERACTIVE EXPLORATION',
]

const SCIENCE_CARDS = [
  { title: 'Planetary Properties', description: 'Radius, mass, and other physical characteristics as recorded in the archive.' },
  { title: 'Orbital Environment', description: 'Orbital period, distance, and eccentricity relative to the host star.' },
  { title: 'Stellar Environment', description: 'Host-star type, temperature, and luminosity context.' },
  { title: 'Temperature & Insolation', description: 'Estimated energy received, used as one contributing factor among several.' },
  { title: 'Data Availability', description: 'Classifications are only as complete as the underlying archive data.' },
]

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function Divider() {
  return <div className="section-divider" aria-hidden="true" />
}

export default function LandingPage({ onEnterExplorer }) {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="landing-page">
      <Navbar onEnterExplorer={onEnterExplorer} />
      <Hero onEnterExplorer={onEnterExplorer} onLearnMore={scrollToHowItWorks} />

      <Divider />

      <section id="mission" className="section">
        <div className="grid-overlay" aria-hidden="true" />
        <Reveal>
          <span className="section-kicker">Mission</span>
          <h2 className="section-heading">BEYOND A SCORE.</h2>
          <p className="section-body">
            HabitaX is designed to make habitability assessment interpretable.
            Instead of hiding the reasoning behind a black-box number, the interface
            surfaces the planetary and stellar factors that influence a candidate's
            classification.
          </p>
        </Reveal>
        <div className="mission-grid">
          {MISSION_CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 90}>
              <MissionCard {...c} />
            </Reveal>
          ))}
        </div>
      </section>

      <Divider />

      <section id="how-it-works" className="section">
        <Reveal>
          <span className="section-kicker">How It Works</span>
          <h2 className="section-heading">FROM ARCHIVE TO INSIGHT.</h2>
        </Reveal>
        <div className="pipeline">
          {PIPELINE_STEPS.map((step, i) => (
            <Reveal key={step} className="pipeline__row" delay={i * 70}>
              <div className="pipeline__node">
                <span className="pipeline__index">{String(i + 1).padStart(2, '0')}</span>
                <span className="pipeline__label">{step}</span>
              </div>
              {i < PIPELINE_STEPS.length - 1 && <div className="pipeline__connector" />}
            </Reveal>
          ))}
        </div>
      </section>

      <Divider />

      <section id="science" className="section">
        <Reveal>
          <span className="section-kicker">Transparency</span>
          <h2 className="section-heading">NO BLACK BOX.</h2>
        </Reveal>
        <div className="science-grid">
          {SCIENCE_CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 60}>
              <FeatureCard {...c} />
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="disclaimer">
            Potential habitability is a prioritization framework, not evidence of
            life or a confirmation of surface conditions.
          </p>
        </Reveal>
      </section>

      <ExploreCTA onEnterExplorer={onEnterExplorer} />
      <Footer />

      <style>{`
        .landing-page { position: relative; }

        .section-divider {
          height: 1px;
          max-width: 1400px;
          margin: 0 auto;
          background: linear-gradient(90deg, transparent, var(--border-mid) 50%, transparent);
        }

        .section-kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.6em;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 600;
          margin-bottom: 1.1rem;
        }
        .section-kicker::before {
          content: '';
          width: 14px; height: 1px;
          background: var(--accent-dim);
        }
        .section-heading {
          font-family: var(--font-display);
          font-size: clamp(1.9rem, 4.6vw, 3rem);
          font-weight: 600;
          line-height: 1.12;
          letter-spacing: -0.01em;
          margin-bottom: 1.4rem;
        }
        .section-body {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.75;
          max-width: 640px;
        }

        .mission-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--border-faint);
          margin-top: 3rem;
        }
        .mission-grid > .reveal { background: var(--bg-void); }

        .science-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--border-faint);
          margin-top: 3rem;
        }
        .science-grid > .reveal { background: var(--bg-void); }

        .disclaimer {
          margin-top: 2.4rem;
          padding: 1.1rem 1.4rem;
          border-left: 2px solid var(--accent-dim);
          background: var(--bg-panel);
          color: var(--text-secondary);
          font-size: 0.88rem;
          line-height: 1.65;
          max-width: 700px;
        }

        .pipeline {
          margin-top: 3.5rem;
          display: flex;
          flex-direction: column;
        }
        .pipeline__row { display: flex; flex-direction: column; align-items: center; }
        .pipeline__node {
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid var(--border-faint);
          padding: 0.9rem 1.8rem;
          background: var(--bg-panel);
          backdrop-filter: blur(8px);
          width: min(100%, 420px);
          transition: border-color 0.3s ease;
        }
        .pipeline__row:hover .pipeline__node { border-color: var(--border-mid); }
        .pipeline__index {
          font-family: var(--font-mono);
          color: var(--accent);
          font-size: 0.8rem;
        }
        .pipeline__label {
          font-size: 0.82rem;
          letter-spacing: 0.08em;
          color: var(--text-primary);
        }
        .pipeline__connector {
          width: 1px;
          height: 38px;
          background: linear-gradient(180deg, var(--border-mid), transparent);
          position: relative;
        }
        .pipeline__connector::after {
          content: '';
          position: absolute;
          top: 0; left: 50%;
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--accent);
          transform: translateX(-50%);
          animation: pulse-down 2.6s ease-in-out infinite;
        }
        @keyframes pulse-down {
          0% { top: 0; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pipeline__connector::after { animation: none; opacity: 0.6; top: 50%; }
        }
        @media (max-width: 900px) {
          .mission-grid, .science-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}