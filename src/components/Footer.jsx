import { useRef, useState, useEffect, useCallback } from 'react';

const ICONS = [
  { id:'star',   src:'/f-icons/Star.png',      link:null,                   xPct:0.082, w:100,  h:100  },
  { id:'ln',     src:'/f-icons/Linkedin.png',  link:'https://www.linkedin.com/in/arjunaadhith5/', xPct:0.216, w:160, h:160 },
  { id:'bolt',   src:'/f-icons/Thunder.png',   link:null,                   xPct:0.316, w:100,  h:100  },
  { id:'mail',   src:'/f-icons/Mail.png',      link:'https://mail.google.com/mail/u/3/#inbox?compose=DmwnWstzWPGTbGNcDDvHphJRdnjVmrkLqnNbXxXGMkvpvBnJMcqddfGPMThXHjVPMPVfwWjnQKqQ', xPct:0.220, w:160, h:160 },
  { id:'smile',  src:'/f-icons/Smile.png',     link:null,                   xPct:0.375, w:120,  h:120  },
  { id:'otw',    src:'/f-icons/OTW.png',       link:null,                   xPct:0.474, w:220,  h:100  },
  { id:'gear',   src:'/f-icons/Setting.png',   link:null,                   xPct:0.530, w:120,  h:120  },
  { id:'github', src:'/f-icons/Git.png',       link:'https://github.com/ArjunAadhith',   xPct:0.632, w:160,  h:160  },
  { id:'arrow',  src:'/f-icons/Arrow.png',     link:null,                   xPct:0.716, w:100,  h:100  },
  { id:'arrow2', src:'/f-icons/Cursor.png',    link:null,                   xPct:0.760, w:80,   h:80   },
  { id:'dragme', src:'/f-icons/Drag me.png',   link:null,                   xPct:0.874, w:156,  h:60   },
];

function getScaledIcons(containerW) {
  if (containerW >= 1024) return ICONS;
  const scale =
    containerW >= 768 ? 0.80 :
    containerW >= 600 ? 0.68 :
    containerW >= 428 ? 0.60 :
    containerW >= 360 ? 0.52 : 0.44;
  return ICONS.map(ic => ({
    ...ic,
    w: Math.round(ic.w * scale),
    h: Math.round(ic.h * scale),
  }));
}

