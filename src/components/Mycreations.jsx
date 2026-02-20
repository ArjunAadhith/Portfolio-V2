import { useEffect, useRef, useState, useCallback } from "react";

const CARDS = [
  {
    id: 1,
    title: "Stucor Desktop\n– UI Redesign",
    image: "/1.png",
    link: "https://your-link-1.com",
  },
  {
    id: 2,
    title: "Pet Frnd – Mobile\nUI Design",
    image: "/2.png",
    link: "https://your-link-2.com",
  },
  {
    id: 3,
    title: "Nexus Dashboard\n– Analytics",
    image: "/3.png",
    link: "https://your-link-3.com",
  },
  {
    id: 4,
    title: "Bloom – E-Commerce\nMobile App",
    image: "/4.png",
    link: "https://your-link-4.com",
  },
  {
    id: 5,
    title: "Verdant – SaaS\nLanding Page",
    image: "/5.png",
    link: "https://your-link-5.com",
  },
  {
    id: 6,
    title: "Aether – Music\nStreaming App",
    image: "/6.png",
    link: "https://your-link-6.com",
  },
  {
    id: 7,
    title: "Vaulted – Finance\nDashboard",
    image: "/7.png",
    link: "https://your-link-7.com",
  },
  {
    id: 8,
    title: "Solace – Mental\nHealth App",
    image: "/8.png",
    link: "https://your-link-8.com",
  },
  {
    id: 9,
    title: "Krate – Food\nDelivery App",
    image: "/9.png",
    link: "https://your-link-9.com",
  },
];

const CARD_W       = 644;
const CARD_H       = 360;
const GAP          = 28;
const SIDE_PADDING = 80; /* left padding before first card */

