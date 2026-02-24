/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  MoreAbout.jsx  —  Production-ready About panel                          ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║  QUICK INTEGRATION                                                       ║
 * ║  ─────────────────                                                       ║
 * ║  // App.jsx or parent:                                                   ║
 * ║  const [aboutOpen, setAboutOpen] = useState(false);                     ║
 * ║                                                                          ║
 * ║  <Navbar                                                                 ║
 * ║    onNavClick={() => setAboutOpen(false)}  ← ANY icon closes About      ║
 * ║    onAboutClick={() => setAboutOpen(true)}                               ║
 * ║  />                                                                      ║
 * ║  <MoreAbout isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />   ║
 * ║                                                                          ║
 * ║  // Navbar also listens to a DOM event (no prop drilling needed):        ║
 * ║  // window.addEventListener("portfolio:nav", e => setHide(!e.detail.v)) ║
 * ║                                                                          ║
 * ║  DEPENDENCY:  framer-motion  (npm i framer-motion)                      ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import { useEffect, useRef, useCallback, memo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

/* ════════════════════════════════════════════════════════════════════════════
   ① REUSABLE  —  <RevealText />
   ────────────────────────────────────────────────────────────────────────────
   Animates any children into view every time they enter the viewport.
   ✓ Re-triggers on scroll-up AND scroll-down  (viewport.once = false)
   ✓ opacity 0 → 1   translateY 40 → 0   0.8s easeOut
   ✓ memo() prevents re-renders from parent state changes

   Props
   ─────
   delay    s      extra delay before starting         default 0
   y        px     initial Y offset                    default 40
   duration s      animation length                    default 0.8
   as       tag    HTML element to render              default "div"
   ══════════════════════════════════════════════════════════════════════════ */
export const RevealText = memo(function RevealText({
  children,
  delay    = 0,
  y        = 40,
  duration = 0.8,
  as       = "div",
  className = "",
  style     = {},
}) {
  const Tag = motion[as] ?? motion.div;

  return (
    <Tag
      className={className}
      style={style}
      /* ── initial hidden state ── */
      initial={{ opacity: 0, y }}
      /* ── visible state — applied on every viewport entry ── */
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: false,                  // ← re-triggers every time element enters
        margin: "-8% 0px -8% 0px",   // fires when 8% of element is visible
      }}
      transition={{
        duration,
        ease: [0.22, 1, 0.36, 1],    // custom cubic-bezier — premium easeOut
        delay,
      }}
    >
      {children}
    </Tag>
  );
});

/* ════════════════════════════════════════════════════════════════════════════
   ② REUSABLE  —  <ParallaxSection />
   ────────────────────────────────────────────────────────────────────────────
   Adds a smooth parallax translateY to its BACKGROUND as the user scrolls.
   The background moves at ~35% of scroll speed — content stays static.

   How it works:
   • useScroll tracks the section's scroll progress inside the scroller div
   • useTransform maps 0→1 progress to a Y translation range
   • useSpring smooths the value — eliminates jitter on fast scroll

   Props
   ─────
   scroller  ref    the .ma-page scrolling container ref
   imageSrc  str    background image URL (optional)
   bgColor   str    fallback colour                default "#0E0E0E"
   height    str    CSS height of the band         default "auto"
   overlay   0–1   dark overlay opacity            default 0.55
   ══════════════════════════════════════════════════════════════════════════ */
