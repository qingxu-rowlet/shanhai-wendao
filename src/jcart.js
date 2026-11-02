/* ============================================================
   山海问道 · 第三章「京城」 · 城里的东西 — what the capital is built of, for every 京城 map: 青石板 paving, the city wall
   (its walk on top and its brick face), the dark passage through a gate; and the things in its streets: market stalls
   under striped awnings, a straw post bristling with 糖葫芦, steamer baskets with steam coming off, a sedan chair, willows,
   a pair of stone lions, a notice wall, a wine flag, barrels and crates, a barrier across a closed street. The gate tower
   is drawn over the wall (jc_zhuque's own, in jcmaps.js).
   ============================================================ */
// ---------- ground ----------
On.tile('P',(g,R,v)=>{ // 青石板: big grey flags in staggered rows, dark joints, a little moss in some
  g.fillStyle='#8c877d'; g.fillRect(0,0,16,16);
  for(let r=0;r<2;r++){ const off=(r+v)%2?4:0; for(let k=-1;k<3;k++){ const x=k*8+off, y=r*8; const sh=R()*14-7|0;
      g.fillStyle=`rgb(${140+sh},${135+sh},${125+sh})`; g.fillRect(x+1,y+1,7,7); g.fillStyle=`rgba(255,255,240,.18)`; g.fillRect(x+1,y+1,7,1);
      g.fillStyle='#6a665e'; g.fillRect(x,y,8,1); g.fillRect(x,y,1,8); } }
  if(R()<.25){ g.fillStyle='rgba(90,120,70,.55)'; g.fillRect(R()*14|0,R()*14|0,2,1); } if(R()<.3){ g.fillStyle='rgba(60,56,50,.35)'; g.fillRect(R()*14|0,R()*14|0,1,1); } });
On.tile('X',(g,R,v)=>{ // the wall walk, seen from above: big pale bricks, the outer edge a little darker
  g.fillStyle='#7d776d'; g.fillRect(0,0,16,16);
  for(let r=0;r<4;r++) for(let k=-1;k<3;k++){ const x=k*8+(r%2?4:0), y=r*4, sh=R()*12-6|0; g.fillStyle=`rgb(${128+sh},${121+sh},${110+sh})`; g.fillRect(x+1,y+1,7,3); }
  g.fillStyle='rgba(40,34,28,.25)'; g.fillRect(0,14,16,2); },true);
On.tile('Y',(g,R,v)=>{ // the wall's face: dark brick, tall, the courses picked out, a stain or two; shadow at its foot
  g.fillStyle='#4e4a45'; g.fillRect(0,0,16,16);
  for(let r=0;r<5;r++) for(let k=-1;k<3;k++){ const x=k*8+(r%2?4:0), y=r*3+1, sh=R()*10-5|0; g.fillStyle=`rgb(${92+sh},${86+sh},${78+sh})`; g.fillRect(x+1,y,7,2); }
  if(R()<.35){ g.fillStyle='rgba(30,40,24,.35)'; g.fillRect(R()*12|0,R()*8|0,2,5); }
  g.fillStyle='rgba(0,0,0,.35)'; g.fillRect(0,14,16,2); },true);
On.tile('A',(g,R,v)=>{ // the passage through a gate: worn flags in the shadow of the arch
  g.fillStyle='#4a4640'; g.fillRect(0,0,16,16); for(let r=0;r<2;r++) for(let k=-1;k<3;k++){ const x=k*8+(r%2?4:0), sh=R()*10-5|0; g.fillStyle=`rgb(${84+sh},${80+sh},${72+sh})`; g.fillRect(x+1,r*8+1,7,7); }
  g.fillStyle='rgba(10,8,6,.35)'; g.fillRect(0,0,16,16); });

