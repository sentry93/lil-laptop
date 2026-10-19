const models = [{"id":"powerbook170","name":"Power Notebook","year":"1991","description":"A trackball. Chunky keys. A very good beginning.","variants":[{"id":"graphite","name":"Graphite","color":"#62635D","front":"model-powerbook170-front.webp","back":"model-powerbook170-lid.webp"}]},{"id":"ibook1999","name":"Jelly Notebook","year":"1999","description":"A little colour goes a long way. Pick your flavour.","variants":[{"id":"blueberry","name":"Blueberry","color":"#00BDC3","front":"model-ibook1999-front.webp","back":"model-ibook1999-lid.webp"},{"id":"tangerine","name":"Tangerine","color":"#FF7A08","front":"model-ibook1999-tangerine-front.webp","back":"model-ibook1999-tangerine-lid.webp"},{"id":"hotpink","name":"Hot Pink","color":"#FF159A","front":"model-ibook1999-hotpink-front.webp","back":"model-ibook1999-hotpink-lid.webp"},{"id":"neongreen","name":"Neon Green","color":"#A8FF00","front":"model-ibook1999-neongreen-front.webp","back":"model-ibook1999-neongreen-lid.webp"}]},{"id":"titanium2001","name":"Titanium Notebook","year":"2001","description":"Cool metal. Dark keys. Turn-of-the-century energy.","variants":[{"id":"titanium","name":"Titanium","color":"#B4B5B0","front":"model-titanium2001-front.webp","back":"model-titanium2001-lid.webp"}]},{"id":"macbook2006","name":"Snow Notebook","year":"2006","description":"The little white laptop you never quite forgot.","variants":[{"id":"white","name":"White","color":"#F6F4EC","front":"model-macbook2006-front.webp","back":"model-macbook2006-lid.webp"}]},{"id":"unibody2008","name":"Alloy Pro","year":"2008","description":"Black glass, silver edges, and a place for your ideas.","variants":[{"id":"silver","name":"Silver","color":"#BBBEC0","front":"model-unibody2008-front.webp","back":"model-unibody2008-lid.webp"}]},{"id":"air2010","name":"Feather Notebook","year":"2010","description":"Light on its feet. Big on little possibilities.","variants":[{"id":"silver","name":"Silver","color":"#C2C6C7","front":"model-air2010-front.webp","back":"model-air2010-lid.webp"}]},{"id":"pro2021","name":"Studio Pro","year":"2021","description":"A familiar modern desktop. A very personal little world.","variants":[{"id":"spacegray","name":"Space Gray","color":"#7D8084","front":"model-pro2021-front.webp","back":"model-pro2021-lid.webp"},{"id":"silver","name":"Silver","color":"#BDC0C2","front":"model-pro2021-silver-front.webp","back":"model-pro2021-silver-lid.webp"}]}];
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const collection = document.querySelector('#collection');
  const sideButtons = [...document.querySelectorAll('[data-side]')];
  sideButtons.forEach(button => button.addEventListener('click', () => {
    const back = button.dataset.side === 'back';
    collection.classList.toggle('show-lids', back);
    sideButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    document.querySelector('#collection-caption').textContent = back ? 'A very good other side.' : 'The inside story.';
    document.querySelectorAll('.device-front').forEach(face => face.setAttribute('aria-hidden', String(back)));
    document.querySelectorAll('.device-back').forEach(face => face.setAttribute('aria-hidden', String(!back)));
  }));
  const modelByID = new Map(models.map(model => [model.id, model]));
  document.querySelectorAll('.swatch').forEach(button => button.addEventListener('click', () => {
    const model = modelByID.get(button.dataset.model);
    const variant = model.variants.find(v => v.id === button.dataset.variant);
    const card = button.closest('.model-card');
    card.querySelectorAll('.swatch').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    card.querySelector('.variant-name').textContent = variant.name;
    const front = card.querySelector('.device-front img');
    const back = card.querySelector('.device-back img');
    front.src = variant.front;
    back.src = variant.back;
    front.alt = `${model.name} in ${variant.name}, open on iPhone Duo with its desktop and keyboard.`;
    back.alt = `${model.name} back lid in ${variant.name}.`;
    if (!reduced.matches) card.querySelector('.device-flipper').animate([
      {scale:'1'}, {scale:'.96'}, {scale:'1'}
    ], {duration:360, easing:'ease-out'});
  }));

  const desktopNames = {
    system7:['Monochrome', '1991'], macos86:['Platinum', '1999'], aqua101:['Aqua', '2001'],
    tiger104:['Brushed', '2005'], snow106:['Snow', '2009'], yosemite1010:['Flat', '2014'], sonoma14:['Modern', '2023']
  };
  const desktopImage = document.querySelector('#desktop-image');
  document.querySelectorAll('[data-os]').forEach(button => button.addEventListener('click', () => {
    const [name, year] = desktopNames[button.dataset.os];
    document.querySelectorAll('[data-os]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    desktopImage.src = `desktop-${button.dataset.os}.webp`;
    desktopImage.alt = `${name} desktop interface preview from lil laptop.`;
    document.querySelector('#desktop-label').textContent = `${name} / ${year}`;
    if (!reduced.matches) desktopImage.animate([{opacity:.25},{opacity:1}], {duration:350,easing:'ease-out'});
  }));

  const canvas = document.querySelector('#sticker-canvas');
  const placed = document.querySelector('#placed-stickers');
  const status = document.querySelector('#playground-status');
  const stickerNames = {'bow':'Checked Bow','flower':'Power Flower','make-stuff':'Make Stuff','open-late':'Open Late'};
  const spots = [[.26,.36,-15],[.74,.59,12],[.35,.70,-8],[.68,.29,15],[.49,.45,-17],[.22,.57,7],[.73,.75,-6],[.55,.24,13]];
  let sequence = 0;
  let layer = 1;
  function position(sticker, x, y) {
    sticker.dataset.x = String(Math.max(.12,Math.min(.88,x)));
    sticker.dataset.y = String(Math.max(.17,Math.min(.83,y)));
    sticker.style.left = `${Number(sticker.dataset.x)*100}%`;
    sticker.style.top = `${Number(sticker.dataset.y)*100}%`;
  }
  function addSticker(kind, announce = true) {
    if (placed.children.length >= 12) placed.firstElementChild.remove();
    const sticker = document.createElement('button');
    sticker.type = 'button';
    sticker.className = 'placed-sticker';
    sticker.setAttribute('aria-label', `${stickerNames[kind]} sticker. Use arrow keys to move; Delete to remove.`);
    const img = document.createElement('img');
    img.src = `sticker-${kind}.webp`;
    img.alt = '';
    img.draggable = false;
    sticker.append(img);
    const [x,y,rotation] = spots[sequence++ % spots.length];
    sticker.style.setProperty('--rotation',`${rotation}deg`);
    sticker.style.zIndex = String(layer++);
    position(sticker,x,y);
    placed.append(sticker);
    if (!reduced.matches) sticker.animate([{opacity:0,scale:1.6},{opacity:1,scale:.9},{opacity:1,scale:1}], {duration:340,easing:'cubic-bezier(.2,.8,.3,1)'});
    let drag = null;
    sticker.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      const bounds = canvas.getBoundingClientRect();
      drag = {dx:(event.clientX-bounds.left)/bounds.width-Number(sticker.dataset.x), dy:(event.clientY-bounds.top)/bounds.height-Number(sticker.dataset.y)};
      sticker.style.zIndex = String(layer++);
      sticker.setPointerCapture(event.pointerId);
    });
    sticker.addEventListener('pointermove', event => {
      if (!drag) return;
      const bounds = canvas.getBoundingClientRect();
      position(sticker,(event.clientX-bounds.left)/bounds.width-drag.dx,(event.clientY-bounds.top)/bounds.height-drag.dy);
    });
    const finish = () => { if (drag) status.textContent = `${stickerNames[kind]} moved. Looking very you.`; drag = null; };
    sticker.addEventListener('pointerup',finish);
    sticker.addEventListener('pointercancel',finish);
    sticker.addEventListener('lostpointercapture',finish);
    sticker.addEventListener('keydown',event => {
      const step = event.shiftKey ? .05 : .02;
      const directions = {ArrowLeft:[-step,0],ArrowRight:[step,0],ArrowUp:[0,-step],ArrowDown:[0,step]};
      if (directions[event.key]) {
        event.preventDefault();
        const [dx,dy] = directions[event.key];
        position(sticker,Number(sticker.dataset.x)+dx,Number(sticker.dataset.y)+dy);
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        sticker.remove();
        status.textContent = `${stickerNames[kind]} removed.`;
        document.querySelector(`[data-sticker="${kind}"]`).focus();
      }
    });
    if (announce) status.textContent = `${stickerNames[kind]} added. Drag it on the lid, or focus it and use the arrow keys.`;
  }
  document.querySelectorAll('[data-sticker]').forEach(button => button.addEventListener('click',() => addSticker(button.dataset.sticker)));
  document.querySelector('#reset-stickers').addEventListener('click',() => {
    placed.replaceChildren(); sequence = 0;
    status.textContent = 'A fresh lid. Make it yours.';
  });
  addSticker('bow',false); addSticker('make-stuff',false);

  const tilt = document.querySelector('.tilt');
  let frame = null;
  tilt.addEventListener('pointermove', event => {
    if (reduced.matches || event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover)').matches) return;
    const box = tilt.getBoundingClientRect();
    const x = (event.clientX-box.left)/box.width-.5;
    const y = (event.clientY-box.top)/box.height-.5;
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      tilt.style.setProperty('--rx',`${-y*9}deg`);
      tilt.style.setProperty('--ry',`${x*12}deg`);
      frame = null;
    });
  });
  tilt.addEventListener('pointerleave',() => {
    if (frame) cancelAnimationFrame(frame);
    tilt.style.setProperty('--rx','0deg'); tilt.style.setProperty('--ry','0deg');
  });
  // All content is visible by default; motion is an enhancement.
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), {threshold:.06,rootMargin:'0px 0px 30px 0px'});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  } else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));
  document.documentElement.classList.add('enhanced');
})();
