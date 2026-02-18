import { useEffect, useRef } from "react";

function NavIcon({ src, alt, label, href = "#" }) {
  return (
    <a href={href} className="nav-icon-wrap">
      <img
        src={src}
        alt={alt}
        width={20}
        height={20}
        className="nav-icon-img"
        style={{ display: "block", objectFit: "contain" }}
      />
      <span className="nav-label">{label}</span>
    </a>
  );
}

function SplitText({ line, delay = 0 }) {
  const words = line.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            verticalAlign: "bottom",
          }}
        >
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

        .navbar-wrapper {
          position: absolute;
          top: 38px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          z-index: 100;
        }

        .nav-pill {
          display: flex;
          align-items: center;
          height: 52px;
          background: #FFFFFF;
          border: 1.5px solid #D4D4D4;
          border-radius: 14px;
          /* Tighter right padding so icons don't feel pushed too far left */
          padding: 0 8px 0 14px;
          width: 480px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .logo-img {
          width: 30px;
          height: 30px;
          object-fit: contain;
          border-radius: 4px;
          display: block;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.3;
        }

        .logo-text span {
          font-size: 13.5px;
          font-weight: 500;
          color: #111111;
          letter-spacing: 0.08em;
          font-family: -apple-system, "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .nav-spacer { flex: 1; }

        /* Icons sit flush as a group, evenly spaced */
        .nav-icons {
          display: flex;
          align-items: center;
          gap: 0;
        }

        .nav-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 40px;
          border-radius: 10px;
          text-decoration: none;
          cursor: pointer;
        }

        /* Default: near-black icons */
        .nav-icon-img {
          transition: filter 0.18s ease;
          filter: invert(10%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
        }

        /* Hover: exactly #7b7b7b — pure mid-grey, no color tint */
        .nav-icon-wrap:hover .nav-icon-img {
          filter: invert(48%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
        }

        /* Tooltip */
        .nav-label {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: #232323;
          color: #fff;
          font-size: 11px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 7px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s;
          z-index: 999;
          font-family: -apple-system, "SF Pro Text", BlinkMacSystemFont, sans-serif;
        }

        .nav-icon-wrap:hover .nav-label { opacity: 1; }

        .resume-pill {
          height: 52px;
          background: #FFFFFF;
          border: 1.5px solid #D4D4D4;
          border-radius: 14px;
          display: flex;
          align-items: center;
          padding: 0 28px;
          font-size: 15px;
          font-weight: 500;
          color: #111;
          letter-spacing: -0.01em;
          cursor: pointer;
          font-family: -apple-system, "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
          text-decoration: none;
          transition: background 0.15s ease;
          -webkit-font-smoothing: antialiased;
          white-space: nowrap;
        }

        .resume-pill:hover { background: #F6F6F6; }
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
            <NavIcon src="/Home icon.png" alt="Home" label="Home" href="#home" />
            <NavIcon src="/Project icon.png" alt="Projects" label="Projects" href="#projects" />
            <NavIcon src="/Contact icon.png" alt="Contact" label="Contact" href="#contact" />
          </div>
        </div>

        <a className="resume-pill" href="#resume">Resume</a>
      </div>
    </>
  );
}

export default function Hero() {
  const ghostEl = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const move = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", move);

    const tick = () => {
      cur.current.x += (mouse.current.x - cur.current.x) * 0.055;
      cur.current.y += (mouse.current.y - cur.current.y) * 0.055;
      if (ghostEl.current) {
        ghostEl.current.style.transform = `translate(${cur.current.x * 26}px, ${cur.current.y * 18}px)`;
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
        html, body {
          width: 100%;
          height: 100%;
          background: #fff;
          overflow-x: hidden;
        }
        body {
          font-family: -apple-system, "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @keyframes wordUp {
          from { opacity: 0; transform: translateY(110%); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes shine {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        /* Scroll button: fade up in, then gently bounces */
        @keyframes scrollEntry {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Badge */
        .available-badge {
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
          cursor: default;
          transition: border-color 0.3s ease;
          overflow: hidden;
        }

        .available-badge-text {
          display: inline-block;
          color: #111;
        }

        .available-badge:hover { border-color: #ABABAB; }

        .available-badge:hover .available-badge-text {
          background: linear-gradient(
            105deg,
            #707070 0%, #b0b0b0 18%, #d8d8d8 72%, #b0b0b0 82%, #707070 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 2.8s linear infinite;
        }

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
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        /* Scroll button wrapper — entry only */
        .scroll-btn-wrapper {
          animation: scrollEntry 0.8s cubic-bezier(0.16,1,0.3,1) 1100ms both;
        }

        .scroll-btn {
          display: inline-flex;
          overflow: hidden;
          padding: 0;
          border: 1.5px solid #C2C2C2;
          border-radius: 24px;
          background: transparent;
          cursor: pointer;
          font-family: -apple-system, 'SF Pro Text', BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .scroll-btn:hover {
          border-color: #ABABAB;
          background: #F8F8F8;
        }

        .scroll-btn-inner {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 22px;
          font-size: 13.5px;
          font-weight: 400;
          color: #555;
          letter-spacing: -0.005em;
        }

        /* Small downward chevron */
        .scroll-chevron {
          display: inline-block;
          width: 9px;
          height: 9px;
          border-right: 1.5px solid #888;
          border-bottom: 1.5px solid #888;
          transform: rotate(45deg) translateY(-1px);
          flex-shrink: 0;
        }
      `}</style>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          background: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        <Navbar />

        {/* Ghost */}
        <div
          style={{
            position: "absolute",
            top: "14%",
            right: "5.5%",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
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
          }}
        >
          <div style={{ marginBottom: 20, overflow: "hidden" }}>
            <span
              style={{
                display: "inline-block",
                animation: "wordUp 0.8s cubic-bezier(0.16,1,0.3,1) 100ms both",
              }}
            >
              <span className="available-badge">
                <span className="available-badge-text">Available for Work</span>
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

        {/* Scroll Down */}
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
                <span className="scroll-chevron" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}