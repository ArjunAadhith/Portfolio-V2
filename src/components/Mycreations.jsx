import { useEffect, useRef, useState, useCallback } from "react";

const CARDS = [
  { id: 1, title: "Stucor Desktop",       image: "/UIUX/1.png", link: "https://www.figma.com/proto/nIfAXuv4TethAKm2JepTGh/Stucor-Desktop-UI?page-id=0%3A1&node-id=12-84&viewport=143%2C191%2C0.05&t=Tg8Ge3zHR5MsyIu5-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=308%3A273" },
  { id: 2, title: "Pet Frnd",             image: "/UIUX/2.png", link: "https://www.figma.com/proto/b0oJ5zPBtnU1Nb2v998pyl/Pet-Frnd?page-id=0%3A1&node-id=8-2&p=f&viewport=124%2C610%2C0.36&t=3l9jE8RIDk5x3itd-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=8%3A2" },
  { id: 3, title: "TS Motors",            image: "/UIUX/3.png", link: "https://www.figma.com/proto/sMiKy8vqCBgqGw2QYWXKp5/TS-MOTORS?page-id=0%3A1&node-id=4-3&p=f&viewport=62%2C418%2C0.22&t=tPUShUGbfKycNK7D-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=4%3A3&show-proto-sidebar=1" },
  { id: 4, title: "Google Sheet",         image: "/UIUX/4.png", link: "https://www.figma.com/proto/1EXdPGE9ee6CT9m7TOaT3G/Google-Sheet-UI?page-id=0%3A1&node-id=1-8&viewport=161%2C430%2C0.79&t=WMM4bVIK5p1TsLpP-1&scaling=scale-down&content-scaling=fixed" },
  { id: 5, title: "Apple control center", image: "/UIUX/5.png", link: "https://www.figma.com/proto/DRSTFzuFqxQzIQJgyAeErs/Apple-Control-Center-Glass-UI?page-id=1%3A2&node-id=3-3&viewport=930%2C1967%2C0.34&t=NnPwPJqwLJ06caQF-1&scaling=scale-down&content-scaling=fixed" },
  { id: 6, title: "Music player",         image: "/UIUX/6.png", link: "https://www.figma.com/proto/929gYewDfQUwWcfhbgq5A3/Music-UI-Vision?page-id=0%3A1&node-id=1-2&viewport=346%2C382%2C0.77&t=2HpKgEDGGyCxceIY-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A2" },
  { id: 7, title: "Yacht Booking",        image: "/UIUX/7.png", link: "https://www.figma.com/proto/3rnSAp7DD9GnHI7vl5Yeco/Yacht-Booking?page-id=0%3A1&node-id=1-2&viewport=240%2C457%2C0.54&t=xpDAYoVJG4CJPOLB-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A2" },
  { id: 8, title: "Login Page",           image: "/UIUX/8.png", link: "https://www.figma.com/proto/FXAYL15VONilLo2ApgF0ag/Untitled?page-id=0%3A1&node-id=118-4&viewport=-1127%2C151%2C0.15&t=40pru97sFl0w3Kx9-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=102%3A2" },
  { id: 9, title: "DDDAS Site Design",    image: "/UIUX/9.png", link: "https://www.figma.com/proto/1itf6UuzeiXOBFBhmhj4eM/DDDAS-Design?page-id=0%3A1&node-id=1-2&viewport=240%2C164%2C0.09&t=7HYdcdULhxg9uwW2-1&scaling=min-zoom&content-scaling=fixed" },
];

// ── Desktop constants (unchanged) ──────────────────────────────────────────
const CARD_W        = 644;
const GAP           = 28;
const SIDE_PADDING  = 80;
const SMOOTHNESS    = 0.010;
const TIP_LERP      = 0.12;
const MARQUEE_SPEED = 0.6;

