import { useState, useEffect, useRef } from "react";

// ─── Chrome Gradients ───────────────────────────────────────────────────────
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
const LINE_COUNT    = 9;
const MAX_SPREAD    = 11;    // vw — max gap when fully fanned
const ANIM_DURATION = 1900;  // ms

// ─── Easing ──────────────────────────────────────────────────────────────────
const easeInOutCubic = t =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const delay = ms => new Promise(r => setTimeout(r, ms));

// ─── Main component ──────────────────────────────────────────────────────────
export default function CinematicIntro({ children, onComplete }) {
  const [phase,       setPhase]       = useState("s1");
  const [wordVisible, setWordVisible] = useState(false);
  const lineProgressRef               = useRef(0);
  const [, forceUpdate]               = useState(0);   // lightweight render trigger
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
      // ── Screen 1: "Make" ──
      setPhase("s1"); setWordVisible(false);
      await delay(50);
      setWordVisible(true);
      await delay(1300);

      // ── Screen 2: "A" ──
      setWordVisible(false);
      await delay(200);
      setPhase("s2"); setWordVisible(false);
      await delay(50);
      setWordVisible(true);
      await delay(1300);

      // ── Screen 3: "Difference" ──
      setWordVisible(false);
      await delay(200);
      setPhase("s3"); setWordVisible(false);
      await delay(50);
      setWordVisible(true);
      await delay(1600);

      // ── Line reveal ──
      setWordVisible(false);
      await delay(180);
      setPhase("lines");
      await runLines();

      sessionStorage.setItem("_introPlayed", "1");
      setPhase("done");
      document.body.style.overflow = "";
      onComplete?.();
    })();

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  function runLines() {
    return new Promise(resolve => {
      const start = performance.now();
      const tick  = now => {
        const raw = Math.min((now - start) / ANIM_DURATION, 1);
        lineProgressRef.current = easeInOutCubic(raw);
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

      {/* ── Underlying content ── */}
      <div style={{
        position    : "relative",
        zIndex      : 0,
        pointerEvents: isDone ? "auto" : "none",
        userSelect  : isDone ? "auto" : "none",
      }}>
        {children}
      </div>

      {/* ── Intro overlay ── */}
      {!isDone && (
        <div style={{
          position  : "fixed",
          inset     : 0,
          zIndex    : 9999,
          // transparent during lines so hero shows through as veil slides off
          background: phase === "lines" ? "transparent" : "#000000",
          // MUST be overflow:visible — never clip children
          overflow  : "visible",
        }}>

          {/* ── Text screens ── */}
          {phase !== "lines" && (
            // This wrapper must never clip — it's just a flex centering shell
            <div style={{
              position      : "absolute",
              inset         : 0,
              display       : "flex",
              alignItems    : "center",
              justifyContent: "center",
              // Critical: no overflow hidden anywhere in this stack
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

          {/* ── Line wipe ── */}
          {phase === "lines" && (
            <Lines progress={lineProgressRef.current} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Word ─────────────────────────────────────────────────────────────────────
// FIX: every ancestor has overflow:visible; padding is generous so
// -webkit-background-clip never shears descenders or wide glyphs.
function Word({ text, visible, size, gradient, spacing, strong }) {
  return (
    <div style={{
      // Animate fade + scale
      transition  : "opacity 0.22s ease, transform 0.38s cubic-bezier(0.22,1,0.36,1)",
      opacity     : visible ? 1 : 0,
      transform   : visible ? "scale(1)" : "scale(0.96)",
      willChange  : "opacity, transform",
      // Never clip the text inside
      overflow    : "visible",
      // Give the gradient clip room to breathe on all sides
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
        // FIX: generous padding so the gradient bounding box
        // fully contains all glyphs including wide strokes & descenders.
        // -webkit-background-clip clips to the element box, not the visual glyph.
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

// ─── Lines ────────────────────────────────────────────────────────────────────
// FIX: veil has explicit zIndex:0, each line has zIndex:1.
// This guarantees lines always paint above the black veil regardless
// of browser stacking-context resolution order.
function Lines({ progress }) {
  const half = (LINE_COUNT - 1) / 2;

  // Group sweeps: -10vw (off-left, tight) → 115vw (off-right, tight)
  const groupX = -10 + progress * 125;

  // Sine envelope: 0 at start, peaks at t=0.5, back to 0 at end
  const spreadEnvelope = Math.sin(Math.PI * progress);

  // Veil leads the group slightly so lines always sweep over revealed content
  const veilX = Math.min(progress * 118, 118);

  return (
    // overflow:visible — lines must extend full viewport height with no clip
    <div style={{
      position : "absolute",
      inset    : 0,
      overflow : "visible",
    }}>

      {/* ── Black veil — MUST be zIndex:0, UNDER the lines ── */}
      <div style={{
        position  : "absolute",
        top       : 0,
        bottom    : 0,
        left      : 0,
        right     : 0,
        zIndex    : 0,           // ← explicitly behind lines
        background: "#000000",
        transform : `translateX(${veilX}vw)`,
        willChange: "transform",
      }} />

      {/* ── Lines — zIndex:1, always on top of veil ── */}
      {Array.from({ length: LINE_COUNT }).map((_, i) => {
        const indexOffset    = i - half;
        const spread         = indexOffset * MAX_SPREAD * spreadEnvelope;
        const tx             = groupX + spread;
        const isCenter       = i === Math.floor(LINE_COUNT / 2);
        const brightness     = 1 - Math.abs(indexOffset) * 0.06;
        const onScreen       = tx > -3 && tx < 103;

        return (
          <div
            key={i}
            style={{
              position  : "absolute",
              top       : 0,
              bottom    : 0,
              left      : 0,
              zIndex    : 1,                 // ← explicitly above veil
              width     : isCenter ? "1.5px" : "1px",
              background: isCenter
                ? `rgba(255,255,255,${brightness})`
                : `rgba(238,238,238,${brightness * 0.85})`,
              transform : `translateX(${tx}vw)`,
              opacity   : onScreen ? 1 : 0,
              boxShadow : isCenter
                ? "0 0 8px 2px rgba(255,255,255,0.45), 0 0 20px 4px rgba(255,255,255,0.15)"
                : "0 0 4px 1px rgba(255,255,255,0.18)",
              willChange: "transform",
            }}
          />
        );
      })}
    </div>
  );
}