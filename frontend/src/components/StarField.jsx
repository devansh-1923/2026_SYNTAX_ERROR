import { useMemo, useEffect, useRef } from 'react'

function seedStars(count, seed, sizeRange, opacityRange) {
  const stars = []
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * 100,
      y: rand() * 100,
      size: sizeRange[0] + rand() * (sizeRange[1] - sizeRange[0]),
      delay: rand() * 8,
      duration: 3 + rand() * 4,
      opacity: opacityRange[0] + rand() * (opacityRange[1] - opacityRange[0]),
      twinkle: rand() > 0.75,
    })
  }
  return stars
}

function Layer({ stars, depth, parallax }) {
  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translate3d(${parallax.x * depth}px, ${parallax.y * depth}px, 0)`,
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={`${s.x}%`}
          cy={`${s.y}%`}
          r={s.size}
          fill="#eef1ff"
          opacity={s.opacity}
          className={s.twinkle ? 'sf-twinkle' : ''}
          style={s.twinkle ? { animationDelay: `${s.delay}s`, animationDuration: `${s.duration}s` } : undefined}
        />
      ))}
    </svg>
  )
}

export default function StarField({ className = '', interactive = false }) {
  const far = useMemo(() => seedStars(140, 11, [0.3, 0.7], [0.2, 0.5]), [])
  const mid = useMemo(() => seedStars(70, 37, [0.6, 1.1], [0.35, 0.7]), [])
  const near = useMemo(() => seedStars(30, 91, [1.0, 1.8], [0.5, 0.95]), [])

  const parallaxRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!interactive) return
    const el = containerRef.current
    if (!el) return
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      if (parallaxRef.current) {
        parallaxRef.current.style.setProperty('--px', px)
        parallaxRef.current.style.setProperty('--py', py)
      }
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [interactive])

  return (
    <div ref={containerRef} className={`starfield ${className}`} aria-hidden="true">
      <div ref={parallaxRef} className="starfield__parallax">
        <Layer stars={far} depth={4} parallax={{ x: 0, y: 0 }} />
        <Layer stars={mid} depth={9} parallax={{ x: 0, y: 0 }} />
        <Layer stars={near} depth={16} parallax={{ x: 0, y: 0 }} />
      </div>
      <style>{`
        .starfield {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .starfield__parallax { position: absolute; inset: -20px; }
        .sf-twinkle { animation-name: sf-twinkle; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        @keyframes sf-twinkle {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sf-twinkle { animation: none !important; opacity: 0.55; }
        }
      `}</style>
    </div>
  )
}