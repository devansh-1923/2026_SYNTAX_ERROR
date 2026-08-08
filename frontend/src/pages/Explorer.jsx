import { useState, useMemo, useEffect } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StarField from '../components/StarField.jsx'
import { getPlanets, getPlanetAnalysis } from "../services/api.js";

const PAGE_STEP = 50

function fmt(val, unit = '', decimals = 2) {
  return typeof val === 'number' && !Number.isNaN(val) ? `${val.toFixed(decimals)}${unit}` : 'N/A'
}

function StatusDot({ status }) {
  const label = status === 'success' ? 'NASA DATA CONNECTED' : status === 'error' ? 'DATA OFFLINE' : 'CONNECTING...'
  const cls = status === 'success' ? 'ok' : status === 'error' ? 'err' : 'pending'
  return (
    <span className={`status status--${cls}`}>
      <span className="status__dot" /> {label}
    </span>
  )
}

function Flags({ p }) {
  const flags = []
  if (typeof p.pl_rade === 'number') flags.push('Planet radius available')
  if (typeof p.pl_orbsmax === 'number') flags.push('Orbital distance available')
  if (typeof p.pl_eqt === 'number') flags.push('Equilibrium temperature available')
  if (typeof p.st_teff === 'number') flags.push('Host-star temperature available')
  if (typeof p.pl_insol === 'number') flags.push('Stellar insolation available')

  return (
    <div className="flags">
      <h4>WHY THIS WORLD IS INTERESTING</h4>
      {flags.length === 0 ? (
        <p className="flags__none">Insufficient data — requires further investigation.</p>
      ) : (
        <ul>
          {flags.map((f) => <li key={f}>{f}</li>)}
        </ul>
      )}
      <p className="flags__disclaimer">
        Potential habitability requires additional information such as atmospheric
        composition, surface conditions, and sustained liquid-water stability. These
        catalog measurements are screening indicators, not evidence of life.
      </p>
    </div>
  )
}