function loadMatter() {
  return new Promise((resolve, reject) => {
    if (window.Matter) { resolve(window.Matter); return; }
    const s = document.createElement('script');
    s.src     = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
    s.onload  = () => resolve(window.Matter);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

/* ── Tap-to-link: fires only on short, stationary touches ─────────── */
const TAP_MAX_MS   = 250;
const TAP_MAX_MOVE = 8;

function useTapLink(link) {
  const t0  = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const onTouchStart = useCallback((e) => {
    if (!link) return;
    const t = e.touches[0];
    t0.current  = Date.now();
    pos.current = { x: t.clientX, y: t.clientY };
  }, [link]);

  const onTouchEnd = useCallback((e) => {
    if (!link || t0.current === null) return;
    const elapsed = Date.now() - t0.current;
    const t  = e.changedTouches[0];
    const dx = Math.abs(t.clientX - pos.current.x);
    const dy = Math.abs(t.clientY - pos.current.y);
    if (elapsed < TAP_MAX_MS && dx < TAP_MAX_MOVE && dy < TAP_MAX_MOVE) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
    t0.current = null;
  }, [link]);

  return { onTouchStart, onTouchEnd };
}

function IconSpan({ icon, onMouseEnter, onMouseMove, onMouseLeave }) {
  const { onTouchStart, onTouchEnd } = useTapLink(icon.link);

  const handleClick = useCallback((e) => {
    if (icon.link) {
      e.stopPropagation();
      window.open(icon.link, '_blank', 'noopener,noreferrer');
    }
  }, [icon.link]);

  return (
    <span
      className="fi-icon"
      style={{ opacity: 0 }}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <img src={icon.src} alt={icon.id} draggable={false} className="fi-icon-img" />
    </span>
  );
}

export default function ContactSection() {
  const containerRef = useRef(null);
  const iconsWrapRef = useRef(null);
  const canvasRef    = useRef(null);
  const tipRef       = useRef(null);
  const cleanupRef   = useRef(null);
  const [triggered, setTriggered] = useState(false);

  /* Scroll-triggered initialisation */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTriggered(true); obs.disconnect(); }
    }, { threshold: 0.10 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Physics engine */
  useEffect(() => {
    if (!triggered) return;
    let cancelled = false;

    (async () => {
      const M = await loadMatter();
      if (cancelled) return;

      const {
        Engine, Render, World, Bodies, Runner,
        Mouse, MouseConstraint, Events, Body, Query,
      } = M;

      const container = containerRef.current;
      if (!container) return;
      const { width: W, height: H } = container.getBoundingClientRect();
      const scaledIcons = getScaledIcons(W);

      const engine = Engine.create();
      engine.world.gravity.y = 0.9;

      const render = Render.create({
        element: canvasRef.current,
        engine,
        options: { width: W, height: H, background: 'transparent', wireframes: false },
      });
      render.canvas.style.cssText =
        'position:absolute;inset:0;opacity:0;pointer-events:none;z-index:1;';

      const STATIC = { isStatic: true, render: { fillStyle: 'transparent' } };
      World.add(engine.world, [
        Bodies.rectangle(W / 2,  H + 25, W + 100, 50,  STATIC),
        Bodies.rectangle(-25,    H / 2,  50,      H*2, STATIC),
        Bodies.rectangle(W + 25, H / 2,  50,      H*2, STATIC),
        Bodies.rectangle(W / 2, -25,     W + 100, 50,  STATIC),
      ]);

      const iconSpans  = iconsWrapRef.current.querySelectorAll('.fi-icon');
      const iconBodies = [...iconSpans].map((elem, i) => {
        const cfg    = scaledIcons[i];
        const spawnX = W * cfg.xPct;
        const spawnY = 40 + i * 24;

        const body = Bodies.rectangle(spawnX, spawnY, cfg.w, cfg.h, {
          render:      { fillStyle: 'transparent' },
          restitution: 0.35,
          frictionAir: 0.03,
          friction:    0.3,
          chamfer:     { radius: 10 },
          label:       cfg.id,
        });

        Body.setVelocity(body, { x: 0, y: 0.5 });
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.015);

        elem.style.position = 'absolute';
        elem.style.opacity  = '1';
        elem.style.width    = `${cfg.w}px`;
        elem.style.height   = `${cfg.h}px`;
        elem.style.left     = `${spawnX - cfg.w / 2}px`;
        elem.style.top      = `${spawnY - cfg.h / 2}px`;

        return { elem, body, cfg };
      });

      World.add(engine.world, iconBodies.map(ib => ib.body));

      /* ── Mouse (desktop) ─────────────────────────────────────────── */
      const mouse = Mouse.create(container);

      /* Remove wheel-scroll hijack */
      mouse.element.removeEventListener('mousewheel',     mouse.mousewheel);
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
      mouse.element.removeEventListener('wheel',          mouse.mousewheel);

      /* ── Smart touch (mobile): drag icons + free page scroll ────────
         ROOT CAUSE OF PREVIOUS DRAG FAILURE:
         We were building a synthetic event { clientX, clientY } but
         Matter.js's _getRelativeMousePosition checks event.changedTouches
         FIRST and reads pageX/pageY from it. A plain object with only
         clientX/clientY has no changedTouches → Matter reads NaN → the
         mouse constraint gets a null position → no drag.

         FIX: Pass the REAL native TouchEvent directly to Matter's
         handlers. Real touch events always have changedTouches with
         correct pageX/pageY that Matter.js expects.

         HOW SCROLL IS PRESERVED:
         On touchstart we do a Query.point hit-test. If the finger
         landed ON a physics body we call preventDefault() and let
         Matter drag it. If the finger is on EMPTY space we do nothing
         and the browser handles it as normal page scroll.
      ────────────────────────────────────────────────────────────────── */
      if (isTouchDevice()) {
        /* Remove Matter's own non-passive touch listeners */
        mouse.element.removeEventListener('touchstart', mouse.mousedown);
        mouse.element.removeEventListener('touchmove',  mouse.mousemove);
        mouse.element.removeEventListener('touchend',   mouse.mouseup);

        let dragging = false;

        container.addEventListener('touchstart', (e) => {
          const touch = e.touches[0];
          const rect  = container.getBoundingClientRect();
          /* Position relative to the physics world origin */
          const pt = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
          };
          /* Hit-test: did the finger land on a physics body? */
          const hit = Query.point(iconBodies.map(b => b.body), pt);

          if (hit.length > 0) {
            dragging = true;
            /* Pass the REAL event — Matter reads e.changedTouches[0].pageX/Y */
            mouse.mousedown(e);
            e.preventDefault(); /* block scroll ONLY while grabbing an icon */
          } else {
            dragging = false;
            /* Finger on empty space → browser scroll unblocked */
          }
        }, { passive: false });

        container.addEventListener('touchmove', (e) => {
          if (!dragging) return; /* swipe on empty space → free scroll */
          mouse.mousemove(e);   /* pass REAL event so pageX/Y are correct */
          e.preventDefault();
        }, { passive: false });

        container.addEventListener('touchend', (e) => {
          if (dragging) {
            mouse.mouseup(e); /* pass REAL event */
            dragging = false;
          }
        }, { passive: true });
      }

      const mc = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, damping: 0.1, render: { visible: false } },
      });
      render.mouse = mouse;
      World.add(engine.world, mc);

      if (!isTouchDevice()) {
        Events.on(mc, 'startdrag', () => container.style.cursor = 'grabbing');
        Events.on(mc, 'enddrag',   () => container.style.cursor = 'grab');
      }

      const runner = Runner.create();
      Runner.run(runner, engine);
      Render.run(render);

      let rafId;
      const loop = () => {
        iconBodies.forEach(({ body, elem, cfg }) => {
          elem.style.left      = `${body.position.x - cfg.w / 2}px`;
          elem.style.top       = `${body.position.y - cfg.h / 2}px`;
          elem.style.transform = `rotate(${body.angle}rad)`;
        });
        rafId = requestAnimationFrame(loop);
      };
      loop();

      cleanupRef.current = () => {
        cancelAnimationFrame(rafId);
        Render.stop(render); Runner.stop(runner);
        render.canvas?.remove();
        World.clear(engine.world); Engine.clear(engine);
        container.style.cursor = '';
      };
    })();

    return () => { cancelled = true; cleanupRef.current?.(); };
  }, [triggered]);

  /* Desktop tooltip */
  const showTip = useCallback((e, text) => {
    const t = tipRef.current;
    const r = containerRef.current?.getBoundingClientRect();
    if (!t || !r) return;
    t.textContent = text;
    t.style.opacity = '1';
    t.style.left = `${e.clientX - r.left + 14}px`;
    t.style.top  = `${e.clientY - r.top  - 12}px`;
  }, []);

  const moveTip = useCallback((e) => {
    const t = tipRef.current;
    const r = containerRef.current?.getBoundingClientRect();
    if (!t || !r) return;
    t.style.left = `${e.clientX - r.left + 14}px`;
    t.style.top  = `${e.clientY - r.top  - 12}px`;
  }, []);

  const hideTip = useCallback(() => {
    if (tipRef.current) tipRef.current.style.opacity = '0';
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="fi-page">
        <section className="fi-section" ref={containerRef}>

          <div className="fi-mq-outer" aria-hidden="true">
            <div className="fi-mq-track">
              {[0,1,2,3].map(i => (
                <span key={i} className="fi-mq-text">
                  ARJUN&nbsp;AADHITH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              ))}
            </div>
          </div>

          <div className="fi-hl-wrap">
            <h2 className="fi-hl">Let's Work<br />Together!</h2>
          </div>

          <div ref={iconsWrapRef} className="fi-icons-wrap">
            {ICONS.map((icon) => (
              <IconSpan
                key={icon.id}
                icon={icon}
                onMouseEnter={e => showTip(e, icon.link ? 'Let\u2019s Connect \u2197' : 'Drag Me')}
                onMouseMove={moveTip}
                onMouseLeave={hideTip}
              />
            ))}
          </div>

          <div ref={canvasRef} className="fi-canvas-wrap" />
          <div ref={tipRef} className="fi-tooltip" />

        </section>
      </div>
    </>
  );
}

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ══════════════════════════════════════════
     DESKTOP BASE (1280px) — UNTOUCHED
  ══════════════════════════════════════════ */

  .fi-page {
    width: 100%;
    background: #fff;
    display: flex;
    align-items: stretch;
    justify-content: center;
    padding: 0 24px 24px;
    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .fi-section {
    position: relative;
    width: min(1480px, 100%);
    height: 94vh;
    min-height: 620px;
    max-height: 960px;
    background: #000;
    border-radius: 28px;
    overflow: hidden;
    flex-shrink: 0;
    cursor: grab;
    user-select: none;
    touch-action: pan-y;
  }
  .fi-section:active { cursor: grabbing; }

  /* Marquee */
  .fi-mq-outer {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 220px;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }
  .fi-mq-track {
    display: flex;
    width: max-content;
    animation: fi-mq-scroll 22s linear infinite;
    will-change: transform;
    padding-top: 14px;
  }
  @keyframes fi-mq-scroll {
    from { transform: translateX(0);    }
    to   { transform: translateX(-25%); }
  }
  .fi-mq-text {
    font-size: clamp(72px, 14vw, 175px);
    font-weight: 900;
    letter-spacing: -0.03em;
    color: rgba(255,255,255,0.062);
    white-space: nowrap;
    user-select: none;
    line-height: 1;
  }

  /* Headline */
  .fi-hl-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -62%);
    z-index: 2;
    text-align: center;
    pointer-events: none;
    width: 90%;
  }
  .fi-hl {
    font-size: clamp(56px, 10vw, 130px);
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.046em;
    line-height: 1.04;
  }

  .fi-icons-wrap {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 5;
  }

  .fi-icon {
    position: absolute;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    pointer-events: auto;
    user-select: none;
    -webkit-user-drag: none;
    will-change: transform, left, top;
    transform-origin: center center;
    cursor: grab;
    min-width: 44px;
    min-height: 44px;
  }
  .fi-icon:active { cursor: grabbing; }

  .fi-icon-img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
    pointer-events: none;
    -webkit-user-drag: none;
  }

  .fi-canvas-wrap {
    position: absolute;
    inset: 0;
    z-index: 4;
    pointer-events: none;
  }

  .fi-tooltip {
    position: absolute;
    z-index: 9999;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease;
    background: #fff;
    color: #000;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    font-family: 'Courier New', Courier, monospace;
    padding: 6px 12px;
    border-radius: 6px;
    white-space: nowrap;
    box-shadow: 2px 2px 0 #000, 0 4px 14px rgba(0,0,0,0.28);
    transform: translateY(-50%);
  }


  /* ══════════════════════════════════════════
     ULTRA-WIDE (1440px – 1600px)
  ══════════════════════════════════════════ */
  @media (min-width: 1440px) {
    .fi-page    { padding: 0 28px 28px; }
    .fi-section { border-radius: 32px; }
    .fi-hl      { font-size: clamp(64px, 9.5vw, 130px); }
    .fi-mq-outer { height: 240px; }
  }

  /* ══════════════════════════════════════════
     ULTRA-WIDE (1920px+)
  ══════════════════════════════════════════ */
  @media (min-width: 1920px) {
    .fi-page    { padding: 0 32px 32px; }
    .fi-section { height: 90vh; max-height: 1000px; border-radius: 36px; }
    .fi-hl      { font-size: clamp(72px, 8.5vw, 140px); }
    .fi-mq-text { font-size: clamp(80px, 12vw, 190px); }
    .fi-mq-outer { height: 260px; }
  }

  /* ══════════════════════════════════════════
     TABLET LANDSCAPE (1024px – 1279px)
  ══════════════════════════════════════════ */
  @media (min-width: 1024px) and (max-width: 1279px) {
    .fi-page    { padding: 0 20px 20px; }
    .fi-section { height: 92vh; border-radius: 26px; }
    .fi-hl      { font-size: clamp(52px, 10vw, 110px); }
    .fi-mq-text { font-size: clamp(60px, 13vw, 150px); }
    .fi-mq-outer { height: 200px; }
  }

  /* ══════════════════════════════════════════
     TABLET PORTRAIT (768px – 1023px)
  ══════════════════════════════════════════ */
  @media (min-width: 768px) and (max-width: 1023px) {
    .fi-page    { padding: 0 16px 20px; }
    .fi-section {
      height: 72vh;
      min-height: 460px;
      max-height: 680px;
      border-radius: 22px;
    }
    .fi-hl      { font-size: clamp(48px, 9.5vw, 88px); letter-spacing: -0.042em; }
    .fi-mq-text { font-size: clamp(56px, 12vw, 110px); }
    .fi-mq-outer { height: 160px; }
    .fi-tooltip { display: none; }
    .fi-section { cursor: default; }
    .fi-icon    { cursor: default; }
  }


  /* ══════════════════════════════════════════
     MOBILE — ALL (≤ 767px)
     Heights reduced, text enlarged
  ══════════════════════════════════════════ */
  @media (max-width: 767px) {
    .fi-page {
      padding: 0 12px 16px;
      overflow: visible;
    }

    .fi-section {
      height: 55vh;
      min-height: 300px;
      max-height: 460px;
      border-radius: 20px;
      overflow: hidden;
      /* touch-action: pan-y allows finger swipe-to-scroll on empty areas.
         Scroll on icon areas is blocked selectively via JS preventDefault */
      touch-action: pan-y;
      cursor: default;
    }

    .fi-hl-wrap {
      width: 94%;
      transform: translate(-50%, -58%);
    }

    /* ↑ Text enlarged vs previous versions */
    .fi-hl {
      font-size: clamp(38px, 11vw, 60px);
      letter-spacing: -0.040em;
      line-height: 1.05;
    }

    .fi-mq-text  { font-size: clamp(44px, 13.5vw, 72px); }
    .fi-mq-outer { height: 110px; }

    .fi-tooltip     { display: none !important; }
    .fi-icon        { cursor: default; }
    .fi-icon:active { cursor: default; }
    .fi-icons-wrap  { touch-action: pan-y; }
  }

  /* ══════════════════════════════════════════
     STANDARD MOBILE (360px – 414px)
  ══════════════════════════════════════════ */
  @media (min-width: 360px) and (max-width: 414px) {
    .fi-section {
      height: 53vh;
      min-height: 290px;
      max-height: 430px;
      border-radius: 18px;
    }
    .fi-hl      { font-size: clamp(36px, 10.5vw, 54px); }
    .fi-mq-text { font-size: clamp(40px, 13vw, 64px); }
    .fi-mq-outer { height: 104px; }
  }

  /* ══════════════════════════════════════════
     LARGE MOBILE (428px+)
     iPhone 14 Pro Max / Galaxy S Ultra
  ══════════════════════════════════════════ */
  @media (min-width: 428px) and (max-width: 767px) {
    .fi-page    { padding: 0 14px 18px; }
    .fi-section {
      height: 54vh;
      min-height: 300px;
      max-height: 450px;
      border-radius: 22px;
    }
    .fi-hl      { font-size: clamp(40px, 11vw, 58px); }
    .fi-mq-text { font-size: clamp(44px, 13.5vw, 70px); }
    .fi-mq-outer { height: 108px; }
  }

  /* ══════════════════════════════════════════
     SMALL MOBILE (≤ 375px)
     iPhone SE / Galaxy A / 320px
  ══════════════════════════════════════════ */
  @media (max-width: 375px) {
    .fi-page    { padding: 0 10px 14px; }
    .fi-section {
      height: 52vh;
      min-height: 270px;
      max-height: 400px;
      border-radius: 16px;
    }
    .fi-hl      { font-size: clamp(32px, 10vw, 48px); letter-spacing: -0.034em; }
    .fi-mq-text { font-size: clamp(36px, 12.5vw, 58px); }
    .fi-mq-outer { height: 96px; }
  }

  /* ══════════════════════════════════════════
     TINY (≤ 320px)
  ══════════════════════════════════════════ */
  @media (max-width: 320px) {
    .fi-page    { padding: 0 8px 12px; }
    .fi-section {
      height: 50vh;
      min-height: 250px;
      max-height: 360px;
      border-radius: 14px;
    }
    .fi-hl      { font-size: 28px; letter-spacing: -0.028em; }
    .fi-mq-text { font-size: 30px; }
    .fi-mq-outer { height: 84px; }
  }


  /* ══════════════════════════════════════════
     iOS SAFE AREA
  ══════════════════════════════════════════ */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    @media (max-width: 767px) {
      .fi-page {
        padding-bottom: calc(16px + env(safe-area-inset-bottom));
        padding-left:   calc(12px + env(safe-area-inset-left));
        padding-right:  calc(12px + env(safe-area-inset-right));
      }
    }
    @media (min-width: 428px) and (max-width: 767px) {
      .fi-page {
        padding-bottom: calc(18px + env(safe-area-inset-bottom));
        padding-left:   calc(14px + env(safe-area-inset-left));
        padding-right:  calc(14px + env(safe-area-inset-right));
      }
    }
    @media (min-width: 768px) and (max-width: 1023px) {
      .fi-page {
        padding-bottom: calc(20px + env(safe-area-inset-bottom));
        padding-left:   calc(16px + env(safe-area-inset-left));
        padding-right:  calc(16px + env(safe-area-inset-right));
      }
    }
  }

  /* ══════════════════════════════════════════
     REDUCED MOTION
  ══════════════════════════════════════════ */
  @media (prefers-reduced-motion: reduce) {
    .fi-mq-track { animation-duration: 60s; }
  }
`;