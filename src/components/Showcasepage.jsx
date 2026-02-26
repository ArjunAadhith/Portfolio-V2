import { useEffect, useRef, useState, useCallback, memo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";

const ALL_PROJECTS = [
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
  },
];

const CATEGORY_ORDER = ["Graphic Design", "Logos", "3D Model", "Game", "Wallpapers", "Others"];
const _seen = new Set();
const _dynamic = [];
CATEGORY_ORDER.forEach((c) => {
  if (ALL_PROJECTS.some((p) => p.category === c)) {
    _seen.add(c);
    _dynamic.push(c);
  }
});
ALL_PROJECTS.forEach((p) => {
  if (!_seen.has(p.category)) {
    _seen.add(p.category);
    _dynamic.push(p.category);
  }
});
const CATEGORIES = ["All", ..._dynamic];
const INITIAL_LIMIT = 6;

/* ══════════════════════════════════════════════════════════
   HERO SECTION — Redesigned
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
    show: { transition: { staggerChildren: 0.11, delayChildren: 0.2 } },
  };
  const itm = {
    hidden: { opacity: 0, y: 36 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };
  const lineReveal = {
    hidden: { scaleX: 0 },
    show: { scaleX: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.4 } },
  };

  return (
    <section ref={ref} className="sc-home">
      {/* Decorative ruled lines */}
      <motion.div className="sc-hero-rule sc-rule-top" variants={lineReveal} initial="hidden" animate="show" />
      <motion.div
        className="sc-hero-rule sc-rule-mid"
        variants={lineReveal}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.55 }}
      />

      <motion.div className="sc-home-inner" style={{ y: innerY }}>
        <motion.div variants={ctnr} initial="hidden" animate="show" className="sc-hero-content">

          {/* Top meta row */}
          <motion.div variants={itm} className="sc-hero-meta-row">
            <span className="sc-home-tag">Selected Works</span>
            <span className="sc-hero-index">2026 / AA</span>
          </motion.div>

          {/* Giant 3-tier heading */}
          <motion.h1 variants={itm} className="sc-home-name">
            <span className="sc-name-line sc-name-outlined">Multi</span>
            <span className="sc-name-line sc-name-filled">disciplinary</span>
            <span className="sc-name-line sc-name-sub-italic">Creative Showcase</span>
          </motion.h1>

          {/* Bottom row: disciplines + CTA */}
          <motion.div variants={itm} className="sc-hero-bottom-row">
            <p className="sc-home-sub">
              Graphic Design&nbsp;&nbsp;·&nbsp;&nbsp;Logos&nbsp;&nbsp;·&nbsp;&nbsp;
              Game Art&nbsp;&nbsp;·&nbsp;&nbsp;Wallpapers&nbsp;&nbsp;·&nbsp;&nbsp;Development
            </p>
            <button className="sc-home-cta" onClick={onScrollDown}>
              <span>Explore Projects</span>
              <span className="sc-cta-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M3 8l4 4 4-4" stroke="currentColor"
                        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
          </motion.div>

        </motion.div>
      </motion.div>

      {/* Ghost watermark */}
      <div className="sc-home-watermark" aria-hidden="true">MC</div>

    </section>
  );
});

/* ══════════════════════════════════════════════════════════
   PROJECT CARD
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
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (index % 2) * 0.06 }}
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
   PROJECTS SECTION
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
      <div className="sc-filter-sticky">
        <div className="sc-filter-bar">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
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
   FOOTER — Redesigned with grey info rectangle
   ══════════════════════════════════════════════════════════ */
const SCFooter = memo(function SCFooter({ onClose }) {
  return (
    <footer className="sc-footer">

      {/* ── BIG GREY RECTANGLE — everything lives inside ── */}
      <div className="sc-footer-card">
        <div className="sc-footer-card-texture" aria-hidden="true" />
        <div className="sc-footer-card-watermark" aria-hidden="true">AA</div>

        {/* Top meta row */}
        <div className="sc-footer-eyebrow-row">
          <span className="sc-footer-eyebrow">
            <span className="sc-footer-dot" />
            Available for new projects
          </span>
          <span className="sc-footer-year">2026</span>
        </div>

        {/* Big headline */}
        <h2 className="sc-footer-headline">
          <span className="sc-fh-line">Think bold.</span>
          <span className="sc-fh-line sc-fh-accent">Design sharp.</span>
          <span className="sc-fh-line">Build right.</span>
        </h2>

        {/* Divider */}
        <div className="sc-footer-rule" />

        {/* Bottom row — back button + copyright */}
        <div className="sc-footer-card-bottom">
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
          <span className="sc-footer-copy">© 2026 Arjun Aadhith</span>
        </div>

      </div>

      {/* Slim bottom bar */}
      <div className="sc-footer-bottom">
        <span className="sc-footer-built">Designed &amp; Built by Arjun</span>
      </div>

    </footer>
  );
});

