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
const PANEL_COUNT   = 9;
const LINE_COUNT    = 11;
const WIPE_DURATION = 1600;
const LETTER_DUR    = 320;
const LETTER_STAG   = 25;
const EXIT_DUR      = 180;
const PRELOAD_MS    = 220;

// ─── Easing ──────────────────────────────────────────────────────────────────
const easeInOutCubic = t =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const easeOutExpo = t =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

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
                <AnimWord text="Make"       phase={phase} size="clamp(130px, 21vw, 290px)" gradient={CHROME}        spacing="-0.03em" />
              )}
              {screen === "s2" && (
                <AnimWord text="A"          phase={phase} size="clamp(170px, 30vw, 380px)" gradient={CHROME}        spacing="0"       bigScale />
              )}
              {screen === "s3" && (
                <AnimWord text="Difference" phase={phase} size="clamp(68px, 11vw, 220px)"  gradient={CHROME_STRONG} spacing="-0.04em" strong />
              )}
            </div>
          )}

          {screen === "lines" && (
            <PanelReveal progress={lineRef.current} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── AnimWord ────────────────────────────────────────────────────────────────
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

// ─── PanelReveal ─────────────────────────────────────────────────────────────
// REPLACES WipeLines. N vertical black slabs drop away downward in a staggered
// cascade (left → right). Each slab has a glowing top edge that streaks
// downward like a blade of light just before the panel exits.
// A secondary "speed line" races ahead of the main slab for extra depth.
function PanelReveal({ progress }) {
  // How far into the timeline the stagger window occupies (0‒1)
  const STAG_FRAC  = 0.42;
  // Extra "speed line" that races ~18% ahead of its parent panel
  const SPEED_LEAD = 0.18;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {Array.from({ length: PANEL_COUNT }).map((_, i) => {
        const panelW    = 100 / PANEL_COUNT;
        const offset    = (i / (PANEL_COUNT - 1)) * STAG_FRAC;
        const localP    = Math.max(0, Math.min(1, (progress - offset) / (1 - STAG_FRAC)));
        const eased     = easeOutExpo(localP);

        // Panel drops from translateY(0) → translateY(105vh)
        const panelY    = eased * 105;

        // Speed line races ahead — clamped so it disappears before panel does
        const speedLocalP = Math.max(0, Math.min(1, (progress - offset) / (1 - STAG_FRAC - SPEED_LEAD)));
        const speedEased  = easeOutExpo(speedLocalP);
        const speedY      = speedEased * 105;

        // Glow on the leading (top) edge of the panel — brightest in the middle panels
        const midness   = 1 - Math.abs(i - (PANEL_COUNT - 1) / 2) / ((PANEL_COUNT - 1) / 2);
        const glowAlpha = 0.55 + midness * 0.35;
        const glowSpread = 6 + midness * 10;

        // Panel is "active" (visible on screen) between these Y values
        const panelVisible  = panelY < 106;
        const speedVisible  = speedY < 106 && speedY > panelY + 0.5;

        return (
          <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: `${i * panelW}%`, width: `${panelW}%` }}>

            {/* ── Speed line: thin bright strip racing ahead of the panel ── */}
            {speedVisible && (
              <div style={{
                position:   "absolute",
                left:       0,
                right:      0,
                top:        0,
                height:     "3px",
                transform:  `translateY(${speedY}vh)`,
                background: `rgba(255,255,255,${glowAlpha * 0.6})`,
                boxShadow:  `0 0 ${glowSpread * 0.6}px ${glowSpread * 0.3}px rgba(255,255,255,0.25)`,
                willChange: "transform",
              }} />
            )}

            {/* ── Main panel ── */}
            {panelVisible && (
              <div style={{
                position:   "absolute",
                left:       0,
                right:      0,
                top:        0,
                bottom:     "-5vh",         // extend slightly past viewport bottom
                transform:  `translateY(${panelY}vh)`,
                background: "#000",
                willChange: "transform",
              }}>
                {/* Glowing top edge of the panel — the "blade" */}
                <div style={{
                  position:   "absolute",
                  top:        0,
                  left:       0,
                  right:      0,
                  height:     "2px",
                  background: `rgba(255,255,255,${glowAlpha})`,
                  boxShadow:  `0 0 ${glowSpread}px ${glowSpread / 2}px rgba(255,255,255,${glowAlpha * 0.45})`,
                }} />

                {/* Subtle gradient just below the leading edge — motion blur feel */}
                <div style={{
                  position:   "absolute",
                  top:        "2px",
                  left:       0,
                  right:      0,
                  height:     "32px",
                  background: `linear-gradient(to bottom, rgba(255,255,255,${glowAlpha * 0.12}), transparent)`,
                }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}