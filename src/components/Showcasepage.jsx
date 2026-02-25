/**
 * ShowcasePage.jsx
 *
 * Mirrors MoreAbout.jsx 1-to-1. Every effect, every event name,
 * every transition value is identical. Only the content differs.
 *
 * Navbar compatibility (zero changes to Navbar.jsx needed):
 *   portfolio:nav          → already handled (raises z-index)
 *   portfolio:aboutScroll  → already handled (hide/show on scroll)
 *   portfolio:closeAbout   → already handled (nav icon click closes panel)
 */

import { useEffect, useRef, useState, useCallback, memo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";

/* ══════════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════════ */
const CATEGORIES = ["All", "Graphic Design", "Logos", "Game", "Wallpapers", "Others"];

const ALL_PROJECTS = [
  { id: 1,  src: "/multidisciplinary/m1.png", title: "Aston Martin Modern Design",    category: "Graphic Design", label: "3D Model"             },
  { id: 2,  src: "/multidisciplinary/m3.png", title: "Creative Visual Design",        category: "Graphic Design", label: "Graphic Design"       },
  { id: 3,  src: "/multidisciplinary/m3.png", title: "Conceptual Poster Design",      category: "Graphic Design", label: "Graphic Design"       },
  { id: 4,  src: "/multidisciplinary/m3.png", title: "Abstract Motion Poster",        category: "Graphic Design", label: "Graphic Design"       },
  { id: 5,  src: "/multidisciplinary/m1.png", title: "RideEase Brand Identity",       category: "Logos",          label: "Logo Design"          },
  { id: 6,  src: "/multidisciplinary/m1.png", title: "Organic Farmer Groups",         category: "Logos",          label: "Logo Design"          },
  { id: 7,  src: "/multidisciplinary/m1.png", title: "Minimal Logo Suite",            category: "Logos",          label: "Logo Design"          },
  { id: 8,  src: "/multidisciplinary/m5.png", title: "Awaken — Cinematic Artwork",    category: "Game",           label: "Game Art"             },
  { id: 9,  src: "/multidisciplinary/m5.png", title: "Retro Game Cover Design",       category: "Game",           label: "Game Art"             },
  { id: 10, src: "/multidisciplinary/m5.png", title: "Space Explorer Game UI",        category: "Game",           label: "Game UI"              },
  { id: 11, src: "/multidisciplinary/m2.png", title: "McLaren — Let's Start New Era", category: "Wallpapers",     label: "Wallpaper"            },
  { id: 12, src: "/multidisciplinary/m4.png", title: "Never Settle",                  category: "Wallpapers",     label: "Wallpaper"            },
  { id: 13, src: "/multidisciplinary/m2.png", title: "Neon City Nights",              category: "Wallpapers",     label: "Wallpaper"            },
  { id: 14, src: "/multidisciplinary/m1.png", title: "QR Code Generator",             category: "Others",         label: "Frontend Development" },
  { id: 15, src: "/multidisciplinary/m1.png", title: "Account Creation UI Flow",      category: "Others",         label: "UI Design"            },
  { id: 16, src: "/multidisciplinary/m1.png", title: "Calculator App",                category: "Others",         label: "Frontend Development" },
];

const INITIAL_LIMIT = 6; // 3 rows × 2 cols — matches "first 3 rows" requirement

/* ══════════════════════════════════════════════════════════
   SECTION 1 — HERO  (mirrors MAHome)
   ══════════════════════════════════════════════════════════ */
const SCHome = memo(function SCHome({ onScrollDown, scroller }) {
  const ref = useRef(null);

  // Same parallax pattern as MAHome
  const { scrollYProgress } = useScroll({
    target: ref,
    container: scroller,
    offset: ["start start", "end start"],
  });
  const rawY    = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const innerY  = useSpring(rawY, { stiffness: 70, damping: 18, mass: 0.6 });

  const ctnr = {
    hidden: {},
    show: { transition: { staggerChildren: 0.11, delayChildren: 0.28 } },
  };
  const itm = {
    hidden: { opacity: 0, y: 32 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section ref={ref} className="sc-home">
      <motion.div className="sc-home-inner" style={{ y: innerY }}>
        <motion.div variants={ctnr} initial="hidden" animate="show">

          <motion.div variants={itm} className="sc-home-tag">
            Multidisciplinary Creative Showcase
          </motion.div>

          <motion.h1 variants={itm} className="sc-home-name">
            <span className="sc-d-block">Selected</span>
            <span className="sc-d-block">Works</span>
          </motion.h1>

          <motion.p variants={itm} className="sc-home-sub">
            Graphic Design · Logos · Game Art · Wallpapers · Development
          </motion.p>

          <motion.button variants={itm} className="sc-home-scroll" onClick={onScrollDown}>
            <span>Scroll</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor"
                    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>

        </motion.div>
      </motion.div>

      {/* Ghost watermark — mirrors ma-home-bg-name */}
      <div className="sc-home-bg" aria-hidden="true">MC</div>
    </section>
  );
});

/* ══════════════════════════════════════════════════════════
   SECTION 2 — PROJECTS (filter + grid + read-more)
   ══════════════════════════════════════════════════════════ */
const ProjectCard = memo(function ProjectCard({ project, index }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      className="sc-card"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-6% 0px -6% 0px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.055 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
    >
      <div className="sc-card-img-wrap">
        <img
          src={project.src}
          alt={project.title}
          className={`sc-card-img${hov ? " sc-card-img--hov" : ""}`}
          draggable={false}
        />
        <div className={`sc-card-shine${hov ? " sc-card-shine--on" : ""}`} />
      </div>
      <div className="sc-card-body">
        <span className="sc-card-label">{project.label}</span>
        <h3 className="sc-card-title">{project.title}</h3>
      </div>
    </motion.div>
  );
});

const SCProjects = memo(function SCProjects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expanded,       setExpanded]       = useState(false);

  const handleCategory = useCallback((cat) => {
    setActiveCategory(cat);
    setExpanded(false);
  }, []);

  const filtered     = activeCategory === "All"
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter((p) => p.category === activeCategory);
  const isAll        = activeCategory === "All";
  const showReadMore = isAll && !expanded && filtered.length > INITIAL_LIMIT;
  const displayed    = isAll && !expanded ? filtered.slice(0, INITIAL_LIMIT) : filtered;

  return (
    <section className="sc-projects">

      {/* Sticky filter — mirrors exp-left-col sticky pattern */}
      <div className="sc-filter-sticky">
        <div className="sc-filter-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`sc-filter-btn${activeCategory === cat ? " sc-filter-btn--active" : ""}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="sc-grid-outer">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="sc-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {displayed.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Read More — only in "All" category */}
        <AnimatePresence>
          {showReadMore && (
            <motion.div
              className="sc-readmore-wrap"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32 }}
            >
              <button className="sc-readmore-btn" onClick={() => setExpanded(true)}>
                <span>Read More</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2V12M2 7L7 12L12 7" stroke="currentColor"
                        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Strip — mirrors ma-exp-strip */}
      <div className="sc-strip">
        <p className="sc-strip-text">
          {displayed.length} of {filtered.length} projects
          {activeCategory !== "All" ? ` in ${activeCategory}` : ""}.
        </p>
      </div>
    </section>
  );
});

