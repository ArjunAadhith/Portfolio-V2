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

  /* ── Header ── */
  .cs-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 80px;
    margin-bottom: 36px;
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.8s var(--ts), transform 0.8s var(--ts);
    flex-shrink: 0;
  }
  .cs-header.visible { opacity: 1; transform: translateY(0); }

  .cs-label {
    font-family: var(--sf);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--grey);
    margin-bottom: 10px;
  }

  /* Bold heading, no italic anywhere */
  .cs-title {
    font-family: var(--sf);
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 700;
    line-height: 1.05;
    color: var(--ink);
    letter-spacing: -0.035em;
    font-style: normal;
  }

  /* "Intention" — outline/stroke only, transparent fill */
  .cs-title-stroke {
    color: #b9b9b9;
    font-style: normal;
  }

  /* ── Stage ── */
  .cs-stage {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(min(68vw, 820px) * 0.63);
    user-select: none;
    -webkit-user-select: none;
    cursor: grab;
  }
  .cs-stage.is-dragging { cursor: grabbing; }

  /* ── Card items ── */
  .cs-card-item {
    position: absolute;
    width: min(68vw, 820px);
    will-change: transform, opacity;
  }

  .cs-card-item.is-back  { opacity: 0.72; }
  .cs-card-item.is-front { opacity: 1; }

  /* Bezel — outline ONLY on active (is-front) card */
  .cs-bezel {
    border-radius: 40px;
    box-shadow:
      0 8px 40px rgba(0,0,0,0.07),
      0 2px  8px rgba(0,0,0,0.04);
    transition:
      outline        0.4s var(--ts),
      outline-color  0.4s var(--ts),
      outline-offset 0.4s var(--ts),
      box-shadow     0.4s var(--ts);
    /* No outline by default */
    outline: 1.5px solid transparent;
    outline-offset: 6px;
  }

  /* Active card — grey external outline */
  .cs-card-item.is-front .cs-bezel {
    outline-color: rgba(130, 130, 150, 0.75);
    outline-offset: 6px;
    box-shadow:
      0 20px 56px rgba(0,0,0,0.10),
      0  4px 12px rgba(0,0,0,0.05);
  }

  /* Inactive card — no outline at all */
  .cs-card-item.is-back .cs-bezel {
    outline-color: transparent;
    box-shadow:
      0 8px 40px rgba(0,0,0,0.07),
      0 2px  8px rgba(0,0,0,0.04);
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

  /* ── Tooltip ── */
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
    background: rgba(255,255,255,0.82);
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
    .cs-header    { padding: 0 48px; }
    .cs-card-item { width: min(76vw, 680px); }
    .cs-stage     { height: calc(min(76vw, 680px) * 0.63); }
  }

  @media (max-width: 768px) {
    .cs-section   { padding: 20px 0 20px; }
    .cs-header    { padding: 0 24px; margin-bottom: 24px; }
    .cs-title     { font-size: clamp(28px, 6vw, 44px); }
    .cs-card-item { width: 78vw; }
    .cs-stage     { height: calc(78vw * 0.63); cursor: default; }
    .cs-bezel     { border-radius: 22px; outline-offset: 4px; }
    .cs-card      { border-radius: 20px; }
    .cs-card-item.is-front .cs-bezel { outline-offset: 4px; }
  }

  @media (max-width: 480px) {
    .cs-section   { padding: 16px 0 16px; }
    .cs-header    { padding: 0 18px; margin-bottom: 18px; }
    .cs-title     { font-size: clamp(26px, 7.5vw, 34px); }
    .cs-tooltip   { display: none; }
    .cs-card-item { width: 82vw; }
    .cs-stage     { height: calc(82vw * 0.63); cursor: default; }
    .cs-bezel     { border-radius: 16px; outline-offset: 3px; }
    .cs-card      { border-radius: 14px; }
    .cs-card-item.is-front .cs-bezel { outline-offset: 3px; }
  }