const MQ_ITEMS = [
  "UI Design", "UX Research", "Figma Prototypes",
  "Visual Design", "Interaction Design", "User Flows",
  "Wireframing", "Usability Testing", "Design Systems",
  "Mobile Apps", "Web Interfaces", "User-Centered Design",
  "User Personas", "Information Architecture"
];

// ── Breakpoint helper ───────────────────────────────────────────────────────
function useBreakpoint() {
  const [bp, setBp] = useState(() => getBreakpoint(
    typeof window !== "undefined" ? window.innerWidth : 1280
  ));
  useEffect(() => {
    const update = () => setBp(getBreakpoint(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return bp;
}

function getBreakpoint(w) {
  if (w < 480)  return "xs";       // small mobile  (320–479)
  if (w < 768)  return "mobile";   // standard mobile (480–767)
  if (w < 1024) return "tablet";   // tablet portrait / landscape (768–1023)
  if (w < 1280) return "sm-desk";  // small desktop (1024–1279)
  return "desktop";                // 1280+ (original layout untouched)
}

// ── Main component ──────────────────────────────────────────────────────────
export default function Showcase() {
  const bp          = useBreakpoint();
  const isMobile    = bp === "xs" || bp === "mobile";
  const isTablet    = bp === "tablet";
  const isSmDesk    = bp === "sm-desk";
  // Use native swipe scroll on xs / mobile / tablet portrait
  const useNative   = isMobile || isTablet;

  const sectionRef  = useRef(null);
  const trackRef    = useRef(null);
  const currentRef  = useRef(0);
  const lastTsRef   = useRef(null);
  const rafRef      = useRef(null);
  const [sectionH, setSectionH] = useState("300vh");

  const mqTrackRef  = useRef(null);
  const mqOffsetRef = useRef(0);
  const mqRafRef    = useRef(null);

  const getMax = useCallback(() => {
    const vw     = window.innerWidth;
    const totalW = CARDS.length * CARD_W + (CARDS.length - 1) * GAP + SIDE_PADDING * 2;
    return Math.max(0, totalW - vw);
  }, []);

  // Section height — only matters in desktop sticky mode
  useEffect(() => {
    if (useNative) { setSectionH("auto"); return; }
    const update = () => setSectionH("calc(100vh + " + getMax() + "px)");
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [getMax, useNative]);

  // Sticky scroll animation — desktop only
  useEffect(() => {
    if (useNative) return;
    const tick = (timestamp) => {
      if (sectionRef.current && trackRef.current) {
        const dt = lastTsRef.current == null
          ? 16.67
          : Math.min(timestamp - lastTsRef.current, 50);
        lastTsRef.current = timestamp;
        const rawTarget = -sectionRef.current.getBoundingClientRect().top;
        const target    = Math.max(0, Math.min(getMax(), rawTarget));
        const diff      = target - currentRef.current;
        if (Math.abs(diff) < 0.04) {
          currentRef.current = target;
        } else {
          const factor = 1 - Math.exp(-dt * SMOOTHNESS);
          currentRef.current += diff * factor;
        }
        trackRef.current.style.transform =
          "translateX(-" + currentRef.current.toFixed(3) + "px)";
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); lastTsRef.current = null; };
  }, [getMax, useNative]);

  // Marquee
  useEffect(() => {
    const track = mqTrackRef.current;
    if (!track) return;
    const loop = () => {
      mqOffsetRef.current += MARQUEE_SPEED;
      const halfW = track.scrollWidth / 2;
      if (mqOffsetRef.current >= halfW) mqOffsetRef.current -= halfW;
      track.style.transform = `translateX(-${mqOffsetRef.current.toFixed(3)}px)`;
      mqRafRef.current = requestAnimationFrame(loop);
    };
    mqRafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(mqRafRef.current);
  }, []);

  // ── Styles ──────────────────────────────────────────────────────────────
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,400&display=swap');

    @font-face { font-family:'SF Pro Display'; src:url('/src/assets/fonts/SF-Pro-Display-Regular.otf') format('opentype'); font-weight:400; }
    @font-face { font-family:'SF Pro Display'; src:url('/src/assets/fonts/SF-Pro-Display-Medium.otf')  format('opentype'); font-weight:500; }
    @font-face { font-family:'SF Pro Display'; src:url('/src/assets/fonts/SF-Pro-Display-Bold.otf')    format('opentype'); font-weight:700; }
    @font-face { font-family:'SF Pro Display'; src:url('/src/assets/fonts/SF-Pro-Display-Heavy.otf')   format('opentype'); font-weight:800; }

    html { scroll-behavior: smooth; }

    /* ── Base ── */
    #sc-section {
      position: relative;
      background: #ffffff;
      margin: 0; padding: 0;
      font-family: 'Syne', 'SF Pro Display', -apple-system, sans-serif;
    }

    #sc-sticky {
      position: sticky;
      top: 0;
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }

    /* ── Background ── */
    #sc-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }

    .sc-x {
      position: absolute; width: 6px; height: 6px;
    }
    .sc-x::before, .sc-x::after { content: ''; position: absolute; background: #e4e4e4; }
    .sc-x::before { width: 1px; height: 100%; left: 50%; }
    .sc-x::after  { width: 100%; height: 1px; top: 50%; }

    /* ── Marquee ── */
    #sc-marquee-wrap {
      position: absolute;
      top: 0; left: 0; right: 0;
      overflow: hidden;
      border-bottom: 1px solid #f0f0f0;
      height: 32px;
      display: flex;
      align-items: center;
      z-index: 2;
    }

    #sc-marquee-track {
      display: flex;
      white-space: nowrap;
      will-change: transform;
    }

    .sc-mq-item {
      font-family: 'Syne', sans-serif;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.26em;
      text-transform: uppercase;
      color: #d0d0d0;
      padding: 0 28px;
      flex-shrink: 0;
    }

    .sc-mq-sep {
      font-family: 'Syne', sans-serif;
      font-size: 9px;
      color: #e2e2e2;
      flex-shrink: 0;
      padding: 0 4px;
    }

    /* ── Heading ── */
    #sc-heading-block {
      width: 100%;
      margin: 0 0 52px;
      padding: 0 80px;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    #sc-title-row {
      display: flex;
      align-items: flex-end;
      gap: 0;
      line-height: 1;
    }

    .sc-t-solid {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(80px, 10.5vw, 152px);
      font-weight: 400;
      letter-spacing: 0.04em;
      line-height: 0.88;
      color: #111111;
    }

    .sc-t-italic {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(26px, 3.4vw, 50px);
      font-weight: 400;
      font-style: italic;
      color: #c0c0c0;
      letter-spacing: -0.01em;
      line-height: 1;
      padding: 0 16px 14px;
    }

    .sc-t-ghost {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(80px, 10.5vw, 152px);
      font-weight: 400;
      letter-spacing: 0.04em;
      line-height: 0.88;
      color: white;
      -webkit-text-stroke: 1.5px #d4d4d4;
    }

    #sc-tagline {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-top: 16px;
    }
    .sc-tg-bar  { width: 28px; height: 1px; background: linear-gradient(90deg, #cccccc, transparent); }
    .sc-tg-text {
      font-family: 'Syne', sans-serif;
      font-size: 10.5px; font-weight: 500;
      letter-spacing: 0.20em; text-transform: uppercase;
      color: #c4c4c4;
    }

    /* ── Track (desktop sticky) ── */
    #sc-overflow-clip {
      width: 100%;
      overflow: hidden;
      position: relative;
      z-index: 1;
    }

    #sc-track {
      display: flex;
      gap: 28px;
      padding: 0 80px;
      width: max-content;
      will-change: transform;
      transform: translateX(0);
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }

    /* ── Cards ── */
    .sc-card-link {
      display: flex;
      width: 644px;
      height: 360px;
      border-radius: 30px;
      overflow: hidden;
      flex-shrink: 0;
      position: relative;
      text-decoration: none;
      cursor: none;
      border: 1px solid #eeeeee;
      transition: border-color 0.35s ease;
    }
    .sc-card-link:hover { border-color: #dddddd; }

    .sc-right {
      width: 100%; height: 100%;
      position: relative; overflow: hidden;
    }

    .sc-img-placeholder { position: absolute; inset: 0; }

    .sc-img {
      width: 100%; height: 100%;
      object-fit: cover; object-position: center;
      display: block;
      pointer-events: none;
      user-select: none;
      -webkit-user-drag: none;
      transition: transform 0.55s cubic-bezier(.16,1,.3,1);
    }
    .sc-card-link:hover .sc-img { transform: scale(1.04); }

    /* Tooltip */
    .sc-tooltip {
      position: absolute;
      pointer-events: none;
      z-index: 10;
      background: #ffffff;
      color: #111111;
      font-family: 'Syne', sans-serif;
      font-size: 10px; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase;
      padding: 8px 18px;
      border-radius: 100px;
      white-space: nowrap;
      opacity: 0;
      border: 1px solid #eeeeee;
      transform: translate(-50%, -50%) scale(0.72);
      transition: opacity 0.20s ease,
                  transform 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);
      top: 50%; left: 50%;
      will-change: left, top, transform, opacity;
    }
    .sc-tooltip.visible {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }

    /* ════════════════════════════════════════════════════
       ULTRA-WIDE  ≥ 1920px
       Content stays centered, whitespace is balanced.
    ════════════════════════════════════════════════════ */
    @media (min-width: 1920px) {
      #sc-heading-block {
        padding: 0 120px;
      }

      #sc-track {
        padding: 0 120px;
      }
    }

    /* ════════════════════════════════════════════════════
       SMALL DESKTOP  1024px – 1279px
       Slightly reduced card & heading, same sticky scroll.
    ════════════════════════════════════════════════════ */
    @media (min-width: 1024px) and (max-width: 1279px) {
      #sc-heading-block {
        padding: 0 48px;
        margin-bottom: 36px;
      }

      #sc-track {
        padding: 0 48px;
        gap: 20px;
      }

      .sc-card-link {
        width: 480px;
        height: 280px;
        border-radius: 22px;
      }
    }

    /* ════════════════════════════════════════════════════
       TABLET  768px – 1023px
       Native horizontal swipe; single-row carousel.
       Sticky disabled in JSX for this range.
    ════════════════════════════════════════════════════ */
    @media (min-width: 768px) and (max-width: 1023px) {
      #sc-section {
        /* height: auto set via JS */
        padding-bottom: 60px;
      }

      /* Disable sticky in CSS as extra guard */
      #sc-sticky {
        position: relative !important;
        height: auto !important;
        overflow: visible !important;
        justify-content: flex-start;
        padding-top: 56px; /* clear marquee */
      }

      #sc-heading-block {
        padding: 0 40px;
        margin-bottom: 32px;
      }

      .sc-t-solid,
      .sc-t-ghost {
        font-size: clamp(56px, 9vw, 88px);
      }

      .sc-t-italic {
        font-size: clamp(18px, 2.8vw, 32px);
        padding: 0 12px 10px;
      }

      #sc-tagline { margin-top: 12px; }
      .sc-tg-text { font-size: 9.5px; }

      /* Native scroll track */
      #sc-overflow-clip {
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      #sc-overflow-clip::-webkit-scrollbar { display: none; }

      #sc-track {
        width: max-content;
        transform: none !important;
        padding: 0 40px 24px;
        gap: 20px;
      }

      .sc-card-link {
        width: 400px;
        height: 240px;
        border-radius: 20px;
        cursor: pointer; /* restore on touch */
      }

      /* Hide tooltip on touch */
      .sc-tooltip { display: none; }
    }

    /* ════════════════════════════════════════════════════
       MOBILE  < 768px
       Native swipe, stacked heading, proportional sizing.
    ════════════════════════════════════════════════════ */
    @media (max-width: 767px) {
      #sc-section {
        padding-bottom: 48px;
      }

      #sc-sticky {
        position: relative !important;
        height: auto !important;
        overflow: visible !important;
        justify-content: flex-start;
        padding-top: 48px; /* clear marquee */
      }

      /* ── Marquee ── */
      #sc-marquee-wrap {
        height: 28px;
      }
      .sc-mq-item {
        font-size: 7.5px;
        letter-spacing: 0.20em;
        padding: 0 18px;
      }

      /* ── Heading ── */
      #sc-heading-block {
        padding: 0 20px;
        margin-bottom: 24px;
      }

      #sc-title-row {
        flex-wrap: wrap;
        align-items: flex-end;
        gap: 0;
        row-gap: 2px;
      }

      .sc-t-solid {
        font-size: clamp(52px, 17vw, 76px);
        line-height: 0.90;
      }

      .sc-t-ghost {
        font-size: clamp(52px, 17vw, 76px);
        line-height: 0.90;
      }

      .sc-t-italic {
        font-size: clamp(16px, 5.2vw, 26px);
        padding: 0 10px 8px;
      }

      #sc-tagline {
        margin-top: 10px;
        gap: 10px;
      }
      .sc-tg-bar  { width: 20px; }
      .sc-tg-text { font-size: 8.5px; letter-spacing: 0.16em; }

      /* ── Track: native swipe ── */
      #sc-overflow-clip {
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      #sc-overflow-clip::-webkit-scrollbar { display: none; }

      #sc-track {
        width: max-content;
        transform: none !important;
        padding: 0 20px 16px;
        gap: 14px;
      }

      /* ── Cards ── */
      .sc-card-link {
        width: 76vw;
        max-width: 340px;
        height: auto;
        aspect-ratio: 16 / 9;
        border-radius: 16px;
        cursor: pointer;
        min-height: 44px; /* touch target floor */
      }

      .sc-tooltip { display: none; }

      /* Suppress decorative crosses on mobile */
      #sc-bg .sc-x { display: none; }
    }

    /* ════════════════════════════════════════════════════
       EXTRA-SMALL  < 480px  (320px–479px)
       Narrower cards, tighter spacing.
    ════════════════════════════════════════════════════ */
    @media (max-width: 479px) {
      #sc-heading-block { padding: 0 16px; }

      #sc-track { padding: 0 16px 16px; gap: 12px; }

      .sc-card-link {
        width: 84vw;
        max-width: 300px;
      }

      .sc-t-solid,
      .sc-t-ghost {
        font-size: clamp(44px, 18.5vw, 64px);
      }

      .sc-t-italic {
        font-size: clamp(14px, 5.5vw, 22px);
        padding: 0 8px 6px;
      }
    }

    /* ════════════════════════════════════════════════════
       IOS SAFE-AREA  (notch / home-bar devices)
    ════════════════════════════════════════════════════ */
    @supports (padding-bottom: env(safe-area-inset-bottom)) {
      @media (max-width: 1023px) {
        #sc-section {
          padding-bottom: max(48px, env(safe-area-inset-bottom));
        }

        #sc-track {
          /* add right clearance for notch in landscape */
          padding-right: max(20px, env(safe-area-inset-right));
        }
      }
    }

    /* ════════════════════════════════════════════════════
       SCROLL-SNAP on native swipe tracks
       Gives satisfying card-by-card feel on touch.
    ════════════════════════════════════════════════════ */
    @media (max-width: 1023px) {
      #sc-overflow-clip {
        scroll-snap-type: x mandatory;
      }
      .sc-card-link {
        scroll-snap-align: start;
      }
    }

    /* ════════════════════════════════════════════════════
       REDUCED-MOTION  preference
    ════════════════════════════════════════════════════ */
    @media (prefers-reduced-motion: reduce) {
      .sc-img { transition: none; }
      .sc-tooltip { transition: opacity 0.1s ease; }
    }
  `;

  const mqSingle = MQ_ITEMS.flatMap((item, i) => [
    <span key={`a-${i}`} className="sc-mq-item">{item}</span>,
    <span key={`s-${i}`} className="sc-mq-sep">·</span>,
  ]);
  const mqItems = [...mqSingle, ...mqSingle];

  return (
    <>
      <style>{styles}</style>

      <div id="sc-section" ref={sectionRef} style={{ height: sectionH }}>
        <div id="sc-sticky">

          {/* ── Background ── */}
          <div id="sc-bg" aria-hidden="true">
            <div className="sc-x" style={{ top:"17%", left:"55%" }} />
            <div className="sc-x" style={{ top:"68%", left:"42%" }} />
            <div className="sc-x" style={{ top:"36%", left:"85%" }} />
            <div className="sc-x" style={{ bottom:"20%", right:"148px" }} />
          </div>

          {/* ── Marquee ── */}
          <div id="sc-marquee-wrap" aria-hidden="true">
            <div id="sc-marquee-track" ref={mqTrackRef}>
              {mqItems}
            </div>
          </div>

          {/* ── Heading ── */}
          <div id="sc-heading-block">
            <div id="sc-title-row">
              <span className="sc-t-solid">Showcase</span>
              <span className="sc-t-italic">of my</span>
              <span className="sc-t-ghost">Creations</span>
            </div>
            <div id="sc-tagline">
              <span className="sc-tg-bar" />
              <span className="sc-tg-text">UI · UX · Figma Prototypes</span>
            </div>
          </div>

          {/* ── Track ── */}
          <div id="sc-overflow-clip">
            <div id="sc-track" ref={trackRef}>
              {CARDS.map((card) => (
                <Card key={card.id} card={card} useTooltip={!useNative} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

// ── Card ────────────────────────────────────────────────────────────────────
function Card({ card, useTooltip }) {
  const cardRef    = useRef(null);
  const tipRef     = useRef(null);
  const targetRef  = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafRef     = useRef(null);
  const activeRef  = useRef(false);

  const startLoop = useCallback(() => {
    if (rafRef.current) return;
    const loop = () => {
      const tip = tipRef.current;
      if (!tip || !activeRef.current) { rafRef.current = null; return; }
      currentPos.current.x += (targetRef.current.x - currentPos.current.x) * TIP_LERP;
      currentPos.current.y += (targetRef.current.y - currentPos.current.y) * TIP_LERP;
      tip.style.left = currentPos.current.x + "px";
      tip.style.top  = currentPos.current.y + "px";
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const toLocal = useCallback((e) => {
    const rect = cardRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const onMouseEnter = useCallback((e) => {
    if (!useTooltip) return;
    const local = toLocal(e);
    currentPos.current = { ...local };
    targetRef.current  = { ...local };
    activeRef.current  = true;
    const tip = tipRef.current;
    if (tip) {
      tip.style.left = local.x + "px";
      tip.style.top  = local.y + "px";
      requestAnimationFrame(() => tip.classList.add("visible"));
    }
    startLoop();
  }, [toLocal, startLoop, useTooltip]);

  const onMouseMove  = useCallback((e) => {
    if (!useTooltip) return;
    targetRef.current = toLocal(e);
  }, [toLocal, useTooltip]);

  const onMouseLeave = useCallback(() => {
    activeRef.current = false;
    if (tipRef.current) tipRef.current.classList.remove("visible");
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  }, []);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <a
      ref={cardRef}
      href={card.link}
      target="_blank"
      rel="noopener noreferrer"
      className="sc-card-link"
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {useTooltip && (
        <div ref={tipRef} className="sc-tooltip">
          {"Explore Now \u2197"}
        </div>
      )}
      <div className="sc-right">
        <div className="sc-img-placeholder">
          <img
            src={card.image}
            alt={card.title.replace("\n", " ")}
            className="sc-img"
            draggable={false}
          />
        </div>
      </div>
    </a>
  );
}