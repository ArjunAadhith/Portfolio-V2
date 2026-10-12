import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ── Theme ── */
const PAGE_BG = "linear-gradient(to bottom, #ccff00 0%, #58ff00 100%)";

/* ── Figma prototype embed ── */
const FIGMA_SRC =
  "https://embed.figma.com/proto/lWsDnP0v31UwMMMaF1Dp24/Pgian?node-id=738-2725&p=f&viewport=251%2C392%2C0.09&scaling=scale-down&content-scaling=fixed&starting-point-node-id=84%3A2&page-id=8%3A2&embed-host=share";
const FIGMA_RATIO = "800 / 450"; /* width / height of your embed */

/*
  Add images in order. Use { type: "figma" } wherever the
  prototype should appear. Move that line up/down to change position.
*/
const ITEMS = [
  { id: 1,  src: "/case study/PGIAN/p1.png" },
  { id: 2,  src: "/case study/PGIAN/p2.png" },
  { id: 3,  src: "/case study/PGIAN/p3.png" },
  { id: 4,  src: "/case study/PGIAN/p4.png" },
  { id: 5,  src: "/case study/PGIAN/p5.png" },
  { id: 6,  src: "/case study/PGIAN/p6.png" },
  { id: 7,  src: "/case study/PGIAN/p7.png" },
  { id: 8,  src: "/case study/PGIAN/p8.png" },
  { id: 9,  src: "/case study/PGIAN/p9.png" },
  { id: 10, src: "/case study/PGIAN/p10.png" },
  { id: 11, src: "/case study/PGIAN/p11.png" },
  { id: 12, src: "/case study/PGIAN/p12.png" },
  { id: 13, src: "/case study/PGIAN/p13.png" },
  { id: 14, src: "/case study/PGIAN/p14.png" },
  { id: 15, src: "/case study/PGIAN/p15.png" },
  { id: 16, src: "/case study/PGIAN/p16.png" },
  { id: 17, src: "/case study/PGIAN/p17.png" },
  { id: 18, src: "/case study/PGIAN/p18.png" },
  { id: 19, src: "/case study/PGIAN/p19.png" },
  { id: 20, src: "/case study/PGIAN/p20.png" },
  { id: 21, src: "/case study/PGIAN/p21.png" },
  { id: 22, src: "/case study/PGIAN/p22.png" },
  { id: 23, src: "/case study/PGIAN/p23.png" },
  { id: 24, src: "/case study/PGIAN/p24.png" },
  { id: 25, src: "/case study/PGIAN/p25.png" },
  { id: 26, src: "/case study/PGIAN/p26.png" },
  { id: 27, src: "/case study/PGIAN/p27.png" },
  { id: 28, src: "/case study/PGIAN/p28.png" },
  { id: 29, src: "/case study/PGIAN/p29.png" },
  { id: 30, src: "/case study/PGIAN/p30.png" },
  { id: 31, src: "/case study/PGIAN/p31.png" },
  { id: 32, src: "/case study/PGIAN/p32.png" },
  { id: 33, src: "/case study/PGIAN/p33.png" },
  { id: 34, src: "/case study/PGIAN/p34.png" },
  { id: 35, src: "/case study/PGIAN/p35.png" },
  { id: 36, src: "/case study/PGIAN/p36.png" },
  { id: 37, src: "/case study/PGIAN/p37.png" },
  { id: 38, src: "/case study/PGIAN/p38.png" },
  { id: 39, src: "/case study/PGIAN/p39.png" },
  { id: 40, src: "/case study/PGIAN/p40.png" },
  { id: 41, src: "/case study/PGIAN/p41.png" },
  { id: 42, src: "/case study/PGIAN/p42.png" },
  { id: 43, src: "/case study/PGIAN/p43.png" },
  { id: 44, src: "/case study/PGIAN/p44.png" },
  { id: 45, src: "/case study/PGIAN/p45.png" },
  { id: 46, src: "/case study/PGIAN/p46.png" },
  { id: 47, src: "/case study/PGIAN/p47.png" },
  { id: 48, src: "/case study/PGIAN/p48.png" },
  { id: 49, src: "/case study/PGIAN/p49.png" },
  { id: 50, src: "/case study/PGIAN/p50.png" },
  { id: 51, src: "/case study/PGIAN/p51.png" },
  { id: 52, src: "/case study/PGIAN/p52.png" },
  { id: 53, src: "/case study/PGIAN/p53.png" },
  { id: 54, type: "figma" },
  { id: 55, src: "/case study/PGIAN/p55.png" },
  { id: 56, src: "/case study/PGIAN/p56.png" },
  { id: 57, src: "/case study/PGIAN/p57.png" },
  { id: 58, src: "/case study/PGIAN/p58.png" },
  { id: 59, src: "/case study/PGIAN/p59.png" },
];