// ---------- things in the streets (painted, outlined like the bosses; SPR holds a stand-in so the map knows them) ----------
const JA={
  // a market stall: a plank counter, posts, a striped awning; what it sells on top
  stall(c1,c2,goods){ return FineArt.paint(34,34,P=>{ const wood='#8a5a36', dk='#5e3a20', lt='#b07a4c';
    P.rect(3,10,2,20,dk); P.rect(29,10,2,20,dk);                                                   // posts
    for(let k=0;k<8;k++){ P.poly([[1+k*4,4],[5+k*4,4],[5+k*4,11],[1+k*4,11]],k%2?c2:c1); } P.rect(1,11,32,1,'#00000055');   // awning
    for(let k=0;k<8;k++) P.poly([[1+k*4,11],[5+k*4,11],[3+k*4,14]],k%2?c2:c1);                     // its scalloped edge
    P.rect(2,22,30,4,wood); P.rect(2,22,30,1,lt); P.rect(2,26,30,6,dk); P.rect(4,27,26,1,wood);   // counter
    goods&&goods(P); }); },
  hulu(){ return FineArt.paint(16,34,P=>{ P.rect(7,8,2,24,'#7a5a3a'); P.ell(8,10,6,5,'#d8c070'); P.ell(8,9,5,3,'#ecd890');   // a straw bundle on a pole
    for(const [x,y,a] of [[2,4,-.5],[14,4,.5],[1,10,-1],[15,10,1],[3,15,-.6],[13,15,.6],[8,2,0]]){ P.line(8,10,x,y,'#c8b080');
      for(let k=0;k<3;k++){ const t=.45+k*.18, cx=8+(x-8)*t, cy=10+(y-10)*t; P.ell(cx,cy,1.4,1.4,'#d0302a'); P.set(cx-.5,cy-.6,'#ff8a70'); } }
    P.rect(5,31,6,2,'#5e3a20'); }); },
  steamer(){ return FineArt.paint(22,24,P=>{ for(let k=0;k<3;k++){ const y=19-k*5; P.ell(11,y,9,3,'#c8a46a'); P.rect(2,y-3,18,3,'#b08850'); P.ell(11,y-3,9,3,'#d8b47a'); for(let i=0;i<6;i++) P.set(4+i*3,y-1,'#8a6a3a'); }
    P.ell(11,4,8,2.6,'#e0c48a'); P.ell(11,3.6,2,1,'#8a6a3a'); }); },
  sedan(){ return FineArt.paint(40,34,P=>{ const r='#8a2420', rl='#b03a30', rk='#5a1410', gd='#d8b048';
    P.rect(0,22,40,2,'#5e3a20');                                                                    // the carrying poles
    P.rect(10,10,20,18,r); P.rect(10,10,20,2,rl); P.rect(12,13,16,12,rk); P.rect(13,14,14,10,'#2a1210');   // the box, a curtained window
    for(let k=0;k<4;k++) P.rect(14+k*3,14,1,10,'#6a1c18');
    P.poly([[7,10],[20,2],[33,10]],'#2a2830'); P.poly([[9,9],[20,3],[31,9]],'#3c3a44'); P.set(20,1,gd); P.rect(19,2,2,1,gd);   // roof, a gold knob
    P.rect(10,27,20,2,rk); P.rect(9,9,22,1,gd); }); },
  willow(){ return FineArt.paint(40,48,P=>{ P.cap(20,46,19,26,2.4,'#5a4030'); P.cap(19,30,12,20,1.4,'#5a4030'); P.cap(20,28,28,19,1.4,'#5a4030');
    for(let k=0;k<20;k++){ const x=5+k*1.6, top=10+Math.abs(k-10)*.6, len=16+((k*7)%9); for(let y=0;y<len;y++) P.set(x+Math.sin(y*.3+k)*.8,top+y,y>len-4?'#9ac070':k%3?'#6a9a48':'#7aae58'); }
    P.ell(20,12,14,6,'#5a8a40'); P.ell(18,10,10,4,'#6fa04c'); }); },
  lion(face){ const c=FineArt.paint(20,28,P=>{ const st='#a8a294', sd='#7a756a', lt='#c8c2b4';
    P.rect(2,22,16,5,sd); P.rect(2,22,16,1,lt);                                                       // plinth
    P.ell(9,17,6,5,st); P.cap(5,21,5,15,2,st); P.cap(13,21,13,16,2,st);                              // body, legs
    P.ell(10,9,6.5,6,sd); for(let k=0;k<10;k++){ const a=k/10*Math.PI*2; P.ell(10+Math.cos(a)*5,9+Math.sin(a)*5,1.6,1.6,sd); }   // the curled mane
    P.ell(11,10,4,3.6,st); P.set(10,9,'#2a2420'); P.set(13,9,'#2a2420'); P.rect(10,12,4,1,'#4a443c'); P.set(14,11,lt);   // face
    P.ell(15,20,2.4,2,lt); });                                                                         // a ball under its paw
    if(face>0) return c; const d=document.createElement('canvas'); d.width=c.width; d.height=c.height; const g=d.getContext('2d'); g.translate(c.width,0); g.scale(-1,1); g.drawImage(c,0,0); d.bottom=c.bottom; d.fine=true; return d; },
  board(){ return FineArt.paint(40,30,P=>{ P.rect(1,6,38,20,'#6a645c'); P.rect(1,6,38,2,'#8a847a'); P.poly([[0,6],[20,1],[40,6]],'#3c3a44');   // a little wall with a tiled top
    P.rect(4,10,11,13,'#ece4cc'); P.rect(17,10,9,11,'#e8d8a8'); P.rect(28,11,8,8,'#e4dcc4'); P.rect(28,19,8,2,'#c8a888');                    // three notices, one torn
    for(let k=0;k<5;k++){ P.rect(6,12+k*2,7,1,'#5a4a3a'); } for(let k=0;k<4;k++){ P.rect(19,12+k*2,5,1,'#5a4a3a'); } P.rect(30,13,4,1,'#5a4a3a'); P.rect(30,15,3,1,'#5a4a3a');
    P.rect(10,20,3,2,'#b02820'); P.rect(22,18,3,2,'#b02820'); P.rect(1,26,38,3,'#4a443c'); }); },
  flag(){ const c=FineArt.paint(18,44,P=>{ P.rect(2,2,2,41,'#5e3a20'); P.rect(4,4,12,22,'#d8c8a0'); P.rect(4,4,12,2,'#b02820'); P.rect(4,24,12,2,'#b02820');
    P.poly([[4,26],[8,26],[6,30]],'#d8c8a0'); P.poly([[12,26],[16,26],[14,30]],'#d8c8a0'); });
    return c; },
  barrels(){ return FineArt.paint(30,22,P=>{ for(const [x,y] of [[7,18],[17,18],[12,11]]){ P.ell(x,y,5,3,'#6a4a2a'); P.rect(x-5,y-7,10,7,'#8a5a36'); P.ell(x,y-7,5,2.4,'#a87a4c'); P.rect(x-5,y-5,10,1,'#3a2a1a'); P.rect(x-5,y-2,10,1,'#3a2a1a'); }
    P.rect(21,12,8,8,'#a8804c'); P.rect(21,12,8,1,'#c8a06c'); P.line(21,12,28,19,'#6a4a2a'); }); },
  barrier(){ return FineArt.paint(34,18,P=>{ for(const x of [4,29]){ P.rect(x-1,4,3,13,'#5e3a20'); } P.rect(1,6,32,3,'#c8302a'); P.rect(1,11,32,3,'#c8302a');
    for(let k=0;k<4;k++){ P.rect(4+k*8,6,4,3,'#ece4cc'); P.rect(8+k*8,11,4,3,'#ece4cc'); } }); },
};
// stalls by what they sell
const JA_GOODS={
  bao:P=>{ for(let k=0;k<3;k++){ P.ell(9+k*8,20,3.4,2.2,'#f4ecd8'); P.set(9+k*8,19,'#d8c8a8'); } P.ell(26,18,4,3,'#c8a46a'); },
  cloth:P=>{ for(const [x,c] of [[5,'#4a6fa5'],[11,'#c8413b'],[17,'#5d9b4a'],[23,'#e8b84a']]){ P.rect(x,16,5,6,c); P.rect(x,16,5,1,'#ffffff55'); } },
  trinket:P=>{ for(let k=0;k<7;k++){ P.ell(6+k*4,20,1.4,1.4,['#e8b84a','#9fd3ef','#f2a0b0','#5d9b4a'][k%4]); } P.rect(5,17,24,1,'#8a5a36'); },
  fruit:P=>{ for(let k=0;k<6;k++) P.ell(7+k*4,20,2,1.8,k%2?'#e07b39':'#c8413b'); for(let k=0;k<5;k++) P.ell(9+k*4,18,2,1.8,'#e8b84a'); },
};
Object.assign(SPR, {jc_stall_bao:['x'], jc_stall_cloth:['x'], jc_stall_trinket:['x'], jc_stall_fruit:['x'], jc_hulu:['x'], jc_steamer:['x'], jc_sedan:['x'], jc_willow:['x'], jc_lionL:['x'], jc_lionR:['x'], jc_board:['x'], jc_flag_jiu:['x'], jc_flag_yao:['x'], jc_barrels:['x'], jc_barrier:['x']});
Object.assign(SPRC, {
  jc_stall_bao:JA.stall('#c8413b','#f0e6d0',JA_GOODS.bao), jc_stall_cloth:JA.stall('#4a6fa5','#f0e6d0',JA_GOODS.cloth),
  jc_stall_trinket:JA.stall('#8b5bc5','#f0e6d0',JA_GOODS.trinket), jc_stall_fruit:JA.stall('#5d9b4a','#f0e6d0',JA_GOODS.fruit),
  jc_hulu:JA.hulu(), jc_steamer:JA.steamer(), jc_sedan:JA.sedan(), jc_willow:JA.willow(), jc_lionL:JA.lion(1), jc_lionR:JA.lion(-1), jc_board:JA.board(),
  jc_flag_jiu:JA.flag('酒'), jc_flag_yao:JA.flag('药'), jc_barrels:JA.barrels(), jc_barrier:JA.barrier()});
