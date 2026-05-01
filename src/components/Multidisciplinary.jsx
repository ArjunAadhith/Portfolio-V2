import { useRef, useEffect, useState, useCallback } from "react";
import ShowcasePage from "./Showcasepage.jsx";

const IMAGES = [
  { id: 1, src: "/multidisciplinary/m1.png", label: "Aston Martin Valhalla",        link: "https://3d-car-model-design.netlify.app/" },
  { id: 2, src: "/multidisciplinary/m2.png", label: "McLaren — Let's Start New Era", link: "https://wallstack.vercel.app/" },
  { id: 3, src: "/multidisciplinary/m3.png", label: "Nike — Just Do It",             link: "https://nike-shoe-design.netlify.app/" },
  { id: 4, src: "/multidisciplinary/m4.png", label: "Never Settle",                  link: "https://wallstack.vercel.app/" },
  { id: 5, src: "/multidisciplinary/m5.png", label: "Awaken",                        link: "https://wallstack.vercel.app/" },
];

// Lerp factor — lower = floatier/slower catch-up
const LERP = 0.078;

/* ─── Lazy Image ────────────────────────────────────────────────────── */
function LazyImage({ src, alt, className }) {
  const imgRef   = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    if (el.complete && el.naturalWidth > 0) {
      setLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (el.dataset.src) {
            el.src = el.dataset.src;
            delete el.dataset.src;
          }
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      data-src={src}
      src=""
      loading="lazy"
      decoding="async"
      alt={alt}
      className={className}
      draggable={false}
      onLoad={() => setLoaded(true)}
      style={{
        opacity:    loaded ? 1 : 0,
        transition: loaded ? "opacity 0.45s ease" : "none",
      }}
    />
  );
}