export default function Explorer({ onBack }) {
  const [data, setData] = useState([]);
const [status, setStatus] = useState("loading");
const [error, setError] = useState(null);

const loadPlanets = () => {
  setStatus("loading");
  setError(null);

  getPlanets()
    .then((response) => {
      const planets = Array.isArray(response)
        ? response
        : response?.planets || response?.data || [];

      setData(planets);
      setStatus("success");
    })
    .catch((err) => {
      console.error("Failed to load planets:", err);
      setError(err);
      setStatus("error");
    });
};

useEffect(() => {
  loadPlanets();
}, []);

const retry = loadPlanets;

 const planets = Array.isArray(data)
  ? data
  : data?.planets || data?.data || data?.results || [];

  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_STEP)
  const [selected, setSelected] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisError, setAnalysisError] = useState(null)
  const selectPlanet = async (planet) => {
  setSelected(planet)
  setAnalysis(null)
  setAnalysisError(null)
  setAnalysisLoading(true)

  try {
    const result = await getPlanetAnalysis(planet.pl_name)
    setAnalysis(result.analysis)
  } catch (err) {
    console.error("Failed to load habitability analysis:", err)
    setAnalysisError(err)
  } finally {
    setAnalysisLoading(false)
  }
}

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return planets
    return planets.filter(
      (p) =>
        p.pl_name?.toLowerCase().includes(q) ||
        p.hostname?.toLowerCase().includes(q)
    )
  }, [planets, query])

  const stats = useMemo(() => {
    const hostSet = new Set(planets.map((p) => p.hostname).filter(Boolean))
    return {
      loaded: planets.length,
      hosts: hostSet.size,
      radius: planets.filter((p) => typeof p.pl_rade === 'number').length,
      temp: planets.filter((p) => typeof p.pl_eqt === 'number').length,
    }
  }, [planets])

  const chartData = useMemo(
    () =>
      planets
        .filter((p) => typeof p.pl_orbsmax === 'number' && typeof p.pl_rade === 'number')
        .slice(0, 400),
    [planets]
  )

  const visible = filtered.slice(0, visibleCount)

  return (
    <div className="explorer">
      <StarField />
      <div className="grid-overlay explorer__grid" aria-hidden="true" />

      <header className="explorer__nav">
        <button className="explorer__brand" onClick={onBack}>
          <span className="explorer__brand-mark" /> HABITAX
        </button>
        <nav className="explorer__navlinks">
          <button onClick={onBack}>Dashboard</button>
          <span className="explorer__navlinks-active">Explorer</span>
          <a href="#top" onClick={(e) => { e.preventDefault(); onBack(); setTimeout(() => document.getElementById('science')?.scrollIntoView({ behavior: 'smooth' }), 50) }}>Science</a>
        </nav>
        <StatusDot status={status} />
      </header>

      <div className="explorer__header">
        <span className="section-kicker">Live Catalog</span>
        <h1>EXPLORE EXOPLANETS</h1>
        <p>Search and investigate confirmed worlds using measurable planetary and stellar properties.</p>
        <input
          className="explorer__search"
          type="text"
          placeholder="Search planet or host star..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setVisibleCount(PAGE_STEP) }}
          disabled={status !== 'success'}
        />
      </div>

      {status === 'loading' && (
        <div className="explorer__state">
          <div className="loader" />
          <p>CONNECTING TO NASA EXOPLANET CATALOG...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="explorer__state explorer__state--error">
          <p className="explorer__state-title">NASA DATA LINK UNAVAILABLE</p>
          <p>Unable to retrieve the current catalog response.{error?.message ? ` (${error.message})` : ''}</p>
          <button className="btn btn--ghost" onClick={retry}>Retry</button>
        </div>
      )}

      {status === 'success' && (
        <>
          <section className="explorer__stats">
            <span className="explorer__stats-label">FROM CURRENT CATALOG RESPONSE</span>
            <div className="explorer__stats-grid">
              <div className="stat"><span>{stats.loaded}</span><label>PLANETS LOADED</label></div>
              <div className="stat"><span>{stats.hosts}</span><label>HOST STARS</label></div>
              <div className="stat"><span>{stats.radius}</span><label>RADIUS DATA</label></div>
              <div className="stat"><span>{stats.temp}</span><label>TEMPERATURE DATA</label></div>
            </div>
          </section>

          {chartData.length > 0 && (
            <section className="explorer__chart">
              <h3>Orbital Distance vs. Planet Radius</h3>
              <ResponsiveContainer width="100%" height={380}>
                <ScatterChart margin={{ top: 10, right: 24, bottom: 24, left: 8 }}>
                  <CartesianGrid stroke="rgba(160,175,220,0.08)" />
                  <XAxis
                    dataKey="pl_orbsmax" type="number" name="Orbital Distance"
                    label={{ value: 'Orbital Distance (AU)', position: 'insideBottom', offset: -14, fill: '#98a2bd', fontSize: 12 }}
                    tick={{ fill: '#565f79', fontSize: 11 }} stroke="rgba(160,175,220,0.2)"
                  />
                  <YAxis
                    dataKey="pl_rade" type="number" name="Planet Radius"
                    label={{ value: 'Planet Radius (Earth radii)', angle: -90, position: 'insideLeft', fill: '#98a2bd', fontSize: 12 }}
                    tick={{ fill: '#565f79', fontSize: 11 }} stroke="rgba(160,175,220,0.2)"
                  />
                  <ZAxis range={[40, 40]} />
                  <Tooltip
                    cursor={{ stroke: '#7fe0d4', strokeWidth: 1 }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const p = payload[0].payload
                      return (
                        <div className="chart-tooltip">
                          <strong>{p.pl_name || 'Unknown'}</strong>
                          <div>Host: {p.hostname || 'N/A'}</div>
                          <div>Orbital Distance: {fmt(p.pl_orbsmax, ' AU')}</div>
                          <div>Radius: {fmt(p.pl_rade, ' R⊕')}</div>
                          <div>Eq. Temp: {fmt(p.pl_eqt, ' K', 0)}</div>
                        </div>
                      )
                    }}
                  />
                  <Scatter data={chartData} fill="#7fe0d4" fillOpacity={0.75} onClick={(p) => selectPlanet(p)} cursor="pointer" />
                </ScatterChart>
              </ResponsiveContainer>
            </section>
          )}

          <section className="explorer__table-wrap">
            <h3>Planet Catalog {query && `— matches for "${query}"`}</h3>
            <div className="explorer__table-scroll">
              <table className="explorer__table">
                <thead>
                  <tr>
                    <th>Planet</th><th>Host Star</th><th>Radius</th><th>Mass</th>
                    <th>Orbital Dist.</th><th>Eq. Temp</th><th>Stellar Temp</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p, i) => (
                    <tr key={p.pl_name || i} className={selected?.pl_name === p.pl_name ? 'is-selected' : ''}>
                      <td>{p.pl_name || 'N/A'}</td>
                      <td>{p.hostname || 'N/A'}</td>
                      <td>{fmt(p.pl_rade, ' R⊕')}</td>
                      <td>{fmt(p.pl_bmasse, ' M⊕')}</td>
                      <td>{fmt(p.pl_orbsmax, ' AU')}</td>
                      <td>{fmt(p.pl_eqt, ' K', 0)}</td>
                      <td>{fmt(p.st_teff, ' K', 0)}</td>
                      <td><button className="view-btn" onClick={() => selectPlanet(p)}>View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visibleCount < filtered.length && (
              <button className="btn btn--ghost show-more" onClick={() => setVisibleCount((v) => v + PAGE_STEP)}>
                Show more ({filtered.length - visibleCount} remaining)
              </button>
            )}
          </section>

          {selected && (
            <div className="detail-overlay" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
              <div className="detail-panel">
                <button className="detail-panel__close" onClick={() => setSelected(null)} aria-label="Close">✕</button>
                <span className="section-kicker">Selected World</span>
                <h2>{selected.pl_name || 'N/A'}</h2>
                <p className="detail-panel__host">Host Star: {selected.hostname || 'N/A'}</p>

                <div className="detail-grid">
                  <div>
                    <h4>Planetary Properties</h4>
                    <dl>
                      <dt>Radius</dt><dd>{fmt(selected.pl_rade, ' R⊕')}</dd>
                      <dt>Mass</dt><dd>{fmt(selected.pl_bmasse, ' M⊕')}</dd>
                      <dt>Density</dt><dd>{fmt(selected.pl_dens, ' g/cm³')}</dd>
                    </dl>
                  </div>
                  <div>
                    <h4>Orbital Properties</h4>
                    <dl>
                      <dt>Orbital Distance</dt><dd>{fmt(selected.pl_orbsmax, ' AU')}</dd>
                      <dt>Orbital Period</dt><dd>{fmt(selected.pl_orbper, ' days')}</dd>
                      <dt>Insolation</dt><dd>{fmt(selected.pl_insol, ' S⊕')}</dd>
                    </dl>
                  </div>
                  <div>
                    <h4>Thermal</h4>
                    <dl>
                      <dt>Equilibrium Temp</dt><dd>{fmt(selected.pl_eqt, ' K', 0)}</dd>
                    </dl>
                  </div>
                  <div>
                    <h4>Host Star</h4>
                    <dl>
                      <dt>Stellar Temp</dt><dd>{fmt(selected.st_teff, ' K', 0)}</dd>
                      <dt>Stellar Radius</dt><dd>{fmt(selected.st_rad, ' R☉')}</dd>
                      <dt>Stellar Mass</dt><dd>{fmt(selected.st_mass, ' M☉')}</dd>
                      <dt>Spectral Type</dt><dd>{selected.st_spectype || 'N/A'}</dd>
                    </dl>
                  </div>
                </div>

                <Flags p={selected} /><Flags p={selected} />

<div className="habitability-panel">
  <h4>Habitability Potential</h4>

  {analysisLoading && (
    <p>Analyzing planetary conditions...</p>
  )}

  {analysisError && (
    <p>
      Unable to load habitability analysis.
    </p>
  )}

  {analysis && (
    <>
      <div className="habitability-result">
        <strong>{analysis.classification}</strong>

        {analysis.score !== null && (
          <span>
            {analysis.score}% screening match
          </span>
        )}
      </div>

      <div className="habitability-counts">
        <span>
          ✓ {analysis.favorable_factors} Favorable
        </span>

        <span>
          ⚠ {analysis.uncertain_factors} Unknown
        </span>

        <span>
          ✕ {analysis.unfavorable_factors} Unfavorable
        </span>
      </div>

      <div className="habitability-factors">
        <h5>Why?</h5>

        {analysis.factors?.map((factor) => (
          <div key={factor.factor} className="factor">
            <strong>{factor.factor}</strong>

            <span>
              {factor.value !== null && factor.value !== undefined
                ? `${factor.value} ${factor.unit || ''}`
                : 'N/A'}
            </span>

            <p>{factor.explanation}</p>
          </div>
        ))}
      </div>

      <p className="habitability-disclaimer">
        {analysis.disclaimer}
      </p>
    </>
  )}
</div>
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        .explorer { position: relative; min-height: 100vh; padding: 6rem 6vw 5rem; background: var(--bg-void); }
        .explorer__grid { opacity: 0.4; }
        .explorer__nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 6vw; background: rgba(3,4,8,0.8); backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-faint);
        }
          .habitability-panel {
  margin-top: 2rem;
  padding: 1.5rem;
  border: 1px solid var(--border-faint);
  background: var(--bg-panel);
}

.habitability-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 1rem 0;
}

