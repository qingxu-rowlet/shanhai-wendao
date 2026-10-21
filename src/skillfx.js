/* ============================================================
   山海问道 · 宗门绝学动画 — each sect's signature move gets its own pixel animation in battle before the damage lands.
   青云剑宗 万剑归宗: a rain of flying swords, then one great sword. 药王谷 丹火: a golden flame gathers, flies, and bursts.
   万兽谷 兽魂共鸣: the pet's spirit, huge and glowing, charges in and claws. 天机阁 定身符: a talisman sticks and a bagua ring locks the foe.
   ============================================================ */
const SkillFx = {
  play(kind, done){
    const host=$('#battle'), en=$('#bEnemy'); if(!host||!en){ done(); return; }
    const hr=host.getBoundingClientRect(), er=en.getBoundingClientRect();
    const P=Math.max(2,Math.round(Math.min(hr.width,hr.height)/150)), W=Math.ceil(hr.width/P), H=Math.ceil(hr.height/P);
    const cv=document.createElement('canvas'); cv.className='skillfx px'; cv.width=W; cv.height=H; host.appendChild(cv);
    const g=cv.getContext('2d'), ex=(er.left+er.width/2-hr.left)/P, ey=(er.top+er.height/2-hr.top)/P, er2=Math.max(10,Math.min(er.width,er.height)/P/2.4);
    const fx=SkillFx[kind]; if(!fx){ cv.remove(); done(); return; }
    const sg=$('#battle .b-stage'), by=sg?(sg.getBoundingClientRect().bottom-hr.top)/P:H*.6, st={ex,ey,R:er2,W,H,by,parts:[],seed:1}; fx.init&&fx.init(st);
    const t0=performance.now(); let shook=false, fin=false;
    const end=()=>{ if(fin) return; fin=true; cv.classList.add('out'); setTimeout(()=>cv.remove(),260); done(); };
    const loop=now=>{ if(fin) return; const t=(now-t0)/1000; g.clearRect(0,0,W,H);
      try{ fx.draw(g,t,st); }catch(e){ return end(); }
      if(!shook&&t>=fx.hit){ shook=true; Sound.hit(); host.classList.remove('shake'); void host.offsetWidth; host.classList.add('shake'); }
      if(t>=fx.dur) return end(); requestAnimationFrame(loop); };
    requestAnimationFrame(loop); setTimeout(end,(fx.dur+1)*1000);   // never hang the battle, even if frames stop
  },
  // small helpers on the low-res canvas
  r(g,x,y,w,h,c){ g.fillStyle=c; g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h))); },
  line(g,x0,y0,x1,y1,c){ const n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0))); g.fillStyle=c; for(let i=0;i<=n;i++){ const u=i/n; g.fillRect(Math.round(x0+(x1-x0)*u),Math.round(y0+(y1-y0)*u),1,1); } },
  ring(g,cx,cy,r,c,gap){ g.fillStyle=c; const n=Math.max(12,Math.round(r*6)); for(let i=0;i<n;i++){ if(gap&&i%gap===0) continue; const a=i/n*Math.PI*2; g.fillRect(Math.round(cx+Math.cos(a)*r),Math.round(cy+Math.sin(a)*r),1,1); } },
  flash(g,st,a,c){ if(a<=0) return; g.fillStyle=c.replace('A',a.toFixed(3)); g.fillRect(0,0,st.W,st.H); },
  sparks(st,x,y,n,cols,sp){ for(let i=0;i<n;i++){ const a=Math.random()*Math.PI*2, v=(sp||30)*(.4+Math.random()); st.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-10,life:.35+Math.random()*.3,t:0,c:cols[i%cols.length]}); } },
  runParts(g,st,dt){ st.parts=st.parts.filter(p=>{ p.t+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=(p.g??40)*dt; if(p.t>p.life) return false; SkillFx.r(g,p.x,p.y,p.s||1,p.s||1,p.c); return true; }); },
  dt(st,t){ const d=Math.min(.05,t-(st.last||t)); st.last=t; return d; },
};

