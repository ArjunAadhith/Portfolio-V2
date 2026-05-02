import { useEffect, useRef, useState, useCallback } from "react";
import CaseStudyPage        from "./Casestudypage.jsx";
import SwayamCaseStudyPage  from "./SwayamCaseStudyPage.jsx";
import StucorCaseStudyPage from "./StucorCaseStudyPage.jsx";

/* ─── Lerp helper ───────────────────────────────────────────────────── */
const lerp = (a, b, t) => a + (b - a) * t;

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
    padding: 32px 0 100px;
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

  .cs-title {
    font-family: var(--sf);
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 700;
    line-height: 1.05;
    color: var(--ink);
    letter-spacing: -0.035em;
    font-style: normal;
  }

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
    cursor: none;
  }
  .cs-card-item.is-back  { opacity: 0.72; cursor: pointer; }
  .cs-card-item.is-far   { opacity: 0;    pointer-events: none; }
  .cs-card-item.is-front { opacity: 1; }

  /* Bezel */
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
    outline: 1.5px solid transparent;
    outline-offset: 6px;
  }

  .cs-card-item.is-front .cs-bezel {
    outline-color: rgba(130, 130, 150, 0.75);
    outline-offset: 6px;
    box-shadow:
      0 20px 56px rgba(0,0,0,0.10),
      0  4px 12px rgba(0,0,0,0.05);
  }

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

  /* ── Circular Cursor ── */
  .cs-cursor {
    position: absolute;
    width: 96px;
    height: 96px;
    margin-left: -48px;
    margin-top: -48px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    mix-blend-mode: difference;
    background: #ffffff;
    opacity: 0;
    transform: translate3d(0px, 0px, 0) scale(0.4);
    transition:
      opacity  0.28s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform, opacity;
  }

  .cs-cursor-label {
    font-family: var(--sf);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.01em;
    color: #000;
    white-space: nowrap;
    user-select: none;
    pointer-events: none;
  }

  /* ── Mobile segmented progress bar ── */
  .cs-progress { display: none; }

  @media (max-width: 768px) {
    .cs-progress {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
      margin-top: 20px;
      flex-shrink: 0;
    }

    .cs-progress-segment {
      width: 36px;
      height: 2.5px;
      background: rgba(0,0,0,0.12);
      border-radius: 99px;
      overflow: hidden;
      position: relative;
    }

    .cs-progress-fill {
      position: absolute;
      left: 0; top: 0;
      height: 100%;
      width: 0%;
      background: #0a0a0a;
      border-radius: 99px;
    }
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .cs-header    { padding: 0 48px; }
    .cs-card-item { width: min(76vw, 680px); }
    .cs-stage     { height: calc(min(76vw, 680px) * 0.63); }
  }

  @media (max-width: 768px) {
    .cs-section   { padding: 20px 0 72px; }
    .cs-header    { padding: 0 24px; margin-bottom: 24px; }
    .cs-title     { font-size: clamp(28px, 6vw, 44px); }
    .cs-card-item { width: 78vw; cursor: pointer; }
    .cs-stage     { height: calc(78vw * 0.63); cursor: default; }
    .cs-bezel     { border-radius: 22px; outline-offset: 4px; }
    .cs-card      { border-radius: 20px; }
    .cs-card-item.is-front .cs-bezel { outline-offset: 4px; }
    .cs-cursor    { display: none; }
  }

  @media (max-width: 480px) {
    .cs-section   { padding: 16px 0 60px; }
    .cs-header    { padding: 0 18px; margin-bottom: 18px; }
    .cs-title     { font-size: clamp(26px, 7.5vw, 34px); }
    .cs-card-item { width: 82vw; cursor: pointer; }
    .cs-stage     { height: calc(82vw * 0.63); cursor: default; }
    .cs-bezel     { border-radius: 16px; outline-offset: 3px; }
    .cs-card      { border-radius: 14px; }
    .cs-card-item.is-front .cs-bezel { outline-offset: 3px; }
    .cs-cursor    { display: none; }
  }
