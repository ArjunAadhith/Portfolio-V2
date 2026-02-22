import { useState, useCallback, useRef } from "react";

const ROW_1 = [
  { id: 1, src: "/i1.png", alt: "Bonsai tree with parrot" },
  { id: 2, src: "/i2.png", alt: "Cubist portrait" },
  { id: 3, src: "/i3.png", alt: "The Rooster geometric" },
  { id: 3, src: "/i3.png", alt: "The Rooster geometric" },
  { id: 3, src: "/i3.png", alt: "The Rooster geometric" },
];
const ROW_2 = [
  { id: 4, src: "/i4.png", alt: "Colourful characters" },
  { id: 5, src: "/i5.png", alt: "People crowd" },
  { id: 4, src: "/i4.png", alt: "Colourful characters" },
  { id: 4, src: "/i4.png", alt: "Colourful characters" },
  { id: 6, src: "/i6.png", alt: "Woman with phone" },
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
  /* ── Section: fills exactly one viewport height ── */
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

  /* ── Title ── */
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

  /* ── Two rows fill remaining height ── */
  .il-rows {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* ── Each row: images line up horizontally, height fills half of rows area ── */
  .il-row {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: row;
    gap: 14px;
    align-items: stretch;
    justify-content: center;
  }

  /* ── Card: no fixed width — grows to match image's natural ratio × row height ── */
  .il-card {
    flex-shrink: 0;
    border-radius: 2px;
    overflow: hidden;
    background: #d0d0d0;
    line-height: 0;
    height: 100%;
  }

  /* ── Image: height = 100% of card, width = auto → preserves aspect ratio ── */
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

  /* ── Tooltip: absolutely positioned, centered on cursor ── */
  .il-tip {
    position: absolute;
    pointer-events: none;
    z-index: 50;
    transform: translate(-50%, -50%);

    background: rgba(10, 10, 10, 0.84);
    -webkit-backdrop-filter: blur(14px);
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

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .il-section { padding: 36px 32px; }
  }

  @media (max-width: 640px) {
    .il-section {
      height: auto;
      padding: 32px 16px;
      cursor: auto;
      overflow: visible;
    }
    .il-tip  { display: none; }
    .il-rows { gap: 10px; flex: unset; }
    .il-row  {
      flex: unset;
      height: auto;
      flex-direction: column;
      align-items: stretch;
    }
    .il-card { height: auto; border-radius: 12px; }
    .il-img  { height: auto; width: 100%; }
  }
`;
