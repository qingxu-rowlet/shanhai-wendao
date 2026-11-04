/* ============================================================
   山海问道 · 第三章「京城」 · 城里的东西（二）：院子 — what a walled courtyard compound (四方馆) is built of: the white
   plastered compound wall with its grey tile coping, a gatehouse with open red doors and a plaque, a great old 槐树, a
   stone table set for 围棋 with four drum stools, sect banners in their own colours, potted plants, a 太湖石 rock, and a
   moon gate into a back courtyard.
   ============================================================ */
On.tile('Q',(g,R,v)=>{ // the wall's top: grey half-round tiles in a row, seen from above
  g.fillStyle='#4a4e56'; g.fillRect(0,0,16,16); for(let x=0;x<16;x+=4){ g.fillStyle='#5e646e'; g.fillRect(x,1,3,13); g.fillStyle='#7a828e'; g.fillRect(x,1,1,13); }
  g.fillStyle='#2e3238'; g.fillRect(0,14,16,2); },true,'jc_');
On.tile('R',(g,R,v)=>{ // the wall's face: white plaster, a grey band at the foot, the coping's shadow at the top
  g.fillStyle='#ece6da'; g.fillRect(0,0,16,16); g.fillStyle='rgba(0,0,0,.18)'; g.fillRect(0,0,16,3);
  for(let i=0;i<4;i++){ g.fillStyle='rgba(120,110,90,.12)'; g.fillRect(R()*14|0,3+R()*9|0,2,1); }
  g.fillStyle='#8a8478'; g.fillRect(0,12,16,4); g.fillStyle='#a8a296'; g.fillRect(0,12,16,1); },true,'jc_');
On.tile('S',(g,R,v)=>{ // a courtyard's swept brick floor, laid in a herringbone
  g.fillStyle='#a49a88'; g.fillRect(0,0,16,16);
  for(let y=0;y<16;y+=4) for(let x=0;x<16;x+=8){ const o=(y/4)%2?4:0; g.fillStyle='#b4aa96'; g.fillRect((x+o)%16,y,7,3); g.fillStyle='#8e8474'; g.fillRect((x+o+7)%16,y,1,3); }
  if(R()<.2){ g.fillStyle='rgba(90,110,70,.4)'; g.fillRect(R()*14|0,R()*14|0,2,1); } },false,'jc_');

