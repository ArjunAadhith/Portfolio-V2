import { useEffect, useRef, useState, useCallback } from "react";

export default function Skills() {
  const sectionRef  = useRef(null);
  const laptopRef   = useRef(null);
  const rafRef      = useRef(null);

  const [visible,    setVisible]   = useState(false);
  const [parallaxY,  setParallaxY] = useState(0);
  const [cursorIn,   setCursorIn]  = useState(false);
  const [cursorPos,  setCursorPos] = useState({ x: 0, y: 0 });

  /* ── Intersection observer
     visible = true  → section entered  → laptop opens
     visible = false → section left     → laptop resets (closed)
     So every scroll-in replays the open animation                 */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ── Laptop parallax — rAF lerp, zero jitter ── */
  useEffect(() => {
    let targetY  = 0;
    let currentY = 0;

    const onScroll = () => {
      if (!laptopRef.current) return;
      const rect   = laptopRef.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      targetY = center * 0.04;
    };

    const tick = () => {
      currentY += (targetY - currentY) * 0.08;
      setParallaxY(currentY);
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ── Custom cursor ── */
  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);
  const handleMouseEnter = useCallback(() => setCursorIn(true),  []);
  const handleMouseLeave = useCallback(() => setCursorIn(false), []);

  return (
    <>
      <style>{`
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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .skills-section {
          width: 100%;
          min-height: 100vh;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 58px 24px 20px;
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow: hidden;
          cursor: none;
          position: relative;
        }

        /* ── Eyebrow ── */
        .skills-eyebrow-wrap {
          width: 100%;
          max-width: 100%;
          padding: 0 0 0 clamp(24px, 6vw, 96px);
          margin: 0 0 28px 0;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .skills-eyebrow-wrap.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .skills-eyebrow {
          font-size: 16px;
          font-weight: 500;
          color: #080808;
          letter-spacing: 0.01em;
          margin-left: 44px;
          text-align: left;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* ── Heading ── */
        .skills-text-wrap {
          width: 100%;
          max-width: 860px;
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.08s,
                      transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.08s;
        }
        .skills-text-wrap.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .skills-heading {
          margin: 0 0 52px 0;
          text-align: center;
        }
        .skills-heading-light {
          display: block;
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
          font-size: clamp(36px, 5.2vw, 62px);
          font-weight: 600;
          color: #666666;
          letter-spacing: -0.025em;
          line-height: 1.15;
        }
        .skills-heading-bold {
          display: block;
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
          font-size: clamp(36px, 5.2vw, 62px);
          font-weight: 800;
          color: #0A0A0A;
          letter-spacing: -0.03em;
          line-height: 1.15;
          -webkit-font-smoothing: antialiased;
        }

        /* ── Laptop wrapper — 3D perspective container ── */
        .skills-laptop-outer {
          position: relative;
          width: 100%;
          max-width: 780px;
          perspective: 1400px;
          perspective-origin: 50% 60%;
        }

        /*
          CLOSED state (default / when not visible)
          → rotated flat away from viewer, shrunk, shifted down, invisible
        */
        .skills-laptop-parallax {
          will-change: transform, opacity;
          transform-origin: 50% 100%;
          transform: rotateX(52deg) scale(0.72) translateY(60px);
          opacity: 0;
          /*
            Both enter and exit use the same smooth transition so:
            - Scroll in  → smoothly opens toward viewer
            - Scroll out → smoothly folds back closed
          */
          transition:
            transform 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.25s,
            opacity   0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.25s;
        }

        /* OPEN state — when section is in viewport */
        .skills-laptop-outer.visible .skills-laptop-parallax {
          transform: rotateX(0deg) scale(1) translateY(0px);
          opacity: 1;
        }

        .skills-laptop-img {
          display: block;
          width: 100%;
          height: auto;
          user-select: none;
          -webkit-user-drag: none;
        }

        /* ── Custom cursor tooltip ── */
        .skills-cursor-tip {
          position: absolute;
          pointer-events: none;
          z-index: 9999;
          background: rgba(15, 15, 15, 0.88);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #FFFFFF;
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
          padding: 6px 14px;
          border-radius: 8px;
          white-space: nowrap;
          opacity: 0;
          transform: scale(0.88);
          transition: opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .skills-cursor-tip.show {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>

      <section
        ref={sectionRef}
        className="skills-section"
        id="skills"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Custom cursor tooltip */}
        <span
          className={`skills-cursor-tip ${cursorIn ? "show" : ""}`}
          style={{ top: cursorPos.y - 36, left: cursorPos.x + 14 }}
        >
          My Skills
        </span>

        {/* Eyebrow */}
        <div className={`skills-eyebrow-wrap ${visible ? "visible" : ""}`}>
          <p className="skills-eyebrow">My Expertise</p>
        </div>

        {/* Heading */}
        <div className={`skills-text-wrap ${visible ? "visible" : ""}`}>
          <h2 className="skills-heading">
            <span className="skills-heading-light">Skills shaped by</span>
            <span className="skills-heading-bold">real-world problem solving</span>
          </h2>
        </div>

        {/* Laptop */}
        <div
          ref={laptopRef}
          className={`skills-laptop-outer ${visible ? "visible" : ""}`}
        >
          <div className="skills-laptop-parallax">
            <div style={{ transform: `translateY(${parallaxY}px)`, willChange: "transform" }}>
           
              <img
                src="/laptop.png"
                alt="Laptop"
                className="skills-laptop-img"
                draggable={false}
              />
            </div>
          </div>
        </div>

      </section>
    </>
  );
}