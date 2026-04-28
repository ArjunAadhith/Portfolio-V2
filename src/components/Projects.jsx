import { useEffect, useRef, useState, useCallback } from "react";

const CARDS = [
  { id: 1, image: "/front-end/Paradize.png", link: "https://paradize-ecom.netlify.app/" },
  { id: 2, image: "/front-end/Rideease.png", link: "https://rideease-car.netlify.app/" },
  { id: 3, image: "/front-end/flixora.png",  link: "https://flixora-streaming-platform.netlify.app/" },
  { id: 4, image: "/front-end/codefest.png", link: "https://codefest-2k25.netlify.app/" },
];

const N = CARDS.length;

/* ─── Lazy Image ────────────────────────────────────────────────────── */
function LazyImage({ src, alt, className }) {
  const imgRef  = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    if (el.complete && el.naturalWidth > 0) {
      setLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (el.dataset.src) {
            el.src = el.dataset.src;
            delete el.dataset.src;
          }
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      data-src={src}
      src=""
      loading="lazy"
      decoding="async"
      alt={alt}
      className={className}
      draggable={false}
      onLoad={() => setLoaded(true)}
      style={{
        opacity:    loaded ? 1 : 0,
        transition: loaded ? "opacity 0.45s ease" : "none",
      }}
    />
  );
}

