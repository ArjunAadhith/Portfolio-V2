import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

// ─── Scroll helpers ───────────────────────────────────────────────
function getScrollContainer() {
  const html = document.documentElement;
  const body = document.body;
  if (html.scrollTop > 0) return html;
  if (body.scrollTop > 0) return body;
  html.scrollTop = 1;
  if (html.scrollTop === 1) { html.scrollTop = 0; return html; }
  body.scrollTop = 1;
  if (body.scrollTop === 1) { body.scrollTop = 0; return body; }
  return window;
}

function smoothScrollTo(top) {
  getScrollContainer().scrollTo({ top, behavior: "smooth" });
}

function getScrollY() {
  return (
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    window.scrollY ||
    0
  );
}

const SCROLL_THRESHOLD = 10;

// ─── NavIcon ──────────────────────────────────────────────────────
function NavIcon({ src, alt, label, href = "#", onNavClick, active }) {
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

  const isExternal = href.startsWith("http") || href.startsWith("mailto:");

  const handleClick = (e) => {
    window.dispatchEvent(new CustomEvent("portfolio:closeAbout"));
    if (href.startsWith("#")) {
      e.preventDefault();
      if (href === "#home") {
        smoothScrollTo(0);
      } else {
        const id = href.slice(1);
        const el = document.getElementById(id);
        if (el) {
          const container = getScrollContainer();
          const scrollTop = container === window ? window.scrollY : container.scrollTop;
          const y         = scrollTop + el.getBoundingClientRect().top - 90;
          smoothScrollTo(y);
        }
      }
      onNavClick?.(href);
    }
  };

  return (
    <a
      href={href}
      className={`nav-icon-wrap${active ? " nav-icon-active" : ""}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      aria-label={label}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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

// ─── Resume Modal ─────────────────────────────────────────────────
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

// ─── Navbar ────────────────────────────────────────────────────────
export default function Navbar() {
  const navRef                      = useRef(null);
  const [modalOpen, setModalOpen]   = useState(false);
  const [activeHref, setActiveHref] = useState("#home");
  const [aboveAbout, setAboveAbout] = useState(false);

  // ── Entry animation ──────────────────────────────────────────────
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    el.style.transform = "translateY(-22px)";
    el.style.opacity   = "0";
    el.style.filter    = "blur(7px)";
    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        el.style.transition = [
          "transform 1.80s cubic-bezier(0.22, 1, 0.36, 1)",
          "opacity   1.20s cubic-bezier(0.22, 1, 0.36, 1)",
          "filter    1.10s cubic-bezier(0.22, 1, 0.36, 1)",
        ].join(", ");
        el.style.transform = "translateY(0)";
        el.style.opacity   = "1";
        el.style.filter    = "blur(0px)";
      });
    });
    return () => { cancelAnimationFrame(raf1); if (raf2) cancelAnimationFrame(raf2); };
  }, []);

  // ── Listen for MoreAbout open/close ──────────────────────────────
  useEffect(() => {
    const fn = (e) => setAboveAbout(!e.detail.visible);
    window.addEventListener("portfolio:nav", fn);
    return () => window.removeEventListener("portfolio:nav", fn);
  }, []);

  // ── Scroll-based hide / reveal (window) ──────────────────────────
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    let lastScrollY = getScrollY();
    let isHidden    = false;
    let ticking     = false;

    const update = (currentY) => {
      ticking = false;
      const diff = currentY - lastScrollY;
      if (currentY <= 0) {
        if (isHidden) { isHidden = false; el.classList.remove("nav-hidden"); }
      } else if (diff > SCROLL_THRESHOLD && !isHidden) {
        isHidden = true; el.classList.add("nav-hidden");
      } else if (diff < -SCROLL_THRESHOLD && isHidden) {
        isHidden = false; el.classList.remove("nav-hidden");
      }
      lastScrollY = Math.max(0, currentY);
    };

    const onWindowScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(() => update(getScrollY())); }
    };

    window.addEventListener("scroll",   onWindowScroll, { passive: true, capture: true });
    document.addEventListener("scroll", onWindowScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll",   onWindowScroll, { capture: true });
      document.removeEventListener("scroll", onWindowScroll, { capture: true });
    };
  }, []);

  // ── Scroll-based hide / reveal (MoreAbout panel) ─────────────────
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    let isHidden = false;

    const fn = (e) => {
      const { direction, scrollTop } = e.detail;
      if (scrollTop <= 10) {
        if (isHidden) { isHidden = false; el.classList.remove("nav-hidden"); }
      } else if (direction === "down" && !isHidden) {
        isHidden = true; el.classList.add("nav-hidden");
      } else if (direction === "up" && isHidden) {
        isHidden = false; el.classList.remove("nav-hidden");
      }
    };

    window.addEventListener("portfolio:aboutScroll", fn);
    return () => window.removeEventListener("portfolio:aboutScroll", fn);
  }, []);

  // ── IntersectionObserver — active icon sync ──────────────────────
  useEffect(() => {
    const ids = ["home", "projects", "contact"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.id}`);
        });
      },
      { threshold: 0.25 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const navContent = (
    <>
      <style>{CSS}</style>
      <div
        ref={navRef}
        className={`navbar-wrapper${aboveAbout ? " nav-above-about" : ""}`}
        style={{ transform: "translateY(-22px)", opacity: 0, filter: "blur(7px)" }}
      >
        {/* Nav pill — always visible at all breakpoints */}
        <div className="nav-pill">
          <div className="logo-section">
            <img className="logo-img" src="/Nav logo icon.png" alt="Arjun Aadhith" />
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
            <NavIcon src="/Home icon.png"    alt="Home"     label="Home"     href="#home"     onNavClick={setActiveHref} active={activeHref === "#home"} />
            <NavIcon src="/Project icon.png" alt="Projects" label="Projects" href="#projects" onNavClick={setActiveHref} active={activeHref === "#projects"} />
            <NavIcon src="/Contact icon.png" alt="Contact"  label="Contact"  href="#contact"  onNavClick={setActiveHref} active={activeHref === "#contact"} />
          </div>
        </div>

        {/*
         * Resume pill — desktop & tablet only.
         * Hidden via CSS on ≤639px. No JS conditional needed;
         * keeping it in the DOM avoids layout recalculation on resize.
         */}
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

  /* ── Icon bounce animations ─────────────────────────────────── */
  @keyframes enterOut { from{transform:translateY(0);opacity:1}    to{transform:translateY(-150%);opacity:0} }
  @keyframes enterIn  { from{transform:translateY(150%);opacity:0} to{transform:translateY(0);opacity:1}    }
  @keyframes leaveOut { from{transform:translateY(0);opacity:1}    to{transform:translateY(150%);opacity:0}  }
  @keyframes leaveIn  { from{transform:translateY(-150%);opacity:0} to{transform:translateY(0);opacity:1}   }

  .icon-enter {
    animation: enterOut 0.20s cubic-bezier(0.55,0,0.45,1) 0ms    forwards,
               enterIn  0.30s cubic-bezier(0.16,1,0.3,1)  0.20s  forwards;
  }
  .icon-leave {
    animation: leaveOut 0.20s cubic-bezier(0.55,0,0.45,1) 0ms    forwards,
               leaveIn  0.30s cubic-bezier(0.16,1,0.3,1)  0.20s  forwards;
  }

  /* ═══════════════════════════════════════════════════════════════
     WRAPPER  — desktop default
  ═══════════════════════════════════════════════════════════════ */
  .navbar-wrapper {
    position: fixed; top: 0; left: 0; right: 0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 10px;
    padding: 38px 24px 12px;
    z-index: 100;
    transition:
      transform 0.65s cubic-bezier(0.4,0,0.2,1),
      opacity   0.65s cubic-bezier(0.4,0,0.2,1),
      filter    0.50s cubic-bezier(0.4,0,0.2,1),
      z-index   0s    linear;
  }
  .navbar-wrapper.nav-above-about { z-index: 200001 !important; }
  .navbar-wrapper.nav-hidden {
    transform : translateY(-120px) !important;
    opacity   : 0.4               !important;
    filter    : blur(3px)         !important;
  }

  /* ─── Nav pill ───────────────────────────────────────────────── */
  .nav-pill {
    display: flex; align-items: center;
    height: 52px;
    background: #FFFFFF;
    border: 1.5px solid #D4D4D4;
    border-radius: 14px;
    padding: 0 8px 0 14px;
    width: 480px;
    flex-shrink: 0;
  }

  /* ─── Logo ───────────────────────────────────────────────────── */
  .logo-section { display:flex; align-items:center; gap:8px; flex-shrink:0; cursor:default; }
  .logo-img { width:30px; height:30px; object-fit:contain; border-radius:4px; display:block; }
  .logo-name-shine {
    position:relative; display:flex; flex-direction:column;
    line-height:1.3; overflow:hidden; border-radius:2px;
  }
  .logo-name-text {
    display:block; font-size:13.5px; font-weight:500; color:#111111;
    letter-spacing:0.08em;
    font-family:-apple-system,"SF Pro Text",BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;
    -webkit-font-smoothing:antialiased; position:relative; z-index:1;
  }
  .shine-beam {
    position:absolute; top:-20%; left:-80%; width:45%; height:140%;
    background:linear-gradient(
      105deg, transparent 20%, rgba(255,255,255,0) 30%,
      rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 70%, transparent 80%
    );
    transform:skewX(-15deg); pointer-events:none; z-index:2; transition:none;
  }
  .logo-section:hover .shine-beam { left:120%; transition:left 0.55s cubic-bezier(0.4,0,0.2,1); }

  .nav-spacer { flex:1; }
  .nav-icons  { display:flex; align-items:center; gap:0; }

  /* ─── Icon wraps ─────────────────────────────────────────────── */
  .nav-icon-wrap {
    position:relative; display:flex; align-items:center; justify-content:center;
    width:46px; height:40px; border-radius:10px;
    text-decoration:none; cursor:pointer;
    transition:transform 0.30s cubic-bezier(0.22,1,0.36,1);
    transform-origin:center;
  }
  .nav-icon-wrap:hover  { transform:scale(1.08); }
  .nav-icon-wrap:active { transform:scale(0.93); transition-duration:0.10s; }

  .nav-icon-slot {
    display:flex; align-items:center; justify-content:center;
    width:24px; height:24px;
    overflow:hidden; clip-path:inset(-200% 0 -200% 0);
  }
  .nav-icon-img {
    display:block;
    filter:invert(10%) sepia(0%) saturate(0%) brightness(100%) contrast(100%);
    transition:filter 0.2s ease;
  }
  /* Active state: icon goes fully black */
  .nav-icon-active .nav-icon-img { filter:brightness(0%); }

  /* Tooltip */
  .nav-label {
    position:absolute; top:calc(100% + 8px); left:50%;
    transform:translateX(-50%) translateY(4px);
    background:#232323; color:#fff;
    font-size:11px; font-weight:500;
    padding:4px 10px; border-radius:7px; white-space:nowrap;
    pointer-events:none; opacity:0;
    transition:opacity 0.18s ease, transform 0.18s ease; z-index:100;
    font-family:-apple-system,"SF Pro Text",BlinkMacSystemFont,sans-serif;
  }
  .nav-icon-wrap:hover .nav-label { opacity:1; transform:translateX(-50%) translateY(0px); }

  /* ─── Resume pill ────────────────────────────────────────────── */
  .resume-pill {
    position:relative; height:52px;
    background:#FFFFFF; border:1.5px solid #D4D4D4; border-radius:14px;
    display:flex; align-items:center; padding:0 28px;
    font-size:15px; font-weight:500; color:#111; letter-spacing:-0.01em;
    cursor:pointer; white-space:nowrap; outline:none; overflow:hidden;
    font-family:-apple-system,"SF Pro Text",BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;
    -webkit-font-smoothing:antialiased; flex-shrink:0;
    transition:
      color        0.40s cubic-bezier(0.16,1,0.3,1),
      border-color 0.40s cubic-bezier(0.16,1,0.3,1),
      transform    0.28s cubic-bezier(0.22,1,0.36,1);
  }
  .resume-pill::before {
    content:""; position:absolute; inset:0;
    background:#111111; border-radius:inherit;
    transform:translateY(102%);
    transition:transform 0.46s cubic-bezier(0.16,1,0.3,1); z-index:0;
  }
  .resume-pill:hover::before { transform:translateY(0); }
  .resume-pill:hover  { color:#ffffff; border-color:#111111; }
  .resume-pill:active { transform:scale(0.96); transition-duration:0.10s; }
  .resume-pill-text   { position:relative; z-index:1; }


  /* ═══════════════════════════════════════════════════════════════
     TABLET  640px – 1023px
     • Pill goes fluid (flex:1) so it always fills remaining space
     • Resume button scales down slightly but stays visible
  ═══════════════════════════════════════════════════════════════ */
  @media (min-width: 640px) and (max-width: 1023px) {
    .navbar-wrapper {
      padding: 26px 20px 10px;
      gap: 8px;
    }
    .nav-pill {
      width: auto;
      flex: 1;
      max-width: 440px;
      height: 48px;
      padding: 0 6px 0 12px;
    }
    .resume-pill {
      height: 48px;
      padding: 0 22px;
      font-size: 14px;
    }
    .logo-img { width:28px; height:28px; }
    .logo-name-text { font-size:12.5px; }
    .nav-icon-wrap { width:40px; height:36px; }
  }


  /* ═══════════════════════════════════════════════════════════════
     MOBILE  ≤639px
     • Wrapper padding tightened for screen edges
     • Nav pill spans full safe width — no fixed pixel width
     • Resume pill hidden via display:none (no JS needed)
     • Tooltips suppressed (no hover on touch)
     • Touch targets kept at ≥44px
  ═══════════════════════════════════════════════════════════════ */
  @media (max-width: 639px) {
    .navbar-wrapper {
      padding: 40px 28px 10px;
      gap: 0;
    }
    .nav-pill {
      width: 100%;
      max-width: 360px;
      height: 52px;
      padding: 0 8px 0 12px;
      border-radius: 16px;
    }
    .logo-img { width:28px; height:28px; }
    .logo-name-text { font-size:12px; }
    .nav-icon-wrap { width:44px; height:44px; }
    /* Resume completely removed from mobile layout */
    .resume-pill { display:none !important; }
    /* Tooltips serve no purpose on touch screens */
    .nav-label { display:none; }
  }

  /* ── Very small phones  ≤374px ───────────────────────────────── */
  @media (max-width: 374px) {
    /*
     * top padding stays locked at 40px — only horizontal padding
     * and component sizing compress for very narrow screens.
     */
    .navbar-wrapper { padding: 40px 24px 8px; }
    .nav-pill { height:50px; padding:0 6px 0 10px; }
    .logo-img { width:26px; height:26px; }
    .logo-name-text { font-size:11px; letter-spacing:0.05em; }
    .nav-icon-wrap { width:40px; height:40px; }
  }


  /* ═══════════════════════════════════════════════════════════════
     RESUME MODAL
  ═══════════════════════════════════════════════════════════════ */
  .rm-backdrop {
    position:fixed; inset:0; z-index:200002;
    background:rgba(0,0,0,0.52);
    backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
    display:flex; align-items:center; justify-content:center;
    padding:clamp(12px, 4vw, 24px);
    opacity:0; pointer-events:none; transition:opacity 0.28s ease;
  }
  .rm-backdrop.rm-open { opacity:1; pointer-events:auto; }

  .rm-modal {
    background:#ffffff; border-radius:18px;
    width:min(780px, 100%);
    height:clamp(75vh, 88vh, 90vh);
    display:flex; flex-direction:column; overflow:hidden;
    transform:scale(0.94) translateY(10px);
    transition:transform 0.38s cubic-bezier(0.16,1,0.3,1);
  }
  .rm-backdrop.rm-open .rm-modal { transform:scale(1) translateY(0); }

  @media (max-width: 480px) {
    .rm-modal { border-radius:14px; height:90vh; }
  }

  .rm-topbar {
    display:flex; align-items:center; justify-content:space-between;
    padding:clamp(13px, 3vw, 16px) clamp(14px, 4vw, 20px);
    border-bottom:1px solid #EFEFEF; flex-shrink:0;
  }
  .rm-title {
    font-size:14px; font-weight:600; color:#111;
    font-family:-apple-system,"SF Pro Text",BlinkMacSystemFont,sans-serif;
    letter-spacing:-0.01em;
  }
  .rm-close {
    display:flex; align-items:center; justify-content:center;
    width:30px; height:30px; background:#F2F2F2;
    border:none; border-radius:8px; cursor:pointer; color:#666;
    transition:background 0.18s ease, color 0.18s ease;
    outline:none; flex-shrink:0;
  }
  .rm-close:hover { background:#E6E6E6; color:#111; }

  .rm-body {
    flex:1; overflow-y:auto; overflow-x:hidden;
    background:#F4F4F4; padding:0; display:block;
    -webkit-overflow-scrolling:touch;
  }
  .rm-img {
    display:block; width:100%; height:auto;
    pointer-events:none; user-select:none; -webkit-user-drag:none;
  }

  .rm-footer {
    flex-shrink:0;
    padding:clamp(10px, 2.5vw, 14px) clamp(14px, 4vw, 20px);
    border-top:1px solid #EFEFEF;
    display:flex; justify-content:center; background:#ffffff;
  }
  .rm-download {
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    height:clamp(38px, 6vw, 40px);
    padding:0 clamp(20px, 6vw, 32px);
    background:#111111; color:#ffffff;
    border:none; border-radius:10px;
    font-size:clamp(13px, 2vw, 14px); font-weight:500;
    cursor:pointer; outline:none; width:100%; max-width:220px;
    font-family:-apple-system,"SF Pro Text",BlinkMacSystemFont,sans-serif;
    -webkit-font-smoothing:antialiased;
    transition:background 0.18s ease, transform 0.15s ease;
  }
  .rm-download:hover  { background:#333333; }
  .rm-download:active { transform:scale(0.97); }
`;