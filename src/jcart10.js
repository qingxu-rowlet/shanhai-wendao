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
  ding(){ return FineArt.paint(100,76,P=>{ const b='#5a6a4a', bl='#7a8a5a', bk='#3a4a32', gr='#4a7a6a';
    P.ell(50,72,44,4,'#00000060');
    for(const x of [22,50,78]) P.rect(x-5,52,10,20,bk);                                                            // the legs
    P.poly([[10,18],[90,18],[86,56],[14,56]],b); P.rect(10,16,80,4,bl); P.rect(8,14,84,3,bk);                         // the belly and its lip
    for(const x of [18,82]){ P.rect(x-4,2,8,14,b); P.rect(x-2,4,4,10,'#1a1a14'); }                                     // the handles
    // the 饕餮 face cast into it: two huge eyes, horns curling, a mouth and no body
    P.poly([[30,26],[44,24],[44,32],[32,34]],bk); P.poly([[70,26],[56,24],[56,32],[68,34]],bk); P.ell(38,29,3,3,'#c8a040'); P.ell(62,29,3,3,'#c8a040');
    P.line(30,24,22,20,bk); P.line(70,24,78,20,bk); P.rect(36,40,28,6,bk); for(let x=38;x<62;x+=4) P.rect(x,40,2,4,'#c8c0a0');
    for(let k=0;k<30;k++){ const x=14+Math.random()*72, y=20+Math.random()*34; P.set(x,y,Math.random()<.5?gr:bl); } }); },     // verdigris
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
