import { useRef, useEffect, useCallback } from "react";

const IMAGES = [
  { id: 1, src: "/m1.png", label: "Aston Martin Valhalla",         link: "https://3d-car-model-design.netlify.app/" },
  { id: 2, src: "/m2.png", label: "McLaren — Let's Start New Era",  link: "https://forzahorizon-wallpaper.netlify.app/" },
  { id: 3, src: "/m3.png", label: "Nike — Just Do It",              link: "https://nike-shoe-design.netlify.app/" },
  { id: 4, src: "/m4.png", label: "Never Settle",                   link: "https://never-settle-wallpaper.netlify.app/" },
  { id: 5, src: "/m5.png", label: "Awaken",                         link: "https://gaming-wallpaper.netlify.app/" },
];

const TIP_LERP = 0.11;

/* ─── Card with cursor tooltip ─────────────────────────────────────── */
function ShowcaseCard({ img }) {
  const cardRef    = useRef(null);
  const tipRef     = useRef(null);
  const targetRef  = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafRef     = useRef(null);
  const activeRef  = useRef(false);

  const startLoop = useCallback(() => {
    if (rafRef.current) return;
    const loop = () => {
      if (!tipRef.current || !activeRef.current) { rafRef.current = null; return; }
      currentPos.current.x += (targetRef.current.x - currentPos.current.x) * TIP_LERP;
      currentPos.current.y += (targetRef.current.y - currentPos.current.y) * TIP_LERP;
      tipRef.current.style.left = currentPos.current.x + "px";
      tipRef.current.style.top  = currentPos.current.y + "px";
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
    targetRef.current  = { ...p };
    activeRef.current  = true;
    if (tipRef.current) {
      tipRef.current.style.left = p.x + "px";
      tipRef.current.style.top  = p.y + "px";
      requestAnimationFrame(() => tipRef.current && tipRef.current.classList.add("tip-visible"));
    }
    startLoop();
  }, [toLocal, startLoop]);

  const onMove  = useCallback((e) => { targetRef.current = toLocal(e); }, [toLocal]);

  const onLeave = useCallback(() => {
    activeRef.current = false;
    tipRef.current && tipRef.current.classList.remove("tip-visible");
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
  const sectionRef    = useRef(null);
  const rightRef      = useRef(null);
  const scrollTarget  = useRef(0);
  const scrollCurrent = useRef(0);
  const rafRef        = useRef(null);
  const lastTsRef     = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const right   = rightRef.current;
    if (!section || !right) return;

    const onWheel = (e) => {
      const { top, bottom } = section.getBoundingClientRect();
      const vh = window.innerHeight;

      if (top > 1 || bottom < vh - 1) return;

      const maxScroll   = right.scrollHeight - right.clientHeight;
      const atTop       = scrollTarget.current <= 0;
      const atBottom    = scrollTarget.current >= maxScroll - 1;
      const goingUp     = e.deltaY < 0;
      const goingDown   = e.deltaY > 0;

      if ((atTop && goingUp) || (atBottom && goingDown)) {
        if (atTop && goingUp) {
          scrollTarget.current  = 0;
          scrollCurrent.current = 0;
        }
        return;
      }

      e.preventDefault();
      scrollTarget.current = Math.max(0, Math.min(maxScroll, scrollTarget.current + e.deltaY));
    };

    section.addEventListener("wheel", onWheel, { passive: false });
    return () => section.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const right = rightRef.current;
    if (!right) return;

    const tick = (ts) => {
      const dt = lastTsRef.current == null
        ? 16.67
        : Math.min(ts - lastTsRef.current, 50);
      lastTsRef.current = ts;

      const diff   = scrollTarget.current - scrollCurrent.current;
      const factor = 1 - Math.exp(-dt * 0.010);

      if (Math.abs(diff) < 0.04) {
        scrollCurrent.current = scrollTarget.current;
      } else {
        scrollCurrent.current += diff * factor;
      }

      right.scrollTop = scrollCurrent.current;
      rafRef.current  = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, []);

  return (
    <>
      <style>{CSS}</style>

      <section className="sc2-section" ref={sectionRef}>

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

        <div className="sc2-right" ref={rightRef}>
          <div className="sc2-cards">
            {IMAGES.map((img) => (
              <ShowcaseCard key={img.id} img={img} />
            ))}
          </div>
        </div>

      </section>
    </>
  );
}

const CSS = `
  .sc2-section *, .sc2-section *::before, .sc2-section *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  .sc2-section {
    display: flex;
    width: 100%;
    height: 100vh;
    background: #0a0a0a;
    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
    position: relative;
  }

  .sc2-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.030;
    pointer-events: none;
    z-index: 0;
  }

  .sc2-left {
    width: 40%;
    height: 100vh;
    position: relative;
    flex-shrink: 0;
    /* ── CENTER LINE REMOVED ── */
    z-index: 1;
  }

  .sc2-left-inner {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* ── SHIFTED RIGHT: left padding increased from 52px → 90px ── */
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

  .sc2-btn:hover .sc2-btn-bg { transform: translateY(0%); }

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

  .sc2-counter {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .sc2-counter-num {
    font-size: 36px;
    font-weight: 700;
    letter-spacing: -0.04em;
    color: rgba(255,255,255,0.12);
    line-height: 1;
  }

  .sc2-counter-divider {
    display: block;
    width: 32px;
    height: 1px;
    background: rgba(255,255,255,0.12);
  }

  .sc2-counter-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.18);
  }

  .sc2-right {
    width: 60%;
    height: 100vh;
    overflow: hidden;
    z-index: 1;
  }

  .sc2-cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 32px 40px 40px 40px;
  }

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
    transition: transform 0.48s cubic-bezier(0.34, 1.2, 0.64, 1),
                box-shadow 0.48s cubic-bezier(0.34, 1.2, 0.64, 1);
  }

  .sc2-card:hover {
    transform: scale(1.03);
    box-shadow: 0 24px 64px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.30);
  }

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
  }

  .sc2-card:hover .sc2-card-img { transform: scale(1.04); }

  .sc2-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.00) 50%);
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

  .sc2-tip {
    position: absolute;
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
    box-shadow: 0 8px 28px rgba(0,0,0,0.30);
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.70);
    transition: opacity 0.22s ease, transform 0.26s cubic-bezier(0.34, 1.56, 0.64, 1);
    top: 50%; left: 50%;
    will-change: left, top, transform, opacity;
  }

  .sc2-tip.tip-visible {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  @media (max-width: 768px) {
    .sc2-section {
      flex-direction: column;
      height: auto;
    }
    .sc2-left {
      width: 100%;
      height: auto;
    }
    .sc2-left-inner {
      position: relative;
      height: auto;
      padding: 60px 28px 40px 40px;
    }
    .sc2-right {
      width: 100%;
      height: auto;
      overflow: visible !important;
    }
    .sc2-cards { padding: 24px 20px 40px; }
  }
`;