`;

const getOffset = () => {
  const w = window.innerWidth;
  if (w <= 480)  return "7vw";
  if (w <= 768)  return "8vw";
  if (w <= 1024) return "9vw";
  return "13vw";
};

/*
 * 3-card layout per active index.
 * "far" = off-stage, opacity 0, pointer-events none.
 *
 *   activeIdx=0 → card0: center, card1: right,       card2: far-right (hidden)
 *   activeIdx=1 → card0: left,   card1: center,       card2: right
 *   activeIdx=2 → card0: far-left (hidden), card1: left, card2: center
 */
const buildStates = (offset) => [
  // activeIdx = 0
  [
    { x: "0vw",                  scale: 1,    z: 3, role: "front" },
    { x: offset,                 scale: 0.90, z: 2, role: "back"  },
    { x: `calc(${offset} * 2)`, scale: 0.82, z: 1, role: "far"   },
  ],
  // activeIdx = 1
  [
    { x: `-${offset}`,           scale: 0.90, z: 2, role: "back"  },
    { x: "0vw",                  scale: 1,    z: 3, role: "front" },
    { x: offset,                 scale: 0.90, z: 2, role: "back"  },
  ],
  // activeIdx = 2
  [
    { x: `calc(-${offset} * 2)`, scale: 0.82, z: 1, role: "far"   },
    { x: `-${offset}`,           scale: 0.90, z: 2, role: "back"  },
    { x: "0vw",                  scale: 1,    z: 3, role: "front" },
  ],
];

const SPRING_TRANSITION     = "transform 0.7s cubic-bezier(0.34, 1.12, 0.64, 1), opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
const SWIPE_THRESHOLD       = 48;
const DRAG_CANCEL_THRESHOLD = 6;
const AUTO_ADVANCE_MS       = 5000;

// ─── Replace the third src with your actual image path ───────────────
const CARDS = [
  { src: "/case study/TNSTC Case Study.png",  alt: "TNSTC Bus Booking Redesign" },
  { src: "/case study/Swayam Case Study.png", alt: "Swayam Case Study"          },
  { src: "/case study/Stucor Case Study.png",  alt: "Stucor Case Study"           },
];

export default function CaseStudySection() {
  const headerRef = useRef(null);
  const stageRef  = useRef(null);

  // ── 3 refs for every per-card concern ────────────────────────────────
  const cardRefs        = [useRef(null), useRef(null), useRef(null)];
  const cursorRefs      = [useRef(null), useRef(null), useRef(null)];
  const rafIds          = [useRef(null), useRef(null), useRef(null)];
  const currents        = [useRef({ x: 0, y: 0 }), useRef({ x: 0, y: 0 }), useRef({ x: 0, y: 0 })];
  const targets         = [useRef({ x: 0, y: 0 }), useRef({ x: 0, y: 0 }), useRef({ x: 0, y: 0 })];
  const isHovers        = [useRef(false), useRef(false), useRef(false)];
  const segmentFillRefs = [useRef(null),  useRef(null),  useRef(null)];

  const touchStart       = useRef(null);
  const mouseStart       = useRef(null);
  const isDragging       = useRef(false);
  const isAnimating      = useRef(false);
  const autoTimer        = useRef(null);
  const sectionInViewRef = useRef(false);

  const [activeIdx,  setActiveIdx]  = useState(0);
  const [tnstcOpen,  setTnstcOpen]  = useState(false);
  const [swayamOpen, setSwayamOpen] = useState(false);
  const [stucorOpen, setStucorOpen] = useState(false);

  

  /* ── Apply card transforms ── */
  const applyTransforms = useCallback((idx, animate) => {
    const states = buildStates(getOffset());
    states[idx].forEach(({ x, scale, z, role }, i) => {
      const el = cardRefs[i].current;
      if (!el) return;
      el.style.transition = animate ? SPRING_TRANSITION : "none";
      el.style.transform  = `translateX(${x}) scale(${scale})`;
      el.style.zIndex     = z;
      el.classList.toggle("is-front", role === "front");
      el.classList.toggle("is-back",  role === "back");
      el.classList.toggle("is-far",   role === "far");
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
    const oldCursor = cursorRefs[activeIdx].current;
    if (oldCursor) oldCursor.style.opacity = "0";
    isHovers[activeIdx].current = false;
    if (rafIds[activeIdx].current) {
      cancelAnimationFrame(rafIds[activeIdx].current);
      rafIds[activeIdx].current = null;
    }
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
      // Card 2 is image-only — clicking it does nothing (add a modal later if needed)
      if (clickedIdx === 0) setTnstcOpen(true);
      if (clickedIdx === 1) setSwayamOpen(true);
      if (clickedIdx === 2) setStucorOpen(true);
    }
  };

  /* ── Touch swipe ── */
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStart.current === null || isAnimating.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx < 0) goTo((activeIdx + 1) % CARDS.length);
    if (dx > 0) goTo((activeIdx - 1 + CARDS.length) % CARDS.length);
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
        cursorRefs.forEach((r, i) => {
          if (r.current) r.current.style.opacity = "0";
          isHovers[i].current = false;
          if (rafIds[i].current) { cancelAnimationFrame(rafIds[i].current); rafIds[i].current = null; }
        });
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
      if (dx < 0) goTo((activeIdx + 1) % CARDS.length);
      if (dx > 0) goTo((activeIdx - 1 + CARDS.length) % CARDS.length);
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

  /* ── Mobile helpers ── */
  const isMobileView = () => window.innerWidth <= 768;

  /* ── Animate fill for the active segment ── */
  const startProgress = useCallback((idx) => {
    if (!isMobileView()) return;
    segmentFillRefs.forEach((r) => {
      if (r.current) { r.current.style.transition = "none"; r.current.style.width = "0%"; }
    });
    const fill = segmentFillRefs[idx].current;
    if (!fill) return;
    void fill.offsetWidth;
    fill.style.transition = `width ${AUTO_ADVANCE_MS}ms linear`;
    fill.style.width = "100%";
  }, []);

  /* ── EFFECT 1 — IntersectionObserver (mount only) ── */
  useEffect(() => {
    const section = document.querySelector(".cs-section");
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionInViewRef.current = true;
          startProgress(activeIdx);
          if (autoTimer.current) clearTimeout(autoTimer.current);
          autoTimer.current = setTimeout(() => {
            goTo((activeIdx + 1) % CARDS.length);
          }, AUTO_ADVANCE_MS);
        } else {
          sectionInViewRef.current = false;
          if (autoTimer.current) clearTimeout(autoTimer.current);
          segmentFillRefs.forEach((r) => {
            if (r.current) { r.current.style.transition = "none"; r.current.style.width = "0%"; }
          });
        }
      },
      { threshold: 0.3 }
    );
    io.observe(section);
    return () => { io.disconnect(); if (autoTimer.current) clearTimeout(autoTimer.current); };
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  /* ── EFFECT 2 — Continuous loop (re-runs on activeIdx change) ── */
  useEffect(() => {
    if (!isMobileView()) return;
    if (!sectionInViewRef.current) return;
    if (autoTimer.current) clearTimeout(autoTimer.current);
    startProgress(activeIdx);
    autoTimer.current = setTimeout(() => {
      goTo((activeIdx + 1) % CARDS.length);
    }, AUTO_ADVANCE_MS);
    return () => { if (autoTimer.current) clearTimeout(autoTimer.current); };
  }, [activeIdx, startProgress, goTo]);

  /* Cleanup RAFs on unmount */
  useEffect(() => () => {
    rafIds.forEach(r => { if (r.current) cancelAnimationFrame(r.current); });
  }, []);

  /* ── Circular cursor handlers ── */
  const makeCursorHandlers = useCallback((idx) => {
    const tick = () => {
      const el = cursorRefs[idx].current;
      if (!el) return;
      const EASE = 0.13;
      currents[idx].current.x = lerp(currents[idx].current.x, targets[idx].current.x, EASE);
      currents[idx].current.y = lerp(currents[idx].current.y, targets[idx].current.y, EASE);
      const cx = currents[idx].current.x;
      const cy = currents[idx].current.y;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) scale(${isHovers[idx].current ? 1 : 0.4})`;
      rafIds[idx].current = requestAnimationFrame(tick);
    };
    const startRAF = () => { if (!rafIds[idx].current) rafIds[idx].current = requestAnimationFrame(tick); };
    const stopRAF  = () => { if (rafIds[idx].current) { cancelAnimationFrame(rafIds[idx].current); rafIds[idx].current = null; } };

    const onEnter = (e) => {
      if (idx !== activeIdx || isDragging.current) return;
      const r = cardRefs[idx].current.getBoundingClientRect();
      currents[idx].current = { x: e.clientX - r.left, y: e.clientY - r.top };
      targets[idx].current  = { x: e.clientX - r.left, y: e.clientY - r.top };
      isHovers[idx].current = true;
      const el = cursorRefs[idx].current;
      if (el) {
        el.style.opacity   = "1";
        el.style.transform = `translate3d(${currents[idx].current.x}px, ${currents[idx].current.y}px, 0) scale(1)`;
      }
      startRAF();
    };
    const onMove = (e) => {
      if (idx !== activeIdx) return;
      const r = cardRefs[idx].current.getBoundingClientRect();
      targets[idx].current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      isHovers[idx].current = false;
      const el = cursorRefs[idx].current;
      if (el) {
        el.style.opacity   = "0";
        el.style.transform = `translate3d(${currents[idx].current.x}px, ${currents[idx].current.y}px, 0) scale(0.4)`;
      }
      stopRAF();
    };
    return { onEnter, onMove, onLeave };
  }, [activeIdx]);

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
      <StucorCaseStudyPage
  isOpen={stucorOpen}
  onClose={() => setStucorOpen(false)}
/>

      <section className="cs-section">

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
            const { onEnter, onMove, onLeave } = makeCursorHandlers(idx);
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
                {isFront && (
                  <div
                    ref={cursorRefs[idx]}
                    className="cs-cursor"
                    aria-hidden="true"
                  >
                    <span className="cs-cursor-label">
                      VIEW
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ display: "inline-block", marginLeft: "5px", verticalAlign: "middle", marginTop: "-1px" }}
                      >
                        <line x1="1" y1="10" x2="10" y2="1" stroke="#000" strokeWidth="1.6" strokeLinecap="round"/>
                        <polyline points="4,1 10,1 10,7" fill="none" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                )}

                <div className="cs-bezel">
                  <div className="cs-card">
                    <img src={card.src} alt={card.alt} draggable={false} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Mobile-only segmented progress bar (3 segments) ── */}
        <div className="cs-progress">
          {CARDS.map((_, idx) => (
            <div key={idx} className="cs-progress-segment">
              <div ref={segmentFillRefs[idx]} className="cs-progress-fill" />
            </div>
          ))}
        </div>

      </section>
    </>
  );
}