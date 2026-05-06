import { useState, useEffect, useRef, useMemo } from "react";

// ─── Chrome Gradients ────────────────────────────────────────────────────────
const CHROME = `linear-gradient(
  160deg,
  #fff 0%, #ccc 20%, #f8f8f8 38%,
  #888 52%, #efefef 68%, #aaa 85%, #fff 100%
)`;
const CHROME_STRONG = `linear-gradient(
  155deg,
  #fff 0%, #d5d5d5 18%, #f9f9f9 34%,
  #8e8e8e 50%, #eee 65%, #b0b0b0 80%, #fff 100%
)`;

// ─── Timing ──────────────────────────────────────────────────────────────────
const WIPE_DURATION = 1700;
const LETTER_DUR    = 320;
const LETTER_STAG   = 25;
const EXIT_DUR      = 180;
const PRELOAD_MS    = 220;

// ─── Scatter grid ────────────────────────────────────────────────────────────
const COLS = 11;
const ROWS = 9;

// ─── Easing ──────────────────────────────────────────────────────────────────
const easeInOutCubic = t =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutExpo = t =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
const easeInQuint = t => t * t * t * t * t;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const delay      = ms => new Promise(r => setTimeout(r, ms));
const waitFrames = (n = 6) =>
  new Promise(r => {
    let c = 0;
    const f = () => { ++c >= n ? r() : requestAnimationFrame(f); };
    requestAnimationFrame(f);
  });

// Deterministic pseudo-random from a seed integer
const prng = seed => {
  let s = seed ^ 0xdeadbeef;
  s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
  s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
  return ((s ^ (s >>> 16)) >>> 0) / 0xffffffff;
};

