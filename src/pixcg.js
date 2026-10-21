/* ============================================================
   山海问道 · 像素 CG — the heart events and every 奇遇 as pixel-art scenes.
   The cute in-game chibis, drawn large, in poses (sit, kneel, hold a lantern, draw a sword, offer a gift, bow…)
   with pixel props, standing in a pixel background full of details. Expressions change with the dialogue,
   the characters breathe and blink, and petals / rain / fireflies / lanterns move.
   ============================================================ */

/* ---------- posed chibis ---------- */
// body rows 12.. for a side-facing chibi (facing right); hands are 'S'. `hand` is where the prop goes.
const POSE_BODY = {
  stand:{rows:['.....WCCCCW.....','....CCWCCCC.....','....CCCCCSC.....','....CAAAAAA.....','....PPPPPPP.....','....PPPPPPP.....','....pPPPPPp.....','.....FF..FF.....'], hand:[9,14]},
  hold: {rows:['.....WCCCCW.....','....CCWCCCCCSS..','....CCCCCCC.....','....CAAAAAA.....','....PPPPPPP.....','....PPPPPPP.....','....pPPPPPp.....','.....FF..FF.....'], hand:[13,13]},
  lantern:{rows:['.....WCCCCW.....','....CCWCCCC.....','....CCCCCCCC....','....CAAAAAACS...','....PPPPPPP.....','....PPPPPPP.....','....pPPPPPp.....','.....FF..FF.....'], hand:[12,15]},
  point:{rows:['.....WCCCCWCCS..','....CCWCCCC.....','....CCCCCCC.....','....CAAAAAA.....','....PPPPPPP.....','....PPPPPPP.....','....pPPPPPp.....','.....FF..FF.....'], hand:[13,12]},
  walk: {rows:['.....WCCCCW.....','....CCWCCCC.....','...SCCCCCCS.....','....CAAAAAA.....','....PPPPPPP.....','...PPPPPPPP.....','...pPP..PPp.....','..FF.....FF.....'], hand:[10,14]},
  sit:  {rows:['.....WCCCCW.....','....CCWCCCC.....','....CCCCCSC.....','....CAAAAAA.....','...PPPPPPPPP....','..pPPPPPPPPPp...'], hand:[9,14]},
  sitedge:{rows:['.....WCCCCW.....','....CCWCCCC.....','....CCCCCSC.....','....CAAAAAA.....','....PPPPPPPPP...','....pPPPPPPPPp..','.........ppPP...','.........ppPP...','.........ppPP...','.........FFFFF..'], hand:[9,14], seat:4},
  kneel:{rows:['.....WCCCCW.....','....CCWCCCC.....','....CCCCCSC.....','....CAAAAAA.....','....PPPPPPPP....','...FpPPPPPPPp...'], hand:[9,14]},
  reach:{rows:['.....WCCCCW.....','....CCWCCCCC....','....CCCCCCCCC...','....CAAAAAA.CS..','....PPPPPPPP....','...FpPPPPPPPp...'], hand:[13,15]},
  crouch:{rows:['.....WCCCCW.....','....CCWCPPPP....','....CCCSPPPP....','....CAAAPPPP....','....PPPPPPPP....','....pPPPPPFF....'], hand:[7,14]},
  sword:{rows:['.....WCCCCW.....','....CCWCCCCCCCS.','...SCCCCCCC.....','....CAAAAAA.....','...PPPPPPPP.....','..PPPP...PPP....','..pPP.....PPp...','.FF........FF...'], hand:[14,13]},
  guard:{rows:['.....WCCCCW.CS..','....CCWCCCCC....','....CCCCCCC.....','....CAAAAAA.....','...PPPPPPPP.....','..PPPP...PPP....','..pPP.....PPp...','.FF........FF...'], hand:[13,12]},
  bow:  {rows:['.....WCCCCWSS...','....CCWCCCCC....','....CCCCCCC.....','....CAAAAAA.....','....PPPPPPP.....','....PPPPPPP.....','....pPPPPPp.....','.....FF..FF.....'], hand:[12,12], headDrop:1},
};
// faces on the side view: rows 7–10, columns 9–12
const MOODS = {
  smile:{7:[[11,'E'],[10,'S'],[12,'S']], 8:[[10,'E'],[11,'S'],[12,'E']], 10:[[10,'m'],[11,'m']]},
  blush:{9:[[10,'M'],[11,'M'],[12,'M']]},
  sad:  {7:[[10,'S'],[11,'S'],[12,'S']], 8:[[10,'E'],[11,'E'],[12,'E']], 9:[[11,'S']], 10:[[10,'S'],[9,'m']]},
  blink:{7:[[10,'S'],[11,'S'],[12,'S']], 8:[[10,'E'],[11,'E'],[12,'E']]},
};
const PROP_PAL = {G:'#eef3f6', g:'#9aa6b0', K:'#3a2a22', w:'#c8945a', Q:'#ec7090', V:'#5fa35a', v:'#3f7a3a', J:'#7fd0a0', B:'#c8a060', b:'#8a6a3a', O:'#ffe08a', Z:'#d8413b', n:'#7a4a2a'};
// props as cell lists relative to the hand
const PROPS = {
  sword:   h=>{ const c=[[-1,0,'K'],[0,0,'K'],[1,-1,'Y'],[1,0,'Y'],[1,1,'Y']]; for(let i=2;i<12;i++){ c.push([i,0,'G']); c.push([i,1,'g']); } c.push([-1,1,'Z'],[-1,2,'Z'],[-2,3,'Z']); return c; },
  wood:    h=>{ const c=[[-1,0,'b'],[0,0,'b']]; for(let i=1;i<11;i++) c.push([i,0,'w']); return c; },
  swordup: h=>{ const c=[[0,1,'K'],[0,0,'K'],[-1,-1,'Y'],[0,-1,'Y'],[1,-1,'Y']]; for(let i=2;i<11;i++){ c.push([i-1,-i,'G']); c.push([i,-i,'g']); } c.push([-1,2,'Z'],[-1,3,'Z']); return c; },
  lantern: h=>[[0,1,'K'],[0,2,'K'],[-1,3,'Y'],[0,3,'Y'],[1,3,'Y'],[-2,4,'Z'],[-1,4,'O'],[0,4,'O'],[1,4,'O'],[2,4,'Z'],[-2,5,'Z'],[-1,5,'O'],[0,5,'O'],[1,5,'O'],[2,5,'Z'],[-2,6,'Z'],[-1,6,'Z'],[0,6,'O'],[1,6,'Z'],[2,6,'Z'],[-1,7,'Y'],[0,7,'Y'],[1,7,'Y'],[0,8,'Y']],
  sachet:  h=>[[1,-1,'Y'],[1,0,'Q'],[2,0,'Q'],[1,1,'Q'],[2,1,'Q'],[1,2,'Z']],
  herb:    h=>[[0,-1,'V'],[1,-2,'V'],[-1,-2,'v'],[0,-3,'V'],[2,-3,'v'],[1,-4,'O']],
  jade:    h=>[[1,0,'J'],[1,1,'J'],[2,0,'J'],[1,2,'Z']],
  swordlap:h=>{ const c=[]; for(let x=-9;x<5;x++) c.push([x,1,x<-7?'K':'G']); c.push([-7,1,'Y']); return c; },
};
// things worn on the body, in body coordinates (side view)
const WEAR = {
  basket:[[11,15,'b'],[12,15,'b'],[13,15,'b'],[14,15,'b'],[11,16,'B'],[12,16,'B'],[13,16,'B'],[14,16,'B'],[12,17,'B'],[13,17,'B'],[12,14,'V'],[13,13,'V'],[11,14,'v']],
  backsword:[[3,10,'Z'],[3,11,'K'],[4,11,'Y'],[2,9,'Z'],[1,8,'Z']],
  bow:[[2,10,'n'],[1,11,'n'],[1,12,'n'],[1,13,'n'],[1,14,'n'],[1,15,'n'],[2,16,'n'],[3,11,'K'],[3,12,'K'],[3,13,'K'],[3,14,'K'],[3,15,'K']],
  bookbox:[[0,10,'b'],[1,10,'b'],[2,10,'b'],[0,11,'B'],[1,11,'B'],[2,11,'B'],[0,12,'B'],[1,12,'B'],[2,12,'B'],[0,13,'b'],[1,13,'B'],[2,13,'B'],[0,14,'B'],[1,14,'B'],[2,14,'B'],[0,15,'b'],[1,15,'b'],[2,15,'b']],
  pole:(()=>{ const c=[]; for(let x=-6;x<20;x++) c.push([x,12,'n']); for(const bx of [-6,18]){ c.push([bx,13,'K'],[bx,14,'K'],[bx-1,15,'b'],[bx,15,'b'],[bx+1,15,'b'],[bx-1,16,'B'],[bx,16,'B'],[bx+1,16,'B'],[bx-1,17,'B'],[bx,17,'B'],[bx+1,17,'B']); } return c; })(),
  cane:[[12,15,'n'],[12,16,'n'],[13,17,'n'],[13,18,'n'],[13,19,'n']],
  blood:[[8,13,'Z'],[9,14,'Z'],[7,15,'Z'],[10,16,'Z']],
  wet:[[4,13,'l'],[11,14,'l'],[6,16,'l'],[9,18,'l']],
};
const PCX=10, PCY=4, PCW=40, PCH=28;   // a posed chibi lives in a 40×28 grid; the 16-wide body sits at column 10, row 4
const POSEC={};
function poseSprite(look, pose, mood, prop, wear, back){
  const key=JSON.stringify([look,pose,mood,prop,wear,back]); if(POSEC[key]) return POSEC[key];
  const B=POSE_BODY[pose]||POSE_BODY.stand, dir=back?'up':'side';
  const head=composeRows(dir, look, 0).slice(0,12).map(r=>r.split(''));
  if(!back&&mood&&MOODS[mood]) for(const y in MOODS[mood]) for(const [x,ch] of MOODS[mood][y]){ const cur=head[y][x]; if('SsELeMm'.includes(cur)) head[y][x]=ch; }
  const body=back?BODY.up.slice(12).map(r=>r.split('')):B.rows.map(r=>r.split(''));
  const grid=[...Array(PCH)].map(()=>Array(PCW).fill('.'));
  const put=(x,y,ch)=>{ x+=PCX; y+=PCY; if(x>=0&&y>=0&&x<PCW&&y<PCH&&ch!=='.') grid[y][x]=ch; };
  const hd=B.headDrop||0;
  for(const w of wear||[]) if(WEAR[w]&&(w==='backsword'||w==='bow'||w==='bookbox')) for(const [x,y,ch] of WEAR[w]) put(x,y,ch);   // behind the body
  body.forEach((r,y)=>r.forEach((ch,x)=>put(x,12+y,ch)));
  head.forEach((r,y)=>r.forEach((ch,x)=>put(x+(hd?1:0),y+hd,ch)));
  for(const w of wear||[]) if(WEAR[w]&&!(w==='backsword'||w==='bow'||w==='bookbox')) for(const [x,y,ch] of WEAR[w]) put(x,y,ch);
  if(prop&&PROPS[prop]&&!back){ const [hx,hy]=B.hand; for(const [dx,dy,ch] of PROPS[prop]()) put(hx+dx,hy+dy,ch); }
  const pal={...lookPalette(look), ...PROP_PAL, l:'#9fd3ef'};
  const c=document.createElement('canvas'); c.width=PCW; c.height=PCH; const g=c.getContext('2d');
  const filled=(x,y)=>y>=0&&y<PCH&&x>=0&&x<PCW&&grid[y][x]!=='.';
  g.fillStyle='#2a1e1a'; for(let y=0;y<PCH;y++) for(let x=0;x<PCW;x++){ if(filled(x,y)) continue; if(filled(x-1,y)||filled(x+1,y)||filled(x,y-1)||filled(x,y+1)) g.fillRect(x,y,1,1); }
  for(let y=0;y<PCH;y++) for(let x=0;x<PCW;x++){ const ch=grid[y][x]; if(ch==='.') continue; g.fillStyle=pal[ch]||'#f0f'; g.fillRect(x,y,1,1); }
  let bottom=PCH-1; while(bottom>0&&!grid[bottom].some(ch=>ch!=='.')) bottom--; c.bottom=bottom+2;   // feet sit on the ground line
  return POSEC[key]=c;
}