`;

const getOffset = () => {
  const w = window.innerWidth;
  if (w <= 480)  return "7vw";
  if (w <= 768)  return "8vw";
  if (w <= 1024) return "9vw";
  return "13vw";
};

const buildStates = (offset) => [
  [
    { x: "0vw",        scale: 1,    z: 2 },
    { x: offset,       scale: 0.90, z: 1 },
  ],
  [
    { x: `-${offset}`, scale: 0.90, z: 1 },
    { x: "0vw",        scale: 1,    z: 2 },
  ],
];

const SPRING_TRANSITION  = "transform 0.7s cubic-bezier(0.34, 1.12, 0.64, 1), opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
const SWIPE_THRESHOLD    = 48;
const DRAG_CANCEL_THRESHOLD = 6;

const CARDS = [
  {
    src:      "/case study/TNSTC Case Study.png",
    alt:      "TNSTC Bus Booking Redesign",
  },
  {
    src:      "/case study/Swayam Case Study.png",
    alt:      "Swayam Case Study",
  },
];

export default function CaseStudySection() {
  const headerRef  = useRef(null);
  const stageRef   = useRef(null);
  const cardRefs   = [useRef(null), useRef(null)];
  const tooltipRef = useRef(null);
  const rafRef     = useRef(null);
  const tipPos     = useRef({ x: 0, y: 0 });

  const touchStart  = useRef(null);
  const mouseStart  = useRef(null);
  const isDragging  = useRef(false);
  const isAnimating = useRef(false);

  const [activeIdx,  setActiveIdx]  = useState(0);
  const [tnstcOpen,  setTnstcOpen]  = useState(false);
  const [swayamOpen, setSwayamOpen] = useState(false);
  const [tipOn,      setTipOn]      = useState(false);

  /* ── Apply card transforms ── */
  const applyTransforms = useCallback((idx, animate) => {
    const states = buildStates(getOffset());
    states[idx].forEach(({ x, scale, z }, i) => {
      const el = cardRefs[i].current;
      if (!el) return;
      el.style.transition = animate ? SPRING_TRANSITION : "none";
      el.style.transform  = `translateX(${x}) scale(${scale})`;
      el.style.zIndex     = z;
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

  /* ── Switch card ── */
  const goTo = useCallback((idx) => {
    if (isAnimating.current || idx === activeIdx) return;
    isAnimating.current = true;
    setActiveIdx(idx);
    applyTransforms(idx, true);
    setTimeout(() => { isAnimating.current = false; }, 700);
  }, [activeIdx, applyTransforms]);

  /* ── Click ── */
  const handleCardClick = (clickedIdx) => {
    if (isAnimating.current || isDragging.current) return;
    if (clickedIdx !== activeIdx) {
      goTo(clickedIdx);
    } else {
      if (clickedIdx === 0) setTnstcOpen(true);
      if (clickedIdx === 1) setSwayamOpen(true);
    }
  };

  /* ── Touch swipe ── */
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStart.current === null || isAnimating.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx < 0 && activeIdx === 0) goTo(1);
    if (dx > 0 && activeIdx === 1) goTo(0);
  };

  /* ── Mouse drag swipe ── */
  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    mouseStart.current = e.clientX;
    isDragging.current = false;
    if (stageRef.current) stageRef.current.classList.remove("is-dragging");
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (mouseStart.current === null) return;
      const dx = e.clientX - mouseStart.current;
      if (!isDragging.current && Math.abs(dx) > DRAG_CANCEL_THRESHOLD) {
        isDragging.current = true;
        if (stageRef.current) stageRef.current.classList.add("is-dragging");
        setTipOn(false);
        cancelAnimationFrame(rafRef.current);
      }
    };
    const onMouseUp = (e) => {
      if (mouseStart.current === null) return;
      const dx = e.clientX - mouseStart.current;
      const wasDrag = isDragging.current;
      mouseStart.current = null;
      isDragging.current = false;
      if (stageRef.current) stageRef.current.classList.remove("is-dragging");
      if (!wasDrag || isAnimating.current) return;
      if (Math.abs(dx) < SWIPE_THRESHOLD) return;
      if (dx < 0 && activeIdx === 0) goTo(1);
      if (dx > 0 && activeIdx === 1) goTo(0);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
    };
  }, [activeIdx, goTo]);

  /* ── Scroll reveal ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.05 }
    );
    if (headerRef.current) io.observe(headerRef.current);
    return () => io.disconnect();
  }, []);

  /* ── Tooltip RAF ── */
  const loopTip = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.left = tipPos.current.x + "px";
      tooltipRef.current.style.top  = tipPos.current.y + "px";
    }
    rafRef.current = requestAnimationFrame(loopTip);
  };
  const onEnter = () => {
    if (isDragging.current) return;
    setTipOn(true);
    rafRef.current = requestAnimationFrame(loopTip);
  };
  const onLeave = () => { setTipOn(false); cancelAnimationFrame(rafRef.current); };
  const onMove  = (e) => { tipPos.current = { x: e.clientX, y: e.clientY - 48 }; };
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

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

        {/* ── Header: label + bold heading only ── */}
        <div className="cs-header" ref={headerRef}>
          <p className="cs-label">Featured Work</p>
          <h2 className="cs-title">
            Designed with <span className="cs-title-stroke">Intention.</span>
          </h2>
        </div>

        <div
          ref={stageRef}
          className="cs-stage"
          onMouseDown={onMouseDown}
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