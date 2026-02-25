import { useEffect, useRef, useState, useCallback, memo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";

const ALL_PROJECTS = [
  // ── Graphic Design ──────────────────────────────────────
  {
    id: 1,
    src: "/multidisciplinary/m1.png",
    title: "Aston Martin Modern Design",
    category: "3D Model",
    label: "3D Model",
    link: "https://3d-car-model-design.netlify.app/",
  },
  {
    id: 2,
    src: "/multidisciplinary/m2.png",
    title: "Forza Horizon Winter Drive",
    category: "Wallpapers",
    label: "Wallpaper",
    link: "https://forzahorizon-wallpaper.netlify.app/",
  },
  {
    id: 3,
    src: "/multidisciplinary/m4.png",
    title: "Storm of Determination",
    category: "Wallpapers",
    label: "Wallpaper",
    link: "https://never-settle-wallpaper.netlify.app/",
  },
  {
    id: 4,
    src: "/multidisciplinary/m3.png",
    title: "Creative Visual Design",
    category: "Graphic Design",
    label: "Graphic Design",
    link: "https://nike-shoe-design.netlify.app/",
  },
  {
    id: 5,
    src: "/multidisciplinary/rideease.png",
    title: "Brand Identity",
    category: "Logos",
    label: "Logo Design",
    link: "https://rideease-logo.netlify.app/",
  },
  {
    id: 6,
    src: "/multidisciplinary/m5.png",
    title: "Cinematic Fantasy Artwork",
    category: "Wallpapers",
    label: "Wallpaper",
    link: "https://gaming-wallpaper.netlify.app/",
  },
  {
    id: 7,
    src: "/multidisciplinary/THL.jpg",
    title: "Organic Brand Identity",
    category: "Logos",
    label: "Logo Design",
    link: "https://thl-logo.netlify.app/",
  },
  {
    id: 8,
    src: "/multidisciplinary/qr.png",
    title: "QR Code Generator",
    category: "Others",
    label: "Frontend Development",
    link: "https://qr-code-gens.netlify.app/",
  },
  {
    id: 9,
    src: "/multidisciplinary/form.png",
    title: "Account Form Validation UI",
    category: "Others",
    label: "Frontend Development",
    link: "https://formvalidation-ui.netlify.app/",
  },
  {
    id: 10,
    src: "/multidisciplinary/cals.png",
    title: "Neumorphic Calculator Interface",
    category: "Others",
    label: "UI Development",
    link: "https://neumorphic-calcs.netlify.app/",
  },
  {
    id: 11,
    src: "/multidisciplinary/car game.png",
    title: "Highway Rush Game",
    category: "Game",
    label: "Game Development",
    link: "https://mini-car-game.netlify.app/",
  }
];

/* ── Dynamic category list — derives itself from ALL_PROJECTS automatically ── */
const CATEGORY_ORDER = ["Graphic Design", "Logos", "3D Model", "Game", "Wallpapers", "Others"];
const _seen = new Set();
const _dynamic = [];
// First add in preferred order if they exist in data
CATEGORY_ORDER.forEach((c) => {
  if (ALL_PROJECTS.some((p) => p.category === c)) {
    _seen.add(c);
    _dynamic.push(c);
  }
});
// Then catch any new category not in the preferred order
ALL_PROJECTS.forEach((p) => {
  if (!_seen.has(p.category)) {
    _seen.add(p.category);
    _dynamic.push(p.category);
  }
});
const CATEGORIES = ["All", ..._dynamic];

const INITIAL_LIMIT = 6; // 3 rows × 2 cols in "All" view

/* ══════════════════════════════════════════════════════════
   HERO SECTION
   ══════════════════════════════════════════════════════════ */
const SCHome = memo(function SCHome({ onScrollDown, scroller }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: scroller,
    offset: ["start start", "end start"],
  });
  const rawY   = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const innerY = useSpring(rawY, { stiffness: 80, damping: 20, mass: 0.5 });

  const ctnr = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.24 } },
  };
  const itm = {
    hidden: { opacity: 0, y: 28 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section ref={ref} className="sc-home">
      <motion.div className="sc-home-inner" style={{ y: innerY }}>
        <motion.div variants={ctnr} initial="hidden" animate="show">

          <motion.span variants={itm} className="sc-home-tag">
            Selected Works
          </motion.span>

          {/*
            TWO LINES: each span is display:block.
            Font size clamped at max 72px so "Multidisciplinary"
            never wraps beyond one line on any desktop viewport.
          */}
          <motion.h1 variants={itm} className="sc-home-name">
            <span className="sc-name-line">Multidisciplinary</span>
            <span className="sc-name-line sc-name-muted">Creative Showcase</span>
          </motion.h1>

          <motion.p variants={itm} className="sc-home-sub">
            Graphic Design&nbsp;&nbsp;·&nbsp;&nbsp;Logos&nbsp;&nbsp;·&nbsp;&nbsp;
            Game Art&nbsp;&nbsp;·&nbsp;&nbsp;Wallpapers&nbsp;&nbsp;·&nbsp;&nbsp;Development
          </motion.p>

          <motion.button variants={itm} className="sc-home-cta" onClick={onScrollDown}>
            Explore Projects
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M3 8l4 4 4-4" stroke="currentColor"
                    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>

        </motion.div>
      </motion.div>

      {/* Ghost watermark */}
      <div className="sc-home-watermark" aria-hidden="true">MC</div>
    </section>
  );
});

