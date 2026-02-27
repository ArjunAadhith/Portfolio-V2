import { useState, useEffect, useRef } from "react";

// ─── Chrome Gradients ────────────────────────────────────────────────────────
const CHROME = `linear-gradient(
  180deg,
  #ffffff 0%,
  #e8e8e8 15%,
  #f4f4f4 28%,
  #9e9e9e 44%,
  #ebebeb 54%,
  #bdbdbd 67%,
  #f0f0f0 79%,
  #878787 100%
)`;

const CHROME_STRONG = `linear-gradient(
  165deg,
  #ffffff 0%,
  #dedede 10%,
  #f7f7f7 20%,
  #acacac 34%,
  #f2f2f2 46%,
  #959595 58%,
  #f4f4f4 70%,
  #a8a8a8 83%,
  #ffffff 100%
)`;

// ─── Config ──────────────────────────────────────────────────────────────────
const BAND_COUNT    = 12;   // horizontal strips
const ANIM_DURATION = 1800; // ms — unhurried, premium

// ─── Easing ──────────────────────────────────────────────────────────────────
const easeInOutCubic = t =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Per-band easing: each band gets its own local 0→1 progress
const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const delay = ms => new Promise(r => setTimeout(r, ms));

// ─── Main component ──────────────────────────────────────────────────────────
export default function CinematicIntro({ children, onComplete }) {
  const [phase,       setPhase]       = useState("s1");
  const [wordVisible, setWordVisible] = useState(false);
  const lineProgressRef               = useRef(0);
  const [, forceUpdate]               = useState(0);
  const rafRef                        = useRef(null);
  const hasRun                        = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (sessionStorage.getItem("_introPlayed")) {
      setPhase("done");
      document.body.style.overflow = "";
      onComplete?.();
      return;
    }

    document.body.style.overflow = "hidden";

    (async () => {
      setPhase("s1"); setWordVisible(false);
      await delay(50);
      setWordVisible(true);
      await delay(1300);

      setWordVisible(false);
      await delay(200);
      setPhase("s2"); setWordVisible(false);
      await delay(50);
      setWordVisible(true);
      await delay(1300);

      setWordVisible(false);
      await delay(200);
      setPhase("s3"); setWordVisible(false);
      await delay(50);
      setWordVisible(true);
      await delay(1600);

      setWordVisible(false);
      await delay(180);
      setPhase("lines");
      await runBands();

      sessionStorage.setItem("_introPlayed", "1");
      setPhase("done");
      document.body.style.overflow = "";
      onComplete?.();
    })();

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  function runBands() {
    return new Promise(resolve => {
      const start = performance.now();
      const tick  = now => {
        const raw = Math.min((now - start) / ANIM_DURATION, 1);
        lineProgressRef.current = raw; // raw — each band does its own easing
        forceUpdate(raw);
        if (raw < 1) { rafRef.current = requestAnimationFrame(tick); }
        else { resolve(); }
      };
      rafRef.current = requestAnimationFrame(tick);
    });
  }

  const isDone = phase === "done";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>

      <div style={{
        position    : "relative",
        zIndex      : 0,
        pointerEvents: isDone ? "auto" : "none",
        userSelect  : isDone ? "auto" : "none",
      }}>
        {children}
      </div>

      {!isDone && (
        <div style={{
          position  : "fixed",
          inset     : 0,
          zIndex    : 9999,
          background: phase === "lines" ? "transparent" : "#000000",
          overflow  : "visible",
        }}>
          {phase !== "lines" && (
            <div style={{
              position      : "absolute",
              inset         : 0,
              display       : "flex",
              alignItems    : "center",
              justifyContent: "center",
              overflow      : "visible",
            }}>
              {phase === "s1" && (
                <Word
                  text="Make"
                  visible={wordVisible}
                  size="clamp(120px, 18vw, 260px)"
                  gradient={CHROME}
                  spacing="-0.03em"
                />
              )}
              {phase === "s2" && (
                <Word
                  text="A"
                  visible={wordVisible}
                  size="clamp(160px, 28vw, 340px)"
                  gradient={CHROME}
                  spacing="-0.03em"
                />
              )}
              {phase === "s3" && (
                <Word
                  text="Difference"
                  visible={wordVisible}
                  size="clamp(72px, 17vw, 230px)"
                  gradient={CHROME_STRONG}
                  spacing="-0.04em"
                  strong
                />
              )}
            </div>
          )}

          {phase === "lines" && (
            <Bands progress={lineProgressRef.current} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Word ────────────────────────────────────────────────────────────────────
function Word({ text, visible, size, gradient, spacing, strong }) {
  return (
    <div style={{
      transition  : "opacity 0.22s ease, transform 0.38s cubic-bezier(0.22,1,0.36,1)",
      opacity     : visible ? 1 : 0,
      transform   : visible ? "scale(1)" : "scale(0.96)",
      willChange  : "opacity, transform",
      overflow    : "visible",
      padding     : "0.2em 0.1em",
    }}>
      <span style={{
        display              : "block",
        fontFamily           : "'SF Pro Display', -apple-system, 'Helvetica Neue', Helvetica, sans-serif",
        fontWeight           : 800,
        fontSize             : size,
        letterSpacing        : spacing,
        lineHeight           : 1.1,
        whiteSpace           : "nowrap",
        padding              : "0.15em 0.08em",
        background           : gradient,
        WebkitBackgroundClip : "text",
        WebkitTextFillColor  : "transparent",
        backgroundClip       : "text",
        userSelect           : "none",
        filter               : strong
          ? "drop-shadow(0 0 36px rgba(255,255,255,0.10))"
          : "drop-shadow(0 0 28px rgba(255,255,255,0.07))",
      }}>
        {text}
      </span>
    </div>
  );
}

// ─── Bands ───────────────────────────────────────────────────────────────────
// 12 horizontal strips cover the full viewport.
// Each strip slides off to alternating sides (odd → left, even → right).
// Stagger is distance-from-center: center bands start FIRST, outer bands follow.
// A hairline bright edge traces the leading side of each departing strip.
function Bands({ progress }) {
  const bandH    = 100 / BAND_COUNT; // % height per band
  const center   = (BAND_COUNT - 1) / 2;

  // Total stagger window: 35% of the animation timeline
  const STAGGER  = 0.35;

  return (
    <div style={{
      position : "absolute",
      inset    : 0,
      overflow : "hidden", // bands slide off-screen — clip at viewport edge
    }}>
      {Array.from({ length: BAND_COUNT }).map((_, i) => {
        // Distance from center (0 = center band, max at edges)
        const distFromCenter = Math.abs(i - center) / center; // 0..1

        // Center bands start earlier, outer bands later
        const startOffset  = distFromCenter * STAGGER;
        const window       = 1 - startOffset;
        const localRaw     = Math.max(0, Math.min(1, (progress - startOffset) / window));
        const localT       = easeOutQuart(localRaw);

        // Odd bands → slide LEFT (negative X), even → slide RIGHT (positive X)
        const direction    = i % 2 === 0 ? 1 : -1;
        const tx           = localT * 110 * direction; // % — overshoots slightly

        // Leading-edge hairline: sits on the trailing face of the band
        // Right edge when going right, left edge when going left
        const edgeColor    = `rgba(255,255,255,${0.55 - distFromCenter * 0.2})`;
        const edgeSide     = direction === 1 ? { left: 0 } : { right: 0 };
        const edgeVisible  = localT > 0.01 && localT < 0.99;

        return (
          <div
            key={i}
            style={{
              position  : "absolute",
              left      : 0,
              right     : 0,
              top       : `${i * bandH}%`,
              height    : `${bandH + 0.15}%`, // tiny overlap prevents hairline gaps between bands
              background: "#000000",
              transform : `translateX(${tx}%)`,
              willChange: "transform",
              // Each band is its own stacking context so edges render cleanly
              isolation : "isolate",
            }}
          >
            {/* Hairline edge that glows as the band departs */}
            {edgeVisible && (
              <div style={{
                position  : "absolute",
                top       : 0,
                bottom    : 0,
                width     : "1px",
                background: edgeColor,
                boxShadow : `0 0 6px 1px rgba(255,255,255,0.35), 0 0 16px 3px rgba(255,255,255,0.12)`,
                ...edgeSide,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}