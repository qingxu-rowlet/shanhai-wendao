/* ============================================================
   山海问道 · great beasts: large art, ink-wash scenes, cinematic entrances, phases
   Big art is drawn as the left half and mirrored, so the beasts face you head-on.
   ============================================================ */
const BOSS_HALF = {
  qiongqi_big:[
'................',
'.w..............',
'.ww.............',
'zwww............',
'zwwww.......oo..',
'.zwwww.....oOOo.',
'.zwwwww...oooooo',
'..zwwwwwoookoooo',
'..zwwwwwookooooo',
'...zwwwooooooooo',
'...zzwwoooyykooo',
'....zwwoooykkooo',
'....zzwooooooooo',
'.....zooooxxoooo',
'.....ooookxxxxkk',
'......oooxxrrrrr',
'......oooxxrxrxr',
'.......ooxxxxxxx',
'......oooooxxxxx',
'.....ooookoooooo',
'....oookooooookO',
'....ooooookooooO',
'....oookoooooooo',
'...ooooooookoooo',
'...oooxxooooooOO',
'...xxxxx.oooOOOO',
'..xkxkxx..OOOOOO',
'...........OOOOO'],
  huli_big:[
'................',
'.ww........w....',
'wzzw......wpw...',
'wzzw.ww...wppw..',
'.wzwwzzw..wppww.',
'.wzzwzzw.wwppwww',
'..wzzwzzwwwwwwww',
'..wzzzwzwwwwwwww',
'...wzzzzwwwvvwww',
'...wwzzzwwwwvwww',
'....wzzzwwkkwwww',
'....wwzzwwwkllww',
'.....wzzwwwwwwww',
'......wzwwwwwwkk',
'.......wwwwwwwrr',
'........wwwwwwww',
'.......wwwwwwwww',
'......wwzwwwwwww',
'.....wwzzwwwwwww',
'.....wzzwwwwwwww',
'....wwzwwwwyywww',
'....wzzwwwwwwwww',
'....wwwwwwwwwwww',
'.....zzww..wwwww',
'......zz....zzww'],
  taotie_big:[
'................',
'..NN............',
'.NYYN...........',
'.NYYYN..........',
'..NYYYN.........',
'...NYYYNNNNNNNNN',
'...NTTTTTTTTTTTT',
'..NTTYYYTTTTTTTT',
'.NTTYrrrYTTTTTTT',
'.NTTYrkkrYTTTTYY',
'.NTTYrkkrYTTTTYN',
'.NTTTYrrYTTTTTYN',
'..NTTTYYTTTTTTTT',
'..NTTTTTTTTTTTTT',
'.NTTTTTTTTNNNNNN',
'.NTTTTTTNkkkkkkk',
'.NTTTTTNkxkkxkkx',
'.NTTTTTNkkkkkkkk',
'..NTTTTNkkxkkxkk',
'..NTTTTTNkkkkkkk',
'...NTTTTTNNNNNNN',
'....NNTTTTTTTTTT',
'.....NNTTTNNNTTT',
'......YYY...YYY.'],
};
for(const k in BOSS_HALF) SPR[k]=BOSS_HALF[k].map(r=>r+r.split('').reverse().join(''));
BEASTS.qiongqi.spr='qiongqi_big'; BEASTS.huli.spr='huli_big'; BEASTS.taotie.spr='taotie_big';
BEASTS.qiongqi.phase2={at:.5, moves:['wind','charge','big','double','wind','roar'], line:'穷奇双翼一振，狂风卷起！（风刃：护体只能挡一半）'};
BEASTS.huli.phase2={at:.5, moves:['charm','fire','fire','charge','big','fire'], line:'九尾齐开！狐火映红了整片夜空……'};
BEASTS.qiongqi.hp=300; BEASTS.huli.hp=600;
BEASTS.qiongqi.theme='qiongqi'; BEASTS.huli.theme='huli'; BEASTS.taotie.theme='taotie';
const SCENES = {
  qiongqi:{sky:['#6b7a72','#a9b3a0','#d8d6c0'], moon:'#f2efe0', hills:['#5b6a62','#465349','#323c35','#1f2622'], fx:'wind', title:'穷奇', sub:'状如虎，有翼　——　《海内北经》', ink:'#1a1f1c'},
  huli:{sky:['#141b3c','#2b2f66','#5a4a86'], moon:'#f6f0d6', hills:['#2c2f5c','#232650','#1a1c3e','#10122a'], fx:'foxfire', title:'九尾狐', sub:'青丘之山，有兽焉，其状如狐而九尾　——　《南山经》', ink:'#0b0c1c'},
  taotie:{sky:['#2a0c0c','#6e1d16','#b8471f'], moon:'#ffb070', hills:['#3a1410','#2a0d0a','#1c0806','#0f0403'], fx:'embers', title:'饕餮', sub:'贪于饮食，冒于货贿　——　《左传》', ink:'#050101'},
};

