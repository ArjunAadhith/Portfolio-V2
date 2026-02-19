import { useEffect, useRef, useState, useCallback } from "react";

const CARDS = [
  { id: 1, image: "/Paradize.png", link: "/project-1" },
  { id: 2, image: "/Rideease.png", link: "/project-2" },
  { id: 3, image: "/flixora.png",  link: "/project-3" },
  { id: 4, image: "/codefest.png", link: "/project-4" },
];

const N = CARDS.length;

/*
  HOW THIS WORKS — no scroll math, uses browser-native sticky
  ─────────────────────────────────────────────────────────────
  Each card has its OWN sticky wrapper (position:sticky, top:0, height:100vh).
  Total outer height = N × 100vh = 400vh.

  As user scrolls:
    scroll 0 – 100vh  → card 0 wrapper is sticky at top (already was)
    scroll 100vh      → card 1 wrapper reaches top → becomes sticky, stacks over card 0
    scroll 200vh      → card 2 stacks over card 1
    scroll 300vh      → card 3 stacks over card 2

  z-index: card i = i+1, so later cards always cover earlier ones.

  IntersectionObserver on each wrapper fires when that wrapper's top
  enters the viewport → triggers CSS "rise from below" transition on the card.

  Inner div has overflow:hidden → clips the card while it's rising (at translateY > 0).
  This does NOT break sticky because the sticky element is the WRAPPER, not the inner div.
*/

