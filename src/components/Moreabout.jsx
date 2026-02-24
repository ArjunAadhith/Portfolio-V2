import { useEffect, useRef, useCallback, memo, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";


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
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: false,
        margin: "-8% 0px -8% 0px",
      }}
      transition={{
        duration,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      {children}
    </Tag>
  );
});


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

  const { scrollYProgress } = useScroll({
    target:    ref,
    container: scroller,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const smoothY = useSpring(rawY, { stiffness: 70, damping: 18, mass: 0.6 });

  return (
    <section
      ref={ref}
      className={`ps-root ${className}`}
      style={{ position: "relative", overflow: "hidden", height }}
    >
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
          willChange:         "transform",
        }}
      />

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

  const rawY   = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const smoothY = useSpring(rawY, { stiffness: 70, damping: 18, mass: 0.6 });

  return (
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
   ══════════════════════════════════════════════════════════════════════════ */
const MAHome = memo(function MAHome({ onScrollDown, scroller }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target:    ref,
    container: scroller,
    offset: ["start start", "end start"],
  });
  const rawY   = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const innerY = useSpring(rawY, { stiffness: 70, damping: 18, mass: 0.6 });

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
   ══════════════════════════════════════════════════════════════════════════ */
const MAAbout = memo(function MAAbout({ scroller }) {
  return (
    <section className="ma-about">

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
   SECTION 3  —  EXPERIENCE  (luxury split-card redesign)
   ════════════════════════════════════════════════════════════════════════════ */

const JOBS = [
  {
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Zoho-logo-web.jpg",
    logoBg: "#fff",
    fallback: "ZO",
    role: "UI/UX & Visual Designer",
    company: "ZOHO Corporation",
    periodFull: "Jul — Dec 2025",
    type: "Internship",
    index: "01",
    tags: ["Figma", "UI/UX", "Design Systems", "Visual Design"],
    desc: "Designed intuitive user interfaces and cohesive visual experiences for Zoho's enterprise product suite. Translated complex workflows into elegant, user-centered interfaces in close collaboration with product and engineering teams.",
  },
  {
    logo: "https://unifiedmentor.com/assets/ContactLogoLight-BbrcWEja.svg",
    logoBg: "#fff",
    fallback: "UM",
    role: "Full Stack Web Development",
    company: "Unified Mentors",
    periodFull: "Feb — May 2025",
    type: "Internship",
    index: "02",
    tags: ["React", "Node.js", "MongoDB", "REST API"],
    desc: "Built and shipped full-stack web applications using the MERN stack. Architected responsive front-end experiences and robust back-end services, from database design to deployment.",
  },
  {
    logo: "https://i.tracxn.com/logo/company/gbtechcorp_com_628ffc7b-a30f-4d07-a390-4195467004e3",
    logoBg: "#fff",
    fallback: "GB",
    role: "Java Full Stack Development",
    company: "GB Tech Corp",
    periodFull: "Feb — Mar 2025",
    type: "Internship",
    index: "03",
    tags: ["Java", "Spring Boot", "MySQL", "Angular"],
    desc: "Developed enterprise-grade Java applications using Spring Boot and Angular within an agile team. Delivered RESTful APIs, database schemas, and front-end modules at production quality.",
  },
  {
    logo: "https://nsic.co.in/images/newNS.png",
    logoBg: "#fff",
    fallback: "NS",
    role: "Frontend Web Development",
    company: "NSIC — Govt. of India",
    periodFull: "Feb — Mar 2024",
    type: "Internship",
    index: "04",
    tags: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    desc: "Engineered responsive, accessible web interfaces for national digital initiatives. Delivered cross-browser compatible, performance-optimised code adhering to government-grade accessibility standards.",
  },
];

/* Logo image with fallback to initials */
const CompanyLogo = memo(function CompanyLogo({ src, fallback, logoBg }) {
  const [err, setErr] = useState(false);
  return (
    <div className="exp-logo-wrap" style={{ background: logoBg }}>
      {!err
        ? <img src={src} alt={fallback} className="exp-logo-img" onError={() => setErr(true)} />
        : <span className="exp-logo-fallback">{fallback}</span>
      }
    </div>
  );
});

/* Single experience card — "split panel" style */
const ExperienceCard = memo(function ExperienceCard({ job, i }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="exp-card"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-6% 0px -6% 0px" }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
    >
      {/* ── Top header panel ── */}
      <motion.div
        className="exp-card-header"
        animate={{ backgroundColor: hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)" }}
        transition={{ duration: 0.35 }}
      >
        {/* Index */}
        <span className="exp-card-index">{job.index}</span>

        {/* Logo */}
        <CompanyLogo src={job.logo} fallback={job.fallback} logoBg={job.logoBg} />

        {/* Company + period */}
        <div className="exp-card-header-right">
          <span className="exp-card-company">{job.company}</span>
          <span className="exp-card-period">{job.periodFull}</span>
        </div>

        {/* Type badge */}
        <span className="exp-card-type">{job.type}</span>
      </motion.div>

      {/* ── Bottom body panel — role always visible ── */}
      <div className="exp-card-body">
        <div className="exp-card-body-top">
          <span className="exp-card-role">{job.role}</span>
          {/* Arrow rotates on hover */}
          <motion.div
            className="exp-card-arrow"
            animate={{ rotate: hovered ? 90 : 0, opacity: hovered ? 1 : 0.3 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>

        {/* Hover-reveal description + tags */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <p className="exp-card-desc">{job.desc}</p>
              <div className="exp-card-tags">
                {job.tags.map((t) => (
                  <span key={t} className="exp-card-tag">{t}</span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
});

const MAExperience = memo(function MAExperience({ scroller }) {
  return (
    <section className="ma-exp">
      <div className="ma-exp-wrapper">

        <div className="exp-layout">

          {/* ── LEFT — luxury sticky editorial block ── */}
          <div className="exp-left-col">

            <RevealText>
              <span className="exp-eyebrow">
                <span className="exp-eyebrow-line" />
                Selected Experience
              </span>
            </RevealText>

            <RevealText delay={0.06}>
              <div className="exp-left-numeral" aria-hidden="true">IV</div>
            </RevealText>

            <RevealText delay={0.1}>
              <h2 className="exp-headline">
                Craft.<br />
                <em className="exp-headline-em">Precision.</em><br />
                Legacy.
              </h2>
            </RevealText>

            <RevealText delay={0.16}>
              <p className="exp-left-quote">
                "Every role I've held has been a deliberate step — not just
                employment, but the refinement of a standard I hold myself to."
              </p>
            </RevealText>

            <RevealText delay={0.22}>
              <div className="exp-left-stat">
                <div className="exp-stat-item">
                  <span className="exp-stat-num">4</span>
                  <span className="exp-stat-label">Companies</span>
                </div>
                <div className="exp-stat-divider" />
                <div className="exp-stat-item">
                  <span className="exp-stat-num">2+</span>
                  <span className="exp-stat-label">Years Active</span>
                </div>
                <div className="exp-stat-divider" />
                <div className="exp-stat-item">
                  <span className="exp-stat-num">∞</span>
                  <span className="exp-stat-label">Problems Solved</span>
                </div>
              </div>
            </RevealText>

            <RevealText delay={0.26}>
              <p className="exp-hover-hint">
                <span className="exp-hint-dot" />
                Hover to reveal each story
              </p>
            </RevealText>

          </div>

          {/* ── RIGHT — cards ── */}
          <div className="exp-right-col">
            {JOBS.map((job, i) => (
              <ExperienceCard key={job.index} job={job} i={i} />
            ))}
          </div>

        </div>

      </div>

      {/* Parallax divider strip */}
      <ParallaxSection
        scroller={scroller}
        bgColor="#080808"
        height="130px"
        overlay={0}
        className="ma-exp-strip"
      >
        <RevealText style={{ width: "100%", maxWidth: 1100, padding: "0 72px" }}>
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
   ══════════════════════════════════════════════════════════════════════════ */
export default function MoreAbout({ isOpen, onClose }) {
  const pageRef = useRef(null);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("portfolio:nav", { detail: { visible: !isOpen } })
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
  }, [isOpen]);

  const scrollDown = useCallback(() => {
    pageRef.current?.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  }, []);

  return (
    <>
      <style>{CSS}</style>

      <motion.div
        className="ma-page"
        ref={pageRef}
        animate={{ y: isOpen ? "0%" : "100%" }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!isOpen}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
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
  }

  /* ── Hero ─────────────────────────────────────────────────────────────── */
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
  .ma-img-card {
    width: 100%; border-radius: 20px; overflow: hidden;
  }
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

  /* ════════════════════════════════════════════════════════════════════════
     EXPERIENCE — luxury split-card layout
     ════════════════════════════════════════════════════════════════════════ */
  .ma-exp {
    background: #0A0A0A;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .ma-exp-wrapper {
    max-width: 1240px; margin: 0 auto;
    padding: 130px 72px 110px;
  }

  /* ── Grid: 42% left / 58% right ── */
  .exp-layout {
    display: grid;
    grid-template-columns: 42fr 58fr;
    gap: 0 100px;
    align-items: start;
  }

  /* ════ LEFT COLUMN ════ */
  .exp-left-col {
    position: sticky;
    top: 64px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* Eyebrow with inline rule */
  .exp-eyebrow {
    display: flex; align-items: center; gap: 14px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(255,255,255,0.22);
    margin-bottom: 36px;
  }
  .exp-eyebrow-line {
    display: inline-block; width: 28px; height: 1px;
    background: rgba(255,255,255,0.22); flex-shrink: 0;
  }

  /* Roman numeral — decorative large watermark */
  .exp-left-numeral {
    font-size: clamp(80px, 10vw, 130px); font-weight: 900;
    color: rgba(255,255,255,0.04);
    letter-spacing: -0.04em; line-height: 1;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
    margin-bottom: -20px;
    user-select: none;
  }

  /* Main headline — editorial luxury style */
  .exp-headline {
    font-size: clamp(48px, 5.6vw, 76px); font-weight: 900; color: #fff;
    letter-spacing: -0.05em; line-height: 1.01; margin: 0 0 36px;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
  }
  .exp-headline-em {
    color: rgba(255,255,255,0.22);
    font-style: italic;
    font-weight: 700;
  }

  /* Pull quote */
  .exp-left-quote {
    font-size: 14px; line-height: 1.85;
    color: rgba(255,255,255,0.38); margin: 0 0 40px;
    font-style: italic; font-weight: 400;
    letter-spacing: 0.01em;
    border-left: 1px solid rgba(255,255,255,0.14);
    padding-left: 20px;
    max-width: 320px;
  }

  /* Stats row */
  .exp-left-stat {
    display: flex; align-items: center; gap: 20px;
    margin-bottom: 36px;
  }
  .exp-stat-item {
    display: flex; flex-direction: column; gap: 4px;
  }
  .exp-stat-num {
    font-size: 22px; font-weight: 800; color: #fff;
    letter-spacing: -0.04em; line-height: 1;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
  }
  .exp-stat-label {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.22);
  }
  .exp-stat-divider {
    width: 1px; height: 32px;
    background: rgba(255,255,255,0.1);
    flex-shrink: 0;
  }

  /* Hover hint */
  .exp-hover-hint {
    display: flex; align-items: center; gap: 10px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(255,255,255,0.18); margin: 0;
  }
  .exp-hint-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: rgba(255,255,255,0.32);
    animation: exp-pulse 2.4s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes exp-pulse {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.6); }
  }

  /* ════ RIGHT COLUMN — split cards ════ */
  .exp-right-col {
    display: flex; flex-direction: column; gap: 14px;
  }

  /* Card shell */
  .exp-card {
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    overflow: hidden;
    cursor: default;
  }

  /* ── Header panel (top half of card) ── */
  .exp-card-header {
    display: grid;
    grid-template-columns: 36px 52px 1fr auto;
    gap: 0 14px;
    align-items: center;
    padding: 18px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  /* Index number */
  .exp-card-index {
    font-size: 11px; font-weight: 700;
    color: rgba(255,255,255,0.2);
    letter-spacing: 0.06em;
    font-family: "SF Mono", "Fira Code", monospace;
    font-variant-numeric: tabular-nums;
  }

  /* Logo image wrapper */
  .exp-logo-wrap {
    width: 52px; height: 52px;
    border-radius: 13px;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1);
  }
  .exp-logo-img {
    width: 70%; height: 70%;
    object-fit: contain; display: block;
  }
  .exp-logo-fallback {
    font-size: 13px; font-weight: 900;
    color: #111; letter-spacing: 0.04em;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
  }

  /* Company name + period */
  .exp-card-header-right {
    display: flex; flex-direction: column; gap: 5px; min-width: 0;
  }
  .exp-card-company {
    font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.85);
    letter-spacing: -0.02em; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis;
  }
  .exp-card-period {
    font-size: 12px; color: rgba(255,255,255,0.32);
    font-weight: 500; letter-spacing: 0; 
    font-variant-numeric: tabular-nums;
  }

  /* Type badge */
  .exp-card-type {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 100px; padding: 4px 10px;
    white-space: nowrap; flex-shrink: 0;
  }

  /* ── Body panel (always-visible bottom half) ── */
  .exp-card-body {
    padding: 18px 20px 20px;
  }
  .exp-card-body-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 12px;
  }
  .exp-card-role {
    font-size: clamp(15px, 1.6vw, 18px); font-weight: 700; color: #fff;
    letter-spacing: -0.03em; line-height: 1.25;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
  }
  .exp-card-arrow {
    width: 30px; height: 30px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.5);
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 50%;
    margin-top: 2px;
  }

  /* Hover-reveal description */
  .exp-card-desc {
    font-size: 13.5px; line-height: 1.8;
    color: rgba(255,255,255,0.48); margin: 16px 0 14px;
    font-weight: 400; letter-spacing: -0.005em;
  }
  .exp-card-tags {
    display: flex; flex-wrap: wrap; gap: 6px;
  }
  .exp-card-tag {
    font-size: 10px; font-weight: 700;
    color: rgba(255,255,255,0.35);
    background: rgba(255,255,255,0.055);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 6px; padding: 4px 10px;
    letter-spacing: 0.08em; text-transform: uppercase;
  }

  /* ── Parallax strip ── */
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
  @media (max-width: 1000px) {
    .exp-layout {
      grid-template-columns: 1fr;
      gap: 60px 0;
    }
    .exp-left-col { position: static; }
    .exp-left-quote { max-width: 100%; }
  }

  @media (max-width: 768px) {
    .ma-home          { padding: 0 24px; }
    .ma-section-inner { padding: 80px 24px; }
    .ma-footer-inner  { padding: 80px 24px 60px; }
    .ma-band-quote    { padding-left: 20px; }
    .ma-exp-wrapper   { padding: 72px 24px 60px; }

    .exp-card-header  { grid-template-columns: 28px 44px 1fr; gap: 0 10px; }
    .exp-card-type    { display: none; }
    .exp-logo-wrap    { width: 44px; height: 44px; border-radius: 11px; }
    .exp-card-role    { font-size: 15px; }
  }
`;