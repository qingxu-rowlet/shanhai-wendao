/* ============================================================
   山海问道 · 美术 — the world art.
   Each map's ground is painted once into one picture: patchy grass, paths and ponds with soft wobbly edges,
   sandy shores, deep water, shade under cliffs. Trees are painted with light and shade.
   Every frame adds water glints, drifting cloud shadows, petals / leaves / fireflies and an evening glow.
   ============================================================ */
const ART = {
  hash(x,y,s){ let h=(x*374761393+y*668265263+(s||0)*2147483647)|0; h=Math.imul(h^(h>>>13),1274126177); return ((h^(h>>>16))>>>0)/4294967296; },
  // smooth value noise
  noise(x,y,sc,s){ const fx=x/sc, fy=y/sc, ix=Math.floor(fx), iy=Math.floor(fy), tx=fx-ix, ty=fy-iy, H=ART.hash;
    const u=tx*tx*(3-2*tx), v=ty*ty*(3-2*ty), a=H(ix,iy,s), b=H(ix+1,iy,s), c=H(ix,iy+1,s), d=H(ix+1,iy+1,s);
    return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; },
  rgb(hex){ const n=parseInt(hex.slice(1),16); return [n>>16&255, n>>8&255, n&255]; },
};
const SOFT = new Set(['.', ',', ':', '=', '~']);
const GROUNDC = {};
function groundCanvas(id){
  if(GROUNDC[id]) return GROUNDC[id];
  const m=MAPS[id], W=m.w*16, H=m.h*16, N=ART.noise, HS=ART.hash;
  const ta=(x,y)=>(x<0||y<0||x>=m.w||y>=m.h)?'W':(m.ground[y][x]||'.');
  // 1) what each pixel is: soft ground wobbles across tile edges, hard ground (stone, cliff, bridge, fence) stays square
  // water and path are smooth fields (blended between tile centres) so corners come out round, with a little wobble
  const field=(ch,px,py)=>{ const fx=(px+.5)/16-.5, fy=(py+.5)/16-.5, ix=Math.floor(fx), iy=Math.floor(fy), u=fx-ix, v=fy-iy, one=(x,y)=>{ const t=ta(x,y); return t===ch||(ch==='~'&&t==='B')||(ch==='='&&(t==='#'||t==='B'||(t==='W'&&(x<0||y<0||x>=m.w||y>=m.h))))?1:0; };
    return one(ix,iy)*(1-u)*(1-v)+one(ix+1,iy)*u*(1-v)+one(ix,iy+1)*(1-u)*v+one(ix+1,iy+1)*u*v; };
  const type=new Array(W*H);
  for(let py=0;py<H;py++) for(let px=0;px<W;px++){
    let t=ta(px>>4, py>>4);
    if(SOFT.has(t)){ const wob=(N(px,py,10,1)-.5)*.3+(N(px,py,3,5)-.5)*.06;
      if(field('~',px,py)+wob>.5) t='~'; else if(field('=',px,py)+wob*.8>.42) t='='; else if(t==='~'||t==='=') t='.'; }
    type[py*W+px]=t;
  }
  const isG=t=>t==='.'||t===','||t===':';
  // 2) distance to water / to land (chamfer), for shores and deep water
  const BIG=99, dW=new Float32Array(W*H), dL=new Float32Array(W*H);
  for(let i=0;i<W*H;i++){ const w=type[i]==='~'||type[i]==='B'; dW[i]=w?0:BIG; dL[i]=w?BIG:0; }
  const cham=d=>{ for(let y=0;y<H;y++) for(let x=0;x<W;x++){ const i=y*W+x; let v=d[i]; if(x>0) v=Math.min(v,d[i-1]+1); if(y>0){ v=Math.min(v,d[i-W]+1); if(x>0) v=Math.min(v,d[i-W-1]+1.4); if(x<W-1) v=Math.min(v,d[i-W+1]+1.4); } d[i]=v; }
    for(let y=H-1;y>=0;y--) for(let x=W-1;x>=0;x--){ const i=y*W+x; let v=d[i]; if(x<W-1) v=Math.min(v,d[i+1]+1); if(y<H-1){ v=Math.min(v,d[i+W]+1); if(x<W-1) v=Math.min(v,d[i+W+1]+1.4); if(x>0) v=Math.min(v,d[i+W-1]+1.4); } d[i]=v; } };
  cham(dW); cham(dL);
  // 3) paint
  const c=document.createElement('canvas'); c.width=W; c.height=H; const g=c.getContext('2d'), img=g.createImageData(W,H), D=img.data;
  const GR=['#4f9a3c','#5ea843','#69b54b','#74c055','#82cb5f'].map(ART.rgb), PA=['#c49a64','#cfa874','#d8b47e','#e0bf8c'].map(ART.rgb), SAND=ART.rgb('#e2cc94'), SAND2=ART.rgb('#cdb37a');
  const WA=['#9fdcf5','#6cc0ea','#4aa3dc','#3b8cc8','#2f78b4'].map(ART.rgb), EDGE=ART.rgb('#a8835a'), GEDGE=ART.rgb('#558f3a');
  const texc={}; const tex=(ch,v)=>{ const k=ch+v; if(!texc[k]) texc[k]=tileCanvas(ch,v,0).getContext('2d').getImageData(0,0,16,16).data; return texc[k]; };
  const near=(px,py,r,fn)=>{ for(let dy=-r;dy<=r;dy++) for(let dx=-r;dx<=r;dx++){ const x=px+dx,y=py+dy; if(x<0||y<0||x>=W||y>=H) continue; if(fn(type[y*W+x])) return true; } return false; };
  for(let py=0;py<H;py++) for(let px=0;px<W;px++){
    const i=py*W+px, t=type[i]; let col;
    if(isG(t)){
      // big soft patches of lighter/darker grass, plus fine speckle
      const n=N(px,py,40,3)*.55+N(px,py,11,4)*.3+HS(px,py,5)*.25; col=GR[Math.max(0,Math.min(4,Math.floor(n*5-.4)))];
      if(dW[i]<=2.2) col=dW[i]<=1.2?SAND2:SAND;                                   // sandy shore
      else if(near(px,py,1,u=>u==='=')) col=GEDGE;                                 // grass darkens where it meets the path
      // shade under cliffs
      let sh=0; for(let k=1;k<=6;k++){ if(py-k>=0&&type[(py-k)*W+px]==='W'){ sh=(7-k)/7; break; } }
      if(sh) col=col.map(v=>v*(1-.32*sh));
    } else if(t==='='){
      const n=N(px,py,9,6)*.7+HS(px,py,7)*.3; col=PA[Math.min(3,Math.floor(n*4))];
      if(near(px,py,1,u=>isG(u))) col=PA[0].map((v,k)=>v*.82+EDGE[k]*.18);
      if(HS(px,py,8)<.012) col=ART.rgb('#9a7a52');                                  // pebbles
    } else if(t==='~'){
      const d=dL[i], n=N(px,py,14,9)*.6; col=WA[Math.min(4,Math.floor(d/2.2+n))];
      if(d<=1.2) col=ART.rgb('#d9f2fb');                                          // foam line
    } else {
      const tx=tex(t,((px>>4)*7+(py>>4)*13^((px>>4)*(py>>4)))&3), j=((py&15)*16+(px&15))*4; col=[tx[j],tx[j+1],tx[j+2]];
      if(t==='W'){ const below=type[Math.min(H-1,py+1)*W+px]; if(below!=='W'&&(py&15)>=12) col=col.map(v=>v*.75); }
    }
    D[i*4]=col[0]; D[i*4+1]=col[1]; D[i*4+2]=col[2]; D[i*4+3]=255;
  }
  g.putImageData(img,0,0);
  // 4) details per tile: tufts, flowers, tall grass, stones on cliffs
  const R=rng(id.length*977+W);
  const px=(x,y,col)=>{ g.fillStyle=col; g.fillRect(x,y,1,1); };
  for(let ty=0;ty<m.h;ty++) for(let tx=0;tx<m.w;tx++){
    const t=ta(tx,ty), X=tx*16, Y=ty*16;
    if(t==='.'){ for(let k=0;k<2;k++) if(R()<.45){ const x=X+2+R()*12|0, y=Y+4+R()*10|0; if(!isG(type[y*W+x])||dW[y*W+x]<3) continue; px(x,y,'#3f8432'); px(x-1,y-1,'#4f9a3c'); px(x+1,y-1,'#4f9a3c'); px(x,y-2,'#8fd468'); }
      if(R()<.12){ const x=X+3+R()*10|0, y=Y+3+R()*10|0; if(isG(type[y*W+x])&&dW[y*W+x]>3){ const fc=['#fff6d0','#f5b3c8','#c9b8f5'][R()*3|0]; px(x,y,fc); } } }
    if(t===','){ for(let k=0;k<4;k++){ const x=X+2+R()*12|0, y=Y+2+R()*12|0, fc=['#fff3a8','#f5a3c0','#ffffff','#b9a3f5','#f2c14e'][R()*5|0]; px(x,y+1,'#3f8432'); px(x-1,y,fc); px(x+1,y,fc); px(x,y-1,fc); px(x,y,'#e8b84a'); } }
    if(t===':'){ for(let k=0;k<9;k++){ const x=X+1+R()*14|0, y=Y+5+R()*11|0, hgt=3+R()*4|0, lean=R()<.5?-1:1;
        for(let s=0;s<hgt;s++) px(x+(s>hgt/2?lean:0),y-s, s===hgt-1?'#9ad870':s>hgt/2?'#5fae43':'#3f8a33'); } }
    if(t==='W'&&ta(tx,ty+1)!=='W'&&R()<.5){ const x=X+3+R()*9|0; g.fillStyle='#6f604e'; g.fillRect(x,Y+9,4,3); g.fillStyle='#a8957a'; g.fillRect(x,Y+9,3,1); }
    if(t==='W'&&ta(tx,ty-1)!=='W'&&ty>0){ g.fillStyle='#5f9e43'; for(let x=0;x<16;x++) if(HS(X+x,Y,11)<.55) g.fillRect(X+x,Y,1,1+(HS(X+x,Y,12)*3|0)); }
  }
  // lily pads on bigger ponds
  for(let k=0;k<40;k++){ const x=R()*W|0, y=R()*H|0, i=y*W+x; if(type[i]!=='~'||dL[i]<4) continue; if(R()<.75) continue;
    g.fillStyle='#4f9a3c'; g.beginPath(); g.ellipse(x+.5,y+.5,3,2,0,.4,Math.PI*2-.2); g.fill(); g.fillStyle='#74c055'; g.fillRect(x-1,y-1,2,1); if(R()<.4){ px(x+1,y-2,'#f7c3d4'); px(x+2,y-2,'#fbe0ea'); } }
  c.type=type; c.dL=dL; return GROUNDC[id]=c;
}
function drawGround(g, ox, oy, T, Z){
  const c=groundCanvas(RT.mapId); g.imageSmoothingEnabled=false; g.drawImage(c, ox, oy, c.width*Z, c.height*Z);
  // twinkles on open water, sliding ripples
  const W=c.width, H=c.height, x0=Math.max(0,Math.floor(-ox/Z)), y0=Math.max(0,Math.floor(-oy/Z)), x1=Math.min(W,x0+Math.ceil(cv.width/Z)+1), y1=Math.min(H,y0+Math.ceil(cv.height/Z)+1);
  const t=RT.t;
  for(let y=y0;y<y1;y+=3) for(let x=x0;x<x1;x+=3){ const i=y*W+x; if(c.type[i]!=='~'||c.dL[i]<2.5) continue; const h=ART.hash(x,y,21); if(h>.18) continue;
    const ph=(t*.6+h*40)%4; if(ph>1.2) continue; const a=Math.sin(ph/1.2*Math.PI);
    g.fillStyle=`rgba(255,255,255,${.75*a})`; const len=h<.06?3:2; g.fillRect(ox+(x+Math.sin(t+h*9)*1.5)*Z, oy+y*Z, len*Z, Z); }
}