/* ---------- pixel beasts (facing right) ---------- */
const BEAST_PAL = {w:'#fbf8f0', x:'#c9c2b6', k:'#2a1e1a', l:'#8fd0ff', t:'#d8c49a', r:'#d8413b', b:'#3f78b8', B:'#6aa6d8', y:'#e8b84a', g:'#d6d2c8', s:'#c8d4e0'};
const PXB = {
  fox:['...........w..w.','...........wwww.','..ll.......wkwwk','.lwwl....wwwwww.','.lwwww..wwwwww..','..wwwwwwwwwwww..','...wwwwwwwwwxx..','....xwwwwwwwx...','....w.w...w.w...','....k.k...k.k...'],
  horse:['..................ww....','.................wwww...','................wwwwww..','...............wwkwwwww.','...............wwwwwwwwk','..............ttww..www.','.............ttt........','..r.....ttttttt.........','.rr..ttktttktttkt.......','rr..tttkttttktttt.......','r...ttttkttttkttt.......','r....tttkttttktt........','.....ttttttttttt........','.....tt.tt...tt.tt......','.....tt.tt...tt.tt......','.....tt.tt...tt.tt......','.....kk.kk...kk.kk......'],
  bird:['........bb..','.......bbkby','..BBB.bbbb..','.BBBBBbbbb..','bbbbbbbbb...','..bbbbbbb...','....y..y....'],
  baize:['.....................y..','....................yy..','.................gggww..','................gggwwww.','...............ggggwkwwk','...............ggggwwww.','....wwwwwwwwwwwgggwww...','..wwwwwwwwwwwwwwggww....','.wwwwwwwwwwwwwwwwww.....','xwwwwwwwwwwwwwwwwwx.....','x.xwwwwwwwwwwwwwwxx.....','..xxxwwwwwwwwwwxxwwww...','....xxxxxxxxxxxx.xxxx...'],
  fish:['....BB......','...BBBB.....','x..ssssss...','xxsssssssks.','x..sssssss..','....BB......'],
  crane:['...ww.........','..wwww........','.wwwwwwwwwwkr.','kwwwwwwwwk..kk','..wwww........','...ww.........'],
};
const PXBC={};
function pxBeast(name){ if(PXBC[name]) return PXBC[name]; const rows=PXB[name], h=rows.length, w=Math.max(...rows.map(r=>r.length));
  const c=document.createElement('canvas'); c.width=w+2; c.height=h+2; const g=c.getContext('2d'); const f=(x,y)=>y>=0&&y<h&&x>=0&&x<w&&rows[y][x]&&rows[y][x]!=='.';
  g.fillStyle='#2a1e1a'; for(let y=-1;y<=h;y++) for(let x=-1;x<=w;x++){ if(f(x,y)) continue; if(f(x-1,y)||f(x+1,y)||f(x,y-1)||f(x,y+1)) g.fillRect(x+1,y+1,1,1); }
  for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const ch=rows[y][x]; if(!ch||ch==='.') continue; g.fillStyle=BEAST_PAL[ch]||'#f0f'; g.fillRect(x+1,y+1,1,1); }
  c.bottom=h+1; return PXBC[name]=c; }

/* ---------- pixel landscape painter (low-res canvas, drawn in whole pixels) ---------- */
const PX = {
  r(g,x,y,w,h,c){ g.fillStyle=c; g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h))); },
  // vertical bands with a checker dither between them
  sky(g,W,y0,y1,cols){ const n=cols.length-1; for(let y=y0;y<y1;y++){ const t=(y-y0)/Math.max(1,y1-y0)*n, i=Math.min(n-1,Math.floor(t)), f=t-i;
      if(f<.33||f>.67){ PX.r(g,0,y,W,1,cols[f>.67?i+1:i]); } else { PX.r(g,0,y,W,1,cols[i]); g.fillStyle=cols[i+1]; for(let x=y&1;x<W;x+=2) g.fillRect(x,y,1,1); } } },
  disc(g,cx,cy,r,c){ g.fillStyle=c; for(let y=-r;y<=r;y++){ const w=Math.round(Math.sqrt(r*r-y*y)); g.fillRect(Math.round(cx-w),Math.round(cy+y),w*2+1,1); } },
  orb(g,cx,cy,r,c,glow){ if(glow){ g.fillStyle=glow; for(let y=-r-3;y<=r+3;y++) for(let x=-r-3;x<=r+3;x++){ const d=Math.hypot(x,y); if(d>r&&d<r+3.5&&((x+y)&1)) g.fillRect(Math.round(cx+x),Math.round(cy+y),1,1); } } PX.disc(g,cx,cy,r,c); },
  ridge(g,W,H,base,amp,c,top,R,{jag=1}={}){ const ph=R()*9, ph2=R()*9, ys=[];
    for(let x=0;x<W;x++){ const y=Math.round(base-amp*(.55+.45*Math.sin(x/W*Math.PI*2*1.3+ph))*(.7+.3*Math.sin(x/W*Math.PI*2*3.7+ph2))-jag*(R()<.3?1:0)); ys.push(y); PX.r(g,x,y,1,H-y,c); }
    if(top) for(let x=0;x<W;x++) if(ys[x]<=ys[Math.max(0,x-1)]) PX.r(g,x,ys[x],1,1,top); return ys; },
  cloud(g,x,y,w,c){ PX.r(g,x+2,y,w-4,1,c); PX.r(g,x,y+1,w,2,c); PX.r(g,x+3,y-1,w*.4,1,c); },
  tree(g,x,y,s,R,kind='round',pal){ // trunk + layered canopy blobs: dark rim, mid, light top-left
    const P=pal||{d:'#2a5a30',m:'#3f7f3c',l:'#68ad55',h:'#9ad070',t:'#5e3a20'};
    if(kind==='pine'){ PX.r(g,x-1,y-s*.3,2,s*.3,P.t); for(let i=0;i<4;i++){ const ty=y-s*.25-i*s*.17, w=s*(.42-i*.08); for(let k=0;k<s*.2;k++){ const ww=Math.round(w*(k/(s*.2))); PX.r(g,x-ww,ty-s*.2+k,ww*2+1,1,k<2?P.l:P.m); PX.r(g,x-ww,ty-s*.2+k,1,1,P.d); PX.r(g,x+ww,ty-s*.2+k,1,1,P.d); } } return; }
    PX.r(g,x-Math.max(1,s*.06),y-s*.45,Math.max(2,s*.12),s*.45,P.t); PX.r(g,x-Math.max(1,s*.06),y-s*.45,1,s*.45,'#3e2414');
    const blobs=[[0,-.68,.34],[-.22,-.55,.24],[.22,-.56,.25],[-.1,-.85,.22],[.14,-.82,.2]];
    for(const [dx,dy,r] of blobs) PX.disc(g,x+dx*s,y+dy*s,r*s+1,P.d);
    for(const [dx,dy,r] of blobs) PX.disc(g,x+dx*s,y+dy*s,r*s,P.m);
    for(const [dx,dy,r] of blobs) PX.disc(g,x+dx*s-r*s*.25,y+dy*s-r*s*.3,r*s*.55,P.l);
    for(let i=0;i<s*.6;i++) PX.r(g,x+(R()-.6)*s*.6,y-s*(.6+R()*.4),1,1,kind==='blossom'?(R()<.5?'#fbe0ea':'#f08aa8'):P.h); },
  bamboo(g,x,yb,yt,R){ for(let y=yt;y<yb;y++){ PX.r(g,x,y,2,1,(y-yt)%9===0?'#2f5a2a':'#6aa04a'); PX.r(g,x,y,1,1,(y-yt)%9===0?'#2f5a2a':'#8ac06a'); }
    for(let y=yt+4;y<yb-10;y+=9) if(R()<.6){ const d=R()<.5?-1:1; for(let k=0;k<5;k++) PX.r(g,x+(d>0?2:-1)+d*k,y+Math.floor(k/2),1,1,k<2?'#3f7a3a':'#5a9a48'); } },
  grass(g,x,y,c1,c2){ PX.r(g,x,y-1,1,2,c1); PX.r(g,x-1,y-2,1,1,c2); PX.r(g,x+1,y-2,1,1,c2); },
  flower(g,x,y,c){ PX.r(g,x,y,1,1,c); PX.r(g,x-1,y+1,1,1,c); PX.r(g,x+1,y+1,1,1,c); PX.r(g,x,y+2,1,1,c); PX.r(g,x,y+1,1,1,'#f2d060'); },
  rock(g,x,y,w,h){ for(let j=0;j<h;j++){ const k=j/h, ww=Math.round(w*(.6+.4*Math.sqrt(k))); PX.r(g,x-ww/2,y-h+j,ww,1,j<2?'#b8b2a6':'#8a8478'); PX.r(g,x-ww/2,y-h+j,1,1,'#5a5448'); PX.r(g,x+ww/2-1,y-h+j,1,1,'#5a5448'); } PX.r(g,x-w*.3,y-h*.7,w*.2,1,'#d0cabd'); },
  water(g,W,y0,y1,c1,c2,hl,R){ PX.r(g,0,y0,W,y1-y0,c1); for(let y=y0+2;y<y1;y+=3) for(let i=0;i<W/18;i++) PX.r(g,R()*W,y,2+R()*6,1,R()<.5?c2:hl); },
  lantern(g,x,y,lit){ PX.r(g,x,y-1,1,1,'#2a1e1a'); PX.r(g,x-1,y,3,1,'#e8b84a'); PX.r(g,x-1,y+1,3,2,'#d8413b'); PX.r(g,x,y+1,1,2,lit?'#ffe08a':'#ff9a6a'); PX.r(g,x-1,y+3,3,1,'#e8b84a'); },
  roof(g,x,y,w,c,c2){ for(let j=0;j<6;j++){ PX.r(g,x-w/2-6+j,y+j,w+12-j*2,1,j%2?c:c2); } PX.r(g,x-w/2-7,y-1,3,1,c); PX.r(g,x+w/2+4,y-1,3,1,c); },
  stars(g,W,H,R,n){ for(let i=0;i<n;i++) PX.r(g,R()*W,R()*H,1,1,R()<.2?'#fff6c0':'#cfd6f0'); },
};

