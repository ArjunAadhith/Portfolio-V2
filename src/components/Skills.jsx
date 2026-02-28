import { useEffect, useRef, useState, useCallback } from "react";

export default function Skills() {
  const sectionRef  = useRef(null);
  const laptopRef   = useRef(null);
  const rafRef      = useRef(null);

  const [visible,    setVisible]   = useState(false);
  const [parallaxY,  setParallaxY] = useState(0);
  const [cursorIn,   setCursorIn]  = useState(false);
  const [cursorPos,  setCursorPos] = useState({ x: 0, y: 0 });

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

        /* ─── BASE / DESKTOP (1280px reference — untouched) ─── */
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
          box-sizing: border-box;
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

        /* ── Laptop wrapper ── */
        .skills-laptop-outer {
          position: relative;
          width: 100%;
          max-width: 780px;
          perspective: 1400px;
          perspective-origin: 50% 60%;
        }

        .skills-laptop-parallax {
          will-change: transform, opacity;
          transform-origin: 50% 100%;
          transform: rotateX(52deg) scale(0.72) translateY(60px);
          opacity: 0;
          transition:
            transform 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.25s,
            opacity   0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.25s;
        }

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

        /* ═══════════════════════════════════════════
           ULTRA-WIDE: 1440px – 1599px
        ═══════════════════════════════════════════ */
        @media (min-width: 1440px) and (max-width: 1599px) {
          .skills-section {
            padding: 64px 32px 24px;
          }
          .skills-text-wrap {
            max-width: 920px;
          }
          .skills-laptop-outer {
            max-width: 840px;
          }
        }

        /* ═══════════════════════════════════════════
           ULTRA-WIDE: 1600px – 1919px
        ═══════════════════════════════════════════ */
        @media (min-width: 1600px) and (max-width: 1919px) {
          .skills-section {
            padding: 72px 40px 28px;
          }
          .skills-text-wrap {
            max-width: 1000px;
          }
          .skills-laptop-outer {
            max-width: 900px;
          }
          .skills-eyebrow {
            font-size: 17px;
          }
        }

        /* ═══════════════════════════════════════════
           ULTRA-WIDE: 1920px+
        ═══════════════════════════════════════════ */
        @media (min-width: 1920px) {
          .skills-section {
            padding: 80px 48px 36px;
          }
          .skills-text-wrap {
            max-width: 1100px;
          }
          .skills-laptop-outer {
            max-width: 1000px;
          }
          .skills-eyebrow {
            font-size: 18px;
            margin-left: 56px;
          }
          .skills-heading {
            margin-bottom: 64px;
          }
        }

        /* ═══════════════════════════════════════════
           TABLET LANDSCAPE: 1024px – 1199px
        ═══════════════════════════════════════════ */
        @media (min-width: 1024px) and (max-width: 1199px) {
          .skills-section {
            padding: 52px 24px 20px;
          }
          .skills-text-wrap {
            max-width: 760px;
          }
          .skills-laptop-outer {
            max-width: 700px;
          }
          .skills-heading {
            margin-bottom: 44px;
          }
        }

        /* ═══════════════════════════════════════════
           TABLET PORTRAIT & LANDSCAPE: 768px – 1023px
        ═══════════════════════════════════════════ */
        @media (min-width: 768px) and (max-width: 1023px) {
          .skills-section {
            padding: 60px 32px 32px;
            cursor: auto;
            min-height: auto;
          }
          .skills-cursor-tip {
            display: none;
          }
          .skills-eyebrow-wrap {
            padding: 0 0 0 0;
            margin-bottom: 20px;
          }
          .skills-eyebrow {
            margin-left: 0;
            font-size: 15px;
            text-align: center;
          }
          .skills-text-wrap {
            max-width: 640px;
          }
          .skills-heading {
            margin-bottom: 40px;
          }
          .skills-heading-light,
          .skills-heading-bold {
            font-size: clamp(30px, 4.8vw, 48px);
          }
          .skills-laptop-outer {
            max-width: 580px;
          }
        }

        /* ═══════════════════════════════════════════
           MOBILE: ≤ 767px
        ═══════════════════════════════════════════ */
        @media (max-width: 767px) {
          .skills-section {
            padding: 56px 20px 40px;
            padding-top: calc(56px + env(safe-area-inset-top, 0px));
            padding-bottom: calc(40px + env(safe-area-inset-bottom, 0px));
            cursor: auto;
            min-height: auto;
            overflow-x: hidden;
          }

          /* Hide mouse cursor tooltip on touch devices */
          .skills-cursor-tip {
            display: none;
          }

          /* Eyebrow — center align on mobile */
          .skills-eyebrow-wrap {
            padding: 0;
            margin-bottom: 16px;
          }
          .skills-eyebrow {
            margin-left: 0;
            font-size: 14px;
            text-align: center;
          }

          /* Heading */
          .skills-text-wrap {
            max-width: 100%;
          }
          .skills-heading {
            margin-bottom: 32px;
          }
          .skills-heading-light,
          .skills-heading-bold {
            font-size: clamp(26px, 7vw, 38px);
            letter-spacing: -0.02em;
          }

          /* Laptop — reduce perspective intensity on mobile for performance & aesthetics */
          .skills-laptop-outer {
            max-width: 100%;
            perspective: 1000px;
            perspective-origin: 50% 65%;
          }
          .skills-laptop-parallax {
            transform: rotateX(42deg) scale(0.78) translateY(40px);
          }
          .skills-laptop-outer.visible .skills-laptop-parallax {
            transform: rotateX(0deg) scale(1) translateY(0px);
          }
        }

        /* ═══════════════════════════════════════════
           SMALL MOBILE: ≤ 480px
           iPhone 12 mini, SE 2/3, Galaxy A-series, Pixel 4a
        ═══════════════════════════════════════════ */
        @media (max-width: 480px) {
          .skills-section {
            padding: 48px 18px 36px;
            padding-top: calc(48px + env(safe-area-inset-top, 0px));
            padding-bottom: calc(36px + env(safe-area-inset-bottom, 0px));
          }
          .skills-eyebrow {
            font-size: 13px;
          }
          .skills-heading-light,
          .skills-heading-bold {
            font-size: clamp(24px, 6.5vw, 34px);
          }
          .skills-heading {
            margin-bottom: 28px;
          }
          .skills-laptop-outer {
            perspective: 900px;
          }
        }

        /* ═══════════════════════════════════════════
           STANDARD MOBILE: ≤ 390px
           iPhone 13/14/15, Galaxy S-series, Pixel 6/7
        ═══════════════════════════════════════════ */
        @media (max-width: 390px) {
          .skills-section {
            padding: 44px 16px 32px;
            padding-top: calc(44px + env(safe-area-inset-top, 0px));
            padding-bottom: calc(32px + env(safe-area-inset-bottom, 0px));
          }
          .skills-eyebrow {
            font-size: 13px;
          }
          .skills-heading-light,
          .skills-heading-bold {
            font-size: clamp(22px, 6.2vw, 30px);
            letter-spacing: -0.018em;
          }
          .skills-heading {
            margin-bottom: 24px;
          }
          .skills-eyebrow-wrap {
            margin-bottom: 12px;
          }
        }

        /* ═══════════════════════════════════════════
           TINY SCREENS: ≤ 320px
           iPhone SE 1st gen, small Android
        ═══════════════════════════════════════════ */
        @media (max-width: 320px) {
          .skills-section {
            padding: 40px 14px 28px;
            padding-top: calc(40px + env(safe-area-inset-top, 0px));
            padding-bottom: calc(28px + env(safe-area-inset-bottom, 0px));
          }
          .skills-eyebrow {
            font-size: 12px;
          }
          .skills-heading-light,
          .skills-heading-bold {
            font-size: clamp(20px, 6vw, 26px);
            letter-spacing: -0.015em;
          }
          .skills-heading {
            margin-bottom: 20px;
          }
          .skills-eyebrow-wrap {
            margin-bottom: 10px;
          }
          .skills-laptop-outer {
            perspective: 800px;
          }
        }

        /* ═══════════════════════════════════════════
           LANDSCAPE PHONE: short height, wide width
        ═══════════════════════════════════════════ */
        @media (max-width: 900px) and (max-height: 500px) and (orientation: landscape) {
          .skills-section {
            padding: 32px 24px 24px;
            min-height: auto;
            cursor: auto;
          }
          .skills-cursor-tip {
            display: none;
          }
          .skills-eyebrow-wrap {
            margin-bottom: 12px;
          }
          .skills-eyebrow {
            margin-left: 0;
            font-size: 13px;
            text-align: center;
          }
          .skills-heading {
            margin-bottom: 20px;
          }
          .skills-heading-light,
          .skills-heading-bold {
            font-size: clamp(22px, 4vw, 32px);
          }
          .skills-laptop-outer {
            max-width: 480px;
            perspective: 900px;
          }
          .skills-laptop-parallax {
            transform: rotateX(38deg) scale(0.80) translateY(30px);
          }
          .skills-laptop-outer.visible .skills-laptop-parallax {
            transform: rotateX(0deg) scale(1) translateY(0px);
          }
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