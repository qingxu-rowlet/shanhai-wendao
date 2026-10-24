/* ============================================================
   山海问道 · 秘境的草木与生灵 — new herbs from the 山海经 for the 雾林 (祝余: eat it and never hunger; 迷穀: wear it and never
   lose your way — it widens what you can see in the fog; 薰草: a calming fragrance), two new beasts (狪狪, a boar with a pearl;
   数斯, an owl on human feet), and small creatures that wander the camp and the wood (rabbits, birds, 朏朏) — until the night of the
   wings, after which nothing is left alive in the 秘境.
   ============================================================ */
Object.assign(SPR, {
  zhuyuspot:['................','................','................','......l..l......','.....lgl.lgl....','......g..g......','....g.g.gg.g....','.....gg.g.gg....','....g.gGg.g.....','.....gGgGgg.....','......GgG.......','.......G........'],
  miguspot:['................','......yxy.......','.....yxxxy......','......yxy.......','.......k........','...yxy.k.yxy....','..yxxxykyxxxy...','...yxy.k.yxy....','.......k........','......kkk.......'],
  xuncaospot:['................','.....v....v.....','....vVv..vVv....','.....v.g..v.....','......gg.g......','...v..g.gg..v...','..vVv.g.g..vVv..','...v.gg.g...v...','.....g.gg.g.....','....g.g..g......'],
  i_zhuyu:['............','...l..l.....','..lgl.lgl...','...g..g.....','.g.g.gg.g...','..gg.g.gg...','.g.gGg.g....','..gGgGgg....','...GgG......','....G.......'],
  i_migu:['............','....yxy.....','...yxxxy....','....yxy.....','.....k......','.yxy.k.yxy..','yxxxykyxxxy.','.yxy.k.yxy..','.....k......','....kkk.....'],
  i_xuncao:['............','..v....v....','.vVv..vVv...','..v.g..v....','....gg.g....','.v..g.gg..v.','vVv.g.g..vVv','.v.gg.g...v.','...g.gg.g...'],
  i_tongzhu:['..........','...qqqq...','..qxxqqq..','..qxqqqq..','..qqqqqq..','..qqqqqq..','...qqqq...'],
  i_owlfeather:['......H.','.....HHh','....HHh.','...HHh..','..HHh...','.HHh....','Hh......','.h......'],
  tongtong:['................','................','.....qq.........','....qxxq........','...nnqqnnnn.....','..nNNnnnnnnnn...','.nnkNnnnnnnnnn..','.nnnnnnnnnnnnnN.','wnnnnnnnnnnnnnN.','.nnnnnnnnnnnnN..','..NNnnnnnnnnN...','...N.N...N.N....','...N.N...N.N....','..NN.NN.NN.NN...','................','................'],
  shusi:['................','...H.......H....','...HHHHHHHHH....','..HHyyHHHyyHH...','..HHykHHHkyHH...','..HHHHHoHHHHH...','...HHHHHHHHH....','..HHhHHHHHhHH...','..HhhHHHHHhhH...','...HHHHHHHHH....','....HHHHHHH.....','.....s...s......','.....s...s......','.....s...s......','....ss...ss.....','................'],
  mj_rabbit:['.e.e....','.e.e....','eeeee...','ekeeeee.','.eeeeeee','..eeeeee','..e..e..'],
  mj_bird:['...nn...','..nknn..','.ynnnnn.','..nnnnnn','...y.y..'],
  mj_feifei:['..........ww','.n.n......w.','.nnn.....ww.','nknkn...ww..','nnnnnnnnww..','.nnnnnnnn...','.n.n..n.n...'],
});
Object.assign(ITEMS, {
  zhuyu:  {name:'祝余', icon:'i_zhuyu', sell:18, desc:'《山海经·南山经》：其状如韭而青华，其名曰祝余，食之不饥。'},
  migu:   {name:'迷穀花', icon:'i_migu', sell:24, desc:'《山海经·南山经》：其状如榖而黑理，其华四照，佩之不迷。带在身上，雾林里能看得更远。'},
  xuncao: {name:'薰草', icon:'i_xuncao', sell:20, desc:'《山海经·西山经》：麻叶而方茎，赤华而黑实，臭如蘼芜，名曰薰草，佩之可以已疠。'},
  tongzhu:{name:'狪珠', icon:'i_tongzhu', sell:120, desc:'狪狪身上取下的珠子，温润，夜里会微微发光。'},
  shusiyu:{name:'数斯羽', icon:'i_owlfeather', sell:45, desc:'数斯的羽毛。摸上去是凉的，像人的皮肤。'},
});
Object.assign(BEASTS, {
  tongtong:{name:'狪狪', spr:'tongtong', hp:150, atk:22, def:9, exp:55, stones:[18,30], drop:['tongzhu',.35],
    lore:'《山海经·东山经》：有兽焉，其状如豚而有珠，名曰狪狪，其鸣自訆。', moves:['atk','charge','big','atk']},
  shusi:{name:'数斯', spr:'shusi', hp:120, atk:26, def:6, exp:65, stones:[22,34], drop:['shusiyu',.5],
    lore:'《山海经·西山经》：有鸟焉，其状如鸱而人足，名曰数斯，食之已瘿。', moves:['atk','double','big','atk']},
});
DODGE.tongtong={ atk:{...DODGE.dangkang.atk, name:'狪狪冲撞'}, big:{...DODGE.dangkang.big, name:'珠光乱撞'} };
DODGE.shusi={ atk:{...DODGE.qitu.atk, name:'人足踏枝'}, double:{...DODGE.qitu.double, name:'怪眼回旋'}, big:{...DODGE.qitu.big, name:'夜啼'} };
// people's tastes
NPCS.man.loves.push('zhuyu'); NPCS.xie.loves.push('migu'); NPCS.lu.likes.push('xuncao'); NPCS.tang.likes.push('xuncao');

