import { useRef, useState, useEffect } from "react";

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

/* ─────────────────────────────────────────────────────────────
   SCROLL THRESHOLD — pixels of scroll needed before hiding.
   10px = responsive but not jittery.
───────────────────────────────────────────────────────────── */
const SCROLL_THRESHOLD = 10;

export default function Navbar() {
  const navRef      = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* ── Page load entrance ── */
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    /* Start above viewport, no transition */
    el.style.transition = "none";
    el.style.transform  = "translateY(-100%)";

    /* One rAF to commit the above style, then enable transition + slide in */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "transform 0.6s ease-out";
        el.style.transform  = "translateY(0)";
      });
    });
  }, []);

  /* ── Scroll hide / show ── */
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    let lastScrollY  = window.scrollY;
    let isHidden     = false;        // track current state to prevent redundant writes
    let rafId        = null;
    let pendingY     = window.scrollY;

    const applyScroll = () => {
      rafId = null;
      const currentY = pendingY;
      const diff     = currentY - lastScrollY;

      /* ── Hide: scrolling DOWN, past top 80px, diff > threshold ── */
      if (diff > SCROLL_THRESHOLD && currentY > 80 && !isHidden) {
        isHidden = true;
        el.style.transition    = "transform 0.4s ease";
        el.style.transform     = "translateY(-100%)";
        el.style.pointerEvents = "none";

      /* ── Show: scrolling UP, any meaningful upward movement ── */
      } else if (diff < -SCROLL_THRESHOLD && isHidden) {
        isHidden = false;
        el.style.transition    = "transform 0.4s ease";
        el.style.transform     = "translateY(0)";
        el.style.pointerEvents = "auto";
      }

      lastScrollY = currentY;
    };

    const onScroll = () => {
      pendingY = window.scrollY;
      /* Cancel any pending frame and schedule a fresh one */
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(applyScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <style>{CSS}</style>

      <div ref={navRef} className="navbar-wrapper">
        <div className="nav-pill">
          <div className="logo-section">
            <img className="logo-img" src="/src/assets/Nav logo icon.png" alt="Arjun Aadhith" />
            <div className="logo-text">
              <span className="logo-name logo-name-animated">Arjun</span>
              <span className="logo-name">Aadhith</span>
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

  .navbar-wrapper {
    position: fixed;
    top: 38px;
    left: 0; right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    z-index: 1000;
    will-change: transform;
    /* transition set entirely by JS — no CSS default here */
  }

  .nav-pill {
    display: flex; align-items: center;
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

  .logo-name {
    font-size: 13.5px; font-weight: 500; color: #111111;
    letter-spacing: 0.08em;
    font-family: -apple-system, "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .logo-name-animated {
    display: inline-block;
    transition: letter-spacing 0.38s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .logo-section:hover .logo-name-animated { letter-spacing: 0.20em; }

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
    transition: color 0.40s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.40s cubic-bezier(0.16, 1, 0.3, 1);
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

  /* ══ Modal ══ */
  .rm-backdrop {
    position: fixed; inset: 0; z-index: 9999;
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
    display: flex;
    flex-direction: column;
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
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background: #F4F4F4;
    padding: 0;
    display: block;
  }
  .rm-img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 0;
    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
  }

  .rm-footer {
    flex-shrink: 0;
    padding: 14px 20px;
    border-top: 1px solid #EFEFEF;
    display: flex;
    justify-content: center;
    background: #ffffff;
  }
  .rm-download {
    display: inline-flex; align-items: center; gap: 8px;
    height: 40px; padding: 0 32px;
    background: #111111; color: #ffffff;
    border: none; border-radius: 10px;
    font-size: 14px; font-weight: 500;
    cursor: pointer;
    font-family: -apple-system, "SF Pro Text", BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    transition: background 0.18s ease, transform 0.15s ease;
    outline: none;
  }
  .rm-download:hover  { background: #333333; }
  .rm-download:active { transform: scale(0.97); }
`;