(() => {
  const slides = [...document.querySelectorAll('.home-opening .hero-slide')];
  if (slides.length < 2) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, timer, ready = false;
  function schedule() {
    clearTimeout(timer);
    if (!ready || reduced.matches || document.hidden) return;
    timer = setTimeout(() => {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
      schedule();
    }, 6500);
  }
  function motionChanged() { schedule(); }
  reduced.addEventListener('change', motionChanged);
  document.addEventListener('visibilitychange', schedule);
  Promise.all(slides.map(img => img.decode())).then(() => {
    ready = true;
    motionChanged();
  }).catch(() => { /* Keep the first photograph if another image fails to load. */ });
})();