/* ---------- ink-wash painter ---------- */
const Ink = {
  layers:{},
  bake(kind, w, h){
    const key=kind+w+'x'+h; if(Ink.layers[key]) return Ink.layers[key];
    const sc=SCENES[kind], c=document.createElement('canvas'); c.width=w; c.height=h; const g=c.getContext('2d');
    const sky=g.createLinearGradient(0,0,0,h); sc.sky.forEach((col,i)=>sky.addColorStop(i/(sc.sky.length-1),col)); g.fillStyle=sky; g.fillRect(0,0,w,h);
    // moon with a soft halo
    const mx=w*.72, my=h*.2, mr=Math.min(w,h)*.08, halo=g.createRadialGradient(mx,my,mr*.5,mx,my,mr*4);
    halo.addColorStop(0,sc.moon+'88'); halo.addColorStop(1,sc.moon+'00'); g.fillStyle=halo; g.fillRect(0,0,w,h);
    g.fillStyle=sc.moon; g.beginPath(); g.arc(mx,my,mr,0,7); g.fill();
    // mountain ridges, back to front, painted with several soft passes like a wet brush
    const R=rng(kind.length*977+13);
    sc.hills.forEach((col,li)=>{
      const base=h*(.42+li*.13), amp=h*(.16-li*.025), f1=1.5+R()*2, f2=4+R()*5, ph=R()*9;
      const ridge=x=>base-amp*(.55*Math.sin(x/w*Math.PI*f1+ph)+.3*Math.sin(x/w*Math.PI*f2+ph*2)+.15*Math.sin(x/w*Math.PI*17+ph));
      for(let pass=0;pass<5;pass++){
        g.globalAlpha=pass===4?1:.18; g.fillStyle=col; g.beginPath(); g.moveTo(0,h);
        for(let x=0;x<=w;x+=4) g.lineTo(x, ridge(x)+(4-pass)*3*(R()-.3));
        g.lineTo(w,h); g.closePath(); g.fill();
      }
      g.globalAlpha=1;
      // mist at the foot of each ridge
      const mist=g.createLinearGradient(0,base-amp*.2,0,base+h*.12); mist.addColorStop(0,'rgba(255,255,255,0)'); mist.addColorStop(.6,`rgba(230,230,225,${.10+li*.03})`); mist.addColorStop(1,'rgba(255,255,255,0)');
      g.fillStyle=mist; g.fillRect(0,base-amp*.2,w,h*.3);
      // a few ink pines on the nearer ridges
      if(li>=2) for(let i=0;i<7;i++){ const x=R()*w, y=ridge(x); g.fillStyle=sc.ink; g.globalAlpha=.75;
        for(let k=0;k<4;k++){ g.beginPath(); g.ellipse(x+(R()-.5)*6, y-6-k*7, 10-k*2, 3.5, (R()-.5)*.3, 0, 7); g.fill(); } g.fillRect(x-1,y-6,2,10); g.globalAlpha=1; }
    });
    // paper grain
    for(let i=0;i<w*h/90;i++){ g.fillStyle=`rgba(255,255,255,${R()*.035})`; g.fillRect(R()*w,R()*h,1+R()*2,1); }
    return Ink.layers[key]=c;
  },
  parts:[],
  frame(cv, kind, t, dt){
    const g=cv.getContext('2d'), w=cv.width, h=cv.height, sc=SCENES[kind];
    g.drawImage(Ink.bake(kind,w,h),0,0);
    // drifting mist bands
    for(let i=0;i<3;i++){ const y=h*(.5+i*.14), x=((t*14*(i+1))%(w*1.6))-w*.3; const m=g.createRadialGradient(x,y,0,x,y,w*.35);
      m.addColorStop(0,'rgba(240,240,235,.10)'); m.addColorStop(1,'rgba(240,240,235,0)'); g.fillStyle=m; g.fillRect(0,0,w,h); }
    // particles
    const P=Ink.parts, want=sc.fx==='wind'?40:sc.fx==='foxfire'?34:50;
    while(P.length<want) P.push({x:Math.random()*w, y:Math.random()*h, v:.5+Math.random(), s:Math.random(), life:Math.random()});
    for(const p of P){
      if(sc.fx==='wind'){ p.x+=dt*w*.9*p.v; p.y+=Math.sin(t*2+p.s*9)*dt*20; if(p.x>w+60){ p.x=-60; p.y=Math.random()*h; }
        g.strokeStyle=`rgba(240,240,230,${.12+.2*p.s})`; g.lineWidth=1+p.s*1.5; g.beginPath(); g.moveTo(p.x,p.y); g.quadraticCurveTo(p.x-30,p.y-6,p.x-70*p.v,p.y+2); g.stroke(); }
      if(sc.fx==='foxfire'){ p.y-=dt*h*.05*p.v; p.x+=Math.sin(t*1.5+p.s*7)*dt*14; if(p.y<-20){ p.y=h+10; p.x=Math.random()*w; }
        const r=3+p.s*5, gl=g.createRadialGradient(p.x,p.y,0,p.x,p.y,r*4); gl.addColorStop(0,p.s>.5?'rgba(140,200,255,.85)':'rgba(255,180,220,.7)'); gl.addColorStop(1,'rgba(120,160,255,0)');
        g.fillStyle=gl; g.fillRect(p.x-r*4,p.y-r*4,r*8,r*8); }
      if(sc.fx==='embers'){ p.y-=dt*h*.12*p.v; p.x+=Math.sin(t*3+p.s*5)*dt*30; if(p.y<-10){ p.y=h+10; p.x=Math.random()*w; }
        g.fillStyle=`rgba(255,${120+p.s*100|0},40,${.4+.5*Math.abs(Math.sin(t*4+p.s*9))})`; g.fillRect(p.x,p.y,2+p.s*2,2+p.s*2); }
    }
    if(sc.fx==='wind'&&Math.sin(t*.7)>.985){ g.fillStyle='rgba(255,255,255,.25)'; g.fillRect(0,0,w,h); }
  },
};