/* ---------- moving pixels (drawn every frame on the low-res layer) ---------- */
const PFX = {
  run(kind,g,W,H,t,P,extra){
    if(kind==='petals'||kind==='leaves'){ while(P.length<22) P.push({x:Math.random()*W,y:Math.random()*H,s:Math.random()});
      for(const p of P){ p.y+=.18+p.s*.15; p.x+=Math.sin(t*1.5+p.s*9)*.25; if(p.y>H){ p.y=-2; p.x=Math.random()*W; } PX.r(g,p.x,p.y,1+(p.s>.6),1,kind==='petals'?(p.s>.5?'#f8b8c8':'#fbe0ea'):(p.s>.5?'#c8a040':'#8aa040')); } }
    if(kind==='rain'){ while(P.length<90) P.push({x:Math.random()*W,y:Math.random()*H,s:Math.random()}); g.fillStyle='rgba(200,215,235,.55)';
      for(const p of P){ p.y+=2.4+p.s; p.x-=.4; if(p.y>H){ p.y=-4; p.x=Math.random()*W*1.1; } g.fillRect(Math.round(p.x),Math.round(p.y),1,3); } }
    if(kind==='fireflies'){ while(P.length<18) P.push({x:Math.random()*W,y:H*(.35+Math.random()*.6),s:Math.random()});
      for(const p of P){ p.x+=Math.sin(t*.7+p.s*9)*.15; p.y+=Math.cos(t*.5+p.s*7)*.1; if(Math.sin(t*2.2+p.s*30)>-.2){ g.fillStyle='rgba(255,240,150,.35)'; g.fillRect(Math.round(p.x)-1,Math.round(p.y)-1,3,3); PX.r(g,p.x,p.y,1,1,'#fff6a0'); } } }
    if(kind==='lanterns'){ while(P.length<14) P.push({x:Math.random()*W,y:H*(.2+Math.random()*.8),s:Math.random()});
      for(const p of P){ p.y-=.07+p.s*.06; p.x+=Math.sin(t*.4+p.s*6)*.05; if(p.y<-6){ p.y=H*.85; p.x=Math.random()*W; } g.fillStyle='rgba(255,180,90,.3)'; g.fillRect(Math.round(p.x)-2,Math.round(p.y)-1,5,5); PX.r(g,p.x-1,p.y,3,3,'#e8604a'); PX.r(g,p.x,p.y+1,1,1,'#ffe08a'); } }
    if(kind==='sparks'){ while(P.length<16) P.push({x:0,y:0,life:Math.random(),s:Math.random()}); const [fx,fy]=extra;
      for(const p of P){ p.life+=.012+p.s*.01; if(p.life>1){ p.life=0; p.s=Math.random(); } PX.r(g,fx+Math.sin(t*3+p.s*20)*3*p.life+(p.s-.5)*4,fy-p.life*H*.25,1,1,p.life<.5?'#ffd27a':'#ff7a3a'); } }
    if(kind==='rainwindow'){ while(P.length<30) P.push({x:Math.random(),y:Math.random()}); const [x0,y0,w,h]=extra; g.fillStyle='rgba(200,220,240,.6)';
      for(const p of P){ p.y+=.03; if(p.y>1) p.y=0; g.fillRect(Math.round(x0+p.x*w),Math.round(y0+p.y*h),1,2); } }
  },
  fire(g,x,y,t){ const f=Math.floor(t*8)%3; g.fillStyle='rgba(255,160,60,.18)'; g.fillRect(x-10,y-14,21,16);
    PX.r(g,x-4,y-2,9,2,'#d8413b'); PX.r(g,x-3,y-5-f,7,4+f,'#ff8a3a'); PX.r(g,x-1,y-8+f%2,3,6,'#ffd27a'); PX.r(g,x,y-10+f,1,3,'#fff0c0');
    PX.r(g,x-6,y,13,1,'#5e3a20'); PX.r(g,x-5,y+1,4,1,'#3e2414'); PX.r(g,x+2,y+1,4,1,'#3e2414'); },
  shimmer(g,W,y0,y1,t,c){ for(let i=0;i<10;i++){ const y=y0+((i*7)%(y1-y0)), x=((i*53+t*6*(1+i%3))%(W+20))-10; PX.r(g,x,y,3,1,c); } },
};

