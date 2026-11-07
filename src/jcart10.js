/* ============================================================
   山海问道 · 第三章 · 城里的东西（十）：宗庙地宫 — wet dark flagstones, rough stone walls, iron bars across the cells'
   fronts, wall torches, and the 青铜大鼎: a squat bronze vessel as tall as a house, its belly cast with a 饕餮's face, fire
   under it. Then the picture 「鼎」.
   ============================================================ */
On.tile('H',(g,R,v)=>{ // the 地宫 floor: dark flags, wet, a few puddles catching the torchlight
  g.fillStyle='#2a2a30'; g.fillRect(0,0,16,16); for(let y=0;y<16;y+=8) for(let x=0;x<16;x+=8){ const o=(y/8)%2?4:0; g.fillStyle=R()<.5?'#34343c':'#303038'; g.fillRect((x+o)%16,y,7,7); }
  if(R()<.3){ g.fillStyle='rgba(140,150,180,.18)'; g.fillRect(R()*10|0,R()*12|0,5,2); } },false,'jc_');
On.tile('J',(g,R,v)=>{ // its walls: rough stone, damp
  g.fillStyle='#1a1a20'; g.fillRect(0,0,16,16); for(let i=0;i<6;i++){ const x=R()*12|0, y=R()*12|0; g.fillStyle=R()<.5?'#24242c':'#202026'; g.fillRect(x,y,4+(R()*4|0),3); }
  g.fillStyle='rgba(60,80,60,.25)'; g.fillRect(R()*14|0,12,2,4); },true,'jc_');
On.tile('O',(g,R,v,f)=>{ // black water under the 宗庙, a faint ripple of torchlight
  g.fillStyle='#0c1018'; g.fillRect(0,0,16,16); for(let i=0;i<3;i++){ g.fillStyle='rgba(120,130,160,.18)'; g.fillRect(R()*12|0,R()*14|0,4,1); } },true,'jc_');
