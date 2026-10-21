/* ============================================================
   山海问道 · 躲弹幕 — turn-based fights where the enemy's turn is a few seconds of dodging.
   You still choose 剑击 / 御剑术 / 护体 / 丹药 on your turn; on the enemy's turn a box opens and you steer
   your 灵珠 (jade bead) through its attack pattern. Every hit costs a little life; a clean dodge costs nothing.
   护体 slows the bullets and halves the damage. Keyboard: WASD / arrows. Touch: drag anywhere.
   Beasts opt in with a DODGE table (穷奇 first); settings can switch back to classic turns.
   ============================================================ */
// box coordinates are 0..100 in both directions
const DODGE = {
  qiongqi:{
    atk:   {name:'羽刃散射', hit:.45, dur:4.2, spawn(P,t,dt,m){ P.every('f',.2/m,()=>P.add({k:'feather', x:5+Math.random()*90, y:-4, vx:(Math.random()-.5)*12, vy:(34+Math.random()*16)*m, r:2.2})); }},
    double:{name:'双爪撕裂', hit:.7, dur:4.4, spawn(P,t,dt,m){ for(const at of m>1?[.3,1.3,2.3,3.2]:[.3,1.6,2.9]) P.once('c'+at,t>=at,()=>{ const a=Math.random()*Math.PI;
        for(const off of [-9,9]) P.add({k:'slash', cx:P.me.x+Math.cos(a+Math.PI/2)*off, cy:P.me.y+Math.sin(a+Math.PI/2)*off, a, w:6, warn:.75/m, act:.22}); });
      P.every('f',.6/m,()=>P.add({k:'feather', x:Math.random()*100, y:-4, vx:0, vy:30*m, r:2})); }},
    big:   {name:'猛扑', hit:1.3, dur:4.6, spawn(P,t,dt,m){
      P.once('h',t>=.3,()=>P.add({k:'band', dir:'h', at:P.me.y, w:26, warn:1/m, act:.35}));
      P.once('v',t>=1.9,()=>P.add({k:'band', dir:'v', at:P.me.x, w:26, warn:.9/m, act:.35}));
      if(m>1) P.once('x',t>=3.2,()=>{ P.add({k:'band', dir:'h', at:P.me.y, w:20, warn:.8, act:.3}); P.add({k:'band', dir:'v', at:P.me.x, w:20, warn:.8, act:.3}); });
      P.every('f',.5/m,()=>P.add({k:'feather', x:Math.random()*100, y:-4, vx:0, vy:28*m, r:2})); }},
    wind:  {name:'风刃', hit:.5, dur:4.6, spawn(P,t,dt,m){ P.every('w',.95/m,()=>{ const left=Math.random()<.5, gap=12+Math.random()*76;
        for(let y=4;y<100;y+=8) if(Math.abs(y-gap)>13) P.add({k:'blade', x:left?-6:106, y, vx:(left?1:-1)*44*m, vy:0, r:2.6}); }); }},
    roar:  {name:'怒吼', hit:.5, mp:4, dur:4.4, spawn(P,t,dt,m){ P.every('r',1.15/m,()=>P.add({k:'ring', cx:50, cy:50, R:2, vr:34*m, gap:Math.random()*Math.PI*2, gw:1.0, th:3})); }},
  },
};
const Dodge = {
  auto:false,   // the self-test plays fast: no dodging, one hit
  on(s){ return !!(s && DODGE[s.kind] && !S.dodgeOff); },
  pattern(s){ const it=Battle.intent(); return DODGE[s.kind] && DODGE[s.kind][it] ? DODGE[s.kind][it] : null; },
  perHit(s,pat){ const st=stats(); let d=Math.max(1,Math.round(s.B.atk*pat.hit-st.def*.5)); if(s.guard) d=Math.max(1,Math.round(d*.5)); return d; },
  run(pat, s, done){
    if(Dodge.auto) return setTimeout(()=>done(1),60);
    const m=(s.phase2?1.22:1)*(s.guard?.8:1);
    const ov=document.createElement('div'); ov.className='dodge';
    ov.innerHTML=`<div class="dg-head"><b>${pat.name}</b><span>${FINE_POINTER?'WASD / 方向键 移动灵珠':'按住屏幕任意处拖动灵珠'}${s.guard?'　·　护体：弹幕变慢、伤害减半':''}</span></div><canvas></canvas><div class="dg-time"><i></i></div>`;
    $('#battle').appendChild(ov);
    const cv2=ov.querySelector('canvas'), g=cv2.getContext('2d'), dpr=Math.min(2,devicePixelRatio||1);
    const L=Math.min(320, innerWidth*.84, innerHeight*.42); cv2.style.width=cv2.style.height=L+'px'; cv2.width=cv2.height=Math.round(L*dpr);
    const K=cv2.width/100;
    const P={ me:{x:50,y:70}, list:[], timers:{}, fired:{}, hits:0, inv:0, flash:0,
      add(b){ b.t=0; P.list.push(b); },
      every(id,iv,fn){ P.timers[id]=(P.timers[id]??iv*.5)-P.dt; if(P.timers[id]<=0){ P.timers[id]+=iv; fn(); } },
      once(id,cond,fn){ if(cond&&!P.fired[id]){ P.fired[id]=1; fn(); } } };
    const keys={}; const kd=e=>{ const k={ArrowUp:'u',KeyW:'u',ArrowDown:'d',KeyS:'d',ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r'}[e.code]; if(k){ keys[k]=1; e.preventDefault(); e.stopPropagation(); } };
    const ku=e=>{ const k={ArrowUp:'u',KeyW:'u',ArrowDown:'d',KeyS:'d',ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r'}[e.code]; if(k) keys[k]=0; };
    addEventListener('keydown',kd,true); addEventListener('keyup',ku);
    // touch: drag anywhere on the overlay; the bead follows the finger's movement (not its position) so it stays visible
    let drag=null; const scale=100/L*1.15;
    ov.addEventListener('pointerdown',e=>{ drag={x:e.clientX,y:e.clientY}; ov.setPointerCapture(e.pointerId); e.preventDefault(); });
    ov.addEventListener('pointermove',e=>{ if(!drag) return; P.me.x+=(e.clientX-drag.x)*scale; P.me.y+=(e.clientY-drag.y)*scale; drag={x:e.clientX,y:e.clientY}; });
    ov.addEventListener('pointerup',()=>drag=null); ov.addEventListener('pointercancel',()=>drag=null);
    const R=3.2, SPEED=58; let t=0, last=performance.now(), ended=false;
    const segDist=(px,py,b)=>{ const dx=Math.cos(b.a), dy=Math.sin(b.a), qx=px-b.cx, qy=py-b.cy; return Math.abs(qx*dy-qy*dx); };
    const hitTest=b=>{
      if(b.k==='feather'||b.k==='blade'||b.k==='orbit') return b.x!==undefined&&Math.hypot(P.me.x-b.x,P.me.y-b.y)<R+b.r-.6;
      if(b.k==='slash') return b.t>b.warn && segDist(P.me.x,P.me.y,b)<b.w/2+R*.6;
      if(b.k==='band') return b.t>b.warn && Math.abs((b.dir==='h'?P.me.y:P.me.x)-b.at)<b.w/2+R*.4;
      if(b.k==='ring'){ const d=Math.hypot(P.me.x-b.cx,P.me.y-b.cy); if(Math.abs(d-b.R)>b.th+R*.6) return false;
        let ang=Math.atan2(P.me.y-b.cy,P.me.x-b.cx)-b.gap; ang=Math.atan2(Math.sin(ang),Math.cos(ang)); return Math.abs(ang)>b.gw/2; }
      return false; };
    const step=now=>{ try{ stepIn(now); }catch(e){ console.error('dodge',e); if(!ended){ P.hits=0; finish(); } } };
    const stepIn=now=>{
      if(ended) return; const dt=Math.min(.05,(now-last)/1000); last=now; t+=dt; P.dt=dt;
      if(Battle.s!==s){ finish(); return; }
      // move
      const vx=(keys.r?1:0)-(keys.l?1:0), vy=(keys.d?1:0)-(keys.u?1:0), n=Math.hypot(vx,vy)||1;
      P.me.x+=vx/n*SPEED*dt; P.me.y+=vy/n*SPEED*dt; P.me.x=Math.max(R,Math.min(100-R,P.me.x)); P.me.y=Math.max(R,Math.min(100-R,P.me.y));
      if(pat.pull){ const dx=50-P.me.x, dy=50-P.me.y, d=Math.hypot(dx,dy)||1; if(d>2){ P.me.x+=dx/d*pat.pull*m*dt; P.me.y+=dy/d*pat.pull*m*dt; } }
      if(t<pat.dur-.5) pat.spawn(P,t,dt,m);
      for(const b of P.list){ b.t+=dt;
        if(b.vx!==undefined){ b.x+=b.vx*dt; b.y+=b.vy*dt; }
        if(b.k==='ring') b.R+=b.vr*dt;
        if(b.k==='orbit'){ b.a+=b.va*dt; b.R+=b.vr*dt; b.x=50+Math.cos(b.a)*b.R; b.y=50+Math.sin(b.a)*b.R; }
        if(P.inv<=0 && hitTest(b)){ P.hits++; P.inv=.7; P.flash=.25; Sound.hurt(); ov.classList.remove('hurt'); void ov.offsetWidth; ov.classList.add('hurt'); } }
      P.list=P.list.filter(b=>{ if(b.k==='slash'||b.k==='band') return b.t<b.warn+b.act; if(b.k==='ring') return b.R<80; if(b.k==='orbit') return b.R>3; return b.x>-10&&b.x<110&&b.y>-10&&b.y<110; });
      P.inv-=dt; P.flash-=dt;
      draw(); ov.querySelector('.dg-time i').style.width=Math.max(0,100-t/pat.dur*100)+'%';
      if(t>=pat.dur) return finish();
      requestAnimationFrame(step);
    };
    const draw=()=>{
      g.setTransform(K,0,0,K,0,0); g.fillStyle='#0d1018'; g.fillRect(0,0,100,100);
      g.strokeStyle='rgba(255,255,255,.04)'; g.lineWidth=.3; for(let i=10;i<100;i+=10){ g.beginPath(); g.moveTo(i,0); g.lineTo(i,100); g.moveTo(0,i); g.lineTo(100,i); g.stroke(); }
      for(const b of P.list){
        if(b.k==='feather'){ const a=Math.atan2(b.vy,b.vx); g.save(); g.translate(b.x,b.y); g.rotate(a); g.fillStyle='#e8f2ff'; g.beginPath(); g.ellipse(0,0,4.2,1.5,0,0,7); g.fill(); g.fillStyle='#7fb2e8'; g.beginPath(); g.ellipse(2.6,0,1.6,1.1,0,0,7); g.fill(); g.restore(); }
        if(b.k==='blade'){ g.save(); g.translate(b.x,b.y); g.rotate(b.vx>0?0:Math.PI); g.strokeStyle='#c8f2d8'; g.lineWidth=1.4; g.beginPath(); g.arc(-1,0,3.2,-1.1,1.1); g.stroke(); g.strokeStyle='rgba(200,242,216,.35)'; g.lineWidth=.8; g.beginPath(); g.arc(-3.5,0,3.2,-1,1); g.stroke(); g.restore(); }
        if(b.k==='slash'){ const live=b.t>b.warn, dx=Math.cos(b.a)*150, dy=Math.sin(b.a)*150;
          g.strokeStyle=live?'#ffe6e0':`rgba(255,70,50,${.25+.35*Math.abs(Math.sin(b.t*18))})`; g.lineWidth=live?b.w:.8; g.lineCap='round';
          g.beginPath(); g.moveTo(b.cx-dx,b.cy-dy); g.lineTo(b.cx+dx,b.cy+dy); g.stroke(); if(live){ g.strokeStyle='rgba(255,90,60,.5)'; g.lineWidth=b.w*1.6; g.globalAlpha=.3; g.stroke(); g.globalAlpha=1; } }
        if(b.k==='band'){ const live=b.t>b.warn; g.fillStyle=live?'rgba(255,235,220,.95)':`rgba(255,60,40,${.12+.18*Math.abs(Math.sin(b.t*12))})`;
          if(b.dir==='h') g.fillRect(0,b.at-b.w/2,100,b.w); else g.fillRect(b.at-b.w/2,0,b.w,100);
          if(!live){ g.strokeStyle='rgba(255,80,60,.7)'; g.lineWidth=.6; g.setLineDash([2,2]); if(b.dir==='h') g.strokeRect(0,b.at-b.w/2,100,b.w); else g.strokeRect(b.at-b.w/2,0,b.w,100); g.setLineDash([]); }
          else { g.fillStyle='rgba(60,30,30,.85)'; const p=(b.t-b.warn)/b.act; if(b.dir==='h'){ g.beginPath(); g.ellipse(-20+p*140,b.at,14,b.w*.32,0,0,7); g.fill(); } else { g.beginPath(); g.ellipse(b.at,-20+p*140,b.w*.32,14,0,0,7); g.fill(); } } }
        if(b.k==='orbit'&&b.x!==undefined){ g.save(); g.translate(b.x,b.y); g.rotate(b.a+Math.PI/2); g.fillStyle='#e8f2ff'; g.beginPath(); g.ellipse(0,0,4,1.5,0,0,7); g.fill(); g.fillStyle='#7fb2e8'; g.beginPath(); g.ellipse(2.4,0,1.5,1,0,0,7); g.fill(); g.restore(); }
        if(b.k==='ring'){ g.strokeStyle='rgba(255,200,120,.9)'; g.lineWidth=b.th; g.beginPath(); g.arc(b.cx,b.cy,b.R,b.gap+b.gw/2,b.gap-b.gw/2+Math.PI*2); g.stroke(); }
      }
      if(pat.pull){ for(let k=0;k<3;k++){ g.strokeStyle=`rgba(200,220,240,${.25-k*.06})`; g.lineWidth=1.2; g.beginPath(); g.arc(50,50,6+k*6+(t*20%6),t*3+k,t*3+k+4.2); g.stroke(); } }
      // the bead (blinks while invulnerable)
      if(P.inv<=0 || Math.floor(P.inv*16)%2){ const gr=g.createRadialGradient(P.me.x,P.me.y,0,P.me.x,P.me.y,R*2.6); gr.addColorStop(0,'rgba(140,240,200,.55)'); gr.addColorStop(1,'rgba(140,240,200,0)'); g.fillStyle=gr; g.fillRect(P.me.x-R*3,P.me.y-R*3,R*6,R*6);
        g.fillStyle=s.guard?'#e8d07a':'#5fd6a8'; g.beginPath(); g.arc(P.me.x,P.me.y,R,0,7); g.fill(); g.fillStyle='#eafff6'; g.beginPath(); g.arc(P.me.x-1,P.me.y-1,1.1,0,7); g.fill(); }
      if(P.flash>0){ g.fillStyle=`rgba(255,60,40,${P.flash})`; g.fillRect(0,0,100,100); }
    };
    const finish=()=>{ if(ended) return; ended=true; removeEventListener('keydown',kd,true); removeEventListener('keyup',ku); ov.classList.add('out'); setTimeout(()=>ov.remove(),250); done(P.hits); };
    draw(); requestAnimationFrame(step);
    setTimeout(()=>{ if(!ended) finish(); }, (pat.dur+3)*1000);
  },
};
// the enemy's turn: dodge if this beast has a pattern for its move, otherwise the classic resolution
{ const _et=Battle.enemyTurn;
  Battle.enemyTurn=function(){
    const s=Battle.s; if(!Dodge.on(s)||s.stun) return _et.call(Battle);
    const pat=Dodge.pattern(s); if(!pat) return _et.call(Battle);     // e.g. 蓄力: nothing to dodge, the classic turn handles it
    s.busy=true; Battle.ui(); Battle.log(`${s.B.name}：${pat.name}！`);
    setTimeout(()=>{ if(Battle.s!==s||s.dead) return;
      Dodge.run(pat, s, hits=>{
        if(Battle.s!==s||s.dead) return; const st=stats(), per=Dodge.perHit(s,pat); let dmg=hits*per, msg='';
        if(hits===0){ msg=`你避开了${pat.name}，毫发无伤！`; Battle.float('完美闪避','perfect'); }
        else { msg=`被${pat.name}击中 ${hits} 下。`; S.hp-=dmg; $('#battle').classList.remove('shake'); void $('#battle').offsetWidth; $('#battle').classList.add('shake'); Battle.float('-'+dmg,'me'); }
        if(pat.mp&&hits){ S.mp=Math.max(0,S.mp-pat.mp*hits); msg+=`灵力被震散 ${pat.mp*hits}。`; }
        s.i++; let tail='';
        if(s.burn>0 && s.hp>0){ const bd=Math.max(1,Math.round(st.atk*.6)); s.hp-=bd; s.burn--; tail=` 丹火灼烧 ${bd}。`; setTimeout(()=>Battle.float('-'+bd,'burn'),200); }
        Battle.log(msg+(dmg?`（-${dmg}）`:'')+tail); s.busy=false; Battle.phaseCheck(); Battle.ui();
        if(s.hp<=0){ s.busy=true; s.dead=true; return setTimeout(()=>Battle.end('win'),500); }
        if(S.hp<=0){ S.hp=0; setTimeout(()=>Battle.end('lose'),600); }
      });
    },450);
  };
}
// the intent line tells you a dodge is coming and how much each hit hurts
{ const _ui=Battle.ui; Battle.ui=function(){ _ui.call(Battle); const s=Battle.s; if(!Dodge.on(s)||s.stun) return; const pat=Dodge.pattern(s); if(!pat) return;
    const tip={tornado:'被吸向中间，往外顶着走',featherrain:'找羽毛之间的空隙',big:'红框亮起就离开那一行',double:'红线是预警，别站在线上',wind:'找风刃的缺口',roar:'从圆环的缺口穿出去'}[Battle.intent()];
    const el=$('#bIntent'); el.textContent=`${pat.name} · 躲弹幕（每中一下约 ${Dodge.perHit(s,pat)}${s.guard?'':'，护体可减半'}）${S.flags.fx_tell&&tip?'　看破：'+tip:''}`; el.className='b-intent warn'; }; }
