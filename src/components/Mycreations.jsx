import { useEffect, useRef, useState, useCallback } from "react";

const CARDS = [
  { id: 1, title: "Stucor Desktop\n– UI Redesign",    image: "/1.png", link: "https://your-link-1.com" },
  { id: 2, title: "Pet Frnd – Mobile\nUI Design",      image: "/2.png", link: "https://your-link-2.com" },
  { id: 3, title: "Nexus Dashboard\n– Analytics",      image: "/3.png", link: "https://your-link-3.com" },
  { id: 4, title: "Bloom – E-Commerce\nMobile App",    image: "/4.png", link: "https://your-link-4.com" },
  { id: 5, title: "Verdant – SaaS\nLanding Page",      image: "/5.png", link: "https://your-link-5.com" },
  { id: 6, title: "Aether – Music\nStreaming App",      image: "/6.png", link: "https://your-link-6.com" },
  { id: 7, title: "Vaulted – Finance\nDashboard",      image: "/7.png", link: "https://your-link-7.com" },
  { id: 8, title: "Solace – Mental\nHealth App",        image: "/8.png", link: "https://your-link-8.com" },
  { id: 9, title: "Krate – Food\nDelivery App",         image: "/9.png", link: "https://your-link-9.com" },
];

const CARD_W       = 644;
const CARD_H       = 360;
const GAP          = 28;
const SIDE_PADDING = 80;
const LERP         = 0.08;

export default function Showcase() {
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);
  const currentRef = useRef(0);
  const rafRef     = useRef(null);
  const [sectionH, setSectionH] = useState("300vh");

  const getMax = useCallback(() => {
    const vw     = window.innerWidth;
    const totalW = CARDS.length * CARD_W + (CARDS.length - 1) * GAP + SIDE_PADDING * 2;
    return Math.max(0, totalW - vw);
  }, []);

  /* Section height = scroll budget */
  useEffect(() => {
    const update = () => setSectionH(`calc(100vh + ${getMax()}px)`);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [getMax]);

  /*
    Single RAF loop — reads scroll position directly every frame.
    No scroll event listeners. No cached offsets. No timing races.
    Works regardless of which element is the scroll container.
    
    getBoundingClientRect().top on the section element:
      • positive  → section not yet reached  → clamp to 0
      • 0         → section top is flush with viewport top → start scrolling
      • negative  → we're inside the section → -top = pixels scrolled in
      • > sectionHeight - 100vh → past the end → clamp to max
  */
  useEffect(() => {
    const tick = () => {
      if (sectionRef.current && trackRef.current) {
        const rawTarget = -sectionRef.current.getBoundingClientRect().top;
        const target    = Math.max(0, Math.min(getMax(), rawTarget));

        const diff = target - currentRef.current;
        if (Math.abs(diff) > 0.05) {
          currentRef.current += diff * LERP;
        } else {
          currentRef.current = target;
        }

        trackRef.current.style.transform = `translateX(-${currentRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [getMax]);

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

        #sc-section {
          position: relative;
          background: #ffffff;
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
        }

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

        #sc-heading {
          width: 100%;
          text-align: center;
          margin: 0 0 52px;
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(32px, 4.2vw, 58px);
          font-weight: 700;
          letter-spacing: -0.038em;
          line-height: 1.05;
          color: #666666;
          flex-shrink: 0;
          padding: 0 ${SIDE_PADDING}px;
        }

        #sc-overflow-clip {
          width: 100%;
          overflow: hidden;
        }

        #sc-track {
          display: flex;
          gap: ${GAP}px;
          padding: 0 ${SIDE_PADDING}px;
          width: max-content;
          will-change: transform;
          transform: translateX(0);
        }

        .sc-card-link {
          display: flex;
          width: ${CARD_W}px;
          height: ${CARD_H}px;
          border-radius: 20px;
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
          text-decoration: none;
          cursor: none;
        }

        .sc-right {
          width: 100%;
          height: 100%;
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
          transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
          top: 0;
          left: 0;
          will-change: transform, left, top;
        }
        .sc-tooltip.visible {
          opacity: 1;
          transform: scale(1) translate(-50%, -50%);
        }
      `}</style>

      <div id="sc-section" ref={sectionRef} style={{ height: sectionH }}>
        <div id="sc-sticky">
          <h2 id="sc-heading">Showcase of My Creations</h2>
          <div id="sc-overflow-clip">
            <div id="sc-track" ref={trackRef}>
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

function Card({ card }) {
  const tipRef    = useRef(null);
  const posRef    = useRef({ x: 0, y: 0 });
  const curRef    = useRef({ x: 0, y: 0 });
  const rafRef    = useRef(null);
  const activeRef = useRef(false);

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
      <div ref={tipRef} className="sc-tooltip">Explore Now ↗</div>
      <a
        href={card.link}
        target="_blank"
        rel="noopener noreferrer"
        className="sc-card-link"
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