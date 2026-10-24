/* ============================================================
   山海问道 · 秘境的不安 — small things that pile up, night after night:
   claw prints in the mud by the tents (from the second day), a torn flag and slashed tent cloth (third day),
   the campfire burning lower, a vast winged shadow sliding once across the fog, whispers in the 雾林,
   and a lamp in 大师兄's tent throwing his seated shadow on the cloth — its neck now and then bending wrong.
   ============================================================ */
// tents: bigger (two tiles wide), a light and a shaded side, a seam and a dark doorway; the torn one has three claw slashes
function tentRows(torn){ const W=32, H=20, rows=[];
  for(let y=0;y<H;y++){ const hw=Math.round((y+1)/H*15.5), r=[];
    for(let x=0;x<W;x++){ const d=x-15.5; let c='.';
      if(Math.abs(d)<=hw+.5){ c=d<0?'t':'T';
        if(Math.abs(Math.abs(d)-hw)<1) c='N';                                    // the edges
        if(y>=8){ const dw=(y-8)/(H-8)*5.5; if(Math.abs(d)<=dw) c='k'; }       // the doorway
        else if(Math.abs(d)<.6) c='T';                                           // the seam above it
        if(y===H-1) c='N'; }
      r.push(c); }
    rows.push(r); }
  rows[0][15]='N'; rows[0][16]='N';
  if(torn) for(let i=0;i<3;i++) for(let k=0;k<8;k++){ const x=6+i*3+Math.floor(k/2), y=6+k; if(rows[y]&&rows[y][x]&&rows[y][x]!=='.'&&rows[y][x]!=='N') rows[y][x]='k'; }
  return rows.map(r=>r.join('')); }
Object.assign(SPR, {
  mj_tent:tentRows(false), mj_tent_torn:tentRows(true),
  mj_fire_low:['................','................','................','................','......o.........','.....oro........','....orRro.......','..nNnnnnnNnnn...','.NnnNnnnNnnnN...','..NNNNNNNNNN....'],
  mj_flagtorn:['.nrr.r....','.nrR......','.nr.r.....','.n........','.n........','.n........','.n........','.n........','.n........','.N........','eeee......'],
  mj_claw:['N...N...N.','.N...N...N','..N...N..N','..N...N...','...N...N..'],
});
for(const k of ['mj_tent','mj_tent_torn']) delete SPRC[k];
// the seated shadow on the tent cloth: a body with slumped shoulders and knees, and a head with a topknot that can tilt on its own
const SIL_BODY=['...kkkk...','.kkkkkkkk.','kkkkkkkkkk','kkkkkkkkkk','kkkkkkkkkk','.kkkkkkkk.','kkkkkkkkkk'];
const SIL_HEAD=['..kk..','.kkkk.','..kk..','.kkkk.','kkkkkk','kkkkkk','.kkkk.'];
function silCanvas(rows){ const c=document.createElement('canvas'); c.width=rows[0].length; c.height=rows.length; const g=c.getContext('2d'); g.fillStyle='#1a0f0c';
  rows.forEach((r,y)=>[...r].forEach((ch,x)=>{ if(ch!=='.') g.fillRect(x,y,1,1); })); return c; }
