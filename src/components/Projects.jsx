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

        /* ════════════ DESKTOP — untouched ════════════ */
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
          margin: 122px 0 0;
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

        /* ════════════ TABLET LANDSCAPE 1024–1199px ════════════ */
        @media (min-width: 1024px) and (max-width: 1199px) {
          .pj-card {
            width: calc(100vw - 48px);
            height: 560px;
            left: 24px;
            transform: translateY(100%);
            top: 70px;
          }
          .pj-card.entered { transform: translateY(0); }
          .pj-card.init    { transform: translateY(0); }
        }

        /* ════════════ TABLET PORTRAIT 768–1023px ════════════ */
        @media (min-width: 768px) and (max-width: 1023px) {
          .pj-label {
            position: relative;
            top: auto; left: auto;
            text-align: center;
            padding-top: 36px;
            font-size: 14px;
          }
          .pj-heading {
            margin-top: 14px;
            white-space: normal;
            padding: 0 24px 20px;
          }
          .pj-card {
            width: calc(100vw - 40px);
            height: 460px;
            left: 20px;
            transform: translateY(100%);
            border-radius: 36px;
            top: 80px;
            cursor: pointer;
          }
          .pj-card.entered { transform: translateY(0); }
          .pj-card.init    { transform: translateY(0); }
          .pj-tip { display: none; }
        }

        /* ════════════════════════════════════════════════════
           MOBILE ≤ 767px
           - #pj-outer height = N × card-slot-height
           - Each slot = card height + 28px top + 28px bottom gap
           - Card height = (100vw - 24px) × 10/16
           - Slot ≈ (100vw - 24px) × 0.625 + 56px
           - Using 48vh per card slot (tight, just card + tiny breath)
        ════════════════════════════════════════════════════ */
        @media (max-width: 767px) {
          /* Compact header */
          #pj-header {
            padding-bottom: 0;
          }
          .pj-label {
            position: relative;
            top: auto; left: auto;
            text-align: center;
            padding-top: 20px;
            font-size: 14px;
          }
          .pj-heading {
            margin-top: 6px;
            white-space: normal;
            text-align: center;
            padding: 0 20px 16px;
            font-size: clamp(28px, 8vw, 42px);
            letter-spacing: -0.032em;
          }

          /* Tight scroll container — just enough for sticky scroll feel */
          #pj-outer {
            height: ${N * 48}vh;
          }
          .pj-wrapper {
            height: 48vh;
          }

          /* Card fills its slot with minimal breathing room */
          .pj-card {
            width: calc(100vw - 24px);
            height: auto;
            aspect-ratio: 16 / 10;
            left: 12px;
            top: 50%;
            margin-top: calc((100vw - 24px) * -5 / 16);
            border-radius: 22px;
            transform: translateY(100%);
            cursor: pointer;
          }
          .pj-card.entered { transform: translateY(0); }
          .pj-card.init    { transform: translateY(0); }
          .pj-tip { display: none; }
        }

        /* ════════════ ≤ 480px ════════════ */
        @media (max-width: 480px) {
          #pj-outer   { height: ${N * 46}vh; }
          .pj-wrapper  { height: 46vh; }
          .pj-label   { font-size: 13px; padding-top: 18px; }
          .pj-heading {
            font-size: clamp(26px, 7.5vw, 36px);
            padding: 0 16px 14px;
          }
          .pj-card {
            width: calc(100vw - 20px);
            left: 10px;
            margin-top: calc((100vw - 20px) * -5 / 16);
            border-radius: 18px;
          }
        }

        /* ════════════ ≤ 390px — iPhone 13/14/15, Galaxy S, Pixel ════════════ */
        @media (max-width: 390px) {
          #pj-outer   { height: ${N * 44}vh; }
          .pj-wrapper  { height: 44vh; }
          .pj-label   { font-size: 13px; padding-top: 16px; }
          .pj-heading {
            font-size: clamp(24px, 7vw, 32px);
            padding: 0 14px 12px;
            letter-spacing: -0.025em;
          }
          .pj-card {
            width: calc(100vw - 16px);
            left: 8px;
            margin-top: calc((100vw - 16px) * -5 / 16);
            border-radius: 16px;
          }
        }

        /* ════════════ ≤ 320px — SE 1st gen, tiny Android ════════════ */
        @media (max-width: 320px) {
          #pj-outer   { height: ${N * 42}vh; }
          .pj-wrapper  { height: 42vh; }
          .pj-label   { font-size: 12px; padding-top: 14px; }
          .pj-heading {
            font-size: clamp(22px, 6.8vw, 28px);
            padding: 0 12px 10px;
            letter-spacing: -0.022em;
          }
          .pj-card {
            width: calc(100vw - 14px);
            left: 7px;
            margin-top: calc((100vw - 14px) * -5 / 16);
            border-radius: 14px;
          }
        }

        /* ════════════ Landscape phone ════════════ */
        @media (max-width: 900px) and (max-height: 500px) and (orientation: landscape) {
          #pj-outer   { height: ${N * 88}vh; }
          .pj-wrapper  { height: 88vh; }
          .pj-label {
            position: relative;
            top: auto; left: auto;
            text-align: center;
            font-size: 13px;
            padding-top: 12px;
          }
          .pj-heading {
            margin-top: 4px;
            white-space: normal;
            padding: 0 20px 10px;
            font-size: clamp(22px, 5vw, 36px);
          }
          .pj-card {
            width: calc(100vw - 32px);
            height: calc(88vh - 90px);
            aspect-ratio: unset;
            left: 16px;
            top: 50%;
            margin-top: calc((88vh - 90px) / -2);
            border-radius: 18px;
            transform: translateY(100%);
            cursor: pointer;
          }
          .pj-card.entered { transform: translateY(0); }
          .pj-card.init    { transform: translateY(0); }
          .pj-tip { display: none; }
        }

        /* iOS notch / Dynamic Island */
        @supports (padding: env(safe-area-inset-top)) {
          @media (max-width: 767px) {
            #pj-header {
              padding-top: env(safe-area-inset-top, 0px);
            }
          }
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
      { threshold: 0, rootMargin: "0px 0px 0px 0px" }
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