/* ══════════════════════════════════════════════════════════
   PROJECT CARD
   — Clicking opens the project link in a new tab.
   — Hover: border darkens, image scales slightly. NO shadow, NO glow.
   ══════════════════════════════════════════════════════════ */
const ProjectCard = memo(function ProjectCard({ project, index }) {
  const hasLink = project.link && project.link !== "#";

  const handleClick = useCallback(() => {
    if (hasLink) window.open(project.link, "_blank", "noopener,noreferrer");
  }, [project.link, hasLink]);

  return (
    <motion.article
      className="sc-card"
      onClick={handleClick}
      style={{ cursor: hasLink ? "pointer" : "default" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: (index % 2) * 0.06,
      }}
      whileHover={hasLink ? { y: -3 } : {}}
    >
      <div className="sc-card-media">
        <motion.img
          src={project.src}
          alt={project.title}
          className="sc-card-img"
          draggable={false}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
      <div className="sc-card-info">
        <span className="sc-card-label">{project.label}</span>
        <h3 className="sc-card-title">{project.title}</h3>
        {hasLink && (
          <span className="sc-card-arrow" aria-hidden="true">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1.5 9.5L9.5 1.5M9.5 1.5H3.5M9.5 1.5V7.5"
                    stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
      </div>
    </motion.article>
  );
});

/* ══════════════════════════════════════════════════════════
   PROJECTS SECTION — filter + grid + read-more
   ══════════════════════════════════════════════════════════ */
const SCProjects = memo(function SCProjects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expanded, setExpanded] = useState(false);

  const handleCategory = useCallback((cat) => {
    setActiveCategory(cat);
    setExpanded(false);
  }, []);

  const filtered = activeCategory === "All"
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter((p) => p.category === activeCategory);

  const isAll        = activeCategory === "All";
  const showReadMore = isAll && !expanded && filtered.length > INITIAL_LIMIT;
  const displayed    = isAll && !expanded ? filtered.slice(0, INITIAL_LIMIT) : filtered;

  return (
    <section className="sc-projects">

      {/* ── Sticky filter bar ── */}
      <div className="sc-filter-sticky">
        <div className="sc-filter-bar">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                /*
                  Using inline style for the active state because it has
                  100% specificity — no class override can beat it.
                  This is the definitive fix for the "active not visible" bug.
                */
                className="sc-filter-btn"
                style={
                  isActive
                    ? { background: "#111111", borderColor: "#111111", color: "#ffffff" }
                    : {}
                }
                onClick={() => handleCategory(cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="sc-grid-outer">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="sc-grid"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {displayed.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Read More — All category only */}
        <AnimatePresence>
          {showReadMore && (
            <motion.div
              className="sc-readmore-wrap"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              <button className="sc-readmore-btn" onClick={() => setExpanded(true)}>
                Show All Projects
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 1.5v10M2 8l4.5 4.5L11 8"
                        stroke="currentColor" strokeWidth="1.6"
                        strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Count strip */}
      <div className="sc-strip">
        <span className="sc-strip-text">
          {displayed.length}&thinsp;/&thinsp;{filtered.length} projects
          {activeCategory !== "All" ? ` · ${activeCategory}` : ""}
        </span>
      </div>

    </section>
  );
});

/* ══════════════════════════════════════════════════════════
   FOOTER — modern, clean, minimal
   Heading: "Think bold. Design sharp. Build right."
   ══════════════════════════════════════════════════════════ */
const SCFooter = memo(function SCFooter({ onClose }) {
  return (
    <footer className="sc-footer">

      <div className="sc-footer-watermark" aria-hidden="true">AA</div>

      <div className="sc-footer-body">

        {/* Eyebrow row */}
        <div className="sc-footer-eyebrow-row">
          <span className="sc-footer-eyebrow">
            <span className="sc-footer-dot" />
            Available for new projects
          </span>
          <span className="sc-footer-year">2026</span>
        </div>

        {/* Big headline — modern & unique */}
        <h2 className="sc-footer-headline">
          <span className="sc-fh-line">Think bold.</span>
          <span className="sc-fh-line sc-fh-accent">Design sharp.</span>
          <span className="sc-fh-line">Build right.</span>
        </h2>

        {/* Back button */}
        <button className="sc-footer-back" onClick={onClose}>
          <span className="sc-footer-back-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 7H3M6 3.5L3 7l3 3.5"
                    stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          Back to Portfolio
        </button>

      </div>

      {/* Bottom bar */}
      <div className="sc-footer-bottom">
        <span className="sc-footer-copy">© 2026 Arjun Aadhith</span>
        <span className="sc-footer-sep" aria-hidden="true" />
        <span className="sc-footer-built">Designed &amp; Built by Arjun</span>
      </div>

    </footer>
  );
});

/* ══════════════════════════════════════════════════════════
   ROOT EXPORT — mirrors MoreAbout.jsx pattern exactly
   ══════════════════════════════════════════════════════════ */
export default function ShowcasePage({ isOpen, onClose }) {
  const pageRef    = useRef(null);
  const projectRef = useRef(null);

  /* 1. Navbar z-index — identical to MoreAbout */
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("portfolio:nav", { detail: { visible: !isOpen } }),
    );
  }, [isOpen]);

  /* 2. Nav icon click closes panel — same event as MoreAbout */
  useEffect(() => {
    const fn = () => onClose();
    window.addEventListener("portfolio:closeAbout", fn);
    return () => window.removeEventListener("portfolio:closeAbout", fn);
  }, [onClose]);

  /* 3. Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* 4. Escape key */
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  /* 5. Scroll to top on every open */
  useEffect(() => {
    if (isOpen && pageRef.current) pageRef.current.scrollTop = 0;
  }, [isOpen]);

  /* 6. Relay scroll to navbar — same event as MoreAbout */
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
          new CustomEvent("portfolio:aboutScroll", {
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
      <motion.div
        className="sc-page"
        ref={pageRef}
        animate={{ y: isOpen ? "0%" : "100%" }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!isOpen}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
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
   ══════════════════════════════════════════════════════════ */
const CSS = `

  /* ── Page shell ── */
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
    /* Smooth native momentum scroll */
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-y: contain;
    scroll-behavior: smooth;
  }

  /* ══════════════════════════════════════
     HERO
     ══════════════════════════════════════ */
  .sc-home {
    position: relative;
    height: 100vh;
    min-height: 560px;
    display: flex;
    align-items: center;
    padding: 0 80px;
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
    display: inline-flex;
    align-items: center;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #bbbbbb;
    border: 1.5px solid #e8e8e8;
    border-radius: 100px;
    padding: 6px 16px;
    margin-bottom: 28px;
  }

  /*
    HERO TITLE — two lines enforced.
    clamp max = 72px so "Multidisciplinary" (16 chars) always fits
    on a single line from 768px viewport upward.
  */
  .sc-home-name {
    font-size: clamp(34px, 5.2vw, 72px);
    font-weight: 800;
    line-height: 1.04;
    letter-spacing: -0.045em;
    margin: 0 0 24px;
    color: #111111;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
  }
  .sc-name-line      { display: block; }
  .sc-name-muted     { color: #cccccc; }

  .sc-home-sub {
    font-size: 12.5px;
    color: #bbbbbb;
    letter-spacing: 0.02em;
    margin: 0 0 40px;
    font-weight: 400;
    line-height: 1.5;
  }

  /* Scroll CTA button */
  .sc-home-cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #888888;
    background: none;
    border: 1.5px solid #e8e8e8;
    border-radius: 100px;
    padding: 10px 20px;
    cursor: pointer;
    font-family: inherit;
    transition: color 0.2s ease, border-color 0.2s ease;
    /* NO shadow, NO glow */
  }
  .sc-home-cta:hover { color: #333333; border-color: #cccccc; }

  /* Watermark */
  .sc-home-watermark {
    position: absolute;
    bottom: -0.1em;
    right: -0.04em;
    font-size: clamp(160px, 24vw, 340px);
    font-weight: 900;
    letter-spacing: -0.06em;
    line-height: 1;
    color: #f4f4f4;
    pointer-events: none;
    user-select: none;
    z-index: 1;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
  }

  /* ══════════════════════════════════════
     PROJECTS SECTION
     ══════════════════════════════════════ */
  .sc-projects {
    background: #f7f7f7;
    padding-bottom: 80px;
  }

  /* Sticky filter */
  .sc-filter-sticky {
    position: sticky;
    top: 0;
    z-index: 9;
    background: #ffffff;
    border-bottom: 1px solid #eeeeee;
    box-shadow: 0 1px 8px rgba(0,0,0,0.04);
  }
  .sc-filter-bar {
    max-width: 1240px;
    margin: 0 auto;
    padding: 14px 60px;
    display: flex;
    gap: 6px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .sc-filter-bar::-webkit-scrollbar { display: none; }

  /* Filter button base */
  .sc-filter-btn {
    flex-shrink: 0;
    background: #ffffff;
    border: 1.5px solid #e4e4e4;
    border-radius: 100px;
    padding: 7px 18px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: #999999;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
    /* Smooth transition for non-active state changes */
    transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
  }
  /* Hover — only applied when NOT active (inline style overrides this) */
  .sc-filter-btn:hover {
    background: #f2f2f2;
    border-color: #cccccc;
    color: #444444;
  }
  /* NOTE: Active state is applied via inline style in JSX for 100% specificity.
     This is intentional — it cannot be overridden by any CSS selector. */

  /* Grid */
  .sc-grid-outer {
    max-width: 1240px;
    margin: 0 auto;
    padding: 40px 60px 0;
  }
  .sc-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  /* ── Card — border-radius 12px matching your design screenshots ── */
  .sc-card {
    background: #ffffff;
    border-radius: 12px;           /* exact value from your screenshots */
    overflow: hidden;
    border: 1.5px solid #eeeeee;
    /* NO box-shadow, NO glow — transition on border and transform only */
    transition: border-color 0.22s ease, transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    position: relative;
  }
  .sc-card:hover {
    border-color: #d4d4d4;
    /* transform handled by framer-motion whileHover={{ y: -3 }} */
  }

  .sc-card-media {
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: #f0f0f0;
    /* Image fills right up to card edges — no inner radius */
  }
  .sc-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
    /* scale handled by framer-motion whileHover */
    transform-origin: center;
  }
  .sc-card-info {
    padding: 14px 18px 18px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
    gap: 3px;
    position: relative;
  }
  .sc-card-label {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #bbbbbb;
  }
  .sc-card-title {
    font-size: 14.5px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #111111;
    line-height: 1.35;
    margin: 0;
  }
  /* External link indicator */
  .sc-card-arrow {
    position: absolute;
    top: 14px;
    right: 16px;
    color: #cccccc;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease, transform 0.2s ease;
  }
  .sc-card:hover .sc-card-arrow {
    color: #888888;
    transform: translate(1px, -1px);
  }

  /* Read More */
  .sc-readmore-wrap {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
  .sc-readmore-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #ffffff;
    border: 1.5px solid #e4e4e4;
    border-radius: 100px;
    padding: 11px 28px;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: #555555;
    cursor: pointer;
    font-family: inherit;
    /* NO shadow on hover */
    transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  }
  .sc-readmore-btn:hover {
    background: #111111;
    border-color: #111111;
    color: #ffffff;
  }

  /* Strip */
  .sc-strip {
    border-top: 1px solid #eeeeee;
    margin-top: 40px;
    background: #ffffff;
  }
  .sc-strip-text {
    display: block;
    max-width: 1240px;
    margin: 0 auto;
    padding: 14px 60px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #cccccc;
  }

  /* ══════════════════════════════════════
     FOOTER — modern minimal
     ══════════════════════════════════════ */
  .sc-footer {
    position: relative;
    background: #ffffff;
    overflow: hidden;
    padding: 80px 80px 0;
    min-height: 78vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-top: 1px solid #eeeeee;
  }

  /* Background "AA" watermark */
  .sc-footer-watermark {
    position: absolute;
    bottom: -0.08em;
    right: -0.04em;
    font-size: clamp(160px, 26vw, 400px);
    font-weight: 900;
    letter-spacing: -0.06em;
    line-height: 1;
    color: #f4f4f4;
    pointer-events: none;
    user-select: none;
    z-index: 0;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
  }

  .sc-footer-body {
    position: relative;
    z-index: 1;
    padding-bottom: 56px;
  }

  /* Eyebrow */
  .sc-footer-eyebrow-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 44px;
  }
  .sc-footer-eyebrow {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #aaaaaa;
  }
  .sc-footer-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    flex-shrink: 0;
    animation: sc-dot-blink 2.4s ease-in-out infinite;
  }
  @keyframes sc-dot-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.35; }
  }
  .sc-footer-year {
    font-size: 11px;
    font-weight: 500;
    color: #dddddd;
    letter-spacing: 0.06em;
  }

  /*
    BIG HEADLINE — "Think bold. / Design sharp. / Build right."
    Three lines, clean, bold, modern.
  */
  .sc-footer-headline {
    font-size: clamp(44px, 7.5vw, 112px);
    font-weight: 900;
    letter-spacing: -0.05em;
    line-height: 0.96;
    margin: 0 0 52px;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
    display: flex;
    flex-direction: column;
  }
  .sc-fh-line   { display: block; color: #111111; }
  .sc-fh-accent { color: #d4d4d4; font-style: italic; font-weight: 700; }

  /* Back button — pill outline style */
  .sc-footer-back {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    height: 48px;
    padding: 0 22px 0 14px;
    background: transparent;
    color: #333333;
    border: 1.5px solid #e0e0e0;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    /* NO shadow, NO glow */
    transition: background 0.22s ease, border-color 0.22s ease, color 0.22s ease;
  }
  .sc-footer-back:hover {
    background: #111111;
    border-color: #111111;
    color: #ffffff;
  }
  .sc-footer-back-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #f2f2f2;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #555555;
    flex-shrink: 0;
    transition: background 0.22s ease, color 0.22s ease;
  }
  .sc-footer-back:hover .sc-footer-back-icon {
    background: rgba(255,255,255,0.15);
    color: #ffffff;
  }

  /* Bottom bar */
  .sc-footer-bottom {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 22px 0 36px;
    border-top: 1px solid #eeeeee;
  }
  .sc-footer-copy,
  .sc-footer-built {
    font-size: 12px;
    color: #c0c0c0;
    font-weight: 400;
    letter-spacing: 0.01em;
  }
  .sc-footer-sep {
    display: block;
    width: 1px;
    height: 11px;
    background: #e4e4e4;
    flex-shrink: 0;
  }

  /* ══════════════════════════════════════
     RESPONSIVE
     ══════════════════════════════════════ */
  @media (max-width: 1024px) {
    .sc-home       { padding: 0 48px; }
    .sc-filter-bar { padding: 12px 36px; }
    .sc-grid-outer { padding: 32px 36px 0; }
    .sc-strip-text { padding: 12px 36px; }
    .sc-footer     { padding: 64px 48px 0; }
  }
  @media (max-width: 768px) {
    .sc-home        { padding: 0 28px; min-height: 100svh; }
    .sc-home-name   { font-size: clamp(30px, 8vw, 52px); }
    .sc-filter-bar  { padding: 12px 20px; }
    .sc-grid-outer  { padding: 24px 20px 0; }
    .sc-grid        { gap: 12px; }
    .sc-strip-text  { padding: 12px 20px; }
    .sc-footer      { padding: 48px 28px 0; min-height: auto; }
    .sc-footer-headline { font-size: clamp(36px, 10vw, 64px); margin-bottom: 40px; }
    .sc-footer-watermark { font-size: clamp(120px, 32vw, 200px); }
    .sc-footer-built { display: none; }
    .sc-footer-sep   { display: none; }
  }
  @media (max-width: 520px) {
    .sc-grid            { grid-template-columns: 1fr; }
    .sc-home-watermark  { display: none; }
    .sc-footer-watermark { display: none; }
  }
`;