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
const SHATTER_DURATION = 1700;   // total canvas animation
const LETTER_DUR       = 320;
const LETTER_STAG      = 25;
const EXIT_DUR         = 180;
const PRELOAD_MS       = 220;

// ─── Shatter mesh ────────────────────────────────────────────────────────────
const SHARD_COLS = 9;
const SHARD_ROWS = 14;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const delay      = ms => new Promise(r => setTimeout(r, ms));
const waitFrames = (n = 6) =>
  new Promise(r => {
    let c = 0;
    const f = () => { ++c >= n ? r() : requestAnimationFrame(f); };
    requestAnimationFrame(f);
  });

// ─── Build shard geometry ────────────────────────────────────────────────────
function buildShards(W, H) {
  // Grid of points with organic jitter — edges stay pinned
  const pts = [];
  for (let r = 0; r <= SHARD_ROWS; r++) {
    for (let c = 0; c <= SHARD_COLS; c++) {
      const edge = r === 0 || r === SHARD_ROWS || c === 0 || c === SHARD_COLS;
      const jx   = edge ? 0 : (Math.random() - 0.5) * (W / SHARD_COLS) * 0.62;
      const jy   = edge ? 0 : (Math.random() - 0.5) * (H / SHARD_ROWS) * 0.62;
      pts.push([
        (c / SHARD_COLS) * W + jx,
        (r / SHARD_ROWS) * H + jy,
      ]);
    }
  }

  const cx0     = W / 2;
  const cy0     = H / 2;
  const maxDist = Math.hypot(cx0, cy0);
  const shards  = [];

  for (let r = 0; r < SHARD_ROWS; r++) {
    for (let c = 0; c < SHARD_COLS; c++) {
      const tl = r * (SHARD_COLS + 1) + c;
      for (const [a, b, cc] of [
        [pts[tl],     pts[tl + 1],              pts[tl + SHARD_COLS + 1]],
        [pts[tl + 1], pts[tl + SHARD_COLS + 2], pts[tl + SHARD_COLS + 1]],
      ]) {
        const centX  = (a[0] + b[0] + cc[0]) / 3;
        const centY  = (a[1] + b[1] + cc[1]) / 3;
        const dx     = centX - cx0;
        const dy     = centY - cy0;
        // Radial distance → determines when this shard starts (center goes first)
        const dist   = Math.hypot(dx, dy) / maxDist;
        const angle  = Math.atan2(dy, dx);
        const delay_ = dist * 0.48 + (Math.random() - 0.5) * 0.06;

        shards.push({
          pts:    [a, b, cc],
          centX,  centY,
          angle,
          delay:  Math.max(0, Math.min(0.72, delay_)),
          rotDir: Math.random() > 0.5 ? 1 : -1,
          rotAmt: 0.25 + Math.random() * 0.55,
          // Slight colour tint — some shards are cooler/warmer (very subtle)
          tint:   Math.random() > 0.85 ? "rgba(20,20,35,1)" : "#000",
        });
      }
    }
  }
  return shards;
}

