import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="sr-word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : window;

    // Collect only this component's triggers — never kill others (e.g. Shuffle)
    const triggers = [];
    const wordEls = el.querySelectorAll('.sr-word');

    // ── Container rotation ─────────────────────────────────────────────
    // end: 'top 60%' is always reachable on a full-height section.
    // scrub: 0.5 catches up in 0.5s — no stuck half-rotated state.
    const rotTween = gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start:   'top 95%',
          end:     'top 60%',
          scrub:   0.5,
          // Force to final state once the end marker is passed
          onLeave:     () => gsap.set(el, { rotate: 0 }),
          onLeaveBack: () => gsap.set(el, { rotate: baseRotation }),
        },
      }
    );
    if (rotTween.scrollTrigger) triggers.push(rotTween.scrollTrigger);

    // ── Word opacity ───────────────────────────────────────────────────
    // end: 'top 55%' — for a 100vh section the top edge will pass 55%
    // as soon as the section is fully on-screen, so onLeave fires and
    // snaps everything to opacity:1 with zero lag even if scrub hasn't
    // caught up yet.
    const opTween = gsap.fromTo(
      wordEls,
      { opacity: baseOpacity },
      {
        ease: 'none',
        opacity: 1,
        stagger: 0.08,
        scrollTrigger: {
          trigger: el,
          scroller,
          start:   'top 95%',
          end:     'top 55%',
          scrub:   0.5,
          onLeave:     () => gsap.set(wordEls, { opacity: 1,           willChange: 'auto' }),
          onLeaveBack: () => gsap.set(wordEls, { opacity: baseOpacity                    }),
        },
      }
    );
    if (opTween.scrollTrigger) triggers.push(opTween.scrollTrigger);

    // ── Word blur ──────────────────────────────────────────────────────
    // Identical start/end to opacity so both complete at the same scroll pos.
    if (enableBlur) {
      const blurTween = gsap.fromTo(
        wordEls,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: 'none',
          filter: 'blur(0px)',
          stagger: 0.08,
          scrollTrigger: {
            trigger: el,
            scroller,
            start:   'top 95%',
            end:     'top 55%',
            scrub:   0.5,
            onLeave:     () => gsap.set(wordEls, { filter: 'blur(0px)',              willChange: 'auto' }),
            onLeaveBack: () => gsap.set(wordEls, { filter: `blur(${blurStrength}px)`                  }),
          },
        }
      );
      if (blurTween.scrollTrigger) triggers.push(blurTween.scrollTrigger);
    }

    // Scoped cleanup — only kills THIS component's triggers
    return () => {
      triggers.forEach(t => t.kill());
    };
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    blurStrength,
  ]);

  return (
    <div ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </div>
  );
};

export default ScrollReveal;