/* ---------- trees with light and shade ---------- */
function paintTree(kind, seed){
  const R=rng(seed*7919+kind.length), W=kind==='bush'?20:30, Hh=kind==='bush'?16:kind==='pine'?40:38;
  const c=document.createElement('canvas'); c.width=W; c.height=Hh; const g=c.getContext('2d');
  const mask=new Uint8Array(W*Hh), shade=new Float32Array(W*Hh);
  const ball=(cx,cy,r)=>{ for(let y=Math.floor(cy-r);y<=cy+r;y++) for(let x=Math.floor(cx-r);x<=cx+r;x++){ if(x<0||y<0||x>=W||y>=Hh) continue; const dx=x+.5-cx, dy=y+.5-cy, d=Math.hypot(dx,dy)/r; if(d>1) continue;
      const i=y*W+x; const lit=(-dx*.6-dy*.8)/r*.5+.5-d*.25; if(!mask[i]||lit>shade[i]) shade[i]=lit; mask[i]=1; } };
  const leafTones = kind==='pine' ? ['#1d4a32','#285f3e','#33764a','#4a9158','#6aad6a'] : ['#2b5e33','#3a7a3d','#4f9a47','#6cb755','#93d26c'];
  if(kind==='tree'){
    // trunk
    g.fillStyle='#4a2e1a'; g.fillRect(13,24,5,13); g.fillStyle='#6b4428'; g.fillRect(13,24,3,13); g.fillStyle='#8a5a36'; g.fillRect(14,25,1,10);
    g.fillStyle='#4a2e1a'; g.fillRect(11,35,9,2); g.fillRect(10,36,2,1); g.fillRect(19,36,2,1);
    const n=7+R()*3|0; for(let k=0;k<n;k++){ const a=k/n*Math.PI*2, rr=4+R()*3; ball(15+Math.cos(a)*rr*1.1, 13+Math.sin(a)*rr*.85, 6+R()*2.5); } ball(15,12,8);
  } else if(kind==='pine'){
    g.fillStyle='#4a2e1a'; g.fillRect(13,32,4,7); g.fillStyle='#6b4428'; g.fillRect(13,32,2,7);
    for(let k=0;k<4;k++){ const top=3+k*7, bot=top+12, half=4+k*2.6;
      for(let y=top;y<bot;y++){ const w=(y-top)/(bot-top)*half; for(let x=Math.floor(15-w);x<=15+w;x++){ if(x<0||x>=W) continue; const i=y*W+x; const lit=.75-(x-15+w)/(2*w+1)*.6-(y-top)/(bot-top)*.25; if(!mask[i]||lit>shade[i]) shade[i]=lit; mask[i]=1; } } }
  } else {
    ball(7,9,5.5); ball(12,8,6); ball(10,6,4.5);
  }
  // shade the canopy: four tones, a little dither, a dark rim and a few bright leaves
  for(let y=0;y<Hh;y++) for(let x=0;x<W;x++){ const i=y*W+x; if(!mask[i]) continue;
    let s=shade[i]+(ART.hash(x,y,seed)-.5)*.18; const tone=Math.max(0,Math.min(4,Math.floor(s*5)));
    g.fillStyle=leafTones[tone]; g.fillRect(x,y,1,1); }
  g.fillStyle='#16301e'; for(let y=0;y<Hh;y++) for(let x=0;x<W;x++){ const i=y*W+x; if(mask[i]) continue; if((x>0&&mask[i-1])||(x<W-1&&mask[i+1])||(y>0&&mask[i-W])||(y<Hh-1&&mask[i+W])) g.fillRect(x,y,1,1); }
  for(let k=0;k<(kind==='bush'?3:8);k++){ const x=R()*W|0, y=R()*Hh*.5|0; if(mask[y*W+x]&&shade[y*W+x]>.6){ g.fillStyle=leafTones[4]; g.fillRect(x,y,2,1); } }
  if(kind==='tree'&&R()<.5) for(let k=0;k<4;k++){ const x=6+R()*18|0, y=6+R()*14|0; if(mask[y*W+x]){ g.fillStyle=R()<.5?'#f5b3c8':'#fff3c4'; g.fillRect(x,y,1,1); } }  // blossoms
  if(kind==='bush') for(let k=0;k<3;k++){ const x=4+R()*12|0, y=4+R()*6|0; if(mask[y*W+x]){ g.fillStyle='#d8413b'; g.fillRect(x,y,1,1); } }       // berries
  c.bottom=kind==='bush'?Hh-2:Hh-1; return c;
}
for(const kind of ['tree','pine','bush']) for(let v=0;v<3;v++){ SPR[kind+v]=SPR[kind]; SPRC[kind+v]=paintTree(kind, v+1); }
const TREE_KINDS={tree:1,pine:1,bush:1};
function objSprite(o){ const k=o.spr||o.type; return TREE_KINDS[k]? k+((o.x*7+o.y*3)%3) : k; }
function drawObjShadow(g, o, ox, oy, T, Z){
  const k=o.spr||o.type, r={tree:9,pine:7,bush:7,rock:6,well:8,lantern:4,shrine:10,futon:6,furnace:7,chest:6,sign:5,npc:6,gather:0,mailbox:4}[o.type==='npc'?'npc':k]; if(!r) return;
  g.fillStyle='rgba(20,40,20,.22)'; g.beginPath(); g.ellipse(ox+(o.x+.5)*T+1.5*Z, oy+(o.y+1)*T-1.5*Z, r*Z, r*.38*Z, 0, 0, 7); g.fill();
}

