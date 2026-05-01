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
  delay = 0,
  y = 40,
  duration = 0.8,
  as = "div",
  className = "",
  style = {},
}) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-8% 0px -8% 0px" }}
      transition={{ duration, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Tag>
  );
});

export const ParallaxSection = memo(function ParallaxSection({
  scroller,
  imageSrc,
  bgColor = "#0E0E0E",
  children,
  className = "",
  height = "auto",
  overlay = 0.55,
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    container: scroller,
    offset: ["start end", "end start"],
  });
  const rawY   = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
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
          y: smoothY,
          position: "absolute",
          top: "-15%", left: 0, right: 0, bottom: "-15%",
          backgroundImage: imageSrc ? `url(${imageSrc})` : undefined,
          backgroundColor: bgColor,
          backgroundSize: "cover",
          backgroundPosition: "center",
          willChange: "transform",
        }}
      />
      {overlay > 0 && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            background: `rgba(14,14,14,${overlay})`, zIndex: 1,
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
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
  style = {},
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    container: scroller,
    offset: ["start end", "end start"],
  });
  const rawY   = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const smoothY = useSpring(rawY, { stiffness: 70, damping: 18, mass: 0.6 });

  return (
    <div
      ref={ref}
      className={className}
      style={{ overflow: "hidden", borderRadius: "inherit", ...style }}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{
          y: smoothY,
          display: "block",
          width: "100%",
          height: "auto",
          willChange: "transform",
        }}
      />
    </div>
  );
});

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 1 — HERO
   ══════════════════════════════════════════════════════════════════════════ */
const MAHome = memo(function MAHome({ onScrollDown, scroller }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, container: scroller, offset: ["start start", "end start"] });
  const rawY   = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const innerY  = useSpring(rawY, { stiffness: 70, damping: 18, mass: 0.6 });

  const ctnr = { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.28 } } };
  const itm  = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <section ref={ref} className="ma-home">
      <motion.div className="ma-home-inner" style={{ y: innerY }}>
        <motion.div variants={ctnr} initial="hidden" animate="show">
          <motion.div variants={itm} className="ma-home-tag">About Me &amp; My Interests</motion.div>
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
              <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>
      <div className="ma-home-bg-name" aria-hidden="true">AA</div>
    </section>
  );
});

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 2 — ABOUT
   ══════════════════════════════════════════════════════════════════════════ */
const MAAbout = memo(function MAAbout({ scroller }) {
  return (
    <section className="ma-about">
      <div className="ma-section-inner">
        <RevealText>
          <h2 className="ma-about-heading">
            Designing experiences<em className="ma-italic"> that feel right.</em>
          </h2>
        </RevealText>

        <RevealText delay={0.07}>
          <p className="ma-about-para">
            I'm Arjun Aadhith, a multi-disciplinary designer and developer crafting
            thoughtful digital experiences across products, creative websites, and scalable systems.
          </p>
        </RevealText>

        <RevealText delay={0.12}>
          <p className="ma-about-para">
            My work sits at the intersection of design and technology — where aesthetics meet
            usability and ideas transform into functional realities. I specialize in UI/UX design,
            graphic design, product design, visual design, illustration, and branding.
          </p>
        </RevealText>

        <RevealText delay={0.1}>
          <div className="ma-img-card">
            <ParallaxImage scroller={scroller} src="/About pic.png" alt="Arjun Aadhith" />
          </div>
        </RevealText>

        <RevealText delay={0.07}>
          <p className="ma-about-para">
            Beyond design, I bring concepts to life through development, ensuring every interaction
            feels seamless and every system performs efficiently. I approach each project with clarity,
            structure, and intent, focusing on solving real problems for real users.
          </p>
        </RevealText>

        <RevealText delay={0.1}>
          <p className="ma-about-para">
            For me, great design is not decoration. It is communication, precision, and impact.
            Every product I craft is built to be intuitive, elegant, and meaningful.
          </p>
        </RevealText>
      </div>

      <ParallaxSection scroller={scroller} bgColor="#111111" height="200px" overlay={0} className="ma-about-band">
        <RevealText style={{ width: "100%", maxWidth: 860, padding: "0 48px" }}>
          <blockquote className="ma-band-quote">"Design is communication, precision, and impact."</blockquote>
        </RevealText>
      </ParallaxSection>
    </section>
  );
});

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 3 — EXPERIENCE
   ══════════════════════════════════════════════════════════════════════════ */
