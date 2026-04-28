import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const IMAGES = [
  { id: 1,  src: "/case study/SWAYAM/S1.png" },
  { id: 2,  src: "/case study/SWAYAM/S2.png" },
  { id: 3,  src: "/case study/SWAYAM/S3.png" },
  { id: 4,  src: "/case study/SWAYAM/S4.png" },
  { id: 5,  src: "/case study/SWAYAM/S5.png" },
  { id: 6,  src: "/case study/SWAYAM/S6.png" },
  { id: 7,  src: "/case study/SWAYAM/S7.png" },
  { id: 8,  src: "/case study/SWAYAM/S8.png" },
  { id: 9,  src: "/case study/SWAYAM/S9.png" },
  { id: 10, src: "/case study/SWAYAM/S10.png" },
  { id: 11, src: "/case study/SWAYAM/S11.png" },
  { id: 12, src: "/case study/SWAYAM/S12.png" },
  { id: 13, src: "/case study/SWAYAM/S13.png" },
  { id: 14, src: "/case study/SWAYAM/S14.png" },
  { id: 15, src: "/case study/SWAYAM/S15.png" },
  { id: 16, src: "/case study/SWAYAM/S16.png" },
  { id: 17, src: "/case study/SWAYAM/S17.png" },
  { id: 18, src: "/case study/SWAYAM/S18.png" },
  { id: 19, src: "/case study/SWAYAM/S19.png" },
  { id: 20, src: "/case study/SWAYAM/S20.png" },
  { id: 21, src: "/case study/SWAYAM/S21.png" },
  { id: 22, src: "/case study/SWAYAM/S22.png" },
  { id: 23, src: "/case study/SWAYAM/S23.png" },
  { id: 24, src: "/case study/SWAYAM/S24.png" },
  { id: 25, src: "/case study/SWAYAM/S25.png" },
  { id: 26, src: "/case study/SWAYAM/S26.png" },
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
          el.classList.add("swayam-img--visible");
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
      className="swayam-img-wrap"
      ref={wrapRef}
      style={{ "--stagger": `${Math.min(index * 0.05, 0.2)}s` }}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          className="swayam-img"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
        />
      ) : src ? (
        <img
          src={src}
          alt={`Swayam case study image ${index + 1}`}
          className="swayam-img"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ) : (
        <div className="swayam-placeholder">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
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

/* ── Main page ── */
export default function SwayamCaseStudyPage({ isOpen, onClose }) {
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
        className="swayam-page"
        ref={pageRef}
        animate={{ y: isOpen ? "0%" : "100%" }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!isOpen}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <div className="swayam-stack">
          {IMAGES.map((img, i) => (
            <RevealImg key={img.id} src={img.src} index={i} />
          ))}
        </div>

        <div className="swayam-footer">
          <div className="swayam-footer-line" />
          <button className="swayam-back-btn" onClick={onClose}>
            <span className="swayam-back-label">Back to Portfolio</span>
            <span className="swayam-back-arrow">
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
  .swayam-page {
    position: fixed;
    inset: 0;
    z-index: 100000;
    overflow-y: auto;
    overflow-x: hidden;
    background: #ffffff;
    -webkit-font-smoothing: antialiased;
    scroll-behavior: smooth;
  }

  .swayam-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 0;
    padding: 80px 40px 0;
  }

  .swayam-img-wrap {
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
  .swayam-img-wrap.swayam-img--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .swayam-img {
    width: 100%;
    height: auto;
    display: block;
    vertical-align: top;
    user-select: none;
    -webkit-user-drag: none;
  }

  .swayam-placeholder {
    width: 100%;
    aspect-ratio: 16 / 7;
    background: #e2e2e6;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0,0,0,0.22);
  }

  .swayam-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 72px 40px 64px;
    gap: 48px;
  }

  .swayam-footer-line {
    width: 100%;
    max-width: 1100px;
    height: 1px;
    background: rgba(0,0,0,0.1);
  }

  .swayam-back-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0;
    height: 52px;
    padding: 0 10px 0 28px;
    background: transparent;
    color: #1A1A1A;
    border: 1.5px solid #C4C4C4;
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
  .swayam-back-btn::before {
    content: "";
    position: absolute;
    inset: 0;
    background: #111111;
    border-radius: inherit;
    transform: translateY(102%);
    transition: transform 0.46s cubic-bezier(0.16,1,0.3,1);
    z-index: 0;
  }
  .swayam-back-btn:hover::before { transform: translateY(0); }
  .swayam-back-btn:hover { color: #ffffff; border-color: #111111; }
  .swayam-back-btn:active { transform: scale(0.97); }

  .swayam-back-label {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    margin-right: 12px;
  }

  .swayam-back-arrow {
    position: relative;
    z-index: 1;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(0,0,0,0.07);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition:
      background  0.40s cubic-bezier(0.16,1,0.3,1),
      transform   0.22s cubic-bezier(0.22,1,0.36,1);
  }
  .swayam-back-btn:hover .swayam-back-arrow {
    background: rgba(255,255,255,0.15);
    transform: translateX(-2px);
  }

  @media (max-width: 768px) {
    .swayam-stack  { padding: 80px 20px 0; gap: 0; }
    .swayam-footer { padding: 56px 20px 52px; gap: 36px; }
  }
  @media (max-width: 480px) {
    .swayam-stack  { padding: 72px 14px 0; gap: 0; }
    .swayam-footer { padding: 44px 14px 44px; gap: 28px; }
    .swayam-back-btn { height: 50px; font-size: 14px; }
  }
`;