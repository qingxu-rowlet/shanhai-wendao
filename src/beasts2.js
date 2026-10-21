/* ============================================================
   山海问道 · 山林妖兽 — three more beasts of the 山海经 in 青丘山林, and bullet patterns for every common beast.
   狸力 (a boar with rooster's spurs, digs), 鵸鵌 (a three-headed crow, spreads fire three ways),
   朱厌 (a white-headed ape with red feet, throws stones). 当康 charges, 狌狌 lobs fruit.
   ============================================================ */
Object.assign(SPR, {
  lili:['................','................','................','.....nnnnn......','...nnnnnnnnn....','..nnNnnnnnnnnn..','.nnnnnnnnnnnsss.','.nnnnnnnnnnnsNs.','.nnnnnnnnnnnsss.','..nnnnnnnnnnnn..','...nnnnnnnnnn...','....y.y...y.y...','....y.y...y.y...','...yy.yy.yy.yy..','................','................'],
  qitu:['................','.EE..EE..EE.....','.EyE.EyE.EyE....','..E...E...E.....','...EEEEEEE......','..EEEEEEEEEE....','.EEEeEEEEEEEE...','EEEeeEEEEEEEEE..','.EEEEEEEEEEEE...','...EEEEEEEEr....','....EEEEEErr....','.....y...y......','....yy..yy......','................','................','................'],
  zhuyan:['................','.....wwwww......','....wwwwwww.....','....wEwwwEw.....','....wwwsswww....','.....wssssw.....','...hhhhhhhhh....','..hhhhhhhhhhh...','.hhhhhhhhhhhhh..','.hh.hhhhhhh.hh..','.hh.hhhhhhh.hh..','.ss.hhhhhhh.ss..','....hhh.hhh.....','....hhh.hhh.....','...rrr...rrr....','................'],
});
Object.assign(BEASTS, {
  lili:{name:'狸力', spr:'lili', hp:44, atk:10, def:3, exp:20, stones:[8,14], drop:['lingmo',.5],
    lore:'《山海经·南山经》：有兽焉，其状如豚，有距，其音如狗吠，其名曰狸力，见则其县多土功。', moves:['atk','charge','big','atk']},
  qitu:{name:'鵸鵌', spr:'qitu', hp:52, atk:12, def:2, exp:28, stones:[10,18], drop:['hide',.5],
    lore:'《山海经·西山经》：有鸟焉，其状如乌，三首六尾而善笑，名曰鵸鵌，服之使人不厌，又可以御凶。', moves:['atk','double','atk','big']},
  zhuyan:{name:'朱厌', spr:'zhuyan', hp:72, atk:14, def:4, exp:36, stones:[14,24], drop:['zhuguo',.4],
    lore:'《山海经·西山经》：有兽焉，其状如猿，而白首赤足，名曰朱厌，见则大兵。', moves:['atk','big','double','charge']},
});
MAPS.forest.spawns.push(
  {kind:'lili', n:2, area:[16,15,28,24]},
  {kind:'qitu', n:2, area:[16,1,28,4], minRealm:4},
  {kind:'zhuyan', n:2, area:[13,18,28,24], minRealm:6});

// --- bullet patterns for the common beasts ---
const rnd=(a,b)=>a+Math.random()*(b-a);
DODGE.dangkang={
  atk:{name:'当康冲撞', hit:.5, dur:3.2, spawn(P,t,dt,m){ for(const at of [.3,1.5]) P.once('c'+at,t>=at,()=>P.add({k:'band', dir:'h', at:P.me.y, w:14, warn:.85/m, act:.3})); }},
  big:{name:'獠牙横扫', hit:.9, dur:3.6, spawn(P,t,dt,m){ P.once('a',t>=.3,()=>P.add({k:'band', dir:'h', at:P.me.y, w:20, warn:.9/m, act:.3})); P.once('b',t>=1.7,()=>P.add({k:'band', dir:'v', at:P.me.x, w:18, warn:.85/m, act:.3})); }},
};
DODGE.xingxing={
  atk:{name:'扔果子', hit:.45, dur:3.4, spawn(P,t,dt,m){ P.every('f',.42/m,()=>P.add({k:'fruit', x:104, y:rnd(10,60), vx:-rnd(30,46)*m, vy:-rnd(10,30), ay:46, r:2.6})); }},
  double:{name:'连扔', hit:.4, dur:3.6, spawn(P,t,dt,m){ P.every('f',.28/m,()=>{ const left=Math.random()<.5; P.add({k:'fruit', x:left?-4:104, y:rnd(10,50), vx:(left?1:-1)*rnd(30,44)*m, vy:-rnd(10,30), ay:46, r:2.4}); }); }},
};
DODGE.lili={
  atk:{name:'拱地', hit:.5, dur:3.4, spawn(P,t,dt,m){ P.every('d',.7/m,()=>P.add({k:'band', dir:'v', at:P.me.x+rnd(-6,6), w:9, warn:.7/m, act:.25})); }},
  big:{name:'地裂', hit:.8, dur:3.8, spawn(P,t,dt,m){ P.every('d',.45/m,()=>P.add({k:'band', dir:'v', at:rnd(6,94), w:9, warn:.75/m, act:.25})); P.once('h',t>=1.6,()=>P.add({k:'band', dir:'h', at:P.me.y, w:12, warn:.8/m, act:.3})); }},
};
DODGE.qitu={
  atk:{name:'三首吐火', hit:.45, dur:3.6, spawn(P,t,dt,m){ P.every('s',.6/m,()=>{ const base=Math.atan2(P.me.y-4,P.me.x-50); for(const da of [-.35,0,.35]) P.add({k:'ember', x:50, y:4, vx:Math.cos(base+da)*40*m, vy:Math.sin(base+da)*40*m, r:2.2}); }); }},
  double:{name:'六尾乱扫', hit:.4, dur:3.8, spawn(P,t,dt,m){ P.every('s',.35/m,()=>{ const a=t*2.2; for(let i=0;i<3;i++){ const ang=a+i*Math.PI*2/3; P.add({k:'ember', x:50, y:30, vx:Math.cos(ang)*34*m, vy:Math.sin(ang)*34*m, r:2}); } }); }},
  big:{name:'怪笑', hit:.7, dur:3.6, spawn(P,t,dt,m){ P.every('r',1.0/m,()=>P.add({k:'ring', cx:50, cy:20, R:2, vr:30*m, gap:Math.random()*Math.PI*2, gw:1.1, th:3})); }},
};
DODGE.zhuyan={
  atk:{name:'投石', hit:.6, dur:3.6, spawn(P,t,dt,m){ P.every('b',.55/m,()=>P.add({k:'stone', x:rnd(8,92), y:-6, vx:rnd(-6,6), vy:rnd(28,40)*m, r:4.5})); }},
  double:{name:'双拳捶地', hit:.55, dur:3.8, spawn(P,t,dt,m){ for(const at of [.4,1.6,2.6]) P.once('p'+at,t>=at,()=>P.add({k:'ring', cx:P.me.x, cy:P.me.y, R:1, vr:36*m, gap:Math.random()*Math.PI*2, gw:1.2, th:3})); }},
  big:{name:'巨石', hit:1.0, dur:4.0, spawn(P,t,dt,m){ P.every('B',.9/m,()=>P.add({k:'stone', x:rnd(15,85), y:-10, vx:0, vy:26*m, r:8})); P.every('b',.5/m,()=>P.add({k:'stone', x:rnd(5,95), y:-4, vx:0, vy:34*m, r:3})); }},
};