/* ── Scroll-reveal image / video item ── */
function RevealImg({ src, index }) {
  const wrapRef  = useRef(null);
  const videoRef = useRef(null);
  const isVideo  = src?.endsWith(".mp4");

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("pgian-img--visible");
          if (isVideo && videoRef.current) {
            const vid = videoRef.current;
            if (!vid.src) {
              vid.src = src;
              vid.load();
              vid.play().catch(() => {});
            }
          }
          io.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [isVideo, src]);

  return (
    <div
      className="pgian-img-wrap"
      ref={wrapRef}
      style={{ "--stagger": `${Math.min(index * 0.05, 0.2)}s` }}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          className="pgian-img"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
        />
      ) : src ? (
        <img
          src={src}
          alt={`Pgian case study image ${index + 1}`}
          className="pgian-img"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ) : (
        <div className="pgian-placeholder">
          <svg
            width="36" height="36" viewBox="0 0 24 24"
            fill="none" stroke="currentColor"
            strokeWidth="1.3" strokeLinecap="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2.5" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
      )}
    </div>
  );
}

/* ── Scroll-reveal Figma prototype ── */
function RevealFigma({ index, isOpen }) {
  const wrapRef = useRef(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("pgian-img--visible");
          setLoad(true); /* iframe loads only when it scrolls into view */
          io.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "200px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className="pgian-img-wrap pgian-figma-wrap"
      ref={wrapRef}
      style={{
        "--stagger": `${Math.min(index * 0.05, 0.2)}s`,
        aspectRatio: FIGMA_RATIO,
      }}
    >
      {load && (
        <iframe
          className="pgian-figma"
          title="Pgian Figma prototype"
          src={FIGMA_SRC}
          allowFullScreen
          loading="lazy"
          style={{ pointerEvents: isOpen ? "auto" : "none" }}
        />
      )}
    </div>
  );
}

/* ── Main page ── */
export default function PgianCaseStudyPage({ isOpen, onClose }) {
  const pageRef = useRef(null);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* Escape key */
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  /* Scroll to top on open */
  useEffect(() => {
    if (isOpen && pageRef.current) pageRef.current.scrollTop = 0;
  }, [isOpen]);

  /* Raise / lower navbar */
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("portfolio:nav", { detail: { visible: !isOpen } })
    );
  }, [isOpen]);

  /* Forward scroll direction to navbar hide/show */
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

  /* Close on navbar icon click */
  useEffect(() => {
    const fn = () => onClose();
    window.addEventListener("portfolio:closeAbout", fn);
    return () => window.removeEventListener("portfolio:closeAbout", fn);
  }, [onClose]);

  return (
    <>
      <style>{CSS}</style>

      <motion.div
        className="pgian-page"
        ref={pageRef}
        animate={{ y: isOpen ? "0%" : "100%" }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!isOpen}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <div className="pgian-stack">
          {ITEMS.map((item, i) =>
            item.type === "figma" ? (
              <RevealFigma key={item.id} index={i} isOpen={isOpen} />
            ) : (
              <RevealImg key={item.id} src={item.src} index={i} />
            )
          )}
        </div>

        <div className="pgian-footer">
          <div className="pgian-footer-line" />
          <button className="pgian-back-btn" onClick={onClose}>
            <span className="pgian-back-label">Back to Portfolio</span>
            <span className="pgian-back-arrow">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M15 9H3M7 4L2 9l5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </motion.div>
    </>
  );
}