/* 万剑归宗 — dozens of swords rain down on the beast, then one great sword falls */
SkillFx.jian={ dur:1.75, hit:.5,
  init(st){ st.sw=[]; for(let i=0;i<34;i++){ const at=i/34*.85+Math.random()*.05, tx=st.ex+(Math.random()-.5)*st.R*1.6, ty=st.ey+(Math.random()-.5)*st.R*1.1, sx=tx-st.H*.45-Math.random()*20, sy=-12-Math.random()*20;
    st.sw.push({at,tx,ty,sx,sy,dur:.26+Math.random()*.08,hit:false}); } },
  draw(g,t,st){ const F=SkillFx, dt=F.dt(st,t);
    F.flash(g,st,Math.min(.35,t*1.2)*(t<1.5?1:Math.max(0,(1.75-t)*4)),'rgba(14,26,52,A)');   // the sky darkens
    for(const s of st.sw){ const u=(t-s.at)/s.dur; if(u<0) continue;
      if(u<1){ const x=s.sx+(s.tx-s.sx)*u, y=s.sy+(s.ty-s.sy)*u, a=Math.atan2(s.ty-s.sy,s.tx-s.sx), c=Math.cos(a), si=Math.sin(a);
        F.line(g,x-c*16,y-si*16,x-c*9,y-si*9,'rgba(140,190,255,.35)');      // trail
        F.line(g,x-c*9,y-si*9,x,y,'#eaf4ff'); F.r(g,x,y,1,1,'#ffffff');      // blade
        F.line(g,x-c*11-si*2,y-si*11+c*2,x-c*11+si*2,y-si*11-c*2,'#e8b84a'); F.line(g,x-c*13,y-si*13,x-c*11,y-si*11,'#7a4a20'); }   // guard and hilt
      else { if(!s.hit){ s.hit=true; F.sparks(st,s.tx,s.ty,5,['#ffffff','#bfe0ff','#7fb2e8'],34); }
        const k=Math.min(1,(u-1)*s.dur/.5); if(k<1){ const a=Math.atan2(s.ty-s.sy,s.tx-s.sx), c=Math.cos(a), si=Math.sin(a); F.line(g,s.tx-c*7,s.ty-si*7,s.tx-c*2,s.ty-si*2,`rgba(220,236,255,${1-k})`); } } }
    // the great sword
    const gu=(t-1.0)/.22; if(gu>-0.6){ const x=st.ex, y=-30+(st.ey+4+30)*Math.min(1,Math.max(0,gu)), L=Math.round(st.R*2.2);
      if(gu<1.6){ const al=gu<1?1:Math.max(0,1-(gu-1)/.6);
        F.r(g,x-2,y-L,5,L,`rgba(234,244,255,${al})`); F.r(g,x,y-L,1,L,`rgba(255,255,255,${al})`); F.r(g,x-1,y,3,2,`rgba(234,244,255,${al})`);
        F.r(g,x-8,y-L-2,17,3,`rgba(232,184,74,${al})`); F.r(g,x-1,y-L-10,3,8,`rgba(122,74,32,${al})`); F.r(g,x-2,y-L-12,5,2,`rgba(232,184,74,${al})`);
        for(let k=1;k<5;k++) F.r(g,x-3-k,y-L-k*6,1,4,`rgba(140,190,255,${.3*al})`), F.r(g,x+3+k,y-L-k*6,1,4,`rgba(140,190,255,${.3*al})`); }
      if(gu>=1&&!st.boom){ st.boom=t; F.sparks(st,x,st.ey,26,['#ffffff','#bfe0ff','#e8b84a'],60); } }
    if(st.boom){ const k=(t-st.boom)/.5; F.flash(g,st,Math.max(0,.75*(1-k*2)),'rgba(235,245,255,A)'); if(k<1) F.ring(g,st.ex,st.ey,4+k*st.R*2.4,'rgba(200,225,255,'+(1-k).toFixed(2)+')',5); }
    F.runParts(g,st,dt); } };