const JA10={
  bars(){ return FineArt.paint(16,26,P=>{ P.rect(0,2,16,2,'#3a3a40'); P.rect(0,22,16,2,'#3a3a40'); for(let x=1;x<16;x+=3) P.rect(x,2,1.5,22,'#5a5a64'); P.rect(6,12,4,4,'#8a6a2a'); }); },
  torch(){ return FineArt.paint(10,18,P=>{ P.rect(4,8,2,9,'#4a3a2a'); P.rect(2,8,6,2,'#3a2a20'); P.ell(5,6,3,4,'#e8702a'); P.ell(5,6,2,2.6,'#ffd060'); }); },
  // the great bronze 鼎: a deep round belly on three beast-legs, two upright loop ears, a key-fret band under the lip,
  // and cast into the belly the 饕餮 — horns, huge ringed eyes, the ridge of its nose, a mouth and no body; verdigris everywhere
  ding(){ return FineArt.paint(100,76,P=>{ const d0='#1e2618', d1='#2e3a24', b0='#465636', b1='#5e7046', b2='#7a8c58', hi='#a8b878', au='#c8a040', al='#e8c860', vg='#5a9a84', vl='#7ec0a4';
    P.ell(50,73,46,3,'#00000070');
    // three legs: thick, bowed, a little beast-face mask where each meets the belly, a paw at the foot
    for(const x of [24,50,76]){ P.poly([[x-6,52],[x+6,52],[x+5,62],[x+7,70],[x-7,70],[x-5,62]],d1); P.rect(x-4,53,3,16,b0); P.rect(x+2,53,2,15,d0);
      P.rect(x-8,68,16,3,d0); P.rect(x-7,68,14,1,b1); P.rect(x-4,52,8,5,b1); P.set(x-2,54,au); P.set(x+1,54,au); P.rect(x-2,56,4,1,d0); }
    // the belly: banded shading from the lit left to the shadowed right
    const belly=[[9,20],[91,20],[89,34],[84,46],[74,55],[26,55],[16,46],[11,34]]; P.poly(belly,b0);
    for(let y=21;y<55;y++){ const t=(y-20)/35, half=41-Math.max(0,(t-.35))*36; P.rect(50-half,y,half*.38,1,b1); P.rect(50-half,y,2,1,hi); P.rect(50+half*.55,y,half*.45,1,d1); }
    // the lip, thick and flared, with its key-fret band beneath
    P.rect(6,14,88,4,b1); P.rect(6,14,88,1,hi); P.rect(6,17,88,1,d0); P.rect(9,18,82,5,d1);
    for(let x=10;x<89;x+=6){ P.rect(x,19,4,1,au); P.rect(x+3,19,1,3,au); P.rect(x+1,21,3,1,au); P.rect(x+1,20,1,1,au); }
    // the two loop ears standing on the lip
    for(const x of [20,80]){ P.rect(x-6,1,12,14,b1); P.rect(x-6,1,12,1,hi); P.rect(x-3,4,6,9,'#0c0e0a'); P.rect(x+4,2,2,12,d1); P.rect(x-6,1,1,13,hi); }
    // the 饕餮 face on the belly
    const cx=50, ey=33;
    for(const s of [-1,1]){ const ex=cx+s*14;
      P.poly([[cx+s*4,26],[cx+s*24,24],[cx+s*30,28],[cx+s*26,30],[cx+s*8,30]],d0);                                   // the horn band
      P.line(cx+s*24,24,cx+s*30,20,au); P.line(cx+s*30,20,cx+s*27,17,au);                                            // the horns curling up
      P.ell(ex,ey,6,4.5,d0); P.ell(ex,ey,4.5,3.2,au); P.ell(ex,ey,2.6,2.4,d0); P.rect(ex-.5,ey-2,1.5,4,'#000'); P.set(ex+s,ey-1,'#ff6a3a');   // the ringed eye
      P.poly([[cx+s*20,ey+4],[cx+s*30,ey+6],[cx+s*28,ey+12],[cx+s*18,ey+10]],d1); P.line(cx+s*20,ey+6,cx+s*27,ey+9,au);      // the cheek curl
      P.line(cx+s*8,ey+12,cx+s*16,ey+8,d0); }
    P.rect(cx-2,24,4,16,d0); P.rect(cx-1,24,2,16,au); P.rect(cx-1,26,2,1,al); P.rect(cx-1,30,2,1,al);                 // the nose ridge
    P.poly([[cx-14,44],[cx+14,44],[cx+10,49],[cx-10,49]],'#0c0e0a'); for(let x=cx-12;x<cx+12;x+=3) P.rect(x,44,2,3,'#d8d0b0'); P.rect(cx-13,44,2,5,'#e8e0c0'); P.rect(cx+11,44,2,5,'#e8e0c0');   // the mouth, the fangs
    // verdigris blooming in the hollows, a few rust stains, the last light catching the lip
    for(let k=0;k<70;k++){ const t=(k*37)%100/100, u=(k*61)%100/100, x=14+t*72, y=22+u*32; if(x>cx-16&&x<cx+16&&y>24&&y<50) continue; P.set(x,y,k%3?vg:vl); if(k%4===0) P.set(x+1,y,vg); }
    for(let k=0;k<8;k++){ const x=16+k*9, y=46+(k%3)*3; P.set(x,y,'#7a4a2a'); P.set(x,y+1,'#5a3a20'); }
    for(let x=12;x<40;x+=5) P.set(x,15,al); }); },     // verdigris
};
Object.assign(SPR,{dg_bars:['x'], dg_torch:['x'], dg_ding:['x']}); Object.assign(SPRC,{dg_bars:JA10.bars(), dg_torch:JA10.torch(), dg_ding:JA10.ding()});
// the fire under the 鼎, and the torches' light
On.draw(({g,T,ox,oy})=>{ if(RT.mapId!=='jc_digong') return; for(const o of RT.ents){
  if(o.spr==='dg_ding'){ const x=ox+(o.x+.5)*T, y=oy+(o.y+1)*T; for(let k=0;k<6;k++){ const u=(RT.t*1.3+k/6)%1, fx=x+(k-2.5)*T*.5+Math.sin(RT.t*3+k)*T*.1; g.fillStyle=`rgba(255,${120+u*80|0},40,${.6*(1-u)})`; g.beginPath(); g.arc(fx,y-u*T*.8,T*(.25-u*.15),0,7); g.fill(); }
    const gl=g.createRadialGradient(x,y,0,x,y,T*5); gl.addColorStop(0,'rgba(255,140,60,.25)'); gl.addColorStop(1,'rgba(255,140,60,0)'); g.fillStyle=gl; g.fillRect(x-T*5,y-T*5,T*10,T*10); }
  if(o.spr==='dg_torch'){ const x=ox+(o.x+.5)*T, y=oy+(o.y+.4)*T, gl=g.createRadialGradient(x,y,0,x,y,T*2.2); gl.addColorStop(0,'rgba(255,170,80,.22)'); gl.addColorStop(1,'rgba(255,170,80,0)'); g.fillStyle=gl; g.fillRect(x-T*2.2,y-T*2.2,T*4.4,T*4.4); } } });

/* ---------- 插画「鼎」 ---------- */
JA10.cg=function(){ const gs=JA7_mask(cgChibi(LOOK_GUOSHI,'stand',null,null,null,false),.43), ding=JA10.ding();
  PixCG.open({ink:(g,W,H,R)=>{ g.fillStyle='#08080c'; g.fillRect(0,0,W,H);
      const fg=g.createRadialGradient(W*.5,H*.8,0,W*.5,H*.8,W*.6); fg.addColorStop(0,'rgba(255,120,40,.45)'); fg.addColorStop(.5,'rgba(120,40,20,.18)'); fg.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=fg; g.fillRect(0,0,W,H);
      for(let k=0;k<5;k++){ const x=W*(.1+k*.2); g.strokeStyle='rgba(60,60,70,.6)'; g.lineWidth=Math.max(2,W*.004); g.beginPath(); g.moveTo(x,0); g.quadraticCurveTo(x+W*.03,H*.2,x,H*.35); g.stroke(); }   // chains hanging from the dark
      g.imageSmoothingEnabled=false; const dw=W*.46, dh=dw*ding.height/ding.width; g.drawImage(ding,W*.5-dw/2,H*.86-dh,dw,dh);
      for(let k=0;k<40;k++){ const x=W*(.32+R()*.36), y=H*(.84+R()*.06); g.fillStyle=`rgba(255,${140+R()*100|0},40,${.4+R()*.5})`; g.fillRect(x,y-R()*H*.08,W*.004,H*.01); } },
    cast:[{who:'me', x:.12, pose:'stand', face:1},{look:LOOK_GE, x:.2, pose:'stand', face:1},{cv:gs, x:.8, y:.86, s:.34, face:-1},{look:LOOK_XIAO, x:.9, pose:'stand', face:-1}],
    title:'鼎', small:'第三章 · 人吃人', seed:7601}); };