/* ══════════════════════════════════════════════════════════
   ROOT EXPORT
   ══════════════════════════════════════════════════════════ */
export default function ShowcasePage({ isOpen, onClose }) {
  const pageRef    = useRef(null);
  const projectRef = useRef(null);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("portfolio:nav", { detail: { visible: !isOpen } }),
    );
  }, [isOpen]);

  useEffect(() => {
    const fn = () => onClose();
    window.addEventListener("portfolio:closeAbout", fn);
    return () => window.removeEventListener("portfolio:closeAbout", fn);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && pageRef.current) pageRef.current.scrollTop = 0;
  }, [isOpen]);

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
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-y: contain;
    scroll-behavior: smooth;
  }

  /* ══════════════════════════════════════
     HERO — Redesigned
     ══════════════════════════════════════ */
  .sc-home {
    position: relative;
    height: 100vh;
    min-height: 600px;
    display: flex;
    align-items: flex-end;
    padding: 0 80px 9vh;
    overflow: hidden;
    background: #ffffff;
    border-bottom: 1px solid #e8e8e8;
  }

  /* Horizontal ruled lines */
  .sc-hero-rule {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: #eeeeee;
    transform-origin: left center;
    pointer-events: none;
    z-index: 1;
  }
  .sc-rule-top { top: 68px; }
  .sc-rule-mid { top: 48%; }

  .sc-home-inner {
    position: relative;
    z-index: 2;
    width: 100%;
    will-change: transform;
  }
  .sc-hero-content {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* Meta row */
  .sc-hero-meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
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
  }
  .sc-hero-index {
    font-size: 11px;
    font-weight: 500;
    color: #d0d0d0;
    letter-spacing: 0.08em;
  }

  /*
    3-TIER TYPOGRAPHIC HERO TITLE
    Line 1: ghost/outlined giant text
    Line 2: solid black giant text
    Line 3: light italic subtitle
  */
  .sc-home-name {
    margin: 0 0 26px;
    line-height: 0.9;
    letter-spacing: -0.05em;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
  }
  .sc-name-line { display: block; }

  .sc-name-outlined {
    font-size: clamp(68px, 11.5vw, 158px);
    font-weight: 900;
    color: transparent;
    -webkit-text-stroke: 2px #111111;
  }
  .sc-name-filled {
    font-size: clamp(68px, 11.5vw, 158px);
    font-weight: 900;
    color: #111111;
  }
  .sc-name-sub-italic {
    font-size: clamp(20px, 3.4vw, 48px);
    font-weight: 300;
    font-style: italic;
    color: #c8c8c8;
    letter-spacing: -0.015em;
    padding-top: 8px;
  }

  /* Bottom row */
  .sc-hero-bottom-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .sc-home-sub {
    font-size: 12px;
    color: #bbbbbb;
    letter-spacing: 0.02em;
    margin: 0;
    font-weight: 400;
    line-height: 1.5;
  }

  /* CTA — filled black */
  .sc-home-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    background: #111111;
    color: #ffffff;
    border: 1.5px solid #111111;
    border-radius: 100px;
    padding: 12px 24px;
    cursor: pointer;
    font-family: inherit;
    flex-shrink: 0;
    transition: background 0.22s ease, color 0.22s ease, border-color 0.22s ease;
  }
  .sc-home-cta:hover {
    background: #ffffff;
    color: #111111;
  }
  .sc-cta-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Ghost watermark — bottom right */
  .sc-home-watermark {
    position: absolute;
    bottom: -0.14em;
    right: -0.04em;
    font-size: clamp(180px, 28vw, 400px);
    font-weight: 900;
    letter-spacing: -0.06em;
    line-height: 1;
    color: #f2f2f2;
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
    transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
  }
  .sc-filter-btn:hover {
    background: #f2f2f2;
    border-color: #cccccc;
    color: #444444;
  }

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

  .sc-card {
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    border: 1.5px solid #eeeeee;
    transition: border-color 0.22s ease;
    position: relative;
  }
  .sc-card:hover { border-color: #d4d4d4; }

  .sc-card-media {
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: #f0f0f0;
  }
  .sc-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
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
    transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  }
  .sc-readmore-btn:hover {
    background: #111111;
    border-color: #111111;
    color: #ffffff;
  }

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
     FOOTER — all content inside grey card
     ══════════════════════════════════════ */
  .sc-footer {
    position: relative;
    background: #ffffff;
    padding: 40px 80px 0;
    display: flex;
    flex-direction: column;
    border-top: 1px solid #eeeeee;
  }

  /* ── THE GREY RECTANGLE — full footer CTA ── */
  .sc-footer-card {
    position: relative;
    background: #ffffff;
    border: 2px solid #e8e8e8;
    border-radius: 24px;
    padding: 52px 56px 52px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 460px;
  }

  /* Diagonal texture */
  .sc-footer-card-texture {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: repeating-linear-gradient(
      -52deg,
      transparent,
      transparent 32px,
      rgba(0,0,0,0.016) 32px,
      rgba(0,0,0,0.016) 33px
    );
  }

  /* "AA" ghost watermark inside card */
  .sc-footer-card-watermark {
    position: absolute;
    bottom: -0.11em;
    right: -0.04em;
    font-size: clamp(140px, 22vw, 340px);
    font-weight: 900;
    letter-spacing: -0.06em;
    line-height: 1;
    color: rgba(0,0,0,0.055);
    pointer-events: none;
    user-select: none;
    z-index: 0;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
  }

  .sc-footer-eyebrow-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 36px;
    position: relative;
    z-index: 1;
  }
  .sc-footer-eyebrow {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #999999;
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
    color: #bbbbbb;
    letter-spacing: 0.06em;
  }

  /* Big headline */
  .sc-footer-headline {
    font-size: clamp(44px, 7.5vw, 108px);
    font-weight: 900;
    letter-spacing: -0.05em;
    line-height: 0.95;
    margin: 0;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    position: relative;
    z-index: 1;
  }
  .sc-fh-line   { display: block; color: #111111; }
  .sc-fh-accent { color: rgba(0,0,0,0.22); font-style: italic; font-weight: 700; }

  /* Hairline rule inside card */
  .sc-footer-rule {
    width: 100%;
    height: 1px;
    background: #e0e0e000;
    margin: 36px 0 32px;
    position: relative;
    z-index: 1;
  }

  /* Bottom row inside card */
  .sc-footer-card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;
  }

  /* Back button */
  .sc-footer-back {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    height: 48px;
    padding: 0 22px 0 14px;
    background: #ffffff;
    color: #333333;
    border: 1.5px solid rgba(0,0,0,0.1);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
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
    background: #e8e8e8;
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

  .sc-footer-copy {
    font-size: 12px;
    color: #aaaaaa;
    font-weight: 400;
    letter-spacing: 0.01em;
  }

  /* Bottom bar below the card */
  .sc-footer-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px 0 28px;
  }
  .sc-footer-built {
    font-size: 11px;
    color: #cccccc;
    font-weight: 400;
    letter-spacing: 0.04em;
  }

  /* ══════════════════════════════════════
     RESPONSIVE
     ══════════════════════════════════════ */
  @media (max-width: 1024px) {
    .sc-home        { padding: 0 48px 8vh; }
    .sc-filter-bar  { padding: 12px 36px; }
    .sc-grid-outer  { padding: 32px 36px 0; }
    .sc-strip-text  { padding: 12px 36px; }
    .sc-footer      { padding: 32px 48px 0; }
    .sc-footer-card { padding: 44px 48px; }
  }
  @media (max-width: 768px) {
    .sc-home              { padding: 0 28px 8vh; min-height: 100svh; }
    .sc-name-outlined,
    .sc-name-filled       { font-size: clamp(52px, 14vw, 100px); }
    .sc-name-sub-italic   { font-size: clamp(18px, 5vw, 36px); }
    .sc-hero-bottom-row   { flex-direction: column; align-items: flex-start; gap: 16px; }
    .sc-scroll-indicator  { display: none; }
    .sc-filter-bar        { padding: 12px 20px; }
    .sc-grid-outer        { padding: 24px 20px 0; }
    .sc-grid              { gap: 12px; }
    .sc-strip-text        { padding: 12px 20px; }
    .sc-footer            { padding: 24px 28px 0; }
    .sc-footer-card       { padding: 36px 32px; min-height: 380px; border-radius: 18px; }
    .sc-footer-headline   { font-size: clamp(36px, 10vw, 64px); }
    .sc-footer-card-watermark { font-size: clamp(100px, 28vw, 180px); }
    .sc-footer-card-bottom { flex-direction: column; align-items: flex-start; gap: 16px; }
    .sc-footer-built      { display: none; }
  }
  @media (max-width: 520px) {
    .sc-grid              { grid-template-columns: 1fr; }
    .sc-home-watermark    { display: none; }
    .sc-footer-watermark  { display: none; }
    .sc-hero-rule         { display: none; }
  }
`;