/* ---------- scene list ---------- */
// cast entries: {who:'me'|'tang'|'ge'|look, x, y (ground, 0..1), pose, prop, wear, face:1|-1, back, moods:{mood:{pose,prop}}, beast, alpha, s (size)}
const T=()=>LOOK_TANG, G=()=>LOOK_GE;
const OLD_M={g:'m',skin:1,hair:0,hairColor:3,style:'robe',cloth:1}, OLD_M2={g:'m',skin:2,hair:0,hairColor:3,style:'robe',cloth:5};
const PXSCENES = {
  /* ---- 苏小棠 ---- */
  herb:{ gy:.84, fx:'petals', base(g,W,H,R){ const hz=Math.round(H*.5);
      PX.sky(g,W,0,hz,['#9fd3ef','#bfe3f2','#e6f4d8','#f8f0d0']); PX.orb(g,W*.8,H*.12,6,'#fff6d0','#fffbe8'); PX.cloud(g,W*.1,H*.12,20,'#ffffff'); PX.cloud(g,W*.5,H*.2,14,'#f8fbff');
      PX.ridge(g,W,H,hz,H*.12,'#a8cf9a','#c8e4b4',R); PX.ridge(g,W,H,hz+H*.06,H*.08,'#86b874','#a8cf9a',R);
      PX.r(g,0,hz+H*.12,W,H,'#6aa84f');
      for(let r=0;r<6;r++){ const y=Math.round(hz+H*.16+r*H*.045); PX.r(g,0,y,W,1,'#8a5a36'); for(let x=(r%2)*6;x<W;x+=12){ PX.r(g,x,y-3,5,3,r%2?'#4f9a3a':'#7fca5c'); PX.r(g,x+2,y-4,1,1,'#f2f2a0'); } }
      for(let x=0;x<W*.3;x+=7){ PX.r(g,x,hz+H*.08,1,H*.05,'#8a5a36'); } PX.r(g,0,hz+H*.09,W*.3,1,'#8a5a36'); PX.r(g,0,hz+H*.115,W*.3,1,'#8a5a36');
      PX.tree(g,W*.1,hz+H*.13,H*.24,R,'blossom',{d:'#a04a6a',m:'#e07a9a',l:'#f8b0c4',h:'#fff0f4',t:'#5e3a20'}); PX.tree(g,W*.92,hz+H*.12,H*.2,R);
      for(let i=0;i<20;i++) PX.flower(g,R()*W,hz+H*(.14+R()*.3),['#f8b8c8','#fff3a8','#ffffff','#c8b8f8'][i%4]); },
    cast:[{who:'me',beats:[{at:0,x:-.15,pose:'stand',face:1},{at:1,x:.36,pose:'stand',face:1},{at:2,x:.4,pose:'kneel',face:1},{at:5,x:.4,pose:'stand',face:1}]},
          {who:'tang',wear:['basket'],moods:{blush:{pose:'hold',prop:'sachet'}},beats:[{at:0,x:.66,pose:'reach',prop:'herb',face:1},{at:1,x:.66,pose:'reach',prop:'herb',face:-1},{at:3,x:.66,pose:'kneel',prop:'herb',face:-1},{at:5,x:.66,pose:'stand',prop:null,face:-1}]}],
    stage:(g,W,H,p,t,gy)=>FP.herbs(g,W,H,p,t,gy) },
  sunset:{ gy:.8, fx:'fireflies', base(g,W,H,R){ const hz=Math.round(H*.56);
      PX.sky(g,W,0,hz,['#3c2a5a','#7a3a6a','#e0765a','#f8c48a']); PX.orb(g,W*.7,hz-H*.06,9,'#ffdca0','#ffb878'); PX.cloud(g,W*.2,H*.18,26,'#f0a080'); PX.cloud(g,W*.55,H*.12,18,'#c87088');
      PX.ridge(g,W,H,hz,H*.1,'#7a4a6a','#a0607a',R); PX.ridge(g,W,H,hz+H*.03,H*.06,'#5a3456',null,R);
      PX.water(g,W,hz+H*.05,H,'#c86a5a','#e0866a','#f8c48a',R); for(let i=0;i<5;i++) PX.r(g,W*.7-6+i,hz+H*.07+i*4,12-i*2,1,'#ffdca0');
      for(let i=0;i<10;i++){ const x=R()*W, y=hz+H*(.12+R()*.3); PX.r(g,x,y,7,2,'#3f7a4a'); if(R()<.5){ PX.r(g,x+2,y-3,3,3,'#f6b0c0'); PX.r(g,x+3,y-4,1,1,'#fbe0ea'); } }
      for(let i=0;i<30;i++){ const x=R()<.5?R()*W*.18:W*.84+R()*W*.16; PX.r(g,x,hz-2-R()*H*.12,1,H*.14,'#24142a'); }
      PX.rock(g,W*.5,H*.82,W*.48,H*.06); },
    cast:[{who:'me',beats:[{at:0,x:-.15,pose:'stand',face:1},{at:1,x:.44,pose:'sitedge',face:1}]},
          {who:'tang',beats:[{at:0,x:.68,pose:'sitedge',face:1},{at:2,x:.68,pose:'sitedge',face:-1}]}],
    stage:(g,W,H,p,t,gy)=>FP.pier(g,W,H,p,t,gy,.84),
    front:(g,W,H,p,t,gy)=>{ FP.lotus(g,W*.12,H*(gy+.1),p,t,true); FP.lotus(g,W*.9,H*(gy+.07),p,t,false); FP.lotus(g,W*.58,H*(gy+.13),p,t,true); FP.reeds(g,W*.93,H*(gy+.04),p,t,4); } },
  rainpath:{ gy:.9, fx:'rain', base(g,W,H,R){ const hz=Math.round(H*.5);
      PX.sky(g,W,0,hz,['#4a5a6a','#6a7a86','#8a96a0']); PX.ridge(g,W,H,hz,H*.14,'#5a6a72','#6a7a82',R); PX.ridge(g,W,H,hz+H*.05,H*.08,'#46545a',null,R);
      PX.r(g,0,hz+H*.08,W,H,'#3a464c'); for(let i=0;i<50;i++) PX.grass(g,R()*W,hz+H*(.1+R()*.4),'#2e3c38','#46585a');
      for(let y=Math.round(hz+H*.1);y<H;y++){ const t=(y-hz)/(H-hz), w=W*(.06+t*.3); PX.r(g,W*.58-w/2,y,w,1,'#5a5a56'); }
      PX.tree(g,W*.14,H*.85,H*.3,R,'pine',{d:'#1e2e2a',m:'#2e3c38',l:'#46585a',t:'#2a2018'}); PX.tree(g,W*.88,H*.88,H*.26,R,'pine',{d:'#1e2e2a',m:'#2e3c38',l:'#46585a',t:'#2a2018'});
      PX.r(g,W*.5,hz+H*.02,W*.16,H*.06,'#4a3a2a'); PX.roof(g,W*.58,hz-H*.01,W*.16,'#2a2018','#3a2a1e'); PX.r(g,W*.56,hz+H*.035,3,4,'#ffd27a'); },
    cast:[{who:'me',beats:[{at:0,x:-.12,pose:'walk',face:1},{at:1,x:.62,pose:'stand',face:1}]}],
    stage:(g,W,H,p,t,gy)=>FP.puddles(g,W,H,p,t,gy) },
  herbhut:{ gy:.88, fx:'rainwindow', win:[.6,.14,.3,.3], base(g,W,H,R){
      PX.r(g,0,0,W,H,'#5a4028'); for(let x=0;x<W;x+=8) PX.r(g,x+7,0,1,H,'#3a2818'); PX.r(g,0,H*.8,W,H,'#3a2818'); for(let x=0;x<W;x+=10) PX.r(g,x,H*.8,1,H,'#2a1a10');
      const [wx,wy,ww,wh]=[W*.6,H*.14,W*.3,H*.3]; PX.r(g,wx,wy,ww,wh,'#4a5a6a'); PX.r(g,wx,wy+wh*.6,ww,wh*.4,'#3a4a52');
      PX.r(g,wx-2,wy-2,ww+4,2,'#2a1a10'); PX.r(g,wx-2,wy+wh,ww+4,2,'#2a1a10'); PX.r(g,wx-2,wy,2,wh,'#2a1a10'); PX.r(g,wx+ww,wy,2,wh,'#2a1a10'); PX.r(g,wx+ww/2,wy,1,wh,'#2a1a10'); PX.r(g,wx,wy+wh/2,ww,1,'#2a1a10');
      for(const sy of [.24,.44]){ PX.r(g,W*.04,H*sy,W*.4,2,'#8a5a36'); for(let i=0;i<7;i++){ const x=W*.06+i*W*.055; PX.r(g,x,H*sy-6,4,6,['#5fa35a','#c8413b','#e8b84a','#8b5bc5','#4a7fd0'][i%5]); PX.r(g,x+1,H*sy-7,2,1,'#d8c8a8'); } }
      for(let i=0;i<4;i++) PX.r(g,W*.08+i*W*.08,H*.62,8,7,'#b88a4a'); PX.lantern(g,W*.48,H*.3,true);
      g.fillStyle='rgba(255,200,120,.12)'; g.fillRect(W*.3,H*.2,W*.36,H*.6); },
    cast:[{who:'me',beats:[{at:0,x:-.15,pose:'stand',face:1},{at:3,x:.34,pose:'stand',face:1}]},
          {who:'tang',wear:['wet'],beats:[{at:0,x:.64,pose:'crouch',face:1},{at:2,x:.64,pose:'crouch',face:-1},{at:5,x:.64,pose:'kneel',face:-1,wear:['wet','basket']}]}],
    stage:(g,W,H,p,t,gy)=>FP.planks(g,W,H,p,t,gy) },
  lantern:{ gy:.7, fx:'lanterns', base(g,W,H,R){ const hz=Math.round(H*.48);
      PX.sky(g,W,0,hz,['#0a1030','#1a2458','#3a3a78']); PX.stars(g,W,hz*.8,R,50); PX.orb(g,W*.82,H*.1,6,'#f6f0d6','#8a8ac0');
      PX.ridge(g,W,H,hz,H*.08,'#1a1a3a','#2a2a50',R); PX.r(g,0,hz+H*.04,W,H,'#0e1430');
      for(let i=0;i<30;i++){ const x=R()*W, y=hz+H*(.08+R()*.45); PX.lantern(g,x,y,R()<.6); }
      for(let x=0;x<W;x++){ const u=x/W, y=Math.round(H*.7-(1-Math.pow(2*u-1,2))*H*.12); PX.r(g,x,y,1,H*.03,'#4a3a5a'); PX.r(g,x,y,1,1,'#7a6a8a'); PX.r(g,x,y+H*.03,1,2,'#2a1e3a'); if(x%14===0){ PX.r(g,x,y-H*.035,1,H*.035,'#7a6a8a'); } }
      for(let x=0;x<W;x+=2){ const u=x/W, y=Math.round(H*.665-(1-Math.pow(2*u-1,2))*H*.12); PX.r(g,x,y,1,1,'#7a6a8a'); }
      for(let i=0;i<11;i++){ const u=i/10; PX.lantern(g,u*W,H*.14+Math.sin(u*Math.PI)*H*.06,true); } for(let x=0;x<W;x++) PX.r(g,x,H*.14+Math.sin(x/W*Math.PI)*H*.06-1,1,1,'#2a2a40'); },
    cast:[{who:'me',beats:[{at:0,x:.36,pose:'stand',face:1},{at:4,x:.36,pose:'stand',face:1}]},
          {who:'tang',moods:{blush:{pose:'hold',prop:'sachet'}},beats:[{at:0,x:1.2,pose:'lantern',prop:'lantern',face:-1},{at:2,x:.62,pose:'lantern',prop:'lantern',face:-1},{at:4,x:.62,pose:'lantern',prop:'lantern',face:1},{at:5,x:.62,pose:'lantern',prop:'lantern',face:-1}]}],
    stage:(g,W,H,p,t,gy)=>FP.bridge(g,W,H,p,t,gy) },
  /* ---- 顾长歌 ---- */
  bamboo:{ gy:.9, fx:'leaves', base(g,W,H,R){ PX.sky(g,W,0,H,['#e8f4dc','#d0e8c0','#b8d8a8']); PX.ridge(g,W,H,H*.5,H*.1,'#a8cfa0',null,R);
      for(let i=0;i<26;i++){ const x=Math.round(R()*W); PX.bamboo(g,x,H,-5,R); } PX.r(g,0,H*.86,W,H,'#8a6a4a'); for(let x=0;x<W;x+=3) PX.r(g,x,H*.86,2,1,'#a8885a');
      for(let i=0;i<30;i++) PX.grass(g,R()*W,H*(.88+R()*.1),'#4a7a40','#6aa04a'); PX.rock(g,W*.12,H*.9,W*.16,H*.06);
      g.fillStyle='rgba(255,255,230,.12)'; for(let i=0;i<4;i++){ g.beginPath(); g.moveTo(W*(.2+i*.22),0); g.lineTo(W*(.28+i*.22),0); g.lineTo(W*(.12+i*.22),H); g.lineTo(W*(.04+i*.22),H); g.fill(); } },
    cast:[{who:'me',beats:[{at:0,x:-.15,pose:'stand',face:1},{at:1,x:.3,pose:'stand',face:1},{at:3,x:.3,pose:'hold',prop:'wood',face:1},{at:4,x:.3,pose:'sword',prop:'wood',face:1}]},
          {who:'ge',moods:{smile:{pose:'stand',prop:null,wear:['backsword']}},beats:[{at:0,x:.7,pose:'sword',prop:'sword',face:1},{at:1,x:.7,pose:'stand',prop:'sword',face:-1},{at:4,x:.7,pose:'guard',prop:'swordup',face:-1}]}],
    stage:(g,W,H,p,t,gy)=>{ FP.floor(g,W,H,p,t,gy,'#8a7a5a','#a89a70','#b8a050'); FP.stump(g,W*.12,H*gy+2*p,p); FP.stump(g,W*.9,H*gy+3*p,p); } },
  moon:{ gy:.8, fx:'fireflies', base(g,W,H,R){ const hz=Math.round(H*.62); PX.sky(g,W,0,hz,['#0c1228','#1c2850','#3a4a7a']); PX.stars(g,W,hz*.7,R,60); PX.orb(g,W*.7,H*.2,12,'#f6f2dc','#8a96c0');
      PX.cloud(g,W*.2,H*.26,30,'#3a4a7a'); PX.ridge(g,W,H,hz,H*.12,'#28305a','#3a4470',R); PX.ridge(g,W,H,hz+H*.06,H*.06,'#1e2448',null,R);
      for(let x=0;x<W*.72;x++){ const y=Math.round(H*.8+Math.sin(x*.05)*1.5); PX.r(g,x,y,1,H-y,'#0c1020'); PX.r(g,x,y,1,1,'#2a3050'); }
      PX.tree(g,W*.08,H*.8,H*.32,R,'pine',{d:'#0a0e1a',m:'#141c30',l:'#24304a',t:'#0a0e1a'}); },
    cast:[{who:'me',beats:[{at:0,x:-.15,pose:'stand',face:1},{at:2,x:.3,pose:'sit',face:1}]},
          {who:'ge',beats:[{at:0,x:.5,pose:'sit',prop:'swordlap',face:1},{at:1,x:.5,pose:'sit',prop:'swordlap',face:-1},{at:3,x:.5,pose:'sit',prop:'swordlap',face:1},{at:6,x:.5,pose:'sit',prop:'swordlap',face:-1}]}],
    stage:(g,W,H,p,t,gy)=>FP.ledge(g,W,H,p,t,gy,.7) },
  campfire:{ gy:.84, fx:'sparks', fire:[.5,.84], base(g,W,H,R){ PX.sky(g,W,0,H,['#05070e','#0e1420','#1a2030']); PX.stars(g,W,H*.5,R,90);
      for(let i=0;i<9;i++) PX.tree(g,R()*W,H*.78,H*(.25+R()*.2),R,'pine',{d:'#04060a',m:'#0a0e14',l:'#141a22',t:'#04060a'}); PX.r(g,0,H*.78,W,H,'#0a0c10');
      for(let x=W*.76,i=0;i<16;i++){ PX.r(g,x+i,H*.84-i*1.2,32-i*2,1,'#2a2018'); } PX.r(g,W*.76+12,H*.84-8,6,8,'#3a2a1a'); },
    cast:[{who:'me',beats:[{at:0,x:-.15,pose:'stand',face:1},{at:1,x:.28,pose:'stand',face:1},{at:2,x:.28,pose:'sit',face:1}]},
          {who:'ge',beats:[{at:0,x:.7,pose:'sit',prop:'jade',face:-1}]}],
    stage:(g,W,H,p,t,gy)=>{ FP.floor(g,W,H,p,t,gy,'#1a1a1a','#2a2620','#3a3020'); FP.log(g,W*.2,H*gy+p,p,14); FP.log(g,W*.64,H*gy+p,p,14); },
    front:(g,W,H,p,t,gy)=>FP.campfire(g,W*.5,H*gy+3*p,p,t) },
  dusk:{ gy:.88, fx:'leaves', base(g,W,H,R){ const hz=Math.round(H*.6); PX.sky(g,W,0,hz,['#2a1a3a','#6a2a4a','#c85a5a','#f0a070']); PX.orb(g,W*.5,hz-H*.04,10,'#ffc890','#f08060');
      PX.ridge(g,W,H,hz,H*.1,'#5a2a40','#7a3a50',R); PX.ridge(g,W,H,hz+H*.06,H*.06,'#401c30',null,R); PX.r(g,0,H*.84,W,H,'#28101e');
      for(let i=0;i<7;i++) PX.tree(g,R()*W,H*.86,H*(.2+R()*.15),R,'round',{d:'#1a0a12',m:'#2a1420',l:'#3a1e2a',h:'#4a2a34',t:'#1a0a12'});
      for(let i=0;i<3;i++){ const x=W*(.15+i*.12), y=H*(.18+i*.04); PX.r(g,x-4,y,3,1,'#1a0a12'); PX.r(g,x-1,y+1,2,1,'#1a0a12'); PX.r(g,x+1,y,3,1,'#1a0a12'); } },
    cast:[{who:'me',beats:[{at:0,x:.26,pose:'guard',prop:'swordup',face:1},{at:1,x:.38,pose:'guard',prop:'swordup',face:-1},{at:3,x:.38,pose:'sword',prop:'sword',face:-1},{at:5,x:.38,pose:'stand',prop:'sword',face:1}]},
          {who:'ge',moods:{smile:{pose:'stand',prop:null,wear:['backsword']}},beats:[{at:0,x:.74,pose:'guard',prop:'swordup',face:-1},{at:1,x:.62,pose:'guard',prop:'swordup',face:1},{at:3,x:.62,pose:'sword',prop:'sword',face:1},{at:5,x:.62,pose:'stand',prop:'sword',face:-1}]}],
    stage:(g,W,H,p,t,gy)=>FP.floor(g,W,H,p,t,gy,'#2a1420','#3a1e2a','#8a4a3a') },
};