/* 丹火 — a golden flame gathers below, flies up, and bursts into fire around the beast */
SkillFx.dan={ dur:1.6, hit:.62,
  draw(g,t,st){ const F=SkillFx, dt=F.dt(st,t), sx=st.W/2, sy=st.by-14;
    const fireCol=k=>k<.25?'#fff6c0':k<.5?'#ffd050':k<.75?'#ff9030':'#c83c28';
    if(t<.62){ const u=Math.min(1,t/.35), fly=Math.max(0,(t-.35)/.27), x=sx+(st.ex-sx)*fly, y=sy+(st.ey-sy)*fly-Math.sin(fly*Math.PI)*20, r=2+u*8;
      // spinning furnace sigil while it gathers
      if(fly===0){ F.ring(g,sx,sy,r+6+Math.sin(t*20),'rgba(255,200,80,.7)',3); for(let i=0;i<8;i++){ const a=t*6+i*Math.PI/4; F.r(g,sx+Math.cos(a)*(r+10),sy+Math.sin(a)*(r+10)*.5,1,1,'#ffd050'); } }
      for(let k=r+3;k>r;k--) F.ring(g,x,y,k,'rgba(255,160,40,.35)'); for(let k=r;k>=0;k--) F.ring(g,x,y,k,fireCol(1-k/Math.max(1,r))); F.r(g,x,y,1,1,'#ffffff');
      if(Math.random()<.9) st.parts.push({x:x+(Math.random()-.5)*r,y:y+(Math.random()-.5)*r,vx:(Math.random()-.5)*10,vy:10,g:-20,life:.3,t:0,c:'#ffb040'}); }
    else { if(!st.boom){ st.boom=1; F.sparks(st,st.ex,st.ey,30,['#fff6c0','#ffd050','#ff9030'],55); }
      const k=(t-.62)/.98; F.flash(g,st,Math.max(0,.5*(1-k*3)),'rgba(255,190,80,A)');
      F.ring(g,st.ex,st.ey,3+k*st.R*2,`rgba(255,200,90,${Math.max(0,1-k*1.4).toFixed(2)})`,4);
      // flames lick up around the beast
      for(let i=0;i<4;i++) if(k<.85) { const a=Math.random()*Math.PI*2, rr=st.R*(.4+Math.random()*.7); st.parts.push({x:st.ex+Math.cos(a)*rr,y:st.ey+Math.sin(a)*rr*.8,vx:(Math.random()-.5)*6,vy:-18-Math.random()*18,g:-10,life:.4+Math.random()*.3,t:0,c:'',fire:1,s:2}); } }
    st.parts=st.parts.filter(p=>{ p.t+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=(p.g??40)*dt; if(p.t>p.life) return false; F.r(g,p.x,p.y,p.s||1,p.s||1,p.fire?fireCol(p.t/p.life):p.c); return true; }); } };

/* 兽魂共鸣 — the pet's spirit, huge and glowing, charges in from the side and rakes the beast with three claws */
SkillFx.shou={ dur:1.55, hit:.55,
  init(st){ const kind=S.pet&&BEASTS[S.pet.kind]?BEASTS[S.pet.kind].spr:null; if(!kind) return;
    const sp=sprite(kind), sc=Math.max(2,Math.round(st.R*2.2/sp.height)), c=document.createElement('canvas'); c.width=sp.width+2; c.height=sp.height+2; const cg=c.getContext('2d');
    // a glowing rim: the silhouette in spirit-green, one pixel out on every side, then the beast itself, lightly tinted
    const sil=document.createElement('canvas'); sil.width=sp.width; sil.height=sp.height; const sg=sil.getContext('2d'); sg.drawImage(sp,0,0); sg.globalCompositeOperation='source-in'; sg.fillStyle='#b8ffd0'; sg.fillRect(0,0,sil.width,sil.height);
    for(const [dx,dy] of [[0,1],[2,1],[1,0],[1,2]]) cg.drawImage(sil,dx,dy);
    const tin=document.createElement('canvas'); tin.width=sp.width; tin.height=sp.height; const tg=tin.getContext('2d'); tg.drawImage(sp,0,0); tg.globalCompositeOperation='source-atop'; tg.fillStyle='rgba(170,255,200,.22)'; tg.fillRect(0,0,tin.width,tin.height);
    cg.drawImage(tin,1,1); st.ghost={c,sc}; },
  draw(g,t,st){ const F=SkillFx, dt=F.dt(st,t);
    F.flash(g,st,Math.min(.3,t)*(t<1.3?1:Math.max(0,(1.55-t)*4)),'rgba(8,30,18,A)');
    if(st.ghost){ const {c,sc}=st.ghost, w=c.width*sc, h=c.height*sc, u=Math.min(1,t/.5), e=1-Math.pow(1-u,3), x=-w+(st.ex-w*.95+w)*e, y=st.ey-h/2;
      g.imageSmoothingEnabled=false;
      for(let k=3;k>=1;k--){ g.globalAlpha=.18/k*(t<1.1?1:Math.max(0,(1.5-t)/.4)); g.drawImage(c,x-k*w*.18*(1-e),y,w,h); }   // afterimages
      g.globalAlpha=(t<1.1?.85:Math.max(0,(1.5-t)/.4)*.85); g.drawImage(c,x,y,w,h); g.globalAlpha=1; }
    // three claw marks, one after another
    for(let i=0;i<3;i++){ const at=.5+i*.1, k=(t-at)/.35; if(k<0||k>1.4) continue; const o=(i-1)*st.R*.35, len=st.R*1.5, p=Math.min(1,k*2.5), al=k<1?1:Math.max(0,1-(k-1)/.4);
      const x0=st.ex-len/2+o, y0=st.ey-len/2, x1=x0+len*p, y1=y0+len*p;
      F.line(g,x0,y0,x1,y1,`rgba(255,255,255,${al})`); F.line(g,x0+1,y0,x1+1,y1,`rgba(150,255,190,${al*.8})`); F.line(g,x0-1,y0,x1-1,y1,`rgba(242,193,78,${al*.6})`);
      if(k>.4&&!st['c'+i]){ st['c'+i]=1; F.sparks(st,x1,y1,8,['#ffffff','#96ffbe','#f2c14e'],40); } }
    F.runParts(g,st,dt); } };

