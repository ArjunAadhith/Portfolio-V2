import { useEffect, useRef } from "react";

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes wordReveal {
    from { opacity: 0; transform: translateY(105%); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes lineGrow {
    from { transform: scaleX(0); opacity: 0; }
    to   { transform: scaleX(1); opacity: 1; }
  }
  @keyframes scrollBob {
    0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; }
    50%       { transform: translateX(-50%) translateY(7px); opacity: 0.2; }
  }
  @keyframes pulse {
    0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.5); }
    65%  { box-shadow: 0 0 0 6px rgba(255,255,255,0); }
    100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
  }

  .hero-root {
    position: relative;
    width: 100%;
    height: 100vh;
    background: #ffffff;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
  }

  /* Available for Work button */
  .avail-btn {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 11px 26px 11px 18px;
    background: #000;
    border: none;
    border-radius: 100px;
    cursor: default;
    margin-bottom: 46px;
    animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 150ms both;
  }
  .avail-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #fff;
    flex-shrink: 0;
    animation: pulse 2s ease 1.2s infinite;
  }
  .avail-label {
    font-family: -apple-system, "SF Pro Text", "Helvetica Neue", sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #EEEEEE;
    -webkit-font-smoothing: antialiased;
  }

  /* Headline */
  .hero-headline {
    font-family: -apple-system, "SF Pro Display", "Helvetica Neue", sans-serif;
    font-size: clamp(64px, 7.4vw, 118px);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -0.042em;
    color: #000;
    -webkit-font-smoothing: antialiased;
    font-feature-settings: "kern" 1;
    text-rendering: optimizeLegibility;
  }
  .hl-line {
    display: block;
  }
  .hl-inner { display: block; }
  .hl-inner.a1 { animation: wordReveal 1.1s cubic-bezier(0.16,1,0.3,1) 380ms both; }
  .hl-inner.a2 { animation: wordReveal 1.1s cubic-bezier(0.16,1,0.3,1) 580ms both; }

  /* Divider + sub */
  .hero-divider {
    width: 36px; height: 1.5px;
    background: #000;
    transform-origin: left;
    animation: lineGrow 0.7s cubic-bezier(0.16,1,0.3,1) 900ms both;
  }
  .hero-sub {
    font-family: -apple-system, "SF Pro Text", "Helvetica Neue", sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #000;
    opacity: 0.3;
    -webkit-font-smoothing: antialiased;
    animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 950ms both;
  }

  /* Scroll indicator */
  .scroll-wrap {
    position: absolute;
    bottom: 44px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    animation: fadeIn 1s ease 1300ms both;
  }
  .scroll-label {
    font-family: -apple-system, "SF Pro Text", "Helvetica Neue", sans-serif;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #000;
    opacity: 0.22;
  }
  .mouse {
    position: relative;
    width: 18px; height: 28px;
    border: 1.5px solid rgba(0,0,0,0.22);
    border-radius: 9px;
  }
  .mouse-dot {
    position: absolute;
    top: 5px; left: 50%;
    width: 2px; height: 5px;
    background: #000;
    opacity: 0.35;
    border-radius: 2px;
    animation: scrollBob 1.7s ease-in-out infinite;
  }

  .grid-svg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    animation: fadeIn 1.5s ease 0.1s both;
  }
`;

function Grid() {
  return (
    <svg className="grid-svg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="g40" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#EEEEEE" strokeWidth="0.5"/>
        </pattern>
        <pattern id="g200" width="200" height="200" patternUnits="userSpaceOnUse">
          <rect width="200" height="200" fill="url(#g40)" />
          <path d="M200 0H0V200" fill="none" stroke="#EEEEEE" strokeWidth="1"/>
        </pattern>
        <linearGradient id="gRight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="55%" stopColor="white" stopOpacity="0"/>
          <stop offset="100%" stopColor="white" stopOpacity="1"/>
        </linearGradient>
        <linearGradient id="gTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="white" stopOpacity="1"/>
          <stop offset="18%"  stopColor="white" stopOpacity="0"/>
          <stop offset="82%"  stopColor="white" stopOpacity="0"/>
          <stop offset="100%" stopColor="white" stopOpacity="1"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g200)" />
      <line x1="0"     y1="61.8%" x2="100%"  y2="61.8%" stroke="#EEEEEE" strokeWidth="0.8"/>
      <line x1="61.8%" y1="0"     x2="61.8%" y2="100%"  stroke="#EEEEEE" strokeWidth="0.8"/>
      <rect width="100%" height="100%" fill="url(#gRight)" />
      <rect width="100%" height="100%" fill="url(#gTop)" />
    </svg>
  );
}

export default function Hero() {
  return (
    <>
      <style>{css}</style>
      <div className="hero-root">
        <Grid />

        <div style={{ position: "relative", zIndex: 10, paddingLeft: "7.5%", paddingRight: "7.5%", paddingBottom: "120px", width: "100%" }}>

          {/* Available for Work — pill button */}
          <button className="avail-btn">
            <span className="avail-dot" />
            <span className="avail-label">Available for Work</span>
          </button>

          {/* Headline — 2 lines */}
          <h1 className="hero-headline">
            <span className="hl-line">
              <span className="hl-inner a1">Exceptional Design</span>
            </span>
            <span className="hl-line" style={{ marginTop: "0.05em" }}>
              <span
                className="hl-inner a2"
                style={{ color: "transparent", WebkitTextStroke: "1.5px #000" }}
              >
                Needs No Explanation
              </span>
            </span>
          </h1>

          {/* Rule + sub */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 44 }}>
            <div className="hero-divider" />
            <span className="hero-sub">Craft · Clarity · Confidence</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-wrap">
          <div className="mouse">
            <div className="mouse-dot" />
          </div>
          <span className="scroll-label">Scroll</span>
        </div>
      </div>
    </>
  );
}