/* ─── Card ─────────────────────────────────────────────────────────── */
function ShowcaseCard({ img }) {
  const cardRef    = useRef(null);
  const cursorRef  = useRef(null);
  const targetPos  = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafRef     = useRef(null);
  const isHover    = useRef(false);

  /* ── RAF lerp loop ── */
  const startLoop = useCallback(() => {
    if (rafRef.current) return;
    const EASE = 0.13;
    const loop = () => {
      const el = cursorRef.current;
      if (!el) { rafRef.current = null; return; }
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * EASE;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * EASE;
      el.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) scale(${isHover.current ? 1 : 0.4})`;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const toLocal = useCallback((e) => {
    const r = cardRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }, []);

  /* ── Mouse enter: snap to position instantly then start lerp ── */
  const onEnter = useCallback((e) => {
    const p = toLocal(e);
    currentPos.current = { ...p };
    targetPos.current  = { ...p };
    isHover.current    = true;
    const el = cursorRef.current;
    if (el) {
      el.style.opacity   = "1";
      el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) scale(1)`;
    }
    startLoop();
  }, [toLocal, startLoop]);

  const onMove = useCallback((e) => {
    targetPos.current = toLocal(e);
  }, [toLocal]);

  const onLeave = useCallback(() => {
    isHover.current = false;
    const el = cursorRef.current;
    if (el) {
      el.style.opacity   = "0";
      el.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) scale(0.4)`;
    }
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  }, []);

  const onClick = useCallback((e) => {
    e.preventDefault();
    window.open(img.link, "_blank", "noopener,noreferrer");
  }, [img.link]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return (
    <a
      ref={cardRef}
      href={img.link}
      className="sc2-card"
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      rel="noopener noreferrer"
    >
      {/* ── Circle cursor (mix-blend-mode: difference) ── */}
      <div ref={cursorRef} className="sc2-cursor" aria-hidden="true">
<span className="sc2-cursor-label">
  Discover
  <svg
    width="11"
    height="11"
    viewBox="0 0 11 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "inline-block", marginLeft: "5px", verticalAlign: "middle", marginTop: "-1px" }}
  >
    <line x1="1" y1="10" x2="10" y2="1" stroke="#000" strokeWidth="1.6" strokeLinecap="round"/>
    <polyline points="4,1 10,1 10,7" fill="none" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
</span>        
      </div>

      <LazyImage src={img.src} alt={img.label} className="sc2-card-img" />

      <div className="sc2-card-overlay">
        <span className="sc2-card-label">{img.label}</span>
      </div>
    </a>
  );
}

/* ─── Main ──────────────────────────────────────────────────────────── */
export default function SplitShowcase() {
  const wrapperRef  = useRef(null);
  const innerRef    = useRef(null);
  const rightRef    = useRef(null);

  const current     = useRef(0);
  const target      = useRef(0);
  const maxScroll   = useRef(0);
  const rafRef      = useRef(null);
  const lastTs      = useRef(null);

  const [wrapperHeight, setWrapperHeight] = useState("100vh");
  const [showcaseOpen, setShowcaseOpen] = useState(false);

  /* ── Measure: how much does the right panel overflow? ── */
  const measure = useCallback(() => {
    const inner = innerRef.current;
    const right = rightRef.current;
    if (!inner || !right) return;
    const overflow = Math.max(0, inner.offsetHeight - right.clientHeight);
    maxScroll.current = overflow;
    setWrapperHeight(`calc(100vh + ${overflow + 40}px)`);
  }, []);

  useEffect(() => {
    const t = setTimeout(measure, 80);
    window.addEventListener("resize", measure, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("resize", measure); };
  }, [measure]);

  /* ── RAF loop: map page scroll → transform translate3d on inner div ── */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner   = innerRef.current;
    if (!wrapper || !inner) return;

    const tick = (ts) => {
      const dt = lastTs.current == null ? 16.67 : Math.min(ts - lastTs.current, 50);
      lastTs.current = ts;

      const scrolledIn = Math.max(0, -wrapper.getBoundingClientRect().top);
      const budget     = maxScroll.current;

      target.current = budget > 0 ? Math.min(budget, scrolledIn) : 0;

      const diff   = target.current - current.current;
      const factor = 1 - Math.exp(-dt * LERP);

      if (Math.abs(diff) < 0.04) {
        current.current = target.current;
      } else {
        current.current += diff * factor;
      }

      inner.style.transform = `translate3d(0, ${-current.current}px, 0)`;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTs.current = null;
    };
  }, [wrapperHeight]);

  return (
    <>
      <style>{CSS}</style>

      <ShowcasePage
        isOpen={showcaseOpen}
        onClose={() => setShowcaseOpen(false)}
      />

      <div
        ref={wrapperRef}
        className="sc2-wrapper"
        style={{ height: wrapperHeight }}
      >
        <div className="sc2-sticky">

          {/* LEFT */}
          <div className="sc2-left">
            <div className="sc2-left-inner">
              <p className="sc2-eyebrow">Selected Works</p>
              <h2 className="sc2-title">
                Multidisciplinary<br />
                Creative Showcase
              </h2>
              <p className="sc2-body">
                A curated collection of branding,
                motion, and digital experiences
                crafted with intention.
              </p>

              <button
                className="sc2-btn"
                onClick={() => setShowcaseOpen(true)}
              >
                <span className="sc2-btn-bg" />
                <span className="sc2-btn-text">Explore More</span>
              </button>
            </div>
          </div>

          {/* RIGHT — clip box; inner div floats via transform */}
          <div className="sc2-right" ref={rightRef}>
            <div className="sc2-cards" ref={innerRef}>
              {IMAGES.map((img) => (
                <ShowcaseCard key={img.id} img={img} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────── */
const CSS = `
  .sc2-wrapper *, .sc2-wrapper *::before, .sc2-wrapper *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  .sc2-wrapper {
    position: relative;
    width: 100%;
  }

  .sc2-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    display: flex;
    background: #0a0a0a;
    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
    overflow: hidden;
  }

  /* grain */
  .sc2-sticky::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
    z-index: 0;
  }

  /* ══════════════════════════════════════════
     DESKTOP BASE (1280px) — UNTOUCHED
  ══════════════════════════════════════════ */

  /* ── Left ── */
  .sc2-left {
    width: 40%;
    height: 100vh;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }

  .sc2-left-inner {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 50px 52px 40px 90px;
  }

  .sc2-eyebrow {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.32);
    margin-bottom: 28px;
  }

  .sc2-title {
    font-size: clamp(32px, 3.4vw, 54px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.035em;
    color: #f0ede8;
    margin-bottom: 24px;
  }

  .sc2-body {
    font-size: 13px;
    line-height: 1.72;
    color: rgba(255,255,255,0.38);
    max-width: 260px;
    margin-bottom: 44px;
  }

  .sc2-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    width: fit-content;
    padding: 12px 28px;
    border: 1px solid rgba(255,255,255,0.22);
    border-radius: 100px;
    cursor: pointer;
    background: transparent;
    margin-bottom: 0;
    font-family: inherit;
    min-height: 44px;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  .sc2-btn-bg {
    position: absolute;
    inset: 0;
    background: #f0ede8;
    transform: translateY(101%);
    transition: transform 0.46s cubic-bezier(0.76, 0, 0.24, 1);
    border-radius: inherit;
  }

  .sc2-btn:hover .sc2-btn-bg { transform: translateY(0); }

  .sc2-btn-text {
    position: relative;
    z-index: 1;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.80);
    transition: color 0.46s cubic-bezier(0.76, 0, 0.24, 1);
    pointer-events: none;
  }

  .sc2-btn:hover .sc2-btn-text { color: #0a0a0a; }

  /* ── Right — pure clip box, NO overflow scrolling ── */
  .sc2-right {
    width: 60%;
    height: 100vh;
    overflow: hidden;
    position: relative;
    z-index: 1;
  }

  /* ── Cards inner — moved by transform only, never scrollTop ── */
  .sc2-cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 32px 40px 40px;
    will-change: transform;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
  }

  /* ── Card ── */
  .sc2-card {
    display: block;
    position: relative;
    border-radius: 30px;
    overflow: hidden;
    cursor: none;
    flex-shrink: 0;
    aspect-ratio: 16 / 9;
    background: #1a1a1a;
    text-decoration: none;
    transition: transform 0.48s cubic-bezier(0.34, 1.2, 0.64, 1);
  }

  .sc2-card:hover { transform: scale(1.03); }

  .sc2-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
    transition: transform 0.60s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform;
  }

  .sc2-card:hover .sc2-card-img { transform: scale(1.04); }

  .sc2-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.62) 0%, transparent 50%);
    display: flex;
    align-items: flex-end;
    padding: 18px 22px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.32s ease;
  }

  .sc2-card:hover .sc2-card-overlay { opacity: 1; }

  .sc2-card-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.70);
  }

  /* ══════════════════════════════════════════
     CIRCLE CURSOR — exact pj-cursor style
  ══════════════════════════════════════════ */
  .sc2-cursor {
    position: absolute;
    width: 96px;
    height: 96px;
    margin-left: -48px;
    margin-top: -48px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;

    /* inverts any background it sits on */
    mix-blend-mode: difference;
    background: #ffffff;

    opacity: 0;
    transform: translate3d(0px, 0px, 0) scale(0.4);
    transition:
      opacity  0.28s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);

    will-change: transform, opacity;
  }

  .sc2-cursor-label {
    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #000;
    white-space: nowrap;
    user-select: none;
    pointer-events: none;
  }


  /* ══════════════════════════════════════════
     ULTRA-WIDE (1440px – 1600px)
  ══════════════════════════════════════════ */
  @media (min-width: 1440px) {
    .sc2-left-inner {
      padding: 50px 60px 40px 100px;
      max-width: 580px;
    }

    .sc2-title {
      font-size: clamp(38px, 3vw, 58px);
    }

    .sc2-body {
      font-size: 14px;
      max-width: 300px;
    }

    .sc2-cards {
      padding: 36px 52px 48px;
      gap: 18px;
    }

    .sc2-card {
      border-radius: 32px;
    }
  }


  /* ══════════════════════════════════════════
     ULTRA-WIDE (1920px+)
  ══════════════════════════════════════════ */
  @media (min-width: 1920px) {
    .sc2-sticky {
      max-width: 1920px;
      margin: 0 auto;
    }

    .sc2-left-inner {
      padding: 60px 72px 50px 120px;
      max-width: 640px;
    }

    .sc2-title {
      font-size: clamp(44px, 2.8vw, 64px);
      margin-bottom: 28px;
    }

    .sc2-body {
      font-size: 15px;
      max-width: 320px;
      margin-bottom: 52px;
    }

    .sc2-btn {
      padding: 14px 34px;
    }

    .sc2-btn-text {
      font-size: 13px;
    }

    .sc2-cards {
      padding: 40px 64px 56px;
      gap: 22px;
    }

    .sc2-card-overlay {
      padding: 24px 28px;
    }

    .sc2-card-label {
      font-size: 12px;
    }
  }


  /* ══════════════════════════════════════════
     TABLET LANDSCAPE (1024px – 1279px)
  ══════════════════════════════════════════ */
  @media (min-width: 1024px) and (max-width: 1279px) {
    .sc2-left-inner {
      padding: 40px 40px 36px 60px;
    }

    .sc2-title {
      font-size: clamp(28px, 3.2vw, 42px);
    }

    .sc2-body {
      font-size: 12.5px;
      max-width: 240px;
      margin-bottom: 36px;
    }

    .sc2-cards {
      padding: 28px 28px 36px;
      gap: 14px;
    }

    .sc2-card {
      border-radius: 24px;
    }
  }


  /* ══════════════════════════════════════════
     TABLET PORTRAIT (768px – 1023px)
  ══════════════════════════════════════════ */
  @media (min-width: 768px) and (max-width: 1023px) {
    .sc2-sticky {
      flex-direction: column;
      height: auto;
      position: relative;
    }

    .sc2-wrapper {
      height: auto !important;
    }

    .sc2-left {
      width: 100%;
      height: auto;
    }

    .sc2-left-inner {
      height: auto;
      justify-content: flex-start;
      padding: 64px 56px 48px 64px;
      max-width: 100%;
    }

    .sc2-eyebrow {
      margin-bottom: 20px;
    }

    .sc2-title {
      font-size: clamp(36px, 5.5vw, 52px);
      margin-bottom: 20px;
    }

    .sc2-body {
      font-size: 14px;
      max-width: 380px;
      margin-bottom: 40px;
    }

    .sc2-btn {
      padding: 13px 32px;
      min-height: 48px;
    }

    .sc2-right {
      width: 100%;
      height: auto;
      overflow: visible;
    }

    .sc2-cards {
      padding: 8px 40px 64px;
      gap: 16px;
      will-change: auto;
      transform: none !important;
    }

    .sc2-card {
      border-radius: 28px;
      cursor: pointer;
    }

    .sc2-cursor {
      display: none;
    }
  }


  /* ══════════════════════════════════════════
     MOBILE — ALL DEVICES (≤ 767px)
  ══════════════════════════════════════════ */
  @media (max-width: 767px) {
    .sc2-sticky {
      flex-direction: column;
      height: auto;
      position: relative;
    }

    .sc2-wrapper {
      height: auto !important;
    }

    .sc2-left {
      width: 100%;
      height: auto;
    }

    .sc2-left-inner {
      height: auto;
      justify-content: flex-start;
      padding: 56px 24px 36px 28px;
    }

    .sc2-eyebrow {
      font-size: 9px;
      letter-spacing: 0.20em;
      margin-bottom: 18px;
    }

    .sc2-title {
      font-size: clamp(28px, 8vw, 38px);
      line-height: 1.10;
      letter-spacing: -0.03em;
      margin-bottom: 16px;
    }

    .sc2-body {
      font-size: 13px;
      line-height: 1.68;
      max-width: 100%;
      margin-bottom: 32px;
      color: rgba(255,255,255,0.42);
    }

    .sc2-btn {
      padding: 13px 28px;
      min-height: 48px;
    }

    .sc2-btn-text {
      font-size: 11px;
    }

    .sc2-right {
      width: 100%;
      height: auto;
      overflow: visible;
    }

    .sc2-cards {
      padding: 4px 16px 56px;
      gap: 12px;
      will-change: auto;
      transform: none !important;
    }

    .sc2-card {
      border-radius: 20px;
      cursor: pointer;
    }

    .sc2-card-overlay {
      opacity: 1;
      background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%);
    }

    .sc2-card-label {
      font-size: 10px;
      letter-spacing: 0.08em;
    }

    .sc2-cursor {
      display: none;
    }
  }


  /* ══════════════════════════════════════════
     SMALL MOBILE (≤ 375px)
  ══════════════════════════════════════════ */
  @media (max-width: 375px) {
    .sc2-left-inner {
      padding: 48px 20px 32px 22px;
    }

    .sc2-title {
      font-size: clamp(24px, 8.5vw, 32px);
    }

    .sc2-body {
      font-size: 12.5px;
      margin-bottom: 28px;
    }

    .sc2-btn {
      padding: 12px 24px;
    }

    .sc2-cards {
      padding: 4px 12px 48px;
      gap: 10px;
    }

    .sc2-card {
      border-radius: 16px;
    }
  }


  /* ══════════════════════════════════════════
     TINY SCREENS (≤ 320px)
  ══════════════════════════════════════════ */
  @media (max-width: 320px) {
    .sc2-left-inner {
      padding: 44px 16px 28px 18px;
    }

    .sc2-title {
      font-size: 22px;
    }

    .sc2-body {
      font-size: 12px;
    }

    .sc2-btn {
      padding: 11px 20px;
    }

    .sc2-cards {
      padding: 4px 10px 44px;
      gap: 8px;
    }

    .sc2-card {
      border-radius: 14px;
    }
  }


  /* ══════════════════════════════════════════
     LARGE MOBILE (428px+)
  ══════════════════════════════════════════ */
  @media (min-width: 428px) and (max-width: 767px) {
    .sc2-left-inner {
      padding: 60px 32px 40px 36px;
    }

    .sc2-title {
      font-size: clamp(30px, 7.5vw, 40px);
    }

    .sc2-body {
      font-size: 13.5px;
      max-width: 340px;
    }

    .sc2-cards {
      padding: 4px 20px 60px;
      gap: 14px;
    }

    .sc2-card {
      border-radius: 22px;
    }
  }


  /* ══════════════════════════════════════════
     iOS SAFE AREA
  ══════════════════════════════════════════ */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    @media (max-width: 767px) {
      .sc2-cards {
        padding-bottom: calc(56px + env(safe-area-inset-bottom));
      }

      .sc2-left-inner {
        padding-top: calc(56px + env(safe-area-inset-top));
        padding-left: calc(28px + env(safe-area-inset-left));
        padding-right: calc(24px + env(safe-area-inset-right));
      }
    }

    @media (min-width: 768px) and (max-width: 1023px) {
      .sc2-left-inner {
        padding-top: calc(64px + env(safe-area-inset-top));
        padding-left: calc(64px + env(safe-area-inset-left));
      }

      .sc2-cards {
        padding-bottom: calc(64px + env(safe-area-inset-bottom));
      }
    }
  }


  /* ══════════════════════════════════════════
     TOUCH DEVICE — disable hover states
  ══════════════════════════════════════════ */
  @media (hover: none) and (pointer: coarse) {
    .sc2-card:hover {
      transform: none;
    }

    .sc2-card:hover .sc2-card-img {
      transform: none;
    }

    .sc2-card:active {
      transform: scale(0.98);
      transition: transform 0.18s ease;
    }

    .sc2-btn:hover .sc2-btn-bg {
      transform: translateY(101%);
    }

    .sc2-btn:hover .sc2-btn-text {
      color: rgba(255,255,255,0.80);
    }

    .sc2-btn:active .sc2-btn-bg {
      transform: translateY(0);
      transition: transform 0.22s ease;
    }

    .sc2-btn:active .sc2-btn-text {
      color: #0a0a0a;
      transition: color 0.22s ease;
    }

    .sc2-cursor {
      display: none !important;
    }
  }
`;