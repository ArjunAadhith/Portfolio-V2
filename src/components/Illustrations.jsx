import { useState, useCallback, useRef, useEffect } from "react";

const ROW_1 = [
  { id: 1, src: "/illustration/i1.png", alt: "Illustration 1" },
  { id: 2, src: "/illustration/i2.png", alt: "Illustration 2" },
  { id: 3, src: "/illustration/i3.jpg", alt: "Illustration 3" },
  { id: 4, src: "/illustration/i4.png", alt: "Illustration 4" },
  { id: 5, src: "/illustration/i5.png", alt: "Illustration 5" },
];
const ROW_2 = [
  { id: 6, src: "/illustration/i6.png", alt: "Illustration 6" },
  { id: 7, src: "/illustration/i7.jpg", alt: "Illustration 7" },
  { id: 8, src: "/illustration/i8.jpg", alt: "Illustration 8" },
  { id: 9, src: "/illustration/i9.png", alt: "Illustration 9" },
  { id: 10, src: "/illustration/i10.png", alt: "Illustration 10" },
];

// ── Lazy Image Hook ───────────────────────────────────────────────────────────
function useLazyImage(src) {
  const wrapperRef            = useRef(null);
  const [lazySrc, setLazySrc] = useState(undefined);
  const [loaded,  setLoaded ] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLazySrc(src);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 200px 200px 200px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  return { wrapperRef, lazySrc, loaded, setLoaded };
}

// ── LazyImage component ───────────────────────────────────────────────────────
function LazyImage({ src, alt }) {
  const { wrapperRef, lazySrc, loaded, setLoaded } = useLazyImage(src);

  return (
    <div
      ref={wrapperRef}
      className={`il-lazy-wrap${loaded ? " il-lazy-wrap--loaded" : ""}`}
    >
      <img
        src={lazySrc}
        loading="lazy"
        decoding="async"
        alt={alt}
        className={`il-img${loaded ? " il-img--visible" : ""}`}
        draggable={false}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

// ── Scroll Row with indicators ────────────────────────────────────────────────
function ScrollRow({ items }) {
  const rowRef                        = useRef(null);
  const rafRef                        = useRef(null);
  const [hovered,       setHovered  ] = useState(false);
  const [canScrollLeft, setCanLeft  ] = useState(false);
  const [canScrollRight,setCanRight ] = useState(true);

  const syncScroll = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    const threshold = 4;
    setCanLeft (el.scrollLeft > threshold);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - threshold);
  }, []);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    syncScroll();

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(syncScroll);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [syncScroll]);

  const nudge = useCallback((dir) => {
    const el = rowRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.72);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }, []);

  return (
    <div
      className="il-row-outer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="il-row" ref={rowRef} role="list">
        {items.map((img) => (
          <div className="il-card" key={img.id} role="listitem">
            <LazyImage src={img.src} alt={img.alt} />
          </div>
        ))}
      </div>

      {/* Left indicator */}
      <button
        className={`il-scroll-btn il-scroll-btn--left${hovered && canScrollLeft ? " il-scroll-btn--visible" : ""}`}
        onClick={() => nudge(-1)}
        aria-label="Scroll left"
        tabIndex={-1}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M9 11.5L4.5 7L9 2.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Right indicator */}
      <button
        className={`il-scroll-btn il-scroll-btn--right${hovered && canScrollRight ? " il-scroll-btn--visible" : ""}`}
        onClick={() => nudge(1)}
        aria-label="Scroll right"
        tabIndex={-1}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M5 2.5L9.5 7L5 11.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Illustrations() {
  const [tip, setTip] = useState({ visible: false, x: 0, y: 0 });
  const sectionRef    = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTip({ visible: true, x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTip((t) => ({ ...t, visible: false }));
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <section
        className="il-section"
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Cursor-following tooltip */}
        <div
          className={`il-tip${tip.visible ? " il-tip--visible" : ""}`}
          style={{ left: tip.x, top: tip.y }}
          aria-hidden="true"
        >
          My Illustrations
        </div>

        <h2 className="il-title">Illustrations</h2>

        <div className="il-rows">
          <ScrollRow items={ROW_1} />
          <ScrollRow items={ROW_2} />
        </div>
      </section>
    </>
  );
}