// steam off the baskets and the 包子 stall
On.draw(({g,T,ox,oy})=>{ if(!RT.map||!String(RT.mapId).startsWith('jc_')) return;
  for(const o of RT.ents) if(o.spr==='jc_steamer'||o.spr==='jc_stall_bao'){ for(let k=0;k<3;k++){ const u=(RT.t*.5+k/3)%1, x=ox+(o.x+.5)*T+Math.sin(RT.t*2+k*2)*T*.12, y=oy+(o.y-.4-u*.9)*T;
      g.fillStyle=`rgba(255,255,255,${.35*Math.sin(u*Math.PI)})`; g.beginPath(); g.ellipse(x,y,T*(.12+u*.12),T*(.08+u*.06),0,0,7); g.fill(); } } });

/* ---------- shop fronts: each building of the capital its own face ----------
   A building with fa:{…} keeps the town house's roof (curved tile rows, upturned eaves, in its own colours) and gets its
   own front under it: the wall (plaster, wood, brick), windows or none, the door open on a lit room or shut, and what
   makes it itself (a balcony with lanterns, a huge 当, bolts of cloth, a wall of medicine drawers, bamboo blinds, lanterns
   marked 客, wine jars). Two-storey ones have their roof lifted and an upper floor put in with a balcony and a narrow eave.
   The lettering on signs and flags is drawn on top at screen resolution (On.draw below), so it stays sharp. */
