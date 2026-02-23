import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

function NavIcon({ src, alt, label, href = "#" }) {
  const imgRef = useRef(null);
  const handleEnter = () => {
    const img = imgRef.current; if (!img) return;
    img.classList.remove("icon-leave"); void img.offsetWidth;
    img.classList.add("icon-enter");
  };
  const handleLeave = () => {
    const img = imgRef.current; if (!img) return;
    img.classList.remove("icon-enter"); void img.offsetWidth;
    img.classList.add("icon-leave");
  };
  return (
    <a href={href} className="nav-icon-wrap" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <span className="nav-icon-slot">
        <img ref={imgRef} src={src} alt={alt} width={20} height={20}
          className="nav-icon-img" style={{ display: "block", objectFit: "contain" }} />
      </span>
      <span className="nav-label">{label}</span>
    </a>
  );
}

function ResumeModal({ isOpen, onClose }) {
  const pdfPath     = "/resume/Arjun Aadhith's resume.pdf";
  const resumeImage = "/resume/Arjun Aadhith's resume.jpg";
  const fileName    = "Arjun Aadhith's resume.pdf";

  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = pdfPath; a.download = fileName;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return (
    <div
      className={`rm-backdrop${isOpen ? " rm-open" : ""}`}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="rm-modal">
        <div className="rm-topbar">
          <span className="rm-title">Resume</span>
          <button className="rm-close" onClick={onClose} aria-label="Close">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="rm-body">
          <img src={resumeImage} alt="Resume Preview" className="rm-img" draggable={false} />
        </div>
        <div className="rm-footer">
          <button className="rm-download" onClick={handleDownload}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v9M4 7l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

const getScrollY = () =>
  window.scrollY ||
  document.documentElement.scrollTop ||
  document.body.scrollTop ||
  0;

const SCROLL_THRESHOLD = 10;

export default function Navbar() {
  const navRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    let lastScrollY = getScrollY();
    let isHidden    = false;
    let ticking     = false;

    const update = () => {
      ticking = false;
      const currentY = getScrollY();
      const diff     = currentY - lastScrollY;

      if (currentY <= 0) {
        if (isHidden) {
          isHidden = false;
          el.classList.remove("nav-hidden");
        }
      } else if (diff > SCROLL_THRESHOLD && !isHidden) {
        isHidden = true;
        el.classList.add("nav-hidden");
      } else if (diff < 0 && isHidden) {
        isHidden = false;
        el.classList.remove("nav-hidden");
      }

      lastScrollY = currentY <= 0 ? 0 : currentY;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  const navContent = (
    <>
      <style>{CSS}</style>
      <div ref={navRef} className="navbar-wrapper">
        <div className="nav-pill">

          {/* Logo with shine effect on hover */}
          <div className="logo-section">
            <img className="logo-img" src="/src/assets/Nav logo icon.png" alt="Arjun Aadhith" />
            <div className="logo-text">
              <span className="logo-name-shine">
                <span className="logo-name-text">Arjun</span>
                <span className="logo-name-text">Aadhith</span>
                <span className="shine-beam" />
              </span>
            </div>
          </div>

          <div className="nav-spacer" />
          <div className="nav-icons">
            <NavIcon src="/Home icon.png"    alt="Home"     label="Home"     href="#home" />
            <NavIcon src="/Project icon.png" alt="Projects" label="Projects" href="#projects" />
            <NavIcon src="/Contact icon.png" alt="Contact"  label="Contact"  href="#contact" />
          </div>
        </div>

        <button className="resume-pill" onClick={() => setModalOpen(true)}>
          <span className="resume-pill-text">Resume</span>
        </button>
      </div>
      <ResumeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );

  return createPortal(navContent, document.body);
}

const CSS = `
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
      enterOut 0.20s cubic-bezier(0.55, 0, 0.45, 1) 0ms   forwards,
      enterIn  0.30s cubic-bezier(0.16, 1, 0.3,  1) 0.20s forwards;
  }
  .icon-leave {
    animation:
      leaveOut 0.20s cubic-bezier(0.55, 0, 0.45, 1) 0ms   forwards,
      leaveIn  0.30s cubic-bezier(0.16, 1, 0.3,  1) 0.20s forwards;
  }

  /* ── Navbar wrapper: slow, smooth rise and hide ── */
  .navbar-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding-top: 38px;
    padding-bottom: 12px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 10px;
    z-index: 99999;
    transform: translateY(0);
    /* Slow ease-in-out: hides and shows with a gentle, deliberate motion */
    transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .navbar-wrapper.nav-hidden {
    /* Large enough value to push entire wrapper (padding 38 + pill 52 + buffer) off screen */
    transform: translateY(-120px);
  }

  /* ── Nav pill ── */
  .nav-pill {
    display: flex; align-items: center;
    height: 52px;
    background: #FFFFFF;
    border: 1.5px solid #D4D4D4;
    border-radius: 14px;
    padding: 0 8px 0 14px;
    width: 480px;
  }

  /* ── Logo section ── */
  .logo-section {
    display: flex; align-items: center; gap: 8px; flex-shrink: 0;
    cursor: default;
  }
  .logo-img {
    width: 30px; height: 30px; object-fit: contain;
    border-radius: 4px; display: block;
  }

  /* 
    Shine container: clips the beam to the text area only.
    position:relative + overflow:hidden traps the beam inside. 
  */
  .logo-name-shine {
    position: relative;
    display: flex;
    flex-direction: column;
    line-height: 1.3;
    overflow: hidden;
    border-radius: 2px;
  }

  .logo-name-text {
    display: block;
    font-size: 13.5px;
    font-weight: 500;
    color: #111111;
    letter-spacing: 0.08em;
    font-family: -apple-system, "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    position: relative;
    z-index: 1;
  }

  /*
    Shine beam: a narrow bright diagonal stripe, positioned off the left edge.
    On hover it slides from left to right across the text.
  */
  .shine-beam {
    position: absolute;
    top: -20%;
    left: -80%;
    width: 45%;
    height: 140%;
    background: linear-gradient(
      105deg,
      transparent 20%,
      rgba(255, 255, 255, 0.0) 30%,
      rgba(255, 255, 255, 0.75) 50%,
      rgba(255, 255, 255, 0.0) 70%,
      transparent 80%
    );
    transform: skewX(-15deg);
    pointer-events: none;
    z-index: 2;
    /* Sits off-screen left by default — no transition so it resets instantly */
    transition: none;
  }

  /* On hover: slide the beam right across the text over 0.55s */
  .logo-section:hover .shine-beam {
    left: 120%;
    transition: left 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-spacer { flex: 1; }
  .nav-icons  { display: flex; align-items: center; gap: 0; }

  .nav-icon-wrap {
    position: relative;
    display: flex; align-items: center; justify-content: center;
    width: 46px; height: 40px;
    border-radius: 10px; text-decoration: none; cursor: pointer;
  }
  .nav-icon-slot {
    display: flex; align-items: center; justify-content: center;
    width: 24px; height: 24px;
    overflow: hidden;
    clip-path: inset(-200% 0 -200% 0);
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

  /* ── Resume pill ── */
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
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    white-space: nowrap;
    outline: none;
    transition: color 0.40s cubic-bezier(0.16, 1, 0.3, 1),
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

  /* ── Modal ── */
  .rm-backdrop {
    position: fixed; inset: 0; z-index: 999999;
    background: rgba(0,0,0,0.52);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    opacity: 0; pointer-events: none;
    transition: opacity 0.28s ease;
  }
  .rm-backdrop.rm-open { opacity: 1; pointer-events: auto; }

  .rm-modal {
    background: #ffffff;
    border-radius: 18px;
    width: min(780px, 100%);
    height: 90vh;
    display: flex; flex-direction: column;
    overflow: hidden;
    transform: scale(0.94) translateY(10px);
    transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .rm-backdrop.rm-open .rm-modal { transform: scale(1) translateY(0); }

  .rm-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #EFEFEF;
    flex-shrink: 0;
  }
  .rm-title {
    font-size: 14px; font-weight: 600; color: #111;
    font-family: -apple-system, "SF Pro Text", BlinkMacSystemFont, sans-serif;
    letter-spacing: -0.01em;
  }
  .rm-close {
    display: flex; align-items: center; justify-content: center;
    width: 30px; height: 30px;
    background: #F2F2F2; border: none; border-radius: 8px;
    cursor: pointer; color: #666;
    transition: background 0.18s ease, color 0.18s ease;
    outline: none; flex-shrink: 0;
  }
  .rm-close:hover { background: #E6E6E6; color: #111; }

  .rm-body {
    flex: 1; overflow-y: auto; overflow-x: hidden;
    background: #F4F4F4; padding: 0; display: block;
  }
  .rm-img {
    display: block; width: 100%; height: auto;
    pointer-events: none; user-select: none; -webkit-user-drag: none;
  }

  .rm-footer {
    flex-shrink: 0; padding: 14px 20px;
    border-top: 1px solid #EFEFEF;
    display: flex; justify-content: center;
    background: #ffffff;
  }
  .rm-download {
    display: inline-flex; align-items: center; gap: 8px;
    height: 40px; padding: 0 32px;
    background: #111111; color: #ffffff;
    border: none; border-radius: 10px;
    font-size: 14px; font-weight: 500; cursor: pointer;
    font-family: -apple-system, "SF Pro Text", BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    transition: background 0.18s ease, transform 0.15s ease;
    outline: none;
  }
  .rm-download:hover  { background: #333333; }
  .rm-download:active { transform: scale(0.97); }
`;