/* ── Styles ── */
const CSS = `
  .pgian-page {
    position: fixed;
    inset: 0;
    z-index: 100000;
    overflow-y: auto;
    overflow-x: hidden;
    background: ${PAGE_BG};
    -webkit-font-smoothing: antialiased;
    scroll-behavior: smooth;
  }

  .pgian-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 0;
    padding: 80px 40px 0;
  }

  /* ── Reveal wrapper ── */
  .pgian-img-wrap {
    width: 100%;
    max-width: 1100px;
    border-radius: 0;
    overflow: hidden;
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity   0.7s cubic-bezier(0.25,0.46,0.45,0.94) var(--stagger, 0s),
      transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94) var(--stagger, 0s);
  }
  .pgian-img-wrap.pgian-img--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .pgian-img {
    width: 100%;
    height: auto;
    display: block;
    vertical-align: top;
    user-select: none;
    -webkit-user-drag: none;
  }

  /* ── Figma prototype ── */
  .pgian-figma-wrap {
    position: relative;
    background: rgba(255,255,255,0.04);
    border-radius: 40px;
  }
  .pgian-figma {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
    border-radius: inherit;
  }

  .pgian-placeholder {
    width: 100%;
    aspect-ratio: 16 / 7;
    background: rgba(255,255,255,0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,0.55);
  }

  .pgian-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 72px 40px 64px;
    gap: 48px;
  }

  .pgian-footer-line {
    width: 100%;
    max-width: 1100px;
    height: 1px;
    background: rgba(10,10,10,0.3);
  }

  .pgian-back-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0;
    height: 52px;
    padding: 0 10px 0 28px;
    background: transparent;
    color: #0a0a0a;
    border: 1px solid #0a0a0a;
    border-radius: 100px;
    font-size: 15px;
    font-weight: 500;
    font-family: -apple-system, "SF Pro Text", BlinkMacSystemFont, sans-serif;
    letter-spacing: -0.01em;
    cursor: pointer;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;
    transition:
      color        0.40s cubic-bezier(0.16,1,0.3,1),
      border-color 0.40s cubic-bezier(0.16,1,0.3,1);
  }
  .pgian-back-btn::before {
    content: "";
    position: absolute;
    inset: 0;
    background: #0a0a0a;
    border-radius: inherit;
    transform: translateY(102%);
    transition: transform 0.46s cubic-bezier(0.16,1,0.3,1);
    z-index: 0;
  }
  .pgian-back-btn:hover::before { transform: translateY(0); }
  .pgian-back-btn:hover { color: #ffffff; border-color: #0a0a0a; }
  .pgian-back-btn:active { transform: scale(0.97); }

  .pgian-back-label {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    margin-right: 12px;
  }

  .pgian-back-arrow {
    position: relative;
    z-index: 1;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(10,10,10,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition:
      background  0.40s cubic-bezier(0.16,1,0.3,1),
      transform   0.22s cubic-bezier(0.22,1,0.36,1);
  }
  .pgian-back-btn:hover .pgian-back-arrow {
    background: rgba(255,255,255,0.18);
    transform: translateX(-2px);
  }

  @media (max-width: 768px) {
    .pgian-stack  { padding: 80px 20px 0; gap: 0; }
    .pgian-footer { padding: 56px 20px 52px; gap: 36px; }
  }
  @media (max-width: 480px) {
    .pgian-stack  { padding: 72px 14px 0; gap: 0; }
    .pgian-footer { padding: 44px 14px 44px; gap: 28px; }
    .pgian-back-btn { height: 50px; font-size: 14px; }
  }
`;