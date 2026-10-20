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
    // Reuse Source onboarding's sampled quadratic arc, then settle with a soft wobble.
    const arcFrames = (from, to, endOffset, returning) => {
      const vx=to.x-from.x,vy=to.y-from.y,distance=Math.hypot(vx,vy);
      const bend=Math.min(320,distance*.9)*(isCode?1:-1)*(returning?-1:1);
      const cx=(from.x+to.x)/2-vy/(distance||1)*bend;
      const cy=(from.y+to.y)/2+vx/(distance||1)*bend;
      return Array.from({length:33},(_,index)=>{
        const t=index/32,u=1-t;
        const x=u*u*from.x+2*u*t*cx+t*t*to.x;
        const y=u*u*from.y+2*u*t*cy+t*t*to.y;
        const size=from.scale+(to.scale-from.scale)*t;
        const angle=from.angle+(to.angle-from.angle)*t-6*Math.sin(Math.PI*t);
        return {offset:t*endOffset,transform:pose(x,y,size,angle)};
      });
    };
    let frames;
    if (direction === 'in') {
      frames=arcFrames({x:dx,y:dy,scale,angle:home.angle},{x:0,y:0,scale:1.035,angle:-2.5},.76,false);
      frames.push(
        {transform:pose(0,2,.99,1.7),offset:.87},
        {transform:pose(0,-1,1.005,-.55),offset:.95},
        {transform:'none',offset:1}
      );
      if (isCode) {
        frames[0].borderRadius = `${26 / scale}px`;
        frames[0].backgroundColor = '#f2ffd6';
        frames[32].backgroundColor = '#dfff3f';
        frames[frames.length-1].backgroundColor = '#dfff3f';
        frames[frames.length-1].borderRadius = '40px';
      }
    } else {
      // Capture the in-flight pose too, so an early dismissal has no position jump.
      const matrix=new DOMMatrixReadOnly(startTransform);
      const from={x:matrix.m41,y:matrix.m42,scale:Math.hypot(matrix.a,matrix.b),angle:Math.atan2(matrix.b,matrix.a)*180/Math.PI};
      frames=arcFrames(from,{x:dx,y:dy,scale:scale*.98,angle:home.angle+2},.79,true);
      frames.push(
        {transform:pose(dx,dy,scale*1.01,home.angle-.8),offset:.92},
        {transform:pose(dx,dy,scale,home.angle),offset:1}
      );
      if (isCode) {
        frames[0].borderRadius = startRadius;
        frames[0].backgroundColor = startColor;
        frames[frames.length-1].borderRadius = `${26 / scale}px`;
        frames[frames.length-1].backgroundColor = '#f2ffd6';
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