export const ParallaxSection = memo(function ParallaxSection({
  scroller,
  imageSrc,
  bgColor  = "#0E0E0E",
  children,
  className = "",
  height    = "auto",
  overlay   = 0.55,
}) {
  const ref = useRef(null);

  /* Track how far this section has scrolled through the viewport */
  const { scrollYProgress } = useScroll({
    target:    ref,
    container: scroller,              // scoped to .ma-page, NOT window
    offset: ["start end", "end start"],
  });

  /* Background shifts −12% → +12% relative to the section's scroll progress */
  const rawY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  /* Spring removes micro-jitter caused by fast trackpad / wheel bursts */
  const smoothY = useSpring(rawY, { stiffness: 70, damping: 18, mass: 0.6 });

  return (
    <section
      ref={ref}
      className={`ps-root ${className}`}
      style={{ position: "relative", overflow: "hidden", height }}
    >
      {/* ── Parallax background — oversized so shift never reveals edges ── */}
      <motion.div
        aria-hidden="true"
        style={{
          y:                  smoothY,
          position:           "absolute",
          top:                "-15%",
          left:               0,
          right:              0,
          bottom:             "-15%",
          backgroundImage:    imageSrc ? `url(${imageSrc})` : undefined,
          backgroundColor:    bgColor,
          backgroundSize:     "cover",
          backgroundPosition: "center",
          willChange:         "transform",   // GPU compositing layer
        }}
      />

      {/* ── Overlay — keeps text legible over any image ── */}
      {overlay > 0 && (
        <div
          aria-hidden="true"
          style={{
            position:   "absolute",
            inset:      0,
            background: `rgba(14,14,14,${overlay})`,
            zIndex:     1,
          }}
        />
      )}

      {/* ── Content on top of background and overlay ── */}
      <div
        style={{
          position:       "relative",
          zIndex:         2,
          height:         "100%",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          width:          "100%",
        }}
      >
        {children}
      </div>
    </section>
  );
});

/* ════════════════════════════════════════════════════════════════════════════
   ③ REUSABLE  —  <ParallaxImage />
   ────────────────────────────────────────────────────────────────────────────
   Applies parallax directly to an <img> element.
   The image moves SLOWER than scroll so it appears to drift behind content.

   Props
   ─────
   scroller  ref    the scrolling container ref
   src       str    image src
   alt       str    alt text
   ══════════════════════════════════════════════════════════════════════════ */
export const ParallaxImage = memo(function ParallaxImage({
  scroller,
  src,
  alt,
  className = "",
  style     = {},
}) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target:    ref,
    container: scroller,
    offset: ["start end", "end start"],
  });

  /* Image shifts −8% → +8% — subtle but clearly visible parallax on an img */
  const rawY   = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const smoothY = useSpring(rawY, { stiffness: 70, damping: 18, mass: 0.6 });

  return (
    /* Clip wrapper prevents the shifted image from overflowing its container */
    <div
      ref={ref}
      style={{ overflow: "hidden", borderRadius: "inherit", ...style }}
      className={className}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{
          y:          smoothY,
          display:    "block",
          width:      "100%",
          /* Extra height so the Y drift doesn't show white edges */
          height:     "116%",
          objectFit:  "cover",
          willChange: "transform",
        }}
      />
    </div>
  );
});

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 1  —  HERO
   ────────────────────────────────────────────────────────────────────────────
   • Mount animation: staggered entrance (fires fresh on every panel open)
   • Parallax:        hero content drifts upward as user scrolls away
   ══════════════════════════════════════════════════════════════════════════ */
const MAHome = memo(function MAHome({ onScrollDown, scroller }) {
  const ref = useRef(null);

  /* Hero CONTENT parallax — drifts up at 22% of scroll speed */
  const { scrollYProgress } = useScroll({
    target:    ref,
    container: scroller,
    offset: ["start start", "end start"],
  });
  const rawY   = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const innerY = useSpring(rawY, { stiffness: 70, damping: 18, mass: 0.6 });

  /* Stagger variants — fires once per remount (every panel open) */
  const ctnr = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.11, delayChildren: 0.28 } },
  };
  const itm = {
    hidden: { opacity: 0, y: 32 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section ref={ref} className="ma-home">
      <motion.div className="ma-home-inner" style={{ y: innerY }}>
        <motion.div variants={ctnr} initial="hidden" animate="show">

          <motion.div variants={itm} className="ma-home-tag">
            About Me &amp; My Interests
          </motion.div>

          <motion.h1 variants={itm} className="ma-home-name">
            <span className="d-block">Arjun</span>
            <span className="d-block">Aadhith</span>
          </motion.h1>

          <motion.p variants={itm} className="ma-home-sub">
            UI/UX · Graphic · Product · Visual Design · Development
          </motion.p>

          <motion.button variants={itm} className="ma-home-scroll" onClick={onScrollDown}>
            <span>Scroll</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor"
                strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>

        </motion.div>
      </motion.div>

      <div className="ma-home-bg-name" aria-hidden="true">AA</div>
    </section>
  );
});

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 2  —  ABOUT
   ────────────────────────────────────────────────────────────────────────────
   • All text blocks:   RevealText  (re-triggers every viewport pass)
   • Image:             ParallaxImage (existing /About pic.png, with parallax)
   • Quote band:        ParallaxSection
   ══════════════════════════════════════════════════════════════════════════ */