JA.facade=function(o,c){ const fa=o.fa, W=c.width, H0=c.height, wt=Math.round(H0*.42), up=fa.storeys>1?28:0, H=H0+up;
  const d=document.createElement('canvas'); d.width=W; d.height=H; const g=d.getContext('2d'), r=(x,y,w,h,col)=>{ g.fillStyle=col; g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h)); };
  const pillar=fa.pillar||'#6a2a22', wallCol={plaster:['#ece0c6','#d4c6a8'], wood:['#8a5a36','#6e4428'], brick:['#7a746a','#5e5850']}[fa.wall];
  const win=(x,y,w,h,lit)=>{ r(x-1,y-1,w+2,h+2,'#3a2418'); r(x,y,w,h,lit?'#f4d890':'#e8dcc4'); for(let i=x+3;i<x+w;i+=4) r(i,y,1,h,'#7a5a38'); for(let j=y+3;j<y+h;j+=4) r(x,j,w,1,'#7a5a38'); r(x-2,y+h,w+4,2,'#8a5a36'); };
  d.signs=[];
  if(up){ g.drawImage(c,0,0,W,wt+6,0,0,W,wt+6);                                   // the roof, lifted
    r(6,wt+4,W-12,up+2,wallCol[0]); for(const x of [6,W-10]) r(x,wt+4,4,up+2,pillar);
    for(let k=0;k<3;k++) win(16+k*((W-48)/2),wt+8,16,11,fa.lit);
    if((fa.deco||[]).includes('blinds')) for(let k=0;k<3;k++){ const x=16+k*((W-48)/2); for(let j=0;j<6;j++) r(x,wt+8+j,16,1,j%2?'#c8a868':'#a8884a'); }
    r(4,wt+up-1,W-8,2,'#6a2a22'); for(let x=6;x<W-6;x+=4) r(x,wt+up-6,1,5,'#6a2a22'); r(4,wt+up-7,W-8,1,'#8a3a2a');   // the balcony rail
    g.drawImage(c,0,wt-4,W,10,0,wt+up,W,10);                                       // a narrow eave between the floors (the roof's lowest rows)
    g.drawImage(c,0,wt+6,W,H0-wt-6,0,wt+up+6,W,H0-wt-6); }                         // the ground floor below
  else g.drawImage(c,0,0);
  // the ground floor's front, painted over the house's plaster
  const LT=(up?wt+up+10:wt+4), FB=H-6;
  r(5,LT,W-10,FB-LT,wallCol[0]);
  if(fa.wall==='brick') for(let y=LT;y<FB;y+=4) for(let x=5+((y-LT)/4%2?4:0);x<W-6;x+=8) r(x,y,7,3,'#8a847a');
  if(fa.wall==='wood') for(let x=8;x<W-8;x+=5) r(x,LT,1,FB-LT,wallCol[1]);
  for(const x of [4,W-8]) r(x,LT-2,4,FB-LT+2,pillar);
  const dw=22, dx=W/2-11, dy=FB-21;
  r(dx-2,dy-2,dw+4,23,'#3a2418'); r(dx,dy,dw,21,fa.open?'#2a160c':'#7a4a2a');
  if(fa.open){ const gl=g.createLinearGradient(0,dy,0,FB); gl.addColorStop(0,'rgba(255,190,110,.6)'); gl.addColorStop(1,'rgba(255,160,80,.18)'); g.fillStyle=gl; g.fillRect(dx,dy,dw,21); r(dx+3,dy+12,6,9,'rgba(60,30,16,.6)'); }
  else { r(W/2-1,dy,1,21,'#4a2a18'); for(let y=dy+3;y<FB-2;y+=4){ r(dx+2,y,7,1,'#5e3a20'); r(W/2+2,y,7,1,'#5e3a20'); } r(W/2-4,dy+10,2,2,'#e8b84a'); r(W/2+2,dy+10,2,2,'#e8b84a'); }
  if(fa.windows!==false) for(const x of [12,W-28]) win(x,LT+5,16,12,fa.lit);
  if(fa.sign){ const sw=Math.max(26,fa.sign.length*10+8), sx=W/2-sw/2, sy=dy-12; r(sx-1,sy-1,sw+2,11,'#c8a050'); r(sx,sy,sw,9,fa.signBg||'#1e1a18'); d.signs.push({x:sx,y:sy,w:sw,h:9,text:fa.sign,ink:fa.signInk||'#f0d080'}); }
  const lantern=(x,y,text)=>{ r(x,y,1,3,'#3a2418'); r(x-3,y+3,7,8,'#c8302a'); r(x-3,y+3,7,1,'#f0c050'); r(x-3,y+10,7,1,'#f0c050'); r(x-1,y+11,3,2,'#f0c050'); if(text) d.signs.push({x:x-3,y:y+4,w:7,h:6,text,ink:'#fff0c0',plain:true}); };
  for(const k of fa.deco||[]){
    if(k==='balconyLanterns'&&up) for(let i=0;i<4;i++) lantern(14+i*(W-28)/3,wt+up+1);
    if(k==='doorLanterns') for(const x of [W/2-18,W/2+18]) lantern(x,dy-4,fa.lanternText);
    if(k==='bigDang'){ r(9,LT+3,24,24,'#f4ecd8'); r(9,LT+3,24,1,'#3a2418'); r(9,LT+26,24,1,'#3a2418'); d.signs.push({x:9,y:LT+3,w:24,h:24,text:'当',ink:'#1a1410',big:true}); }
    if(k==='bars') for(let x=W-30;x<W-10;x+=3) r(x,LT+6,1,14,'#2a2420');
    if(k==='cloth'){ r(6,LT+1,W-12,1,'#5e3a20'); const cols=['#c8413b','#4a6fa5','#e8b84a','#5d9b4a','#8b5bc5','#f2a0b0']; let n=0; for(let x=10;x<W-14;x+=12){ if(x>dx-10&&x<dx+dw+2) continue; r(x,LT+2,9,16+(n%2)*5,cols[n%6]); r(x,LT+2,9,1,'#ffffff66'); r(x+8,LT+2,1,16+(n%2)*5,'rgba(0,0,0,.25)'); n++; } }
    if(k==='drawers'){ r(8,LT+3,30,22,'#5a3a20'); for(let j=0;j<4;j++) for(let i=0;i<5;i++){ r(9+i*6,LT+4+j*5,5,4,'#a8784a'); r(11+i*6,LT+6+j*5,1,1,'#e8b84a'); } }
    if(k==='gourd'){ const x=W-16, y=LT-1; r(x,y,1,4,'#3a2418'); g.fillStyle='#c89040'; g.beginPath(); g.arc(x+.5,y+7,3,0,7); g.arc(x+.5,y+12,4,0,7); g.fill(); r(x-2,y+9,5,1,'#c8302a'); }
    if(k==='moon'){ g.fillStyle='#3a2418'; g.beginPath(); g.arc(W-22,LT+12,9,0,7); g.fill(); g.fillStyle='#f4d890'; g.beginPath(); g.arc(W-22,LT+12,7.5,0,7); g.fill(); g.fillStyle='#7a5a38'; for(let i=-6;i<=6;i+=3) g.fillRect(W-22+i,LT+5,1,14); }
    if(k==='jars') for(const x of [dx-12,dx+dw+5]){ g.fillStyle='#6a3a20'; g.beginPath(); g.ellipse(x+3,FB-4,4,5,0,0,7); g.fill(); r(x+1,FB-10,4,2,'#3a2418'); r(x+1,FB-6,4,2,'#e8d8a8'); }
    if(k==='post'){ r(W-6,FB-16,2,16,'#5e3a20'); r(W-8,FB-14,6,1,'#5e3a20'); }
  }
  d.bottom=H; return d; };
