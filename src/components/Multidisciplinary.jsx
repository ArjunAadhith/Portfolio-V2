import { useRef, useEffect, useState, useCallback } from "react";

const IMAGES = [
  { id: 1, src: "/multidisciplinary/m1.png", label: "Aston Martin Valhalla",        link: "https://3d-car-model-design.netlify.app/" },
  { id: 2, src: "/multidisciplinary/m2.png", label: "McLaren — Let's Start New Era", link: "https://forzahorizon-wallpaper.netlify.app/" },
  { id: 3, src: "/multidisciplinary/m3.png", label: "Nike — Just Do It",             link: "https://nike-shoe-design.netlify.app/" },
  { id: 4, src: "/multidisciplinary/m4.png", label: "Never Settle",                  link: "https://never-settle-wallpaper.netlify.app/" },
  { id: 5, src: "/multidisciplinary/m5.png", label: "Awaken",                        link: "https://gaming-wallpaper.netlify.app/" },
];

// Lerp factor — lower = floatier/slower catch-up
const LERP = 0.078;

/* ─── Card ─────────────────────────────────────────────────────────── */
function ShowcaseCard({ img }) {
  const cardRef    = useRef(null);
  const tipRef     = useRef(null);
  const targetPos  = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafRef     = useRef(null);
  const active     = useRef(false);

  const startLoop = useCallback(() => {
    if (rafRef.current) return;
    const loop = () => {
      if (!active.current || !tipRef.current) { rafRef.current = null; return; }
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.12;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.12;
      // ✅ transform instead of left/top — no layout recalc
      tipRef.current.style.transform =
        `translate3d(calc(${currentPos.current.x}px - 50%), calc(${currentPos.current.y}px - 50%), 0) scale(1)`;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const toLocal = useCallback((e) => {
    const r = cardRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }, []);

  const onEnter = useCallback((e) => {
    const p = toLocal(e);
    currentPos.current = { ...p };
    targetPos.current  = { ...p };
    active.current     = true;
    const tip = tipRef.current;
    if (tip) {
      tip.style.transform =
        `translate3d(calc(${p.x}px - 50%), calc(${p.y}px - 50%), 0) scale(1)`;
      requestAnimationFrame(() => tip && tip.classList.add("tip-on"));
    }
    startLoop();
  }, [toLocal, startLoop]);

  const onMove  = useCallback((e) => { targetPos.current = toLocal(e); }, [toLocal]);

  const onLeave = useCallback(() => {
    active.current = false;
    tipRef.current?.classList.remove("tip-on");
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
      <div ref={tipRef} className="sc2-tip">Discover Now</div>
      <img src={img.src} alt={img.label} className="sc2-card-img" draggable={false} />
      <div className="sc2-card-overlay">
        <span className="sc2-card-label">{img.label}</span>
      </div>
    </a>
  );
}

/* ─── Main ──────────────────────────────────────────────────────────── */
export default function SplitShowcase() {
  const wrapperRef  = useRef(null);
  const innerRef    = useRef(null);   // the cards column — moved via transform
  const rightRef    = useRef(null);   // clip container (overflow:hidden)

  const current     = useRef(0);      // interpolated Y offset (px, positive = scrolled up)
  const target      = useRef(0);      // target Y offset from page scroll
  const maxScroll   = useRef(0);      // max translateY magnitude
  const rafRef      = useRef(null);
  const lastTs      = useRef(null);

  const [wrapperHeight, setWrapperHeight] = useState("100vh");

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

      // How far into wrapper have we scrolled?
      const scrolledIn = Math.max(0, -wrapper.getBoundingClientRect().top);
      const budget     = maxScroll.current;

      // Map page scroll → target Y offset (clamped)
      target.current = budget > 0 ? Math.min(budget, scrolledIn) : 0;

      // Frame-rate-independent lerp (exponential decay)
      const diff   = target.current - current.current;
      const factor = 1 - Math.exp(-dt * LERP);

      if (Math.abs(diff) < 0.04) {
        current.current = target.current;
      } else {
        current.current += diff * factor;
      }

      // ✅ Only transform — no scrollTop, no layout triggers, pure GPU
      inner.style.transform = `translate3d(0, ${-current.current}px, 0)`;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTs.current = null;
    };
  }, [wrapperHeight]); // restart after height measured

  return (
    <>
      <style>{CSS}</style>
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
              <a href="/explore" className="sc2-btn">
                <span className="sc2-btn-bg" />
                <span className="sc2-btn-text">Explore More</span>
              </a>
              <div className="sc2-counter">
                <span className="sc2-counter-num">05+</span>
                <span className="sc2-counter-divider" />
                <span className="sc2-counter-label">Projects</span>
              </div>
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

  /* Button */
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
    text-decoration: none;
    cursor: pointer;
    background: transparent;
    margin-bottom: 56px;
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

  /* Counter */
  .sc2-counter { display: flex; align-items: center; gap: 14px; }
  .sc2-counter-num {
    font-size: 36px;
    font-weight: 700;
    letter-spacing: -0.04em;
    color: rgba(255,255,255,0.12);
    line-height: 1;
  }
  .sc2-counter-divider {
    display: block; width: 32px; height: 1px;
    background: rgba(255,255,255,0.12);
  }
  .sc2-counter-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.18);
  }

  /* ── Right — pure clip box, NO overflow scrolling ── */
  .sc2-right {
    width: 60%;
    height: 100vh;
    overflow: hidden;           /* clips the inner div */
    position: relative;
    z-index: 1;
  }

  /* ── Cards inner — moved by transform only, never scrollTop ── */
  .sc2-cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 32px 40px 40px;
    will-change: transform;     /* ✅ GPU layer hint */
    transform: translate3d(0, 0, 0); /* ✅ promote to compositor layer */
    backface-visibility: hidden; /* ✅ prevent sub-pixel flicker */
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
    /* ✅ NO box-shadow on hover — that triggers paint */
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

  /* ── Tooltip — transform-only positioning ── */
  .sc2-tip {
    position: absolute;
    top: 0; left: 0;           /* origin; real pos set via transform */
    pointer-events: none;
    z-index: 20;
    background: #f0ede8;
    color: #0a0a0a;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    padding: 7px 16px;
    border-radius: 100px;
    white-space: nowrap;
    box-shadow: 0 6px 20px rgba(0,0,0,0.28);
    opacity: 0;
    /* ✅ initial: centered, shrunk */
    transform: translate3d(calc(0px - 50%), calc(0px - 50%), 0) scale(0.72);
    transition: opacity 0.20s ease, scale 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);
    will-change: transform;
    backface-visibility: hidden;
  }

  .sc2-tip.tip-on {
    opacity: 1;
    scale: 1;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .sc2-sticky {
      flex-direction: column;
      height: auto;
      position: relative;
    }
    .sc2-wrapper { height: auto !important; }
    .sc2-left  { width: 100%; height: auto; }
    .sc2-left-inner { height: auto; padding: 60px 28px 40px 40px; }
    .sc2-right { width: 100%; height: auto; overflow: visible; }
    .sc2-cards {
      padding: 24px 20px 40px;
      will-change: auto;
      transform: none;
    }
  }
`;