const MAAbout = memo(function MAAbout({ scroller }) {
  return (
    <section className="ma-about">

      {/* ── Text + image block ── */}
      <div className="ma-section-inner">

        <RevealText>
          <h2 className="ma-about-heading">
            Designing experiences
            <em className="ma-italic"> that feel right.</em>
          </h2>
        </RevealText>

        <RevealText delay={0.07}>
          <p className="ma-about-para">
            I'm Arjun Aadhith, a multi-disciplinary designer and developer
            crafting thoughtful digital experiences across products, creative
            websites, and scalable systems.
          </p>
        </RevealText>

        <RevealText delay={0.12}>
          <p className="ma-about-para">
            My work sits at the intersection of design and technology — where
            aesthetics meet usability and ideas transform into functional
            realities. I specialize in UI/UX design, graphic design, product
            design, visual design, illustration, and branding.
          </p>
        </RevealText>

        {/*
          ── EXISTING IMAGE — kept as required, with parallax applied ──────
          ParallaxImage wraps the img tag and applies a smooth Y drift.
          The clip wrapper (overflow:hidden) prevents the shifted image
          from spilling outside the rounded card.
        */}
        <RevealText delay={0.1}>
          <div className="ma-img-card">
            <ParallaxImage
              scroller={scroller}
              src="/About pic.png"
              alt="Arjun Aadhith"
            />
          </div>
        </RevealText>

        <RevealText delay={0.07}>
          <p className="ma-about-para">
            Beyond design, I bring concepts to life through development,
            ensuring every interaction feels seamless and every system performs
            efficiently. I approach each project with clarity, structure, and
            intent, focusing on solving real problems for real users.
          </p>
        </RevealText>

        <RevealText delay={0.1}>
          <p className="ma-about-para">
            For me, great design is not decoration. It is communication,
            precision, and impact. Every product I craft is built to be
            intuitive, elegant, and meaningful.
          </p>
        </RevealText>

      </div>

      {/*
        ── Parallax quote band ─────────────────────────────────────────────
        Background moves at 35% of scroll speed (ParallaxSection default).
      */}
      <ParallaxSection
        scroller={scroller}
        bgColor="#111111"
        height="200px"
        overlay={0}
        className="ma-about-band"
      >
        <RevealText style={{ width: "100%", maxWidth: 860, padding: "0 48px" }}>
          <blockquote className="ma-band-quote">
            "Design is communication, precision, and impact."
          </blockquote>
        </RevealText>
      </ParallaxSection>

    </section>
  );
});

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 3  —  EXPERIENCE
   ════════════════════════════════════════════════════════════════════════════ */
const JOBS = [
  {
    role: "Senior UI/UX Designer", company: "Freelance",
    period: "2022 — Present", type: "Full-time",
    desc: "Designing end-to-end digital products for startups and established brands. Work spans mobile apps, web platforms, and brand identity systems.",
    tags: ["Figma", "React", "Prototyping", "Design Systems"],
  },
  {
    role: "Product Designer", company: "Studio Project",
    period: "2021 — 2022", type: "Contract",
    desc: "Led the visual and interaction design of a SaaS dashboard used by 10k+ users. Built a complete component library from scratch.",
    tags: ["UI Design", "User Research", "Figma", "Handoff"],
  },
  {
    role: "Graphic Designer", company: "Creative Agency",
    period: "2020 — 2021", type: "Part-time",
    desc: "Created visual identities, marketing materials, and social content for clients across industries. End-to-end brand development.",
    tags: ["Illustrator", "Photoshop", "Brand Identity", "Print"],
  },
  {
    role: "Illustration & Visual Art", company: "Self-directed",
    period: "2019 — Present", type: "Ongoing",
    desc: "Personal practice in digital illustration, character design, and visual storytelling. Regular global commissions.",
    tags: ["Illustration", "Procreate", "Character Design", "Art Direction"],
  },
];

