/* Set verified venue details here before publishing. International digits only,
   e.g. country code followed by the number, without a leading + or spaces. */
window.GRAND_TECHNO = Object.freeze({
  whatsappNumber: '94724832444',
  phoneNumber: '94724832444',
  phoneDisplay: '+94 72 483 2444',
  mapsUrl: '',
});

(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const main = document.querySelector('main');
  const footer = document.querySelector('.site-footer');
  const floating = document.querySelector('.floating-contact');
  const desktop = window.matchMedia('(min-width: 1051px)');
  let menuOpen = false;

  function setMenu(open, restoreFocus = true) {
    menuOpen = open;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('locked', open);
    [main, footer, floating].forEach(el => { if (el) el.inert = open; });
    if (open) menu.querySelector('a').focus();
    else if (restoreFocus) toggle.focus();
  }
  toggle?.addEventListener('click', () => setMenu(!menuOpen));
  menu?.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false, false);
  });
  document.addEventListener('keydown', event => {
    if (!menuOpen) return;
    if (event.key === 'Escape') { event.preventDefault(); setMenu(false); }
    if (event.key === 'Tab') {
      // Cycle explicitly: the toggle is before the panel in DOM order.
      const items = [toggle, ...menu.querySelectorAll('a[href], button:not([disabled])')];
      const current = items.indexOf(document.activeElement);
      const next = event.shiftKey ? (current <= 0 ? items.length - 1 : current - 1) : (current + 1) % items.length;
      event.preventDefault();
      items[next].focus();
    }
  });
  desktop.addEventListener('change', event => { if (event.matches && menuOpen) setMenu(false, false); });
  let scrollQueued = false;
  function updateHeader() {
    header?.classList.toggle('scrolled', window.scrollY > 40);
    scrollQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollQueued) { requestAnimationFrame(updateHeader); scrollQueued = true; }
  }, { passive: true });
  updateHeader();
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  const config = window.GRAND_TECHNO;
  const validNumber = value => /^\d{8,15}$/.test(value);
  if (validNumber(config.whatsappNumber)) {
    document.querySelectorAll('[data-whatsapp]').forEach(el => {
      el.href = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent('Hello Grand Techno, I would like to inquire about a visit.')}`;
      el.target = '_blank'; el.rel = 'noopener noreferrer';
    });
  }
  if (validNumber(config.phoneNumber)) {
    document.querySelectorAll('[data-call]').forEach(el => { el.href = `tel:+${config.phoneNumber}`; });
    document.querySelectorAll('[data-contact-phone], [data-contact-short]').forEach(el => {
      el.textContent = config.phoneDisplay || `+${config.phoneNumber}`;
    });
    document.querySelectorAll('.contact-card small').forEach(el => {
      if (el.textContent === 'Official number to be confirmed') el.textContent = 'Contact us to plan your visit';
    });
  }
  if (config.mapsUrl && /^https:\/\//.test(config.mapsUrl)) {
    const mapLink = document.querySelector('.map-marker a');
    if (mapLink) mapLink.href = config.mapsUrl;
  }
})();
