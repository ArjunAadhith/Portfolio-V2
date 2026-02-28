import { useState, useCallback, useRef } from "react";

const ROW_1 = [
  { id: 1, src: "/illustration/i1.png", alt: "Bonsai tree with parrot" },
  { id: 2, src: "/illustration/i2.png", alt: "Cubist portrait" },
  { id: 3, src: "/illustration/i3.png", alt: "The Rooster geometric" },
  { id: 4, src: "/illustration/i4.png", alt: "Colourful characters" },
];
const ROW_2 = [
  { id: 5, src: "/illustration/l0.jpg", alt: "Colourful characters" },
  { id: 6, src: "/illustration/i5.png", alt: "People crowd" },
  { id: 7, src: "/illustration/l01.jpg", alt: "Colourful characters" },
  { id: 8, src: "/illustration/i6.png", alt: "Woman with phone" },
];

export default function Illustrations() {
  const [tip, setTip] = useState({ visible: false, x: 0, y: 0 });
  const sectionRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTip({
      visible: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
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
          <div className="il-row">
            {ROW_1.map((img) => (
              <div className="il-card" key={img.id}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="il-img"
                  draggable={false}
                />
              </div>
            ))}
          </div>
          <div className="il-row">
            {ROW_2.map((img) => (
              <div className="il-card" key={img.id}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="il-img"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const CSS = `
  /* ══════════════════════════════════════════
     DESKTOP BASE (1280px) — UNTOUCHED
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
    padding: 0 0 0 12px;
    line-height: 1;
  }

  .il-rows {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .il-row {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: row;
    gap: 14px;
    align-items: stretch;
    justify-content: center;
  }

  .il-card {
    flex-shrink: 0;
    border-radius: 2px;
    overflow: hidden;
    background: #d0d0d0;
    line-height: 0;
    height: 100%;
  }

  .il-img {
    height: 100%;
    width: auto;
    display: block;
    object-fit: cover;
    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .il-card:hover .il-img {
    transform: scale(1.04);
  }

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


  /* ══════════════════════════════════════════
     ULTRA-WIDE (1440px – 1600px)
  ══════════════════════════════════════════ */
  @media (min-width: 1440px) {
    .il-section {
      padding: 56px 100px;
    }

    .il-title {
      font-size: clamp(26px, 2.6vw, 42px);
      margin-bottom: 28px;
    }

    .il-rows {
      gap: 16px;
    }

    .il-row {
      gap: 16px;
    }
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

    .il-title {
      font-size: clamp(30px, 2.4vw, 48px);
      margin-bottom: 32px;
    }

    .il-rows {
      gap: 20px;
    }

    .il-row {
      gap: 20px;
    }

    .il-card {
      border-radius: 4px;
    }
  }


  /* ══════════════════════════════════════════
     TABLET LANDSCAPE (1024px – 1279px)
  ══════════════════════════════════════════ */
  @media (min-width: 1024px) and (max-width: 1279px) {
    .il-section {
      padding: 44px 60px;
    }

    .il-title {
      font-size: clamp(22px, 3vw, 34px);
      margin-bottom: 20px;
    }

    .il-rows {
      gap: 12px;
    }

    .il-row {
      gap: 12px;
    }
  }


  /* ══════════════════════════════════════════
     TABLET PORTRAIT (768px – 1023px)
  ══════════════════════════════════════════ */
  @media (min-width: 768px) and (max-width: 1023px) {
    .il-section {
      height: auto;
      min-height: unset;
      padding: 48px 40px 56px;
      overflow: visible;
      cursor: auto;
    }

    .il-tip {
      display: none;
    }

    .il-title {
      font-size: clamp(26px, 4.5vw, 36px);
      margin-bottom: 24px;
      padding-left: 4px;
    }

    .il-rows {
      flex: unset;
      gap: 14px;
    }

    /* Each row: two images side-by-side, equal width */
    .il-row {
      flex: unset;
      height: auto;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
      align-items: stretch;
      justify-content: unset;
    }

    .il-card {
      height: auto;
      border-radius: 14px;
      width: 100%;
    }

    .il-img {
      height: auto;
      width: 100%;
      object-fit: cover;
      aspect-ratio: 4 / 3;
    }
  }


  /* ══════════════════════════════════════════
     MOBILE — ALL DEVICES (≤ 767px)
  ══════════════════════════════════════════ */
  @media (max-width: 767px) {
    .il-section {
      height: auto;
      min-height: unset;
      padding: 44px 20px 52px;
      overflow: visible;
      cursor: auto;
    }

    .il-tip {
      display: none;
    }

    .il-title {
      font-size: clamp(22px, 6.5vw, 30px);
      margin-bottom: 18px;
      padding-left: 4px;
    }

    .il-rows {
      flex: unset;
      gap: 10px;
    }

    /* Two images side-by-side per row on mobile */
    .il-row {
      flex: unset;
      height: auto;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      align-items: stretch;
      justify-content: unset;
    }

    .il-card {
      height: auto;
      border-radius: 12px;
      width: 100%;
    }

    .il-img {
      height: auto;
      width: 100%;
      object-fit: cover;
      aspect-ratio: 4 / 3;
    }

    /* Disable hover scale on touch */
    .il-card:hover .il-img {
      transform: none;
    }
  }


  /* ══════════════════════════════════════════
     SMALL MOBILE (≤ 375px) — iPhone SE,
     Galaxy A-series small, 320px devices
  ══════════════════════════════════════════ */
  @media (max-width: 375px) {
    .il-section {
      padding: 36px 14px 44px;
    }

    .il-title {
      font-size: clamp(20px, 7vw, 26px);
      margin-bottom: 14px;
    }

    .il-rows {
      gap: 8px;
    }

    .il-row {
      gap: 8px;
    }

    .il-card {
      border-radius: 10px;
    }

    .il-img {
      aspect-ratio: 1 / 1;
    }
  }


  /* ══════════════════════════════════════════
     TINY SCREENS (≤ 320px)
  ══════════════════════════════════════════ */
  @media (max-width: 320px) {
    .il-section {
      padding: 32px 12px 40px;
    }

    .il-title {
      font-size: 18px;
      margin-bottom: 12px;
    }

    .il-rows {
      gap: 6px;
    }

    .il-row {
      gap: 6px;
    }

    .il-card {
      border-radius: 8px;
    }

    .il-img {
      aspect-ratio: 1 / 1;
    }
  }


  /* ══════════════════════════════════════════
     LARGE MOBILE (428px+) — iPhone 14 Pro Max,
     Galaxy S Ultra, Pixel XL
  ══════════════════════════════════════════ */
  @media (min-width: 428px) and (max-width: 767px) {
    .il-section {
      padding: 48px 24px 56px;
    }

    .il-title {
      font-size: clamp(24px, 6vw, 32px);
      margin-bottom: 20px;
    }

    .il-rows {
      gap: 12px;
    }

    .il-row {
      gap: 12px;
    }

    .il-card {
      border-radius: 14px;
    }

    .il-img {
      aspect-ratio: 4 / 3;
    }
  }


  /* ══════════════════════════════════════════
     iOS SAFE AREA — notch / Dynamic Island /
     home indicator support
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
     TOUCH DEVICE — clean active feedback,
     no sticky hover states
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
  }
`;