/* ══════════════════════════════════════════════════════════
   SECTION 3 — FOOTER  (mirrors MAFooter exactly)
   ══════════════════════════════════════════════════════════ */
const SCFooter = memo(function SCFooter({ onClose }) {
  const [hov, setHov] = useState(false);
  return (
    <footer className="sc-footer">
      <div className="sc-footer-topline" aria-hidden="true" />
      <div className="sc-footer-watermark" aria-hidden="true">WORK</div>

      <div className="sc-footer-body">
        <div className="sc-footer-eyebrow-row">
          <span className="sc-footer-eyebrow">
            <span className="sc-footer-dot" />
            Open to new projects
          </span>
          <span className="sc-footer-year">2026</span>
        </div>

        <h2 className="sc-footer-big">
          <span className="sc-footer-big-line">Let's build</span>
          <span className="sc-footer-big-line sc-footer-big-italic">something</span>
          <span className="sc-footer-big-line">great.</span>
        </h2>

        {/* Mirrors MAFooter CTA — clicking closes the panel */}
        <button
          className={`sc-footer-cta${hov ? " sc-footer-cta--hov" : ""}`}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          onClick={onClose}
          aria-label="Back to portfolio"
        >
          <span className="sc-footer-cta-label">Back to Portfolio</span>
          <span className="sc-footer-cta-arrow">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor"
                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </button>
      </div>

      <div className="sc-footer-bottom">
        <span className="sc-footer-copy">© 2026 Arjun Aadhith</span>
        <span className="sc-footer-made">Designed &amp; Built by Arjun</span>
      </div>
    </footer>
  );
});

