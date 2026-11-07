/* ============================================================
   山海问道 · 第三章「京城」 · 城里的东西（七）：贡院前 — the 擂台 (a raised stone platform with red posts and a rope rail),
   the 高台 (a viewing stand under a yellow canopy: 天子 on the throne, 萧烬 standing at his right hand, and behind the
   throne someone in black with a bronze 饕餮 mask — the 国师), the 观天鉴 (a great bronze mirror on a stand), and the
   war drums. Then the picture 「开幕式的高台」.
   ============================================================ */
const LOOK_TIANZI={g:'m',skin:1,hair:0,hairColor:0,style:'robe',cloth:7};    // 天子: the yellow robe
const LOOK_GUOSHI={g:'m',skin:1,hair:0,hairColor:0,style:'robe',cloth:5};    // 国师: black, and the mask over his face
// paint the bronze mask over a figure's face, on a copy of its canvas (fy: the face's height as a share of the figure)
// the 国师's mask: a bronze 饕餮 face in pixel art, fitted over wherever the face is (found by its skin tone), symmetric —
// curled horns, gold brows, ringed eyes with slit pupils, the nose ridge, a mouth full of teeth, patina in the hollows
const JA7_mask=(src,fy,rw=.15,rh=.105)=>{ const c=document.createElement('canvas'); c.width=src.width; c.height=src.height; const g=c.getContext('2d'); g.drawImage(src,0,0); c.bottom=src.bottom;
  const W=c.width, H=c.height, D=g.getImageData(0,0,W,H).data; let x0=W, x1=-1, y0=H, y1=-1;
  const skin=(x,y)=>{ const i=(y*W+x)*4, r=D[i], gg=D[i+1], b=D[i+2]; return D[i+3]>200&&r>190&&gg>140&&b>100&&r-b>35&&r>=gg; };
  // the face is the first block of rows with skin in it, from the top; the hands further down are left alone
  let top=-1; for(let y=0;y<H&&top<0;y++) for(let x=0;x<W;x++) if(skin(x,y)){ top=y; break; }
  if(top>=0) for(let y=top;y<H;y++){ let any=false; for(let x=0;x<W;x++) if(skin(x,y)){ any=true; if(x<x0) x0=x; if(x>x1) x1=x; } if(!any) break; if(y<y0) y0=y; y1=y; }
  if(x1<0){ x0=Math.round(W/2-W*rw); x1=Math.round(W/2+W*rw); y0=Math.round(H*fy-H*rh); y1=Math.round(H*fy+H*rh); }
  // work in cells: one cell is u×u pixels, so a big CG face gets bold features and a small map face still reads
  const u=Math.max(1,Math.round((x1-x0+3)/9)), cols=Math.max(7,Math.round((x1-x0+3)/u)), rows=Math.max(6,Math.round((y1-y0+2)/u)), L=Math.round((x0+x1)/2-cols*u/2), T=y0;
  const P=(cx,cy,col)=>{ g.fillStyle=col; g.fillRect(L+cx*u,T+cy*u,u,u); }, M=(cx,cy,col)=>{ P(cx,cy,col); P(cols-1-cx,cy,col); };
  const dk='#1a1408', br='#4a5232', bm='#66703e', pt='#7fa07a', au='#c8a040', al='#ecd070', tooth='#e8e0c8';
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){ const edge=x===0||x===cols-1||y===rows-1; P(x,y,edge?dk:((x*3+y*5)%7===0?pt:(y<rows*.5?bm:br))); }
  // the horns, curling up and out above the brow
  M(0,-1,au); M(-1,-2,au); M(-1,-3,al); M(0,-3,dk); M(1,-1,al);
  // brows: a gold band from the edge to the middle, with a curl
  const ey=Math.max(2,Math.round(rows*.4)), mid=Math.floor((cols-1)/2); for(let x=1;x<=mid;x++) M(x,ey-2,au); M(1,ey-1,au); M(mid,ey-3,al);
  // the eyes: gold rings, a red glint, black slit pupils
  const ex=Math.max(2,Math.round(cols*.27)); for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[1,-1],[-1,1]]) M(ex+dx,ey+dy,(dx&&dy)?bm:au); M(ex,ey,dk); M(ex,ey-1,'#e83a20');
  // the nose ridge down the middle, the nostril curls
  for(let y=0;y<=ey+1;y++){ P(mid,y,y%2?al:au); if(cols%2===0) P(mid+1,y,y%2?al:au); } M(mid-1,ey+2,au);
  // the mouth: a dark band, a row of teeth, fangs at the corners
  const my=Math.min(rows-2,ey+3); for(let x=1;x<cols-1;x++){ P(x,my,dk); if(x%2) P(x,my-1,tooth); } M(1,my+1,tooth); M(2,my+1,dk);
  // spiral 云雷纹 on the cheeks
  if(rows>=8){ M(1,my-2,pt); M(2,my-2,au); M(2,my-3,pt); }
  return c; };