const MAExperience = memo(function MAExperience({ scroller }) {
  return (
    <section className="ma-exp">
      <div className="ma-section-inner">

        <RevealText>
          <p className="ma-section-label">Experience</p>
        </RevealText>

        <RevealText delay={0.06}>
          <h2 className="ma-exp-heading">
            Where I've worked &amp;<br />what I've built.
          </h2>
        </RevealText>

        <div className="ma-timeline">
          {JOBS.map((job, i) => (
            /*
              Each card uses RevealText with a staggered delay.
              viewport.once=false means it re-animates every scroll pass.
            */
            <RevealText key={job.role} delay={i * 0.06} className="ma-timeline-item">
              <div className="ma-timeline-left">
                <div className="ma-timeline-period">{job.period}</div>
                <div className="ma-timeline-type">{job.type}</div>
              </div>
              <div className="ma-timeline-dot" />
              <div className="ma-timeline-right">
                <div className="ma-timeline-role">{job.role}</div>
                <div className="ma-timeline-company">{job.company}</div>
                <p className="ma-timeline-desc">{job.desc}</p>
                <div className="ma-timeline-tags">
                  {job.tags.map((t) => <span key={t} className="ma-tag">{t}</span>)}
                </div>
              </div>
            </RevealText>
          ))}
        </div>

      </div>

      {/* Parallax divider strip between experience and footer */}
      <ParallaxSection
        scroller={scroller}
        bgColor="#080808"
        height="130px"
        overlay={0}
        className="ma-exp-strip"
      >
        <RevealText style={{ width: "100%", maxWidth: 860, padding: "0 48px" }}>
          <p className="ma-strip-text">Every project is a new problem worth solving.</p>
        </RevealText>
      </ParallaxSection>

    </section>
  );
});

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 4  —  FOOTER
   ════════════════════════════════════════════════════════════════════════════ */
const MAFooter = memo(function MAFooter() {
  return (
    <footer className="ma-footer">
      <div className="ma-footer-inner">

        <div className="ma-footer-cta">
          <RevealText>
            <p className="ma-footer-sup">Let's build something great</p>
          </RevealText>
          <RevealText delay={0.08}>
            <h2 className="ma-footer-headline">Ready to work<br />together?</h2>
          </RevealText>
          <RevealText delay={0.15}>
            <a href="mailto:arjunaadhith@email.com" className="ma-footer-btn">
              Get in touch
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </RevealText>
        </div>

        <RevealText>
          <div className="ma-footer-links">
            {[
              { label: "LinkedIn ↗", href: "https://linkedin.com" },
              { label: "GitHub ↗",   href: "https://github.com" },
              { label: "Dribbble ↗", href: "https://dribbble.com" },
              { label: "Email ↗",    href: "mailto:arjunaadhith@email.com" },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank"
                rel="noopener noreferrer" className="ma-footer-link">
                {label}
              </a>
            ))}
          </div>
        </RevealText>

        <RevealText delay={0.05}>
          <p className="ma-footer-copy">© 2025 Arjun Aadhith. All rights reserved.</p>
        </RevealText>

      </div>
    </footer>
  );
});

/* ════════════════════════════════════════════════════════════════════════════
   ROOT EXPORT  —  MoreAbout
   ────────────────────────────────────────────────────────────────────────────

   CLOSE LOGIC
   ───────────
   This component has NO internal close button.
   Closing is 100% controlled by the parent via   isOpen / onClose.

   To close from your Navbar on ANY icon click:
     <NavIcon onClick={() => { setAboutOpen(false); navigateTo("home"); }} />

   The component also fires a DOM event so Navbar can hide itself:
     window.dispatchEvent(new CustomEvent("portfolio:nav", { detail:{ v:!isOpen }}))
   Listen in Navbar:
     window.addEventListener("portfolio:nav", e => setNavHidden(!e.detail.v))

   ══════════════════════════════════════════════════════════════════════════ */