On.building((o,c)=>{ if(!o.fa) return c; if(o._faBase!==c){ o._faBase=c; o._fa=JA.facade(o,c); } return o._fa; });
// sharp lettering: signs, the big 当, lanterns marked 客, the wine and medicine flags
On.draw(({g,T,ox,oy})=>{ if(!String(RT.mapId).startsWith('jc_')) return; const Z=T/16;
  for(const o of RT.ents){
    if(o._fa&&o._fa.signs){ const bx=ox+o.x*T, by=oy+(o.y+o.h)*T-o._fa.height*Z;
      for(const s of o._fa.signs){ const fs=s.big?s.h*Z*.82:s.plain?s.h*Z*.95:s.h*Z*.9; g.font=`${Math.round(fs)}px "Ma Shan Zheng","STKaiti","KaiTi",serif`; g.fillStyle=s.ink; g.textAlign='center'; g.textBaseline='middle';
        g.fillText(s.text, bx+(s.x+s.w/2)*Z, by+(s.y+s.h/2+.5)*Z); } }
    if(o.flagText){ const c=SPRC[o.spr]; if(!c) continue; const lx=ox+(o.x+.5)*T-c.width*Z/2, ty=oy+(o.y+1)*T-c.bottom*Z;
      g.font=`${Math.round((o.flagSize||11)*Z)}px "Ma Shan Zheng","STKaiti","KaiTi",serif`; g.fillStyle=o.flagInk||'#2a1e1a'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(o.flagText,lx+(o.flagX||11)*Z,ty+(o.flagY||16)*Z); } }
  g.textBaseline='alphabetic'; });
