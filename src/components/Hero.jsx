import { useState, useEffect, useRef } from "react";

export default function Hero() {
  const [toggled, setToggled] = useState(false);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const bgX = (mouse.x - 50) * -0.018;
  const bgY = (mouse.y - 50) * -0.012;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; height: 100%; overflow-x: hidden; background: #000; }

        @keyframes kenBurns {
          0%   { transform: scale(1.12) translate(1.5%, 0.8%); }
          100% { transform: scale(1.0)  translate(-1%, -0.5%); }
        }
        @keyframes wipeIn {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0% 0 0); }
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
          0%, 100% { transform: translateX(-50%) translateY(0);   opacity: 1; }
          50%       { transform: translateX(-50%) translateY(7px); opacity: 0.2; }
        }
        @keyframes dotPing {
          0%   { box-shadow: 0 0 0 0   rgba(255,255,255,0.7); }
          65%  { box-shadow: 0 0 0 6px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0   rgba(255,255,255,0); }
        }
        @keyframes glint {
          0%   { left: -60%; opacity: 0; }
          12%  { opacity: 1; }
          88%  { opacity: 1; }
          100% { left: 160%; opacity: 0; }
        }
        @keyframes labelIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Hero root ───────────────────────────────────────
           NO z-index, NO isolation, NO opacity, NO filter.
           Any of these would create a stacking context that
           traps mix-blend-mode and stops it reaching the bg. */
        .hero-root {
          position: relative;
          width: 100%;
          height: 100svh;
          min-height: 100vh;
          overflow: hidden;
          background: #000;
        }

        /* ── Background ──────────────────────────────────────
           Position: absolute, NO z-index.
           DOM order places it first = renders behind everything.
           Brightness raised so the difference inversion is
           clearly visible over the headline text area.        */
        .hero-bg {
          position: absolute;
          inset: -10%;
          background-image:
            url("/bg.jpg");
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          animation: kenBurns 28s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
          /* Higher brightness = more contrast for the difference blend */
          filter: saturate(1.3) brightness(0.9) contrast(1.1);
        }

        /* ── Film grain ──────────────────────────────────────
           NO z-index — DOM order (after .hero-bg) puts it on top. */
        .noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.028;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px 160px;
        }

        /* ── Content container ───────────────────────────────
           position: absolute WITHOUT z-index = no stacking
           context is created. DOM order (after .noise) keeps
           it painted on top. The headline's mix-blend-mode
           can now reach straight through to the background.  */
        .hero-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding-left: 7.5%;
          padding-right: 7.5%;
          padding-bottom: 120px;
        }

        /* ── Badge ───────────────────────────────────────────
           backdrop-filter lives on the <button> only.
           It creates a stacking context for the button itself
           but NOT for .hero-content, so the headline blend
           below is unaffected.                               */
        .hero-badge-wrap {
          margin-bottom: 46px;
          animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 150ms both;
        }
        .avail-btn {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 11px 26px 11px 18px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 100px;
          cursor: pointer;
          min-height: 44px;
          backdrop-filter: blur(18px) saturate(1.4);
          -webkit-backdrop-filter: blur(18px) saturate(1.4);
          overflow: hidden;
          position: relative;
          transition: background 0.3s, border-color 0.3s, transform 0.18s;
          -webkit-tap-highlight-color: transparent;
          outline: none;
        }
        .avail-btn::after {
          content: "";
          position: absolute; top: 0; left: -60%;
          width: 35%; height: 100%;
          background: linear-gradient(110deg,
            transparent 20%, rgba(255,255,255,0.2) 50%, transparent 80%);
          animation: glint 5.5s ease 2.2s infinite;
        }
        .avail-btn:hover {
          background: rgba(255,255,255,0.11);
          border-color: rgba(255,255,255,0.42);
          transform: translateY(-1px);
        }
        .avail-btn:active { transform: scale(0.96); }
        .avail-dot {
          width: 7px; height: 7px;
          border-radius: 50%; background: #fff;
          flex-shrink: 0;
          box-shadow: 0 0 6px rgba(255,255,255,0.8);
          animation: dotPing 2s ease 1.2s infinite;
        }
        .avail-label {
          font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont,
            "Helvetica Neue", sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: rgb(255, 255, 255);
          -webkit-font-smoothing: antialiased;
          animation: labelIn 0.28s ease both;
        }

        /* ── Headline — mix-blend-mode: difference ───────────
           This div has NO opacity / transform / filter / z-index
           so it creates no stacking context of its own.
           mix-blend-mode: difference makes the browser invert
           the composited background pixels behind white text:
             dark bg  → white text  (|#fff - #000| = #fff)
             mid bg   → inverted colour
             bright bg → dark text  (|#fff - #fff| = #000)
           The result shifts as the Ken Burns animation moves,
           giving the headline a living chrome / adaptive look. */
        .headline-blend {
          mix-blend-mode: difference;
        }

        .hero-headline {
          font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont,
            "Helvetica Neue", sans-serif;
          font-size: clamp(64px, 7.4vw, 118px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.042em;
          margin: 0;
          -webkit-font-smoothing: antialiased;
          font-feature-settings: "kern" 1;
          text-rendering: optimizeLegibility;
        }
        .hl-line   { display: block; overflow: hidden; }
        .hl-line-1 { animation: wipeIn 1.1s cubic-bezier(0.77,0,0.18,1) 380ms both; }
        .hl-line-2 {
          margin-top: 0.05em;
          animation: wipeIn 1.1s cubic-bezier(0.77,0,0.18,1) 580ms both;
        }
        /* Pure white — difference blend does the rest */
        .hl-inner { display: block; color: #ffffff; }

        /* ── Tagline ─────────────────────────────────────── */
        .hero-tagline-wrap {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-top: 44px;
          animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 900ms both;
        }
        .hero-divider {
          width: 36px; height: 1.5px;
          background: rgb(255, 255, 255);
          transform-origin: left; flex-shrink: 0;
          animation: lineGrow 0.7s cubic-bezier(0.16,1,0.3,1) 900ms both;
        }
        .hero-sub {
          font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont,
            "Helvetica Neue", sans-serif;
          font-size: 12px; font-weight: 400;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: rgb(255, 255, 255);
          -webkit-font-smoothing: antialiased;
          animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 950ms both;
        }

        /* ── Scroll indicator ────────────────────────────────
           NO z-index — DOM order (last child) keeps it on top. */
        .scroll-wrap {
          position: absolute;
          bottom: 44px; left: 50%;
          transform: translateX(-50%);
          display: flex; flex-direction: column;
          align-items: center; gap: 9px;
          animation: fadeIn 1s ease 1.3s both;
        }
        .mouse {
          position: relative;
          width: 18px; height: 28px;
          border: 1.5px solid rgb(255, 255, 255);
          border-radius: 9px;
        }
        .mouse-dot {
          position: absolute;
          top: 5px; left: 50%;
          width: 2px; height: 5px;
          background: rgb(255, 255, 255);
          border-radius: 2px;
          animation: scrollBob 1.7s ease-in-out infinite;
        }
        .scroll-label {
          font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont,
            "Helvetica Neue", sans-serif;
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgb(255, 255, 255);
        }

        /* ── Responsive ──────────────────────────────────── */
        @media (min-width: 1440px) {
          .hero-content {
            max-width: 1920px;
            margin-left: auto; margin-right: auto;
            padding-left:  clamp(7.5%, calc((100vw - 1600px)/2 + 7.5%), 14%);
            padding-right: clamp(7.5%, calc((100vw - 1600px)/2 + 7.5%), 14%);
          }
        }
        @media (min-width: 1920px) {
          .hero-content      { padding-bottom: 140px; }
          .hero-badge-wrap   { margin-bottom: 52px; }
          .hero-tagline-wrap { margin-top: 52px; }
          .scroll-wrap       { bottom: 52px; }
        }
        @media (min-width: 1024px) and (max-width: 1279px) {
          .hero-headline { font-size: clamp(58px, 6.8vw, 90px); }
          .hero-content  { padding-bottom: 100px; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .hero-headline {
            font-size: 9.5vw;
            letter-spacing: -0.036em; line-height: 1.05;
          }
          .hl-line { overflow: visible; }
          .hero-content {
            top: 0; bottom: 0; left: 0; right: 0;
            padding-left: 6%; padding-right: 6%;
            padding-top: 38vh; padding-bottom: 0;
            display: flex; flex-direction: column;
            justify-content: flex-start; align-items: flex-start;
          }
          .hero-badge-wrap   { margin-bottom: 32px; }
          .hero-tagline-wrap { margin-top: 28px; }
          .scroll-wrap       { bottom: 20px; }
        }
        @media (max-width: 767px) {
          .hero-content {
            top: 0; bottom: 0; left: 0; right: 0;
            padding-left: 5.5%; padding-right: 5.5%;
            padding-top: 34vh; padding-bottom: 0;
            display: flex; flex-direction: column;
            justify-content: flex-start; align-items: flex-start;
          }
          .scroll-wrap { bottom: 90px; }
          .hero-headline {
            font-size: 13vw;
            letter-spacing: -0.03em; line-height: 1.06;
            word-break: normal; overflow-wrap: break-word; width: 100%;
          }
          .hl-line { overflow: visible; }
          .hero-badge-wrap   { margin-bottom: 24px; }
          .hero-tagline-wrap { margin-top: 20px; gap: 12px; }
          .hero-sub          { font-size: 10px; letter-spacing: 0.07em; }
        }
        @media (min-width: 428px) and (max-width: 767px) {
          .hero-headline     { font-size: 12.5vw; }
          .hero-content      { padding-left: 6%; padding-right: 6%; }
          .hero-tagline-wrap { margin-top: 22px; }
        }
        @media (max-width: 359px) {
          .hero-headline     { font-size: 13.5vw; letter-spacing: -0.026em; }
          .hero-content      { padding-left: 5%; padding-right: 5%; }
          .hero-badge-wrap   { margin-bottom: 20px; }
          .hero-tagline-wrap { margin-top: 18px; gap: 10px; }
          .hero-divider      { width: 22px; }
          .hero-sub          { font-size: 9.5px; letter-spacing: 0.06em; }
          .avail-btn         { padding: 10px 20px 10px 14px; }
          .avail-label       { font-size: 9.5px; letter-spacing: 0.1em; }
          .scroll-wrap       { bottom: 82px; }
        }
        @media (max-width: 900px) and (max-height: 500px) and (orientation: landscape) {
          .hero-headline     { font-size: 7.5vw; line-height: 1.05; }
          .hl-line           { overflow: visible; }
          .hero-content      { padding-left: 6%; padding-right: 6%; padding-top: 35vh; padding-bottom: 0; }
          .hero-badge-wrap   { margin-bottom: 14px; }
          .hero-tagline-wrap { margin-top: 12px; }
          .scroll-wrap       { display: none; }
        }
        @supports (padding: env(safe-area-inset-bottom)) {
          .hero-content { padding-bottom: calc(120px + env(safe-area-inset-bottom, 0px)); }
          .scroll-wrap  { bottom: calc(44px + env(safe-area-inset-bottom, 0px)); }
          @media (max-width: 767px) {
            .hero-content { padding-bottom: 0; }
            .scroll-wrap  { bottom: calc(90px + env(safe-area-inset-bottom, 0px)); }
          }
          @media (min-width: 768px) and (max-width: 1023px) {
            .hero-content { padding-bottom: 0; }
          }
          @media (max-width: 359px) {
            .scroll-wrap { bottom: calc(82px + env(safe-area-inset-bottom, 0px)); }
          }
        }
      `}</style>

      <div className="hero-root" ref={heroRef}>

        {/* 1 — Background (first in DOM = bottom of paint order) */}
        <div
          className="hero-bg"
          style={{ transform: `translate(${bgX}%, ${bgY}%)` }}
        />

        {/* 2 — Film grain */}
        <div className="noise" />

        {/* 3 — Content (no z-index = no stacking context = blend works) */}
        <div className="hero-content">

          <div className="hero-badge-wrap">
            <button
              className="avail-btn"
              onClick={() => setToggled(p => !p)}
              aria-label={toggled ? "Discover the Craft" : "Available for Work"}
            >
              <span className="avail-dot" />
              <span className="avail-label" key={toggled ? "b" : "a"}>
                {toggled ? "Discover the Craft" : "Available for Work"}
              </span>
            </button>
          </div>

          {/* mix-blend-mode: difference — white text inverts bg pixels */}
          <div className="headline-blend">
            <h1 className="hero-headline">
              <span className="hl-line hl-line-1">
                <span className="hl-inner">Exceptional Design</span>
              </span>
              <span className="hl-line hl-line-2">
                <span className="hl-inner">Needs No Explanation</span>
              </span>
            </h1>
          </div>

          <div className="hero-tagline-wrap">
            <div className="hero-divider" />
            <span className="hero-sub">Craft · Clarity · Confidence</span>
          </div>

        </div>

        {/* 4 — Scroll indicator (last in DOM = top of paint order) */}
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