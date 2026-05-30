import { useRef, useState, useEffect, useCallback } from "react";
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

// ─── AnimatedLogoName ─────────────────────────────────────────────
// Letters ripple like a water wave on hover — each letter bobs up
// and down with a sinusoidal stagger, creating a fluid wave effect.
// Clicking scrolls smoothly to the top (home).
function AnimatedLogoName({ onHomeClick }) {
  const line1 = "Arjun";
  const line2 = "Aadhith";
  const [hovered, setHovered] = useState(false);

  // Wave parameters: letters in line2 continue the wave phase from line1
  const totalLine1 = line1.length;
  const WAVE_STEP = 0.07; // seconds between each letter's wave peak

  const renderLetters = (word, lineIndex) =>
    word.split("").map((char, i) => {
      // Global index across both lines so the wave flows continuously
      const globalIndex = lineIndex === 0 ? i : totalLine1 + i;
      const delay = (globalIndex * WAVE_STEP).toFixed(3);
      return (
        <span
          key={i}
          className={`logo-letter${hovered ? " logo-letter-wave" : ""}`}
          style={{ "--delay": `${delay}s` }}
        >
          {char}
        </span>
      );
    });

  return (
    <button
      className="logo-name-btn"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        smoothScrollTo(0);
        onHomeClick?.("#home");
        window.dispatchEvent(new CustomEvent("portfolio:closeAbout"));
      }}
      aria-label="Go to home"
    >
      <span className="logo-name-line">{renderLetters(line1, 0)}</span>
      <span className="logo-name-line">{renderLetters(line2, 1)}</span>
      <span className="shine-beam" />
    </button>
  );
}

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

  const handleHomeClick = useCallback((href) => {
    setActiveHref(href);
  }, []);

  const navContent = (
    <>
      <style>{CSS}</style>
      <div
        ref={navRef}
        className={`navbar-wrapper${aboveAbout ? " nav-above-about" : ""}`}
        style={{ transform: "translateY(-22px)", opacity: 0, filter: "blur(7px)" }}
      >
        {/* Nav pill */}
        <div className="nav-pill">
          <div className="logo-section">
            <img className="logo-img" src="/Nav logo icon.png" alt="Arjun Aadhith" />
            <AnimatedLogoName onHomeClick={handleHomeClick} />
          </div>
          <div className="nav-spacer" />
          <div className="nav-icons">
            <NavIcon src="/Home icon.png"    alt="Home"     label="Home"     href="#home"     onNavClick={setActiveHref} active={activeHref === "#home"} />
            <NavIcon src="/Project icon.png" alt="Projects" label="Projects" href="#projects" onNavClick={setActiveHref} active={activeHref === "#projects"} />
            <NavIcon src="/Contact icon.png" alt="Contact"  label="Contact"  href="#contact"  onNavClick={setActiveHref} active={activeHref === "#contact"} />
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

  /* ── Liquid wave animation ───────────────────────────────────── */
  /*
   * Each letter rides a sine wave: crests up with a blue-teal glow,
   * dips below baseline, then settles. Staggered --delay makes the
   * crest travel left→right like a ripple across water.
   */
  @keyframes letterWave {
    0%   { transform: translateY(0px)  scaleY(1);    color: inherit; }
    18%  { transform: translateY(-7px) scaleY(1.08); color: #3BBFCF; }
    38%  { transform: translateY(0px)  scaleY(1);    color: inherit; }
    52%  { transform: translateY(3px)  scaleY(0.94); color: #5DD4E0; }
    68%  { transform: translateY(0px)  scaleY(1);    color: inherit; }
    82%  { transform: translateY(-2px) scaleY(1.03); color: inherit; }
    100% { transform: translateY(0px)  scaleY(1);    color: inherit; }
  }

  .logo-letter-wave {
    animation: letterWave 0.72s cubic-bezier(0.33, 1, 0.68, 1) var(--delay, 0s) both;
  }

  /* ─── Logo name button ────────────────────────────────────────── */
  .logo-name-btn {
    position: relative;
    display: flex;
    flex-direction: column;
    line-height: 1.3;
    overflow: hidden;
    border-radius: 4px;
    background: none;
    border: none;
    padding: 2px 4px;
    margin: 0;
    cursor: pointer;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    /* subtle press feedback */
    transition: transform 0.15s cubic-bezier(0.22,1,0.36,1);
  }
  .logo-name-btn:active { transform: scale(0.94); }

  .logo-name-line {
    display: flex;
    align-items: baseline;
  }

  .logo-letter {
    display: inline-block;
    font-size: 13.5px;
    font-weight: 500;
    color: #111111;
    letter-spacing: 0.08em;
    font-family: -apple-system,"SF Pro Text",BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    position: relative;
    z-index: 1;
    will-change: transform, color;
  }

  /* Shine beam stays on the parent button */
  .logo-name-btn .shine-beam {
    position: absolute; top: -20%; left: -80%; width: 45%; height: 140%;
    background: linear-gradient(
      105deg, transparent 20%, rgba(255,255,255,0) 30%,
      rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 70%, transparent 80%
    );
    transform: skewX(-15deg); pointer-events: none; z-index: 2; transition: none;
  }
  .logo-name-btn:hover .shine-beam {
    left: 120%;
    transition: left 0.55s cubic-bezier(0.4,0,0.2,1);
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

  /* ─── Logo section ───────────────────────────────────────────── */
  .logo-section { display:flex; align-items:center; gap:8px; flex-shrink:0; }
  .logo-img { width:30px; height:30px; object-fit:contain; border-radius:4px; display:block; }

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
    .logo-letter { font-size:12.5px; }
    .nav-icon-wrap { width:40px; height:36px; }
  }


  /* ═══════════════════════════════════════════════════════════════
     MOBILE  ≤639px
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
    .logo-letter { font-size:12px; }
    .nav-icon-wrap { width:44px; height:44px; }
    .resume-pill { display:none !important; }
    .nav-label { display:none; }
  }

  /* ── Very small phones  ≤374px ───────────────────────────────── */
  @media (max-width: 374px) {
    .navbar-wrapper { padding: 40px 24px 8px; }
    .nav-pill { height:50px; padding:0 6px 0 10px; }
    .logo-img { width:26px; height:26px; }
    .logo-letter { font-size:11px; letter-spacing:0.05em; }
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