// the 雾林 grows them, and the two new beasts live there (until the night of the wings)
MAPS.mj_wood.objects.push(
  {type:'gather', x:6, y:3, item:'zhuyu', spr:'zhuyuspot'},{type:'gather', x:19, y:5, item:'zhuyu', spr:'zhuyuspot'},{type:'gather', x:11, y:16, item:'zhuyu', spr:'zhuyuspot'},
  {type:'gather', x:4, y:12, item:'migu', spr:'miguspot'},{type:'gather', x:23, y:18, item:'migu', spr:'miguspot'},
  {type:'gather', x:20, y:9, item:'xuncao', spr:'xuncaospot'},{type:'gather', x:6, y:19, item:'xuncao', spr:'xuncaospot'});
// (trees were scattered before these were placed: clear any tree standing on a new spot)
{ const spots=new Set(MAPS.mj_wood.objects.filter(o=>o.type==='gather').map(o=>o.x+','+o.y)); MAPS.mj_wood.objects=MAPS.mj_wood.objects.filter(o=>!((o.type==='tree'||o.type==='pine')&&spots.has(o.x+','+o.y))); }
Object.defineProperty(MAPS.mj_wood,'spawns',{get(){ return S&&S.c2&&(S.c2.night||0)>=2?[]:[{kind:'tongtong', n:2, area:[2,8,12,19]},{kind:'shusi', n:2, area:[16,8,24,19]},{kind:'tongtong', n:1, area:[2,1,10,6]}]; }});

// 迷穀花 in your pack: the fog of the 雾林 opens a little
{ const _g=gather; gather=function(o){ const first=o.item==='migu'&&!count(S,'migu'); _g(o); if(first) setTimeout(()=>UI.toast('迷穀花微微发光——四周的雾好像淡了一些'),300); }; }

