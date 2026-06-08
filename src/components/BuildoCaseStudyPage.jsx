import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const IMAGES = [
  { id: 1,  src: "/case study/BUILDO/b1.png" },
  { id: 2,  src: "/case study/BUILDO/b2.png" },
  { id: 3,  src: "/case study/BUILDO/b3.png" },
  { id: 4,  src: "/case study/BUILDO/b4.png" },
  { id: 5,  src: "/case study/BUILDO/b5.png" },
  { id: 6,  src: "/case study/BUILDO/b6.png" },
  { id: 7,  src: "/case study/BUILDO/b7.png" },
  { id: 8,  src: "/case study/BUILDO/b8.png" },
  { id: 9,  src: "/case study/BUILDO/b9.png" },
  { id: 10, src: "/case study/BUILDO/b10.png" },
  { id: 11, src: "/case study/BUILDO/b11.png" },
  { id: 12, src: "/case study/BUILDO/b12.png" },
  { id: 13, src: "/case study/BUILDO/b13.png" },
  { id: 14, src: "/case study/BUILDO/b14.png" },
  { id: 15, src: "/case study/BUILDO/b15.png" },
  { id: 16, src: "/case study/BUILDO/b16.png" },
  { id: 17, src: "/case study/BUILDO/b17.png" },
  { id: 18, src: "/case study/BUILDO/b18.png" },
  { id: 19, src: "/case study/BUILDO/b19.png" },
  { id: 20, src: "/case study/BUILDO/b20.png" },
  { id: 21, src: "/case study/BUILDO/b21.png" },
  { id: 22, src: "/case study/BUILDO/b22.png" },
  { id: 23, src: "/case study/BUILDO/b23.png" },
  { id: 24, src: "/case study/BUILDO/b24.png" },
  { id: 25, src: "/case study/BUILDO/b25.png" },
  { id: 26, src: "/case study/BUILDO/b26.png" },
  { id: 27, src: "/case study/BUILDO/b27.png" },
  { id: 28, src: "/case study/BUILDO/b28.png" },
  { id: 29, src: "/case study/BUILDO/b29.png" },
  { id: 30, src: "/case study/BUILDO/b30.png" },
  { id: 31, src: "/case study/BUILDO/b31.png" },
  { id: 32, src: "/case study/BUILDO/b32.png" },
  { id: 33, src: "/case study/BUILDO/b33.png" },
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
          el.classList.add("buildo-img--visible");   // ← fixed: was "swayam-img--visible"
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
      className="buildo-img-wrap"                   // ← fixed: was "swayam-img-wrap"
      ref={wrapRef}
      style={{ "--stagger": `${Math.min(index * 0.05, 0.2)}s` }}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          className="buildo-img"                     // ← fixed: was "swayam-img"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
        />
      ) : src ? (
        <img
          src={src}
          alt={`Buildo case study image ${index + 1}`}
          className="buildo-img"                     // ← fixed: was "swayam-img"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ) : (
        <div className="buildo-placeholder">
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

/* ── Main page ── */
export default function BuildoCaseStudyPage({ isOpen, onClose }) {
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
        className="buildo-page"
        ref={pageRef}
        animate={{ y: isOpen ? "0%" : "100%" }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!isOpen}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <div className="buildo-stack">
          {IMAGES.map((img, i) => (
            <RevealImg key={img.id} src={img.src} index={i} />
          ))}
        </div>

        <div className="buildo-footer">
          <div className="buildo-footer-line" />
          <button className="buildo-back-btn" onClick={onClose}>
            <span className="buildo-back-label">Back to Portfolio</span>
            <span className="buildo-back-arrow">
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
  .buildo-page {
    position: fixed;
    inset: 0;
    z-index: 100000;
    overflow-y: auto;
    overflow-x: hidden;
    background: #f4f4f4;          /* ← changed from #ffffff */
    -webkit-font-smoothing: antialiased;
    scroll-behavior: smooth;
  }

  .buildo-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 0;
    padding: 80px 40px 0;
  }

  /* ── Reveal wrapper ── */
  .buildo-img-wrap {
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
  .buildo-img-wrap.buildo-img--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .buildo-img {
    width: 100%;
    height: auto;
    display: block;
    vertical-align: top;
    user-select: none;
    -webkit-user-drag: none;
  }

  .buildo-placeholder {
    width: 100%;
    aspect-ratio: 16 / 7;
    background: #e2e2e6;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0,0,0,0.22);
  }

  .buildo-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 72px 40px 64px;
    gap: 48px;
  }

  .buildo-footer-line {
    width: 100%;
    max-width: 1100px;
    height: 1px;
    background: rgba(0,0,0,0.1);
  }

  .buildo-back-btn {
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
  .buildo-back-btn::before {
    content: "";
    position: absolute;
    inset: 0;
    background: #111111;
    border-radius: inherit;
    transform: translateY(102%);
    transition: transform 0.46s cubic-bezier(0.16,1,0.3,1);
    z-index: 0;
  }
  .buildo-back-btn:hover::before { transform: translateY(0); }
  .buildo-back-btn:hover { color: #ffffff; border-color: #111111; }
  .buildo-back-btn:active { transform: scale(0.97); }

  .buildo-back-label {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    margin-right: 12px;
  }

  .buildo-back-arrow {
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
  .buildo-back-btn:hover .buildo-back-arrow {
    background: rgba(255,255,255,0.15);
    transform: translateX(-2px);
  }

  @media (max-width: 768px) {
    .buildo-stack  { padding: 80px 20px 0; gap: 0; }
    .buildo-footer { padding: 56px 20px 52px; gap: 36px; }
  }
  @media (max-width: 480px) {
    .buildo-stack  { padding: 72px 14px 0; gap: 0; }
    .buildo-footer { padding: 44px 14px 44px; gap: 28px; }
    .buildo-back-btn { height: 50px; font-size: 14px; }
  }
`;