/* ---------- 奇遇 scenes ---------- */
const forestBase=(g,W,H,R,{sky=['#bfe3f2','#e0f0e0'],hz=.55,night=false,trees=4}={})=>{ const y=Math.round(H*hz); PX.sky(g,W,0,y,sky); if(night) PX.stars(g,W,y*.7,R,50);
  PX.ridge(g,W,H,y,H*.1,night?'#28305a':'#a8cf9a',night?'#3a4470':'#c8e4b4',R); PX.ridge(g,W,H,y+H*.05,H*.06,night?'#1e2448':'#86b874',null,R);
  PX.r(g,0,y+H*.08,W,H,night?'#1a2a20':'#6aa84f'); for(let i=0;i<60;i++) PX.grass(g,R()*W,y+H*(.1+R()*.4),night?'#0e1a12':'#4f9a3a',night?'#2a3a2a':'#7fca5c');
  for(let i=0;i<trees;i++){ const x=i%2?R()*W*.2:W*.8+R()*W*.2; PX.tree(g,x,y+H*(.12+R()*.08),H*(.2+R()*.1),R,R()<.4?'pine':'round',night?{d:'#0a120e',m:'#14201a',l:'#1e3026',h:'#2a4032',t:'#0a0e0a'}:undefined); } };
const QY_PX = {
  wounded:{ base:(g,W,H,R)=>{ forestBase(g,W,H,R); PX.tree(g,W*.68,H*.86,H*.32,R); }, cast:[{who:'me',x:.3,face:1},{look:{g:'m',skin:1,hair:0,hairColor:0,style:'robe',cloth:1},x:.66,pose:'sit',face:-1,mood:'sad',wear:['blood']}] },
  ruins:{ base:(g,W,H,R)=>{ PX.sky(g,W,0,H,['#8a96a0','#a8b0b0']); for(let x=0;x<W;x++){ const y=Math.round(H*.12+Math.abs(x-W/2)/W*H*.3); PX.r(g,x,y,1,H,'#6a6258'); PX.r(g,x,y,1,1,'#8a8278'); }
      PX.disc(g,W/2,H*.8,W*.14,'#1a1410'); PX.r(g,W*.36,H*.8,W*.28,H*.2,'#1a1410'); PX.r(g,W*.42,H*.62,W*.16,H*.26,'#5a5248'); PX.r(g,W*.5,H*.62,1,H*.26,'#3a3228');
      for(let i=0;i<6;i++) PX.r(g,W*.45+(i%2)*W*.08,H*(.66+i*.03),3,1,'#e8b84a'); for(let i=0;i<20;i++){ const x=W*(.2+R()*.6); for(let y=H*.2;y<H*(.3+R()*.4);y+=2) PX.r(g,x+Math.sin(y)*1,y,1,2,R()<.5?'#3f7a3a':'#5fa35a'); }
      PX.r(g,0,H*.9,W,H,'#4a443a'); }, cast:[{who:'me',x:.5,y:.98,back:true,face:1}] },
  spring:{ base:(g,W,H,R)=>{ forestBase(g,W,H,R); PX.rock(g,W*.2,H*.78,W*.28,H*.16); PX.rock(g,W*.82,H*.8,W*.26,H*.14); for(let y=H*.8;y<H*.9;y++){ const w=W*.3*Math.sin((y-H*.8)/(H*.1)*Math.PI); PX.r(g,W*.52-w,y,w*2,1,'#7ac0d8'); } }, fx:'steam',
    cast:[{who:'me',x:.34,y:.86,pose:'kneel',face:1}] },
  fox:{ base:(g,W,H,R)=>forestBase(g,W,H,R), cast:[{who:'me',x:.34,pose:'reach',prop:'herb',face:1},{beast:'fox',x:.62,face:-1,s:.55}] },
  hunter:{ base:(g,W,H,R)=>forestBase(g,W,H,R,{trees:6}), cast:[{who:'me',x:.32,face:1},{look:{g:'m',skin:2,hair:1,hairColor:3,style:'jin',cloth:5},x:.66,face:-1,wear:['bow']}] },
  scholar:{ base:(g,W,H,R)=>forestBase(g,W,H,R), cast:[{who:'me',x:.32,pose:'point',face:1},{look:{g:'m',skin:0,hair:0,hairColor:0,style:'robe',cloth:1},x:.66,pose:'walk',face:-1,wear:['bookbox']}] },
  dangkang:{ base:(g,W,H,R)=>{ forestBase(g,W,H,R,{sky:['#9fd3ef','#f8f0d0']}); for(let i=0;i<40;i++) PX.flower(g,R()*W,H*(.66+R()*.3),['#f2d060','#ffffff','#f8b8c8'][i%3]); }, cast:[{who:'me',x:.3,pose:'walk',face:1},{spr:'dangkang',x:.64,face:-1,s:1}] },
  xingxing:{ base:(g,W,H,R)=>{ forestBase(g,W,H,R); for(let x=0;x<W;x++) PX.r(g,x,H*.3+Math.sin(x*.05)*2,1,3,'#5e3a20'); PX.tree(g,W*.85,H*.33,H*.2,R); }, cast:[{who:'me',x:.4,pose:'point',face:1},{spr:'xingxing',x:.68,y:.3,face:-1,s:1}] },
  peddler:{ base:(g,W,H,R)=>forestBase(g,W,H,R), cast:[{who:'me',x:.28,face:1},{look:{g:'m',skin:2,hair:1,hairColor:1,style:'jin',cloth:7},x:.66,face:-1,wear:['pole']}] },
  herbalist:{ base:(g,W,H,R)=>forestBase(g,W,H,R), cast:[{who:'me',x:.3,face:1},{look:{g:'f',skin:1,hair:5,hairColor:3,style:'qun',cloth:5},x:.66,pose:'bow',face:-1,wear:['cane','basket']}] },
  chess:{ base:(g,W,H,R)=>{ forestBase(g,W,H,R,{trees:2}); PX.tree(g,W*.5,H*.78,H*.4,R,'pine'); PX.r(g,W*.42,H*.76,W*.16,3,'#8a8478'); PX.r(g,W*.48,H*.79,W*.04,H*.05,'#6a6458'); for(let i=0;i<8;i++) PX.r(g,W*.43+R()*W*.14,H*.755,1,1,i%2?'#1a1410':'#ffffff'); },
    cast:[{look:OLD_M,x:.26,y:.84,pose:'sit',face:1},{look:OLD_M2,x:.56,y:.84,pose:'sit',face:-1},{who:'me',x:.86,face:-1,s:.85},{beast:'crane',x:.2,y:.2,face:1,s:.5,fly:true}] },
  tomb:{ fx:'rain', base:(g,W,H,R)=>{ forestBase(g,W,H,R,{sky:['#7a8a96','#a0aab0']}); PX.disc(g,W*.62,H*.86,W*.14,'#5a5a4a'); PX.r(g,W*.58,H*.66,W*.08,H*.18,'#8a8478'); PX.r(g,W*.58,H*.66,W*.08,1,'#b8b2a6'); for(let i=0;i<4;i++) PX.r(g,W*.61,H*(.69+i*.035),3,2,'#4a443a'); },
    cast:[{who:'me',x:.32,pose:'bow',face:1}] },
  wenyao:{ fx:'fish', base:(g,W,H,R)=>{ const y=Math.round(H*.6); PX.sky(g,W,0,y,['#0c1228','#1c2850','#3a4a7a']); PX.stars(g,W,y*.7,R,60); PX.orb(g,W*.6,H*.24,14,'#f6f2dc','#8a96c0'); PX.ridge(g,W,H,y,H*.08,'#28305a',null,R); PX.water(g,W,y+2,H,'#2a3460','#3a4a7a','#8a9ac0',R); PX.r(g,0,H*.86,W*.4,H,'#1a2030'); },
    cast:[{who:'me',x:.2,y:.88,back:true,face:1}] },
  lushu:{ base:(g,W,H,R)=>{ forestBase(g,W,H,R); PX.water(g,W,H*.88,H,'#7ab0c8','#9ad0e0','#d8f0f8',R); }, cast:[{who:'me',x:.26,y:.86,pose:'sit',face:1},{beast:'horse',x:.64,y:.86,face:-1,s:1.1}] },
  foxfire:{ fx:'fireflies', base:(g,W,H,R)=>{ forestBase(g,W,H,R,{sky:['#141a3a','#2a2a5a'],night:true}); PX.tree(g,W*.64,H*.84,H*.45,R,'round',{d:'#0a120e',m:'#14201a',l:'#1e3026',h:'#2a4032',t:'#1a120a'}); }, ghostTails:true,
    cast:[{who:'me',x:.32,pose:'kneel',face:1},{beast:'fox',x:.6,face:-1,s:.6}] },
  swordtomb:{ glow:[.62,.82], base:(g,W,H,R)=>{ forestBase(g,W,H,R,{sky:['#c8c0b0','#e8e0d0'],trees:0}); for(let i=0;i<70;i++){ const x=R()*W, y=H*(.66+R()*.32), l=4+R()*5, d=R()<.5?0:(R()<.5?1:-1); for(let k=0;k<l;k++) PX.r(g,x+(k>l*.6?d:0),y-k,1,1,'#8a9098'); PX.r(g,x-1,y-l*.7,3,1,'#5a5048'); } },
    cast:[{who:'me',x:.4,pose:'point',face:1}] },
  danghost:{ fire:[.6,.82], base:(g,W,H,R)=>{ forestBase(g,W,H,R,{sky:['#05070e','#141a28'],night:true,trees:6}); PX.r(g,W*.54,H*.74,W*.12,H*.07,'#2a2420'); PX.r(g,W*.56,H*.72,W*.08,2,'#4a4038'); },
    cast:[{who:'me',x:.28,face:1,mood:'sad'},{look:OLD_M,x:.8,pose:'hold',face:-1,alpha:.5}] },
  baize:{ fx:'steam', base:(g,W,H,R)=>{ PX.sky(g,W,0,H,['#e8eef0','#f4f6f0']); PX.ridge(g,W,H,H*.5,H*.16,'#c8d0cc','#e0e6e2',R); PX.r(g,0,H*.8,W,H,'#a8b4a8'); PX.rock(g,W*.64,H*.82,W*.5,H*.08); PX.tree(g,W*.92,H*.8,H*.3,R,'pine'); },
    cast:[{who:'me',x:.24,y:.9,pose:'bow',face:1},{beast:'baize',x:.64,y:.74,face:-1,s:1.2,glow:true}] },
  qingniao:{ base:(g,W,H,R)=>{ forestBase(g,W,H,R,{trees:1}); for(let x=W*.5;x<W;x++) PX.r(g,x,H*.42+Math.sin(x*.08)*1.5,1,2,'#5e3a20'); PX.tree(g,W*.92,H*.86,H*.5,R,'blossom',{d:'#a04a6a',m:'#e07a9a',l:'#f8b0c4',h:'#fff0f4',t:'#5e3a20'}); },
    cast:[{who:'me',x:.3,pose:'hold',face:1},{beast:'bird',x:.6,y:.42,face:-1,s:.55},{beast:'bird',x:.7,y:.42,face:-1,s:.55},{beast:'bird',x:.8,y:.42,face:-1,s:.55}] },
  zhulong:{ dragon:true, base:(g,W,H,R)=>{ const y=Math.round(H*.66); PX.sky(g,W,0,y,['#2a1a1a','#6a3020','#e0905a']); PX.ridge(g,W,H,y,H*.12,'#3a2020','#5a3028',R); PX.ridge(g,W,H,y+H*.06,H*.06,'#2a1414',null,R); for(let x=0;x<W*.42;x++){ PX.r(g,x,H*.82,1,H,'#1a0e0e'); } },
    cast:[{who:'me',x:.2,y:.83,back:true,face:1,s:.6}] },
};

