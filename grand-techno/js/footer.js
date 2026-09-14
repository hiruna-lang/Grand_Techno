// Keep long footer link lists optional on phones; all links stay visible on
// larger screens. Native details supplies keyboard and screen-reader behavior.
(() => {
  const groups = [...document.querySelectorAll('.footer-disclosure')];
  const phone = window.matchMedia('(max-width: 600px)');
  function setLayout() {
    groups.forEach(group => {
      group.open = !phone.matches;
      group.querySelector('summary').tabIndex = phone.matches ? 0 : -1;
    });
  }
  groups.forEach(group => group.querySelector('summary').addEventListener('click', event => {
    if (!phone.matches) event.preventDefault();
  }));
  phone.addEventListener('change', setLayout);
  setLayout();
})();