/* ─── Mobile Desktop-Only Popup ─────────────────────────────────────── */
function DesktopOnlyPopup({ visible, onClose }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (visible) {
      timerRef.current = setTimeout(onClose, 2800);
    }
    return () => clearTimeout(timerRef.current);
  }, [visible, onClose]);

  return (
    <>
      <style>{`
        .dop-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          padding: 24px;
          /* entry */
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.22s ease;
        }
        .dop-overlay.dop-show {
          opacity: 1;
          pointer-events: all;
        }

        .dop-card {
          background: rgba(255, 255, 255, 0.10);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 24px;
          padding: 28px 28px 32px;
          width: min(320px, calc(100vw - 48px));
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          box-shadow:
            0 32px 80px rgba(0, 0, 0, 0.55),
            0 8px 24px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255,255,255,0.12);
          /* card spring */
          transform: scale(0.88) translateY(10px);
          transition:
            transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1),
            opacity   0.22s ease;
          opacity: 0;
        }
        .dop-overlay.dop-show .dop-card {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        /* GIF placeholder */
        .dop-gif-wrap {
          width: 140px;
          height: 140px;
          border-radius: 18px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.10);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dop-gif-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        /* text block */
        .dop-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
        }
        .dop-title {
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
          line-height: 1.2;
        }
        .dop-sub {
          font-family: 'SF Pro Display', -apple-system, sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.52);
          line-height: 1.5;
          letter-spacing: -0.005em;
          max-width: 220px;
        }

        /* progress bar */
        .dop-bar-track {
          width: 100%;
          height: 3px;
          background: rgba(255,255,255,0.10);
          border-radius: 99px;
          overflow: hidden;
        }
        .dop-bar-fill {
          height: 100%;
          width: 0%;
          background: rgba(255,255,255,0.50);
          border-radius: 99px;
          transition: none;
        }
        .dop-overlay.dop-show .dop-bar-fill {
          width: 100%;
          transition: width 2.8s linear;
        }
      `}</style>

      <div
        className={`dop-overlay${visible ? " dop-show" : ""}`}
        onClick={onClose}
      >
        <div
          className="dop-card"
          onClick={e => e.stopPropagation()}
        >
          {/* ── GIF Zone ── swap src to update the image/gif anytime ── */}
          <div className="dop-gif-wrap">
            <img src="/gif.png" alt="Desktop only" />
          </div>

          {/* ── Message ── */}
          <div className="dop-text">
            <p className="dop-title">Desktop Only Experience</p>
            <p className="dop-sub">
              This project is best viewed on a desktop browser for the full experience.
            </p>
          </div>

          {/* ── Auto-close progress bar ── */}
          <div className="dop-bar-track">
            <div className="dop-bar-fill" />
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Main ──────────────────────────────────────────────────────────── */
export default function Projects() {
  const [popupVisible, setPopupVisible] = useState(false);

  const showPopup = useCallback(() => {
    if (popupVisible) return; // prevent stacking
    // Haptic feedback (supported on mobile browsers)
    if (navigator.vibrate) navigator.vibrate(30);
    setPopupVisible(true);
  }, [popupVisible]);

  const hidePopup = useCallback(() => setPopupVisible(false), []);

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

        /* ════════════════════════════════════════
           DESKTOP — completely untouched
        ════════════════════════════════════════ */
        #pj-header {
          position: relative;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pj-label {
          position: absolute;
          top: 52px;
          left: clamp(80px, 60vw, 160px);
          font-family: 'SF Pro Display', -apple-system, sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: #fff;
          line-height: 1.55;
          letter-spacing: -0.01em;
        }

        .pj-heading {
          margin: 122px 0 0;
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(40px, 5.8vw, 72px);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          white-space: nowrap;
          text-align: center;
          background: linear-gradient(
            180deg,
            rgba(215,215,215,.62) 0%,
            rgba(130,130,130,.26) 50%,
            rgba(50,50,50,.10) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        #pj-outer {
          position: relative;
          height: ${N * 100}vh;
          background: #000;
          overflow: clip;
        }

        .pj-wrapper {
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .pj-card {
          position: absolute;
          width: 1078px;
          height: 620px;
          left: 50%;
          top: 60px;
          border-radius: 50px;
          background: #000000;
          overflow: hidden;
          box-shadow:
            0 24px 80px rgba(0,0,0,.65),
            0 4px 20px rgba(0,0,0,.4);
          cursor: none;
          transform: translateX(-50%) translateY(100%);
          opacity: 0;
          transition:
            transform .9s cubic-bezier(0.22, 1, 0.36, 1),
            opacity   .5s ease,
            box-shadow .3s ease;
        }

        .pj-card.entered {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }

        .pj-card.init {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
          transition: box-shadow .3s ease;
        }

        .pj-card:hover {
          box-shadow:
            0 40px 100px rgba(0,0,0,.75),
            0 8px 32px rgba(0,0,0,.5);
        }

        .pj-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
        }

        .pj-tip {
          position: absolute;
          pointer-events: none;
          z-index: 9999;
          background: rgba(255,255,255,.94);
          color: #0a0a0a;
          font-family: 'SF Pro Display', -apple-system, sans-serif;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: .015em;
          padding: 5px 13px;
          border-radius: 8px;
          white-space: nowrap;
          opacity: 0;
          transform: scale(.84) translateY(4px);
          transition: opacity .15s ease, transform .15s ease;
        }
        .pj-tip.on {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        /* ════════════════════════════════════════
           TABLET LANDSCAPE 1024–1199px
        ════════════════════════════════════════ */
        @media (min-width: 1024px) and (max-width: 1199px) {
          .pj-card {
            width: calc(100vw - 48px);
            height: 560px;
            left: 24px;
            transform: translateY(100%);
            top: 70px;
          }
          .pj-card.entered { transform: translateY(0); }
          .pj-card.init    { transform: translateY(0); }
        }

        /* ════════════════════════════════════════
           TABLET PORTRAIT 768–1023px
        ════════════════════════════════════════ */
        @media (min-width: 768px) and (max-width: 1023px) {
          .pj-label {
            position: relative;
            top: auto; left: auto;
            text-align: center;
            padding-top: 40px;
            font-size: 14px;
          }
          .pj-heading {
            margin-top: 10px;
            white-space: normal;
            padding: 0 24px 24px;
          }
          .pj-card {
            width: calc(100vw - 40px);
            height: 460px;
            left: 20px;
            transform: translateY(100%);
            border-radius: 36px;
            top: 80px;
            cursor: pointer;
          }
          .pj-card.entered { transform: translateY(0); }
          .pj-card.init    { transform: translateY(0); }
          .pj-tip { display: none; }
        }

        /* ════════════════════════════════════════
           MOBILE BASE ≤ 767px
        ════════════════════════════════════════ */
        @media (max-width: 767px) {
          #pj-header {
            align-items: center;
            padding-bottom: 0;
          }
          .pj-label {
            position: relative;
            top: auto;
            left: auto;
            text-align: center;
            padding-top: 44px;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.6;
            color: #fff;
            letter-spacing: 0;
          }
          .pj-heading {
            margin-top: 14px;
            white-space: normal;
            text-align: center;
            padding: 0 20px 24px;
            font-size: clamp(28px, 8vw, 42px);
            letter-spacing: -0.032em;
            line-height: 1.08;
          }
          #pj-outer  { height: ${N * 38}vh; }
          .pj-wrapper { height: 38vh; }
          .pj-card {
            width: calc(100vw - 24px);
            height: auto;
            aspect-ratio: 16 / 10;
            left: 12px;
            top: 50%;
            margin-top: calc((100vw - 24px) * -5 / 16);
            border-radius: 22px;
            transform: translateY(100%);
            cursor: pointer;
          }
          .pj-card.entered { transform: translateY(0); }
          .pj-card.init    { transform: translateY(0); }
          .pj-tip { display: none; }
        }

        /* ════════════ ≤ 480px ════════════ */
        @media (max-width: 480px) {
          #pj-outer   { height: ${N * 36}vh; }
          .pj-wrapper  { height: 36vh; }
          .pj-label {
            padding-top: 40px;
            font-size: 13.5px;
          }
          .pj-heading {
            margin-top: 12px;
            font-size: clamp(26px, 7.5vw, 36px);
            padding: 0 18px 20px;
          }
          .pj-card {
            width: calc(100vw - 20px);
            left: 10px;
            margin-top: calc((100vw - 20px) * -5 / 16);
            border-radius: 18px;
          }
        }

        /* ════════════ ≤ 414px ════════════ */
        @media (max-width: 414px) {
          .pj-label   { padding-top: 38px; font-size: 13.5px; }
          .pj-heading {
            margin-top: 12px;
            font-size: clamp(26px, 7.5vw, 36px);
            padding: 0 18px 20px;
          }
        }

        /* ════════════ ≤ 390px ════════════ */
        @media (max-width: 390px) {
          #pj-outer   { height: ${N * 34}vh; }
          .pj-wrapper  { height: 34vh; }
          .pj-label {
            padding-top: 36px;
            font-size: 13px;
          }
          .pj-heading {
            margin-top: 10px;
            font-size: clamp(24px, 7vw, 32px);
            padding: 0 16px 18px;
            letter-spacing: -0.026em;
          }
          .pj-card {
            width: calc(100vw - 16px);
            left: 8px;
            margin-top: calc((100vw - 16px) * -5 / 16);
            border-radius: 16px;
          }
        }

        /* ════════════ ≤ 375px ════════════ */
        @media (max-width: 375px) {
          .pj-label   { padding-top: 34px; font-size: 13px; }
          .pj-heading {
            margin-top: 10px;
            font-size: clamp(24px, 7vw, 30px);
            padding: 0 14px 16px;
          }
        }

        /* ════════════ ≤ 360px ════════════ */
        @media (max-width: 360px) {
          #pj-outer   { height: ${N * 33}vh; }
          .pj-wrapper  { height: 33vh; }
          .pj-label   { padding-top: 32px; font-size: 13px; }
          .pj-heading {
            margin-top: 10px;
            font-size: clamp(23px, 6.8vw, 30px);
            padding: 0 14px 16px;
            letter-spacing: -0.024em;
          }
          .pj-card {
            width: calc(100vw - 16px);
            left: 8px;
            margin-top: calc((100vw - 16px) * -5 / 16);
            border-radius: 15px;
          }
        }

        /* ════════════ ≤ 320px ════════════ */
        @media (max-width: 320px) {
          #pj-outer   { height: ${N * 32}vh; }
          .pj-wrapper  { height: 32vh; }
          .pj-label {
            padding-top: 28px;
            font-size: 12px;
          }
          .pj-heading {
            margin-top: 8px;
            font-size: clamp(22px, 6.8vw, 28px);
            padding: 0 12px 14px;
            letter-spacing: -0.022em;
          }
          .pj-card {
            width: calc(100vw - 14px);
            left: 7px;
            margin-top: calc((100vw - 14px) * -5 / 16);
            border-radius: 14px;
          }
        }

        /* ════════════ Landscape phone ════════════ */
        @media (max-width: 900px) and (max-height: 500px) and (orientation: landscape) {
          #pj-outer   { height: ${N * 78}vh; }
          .pj-wrapper  { height: 78vh; }
          .pj-label {
            position: relative;
            top: auto; left: auto;
            text-align: center;
            font-size: 13px;
            padding-top: 14px;
          }
          .pj-heading {
            margin-top: 6px;
            white-space: normal;
            padding: 0 20px 10px;
            font-size: clamp(22px, 5vw, 36px);
          }
          .pj-card {
            width: calc(100vw - 32px);
            height: calc(78vh - 90px);
            aspect-ratio: unset;
            left: 16px;
            top: 50%;
            margin-top: calc((78vh - 90px) / -2);
            border-radius: 18px;
            transform: translateY(100%);
            cursor: pointer;
          }
          .pj-card.entered { transform: translateY(0); }
          .pj-card.init    { transform: translateY(0); }
          .pj-tip { display: none; }
        }

        /* ════════════ iOS notch / Dynamic Island ════════════ */
        @supports (padding: env(safe-area-inset-top)) {
          @media (max-width: 767px) {
            .pj-label {
              padding-top: calc(44px + env(safe-area-inset-top, 0px));
            }
          }
          @media (max-width: 390px) {
            .pj-label {
              padding-top: calc(36px + env(safe-area-inset-top, 0px));
            }
          }
          @media (max-width: 320px) {
            .pj-label {
              padding-top: calc(28px + env(safe-area-inset-top, 0px));
            }
          }
        }
      `}</style>

      <div id="pj-header">
        <p className="pj-label">
          Let's Explore My<br />Creative Journey
        </p>
        <h2 className="pj-heading">The Art of Frontend</h2>
      </div>

      <div id="pj-outer">
        {CARDS.map((card, i) => (
          <StickyCard
            key={card.id}
            card={card}
            index={i}
            onMobileTap={showPopup}
          />
        ))}
      </div>

      {/* ── Mobile popup — rendered outside scroll container ── */}
      <DesktopOnlyPopup visible={popupVisible} onClose={hidePopup} />
    </>
  );
}

/* ─── StickyCard ────────────────────────────────────────────────────── */
function StickyCard({ card, index, onMobileTap }) {
  const wrapperRef = useRef(null);
  const cardRef    = useRef(null);
  const [entered,  setEntered]  = useState(index === 0);
  const [tip,      setTip]      = useState({ show: false, x: 0, y: 0 });

  useEffect(() => {
    if (index === 0) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          obs.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px 0px 0px" }
    );
    if (wrapperRef.current) obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, [index]);

  const onMove = useCallback((e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setTip({ show: true, x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  const onLeave = useCallback(() => setTip(t => ({ ...t, show: false })), []);

  const handleClick = useCallback(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    // Popup restriction applies only to the first 3 cards (index 0, 1, 2)
    if (isMobile && index < 3) {
      onMobileTap();       // show popup, do NOT navigate
    } else {
      window.location.href = card.link;
    }
  }, [card.link, index, onMobileTap]);

  return (
    <div
      ref={wrapperRef}
      className="pj-wrapper"
      style={{ zIndex: index + 1 }}
    >
      <div
        ref={cardRef}
        className={`pj-card ${index === 0 ? "init" : entered ? "entered" : ""}`}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={handleClick}
      >
        <span
          className={`pj-tip${tip.show ? " on" : ""}`}
          style={{ left: tip.x + 16, top: tip.y - 20 }}
        >
          Visit Now
        </span>

        <LazyImage
          src={card.image}
          alt={`Project ${card.id}`}
          className="pj-img"
        />
      </div>
    </div>
  );
}