/* ---------- cinematic entrance ---------- */
const Cine = {
  play(kind, cb){
    const sc=SCENES[kind], el=$('#cine'); el.hidden=false; Ink.parts=[];
    el.innerHTML=`<canvas id="cineBg"></canvas><div class="cine-beast"><canvas id="cineArt" class="px"></canvas></div>
      <div class="cine-title"><b>${sc.title}</b><span id="cineSub"></span></div><div class="cine-skip">点击继续</div>`;
    const bg=$('#cineBg'), dpr=Math.min(2,devicePixelRatio||1); bg.width=innerWidth*dpr; bg.height=innerHeight*dpr;
    const art=$('#cineArt'), sp=sprite(BEASTS[kind].spr); art.width=sp.width; art.height=sp.height; art.getContext('2d').drawImage(sp,0,0);
    Music.stinger('boss'); setTimeout(()=>Music.play(BEASTS[kind].theme||'battle'),900);
    UI.fx=true; UI.sync();
    let t0=performance.now(), last=t0, alive=true, done=false;
    const loop=now=>{ if(!alive) return; const dt=Math.min(.05,(now-last)/1000); last=now; Ink.frame(bg,kind,(now-t0)/1000,dt); requestAnimationFrame(loop); };
    requestAnimationFrame(loop); Ink.frame(bg,kind,0,0);
    el.classList.remove('go'); void el.offsetWidth; el.classList.add('go');
    let i=0; const sub=sc.sub; const ty=setInterval(()=>{ const s=$('#cineSub'); if(!s){ clearInterval(ty); return; } s.textContent=sub.slice(0,++i); if(i>=sub.length) clearInterval(ty); },70);
    const finish=()=>{ if(done) return; done=true; alive=false; clearInterval(ty); el.hidden=true; el.innerHTML=''; UI.fx=false; UI.sync(); cb&&cb(); };
    setTimeout(()=>{ el.onclick=finish; },1200);
    setTimeout(finish,9000);
  },
};

/* ---------- boss battle backdrop ---------- */
const BossBg = {
  start(kind){
    const host=$('#battle'); let c=$('#bBg'); if(!c){ c=document.createElement('canvas'); c.id='bBg'; host.prepend(c); }
    const dpr=Math.min(2,devicePixelRatio||1); c.width=innerWidth*dpr; c.height=innerHeight*dpr; Ink.parts=[];
    BossBg.on=true; const token=BossBg.token=(BossBg.token||0)+1; let t0=performance.now(), last=t0;
    const loop=now=>{ if(!BossBg.on||BossBg.token!==token||!$('#bBg')) return; const dt=Math.min(.05,(now-last)/1000); last=now; Ink.frame(c,kind,(now-t0)/1000,dt); requestAnimationFrame(loop); };
    Ink.frame(c,kind,0,0); requestAnimationFrame(loop);
  },
  stop(){ BossBg.on=false; const c=$('#bBg'); if(c) c.remove(); },
  flash(color){ const f=document.createElement('div'); f.className='bflash'; f.style.background=color; $('#battle').appendChild(f); setTimeout(()=>f.remove(),500); },
};