export default function Projects() {
  return (
    <>
      <style>{`
        @font-face {
          font-family: 'SF Pro Display';
          src: url('/src/assets/fonts/SF-Pro-Display-Regular.otf') format('opentype');
          font-weight: 400;
        }
        @font-face {
          font-family: 'SF Pro Display';
          src: url('/src/assets/fonts/SF-Pro-Display-Bold.otf') format('opentype');
          font-weight: 700;
        }
        @font-face {
          font-family: 'SF Pro Display';
          src: url('/src/assets/fonts/SF-Pro-Display-Heavy.otf') format('opentype');
          font-weight: 800;
        }

        /* ── Outer container ── */
        #pj-outer {
          position: relative;
          height: ${N * 100}vh;   /* 400vh — each card gets 100vh of scroll */
          background: #000;
        }

        /* ── Heading row — always on top ── */
        #pj-header {
          position: sticky;
          top: 0;
          height: 0;              /* takes no flow space */
          overflow: visible;
          z-index: 999;
          pointer-events: none;
        }

        #pj-header-inner {
          position: absolute;
          top: 0; left: 0; right: 0;
          padding: 52px 24px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pj-label {
          position: absolute;
          top: 52px;
          left: clamp(24px, 6vw, 96px);
          font-family: 'SF Pro Display', -apple-system, sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          color: #fff;
          line-height: 1.55;
          letter-spacing: -0.01em;
        }

        .pj-heading {
          margin: 72px 0 0;
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(40px, 5.8vw, 72px);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          white-space: nowrap;
          text-align: center;
          background: linear-gradient(
            180deg,
            rgba(215,215,215,.62) 0%,
            rgba(130,130,130,.26) 50%,
            rgba(50,50,50,.10) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* ── Card sticky wrapper ── */
        .pj-wrapper {
          position: sticky;
          top: 0;
          height: 100vh;
          /* inner will handle overflow clipping */
        }

        /* ── Inner clip container ──
           overflow:hidden clips the rising card.
           NOT on the sticky element itself → sticky still works. */
        .pj-clip {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        /* ── Card shell ── */
        .pj-card {
          position: absolute;
          /* top gap leaves space for the heading */
          top: 232px;
          left: clamp(16px, 3vw, 48px);
          right: clamp(16px, 3vw, 48px);
          bottom: clamp(24px, 4vh, 48px);
          border-radius: 28px;
          background: #1c1d2e;
          overflow: hidden;
          box-shadow:
            0 24px 80px rgba(0,0,0,.65),
            0 4px 20px rgba(0,0,0,.4);
          cursor: none;
          /* INITIAL STATE — off screen below (clipped by .pj-clip) */
          transform: translateY(100%);
          opacity: 0;
          transition:
            transform .9s cubic-bezier(0.22, 1, 0.36, 1),
            opacity   .5s ease,
            box-shadow .3s ease;
        }

        /* ENTERED STATE — card has risen into view */
        .pj-card.entered {
          transform: translateY(0);
          opacity: 1;
        }

        /* card 0 is always visible from the start */
        .pj-card.init {
          transform: translateY(0);
          opacity: 1;
          transition: box-shadow .3s ease;
        }

        .pj-card:hover {
          box-shadow:
            0 40px 100px rgba(0,0,0,.75),
            0 8px 32px rgba(0,0,0,.5);
        }

        /* ── Image fills card ── */
        .pj-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
        }

        /* ── Visit Now tooltip ── */
        .pj-tip {
          position: absolute;
          pointer-events: none;
          z-index: 9999;
          background: rgba(255,255,255,.94);
          color: #0a0a0a;
          font-family: 'SF Pro Display', -apple-system, sans-serif;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: .015em;
          padding: 5px 13px;
          border-radius: 8px;
          white-space: nowrap;
          opacity: 0;
          transform: scale(.84) translateY(4px);
          transition: opacity .15s ease, transform .15s ease;
        }
        .pj-tip.on {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        @media (max-width: 600px) {
          .pj-heading { white-space: normal; }
          .pj-card { top: 180px; }
        }
      `}</style>

      <div id="pj-outer">

        {/* ── Heading — always on top via z-index:999 ── */}
        <div id="pj-header">
          <div id="pj-header-inner">
            <p className="pj-label">
              Let's Explore My<br />Creative Journey
            </p>
            <h2 className="pj-heading">The Art of Frontend</h2>
          </div>
        </div>

        {/* ── One sticky wrapper per card ── */}
        {CARDS.map((card, i) => (
          <StickyCard key={card.id} card={card} index={i} />
        ))}

      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   StickyCard — handles its own sticky + observe
───────────────────────────────────────────── */
function StickyCard({ card, index }) {
  const wrapperRef = useRef(null);
  const cardRef    = useRef(null);
  const [entered,  setEntered]  = useState(index === 0); // card 0 visible from start
  const [tip,      setTip]      = useState({ show: false, x: 0, y: 0 });

  /* Observe wrapper entering viewport → trigger rise animation */
  useEffect(() => {
    if (index === 0) return; // card 0 always visible

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          obs.disconnect(); // only trigger once per page load
        }
      },
      {
        threshold: 0,
        // Fire when the wrapper's TOP edge reaches the viewport BOTTOM
        // rootMargin: bottom margin = 0, so fires as soon as any part enters
        rootMargin: "0px 0px 0px 0px",
      }
    );
    if (wrapperRef.current) obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, [index]);

  const onMove = useCallback((e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setTip({ show: true, x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  const onLeave = useCallback(() => setTip(t => ({ ...t, show: false })), []);

  return (
    <div
      ref={wrapperRef}
      className="pj-wrapper"
      style={{ zIndex: index + 1 }}
    >
      <div className="pj-clip">
        <div
          ref={cardRef}
          className={`pj-card ${index === 0 ? "init" : entered ? "entered" : ""}`}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          onClick={() => { window.location.href = card.link; }}
        >
          {/* Visit Now tooltip */}
          <span
            className={`pj-tip${tip.show ? " on" : ""}`}
            style={{ left: tip.x + 16, top: tip.y - 20 }}
          >
            Visit Now
          </span>

          {/*
            Replace src with your actual image path.
            e.g. src="/src/assets/paradize.png"
          */}
          <img
            src={card.image}
            alt={`Project ${card.id}`}
            className="pj-img"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}