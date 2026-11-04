/* ============================================================
   山海问道 · 第三章「京城」 · 城里的东西（五）：聚宝楼的大堂 — a stage laid with red carpet and the table where each lot is
   shown under a red cloth, a bronze gong on its stand, rows of carved chairs for the bidders, and high on the back wall
   two 雅间 (private boxes) behind red curtains: in the right-hand one, someone you never quite see.
   ============================================================ */
On.tile('E',(g,R,v)=>{ // the stage: red carpet over boards, a gold border along its front
  g.fillStyle='#8a2420'; g.fillRect(0,0,16,16); for(let i=0;i<10;i++){ g.fillStyle=R()<.5?'#9a2c26':'#7a1e1a'; g.fillRect(R()*16|0,R()*16|0,2,1); }
  g.fillStyle='#c8a050'; g.fillRect(0,13,16,1); g.fillStyle='#5e3a20'; g.fillRect(0,14,16,2); },true,'jc_');
const JA5={
  // a 雅间: a little balcony high on the wall, lattice and red curtains; open, a gap and a hand on the rail
  box(open){ return FineArt.paint(56,34,P=>{ P.rect(0,4,56,26,'#4a2a16'); P.rect(2,6,52,22,'#2a160c');
    P.rect(2,4,52,2,'#c8a050'); for(let x=4;x<54;x+=6) P.rect(x,2,2,2,'#8a5a36');
    const gap=open?10:0; P.rect(4,6,24-gap/2,20,'#9a2a22'); P.rect(28+gap/2,6,24-gap/2,20,'#9a2a22'); for(let x=6;x<52;x+=4) if(x<28-gap/2||x>28+gap/2) P.rect(x,6,1,20,'#7a1e1a');
    if(open){ P.rect(25,10,6,14,'#140a06'); P.rect(26,22,4,3,'#d8b890'); P.rect(27,21,2,1,'#e8e0d0'); }   // in the gap, a hand on the rail: a white ring on one finger
    P.rect(0,26,56,4,'#6a4024'); for(let x=2;x<54;x+=4) P.rect(x,26,2,4,'#8a5a36'); P.rect(0,30,56,2,'#c8a050'); }); },
  chair(){ return FineArt.paint(16,20,P=>{ P.rect(3,2,10,9,'#6a3a20'); P.rect(4,3,8,7,'#8a4a2a'); P.rect(6,4,4,4,'#a8603a'); P.rect(2,11,12,3,'#7a4424'); P.rect(2,11,12,1,'#a8603a'); for(const x of [3,12]) P.rect(x,14,2,6,'#5e3a20'); }); },
  table(){ return FineArt.paint(34,24,P=>{ P.rect(2,10,30,3,'#5e3a20'); P.rect(4,13,3,10,'#4a2a16'); P.rect(27,13,3,10,'#4a2a16');
    P.poly([[4,10],[30,10],[28,2],[6,2]],'#b02820'); P.rect(6,2,22,1,'#d84a3a'); P.poly([[4,10],[8,10],[7,14],[3,13]],'#8a1e18'); P.poly([[26,10],[30,10],[31,13],[27,14]],'#8a1e18'); P.rect(15,0,4,2,'#e8b84a'); }); },
  gong(){ return FineArt.paint(24,32,P=>{ for(const x of [2,20]) P.rect(x,4,2,27,'#5e3a20'); P.rect(1,3,22,2,'#7a4a2a'); P.line(8,5,9,8,'#3a2418'); P.line(16,5,15,8,'#3a2418');
    P.ell(12,16,8,8,'#a8781a'); P.ell(12,16,6.5,6.5,'#c8982a'); P.ell(12,16,2.6,2.6,'#e8c050'); P.ell(10,13,1.4,1,'#f8e090'); }); },
};
Object.assign(SPR,{ju_box:['x'], ju_box_open:['x'], ju_chair:['x'], ju_table:['x'], ju_gong:['x']});
Object.assign(SPRC,{ju_box:JA5.box(false), ju_box_open:JA5.box(true), ju_chair:JA5.chair(), ju_table:JA5.table(), ju_gong:JA5.gong()});
