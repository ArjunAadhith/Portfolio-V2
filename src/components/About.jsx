import { useEffect, useRef, useState, useMemo } from "react";
import Shuffle from "./Shuffle";
import ScrollReveal from "./ScrollReveal";
import MoreAbout from "./Moreabout.jsx";               // ← ADD THIS

const TITLES = [
  "UI/UX Designer",
  "Graphic Designer",
  "Product Designer",
  "Visual Designer",
  "Developer",
];

function useTypewriter(words, typingSpeed = 75, erasingSpeed = 40, pause = 1600) {
  const [displayed, setDisplayed] = useState(words[0]);
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState("pausing");
  useEffect(() => {
    let timeout;
    const current = words[wordIndex];
    if (phase === "typing") {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), typingSpeed);
      } else {
        timeout = setTimeout(() => setPhase("pausing"), pause);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("erasing"), 200);
    } else if (phase === "erasing") {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), erasingSpeed);
      } else {
        const next = (wordIndex + 1) % words.length;
        setWordIndex(next);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, phase, wordIndex, words, typingSpeed, erasingSpeed, pause]);
  return displayed;
}

const COLS = 16;
const ROWS = 20;
const TOTAL = COLS * ROWS;

function PixelOverlay({ reveal }) {
  const delays = useMemo(() => Array.from({ length: TOTAL }, () => Math.random() * 900), []);
  return (
    <div style={{ position:"absolute", inset:0, display:"grid",
      gridTemplateColumns:`repeat(${COLS},1fr)`, gridTemplateRows:`repeat(${ROWS},1fr)`,
      pointerEvents:"none", zIndex:2 }}>
      {delays.map((delay, i) => (
        <div key={i} style={{
          background:"#E8E8E8", borderRadius:"2px", transformOrigin:"center",
          transform: reveal ? "scale(0)" : "scale(1)",
          opacity: reveal ? 0 : 1,
          transition: reveal
            ? `transform 0.55s cubic-bezier(0.4,0,0.2,1) ${delay}ms, opacity 0.55s cubic-bezier(0.4,0,0.2,1) ${delay}ms`
            : `transform 0.4s cubic-bezier(0.4,0,0.2,1) ${900-delay}ms, opacity 0.4s cubic-bezier(0.4,0,0.2,1) ${900-delay}ms`,
        }}/>
      ))}
    </div>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [imgVisible, setImgVisible] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);    // ← ADD THIS
  const typedTitle = useTypewriter(TITLES);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
        setImgVisible(entry.isIntersecting);
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @font-face { font-family:'SF Pro Display'; src:url('/src/assets/fonts/SF-Pro-Display-Regular.otf') format('opentype'); font-weight:400; }
        @font-face { font-family:'SF Pro Display'; src:url('/src/assets/fonts/SF-Pro-Display-Bold.otf') format('opentype'); font-weight:700; }
        @font-face { font-family:'SF Pro Display'; src:url('/src/assets/fonts/SF-Pro-Display-Heavy.otf') format('opentype'); font-weight:800; }
        @font-face { font-family:'SF Pro Text'; src:url('/src/assets/fonts/SF-Pro-Text-Regular.otf') format('opentype'); font-weight:400; }
        @font-face { font-family:'SF Pro Text'; src:url('/src/assets/fonts/SF-Pro-Text-Light.otf') format('opentype'); font-weight:300; }

        .about-section { width:100%; min-height:100vh; background:#E8E8E8; display:flex; align-items:center; position:relative; }
        .about-inner { width:100%; max-width:1440px; margin:0 auto; padding:0 9%; display:flex; align-items:center; justify-content:space-between; min-height:100vh; }
        .about-left { flex:0 0 auto; width:44%; display:flex; flex-direction:column; align-items:flex-start; margin-left:-25px; }
        .about-heading { margin:0 0 40px 0; padding:0 0 8px 0; font-family:'SF Pro Display',-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif; font-size:clamp(48px,5.2vw,76px); font-weight:800; line-height:1.06; letter-spacing:-0.03em; color:#111; -webkit-font-smoothing:antialiased; overflow:visible; }
        .reveal-block { display:block; overflow:visible; }
        .reveal-inner { display:block; opacity:0; transform:translateY(52px); overflow:visible; transition:opacity 0.75s cubic-bezier(0.22,1,0.36,1),transform 0.75s cubic-bezier(0.22,1,0.36,1); }
        .reveal-inner.d1{transition-delay:0.05s} .reveal-inner.d2{transition-delay:0.20s} .reveal-inner.d3{transition-delay:0.34s} .reveal-inner.d4{transition-delay:0.48s} .reveal-inner.d5{transition-delay:0.60s}
        .reveal-inner.visible { opacity:1; transform:translateY(0); }
        .him { font-style:italic; color:#111; font-weight:800; white-space:nowrap; }
        .heading-line1 { display:flex; align-items:baseline; gap:0; white-space:nowrap; overflow:visible; padding-bottom:6px; }
        .hname-shuffle-wrap { display:inline-flex; align-items:baseline; overflow:visible; }
        .hname-shuffle { display:inline-block; color:#6E6E6E; font-style:normal; font-weight:800; white-space:nowrap; font-family:'SF Pro Display',-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif; font-size:clamp(48px,5.2vw,76px); line-height:1.06; letter-spacing:-0.03em; -webkit-font-smoothing:antialiased; cursor:default; overflow:visible; }
        .hname-comma { display:inline-block; color:#6E6E6E; font-style:normal; font-weight:800; font-family:'SF Pro Display',-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif; font-size:clamp(48px,5.2vw,76px); line-height:1.06; letter-spacing:-0.03em; -webkit-font-smoothing:antialiased; }
        .hname-shuffle .shuffle-parent { visibility:hidden; display:inline-block; white-space:nowrap; font-family:inherit; font-size:inherit; font-weight:inherit; line-height:inherit; letter-spacing:inherit; color:inherit; text-transform:none; -webkit-font-smoothing:antialiased; }
        .hname-shuffle .shuffle-parent.is-ready { visibility:visible; }
        .typewriter-line { display:block; color:#111; font-weight:800; font-style:normal; white-space:nowrap; }
        .tw-cursor { display:inline-block; width:4px; height:0.82em; background:#111; margin-left:3px; vertical-align:middle; border-radius:2px; animation:blink 0.9s steps(1) infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .about-para-wrap { width:100%; max-width:520px; }
        .about-btns { display:flex; flex-direction:row; align-items:center; gap:14px; }
        .btn-pill { position:relative; height:46px; padding:0 28px; border:1.5px solid #C4C4C4; border-radius:100px; background:transparent; font-family:'SF Pro Text',-apple-system,BlinkMacSystemFont,sans-serif; font-size:15px; font-weight:400; color:#1A1A1A; letter-spacing:-0.01em; cursor:pointer; display:inline-flex; align-items:center; gap:8px; text-decoration:none; white-space:nowrap; overflow:hidden; -webkit-font-smoothing:antialiased; transition:color 0.40s cubic-bezier(0.16,1,0.3,1),border-color 0.40s cubic-bezier(0.16,1,0.3,1); }
        .btn-pill::before { content:""; position:absolute; inset:0; background:#111111; border-radius:inherit; transform:translateY(102%); transition:transform 0.46s cubic-bezier(0.16,1,0.3,1); z-index:0; }
        .btn-pill:hover::before { transform:translateY(0); }
        .btn-pill-inner { position:relative; z-index:1; display:inline-flex; align-items:center; gap:8px; }
        .btn-pill:hover { color:#ffffff; border-color:#111111; }
        .btn-icon-svg { display:block; flex-shrink:0; }
        .about-right { flex:0 0 auto; width:50%; display:flex; align-items:center; justify-content:flex-end; margin-right:-8%; }
        .about-img-outer { position:relative; display:inline-block; opacity:0; transform:translateY(40px); transition:opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s,transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s; }
        .about-img-outer.visible { opacity:1; transform:translateY(0); }
        .about-img { display:block; max-width:100%; height:auto; position:relative; z-index:1; }
        @media(max-width:900px){.about-inner{flex-direction:column-reverse;padding:80px 6%;gap:48px;min-height:auto}.about-left,.about-right{width:100%}.about-left{margin-left:0}.about-right{justify-content:center;margin-right:0}.typewriter-line,.heading-line1{white-space:normal}}
      `}</style>

      {/* ── MoreAbout full-page overlay ── */}
      <MoreAbout isOpen={moreOpen} onClose={() => setMoreOpen(false)} />  {/* ← ADD THIS */}

      <section ref={sectionRef} className="about-section" id="about">
        <div className="about-inner">
          <div className="about-left">
            <h1 className="about-heading">
              <span className="reveal-block">
                <span className={`reveal-inner d1 ${visible ? "visible" : ""}`}>
                  <span className="heading-line1">
                    <span className="him">I'm&nbsp;</span>
                    <span className="hname-shuffle-wrap">
                      <span className="hname-shuffle">
                        <Shuffle text="Arjun Aadhith" tag="span" shuffleDirection="right" duration={0.35}
                          animationMode="evenodd" shuffleTimes={1} ease="power3.out" stagger={0.03}
                          threshold={0.1} triggerOnce={true} triggerOnHover={true}
                          respectReducedMotion={true} loop={false} loopDelay={0} textAlign="left"/>
                      </span>
                      <span className="hname-comma">,</span>
                    </span>
                  </span>
                </span>
              </span>
              <span className="reveal-block">
                <span className={`reveal-inner d2 ${visible ? "visible" : ""}`}>
                  <span className="typewriter-line">{typedTitle}<span className="tw-cursor"/></span>
                </span>
              </span>
            </h1>

            <div className="reveal-block">
              <div className={`reveal-inner d3 about-para-wrap ${visible ? "visible" : ""}`}>
                <ScrollReveal enableBlur={true} baseOpacity={0.1} baseRotation={3}
                  blurStrength={4} rotationEnd="bottom bottom" wordAnimationEnd="bottom bottom">
                  Hello! I'm a creative professional specializing in UI/UX design,
                  graphic design, product design, visual design, illustration, and
                  logo design, with a strong foundation in development. I transform
                  ideas into user-centered, visually refined, and functional digital
                  experiences that solve real problems with clarity and intent.
                </ScrollReveal>
              </div>
            </div>

            <div className={`about-btns reveal-inner d4 ${visible ? "visible" : ""}`}>

              {/* ← CHANGED: was <a href="#more">, now a button that opens the page */}
              <button className="btn-pill" onClick={() => setMoreOpen(true)}>
                <span className="btn-pill-inner">Read More</span>
              </button>

              <a href="/resume/Arjun Aadhith's resume.pdf" download="Arjun Aadhith's resume.pdf" className="btn-pill">
                <span className="btn-pill-inner">
                  Resume
                  <svg className="btn-icon-svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v8.5M7 9.5L4 6.5M7 9.5L10 6.5M1 12.5h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </a>
            </div>
          </div>

          <div className="about-right">
            <div className={`about-img-outer ${imgVisible ? "visible" : ""}`}>
              <PixelOverlay reveal={imgVisible}/>
              <img src="/arjun profile.png" alt="Arjun Aadhith" className="about-img"/>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}