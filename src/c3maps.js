/* ============================================================
   山海问道 · 第三章「京城」 · 地图 — act 1 「北上」: a camp beside the road north (sticks to gather, a spring, the pot and
   the fire, two tents; logs across the road until morning) and 安平村, half a day further on: empty houses with seals on
   the doors, the notice at the gate, the shrine with 大师兄's 长生牌位, the well where an old man stayed behind, and the
   path up the back hill to a small cairn.
   ============================================================ */
Object.assign(SPR, {
  c3_twig:['................','................','................','................','................','.........n......','....n...n.......','.....n.n........','..nnnNnnnnn.....','.....NnN..nn....','....n...n.......'],
  c3_spring:['................','................','................','................','....eeee........','..eEllllEe......','.eEllbbllEe.....','.eEllllllEe.....','..eEEEEEEe......'],
  c3_grave:['................','................','................','......ee........','.....eEEe.......','....eEeeEe......','...eEEeEEEe.....','..eEeEEeEeEe....','.p.y.ppy.y......','..g.gg.g.g......'],
  c3_notice:['................','..NNNNNNNNNNNN..','..NzzzzzzzzzzN..','..NzkzkzkzkkzN..','..NzzzzzzzzzzN..','..NzkkzkzkzzzN..','..NzzzzzzzrrzN..','..NzzzzzzzrrzN..','..NNNNNNNNNNNN..','.......NN.......','.......NN.......','.......NN.......','......NNNN......'],
  c3_seal:['................','................','..NNNNNNNNNNNN..','..NnnnzznnnnnN..','..NnnnzrznnnnN..','..NnnnzzznnnnN..','..NnnnzrznnnnN..','..NnnnzzznnnnN..','..NnnnnnnnnnnN..'],
});

/* ---------- the camp beside the road north ---------- */
{ const W=22, H=16, G=[...Array(H)].map((_,y)=>[...Array(W)].map((_,x)=>(x===0||y===0||x===W-1||y===H-1)?'W':'.'));
  for(let y=0;y<H-1;y++){ G[y][10]='='; G[y][11]='='; }                                   // the road, open to the north
  for(let y=1;y<H-1;y++){ G[y][19]='~'; G[y][20]='~'; }                                   // a stream down the east side
  const objects=[
    {type:'mj_tent', x:4, y:10, spr:'mj_tent', act:'c3tent', label:'你的帐篷'},
    {type:'mj_tent', x:6, y:4, spr:'mj_tent', act:'c3tent2', label:'大师姐的帐篷'},
    {type:'mj_fire', x:7, y:8, spr:'mj_fire', act:'c3fire'},
    {type:'mj_pot', x:8, y:10, spr:'mj_pot', act:'c3pot'},
    {type:'c3_spring', x:18, y:8, spr:'c3_spring', act:'c3water'},
    ...[[2,3],[15,2],[12,12]].map(([x,y],ti)=>({type:'c3_twig', x, y, spr:'c3_twig', act:'c3twig', ti, cond:s=>!(s.c3&&s.c3.wood||[]).includes(ti)})),
    {type:'mj_log', x:10, y:1, spr:'mj_log', act:'c3log', cond:s=>!s.flags.c3_morning},
    {type:'mj_log', x:11, y:1, spr:'mj_log', act:'c3log', cond:s=>!s.flags.c3_morning},
    {type:'c2_portal', x:2, y:14, spr:'c2_portal', act:'portal'},
    {type:'futon', x:6, y:11, act:'meditate'},
    {type:'mj_stump', x:9, y:7, spr:'mj_stump'},{type:'mj_log', x:5, y:8, spr:'mj_log'},{type:'rock', x:17, y:5},{type:'bush', x:13, y:9},
  ];
  MAPS.c3_road={ name:'北上 · 官道营地', w:W, h:H, ground:G.map(r=>r.join('')), objects,
    exits:[{x:10,y:0,to:'c3_anping',tx:11,ty:16},{x:11,y:0,to:'c3_anping',tx:12,ty:16}] }; }

