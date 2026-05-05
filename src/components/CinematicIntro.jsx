import { useState, useEffect, useRef } from "react";

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
const WIPE_DURATION = 1100;   // scatter feels punchier shorter
const LETTER_DUR    = 320;
const LETTER_STAG   = 25;
const EXIT_DUR      = 180;
const PRELOAD_MS    = 220;

// ─── Scatter config ───────────────────────────────────────────────────────────
const S_COLS    = 14;         // 14×9 = 126 cells
const S_ROWS    = 9;
const S_STAGGER = 0.32;       // fraction of progress used for stagger wave

// ─── Easing ──────────────────────────────────────────────────────────────────
const easeInOutCubic = t =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const delay      = ms => new Promise(r => setTimeout(r, ms));
const waitFrames = (n = 6) =>
  new Promise(r => {
    let c = 0;
    const f = () => { ++c >= n ? r() : requestAnimationFrame(f); };
    requestAnimationFrame(f);
  });

// ─── Root ────────────────────────────────────────────────────────────────────
export default function CinematicIntro({ children, onComplete }) {
  const [screen, setScreen] = useState("s1");
  const [phase,  setPhase]  = useState("hidden");

  const lineRef     = useRef(0);
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

      await runWord("s1", 4,  400);   // Make
      await runWord("s2", 1,  340);   // A
      await runWord("s3", 10, 520);   // Difference

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
        lineRef.current = t;
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
        pointerEvents: isDone ? "auto" : "none",
        userSelect:    isDone ? "auto" : "none",
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
                <AnimWord
                  text="Make"
                  phase={phase}
                  size="clamp(130px, 21vw, 290px)"
                  gradient={CHROME}
                  spacing="-0.03em"
                />
              )}
              {screen === "s2" && (
                <AnimWord
                  text="A"
                  phase={phase}
                  size="clamp(170px, 30vw, 380px)"
                  gradient={CHROME}
                  spacing="0"
                  bigScale
                />
              )}
              {screen === "s3" && (
                <AnimWord
                  text="Difference"
                  phase={phase}
                  size="clamp(68px, 11vw, 220px)"
                  gradient={CHROME_STRONG}
                  spacing="-0.04em"
                  strong
                />
              )}
            </div>
          )}

          {screen === "lines" && (
            <ScatterReveal progress={lineRef.current} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── AnimWord ─────────────────────────────────────────────────────────────────
function AnimWord({ text, phase, size, gradient, spacing, strong, bigScale }) {
  const isIn  = phase === "reveal" || phase === "hold";
  const isOut = phase === "exit";

  if (bigScale) {
    return (
      <div style={{
        opacity:    phase === "hidden" ? 0 : isIn ? 1 : 0,
        transform:  phase === "hidden" ? "scale(1.5)" : isIn ? "scale(1)" : "scale(0.8)",
        transition: phase === "reveal"
          ? `opacity 280ms ease, transform ${LETTER_DUR}ms cubic-bezier(0.16, 1, 0.3, 1)`
          : phase === "exit"
            ? `opacity ${EXIT_DUR * 0.8}ms ease, transform ${EXIT_DUR}ms cubic-bezier(0.4, 0, 1, 1)`
            : "none",
        willChange: "transform, opacity",
      }}>
        <span style={chromeText(gradient, size, spacing, strong)}>{text}</span>
      </div>
    );
  }

  const letters = text.split("");

  return (
    <div style={{ display: "flex", alignItems: "flex-end", fontSize: size }}>
      {letters.map((ch, i) => {
        const revDelay = phase === "reveal" ? i * LETTER_STAG : 0;
        const isLast   = i === letters.length - 1;

        let transform  = "translateY(112%)";
        let transition = "none";
        if (isIn) {
          transform  = "translateY(0%)";
          transition = `transform ${LETTER_DUR}ms cubic-bezier(0.16, 1, 0.3, 1) ${revDelay}ms`;
        } else if (isOut) {
          transform  = "translateY(-112%)";
          transition = `transform ${EXIT_DUR}ms cubic-bezier(0.55, 0, 1, 0.45)`;
        }

        return (
          <div
            key={i}
            style={{
              overflow:      "hidden",
              paddingTop:    "0.06em",
              paddingBottom: "0.13em",
              marginRight:   !isLast ? spacing : "0",
            }}
          >
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

// ─── ScatterReveal ────────────────────────────────────────────────────────────
// The black screen is divided into a 14×9 grid of tiles.
// On trigger: tiles explode outward from the center — center tiles first,
// edge tiles last — each rotating and fading as they fly.
// A radial flash and crack-lines fire at the moment of impact.
function ScatterReveal({ progress }) {
  // Pre-compute per-cell constants once — stable across re-renders
  const cellsRef = useRef(null);
  if (!cellsRef.current) {
    const maxDist = Math.sqrt(0.25 + 0.25); // corner distance from center ≈ 0.707
    cellsRef.current = Array.from({ length: S_COLS * S_ROWS }).map((_, idx) => {
      const col = idx % S_COLS;
      const row = Math.floor(idx / S_COLS);
      // Normalized cell center: 0–1
      const cx = (col + 0.5) / S_COLS;
      const cy = (row + 0.5) / S_ROWS;
      // Direction vector from screen center to this cell
      const dx = cx - 0.5;
      const dy = cy - 0.5;
      const dist  = Math.sqrt(dx * dx + dy * dy);
      const normDist = dist / maxDist;       // 0 = center, 1 = corners
      const len   = Math.max(dist, 0.001);
      const nx    = dx / len;                // unit direction x
      const ny    = dy / len;                // unit direction y
      // Cells closer to center start moving first → explosion from inside out
      const staggerOffset = normDist * S_STAGGER;
      // Each cell gets a unique random rotation for organic feel
      const rotate = (Math.random() - 0.5) * 38;
      return { col, row, nx, ny, staggerOffset, rotate };
    });
  }

  const cellW = 100 / S_COLS;
  const cellH = 100 / S_ROWS;

  // ── Impact flash: radial white burst, peaks at p=0.07, gone by p=0.24 ──
  const flashOp = progress < 0.07
    ? progress / 0.07
    : progress < 0.24
      ? 1 - (progress - 0.07) / 0.17
      : 0;

  // ── Crack lines: appear instantly, fade as tiles scatter ──────────────────
  const crackOp = progress < 0.04
    ? progress / 0.04
    : progress < 0.28
      ? 1 - (progress - 0.04) / 0.24
      : 0;

  // Six cracks radiating from the center (SVG viewport-space coords 0–100)
  const CRACKS = [
    [50, 50, 94, 6],    // top-right
    [50, 50, 10, 14],   // top-left
    [50, 50, 78, 92],   // bottom-right
    [50, 50, 6, 74],    // bottom-left
    [50, 50, 98, 50],   // right
    [50, 50, 28, 98],   // bottom-left-low
  ];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>

      {/* ── Tiles ────────────────────────────────────────────────────────── */}
      {cellsRef.current.map((cell, idx) => {
        const { col, row, nx, ny, staggerOffset, rotate } = cell;
        // Local progress for this tile, 0→1
        const lp    = Math.max(0, Math.min(1, (progress - staggerOffset) / (1 - S_STAGGER)));
        // easeInCubic — tiles start slow then rocket off
        const eased = lp * lp * lp;

        const tx  = nx * eased * 155;           // vw — flies off screen
        const ty  = ny * eased * 155;           // vh
        const op  = Math.max(0, 1 - eased * 2.4);  // fade out quickly
        const rot = rotate * eased;

        return (
          <div
            key={idx}
            style={{
              position:   "absolute",
              left:       `${col * cellW}vw`,
              top:        `${row * cellH}vh`,
              width:      `calc(${cellW}vw + 1px)`,   // +1px kills subpixel gaps
              height:     `calc(${cellH}vh + 1px)`,
              background: "#000",
              transform:  `translate(${tx}vw, ${ty}vh) rotate(${rot}deg)`,
              opacity:    op,
              willChange: "transform, opacity",
            }}
          />
        );
      })}

      {/* ── Crack lines ──────────────────────────────────────────────────── */}
      {crackOp > 0.005 && (
        <svg
          style={{
            position:         "absolute",
            inset:            0,
            width:            "100%",
            height:           "100%",
            opacity:          crackOp,
            zIndex:           5,
            pointerEvents:    "none",
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {CRACKS.map(([x1, y1, x2, y2], i) => (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(255,255,255,0.65)"
              strokeWidth={i === 0 ? "0.45" : "0.22"}
              strokeLinecap="round"
            />
          ))}
          {/* Epicenter dot */}
          <circle cx="50" cy="50" r="0.6" fill="rgba(255,255,255,0.9)" />
        </svg>
      )}

      {/* ── Radial flash ─────────────────────────────────────────────────── */}
      {flashOp > 0.005 && (
        <div
          style={{
            position:   "absolute",
            inset:      0,
            zIndex:     10,
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.35) 35%, transparent 68%)",
            opacity:    flashOp,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}