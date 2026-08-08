import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'Mission', id: 'mission' },
  { label: 'Explore', id: 'how-it-works' },
  { label: 'Methodology', id: 'science' },
]

export default function Navbar({ onEnterExplorer }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <a href="#top" className="navbar__brand" onClick={scrollTo('top')}>
        <span className="navbar__brand-mark" />
        HABITAX
      </a>

      <nav className="navbar__links" aria-label="Primary">
        {LINKS.map((l) => (
          <a key={l.id} href={`#${l.id}`} onClick={scrollTo(l.id)}>
            {l.label}
          </a>
        ))}
      </nav>

      <button className="navbar__cta" onClick={onEnterExplorer}>
        Explore Exoplanets
      </button>

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 6vw;
          background: transparent;
          border-bottom: 1px solid transparent;
          transition: background 0.4s ease, border-color 0.4s ease, padding 0.4s ease;
        }
        .navbar--scrolled {
          background: rgba(3, 4, 8, 0.78);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-faint);
          padding: 1.05rem 6vw;
        }
        .navbar__brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 1.05rem;
          letter-spacing: 0.16em;
          color: var(--text-primary);
        }
        .navbar__brand-mark {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
        }
        .navbar__links {
          display: flex;
          gap: 2.6rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .navbar__links a {
          position: relative;
          padding-bottom: 4px;
          transition: color 0.25s ease;
        }
        .navbar__links a:hover { color: var(--text-primary); }
        .navbar__links a::after {
          content: '';
          position: absolute;
          left: 0; bottom: 0;
          width: 0; height: 1px;
          background: var(--accent);
          transition: width 0.3s ease;
        }
        .navbar__links a:hover::after { width: 100%; }
        .navbar__cta {
          border: 1px solid var(--border-mid);
          color: var(--text-primary);
          padding: 0.55rem 1.2rem;
          font-size: 0.8rem;
          letter-spacing: 0.02em;
          transition: border-color 0.3s ease, color 0.3s ease, background 0.3s ease;
        }
        .navbar__cta:hover {
          border-color: var(--accent-dim);
          color: var(--accent);
          background: rgba(127, 224, 212, 0.05);
        }
        @media (max-width: 768px) {
          .navbar__links { display: none; }
        }
      `}</style>
    </header>
  )
}