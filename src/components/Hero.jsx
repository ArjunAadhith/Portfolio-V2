export default function Hero() {
  return (
    <>
      <style>{`
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          width: 100%;
          height: 100%;
          overflow-x: hidden;
        }

        body {
          font-family: "SF Pro Display", "SF Pro Text", -apple-system,
            BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background: #ffffff;
        }

        /* ─── Keyframes ─────────────────────────────── */
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
          0%, 100% { transform: translateX(-50%) translateY(0);   opacity: 1;   }
          50%       { transform: translateX(-50%) translateY(7px); opacity: 0.2; }
        }

        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0   rgba(238,238,238,0.6); }
          65%  { box-shadow: 0 0 0 6px rgba(238,238,238,0);   }
          100% { box-shadow: 0 0 0 0   rgba(238,238,238,0);   }
        }

        /* ─── Root ──────────────────────────────────── */
        .hero-root {
          position: relative;
          width: 100%;
          height: 100vh;
          /* iOS safe area support */
          min-height: -webkit-fill-available;
          background: #ffffff;
          overflow: hidden;
        }

        /* ─── SVG Grid ──────────────────────────────── */
        .grid-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          animation: fadeIn 1.5s ease 0.1s both;
        }

        /* ─── Badge ─────────────────────────────────── */
        .avail-btn {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 11px 26px 11px 18px;
          background: #000;
          border: none;
          border-radius: 100px;
          cursor: default;
          /* Thumb-friendly: min 44px height */
          min-height: 44px;
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 150ms both;
        }

        /* Dot */
        .avail-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #EEEEEE;
          flex-shrink: 0;
          animation: pulse 2s ease 1.2s infinite;
        }

        .avail-label {
          font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont,
            "Helvetica Neue", sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #EEEEEE;
          -webkit-font-smoothing: antialiased;
        }

        /* ─── Headline ──────────────────────────────── */
        .hero-headline {
          font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont,
            "Helvetica Neue", sans-serif;
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

        .hl-inner {
          display: block;
        }

        .hl-inner.a1 {
          animation: wordReveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) 380ms both;
        }

        .hl-inner.a2 {
          animation: wordReveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) 580ms both;
        }

        /* ─── Tagline ────────────────────────────────── */
        .hero-divider {
          width: 36px;
          height: 1.5px;
          background: #000;
          transform-origin: left;
          flex-shrink: 0;
          animation: lineGrow 0.7s cubic-bezier(0.16, 1, 0.3, 1) 900ms both;
        }

        .hero-sub {
          font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont,
            "Helvetica Neue", sans-serif;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #000;
          opacity: 0.3;
          -webkit-font-smoothing: antialiased;
          animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 950ms both;
        }

        /* ─── Scroll indicator ───────────────────────── */
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
          font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont,
            "Helvetica Neue", sans-serif;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #000;
          opacity: 0.22;
        }

        .mouse {
          position: relative;
          width: 18px;
          height: 28px;
          border: 1.5px solid rgba(0, 0, 0, 0.22);
          border-radius: 9px;
        }

        .mouse-dot {
          position: absolute;
          top: 5px;
          left: 50%;
          width: 2px;
          height: 5px;
          background: #000;
          opacity: 0.35;
          border-radius: 2px;
          animation: scrollBob 1.7s ease-in-out infinite;
        }

        /* ─── Main Content Container ─────────────────── */
        .hero-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 10;
          padding-left: 7.5%;
          padding-right: 7.5%;
          padding-bottom: 120px;
        }

        .hero-badge-wrap {
          margin-bottom: 46px;
        }

        .hero-tagline-wrap {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-top: 44px;
        }

        /* ─── Ultra-wide (1440px+) ───────────────────── */
        @media (min-width: 1440px) {
          .hero-content {
            max-width: 1920px;
            margin-left: auto;
            margin-right: auto;
            /* Keep percentage-based padding but ensure no over-stretch */
            padding-left: clamp(7.5%, calc((100vw - 1600px) / 2 + 7.5%), 14%);
            padding-right: clamp(7.5%, calc((100vw - 1600px) / 2 + 7.5%), 14%);
          }
        }

        @media (min-width: 1920px) {
          .hero-content {
            padding-left: 10%;
            padding-right: 10%;
            padding-bottom: 140px;
          }
          .hero-badge-wrap {
            margin-bottom: 52px;
          }
          .hero-tagline-wrap {
            margin-top: 52px;
          }
          .scroll-wrap {
            bottom: 52px;
          }
        }

        /* ─── Tablet Landscape (1024px – 1279px) ─────── */
        @media (min-width: 1024px) and (max-width: 1279px) {
          .hero-headline {
            font-size: clamp(58px, 6.8vw, 90px);
          }
          .hero-content {
            padding-bottom: 100px;
          }
        }

        /* ─── Tablet Portrait (768px – 1023px) ──────── */
        @media (min-width: 768px) and (max-width: 1023px) {
          .hero-headline {
            font-size: clamp(44px, 6.5vw, 72px);
            letter-spacing: -0.036em;
          }
          .hero-content {
            padding-left: 8%;
            padding-right: 8%;
            padding-bottom: 100px;
          }
          .hero-badge-wrap {
            margin-bottom: 36px;
          }
          .hero-tagline-wrap {
            margin-top: 32px;
          }
          .scroll-wrap {
            bottom: 36px;
          }
        }

        /* ─── Large Mobile (428px – 767px) ──────────── */
        @media (min-width: 428px) and (max-width: 767px) {
          .hero-headline {
            font-size: clamp(36px, 8.5vw, 54px);
            letter-spacing: -0.03em;
            line-height: 1.06;
          }
          .hero-content {
            padding-left: 6.5%;
            padding-right: 6.5%;
            padding-bottom: 90px;
          }
          .hero-badge-wrap {
            margin-bottom: 28px;
          }
          .hero-tagline-wrap {
            margin-top: 24px;
            gap: 14px;
          }
          .hero-sub {
            font-size: 10.5px;
          }
          .scroll-wrap {
            bottom: 30px;
          }
          /* Outline stroke thinner on smaller headline */
          .hl-inner.a2 {
            -webkit-text-stroke: 1px #000 !important;
          }
        }

        /* ─── Standard Mobile (360px – 427px) ───────── */
        @media (min-width: 360px) and (max-width: 427px) {
          .hero-headline {
            font-size: clamp(32px, 8.8vw, 46px);
            letter-spacing: -0.028em;
            line-height: 1.07;
          }
          .hero-content {
            padding-left: 6%;
            padding-right: 6%;
            padding-bottom: 84px;
          }
          .hero-badge-wrap {
            margin-bottom: 26px;
          }
          .hero-tagline-wrap {
            margin-top: 22px;
            gap: 12px;
          }
          .hero-divider {
            width: 28px;
          }
          .hero-sub {
            font-size: 10px;
            letter-spacing: 0.07em;
          }
          .avail-label {
            font-size: 10px;
            letter-spacing: 0.12em;
          }
          .scroll-wrap {
            bottom: 28px;
          }
          .hl-inner.a2 {
            -webkit-text-stroke: 1px #000 !important;
          }
        }

        /* ─── Small Mobile (320px – 359px) ──────────── */
        @media (max-width: 359px) {
          .hero-headline {
            font-size: 28px;
            letter-spacing: -0.024em;
            line-height: 1.08;
          }
          .hero-content {
            padding-left: 5.5%;
            padding-right: 5.5%;
            padding-bottom: 76px;
          }
          .hero-badge-wrap {
            margin-bottom: 22px;
          }
          .hero-tagline-wrap {
            margin-top: 20px;
            gap: 10px;
          }
          .hero-divider {
            width: 22px;
          }
          .hero-sub {
            font-size: 9.5px;
            letter-spacing: 0.06em;
          }
          .avail-btn {
            padding: 10px 20px 10px 14px;
          }
          .avail-label {
            font-size: 9.5px;
            letter-spacing: 0.1em;
          }
          .scroll-wrap {
            bottom: 24px;
          }
          .hl-inner.a2 {
            -webkit-text-stroke: 0.8px #000 !important;
          }
        }

        /* ─── iOS Safe Area (notch / Dynamic Island) ── */
        @supports (padding: env(safe-area-inset-bottom)) {
          .hero-content {
            padding-bottom: calc(120px + env(safe-area-inset-bottom, 0px));
          }
          .scroll-wrap {
            bottom: calc(44px + env(safe-area-inset-bottom, 0px));
          }

          @media (max-width: 767px) {
            .hero-content {
              padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
            }
            .scroll-wrap {
              bottom: calc(28px + env(safe-area-inset-bottom, 0px));
            }
          }

          @media (max-width: 359px) {
            .hero-content {
              padding-bottom: calc(70px + env(safe-area-inset-bottom, 0px));
            }
          }
        }

        /* ─── Landscape mobile (short height) ───────── */
        @media (max-width: 900px) and (max-height: 500px) and (orientation: landscape) {
          .hero-headline {
            font-size: clamp(26px, 5.5vw, 48px);
            line-height: 1.05;
          }
          .hero-content {
            padding-bottom: 70px;
            padding-left: 6%;
            padding-right: 6%;
          }
          .hero-badge-wrap {
            margin-bottom: 18px;
          }
          .hero-tagline-wrap {
            margin-top: 16px;
          }
          .scroll-wrap {
            display: none; /* hide scroll hint in short landscape */
          }
        }
      `}</style>

      <div className="hero-root">

        {/* ── SVG Grid Background ───── */}
        <svg className="grid-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="g40" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="#EEEEEE" strokeWidth="0.5" />
            </pattern>
            <pattern id="g200" width="200" height="200" patternUnits="userSpaceOnUse">
              <rect width="200" height="200" fill="url(#g40)" />
              <path d="M200 0H0V200" fill="none" stroke="#EEEEEE" strokeWidth="1" />
            </pattern>
            <linearGradient id="gRight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="55%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="gTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="white" stopOpacity="1" />
              <stop offset="18%"  stopColor="white" stopOpacity="0" />
              <stop offset="82%"  stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#g200)" />
          <line x1="0"     y1="61.8%" x2="100%"  y2="61.8%" stroke="#EEEEEE" strokeWidth="0.8" />
          <line x1="61.8%" y1="0"     x2="61.8%" y2="100%"  stroke="#EEEEEE" strokeWidth="0.8" />
          <rect width="100%" height="100%" fill="url(#gRight)" />
          <rect width="100%" height="100%" fill="url(#gTop)" />
        </svg>

        {/* ── Main Content ─────────────────────────────── */}
        <div className="hero-content">
          {/* Available for Work badge */}
          <div className="hero-badge-wrap">
            <button className="avail-btn">
              <span className="avail-dot" />
              <span className="avail-label">Available for Work</span>
            </button>
          </div>

          {/* Headline — exactly 2 lines */}
          <h1 className="hero-headline">
            <span className="hl-line">
              <span className="hl-inner a1">Exceptional Design</span>
            </span>
            <span className="hl-line" style={{ marginTop: "0.05em" }}>
              <span
                className="hl-inner a2"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1.5px #000",
                }}
              >
                Needs No Explanation
              </span>
            </span>
          </h1>

          {/* Rule + Tagline */}
          <div className="hero-tagline-wrap">
            <div className="hero-divider" />
            <span className="hero-sub">Craft · Clarity · Confidence</span>
          </div>
        </div>

        {/* ── Scroll Indicator ─────────────────────────── */}
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