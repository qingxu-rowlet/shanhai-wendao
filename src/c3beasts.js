/* ============================================================
   山海问道 · 第三章「京城」 · 妖兽 — 猲狙 (《北山经》：其状如狼，赤首鼠目，其音如豚，名曰猲狙，是食人): wolves with red
   heads and small black rat's eyes. In act 1 the pack comes into the camp at night; its leader is the fight. It bites,
   the pack runs at you in lines with a gap to slip through, and when it howls the ground shakes in bands. At half its
   life the rest of the pack joins in.
   ============================================================ */
// the leader: 大师兄's 安平村 wolf (FineArt.wolf), but darker, hackles up, the head red and the eyes small and black — and
// turned to face you
FineArt.hejv=function(){ if(FineArt.cache.hejv) return FineArt.cache.hejv;
  const F={...FineArt.F, back:'#3e3a36', fur:'#5c5650', lit:'#77706a', belly:'#9a9286', dark:'#2e2b28', paw:'#24211e'}, Rd='#a8322a', Rl='#cc4a3c', Rk='#6e1c18';
  const src=FineArt.paint(66,38,P=>{ const o=2;   // everything one row lower, to leave room for the hackles
    P.cap(12,15+o,4,25+o,3.2,F.fur); P.cap(6,22+o,3,27+o,2.4,F.belly);
    P.cap(19,21+o,17,32+o,2.3,F.dark); P.cap(41,21+o,43,32+o,2.3,F.dark); P.rect(15,32+o,4,2,F.paw); P.rect(42,32+o,4,2,F.paw);
    P.ell(29,17+o,16,7.5,F.fur); P.ell(28,12.5+o,15,3.5,F.back); P.ell(31,21.5+o,12,3,F.belly);
    for(let x=17;x<42;x+=3) P.poly([[x-1.5,11+o],[x,6+o+(x%2)],[x+1.5,11+o]],F.back);       // hackles up along the back
    P.cap(23,21+o,22,33+o,2.5,F.lit); P.cap(44,20+o,46,33+o,2.5,F.lit); P.rect(20,33+o,5,2,F.paw); P.rect(45,33+o,5,2,F.paw);
    for(const x of [21,23,46,48]) P.set(x,35+o,'#e8e0d0');                                  // claws
    // the red head: ruff, skull, snout, ears; jaws open, teeth bared
    P.poly([[39,10+o],[48,6+o],[52,15+o],[43,22+o]],Rk); P.poly([[42,14+o],[48,12+o],[47,22+o],[43,22+o]],Rd);
    P.ell(51,10+o,6.5,5.5,Rd); P.ell(50,8.5+o,5,2.5,Rl);
    P.poly([[54,8+o],[64,10+o],[64,13+o],[55,13+o]],Rl); P.poly([[55,15+o],[63,15+o],[61,18+o],[56,17+o]],Rk);   // upper and lower jaw, apart
    P.rect(56,14+o,7,1,'#3a0c0a');                                                         // the open mouth
    for(const x of [57,59,61]) P.set(x,13+o,F.tooth); for(const x of [58,60]) P.set(x,15+o,F.tooth); P.set(56,13+o,F.tooth); P.set(56,15+o,F.tooth);
    P.set(64,10+o,F.nose); P.set(63,10+o,F.nose);
    P.poly([[46,7+o],[47,0+o],[51,5+o]],Rk); P.poly([[51,5+o],[54,0+o],[56,7+o]],Rk); P.set(48,3+o,'#e88070'); P.set(54,3+o,'#e88070');
    P.set(55,9+o,'#0a0606'); P.set(54,9+o,'#0a0606'); P.set(55,8+o,'#f0e0d0');             // the small black rat's eye, one glint
    P.line(52,7+o,57,8+o,Rk); });
  const c=document.createElement('canvas'); c.width=src.width; c.height=src.height; const g=c.getContext('2d'); g.translate(c.width,0); g.scale(-1,1); g.drawImage(src,0,0);
  c.bottom=src.bottom; c.fine=true; return FineArt.cache.hejv=c; };
SPRC.c3_hejv=FineArt.hejv();
BEASTS.c3_hejv={name:'猲狙头狼', spr:'c3_hejv', big:true, boss:true, hp:1400, atk:40, def:12, exp:300, stones:[150,150],
  lore:'《山海经·北山经》：有兽焉，其状如狼，赤首鼠目，其音如豚，名曰猲狙，是食人。这一群跟着一个人，他吹一声口哨，它们就退。',
  moves:['bite','pack','atk','howl','bite','pack'],
  phase2:{at:.5, moves:['pack','howl','bite','pack','bite','howl'], line:'林子里亮起更多红色的眼睛——整个狼群都扑上来了！'}};
SCENES.c3_hejv={...SCENES.qiongqi, sky:['#0c1020','#1a2140','#2c2a4a'], moon:'#f0ead2', hills:['#1c2236','#151a2c','#0f1322','#090c16'], title:'猲狙', sub:'其状如狼，赤首鼠目，是食人　——　《北山经》', ink:'#05060c'};
DODGE.c3_hejv={
  // two jaws close on where you stand, crossing
  bite:{name:'撕咬', hit:.65, dur:4.4, spawn(P,t,dt,m){ P.every('b',.95/m,()=>{ const a=Math.random()*Math.PI; for(const d of [0,Math.PI/2]) P.add({k:'slash', cx:P.me.x, cy:P.me.y, a:a+d, w:6, warn:.75/m, act:.2}); }); }},
  // the pack runs across in a line, with one gap to slip through
  pack:{name:'狼群冲阵', hit:.5, dur:5, spawn(P,t,dt,m){ P.every('p',1.25/m,()=>{ const left=Math.random()<.5, gap=12+Math.random()*76;
      for(let y=4;y<100;y+=7) if(Math.abs(y-gap)>12) P.add({k:'blade', x:left?-6:106, y, vx:(left?1:-1)*(40+Math.random()*8)*m, vy:0, r:2.6}); }); }},
  // a howl: the ground shakes in bands, one across, one down
  howl:{name:'嗥月', hit:.6, dur:4.6, spawn(P,t,dt,m){ P.once('h',t>=.3,()=>P.add({k:'band', dir:'h', at:P.me.y, w:22, warn:.95/m, act:.35}));
      P.once('v',t>=1.6,()=>P.add({k:'band', dir:'v', at:P.me.x, w:22, warn:.85/m, act:.35}));
      P.once('x',t>=2.9,()=>{ P.add({k:'band', dir:'h', at:P.me.y, w:16, warn:.8/m, act:.3}); P.add({k:'band', dir:'v', at:P.me.x, w:16, warn:.8/m, act:.3}); }); }},
  atk:{...DODGE.qiongqi.double, name:'扑咬'},
};