/* ---------- 安平村 ---------- */
{ const W=24, H=18, G=[...Array(H)].map((_,y)=>[...Array(W)].map((_,x)=>(x===0||y===0||x===W-1||y===H-1)?'W':'.'));
  for(let y=5;y<H;y++){ G[y][11]='='; G[y][12]='='; }                                     // the street in from the south gate
  for(let x=3;x<=20;x++) G[10][x]='=';                                                      // and across
  for(let y=4;y<=10;y++) G[y][20]='=';                                                      // the path up the back hill
  const seal=(x,y,w,h,label,di)=>({type:'building', x, y, w, h, style:'house', roof:['#24221f','#33302c','#46423d','#6e6860'], label, door:[x+1,y+h], act:'c3door', di, sealed:true});
  const objects=[
    {type:'building', x:9, y:2, w:6, h:3, style:'house', roof:['#3a1210','#561c17','#74281f','#a8483a'], label:'祠堂', door:[11,5], act:'c3shrine'},
    seal(3,6,4,3,'没有人的屋子',0), seal(3,12,4,3,'没有人的屋子',1), seal(15,6,4,3,'没有人的屋子',2), seal(15,12,4,3,'没有人的屋子',3),
    {type:'c3_notice', x:13, y:15, spr:'c3_notice', act:'c3notice'},
    {type:'mj_well', x:7, y:13, spr:'mj_well', act:'c3well'},
    {type:'npc', id:'c3_old', x:8, y:15, look:{g:'m',skin:1,hair:0,hairColor:3,style:'robe',cloth:5,face:'small',beard:'#e4e0d8'}, name:'老人', act:'talk', cond:s=>!!s.flags.c3_shrine},
    {type:'c3_grave', x:20, y:3, spr:'c3_grave', act:'c3grave'},
  ];
  MAPS.c3_anping={ name:'北上 · 安平村', w:W, h:H, ground:G.map(r=>r.join('')), objects,
    exits:[{x:11,y:17,to:'c3_road',tx:10,ty:2},{x:12,y:17,to:'c3_road',tx:11,ty:2}] }; }

/* ---------- both maps: trees thick round the edges, flowers and long grass inside ---------- */
for(const [id,seed] of [['c3_road',3101],['c3_anping',3102]]){ const m=MAPS[id], G=m.ground.map(r=>r.split('')), R=rng(seed), keep=new Set();
  const k=(x,y)=>keep.add(x+','+y);
  for(const o of m.objects){ const w=o.w||1, h=o.h||1; for(let yy=o.y-1;yy<=o.y+h;yy++) for(let xx=o.x-1;xx<=o.x+w;xx++) k(xx,yy); if(o.door) k(o.door[0],o.door[1]+1); }
  for(const e of m.exits){ k(e.x,e.y); k(e.x,e.y+(e.y?-1:1)); }
  for(let y=1;y<m.h-1;y++) for(let x=1;x<m.w-1;x++){ if(keep.has(x+','+y)||G[y][x]!=='.') continue;
    const edge=Math.min(x-1,m.w-2-x,y-1,m.h-2-y);
    if(edge===0&&R()<.8||edge===1&&R()<.35) m.objects.push({type:R()<.6?'pine':'tree', x, y});
    else if(edge>=2&&R()<.1) G[y][x]=R()<.5?',':':'; }
  m.ground=G.map(r=>r.join('')); }

// the seals: two strips of paper crossed over each empty house's door, a red stamp where they cross. Painted onto the
// house itself, so whoever walks in front of the house walks in front of them too.
On.building((o,c)=>{ if(!o.sealed) return c; if(o._sealBase===c) return o._sealed;
  const d=document.createElement('canvas'); d.width=c.width; d.height=c.height; const g=d.getContext('2d'); g.drawImage(c,0,0);
  const W=c.width, H=c.height, x0=W/2-10, x1=W/2+9, y0=H-25, y1=H-7, n=y1-y0;
  for(const dir of [1,-1]) for(let i=0;i<=n;i++){ const x=Math.round(dir>0?x0+(x1-x0)*i/n:x1-(x1-x0)*i/n), y=y0+i;
    g.fillStyle='#ece4cc'; g.fillRect(x-1,y,3,1); if(i%4===2){ g.fillStyle='#6a5a4a'; g.fillRect(x,y,1,1); } }
  g.fillStyle='#b02820'; g.fillRect(W/2-2,y0+n/2-2,4,4); g.fillStyle='#e05040'; g.fillRect(W/2-1,y0+n/2-1,1,1);
  o._sealBase=c; return o._sealed=d; });
