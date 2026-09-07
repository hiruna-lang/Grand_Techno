(() => {
  'use strict';
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return;
  const all = [...grid.querySelectorAll('.gallery-item')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const count = document.querySelector('#gallery-count');
  const viewer = document.querySelector('.lightbox');
  const image = viewer.querySelector('img');
  const caption = viewer.querySelector('figcaption');
  const counter = viewer.querySelector('.lightbox-counter');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = [...all];
  let index = 0;
  let opener = null;

  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    // Kill an in-progress entrance before toggling display on its targets.
    window.gsap?.killTweensOf(all);
    all.forEach(item => {
      item.style.removeProperty('opacity'); item.style.removeProperty('transform');
      item.hidden = category !== 'All' && item.dataset.category !== category;
    });
    visible = all.filter(item => !item.hidden);
    count.textContent = `${visible.length} ${visible.length === 1 ? 'moment' : 'moments'}${category === 'All' ? ', one beautiful destination' : ` · ${category}`}`;
    if (window.gsap && !reduced.matches) {
      gsap.fromTo(visible, { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.035, duration: 0.45, clearProps: 'opacity,transform', overwrite: true });
    }
    window.ScrollTrigger?.refresh();
  }));
  function show(offset) {
    index = (offset + visible.length) % visible.length;
    const source = visible[index].querySelector('img');
    image.src = source.src;
    image.alt = source.alt;
    caption.textContent = source.alt;
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(visible.length).padStart(2, '0')}`;
  }
  function open(item) {
    opener = item;
    show(visible.indexOf(item));
    viewer.showModal();
    document.body.classList.add('locked');
    viewer.querySelector('.lightbox-close').focus();
  }
  all.forEach(item => item.addEventListener('click', () => open(item)));
  viewer.querySelector('.lightbox-close').addEventListener('click', () => viewer.close());
  viewer.querySelector('.lightbox-prev').addEventListener('click', () => show(index - 1));
  viewer.querySelector('.lightbox-next').addEventListener('click', () => show(index + 1));
  viewer.addEventListener('close', () => {
    document.body.classList.remove('locked');
    opener?.focus({ preventScroll: true });
  });
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
    // Native <dialog> supplies Escape dismissal and focus containment.
  });
  const linkedPhoto = all.find(item => `#${item.id}` === window.location.hash);
  if (linkedPhoto) open(linkedPhoto);
})();
