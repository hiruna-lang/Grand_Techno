(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const intro = document.querySelector('.page-intro');
  let visited = false;
  try { visited = sessionStorage.getItem('grand-techno-visited') === 'yes'; sessionStorage.setItem('grand-techno-visited', 'yes'); } catch { /* Private/file browsing may block storage. */ }
  if (visited || reduced.matches) intro?.remove();

  // The CSS intro has its own timeout so a missing library never traps visitors.
  const safetyTimer = setTimeout(() => intro?.remove(), 2100);
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const delay = visited ? 0.05 : 0.95;
      if (intro?.isConnected) {
        intro.style.animation = 'none';
        gsap.to(intro, { yPercent: -101, delay: 0.75, duration: 0.85, ease: 'power3.inOut', onComplete: () => { intro.remove(); clearTimeout(safetyTimer); } });
      }
      const hero = gsap.timeline({ delay });
      hero.from('.hero-image', { scale: 1.04, duration: 1.65, ease: 'power2.out', clearProps: 'transform' }, 0)
        .from('.hero .title-line > span', { yPercent: 108, duration: 0.9, stagger: 0.11, ease: 'power3.out' }, 0.08)
        .from('.hero-subtitle, .hero-description', { y: 18, opacity: 0, duration: 0.75, stagger: 0.1 }, 0.3)
        .from('.hero .actions .btn', { y: 16, opacity: 0, duration: 0.6, stagger: 0.1 }, 0.5);
      gsap.utils.toArray('[data-reveal]').forEach(el => {
        gsap.from(el, { y: 40, opacity: 0, duration: 0.85, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
      });
      gsap.utils.toArray('[data-image-reveal]').forEach(el => {
        gsap.from(el, { clipPath: 'inset(100% 0 0 0)', duration: 1.05, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 93%', once: true } });
      });
      const gallery = document.querySelector('.gallery-grid');
      if (gallery) gsap.from('.gallery-item', { y: 24, opacity: 0, stagger: 0.025, duration: 0.65, scrollTrigger: { trigger: gallery, start: 'top 95%', once: true }, clearProps: 'all' });
      return () => { intro?.remove(); };
    });
    media.add('(min-width: 1051px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('.full-bleed > img').forEach(el => {
        gsap.fromTo(el, { yPercent: -3, scale: 1.07 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      });
    });
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }
  reduced.addEventListener('change', event => { if (event.matches) intro?.remove(); });

  const overlay = document.querySelector('.transition-overlay');
  let navigating = false;
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href]');
    if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.target === '_blank' || anchor.hasAttribute('download') || reduced.matches) return;
    const destination = new URL(anchor.href, window.location.href);
    if (destination.origin !== location.origin || !destination.pathname.endsWith('.html') || destination.pathname === location.pathname || !overlay) return;
    event.preventDefault();
    if (navigating) return;
    navigating = true;
    overlay.classList.add('leaving');
    setTimeout(() => { window.location.href = destination.href; }, 230);
  });
  // Reset when returning with the browser's back/forward cache.
  window.addEventListener('pageshow', () => { navigating = false; overlay?.classList.remove('leaving'); });
})();