const MJH = {
  n:()=>S&&S.c2?S.c2.night||0:0,
  live:()=>!!(RT.map&&RT.mapId&&RT.mapId.startsWith('mj_')&&S&&S.c2&&!S.flags.lu_gone),
  CLAWS:[[6,6],[8,6],[9,7],[11,7],[13,6],[14,5],[16,6],[5,10]],
  WHISPERS:['……好香……','……善人……','……再近一点……','……饿……','……你也行善么……','……血……'],
  wh:null, whT:6, shadow:null,
  body:silCanvas(SIL_BODY), head:silCanvas(SIL_HEAD),
  // the shadow of a winged beast seen from below, drawn small and blown up with smoothing so its edges are soft
  beast(flap){ const c=MJH.bc||(MJH.bc=document.createElement('canvas')); c.width=260; c.height=170; const g=c.getContext('2d'); g.clearRect(0,0,260,170); g.fillStyle='#0a0a12'; g.strokeStyle='#0a0a12'; g.lineCap='round';
    g.save(); g.translate(130,74); const up=flap*14;
    for(const s of [-1,1]){
      const wx=s*98, wy=-26-up;                                                         // the wrist
      g.beginPath(); g.moveTo(s*8,-16); g.bezierCurveTo(s*38,-34-up*.4, s*70,-40-up*.8, wx,wy);   // the leading edge
      for(let k=0;k<6;k++){ const u=(k+1)/6, tx=wx-s*u*82, ty=wy+24-u*4+(k%2?3:0); g.quadraticCurveTo(tx+s*6,ty+12, tx,ty+2); }   // the secondaries, scalloped
      g.quadraticCurveTo(s*14,10, s*8,4); g.closePath(); g.fill();
      for(let k=0;k<5;k++){ const a=(-.55+k*.28)*s, len=40-k*3, base=Math.atan2(-6,s*1), ang=(s>0?0:Math.PI)+a-.25*s;   // the primaries, spread like fingers
        const ex=wx+Math.cos(ang)*len, ey=wy+Math.sin(ang)*len-4;
        g.beginPath(); g.moveTo(wx-s*2,wy-4); g.quadraticCurveTo((wx+ex)/2-s*3,(wy+ey)/2-4, ex,ey); g.quadraticCurveTo((wx+ex)/2+s*2,(wy+ey)/2+5, wx-s*4,wy+8); g.fill(); } }
    g.beginPath(); g.ellipse(0,8,11,34,0,0,7); g.fill();                                 // a long tiger's body
    g.beginPath(); g.ellipse(0,-32,9,10,0,0,7); g.fill();                                // the head
    for(const s of [-1,1]){ g.beginPath(); g.arc(s*6,-40,2.5,0,7); g.fill();              // small round ears
      g.lineWidth=6; g.beginPath(); g.moveTo(s*8,-12); g.quadraticCurveTo(s*15,-6,s*14,4); g.stroke();      // forelegs tucked under
      g.lineWidth=2; for(let k=-1;k<=1;k++){ g.beginPath(); g.moveTo(s*14,4); g.lineTo(s*14+k*2.5,9); g.stroke(); }          // claws
      g.lineWidth=7; g.beginPath(); g.moveTo(s*10,28); g.quadraticCurveTo(s*18,36,s*16,48); g.stroke(); }    // hind legs
    g.lineWidth=7; g.beginPath(); g.moveTo(0,36); g.bezierCurveTo(16,54,-18,64,6,82); g.stroke();             // a thick tail
    g.lineWidth=4; g.beginPath(); g.moveTo(6,82); g.lineTo(10,90); g.stroke();
    g.restore(); return c; },
};
{ const _dg=Life.drawGround; Life.drawGround=function(g,ox,oy,T,Z){ _dg.call(Life,g,ox,oy,T,Z);
    if(RT.mapId==='mj_camp'&&MJH.n()>=1){ const sp=sprite('mj_claw'); g.globalAlpha=.55; for(const [x,y] of MJH.CLAWS){ g.drawImage(sp, ox+x*T+3*Z, oy+y*T+8*Z, sp.width*Z, sp.height*Z); } g.globalAlpha=1; } }; }
{ const _r=render; let last=performance.now(); render=function(){ _r(); const now=performance.now(), dt=Math.min(.05,(now-last)/1000); last=now;
    if(!MJH.live()) return;
    const g=ctx, Z=RT.scale*RT.dpr, T=TILE*Z, ox=Math.round(-RT.cam.x*Z), oy=Math.round(-RT.cam.y*Z), n=MJH.n(), p=S.c2.p&&S.c2.p.mj;
    // 大师兄's tent on the third day: lamplight on the cloth, and his shadow sitting very still
    if(RT.mapId==='mj_camp'&&n>=2){ const o=RT.ents.find(e=>e.act==='mjtent2'); if(o){ const sp=sprite(o.spr), w=sp.width*Z, dx=Math.round(ox+o.x*T+(T-w)/2), dy=Math.round(oy+o.y*T+T-sp.bottom*Z);
      const ax=dx+(1+16)*Z, ay=dy+2*Z, by=dy+19*Z, half=15*Z;
      g.save(); g.beginPath(); g.moveTo(ax,ay); g.lineTo(ax+half,by); g.lineTo(ax-half,by); g.closePath(); g.clip();
      const flick=.04*Math.sin(RT.t*11)+.03*Math.sin(RT.t*17);                        // the lamp flickers
      g.fillStyle=`rgba(236,170,92,${.82+flick})`; g.fillRect(ax-half,ay,half*2,by-ay);   // the flap is shut; the cloth glows
      const gr=g.createRadialGradient(ax-4*Z,by-7*Z,0,ax-4*Z,by-7*Z,13*Z); gr.addColorStop(0,'rgba(255,236,170,.75)'); gr.addColorStop(1,'rgba(255,200,120,0)'); g.fillStyle=gr; g.fillRect(ax-half,ay,half*2,by-ay);
      const bx=ax, bw=MJH.body.width*Z, bh=MJH.body.height*Z, top=by-bh;   // under the peak, where the tent is tallest
      g.globalAlpha=.78; g.imageSmoothingEnabled=false; g.drawImage(MJH.body, bx-bw/2, top, bw, bh);
      const ph=RT.t%7, tilt=ph>5.9?Math.sin((ph-5.9)/1.1*Math.PI)*.85:0;               // every few seconds the neck bends — too far
      g.translate(bx, top+1*Z); g.rotate(tilt); const hw=MJH.head.width*Z, hh=MJH.head.height*Z; g.drawImage(MJH.head, -hw/2, -hh+1*Z, hw, hh);
      g.restore(); } }
    // whispers in the 雾林 on the third day: crooked brush characters that tremble
    if(RT.mapId==='mj_wood'&&n>=2&&!UI.busy()){ MJH.whT-=dt; if(!MJH.wh&&MJH.whT<=0){ const a=Math.random()*Math.PI*2; MJH.wh={text:MJH.WHISPERS[Math.random()*MJH.WHISPERS.length|0], dx:Math.cos(a)*1.6, dy:Math.sin(a)*1.1-.6, t:0, seed:Math.random()*9}; MJH.whT=8+Math.random()*7; }
      if(MJH.wh){ const w=MJH.wh; w.t+=dt; const a=w.t<.8?w.t/.8:w.t>2.6?Math.max(0,1-(w.t-2.6)/.8):1; if(w.t>3.4) MJH.wh=null; else {
        const chars=[...w.text], size=Math.round(11*Z), step=size*.82, cx=ox+(RT.fx+.5+w.dx)*T, cy=oy+(RT.fy+w.dy)*T-w.t*Z*3;
        g.font=`bold ${size}px "Ma Shan Zheng","STKaiti","KaiTi",serif`; g.textAlign='center'; g.textBaseline='middle';
        chars.forEach((ch,i)=>{ const x=cx+(i-(chars.length-1)/2)*step, y=cy+Math.sin(RT.t*9+i*1.3+w.seed)*1.4*Z+((i*7+w.seed*3)%5-2)*Z, rot=((i*13+w.seed*5)%7-3)*.07+Math.sin(RT.t*6+i)*.06;
          g.save(); g.translate(x,y); g.rotate(rot); g.fillStyle=`rgba(30,4,4,${a*.35})`; g.fillText(ch,1.5*Z,1.5*Z); g.fillStyle=`rgba(96,22,18,${a*.85})`; g.fillText(ch,0,0); g.restore(); }); } } }
    // a vast winged shadow slides once across the fog on the third day (camp or wood)
    if(n>=2&&p&&!p.shadow&&!UI.busy()&&!RT.paused){ p.stay=(p.stay||0)+dt; if(p.stay>7){ p.shadow=true; MJH.shadow={t:0}; for(let i=0;i<6;i++) setTimeout(()=>Sound.dig(),i*160); } }
    if(MJH.shadow){ const s=MJH.shadow; s.t+=dt; const u=s.t/3; if(u>=1) MJH.shadow=null; else {
      const W=cv.width, H=cv.height, x=-W*.5+u*W*2, y=-H*.25+u*H*1.1, sc=W*1.3/260, img=MJH.beast(Math.sin(s.t*3.2));
      const fade=u<.15?u/.15:u>.85?(1-u)/.15:1;
      g.save(); g.translate(x,y); g.rotate(Math.atan2(H*1.1,W*2)+Math.PI/2); g.globalAlpha=.42*fade; g.imageSmoothingEnabled=true;
      g.drawImage(img,-130*sc,-74*sc,260*sc,170*sc); g.restore(); } }
  }; }

