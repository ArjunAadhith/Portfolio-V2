import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const IMAGES = [
  { id: 1, src: "/case study/TNSTC/s1.png" },
  { id: 2, src: "/case study/TNSTC/s2.png" },
  { id: 3, src: "/case study/TNSTC/s3.png" },
  { id: 4, src: "/case study/TNSTC/s4.png" },
  { id: 5, src: "/case study/TNSTC/s5.png" },
  { id: 6, src: "/case study/TNSTC/s6.png" },
  { id: 7, src: "/case study/TNSTC/s7.png" },
  { id: 8, src: "/case study/TNSTC/s8.png" },
  { id: 9, src: "/case study/TNSTC/s9.png" },
  { id: 10, src: "/case study/TNSTC/s10.png" },
  { id: 11, src: "/case study/TNSTC/s11.png" },
  { id: 12, src: "/case study/TNSTC/s12.png" },
  { id: 13, src: "/case study/TNSTC/s13.png" },
  { id: 14, src: "/case study/TNSTC/s14.png" },
  { id: 15, src: "/case study/TNSTC/s15.png" },
  { id: 16, src: "/case study/TNSTC/s16.png" },
  { id: 17, src: "/case study/TNSTC/s17.png" },
  { id: 18, src: "/case study/TNSTC/s18.png" },
  { id: "vid", src: "/case study/TNSTC/vid.mp4" },
  { id: 19, src: "/case study/TNSTC/s19.png" },
];

function RevealImg({ src, index }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);

  const isVideo = src?.endsWith(".mp4");

  /* Reveal animation + lazy-play for video */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("csp-img--visible");

          /* Lazy-load video src only when in view */
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
      className="csp-img-wrap"
      ref={wrapRef}
      style={{ "--stagger": `${Math.min(index * 0.05, 0.2)}s` }}
    >
      {isVideo ? (
        /* No src on mount — injected by IntersectionObserver above */
        <video
          ref={videoRef}
          className="csp-img"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
        />
      ) : src ? (
        <img
          src={src}
          alt={`Case study image ${index + 1}`}
          className="csp-img"
          loading="lazy"          /* native lazy load */
          decoding="async"        /* non-blocking decode */
          draggable={false}
        />
      ) : (
        <div className="csp-placeholder">
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

export default function CaseStudyPage({ isOpen, onClose }) {
  const pageRef = useRef(null);

  /* 1 — Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* 2 — Escape key */
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  /* 3 — Scroll to top on open */
  useEffect(() => {
    if (isOpen && pageRef.current) pageRef.current.scrollTop = 0;
  }, [isOpen]);

  /* 4 — Raise navbar z-index above overlay */
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("portfolio:nav", { detail: { visible: !isOpen } })
    );
  }, [isOpen]);

  /* 5 — Forward scroll to navbar hide/show */
  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    let lastY = 0;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = el.scrollTop;
        const direction = currentY > lastY ? "down" : "up";
        window.dispatchEvent(
          new CustomEvent("portfolio:aboutScroll", {
            detail: { direction, scrollTop: currentY },
          })
        );
        lastY = currentY;
        ticking = false;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isOpen]);

  /* 6 — Close on navbar icon click */
  useEffect(() => {
    const fn = () => onClose();
    window.addEventListener("portfolio:closeAbout", fn);
    return () => window.removeEventListener("portfolio:closeAbout", fn);
  }, [onClose]);

  return (
    <>
      <style>{CSS}</style>

      <motion.div
        className="csp-page"
        ref={pageRef}
        animate={{ y: isOpen ? "0%" : "100%" }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!isOpen}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        {/* Images */}
        <div className="csp-stack">
          {IMAGES.map((img, i) => (
            <RevealImg key={img.id} src={img.src} index={i} />
          ))}
        </div>

        {/* Back to Portfolio footer */}
        <div className="csp-footer">
          <div className="csp-footer-line" />
          <button className="csp-back-btn" onClick={onClose}>
            <span className="csp-back-label">Back to Portfolio</span>
            <span className="csp-back-arrow">
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

const CSS = `
  .csp-page {
    position: fixed;
    inset: 0;
    z-index: 100000;
    overflow-y: auto;
    overflow-x: hidden;
    background: #f4f4f4;
    -webkit-font-smoothing: antialiased;
    scroll-behavior: smooth;
  }

  /* ── Image stack ── */
  .csp-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 24px;
    padding: 80px 40px 0;
  }

  .csp-img-wrap {
    width: 100%;
    max-width: 1100px;
    border-radius: 20px;
    overflow: hidden;
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity   0.7s cubic-bezier(0.25,0.46,0.45,0.94) var(--stagger, 0s),
      transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94) var(--stagger, 0s);
  }
  .csp-img-wrap.csp-img--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .csp-img {
    width: 100%;
    height: auto;
    display: block;
    vertical-align: top;
    user-select: none;
    -webkit-user-drag: none;
  }

  .csp-placeholder {
    width: 100%;
    aspect-ratio: 16 / 7;
    background: #e2e2e6;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0,0,0,0.22);
  }

  /* ── Footer ── */
  .csp-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 72px 40px 64px;
    gap: 48px;
  }

  .csp-footer-line {
    width: 100%;
    max-width: 1100px;
    height: 1px;
    background: rgba(0,0,0,0.1);
  }

  /* Pill button */
  .csp-back-btn {
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

  .csp-back-btn::before {
    content: "";
    position: absolute;
    inset: 0;
    background: #111111;
    border-radius: inherit;
    transform: translateY(102%);
    transition: transform 0.46s cubic-bezier(0.16,1,0.3,1);
    z-index: 0;
  }
  .csp-back-btn:hover::before { transform: translateY(0); }
  .csp-back-btn:hover { color: #ffffff; border-color: #111111; }
  .csp-back-btn:active { transform: scale(0.97); }

  .csp-back-label {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    margin-right: 12px;
  }

  .csp-back-arrow {
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
    transition: background 0.40s cubic-bezier(0.16,1,0.3,1), transform 0.22s cubic-bezier(0.22,1,0.36,1);
  }
  .csp-back-btn:hover .csp-back-arrow {
    background: rgba(255,255,255,0.15);
    transform: translateX(-2px);
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .csp-stack   { padding: 80px 20px 0; gap: 16px; }
    .csp-footer  { padding: 56px 20px 52px; gap: 36px; }
    .csp-img-wrap { border-radius: 14px; }
  }
  @media (max-width: 480px) {
    .csp-stack   { padding: 72px 14px 0; gap: 12px; }
    .csp-footer  { padding: 44px 14px 44px; gap: 28px; }
    .csp-img-wrap { border-radius: 10px; }
    .csp-back-btn { height: 50px; font-size: 14px; }
  }
`;