export default function MoreAbout({ isOpen, onClose }) {
  const pageRef = useRef(null);

  /* ── 1. Dispatch navbar hide/show event ──────────────────────────────── */
  useEffect(() => {
    /*
      Tells the Navbar whether to show or hide itself.
      In your Navbar component, listen like this:
        useEffect(() => {
          const fn = (e) => setNavVisible(e.detail.visible);
          window.addEventListener("portfolio:nav", fn);
          return () => window.removeEventListener("portfolio:nav", fn);
        }, []);
    */
    window.dispatchEvent(
      new CustomEvent("portfolio:nav", { detail: { visible: !isOpen } })
    );
  }, [isOpen]);

  /* ── 2. Listen for close command from Navbar ──────────────────────────
     WHY THIS IS NEEDED:
     The panel sits at z-index:100000 and covers the full screen, so the
     Navbar is visually hidden behind it. To close from any nav icon, your
     Navbar dispatches "portfolio:closeAbout" and this effect calls onClose().

     In EVERY Navbar icon's onClick handler, add ONE line:
       window.dispatchEvent(new CustomEvent("portfolio:closeAbout"));

     Example Navbar icon:
       <button onClick={() => {
         window.dispatchEvent(new CustomEvent("portfolio:closeAbout"));
         navigate("/projects");
       }}>Projects</button>
  ────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const fn = () => onClose();
    window.addEventListener("portfolio:closeAbout", fn);
    return () => window.removeEventListener("portfolio:closeAbout", fn);
  }, [onClose]);

  /* ── 2. Lock body scroll while panel is open ─────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* ── 3. Escape key → close (mirrors navbar click) ────────────────────── */
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  /* ── 4. Instant scroll-to-top before each open — zero flicker ─────────── */
  useEffect(() => {
    if (isOpen && pageRef.current) pageRef.current.scrollTop = 0;
  }, [isOpen]);

  /* ── 5. Forward MoreAbout's internal scroll to Navbar ────────────────────
     The .ma-page div is position:fixed with overflow-y:auto.
     Scrolling inside it NEVER fires window/document scroll events, so the
     Navbar's existing scroll listener is blind to it.
     We dispatch "portfolio:aboutScroll" so Navbar can hide/show correctly.
  ────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    let lastY   = 0;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY  = el.scrollTop;
        const direction = currentY > lastY ? "down" : "up";
        window.dispatchEvent(
          new CustomEvent("portfolio:aboutScroll", {
            detail: { direction, scrollTop: currentY },
          })
        );
        lastY   = currentY;
        ticking = false;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isOpen]); // re-attach when panel opens (pageRef.current changes)

  /* ── Scroll hero → next section ─────────────────────────────────────── */
  const scrollDown = useCallback(() => {
    pageRef.current?.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  }, []);

  return (
    <>
      <style>{CSS}</style>

      {/*
        ── Framer Motion drives the slide transition ─────────────────────────
        Closed:  y = "100%"  (panel is completely off-screen below)
        Open:    y = "0%"    (panel fills the entire viewport)

        key={String(isOpen)}
          Forces full child remount on each open → hero entrance animation
          always fires fresh → all RevealText elements start from hidden state.
      */}
      <motion.div
        className="ma-page"
        ref={pageRef}
        animate={{ y: isOpen ? "0%" : "100%" }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!isOpen}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        {/* NO floating button — close is handled exclusively by Navbar */}

        <div key={String(isOpen)} style={{ display: "contents" }}>
          <MAHome       onScrollDown={scrollDown} scroller={pageRef} />
          <MAAbout      scroller={pageRef} />
          <MAExperience scroller={pageRef} />
          <MAFooter />
        </div>
      </motion.div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   STYLES
   ══════════════════════════════════════════════════════════════════════════ */
const CSS = `
  /* ── Shell ───────────────────────────────────────────────────────────── */
  .ma-page {
    position: fixed; inset: 0; z-index: 100000;
    overflow-y: auto; overflow-x: hidden;
    background: #0E0E0E;
    font-family: -apple-system, "SF Pro Text", BlinkMacSystemFont,
                 "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    scroll-behavior: smooth;
    /* translateY managed by Framer Motion — no CSS transition here */
  }

  /* ── Hero — exactly 100 vh ────────────────────────────────────────────── */
  .ma-home {
    position: relative; height: 100vh;
    display: flex; align-items: center;
    padding: 0 48px; overflow: hidden;
    background: #0E0E0E;
  }
  .ma-home-inner { position: relative; z-index: 2; will-change: transform; }
  .ma-home-tag {
    display: inline-block; font-size: 12px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(255,255,255,0.4); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 100px; padding: 6px 16px; margin-bottom: 40px;
  }
  .ma-home-name {
    font-size: clamp(68px, 11vw, 160px); font-weight: 800;
    line-height: 0.93; letter-spacing: -0.05em; margin: 0 0 40px; color: #fff;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
  }
  .d-block { display: block; }
  .ma-home-sub {
    font-size: 15px; color: rgba(255,255,255,0.4);
    letter-spacing: 0.02em; margin: 0 0 64px; font-weight: 400;
  }
  .ma-home-scroll {
    display: inline-flex; align-items: center; gap: 8px; font-size: 13px;
    color: rgba(255,255,255,0.35); cursor: pointer;
    font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase;
    background: none; border: none; padding: 0; font-family: inherit;
    transition: color 0.2s;
  }
  .ma-home-scroll:hover { color: rgba(255,255,255,0.75); }
  .ma-home-bg-name {
    position: absolute; bottom: -40px; right: -40px;
    font-size: clamp(180px, 28vw, 400px); font-weight: 800;
    letter-spacing: -0.08em; color: rgba(255,255,255,0.022);
    line-height: 1; pointer-events: none; z-index: 1;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
    user-select: none;
  }

  /* ── Shared layout ────────────────────────────────────────────────────── */
  .ma-section-inner {
    max-width: 860px; margin: 0 auto; padding: 120px 48px;
    display: flex; flex-direction: column; gap: 32px;
  }

  /* ── About ────────────────────────────────────────────────────────────── */
  .ma-about { background: #141414; border-top: 1px solid rgba(255,255,255,0.06); }
  .ma-about-heading {
    font-size: clamp(40px, 5.5vw, 72px); font-weight: 700; color: #fff;
    line-height: 1.08; letter-spacing: -0.035em; margin: 0;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
  }
  .ma-italic { color: rgba(255,255,255,0.38); font-style: italic; }
  .ma-about-para {
    font-size: clamp(17px, 2vw, 22px); line-height: 1.82;
    color: rgba(255,255,255,0.58); margin: 0;
    font-weight: 400; letter-spacing: -0.01em;
  }

  /* ── Image card — existing image with parallax ────────────────────────── */
  .ma-img-card {
    width: 100%; border-radius: 20px; overflow: hidden;
    /* ParallaxImage handles its own overflow clip */
  }

  /* ── Parallax quote band ──────────────────────────────────────────────── */
  .ma-about-band { border-top: 1px solid rgba(255,255,255,0.05); }
  .ma-band-quote {
    font-size: clamp(18px, 2.8vw, 30px); font-weight: 600;
    color: rgba(255,255,255,0.5); font-style: italic;
    letter-spacing: -0.02em; margin: 0;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
    line-height: 1.45;
    border-left: 2px solid rgba(255,255,255,0.2);
    padding-left: 24px;
    display: block;
  }

  /* ── Experience ───────────────────────────────────────────────────────── */
  .ma-exp { background: #0E0E0E; border-top: 1px solid rgba(255,255,255,0.06); }
  .ma-exp .ma-section-inner { gap: 0; }
  .ma-section-label {
    font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(255,255,255,0.28);
    margin: 0 0 16px;
  }
  .ma-exp-heading {
    font-size: clamp(26px, 3.5vw, 46px); font-weight: 700; color: #fff;
    letter-spacing: -0.03em; margin: 0 0 72px; line-height: 1.15;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
  }
  .ma-timeline { display: flex; flex-direction: column; position: relative; }
  .ma-timeline::before {
    content: ""; position: absolute; left: 180px; top: 0; bottom: 0;
    width: 1px; background: rgba(255,255,255,0.07);
  }
  .ma-timeline-item {
    display: grid; grid-template-columns: 180px 1px 1fr;
    gap: 0 40px; padding-bottom: 56px;
  }
  .ma-timeline-item:last-child { padding-bottom: 0; }
  .ma-timeline-left { text-align: right; padding-top: 4px; }
  .ma-timeline-period {
    font-size: 13px; color: rgba(255,255,255,0.35);
    font-weight: 500; letter-spacing: -0.01em; margin-bottom: 4px;
  }
  .ma-timeline-type {
    font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: rgba(255,255,255,0.16);
  }
  .ma-timeline-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: rgba(255,255,255,0.22); border: 1px solid rgba(255,255,255,0.1);
    align-self: start; margin-top: 6px; position: relative;
    left: -3px; flex-shrink: 0;
  }
  .ma-timeline-role {
    font-size: 19px; font-weight: 600; color: #fff;
    letter-spacing: -0.02em; margin-bottom: 4px;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
  }
  .ma-timeline-company {
    font-size: 14px; color: rgba(255,255,255,0.32);
    margin-bottom: 14px; font-weight: 400;
  }
  .ma-timeline-desc {
    font-size: 15px; color: rgba(255,255,255,0.48); line-height: 1.72;
    margin: 0 0 20px; font-weight: 400; max-width: 540px;
  }
  .ma-timeline-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .ma-tag {
    font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.38);
    background: rgba(255,255,255,0.055); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 100px; padding: 4px 12px; letter-spacing: 0.01em;
  }
  .ma-exp-strip { border-top: 1px solid rgba(255,255,255,0.04); }
  .ma-strip-text {
    font-size: clamp(13px, 1.6vw, 17px); color: rgba(255,255,255,0.22);
    font-style: italic; margin: 0; letter-spacing: 0.02em;
    text-align: left; display: block;
    border-left: 1px solid rgba(255,255,255,0.12); padding-left: 20px;
  }

  /* ── Footer ───────────────────────────────────────────────────────────── */
  .ma-footer { background: #141414; border-top: 1px solid rgba(255,255,255,0.06); }
  .ma-footer-inner { max-width: 1100px; margin: 0 auto; padding: 120px 48px 80px; }
  .ma-footer-cta { margin-bottom: 100px; }
  .ma-footer-sup {
    font-size: 12px; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: rgba(255,255,255,0.22); margin: 0 0 24px;
  }
  .ma-footer-headline {
    font-size: clamp(44px, 7vw, 100px); font-weight: 800; color: #fff;
    letter-spacing: -0.05em; line-height: 0.94; margin: 0 0 48px;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
  }
  .ma-footer-btn {
    display: inline-flex; align-items: center; gap: 10px;
    height: 54px; padding: 0 32px; background: #fff; color: #111;
    border-radius: 100px; font-size: 15px; font-weight: 600;
    text-decoration: none; font-family: inherit; letter-spacing: -0.01em;
    transition: background 0.2s, transform 0.15s;
  }
  .ma-footer-btn:hover  { background: #e5e5e5; }
  .ma-footer-btn:active { transform: scale(0.97); }
  .ma-footer-links {
    display: flex; gap: 32px; flex-wrap: wrap;
    padding-bottom: 48px;
    border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: 40px;
  }
  .ma-footer-link {
    font-size: 15px; color: rgba(255,255,255,0.32); text-decoration: none;
    font-weight: 500; transition: color 0.2s; letter-spacing: -0.01em;
  }
  .ma-footer-link:hover { color: #fff; }
  .ma-footer-copy {
    font-size: 13px; color: rgba(255,255,255,0.18); margin: 0;
  }

  /* ── Responsive ───────────────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .ma-home          { padding: 0 24px; }
    .ma-section-inner { padding: 80px 24px; }
    .ma-timeline::before { display: none; }
    .ma-timeline-item { grid-template-columns: 1fr; gap: 8px; }
    .ma-timeline-left { text-align: left; }
    .ma-timeline-dot  { display: none; }
    .ma-footer-inner  { padding: 80px 24px 60px; }
    .ma-band-quote    { padding-left: 20px; }
  }
`;