/* ---------- atmosphere ---------- */
const AMB={parts:[], map:null};
function drawAtmosphere(g, Z){
  const w=cv.width, h=cv.height, hr=S.min/60, day=hr>=6&&hr<18.5, night=hr>=19.5||hr<5, t=RT.t;
  if(AMB.map!==RT.mapId){ AMB.map=RT.mapId; AMB.parts=[]; }
  // drifting cloud shadows in daylight
  if(day){ for(let k=0;k<3;k++){ const s=w*.5, x=((t*12*Z*(1+k*.3)+k*w*.7)%(w+s*2))-s, y=h*(.2+k*.3)+Math.sin(t*.1+k)*h*.05;
      const gr=g.createRadialGradient(x,y,0,x,y,s*.6); gr.addColorStop(0,'rgba(20,30,50,.10)'); gr.addColorStop(1,'rgba(20,30,50,0)'); g.fillStyle=gr; g.beginPath(); g.ellipse(x,y,s*.6,s*.32,0,0,7); g.fill(); } }
  // particles: petals in the village, leaves in the forest, fireflies at night
  const kind = night ? 'firefly' : RT.mapId==='forest' ? 'leaf' : 'petal', want = kind==='firefly'?26:14, P=AMB.parts;
  while(P.length<want) P.push({x:Math.random()*w, y:Math.random()*h, s:Math.random(), k:kind});
  for(const p of P){ if(p.k!==kind){ p.k=kind; }
    if(kind==='firefly'){ p.x+=Math.sin(t*.8+p.s*20)*.4*Z; p.y+=Math.cos(t*.6+p.s*13)*.3*Z; const a=.3+.7*Math.max(0,Math.sin(t*2.2+p.s*30));
      const gr=g.createRadialGradient(p.x,p.y,0,p.x,p.y,5*Z); gr.addColorStop(0,`rgba(230,255,150,${a*.8})`); gr.addColorStop(1,'rgba(230,255,150,0)'); g.fillStyle=gr; g.fillRect(p.x-5*Z,p.y-5*Z,10*Z,10*Z);
      g.fillStyle=`rgba(255,255,210,${a})`; g.fillRect(p.x-.5*Z,p.y-.5*Z,Z,Z); }
    else { p.y+=(.25+p.s*.3)*Z; p.x+=(Math.sin(t*1.3+p.s*12)*.35-.15)*Z; if(p.y>h+10||p.x<-10){ p.y=-10; p.x=Math.random()*w*1.2; }
      g.save(); g.translate(p.x,p.y); g.rotate(t*(1+p.s)+p.s*9); g.fillStyle=kind==='petal'?`rgba(248,180,200,${.55+p.s*.4})`:`rgba(${120+p.s*90|0},${150+p.s*40|0},60,.8)`;
      g.fillRect(-1.5*Z,-.75*Z,3*Z,1.5*Z); g.restore(); } }
  // evening glow and a soft vignette
  if(hr>=16&&hr<19.5){ const a=hr<18?(hr-16)/2*.16:(19.5-hr)/1.5*.16; g.fillStyle=`rgba(255,140,60,${a})`; g.globalCompositeOperation='soft-light'; g.fillRect(0,0,w,h); g.globalCompositeOperation='source-over';
    g.fillStyle=`rgba(255,170,90,${a*.5})`; g.fillRect(0,0,w,h); }
  if(!AMB.vig||AMB.vig.width!==w||AMB.vig.height!==h){ const v=AMB.vig=document.createElement('canvas'); v.width=w; v.height=h; const vg=v.getContext('2d'), gr=vg.createRadialGradient(w/2,h/2,Math.min(w,h)*.45,w/2,h/2,Math.max(w,h)*.75); gr.addColorStop(0,'rgba(0,0,0,0)'); gr.addColorStop(1,'rgba(10,15,10,.28)'); vg.fillStyle=gr; vg.fillRect(0,0,w,h); }
  g.drawImage(AMB.vig,0,0);
}