const JA2={
  // the compound's gatehouse: a tiled roof on red posts, the two doors standing open, a black plaque with gold letters
  gate(){ return FineArt.paint(76,60,P=>{ const rf='#3a3e48', rfl='#565c68', rfk='#22252c', red='#9a2a22', redk='#6a1a14';
    P.rect(6,26,64,32,'#ece6da'); P.rect(6,52,64,6,'#8a8478');                                      // the gate's white walls
    P.rect(22,24,32,34,'#2a1810');                                                                    // the opening
    P.rect(18,22,4,36,red); P.rect(54,22,4,36,red);                                                    // posts
    P.rect(22,26,6,30,redk); P.rect(48,26,6,30,redk); for(let y=30;y<54;y+=5){ P.set(25,y,'#e8b84a'); P.set(51,y,'#e8b84a'); }   // the doors, swung open
    P.rect(24,48,28,10,'#4a3a2a');                                                                    // the threshold step inside
    P.rect(26,13,24,9,'#1a1614'); P.rect(27,14,22,7,'#22201c'); P.rect(25,12,26,1,'#c8a050'); P.rect(25,22,26,1,'#c8a050');   // plaque (letters drawn sharp)
    P.poly([[0,24],[10,12],[66,12],[76,24],[70,22],[6,22]],rf); P.poly([[8,20],[14,13],[62,13],[68,20]],rfl); P.rect(10,10,56,3,rfk);
    P.poly([[10,10],[6,6],[13,9]],rfk); P.poly([[66,10],[70,6],[63,9]],rfk); }); },
  huai(){ return FineArt.paint(80,84,P=>{ const tr='#4a3426', tm='#5e4432', tl='#7a5a40', sh='#2e4a28', g1='#3e6a34', g2='#548a44', g3='#6ea456', fl='#f0ead0', fl2='#d8d0a8';   // a great old 槐树
    // the trunk: thick, leaning, split into big limbs; roots gripping the ground
    P.cap(40,82,38,52,5.2,tr); P.cap(39,80,39,56,2,tm); P.cap(37,60,34,58,1,tl);
    for(const [x,y] of [[30,83],[50,83],[25,81],[55,81]]) P.cap(40,79,x,y,1.8,tr);
    P.cap(38,54,22,34,3,tr); P.cap(40,52,58,32,3,tr); P.cap(39,50,40,26,2.6,tr); P.cap(24,36,14,30,1.6,tr); P.cap(56,34,66,28,1.6,tr);
    // the canopy: clumps, dark first then lighter on top and to the left (the light comes from the upper left)
    const R=rng(83), clumps=[]; for(let k=0;k<34;k++){ const a=R()*Math.PI*2, d=Math.sqrt(R()), cx=40+Math.cos(a)*30*d, cy=28+Math.sin(a)*20*d; clumps.push([cx,cy,6+R()*5]); }
    for(const [x,y,r] of clumps) P.ell(x,y+1.5,r,r*.8,sh);
    for(const [x,y,r] of clumps) P.ell(x,y,r*.92,r*.72,g1);
    for(const [x,y,r] of clumps) P.ell(x-r*.25,y-r*.25,r*.62,r*.48,g2);
    for(const [x,y,r] of clumps) if(R()<.6) P.ell(x-r*.4,y-r*.4,r*.32,r*.26,g3);
    // a few gaps where the limbs show through
    for(const [x,y] of [[28,38],[52,36],[40,40]]){ P.ell(x,y,3,2,sh); P.set(x,y,tr); }
    // clusters of its small cream flowers hanging in the leaves
    for(let k=0;k<30;k++){ const [x,y,r]=clumps[k%clumps.length], fx=x+(R()-.5)*r, fy=y+(R()-.3)*r*.6; P.set(fx,fy,fl); P.set(fx+1,fy,fl2); P.set(fx,fy+1,fl2); } }); },
  chess(){ return FineArt.paint(44,28,P=>{ const st='#a8a294', sd='#7a756a';
    for(const [x,y] of [[6,20],[38,20],[22,26],[22,8]]){ P.ell(x,y,4,2.6,sd); P.rect(x-4,y-5,8,5,st); P.ell(x,y-5,4,2.4,'#c4beb0'); }   // drum stools
    P.ell(22,16,14,7,sd); P.rect(8,8,28,8,st); P.ell(22,8,14,6,'#c8c2b4');                                                  // the table
    for(let i=-3;i<=3;i++){ P.line(13,8+i*1.4,31,8+i*1.4,'#8a8478'); } for(let i=-4;i<=4;i++) P.line(22+i*2.2,4,22+i*2.2,12,'#8a8478');   // the board's lines
    for(const [x,y,c] of [[16,6,'#1a1a1a'],[20,9,'#f4f4f0'],[24,7,'#1a1a1a'],[27,10,'#f4f4f0'],[18,11,'#1a1a1a'],[29,6,'#f4f4f0']]) P.ell(x,y,1.2,1,c); }); },
  banner(col){ return FineArt.paint(20,52,P=>{ P.rect(3,2,2,48,'#5e3a20'); P.set(4,1,'#e8b84a'); P.rect(5,6,13,30,col); P.rect(5,6,13,2,'#e8b84a'); P.rect(5,34,13,2,'#e8b84a');
    P.poly([[5,36],[11,36],[8,42]],col); P.poly([[12,36],[18,36],[15,42]],col); P.rect(1,48,6,3,'#4a3a2a'); }); },
  pot(){ return FineArt.paint(20,26,P=>{ P.ell(10,22,7,3,'#5a3a24'); P.rect(4,15,12,7,'#8a5a36'); P.ell(10,15,6,2,'#3a2418');
    for(const [x,y,r] of [[10,9,6],[6,11,4],[14,11,4],[10,5,4]]) P.ell(x,y,r,r*.8,'#4e8040'); P.ell(9,6,2.4,2,'#6aa050'); for(const [x,y] of [[7,8],[13,9],[10,4]]) P.set(x,y,'#e86060'); }); },
  rock(){ return FineArt.paint(30,34,P=>{ const a='#8a8a8e', b='#6a6a70', c='#a8a8ae';   // 太湖石: a tall pitted rock
    P.poly([[6,32],[4,22],[8,12],[6,4],[14,1],[20,6],[24,14],[22,22],[26,32]],a); P.poly([[8,24],[10,14],[14,8],[18,12],[16,22]],c);
    for(const [x,y,r] of [[12,10,2],[18,18,2.4],[10,24,1.8],[16,28,1.6]]) P.ell(x,y,r,r,b); P.rect(2,32,26,2,'#5a5a60'); }); },
  moongate(){ return FineArt.paint(48,44,P=>{ P.rect(0,4,48,40,'#ece6da'); P.rect(0,4,48,3,'#4a4e56'); P.rect(0,40,48,4,'#8a8478');
    P.ell(24,26,15,17,'#2a2a24'); P.ell(24,26,13,15,'#4e6a40'); P.ell(24,34,13,6,'#6a8a50'); for(let k=0;k<20;k++){ const a=k/20*Math.PI*2; P.set(24+Math.cos(a)*15,26+Math.sin(a)*17,'#a8a296'); } }); },
  futon(){ return FineArt.paint(18,12,P=>{ P.ell(9,7,8,4,'#8a6a3a'); P.ell(9,6,7,3,'#b08850'); for(let k=0;k<4;k++) P.ell(9,6,6-k*1.4,2.6-k*.6,k%2?'#c8a060':'#a8804c'); }); },
};
const SECT_COL={jian:'#3a6ea8', dan:'#3a8a5a', shou:'#a86a2a', tianji:'#6a4aa8'}, SECT_CH={jian:'剑', dan:'药', shou:'兽', tianji:'机'};
Object.assign(SPR,{jc_sgate:['x'], jc_huai:['x'], jc_chess:['x'], jc_pot:['x'], jc_rock:['x'], jc_moongate:['x'], jc_futon:['x']});
for(const k in SECT_COL){ SPR['jc_banner_'+k]=['x']; SPRC['jc_banner_'+k]=JA2.banner(SECT_COL[k]); }
Object.assign(SPRC,{jc_huai:JA2.huai(), jc_chess:JA2.chess(), jc_pot:JA2.pot(), jc_rock:JA2.rock(), jc_futon:JA2.futon()});
// the moon gate stands on the wall's tile at x 3; padded by 32px so its opening falls on x 4, the way through
{ const g0=JA2.moongate(), c=document.createElement('canvas'); c.width=32+g0.width; c.height=g0.height; c.getContext('2d').drawImage(g0,32,0); c.bottom=c.height; SPRC.jc_moongate=c; }
// the gatehouse stands on the wall's tile at x 13 (solid anyway); padded on the left by 48px so its middle falls on x 15
for(const dim of [0,1]){ const g0=JA2.gate(), c=document.createElement('canvas'); c.width=48+g0.width; c.height=g0.height; const g=c.getContext('2d'); if(dim) g.globalAlpha=.45; g.drawImage(g0,48,0); c.bottom=c.height; SPRC[dim?'jc_sgate_dim':'jc_sgate']=c; }
SPR.jc_sgate_dim=['x'];
