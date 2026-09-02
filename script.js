(()=>{ 'use strict';

/* =====================================================
   CONFIG : edit this block only
===================================================== */
const PROFILE={
  name:'AeroForger',
  country:'Georgia',
  github:'AeroForger',
  avatar:'https://avatars.githubusercontent.com/u/313325032?v=4'
};
const SKILLS=[
  'C#','C++','Rust','Systems','Arduino','Git',
  'Docker','Lua','Python','HTML','CSS','JS'
];
const PROJECTS=[
  {
    name:'ForgeLang',
    desc:'A fast, type-safe systems programming language built in Rust.',
    tech:['Rust'],
    link:'https://github.com/AeroForger/ForgeLang'
  },
  {
    name:'AeroHop',
    desc:'A tool light as air that helps you hop between Linux distributions.',
    tech:['C#'],
    link:'https://github.com/AeroForger/AeroHop'
  },
  {
    name:'NixForge',
    desc:'A tool that helps you forge any NixOS configuration into a system that feels truly yours.',
    tech:['C#'],
    link:'https://github.com/AeroForger/NixForge'
  }
];
const CONTACT={
  github:'github.com/'+PROFILE.github,
  email:'AeroForgery@proton.me'
};
/* ===================================================== */

const $=s=>document.querySelector(s);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nn=n=>String(n).padStart(2,'0');
const ph=s=>`<span class="ph">[ ${s} ]</span>`;

/* ---------- tiny synth (all sounds generated locally) ---------- */
const S={
  on:true,ctx:null,master:null,noiseBuf:null,
  init(){
    if(this.ctx){ if(this.ctx.state==='suspended') this.ctx.resume(); return; }
    const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
    const c=this.ctx=new AC();
    this.master=c.createGain(); this.master.gain.value=.25; this.master.connect(c.destination);
    const n=c.createBuffer(1,c.sampleRate,c.sampleRate), d=n.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
    this.noiseBuf=n;
  },
  ok(){ return this.on&&this.ctx; },
  env(t,peak,att,rel){
    const g=this.ctx.createGain();
    g.gain.setValueAtTime(0,t);
    g.gain.linearRampToValueAtTime(peak,t+att);
    g.gain.exponentialRampToValueAtTime(.0001,t+att+rel);
    g.connect(this.master); return g;
  },
  blip(f,dur,type,vol){
    if(!this.ok())return;
    const c=this.ctx,t=c.currentTime,o=c.createOscillator();
    o.type=type||'square'; o.frequency.setValueAtTime(f,t);
    o.connect(this.env(t,vol||.3,.005,dur||.05)); o.start(t); o.stop(t+(dur||.05)+.05);
  },
  click(){ this.blip(1250,.04,'square',.22); },
  tick(){ this.blip(1900,.02,'square',.12); },
  pin(){ this.blip(2100+Math.random()*700,.015,'square',.1); },
  detent(){ this.blip(820,.035,'square',.25); setTimeout(()=>this.blip(1350,.03,'square',.2),26); },
  clunk(v=1){
    if(!this.ok())return;
    const c=this.ctx,t=c.currentTime,o=c.createOscillator();
    o.type='triangle'; o.frequency.setValueAtTime(110,t); o.frequency.exponentialRampToValueAtTime(40,t+.13);
    o.connect(this.env(t,.8*v,.004,.16)); o.start(t); o.stop(t+.22);
    const s=c.createBufferSource(); s.buffer=this.noiseBuf;
    const f=c.createBiquadFilter(); f.type='lowpass'; f.frequency.value=260;
    s.connect(f); f.connect(this.env(t,.5*v,.002,.08)); s.start(t); s.stop(t+.1);
  },
  motor(dur=.5){
    if(!this.ok())return;
    const c=this.ctx,t=c.currentTime;
    const s=c.createBufferSource(); s.buffer=this.noiseBuf; s.loop=true;
    const f=c.createBiquadFilter(); f.type='bandpass'; f.frequency.value=560; f.Q.value=.9;
    const g=c.createGain();
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.4,t+.06);
    g.gain.setValueAtTime(.4,t+dur-.1); g.gain.linearRampToValueAtTime(0,t+dur);
    const l=c.createOscillator(); l.type='square'; l.frequency.value=24;
    const lg=c.createGain(); lg.gain.value=.14;
    l.connect(lg); lg.connect(g.gain);
    s.connect(f); f.connect(g); g.connect(this.master);
    s.start(t); s.stop(t+dur+.05); l.start(t); l.stop(t+dur);
  },
  hum(dur=.7){
    if(!this.ok())return;
    const c=this.ctx,t=c.currentTime,o=c.createOscillator();
    o.type='sawtooth'; o.frequency.setValueAtTime(42,t); o.frequency.linearRampToValueAtTime(110,t+dur);
    const f=c.createBiquadFilter(); f.type='lowpass'; f.frequency.value=340;
    o.connect(f); f.connect(this.env(t,.22,.05,dur)); o.start(t); o.stop(t+dur+.1);
  },
  servo(){
    if(!this.ok())return;
    const c=this.ctx,t=c.currentTime,s=c.createBufferSource(); s.buffer=this.noiseBuf;
    const f=c.createBiquadFilter(); f.type='bandpass'; f.Q.value=2;
    f.frequency.setValueAtTime(2400,t); f.frequency.exponentialRampToValueAtTime(300,t+.28);
    s.connect(f); f.connect(this.env(t,.3,.01,.3)); s.start(t); s.stop(t+.35);
  }
};
document.addEventListener('pointerdown',()=>S.init());

/* ---------- profile fill ---------- */
$('#fName').textContent=PROFILE.name;
$('#fCountry').textContent=PROFILE.country;
$('#cardName').textContent=PROFILE.name;
const avatar=$('#avatar');
avatar.src=PROFILE.avatar||`https://github.com/${PROFILE.github}.png`;
avatar.onerror=()=>$('#photoBox').classList.add('nophoto');

/* ---------- generated parts ---------- */
const track=$('#leverTrack');
for(let i=1;i<10;i++){
  const n=document.createElement('i'); n.className='notch'; n.style.left=(i*10)+'%'; track.appendChild(n);
}
const cellsBox=$('#cells'), cells=[];
for(let i=0;i<10;i++){ const c=document.createElement('i'); cellsBox.appendChild(c); cells.push(c); }

const dial=$('#dial'), rot=$('#rot'), knob=$('#knob'), housing=$('#dialHousing');
const TICKS=[-64,-54,-43,-32,-22,-11,0,11,22,32,43,54,64];
TICKS.forEach(a=>{
  const t=document.createElement('i');
  t.className='tick'+([-64,-22,22,64].includes(a)?' major':'');
  t.style.setProperty('--a',a+'deg'); dial.appendChild(t);
});

const shutter=$('#shutter');
for(let i=0;i<12;i++){
  const b=document.createElement('i'); b.style.setProperty('--i',i); shutter.appendChild(b);
}

/* ---------- helpers ---------- */
function shakeEl(el){ el.classList.remove('shaking'); void el.offsetWidth; el.classList.add('shaking'); }
function flick(){ const f=$('#flick'); f.classList.remove('zap'); void f.offsetWidth; f.classList.add('zap'); }
function typeTo(el,text,speed=16){
  return new Promise(res=>{
    let i=0; el.textContent='';
    const t=setInterval(()=>{ el.textContent=text.slice(0,++i); if(i>=text.length){ clearInterval(t); res(); } },speed);
  });
}
async function shutterSwap(mid){
  shutter.classList.remove('reset'); shutter.classList.add('closed'); S.servo();
  await wait(640); mid(); await wait(140);
  shutter.classList.add('open'); S.servo();
  await wait(640);
  shutter.classList.add('reset'); shutter.classList.remove('closed','open');
  void shutter.offsetHeight;
  requestAnimationFrame(()=>requestAnimationFrame(()=>shutter.classList.remove('reset')));
}

/* ---------- documents ---------- */
const mrow=(a,b)=>`<div class="pl meta"><span>${a}</span><span>${b}</span></div>`;
const title=t=>`<h2 class="pl doc-title">${esc(t)}</h2>`;
const rule='<div class="pl rule"></div>';
const sub=s=>`<div class="pl sub">${esc(s)}</div>`;
const row=(i,k,v)=>`<div class="pl row"><span class="idx">${nn(i)}</span><span class="kk">${esc(k)}</span><span class="dots"></span><span class="vv">${esc(v)}</span></div>`;
const tag=s=>`<span class="tag">${esc(s)}</span>`;
const para=s=>`<div class="pl para">${esc(s)}</div>`;
const note=s=>`<div class="pl note">${esc(s)}</div>`;
const endmark='<div class="pl endmark">END OF DOCUMENT</div>';

function record(name,desc,techs,href,label){
  let h='<div class="pl record">';
  h+=`<div class="rhead"><b>${esc(name)}</b><span>${esc(label||'')}</span></div>`;
  h+=`<div class="pdesc">${esc(desc)}</div>`;
  let t=''; for(const x of (techs||[])) t+=`<span class="ptech">${esc(x)}</span>`;
  h+=`<div class="ptechs">${t}</div>`;
  if(href) h+=`<a href="${esc(href)}" class="plink" target="_blank" rel="noopener">VIEW SOURCE</a>`;
  h+='</div>';
  return h;
}

const aboutDoc=()=>{
  let h=mrow(ph('PT-88 ACCESS'),ph('OPERATOR FILE'));
  h+=title('ABOUT ME');
  h+=rule;
  h+=sub('IDENTIFICATION');
  h+=row(1,'NAME',PROFILE.name);
  h+=row(2,'ORIGIN',PROFILE.country);
  h+=row(3,'CLEARANCE','PUBLIC ACCESS');
  h+=row(4,'TERMINAL','UNIT 07');
  h+=row(5,'GITHUB',CONTACT.github);
  h+=para('Operator authenticated and cleared for document retrieval. This terminal archives project records, contact channels, and technical proficiencies. All documents are synthesized and printed on demand via the dot matrix print head.');
  h+=rule;
  h+=sub('CORE COMPETENCIES');
  let tg=''; for(const s of SKILLS) tg+=tag(s);
  h+=`<div class="pl">${tg}</div>`;
  h+=endmark;
  return h;
};

const projectsDoc=()=>{
  let h=mrow(ph('PROJECT ARCHIVE'),ph('DOT MATRIX OUTPUT'));
  h+=title('PROJECTS');
  h+=rule;
  h+=sub('FEATURED WORK');
  if(PROJECTS.length===0){
    h+='<div class="pl record dim"><div class="rhead"><b>NO PROJECTS FOUND</b><span>EMPTY ARCHIVE</span></div><p class="pdesc">No project records available in the archive.</p></div>';
  } else {
    for(const p of PROJECTS){
      h+=record(p.name,p.desc,p.tech,p.link,p.link||'');
    }
  }
  h+=endmark;
  return h;
};

const contactDoc=()=>{
  let h=mrow(ph('CONTACT LOG'),ph('PUBLIC CHANNELS'));
  h+=title('CONTACT');
  h+=rule;
  h+=sub('COMMUNICATION PORTS');
  h+=row(1,'EMAIL',CONTACT.email);
  h+=row(2,'GITHUB',CONTACT.github);
  h+=row(3,'LOCATION',PROFILE.country);
  h+=para('All channels are public and monitored. Direct messages and pull requests are welcome. Reference this terminal ID when reaching out.');
  h+=rule;
  h+=sub('DIRECT LINE');
  h+=row(4,'TERMINAL','PT-88-04471');
  h+=endmark;
  return h;
};

const skillsDoc=()=>{
  let h=mrow(ph('SKILL MATRIX'),ph('TECHNICAL SCAN'));
  h+=title('SKILLS');
  h+=rule;
  h+=sub('LANGUAGE PROFICIENCIES');
  h+=row(1,'PRIMARY LANGUAGES','C#, C++, Rust');
  h+=row(2,'SECONDARY','Python, Lua, HTML/CSS/JS');
  h+=rule;
  h+=sub('DOMAINS');
  let tg=''; for(const s of SKILLS) tg+=tag(s);
  h+=`<div class="pl">${tg}</div>`;
  h+=rule;
  h+=sub('AREAS');
  h+=row(3,'SYSTEMS PROGRAMMING','Expert');
  h+=row(4,'EMBEDDED (Arduino)','Advanced');
  h+=row(5,'INFRASTRUCTURE (Nix)','Advanced');
  h+=endmark;
  return h;
};

const testDoc=()=>{
  let h=mrow(ph('SELF TEST'),ph('DIAGNOSTIC MODE'));
  h+=title('TEST PATTERN');
  h+=rule;
  h+=sub('SYSTEM CHECKS');
  h+=row(1,'POWER','OK');
  h+=row(2,'MOTOR','CALIBRATED');
  h+=row(3,'RIBBON','NOMINAL');
  h+=row(4,'PAPER PATH','CLEAR');
  h+=row(5,'HEAD ALIGNMENT','PASS');
  h+=rule;
  h+=sub('OUTPUT VERIFICATION');
  h+=para('Dot matrix print head calibration verified. All pins operational. Ribbon tension within parameters. Paper feed mechanism responsive.');
  h+=endmark;
  return h;
};

const SECTIONS=['projects','contact','skills','about'];
const LABELS=['PROJECTS','CONTACT','SKILLS','ABOUT ME'];
const ANGLES=[-64,-22,22,64];
const DOCUMENTS={projects:projectsDoc,contact:contactDoc,skills:skillsDoc,about:aboutDoc};
let currentDoc='about';
let booting=false;
let printing=false;
let ready=false;

function updateDial(sec){
  const idx=SECTIONS.indexOf(sec);
  currentDoc=sec;
  document.querySelectorAll('.dlab').forEach(d=>{
    d.classList.toggle('active',d.getAttribute('data-sec')===sec);
  });
  $('#lcdMode').textContent=LABELS[idx];
  $('#rot').style.setProperty('--ang',ANGLES[idx]+'deg');
  $('#knob').setAttribute('aria-valuenow',idx);
  $('#knob').setAttribute('aria-valuetext',LABELS[idx]);
}

async function feedPaper(){
  const paper=$('#paper');
  const clip=$('#clip');
  const sheet=$('#sheet');
  const head=$('#head');
  if(paper.style.transform===''||paper.style.transform.includes('-104%')){
    paper.style.transition='transform .35s ease-out';
    paper.style.transform='translateY(0)';
    S.motor(.4);
    await wait(350);
  }
  await printDoc();
}

async function printDoc(){
  if(printing) return;
  printing=true;
  const sheet=$('#sheet');
  const head=$('#head');
  const clip=$('#clip');
  const lines=Array.from(sheet.querySelectorAll('.pl'));
  if(lines.length===0){ printing=false; return; }
  head.style.opacity='1';
  head.style.top='0px';
  S.motor(lines.length*.09+.15);
  for(let i=0;i<lines.length;i++){
    const line=lines[i];
    const lineRect=line.getBoundingClientRect();
    const clipRect=clip.getBoundingClientRect();
    const top=lineRect.top-clipRect.top;
    head.style.top=`${top}px`;
    S.pin();
    await wait(85);
    line.classList.add('printed');
    if(i<lines.length-1) await wait(25);
  }
  await wait(60);
  head.style.opacity='0';
  printing=false;
}

async function setDoc(name){
  if(booting||printing) return;
  currentDoc=name;
  const doc=DOCUMENTS[name]();
  $('#sheet').innerHTML=doc;
  const lines=$('#sheet').querySelectorAll('.pl');
  lines.forEach(l=>l.classList.remove('printed'));
  $('#head').style.opacity='0';
  updateDial(name);
  await feedPaper();
  $('#ledPwr').classList.add('on');
  $('#ledRdy').classList.add('on');
  $('#ledFeed').classList.remove('on');
  $('#ledErr').classList.remove('on');
}

async function boot(){
  if(booting) return;
  booting=true;
  $('#hint').textContent='SYSTEM INITIALIZING';
  S.click();
  await wait(150);
  await typeTo($('#bootMsg'),'SYSTEM INITIALIZING...',16);
  S.tick();
  await wait(400);
  await typeTo($('#bootMsg'),'CONFIGURATION LOADED',16);
  S.tick();
  await wait(300);
  await typeTo($('#bootMsg'),'POWERING UP',16);
  let pct=0;
  for(let i=0;i<cells.length;i++){
    cells[i].classList.add('on');
    S.tick();
    pct=Math.round((i+1)/cells.length*100);
    $('#pct').textContent=nn(pct)+'%';
    await wait(60);
  }
  await wait(200);
  await typeTo($('#bootMsg'),'CARD READER ACTIVE',16);
  await wait(200);
  const card=$('#idcard');
  card.classList.add('in');
  S.servo();
  await wait(500);
  $('#stamp').classList.add('show');
  S.click();
  await wait(200);
  await typeTo($('#bootMsg'),'AUTHENTICATION... SUCCESS',16);
  await wait(300);
  await typeTo($('#bootMsg'),'SYSTEM READY',16);
  S.clunk();
  $('#bootLed').classList.add('on');
  $('#bootLed').classList.add('steady');
  await wait(300);
  await shutterSwap(()=>{
    $('#boot').style.display='none';
    $('#stage').hidden=false;
    $('#hint').textContent='SYSTEM READY';
  });
  ready=true;
  $('#lcdMode').textContent='READY';
  $('#ledPwr').classList.add('on');
  $('#ledRdy').classList.add('on');
  const paper=$('#paper');
  paper.style.transition='transform .35s ease-out';
  paper.style.transform='translateY(0)';
  S.motor(.5);
  await wait(400);
  booting=false;
  await setDoc('about');
  $('#pct').textContent='100%';
}

/* ---------- lever ---------- */
let leverDragging=false;
$('#leverTrack').addEventListener('pointerdown',(e)=>{
  if(leverDragging||booting||ready) return;
  leverDragging=true;
  S.click();
  moveLever(e);
  const move=(ev)=>{ moveLever(ev); };
  const up=()=>{
    leverDragging=false;
    const pct=parseFloat($('#leverFill').style.width)||0;
    if(pct>=85){
      $('#leverKnob').classList.add('grabbing');
      boot();
    } else {
      $('#leverKnob').style.left='';
      $('#leverFill').style.width='0%';
      $('#leverTrack').setAttribute('aria-valuenow','0');
    }
    document.removeEventListener('pointermove',move);
    document.removeEventListener('pointerup',up);
  };
  document.addEventListener('pointermove',move);
  document.addEventListener('pointerup',up);
});

function moveLever(e){
  const rect=$('#leverTrack').getBoundingClientRect();
  const x=e.clientX-rect.left;
  let pct=(x/rect.width)*100;
  pct=Math.max(0,Math.min(100,pct));
  $('#leverFill').style.width=pct+'%';
  const knobX=Math.min(pct,90);
  $('#leverKnob').style.left=knobX+'%';
  $('#leverTrack').setAttribute('aria-valuenow',Math.round(pct));
}

$('#leverTrack').addEventListener('keydown',(e)=>{
  if(booting||ready) return;
  if(e.key==='ArrowRight'||e.key===' '){
    e.preventDefault();
    $('#leverFill').style.width='100%';
    $('#leverKnob').style.left='90%';
    $('#leverTrack').setAttribute('aria-valuenow','100');
    S.click();
    $('#leverKnob').classList.add('grabbing');
    boot();
  }
});

/* ---------- knob / dial ---------- */
let knobDragging=false;
let currentAngle=64;

$('#knob').addEventListener('pointerdown',(e)=>{
  if(booting||printing||!ready) return;
  e.preventDefault();
  S.click();
  knobDragging=true;
  $('#rot').classList.add('drag');
  moveKnob(e);
  const move=(ev)=>{ moveKnob(ev); };
  const up=()=>{
    knobDragging=false;
    $('#rot').classList.remove('drag');
    let closest=ANGLES[3];
    let minDist=Infinity;
    for(const a of ANGLES){
      const d=Math.abs(a-currentAngle);
      if(d<minDist){ minDist=d; closest=a; }
    }
    $('#rot').style.setProperty('--ang',closest+'deg');
    currentAngle=closest;
    const idx=ANGLES.indexOf(closest);
    setDoc(SECTIONS[idx]);
    S.detent();
    document.removeEventListener('pointermove',move);
    document.removeEventListener('pointerup',up);
  };
  document.addEventListener('pointermove',move);
  document.addEventListener('pointerup',up);
});

function moveKnob(e){
  const rect=$('#knob').getBoundingClientRect();
  const cx=rect.left+rect.width/2;
  const cy=rect.top+rect.height/2;
  const dx=e.clientX-cx;
  const dy=e.clientY-cy;
  let ang=Math.atan2(dy,dx)*180/Math.PI;
  ang=Math.max(-64,Math.min(64,ang));
  $('#rot').style.setProperty('--ang',ang+'deg');
  currentAngle=ang;
}

/* ---------- dlab click ---------- */
document.querySelectorAll('.dlab').forEach(d=>{
  d.addEventListener('click',()=>{
    if(booting||printing||!ready) return;
    const sec=d.getAttribute('data-sec');
    const idx=SECTIONS.indexOf(sec);
    if(sec===currentDoc) return;
    S.click();
    $('#rot').style.setProperty('--ang',ANGLES[idx]+'deg');
    currentAngle=ANGLES[idx];
    setDoc(sec);
  });
});

/* ---------- buttons ---------- */
$('#btnFeed').addEventListener('click',async(e)=>{
  if(booting||!ready||printing){
    if(!ready||booting) shakeEl(e.currentTarget);
    return;
  }
  S.click();
  e.currentTarget.classList.add('lit');
  $('#ledFeed').classList.add('on');
  await setDoc(currentDoc);
  await wait(100);
  e.currentTarget.classList.remove('lit');
  $('#ledFeed').classList.remove('on');
});

$('#btnTest').addEventListener('click',async()=>{
  if(booting||printing||!ready){
    if(!ready) shakeEl($('#btnTest'));
    return;
  }
  S.click();
  $('#btnTest').classList.add('lit');
  $('#ledErr').classList.add('on');
  $('#lcdMode').textContent='TEST';
  flick();
  await wait(300);
  const leds=['#ledPwr','#ledRdy','#ledFeed','#ledErr'];
  for(let i=0;i<3;i++){
    leds.forEach(id=>$(id).classList.add('on'));
    S.tick();
    await wait(100);
    leds.forEach(id=>$(id).classList.remove('on'));
    await wait(100);
  }
  $('#sheet').innerHTML=testDoc();
  const lines=$('#sheet').querySelectorAll('.pl');
  lines.forEach(l=>l.classList.remove('printed'));
  $('#head').style.opacity='0';
  const paper=$('#paper');
  paper.style.transition='transform .35s ease-out';
  paper.style.transform='translateY(0)';
  S.motor(.4);
  await wait(350);
  await printDoc();
  const idx=SECTIONS.indexOf(currentDoc);
  $('#lcdMode').textContent=LABELS[idx];
  $('#ledPwr').classList.add('on');
  $('#ledRdy').classList.add('on');
  $('#btnTest').classList.remove('lit');
  $('#ledErr').classList.remove('on');
});

$('#btnSnd').addEventListener('click',()=>{
  S.on=!S.on;
  $('#btnSnd').classList.toggle('lit');
  S.click();
});

/* ---------- keyboard shortcuts ---------- */
document.addEventListener('keydown',(e)=>{
  if(!ready||booting||printing) return;
  if(e.target.closest('button')) return;
  const key=e.key.toLowerCase();
  if(key==='f'){ e.preventDefault(); $('#btnFeed').click(); }
  if(key==='t'){ e.preventDefault(); $('#btnTest').click(); }
  if(key==='s'){ e.preventDefault(); $('#btnSnd').click(); }
  if(key==='a'||key==='1'){ e.preventDefault(); setDoc('about'); }
  if(key==='p'||key==='2'){ e.preventDefault(); setDoc('projects'); }
  if(key==='c'||key==='3'){ e.preventDefault(); setDoc('contact'); }
  if(key==='k'||key==='4'){ e.preventDefault(); setDoc('skills'); }
});

})();
