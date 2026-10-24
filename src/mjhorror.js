/* ============================================================
   山海问道 · 秘境的不安 — small things that pile up, night after night:
   claw prints in the mud by the tents (from the second day), a torn flag and slashed tent cloth (third day),
   the campfire burning lower, a vast winged shadow sliding once across the fog, whispers in the 雾林,
   and a lamp in 大师兄's tent throwing his seated shadow on the cloth — its neck now and then bending wrong.
   ============================================================ */
Object.assign(SPR, {
  mj_tent_torn:['..........NN..........','.........NttN.........','........NtkkTN........','.......NttkkTTN.......','......NtttttkkTN......','.....NttktttkTTTN.....','....NttttktkkkTTN.....','...NttttttkkkTTTTN....','..NtttttttttkkkkTTTN..','.NttttttttttkkkkkTTTN.','NNNNNNNNNNNNNNNNNNNNNN'],
  mj_fire_low:['................','................','................','................','......o.........','.....oro........','....orRro.......','..nNnnnnnNnnn...','.NnnNnnnNnnnN...','..NNNNNNNNNN....'],
  mj_flagtorn:['.nrr.r....','.nrR......','.nr.r.....','.n........','.n........','.n........','.n........','.n........','.n........','.N........','eeee......'],
  mj_claw:['N...N...N.','.N...N...N','..N...N..N','..N...N...','...N...N..'],
});
const MJH = {
  n:()=>S&&S.c2?S.c2.night||0:0,
  live:()=>!!(RT.map&&RT.mapId&&RT.mapId.startsWith('mj_')&&S&&S.c2&&!S.flags.lu_gone),
  // claw prints: drawn into the ground pass so people walk over them
  CLAWS:[[6,6],[8,6],[9,7],[11,7],[13,6],[14,5],[16,6],[5,10]],
  // a whisper drifting near you in the 雾林 on the third day
  WHISPERS:['……好香……','……善人……','……再近一点……','……饿……','……你也行善么……','……血……'],
  wh:null, whT:6, shadow:null,
};
{ const _dg=Life.drawGround; Life.drawGround=function(g,ox,oy,T,Z){ _dg.call(Life,g,ox,oy,T,Z);
    if(RT.mapId==='mj_camp'&&MJH.n()>=1){ const sp=sprite('mj_claw'); g.globalAlpha=.55; for(const [x,y] of MJH.CLAWS){ g.drawImage(sp, ox+x*T+3*Z, oy+y*T+8*Z, sp.width*Z, sp.height*Z); } g.globalAlpha=1; } }; }
{ const _r=render; let last=performance.now(); render=function(){ _r(); const now=performance.now(), dt=Math.min(.05,(now-last)/1000); last=now;
    if(!MJH.live()) return;
    const g=ctx, Z=RT.scale*RT.dpr, T=TILE*Z, ox=Math.round(-RT.cam.x*Z), oy=Math.round(-RT.cam.y*Z), n=MJH.n(), p=S.c2.p&&S.c2.p.mj;
    // 大师兄's tent on the third day: a lamp inside, and his shadow sitting very still
    if(RT.mapId==='mj_camp'&&n>=2){ const tx=ox+7.5*T, ty=oy+4.6*T;
      const gr=g.createRadialGradient(tx,ty,0,tx,ty,T*.9); gr.addColorStop(0,'rgba(255,190,110,.35)'); gr.addColorStop(1,'rgba(255,190,110,0)'); g.fillStyle=gr; g.fillRect(tx-T,ty-T,T*2,T*2);
      const tilt=(RT.t%7)>6.2?Math.sin((RT.t%7-6.2)/.8*Math.PI)*.9:0;   // every few seconds the neck bends — too far
      g.save(); g.translate(tx,ty+T*.25); g.fillStyle='rgba(20,14,12,.55)'; g.beginPath(); g.ellipse(0,0,T*.22,T*.28,0,0,7); g.fill();
      g.translate(0,-T*.3); g.rotate(tilt); g.beginPath(); g.arc(0,-T*.12,T*.13,0,7); g.fill(); g.restore(); }
    // whispers in the 雾林 on the third day
    if(RT.mapId==='mj_wood'&&n>=2&&!UI.busy()){ MJH.whT-=dt; if(!MJH.wh&&MJH.whT<=0){ const a=Math.random()*Math.PI*2; MJH.wh={text:MJH.WHISPERS[Math.random()*MJH.WHISPERS.length|0], dx:Math.cos(a)*1.6, dy:Math.sin(a)*1.1-.6, t:0}; MJH.whT=8+Math.random()*7; }
      if(MJH.wh){ const w=MJH.wh; w.t+=dt; const a=w.t<.8?w.t/.8:w.t>2.4?Math.max(0,1-(w.t-2.4)/.8):1; if(w.t>3.2) MJH.wh=null; else {
        g.font=`${Math.round(7*Z)}px "STKaiti","KaiTi",serif`; g.textAlign='center'; g.fillStyle=`rgba(60,40,40,${a*.6})`; g.fillText(w.text, ox+(RT.fx+.5+w.dx)*T, oy+(RT.fy+w.dy)*T-w.t*Z*3); } } }
    // a vast winged shadow slides once across the fog on the third day (camp or wood)
    if(n>=2&&p&&!p.shadow&&!UI.busy()&&!RT.paused){ p.stay=(p.stay||0)+dt; if(p.stay>7){ p.shadow=true; MJH.shadow={t:0}; for(let i=0;i<6;i++) setTimeout(()=>Sound.dig(),i*160); } }
    if(MJH.shadow){ const s=MJH.shadow; s.t+=dt; const u=s.t/2.6; if(u>=1) MJH.shadow=null; else {
      const W=cv.width, H=cv.height, x=-W*.6+u*W*2.2, y=-H*.15+u*H*.9, span=W*.9, flap=Math.sin(s.t*5)*.12;
      g.save(); g.translate(x,y); g.rotate(.5); g.fillStyle='rgba(8,8,16,.42)';
      g.beginPath(); g.moveTo(0,0); g.quadraticCurveTo(-span*.3,-span*(.18+flap),-span*.55,-span*.05); g.quadraticCurveTo(-span*.3,span*.02,0,span*.06);
      g.quadraticCurveTo(span*.3,span*.02,span*.55,-span*.05); g.quadraticCurveTo(span*.3,-span*(.18+flap),0,0); g.fill();
      g.beginPath(); g.ellipse(0,span*.03,span*.06,span*.14,0,0,7); g.fill(); g.restore(); } }
  }; }
