import { useEffect, useRef, useState, useCallback } from "react";
import CaseStudyPage        from "./Casestudypage.jsx";
import SwayamCaseStudyPage  from "./SwayamCaseStudyPage.jsx";


const styles = `
  :root {
    --white: #ffffff;
    --ink: #0a0a0a;
    --ink-muted: #6b6b6b;
    --grey: #8a8a9a;
    --grey-line: #b0b0be;
    --ts:     cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --tsp:    cubic-bezier(0.34, 1.56, 0.64, 1);
    --spring: cubic-bezier(0.34, 1.12, 0.64, 1);
    --sf: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .cs-section {
    background: var(--white);
    padding: 32px 0 32px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .cs-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 0 80px;
    margin-bottom: 32px;
    gap: 32px;
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.8s var(--ts), transform 0.8s var(--ts);
    flex-shrink: 0;
  }
  .cs-header.visible { opacity: 1; transform: translateY(0); }
  .cs-header-left { flex: 1; }

  .cs-label {
    font-family: var(--sf);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--grey);
    margin-bottom: 12px;
  }

  .cs-title {
    font-family: var(--sf);
    font-size: clamp(32px, 4vw, 58px);
    font-weight: 300;
    line-height: 1.06;
    color: var(--ink);
    letter-spacing: -0.03em;
  }
  .cs-title em {
    font-style: italic;
    font-weight: 300;
    color: var(--grey);
  }

  .cs-header-right {
    flex: 0 0 auto;
    max-width: 300px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
    padding-bottom: 4px;
  }
  .cs-subtitle {
    font-family: var(--sf);
    font-size: 14px;
    font-weight: 300;
    color: var(--ink-muted);
    line-height: 1.75;
    text-align: right;
    transition: opacity 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .cs-year {
    font-family: var(--sf);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(0,0,0,0.22);
    transition: opacity 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .cs-stage {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(min(68vw, 820px) * 0.63);
    user-select: none;
    -webkit-user-select: none;
  }

  .cs-card-item {
    position: absolute;
    width: min(68vw, 820px);
    will-change: transform;
  }

  .cs-bezel {
    border-radius: 40px;
    outline: 1.5px solid rgba(160,160,175,0.55);
    outline-offset: 6px;
    box-shadow:
      0 8px 40px rgba(0,0,0,0.07),
      0 2px  8px rgba(0,0,0,0.04);
    transition:
      outline-color  0.4s var(--ts),
      outline-offset 0.4s var(--ts),
      box-shadow     0.4s var(--ts);
  }
  .cs-card-item.is-front .cs-bezel:hover {
    outline-color:  rgba(110,110,135,0.85);
    outline-offset: 4px;
    box-shadow:
      0 20px 56px rgba(0,0,0,0.10),
      0  4px 12px rgba(0,0,0,0.05);
  }
  .cs-card-item.is-back .cs-bezel:hover {
    outline-color: rgba(130,130,155,0.65);
    box-shadow:
      0 12px 44px rgba(0,0,0,0.09),
      0  3px  9px rgba(0,0,0,0.05);
  }

  .cs-card {
    border-radius: 38px;
    overflow: hidden;
    line-height: 0;
  }
  .cs-card img {
    width: 100%;
    height: auto;
    display: block;
    pointer-events: none;
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
    background: rgb(255, 255, 255);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.6);
    box-shadow:
      0 2px 8px   rgba(0,0,0,0.09),
      0 8px 24px  rgba(0,0,0,0.09),
      inset 0 1px 0 rgba(255,255,255,0.85);
    font-family: var(--sf);
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

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .cs-header    { padding: 0 48px; margin-bottom: 28px; }
    .cs-card-item { width: min(76vw, 680px); }
    .cs-stage     { height: calc(min(76vw, 680px) * 0.63); }
  }

  @media (max-width: 768px) {
    .cs-section   { padding: 20px 0 20px; }
    .cs-header    {
      flex-direction: column;
      align-items: flex-start;
      padding: 0 24px;
      margin-bottom: 18px;
      gap: 10px;
    }
    .cs-header-right { align-items: flex-start; max-width: 100%; }
    .cs-subtitle     { text-align: left; font-size: 13px; }
    .cs-title        { font-size: clamp(28px, 6vw, 40px); }
    .cs-card-item    { width: 78vw; }
    .cs-stage        { height: calc(78vw * 0.63); }
    .cs-bezel        { border-radius: 22px; outline-offset: 4px; }
    .cs-card         { border-radius: 20px; }
  }

  @media (max-width: 480px) {
    .cs-section   { padding: 16px 0 16px; }
    .cs-header    { padding: 0 18px; margin-bottom: 14px; gap: 8px; }
    .cs-title     { font-size: clamp(24px, 7.5vw, 32px); }
    .cs-subtitle  { font-size: 12px; line-height: 1.6; }
    .cs-year      { font-size: 10px; }
    .cs-tooltip   { display: none; }
    .cs-card-item { width: 82vw; }
    .cs-stage     { height: calc(82vw * 0.63); }
    .cs-bezel     { border-radius: 16px; outline-offset: 3px; }
    .cs-card      { border-radius: 14px; }
  }
`;

const getOffset = () => {
  const w = window.innerWidth;
  if (w <= 480) return "7vw";
  if (w <= 768) return "8vw";
  if (w <= 1024) return "9vw";
  return "13vw";
};

