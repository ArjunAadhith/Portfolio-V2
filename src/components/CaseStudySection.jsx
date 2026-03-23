import { useEffect, useRef, useState } from "react";
import CaseStudyPage from "./CaseStudyPage";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --white: #ffffff;
    --ink: #0a0a0a;
    --ink-muted: #6b6b6b;
    --grey: #8a8a9a;
    --grey-line: #b0b0be;
    --ts: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --tsp: cubic-bezier(0.34, 1.56, 0.64, 1);
    --ring-rest:  rgba(160, 160, 180, 0.45);
    --ring-hover: rgba(110, 110, 140, 0.80);
    --ring-glow:  rgba(140, 140, 180, 0.10);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .cs-section {
    background: var(--white);
    padding: 40px 0 72px;
    overflow: hidden;
  }

  .cs-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 0 80px;
    margin-bottom: 44px;
    gap: 32px;
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.8s var(--ts), transform 0.8s var(--ts);
  }
  .cs-header.visible { opacity: 1; transform: translateY(0); }

  .cs-header-left { flex: 1; }

  .cs-label {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--grey);
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }
  .cs-label::before {
    content: '';
    display: block;
    width: 20px;
    height: 1px;
    background: var(--grey-line);
  }

  .cs-title {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(36px, 4.5vw, 64px);
    font-weight: 400;
    line-height: 1.06;
    color: var(--ink);
    letter-spacing: -0.025em;
  }
  .cs-title em { font-style: italic; color: var(--grey); }

  .cs-header-right {
    flex: 0 0 auto;
    max-width: 300px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    gap: 16px;
    padding-bottom: 4px;
  }

  .cs-subtitle {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 300;
    color: var(--ink-muted);
    line-height: 1.75;
    text-align: right;
  }

  .cs-year {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(0,0,0,0.22);
  }

  .cs-card-wrapper {
    padding: 0 200px;
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.9s var(--ts) 0.15s, transform 0.9s var(--ts) 0.15s;
  }
  .cs-card-wrapper.visible { opacity: 1; transform: translateY(0); }

  .cs-bezel {
    position: relative;
    border-radius: 48px;
    cursor: none;
    outline: 1.5px solid rgba(160, 160, 175, 0.55);
    outline-offset: 6px;
    box-shadow:
      0 8px 32px rgba(0,0,0,0.06),
      0 2px  6px rgba(0,0,0,0.04);
    transition:
      outline-color  0.45s var(--ts),
      outline-offset 0.45s var(--ts),
      box-shadow     0.45s var(--ts),
      transform      0.45s var(--ts);
  }
  .cs-bezel:hover {
    outline-color:  rgba(110, 110, 135, 0.85);
    outline-offset: 5px;
    box-shadow:
      0 16px 48px rgba(0,0,0,0.09),
      0  4px 12px rgba(0,0,0,0.05);
    transform: translateY(-3px);
  }
  .cs-bezel:active {
    transform: translateY(0) scale(0.997);
    transition: transform 0.1s var(--ts);
  }

  .cs-card {
    border-radius: 46px;
    overflow: hidden;
    display: block;
    line-height: 0;
    font-size: 0;
  }
  .cs-card img {
    width: 100%;
    height: auto;
    display: block;
    vertical-align: top;
  }

  .cs-tooltip {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.84);
    transition: opacity 0.22s var(--ts), transform 0.22s var(--tsp);
    will-change: transform, opacity;
  }
  .cs-tooltip.active {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  .cs-tooltip-inner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 100px;
    white-space: nowrap;
    background: rgba(255, 255, 255, 0.78);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow:
      0  2px  8px  rgba(0, 0, 0, 0.09),
      0  8px  24px rgba(0, 0, 0, 0.09),
      inset 0 1px 0 rgba(255,255,255,0.85);
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #0a0a0a;
  }
  .cs-tooltip-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--grey);
    flex-shrink: 0;
    animation: tdot 1.5s ease-in-out infinite;
  }
  @keyframes tdot {
    0%,100% { opacity:1;  transform:scale(1);   }
    50%      { opacity:.4; transform:scale(1.45); }
  }

  @media (max-width: 1024px) {
    .cs-header       { padding: 0 48px; }
    .cs-card-wrapper { padding: 0 120px; }
  }
  @media (max-width: 900px) {
    .cs-section { padding: 32px 0 56px; }
    .cs-header  { flex-direction: column; align-items: flex-start; padding: 0 32px; }
    .cs-header-right { align-items: flex-start; max-width: 100%; }
    .cs-subtitle     { text-align: left; }
    .cs-card-wrapper { padding: 0 56px; }
  }
  @media (max-width: 600px) {
    .cs-section      { padding: 24px 0 48px; }
    .cs-header       { padding: 0 20px; }
    .cs-card-wrapper { padding: 0 20px; }
    .cs-tooltip      { display: none; }
    .cs-bezel        { border-radius: 28px; }
    .cs-card         { border-radius: 26px; }
  }
`;

export default function CaseStudySection() {
  const headerRef  = useRef(null);
  const wrapRef    = useRef(null);
  const bezelRef   = useRef(null);
  const imgRef     = useRef(null);
  const tooltipRef = useRef(null);

  /* ── State that drives the overlay — identical to About.jsx ── */
  const [caseOpen, setCaseOpen] = useState(false);

  const [tipOn, setTipOn] = useState(false);
  const tipPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  /* scroll reveal */
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.08 }
    );
    if (headerRef.current) io.observe(headerRef.current);
    if (wrapRef.current)   io.observe(wrapRef.current);
    return () => io.disconnect();
  }, []);

  /* tooltip RAF */
  const loop = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.left = tipPos.current.x + "px";
      tooltipRef.current.style.top  = tipPos.current.y + "px";
    }
    rafRef.current = requestAnimationFrame(loop);
  };
  const onEnter = () => { setTipOn(true);  rafRef.current = requestAnimationFrame(loop); };
  const onLeave = () => { setTipOn(false); cancelAnimationFrame(rafRef.current); };
  const onMove  = (e) => { tipPos.current = { x: e.clientX, y: e.clientY - 44 }; };
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <>
      <style>{styles}</style>

      {/* ── Overlay — same interface as MoreAbout in About.jsx ── */}
      <CaseStudyPage isOpen={caseOpen} onClose={() => setCaseOpen(false)} />

      {/* Tooltip */}
      <div ref={tooltipRef} className={`cs-tooltip${tipOn ? " active" : ""}`}>
        <div className="cs-tooltip-inner">
          <span className="cs-tooltip-dot" />
          View Case Study
        </div>
      </div>

      <section className="cs-section">

        {/* Header */}
        <div className="cs-header" ref={headerRef}>
          <div className="cs-header-left">
            <p className="cs-label">Featured Work</p>
            <h2 className="cs-title">
              Designed with<br />
              <em>intention.</em>
            </h2>
          </div>
          <div className="cs-header-right">
            <p className="cs-subtitle">
              A deep dive into redesigning TNSTC — turning
              complexity into clarity, one screen at a time.
            </p>
            <span className="cs-year">2026 · Personal Project</span>
          </div>
        </div>

        {/* Banner */}
        <div className="cs-card-wrapper" ref={wrapRef}>
          <div
            className="cs-bezel"
            ref={bezelRef}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            onMouseMove={onMove}
            onClick={() => setCaseOpen(true)}
          >
            <div className="cs-card">
              <img
                ref={imgRef}
                src="/case study/TNSTC Case Study.png"
                alt="TNSTC Bus Booking Redesign"
              />
            </div>
          </div>
        </div>

      </section>
    </>
  );
}