// small adjustments so the pixel cast stands on the ink paintings
const INK_QY = {
  ruins:{cast:{me:{y:.97, s:.6}}}, wenyao:{cast:{me:{y:.76, x:.3, s:.7}}}, lushu:{cast:{me:{y:.8}, horse:{y:.8}}}, spring:{cast:{me:{y:.84}}},
  danghost:{fire:[.6,.74]}, swordtomb:{glow:[.62,.86]}, baize:{cast:{me:{y:.88}, baize:{y:.68}}}, zhulong:{cast:{me:{y:.81}}},
  xingxing:{cast:{xingxing:{y:.29}}}, qingniao:{cast:{bird:{y:.43}}}, chess:{cast:{me:{y:.86}}},
};
/* ---------- the viewer ---------- */
const PixCG = {
  on:false, parts:[],
  open({base, ink, cast, fx, extra, title, small, seed, pick}){
    const el=$('#cg'); el.hidden=false; el.className='pix'; PixCG.on=true; PixCG.parts=[]; const token=PixCG.token=(PixCG.token||0)+1;
    el.innerHTML=`<canvas id="cgBg" class="px"></canvas><div class="cg-title"><small>${esc(small||'')}</small><b>${esc(title||'')}</b></div>`;
    const cv=$('#cgBg'), dpr=Math.min(2,devicePixelRatio||1), W=cv.width=Math.round(innerWidth*dpr), H=cv.height=Math.round(innerHeight*dpr), g=cv.getContext('2d');
    const BW=160, BH=Math.round(BW*H/W), low=document.createElement('canvas'); low.width=BW; low.height=BH;
    const bake=fn=>{ const c=document.createElement('canvas'); c.width=BW; c.height=BH; fn(c.getContext('2d'),BW,BH,rng(seed||7)); return c; };
    const bakeInk=fn=>{ const c=document.createElement('canvas'); c.width=W; c.height=H; const g2=c.getContext('2d'); fn(g2,W,H,rng(seed||7)); Land.edge(g2,W,H); return c; };
    PixCG.cur={W,H,BW,BH,low,base:ink?null:bake(base),inkBase:ink?bakeInk(ink):null,cast,fx,extra,pick,bake,bakeInk,seed}; let t0=performance.now();
    const loop=now=>{ if(!PixCG.on||PixCG.token!==token) return; PixCG.frame(g,(now-t0)/1000); requestAnimationFrame(loop); };
    PixCG.frame(g,0); requestAnimationFrame(loop); el.classList.remove('go'); void el.offsetWidth; el.classList.add('go');
  },
  swap(o){ const c=PixCG.cur; if(!c) return; Object.assign(c,o); if(o.ink){ c.inkBase=c.bakeInk(o.ink); c.base=null; } else { c.base=c.bake(o.base); c.inkBase=null; } PixCG.parts=[]; const el=$('#cg'); el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap'); },
  frame(g,t){
    const c=PixCG.cur; if(!c) return; const {W,H,BW,BH,low}=c, lg=low.getContext('2d');
    if(c.inkBase){ g.drawImage(c.inkBase,0,0); lg.clearRect(0,0,BW,BH); } else lg.drawImage(c.base,0,0); const ex=c.extra||{};
    if(ex.fire) PFX.fire(lg,Math.round(BW*ex.fire[0]),Math.round(BH*ex.fire[1]),t);
    if(ex.dragon){ for(let i=0;i<=60;i++){ const u=i/60, x=Math.round(-10+u*(BW+20)), y=Math.round(BH*(.22+.08*Math.sin(u*Math.PI*2.4+t*.4)+u*.05)), w=Math.round(2+4*Math.sin(u*Math.PI));
        PX.r(lg,x,y-w,2,w*2,'#c83c28'); PX.r(lg,x,y-w,2,1,'#f07050'); if(i%3===0) PX.r(lg,x,y+w-1,1,1,'#7a1a10'); }
      const hx=BW+4, hy=Math.round(BH*(.22+.08*Math.sin(Math.PI*2.4+t*.4)+.05)); for(let r=12;r>6;r-=2) PX.disc(lg,BW-10,hy-1,r,`rgba(255,220,150,${.08*(13-r)/2})`); PX.disc(lg,BW-8,hy,6,'#c83c28'); PX.r(lg,BW-11,hy-2,3,2,'#fff0c0'); PX.r(lg,BW-10,hy-2,1,1,'#2a1e1a'); }
    if(ex.glow){ const [gx,gy]=ex.glow, x=Math.round(BW*gx), y=Math.round(BH*gy), r=3+Math.round(Math.sin(t*4)); lg.fillStyle='rgba(230,245,255,.35)'; lg.fillRect(x-r*2,y-14-r*2,r*4+1,r*4+1); for(let k=0;k<12;k++) PX.r(lg,x,y-k,1,1,k<2?'#3a2a22':'#eef3f6'); PX.r(lg,x-1,y-3,3,1,'#e8b84a'); }
    if(ex.win) PFX.run('rainwindow',lg,BW,BH,t,PixCG.parts,[BW*ex.win[0],BH*ex.win[1],BW*ex.win[2],BH*ex.win[3]]);
    else if(c.fx==='sparks'&&ex.fire) PFX.run('sparks',lg,BW,BH,t,PixCG.parts,[BW*ex.fire[0],BH*ex.fire[1]-6]);
    else if(c.fx==='steam'){ for(let i=0;i<14;i++){ const x=(i*23+t*5)%BW, y=BH*.72-((t*4+i*9)%30); lg.fillStyle='rgba(255,255,255,.22)'; lg.fillRect(Math.round(x),Math.round(y),6,2); } }
    else if(c.fx==='fish'){ for(let i=0;i<6;i++){ const u=((t*.07+i/6)%1), x=Math.round(BW*(1.1-u*1.25)), y=Math.round(BH*(.55-Math.sin(u*Math.PI)*.22)+i*2); const f=pxBeast('fish'); lg.save(); lg.translate(x+f.width,y); lg.scale(-1,1); lg.drawImage(f,0,0); lg.restore(); } }
    else if(c.fx) PFX.run(c.fx,lg,BW,BH,t,PixCG.parts);
    if(ex.ghostTails){ for(let i=0;i<9;i++){ const a=-Math.PI*.95+i*.11*Math.PI, x0=BW*.6, y0=BH*.8; for(let k=0;k<14;k++){ if((k+Math.floor(t*6))%3===0) continue; PX.r(lg,x0+Math.cos(a)*k*1.6,y0+Math.sin(a)*k*1.4,1,1,'rgba(140,190,255,.5)'); } } }
    g.imageSmoothingEnabled=false; g.drawImage(low,0,0,W,H);
    if(c.inkBase&&c.fx==='lanterns'){ /* lanterns already drawn */ }
    // the cast, big and crisp; they breathe (1px bob) and blink
    const k=Math.max(3,Math.round(Math.min(H*.3,W*.4)/24)), mood=CG.on?CG.face:'normal';
    const fp=Math.max(2,Math.round(k*.72/2));          // the size of one fine pixel (chibis and stage props share it)
    if(c.stage) c.stage(g,W,H,fp,t,c.gy||.86);
    const line=Math.max(0,(CG.lines||1)-1); c.st=c.st||[];
    for(let ci=0;ci<c.cast.length;ci++){ let m=c.cast[ci];
      if(m.beats){ const b=[...m.beats].reverse().find(b=>b.at<=line)||m.beats[0], st=c.st[ci]||(c.st[ci]={x:b.x, face:b.face||1, b});
        if(st.b!==b){ if(b.x!==st.x&&!st.walk) st.walk={from:st.x, to:b.x, t0:t, dur:Math.abs(b.x-st.x)/.2}; if((b.face||1)!==st.face&&b.x===st.x) st.hop=t; st.b=b; }
        let x=st.x, pose=b.pose, face=b.face||1, walking=false;
        if(st.walk){ const u=Math.min(1,(t-st.walk.t0)/st.walk.dur); x=st.walk.from+(st.walk.to-st.walk.from)*u; face=Math.sign(st.walk.to-st.walk.from)||1; walking=u<1; pose=Math.floor(t*6)%2?'walk':'stand';
          if(u>=1){ st.x=st.walk.to; st.walk=null; st.hop=t; } }
        if(!walking&&face!==st.face){ st.face=face; }
        m={...m, ...b, x, face, pose:walking?pose:(b.pose||'stand'), hopY:(st.hop&&t-st.hop<.18)?-fp*2:0}; }
      const base=m, mm=(m.moods&&m.moods[mood])||{}, pose=mm.pose||m.pose||'stand', prop=mm.prop!==undefined?mm.prop:m.prop, wear=mm.wear||m.wear;
      const isNpc=m.who==='tang'||m.who==='ge', blink=(Math.floor(t*10+(m.x*37|0))%38)===0;
      let md=isNpc?(blink&&mood==='normal'?'blink':mood):(m.mood||(blink?'blink':null));
      if(m.who==='ge') md={smile:'subtle', blush:'subtle', sad:'dim'}[md]||md;      // 顾长歌 keeps it quiet
      const look=m.who==='me'?S.look:m.who==='tang'?T():m.who==='ge'?G():m.look;
      let spr, sz=k*(m.s||1);
      if(m.beast) spr=pxBeast(m.beast); else if(m.spr) spr=sprite(m.spr); else spr=cgChibi(look,pose,md,prop,wear,m.back);
      if(m.beast||m.spr) sz=k*(m.s||1)*1.2; else if(spr.fine) sz=fp*(m.s||1);
      const bob=(m.beast&&m.fly)?Math.round(Math.sin(t*2+m.x*9)*sz*2):(Math.floor(t*1.6+m.x*5)%2)*Math.round(sz*.5);
      const w=spr.width*sz, h=spr.height*sz, fx=W*m.x, fy=H*(m.y||c.gy||.86)-(spr.bottom||spr.height)*sz+bob+(m.hopY||0);
      if(fx<-w||fx>W+w) continue;
      g.save(); if(m.alpha) g.globalAlpha=m.alpha+.1*Math.sin(t*2);
      if(m.glow){ const gr=g.createRadialGradient(fx,fy+h*.5,0,fx,fy+h*.5,w*.8); gr.addColorStop(0,'rgba(255,255,230,.45)'); gr.addColorStop(1,'rgba(255,255,230,0)'); g.fillStyle=gr; g.fillRect(fx-w,fy-h*.3,w*2,h*1.6); }
      if((m.face||1)<0){ g.translate(Math.round(fx+w/2),Math.round(fy)); g.scale(-1,1); g.drawImage(spr,0,0,w,h); }
      else g.drawImage(spr,Math.round(fx-w/2),Math.round(fy),w,h);
      g.restore(); }
    if(c.front) c.front(g,W,H,fp,t,c.gy||.86);
  },
  close(){ PixCG.on=false; PixCG.cur=null; const el=$('#cg'); el.hidden=true; el.innerHTML=''; el.className=''; },
};

{ const _line=UI.line; UI.line=function(){ if(CG.on) CG.lines=(CG.lines||0)+1; return _line.apply(UI,arguments); }; }
/* ---------- fine-pixel stage props (same pixel size as the chibis) ---------- */
const FP = {
  r(g,x,y,w,h,p,c){ g.fillStyle=c; g.fillRect(Math.round(x),Math.round(y),Math.round(w*p),Math.round(h*p)); },
  // a wooden pier over the pond, from the left edge to `end`; its top surface is at gy
  pier(g,W,H,p,t,gy,end){ const top=Math.round(H*gy), cols=Math.ceil(W*end/p), y0=top;
    for(let i=0;i<cols;i++){ const x=i*p;
      FP.r(g,x,y0,1,1,p,'#e8b884'); FP.r(g,x,y0+p,1,2,p,i%8===0?'#8a5a36':'#c8945a'); FP.r(g,x,y0+3*p,1,3,p,'#8a5a36'); FP.r(g,x,y0+6*p,1,1,p,'#5e3a20');
      if(i%8===4) FP.r(g,x,y0+p*2,1,1,p,'#a87444'); }
    for(let i=4;i<cols;i+=18){ const x=i*p; FP.r(g,x,y0+7*p,3,12,p,'#5e3a20'); FP.r(g,x,y0+7*p,1,12,p,'#7a4a2a');
      const wl=y0+15*p+Math.round(Math.sin(t*2+i)*p*.6); FP.r(g,x-3*p,wl,9,1,p,'rgba(255,220,170,.55)'); FP.r(g,x-1*p,wl+2*p,5,1,p,'rgba(255,220,170,.35)'); }
    const ex=cols*p; FP.r(g,ex-3*p,y0-5*p,3,18,p,'#5e3a20'); FP.r(g,ex-3*p,y0-5*p,1,18,p,'#7a4a2a'); FP.r(g,ex-4*p,y0-6*p,5,1,p,'#3e2414');
    FP.r(g,ex-3*p,y0-3*p,3,1,p,'#c8413b'); },
  lotus(g,x,y,p,t,bud){ const s=Math.sin(t*1.2+x)*.5;
    for(let j=0;j<3;j++){ const w=[7,11,9][j]; FP.r(g,x-w/2*p,y+j*p,w,1,p,j===0?'#7ab860':'#4f8a3a'); }
    FP.r(g,x-5*p,y+3*p,10,1,p,'#2f5a2a'); FP.r(g,x+p,y,1,3,p,'#2f5a2a');
    if(bud){ FP.r(g,x-p,y-5*p+s,1,5,p,'#3f7a3a'); FP.r(g,x-2*p,y-8*p+s,3,3,p,'#f6b0c4'); FP.r(g,x-p,y-9*p+s,1,1,p,'#fbe0ea'); FP.r(g,x-2*p,y-6*p+s,1,1,p,'#e07a9a'); } },
  // rows of herbs in a dewy field, from y down to the bottom
  herbs(g,W,H,p,t,gy){ const y0=Math.round(H*gy); FP.r(g,0,y0,W/p+1,(H-y0)/p+1,p,'#5f9a48');
    for(let r=0;r<6;r++){ const y=y0+r*7*p; FP.r(g,0,y+5*p,W/p+1,1,p,'#7a5a3a');
      for(let x=(r%2)*5*p;x<W;x+=10*p){ FP.r(g,x,y+p,7,3,p,'#3f7a3a'); FP.r(g,x+p,y,5,2,p,'#5fa35a'); FP.r(g,x+2*p,y-p,3,1,p,'#8ad06a'); if(((x/p)+r)%3===0) FP.r(g,x+3*p,y-2*p,1,1,p,'#fff6c0');
        if(Math.sin(t*3+x+r)>.97) FP.r(g,x+4*p,y,1,1,p,'#ffffff'); } } },
  // a stone bridge deck with a rail and lanterns hung along it
  bridge(g,W,H,p,t,gy){ const y0=Math.round(H*gy), n=Math.ceil(W/p)+1;
    for(let i=0;i<n;i++){ const x=i*p; FP.r(g,x,y0,1,1,p,'#b8b2a6'); FP.r(g,x,y0+p,1,3,p,i%6===0?'#7a7468':'#9a948a'); FP.r(g,x,y0+4*p,1,2,p,'#5a5448');
      if(i%16===8){ FP.r(g,x,y0-9*p,2,9,p,'#5a5448'); FP.r(g,x,y0-9*p,1,9,p,'#7a7468'); FP.r(g,x-p,y0-10*p,4,1,p,'#3a342c');
        const ly=y0-7*p, f=Math.sin(t*4+i)>.5; FP.r(g,x+2*p,ly,1,1,p,'#3a2a22'); FP.r(g,x+p,ly+p,3,4,p,'#d8413b'); FP.r(g,x+2*p,ly+2*p,1,2,p,f?'#fff0b0':'#ffd27a'); } }
    for(let i=0;i<n;i++) FP.r(g,i*p,y0-6*p,1,1,p,'#4a443a'); },
  // a forest floor with fallen leaves, small stones and grass
  floor(g,W,H,p,t,gy,c1,c2,leaf){ const y0=Math.round(H*gy); FP.r(g,0,y0,W/p+1,(H-y0)/p+1,p,c1);
    for(let i=0;i<W/p;i+=3) FP.r(g,i*p,y0,2,1,p,c2);
    for(let k=0;k<60;k++){ const x=((k*53)%Math.ceil(W/p))*p, y=y0+(2+(k*17)%Math.max(3,Math.floor((H-y0)/p-2)))*p; FP.r(g,x,y,2,1,p,k%3?leaf:'#9a8a6a'); if(k%5===0) FP.r(g,x+p,y-p,1,1,p,leaf); } },
  stump(g,x,y,p){ FP.r(g,x-3*p,y-4*p,7,4,p,'#5a8a40'); FP.r(g,x-3*p,y-4*p,7,1,p,'#a8d080'); FP.r(g,x-2*p,y-5*p,5,1,p,'#c8e0a0'); FP.r(g,x-p,y-4*p,1,4,p,'#3a6a30'); },
  ledge(g,W,H,p,t,gy,end){ const y0=Math.round(H*gy), n=Math.ceil(W*end/p);
    for(let i=0;i<n;i++){ const x=i*p, d=Math.round(Math.sin(i*.4)*1.2); FP.r(g,x,y0+d*p,1,1,p,'#4a4a5a'); FP.r(g,x,y0+(d+1)*p,1,(H-y0)/p,p,i%5===0?'#1a1e2c':'#24283a'); }
    for(let i=2;i<n;i+=7){ FP.r(g,i*p,y0-2*p,1,2,p,'#3a5a3a'); FP.r(g,(i+1)*p,y0-3*p,1,3,p,'#4a6a4a'); } },
  campfire(g,x,y,p,t){ const f=Math.floor(t*8)%3;
    const gr=g.createRadialGradient(x,y-6*p,0,x,y-6*p,40*p); gr.addColorStop(0,'rgba(255,170,70,.35)'); gr.addColorStop(1,'rgba(255,170,70,0)'); g.fillStyle=gr; g.fillRect(x-40*p,y-46*p,80*p,80*p);
    for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; FP.r(g,x+Math.cos(a)*7*p-p,y+Math.sin(a)*2*p,3,2,p,'#7a7468'); }
    FP.r(g,x-6*p,y-2*p,12,2,p,'#5e3a20'); FP.r(g,x-5*p,y-4*p,10,2,p,'#7a4a2a');
    FP.r(g,x-4*p,y-7*p-f*p,8,4+f,p,'#e8502a'); FP.r(g,x-3*p,y-10*p+f*p%2,6,5,p,'#ff9a3a'); FP.r(g,x-1*p,y-13*p+f*p,3,5,p,'#ffd27a'); FP.r(g,x,y-15*p+f*p,1,2,p,'#fff4c0');
    for(let k=0;k<6;k++){ const u=((t*.8+k/6)%1); FP.r(g,x+Math.sin(t*3+k*2)*4*p,y-14*p-u*30*p,1,1,p,u<.5?'#ffd27a':'#ff7a3a'); } },
  log(g,x,y,p,w){ FP.r(g,x,y-3*p,w,3,p,'#7a4a2a'); FP.r(g,x,y-3*p,w,1,p,'#a87444'); FP.r(g,x,y-3*p,2,3,p,'#c89060'); FP.r(g,x+p*.5,y-2*p,1,1,p,'#7a4a2a'); },
  puddles(g,W,H,p,t,gy){ const y0=Math.round(H*gy); FP.r(g,0,y0,W/p+1,(H-y0)/p+1,p,'#4a4a44');
    for(let i=0;i<W/p;i+=5) FP.r(g,i*p,y0+((i*7)%5)*p,3,1,p,'#5a5a52');
    for(let k=0;k<5;k++){ const x=W*(.1+k*.2), y=y0+(4+k%3*3)*p; FP.r(g,x-6*p,y,12,2,p,'#6a7a86'); const r=((t*1.5+k*.3)%1)*6; FP.r(g,x-r*p,y,Math.max(1,r*2),1,p,'#a8b8c4'); } },
  planks(g,W,H,p,t,gy){ const y0=Math.round(H*gy); FP.r(g,0,y0,W/p+1,(H-y0)/p+1,p,'#6a4a2a');
    for(let r=0;r*4*p<H-y0;r++){ FP.r(g,0,y0+r*4*p,W/p+1,1,p,'#4a3018'); for(let i=(r%2)*9;i<W/p;i+=18) FP.r(g,i*p,y0+r*4*p,1,4,p,'#4a3018'); }
    FP.r(g,0,y0,W/p+1,1,p,'#8a6a40'); },
  reeds(g,x,y,p,t,n){ for(let i=0;i<n;i++){ const h=10+((i*7)%6), bx=x+i*3*p, sw=Math.round(Math.sin(t*1.5+i)*.6);
    for(let j=0;j<h;j++) FP.r(g,bx+(j>h*.6?sw*p:0),y-j*p,1,1,p,j<3?'#3a4a2a':'#5a6a3a'); FP.r(g,bx+sw*p,y-(h+3)*p,1,3,p,'#8a6a4a'); } },
};
/* ---------- heart events use the pixel scenes ---------- */
// where the pixel cast stands on each ink painting
const INK_ROM = { herb:{gy:.78}, sunset:{gy:.78}, rainpath:{gy:.8}, herbhut:{gy:.78, win:[.62,.14,.28,.32]}, lantern:{gy:.728},
  bamboo:{gy:.79}, moon:{gy:.79}, campfire:{gy:.78}, dusk:{gy:.79} };
