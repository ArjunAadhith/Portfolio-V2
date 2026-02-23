import { useRef, useState, useEffect, useCallback } from 'react';

const ICONS = [
  { id:'star',   src:'/f-icons/Star.png',      link:null,                   xPct:0.082, w:100,  h:100  },
  { id:'ln',     src:'/f-icons/Linkedin.png',  link:'https://www.linkedin.com/in/arjunaadhith5/', xPct:0.216, w:160, h:160 },
  { id:'bolt',   src:'/f-icons/Thunder.png',   link:null,                   xPct:0.316, w:100,  h:100  },
  { id:'mail',   src:'/f-icons/Mail.png',      link:'https://mail.google.com/mail/u/3/#inbox?compose=DmwnWstzWPGTbGNcDDvHphJRdnjVmrkLqnNbXxXGMkvpvBnJMcqddfGPMThXHjVPMPVfwWjnQKqQ', xPct:0.220, w:160, h:160 },
  { id:'smile',  src:'/f-icons/Smile.png',     link:null,                   xPct:0.375, w:120,  h:120  },
  { id:'otw',    src:'/f-icons/OTW.png',       link:null,                   xPct:0.474, w:220, h:100  },
  { id:'gear',   src:'/f-icons/Setting.png',   link:null,                   xPct:0.530, w:120,  h:120  },
  { id:'github', src:'/f-icons/Git.png',       link:'https://github.com/ArjunAadhith',   xPct:0.632, w:160,  h:160  },
  { id:'arrow',  src:'/f-icons/Arrow.png',     link:null,                   xPct:0.716, w:100,  h:100  },
  { id:'arrow2', src:'/f-icons/Cursor.png',    link:null,                   xPct:0.760, w:80,  h:80  },
  { id:'dragme', src:'/f-icons/Drag me.png',   link:null,                   xPct:0.874, w:156, h:60  },
];

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

export default function ContactSection() {
  const containerRef = useRef(null);
  const iconsWrapRef = useRef(null);
  const canvasRef    = useRef(null);
  const tipRef       = useRef(null);
  const cleanupRef   = useRef(null);
  const [triggered, setTriggered] = useState(false);

  /* Scroll trigger */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTriggered(true); obs.disconnect(); }
    }, { threshold: 0.10 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Physics */
  useEffect(() => {
    if (!triggered) return;
    let cancelled = false;

    (async () => {
      const M = await loadMatter();
      if (cancelled) return;

      const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint, Events, Body } = M;

      const container = containerRef.current;
      if (!container) return;
      const { width: W, height: H } = container.getBoundingClientRect();

      const engine = Engine.create();
      engine.world.gravity.y = 0.9;

      const render = Render.create({
        element: canvasRef.current,
        engine,
        options: { width: W, height: H, background: 'transparent', wireframes: false },
      });
      render.canvas.style.cssText =
        'position:absolute;inset:0;opacity:0;pointer-events:none;z-index:1;';

      const S = { isStatic: true, render: { fillStyle: 'transparent' } };
      World.add(engine.world, [
        Bodies.rectangle(W / 2,  H + 25, W + 100, 50,  S),
        Bodies.rectangle(-25,    H / 2,  50,      H*2, S),
        Bodies.rectangle(W + 25, H / 2,  50,      H*2, S),
        Bodies.rectangle(W / 2, -25,     W + 100, 50,  S),
      ]);

      const iconSpans  = iconsWrapRef.current.querySelectorAll('.fi-icon');
      const iconBodies = [...iconSpans].map((elem, i) => {
        const cfg    = ICONS[i];
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

      const mouse = Mouse.create(container);

      /* ── FIX: Matter.js adds a mousewheel listener that calls
         preventDefault(), which hijacks page scroll.
         Remove it immediately after Mouse.create().             ── */
      mouse.element.removeEventListener('mousewheel',    mouse.mousewheel);
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
      mouse.element.removeEventListener('wheel',         mouse.mousewheel);

      const mc = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, damping: 0.1, render: { visible: false } },
      });
      render.mouse = mouse;
      World.add(engine.world, mc);

      Events.on(mc, 'startdrag', () => container.style.cursor = 'grabbing');
      Events.on(mc, 'enddrag',   () => container.style.cursor = 'grab');

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

  /* Tooltip */
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
                <span key={i} className="fi-mq-text">ARJUN&nbsp;AADHITH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              ))}
            </div>
          </div>

          <div className="fi-hl-wrap">
            <h2 className="fi-hl">Let's Work<br />Together!</h2>
          </div>

          <div ref={iconsWrapRef} className="fi-icons-wrap">
            {ICONS.map((icon) => (
              <span
                key={icon.id}
                className="fi-icon"
                style={{ opacity: 0 }}
                onMouseEnter={e => showTip(e, icon.link ? 'Let’s Connect ↗' : 'Drag Me')}
                onMouseMove={moveTip}
                onMouseLeave={hideTip}
                onClick={() => icon.link && window.open(icon.link, '_blank', 'noopener,noreferrer')}
              >
                <img
                  src={icon.src}
                  alt={icon.id}
                  draggable={false}
                  className="fi-icon-img"
                />
              </span>
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

  /* ── Page: NO top padding — container sits flush against whatever is above ── */
  .fi-page {
    width: 100%;
    background: #fff;
    display: flex;
    align-items: stretch;
    justify-content: center;
    padding: 0 24px 24px;     /* top=0, sides=24px, bottom=24px */
    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  /* ── Black container ── */
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
    /* Allow native scroll to pass through when not dragging an icon */
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

  @media (max-width: 768px) {
    .fi-page    { padding: 0 12px 16px; }
    .fi-section { height: 80vh; border-radius: 20px; }
    .fi-hl      { font-size: 44px; }
    .fi-mq-text { font-size: 68px; }
  }
  @media (max-width: 480px) {
    .fi-section { height: 88vh; }
    .fi-hl      { font-size: 34px; }
  }
`;