/* ---------- small creatures: rabbits, birds and a 朏朏 in the camp and the wood; they run from you, and are gone after the wings ---------- */
const Critters = {
  list:[], map:null,
  spawn(){ Critters.map=RT.mapId; Critters.list=[]; if(!S||!S.c2||(S.c2.night||0)>=2) return;
    const plan=RT.mapId==='mj_camp'?[['mj_rabbit',2],['mj_bird',3],['mj_feifei',1]]:RT.mapId==='mj_wood'?[['mj_rabbit',2],['mj_bird',3]]:[];
    const m=RT.map; for(const [k,n] of plan) for(let i=0;i<n;i++) for(let t=0;t<30;t++){ const x=1+Math.random()*(m.w-2), y=1+Math.random()*(m.h-2);
      if(RT.solid[y|0]&&!RT.solid[y|0][x|0]&&tileAt(x|0,y|0)!=='~'){ Critters.list.push({k, x, y, tx:x, ty:y, t:Math.random()*3, flip:Math.random()<.5, fly:0}); break; } } },
  tick(dt){ if(Critters.map!==RT.mapId) Critters.spawn(); const px=RT.fx, py=RT.fy;
    for(const c of Critters.list){ c.t-=dt;
      const d=Math.hypot(c.x-px,c.y-py);
      if(c.k==='mj_bird'&&d<2.2&&!c.fly) c.fly=1;                                   // birds take off
      if(c.fly){ c.y-=dt*6; c.x+=dt*(c.flip?-3:3); c.fly+=dt; continue; }
      if(d<1.8&&c.t>-1){ const a=Math.atan2(c.y-py,c.x-px); c.tx=c.x+Math.cos(a)*2.5; c.ty=c.y+Math.sin(a)*2.5; c.t=.6; }   // run from you
      else if(c.t<0){ c.tx=c.x+(Math.random()-.5)*3; c.ty=c.y+(Math.random()-.5)*2; c.t=1.5+Math.random()*3; }
      const nx=c.x+(c.tx-c.x)*Math.min(1,dt*(c.k==='mj_feifei'?2:3)), ny=c.y+(c.ty-c.y)*Math.min(1,dt*(c.k==='mj_feifei'?2:3));
      if(nx>1&&ny>1&&nx<RT.map.w-1&&ny<RT.map.h-1&&!RT.solid[ny|0][nx|0]&&tileAt(nx|0,ny|0)!=='~'){ if(Math.abs(nx-c.x)>.002) c.flip=nx<c.x; c.x=nx; c.y=ny; } else { c.tx=c.x; c.ty=c.y; } }
    Critters.list=Critters.list.filter(c=>c.fly<4); },
  draw(g,ox,oy,T,Z){ for(const c of Critters.list){ const hop=(c.k==='mj_rabbit'&&Math.hypot(c.tx-c.x,c.ty-c.y)>.05)?-Math.abs(Math.sin(RT.t*12))*2:0;
      const sp=sprite(c.k), w=sp.width*Z, h=sp.height*Z, x=Math.round(ox+(c.x+.5)*T-w/2), y=Math.round(oy+(c.y+.9)*T-h+hop*Z);
      if(c.flip){ g.save(); g.translate(x+w,y); g.scale(-1,1); g.drawImage(sp,0,0,w,h); g.restore(); } else g.drawImage(sp,x,y,w,h); } },
};
// creatures move while the game runs in the 秘境
{ const _r=render; let last=performance.now(); render=function(){ const now=performance.now(), dt=Math.min(.05,(now-last)/1000); last=now;
    if(RT.map&&RT.mapId.startsWith('mj_')&&!RT.paused) Critters.tick(dt); _r(); }; }
// draw the creatures before the 秘境 overlay: hook the y-sorted world by drawing them right after the ground pass
{ const _dg=Life.drawGround; Life.drawGround=function(g,ox,oy,T,Z){ _dg.call(Life,g,ox,oy,T,Z); if(RT.mapId&&RT.mapId.startsWith('mj_')) Critters.draw(g,ox,oy,T,Z); }; }