/* 定身符 — a talisman flies up and sticks; a bagua ring and chains of light lock the beast in place */
SkillFx.tianji={ dur:1.7, hit:.5,
  draw(g,t,st){ const F=SkillFx, dt=F.dt(st,t), sx=st.W/2, sy=st.by-10;
    F.flash(g,st,Math.min(.3,t)*(t<1.4?1:Math.max(0,(1.7-t)*3.3)),'rgba(20,10,40,A)');
    const u=Math.min(1,t/.45), x=sx+(st.ex-sx)*u, y=sy+(st.ey-6-sy)*u, wob=u<1?Math.sin(t*30)*2:0;
    // the talisman: yellow paper, red script
    const tw=8, th=14; F.r(g,x-tw/2+wob,y-th/2,tw,th,'#f2d27a'); F.r(g,x-tw/2+wob,y-th/2,tw,1,'#c83c28'); F.r(g,x-tw/2+wob,y+th/2-1,tw,1,'#c83c28');
    for(let i=0;i<4;i++) F.r(g,x-1+wob+(i%2?1:-1),y-th/2+3+i*2.4,i%2?2:3,1,'#b0281c'); F.r(g,x+wob,y-th/2+2,1,th-4,'#b0281c');
    if(u>=1){ const k=(t-.45)/1.25;
      if(!st.stuck){ st.stuck=1; F.sparks(st,st.ex,st.ey,16,['#e8d0ff','#a070ff','#f2d27a'],40); }
      // bagua ring: eight trigrams on a turning circle
      const R=Math.min(st.R*1.5,6+k*st.R*4), rot=t*1.6, al=k<.8?1:Math.max(0,1-(k-.8)/.2);
      F.ring(g,st.ex,st.ey,R,`rgba(180,140,255,${al})`); F.ring(g,st.ex,st.ey,R-3,`rgba(180,140,255,${al*.5})`,3);
      for(let i=0;i<8;i++){ const a=rot+i*Math.PI/4, cx=st.ex+Math.cos(a)*(R+5), cy=st.ey+Math.sin(a)*(R+5);
        for(let j=0;j<3;j++){ const broken=((i>>j)&1); if(broken){ F.r(g,cx-3,cy-2+j*2,2,1,`rgba(230,210,255,${al})`); F.r(g,cx+1,cy-2+j*2,2,1,`rgba(230,210,255,${al})`); } else F.r(g,cx-3,cy-2+j*2,6,1,`rgba(230,210,255,${al})`); } }
      // chains of light from the four corners
      const ch=Math.min(1,(t-.6)/.3); if(ch>0) for(const [cx,cy] of [[0,0],[st.W,0],[0,st.H],[st.W,st.H]]){ const n=24; for(let i=0;i<n*ch;i++){ if(i%3===2) continue; const q=i/n; F.r(g,cx+(st.ex-cx)*q,cy+(st.ey-cy)*q,1,1,`rgba(200,170,255,${al*.85})`); } } }
    F.runParts(g,st,dt); } };

// the sect move waits for its animation, then lands as before (the self-test skips the show)
{ const _act=Battle.act; Battle.act=function(a){ const s=Battle.s;
    if(a==='sect'&&s&&!s.over&&!s.busy&&!s.dead&&!s.charmed&&S.sect&&SECTS[S.sect]&&S.mp>=SECTS[S.sect].skill.mp&&!Dodge.auto){
      s.busy=true; $('#battle').classList.add('fxing'); Battle.log(SECTS[S.sect].skill.name+'！');
      SkillFx.play(S.sect, ()=>{ $('#battle')&&$('#battle').classList.remove('fxing'); if(Battle.s!==s) return; s.busy=false; _act.call(Battle,a); }); return; }
    return _act.call(Battle,a); }; }
