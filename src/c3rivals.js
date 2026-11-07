/* ============================================================
   山海问道 · 第三章 · 擂台上的对手 — the six people you can meet on the 擂台, each fighting the way their sect fights:
   程小剑 (a 剑宗 junior: slow crossing cuts), 卜小鱼 (天机阁: a few floating 符 words), 苏小棠 (药王谷: 丹火 sparks and
   thrown pills — and halfway through she stops), 林沧 (剑宗's fastest: cuts that cross where you stand, sword-qi lines
   with one gap, a band that sweeps), 乌兰 (万兽谷: 阿毛 throws fruit, she charges, a roar ring), 温玄 (天机阁: 符 words
   that seek you, a star wheel turning, pillars of light where the coins fell). The 擂台 by day behind them.
   ============================================================ */
const RIVAL={
  sf_cheng:{name:'程小剑', look:{g:'m',skin:1,hair:1,hairColor:0,style:'jin',cloth:0,face:'small'}, hp:900, atk:30, def:8, moves:['cut','cut','qi'], sub:'青云剑宗 · 外门'},
  sf_bu:{name:'卜小鱼', look:{g:'f',skin:0,hair:3,hairColor:0,style:'qun',cloth:4,face:'small'}, hp:900, atk:30, def:8, moves:['fu','fu','star'], sub:'天机阁'},
  tang:{name:'苏小棠', look:LOOK_TANG, hp:1300, atk:38, def:10, moves:['fire','pill','fire','ring'], sub:'药王谷'},
  sf_lin:{name:'林沧', look:{g:'m',skin:0,hair:2,hairColor:0,style:'robe',cloth:0,face:'small'}, hp:2100, atk:48, def:14, moves:['cross','qi','cross','sweep'], sub:'青云剑宗 · 这一辈最快的剑',
    phase2:{at:.5, moves:['cross','sweep','qi','cross'], line:'林沧的剑快得只剩下一道光！'}},
  sf_wulan:{name:'乌兰', look:{g:'f',skin:3,hair:3,hairColor:1,style:'jin',cloth:3,face:'mid'}, hp:1800, atk:44, def:13, moves:['fruit','rush','roar','fruit'], sub:'万兽谷 · 和阿毛一起上台',
    phase2:{at:.5, moves:['rush','roar','fruit','rush'], line:'阿毛跳上了乌兰的肩膀，龇着牙冲你叫！'}},
  sf_wenxuan:{name:'温玄', look:{g:'m',skin:0,hair:5,hairColor:5,style:'robe',cloth:4,face:'small'}, hp:1900, atk:44, def:12, moves:['fu','wheel','pillar','fu'], sub:'天机阁 · 看不透的人',
    phase2:{at:.5, moves:['wheel','pillar','fu','wheel'], line:'温玄把三枚铜钱抛上了天——擂台上亮起一圈星光！'}},
};
const RIVAL_WORDS=['定','封','缚','镇','散','止'];
// patterns, built from the shared bullets; a weaker one is the same thing slower and sparser
const RIVAL_PAT={
  cut:{name:'交叉斩', hit:.55, dur:4, spawn(P,t,dt,m){ P.every('c',1.2/m,()=>{ const a=Math.random()*Math.PI; P.add({k:'slash', cx:P.me.x, cy:P.me.y, a, w:6, warn:.95/m, act:.2}); }); }},
  qi:{name:'剑气', hit:.5, dur:4.4, spawn(P,t,dt,m){ P.every('q',1.1/m,()=>{ const left=Math.random()<.5, gap=12+Math.random()*76;
      for(let y=4;y<100;y+=8) if(Math.abs(y-gap)>13) P.add({k:'blade', x:left?-6:106, y, vx:(left?1:-1)*42*m, vy:0, r:2.4}); }); }},
  cross:{name:'快剑', hit:.65, dur:4.4, spawn(P,t,dt,m){ P.every('x',.8/m,()=>{ const a=Math.random()*Math.PI; for(const d of [0,Math.PI/2]) P.add({k:'slash', cx:P.me.x, cy:P.me.y, a:a+d, w:6, warn:.7/m, act:.2}); }); }},
  sweep:{name:'横扫千军', hit:.8, dur:4.6, spawn(P,t,dt,m){ for(const [at,dir] of [[.3,'h'],[1.5,'v'],[2.7,'h'],[3.6,'v']]) P.once('s'+at,t>=at,()=>P.add({k:'band', dir, at:dir==='h'?P.me.y:P.me.x, w:20, warn:.8/m, act:.3})); }},
  fu:{name:'飞符', hit:.5, dur:4.4, spawn(P,t,dt,m){ P.every('f',.7/m,()=>{ const a=Math.random()*Math.PI*2, x=50+Math.cos(a)*55, y=50+Math.sin(a)*55, d=Math.hypot(P.me.x-x,P.me.y-y)||1, sp=26*m;
      P.add({k:'word', text:RIVAL_WORDS[Math.random()*RIVAL_WORDS.length|0], x, y, vx:(P.me.x-x)/d*sp, vy:(P.me.y-y)/d*sp, r:3.4}); }); }},
  star:{name:'星斗', hit:.45, dur:4, spawn(P,t,dt,m){ P.once('o',t>=.2,()=>{ for(let k=0;k<6;k++) P.add({k:'orbit', a:k/6*Math.PI*2, R:34, va:1.3*m, vr:-3, r:2.4}); }); }},
  wheel:{name:'周天星盘', hit:.6, dur:4.6, spawn(P,t,dt,m){ P.once('o',t>=.2,()=>{ for(let k=0;k<9;k++) P.add({k:'orbit', a:k/9*Math.PI*2, R:40, va:(1.7)*m, vr:-5, r:2.6}); });
      P.every('w',1.4/m,()=>{ const a=Math.random()*Math.PI*2; P.add({k:'word', text:'封', x:50+Math.cos(a)*55, y:50+Math.sin(a)*55, vx:-Math.cos(a)*24*m, vy:-Math.sin(a)*24*m, r:3.4}); }); }},
  pillar:{name:'铜钱落地', hit:.7, dur:4.4, spawn(P,t,dt,m){ P.every('p',.9/m,()=>{ P.add({k:'pillar', at:P.me.x, w:12, warn:.8/m, act:.45}); P.add({k:'pillar', at:6+Math.random()*88, w:10, warn:.8/m, act:.45}); }); }},
  fire:{name:'丹火', hit:.5, dur:4.4, spawn(P,t,dt,m){ P.every('e',.85/m,()=>{ const base=Math.atan2(P.me.y-4,P.me.x-50); for(const da of [-.35,0,.35]) P.add({k:'ember', x:50, y:4, vx:Math.cos(base+da)*36*m, vy:Math.sin(base+da)*36*m, r:2.2}); }); }},
  pill:{name:'丹丸乱飞', hit:.45, dur:4.2, spawn(P,t,dt,m){ P.every('l',.45/m,()=>{ const left=Math.random()<.5; P.add({k:'fruit', x:left?-4:104, y:10+Math.random()*40, vx:(left?1:-1)*(30+Math.random()*14)*m, vy:-(10+Math.random()*20), ay:46, r:2.4}); }); }},
  ring:{name:'药香', hit:.4, dur:4, spawn(P,t,dt,m){ P.every('r',1.2/m,()=>P.add({k:'ring', cx:50, cy:20, R:2, vr:30*m, gap:Math.random()*Math.PI*2, gw:1.2, th:3})); }},
  fruit:{name:'阿毛扔果子', hit:.45, dur:4.2, spawn(P,t,dt,m){ P.every('u',.32/m,()=>P.add({k:'fruit', x:104, y:10+Math.random()*50, vx:-(30+Math.random()*16)*m, vy:-(10+Math.random()*20), ay:46, r:2.6})); }},
  rush:{name:'猛冲', hit:.7, dur:4.4, spawn(P,t,dt,m){ P.every('h',1.15/m,()=>{ const left=Math.random()<.5, gap=12+Math.random()*76; for(let y=4;y<100;y+=7) if(Math.abs(y-gap)>12) P.add({k:'blade', x:left?-6:106, y, vx:(left?1:-1)*46*m, vy:0, r:2.6}); }); }},
  roar:{name:'兽吼', hit:.5, dur:4.2, spawn(P,t,dt,m){ P.every('o',1.05/m,()=>P.add({k:'ring', cx:P.me.x, cy:P.me.y, R:1, vr:34*m, gap:Math.random()*Math.PI*2, gw:1.2, th:3})); }},
};
for(const id in RIVAL){ const R=RIVAL[id], kind='c3r_'+id;
  BEASTS[kind]={name:R.name, spr:kind, person:true, big:true, boss:true, hp:R.hp, atk:R.atk, def:R.def, exp:0, stones:[0,0], moves:R.moves, phase2:R.phase2, lore:R.sub};
  DODGE[kind]=Object.fromEntries(R.moves.concat(R.phase2?R.phase2.moves:[]).map(k=>[k,RIVAL_PAT[k]]));
  SCENES[kind]={...SCENES.qiongqi, sky:['#9ab8d4','#c4d6e2','#e6e2d0'], moon:'#fff4d8', hills:['#a09080','#8a7a6a','#746656','#5e5246'], fx:null, title:R.name, sub:R.sub+'　——　四宗大比', ink:'#2a221c'}; }
// their battle pictures are their own map sprites, made on first use
{ const _s=Battle.start; Battle.start=function(kind,cb){ if(String(kind).startsWith('c3r_')&&!SPRC[kind]){ const id=kind.slice(4); SPR[kind]=['x']; const L=RIVAL[id].look, c=cgChibi(L.face==='small'?{...L,face:'mid'}:L,'stand',null,null,null,false); /* big on screen, dot eyes look unfinished: the fuller eyes */ c.fine=true; SPRC[kind]=c; } return _s.call(Battle,kind,cb); }; }