const romSetup=scene=>{ const sc=PXSCENES[scene], ink=SCENES_INK[scene], k=INK_ROM[scene]||{};
  const cast=sc.cast.map(m=>{ const c={...m}; if(ink){ if(k.y) c.y=k.y; else if(c.y&&scene!=='rainpath') delete c.y; } return c; });
  const more={stage:sc.stage, front:sc.front, st:[]};
  return ink ? {ink:ink.base, cast, fx:sc.fx==='sparks'?null:sc.fx, extra:{fire:k.fire, win:k.win||sc.win}, gy:k.gy||ink.ground||.88, ...more} : {base:sc.base, cast, fx:sc.fx, extra:{fire:sc.fire, win:sc.win}, gy:sc.gy, ...more}; };
CG.open=function(scene, who, title){
  CG.on=true; CG.who=who; CG.face='normal'; const s=romSetup(scene);
  CG.lines=0; PixCG.open({...s, title, small:'心动事件 · '+NPCS[who].name, seed:scene.length*97});
  Object.assign(PixCG.cur,{gy:s.gy, stage:s.stage, front:s.front, st:[]}); Music.play('romance', true);
};
CG.setScene=function(scene){ if(!PXSCENES[scene]||!PixCG.cur) return; PixCG.swap(romSetup(scene)); };
CG.setFace=function(f){ CG.face=f; };
CG.close=function(){ CG.on=false; CG.who=null; PixCG.close(); Music.play(areaTheme(),true); };