const JOBS = [
  {
    logo:"https://yt3.googleusercontent.com/TRxQ1w3ovSWYSGEly2tQKIeMjdKp73U7F87w3jVfqH9n1LUXf8rdk7w-c4OJFMStP-BBYBlk8Qg=s900-c-k-c0x00ffffff-no-rj",
    logoBg: "#fff", fallback: "EMC",
    role: "UI/UX Designer", company: "Error Makes Clever",
    periodFull: "March - April 2026", type: "Internship", index: "01",
    tags: ["Figma", "UI/UX", "Web Design","User Behavior Analysis", "Usability Testing"],
    desc: "Designed intuitive and visually engaging user interfaces for web platforms, focusing on enhancing usability and user experience. Revamped existing websites by transforming complex user flows into seamless, user-centered designs, supported by user behavior analysis and UX research.",
  },
  {
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Zoho-logo-web.jpg",
    logoBg: "#fff", fallback: "ZO",
    role: "UI/UX & Visual Designer", company: "ZOHO Corporation",
    periodFull: "Jul - Dec 2025", type: "Internship", index: "02",
    tags: ["Figma", "UI/UX", "Design Systems", "Visual Design"],
    desc: "Designed intuitive user interfaces and cohesive visual experiences for Zoho's enterprise product suite. Translated complex workflows into elegant, user-centered interfaces in close collaboration with product and engineering teams.",
  },
  {
    logo: "https://unifiedmentor.com/assets/ContactLogoLight-BbrcWEja.svg",
    logoBg: "#fff", fallback: "UM",
    role: "Full Stack Web Development", company: "Unified Mentors",
    periodFull: "Feb - May 2025", type: "Internship", index: "03",
    tags: ["React", "Node.js", "MongoDB", "REST API"],
    desc: "Built and shipped full-stack web applications using the MERN stack. Architected responsive front-end experiences and robust back-end services, from database design to deployment.",
  },
  {
    logo: "https://i.tracxn.com/logo/company/gbtechcorp_com_628ffc7b-a30f-4d07-a390-4195467004e3",
    logoBg: "#fff", fallback: "GB",
    role: "Java Full Stack Development", company: "GB Tech Corp",
    periodFull: "Feb - Mar 2025", type: "Internship", index: "04",
    tags: ["Java", "Spring Boot", "MySQL", "Angular"],
    desc: "Developed enterprise-grade Java applications using Spring Boot and Angular within an agile team. Delivered RESTful APIs, database schemas, and front-end modules at production quality.",
  },
  {
    logo: "https://nsic.co.in/images/newNS.png",
    logoBg: "#fff", fallback: "NS",
    role: "Frontend Web Development", company: "NSIC — Govt. of India",
    periodFull: "Feb - Mar 2024", type: "Internship", index: "05",
    tags: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    desc: "Engineered responsive, accessible web interfaces for national digital initiatives. Delivered cross-browser compatible, performance-optimised code adhering to government-grade accessibility standards.",
  },
];

const CompanyLogo = memo(function CompanyLogo({ src, fallback, logoBg }) {
  const [err, setErr] = useState(false);
  return (
    <div className="exp-logo-wrap" style={{ background: logoBg }}>
      {!err
        ? <img src={src} alt={fallback} className="exp-logo-img" onError={() => setErr(true)} />
        : <span className="exp-logo-fallback">{fallback}</span>}
    </div>
  );
});

/* ─── ExperienceRow ───────────────────────────────────────────────────────────
   Click/tap always toggles the detail panel (works on both mobile & desktop).
   On desktop, mouse-hover also opens it (via CSS :hover on the card).
   No device-detection needed — this approach is universally reliable.
   ─────────────────────────────────────────────────────────────────────────── */