// ─── Root ────────────────────────────────────────────────────────────────────
export default function CinematicIntro({ children, onComplete }) {
  const [screen, setScreen] = useState("s1");
  const [phase,  setPhase]  = useState("hidden");

  const wipeRef     = useRef(0);
  const [, repaint] = useState(0);
  const rafRef      = useRef(null);
  const hasRun      = useRef(false);

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
      await delay(PRELOAD_MS);

      await runWord("s1", 4,  400);
      await runWord("s2", 1,  340);
      await runWord("s3", 10, 520);

      setScreen("lines");
      await runWipe();

      sessionStorage.setItem("_introPlayed", "1");
      setScreen("done");
      document.body.style.overflow = "";
      onComplete?.();
    })();

    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, []);

  async function runWord(id, letterCount, holdMs) {
    setScreen(id);
    setPhase("hidden");
    await waitFrames(6);

    setPhase("reveal");
    await delay(LETTER_DUR + (letterCount - 1) * LETTER_STAG + 20);

    setPhase("hold");
    await delay(holdMs);

    setPhase("exit");
    await delay(EXIT_DUR + 60);
  }

  function runWipe() {
    return new Promise(resolve => {
      const start = performance.now();
      const frame = now => {
        const t = Math.min((now - start) / WIPE_DURATION, 1);
        wipeRef.current = t;
        repaint(t);
        t < 1 ? (rafRef.current = requestAnimationFrame(frame)) : resolve();
      };
      rafRef.current = requestAnimationFrame(frame);
    });
  }

  const isDone = screen === "done";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>

      <div style={{
        position:      "relative",
        zIndex:        0,
        pointerEvents: isDone ? "auto"   : "none",
        userSelect:    isDone ? "auto"   : "none",
      }}>
        {children}
      </div>

      {!isDone && (
        <div style={{
          position:   "fixed",
          inset:      0,
          zIndex:     9999,
          background: screen === "lines" ? "transparent" : "#000",
          overflow:   "hidden",
        }}>
          {screen !== "lines" && (
            <div style={{
              position:       "absolute",
              inset:          0,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
            }}>
              {screen === "s1" && (
                <AnimWord text="Make" phase={phase}
                  size="clamp(130px, 21vw, 290px)"
                  gradient={CHROME} spacing="-0.03em" />
              )}
              {screen === "s2" && (
                <AnimWord text="A" phase={phase}
                  size="clamp(170px, 30vw, 380px)"
                  gradient={CHROME} spacing="0" bigScale />
              )}
              {screen === "s3" && (
                <AnimWord text="Difference" phase={phase}
                  size="clamp(68px, 11vw, 220px)"
                  gradient={CHROME_STRONG} spacing="-0.04em" strong />
              )}
            </div>
          )}

          {screen === "lines" && (
            <ShockwaveReveal progress={wipeRef.current} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── AnimWord ────────────────────────────────────────────────────────────────
function AnimWord({ text, phase, size, gradient, spacing, strong, bigScale }) {
  const isIn  = phase === "reveal" || phase === "hold";

  if (bigScale) {
    return (
      <div style={{
        opacity:    phase === "hidden" ? 0 : isIn ? 1 : 0,
        transform:  phase === "hidden" ? "scale(1.5)" : isIn ? "scale(1)" : "scale(0.8)",
        transition: phase === "reveal"
          ? `opacity 280ms ease, transform ${LETTER_DUR}ms cubic-bezier(0.16,1,0.3,1)`
          : phase === "exit"
            ? `opacity ${EXIT_DUR * 0.8}ms ease, transform ${EXIT_DUR}ms cubic-bezier(0.4,0,1,1)`
            : "none",
        willChange: "transform, opacity",
      }}>
        <span style={chromeText(gradient, size, spacing, strong)}>{text}</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-end", fontSize: size }}>
      {text.split("").map((ch, i) => {
        const revDelay = phase === "reveal" ? i * LETTER_STAG : 0;
        const isLast   = i === text.length - 1;
        let transform  = "translateY(112%)";
        let transition = "none";
        if (isIn) {
          transform  = "translateY(0%)";
          transition = `transform ${LETTER_DUR}ms cubic-bezier(0.16,1,0.3,1) ${revDelay}ms`;
        } else if (phase === "exit") {
          transform  = "translateY(-112%)";
          transition = `transform ${EXIT_DUR}ms cubic-bezier(0.55,0,1,0.45)`;
        }
        return (
          <div key={i} style={{
            overflow:      "hidden",
            paddingTop:    "0.06em",
            paddingBottom: "0.13em",
            marginRight:   !isLast ? spacing : "0",
          }}>
            <span style={{
              ...chromeText(gradient, size, "0", strong),
              display:    "block",
              transform,
              transition,
              willChange: "transform",
            }}>
              {ch === " " ? "\u00A0" : ch}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function chromeText(gradient, size, spacing, strong) {
  return {
    fontFamily:           "'SF Pro Display', -apple-system, 'Helvetica Neue', Helvetica, sans-serif",
    fontWeight:           500,
    fontSize:             size,
    letterSpacing:        spacing,
    lineHeight:           1,
    whiteSpace:           "nowrap",
    background:           gradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor:  "transparent",
    backgroundClip:       "text",
    userSelect:           "none",
    filter:               strong
      ? "drop-shadow(0 0 40px rgba(255,255,255,0.12))"
      : "drop-shadow(0 0 28px rgba(255,255,255,0.08))",
  };
}

// ─── ShockwaveReveal ─────────────────────────────────────────────────────────
//
// Phase 1 (progress 0 → 0.18): Full black screen contracts slightly — a held
//   breath before the explosion.
//
// Phase 2 (progress 0.18 → 1.0): An invisible shockwave expands outward from
//   center. Each tile it crosses launches along its angle-from-center, spinning
//   and fading as it clears. Center tiles go first; corner tiles last.
//   Result: a starburst scatter that reveals the content beneath.
//
function ShockwaveReveal({ progress }) {
  // Pre-compute tile data once — deterministic, never changes
  const tiles = useMemo(() => {
    const list = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const seed = r * COLS + c;

        // Normalised position relative to center (-0.5 … +0.5)
        const nx = (c + 0.5) / COLS - 0.5;
        const ny = (r + 0.5) / ROWS - 0.5;

        // Distance from center (0 = center, 1 = corner)
        const dist = Math.sqrt(nx * nx + ny * ny) / Math.sqrt(0.5 * 0.5 + 0.5 * 0.5);

        // Primary scatter angle: directly away from center
        const baseAngle = Math.atan2(ny, nx);

        // Add a small deterministic twist so it doesn't look perfectly radial
        const twist = (prng(seed) - 0.5) * 0.6; // ±0.3 rad (~17°)
        const angle = baseAngle + twist;

        // Travel distance: further tiles need a bigger kick to clear the viewport
        const travel = 110 + prng(seed + 7) * 55; // 110–165 vw/vh units

        // Rotation: tiles spin as they fly; direction alternates by seed
        const spinDir = prng(seed + 13) > 0.5 ? 1 : -1;
        const spinAmt = 30 + prng(seed + 19) * 80; // 30°–110°

        list.push({ r, c, dist, angle, travel, spinDir, spinAmt });
      }
    }
    return list;
  }, []);

  // Phase split
  const PULSE_END   = 0.18;  // contraction breath
  const SCATTER_END = 1.0;

  // Global scale pulse: 1 → 0.96 → starts scatter
  const pulseT    = Math.min(progress / PULSE_END, 1);
  const pulseEase = easeInOutCubic(pulseT);
  // Scale goes 1 → 0.96 during pulse, then back toward 1 as tiles scatter
  const scatterT  = Math.max(0, (progress - PULSE_END) / (SCATTER_END - PULSE_END));
  const globalScale = pulseT < 1
    ? 1 - pulseEase * 0.04               // contracting
    : 0.96 + easeOutExpo(scatterT) * 0.04; // expanding back

  // How far the shockwave has traveled (0 = center, 1 = corner)
  // Wave front reaches corners at progress ~0.75, giving tiles time to exit
  const WAVE_SPEED  = 1 / 0.58; // wave completes at progress 0.76
  const waveFront   = Math.min(easeOutExpo(scatterT) * WAVE_SPEED, 1.5);

  const tileW = 100 / COLS;
  const tileH = 100 / ROWS;

  return (
    <div style={{
      position:   "absolute",
      inset:      0,
      transform:  `scale(${globalScale})`,
      willChange: "transform",
    }}>
      {tiles.map(({ r, c, dist, angle, travel, spinDir, spinAmt }) => {
        // How far past this tile the wave front is (negative = not reached yet)
        const waveExcess = waveFront - dist;

        // Local progress for this tile: 0 before wave, 1 when fully exited
        // Give each tile a short window (0.18 of wave travel) to launch in
        const LAUNCH_WINDOW = 0.22;
        const lp = waveExcess < 0
          ? 0
          : Math.min(waveExcess / LAUNCH_WINDOW, 1);

        // Tile starts moving with a sharp ease: slow start, then rocket away
        const eased = easeInQuint(lp);

        const tx  = Math.cos(angle) * travel * eased;
        const ty  = Math.sin(angle) * travel * eased;
        const rot = spinDir * spinAmt * eased;

        // Fade: tile is fully opaque until 55% of its journey, then fades to 0
        const opacity = lp < 0.55 ? 1 : 1 - (lp - 0.55) / 0.45;

        return (
          <div
            key={`${r}-${c}`}
            style={{
              position:   "absolute",
              left:       `${c * tileW}%`,
              top:        `${r * tileH}%`,
              // Slightly oversized to close any sub-pixel seams
              width:      `calc(${tileW}% + 1px)`,
              height:     `calc(${tileH}% + 1px)`,
              background: "#000",
              opacity,
              transform:  `translate(${tx}vw, ${ty}vh) rotate(${rot}deg)`,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </div>
  );
}