/* ══════════════════════════════════════════════════════════
   ROOT EXPORT — ShowcasePage
   Mirrors MoreAbout root export exactly.
   ══════════════════════════════════════════════════════════ */
export default function ShowcasePage({ isOpen, onClose }) {
  const pageRef    = useRef(null);
  const projectRef = useRef(null);

  /* 1. Hide / show navbar — identical to MoreAbout
        Navbar listens: portfolio:nav → { visible: false } raises z-index */
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("portfolio:nav", { detail: { visible: !isOpen } }),
    );
  }, [isOpen]);

  /* 2. Nav-icon click closes this panel — identical to MoreAbout
        Navbar dispatches portfolio:closeAbout on every nav icon click */
  useEffect(() => {
    const fn = () => onClose();
    window.addEventListener("portfolio:closeAbout", fn);
    return () => window.removeEventListener("portfolio:closeAbout", fn);
  }, [onClose]);

  /* 3. Body scroll lock — identical to MoreAbout */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* 4. Escape key — identical to MoreAbout */
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  /* 5. Scroll to top on every open — identical to MoreAbout */
  useEffect(() => {
    if (isOpen && pageRef.current) pageRef.current.scrollTop = 0;
  }, [isOpen]);

  /* 6. Relay scroll direction so navbar hides/shows inside this panel.
        Uses portfolio:aboutScroll — the exact event Navbar already listens to.
        No changes to Navbar.jsx needed. */
  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    let lastY = 0, ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY  = el.scrollTop;
        const direction = currentY > lastY ? "down" : "up";
        window.dispatchEvent(
          new CustomEvent("portfolio:aboutScroll", {   // ← same event as MoreAbout
            detail: { direction, scrollTop: currentY },
          }),
        );
        lastY   = currentY;
        ticking = false;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isOpen]);

  const scrollDown = useCallback(() => {
    projectRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      <style>{CSS}</style>

      {/*
        THE PANEL — byte-for-byte identical to MoreAbout:

          <motion.div
            className="ma-page"          ← we use "sc-page" to avoid style clash
            ref={pageRef}
            animate={{ y: isOpen ? "0%" : "100%" }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden={!isOpen}
            style={{ pointerEvents: isOpen ? "auto" : "none" }}
          >
      */}
      <motion.div
        className="sc-page"
        ref={pageRef}
        animate={{ y: isOpen ? "0%" : "100%" }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!isOpen}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        {/* key={String(isOpen)} resets inner state on every open — identical to MoreAbout */}
        <div key={String(isOpen)} style={{ display: "contents" }}>
          <SCHome onScrollDown={scrollDown} scroller={pageRef} />
          <div ref={projectRef}><SCProjects /></div>
          <SCFooter onClose={onClose} />
        </div>
      </motion.div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   STYLES
   Colors: #ffffff / #eeeeee only.
   Prefix: sc-  (no collision with ma- or sc2-)
   ══════════════════════════════════════════════════════════ */
const CSS = `

  /* ── Shell — mirrors .ma-page exactly ── */
  .sc-page {
    position: fixed;
    inset: 0;
    z-index: 100000;
    overflow-y: auto;
    overflow-x: hidden;
    background: #ffffff;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont,
                 "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    scroll-behavior: smooth;
  }

  /* ══════════════════════════════════════
     HERO — mirrors .ma-home
     ══════════════════════════════════════ */
  .sc-home {
    position: relative;
    height: 100vh;
    display: flex;
    align-items: center;
    padding: 0 72px;
    overflow: hidden;
    background: #ffffff;
    border-bottom: 1px solid #eeeeee;
  }
  .sc-home-inner {
    position: relative;
    z-index: 2;
    will-change: transform;
  }
  .sc-home-tag {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #aaaaaa;
    border: 1.5px solid #eeeeee;
    border-radius: 100px;
    padding: 6px 18px;
    margin-bottom: 36px;
  }
  .sc-home-name {
    font-size: clamp(68px, 11vw, 148px);
    font-weight: 800;
    line-height: 0.93;
    letter-spacing: -0.05em;
    margin: 0 0 36px;
    color: #111111;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
  }
  .sc-d-block { display: block; }
  .sc-home-sub {
    font-size: 14px;
    color: #aaaaaa;
    letter-spacing: 0.02em;
    margin: 0 0 56px;
    font-weight: 400;
  }
  .sc-home-scroll {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #aaaaaa;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: inherit;
    transition: color 0.2s;
  }
  .sc-home-scroll:hover { color: #555555; }
  /* Ghost watermark — mirrors .ma-home-bg-name */
  .sc-home-bg {
    position: absolute;
    bottom: -40px;
    right: -40px;
    font-size: clamp(180px, 28vw, 400px);
    font-weight: 800;
    letter-spacing: -0.08em;
    color: #eeeeee;
    line-height: 1;
    pointer-events: none;
    z-index: 1;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
    user-select: none;
  }

  /* ══════════════════════════════════════
     PROJECTS
     ══════════════════════════════════════ */
  .sc-projects { background: #eeeeee; }

  /* Sticky filter bar */
  .sc-filter-sticky {
    position: sticky;
    top: 0;
    z-index: 9;
    background: #ffffff;
    border-bottom: 1px solid #eeeeee;
  }
  .sc-filter-bar {
    max-width: 1200px;
    margin: 0 auto;
    padding: 14px 56px;
    display: flex;
    gap: 6px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .sc-filter-bar::-webkit-scrollbar { display: none; }
  .sc-filter-btn {
    flex-shrink: 0;
    background: transparent;
    border: 1.5px solid #dddddd;
    border-radius: 100px;
    padding: 7px 20px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: #888888;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    white-space: nowrap;
  }
  .sc-filter-btn:hover           { border-color: #bbbbbb; color: #333333; }
  .sc-filter-btn--active         { background: #111111; border-color: #111111; color: #ffffff; }
  .sc-filter-btn--active:hover   { background: #333333; border-color: #333333; }

  /* Grid */
  .sc-grid-outer {
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 56px 0;
  }
  .sc-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  /* Card */
  .sc-card {
    background: #ffffff;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.38s cubic-bezier(0.34, 1.1, 0.64, 1),
                box-shadow 0.38s ease;
  }
  .sc-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 24px 64px rgba(0,0,0,0.10);
  }
  .sc-card-img-wrap {
    position: relative;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: #eeeeee;
  }
  .sc-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
    transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .sc-card-img--hov { transform: scale(1.05); }
  .sc-card-shine {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.32s ease;
    pointer-events: none;
  }
  .sc-card-shine--on { opacity: 1; }
  .sc-card-body {
    padding: 18px 22px 22px;
    border-top: 1px solid #eeeeee;
  }
  .sc-card-label {
    display: block;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #aaaaaa;
    margin-bottom: 6px;
  }
  .sc-card-title {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #111111;
    line-height: 1.3;
    margin: 0;
  }

  /* Read More */
  .sc-readmore-wrap {
    display: flex;
    justify-content: center;
    margin-top: 48px;
  }
  .sc-readmore-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #ffffff;
    border: 1.5px solid #dddddd;
    border-radius: 100px;
    padding: 13px 32px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: #333333;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.26s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .sc-readmore-btn:hover {
    background: #111111;
    border-color: #111111;
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(0,0,0,0.12);
  }
  .sc-readmore-btn svg { transition: transform 0.26s ease; }
  .sc-readmore-btn:hover svg { transform: translateY(3px); }

  /* Strip */
  .sc-strip {
    background: #ffffff;
    border-top: 1px solid #eeeeee;
    margin-top: 48px;
  }
  .sc-strip-text {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 56px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #cccccc;
    display: block;
  }

  /* ══════════════════════════════════════
     FOOTER — mirrors .ma-footer exactly
     ══════════════════════════════════════ */
  .sc-footer {
    position: relative;
    background: #ffffff;
    overflow: hidden;
    padding: 0 72px 0;
    min-height: 88vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-top: 1px solid #eeeeee;
  }
  .sc-footer-topline {
    width: 100%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      #dddddd 30%,
      #dddddd 70%,
      transparent 100%
    );
  }
  .sc-footer-watermark {
    position: absolute;
    bottom: -0.12em;
    right: -0.04em;
    font-size: clamp(200px, 32vw, 480px);
    font-weight: 900;
    letter-spacing: -0.06em;
    line-height: 1;
    color: #eeeeee;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
    pointer-events: none;
    user-select: none;
    z-index: 0;
  }
  .sc-footer-body {
    position: relative;
    z-index: 1;
    padding: 80px 0 60px;
    max-width: 1100px;
    width: 100%;
  }
  .sc-footer-eyebrow-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 52px;
  }
  .sc-footer-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #aaaaaa;
  }
  .sc-footer-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 0 3px rgba(74,222,128,0.18);
    animation: sc-dot-breathe 2.6s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes sc-dot-breathe {
    0%, 100% { box-shadow: 0 0 0 3px rgba(74,222,128,0.18); }
    50%       { box-shadow: 0 0 0 7px rgba(74,222,128,0.06); }
  }
  .sc-footer-year {
    font-size: 11px;
    font-weight: 600;
    color: #cccccc;
    letter-spacing: 0.1em;
  }
  .sc-footer-big {
    font-size: clamp(60px, 10.5vw, 148px);
    font-weight: 900;
    letter-spacing: -0.05em;
    line-height: 0.94;
    margin: 0 0 64px;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
    display: flex;
    flex-direction: column;
  }
  .sc-footer-big-line   { display: block; color: #111111; }
  .sc-footer-big-italic { color: #cccccc; font-style: italic; font-weight: 700; }

  /* CTA — mirrors .ma-footer-cta-btn */
  .sc-footer-cta {
    display: inline-flex;
    align-items: center;
    gap: 0;
    height: 60px;
    padding: 0 8px 0 32px;
    background: #111111;
    color: #ffffff;
    border: none;
    border-radius: 100px;
    font-size: 15px;
    font-weight: 700;
    font-family: inherit;
    letter-spacing: -0.01em;
    cursor: pointer;
    transition: background 0.22s, transform 0.18s;
  }
  .sc-footer-cta:hover  { background: #333333; transform: translateY(-2px); }
  .sc-footer-cta:active { transform: scale(0.97); }
  .sc-footer-cta-label  { flex-shrink: 0; margin-right: 16px; }
  .sc-footer-cta-arrow {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #ffffff;
    color: #111111;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.22s;
  }
  .sc-footer-cta:hover .sc-footer-cta-arrow { transform: translateX(3px); }
  .sc-footer-bottom {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 0 40px;
    border-top: 1px solid #eeeeee;
  }
  .sc-footer-copy { font-size: 13px; color: #aaaaaa; font-weight: 400; letter-spacing: 0.01em; }
  .sc-footer-made { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #cccccc; }

  /* ══════════════════════════════════════
     RESPONSIVE
     ══════════════════════════════════════ */
  @media (max-width: 1000px) {
    .sc-home        { padding: 0 40px; }
    .sc-filter-bar  { padding: 12px 32px; }
    .sc-grid-outer  { padding: 32px 32px 0; }
    .sc-strip-text  { padding: 16px 32px; }
    .sc-footer      { padding: 0 40px; }
  }
  @media (max-width: 768px) {
    .sc-home        { padding: 0 24px; }
    .sc-filter-bar  { padding: 12px 20px; }
    .sc-grid-outer  { padding: 24px 20px 0; }
    .sc-strip-text  { padding: 14px 20px; }
    .sc-footer      { padding: 0 24px; min-height: auto; }
    .sc-footer-body { padding: 60px 0 44px; }
    .sc-footer-big  { font-size: clamp(48px, 12vw, 80px); margin-bottom: 48px; }
    .sc-footer-watermark { font-size: clamp(140px, 40vw, 260px); }
    .sc-footer-bottom { padding: 24px 0 32px; }
    .sc-footer-made { display: none; }
    .sc-home-name   { font-size: clamp(52px, 13vw, 80px); }
  }
  @media (max-width: 540px) {
    .sc-grid        { grid-template-columns: 1fr; }
    .sc-home-bg     { display: none; }
  }
`;