.habitability-result strong {
  font-size: 1.3rem;
  color: var(--accent);
}

.habitability-result span {
  font-family: var(--font-mono);
  color: var(--text-secondary);
}

.habitability-counts {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 1rem 0;
  font-size: 0.85rem;
}

.habitability-factors {
  margin-top: 1.5rem;
}

.factor {
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--border-faint);
}

.factor strong {
  display: block;
}

.factor span {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.8rem;
}

.factor p {
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.5;
  margin-top: 0.3rem;
}

.habitability-disclaimer {
  margin-top: 1.2rem;
  color: var(--text-tertiary);
  font-size: 0.75rem;
  line-height: 1.5;
}
        .explorer__brand { display: flex; align-items: center; gap: 0.6rem; font-family: var(--font-display); font-weight: 600; letter-spacing: 0.16em; color: var(--text-primary); font-size: 1rem; }
        .explorer__brand-mark { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px var(--accent); }
        .explorer__navlinks { display: flex; gap: 2rem; font-size: 0.85rem; color: var(--text-secondary); }
        .explorer__navlinks button, .explorer__navlinks a { color: var(--text-secondary); transition: color 0.2s; }
        .explorer__navlinks button:hover, .explorer__navlinks a:hover { color: var(--text-primary); }
        .explorer__navlinks-active { color: var(--accent); border-bottom: 1px solid var(--accent); padding-bottom: 3px; }
        @media (max-width: 768px) { .explorer__navlinks { display: none; } }

        .status { display: flex; align-items: center; gap: 0.5em; font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.08em; color: var(--text-secondary); }
        .status__dot { width: 6px; height: 6px; border-radius: 50%; }
        .status--ok .status__dot { background: var(--accent); box-shadow: 0 0 8px var(--accent); }
        .status--err .status__dot { background: #e08787; box-shadow: 0 0 8px rgba(224,135,135,0.6); }
        .status--pending .status__dot { background: var(--accent-warm); animation: sf-twinkle 1.2s ease-in-out infinite; }

        .explorer__header { position: relative; max-width: 720px; margin: 2rem auto 3rem; text-align: center; }
        .explorer__header h1 { font-family: var(--font-display); font-size: clamp(1.9rem, 5vw, 3.1rem); font-weight: 600; margin: 0.8rem 0 1rem; }
        .explorer__header p { color: var(--text-secondary); line-height: 1.6; margin-bottom: 2rem; }
        .explorer__search {
          width: 100%; max-width: 520px; padding: 0.95rem 1.3rem; font-size: 0.95rem;
          background: var(--bg-panel); border: 1px solid var(--border-faint); color: var(--text-primary);
          font-family: inherit; transition: border-color 0.25s;
        }
        .explorer__search:focus { outline: none; border-color: var(--accent-dim); }
        .explorer__search::placeholder { color: var(--text-tertiary); }

        .explorer__state { text-align: center; padding: 5rem 1rem; color: var(--text-secondary); font-family: var(--font-mono); letter-spacing: 0.05em; }
        .explorer__state--error .explorer__state-title { color: #e08787; font-size: 1.1rem; margin-bottom: 0.6rem; letter-spacing: 0.1em; }
        .explorer__state--error button { margin-top: 1.4rem; }
        .loader { width: 28px; height: 28px; margin: 0 auto 1.4rem; border: 2px solid var(--border-mid); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.9s linear infinite; }

        .explorer__stats { max-width: 1200px; margin: 0 auto 3rem; }
        .explorer__stats-label { display: block; font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.2em; color: var(--text-tertiary); text-align: center; margin-bottom: 1rem; }
        .explorer__stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border-faint); }
        .stat { background: var(--bg-void); padding: 1.6rem 1rem; text-align: center; }
        .stat span { display: block; font-family: var(--font-display); font-size: 1.9rem; font-weight: 600; color: var(--accent); }
        .stat label { font-size: 0.68rem; letter-spacing: 0.14em; color: var(--text-tertiary); }
        @media (max-width: 700px) { .explorer__stats-grid { grid-template-columns: repeat(2, 1fr); } }

        .explorer__chart { max-width: 1200px; margin: 0 auto 3rem; background: var(--bg-panel); border: 1px solid var(--border-faint); padding: 1.6rem; }
        .explorer__chart h3 { font-family: var(--font-display); font-size: 1rem; margin-bottom: 1rem; color: var(--text-primary); }
        .chart-tooltip { background: rgba(5,7,13,0.95); border: 1px solid var(--border-mid); padding: 0.7rem 0.9rem; font-size: 0.78rem; color: var(--text-secondary); line-height: 1.5; }
        .chart-tooltip strong { color: var(--text-primary); }

        .explorer__table-wrap { max-width: 1200px; margin: 0 auto 3rem; }
        .explorer__table-wrap h3 { font-family: var(--font-display); font-size: 1rem; margin-bottom: 1rem; }
        .explorer__table-scroll { overflow-x: auto; border: 1px solid var(--border-faint); }
        .explorer__table { width: 100%; border-collapse: collapse; font-size: 0.85rem; min-width: 720px; }
        .explorer__table th { text-align: left; padding: 0.8rem 1rem; color: var(--text-tertiary); font-size: 0.7rem; letter-spacing: 0.08em; border-bottom: 1px solid var(--border-faint); }
        .explorer__table td { padding: 0.8rem 1rem; border-bottom: 1px solid var(--border-faint); color: var(--text-secondary); }
        .explorer__table tr.is-selected td { background: rgba(127,224,212,0.05); color: var(--text-primary); }
        .explorer__table tr:hover td { background: rgba(255,255,255,0.02); }
        .view-btn { border: 1px solid var(--border-mid); padding: 0.35rem 0.9rem; font-size: 0.75rem; color: var(--text-primary); transition: border-color 0.2s, color 0.2s; }
        .view-btn:hover { border-color: var(--accent-dim); color: var(--accent); }
        .show-more { display: block; margin: 1.4rem auto 0; }

        .detail-overlay { position: fixed; inset: 0; z-index: 100; background: rgba(3,4,8,0.75); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .detail-panel { position: relative; width: min(100%, 780px); max-height: 86vh; overflow-y: auto; background: #05070d; border: 1px solid var(--border-mid); padding: 2.4rem; }
        .detail-panel__close { position: absolute; top: 1.2rem; right: 1.2rem; color: var(--text-secondary); font-size: 1rem; }
        .detail-panel__close:hover { color: var(--text-primary); }
        .detail-panel h2 { font-family: var(--font-display); font-size: 1.8rem; margin: 0.6rem 0 0.3rem; }
        .detail-panel__host { color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.9rem; }
        .detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.6rem; margin-bottom: 2rem; }
        .detail-grid h4 { font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.1em; color: var(--accent); margin-bottom: 0.7rem; }
        .detail-grid dl { display: grid; grid-template-columns: auto auto; gap: 0.4rem 1rem; font-size: 0.85rem; }
        .detail-grid dt { color: var(--text-tertiary); }
        .detail-grid dd { color: var(--text-primary); text-align: right; }
        @media (max-width: 640px) { .detail-grid { grid-template-columns: 1fr; } }

        .flags { border-top: 1px solid var(--border-faint); padding-top: 1.6rem; }
        .flags h4 { font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.14em; color: var(--accent); margin-bottom: 0.9rem; }
        .flags ul { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.2rem; }
        .flags li { font-size: 0.85rem; color: var(--text-secondary); padding-left: 1.2rem; position: relative; }
        .flags li::before { content: '—'; position: absolute; left: 0; color: var(--accent-dim); }
        .flags__none { color: var(--text-tertiary); font-size: 0.85rem; margin-bottom: 1.2rem; }
        .flags__disclaimer { font-size: 0.78rem; line-height: 1.6; color: var(--text-tertiary); border-left: 2px solid var(--accent-dim); padding-left: 1rem; }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}
      </style>
    </div>
  )
}