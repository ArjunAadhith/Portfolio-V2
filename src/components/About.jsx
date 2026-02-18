import { useEffect, useRef, useState } from "react";

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
        timeout = setTimeout(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          typingSpeed
        );
      } else {
        timeout = setTimeout(() => setPhase("pausing"), pause);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("erasing"), 200);
    } else if (phase === "erasing") {
      if (displayed.length > 0) {
        timeout = setTimeout(
          () => setDisplayed(displayed.slice(0, -1)),
          erasingSpeed
        );
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

export default function About() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [nameHovered, setNameHovered] = useState(false);
  const typedTitle = useTypewriter(TITLES);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'SF Pro Display';
          src: url('/src/assets/fonts/SF-Pro-Display-Regular.otf') format('opentype');
          font-weight: 400;
        }
        @font-face {
          font-family: 'SF Pro Display';
          src: url('/src/assets/fonts/SF-Pro-Display-Bold.otf') format('opentype');
          font-weight: 700;
        }
        @font-face {
          font-family: 'SF Pro Display';
          src: url('/src/assets/fonts/SF-Pro-Display-Heavy.otf') format('opentype');
          font-weight: 800;
        }
        @font-face {
          font-family: 'SF Pro Text';
          src: url('/src/assets/fonts/SF-Pro-Text-Regular.otf') format('opentype');
          font-weight: 400;
        }
        @font-face {
          font-family: 'SF Pro Text';
          src: url('/src/assets/fonts/SF-Pro-Text-Light.otf') format('opentype');
          font-weight: 300;
        }

        .about-section {
          width: 100%;
          min-height: 100vh;
          background: #E8E8E8;
          display: flex;
          align-items: center;
          position: relative;
        }

        .about-inner {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 9% 0 9%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 100vh;
        }

        /* ── LEFT ── */
        .about-left {
          flex: 0 0 auto;
          width: 44%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .about-heading {
          margin: 0 0 40px 0;
          padding: 0;
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
          font-size: clamp(48px, 5.2vw, 76px);
          font-weight: 800;
          line-height: 1.06;
          letter-spacing: -0.03em;
          color: #111;
          -webkit-font-smoothing: antialiased;
        }

        /* Reveal */
        .reveal-block {
          display: block;
          overflow: hidden;
        }

        .reveal-inner {
          display: block;
          opacity: 0;
          transform: translateY(48px);
          transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1),
                      transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }

        .reveal-inner.d1 { transition-delay: 0.05s; }
        .reveal-inner.d2 { transition-delay: 0.18s; }
        .reveal-inner.d3 { transition-delay: 0.28s; }
        .reveal-inner.d4 { transition-delay: 0.38s; }

        .reveal-inner.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* "I'm" */
        .him {
          font-style: italic;
          color: #111;
          font-weight: 800;
          white-space: nowrap;
        }

        /* Name — FIX: white-space nowrap keeps it on one line always */
        .hname {
          color: #6E6E6E;
          font-style: normal;
          font-weight: 800;
          cursor: default;
          display: inline;
          white-space: nowrap;
        }

        /* Shine hover */
        .hname-shine {
          background: linear-gradient(
            100deg,
            #4a4a4a 0%,
            #8a8a8a 20%,
            #d4d4d4 50%,
            #8a8a8a 80%,
            #4a4a4a 100%
          );
          background-size: 250% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shineMove 5.8s linear infinite;
        }

        @keyframes shineMove {
          0%   { background-position: -250% center; }
          100% { background-position:  250% center; }
        }

        /* Line 1 wrapper — must never wrap */
        .heading-line1 {
          display: block;
          white-space: nowrap;
        }

        /* Typewriter role line */
        .typewriter-line {
          display: block;
          color: #111;
          font-weight: 800;
          font-style: normal;
          white-space: nowrap;
        }

        .tw-cursor {
          display: inline-block;
          width: 4px;
          height: 0.82em;
          background: #111;
          margin-left: 3px;
          vertical-align: middle;
          border-radius: 2px;
          animation: blink 0.9s steps(1) infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        /* Paragraph */
        .about-para {
          font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
          font-size: clamp(14px, 1.1vw, 16px);
          font-weight: 400;
          line-height: 1.78;
          color: #3A3A3A;
          margin: 0 0 44px 0;
          max-width: 520px;
          letter-spacing: -0.005em;
          -webkit-font-smoothing: antialiased;
        }

        /* Buttons */
        .about-btns {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 14px;
        }

        .btn-pill {
          height: 46px;
          padding: 0 28px;
          border: 1.5px solid #C4C4C4;
          border-radius: 100px;
          background: transparent;
          font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 15px;
          font-weight: 400;
          color: #1A1A1A;
          letter-spacing: -0.01em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          white-space: nowrap;
          -webkit-font-smoothing: antialiased;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }

        .btn-pill:hover {
          background: #111;
          border-color: #111;
          color: #fff;
        }

        /* FIX: SVG icon — use currentColor so it inherits hover color */
        .btn-icon-svg {
          display: block;
          flex-shrink: 0;
        }

        /* ── RIGHT ── */
        .about-right {
          flex: 0 0 auto;
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-right: -8%;
        }

        .about-img-wrap {
          opacity: 0;
          transform: translateX(60px);
          transition: opacity 1s cubic-bezier(0.22,1,0.36,1) 0.1s,
                      transform 1s cubic-bezier(0.22,1,0.36,1) 0.1s;
        }

        .about-img-wrap.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .about-img {
          display: block;
          max-width: 100%;
          height: auto;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .about-inner {
            flex-direction: column-reverse;
            padding: 80px 6%;
            gap: 48px;
            min-height: auto;
          }
          .about-left, .about-right {
            width: 100%;
          }
          .about-right {
            justify-content: center;
          }
          .about-img-wrap {
            margin-right: 0;
          }
          .typewriter-line,
          .heading-line1 {
            white-space: normal;
          }
        }
      `}</style>

      <section ref={sectionRef} className="about-section" id="about">
        <div className="about-inner">

          {/* ── LEFT ── */}
          <div className="about-left">
            <h1 className="about-heading">

              {/* Line 1: I'm Arjun Aadhith, — always single line */}
              <span className="reveal-block">
                <span className={`reveal-inner d1 ${visible ? "visible" : ""}`}>
                  <span className="heading-line1">
                    <span className="him">I'm </span>
                    <span
                      className={`hname ${nameHovered ? "hname-shine" : ""}`}
                      onMouseEnter={() => setNameHovered(true)}
                      onMouseLeave={() => setNameHovered(false)}
                    >
                      Arjun Aadhith,
                    </span>
                  </span>
                </span>
              </span>

              {/* Line 2: typewriter */}
              <span className="reveal-block">
                <span className={`reveal-inner d2 ${visible ? "visible" : ""}`}>
                  <span className="typewriter-line">
                    {typedTitle}<span className="tw-cursor" />
                  </span>
                </span>
              </span>

            </h1>

            {/* Paragraph */}
            <div className="reveal-block">
              <p className={`about-para reveal-inner d3 ${visible ? "visible" : ""}`}>
                Hello! I'm a creative professional specializing in UI/UX design,
                graphic design, product design, visual design, illustration, and
                logo design, with a strong foundation in development. I transform
                ideas into user-centered, visually refined, and functional digital
                experiences that solve real problems with clarity and intent.
              </p>
            </div>

            {/* Buttons */}
            <div className={`about-btns reveal-inner d4 ${visible ? "visible" : ""}`}>
              <a href="#more" className="btn-pill">Read More</a>
              <a href="/resume.pdf" download className="btn-pill">
                Resume
                {/* FIX: currentColor inherits #fff on hover automatically */}
                <svg
                  className="btn-icon-svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 1v8.5M7 9.5L4 6.5M7 9.5L10 6.5M1 12.5h12"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="about-right">
            <div className={`about-img-wrap ${visible ? "visible" : ""}`}>
              <img
                src="/arjun profile.png"
                alt="Arjun Aadhith"
                className="about-img"
              />
            </div>
          </div>

        </div>
      </section>
    </>
  );
}