export default function Showcase() {
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);
  const [sectionH, setSectionH] = useState("300vh");

  /* Live refs so RAF loop never goes stale */
  const targetRef  = useRef(0);   // raw scroll-driven target
  const currentRef = useRef(0);   // smoothed display value
  const rafRef     = useRef(null);

  /* Recalculate section height on mount + resize */
  const calcDimensions = useCallback(() => {
    const vw     = window.innerWidth;
    const totalW = CARDS.length * CARD_W + (CARDS.length - 1) * GAP + SIDE_PADDING * 2;
    const max    = Math.max(0, totalW - vw);
    setSectionH(`calc(100vh + ${max}px)`);
  }, []);

  useEffect(() => {
    calcDimensions();
    window.addEventListener("resize", calcDimensions);
    return () => window.removeEventListener("resize", calcDimensions);
  }, [calcDimensions]);

  /* Lerp RAF loop — runs continuously, always chasing target */
  useEffect(() => {
    const LERP = 0.08; // lower = silkier / more lag; 0.08 is a sweet spot

    const tick = () => {
      /* Lerp current toward target */
      const diff = targetRef.current - currentRef.current;
      if (Math.abs(diff) > 0.05) {
        currentRef.current += diff * LERP;
      } else {
        currentRef.current = targetRef.current;
      }

      /* Apply directly to DOM — no React re-render on every frame */
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${currentRef.current}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* Scroll listener — only updates the target ref, no setState */
  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrolled   = window.scrollY - sectionTop;
      const vw         = window.innerWidth;
      const totalW     = CARDS.length * CARD_W + (CARDS.length - 1) * GAP + SIDE_PADDING * 2;
      const max        = Math.max(0, totalW - vw);

      targetRef.current = Math.max(0, Math.min(max, scrolled));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          src: url('/src/assets/fonts/SF-Pro-Display-Medium.otf') format('opentype');
          font-weight: 500;
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

        /* ── Section ── */
        #sc-section {
          position: relative;
          background: #ffffff;
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* ── Sticky viewport ── */
        #sc-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
        }

        /* ── Heading ── */
        #sc-heading {
          width: 100%;
          text-align: center;
          margin: 0 0 52px;
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(32px, 4.2vw, 58px);
          font-weight: 700;
          letter-spacing: -0.038em;
          line-height: 1.05;
          color: #3a3a3a;
          flex-shrink: 0;
          padding: 0 ${SIDE_PADDING}px;
        }

        /* ── Overflow clip ── */
        #sc-overflow-clip {
          width: 100%;
          overflow: hidden;
        }

        /* ── Horizontal track ── */
        #sc-track {
          display: flex;
          gap: ${GAP}px;
          padding: 0 ${SIDE_PADDING}px;
          width: max-content;
          will-change: transform;
          transform: translateX(0);
        }

        /* ── Image pane fills entire card ── */
        .sc-right {
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .sc-img-placeholder {
          position: absolute;
          inset: 0;
        }

        .sc-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
        }

        /* ── Card link wrapper ── */
        .sc-card-link {
          display: block;
          width: ${CARD_W}px;
          height: ${CARD_H}px;
          border-radius: 20px;
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
          text-decoration: none;
          cursor: none;
        }

        /* ── Cursor tooltip ── */
        .sc-tooltip {
          position: fixed;
          pointer-events: none;
          z-index: 99999;
          background: #ffffff;
          color: #111111;
          font-family: 'SF Pro Display', -apple-system, sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
          padding: 8px 16px;
          border-radius: 100px;
          white-space: nowrap;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10);
          opacity: 0;
          transform: scale(0.78) translate(-50%, -50%);
          transition:
            opacity 0.18s ease,
            transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
          top: 0;
          left: 0;
          will-change: transform, left, top;
        }
        .sc-tooltip.visible {
          opacity: 1;
          transform: scale(1) translate(-50%, -50%);
        }


      `}</style>

      {/* Outer section — height drives scroll range */}
      <div
        id="sc-section"
        ref={sectionRef}
        style={{ height: sectionH }}
      >
        {/* Sticky viewport */}
        <div id="sc-sticky">

          {/* Heading */}
          <h2 id="sc-heading">Showcase of My Creations</h2>

          {/* Overflow clip wrapper */}
          <div id="sc-overflow-clip">
            {/* Translating card track */}
            <div
              id="sc-track"
              ref={trackRef}
            >
              {CARDS.map((card) => (
                <Card key={card.id} card={card} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Card — tooltip follows cursor, click → link
───────────────────────────────────────────── */
function Card({ card }) {
  const tipRef  = useRef(null);
  const posRef  = useRef({ x: 0, y: 0 });     // target position
  const curRef  = useRef({ x: 0, y: 0 });     // smoothed position
  const rafRef  = useRef(null);
  const activeRef = useRef(false);

  /* Lerp loop for the tooltip position */
  const startLoop = useCallback(() => {
    if (rafRef.current) return;
    const loop = () => {
      const tip = tipRef.current;
      if (!tip || !activeRef.current) { rafRef.current = null; return; }

      curRef.current.x += (posRef.current.x - curRef.current.x) * 0.14;
      curRef.current.y += (posRef.current.y - curRef.current.y) * 0.14;

      tip.style.left = `${curRef.current.x}px`;
      tip.style.top  = `${curRef.current.y}px`;

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const onMouseEnter = useCallback((e) => {
    activeRef.current = true;
    posRef.current = { x: e.clientX, y: e.clientY };
    curRef.current = { x: e.clientX, y: e.clientY };
    if (tipRef.current) {
      tipRef.current.style.left = `${e.clientX}px`;
      tipRef.current.style.top  = `${e.clientY}px`;
      tipRef.current.classList.add("visible");
    }
    startLoop();
  }, [startLoop]);

  const onMouseMove = useCallback((e) => {
    posRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseLeave = useCallback(() => {
    activeRef.current = false;
    if (tipRef.current) tipRef.current.classList.remove("visible");
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  }, []);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <>
      {/* Tooltip rendered in place — position:fixed so it escapes overflow:hidden */}
      <div ref={tipRef} className="sc-tooltip">Explore Now ↗</div>

      <a
        href={card.link}
        target="_blank"
        rel="noopener noreferrer"
        className="sc-card-link"
        style={{ background: card.bg }}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <div className="sc-right">
          <div className="sc-img-placeholder">
            <img
              src={card.image}
              alt={card.title.replace("\n", " ")}
              className="sc-img"
              draggable={false}
            />
          </div>
        </div>
      </a>
    </>
  );
}