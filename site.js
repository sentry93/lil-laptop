const models = [{"id":"powerbook170","name":"Power Notebook","description":"A trackball. Chunky keys. A very good beginning.","variants":[{"id":"graphite","name":"Graphite","color":"#62635D","front":"model-powerbook170-front.webp","back":"hero-power-rear.webp?v=20261019-campaign"}]},{"id":"ibook1999","name":"Jelly Clamshell","description":"A little colour goes a long way. Pick your flavour.","variants":[{"id":"blueberry","name":"Blueberry","color":"#00BDC3","front":"model-ibook1999-front.webp","back":"hero-blue-rear.webp?v=20261019-campaign"},{"id":"tangerine","name":"Tangerine","color":"#FF7A08","front":"model-ibook1999-tangerine-front.webp","back":"hero-orange-rear.webp?v=20261019-campaign"},{"id":"hotpink","name":"Hot Pink","color":"#FF159A","front":"model-ibook1999-hotpink-front.webp","back":"hero-pink-rear.webp?v=20261019-campaign"},{"id":"neongreen","name":"Neon Green","color":"#A8FF00","front":"model-ibook1999-neongreen-front.webp","back":"hero-green-rear.webp?v=20261019-campaign"}]},{"id":"titanium2001","name":"Aluminium Feather","description":"Cool metal. Dark keys. Turn-of-the-century energy.","variants":[{"id":"titanium","name":"Aluminium","color":"#B4B5B0","front":"model-titanium2001-front.webp","back":"hero-titanium-rear.webp?v=20261019-campaign"}]},{"id":"macbook2006","name":"Glossy Snow","description":"The little white laptop you never quite forgot.","variants":[{"id":"white","name":"White","color":"#F6F4EC","front":"model-macbook2006-front.webp","back":"hero-snow-rear.webp?v=20261019-campaign"}]},{"id":"unibody2008","name":"Alloy Pro","description":"Black glass, silver edges, and a place for your ideas.","variants":[{"id":"silver","name":"Silver","color":"#BBBEC0","front":"model-unibody2008-front.webp","back":"hero-alloy-rear.webp?v=20261019-campaign"}]},{"id":"pro2021","name":"Studio Pro","description":"A familiar modern desktop. A very personal little world.","variants":[{"id":"spacegray","name":"Space Gray","color":"#7D8084","front":"model-pro2021-front.webp","back":"hero-studio-rear.webp?v=20261019-campaign"},{"id":"silver","name":"Silver","color":"#BDC0C2","front":"model-pro2021-silver-front.webp","back":"model-pro2021-silver-lid.webp"}]}];
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const heroSection = document.querySelector('.hero');
  let headerFrame = 0;
  function syncHeaderIcon(){
    headerFrame = 0;
    const hero = heroSection.getBoundingClientRect();
    const remaining = Math.max(0, hero.bottom - header.offsetHeight);
    header.classList.toggle('hero-scrolled',remaining < hero.height * .2);
  }
  window.addEventListener('scroll',()=>{if(!headerFrame)headerFrame=requestAnimationFrame(syncHeaderIcon);},{passive:true});
  window.addEventListener('resize',syncHeaderIcon);
  syncHeaderIcon();

  const collection = document.querySelector('#collection');
  const sideButtons = [...collection.querySelectorAll('[data-side]')];
  function showCollectionSide(back) {
    collection.classList.toggle('show-lids',back);
    sideButtons.forEach(button=>button.setAttribute('aria-pressed',String((button.dataset.side==='back')===back)));
    document.querySelector('#collection-caption').textContent=back?'A little personality, all around.':'Pick your alter ego.';
    collection.querySelectorAll('.device-front').forEach(face=>face.setAttribute('aria-hidden',String(back)));
    collection.querySelectorAll('.device-back').forEach(face=>face.setAttribute('aria-hidden',String(!back)));
    collection.querySelectorAll('.model-preview').forEach(button=>button.setAttribute('aria-label',`Flip ${button.closest('.model-card').querySelector('h3').textContent} and the collection to ${back?'open laptops':'lids'}`));
  }
  sideButtons.forEach(button=>button.addEventListener('click',()=>showCollectionSide(button.dataset.side==='back')));
  collection.querySelectorAll('.model-preview').forEach(button=>button.addEventListener('click',()=>showCollectionSide(!collection.classList.contains('show-lids'))));
  const desktopNames={system7:'Monochrome',macos86:'Platinum',aqua101:'Aqua',tiger104:'Brushed',snow106:'Snow',yosemite1010:'Flat',sonoma14:'Modern'};
  const desktopImage=document.querySelector('#desktop-image');
  function previewDesktop(button){
    if(button.getAttribute('aria-pressed')==='true')return;
    const name=desktopNames[button.dataset.os];
    document.querySelectorAll('[data-os]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    desktopImage.src=`desktop-${button.dataset.os}.webp`;desktopImage.alt=`${name} desktop interface preview from lil laptop.`;
    document.querySelector('#desktop-label').textContent=name;
    if(!reduced.matches)desktopImage.animate([{opacity:.35},{opacity:1}],{duration:240,easing:'ease-out'});
  }
  document.querySelectorAll('[data-os]').forEach(button=>{
    button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'||event.pointerType==='pen')previewDesktop(button);});
    button.addEventListener('focus',()=>previewDesktop(button));
    button.addEventListener('click',()=>previewDesktop(button));
  });

  const canvas = document.querySelector('#sticker-canvas');
  const placed = document.querySelector('#placed-stickers');
  const status = document.querySelector('#playground-status');
  const stickerNames = {"bow": "Checked Bow", "flower": "Power Flower", "make-stuff": "Make Stuff", "open-late": "Open Late", "circuit-club-01": "Desktop Garden", "circuit-club-02": "Side A", "circuit-club-03": "Pocket Rangefinder", "circuit-club-04": "Patch Cable", "circuit-club-05": "Waveform Lab", "circuit-club-06": "Keycap Trio", "circuit-club-07": "Minute Keeper", "circuit-club-08": "Extra Life", "circuit-club-09": "Save Something", "circuit-club-10": "Human Inside", "circuit-club-11": "Orbital Relay", "wayfarer-01": "Lunar Moth", "wayfarer-02": "Quiet Heron", "wayfarer-03": "Fern Frond", "wayfarer-04": "Long Way Home", "wayfarer-05": "Forest Floor", "wayfarer-06": "Slow Traveller", "wayfarer-07": "Jewel Beetle", "wayfarer-08": "Silver Sardine", "wayfarer-09": "Ribbon Snake", "wayfarer-10": "Moon Study", "wayfarer-11": "Wild Stems", "wayfarer-12": "Elsewhere Map", "fruit-stand-01": "Late Lunch Tin", "fruit-stand-02": "Iced Matcha", "fruit-stand-03": "Blue Espresso", "fruit-stand-04": "Special Delivery", "fruit-stand-05": "Night Owl Matches", "fruit-stand-06": "Striped Vase", "fruit-stand-07": "Red Canvas", "fruit-stand-08": "Lucky Charms", "fruit-stand-10": "Good Eggs", "fruit-stand-11": "Day Dream Bottle", "fruit-stand-12": "One More Chapter", "type-and-play-02": "Soft Ware", "type-and-play-04": "Stay Curious", "type-and-play-05": "Slow Is A Speed", "type-and-play-06": "And Then Some", "type-and-play-07": "Less But Better", "type-and-play-08": "One More Page", "type-and-play-09": "Local Only", "type-and-play-10": "Side Quest", "type-and-play-11": "A Little Wonder", "type-and-play-12": "Good Enough"};
  const lidLooks=[{"id":"powerbook170","jelly":false,"markColor":"#282C2D","name":"Power Notebook","src":"play-lid-powerbook170.webp","variant":"Graphite"},{"id":"ibook1999","jelly":true,"markColor":"#00ADB5","name":"Jelly Clamshell","src":"play-lid-ibook1999.webp","variant":"Blueberry"},{"id":"ibook1999-tangerine","jelly":true,"markColor":"#FF7900","name":"Jelly Clamshell","src":"play-lid-ibook1999-tangerine.webp","variant":"Tangerine"},{"id":"ibook1999-hotpink","jelly":true,"markColor":"#F20B89","name":"Jelly Clamshell","src":"play-lid-ibook1999-hotpink.webp","variant":"Hot Pink"},{"id":"ibook1999-neongreen","jelly":true,"markColor":"#9CF000","name":"Jelly Clamshell","src":"play-lid-ibook1999-neongreen.webp","variant":"Neon Green"},{"id":"titanium2001","jelly":false,"markColor":"#F2F4EF","name":"Aluminium Feather","src":"play-lid-titanium2001.webp","variant":"Aluminium"},{"id":"macbook2006","jelly":false,"markColor":"#F2F4EF","name":"Glossy Snow","src":"play-lid-macbook2006.webp","variant":"White"},{"id":"unibody2008","jelly":false,"markColor":"#F2F4EF","name":"Alloy Pro","src":"play-lid-unibody2008.webp","variant":"Silver"},{"id":"pro2021","jelly":false,"markColor":"#282C2D","name":"Studio Pro","src":"play-lid-pro2021.webp","variant":"Space Gray"}];
  const lidImage=document.querySelector('.playground-lid');
  const lidButton=document.querySelector('#cycle-lid');
  const lidMark=document.querySelector('.playground-mark');
  let lidIndex=lidLooks.findIndex(lid=>lid.id==='pro2021'),mark='peach';
  function paintLid(){
    const lid=lidLooks[lidIndex];
    lidImage.src=lid.src;lidImage.alt=`${lid.name} lid in ${lid.variant}, ready to decorate.`;
    lidButton.setAttribute('aria-label',`Try the next laptop lid. Currently ${lid.name} in ${lid.variant}.`);
    document.querySelector('#playground-lid-caption').textContent=`${lid.name} / ${lid.variant} · click the lid for another`;
    canvas.dataset.jelly=String(lid.jelly);canvas.dataset.lid=lid.id;canvas.dataset.mark=mark;
    canvas.style.setProperty('--mark-color',lid.markColor);
    lidMark.style.visibility=mark==='none'?'hidden':'visible';
    lidMark.querySelector('use').setAttribute('href',`#lid-mark-${mark}`);
    document.querySelectorAll('.lid-mark-choices button[data-mark]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mark===mark)));
  }
  lidButton.addEventListener('click',()=>{
    lidIndex=(lidIndex+1)%lidLooks.length;paintLid();
    if(!reduced.matches)lidImage.animate([{opacity:.45,scale:'.97'},{opacity:1,scale:'1'}],{duration:280,easing:'ease-out'});
    status.textContent=`${lidLooks[lidIndex].name} in ${lidLooks[lidIndex].variant}. Your stickers and chosen logo come with you.`;
  });
  document.querySelectorAll('.lid-mark-choices button[data-mark]').forEach(button=>button.addEventListener('click',()=>{mark=button.dataset.mark;paintLid();status.textContent=mark==='none'?'A clean lid, no logo.':`${button.title} logo selected.`;}));
  lidLooks.forEach(lid=>{const image=new Image();image.src=lid.src;});
  paintLid();

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
    return sticker;
  }
  document.querySelectorAll('[data-sticker]').forEach(button => {
    let drag = null, ignoreClick = false;
    const img = button.querySelector('img');
    img.draggable = false;
    button.addEventListener('dragstart',event=>event.preventDefault());
    button.addEventListener('click',event=>{
      if(ignoreClick){event.preventDefault();ignoreClick=false;return;}
      addSticker(button.dataset.sticker);
    });
    button.addEventListener('pointerdown',event=>{
      if(event.button!==0)return;
      ignoreClick=false;
      drag={id:event.pointerId,x:event.clientX,y:event.clientY,ghost:null};
      button.setPointerCapture(event.pointerId);
      if(event.pointerType!=='touch')event.preventDefault();
    });
    button.addEventListener('pointermove',event=>{
      if(!drag||drag.id!==event.pointerId)return;
      const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
      if(!drag.ghost){
        if(Math.hypot(dx,dy)<7)return;
        // Touch swipes across the tray remain native horizontal scrolling.
        if(event.pointerType==='touch'&&Math.abs(dx)>Math.abs(dy)*1.2)return;
        ignoreClick=true;
        drag.ghost=document.createElement('img');drag.ghost.src=img.src;
        drag.ghost.className='sticker-drag-ghost';drag.ghost.alt='';drag.ghost.draggable=false;
        document.body.append(drag.ghost);document.body.classList.add('is-dragging-sticker');
        button.setPointerCapture(event.pointerId);
      }
      event.preventDefault();
      drag.ghost.style.left=`${event.clientX}px`;drag.ghost.style.top=`${event.clientY}px`;
      const r=canvas.getBoundingClientRect();
      canvas.classList.toggle('is-drop-target',event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom);
    });
    function finish(event){
      if(!drag)return;
      const current=drag;drag=null;
      if(current.ghost){
        const r=canvas.getBoundingClientRect();
        if(event.type==='pointerup'&&event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom){
          const sticker=addSticker(button.dataset.sticker,false);
          position(sticker,(event.clientX-r.left)/r.width,(event.clientY-r.top)/r.height);
          status.textContent=`${stickerNames[button.dataset.sticker]} placed on your lid. Looking very you.`;
        }
        current.ghost.remove();document.body.classList.remove('is-dragging-sticker');canvas.classList.remove('is-drop-target');
      }
      if(button.hasPointerCapture(current.id))button.releasePointerCapture(current.id);
    }
    ['pointerup','pointercancel','lostpointercapture'].forEach(type=>button.addEventListener(type,finish));
  });
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
  const tray=document.querySelector('.sticker-tray');
  tray.addEventListener('keydown',event=>{
    if(event.target!==tray||!['ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();tray.scrollBy({left:(event.key==='ArrowRight'?1:-1)*180,behavior:reduced.matches?'instant':'smooth'});
  });
  function dragShelf(track){
    let drag=null,ignoreClick=false;
    track.addEventListener('pointerdown',event=>{
      if(event.pointerType!=='mouse'||event.button!==0||event.target.closest('[data-sticker]'))return;
      drag={x:event.clientX,left:track.scrollLeft,id:event.pointerId,moved:false};
    });
    track.addEventListener('pointermove',event=>{
      if(!drag)return;
      if(!drag.moved&&Math.abs(event.clientX-drag.x)>6){drag.moved=true;ignoreClick=true;track.setPointerCapture(drag.id);}
      if(drag.moved){event.preventDefault();track.scrollLeft=drag.left+drag.x-event.clientX;}
    });
    track.addEventListener('click',event=>{if(ignoreClick){event.preventDefault();event.stopImmediatePropagation();ignoreClick=false;}},true);
    ['pointerup','pointercancel','lostpointercapture'].forEach(type=>track.addEventListener(type,()=>{drag=null;}));
    track.addEventListener('pointerdown',()=>{ignoreClick=false;},true);
  }
  dragShelf(gallery);dragShelf(tray);

  const heroArt = document.querySelector('.hero-art');
  const heroImage = document.querySelector('.hero-device');
  const heroSurface = document.querySelector('.render-surface');
  const heroLabel = document.querySelector('#hero-model-name');
  const heroButton = document.querySelector('#hero-device-button');
  const looks = [
    {id:'blue',name:'Jelly Clamshell / Blueberry'},
    {id:'power',name:'Power Notebook / Graphite'},
    {id:'orange',name:'Jelly Clamshell / Tangerine'},
    {id:'snow',name:'Glossy Snow / White'},
    {id:'studio',name:'Studio Pro / Space Gray'}
  ].map(look=>({...look,open:`hero-${look.id}-open.webp?v=20261019-campaign`,rear:`hero-${look.id}-rear.webp?v=20261019-campaign`}));
  const decorationChoices = ['bow','flower','circuit-club-02','circuit-club-03','circuit-club-06','circuit-club-07','circuit-club-08','wayfarer-01'];
  const deckLayouts = [[[0.81287,0.09586,-0.25604,0.50867,250.1585,768.7735]],[[0.55852,0.25561,-0.39233,0.34202,670.6905,858.1185]],[[0.70159,0.03635,-0.13683,0.42908,249.762,768.7285],[0.41294,0.18818,-0.35792,0.27111,280.249,790.0355]],[[0.46318,0.19566,-0.30162,0.28211,678.922,860.1115],[0.34567,0.0195,-0.02358,0.23038,647.8955,884.506]],[[0.81865,0.11538,-0.29242,0.51462,251.6885,767.5],[0.5282,0.26247,-0.40038,0.32608,672.609,858.5725]],[[0.57199,0.23563,-0.46255,0.36706,274.528,771.8655],[0.5997,0.04582,-0.05934,0.38532,652.982,865.443]]];
  const deckSlots=[...document.querySelectorAll('[data-deck-sticker]')];
  const cloudSlots=[...document.querySelectorAll('[data-cloud-sticker] img')];
  let duoFinish='black';
  let introActive=false,introTimer=null,introToken=0,introBounce=null;
  let lookIndex=0, heroRear=false, lastDeckLayout=-1, lastCloudSlot=-1;
  let heroTimer=null, heroMotion=null, heroHover=false, heroFocus=false, transitionID=0;
  let cloudTimer=null;
  function randomItem(items){return items[Math.floor(Math.random()*items.length)];}
  function freshSticker(used=[]){return randomItem(decorationChoices.filter(kind=>!used.includes(`sticker-${kind}.webp`)));}
  function changeDeck() {
    // Different computers get a new little arrangement, including left-only and right-only looks.
    const choices=deckLayouts.map((_,index)=>index).filter(index=>index!==lastDeckLayout);
    lastDeckLayout=randomItem(choices);
    const layout=deckLayouts[lastDeckLayout];heroButton.dataset.deckLayout=String(lastDeckLayout);
    const used=[];
    deckSlots.forEach((slot,index)=>{
      slot.style.display=index<layout.length?'':'none';
      if(index>=layout.length)return;
      const kind=freshSticker(used),src=`sticker-${kind}.webp`;used.push(src);
      slot.setAttribute('href',src);slot.setAttribute('transform',`matrix(${layout[index].join(',')})`);
    });
  }
  function scheduleCloud(){
    clearTimeout(cloudTimer);cloudTimer=null;
    if(!reduced.matches&&!document.hidden)cloudTimer=setTimeout(cycleCloud,1100+Math.random()*1100);
  }
  async function cycleCloud(){
    cloudTimer=null;
    if(reduced.matches||document.hidden)return;
    const index=randomItem(cloudSlots.map((_,i)=>i).filter(i=>i!==lastCloudSlot));lastCloudSlot=index;
    const image=cloudSlots[index],src=`sticker-${freshSticker(cloudSlots.map(s=>s.getAttribute('src')))}.webp`;
    const preload=new Image();preload.src=src;await preload.decode().catch(()=>{});
    if(reduced.matches||document.hidden){scheduleCloud();return;}
    let motion=image.animate([{opacity:1,scale:'1'},{opacity:0,scale:'.65',rotate:'-12deg'}],{duration:150,easing:'ease-in',fill:'forwards'});
    await motion.finished.catch(()=>{});image.src=src;motion.cancel();
    image.animate([{opacity:0,scale:'.65',rotate:'12deg'},{opacity:1,scale:'1.12',rotate:'-3deg',offset:.65},{opacity:1,scale:'1',rotate:'0deg'}],{duration:380,easing:'ease-out'});
    scheduleCloud();
  }
  const blocked = () => reduced.matches || document.hidden || heroHover || heroFocus || heroRear;
  const paused = () => blocked() || introActive;
  function stopIntro(){introToken++;introActive=false;clearTimeout(introTimer);introTimer=null;if(introBounce){introBounce.cancel();introBounce=null;}heroButton.dataset.intro='complete';}
  function bounceIntro(){
    if(reduced.matches)return;
    if(introBounce)introBounce.cancel();
    introBounce=heroSurface.animate([
      {scale:'.95',translate:'0 4px'},
      {scale:'1.06',translate:'0 -6px',offset:.45},
      {scale:'1',translate:'0 0'}
    ],{duration:105,easing:'cubic-bezier(.2,.8,.3,1)'});
  }
  function heroSource(look,rear){return duoFinish==='silver'?`hero-${look.id}-silver-${rear?'rear':'open'}.webp?v=20261019-campaign`:(rear?look.rear:look.open);}
  function startIntro(){
    if(blocked()){scheduleHero();return;}
    introActive=true;heroButton.dataset.intro='loading';const token=++introToken;
    Promise.allSettled(looks.map(look=>{const image=new Image();image.src=heroSource(look,false);return image.decode();})).then(()=>{
      if(token!==introToken)return;
      if(blocked()){stopIntro();scheduleHero();return;}
      heroButton.dataset.intro='cycling';let step=0;
      const next=()=>{
        if(token!==introToken)return;
        if(blocked()){stopIntro();scheduleHero();return;}
        lookIndex=(++step)%looks.length;paintHero();bounceIntro();
        if(step===looks.length){introTimer=setTimeout(()=>{stopIntro();changeDeck();scheduleHero();},105);return;}
        introTimer=setTimeout(next,110);
      };
      introTimer=setTimeout(next,110);
    });
  }
  function paintHero() {
    const look=looks[lookIndex];heroImage.src=heroSource(look,heroRear);
    heroImage.alt=heroRear?`${look.name}, partly open with its back lid facing you on ${duoFinish} iPhone Duo.`:`${look.name} on ${duoFinish} iPhone Duo in the angled open pose, with stickers around its trackpad.`;
    heroLabel.textContent=look.name;heroButton.dataset.look=look.id;heroButton.dataset.finish=duoFinish;
    heroButton.dataset.side=heroRear?'back':'open';
    document.querySelector('#hero-interaction-hint').textContent=heroRear?'back lid':'front open';
    heroButton.setAttribute('aria-pressed',String(heroRear));
    heroButton.setAttribute('aria-label',heroRear?`Spin to the front of ${look.name}`:`Spin to the back of ${look.name}`);
  }
  function scheduleHero() {
    clearTimeout(heroTimer);heroTimer=null;heroArt.classList.toggle('is-paused',paused());
    if(!paused()&&!heroMotion)heroTimer=setTimeout(cycleHero,2400);
  }
  function cancelHeroMotion() {
    transitionID++;if(heroMotion){heroMotion.cancel();heroMotion=null;}
    clearTimeout(heroTimer);heroTimer=null;
  }
  async function moveHero(change,spin=false) {
    cancelHeroMotion();const token=transitionID;
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
      heroMotion=motion;await motion.finished;if(token!==transitionID)return;
      change();paintHero();await heroImage.decode().catch(()=>{});if(token!==transitionID)return;motion.cancel();
      motion=heroSurface.animate(spin?[
        {transform:'perspective(1000px) rotateY(270deg)',opacity:.5},
        {transform:'perspective(1000px) rotateY(360deg)',opacity:1}
      ]:[
        {translate:'0 -24px',scale:'.96 1.02',opacity:0},
        {translate:'0 7px',scale:'1.025 .98',opacity:1,offset:.5},
        {translate:'0 -3px',scale:'.995 1.005',opacity:1,offset:.8},
        {translate:'0 0',scale:'1',opacity:1}
      ],{duration:spin?500:560,easing:'cubic-bezier(.2,.7,.25,1)',fill:'forwards'});
      heroMotion=motion;await motion.finished;
    }catch(_){ /* Pointer exit and new deliberate clicks replace the current motion. */ }
    finally{if(motion)motion.cancel();if(token===transitionID){heroMotion=null;scheduleHero();}}
  }
  function cycleHero(){heroTimer=null;if(!paused())moveHero(()=>{lookIndex=(lookIndex+1)%looks.length;changeDeck();});}
  function syncHero(){
    if(introActive)stopIntro();
    if(heroMotion&&!heroButton.dataset.spinning){cancelHeroMotion();paintHero();}
    scheduleHero();
  }
  function showHeroSide(rear){
    stopIntro();heroButton.dataset.spinning='true';
    return moveHero(()=>{heroRear=rear;},true).finally(()=>{delete heroButton.dataset.spinning;scheduleHero();});
  }
  heroButton.addEventListener('click',event=>{
    // Hover owns the mouse view; touch and keyboard keep a deliberate toggle.
    if(event.pointerType==='mouse'&&heroHover)return;
    showHeroSide(!heroRear);
  });
  heroButton.addEventListener('pointerenter',event=>{
    if(event.pointerType!=='mouse')return;
    heroHover=true;showHeroSide(true);
  });
  heroButton.addEventListener('pointerleave',event=>{
    if(event.pointerType!=='mouse')return;
    heroHover=false;showHeroSide(false);
  });
  heroButton.addEventListener('focusin',()=>{heroFocus=heroButton.matches(':focus-visible');syncHero();});
  heroButton.addEventListener('focusout',()=>{heroFocus=false;heroRear=false;cancelHeroMotion();paintHero();scheduleHero();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopIntro();cancelHeroMotion();heroRear=false;paintHero();}scheduleHero();scheduleCloud();});
  reduced.addEventListener('change',()=>{stopIntro();cancelHeroMotion();heroRear=false;paintHero();scheduleHero();scheduleCloud();});
  looks.forEach(look=>[look.open,look.rear].forEach(src=>{const image=new Image();image.src=src;}));
  document.querySelectorAll('[data-duo-finish]').forEach(button=>button.addEventListener('click',()=>{
    if(duoFinish===button.dataset.duoFinish)return;
    stopIntro();cancelHeroMotion();duoFinish=button.dataset.duoFinish;
    document.querySelectorAll('[data-duo-finish]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    paintHero();scheduleHero();
    looks.forEach(look=>[false,true].forEach(rear=>{const image=new Image();image.src=heroSource(look,rear);}));
  }));
  // Start loading the alternate finish without delaying the first complete device.
  looks.forEach(look=>['open','rear'].forEach(side=>{const image=new Image();image.src=`hero-${look.id}-silver-${side}.webp?v=20261019-campaign`;}));
  changeDeck();paintHero();startIntro();scheduleCloud();

  const tilt = document.querySelector('.tilt');
  let frame = null;
  window.addEventListener('pointermove', event => {
    if(reduced.matches||event.pointerType!=='mouse'||!window.matchMedia('(hover: hover)').matches)return;
    const x=Math.max(-.5,Math.min(.5,event.clientX/window.innerWidth-.5));
    const y=Math.max(-.5,Math.min(.5,event.clientY/window.innerHeight-.5));
    if(frame)cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{
      tilt.style.setProperty('--rx',`${-y*9}deg`);
      tilt.style.setProperty('--ry',`${x*12}deg`);
      frame=null;
    });
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>{
    if(frame)cancelAnimationFrame(frame);
    tilt.style.setProperty('--rx','0deg');tilt.style.setProperty('--ry','0deg');
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
