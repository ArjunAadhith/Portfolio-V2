import { useEffect, useRef, useState, useCallback } from "react";

const CARDS = [
  { id: 1, title: "Stucor Desktop",  image: "/UIUX/1.png", link: "https://www.figma.com/proto/nIfAXuv4TethAKm2JepTGh/Stucor-Desktop-UI?page-id=0%3A1&node-id=12-84&viewport=143%2C191%2C0.05&t=Tg8Ge3zHR5MsyIu5-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=308%3A273" },
  { id: 2, title: "Pet Frnd",    image: "/UIUX/2.png", link: "https://www.figma.com/proto/b0oJ5zPBtnU1Nb2v998pyl/Pet-Frnd?page-id=0%3A1&node-id=8-2&p=f&viewport=124%2C610%2C0.36&t=3l9jE8RIDk5x3itd-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=8%3A2" },
  { id: 3, title: "TS Motors",    image: "/UIUX/3.png", link: "https://www.figma.com/proto/sMiKy8vqCBgqGw2QYWXKp5/TS-MOTORS?page-id=0%3A1&node-id=4-3&p=f&viewport=62%2C418%2C0.22&t=tPUShUGbfKycNK7D-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=4%3A3&show-proto-sidebar=1" },
  { id: 4, title: "Google Sheet",  image: "/UIUX/4.png", link: "https://www.figma.com/proto/1EXdPGE9ee6CT9m7TOaT3G/Google-Sheet-UI?page-id=0%3A1&node-id=1-8&viewport=161%2C430%2C0.79&t=WMM4bVIK5p1TsLpP-1&scaling=scale-down&content-scaling=fixed" },
  { id: 5, title: "Apple control center",    image: "/UIUX/5.png", link: "https://www.figma.com/proto/DRSTFzuFqxQzIQJgyAeErs/Apple-Control-Center-Glass-UI?page-id=1%3A2&node-id=3-3&viewport=930%2C1967%2C0.34&t=NnPwPJqwLJ06caQF-1&scaling=scale-down&content-scaling=fixed" },
  { id: 6, title: "Music player",    image: "/UIUX/6.png", link: "https://www.figma.com/proto/929gYewDfQUwWcfhbgq5A3/Music-UI-Vision?page-id=0%3A1&node-id=1-2&viewport=346%2C382%2C0.77&t=2HpKgEDGGyCxceIY-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A2" },
  { id: 7, title: "Yacht Booking",    image: "/UIUX/7.png", link: "https://www.figma.com/proto/3rnSAp7DD9GnHI7vl5Yeco/Yacht-Booking?page-id=0%3A1&node-id=1-2&viewport=240%2C457%2C0.54&t=xpDAYoVJG4CJPOLB-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A2" },
  { id: 8, title: "Login Page",      image: "/UIUX/8.png", link: "https://www.figma.com/proto/FXAYL15VONilLo2ApgF0ag/Untitled?page-id=0%3A1&node-id=118-4&viewport=-1127%2C151%2C0.15&t=40pru97sFl0w3Kx9-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=102%3A2" },
  { id: 9, title: "DDDAS Site Design",       image: "/UIUX/9.png", link: "https://www.figma.com/proto/1itf6UuzeiXOBFBhmhj4eM/DDDAS-Design?page-id=0%3A1&node-id=1-2&viewport=240%2C164%2C0.09&t=7HYdcdULhxg9uwW2-1&scaling=min-zoom&content-scaling=fixed" },
];

const CARD_W       = 644;
const CARD_H       = 360;
const GAP          = 28;
const SIDE_PADDING = 80;

// Exponential decay smoothness constant.
// factor = 1 - exp(-dt * SMOOTHNESS)
// 0.014 = snappy, 0.010 = silky (sweet spot), 0.007 = dreamy
const SMOOTHNESS = 0.010;
const TIP_LERP   = 0.12;

