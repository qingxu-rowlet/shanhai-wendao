/* ============================================================
   山海问道 · 第三章「京城」 · 城里的东西（六）：小巷 — a lame yellow stray, a red-headed wolf sitting on a wall top, washing
   hung on a line across the lane, and the picture 「小巷」: a narrow lane at night between two high walls, a strip of
   moonlight down the middle, a young man in a plain robe crouched by the wall feeding a dog, a wolf above him on the
   wall, and you at the mouth of the lane.
   ============================================================ */
const JA6={
  dog(){ return FineArt.paint(20,16,P=>{ const c='#b8884a', d='#8a6234', l='#d8b07a';
    P.ell(10,15,7,1.2,'#00000030'); P.ell(10,9,6,3.2,c); P.ell(9,8,4,1.6,l);                        // body
    P.rect(5,11,2,4,d); P.rect(13,11,2,4,d); P.rect(8,11,2,4,c); P.rect(16,10,2,2,d); P.rect(17,9,1,2,d);   // legs; the back one held up
    P.ell(4,6,3,2.6,c); P.rect(1,6,3,2,c); P.set(1,6,'#2a1e1a'); P.set(4,5,'#2a1e1a'); P.rect(4,3,2,2,d);   // head, nose, eye, ear
    P.line(16,8,19,5,c); }); },                                                                        // tail
  wolf(){ return FineArt.paint(22,22,P=>{ const k='#14141c', r='#6a1814';
    P.ell(11,21,8,1.4,'#00000040'); P.poly([[5,21],[6,12],[10,8],[14,9],[16,14],[17,21]],k); P.poly([[16,20],[21,18],[20,16],[16,17]],k);   // sitting, its tail round its feet
    P.poly([[8,9],[10,3],[15,4],[17,7],[13,9]],r); P.poly([[10,4],[10,0],[12,3]],r); P.poly([[13,4],[14,0],[15,4]],r); P.set(13,5,'#f0d060'); }); },
};
Object.assign(SPR,{jc_dog:['x'], jc_wolfs:['x']}); Object.assign(SPRC,{jc_dog:JA6.dog(), jc_wolfs:JA6.wolf()});
// washing on a line across the lane
On.draw(({g,T,ox,oy})=>{ if(RT.mapId!=='jc_xiang') return; const Z=T/16;
  for(const [x0,x1,y] of [[3,9,20.2],[2,7,13.4]]){ const a=ox+x0*T, b=ox+x1*T, yy=oy+y*T; g.strokeStyle='rgba(30,24,20,.85)'; g.lineWidth=Math.max(1,Z*.6); g.beginPath(); g.moveTo(a,yy); g.quadraticCurveTo((a+b)/2,yy+T*.35,b,yy); g.stroke();
    for(let k=1;k<5;k++){ const u=k/5, x=a+(b-a)*u, sy=yy+T*.35*4*u*(1-u)*.5, sw=Math.sin(RT.t*1.2+k)*Z; g.fillStyle=['#c8c0b0','#5a6a8a','#a85a4a','#d8d0b8'][k%4]; g.fillRect(x-T*.22+sw,sy,T*.44,T*.5); g.fillStyle='rgba(0,0,0,.2)'; g.fillRect(x-T*.22+sw,sy+T*.42,T*.44,T*.08); } } });

