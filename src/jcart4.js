/* ============================================================
   山海问道 · 第三章「京城」 · 城里的东西（四）：屋里 — the first room you walk into in the capital, 回春堂's front hall:
   a plank floor, plastered walls over a wooden wainscot, a wall of medicine drawers (百子柜) behind a long counter with
   a 戥子 and a mortar on it, the doctor's desk with its pulse pillow, a bench for the waiting, a clay stove with a pot
   simmering, an iron 药碾, and over the desk a plaque: 悬壶济世.
   ============================================================ */
On.tile('D',(g,R,v)=>{ // a plank floor, the boards running across, worn paler in places
  g.fillStyle='#8a5e3a'; g.fillRect(0,0,16,16); for(let y=0;y<16;y+=4){ g.fillStyle=(y/4)%2?'#946640':'#80563a'; g.fillRect(0,y,16,3); g.fillStyle='#5e3e24'; g.fillRect(0,y+3,16,1);
    const j=(R()*16|0); g.fillRect(j,y,1,3); } if(R()<.3){ g.fillStyle='rgba(255,230,190,.12)'; g.fillRect(R()*10|0,R()*12|0,5,2); } });
On.tile('K',(g,R,v)=>{ // the wall's plaster, a dark beam along its top
  g.fillStyle='#e8dcc4'; g.fillRect(0,0,16,16); g.fillStyle='#5e3a20'; g.fillRect(0,0,16,3); g.fillStyle='#7a4e2c'; g.fillRect(0,3,16,1);
  for(let i=0;i<3;i++){ g.fillStyle='rgba(140,120,90,.14)'; g.fillRect(R()*14|0,5+R()*9|0,2,1); } },true);
On.tile('L',(g,R,v)=>{ // the wall's foot: plaster above, a wooden wainscot, the floor's shadow
  g.fillStyle='#e8dcc4'; g.fillRect(0,0,16,6); g.fillStyle='#6a4428'; g.fillRect(0,6,16,10); g.fillStyle='#8a5a36'; g.fillRect(0,6,16,1);
  for(let x=0;x<16;x+=8){ g.fillStyle='#5a3820'; g.fillRect(x,7,1,9); g.fillStyle='#7a4e2e'; g.fillRect(x+2,9,4,5); } g.fillStyle='rgba(0,0,0,.25)'; g.fillRect(0,15,16,1); },true);
On.tile('M',(g,R,v)=>{ // the room's edge: the top of a wall, dark
  g.fillStyle='#2e2420'; g.fillRect(0,0,16,16); g.fillStyle='#3e322a'; g.fillRect(1,1,14,14); },true);