/* ---------- CG: lifting the tent flap on the third night ----------
   Ink-wash night seen through the tent's opening: pines in the fog, a moon behind it, the camp fire nearly out.
   大师兄, from behind, barefoot and leaning wrong, walks away north and is swallowed by the fog. */
MJH.peekCG=function(){
  MJ.dark(false); MJH.peekLine=0; MJH.peekU=0; MJH.peekOn=true;
  PixCG.open({ ink:(g,W,H,R)=>{
      Land.paper(g,W,H,R,'#c9ccd0'); Land.sky(g,W,H,['rgba(8,12,26,.94)','rgba(22,28,48,.86)','rgba(44,50,66,.7)']);
      Land.orb(g,W*.64,H*.17,Math.min(W,H)*.06,'#e6e4d6',4);
      Land.mist(g,W,H,H*.3,H*.16,.22);
      for(let i=0;i<9;i++){ const x=W*(.04+i*.12)+(R()-.5)*W*.05; Land.pine(g,x,H*(.6+R()*.05),H*(.32+R()*.14),R,.42+R()*.2); }
      Land.mist(g,W,H,H*.55,H*.2,.35);
      Land.ground(g,W,H,H*.62,.75,'#141820');
      for(let i=0;i<14;i++) Land.grass(g,W*R(),H*(.86+R()*.1),H*.05,3,R,.5,'#1c222a');
      Land.orb(g,W*.12,H*.9,Math.min(W,H)*.012,'#ff9a4a',5);                       // the fire, almost out
    }, cast:[], title:'雾中背影', small:'第二章 · 秘境', seed:313 });
  const c=PixCG.cur; let last=0; c.front=(g,W,H,fp,t)=>{
    // he walks as the story is told: each line takes him a little further; on the last he is gone
    const goal=[0,.08,.26,.4,.52,.68,1][Math.min(6,MJH.peekLine)], dt=Math.max(0,t-last); last=t; MJH.peekU+=(goal-MJH.peekU)*Math.min(1,dt*1.2);
    const u=MJH.peekU, ease=u, bend=MJH.peekLine>=5?-.34:-.12;
    // bare footprints, fresh in the mud, leading away
    g.fillStyle='rgba(10,8,8,.55)'; for(let k=0;k<7;k++){ const v=k/7; if(v>ease) break; const x=W*(.48+v*.07)+(k%2?fp*3:-fp*3), y=H*(.97-v*.32); g.beginPath(); g.ellipse(x,y,fp*(2.4-v*1.4),fp*(1.2-v*.6),0,0,7); g.fill(); }
    // 大师兄 from behind: walking, smaller and fainter the further he goes; his body leans and his head hangs to one side
    const sp=cgChibi(LOOK_LU, Math.floor(t*2.2)%2?'walk':'stand', 'normal', null, null, true), sc=fp*(1.15-ease*.72), w=sp.width*sc, h=sp.height*sc;
    const x=W*(.5+ease*.06), y=H*(.86-ease*.26), a=1-Math.max(0,(u-.7)/.3);
    if(a>0){ g.save(); g.globalAlpha=a*.92; g.translate(x,y); g.rotate(bend+Math.sin(t*1.3)*.03); g.imageSmoothingEnabled=false; g.drawImage(sp,-w/2,-h,w,h); g.restore(); }
    // the fog closes in front of him
    for(let k=0;k<4;k++){ const yy=H*(.55+k*.08), al=(.12+ease*.4)*(1-k*.18), drift=Math.sin(t*.4+k)*W*.06; const gr=g.createRadialGradient(W*.55+drift,yy,0,W*.55+drift,yy,W*.6); gr.addColorStop(0,`rgba(214,218,224,${al})`); gr.addColorStop(1,'rgba(214,218,224,0)'); g.fillStyle=gr; g.fillRect(0,yy-H*.2,W,H*.4); }
    // the tent flap you are holding open: dark cloth framing the view
    for(const s of [-1,1]){ const x0=s<0?0:W, gr=g.createLinearGradient(x0,0,W/2,0); gr.addColorStop(0,'rgba(30,22,16,.98)'); gr.addColorStop(.6,'rgba(70,54,36,.9)'); gr.addColorStop(1,'rgba(70,54,36,0)');
      g.fillStyle=gr; g.beginPath(); g.moveTo(x0,0); g.lineTo(W/2+s*W*.22,0); g.quadraticCurveTo(W/2+s*W*.3,H*.5, W/2+s*W*.38,H); g.lineTo(x0,H); g.closePath(); g.fill(); }
    const vg=g.createRadialGradient(W/2,H*.55,Math.min(W,H)*.25,W/2,H*.55,Math.max(W,H)*.75); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,.6)'); g.fillStyle=vg; g.fillRect(0,0,W,H); };
};
// the night-three peek opens the CG and closes it again before the dark returns
{ const s=SCRIPTS.mj_peek; s.unshift({run:()=>MJH.peekCG()}); s.push({run:()=>{ MJH.peekOn=false; PixCG.close(); MJ.dark(true); }}); }
{ const _l=UI.line; UI.line=function(){ if(MJH.peekOn) MJH.peekLine++; return _l.apply(UI,arguments); }; }