/* ---------- 插画「小巷」 ---------- */
C3A.xiangCG=function(){
  const dog=JA6.dog();
  PixCG.open({ink:(g,W,H,R)=>{ g.fillStyle='#07080e'; g.fillRect(0,0,W,H);
      // the sky: a strip between the walls, the moon at its top
      const sg=g.createLinearGradient(0,0,0,H*.4); sg.addColorStop(0,'#141a30'); sg.addColorStop(1,'#232a48'); g.fillStyle=sg; g.beginPath(); g.moveTo(W*.36,0); g.lineTo(W*.64,0); g.lineTo(W*.56,H*.38); g.lineTo(W*.44,H*.38); g.closePath(); g.fill();
      g.fillStyle='#ece6cc'; g.beginPath(); g.arc(W*.53,H*.08,H*.05,0,7); g.fill(); const mg=g.createRadialGradient(W*.53,H*.08,0,W*.53,H*.08,H*.25); mg.addColorStop(0,'rgba(236,230,204,.25)'); mg.addColorStop(1,'rgba(236,230,204,0)'); g.fillStyle=mg; g.fillRect(0,0,W,H*.4);
      // the two walls, plastered, the coping dark, running away from us
      for(const side of [-1,1]){ g.fillStyle=side<0?'#2a2a32':'#33333c'; g.beginPath(); const xn=W*(.5+side*.06), xf=W*(.5+side*.5);
        g.moveTo(xn,H*.38); g.lineTo(xn,H*.66); g.lineTo(xf,H*1.02); g.lineTo(xf,0); g.lineTo(W*(.5+side*.14),0); g.closePath(); g.fill();
        g.strokeStyle='rgba(20,20,28,.9)'; g.lineWidth=Math.max(2,H*.012); g.beginPath(); g.moveTo(W*(.5+side*.14),0); g.lineTo(xn,H*.38); g.stroke();
        for(let k=0;k<30;k++){ const u=R(), x=xn+(xf-xn)*u, y=H*(.4+u*.5)*R(); g.fillStyle=`rgba(${120+R()*40|0},${120+R()*30|0},${130+R()*30|0},${.06+R()*.06})`; g.fillRect(x,y+H*.2,W*.01,H*.004); } }
      // the far end of the lane: another wall, a little lit
      { const fg=g.createLinearGradient(0,H*.38,0,H*.66); fg.addColorStop(0,'#2a2a36'); fg.addColorStop(1,'#1a1a22'); g.fillStyle=fg; g.fillRect(W*.44,H*.38,W*.12,H*.28); g.fillStyle='#14141a'; g.fillRect(W*.44,H*.38,W*.12,H*.02); }
      // the moonlight on the ground, down the middle
      g.fillStyle='#16161e'; g.beginPath(); g.moveTo(W*.44,H*.66); g.lineTo(W*.56,H*.66); g.lineTo(W*1.02,H*1.02); g.lineTo(-W*.02,H*1.02); g.closePath(); g.fill();
      g.fillStyle='rgba(200,206,236,.12)'; g.beginPath(); g.moveTo(W*.47,H*.66); g.lineTo(W*.53,H*.66); g.lineTo(W*.66,H); g.lineTo(W*.34,H); g.closePath(); g.fill();
      // a lantern on the left wall, its glow on the ground
      const lx=W*.3, ly=H*.42; g.strokeStyle='#14141a'; g.lineWidth=Math.max(1,W*.002); g.beginPath(); g.moveTo(lx-W*.04,ly-H*.05); g.lineTo(lx,ly-H*.02); g.lineTo(lx,ly); g.stroke(); g.fillStyle='#a8302a'; g.fillRect(lx-W*.012,ly,W*.024,H*.05); g.fillStyle='#e8b84a'; g.fillRect(lx-W*.012,ly,W*.024,H*.006); const lg=g.createRadialGradient(lx,ly+H*.2,0,lx,ly+H*.2,W*.25); lg.addColorStop(0,'rgba(255,170,90,.22)'); lg.addColorStop(1,'rgba(255,170,90,0)'); g.fillStyle=lg; g.fillRect(0,0,W,H);
      // the wolf on the right wall's top, sitting, looking down at us
      C3A.wolf(g,W*.605,H*.12,H*.11,-1,R); },
    cast:[{who:'me', x:.16, pose:'stand', face:1},{look:LOOK_XIAO, x:.64, pose:'crouch', face:-1},{cv:dog, x:.53, y:.86, s:1.5, face:1}],
    title:'小巷', small:'第三章 · 京城', seed:7401}); };