/* ---------- 奇遇 scenes ---------- */
const QyCG = {
  on:false,
  open(q){ const sc=QY_PX[q.id]; if(!sc) return; QyCG.on=true; const ink=QY_INK[q.id], k=INK_QY[q.id]||{};
    const cast=sc.cast.map(m=>({...m, ...(k.cast&&k.cast[m.who||m.beast||m.spr||'npc']||{})}));
    PixCG.open({base:sc.base, ink:ink&&ink.base, cast, fx:k.fx!==undefined?k.fx:sc.fx, extra:{fire:k.fire||sc.fire, glow:k.glow||sc.glow, dragon:sc.dragon, ghostTails:sc.ghostTails}, title:q.title, small:'奇遇 · '+Qiyu.TIER[q.tier], seed:q.id.length*131});
    PixCG.cur.gy=ink?(ink.gy||.86):(sc.gy||.86); },
  close(){ if(!QyCG.on) return; QyCG.on=false; PixCG.close(); },
};
{ const _q=Hooks.qiyu; Hooks.qiyu=function(o){ const q=QIYU.find(x=>x.id===(S.qiyu&&S.qiyu.ev)); if(q) QyCG.open(q); return _q.call(Hooks,o); }; }
Qiyu.pickFor=function(){ QyCG.close(); UI.say([{choice:'触发哪个奇遇？', options:QIYU.map(q=>({text:`【${Qiyu.TIER[q.tier]}】${q.title}`, fn:()=>{ S.qiyuSeen=S.qiyuSeen||{}; S.qiyuSeen[q.id]=(S.qiyuSeen[q.id]||0)+1; QyCG.open(q); const st=q.run(); if(st) UI.say(st, ()=>setTimeout(()=>Qiyu.pickFor(),300)); }}))}]); };
{ const _cd=UI.closeDlg; UI.closeDlg=function(){ const r=_cd.apply(UI,arguments); if(QyCG.on) setTimeout(()=>{ if(QyCG.on && $('#dlg').hidden && !Battle.s) QyCG.close(); },60); return r; }; }
{ const _bs=Battle.start; Battle.start=function(){ if(QyCG.on) QyCG.close(); return _bs.apply(Battle,arguments); }; }