const JA7={
  leitai(){ return FineArt.paint(120,64,P=>{ const st='#9a948a', stl='#b8b2a6', stk='#6a655c', red='#9a2a22';
    P.rect(4,24,112,38,stk); for(let r=0;r<4;r++) for(let k=0;k<14;k++) P.rect(5+k*8+(r%2?4:0),36+r*6,7,5,'#7a756c');                 // the stone sides
    P.rect(2,14,116,12,st); P.rect(2,14,116,1,stl); for(let k=0;k<12;k++) P.rect(4+k*10,16,9,8,k%2?'#a8a296':st);                         // the top, flagged
    P.rect(40,15,40,10,'#8a2420'); P.rect(40,15,40,1,'#b03a30');                                                                             // red cloth in the middle
    for(const x of [3,114]) { P.rect(x,0,3,26,red); P.rect(x-1,0,5,2,'#e8b84a'); } P.line(5,4,114,4,'#c8a050'); P.line(5,9,114,9,'#c8a050'); // posts and the rope rail
    P.rect(52,52,16,10,'#7a756c'); for(let k=0;k<3;k++) P.rect(54,52+k*3,12,2,stl); }); },                                                  // steps up the front
  gaotai(){ return FineArt.paint(176,96,P=>{ const red='#8a2420', gd='#d8b048';
      P.rect(8,52,160,44,'#6a645c'); for(let r=0;r<5;r++) for(let k=0;k<20;k++) P.rect(9+k*8+(r%2?4:0),56+r*8,7,6,'#7e786e');              // the stone base
      P.rect(6,48,164,6,'#4a2a16'); for(let x=8;x<168;x+=6) P.rect(x,40,2,8,red); P.rect(6,38,164,3,red);                                     // the floor's edge and the red balustrade
      P.rect(16,6,4,34,red); P.rect(156,6,4,34,red); P.poly([[4,8],[24,0],[152,0],[172,8],[160,10],[16,10]],'#e0aa3e'); P.rect(16,10,144,2,'#b8862d');   // the canopy, yellow
      for(let x=20;x<156;x+=8) P.poly([[x,12],[x+8,12],[x+4,16]],'#e0aa3e');
      P.rect(72,20,32,22,'#5e2018'); P.rect(74,22,28,6,gd); P.rect(70,40,36,4,'#4a1a10');                            // the throne
      P.rect(80,84,16,12,'#7e786e'); for(let k=0;k<3;k++) P.rect(82,84+k*4,12,2,'#9a948a'); }); },                                              // steps
  jian(){ return FineArt.paint(36,52,P=>{ P.rect(16,26,4,24,'#5e4a2a'); P.rect(8,48,20,4,'#4a3a20'); P.rect(10,46,16,2,'#6a5432');
    P.ell(18,18,15,17,'#7a5a24'); P.ell(18,18,13,15,'#a8803a'); P.ell(18,18,11,13,'#c8d4d8'); P.ell(15,14,5,6,'#e8f0f4');                     // the bronze rim, the polished face
    for(let k=0;k<12;k++){ const a=k/12*Math.PI*2; P.set(18+Math.cos(a)*14,18+Math.sin(a)*16,'#e8c050'); } P.rect(14,0,8,3,'#7a5a24'); }); },
  drum(){ return FineArt.paint(24,24,P=>{ for(const x of [3,19]) P.rect(x,10,2,13,'#5e3a20'); P.ell(12,12,10,8,'#9a2a22'); P.ell(12,12,8,6,'#e8d8b0'); P.ell(12,12,6,4,'#d8c8a0');
    for(let k=0;k<10;k++){ const a=k/10*Math.PI*2; P.set(12+Math.cos(a)*9,12+Math.sin(a)*7,'#e8b84a'); } }); },
};
Object.assign(SPR,{jc_leitai:['x'], jc_gaotai:['x'], jc_jian:['x'], jc_drum:['x']});
Object.assign(SPRC,{jc_leitai:JA7.leitai(), jc_jian:JA7.jian(), jc_drum:JA7.drum()});
// the 高台 with the three of them on it: drawn once their sprites are ready
{ const base=JA7.gaotai(), c=document.createElement('canvas'); c.width=base.width; c.height=base.height; const g=c.getContext('2d'); g.drawImage(base,0,0);
  const put=(sp,x,y)=>g.drawImage(sp,Math.round(x-sp.width/2),Math.round(y-sp.height));
  put(JA7_mask(lookSprite(LOOK_GUOSHI,'down',0),.36,.3,.12),70,30); put(lookSprite(LOOK_TIANZI,'down',0),88,44); put(lookSprite(LOOK_XIAO,'down',0),112,46);
  c.bottom=c.height; SPRC.jc_gaotai=c; }