export default function Showcase() {
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);
  const currentRef = useRef(0);
  const lastTsRef  = useRef(null);
  const rafRef     = useRef(null);
  const [sectionH, setSectionH] = useState("300vh");

  const getMax = useCallback(() => {
    const vw     = window.innerWidth;
    const totalW = CARDS.length * CARD_W + (CARDS.length - 1) * GAP + SIDE_PADDING * 2;
    return Math.max(0, totalW - vw);
  }, []);

  useEffect(() => {
    const update = () => setSectionH("calc(100vh + " + getMax() + "px)");
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [getMax]);

  useEffect(() => {
    const tick = (timestamp) => {
      if (sectionRef.current && trackRef.current) {
        // Delta time capped at 50ms so a hidden/backgrounded tab doesn't jump
        const dt = lastTsRef.current == null
          ? 16.67
          : Math.min(timestamp - lastTsRef.current, 50);
        lastTsRef.current = timestamp;

        const rawTarget = -sectionRef.current.getBoundingClientRect().top;
        const target    = Math.max(0, Math.min(getMax(), rawTarget));

        const diff = target - currentRef.current;

        if (Math.abs(diff) < 0.04) {
          // Hard snap to rest — kills infinite sub-pixel drift
          currentRef.current = target;
        } else {
          // Frame-rate-independent exponential decay
          // At 60fps:  factor ~= 0.147
          // At 120fps: factor ~= 0.080   (same visual speed either way)
          const factor = 1 - Math.exp(-dt * SMOOTHNESS);
          currentRef.current += diff * factor;
        }

        trackRef.current.style.transform =
          "translateX(-" + currentRef.current.toFixed(3) + "px)";
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [getMax]);

  const styles = `
    @font-face {
      font-family: 'SF Pro Display';
      src: url('/src/assets/fonts/SF-Pro-Display-Regular.otf') format('opentype');
      font-weight: 400;
    }
    @font-face {
      font-family: 'SF Pro Display';
      src: url('/src/assets/fonts/SF-Pro-Display-Medium.otf') format('opentype');
      font-weight: 500;
    }
    @font-face {
      font-family: 'SF Pro Display';
      src: url('/src/assets/fonts/SF-Pro-Display-Bold.otf') format('opentype');
      font-weight: 700;
    }
    @font-face {
      font-family: 'SF Pro Display';
      src: url('/src/assets/fonts/SF-Pro-Display-Heavy.otf') format('opentype');
      font-weight: 800;
    }

    #sc-section {
      position: relative;
      background: #ffffff;
      font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
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

    #sc-heading {
      width: 100%;
      text-align: center;
      margin: 0 0 52px;
      font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: clamp(32px, 4.2vw, 58px);
      font-weight: 500;
      letter-spacing: -0.038em;
      line-height: 1.05;
      color: #b4b4b4;
      flex-shrink: 0;
      padding: 0 80px;
    }

    #sc-overflow-clip {
      width: 100%;
      overflow: hidden;
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

    .sc-card-link {
      display: flex;
      width: 644px;
      height: 360px;
      border-radius: 20px;
      overflow: hidden;
      flex-shrink: 0;
      position: relative;
      text-decoration: none;
      cursor: none;
    }

    .sc-right {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
    }

    .sc-img-placeholder {
      position: absolute;
      inset: 0;
    }

    .sc-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
      pointer-events: none;
      user-select: none;
      -webkit-user-drag: none;
    }

    .sc-tooltip {
      position: absolute;
      pointer-events: none;
      z-index: 10;
      background: #ffffff;
      color: #111111;
      font-family: 'SF Pro Display', -apple-system, sans-serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.02em;
      padding: 8px 16px;
      border-radius: 100px;
      white-space: nowrap;
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.72);
      transition:
        opacity  0.20s ease,
        transform 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);
      top: 50%;
      left: 50%;
      will-change: left, top, transform, opacity;
    }

    .sc-tooltip.visible {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div id="sc-section" ref={sectionRef} style={{ height: sectionH }}>
        <div id="sc-sticky">
          <h2 id="sc-heading">Showcase of My Creations</h2>
          <div id="sc-overflow-clip">
            <div id="sc-track" ref={trackRef}>
              {CARDS.map((card) => (
                <Card key={card.id} card={card} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Card({ card }) {
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
  }, [toLocal, startLoop]);

  const onMouseMove  = useCallback((e) => { targetRef.current = toLocal(e); }, [toLocal]);

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
      <div ref={tipRef} className="sc-tooltip">
        {"Explore Now \u2197"}
      </div>
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