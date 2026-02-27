import { useState, useEffect, useRef } from "react";

// ─── Chrome Gradients ────────────────────────────────────────────────────────
const CHROME = `linear-gradient(
  180deg,
  #ffffff 0%, #e8e8e8 15%, #f4f4f4 28%,
  #9e9e9e 44%, #ebebeb 54%, #bdbdbd 67%,
  #f0f0f0 79%, #878787 100%
)`;

const CHROME_STRONG = `linear-gradient(
  165deg,
  #ffffff 0%, #dedede 10%, #f7f7f7 20%,
  #acacac 34%, #f2f2f2 46%, #959595 58%,
  #f4f4f4 70%, #a8a8a8 83%, #ffffff 100%
)`;

// ─── Wipe Config ─────────────────────────────────────────────────────────────
// Horizontal slats: each one slides off to the RIGHT.
// Stagger radiates outward from the center slat — so center exits first,
// top/bottom edges exit last. Feels like a premium venetian blind opening.
const SLAT_COUNT    = 16;   // number of horizontal strips
const ANIM_DURATION = 1600; // ms — total wipe window (stagger spreads within this)
const STAGGER_DEPTH = 0.42; // fraction of ANIM_DURATION used for staggering

// ─── Easing ──────────────────────────────────────────────────────────────────
const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
const easeInOutCubic = t =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const delay = ms => new Promise(r => setTimeout(r, ms));

// ─── Main ────────────────────────────────────────────────────────────────────
export default function CinematicIntro({ children, onComplete }) {
  const [phase,       setPhase]       = useState("s1");
  const [wordVisible, setWordVisible] = useState(false);
  const wipeProgress                  = useRef(0);  // 0 → 1 raw time progress
  const [, tick]                      = useState(0);
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
      setPhase("wipe");
      await runWipe();

      sessionStorage.setItem("_introPlayed", "1");
      setPhase("done");
      document.body.style.overflow = "";
      onComplete?.();
    })();

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  function runWipe() {
    return new Promise(resolve => {
      const start = performance.now();
      const total = ANIM_DURATION;

      const frame = now => {
        const raw = Math.min((now - start) / total, 1);
        wipeProgress.current = raw;
        tick(raw);
        if (raw < 1) rafRef.current = requestAnimationFrame(frame);
        else resolve();
      };
      rafRef.current = requestAnimationFrame(frame);
    });
  }

  const isDone = phase === "done";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>

      {/* Underlying content */}
      <div style={{
        position     : "relative",
        zIndex       : 0,
        pointerEvents: isDone ? "auto" : "none",
        userSelect   : isDone ? "auto" : "none",
      }}>
        {children}
      </div>

      {/* Intro overlay */}
      {!isDone && (
        <div style={{
          position  : "fixed",
          inset     : 0,
          zIndex    : 9999,
          background: phase === "wipe" ? "transparent" : "#000000",
          overflow  : "visible",
        }}>

          {/* Text screens */}
          {phase !== "wipe" && (
            <div style={{
              position      : "absolute",
              inset         : 0,
              display       : "flex",
              alignItems    : "center",
              justifyContent: "center",
              overflow      : "visible",
            }}>
              {phase === "s1" && (
                <Word text="Make"       visible={wordVisible} size="clamp(120px,18vw,260px)" gradient={CHROME}        spacing="-0.03em" />
              )}
              {phase === "s2" && (
                <Word text="A"          visible={wordVisible} size="clamp(160px,28vw,340px)" gradient={CHROME}        spacing="-0.03em" />
              )}
              {phase === "s3" && (
                <Word text="Difference" visible={wordVisible} size="clamp(72px,17vw,230px)"  gradient={CHROME_STRONG} spacing="-0.04em" strong />
              )}
            </div>
          )}

          {/* Slat wipe */}
          {phase === "wipe" && (
            <Slats progress={wipeProgress.current} />
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
      transition : "opacity 0.22s ease, transform 0.38s cubic-bezier(0.22,1,0.36,1)",
      opacity    : visible ? 1 : 0,
      transform  : visible ? "scale(1)" : "scale(0.96)",
      willChange : "opacity, transform",
      overflow   : "visible",
      padding    : "0.2em 0.1em",
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

// ─── Slats ────────────────────────────────────────────────────────────────────
// N horizontal strips stacked to fill the screen.
// Each slat slides off to the RIGHT using translateX.
// Stagger is center-out: the middle slat exits first, edges last.
// Each slat also has a 1px bright highlight on its bottom edge — a subtle
// chrome-trim detail that reads as premium as it exits.
function Slats({ progress }) {
  const n          = SLAT_COUNT;
  const slatH      = `${100 / n}vh`;   // exact equal share of viewport
  const centerIdx  = (n - 1) / 2;      // 7.5 for 16 slats

  return (
    <div style={{
      position : "absolute",
      inset    : 0,
      overflow : "hidden",  // contain slats to viewport — they slide out rightward
    }}>
      {Array.from({ length: n }).map((_, i) => {
        // Distance from center (0 = center, 1 = outermost)
        const distFromCenter = Math.abs(i - centerIdx) / centerIdx; // 0 → 1

        // Center slat starts first. Edge slats start later.
        // Each slat's local start is offset by distFromCenter × STAGGER_DEPTH
        const localStart = distFromCenter * STAGGER_DEPTH;
        const localEnd   = 1.0;

        // Normalize progress for this slat: 0 → 1 within its window
        const localT = Math.max(0, Math.min(1,
          (progress - localStart) / (localEnd - localStart)
        ));

        // Apply ease-out-expo so each slat fires fast then eases to rest off-screen
        const easedT = easeOutExpo(localT);

        // translateX: 0% (covering) → 105% (fully off-screen right)
        const tx = easedT * 105;

        // Subtle brightness taper: center slats slightly brighter (more contrast)
        // to reinforce depth layering
        const shade = Math.round(0 + distFromCenter * 18); // 0 → 18
        const bg    = `rgb(${shade}, ${shade}, ${shade})`;

        return (
          <div
            key={i}
            style={{
              position  : "absolute",
              left      : 0,
              right     : 0,
              top       : `${(i / n) * 100}%`,
              height    : slatH,
              zIndex    : 1,
              background: bg,
              transform : `translateX(${tx}%)`,
              willChange: "transform",
              // 1px highlight trim on bottom edge of each slat
              // gives a chrome-blade edge feel as they slide
              boxShadow : "inset 0 -1px 0 rgba(255,255,255,0.18)",
            }}
          />
        );
      })}
    </div>
  );
}