// ─── Root ────────────────────────────────────────────────────────────────────
export default function CinematicIntro({ children, onComplete }) {
  const [screen, setScreen] = useState("s1");
  const [phase,  setPhase]  = useState("hidden");

  const progressRef  = useRef(0);
  const [, repaint]  = useState(0);
  const rafRef       = useRef(null);
  const hasRun       = useRef(false);

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

      await delay(80);                // breath before shatter
      setScreen("lines");
      await runShatter();

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

  function runShatter() {
    return new Promise(resolve => {
      const start = performance.now();
      const frame = now => {
        const t = Math.min((now - start) / SHATTER_DURATION, 1);
        progressRef.current = t;
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
        pointerEvents: isDone ? "auto"  : "none",
        userSelect:    isDone ? "auto"  : "none",
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
                  size="clamp(130px, 21vw, 290px)" gradient={CHROME} spacing="-0.03em" />
              )}
              {screen === "s2" && (
                <AnimWord text="A" phase={phase}
                  size="clamp(170px, 30vw, 380px)" gradient={CHROME} spacing="0" bigScale />
              )}
              {screen === "s3" && (
                <AnimWord text="Difference" phase={phase}
                  size="clamp(68px, 11vw, 220px)" gradient={CHROME_STRONG}
                  spacing="-0.04em" strong />
              )}
            </div>
          )}

          {screen === "lines" && (
            <ShatterReveal progress={progressRef.current} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── AnimWord (unchanged) ─────────────────────────────────────────────────────
function AnimWord({ text, phase, size, gradient, spacing, strong, bigScale }) {
  const isIn  = phase === "reveal" || phase === "hold";
  const isOut = phase === "exit";

  if (bigScale) {
    return (
      <div style={{
        opacity:   phase === "hidden" ? 0 : isIn ? 1 : 0,
        transform: phase === "hidden" ? "scale(1.5)" : isIn ? "scale(1)" : "scale(0.8)",
        transition: phase === "reveal"
          ? `opacity 280ms ease, transform ${LETTER_DUR}ms cubic-bezier(0.16, 1, 0.3, 1)`
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
          transition = `transform ${LETTER_DUR}ms cubic-bezier(0.16, 1, 0.3, 1) ${revDelay}ms`;
        } else if (isOut) {
          transform  = "translateY(-112%)";
          transition = `transform ${EXIT_DUR}ms cubic-bezier(0.55, 0, 1, 0.45)`;
        }
        return (
          <div key={i} style={{
            overflow: "hidden", paddingTop: "0.06em", paddingBottom: "0.13em",
            marginRight: !isLast ? spacing : "0",
          }}>
            <span style={{
              ...chromeText(gradient, size, "0", strong),
              display: "block", transform, transition, willChange: "transform",
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

// ─── ShatterReveal ────────────────────────────────────────────────────────────
// Canvas-based: ~252 irregular black triangles explode outward from center,
// each rotating and fading as it flies. Glowing edges simulate glass catching
// light. Center shards launch first — radial wave propagates outward.
function ShatterReveal({ progress }) {
  const canvasRef = useRef(null);
  const shardsRef = useRef(null);
  const sizeRef   = useRef({ W: 1, H: 1 });

  // Initialise canvas + build shard geometry once (and on resize)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const init = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
      sizeRef.current  = { W, H };
      shardsRef.current = buildShards(W, H);
    };

    init();
    window.addEventListener("resize", init);
    return () => window.removeEventListener("resize", init);
  }, []);

  // Draw every frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !shardsRef.current) return;
    const ctx       = canvas.getContext("2d");
    const { W, H }  = sizeRef.current;
    const maxFly    = Math.max(W, H) * 1.05;

    ctx.clearRect(0, 0, W, H);

    // ── Impact flash: white bloom at the very start ─────────────────────────
    if (progress < 0.09) {
      const f = (0.09 - progress) / 0.09;
      ctx.fillStyle = `rgba(255,255,255,${f * 0.18})`;
      ctx.fillRect(0, 0, W, H);
    }

    // ── Draw each shard ──────────────────────────────────────────────────────
    for (const s of shardsRef.current) {
      const window_ = 1 - s.delay;
      const lp      = window_ <= 0
        ? 1
        : Math.max(0, Math.min(1, (progress - s.delay) / window_));

      if (lp >= 1) continue; // fully gone — skip

      // Cubic ease-in: shards accelerate as they exit (feels explosive)
      const eased  = lp * lp * lp;
      const flyX   = Math.cos(s.angle) * eased * maxFly;
      const flyY   = Math.sin(s.angle) * eased * maxFly;
      const rot    = s.rotDir * s.rotAmt * eased;
      // Quadratic fade — stays opaque longer, then drops fast
      const alpha  = Math.pow(1 - lp, 1.8);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(s.centX + flyX, s.centY + flyY);
      ctx.rotate(rot);
      ctx.translate(-s.centX, -s.centY);

      ctx.beginPath();
      ctx.moveTo(s.pts[0][0], s.pts[0][1]);
      ctx.lineTo(s.pts[1][0], s.pts[1][1]);
      ctx.lineTo(s.pts[2][0], s.pts[2][1]);
      ctx.closePath();

      ctx.fillStyle = s.tint;
      ctx.fill();

      // Glowing edge — peaks in the middle of the flight arc
      if (lp > 0.04 && lp < 0.88) {
        const edgeA = Math.sin(lp * Math.PI) * 0.28;
        ctx.strokeStyle = `rgba(255,255,255,${edgeA})`;
        ctx.lineWidth   = 0.75;
        ctx.stroke();
      }

      ctx.restore();
    }
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset:    0,
        width:    "100%",
        height:   "100%",
        display:  "block",
      }}
    />
  );
}