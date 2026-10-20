(() => {
  'use strict';
  const qr = document.querySelector('.hero-qr');
  const icon = document.querySelector('.hero-brand-pair .hero-app-icon');
  const badge = document.querySelector('.site-header .app-store-badge');
  const dialog = document.querySelector('#qr-dialog');
  if (!qr || !badge || !icon || !dialog) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const codeSlot = dialog.querySelector('.qr-modal-code-slot');
  const badgeSlot = dialog.querySelector('.qr-modal-badge-slot');
  const iconSlot = dialog.querySelector('.qr-modal-icon-slot');
  const pieces = [qr, badge, icon];
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
    homes.set(element, { placeholder, rect, width: element.offsetWidth, angle: element === qr ? 7 : element === icon ? -7 : 0 });
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
    const isCode = element === qr, isIcon = element === icon;
    const entering = direction === 'in';
    const duration = entering ? (isIcon ? 1140 : isCode ? 1000 : 1040) : (isIcon ? 850 : isCode ? 750 : 790);
    let from;
    if (entering) from={x:dx,y:dy,scale,angle:home.angle};
    else {
      // Continue from the current pose if the user dismisses during the entrance.
      const matrix=new DOMMatrixReadOnly(startTransform);
      from={x:matrix.m41,y:matrix.m42,scale:Math.hypot(matrix.a,matrix.b),angle:Math.atan2(matrix.b,matrix.a)*180/Math.PI};
    }
    const to=entering ? {x:0,y:0,scale:1,angle:isIcon?-7:0} : {x:dx,y:dy,scale,angle:home.angle};
    const vx=to.x-from.x,vy=to.y-from.y,distance=Math.hypot(vx,vy);
    // Source's quadratic flight paths, with a lower swoop for the app icon.
    const bend=Math.min(320,distance*.9)*(isCode?1:-1)*(entering?1:-1);
    const cx=(from.x+to.x)/2-(isIcon?0:vy/(distance||1)*bend);
    const cy=isIcon ? Math.max(from.y,to.y)+Math.min(120,distance*.3) : (from.y+to.y)/2+vx/(distance||1)*bend;
    // One damped spring drives position, scale and rotation for all three pieces.
    const damping=.72,frequency=11.5,decay=damping*frequency;
    const oscillation=frequency*Math.sqrt(1-damping*damping);
    const frames=Array.from({length:97},(_,index)=>{
      const offset=index/96,time=offset*duration/1000;
      const envelope=Math.exp(-decay*time);
      const progress=index===96?1:1-envelope*(Math.cos(oscillation*time)+decay/oscillation*Math.sin(oscillation*time));
      const u=1-progress;
      const x=u*u*from.x+2*u*progress*cx+progress*progress*to.x;
      const y=u*u*from.y+2*u*progress*cy+progress*progress*to.y;
      const size=from.scale+(to.scale-from.scale)*progress;
      const wobble=index===96?0:-65/oscillation*envelope*Math.sin(oscillation*time);
      const angle=from.angle+(to.angle-from.angle)*progress+wobble;
      return {offset,transform:pose(x,y,size,angle)};
    });
    if(isCode){
      frames[0].borderRadius=entering?`${26/scale}px`:startRadius;
      frames[0].backgroundColor=entering?'#f2ffd6':startColor;
      frames[frames.length-1].borderRadius=entering?'25.5%':`${26/scale}px`;
      frames[frames.length-1].backgroundColor=entering?'#dfff3f':'#f2ffd6';
      if(!entering){
        // Lose the enlarged shadow before the card returns to its compact home.
        frames[0].boxShadow=getComputedStyle(element).boxShadow;
        frames[Math.round((frames.length-1)*.65)].boxShadow='0 0 0 0 rgba(0,0,0,0)';
        frames[frames.length-1].boxShadow='0 0 0 0 rgba(0,0,0,0)';
      }
    }
    return element.animate(frames,{
      duration,delay:entering&&isIcon?60:0,easing:'linear',fill:'both'
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
    iconSlot.append(icon);
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
