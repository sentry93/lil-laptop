(() => {
  'use strict';
  const qr = document.querySelector('.hero-qr');
  const badge = document.querySelector('.site-header .app-store-badge');
  const dialog = document.querySelector('#qr-dialog');
  if (!qr || !badge || !dialog) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const codeSlot = dialog.querySelector('.qr-modal-code-slot');
  const badgeSlot = dialog.querySelector('.qr-modal-badge-slot');
  const pieces = [qr, badge];
  const homes = new Map();
  let phase = 'closed', flights = [], ticket = 0, previousFocus = null;
  qr.setAttribute('role', 'button');

  function setPhase(value) { phase = value; dialog.dataset.state = value; }
  function stopFlights() { flights.forEach(animation => animation.cancel()); flights = []; }
  function rememberHome(element) {
    const style = getComputedStyle(element);
    const placeholder = document.createElement('span');
    placeholder.className = 'qr-home-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    Object.assign(placeholder.style, {
      display: style.display, width: `${element.offsetWidth}px`, height: `${element.offsetHeight}px`,
      margin: style.margin, flex: '0 0 auto'
    });
    element.before(placeholder);
    const rect = element.getBoundingClientRect();
    homes.set(element, { placeholder, rect, width: element.offsetWidth, angle: element === qr ? 7 : 0 });
  }
  function restore() {
    stopFlights();
    pieces.forEach(element => {
      const home = homes.get(element);
      if (home) home.placeholder.replaceWith(element);
    });
    homes.clear();
    dialog.classList.remove('is-visible');
    document.body.classList.remove('qr-modal-open');
    qr.setAttribute('aria-expanded', 'false');
    qr.removeAttribute('tabindex');
    if (dialog.open) dialog.close();
    setPhase('closed');
    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  }
  function travel(element, direction, startTransform, startRadius, startColor) {
    const home = homes.get(element);
    const target = element.getBoundingClientRect();
    const origin = direction === 'in' ? home.rect : home.placeholder.getBoundingClientRect();
    const dx = origin.left + origin.width / 2 - target.left - target.width / 2;
    const dy = origin.top + origin.height / 2 - target.top - target.height / 2;
    const scale = home.width / element.offsetWidth;
    const pose = (x, y, size, angle) => `translate(${x}px,${y}px) scale(${size}) rotate(${angle}deg)`;
    const isCode = element === qr;
    let frames;
    if (direction === 'in') {
      frames = [
        { transform: pose(dx, dy, scale, home.angle), offset: 0 },
        { transform: pose(-dx * .012, -dy * .012, 1.045, -3), offset: .62 },
        { transform: pose(dx * .004, dy * .004, .99, 2), offset: .79 },
        { transform: pose(0, -1, 1.008, -.7), offset: .91 },
        { transform: 'none', offset: 1 }
      ];
      if (isCode) {
        frames[0].borderRadius = `${26 / scale}px`;
        frames[0].backgroundColor = '#f2ffd6';
        frames[1].backgroundColor = '#dfff3f';
        frames[4].backgroundColor = '#dfff3f';
        frames[4].borderRadius = '40px';
      }
    } else {
      frames = [
        { transform: startTransform, offset: 0 },
        { transform: pose(dx * 1.008, dy * 1.008, scale * .97, home.angle + 3), offset: .67 },
        { transform: pose(dx * .997, dy * .997, scale * 1.015, home.angle - 1.2), offset: .86 },
        { transform: pose(dx, dy, scale, home.angle), offset: 1 }
      ];
      if (isCode) {
        frames[0].borderRadius = startRadius;
        frames[0].backgroundColor = startColor;
        frames[3].borderRadius = `${26 / scale}px`;
        frames[3].backgroundColor = '#f2ffd6';
      }
    }
    return element.animate(frames, {
      duration: direction === 'in' ? (isCode ? 1000 : 1120) : (isCode ? 660 : 700),
      easing: 'cubic-bezier(.25,.55,.3,1)', fill: 'both'
    });
  }
  async function openQR() {
    if (phase !== 'closed') return;
    const ownTicket = ++ticket;
    previousFocus = document.activeElement;
    pieces.forEach(rememberHome);
    setPhase('opening');
    qr.setAttribute('aria-expanded', 'true');
    document.body.classList.add('qr-modal-open');
    dialog.showModal();
    badgeSlot.append(badge);
    codeSlot.append(qr);
    qr.tabIndex = -1;
    badge.focus({ preventScroll: true });
    requestAnimationFrame(() => { if (dialog.open && phase !== 'closing') dialog.classList.add('is-visible'); });
    if (reduced.matches) { dialog.classList.add('is-visible'); setPhase('open'); return; }
    flights = pieces.map(element => travel(element, 'in'));
    await Promise.allSettled(flights.map(animation => animation.finished));
    if (ownTicket !== ticket) return;
    stopFlights(); setPhase('open');
  }
  async function closeQR() {
    if (phase === 'closed' || phase === 'closing') return;
    const ownTicket = ++ticket;
    const current = pieces.map(element => {
      const style = getComputedStyle(element);
      return { transform: style.transform, radius: style.borderRadius, color: style.backgroundColor };
    });
    stopFlights(); setPhase('closing'); dialog.classList.remove('is-visible');
    if (reduced.matches) { restore(); return; }
    flights = pieces.map((element, index) => travel(element, 'out', current[index].transform, current[index].radius, current[index].color));
    await Promise.allSettled(flights.map(animation => animation.finished));
    if (ownTicket === ticket) restore();
  }
  qr.addEventListener('click', event => { event.preventDefault(); openQR(); });
  qr.addEventListener('keydown', event => {
    if (event.key === ' ') { event.preventDefault(); openQR(); }
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) closeQR(); });
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeQR(); });
  window.addEventListener('resize', () => {
    if (phase === 'closed') return;
    ticket++; stopFlights();
    if (phase === 'closing') restore();
    else { setPhase('open'); dialog.classList.add('is-visible'); }
  });
  reduced.addEventListener('change', () => {
    if (!reduced.matches || phase === 'closed') return;
    ticket++; stopFlights();
    if (phase === 'closing') restore();
    else { setPhase('open'); dialog.classList.add('is-visible'); }
  });
})();