const buildStates = (offset) => [
  [
    { x: "0vw",        scale: 1,    z: 2 },
    { x: offset,       scale: 0.93, z: 1 },
  ],
  [
    { x: `-${offset}`, scale: 0.93, z: 1 },
    { x: "0vw",        scale: 1,    z: 2 },
  ],
];

const SPRING_TRANSITION = "transform 0.65s cubic-bezier(0.34, 1.12, 0.64, 1)";

const CARDS = [
  {
    src:      "/case study/TNSTC Case Study.png",
    alt:      "TNSTC Bus Booking Redesign",
    subtitle: "A deep dive into redesigning TNSTC — turning complexity into clarity, one screen at a time.",
    year:     "2026 · Personal Project",
  },
  {
    src:      "/case study/Swayam Case Study.png",
    alt:      "Swayam Case Study",
    subtitle: "Redesigning Swayam — bridging learners and courses through a thoughtful, accessible experience.",
    year:     "2026 · Personal Project",
  },
];

export default function CaseStudySection() {
  const headerRef   = useRef(null);
  const cardRefs    = [useRef(null), useRef(null)];
  const tooltipRef  = useRef(null);
  const rafRef      = useRef(null);
  const tipPos      = useRef({ x: 0, y: 0 });
  const touchStart  = useRef(null);
  const isAnimating = useRef(false);

  const [activeIdx,  setActiveIdx]  = useState(0);
  const [tnstcOpen,  setTnstcOpen]  = useState(false);
  const [swayamOpen, setSwayamOpen] = useState(false);
  const [tipOn,      setTipOn]      = useState(false);

  const applyTransforms = useCallback((idx, animate) => {
    const states = buildStates(getOffset());
    states[idx].forEach(({ x, scale, z }, i) => {
      const el = cardRefs[i].current;
      if (!el) return;
      el.style.transition = animate ? SPRING_TRANSITION : "none";
      el.style.transform  = `translateX(${x}) scale(${scale})`;
      el.style.zIndex     = z;
      el.style.cursor     = i === idx ? "none" : "pointer";
      el.classList.toggle("is-front", i === idx);
      el.classList.toggle("is-back",  i !== idx);
    });
  }, []);

  useEffect(() => { applyTransforms(0, false); }, []);

  useEffect(() => {
    const onResize = () => applyTransforms(activeIdx, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeIdx, applyTransforms]);

  const goTo = useCallback((idx) => {
    if (isAnimating.current || idx === activeIdx) return;
    isAnimating.current = true;
    setActiveIdx(idx);
    applyTransforms(idx, true);
    setTimeout(() => { isAnimating.current = false; }, 700);
  }, [activeIdx, applyTransforms]);

  const handleCardClick = (clickedIdx) => {
    if (isAnimating.current) return;
    if (clickedIdx !== activeIdx) {
      goTo(clickedIdx);
    } else {
      if (clickedIdx === 0) setTnstcOpen(true);
      if (clickedIdx === 1) setSwayamOpen(true);
    }
  };

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStart.current === null || isAnimating.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0 && activeIdx === 0) goTo(1);
    if (dx > 0 && activeIdx === 1) goTo(0);
  };

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.05 }
    );
    if (headerRef.current) io.observe(headerRef.current);
    return () => io.disconnect();
  }, []);

  const loopTip = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.left = tipPos.current.x + "px";
      tooltipRef.current.style.top  = tipPos.current.y + "px";
    }
    rafRef.current = requestAnimationFrame(loopTip);
  };
  const onEnter = () => { setTipOn(true);  rafRef.current = requestAnimationFrame(loopTip); };
  const onLeave = () => { setTipOn(false); cancelAnimationFrame(rafRef.current); };
  const onMove  = (e) => { tipPos.current = { x: e.clientX, y: e.clientY - 48 }; };
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const activeCard = CARDS[activeIdx];

  return (
    <>
      <style>{styles}</style>

      <CaseStudyPage
        isOpen={tnstcOpen}
        onClose={() => setTnstcOpen(false)}
      />
      <SwayamCaseStudyPage
        isOpen={swayamOpen}
        onClose={() => setSwayamOpen(false)}
      />

      <div ref={tooltipRef} className={`cs-tooltip${tipOn ? " active" : ""}`}>
        <div className="cs-tooltip-inner">
          <span className="cs-tooltip-dot" />
          View Case Study
        </div>
      </div>

      <section className="cs-section">

        <div className="cs-header" ref={headerRef}>
          <div className="cs-header-left">
            <p className="cs-label">Featured Work</p>
            <h2 className="cs-title">
              Designed with<br />
              <em>intention.</em>
            </h2>
          </div>
          <div className="cs-header-right">
            <p className="cs-subtitle">{activeCard.subtitle}</p>
            <span className="cs-year">{activeCard.year}</span>
          </div>
        </div>

        <div
          className="cs-stage"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {CARDS.map((card, idx) => {
            const isFront = idx === activeIdx;
            return (
              <div
                key={idx}
                ref={cardRefs[idx]}
                className={`cs-card-item ${isFront ? "is-front" : "is-back"}`}
                onClick={() => handleCardClick(idx)}
                onMouseEnter={isFront ? onEnter : undefined}
                onMouseLeave={isFront ? onLeave : undefined}
                onMouseMove={isFront  ? onMove  : undefined}
              >
                <div className="cs-bezel">
                  <div className="cs-card">
                    <img src={card.src} alt={card.alt} draggable={false} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>
    </>
  );
}