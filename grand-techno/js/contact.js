(() => {
  'use strict';
  const form = document.querySelector('.inquiry-form');
  if (!form) return;
  const status = document.querySelector('#form-status');
  const statusText = document.querySelector('#status-text');
  const preview = document.querySelector('#message-preview');
  const whatsapp = document.querySelector('#open-whatsapp');
  const date = form.elements.namedItem('date');
  const inquiry = form.elements.namedItem('inquiry');
  const localDate = new Date();
  const today = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
  date.min = today;
  const requested = new URLSearchParams(window.location.search).get('inquiry');
  if ([...inquiry.options].some(option => option.value === requested)) inquiry.value = requested;
  const number = window.GRAND_TECHNO?.whatsappNumber || '';
  const configured = /^\d{8,15}$/.test(number);
  if (configured) form.querySelector('.form-note').textContent = 'Your inquiry opens in WhatsApp for you to review and send. Availability and reservations are confirmed by the venue. This website does not store your inquiry.';

  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = form.elements.namedItem('name');
    name.value = name.value.trim();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const value = key => String(data.get(key) || '').trim() || 'Not specified';
    const message = [
      'Hello Grand Techno,', '',
      `Name: ${value('name')}`, `Phone: ${value('phone')}`,
      `Email: ${value('email')}`, `Inquiry: ${value('inquiry')}`,
      `Date: ${value('date')}`, `Time: ${value('time')}`,
      `Guests: ${value('guests')}`, '', `Message: ${value('message')}`,
    ].join('\n');
    preview.value = message;
    status.hidden = false;
    if (configured) {
      const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
      whatsapp.href = url;
      whatsapp.hidden = false;
      statusText.textContent = 'Your inquiry is ready. Review and send it in WhatsApp. If a new tab did not open, use the Open WhatsApp button below. This is not yet a confirmed reservation.';
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      whatsapp.hidden = true;
      statusText.textContent = 'Your inquiry is ready to copy. Grand Techno’s official WhatsApp number has not been added yet, so no message has been sent.';
    }
    status.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  });
  document.querySelector('#copy-message').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard not available');
      await navigator.clipboard.writeText(preview.value);
      statusText.textContent = 'Inquiry copied. You can paste it into your conversation with Grand Techno. No message has been sent by this website.';
    } catch {
      preview.focus(); preview.select();
      statusText.textContent = 'Your inquiry is selected. Use your device’s Copy command to copy the message.';
    }
  });
})();
