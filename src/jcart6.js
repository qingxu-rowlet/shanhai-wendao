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
// painted in ink like the other chapter-3 pictures: the lane at night between two high plastered walls that run back to a
// far wall; the moon in the strip of sky; a red lantern hung out on a bracket from the left wall, its light pooled on
// the flagstones; washing on a line overhead; the red-headed wolf sitting up on the far wall's tiled cap, under the moon.
// The walls stop at the ground line, so you (left), 萧烬 (crouched, right) and the dog all stand on the flagstones.
C3A.xiangPaint=(g,W,H,R)=>{ const GY=H*.84, M=Math.min(W,H);
  C3INK.night(g,W,H,R,'#cfcac0');
  Land.orb(g,W*.5,H*.09,M*.05,'#f4efda',5);
  g.save(); g.beginPath(); g.rect(W*.3,0,W*.4,H*.3); g.clip(); C3INK.roofs(g,W*.4,H*.255,W*.05,2,R,.5,true); g.translate(W*.66,0); C3INK.roofs(g,W*.34,H*.255,W*.05,2,R,.5,true); g.restore();   // roofs beyond the far wall, either side, the middle left open to the sky
  // the far wall across the end of the lane, a door in it, a little light under the door
  g.fillStyle='#3a3842'; g.fillRect(W*.34,H*.3,W*.32,GY-H*.3); g.fillStyle=SUMI.ink(.5); g.fillRect(W*.34,H*.3,W*.32,GY-H*.3);
  // its coping: a tiled cap you can see the top of, moonlit
  g.fillStyle=SUMI.ink(.95); g.fillRect(W*.33,H*.285,W*.34,H*.022); g.fillStyle='rgba(205,210,232,.45)'; g.fillRect(W*.33,H*.283,W*.34,H*.006);
  for(let i=0;i<=24;i++){ const x=W*.33+W*.34*i/24; g.fillStyle=SUMI.ink(1); g.fillRect(x,H*.29,Math.max(1,W*.002),H*.017); }
  g.fillStyle=SUMI.ink(.85); g.fillRect(W*.47,H*.5,W*.06,GY-H*.5); g.fillStyle='rgba(255,190,110,.6)'; g.fillRect(W*.47,GY-H*.008,W*.06,H*.006);
  // the two side walls: tops run up and out toward us, their feet sit on the ground line
  for(const [x0,x1,t0,t1,c] of [[-W*.02,W*.34,H*.04,H*.3,'#34323a'],[W*1.02,W*.66,H*.03,H*.3,'#2c2a32']]){ g.fillStyle=c; g.beginPath(); g.moveTo(x0,t0); g.lineTo(x1,t1); g.lineTo(x1,GY); g.lineTo(x0,GY+H*.02); g.closePath(); g.fill(); }   // solid under the wash
  C3INK.wall(g,-W*.02,W*.34,H*.04,H*.3,GY+H*.02,GY,.82,R);
  C3INK.wall(g,W*1.02,W*.66,H*.03,H*.3,GY+H*.02,GY,.88,R);
  // moonlight down the middle of the lane, the flagstones
  Land.ground(g,W,H,GY,.6);
  g.fillStyle=SUMI.ink(.72); g.fillRect(0,GY,W,H-GY);
  { const mg=g.createLinearGradient(0,GY,0,H); mg.addColorStop(0,'rgba(215,220,240,.18)'); mg.addColorStop(1,'rgba(215,220,240,.06)'); g.fillStyle=mg; g.beginPath(); g.moveTo(W*.44,GY); g.lineTo(W*.56,GY); g.lineTo(W*.7,H); g.lineTo(W*.3,H); g.closePath(); g.fill(); }
  for(let r=0;r<5;r++){ const y=GY+(H-GY)*(r+1)/6; brush(g,[[0,y],[W,y]],1,.22); for(let k=0;k<14;k++){ const x=W*(k+(r%2)*.5)/14; brush(g,[[x,y-(H-GY)/6],[x+W*.004,y]],1,.18); } }
  // the lantern: an iron bracket out from the left wall, the lantern hanging from it, its glow on the wall and the ground
  { const wx=W*.2, wy=H*.36, lx=W*.27, ly=H*.47, r=M*.035;
    const gl=g.createRadialGradient(lx,ly,0,lx,ly,W*.22); gl.addColorStop(0,'rgba(255,170,90,.42)'); gl.addColorStop(1,'rgba(255,170,90,0)'); g.fillStyle=gl; g.fillRect(0,0,W,H);
    const pool=g.createRadialGradient(lx,GY+H*.06,0,lx,GY+H*.06,W*.2); pool.addColorStop(0,'rgba(255,170,90,.32)'); pool.addColorStop(1,'rgba(255,170,90,0)'); g.save(); g.translate(lx,GY+H*.06); g.scale(1,.35); g.translate(-lx,-(GY+H*.06)); g.fillStyle=pool; g.fillRect(lx-W*.2,GY+H*.06-W*.2,W*.4,W*.4); g.restore();
    g.strokeStyle=SUMI.ink(.95); g.lineWidth=Math.max(2,W*.004); g.beginPath(); g.moveTo(wx,wy); g.lineTo(lx+W*.01,wy-H*.005); g.moveTo(wx,wy+H*.04); g.lineTo(wx+W*.04,wy); g.stroke();
    C3INK.hangLantern(g,lx,ly,r); }
  // washing on a line across the lane, high up
  C3INK.washing(g,W*.1,H*.2,W*.88,H*.17,R);
  // the wolf sitting up on the far wall's cap, under the moon, head turned down toward the lane
  { const x=W*.56, y=H*.284; g.save(); g.shadowColor='rgba(225,230,250,.95)'; g.shadowBlur=H*.014; JD.wolf(g,x,y,H*.085,R); g.restore(); JD.wolf(g,x,y,H*.085,R); }
  // a broken basket and a stone by the walls' feet
  g.fillStyle=SUMI.ink(.8); g.beginPath(); g.ellipse(W*.06,GY+H*.03,W*.04,H*.025,0,0,Math.PI*2); g.fill(); brush(g,[[W*.025,GY+H*.02],[W*.095,GY+H*.02]],2,.9);
  Land.rock(g,W*.93,GY+H*.04,W*.07,H*.045,R,.75);
  Land.edge&&Land.edge(g,W,H); };
C3A.xiangCG=function(){
  const dog=JA6.dog();
  PixCG.open({ink:(g,W,H,R)=>C3A.xiangPaint(g,W,H,R),
    cast:[{who:'me', x:.16, pose:'stand', face:1},{look:LOOK_XIAO, x:.64, pose:'crouch', face:-1},{cv:dog, x:.53, y:.86, s:1.5, face:1}],
    title:'小巷', small:'第三章 · 京城', seed:7401}); };
