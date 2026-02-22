import { useRef } from "react";

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

export default function Navbar() {
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