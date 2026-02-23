import { useEffect, useRef, useState, useCallback } from "react";

const CARDS = [
  { id: 1, image: "/front-end/Paradize.png", link: "https://paradize-ecom.netlify.app/" },
  { id: 2, image: "/front-end/Rideease.png", link: "https://rideease-car.netlify.app/" },
  { id: 3, image: "/front-end/flixora.png",  link: "https://flixora-streaming-platform.netlify.app/" },
  { id: 4, image: "/front-end/codefest.png", link: "https://codefest-2k25.netlify.app/" },
];

const N = CARDS.length;

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

        /* ── Header — normal flow, scrolls naturally with section ── */
        #pj-header {
          position: relative;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pj-label {
          position: absolute;
          top: 52px;
          left: clamp(80px, 60vw, 160px);
          font-family: 'SF Pro Display', -apple-system, sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: #fff;
          line-height: 1.55;
          letter-spacing: -0.01em;
        }

        .pj-heading {
          margin: 122px 0 0; /* was 72px — shifted 50px down */
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

        #pj-outer {
          position: relative;
          height: ${N * 100}vh;
          background: #000;
          overflow: clip;
        }

        .pj-wrapper {
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .pj-card {
          position: absolute;
          width: 1078px;
          height: 620px;
          left: 50%;
          top: 60px;
          border-radius: 50px;
          background: #000000;
          overflow: hidden;
          box-shadow:
            0 24px 80px rgba(0,0,0,.65),
            0 4px 20px rgba(0,0,0,.4);
          cursor: none;
          transform: translateX(-50%) translateY(100%);
          opacity: 0;
          transition:
            transform .9s cubic-bezier(0.22, 1, 0.36, 1),
            opacity   .5s ease,
            box-shadow .3s ease;
        }

        .pj-card.entered {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }

        .pj-card.init {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
          transition: box-shadow .3s ease;
        }

        .pj-card:hover {
          box-shadow:
            0 40px 100px rgba(0,0,0,.75),
            0 8px 32px rgba(0,0,0,.5);
        }

        .pj-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
        }

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

        @media (max-width: 1120px) {
          .pj-card {
            width: calc(100vw - 32px);
            height: 620px;
            left: 16px;
            transform: translateY(100%);
          }
          .pj-card.entered {
            transform: translateY(0);
          }
          .pj-card.init {
            transform: translateY(0);
          }
        }

        @media (max-width: 600px) {
          .pj-heading { white-space: normal; }
          .pj-card { top: 180px; }
        }
      `}</style>

      <div id="pj-header">
        <p className="pj-label">
          Let's Explore My<br />Creative Journey
        </p>
        <h2 className="pj-heading">The Art of Frontend</h2>
      </div>

      <div id="pj-outer">
        {CARDS.map((card, i) => (
          <StickyCard key={card.id} card={card} index={i} />
        ))}
      </div>
    </>
  );
}

function StickyCard({ card, index }) {
  const wrapperRef = useRef(null);
  const cardRef    = useRef(null);
  const [entered,  setEntered]  = useState(index === 0);
  const [tip,      setTip]      = useState({ show: false, x: 0, y: 0 });

  useEffect(() => {
    if (index === 0) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          obs.disconnect();
        }
      },
      {
        threshold: 0,
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
      <div
        ref={cardRef}
        className={`pj-card ${index === 0 ? "init" : entered ? "entered" : ""}`}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={() => { window.location.href = card.link; }}
      >
        <span
          className={`pj-tip${tip.show ? " on" : ""}`}
          style={{ left: tip.x + 16, top: tip.y - 20 }}
        >
          Visit Now
        </span>

        <img
          src={card.image}
          alt={`Project ${card.id}`}
          className="pj-img"
          draggable={false}
        />
      </div>
    </div>
  );
}