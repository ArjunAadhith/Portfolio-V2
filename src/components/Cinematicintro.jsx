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
const ANIM_DURATION = 1800;

// Transition durations — must match CSS values below exactly
const SLIDE_IN_MS  = 520;  // how long the enter transition takes
const SLIDE_OUT_MS = 420;  // how long the exit transition takes

// ─── Easing ──────────────────────────────────────────────────────────────────
const easeInOutCubic = t =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const delay = ms => new Promise(r => setTimeout(r, ms));

// Wait for TWO animation frames — guarantees the browser has painted
// the current state before we trigger a CSS transition.
const nextPaint = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

// ─── Main component ──────────────────────────────────────────────────────────
export default function CinematicIntro({ children, onComplete }) {
  const [screen,  setScreen]  = useState("s1");
  // "left" | "center" | "right"
  const [wordPos, setWordPos] = useState("left");

  const lineProgressRef = useRef(0);
  const [, forceUpdate] = useState(0);
  const rafRef          = useRef(null);
  const hasRun          = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (sessionStorage.getItem("_introPlayed")) {
      setScreen("done");
      document.body.style.overflow = "";
      onComplete?.();
      return;
    }

    document.body.style.overflow = "hidden";

    (async () => {
      await showWord("s1", 700);
      await showWord("s2", 650);
      await showWord("s3", 900);

      setScreen("lines");
      await runLines();

      sessionStorage.setItem("_introPlayed", "1");
      setScreen("done");
      document.body.style.overflow = "";
      onComplete?.();
    })();

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // ── showWord ──────────────────────────────────────────────────────────────
  // 1. Mount the word at "left" (invisible, off-screen left)
  // 2. Wait for the browser to actually paint that state (double rAF)
  // 3. Set "center" → CSS transition fires: slides in smoothly from left
  // 4. Hold for `holdMs`
  // 5. Set "right" → CSS transition fires: slides out to right
  // 6. Wait the FULL exit transition duration before unmounting
  async function showWord(screenId, holdMs) {
    setScreen(screenId);
    setWordPos("left");          // mount at left, opacity 0 — NOT yet animated

    await nextPaint();           // browser paints "left" state before transition starts

    setWordPos("center");        // NOW trigger slide-in transition
    await delay(holdMs + SLIDE_IN_MS); // hold includes slide-in time

    setWordPos("right");         // trigger slide-out transition
    await delay(SLIDE_OUT_MS + 40); // wait FULL exit duration + tiny buffer before unmount
  }

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

  const isDone = screen === "done";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>

      <div style={{
        position     : "relative",
        zIndex       : 0,
        pointerEvents: isDone ? "auto" : "none",
        userSelect   : isDone ? "auto" : "none",
      }}>
        {children}
      </div>

      {!isDone && (
        <div style={{
          position  : "fixed",
          inset     : 0,
          zIndex    : 9999,
          background: screen === "lines" ? "transparent" : "#000000",
          overflow  : "hidden",
        }}>
          {screen !== "lines" && (
            <div style={{
              position      : "absolute",
              inset         : 0,
              display       : "flex",
              alignItems    : "center",
              justifyContent: "center",
              overflow      : "hidden",
            }}>
              {screen === "s1" && (
                <Word
                  text="Make"
                  pos={wordPos}
                  size="clamp(140px, 22vw, 300px)"
                  gradient={CHROME}
                  spacing="-0.03em"
                />
              )}
              {screen === "s2" && (
                <Word
                  text="A"
                  pos={wordPos}
                  size="clamp(180px, 32vw, 400px)"
                  gradient={CHROME}
                  spacing="-0.03em"
                />
              )}
              {screen === "s3" && (
                <Word
                  text="Difference"
                  pos={wordPos}
                  size="clamp(80px, 20vw, 260px)"
                  gradient={CHROME_STRONG}
                  spacing="-0.04em"
                  strong
                />
              )}
            </div>
          )}

          {screen === "lines" && (
            <WipeLines progress={lineProgressRef.current} />
          )}
        </div>
      )}
    </div>
  );
}

function Word({ text, pos, size, gradient, spacing, strong }) {
  const isEntering = pos === "center";
  const isExiting  = pos === "right";

  const tx = pos === "left" ? -110 : pos === "right" ? 110 : 0;
  const op = pos === "center" ? 1 : 0;

  // Different durations per direction so enter feels smooth, exit feels snappy
  const transDuration = isExiting ? "0.40s" : "0.50s";
  const transEasing   = isExiting
    ? "cubic-bezier(0.4, 0, 1, 1)"          // ease-in: accelerates out
    : "cubic-bezier(0.16, 1, 0.3, 1)";      // expo-out: fast start, smooth land

  return (
    <div style={{
      transition : `opacity ${transDuration} ease, transform ${transDuration} ${transEasing}`,
      opacity    : op,
      transform  : `translateX(${tx}px)`,
      willChange : "opacity, transform",
      overflow   : "visible",
      padding    : "0.2em 0.1em",
    }}>
      <span style={{
        display              : "block",
        fontFamily           : "'SF Pro Display', -apple-system, 'Helvetica Neue', Helvetica, sans-serif",
        fontWeight           : 500,
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

// ─── Left → Right Wipe ───────────────────────────────────────────────────────
function WipeLines({ progress }) {
  const veilT = easeInOutCubic(progress);
  const veilX = veilT * 106;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "visible" }}>

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

      {Array.from({ length: LINE_COUNT }).map((_, i) => {
        const staggerFraction = 0.38;
        const staggerOffset   = (i / (LINE_COUNT - 1)) * staggerFraction;
        const w               = 1 - staggerFraction;
        const lp              = Math.max(0, Math.min(1, (progress - staggerOffset) / w));
        const lpEased         = easeInOutCubic(lp);
        const tx              = -4 + lpEased * 112;
        const onScreen        = tx > -5 && tx < 107;
        const isFirst         = i === 0;
        const isMid           = i === Math.floor(LINE_COUNT / 2);
        const brightnessStep  = 1 - (i / LINE_COUNT) * 0.25;
        const lineColor       = isFirst || isMid
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