const ExperienceRow = memo(function ExperienceRow({ job, i }) {
  const [expanded, setExpanded] = useState(false);

  // Click/tap always toggles — no touch-detection, no guard conditions
  const handleClick = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  // Framer Motion hover only fires on real pointer devices (not touch)
  // so hovered stays false on mobile — expanded drives everything there
  const [hovered, setHovered] = useState(false);
  const isOpen = hovered || expanded;

  return (
    <motion.div
      className={`exp-row ${isOpen ? "exp-row--hovered" : ""} exp-row--clickable`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={handleClick}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-6% 0px -6% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
    >
      <div className="exp-row-main">
        <CompanyLogo src={job.logo} fallback={job.fallback} logoBg={job.logoBg} />
        <div className="exp-row-text">
          <span className="exp-row-role">{job.role}</span>
          <span className="exp-row-company">
            {job.company}<span className="exp-row-dot"> · </span>{job.type}
          </span>
          {/* shown only on mobile, below company name */}
          <span className="exp-row-date exp-row-date--mobile">{job.periodFull}</span>
        </div>
        <div className="exp-row-right">
          {/* hidden on mobile, shown on desktop */}
          <span className="exp-row-date exp-row-date--desktop">{job.periodFull}</span>
          <motion.span
            className="exp-row-chevron"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="exp-row-detail">
              <p className="exp-row-desc">{job.desc}</p>
              <div className="exp-row-tags">
                {job.tags.map((t) => <span key={t} className="exp-row-tag">{t}</span>)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

const MAExperience = memo(function MAExperience({ scroller }) {
  return (
    <section className="ma-exp">
      <div className="ma-exp-header">
        <RevealText><p className="exp-header-script">companies i worked for</p></RevealText>
        <RevealText delay={0.07}><h2 className="exp-header-big">EXPERIENCE</h2></RevealText>
      </div>

      <div className="exp-list-wrapper">
        {/* ── Hint text removed ── */}
        <div className="exp-list">
          {JOBS.map((job, i) => <ExperienceRow key={job.index} job={job} i={i} />)}
        </div>
      </div>

      <ParallaxSection scroller={scroller} bgColor="#080808" height="130px" overlay={0} className="ma-exp-strip">
        <RevealText style={{ width: "100%", maxWidth: 1100, padding: "0 48px" }}>
          <p className="ma-strip-text">Every project is a new problem worth solving.</p>
        </RevealText>
      </ParallaxSection>
    </section>
  );
});

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 4 — BEYOND DESIGN
   ══════════════════════════════════════════════════════════════════════════ */
const BEYOND_IMAGES = [
  { src: "/Hobbies/Anime.jpg",       w: 220, h: 280 },
  { src: "/Hobbies/draw.jpg",        w: 190, h: 250 },
  { src: "/Hobbies/edit.jpg",        w: 240, h: 180 },
  { src: "/Hobbies/guitar.jpg",      w: 200, h: 260 },
  { src: "/Hobbies/Play.jpg",        w: 230, h: 190 },
  { src: "/Hobbies/song.jpg",        w: 190, h: 260 },
  { src: "/Hobbies/calisthenics.jpg",w: 240, h: 200 },
  { src: "/Hobbies/cycle.jpg",       w: 200, h: 270 },
];
const ROTATIONS = [-12, 8, -6, 14, -9, 11, -4, 7, -13, 5];

const MABeyondDesign = memo(function MABeyondDesign() {
  const sectionRef  = useRef(null);
  const [imgs, setImgs]       = useState([]);
  const [isTouch, setIsTouch] = useState(false);
  const counterRef  = useRef(0);
  const lastPos     = useRef({ x: -999, y: -999 });
  const lastTime    = useRef(0);
  const imgIndexRef = useRef(0);

  useEffect(() => { setIsTouch(window.matchMedia("(pointer: coarse)").matches); }, []);

  const handleMouseMove = useCallback((e) => {
    const now = Date.now();
    if (now - lastTime.current < 160) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const dx = x - lastPos.current.x, dy = y - lastPos.current.y;
    if (Math.sqrt(dx * dx + dy * dy) < 90) return;
    lastPos.current = { x, y };
    lastTime.current = now;
    const id  = counterRef.current++;
    const idx = imgIndexRef.current % BEYOND_IMAGES.length;
    imgIndexRef.current++;
    const cfg = BEYOND_IMAGES[idx];
    const rot = ROTATIONS[id % ROTATIONS.length];
    setImgs((prev) => [...prev.slice(-9), { id, x, y, ...cfg, rot }]);
    setTimeout(() => setImgs((prev) => prev.filter((i) => i.id !== id)), 1800);
  }, []);

  return (
    <section className="ma-beyond" ref={sectionRef} onMouseMove={handleMouseMove}>
      <AnimatePresence>
        {imgs.map((img, stackIndex) => (
          <motion.div
            key={img.id}
            className="ma-beyond-img"
            style={{ left: img.x, top: img.y, width: img.w, height: img.h, zIndex: stackIndex + 1 }}
            initial={{ opacity: 0, scale: 0.55, rotate: img.rot - 8, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1,    rotate: img.rot,     x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.88, y: "-60%", transition: { duration: 0.5, ease: "easeIn" } }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={img.src} alt="" draggable={false} />
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="ma-beyond-center" aria-label="Beyond Design">
        <RevealText>
          <h2 className="ma-beyond-headline">
            <span className="ma-beyond-line">Beyond</span>
            <span className="ma-beyond-line ma-beyond-stroke">Design</span>
          </h2>
        </RevealText>
        <RevealText delay={0.14}>
          <p className="ma-beyond-hint">
            <span className="ma-beyond-hint-dot" />
            {isTouch ? "Tap to explore" : "Move your cursor to explore"}
          </p>
        </RevealText>
      </div>
      <div className="ma-beyond-grain" aria-hidden="true" />
    </section>
  );
});

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 5 — BEYOND CONTENT
   ══════════════════════════════════════════════════════════════════════════ */
const MABeyondContent = memo(function MABeyondContent() {
  return (
    <section className="ma-beyond-content-sec">
      <div className="ma-beyond-content-inner">
        <RevealText>
          <span className="ma-bc-eyebrow"><span className="ma-bc-eyebrow-line" />My Hobbies</span>
        </RevealText>
        <RevealText delay={0.08}>
          <p className="ma-bc-para">
            Beyond my profession, I find deep connection and balance in the things I genuinely love.
            Playing the guitar gives me a sense of rhythm and emotional clarity. I enjoy spending time
            in solitude, cycling long distances, exploring new places, and expressing myself through
            drawing. These moments are not just hobbies — they are personal spaces where I reset,
            reflect, and recharge.
          </p>
        </RevealText>
        <RevealText delay={0.1}>
          <p className="ma-bc-para">
            I also enjoy gaming, listening to music, and constantly learning new skills. Learning
            excites me, but applying what I learn in real-time gives me even greater satisfaction.
            Whether it's experimenting with new ideas or refining small details, I value growth
            through practical execution.
          </p>
        </RevealText>
        <RevealText delay={0.12}>
          <p className="ma-bc-para ma-bc-para--last">
            All these experiences contribute directly to my creative thinking. They help me manage
            stress, think independently, and approach problems with a fresh perspective. This balance
            between passion and practice is what continuously fuels my creativity and drives me to
            create with intention and originality.
          </p>
        </RevealText>
      </div>
    </section>
  );
});

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 6 — FOOTER
   ══════════════════════════════════════════════════════════════════════════ */
const MAFooter = memo(function MAFooter({ onGetInTouch }) {
  const [hovered, setHovered] = useState(false);
  return (
    <footer className="ma-footer">
      <div className="ma-footer-topline" aria-hidden="true" />
      <div className="ma-footer-watermark" aria-hidden="true">WORK</div>
      <div className="ma-footer-body">
        <RevealText>
          <div className="ma-footer-eyebrow-row">
            <span className="ma-footer-eyebrow">
              <span className="ma-footer-eyebrow-dot" />Open to new projects
            </span>
            <span className="ma-footer-year">2026</span>
          </div>
        </RevealText>
        <RevealText delay={0.06}>
          <h2 className="ma-footer-big">
            <span className="ma-footer-big-line">Let's build</span>
            <span className="ma-footer-big-line ma-footer-big-italic">something</span>
            <span className="ma-footer-big-line">great.</span>
          </h2>
        </RevealText>
        <RevealText delay={0.14}>
          <button
            className={`ma-footer-cta-btn ${hovered ? "is-hovered" : ""}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onGetInTouch}
            aria-label="Get in touch"
          >
            <span className="ma-footer-cta-label">Get in touch</span>
            <span className="ma-footer-cta-arrow">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </RevealText>
      </div>
      <div className="ma-footer-bottom">
        <span className="ma-footer-copy">© 2026 Arjun Aadhith</span>
        <span className="ma-footer-made">Designed &amp; Built by Arjun</span>
      </div>
    </footer>
  );
});

/* ════════════════════════════════════════════════════════════════════════════
   ROOT EXPORT
   ══════════════════════════════════════════════════════════════════════════ */
export default function MoreAbout({ isOpen, onClose }) {
  const pageRef = useRef(null);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("portfolio:nav", { detail: { visible: !isOpen } }));
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
        const currentY = el.scrollTop;
        window.dispatchEvent(new CustomEvent("portfolio:aboutScroll", {
          detail: { direction: currentY > lastY ? "down" : "up", scrollTop: currentY },
        }));
        lastY = currentY;
        ticking = false;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isOpen]);

  const scrollDown = useCallback(() => {
    pageRef.current?.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  }, []);

  const handleGetInTouch = useCallback(() => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 760);
  }, [onClose]);

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
          <MAHome onScrollDown={scrollDown} scroller={pageRef} />
          <MAAbout scroller={pageRef} />
          <MAExperience scroller={pageRef} />
          <MABeyondDesign />
          <MABeyondContent />
          <MAFooter onGetInTouch={handleGetInTouch} />
        </div>
      </motion.div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   STYLES
   ══════════════════════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

  /* ── Shell ── */
  .ma-page {
    position: fixed; inset: 0; z-index: 100000;
    overflow-y: auto; overflow-x: hidden;
    background: #0E0E0E;
    font-family: -apple-system, "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    scroll-behavior: smooth;
  }

  /* ── Hero ── */
  .ma-home {
    position: relative; height: 100vh;
    display: flex; align-items: center;
    padding: 0 48px; overflow: hidden; background: #0E0E0E;
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
  .ma-home-sub { font-size: 15px; color: rgba(255,255,255,0.4); letter-spacing: 0.02em; margin: 0 0 64px; font-weight: 400; }
  .ma-home-scroll {
    display: inline-flex; align-items: center; gap: 8px; font-size: 13px;
    color: rgba(255,255,255,0.35); cursor: pointer; font-weight: 500;
    letter-spacing: 0.04em; text-transform: uppercase;
    background: none; border: none; padding: 0; font-family: inherit; transition: color 0.2s;
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

  /* ── Shared layout ── */
  .ma-section-inner {
    max-width: 860px; margin: 0 auto; padding: 120px 48px;
    display: flex; flex-direction: column; gap: 32px;
  }

  /* ── About ── */
  .ma-about { background: #141414; border-top: 1px solid rgba(255,255,255,0.06); }
  .ma-about-heading {
    font-size: clamp(40px, 5.5vw, 72px); font-weight: 700; color: #fff;
    line-height: 1.08; letter-spacing: -0.035em; margin: 0;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
  }
  .ma-italic { color: rgba(255,255,255,0.38); font-style: italic; }
  .ma-about-para {
    font-size: clamp(17px, 2vw, 22px); line-height: 1.82;
    color: rgba(255,255,255,0.58); margin: 0; font-weight: 400; letter-spacing: -0.01em;
  }
  .ma-img-card {
    width: 100%;
    border-radius: 20px;
    overflow: hidden;
  }
  .ma-about-band { border-top: 1px solid rgba(255,255,255,0.05); }
  .ma-band-quote {
    font-size: clamp(18px, 2.8vw, 30px); font-weight: 600;
    color: rgba(255,255,255,0.5); font-style: italic; letter-spacing: -0.02em; margin: 0;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
    line-height: 1.45; border-left: 2px solid rgba(255,255,255,0.2);
    padding-left: 24px; display: block;
  }

  /* ══════════════════════════════════════════════════════════════════════
     EXPERIENCE
     ══════════════════════════════════════════════════════════════════════ */
  .ma-exp { background: #0A0A0A; border-top: 1px solid rgba(255,255,255,0.06); }

  .ma-exp-header {
    text-align: center;
    padding: 100px 24px 72px;
    position: relative;
    overflow: hidden;
  }
  .exp-header-script {
    font-family: 'Great Vibes', cursive;
    font-size: clamp(18px, 4.5vw, 58px);
    color: #c0392b;
    margin: 0 0 4px;
    font-weight: 400;
    line-height: 1.25;
    letter-spacing: 0.02em;
  }
  .exp-header-big {
    font-size: clamp(32px, 11vw, 120px);
    font-weight: 900;
    color: #fff;
    letter-spacing: -0.04em;
    line-height: 0.9;
    margin: 0;
    font-family: -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif;
    text-shadow: 0 8px 80px rgba(0,0,0,0.55);
    max-width: 100%;
  }

  /* List */
  .exp-list-wrapper { max-width: 1100px; margin: 0 auto; padding: 0 48px 100px; }
  .exp-list { display: flex; flex-direction: column; gap: 12px; }

  /* Row card */
  .exp-row {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px; overflow: hidden; cursor: default;
    transition: border-color 0.3s ease, background 0.3s ease;
  }
  /* Always pointer so tapping feels intentional on mobile */
  .exp-row--clickable { cursor: pointer; }
  .exp-row--hovered { background: rgba(255,255,255,0.055); border-color: rgba(255,255,255,0.15); }

  .exp-row-main { display: flex; align-items: center; gap: 18px; padding: 20px 24px; }

  .exp-logo-wrap {
    width: 52px; height: 52px; border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1);
  }
  .exp-logo-img { width: 70%; height: 70%; object-fit: contain; display: block; }
  .exp-logo-fallback {
    font-size: 13px; font-weight: 900; color: #111; letter-spacing: 0.04em;
    font-family: -apple-system,"SF Pro Display",BlinkMacSystemFont,sans-serif;
  }

  .exp-row-text { flex: 1; display: flex; flex-direction: column; gap: 5px; min-width: 0; }
  .exp-row-role {
    font-size: clamp(14px, 1.7vw, 19px); font-weight: 700; color: #fff;
    letter-spacing: -0.03em; line-height: 1.2;
    font-family: -apple-system,"SF Pro Display",BlinkMacSystemFont,sans-serif;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .exp-row-company {
    font-size: 13px; color: rgba(255,255,255,0.38); font-weight: 400;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .exp-row-dot { opacity: 0.45; margin: 0 2px; }

  .exp-row-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; margin-left: auto; }
  .exp-row-date { font-size: 13px; color: rgba(255,255,255,0.28); font-variant-numeric: tabular-nums; white-space: nowrap; letter-spacing: 0.01em; }
  .exp-row-date--mobile { display: none; }   /* hidden on desktop */
  .exp-row-date--desktop { display: inline; } /* visible on desktop */
  .exp-row-chevron {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.45); flex-shrink: 0;
  }

  .exp-row-detail { padding: 0 24px 20px calc(24px + 52px + 18px); }
  .exp-row-desc {
    font-size: 13.5px; line-height: 1.82; color: rgba(255,255,255,0.46);
    margin: 0 0 14px; font-weight: 400; letter-spacing: -0.005em; max-width: 680px;
  }
  .exp-row-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .exp-row-tag {
    font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.35);
    background: rgba(255,255,255,0.055); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 6px; padding: 4px 10px; letter-spacing: 0.08em; text-transform: uppercase;
  }

  .ma-exp-strip { border-top: 1px solid rgba(255,255,255,0.04); }
  .ma-strip-text { font-size: clamp(13px, 1.6vw, 17px); color: rgba(255,255,255,0.22); font-style: italic; margin: 0; letter-spacing: 0.02em; display: block; border-left: 1px solid rgba(255,255,255,0.12); padding-left: 20px; }

  /* ── Beyond Design ── */
  .ma-beyond { position: relative; width: 100%; height: 100vh; min-height: 600px; background: #000; border-top: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: crosshair; user-select: none; }
  .ma-beyond-img { position: absolute; pointer-events: none; border-radius: 14px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06); transform-origin: center center; will-change: transform, opacity; }
  .ma-beyond-img img { display: block; width: 100%; height: 100%; object-fit: cover; pointer-events: none; -webkit-user-drag: none; }
  .ma-beyond-center { position: relative; z-index: 20; text-align: center; pointer-events: none; display: flex; flex-direction: column; align-items: center; gap: 32px; }
  .ma-beyond-headline { font-size: clamp(72px, 13vw, 180px); font-weight: 900; letter-spacing: -0.055em; line-height: 0.92; font-family: -apple-system,"SF Pro Display",BlinkMacSystemFont,sans-serif; margin: 0; display: flex; flex-direction: column; align-items: center; }
  .ma-beyond-line   { display: block; color: #EDE8E0; letter-spacing: -0.055em; }
  .ma-beyond-stroke { color: transparent; -webkit-text-stroke: 2px rgba(237,232,224,0.55); letter-spacing: -0.045em; }
  .ma-beyond-hint { display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.2); margin: 0; }
  .ma-beyond-hint-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(237,232,224,0.5); animation: bd-pulse 2.8s ease-in-out infinite; flex-shrink: 0; }
  @keyframes bd-pulse { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 1; transform: scale(1.7); } }
  .ma-beyond-grain { position: absolute; inset: 0; z-index: 10; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E"); opacity: 0.4; mix-blend-mode: overlay; }

  /* ── Beyond Content ── */
  .ma-beyond-content-sec { background: #000; border-top: 1px solid rgba(255,255,255,0.05); }
  .ma-beyond-content-inner { max-width: 820px; margin: 0 auto; padding: 110px 48px 0; display: flex; flex-direction: column; gap: 0; }
  .ma-bc-eyebrow { display: flex; align-items: center; gap: 14px; font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.2); margin-bottom: 56px; }
  .ma-bc-eyebrow-line { display: inline-block; width: 28px; height: 1px; background: rgba(255,255,255,0.2); flex-shrink: 0; }
  .ma-bc-para { font-size: clamp(17px, 1.9vw, 21px); line-height: 1.9; color: rgba(237,232,224,0.52); margin: 0 0 30px; font-weight: 400; letter-spacing: -0.008em; }
  .ma-bc-para:first-of-type { color: rgba(237,232,224,0.72); font-size: clamp(19px, 2.1vw, 24px); font-weight: 500; }
  .ma-bc-para--last { margin-bottom: 120px; }

  /* ── Footer ── */
  .ma-footer { position: relative; background: #050505; overflow: hidden; padding: 0 72px; min-height: 88vh; display: flex; flex-direction: column; justify-content: space-between; }
  .ma-footer-topline { width: 100%; height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 30%, rgba(255,255,255,0.18) 70%, transparent 100%); }
  .ma-footer-watermark { position: absolute; bottom: -0.12em; right: -0.04em; font-size: clamp(200px, 32vw, 480px); font-weight: 900; letter-spacing: -0.06em; line-height: 1; color: rgba(255,255,255,0.028); font-family: -apple-system,"SF Pro Display",BlinkMacSystemFont,sans-serif; pointer-events: none; user-select: none; z-index: 0; }
  .ma-footer-body { position: relative; z-index: 1; padding: 80px 0 60px; max-width: 1100px; width: 100%; }
  .ma-footer-eyebrow-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 52px; }
  .ma-footer-eyebrow { display: flex; align-items: center; gap: 10px; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.28); }
  .ma-footer-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 0 3px rgba(74,222,128,0.18); animation: dot-breathe 2.6s ease-in-out infinite; flex-shrink: 0; }
  @keyframes dot-breathe { 0%, 100% { box-shadow: 0 0 0 3px rgba(74,222,128,0.18); } 50% { box-shadow: 0 0 0 7px rgba(74,222,128,0.06); } }
  .ma-footer-year { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.16); letter-spacing: 0.1em; font-variant-numeric: tabular-nums; }
  .ma-footer-big { font-size: clamp(60px, 10.5vw, 148px); font-weight: 900; letter-spacing: -0.05em; line-height: 0.94; margin: 0 0 64px; font-family: -apple-system,"SF Pro Display",BlinkMacSystemFont,sans-serif; display: flex; flex-direction: column; gap: 0; }
  .ma-footer-big-line { display: block; color: #ffffff; }
  .ma-footer-big-italic { color: rgba(255,255,255,0.28); font-style: italic; font-weight: 700; }
  .ma-footer-cta-btn { display: inline-flex; align-items: center; gap: 0; height: 60px; padding: 0 8px 0 32px; background: #fff; color: #111; border: none; border-radius: 100px; font-size: 15px; font-weight: 700; font-family: inherit; letter-spacing: -0.01em; cursor: pointer; transition: background 0.22s, transform 0.18s; overflow: hidden; }
  .ma-footer-cta-btn:hover  { background: #f0f0f0; transform: translateY(-2px); }
  .ma-footer-cta-btn:active { transform: scale(0.97); }
  .ma-footer-cta-label { flex-shrink: 0; margin-right: 16px; }
  .ma-footer-cta-arrow { width: 44px; height: 44px; border-radius: 50%; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform 0.22s; }
  .ma-footer-cta-btn:hover .ma-footer-cta-arrow { transform: translateX(3px); }
  .ma-footer-bottom { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; padding: 28px 0 40px; border-top: 1px solid rgba(255,255,255,0.07); }
  .ma-footer-copy { font-size: 13px; color: rgba(255,255,255,0.2); font-weight: 400; letter-spacing: 0.01em; }
  .ma-footer-made { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.12); }

  /* ══════════════════════════════════════════════════════════════════════
     RESPONSIVE
     ══════════════════════════════════════════════════════════════════════ */

  /* Tablet ≤ 900px */
  @media (max-width: 900px) {
    .exp-list-wrapper { padding: 0 32px 80px; }
    .exp-row-main     { padding: 18px 20px; gap: 14px; }
    .exp-row-detail   { padding: 0 20px 20px calc(20px + 52px + 14px); }
  }

  /* Mobile ≤ 768px */
  @media (max-width: 768px) {
    .ma-home          { padding: 0 24px; }
    .ma-section-inner { padding: 80px 24px; }
    .ma-band-quote    { padding-left: 20px; }

    .ma-exp-header    { padding: 64px 20px 48px; }
    .exp-list-wrapper { padding: 0 20px 72px; }
    .exp-list         { gap: 10px; }
    .exp-row-main     { padding: 16px 18px; gap: 12px; }
    .exp-row-date--mobile { display: block; }   /* visible below company on mobile */
    .exp-row-date--desktop { display: none; }    /* hidden on mobile */
    .exp-logo-wrap    { width: 44px; height: 44px; border-radius: 11px; }
    .exp-row-role     { font-size: 15px; }
    .exp-row-detail   { padding: 0 18px 18px calc(18px + 44px + 12px); }
    .exp-row-desc     { font-size: 13px; }

    .ma-beyond        { height: 80vh; min-height: 480px; }
    .ma-beyond-content-inner { padding: 80px 24px 0; }
    .ma-bc-para       { margin-bottom: 52px; }
    .ma-bc-para--last { margin-bottom: 80px; }

    .ma-footer        { padding: 0 24px; min-height: auto; }
    .ma-footer-body   { padding: 60px 0 48px; }
    .ma-footer-big    { font-size: clamp(48px, 12vw, 80px); margin-bottom: 48px; }
    .ma-footer-watermark { font-size: clamp(140px, 40vw, 260px); }
    .ma-footer-bottom { padding: 24px 0 32px; }
    .ma-footer-made   { display: none; }
    .ma-strip-text    { font-size: 13px; }
  }

  /* Small mobile ≤ 480px */
  @media (max-width: 480px) {
    .ma-exp-header     { padding: 52px 16px 40px; }
    .exp-header-script { font-size: clamp(16px, 5vw, 26px); }
    .exp-header-big    { letter-spacing: -0.048em; }

    .exp-list-wrapper  { padding: 0 16px 60px; }
    .exp-list          { gap: 8px; }
    .exp-row-main      { padding: 14px 14px; gap: 10px; }
    .exp-logo-wrap     { width: 40px; height: 40px; border-radius: 10px; }
    .exp-row-role      { font-size: 14px; }
    .exp-row-company   { font-size: 11px; }
    .exp-row-chevron   { width: 24px; height: 24px; }
    .exp-row-detail    { padding: 0 14px 16px calc(14px + 40px + 10px); }

    .ma-beyond-stroke  { -webkit-text-stroke-width: 1.5px; }
    .ma-footer-big     { font-size: clamp(40px, 13vw, 64px); }
  }

  /* Very small ≤ 360px */
  @media (max-width: 360px) {
    .ma-exp-header     { padding: 44px 12px 36px; }
    .exp-header-script { font-size: clamp(14px, 4.5vw, 20px); }
    .exp-list-wrapper  { padding: 0 12px 48px; }
    .exp-row-main      { padding: 12px 12px; gap: 8px; }
    .exp-row-detail    { padding: 0 12px 14px calc(12px + 40px + 8px); }
  }
`;