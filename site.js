const models = [{"id":"powerbook170","name":"Power Notebook","year":"1991","description":"A trackball. Chunky keys. A very good beginning.","variants":[{"id":"graphite","name":"Graphite","color":"#62635D","front":"model-powerbook170-front.webp","back":"model-powerbook170-lid.webp"}]},{"id":"ibook1999","name":"Jelly Notebook","year":"1999","description":"A little colour goes a long way. Pick your flavour.","variants":[{"id":"blueberry","name":"Blueberry","color":"#00BDC3","front":"model-ibook1999-front.webp","back":"model-ibook1999-lid.webp"},{"id":"tangerine","name":"Tangerine","color":"#FF7A08","front":"model-ibook1999-tangerine-front.webp","back":"model-ibook1999-tangerine-lid.webp"},{"id":"hotpink","name":"Hot Pink","color":"#FF159A","front":"model-ibook1999-hotpink-front.webp","back":"model-ibook1999-hotpink-lid.webp"},{"id":"neongreen","name":"Neon Green","color":"#A8FF00","front":"model-ibook1999-neongreen-front.webp","back":"model-ibook1999-neongreen-lid.webp"}]},{"id":"titanium2001","name":"Titanium Notebook","year":"2001","description":"Cool metal. Dark keys. Turn-of-the-century energy.","variants":[{"id":"titanium","name":"Titanium","color":"#B4B5B0","front":"model-titanium2001-front.webp","back":"model-titanium2001-lid.webp"}]},{"id":"macbook2006","name":"Snow Notebook","year":"2006","description":"The little white laptop you never quite forgot.","variants":[{"id":"white","name":"White","color":"#F6F4EC","front":"model-macbook2006-front.webp","back":"model-macbook2006-lid.webp"}]},{"id":"unibody2008","name":"Alloy Pro","year":"2008","description":"Black glass, silver edges, and a place for your ideas.","variants":[{"id":"silver","name":"Silver","color":"#BBBEC0","front":"model-unibody2008-front.webp","back":"model-unibody2008-lid.webp"}]},{"id":"air2010","name":"Feather Notebook","year":"2010","description":"Light on its feet. Big on little possibilities.","variants":[{"id":"silver","name":"Silver","color":"#C2C6C7","front":"model-air2010-front.webp","back":"model-air2010-lid.webp"}]},{"id":"pro2021","name":"Studio Pro","year":"2021","description":"A familiar modern desktop. A very personal little world.","variants":[{"id":"spacegray","name":"Space Gray","color":"#7D8084","front":"model-pro2021-front.webp","back":"model-pro2021-lid.webp"},{"id":"silver","name":"Silver","color":"#BDC0C2","front":"model-pro2021-silver-front.webp","back":"model-pro2021-silver-lid.webp"}]}];
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const collection = document.querySelector('#collection');
  const sideButtons = [...collection.querySelectorAll('[data-side]')];
  sideButtons.forEach(button => button.addEventListener('click', () => {
    const back = button.dataset.side === 'back';
    collection.classList.toggle('show-lids', back);
    sideButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    document.querySelector('#collection-caption').textContent = back ? 'A little personality, all around.' : 'Pick your alter ego.';
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
    document.querySelector('#desktop-label').textContent = name;
    if (!reduced.matches) desktopImage.animate([{opacity:.25},{opacity:1}], {duration:350,easing:'ease-out'});
  }));

  const canvas = document.querySelector('#sticker-canvas');
  const placed = document.querySelector('#placed-stickers');
  const status = document.querySelector('#playground-status');
  const stickerNames = {"bow": "Checked Bow", "flower": "Power Flower", "make-stuff": "Make Stuff", "open-late": "Open Late", "circuit-club-01": "Desktop Garden", "circuit-club-02": "Side A", "circuit-club-03": "Pocket Rangefinder", "circuit-club-04": "Patch Cable", "circuit-club-05": "Waveform Lab", "circuit-club-06": "Keycap Trio", "circuit-club-07": "Minute Keeper", "circuit-club-08": "Extra Life", "circuit-club-09": "Save Something", "circuit-club-10": "Human Inside", "circuit-club-11": "Orbital Relay", "wayfarer-01": "Lunar Moth", "wayfarer-02": "Quiet Heron", "wayfarer-03": "Fern Frond", "wayfarer-04": "Long Way Home", "wayfarer-05": "Forest Floor", "wayfarer-06": "Slow Traveller", "wayfarer-07": "Jewel Beetle", "wayfarer-08": "Silver Sardine", "wayfarer-09": "Ribbon Snake", "wayfarer-10": "Moon Study", "wayfarer-11": "Wild Stems", "wayfarer-12": "Elsewhere Map", "fruit-stand-01": "Late Lunch Tin", "fruit-stand-02": "Iced Matcha", "fruit-stand-03": "Blue Espresso", "fruit-stand-04": "Special Delivery", "fruit-stand-05": "Night Owl Matches", "fruit-stand-06": "Striped Vase", "fruit-stand-07": "Red Canvas", "fruit-stand-08": "Lucky Charms", "fruit-stand-10": "Good Eggs", "fruit-stand-11": "Day Dream Bottle", "fruit-stand-12": "One More Chapter", "type-and-play-02": "Soft Ware", "type-and-play-04": "Stay Curious", "type-and-play-05": "Slow Is A Speed", "type-and-play-06": "And Then Some", "type-and-play-07": "Less But Better", "type-and-play-08": "One More Page", "type-and-play-09": "Local Only", "type-and-play-10": "Side Quest", "type-and-play-11": "A Little Wonder", "type-and-play-12": "Good Enough"};
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

  const gallery = document.querySelector('.models-grid');
  document.querySelectorAll('[data-gallery-step]').forEach(button => button.addEventListener('click', () => {
    gallery.scrollBy({left:Number(button.dataset.galleryStep)*(gallery.querySelector('.model-card').getBoundingClientRect().width+30), behavior:reduced.matches?'instant':'smooth'});
  }));
  gallery.addEventListener('keydown', event => {
    if (event.target !== gallery || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault(); gallery.scrollBy({left:(event.key==='ArrowRight'?1:-1)*320,behavior:reduced.matches?'instant':'smooth'});
  });
  const tray = document.querySelector('.sticker-tray');
  document.querySelectorAll('[data-stickers-step]').forEach(button => button.addEventListener('click', () => {
    tray.scrollBy({left:Number(button.dataset.stickersStep)*tray.clientWidth*.8,behavior:reduced.matches?'instant':'smooth'});
  }));
  // A mouse can pull the collection like a row of objects. Buttons keep their own click behaviour.
  let shelfDrag = null;
  gallery.addEventListener('pointerdown',event => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('button,a')) return;
    shelfDrag={x:event.clientX,left:gallery.scrollLeft}; gallery.setPointerCapture(event.pointerId);
  });
  gallery.addEventListener('pointermove',event => {
    if (shelfDrag) gallery.scrollLeft=shelfDrag.left+shelfDrag.x-event.clientX;
  });
  ['pointerup','pointercancel','lostpointercapture'].forEach(type => gallery.addEventListener(type,()=>shelfDrag=null));

  const heroArt = document.querySelector('.hero-art');
  const heroImage = document.querySelector('.hero-device');
  const heroSurface = document.querySelector('.render-surface');
  const heroLabel = document.querySelector('#hero-model-name');
  const heroButton = document.querySelector('#hero-device-button');
  const looks = [
    {id:'blue',name:'Blueberry',open:'hero-blue-open.webp',closed:'hero-blue-closed.webp'},
    {id:'orange',name:'Tangerine',open:'hero-orange-open.webp',closed:'hero-orange-closed.webp'}
  ];
  const decorationChoices = Object.keys(stickerNames);
  let lookIndex=0, decorationIndex=0, heroClosed=false;
  let heroTimer=null, heroMotion=null, heroHover=false, heroFocus=false, transitionID=0;
  const paused = () => reduced.matches || document.hidden || heroHover || heroFocus || heroClosed;
  function paintHero() {
    const look=looks[lookIndex];
    heroImage.src=heroClosed?look.closed:look.open;
    heroImage.alt=heroClosed?`Closed ${look.name} Jelly Notebook lid on iPhone Duo.`:`${look.name} Jelly Notebook on iPhone Duo in the angled open pose, with a black interior surround and small deck stickers.`;
    heroLabel.textContent=`Jelly Notebook / ${look.name}`;
    heroButton.dataset.side=heroClosed?'closed':'open';
    heroButton.setAttribute('aria-pressed',String(heroClosed));
    heroButton.setAttribute('aria-label',heroClosed?`Spin to open the ${look.name} Jelly Notebook`:`Spin to see the closed ${look.name} Jelly Notebook lid`);
  }
  function changeDecorations() {
    decorationIndex=(decorationIndex+7)%decorationChoices.length;
    const slots=[document.querySelector('#hero-ornament-left'),document.querySelector('#hero-ornament-right'),...document.querySelectorAll('[data-deck-sticker]')];
    slots.forEach((slot,index)=>{
      const kind=decorationChoices[(decorationIndex+index*5)%decorationChoices.length];
      if(slot.tagName.toLowerCase()==='image')slot.setAttribute('href',`sticker-${kind}.webp`);
      else slot.src=`sticker-${kind}.webp`;
    });
  }
  function scheduleHero() {
    clearTimeout(heroTimer);heroTimer=null;
    heroArt.classList.toggle('is-paused',paused());
    if(!paused()&&!heroMotion)heroTimer=setTimeout(cycleHero,3400);
  }
  function cancelHeroMotion() {
    transitionID++;
    if(heroMotion){heroMotion.cancel();heroMotion=null;}
    clearTimeout(heroTimer);heroTimer=null;
  }
  async function moveHero(change,spin=false) {
    cancelHeroMotion();
    const token=transitionID;
    if(reduced.matches){change();paintHero();scheduleHero();return;}
    let motion=null;
    try {
      motion=heroSurface.animate(spin?[
        {transform:'perspective(1000px) rotateY(0deg)',opacity:1},
        {transform:'perspective(1000px) rotateY(90deg)',opacity:.5}
      ]:[
        {translate:'0 0',scale:'1',opacity:1},
        {translate:'0 6px',scale:'1.015 .97',opacity:1,offset:.35},
        {translate:'0 -24px',scale:'.96 1.02',opacity:0}
      ],{duration:spin?240:220,easing:'ease-in',fill:'forwards'});
      heroMotion=motion;
      await motion.finished;
      if(token!==transitionID)return;
      change();paintHero();
      await heroImage.decode().catch(()=>{});
      if(token!==transitionID)return;
      motion.cancel();
      motion=heroSurface.animate(spin?[
        {transform:'perspective(1000px) rotateY(270deg)',opacity:.5},
        {transform:'perspective(1000px) rotateY(360deg)',opacity:1}
      ]:[
        {translate:'0 -24px',scale:'.96 1.02',opacity:0},
        {translate:'0 7px',scale:'1.025 .98',opacity:1,offset:.5},
        {translate:'0 -3px',scale:'.995 1.005',opacity:1,offset:.8},
        {translate:'0 0',scale:'1',opacity:1}
      ],{duration:spin?500:560,easing:'cubic-bezier(.2,.7,.25,1)',fill:'forwards'});
      heroMotion=motion;
      if(!spin && paused())motion.pause();
      await motion.finished;
    }catch(_){ /* A new click or pointer exit replaces the previous motion. */ }
    finally {
      if(motion)motion.cancel();
      if(token===transitionID){heroMotion=null;scheduleHero();}
    }
  }
  function cycleHero() {
    heroTimer=null;
    if(paused())return;
    moveHero(()=>{lookIndex=(lookIndex+1)%looks.length;changeDecorations();});
  }
  function syncHero() {
    heroArt.classList.toggle('is-paused',paused());
    clearTimeout(heroTimer);heroTimer=null;
    // Pointer hover holds an automatic bounce, while deliberate spin clicks always finish.
    if(heroMotion && !heroClosed && !heroButton.dataset.spinning){if(paused())heroMotion.pause();else heroMotion.play();}
    else if(!heroMotion)scheduleHero();
  }
  heroButton.addEventListener('click',()=>{
    const next=!heroClosed;
    heroButton.dataset.spinning='true';
    moveHero(()=>{heroClosed=next;},true).finally(()=>{delete heroButton.dataset.spinning;scheduleHero();});
  });
  heroArt.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){heroHover=true;syncHero();}});
  heroArt.addEventListener('pointerleave',()=>{
    heroHover=false;
    delete heroButton.dataset.spinning;
    cancelHeroMotion();
    heroClosed=false;paintHero();scheduleHero();
  });
  heroButton.addEventListener('focusin',()=>{heroFocus=heroButton.matches(':focus-visible');syncHero();});
  heroButton.addEventListener('focusout',()=>{heroFocus=false;heroClosed=false;cancelHeroMotion();paintHero();scheduleHero();});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){cancelHeroMotion();heroClosed=false;paintHero();}
    scheduleHero();
  });
  reduced.addEventListener('change',()=>{cancelHeroMotion();heroClosed=false;paintHero();scheduleHero();});
  looks.forEach(look=>[look.open,look.closed].forEach(src=>{const image=new Image();image.src=src;}));
  scheduleHero();

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