const CSS = `
  /* ══════════════════════════════════════════
     DESKTOP BASE (1280px)
  ══════════════════════════════════════════ */

  .il-section {
    position: relative;
    height: 100vh;
    min-height: 560px;
    background: #e9e9e9;
    display: flex;
    flex-direction: column;
    padding: 50px 80px;
    box-sizing: border-box;
    overflow: hidden;
    cursor: none;
    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .il-title {
    flex-shrink: 0;
    font-size: clamp(22px, 2.8vw, 38px);
    font-weight: 700;
    letter-spacing: -0.03em;
    color: #111;
    margin: 0 0 24px;
    padding: 0;
    line-height: 1;
  }

  /* ── Rows container ── */
  .il-rows {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
    overflow: hidden;
  }

  /* ── NEW: Outer wrapper per row ── */
  .il-row-outer {
    flex: 1;
    min-height: 0;
    position: relative;
  }

  .il-row {
    flex: 1;
    min-height: 0;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 14px;
    align-items: stretch;
    justify-content: flex-start;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    will-change: scroll-position;
  }

  .il-row::-webkit-scrollbar {
    display: none;
  }

  .il-card {
    flex-shrink: 0;
    border-radius: 2px;
    overflow: hidden;
    background: #d0d0d0;
    line-height: 0;
    height: 100%;
  }

  .il-lazy-wrap {
    position: relative;
    height: 100%;
    width: fit-content;
    min-width: 180px;
    background: #d8d8d8;
    overflow: hidden;
  }

  /* Shimmer sweep while image is loading */
  .il-lazy-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.45) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: il-shimmer 1.6s infinite linear;
  }

  .il-lazy-wrap--loaded::after {
    display: none;
  }

  @keyframes il-shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }

  .il-img {
    height: 100%;
    width: auto;
    display: block;
    object-fit: cover;
    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
    opacity: 0;
    transition:
      opacity 0.45s ease,
      transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .il-img--visible {
    opacity: 1;
  }

  .il-card:hover .il-img {
    transform: scale(1.04);
  }

  /* ── Cursor-following tooltip ── */
  .il-tip {
    position: absolute;
    pointer-events: none;
    z-index: 50;
    transform: translate(-50%, -50%);
    background: rgba(10, 10, 10, 0.84);
    -webkit-backdrop-filter: blur(14px);
    backdrop-filter: blur(14px);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 8px 20px;
    border-radius: 100px;
    white-space: nowrap;
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.22);
    opacity: 0;
    scale: 0.76;
    transition:
      opacity 0.18s ease,
      scale 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);
    will-change: left, top;
  }

  .il-tip--visible {
    opacity: 1;
    scale: 1;
  }

  /* ── NEW: Scroll indicator buttons ── */
  .il-scroll-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(12, 12, 12, 0.76);
    -webkit-backdrop-filter: blur(16px);
    backdrop-filter: blur(16px);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.13);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.28);
    cursor: pointer;
    padding: 0;
    opacity: 0;
    scale: 0.78;
    pointer-events: none;
    transition:
      opacity 0.2s ease,
      scale 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
      background 0.15s ease;
  }

  .il-scroll-btn:hover {
    background: rgba(12, 12, 12, 0.92);
  }

  .il-scroll-btn--left  { left: 12px; }
  .il-scroll-btn--right { right: 12px; }

  .il-scroll-btn--visible {
    opacity: 1;
    scale: 1;
    pointer-events: auto;
  }


  /* ══════════════════════════════════════════
     ULTRA-WIDE (1440px – 1600px)
  ══════════════════════════════════════════ */
  @media (min-width: 1440px) {
    .il-section { padding: 56px 100px; }
    .il-title   { font-size: clamp(26px, 2.6vw, 42px); margin-bottom: 28px; }
    .il-rows    { gap: 16px; }
    .il-row     { gap: 16px; }
  }


  /* ══════════════════════════════════════════
     ULTRA-WIDE (1920px+)
  ══════════════════════════════════════════ */
  @media (min-width: 1920px) {
    .il-section {
      max-width: 1920px;
      margin: 0 auto;
      padding: 64px 120px;
    }
    .il-title { font-size: clamp(30px, 2.4vw, 48px); margin-bottom: 32px; }
    .il-rows  { gap: 20px; }
    .il-row   { gap: 20px; }
    .il-card  { border-radius: 4px; }
  }


  /* ══════════════════════════════════════════
     TABLET LANDSCAPE (1024px – 1279px)
  ══════════════════════════════════════════ */
  @media (min-width: 1024px) and (max-width: 1279px) {
    .il-section { padding: 44px 60px; }
    .il-title   { font-size: clamp(22px, 3vw, 34px); margin-bottom: 20px; }
    .il-rows    { gap: 12px; }
    .il-row     { gap: 12px; }
  }


  /* ══════════════════════════════════════════
     TABLET PORTRAIT (768px – 1023px)
     — 2-col grid, vertical layout
  ══════════════════════════════════════════ */
  @media (min-width: 768px) and (max-width: 1023px) {
    .il-section {
      height: auto;
      min-height: unset;
      padding: 48px 40px 56px;
      overflow: visible;
      cursor: auto;
    }
    .il-tip { display: none; }

    .il-title {
      font-size: clamp(26px, 4.5vw, 36px);
      margin-bottom: 24px;
      padding-left: 4px;
    }

    .il-rows {
      flex: unset;
      overflow: visible;
      gap: 14px;
    }

    .il-row-outer {
      flex: unset;
      min-height: unset;
    }

    .il-scroll-btn { display: none; }

    .il-row {
      flex: unset;
      height: auto;
      min-height: unset;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
      align-items: stretch;
      justify-content: unset;
      overflow-x: unset;
      overflow-y: unset;
      scrollbar-width: unset;
      -ms-overflow-style: unset;
    }

    .il-card {
      height: auto;
      border-radius: 14px;
      width: 100%;
    }

    /* ── FIX: last odd card spans full width ── */
    .il-row > .il-card:last-child:nth-child(odd) {
      grid-column: 1 / -1;
    }

    .il-lazy-wrap {
      height: auto;
      width: 100%;
      min-width: unset;
      aspect-ratio: 4 / 3;
    }

    .il-img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }


  /* ══════════════════════════════════════════
     MOBILE — ALL DEVICES (≤ 767px)
     — 2-col grid, vertical layout
  ══════════════════════════════════════════ */
  @media (max-width: 767px) {
    .il-section {
      height: auto;
      min-height: unset;
      padding: 44px 20px 52px;
      overflow: visible;
      cursor: auto;
    }
    .il-tip { display: none; }

    .il-title {
      font-size: clamp(22px, 6.5vw, 30px);
      margin-bottom: 18px;
      padding-left: 4px;
    }

    .il-rows {
      flex: unset;
      overflow: visible;
      gap: 10px;
    }

    .il-row-outer {
      flex: unset;
      min-height: unset;
    }

    .il-scroll-btn { display: none; }

    .il-row {
      flex: unset;
      height: auto;
      min-height: unset;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      align-items: stretch;
      justify-content: unset;
      overflow-x: unset;
      overflow-y: unset;
      scrollbar-width: unset;
      -ms-overflow-style: unset;
    }

    .il-card {
      height: auto;
      border-radius: 12px;
      width: 100%;
    }

    /* ── FIX: last odd card spans full width ── */
    .il-row > .il-card:last-child:nth-child(odd) {
      grid-column: 1 / -1;
    }

    .il-lazy-wrap {
      height: auto;
      width: 100%;
      min-width: unset;
      aspect-ratio: 4 / 3;
    }

    .il-img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    .il-card:hover .il-img {
      transform: none;
    }
  }


  /* ══════════════════════════════════════════
     SMALL MOBILE (≤ 375px)
  ══════════════════════════════════════════ */
  @media (max-width: 375px) {
    .il-section { padding: 36px 14px 44px; }
    .il-title   { font-size: clamp(20px, 7vw, 26px); margin-bottom: 14px; }
    .il-rows    { gap: 8px; }
    .il-row     { gap: 8px; }
    .il-card    { border-radius: 10px; }
    .il-lazy-wrap, .il-img { aspect-ratio: 1 / 1; }
  }


  /* ══════════════════════════════════════════
     TINY SCREENS (≤ 320px)
  ══════════════════════════════════════════ */
  @media (max-width: 320px) {
    .il-section { padding: 32px 12px 40px; }
    .il-title   { font-size: 18px; margin-bottom: 12px; }
    .il-rows    { gap: 6px; }
    .il-row     { gap: 6px; }
    .il-card    { border-radius: 8px; }
    .il-lazy-wrap, .il-img { aspect-ratio: 1 / 1; }
  }


  /* ══════════════════════════════════════════
     LARGE MOBILE (428px – 767px)
  ══════════════════════════════════════════ */
  @media (min-width: 428px) and (max-width: 767px) {
    .il-section { padding: 48px 24px 56px; }
    .il-title   { font-size: clamp(24px, 6vw, 32px); margin-bottom: 20px; }
    .il-rows    { gap: 12px; }
    .il-row     { gap: 12px; }
    .il-card    { border-radius: 14px; }

    /* ── FIX: last odd card spans full width ── */
    .il-row > .il-card:last-child:nth-child(odd) {
      grid-column: 1 / -1;
    }

    .il-lazy-wrap, .il-img { aspect-ratio: 4 / 3; }
  }


  /* ══════════════════════════════════════════
     iOS SAFE AREA
  ══════════════════════════════════════════ */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    @media (max-width: 767px) {
      .il-section {
        padding-bottom: calc(52px + env(safe-area-inset-bottom));
        padding-left:   calc(20px + env(safe-area-inset-left));
        padding-right:  calc(20px + env(safe-area-inset-right));
      }
    }
    @media (min-width: 428px) and (max-width: 767px) {
      .il-section {
        padding-bottom: calc(56px + env(safe-area-inset-bottom));
        padding-left:   calc(24px + env(safe-area-inset-left));
        padding-right:  calc(24px + env(safe-area-inset-right));
      }
    }
    @media (min-width: 768px) and (max-width: 1023px) {
      .il-section {
        padding-bottom: calc(56px + env(safe-area-inset-bottom));
        padding-left:   calc(40px + env(safe-area-inset-left));
        padding-right:  calc(40px + env(safe-area-inset-right));
      }
    }
  }


  /* ══════════════════════════════════════════
     TOUCH DEVICES
  ══════════════════════════════════════════ */
  @media (hover: none) and (pointer: coarse) {
    .il-card:hover .il-img {
      transform: none;
    }
    .il-card:active .il-img {
      transform: scale(1.02);
      transition: transform 0.18s ease;
    }
    .il-tip {
      display: none !important;
    }
    .il-scroll-btn {
      display: none !important;
    }
  }


  /* ══════════════════════════════════════════
     REDUCED MOTION
  ══════════════════════════════════════════ */
  @media (prefers-reduced-motion: reduce) {
    .il-img {
      transition: opacity 0.1s ease;
    }
    .il-lazy-wrap::after {
      animation: none;
    }
  }
`;