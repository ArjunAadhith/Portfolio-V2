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
const LINE_COUNT    = 11;
const ANIM_DURATION = 1800; // ms

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
        lineProgressRef.current = raw;
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
            <WipeLines progress={lineProgressRef.current} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Word ─────────────────────────────────────────────────────────────────────
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

// ─── Left → Right Wipe ────────────────────────────────────────────────────────
//
// HOW IT WORKS:
//   The black veil is a single full-screen div that slides off to the right,
//   driven purely by rAF — no CSS transition fighting it.
//
//   11 vertical lines sit on top of the veil (zIndex:1).
//   Each line has a fixed stagger delay (0 … 0.4 of the timeline).
//   Within its window, each line travels from -2vw → 104vw.
//   Lines are spaced ~2vw apart at their stagger offsets so they appear as
//   a tight-but-readable bundle, not a single thick stripe.
//
//   The leading line slightly trails the veil edge — it looks like the veil
//   is being torn by the bundle of lines.
//
function WipeLines({ progress }) {

  // ── Veil ──
  // Starts at translateX(0) = covering full screen.
  // Ends at translateX(105vw) = fully off screen to the right.
  // Use easeInOutCubic for a controlled, premium feel.
  const veilT = easeInOutCubic(progress);
  const veilX = veilT * 106; // vw

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "visible" }}>

      {/* ── Black veil — slides RIGHT, always behind lines ── */}
      <div style={{
        position  : "absolute",
        top       : 0,
        bottom    : 0,
        left      : 0,
        right     : 0,
        zIndex    : 0,
        background: "#000000",
        transform : `translateX(${veilX}vw)`,
        willChange: "transform",
      }} />

      {/* ── Lines ── */}
      {Array.from({ length: LINE_COUNT }).map((_, i) => {
        // Stagger: line 0 leads, line N-1 is last
        // Each line starts and ends in tight sequence
        const staggerFraction = 0.38;                          // total stagger window
        const staggerOffset   = (i / (LINE_COUNT - 1)) * staggerFraction;
        const window          = 1 - staggerFraction;

        // Normalized progress for this individual line (0 → 1)
        const lp = Math.max(0, Math.min(1,
          (progress - staggerOffset) / window
        ));

        const lpEased = easeInOutCubic(lp);

        // Travel: -4vw (off left) → 106vw (off right)
        const tx = -4 + lpEased * 112;

        // Only render when in or near viewport
        const onScreen = tx > -5 && tx < 107;

        const isFirst  = i === 0;
        const isMid    = i === Math.floor(LINE_COUNT / 2);

        // Leading line (i=0) is brightest; trailing lines step down slightly
        const brightnessStep = 1 - (i / LINE_COUNT) * 0.25;
        const lineColor = isFirst || isMid
          ? `rgba(255,255,255,${brightnessStep})`
          : `rgba(228,228,228,${brightnessStep * 0.88})`;

        return (
          <div
            key={i}
            style={{
              position  : "absolute",
              top       : 0,
              bottom    : 0,
              left      : 0,
              zIndex    : 1,
              width     : isFirst ? "2px" : isMid ? "1.5px" : "1px",
              background: lineColor,
              transform : `translateX(${tx}vw)`,
              opacity   : onScreen ? 1 : 0,
              boxShadow : isFirst
                ? "0 0 12px 4px rgba(255,255,255,0.55), 0 0 28px 8px rgba(255,255,255,0.18)"
                : isMid
                  ? "0 0 8px 2px rgba(255,255,255,0.35), 0 0 18px 4px rgba(255,255,255,0.12)"
                  : "0 0 3px 1px rgba(255,255,255,0.15)",
              willChange: "transform",
            }}
          />
        );
      })}
    </div>
  );
}