const JA4={
  // the 百子柜: a wall of little drawers, each with its slip of paper and a brass pull; jars along the top
  cabinet(){ return FineArt.paint(128,46,P=>{ const wd='#6a4024', wl='#8a5a36', wk='#4a2a16';
    P.rect(0,8,128,38,wk); P.rect(2,10,124,34,wd);
    for(let r=0;r<5;r++) for(let c=0;c<14;c++){ const x=4+c*8.8, y=12+r*6.2; P.rect(x,y,8,5.4,wl); P.rect(x,y,8,1,'#a8784a'); P.rect(x+2,y+1.4,4,2,'#efe6cc'); P.set(x+4,y+4,'#e8b84a'); }
    for(const [x,c] of [[10,'#e8e0d0'],[24,'#3a7a8a'],[40,'#c8a060'],[88,'#e8e0d0'],[104,'#5a6a4a'],[118,'#c8a060']]){ P.ell(x,6,4,4,c); P.rect(x-2,1,4,2,c); P.rect(x-3,8,6,1,'#00000040'); }
    P.rect(56,2,16,7,'#5e3a20'); P.rect(57,3,14,5,'#c8a050'); }); },
  // the long counter: dark front panels; on top a 戥子 (steelyard), a mortar, packets of herbs tied in paper
  counter(){ return FineArt.paint(112,30,P=>{ P.rect(0,10,112,20,'#4a2a16'); P.rect(0,8,112,4,'#8a5a36'); P.rect(0,8,112,1,'#b07a4c');
    for(let x=4;x<108;x+=18){ P.rect(x,14,14,12,'#5e3a20'); P.rect(x+1,15,12,10,'#6a4024'); }
    P.rect(18,1,1,8,'#3a2418'); P.line(10,3,30,2,'#3a2418'); P.ell(12,6,4,1.4,'#c8a050'); P.set(28,4,'#3a2418');   // 戥子
    P.ell(52,7,6,3,'#7a746a'); P.ell(52,6,5,2,'#5a554e'); P.line(54,1,57,6,'#8a5a36');                      // mortar and pestle
    for(const x of [72,80,88]){ P.rect(x,4,7,5,'#e8dcc4'); P.rect(x+3,4,1,5,'#b02820'); P.rect(x,6,7,1,'#b02820'); } }); },
  desk(){ return FineArt.paint(44,26,P=>{ P.rect(2,8,40,4,'#8a5a36'); P.rect(2,8,40,1,'#b07a4c'); P.rect(4,12,3,13,'#5e3a20'); P.rect(37,12,3,13,'#5e3a20'); P.rect(4,20,36,2,'#5e3a20');
    P.ell(14,7,5,2.4,'#c8413b'); P.ell(14,6,4,1.6,'#e05a4a');                                               // the pulse pillow
    P.rect(26,5,8,3,'#2a2420'); P.line(36,7,40,3,'#3a2418'); P.rect(24,6,1,1,'#f0f0f0'); }); },
  bench(){ return FineArt.paint(44,16,P=>{ P.rect(1,5,42,3,'#8a5a36'); P.rect(1,5,42,1,'#b07a4c'); for(const x of [4,38]) P.rect(x,8,3,7,'#5e3a20'); P.ell(22,15,18,1.4,'#00000030'); }); },
  stove(){ return FineArt.paint(24,30,P=>{ P.rect(3,12,18,17,'#8a6a4a'); P.rect(3,12,18,2,'#a88a68'); P.ell(12,22,4,3,'#2a1a10'); P.ell(12,23,3,2,'#e8702a'); P.ell(12,23.5,1.6,1,'#ffd060');
    P.ell(12,10,8,4,'#4a3a30'); P.ell(12,8,7,3,'#5e4e42'); P.rect(18,6,4,2,'#4a3a30'); P.ell(12,6,4,1.4,'#3a2a20'); }); },
  nian(){ return FineArt.paint(32,16,P=>{ P.poly([[1,8],[31,8],[26,15],[6,15]],'#4a4a50'); P.rect(3,8,26,2,'#2a2a30'); P.ell(16,7,6,6,'#5a5a62'); P.ell(16,7,1.6,1.6,'#2a2a30'); P.rect(6,6,20,1,'#7a5a3a'); }); },
  plaque(){ return FineArt.paint(64,18,P=>{ P.rect(0,0,64,18,'#c8a050'); P.rect(2,2,60,14,'#1a1614'); P.rect(3,3,58,12,'#22201c'); }); },
};
Object.assign(SPR,{hc_cabinet:['x'], hc_counter:['x'], hc_desk:['x'], hc_bench:['x'], hc_stove:['x'], hc_nian:['x'], hc_plaque:['x']});
Object.assign(SPRC,{hc_cabinet:JA4.cabinet(), hc_counter:JA4.counter(), hc_desk:JA4.desk(), hc_bench:JA4.bench(), hc_stove:JA4.stove(), hc_nian:JA4.nian(), hc_plaque:JA4.plaque()});
// steam from the pot on the stove
On.draw(({g,T,ox,oy})=>{ if(RT.mapId!=='jc_huichun') return; for(const o of RT.ents) if(o.spr==='hc_stove') for(let k=0;k<3;k++){ const u=((RT.t*.5+k/3)%1), x=ox+(o.x+.5)*T+Math.sin(RT.t*2+k*2)*T*.15, y=oy+(o.y-.4)*T-u*T*1.2;
  g.fillStyle=`rgba(255,255,255,${.35*(1-u)})`; g.beginPath(); g.arc(x,y,T*(.12+u*.18),0,7); g.fill(); } });
