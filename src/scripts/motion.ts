/**
 * Motion: scroll reveals, the portrait's drift and the background lights'
 * fallback. Vanilla, no libraries, and nothing that takes over scrolling.
 *
 * Everything here only adds to a page that already works: without
 * JavaScript, or under prefers-reduced-motion, all content is visible and
 * nothing moves (the head script in BaseLayout only sets data-motion="on"
 * when motion is allowed, and the hiding CSS depends on it).
 *
 * Runs on astro:page-load (first load and every ClientRouter navigation)
 * and tears down on astro:before-swap, as every page script must.
 *
 * Only opacity and transform ever change, and scroll work is batched into
 * one requestAnimationFrame per frame, so it stays smooth on a mid-range
 * phone.
 */

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

let teardown: Array<() => void> = [];

function setUpReveals() {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-group]');
  if (!targets.length) return;

  // Items in a group follow one another: a small stagger, capped so a long
  // group never makes the last item wait.
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    group.querySelectorAll<HTMLElement>('[data-reveal-item]').forEach((item, i) => {
      item.style.setProperty('--i', String(Math.min(i, 5)));
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // About 15% in view, or a good slice of the screen for an element
        // too tall to ever be 15% visible (a long list on a phone).
        const enough = entry.intersectionRatio >= 0.15 || entry.intersectionRect.height >= innerHeight * 0.25;
        if (!entry.isIntersecting || !enough) continue;
        entry.target.classList.add('is-in');
        // Once only: never animate out or replay.
        observer.unobserve(entry.target);
      }
    },
    { threshold: [0, 0.15, 0.3] },
  );
  targets.forEach((target) => observer.observe(target));
  teardown.push(() => observer.disconnect());
}

/**
 * The portrait drifts a few pixels inside its frame as the page scrolls,
 * and, where the browser lacks CSS scroll-driven animations, the background
 * lights get their scroll position from here (--p, 0 to 1) instead.
 */
function setUpScrollEffects() {
  const portraits = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  const scrollTimelines = CSS.supports('animation-timeline: view()');
  const lights = scrollTimelines ? [] : [...document.querySelectorAll<HTMLElement>('[data-lights]')];
  if (!portraits.length && !lights.length) return;

  let frame = 0;
  const update = () => {
    frame = 0;
    const vh = innerHeight;
    for (const el of portraits) {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) continue;
      // -1 when the frame's centre is a screen below centre, 1 a screen above.
      const progress = Math.max(-1, Math.min(1, (vh / 2 - (rect.top + rect.height / 2)) / vh));
      el.style.setProperty('--parallax', `${(progress * 8).toFixed(2)}px`);
    }
    for (const el of lights) {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) continue;
      // 0 as the section enters at the bottom, 1 as it leaves at the top:
      // the same range as the CSS view() timeline.
      const p = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      el.style.setProperty('--p', p.toFixed(3));
    }
  };
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  update();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  teardown.push(() => {
    removeEventListener('scroll', onScroll);
    removeEventListener('resize', onScroll);
    cancelAnimationFrame(frame);
  });
}

function setUp() {
  if (reducedMotion.matches) return;
  setUpReveals();
  setUpScrollEffects();
}

function tearDown() {
  teardown.forEach((fn) => fn());
  teardown = [];
}

document.addEventListener('astro:page-load', setUp);
document.addEventListener('astro:before-swap', tearDown);
