import { useEffect, useRef } from "react";

function NavIcon({ src, alt, label, href = "#" }) {
  const imgRef = useRef(null);

  const handleEnter = () => {
    const img = imgRef.current;
    if (!img) return;
    img.classList.remove("icon-leave");
    void img.offsetWidth;
    img.classList.add("icon-enter");
  };

  const handleLeave = () => {
    const img = imgRef.current;
    if (!img) return;
    img.classList.remove("icon-enter");
    void img.offsetWidth;
    img.classList.add("icon-leave");
  };

  return (
    <a
      href={href}
      className="nav-icon-wrap"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span className="nav-icon-slot">
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={20}
          height={20}
          className="nav-icon-img"
          style={{ display: "block", objectFit: "contain" }}
        />
      </span>
      <span className="nav-label">{label}</span>
    </a>
  );
}

function SplitText({ line, delay = 0 }) {
  const words = line.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={i} style={{ display: "inline-block", verticalAlign: "bottom" }}>
          <span
            style={{
              display: "inline-block",
              animation: `wordUp 0.8s cubic-bezier(0.16,1,0.3,1) both`,
              animationDelay: `${delay + i * 95}ms`,
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </>
  );
}

function Navbar() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes enterOut {
          from { transform: translateY(0);     opacity: 1; }
          to   { transform: translateY(-150%); opacity: 0; }
        }
        @keyframes enterIn {
          from { transform: translateY(150%);  opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @keyframes leaveOut {
          from { transform: translateY(0);     opacity: 1; }
          to   { transform: translateY(150%);  opacity: 0; }
        }
        @keyframes leaveIn {
          from { transform: translateY(-150%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }

        .icon-enter {
          animation:
            enterOut 0.20s cubic-bezier(0.55, 0, 0.45, 1) 0ms     forwards,
            enterIn  0.30s cubic-bezier(0.16, 1, 0.3,  1) 0.20s   forwards;
        }
        .icon-leave {
          animation:
            leaveOut 0.20s cubic-bezier(0.55, 0, 0.45, 1) 0ms     forwards,
            leaveIn  0.30s cubic-bezier(0.16, 1, 0.3,  1) 0.20s   forwards;
        }

        .navbar-wrapper {
          position: absolute;
          top: 38px;
          left: 0; right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          z-index: 50;
        }
        .nav-pill {
          display: flex;
          align-items: center;
          height: 52px;
          background: #FFFFFF;
          border: 1.5px solid #D4D4D4;
          border-radius: 14px;
          padding: 0 8px 0 14px;
          width: 480px;
        }
        .logo-section { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .logo-img { width: 30px; height: 30px; object-fit: contain; border-radius: 4px; display: block; }
        .logo-text { display: flex; flex-direction: column; line-height: 1.3; }
        .logo-text span {
          font-size: 13.5px; font-weight: 500; color: #111111;
          letter-spacing: 0.08em;
          font-family: -apple-system, "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .nav-spacer { flex: 1; }
        .nav-icons { display: flex; align-items: center; gap: 0; }
        .nav-icon-wrap {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          width: 46px; height: 40px;
          border-radius: 10px; text-decoration: none; cursor: pointer;
        }
        .nav-icon-slot {
          display: flex; align-items: center; justify-content: center;
          width: 22px; height: 22px; overflow: hidden;
        }
        .nav-icon-img {
          display: block;
          filter: invert(10%) sepia(0%) saturate(0%) brightness(100%) contrast(100%);
        }
        .nav-label {
          position: absolute;
          top: calc(100% + 8px); left: 50%;
          transform: translateX(-50%) translateY(4px);
          background: #232323; color: #fff;
          font-size: 11px; font-weight: 500;
          padding: 4px 10px; border-radius: 7px;
          white-space: nowrap; pointer-events: none; opacity: 0;
          transition: opacity 0.18s ease, transform 0.18s ease;
          z-index: 999;
          font-family: -apple-system, "SF Pro Text", BlinkMacSystemFont, sans-serif;
        }
        .nav-icon-wrap:hover .nav-label { opacity: 1; transform: translateX(-50%) translateY(0px); }

        .resume-pill {
          position: relative;
          height: 52px;
          background: #FFFFFF;
          border: 1.5px solid #D4D4D4;
          border-radius: 14px;
          display: flex; align-items: center;
          padding: 0 28px;
          font-size: 15px; font-weight: 500; color: #111;
          letter-spacing: -0.01em;
          cursor: pointer;
          font-family: -apple-system, "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
          text-decoration: none;
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
          white-space: nowrap;
          transition:
            color        0.40s cubic-bezier(0.16, 1, 0.3, 1),
            border-color 0.40s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .resume-pill::before {
          content: "";
          position: absolute; inset: 0;
          background: #111111;
          border-radius: inherit;
          transform: translateY(102%);
          transition: transform 0.46s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 0;
        }
        .resume-pill:hover::before { transform: translateY(0); }
        .resume-pill-text { position: relative; z-index: 1; }
        .resume-pill:hover { color: #ffffff; border-color: #111111; }
      `}</style>

      <div className="navbar-wrapper">
        <div className="nav-pill">
          <div className="logo-section">
            <img className="logo-img" src="/src/assets/Nav logo icon.png" alt="Arjun Aadhith" />
            <div className="logo-text">
              <span>Arjun</span>
              <span>Aadhith</span>
            </div>
          </div>
          <div className="nav-spacer" />
          <div className="nav-icons">
            <NavIcon src="/Home icon.png"    alt="Home"     label="Home"     href="#home" />
            <NavIcon src="/Project icon.png" alt="Projects" label="Projects" href="#projects" />
            <NavIcon src="/Contact icon.png" alt="Contact"  label="Contact"  href="#contact" />
          </div>
        </div>
        <a className="resume-pill" href="#resume">
          <span className="resume-pill-text">Resume</span>
        </a>
      </div>
    </>
  );
}

export default function Hero() {
  const ghostEl = useRef(null);
  const mouse   = useRef({ x: 0, y: 0 });
  const cur     = useRef({ x: 0, y: 0 });
  const raf     = useRef(null);

  useEffect(() => {
    const move = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", move);

    const tick = () => {
      cur.current.x += (mouse.current.x - cur.current.x) * 0.055;
      cur.current.y += (mouse.current.y - cur.current.y) * 0.055;
      if (ghostEl.current) {
        ghostEl.current.style.transform =
          `translate(${cur.current.x * 26}px, ${cur.current.y * 18}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; height: 100%; overflow-x: hidden; }
        body {
          font-family: -apple-system, "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @keyframes wordUp {
          from { opacity: 0; transform: translateY(110%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollEntry {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* available-badge — StarBorder, no text shine */
        .available-badge {
          display: inline-block;
          position: relative;
          padding: 1.5px;
          border-radius: 12px;
          overflow: hidden;
          cursor: default;
        }
        .available-badge::before {
          content: "";
          position: absolute;
          width: 300%; height: 50%;
          bottom: -12px; right: -250%;
          border-radius: 50%;
          background: radial-gradient(circle, #888888, transparent 10%);
          opacity: 0;
          animation: star-bottom 6s linear infinite alternate;
          animation-play-state: paused;
          transition: opacity 0.4s ease;
          z-index: 0;
          pointer-events: none;
        }
        .available-badge::after {
          content: "";
          position: absolute;
          width: 300%; height: 50%;
          top: -12px; left: -250%;
          border-radius: 50%;
          background: radial-gradient(circle, #888888, transparent 10%);
          opacity: 0;
          animation: star-top 6s linear infinite alternate;
          animation-play-state: paused;
          transition: opacity 0.4s ease;
          z-index: 0;
          pointer-events: none;
        }
        .available-badge:hover::before,
        .available-badge:hover::after {
          animation-play-state: running;
          opacity: 0.8;
        }
        @keyframes star-bottom {
          0%   { transform: translate(0%, 0%);    opacity: 1; }
          100% { transform: translate(-100%, 0%); opacity: 0; }
        }
        @keyframes star-top {
          0%   { transform: translate(0%, 0%);    opacity: 1; }
          100% { transform: translate(100%, 0%);  opacity: 0; }
        }
        .available-badge-inner {
          position: relative;
          z-index: 1;
          display: inline-block;
          padding: 10px 24px;
          border: 1.5px solid #C2C2C2;
          border-radius: 12px;
          background: #FFF;
          letter-spacing: 0.01em;
          font-size: 15px;
          font-weight: 600;
          font-family: -apple-system, 'SF Pro Text', BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          transition: border-color 0.3s ease;
        }
        .available-badge:hover .available-badge-inner { border-color: #888888; }
        .available-badge-text { display: inline-block; color: #111; }

        .hero-headline {
          margin: 0;
          font-size: clamp(70px, 9.5vw, 110px);
          font-weight: 950;
          color: #0A0A0A;
          letter-spacing: -0.038em;
          line-height: 1.0;
          font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
          font-optical-sizing: auto;
          font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .scroll-btn-wrapper {
          animation: scrollEntry 0.8s cubic-bezier(0.16,1,0.3,1) 1100ms both;
        }
        .scroll-btn {
          display: inline-flex;
          padding: 0;
          border: 1.5px solid #C2C2C2;
          border-radius: 24px;
          background: transparent;
          cursor: pointer;
          font-family: -apple-system, 'SF Pro Text', BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .scroll-btn:hover { border-color: #ABABAB; background: #F8F8F8; }
        .scroll-btn-inner {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 20px 9px 22px;
          font-size: 13.5px;
          font-weight: 400;
          color: #555;
          letter-spacing: -0.005em;
        }

        /* ── CHANGED: scroll icon replaces single chevron ── */

        /* Mouse-shaped scroll indicator */
        .scroll-icon {
          position: relative;
          width: 16px;
          height: 24px;
          border: 1.5px solid #aaa;
          border-radius: 8px;
          flex-shrink: 0;
          transition: border-color 0.2s ease;
          overflow: hidden;
        }

        /* The scroll wheel dot inside the mouse */
        .scroll-icon::before {
          content: "";
          position: absolute;
          top: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 2.5px;
          height: 5px;
          background: #aaa;
          border-radius: 2px;
          /* idle: static */
          animation: none;
          transition: background 0.2s ease;
        }

        /* On hover: dot scrolls down inside the mouse */
        .scroll-btn:hover .scroll-icon {
          border-color: #666;
        }
        .scroll-btn:hover .scroll-icon::before {
          background: #666;
          animation: scroll-dot 1.1s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        @keyframes scroll-dot {
          0%   { transform: translateX(-50%) translateY(0px);  opacity: 1; }
          60%  { transform: translateX(-50%) translateY(8px);  opacity: 0.2; }
          61%  { transform: translateX(-50%) translateY(-2px); opacity: 0; }
          100% { transform: translateX(-50%) translateY(0px);  opacity: 1; }
        }
        /* ─────────────────────────────────────── */
      `}</style>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          background: "#ffffff",
          borderRadius: "inherit",
          overflow: "hidden",
        }}
      >
        <Navbar />

        {/* Ghost parallax */}
        <div style={{ position: "absolute", top: "14%", right: "5.5%", zIndex: 10, pointerEvents: "none" }}>
          <div ref={ghostEl} style={{ willChange: "transform" }}>
            <img
              src="/src/assets/ghost.png"
              alt="Red ghost character"
              style={{ width: 255, height: 255, objectFit: "contain", display: "block" }}
            />
          </div>
        </div>

        {/* Hero text */}
        <div
          style={{
            position: "absolute",
            top: "56%",
            left: "9.5%",
            right: "9.5%",
            transform: "translateY(-50%)",
            marginTop: "20px",
            zIndex: 10,
          }}
        >
          <div style={{ marginBottom: 20, overflow: "hidden" }}>
            <span style={{ display: "inline-block", animation: "wordUp 0.8s cubic-bezier(0.16,1,0.3,1) 100ms both" }}>
              <span className="available-badge">
                <span className="available-badge-inner">
                  <span className="available-badge-text">Available for Work</span>
                </span>
              </span>
            </span>
          </div>

          <h1 className="hero-headline">
            <span style={{ display: "block" }}>
              <SplitText line="Exceptional design" delay={280} />
            </span>
            <span style={{ display: "block" }}>
              <SplitText line="needs no explanation" delay={640} />
            </span>
          </h1>
        </div>

        {/* Scroll Down — CHANGED: chevron → mouse scroll icon */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div className="scroll-btn-wrapper">
            <button className="scroll-btn">
              <span className="scroll-btn-inner">
                Scroll Down
                {/* Mouse-shaped scroll indicator */}
                <span className="scroll-icon" />
              </span>
            </button>
          </div>
        </div>

      </div>
    </>
  );
}