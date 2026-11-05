/* ============================================================
   山海问道 · 第三章「京城」 · 城里的东西（八）：护城河边、醉月楼 — a round table lacquered red with wine cups on it, a
   folding screen painted with plum blossom, the stair to the upper floor, a little moored boat, and the river's stone
   embankment edge.
   ============================================================ */
const LOOK_QINGHE={g:'f',skin:1,hair:0,hairColor:0,style:'qun',cloth:2};   // 青禾: hair up high, a red skirt — nothing like 大师姐's long hair and white
On.tile('G',(g,R,v)=>{ // the embankment's edge: dressed stone, a line of moss where the water laps
  g.fillStyle='#8a847a'; g.fillRect(0,0,16,16); for(let x=0;x<16;x+=8){ g.fillStyle='#9a948a'; g.fillRect(x,1,7,6); g.fillRect(x+4,9,7,5); }
  g.fillStyle='#5a6a4a'; g.fillRect(0,14,16,2); },true,'jc_');
const JA8={
  table(){ return FineArt.paint(32,24,P=>{ P.ell(16,21,13,3,'#00000030'); for(const x of [6,26]) P.rect(x-1,12,2,9,'#5a1a14');
    P.ell(16,11,14,6,'#6a1a14'); P.ell(16,10,13,5,'#9a2a22'); P.ell(13,9,4,1.4,'#b04030');
    for(const [x,y] of [[11,9],[20,10],[16,8]]){ P.ell(x,y,1.6,1,'#e8e0d0'); P.set(x,y-1,'#f4f0e8'); } P.rect(17,5,3,5,'#e8e0d0'); P.rect(17,5,3,1,'#3a6a8a'); }); },   // cups, a wine jug
  screen(){ return FineArt.paint(40,34,P=>{ for(let k=0;k<4;k++){ const x=2+k*9; P.rect(x,2,9,30,'#5e3a20'); P.rect(x+1,3,7,26,'#efe6d0');
      P.line(x+1,26-k*2,x+7,12+k,'#4a3a30'); for(const [dx,dy] of [[3,14],[5,18],[2,21],[6,12]]) P.ell(x+dx,dy+k,1.2,1.2,'#d84a5a'); } P.rect(1,31,38,2,'#4a2a16'); }); },
  stairs(){ return FineArt.paint(32,40,P=>{ for(let k=0;k<8;k++){ P.rect(4+k*2,36-k*4,22-k*2,4,k%2?'#7a4a2a':'#8a5a36'); P.rect(4+k*2,36-k*4,22-k*2,1,'#a8784a'); } P.rect(2,4,2,34,'#5e2018'); P.line(3,6,27,34,'#8a2a22'); }); },
  boat(){ return FineArt.paint(44,20,P=>{ P.poly([[2,10],[42,10],[36,17],[8,17]],'#6a4424'); P.poly([[4,10],[40,10],[38,12],[6,12]],'#8a5a36'); P.rect(16,4,12,6,'#3a3a44'); P.poly([[14,4],[30,4],[28,1],[16,1]],'#5a5a64'); P.ell(22,18,20,2,'rgba(255,255,255,.18)'); }); },
};
Object.assign(SPR,{zy_table:['x'], zy_screen:['x'], zy_stairs:['x'], zy_boat:['x']}); Object.assign(SPRC,{zy_table:JA8.table(), zy_screen:JA8.screen(), zy_stairs:JA8.stairs(), zy_boat:JA8.boat()});
// the lanterns' light on the water at night
On.draw(({g,T,ox,oy})=>{ if(RT.mapId!=='jc_dongkou') return; const night=S.min>=18*60||S.min<5*60; if(!night) return;
  for(let k=0;k<7;k++){ const x=ox+(3+k*3.4)*T, y=oy+(13.5+Math.sin(RT.t*.8+k)*.3)*T; g.fillStyle='rgba(255,170,80,.18)'; g.fillRect(x-T*.3,y,T*.6,T*.12); g.fillRect(x-T*.15,y+T*.3,T*.3,T*.1); } });
