/* ============================================================
   山海问道 · 第五幕的插画 — the cave mouth, 二师兄 in the dark, the three things the mirror shows (丰年村, the cellar, the
   fire), and 饕餮 standing up out of his shadow.
   ============================================================ */
const LOOK_MAN_SMALL={...LOOK_MAN, cloth:2};                                   // in the famine year: a little boy in a faded smock
const LOOK_MAN_MA={g:'f',skin:2,hair:4,hairColor:1,style:'qun',cloth:0,face:'mid'};   // his mother: long brown hair, a faded blue dress
// 何满仓 in the cave: crouched with his back to you, then turning — the same figure, his mouth red
C2Y.manFig=function(mode){ const key='man_'+mode; if(FineArt.cache[key]) return FineArt.cache[key];
  const base=cgChibi(LOOK_MAN,'crouch',mode==='blood'?'dim':'sad',null,null,false), W=base.width, H=base.height, d=base.getContext('2d').getImageData(0,0,W,H).data;
  const skin=lookPalette(LOOK_MAN).S.toLowerCase(), hex=i=>'#'+[d[i],d[i+1],d[i+2]].map(v=>v.toString(16).padStart(2,'0')).join('');
  // the face: the lowest row of skin in the top half of the figure; the mouth sits just above its middle
  // the face: the last wide row of skin (the hands below it are narrower)
  let fy=-1, fx0=0, fx1=0, hy=-1, hx=0; for(let y=0;y<H*.7;y++){ const xs=[]; for(let x=0;x<W;x++){ const i=(y*W+x)*4; if(d[i+3]&&hex(i)===skin) xs.push(x); } if(xs.length>=12){ fy=y; fx0=xs[0]; fx1=xs[xs.length-1]; } else if(fy>0&&xs.length){ hy=y; hx=xs[xs.length-1]; } }
  return FineArt.cache[key]=FineArt.paint(W,H,P=>{
    for(let y=0;y<H;y++) for(let x=0;x<W;x++){ const i=(y*W+x)*4; if(d[i+3]) P.set(x,y,hex(i)); }
    if(mode!=='blood'||fy<0) return; const mx=Math.round((fx0+fx1)/2), my=fy-2;
    P.rect(mx-2,my,5,1,'#8c1a14'); P.rect(mx-1,my+1,3,1,'#c8413b'); P.set(mx-3,my+1,'#a02018'); P.set(mx+3,my+1,'#a02018');
    P.set(mx-2,my+2,'#c8413b'); P.set(mx-2,my+3,'#8c1a14'); P.set(mx+2,my+2,'#8c1a14'); P.set(mx+1,my+3,'#c8413b'); P.set(mx+1,my+4,'#8c1a14');
    if(hy>0) for(const [dx,dy] of [[0,0],[-1,0],[-2,-1],[-3,1],[-5,0],[-1,-2]]) P.set(hx+dx,hy+dy,dx%2?'#8c1a14':'#c8413b'); }); };
// 何满仓 from behind, hunched over what he is eating: a round head of hair, shoulders drawn up, elbows out at his sides,
// kneeling back on his heels so the soles of his shoes show; the 干粮袋 at his hip. Two frames: the shoulders work as he chews.
FineArt.manBack=function(f){ const key='manback'+f; if(FineArt.cache[key]) return FineArt.cache[key];
  const pal=lookPalette(LOOK_MAN), H=pal.H, Hh=pal.h, C=pal.C, S=pal.S, Pn=pal.P, F=pal.F, dk=c=>shade(c,-.22), lt=c=>shade(c,.16), d=f?1:0;
  return FineArt.cache[key]=FineArt.paint(48,50,P=>{
    // the soles, the heels he sits back on, the trousers
    P.ell(16,46.5,4.4,2,F); P.ell(32,46.5,4.4,2,F); P.rect(13,46,7,1,dk(F)); P.rect(29,46,7,1,dk(F));
    P.ell(24,42,13,5,Pn); P.ell(24,43.5,11,2.5,dk(Pn));
    // the back: hunched and round, darker low down, the line of the spine
    P.ell(24,33+d*.5,13.5,10,C); P.ell(24,37+d*.5,12,5,dk(C)); P.ell(24,29+d,12,5.5,lt(C));
    P.cap(24,25+d,24,40,.6,dk(C)); P.rect(12,39,24,2,pal.A||'#8a5a36');
    // the 干粮袋 at his hip, empty and flat
    P.ell(37,39,3.6,4.4,'#a07040'); P.ell(37,37.5,3,1.4,'#c89050'); P.cap(35,35,38,33,.6,'#6a4626');
    // elbows out at his sides — his hands are in front of him, at his mouth
    P.cap(11+d*.5,31+d,7,37,3.2,C); P.cap(7,37,10,40,2.6,dk(C)); P.cap(37-d*.5,31+d,41,37,3.2,C); P.cap(41,37,38,40,2.6,dk(C));
    // the neck, the ears, the head bent forward over the food: mostly hair from here
    P.rect(21,21+d,7,4,dk(S)); P.ell(12.5,15+d,2,3,S); P.ell(35.5,15+d,2,3,S);
    P.ell(24,13+d,12,10.5,H); P.ell(24,9+d,10,5,Hh); for(let k=-3;k<=3;k++) P.cap(24+k*3,5+d,24+k*3.6,20+d,.5,dk(H));
    P.ell(24,22+d,8,2,H); P.rect(17,22+d,14,1,dk(H)); }); };
// what he was eating: a boar-sized 妖兽 on its side — bristling black mane, a tusk, stiff legs and dark hooves, the belly torn
// open to the ribs, a pool of blood under it
FineArt.carcass=function(){ return FineArt.cache.carcass3||(FineArt.cache.carcass3=FineArt.paint(72,36,P=>{
  const Hd='#6a5442', Hd2='#52402f', Hd3='#80694f', Mn='#2a201c', Mn2='#3e302a', Hf='#24180f', Bn='#efe4d2', Bl='#7a120e', Bl2='#b8302a', Tk='#f4ecd8';
  P.ell(38,32,31,2.8,'#3a0a08'); P.ell(34,32.5,19,1.6,Bl);
  // legs out from the belly, stiff: thick at the top, a dark hoof at the end
  for(const [x0,x1,y1] of [[22,15,31],[28,24,32],[48,53,32],[54,62,30]]){ const mx=(x0+x1)/2, my=(24+y1)/2; P.cap(x0,23,mx,my,2.4,Hd2); P.cap(mx,my,x1,y1-1,1.5,Hd2); P.ell(x1,y1,1.8,1.4,Hf); }
  // the body on its side, round, a lighter back, the bristling mane along the spine
  P.ell(38,17,23,8.5,Hd); P.ell(38,13,20,4,Hd3); P.ell(38,22,19,3.4,Hd2);
  for(let x=18;x<=60;x+=2){ const h=2+((x*7)%3); P.cap(x,9.5,x+.8,9.5-h,.7,(x%4)?Mn:Mn2); }
  // the head: a long snout, a tusk curving up, the eye shut, the ear flat
  P.ell(13,18,9,6.5,Hd); P.ell(12,15,6.5,2.6,Hd3); P.poly([[6,16],[-1,18],[0,22],[7,23]],Hd2); P.ell(.5,20,1.6,2.2,'#3a2a20'); P.set(0,19,Hf); P.set(0,21,Hf);
  P.cap(4,20,2,14,.9,Tk); P.set(2,13,Tk); P.cap(10,16,14,16.5,.5,Mn); P.poly([[16,12],[20,8],[21,13]],Hd2); P.set(19,10,'#8a6a5a');
  // the flank torn open: a dark gash, the ribs curving across it, blood running down to the ground
  P.ell(41,17,9,4.6,'#2a0604'); P.ell(41,17.5,7.5,3.2,Bl);
  for(let k=0;k<4;k++){ const x=36+k*3.4; P.cap(x,13.2,x+1.2,15.5,.55,Bn); P.cap(x+1.2,15.5,x+1,19,.55,Bn); P.cap(x+1,19,x-.2,21.4,.55,Bn); }
  P.cap(37,21.5,36,26,.6,Bl2); P.cap(44,21.5,45,27,.6,Bl); P.set(36,27,Bl2); P.set(45,28,Bl2); })); };
// 饕餮: rising out of his shadow. A sheep's body in a heavy black fleece, a man's arms with long claws, a face of green
// bronze cut with the 饕餮 scrollwork, great curled ram's horns, a mouth of tiger teeth — and its real eyes under its arms.
FineArt.taotie=function(){ return FineArt.cache.taotie3||(FineArt.cache.taotie3=FineArt.paint(132,104,P=>{
  const Fl='#2e2422', Fl2='#3d302c', Fl3='#4b3c36', B1='#7d8a58', B2='#5e6e47', B3='#44533a', B4='#2c3826', Bk='#1a2016', Gd='#d8b04c', Gd2='#9a7a30',
    Hn='#6b5a2e', Hn2='#a08848', Hn3='#3f3418', Mo='#240606', Mo2='#5a1410', Th='#f2ead8', Th2='#c8bea8', Ey='#ffcc33', Ey2='#e05020', Cl='#e6dcc4', Ar='#3a2e2a', Ar2='#56463e', cx=66;
  // arms first (behind the fleece at the shoulder): a man's arms raised high, the hands open, long pale claws
  for(const s of [-1,1]){ const sx=cx+s*30, sy=56, ex=cx+s*50, ey=44, hx=cx+s*56, hy=24;
    P.cap(sx,sy,ex,ey,5,Ar); P.cap(ex,ey,hx,hy+4,3.6,Ar); P.cap(sx+s*6,sy-4,ex-s*2,ey-1,1.2,Ar2); P.cap(ex,ey-2,hx-s*1,hy+6,1,Ar2);
    P.ell(hx,hy+2,4.6,4,Ar);
    for(let f=-2;f<=2;f++){ const a=-Math.PI/2+f*.32+s*.15, bx=hx+Math.cos(a)*3, by=hy+Math.sin(a)*3, mx=bx+Math.cos(a)*5, my=by+Math.sin(a)*5;
      P.cap(bx,by,mx,my,1,Ar2); const tx=mx+Math.cos(a+s*.3)*5, ty=my+Math.sin(a+s*.3)*5; P.cap(mx,my,tx,ty,.75,Cl); P.set(Math.round(tx),Math.round(ty),'#fffaf0'); } }
  // the fleece: a hunched mass in curls, thinning into smoke below
  P.ell(cx,64,38,25,Fl); P.ell(cx,55,32,17,Fl2);
  for(let k=0;k<64;k++){ const a=k/64*Math.PI*2, x=cx+Math.cos(a)*(36+Math.sin(k*2.7)*3), y=62+Math.sin(a)*22; if(y>76) continue; P.ell(x,y,3.2,2.6,k%2?Fl2:Fl); P.set(Math.round(x),Math.round(y-1),Fl3); }
  for(let k=0;k<30;k++){ const x=cx-28+((k*37)%56), y=48+((k*23)%26); P.ell(x,y,2,1.6,Fl3); P.set(Math.round(x)-1,Math.round(y)+1,Fl); }
  for(let k=0;k<10;k++){ const x=cx-32+k*7, len=9+(k*5)%10; for(let j=0;j<len;j++){ const w=Math.max(.5,2.8-j*.22); P.cap(x+Math.sin(j*.5+k)*2,80+j,x+Math.sin(j*.5+k)*2,80+j,w,j>len*.6?'#1e1716':Fl); } }
  // its real eyes, in the hollows under the raised arms: huge, gold, slit like a goat's
  for(const s of [-1,1]){ const ex=cx+s*33, ey=60; P.ell(ex,ey,7,4.6,Mo); P.ell(ex,ey,6,3.6,Ey2); P.ell(ex,ey,4.4,2.8,Ey); P.rect(ex-3,ey-1,7,2,Mo); P.rect(ex-2,ey-1,5,2,'#120202'); P.set(ex-s*2,ey-2,'#fff6d0'); P.set(ex-s*3,ey-2,'#fff6d0'); }
  // horns: ram's horns, ridged, curling out and down
  for(const s of [-1,1]){ const pts=[], ox=cx+s*20, oy=14;
    for(let k=0;k<=44;k++){ const t=k/44, ang=-Math.PI/2+s*t*Math.PI*1.7, rad=4+t*14; pts.push([ox+s*t*8+Math.cos(ang)*rad*s*.9*(s<0?-1:1)*-1*s, oy+t*6+Math.sin(ang)*rad*.85, 5.2*(1-t*.6)]); }
    for(const [x,y,w] of pts) P.cap(x,y+1,x,y+1,w,Hn3); for(const [x,y,w] of pts) P.cap(x,y,x,y,w*.9,Hn);
    pts.forEach(([x,y,w],k)=>{ if(k%4===0) P.cap(x-w*.55,y-w*.2,x+w*.55,y+w*.2,.5,Hn2); }); }
  // the mask: broad at the brow, bronze darkening downward, a gold rim
  const mask=[[cx-26,12],[cx+26,12],[cx+29,24],[cx+24,40],[cx+14,48],[cx-14,48],[cx-24,40],[cx-29,24]];
  P.poly(mask.map(([x,y])=>[x+(x<cx?-1:1),y+(y>30?1:-1)]),Gd2); P.poly(mask,B2);
  P.poly([[cx-26,12],[cx+26,12],[cx+28,20],[cx-28,20]],B1); P.poly([[cx-24,40],[cx+24,40],[cx+14,48],[cx-14,48]],B3);
  // cloud-and-thunder scrolls: a round spiral on each cheek and over each brow, gold on dark bronze
  const spiral=(x0,y0,r,dir,turns)=>{ let px=x0, py=y0; for(let k=0;k<=40;k++){ const t=k/40, a=dir*t*Math.PI*2*turns, rr=r*(1-t*.85), x=x0+Math.cos(a)*rr, y=y0+Math.sin(a)*rr*.8; if(k) { P.cap(px,py,x,y,.9,Bk); P.cap(px,py-.6,x,y-.6,.35,Gd); } px=x; py=y; } };
  for(const s of [-1,1]){ spiral(cx+s*20,32,6,s,1.6); spiral(cx+s*15,16,4,-s,1.4); P.cap(cx+s*3,14,cx+s*24,14,.8,Gd2);
    // the eyes of the mask: bronze knobs, gold-rimmed, a slit of red light
    const ex=cx+s*11, ey=26; P.ell(ex,ey,5.2,3.8,Bk); P.ell(ex,ey,4.4,3,Gd2); P.ell(ex,ey,3.6,2.4,B1); P.rect(ex,ey-2,1,5,'#c83018'); P.set(ex,ey-1,'#ff9050');
    P.cap(cx+s*5,21,cx+s*16,19,1.1,Bk); P.cap(cx+s*16,19,cx+s*19,22,1,Bk); }
  // the nose ridge with its flanges, the gold boss at the brow
  P.rect(cx-1,13,3,20,B1); P.rect(cx-1,13,1,20,Gd2); for(let y=16;y<32;y+=4){ P.rect(cx-3,y,7,1,B3); }
  P.ell(cx,12,4,2.6,Gd); P.set(cx,11,'#fff0b0'); P.cap(cx-6,34,cx+6,34,1.4,Bk);
  // the mouth: a gaping hole, tiger teeth top and bottom, two fangs down and two up
  P.ell(cx,42,17,6.5,Mo); P.ell(cx,43.5,12,3.6,Mo2);
  for(let k=-7;k<=7;k++){ const x=cx+k*2.2; P.poly([[x-1.1,36.5],[x+1.1,36.5],[x,39.5]],k%2?Th2:Th); if(Math.abs(k)<7) P.poly([[x-1.1,48],[x+1.1,48],[x,45]],k%2?Th:Th2); }
  for(const s of [-1,1]){ P.poly([[cx+s*9,36],[cx+s*11.5,36],[cx+s*10,46]],Th); P.poly([[cx+s*14,48],[cx+s*16,48],[cx+s*15.5,41]],Th2); } })); };

/* ---------- 洞口: 顾长歌 at the mouth of the cave, among the white gnawed trees ---------- */
C2Y.meetCG=function(){
  PixCG.open({ink:(g,W,H,R)=>{ Land.paper(g,W,H,R,'#cfc4ae'); Land.sky(g,W,H,['rgba(150,140,128,.9)','rgba(196,186,166,.6)','rgba(214,204,184,.2)']);
      Land.peaks(g,W,H,R,{y:H*.5,amp:H*.24,n:5,a:.38}); Land.mist(g,W,H,H*.52,H*.16,.45);
      // the cave: a black mouth in a rock face
      g.fillStyle='rgba(58,48,44,.92)'; g.beginPath(); g.moveTo(W*.44,H*.86); g.quadraticCurveTo(W*.5,H*.28,W*.74,H*.3); g.quadraticCurveTo(W*.98,H*.34,W*1.02,H*.86); g.closePath(); g.fill();
      g.fillStyle='rgba(12,8,8,.96)'; g.beginPath(); g.moveTo(W*.56,H*.86); g.quadraticCurveTo(W*.58,H*.46,W*.72,H*.45); g.quadraticCurveTo(W*.86,H*.47,W*.88,H*.86); g.closePath(); g.fill();
      // white trees with their bark gnawed off
      for(const [x,s] of [[.08,1],[.2,.8],[.34,.9],[.94,.7]]){ g.fillStyle='rgba(232,224,206,.95)'; g.fillRect(W*x,H*(.86-.5*s),W*.016,H*.5*s);
        g.strokeStyle='rgba(232,224,206,.9)'; g.lineWidth=W*.006; for(let k=0;k<3;k++){ const y=H*(.86-.5*s+k*.1*s); g.beginPath(); g.moveTo(W*x+W*.008,y); g.lineTo(W*(x+(k%2?.05:-.04)),y-H*.08); g.stroke(); }
        g.fillStyle='rgba(120,100,80,.6)'; for(let k=0;k<6;k++) g.fillRect(W*x,H*(.86-.45*s+k*.06*s),W*.016,H*.006); }
      Land.ground(g,W,H,H*.84,.55,'#5e4c38'); },
    cast:[{who:'me', x:.14, pose:'stand', face:1},{look:LOOK_XIE, x:.27, pose:'stand', face:1, mood:'dim'},{who:'ge', x:.58, pose:'stand', face:-1}],
    title:'洞口', small:'第二章 · 第五幕', seed:5201});
  const c=PixCG.cur; c.front=(g,W,H,fp,t)=>{ // a smell coming out of the cave
    for(let k=0;k<5;k++){ const u=(t*.12+k/5)%1, x=W*(.72-u*.3), y=H*(.62-u*.3+Math.sin(t+k)*.02); g.fillStyle=`rgba(120,110,80,${Math.sin(u*Math.PI)*.18})`; g.beginPath(); g.ellipse(x,y,W*.06,H*.03,0,0,7); g.fill(); } }; };

/* ---------- 饿: the cave, the torch, his back; when he turns his mouth is red. After the mirror he only kneels there. ---------- */
C2Y.caveInk=(g,W,H,R)=>{ Land.paper(g,W,H,R,'#3a302c'); g.fillStyle='rgba(16,10,10,.9)'; g.fillRect(0,0,W,H);
  // the rock: overlapping dark shapes, lit warm on the left by the torch
  for(let k=0;k<9;k++){ const x=R()*W, y=R()*H*.6, r=W*(.12+R()*.2); const gr=g.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,'rgba(70,56,50,.55)'); gr.addColorStop(1,'rgba(70,56,50,0)'); g.fillStyle=gr; g.fillRect(x-r,y-r,r*2,r*2); }
  g.fillStyle='rgba(30,22,20,.95)'; g.beginPath(); g.moveTo(0,0); g.lineTo(W,0); g.lineTo(W,H*.12); for(let x=W;x>=0;x-=W/14) g.lineTo(x,H*(.1+((x*7)%5)*.012)+Math.sin(x*.02)*H*.03); g.closePath(); g.fill();
  for(let k=0;k<7;k++){ const x=W*(.1+k*.13), h=H*(.05+((k*13)%7)*.012); g.beginPath(); g.moveTo(x-W*.02,H*.1); g.lineTo(x,H*.1+h); g.lineTo(x+W*.02,H*.1); g.fill(); }
  const tg=g.createRadialGradient(W*.2,H*.55,0,W*.2,H*.55,W*.55); tg.addColorStop(0,'rgba(255,150,70,.32)'); tg.addColorStop(1,'rgba(255,150,70,0)'); g.fillStyle=tg; g.fillRect(0,0,W,H);
  Land.ground(g,W,H,H*.82,.7,'#2a201c');
  g.fillStyle='rgba(220,210,190,.5)'; for(let k=0;k<14;k++){ const x=R()*W, y=H*(.86+R()*.1); g.fillRect(x,y,W*(.01+R()*.02),H*.006); } };
C2Y.caveCG=function(after){ C2Y.turned=after?0:C2Y.turned;
  const man={x:.7, face:-1, get cv(){ return after?null:C2Y.turned?C2Y.manFig('blood'):FineArt.manBack(Math.floor(performance.now()/260)%2); }, get pose(){ return 'kneel'; }, look:LOOK_MAN, mood:'sad'};
  const cast=[{who:'me', x:.08, pose:'stand', face:1},{who:'ge', x:.24, pose:'lantern', prop:'lantern', face:1},{look:LOOK_XIE, x:.4, pose:'stand', face:1, mood:'sad'}];
  if(!after) cast.push({cv:FineArt.carcass(), x:.75, y:.8, s:1, face:-1}, man); else cast.push({look:LOOK_MAN, x:.7, pose:'kneel', face:-1, mood:'sad'});
  if(PixCG.on&&PixCG.cur&&PixCG.cur.caveScene){ PixCG.swap({ink:C2Y.caveInk, cast}); PixCG.cur.caveScene=1; C2Y.caveFront(); return; }
  PixCG.open({ink:C2Y.caveInk, cast, title:'饿', small:'第二章 · 第五幕', seed:5202}); PixCG.cur.caveScene=1; C2Y.caveFront(); };
C2Y.caveFront=function(){ const c=PixCG.cur; c.front=(g,W,H,fp,t)=>{
    const fl=1+Math.sin(t*9)*.04; const gr=g.createRadialGradient(W*.22,H*.5,W*.1*fl,W*.22,H*.5,W*.75*fl); gr.addColorStop(0,'rgba(10,4,4,0)'); gr.addColorStop(1,'rgba(10,4,4,.55)'); g.fillStyle=gr; g.fillRect(0,0,W,H);
    if(C2Y.turned!==undefined){ g.font=`${Math.round(H*.05)}px "Ma Shan Zheng",KaiTi,serif`; g.textAlign='center';
      for(let k=0;k<5;k++){ const u=(t*.09+k/5)%1; g.fillStyle=`rgba(200,140,120,${Math.sin(u*Math.PI)*.45})`; g.fillText(k%2?'饿':'好饿',W*(.56+((k*.13)%.36)),H*(.6-u*.38)); } } }; };

/* ---------- the three things the mirror shows (drawn as in 大师兄's: small and far away, inside the round glass) ---------- */
// a grown-up seen against the light: the same little figure, all one dark colour
C2Y.sil=function(look,pose,face){ const key='sil'+JSON.stringify([look,pose]); if(FineArt.cache[key]) return FineArt.cache[key];
  const b=cgChibi(look,pose,null,null,null,false), W=b.width, H=b.height, d=b.getContext('2d').getImageData(0,0,W,H).data;
  return FineArt.cache[key]=FineArt.paint(W,H,P=>{ for(let y=0;y<H;y++) for(let x=0;x<W;x++) if(d[(y*W+x)*4+3]) P.set(x,y,y<H*.5?'#1c120c':'#160e0a'); }); };
// a tree stripped of its bark: pale wood, bare forked branches, the gnawed band at the foot
C2Y.bareTree=(g,x,y,s,R,a=.9)=>{ const lean=(R()-.5)*s*.3, pts=[[x,y],[x+lean*.3,y-s*.45],[x+lean*.8,y-s*.8],[x+lean,y-s]];
  brush(g,pts,s*.06,a*.55,'rgba(70,52,36,'+a*.55+')'); g.strokeStyle=`rgba(236,226,204,${a})`; g.lineWidth=s*.035; g.lineCap='round'; g.beginPath(); pts.forEach(([px,py],k)=>k?g.lineTo(px,py):g.moveTo(px,py)); g.stroke();
  for(let i=0;i<5;i++){ const t=.35+i*.13, bx=x+lean*t, by=y-s*t, dir=i%2?1:-1, L=s*(.32-i*.04), ex=bx+dir*L, ey=by-L*.55;
    g.lineWidth=s*.016; g.beginPath(); g.moveTo(bx,by); g.quadraticCurveTo(bx+dir*L*.5,by-L*.1,ex,ey); g.stroke();
    g.lineWidth=s*.008; g.beginPath(); g.moveTo(ex-dir*L*.3,ey+L*.15); g.lineTo(ex-dir*L*.15,ey-L*.25); g.stroke(); }
  g.fillStyle=`rgba(120,90,60,${a*.7})`; for(let k=0;k<5;k++) g.fillRect(x-s*.03+lean*.05,y-s*(.06+k*.035),s*.06,s*.008); };
C2Y.MEM=[
  // 丰年村 in the drought: a white sun, the bare hills, the houses, a dry well, stripped trees, dead stalks in cracked fields
  {title:'丰年村', ink:(g,W,H,R)=>{ Land.paper(g,W,H,R,'#ead7a6'); Land.sky(g,W,H,['rgba(255,246,214,.95)','rgba(242,214,156,.65)','rgba(230,200,146,.25)']); Land.orb(g,W*.72,H*.15,Math.min(W,H)*.07,'#fffaf0',5);
      Land.peaks(g,W,H,R,{y:H*.5,amp:H*.2,n:5,a:.32,tint:'#7a5a34'}); Land.mist(g,W,H,H*.5,H*.12,.35);
      for(const [x,w,h] of [[.14,.2,.22],[.37,.15,.18],[.88,.2,.22]]) C2C.house(g,W*x,H*.74,W*w,H*h,R);
      // the well: a ring of stones, a wooden frame, the bucket hanging dry
      const wx=W*.66, wy=H*.74; g.fillStyle='rgba(120,110,96,.95)'; g.beginPath(); g.ellipse(wx,wy,W*.05,H*.02,0,0,7); g.fill(); g.fillRect(wx-W*.05,wy-H*.05,W*.1,H*.05); g.fillStyle='rgba(30,22,16,.95)'; g.beginPath(); g.ellipse(wx,wy-H*.05,W*.045,H*.014,0,0,7); g.fill();
      g.strokeStyle='rgba(60,40,26,.9)'; g.lineWidth=W*.006; g.beginPath(); g.moveTo(wx-W*.05,wy-H*.05); g.lineTo(wx-W*.04,wy-H*.16); g.lineTo(wx+W*.04,wy-H*.16); g.lineTo(wx+W*.05,wy-H*.05); g.stroke();
      g.lineWidth=W*.002; g.beginPath(); g.moveTo(wx,wy-H*.16); g.lineTo(wx,wy-H*.1); g.stroke(); g.fillStyle='rgba(110,80,50,.95)'; g.fillRect(wx-W*.012,wy-H*.1,W*.024,H*.02);
      Land.ground(g,W,H,H*.72,.6,'#9a7444');
      g.strokeStyle='rgba(66,44,24,.6)'; g.lineWidth=Math.max(1,W*.0025); for(let k=0;k<46;k++){ let x=R()*W, y=H*(.76+R()*.24); g.beginPath(); g.moveTo(x,y); for(let j=0;j<4;j++){ x+=(R()-.5)*W*.06; y+=(R()-.3)*H*.025; g.lineTo(x,y); } g.stroke(); }
      for(let k=0;k<26;k++){ const x=W*(R()*.3+(k%2?.7:0)), y=H*(.88+R()*.1), h=H*(.04+R()*.04), b=(R()-.5)*W*.03; brush(g,[[x,y],[x+b*.3,y-h*.6],[x+b,y-h]],Math.max(1,W*.002),.55,'rgba(110,84,50,.7)'); }
      C2Y.bareTree(g,W*.05,H*.82,H*.42,R,.95); C2Y.bareTree(g,W*.95,H*.8,H*.36,R,.9); C2Y.bareTree(g,W*.27,H*.74,H*.24,R,.7); },
    cast:P=>[{look:C2V[2], x:.12, pose:'reach', face:-1, s:P},{look:LOOK_MAN_MA, x:.45, pose:'kneel', face:1, mood:'sad', s:P},{look:LOOK_MAN_SMALL, x:.53, pose:'hold', face:-1, s:P*.72},
      {look:C2V[3], x:.74, pose:'crouch', face:-1, s:P},{look:C2V[4], x:.84, pose:'kneel', face:-1, s:P, mood:'sad'}]},
  // 别出声: the kitchen at dusk — plank walls, a beam with an empty basket, a red window, the cold stove, the cellar open in
  // the floor, and in the doorway the grown-ups against the light
  {title:'别出声', ink:(g,W,H,R)=>{ Land.paper(g,W,H,R,'#7a6048'); g.fillStyle='rgba(44,30,20,.88)'; g.fillRect(0,0,W,H);
      for(let x=0;x<W;x+=W/16){ g.fillStyle=`rgba(${70+((x*7)%20)},${50+((x*3)%14)},34,.55)`; g.fillRect(x,0,W/16-W*.004,H*.76); }
      g.fillStyle='rgba(26,16,10,.95)'; g.fillRect(0,H*.1,W,H*.035); g.strokeStyle='rgba(26,16,10,.9)'; g.lineWidth=W*.003; g.beginPath(); g.moveTo(W*.42,H*.135); g.lineTo(W*.42,H*.2); g.stroke();
      g.strokeStyle='rgba(120,90,56,.9)'; g.lineWidth=W*.004; g.beginPath(); g.ellipse(W*.42,H*.23,W*.04,H*.03,0,0,Math.PI); g.stroke(); g.beginPath(); g.moveTo(W*.38,H*.23); g.lineTo(W*.46,H*.23); g.stroke();
      // the window: dusk red through a lattice
      const wx=W*.2, wy=H*.22, ww=W*.14, wh=H*.14, gl=g.createRadialGradient(wx+ww/2,wy+wh/2,0,wx+ww/2,wy+wh/2,W*.3); gl.addColorStop(0,'rgba(230,110,60,.4)'); gl.addColorStop(1,'rgba(230,110,60,0)'); g.fillStyle=gl; g.fillRect(0,0,W*.7,H*.7);
      g.fillStyle='rgba(236,120,64,.9)'; g.fillRect(wx,wy,ww,wh); g.strokeStyle='rgba(30,18,10,.95)'; g.lineWidth=W*.006; for(let k=0;k<=4;k++){ g.beginPath(); g.moveTo(wx+ww*k/4,wy); g.lineTo(wx+ww*k/4,wy+wh); g.stroke(); g.beginPath(); g.moveTo(wx,wy+wh*k/4); g.lineTo(wx+ww,wy+wh*k/4); g.stroke(); }
      // the stove: mud brick, two pot holes, an empty pot, cold ash
      g.fillStyle='rgba(120,92,66,.97)'; g.fillRect(W*.02,H*.5,W*.3,H*.26); g.fillStyle='rgba(150,118,86,.97)'; g.fillRect(W*.02,H*.48,W*.3,H*.035);
      for(let k=0;k<4;k++) for(let j=0;j<3;j++){ g.strokeStyle='rgba(80,58,40,.6)'; g.lineWidth=1; g.strokeRect(W*(.02+k*.075+(j%2)*.03),H*(.53+j*.07),W*.075,H*.07); }
      g.fillStyle='rgba(20,12,8,.95)'; g.beginPath(); g.ellipse(W*.17,H*.68,W*.04,H*.045,0,Math.PI,0); g.fill(); g.fillStyle='rgba(110,104,100,.6)'; g.fillRect(W*.14,H*.68,W*.06,H*.012);
      g.fillStyle='rgba(40,36,34,.98)'; g.beginPath(); g.ellipse(W*.12,H*.47,W*.06,H*.035,0,0,Math.PI); g.fill(); g.fillStyle='rgba(70,66,62,1)'; g.beginPath(); g.ellipse(W*.12,H*.47,W*.06,H*.012,0,0,7); g.fill();
      // the doorway: the last light, very bright
      const dg=g.createLinearGradient(W*.76,0,W*.98,0); dg.addColorStop(0,'rgba(250,170,96,.95)'); dg.addColorStop(1,'rgba(255,214,150,.95)'); g.fillStyle=dg; g.fillRect(W*.76,H*.2,W*.22,H*.58);
      g.fillStyle='rgba(30,18,10,.98)'; g.fillRect(W*.745,H*.17,W*.018,H*.61); g.fillRect(W*.975,H*.17,W*.025,H*.61); g.fillRect(W*.745,H*.17,W*.25,H*.03);
      Land.ground(g,W,H,H*.76,.85,'#24180e'); g.strokeStyle='rgba(60,40,24,.6)'; g.lineWidth=1; for(let k=0;k<6;k++){ const y=H*(.8+k*.035); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); } },
    stage:(g,W,H,fp,t)=>{ // the cellar mouth in the floor, black
      g.fillStyle='#070404'; g.beginPath(); g.moveTo(W*.3,H*.83); g.lineTo(W*.5,H*.83); g.lineTo(W*.52,H*.93); g.lineTo(W*.28,H*.93); g.closePath(); g.fill();
      g.strokeStyle='#5a4028'; g.lineWidth=fp*1.4; for(const x of [.35,.45]){ g.beginPath(); g.moveTo(W*x,H*.83); g.lineTo(W*(x-.01),H*.93); g.stroke(); } for(let k=0;k<3;k++){ g.beginPath(); g.moveTo(W*.345,H*(.86+k*.03)); g.lineTo(W*.445,H*(.86+k*.03)); g.stroke(); } },
    cast:P=>[{look:LOOK_MAN_SMALL, x:.4, y:.96, pose:'reach', face:1, s:P*.72, mood:'sad'},{look:LOOK_MAN_MA, x:.5, pose:'reach', face:-1, mood:'sad', s:P},
      {cv:C2Y.sil(C2V[2],'stand'), x:.82, s:P*1.4/1.2*1.2, face:-1},{cv:C2Y.sil(C2V[0],'stand'), x:.88, s:P*1.4/1.2*1.2, face:-1},{cv:C2Y.sil(C2V[3],'point'), x:.93, s:P*1.4/1.2*1.2, face:-1}],
    front:(g,W,H,fp,t)=>{ // the board, lifted; the floor in front of his legs
      g.fillStyle='#2a1c10'; g.fillRect(W*.28,H*.93,W*.26,H*.07);
      g.save(); g.translate(W*.3,H*.83); g.rotate(-1.35); g.fillStyle='#7a5a3a'; g.fillRect(0,-fp*2.2,H*.12,fp*2.2); g.fillStyle='#5a4028'; for(let k=1;k<4;k++) g.fillRect(H*.03*k,-fp*2.2,fp*.6,fp*2.2); g.restore();
      // their eyes, in the dark of their faces
      for(const [x,y] of [[.815,.635],[.875,.63],[.925,.64]]){ if((Math.floor(t*1.3+x*20)%9)===0) continue; g.fillStyle='rgba(255,236,190,.9)'; g.fillRect(W*x-fp*1.6,H*y,fp*1.2,fp*.8); g.fillRect(W*x+fp*.6,H*y,fp*1.2,fp*.8); } }},
  // 大火: the cellar — earth walls, empty jars, a ladder to the board; the fire outside comes down through the cracks
  {title:'大火', ink:(g,W,H,R)=>{ Land.paper(g,W,H,R,'#4a2c1e'); g.fillStyle='rgba(22,10,6,.9)'; g.fillRect(0,0,W,H);
      for(let k=0;k<70;k++){ const x=R()*W, y=H*(.14+R()*.66), w=W*(.02+R()*.06); g.fillStyle=`rgba(${70+R()*30|0},${40+R()*16|0},24,${.18+R()*.2})`; g.fillRect(x,y,w,H*.006); }
      g.fillStyle='rgba(58,34,20,.98)'; g.fillRect(0,0,W,H*.14); for(let k=0;k<=10;k++){ g.fillStyle='rgba(16,8,4,1)'; g.fillRect(W*(k/10)-W*.003,0,W*.006,H*.14); }
      g.strokeStyle='rgba(110,76,44,.95)'; g.lineWidth=W*.008; for(const x of [.86,.94]){ g.beginPath(); g.moveTo(W*x,H*.14); g.lineTo(W*(x-.05),H*.84); g.stroke(); } for(let k=0;k<7;k++){ const u=k/7; g.beginPath(); g.moveTo(W*(.86-u*.05),H*(.2+u*.6)); g.lineTo(W*(.94-u*.05),H*(.2+u*.6)); g.stroke(); }
      for(const [x,s,tip] of [[.08,1,0],[.16,.8,0],[.66,.9,1]]){ const jx=W*x, jy=H*.84, r=W*.04*s; g.save(); g.translate(jx,jy); if(tip) g.rotate(1.3);
        g.fillStyle='rgba(120,70,40,.97)'; g.beginPath(); g.ellipse(0,-r*1.1,r,r*1.15,0,0,7); g.fill(); g.fillStyle='rgba(150,96,56,.9)'; g.beginPath(); g.ellipse(-r*.3,-r*1.4,r*.4,r*.5,0,0,7); g.fill();
        g.fillStyle='rgba(30,16,10,.97)'; g.beginPath(); g.ellipse(0,-r*2.15,r*.5,r*.18,0,0,7); g.fill(); g.restore(); }
      Land.ground(g,W,H,H*.82,.85,'#140806'); },
    cast:P=>[{look:LOOK_MAN_SMALL, x:.36, pose:'crouch', face:1, s:P*.72, mood:'sad'}],
    front:(g,W,H,fp,t)=>{
      for(let k=0;k<10;k++){ const x=W*(k/10+.003), a=.22+.18*Math.sin(t*7+k*2.3)+.08*Math.sin(t*13+k); const gr=g.createLinearGradient(x,H*.14,x+W*.08,H*.86); gr.addColorStop(0,`rgba(255,120,40,${a})`); gr.addColorStop(1,'rgba(255,120,40,0)');
        g.fillStyle=gr; g.beginPath(); g.moveTo(x,H*.14); g.lineTo(x+W*.006,H*.14); g.lineTo(x+W*.11,H*.86); g.lineTo(x+W*.08,H*.86); g.closePath(); g.fill(); }
      for(let k=0;k<14;k++){ const u=(t*.3+k*.137)%1, x=W*((k*.0731)%1)+Math.sin(t+k)*W*.01; g.fillStyle=`rgba(255,${200-u*90|0},90,${(1-u)*.9})`; g.fillRect(x,H*(.15+u*.7),Math.max(2,fp*.8),Math.max(2,fp*.8)); }
      C2Y.eyesDraw(g,W,H,fp,t); }},
];
C2Y.eyesDraw=function(g,W,H,fp,t){ if(!C2Y.eyes){ C2Y.eyesT=0; return; } C2Y.eyesT=C2Y.eyesT||t; const u=Math.min(1,(t-C2Y.eyesT)/2.2), e=u*u*(3-2*u);
  g.save(); g.globalAlpha=.32*e; g.strokeStyle='#c9a24a'; g.lineWidth=fp*.8; const cx=W*.6, cy=H*.4;
  for(const s of [-1,1]){ g.beginPath(); for(let k=0;k<=40;k++){ const tt=k/40, a=s*tt*Math.PI*3.2, rr=W*.07*(1-tt*.85), x=cx+s*W*.17+Math.cos(a)*rr, y=cy+H*.1+Math.sin(a)*rr*.8; k?g.lineTo(x,y):g.moveTo(x,y); } g.stroke(); }
  g.beginPath(); g.moveTo(cx,cy-H*.14); g.lineTo(cx,cy+H*.06); g.stroke(); g.beginPath(); g.moveTo(cx-W*.16,cy+H*.14); g.quadraticCurveTo(cx,cy+H*.24,cx+W*.16,cy+H*.14); g.stroke();
  for(let k=-5;k<=5;k++){ const x=cx+k*W*.026; g.beginPath(); g.moveTo(x-W*.008,cy+H*.15-Math.abs(k)*H*.004); g.lineTo(x,cy+H*.18); g.lineTo(x+W*.008,cy+H*.15-Math.abs(k)*H*.004); g.stroke(); } g.restore();
  for(const s of [-1,1]){ const ex=cx+s*W*.1, ey=cy, rw=W*.065, rh=H*.034*e;
    const gl=g.createRadialGradient(ex,ey,0,ex,ey,rw*2.2); gl.addColorStop(0,`rgba(255,120,40,${.35*e})`); gl.addColorStop(1,'rgba(255,120,40,0)'); g.fillStyle=gl; g.fillRect(ex-rw*2.2,ey-rw*2.2,rw*4.4,rw*4.4);
    if(rh<1) continue; const eye=()=>{ g.beginPath(); g.moveTo(ex-rw,ey+rh*.3*s); g.quadraticCurveTo(ex-rw*.1,ey-rh*1.9,ex+rw,ey-rh*.3*s); g.quadraticCurveTo(ex+rw*.1,ey+rh*1.9,ex-rw,ey+rh*.3*s); g.closePath(); };
    const ig=g.createRadialGradient(ex,ey,0,ex,ey,rw); ig.addColorStop(0,'#fff0a0'); ig.addColorStop(.35,'#ffc030'); ig.addColorStop(.8,'#d04018'); ig.addColorStop(1,'#5a0c06');
    eye(); g.fillStyle=ig; g.fill(); g.strokeStyle='#1a0604'; g.lineWidth=fp; eye(); g.stroke();
    g.fillStyle='#120202'; g.beginPath(); g.ellipse(ex,ey,fp*1.1,rh*1.1,0,0,7); g.fill(); g.fillStyle='rgba(255,255,230,.8)'; g.fillRect(ex-rw*.4,ey-rh*.6,fp*1.5,fp); } };
C2Y.memCG=function(i){ const sc=C2Y.MEM[i], P=.62;
  if(i===0||!PixCG.on||!PixCG.cur||!PixCG.cur.mem) PixCG.open({ink:sc.ink, cast:sc.cast(P), title:sc.title, small:'镜中往事', seed:5300});
  else { PixCG.swap({ink:sc.ink, cast:sc.cast(P)}); const tt=$('#cg .cg-title b'); if(tt) tt.textContent=sc.title; }
  const c=PixCG.cur; c.mem=1; c.gy=.86; c.stage=sc.stage||null;
  c.front=(g,W,H,fp,t)=>{ if(sc.front) sc.front(g,W,H,fp,t);
    if(i===0){ const bx=Math.round(W*.552), by=Math.round(H*.8); FP.r(g,bx-fp*2,by-fp*2,4,2,fp,'#fffaf0'); FP.r(g,bx-fp*2,by,4,1,fp,'#d8c4a0'); FP.r(g,bx-fp,by-fp*3,2,1,fp,'#fffaf0');
      for(let k=0;k<3;k++){ const a=t*.4+k*2.1, x=W*(.5+Math.cos(a)*.3), y=H*(.18+Math.sin(a*1.3)*.05), w=fp*(2+Math.sin(t*6+k)); g.strokeStyle='rgba(30,20,14,.8)'; g.lineWidth=fp*.7; g.beginPath(); g.moveTo(x-w*2,y-w); g.lineTo(x,y); g.lineTo(x+w*2,y-w); g.stroke(); }
      g.strokeStyle='rgba(255,250,230,.1)'; g.lineWidth=fp; for(let k=0;k<6;k++){ const y=H*(.32+k*.06); g.beginPath(); for(let x=0;x<=W;x+=W/30) g.lineTo(x,y+Math.sin(x*.03+t*2+k)*fp*1.5); g.stroke(); } }
    // the round mirror frame, as when it showed 大师兄's village
    const R0=Math.min(W,H)*.62, cx=W/2, cy=H*.5, vg=g.createRadialGradient(cx,cy,R0*.72,cx,cy,R0*1.05); vg.addColorStop(0,'rgba(10,8,6,0)'); vg.addColorStop(1,'rgba(10,8,6,.88)'); g.fillStyle=vg; g.fillRect(0,0,W,H);
    g.strokeStyle=`rgba(232,190,110,${.3+.1*Math.sin(t*2)})`; g.lineWidth=Math.max(2,fp); g.beginPath(); g.arc(cx,cy,R0*.98+Math.sin(t*3)*fp,0,7); g.stroke(); }; };

/* ---------- 饕餮: it stands up out of his shadow ---------- */
C2Y.wakeCG=function(){ C2Y.wakeT=0;
  PixCG.open({ink:C2Y.caveInk, cast:[
      {who:'me', x:.07, pose:'stand', face:1},{look:LOOK_XIE, x:.19, pose:'sword', prop:'sword', face:1},{who:'ge', x:.32, get pose(){ return C2Y.geDraw?'sword':'stand'; }, get prop(){ return C2Y.geDraw?'sword':null; }, face:1},
      {look:LOOK_MAN, x:.6, pose:'kneel', face:-1, mood:'sad'}],
    title:'饕餮', small:'第二章 · 第五幕', seed:5203});
  const c=PixCG.cur, fox=null;
  c.stage=(g,W,H,fp,t)=>{ C2Y.wakeT=C2Y.wakeT||t; const u=Math.min(1,(t-C2Y.wakeT)/2.4), e=u*u*(3-2*u), T=FineArt.taotie(), s=Math.min(fp*2.4,W*.86/T.width,H*.82/T.height), w=T.width*s, h=T.height*s;   // it towers over all of them
    const x=W*.64-w/2, y=H*.94-h*(.45+.55*e)+Math.sin(t*1.1)*fp;
    const gl=g.createRadialGradient(W*.72,H*.5,0,W*.72,H*.5,W*.4); gl.addColorStop(0,`rgba(180,40,20,${.3*u})`); gl.addColorStop(1,'rgba(180,40,20,0)'); g.fillStyle=gl; g.fillRect(0,0,W,H);
    g.save(); g.globalAlpha=.2+.8*e; g.imageSmoothingEnabled=false; g.drawImage(T,Math.round(x),Math.round(y),w,h); g.restore(); };
  c.front=(g,W,H,fp,t)=>{ // the wind pulled toward its mouth
    for(let k=0;k<10;k++){ const u=(t*.5+k/10)%1, y=H*(.3+((k*.37)%.5)), x0=W*(.05+u*.55); g.strokeStyle=`rgba(220,200,180,${(1-u)*.3})`; g.lineWidth=fp*.6; g.beginPath(); g.moveTo(x0,y); g.lineTo(x0+W*.06,y-H*.01); g.stroke(); }
    const vg=g.createRadialGradient(W/2,H/2,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.7); vg.addColorStop(0,'rgba(20,0,0,0)'); vg.addColorStop(1,'rgba(20,0,0,.6)'); g.fillStyle=vg; g.fillRect(0,0,W,H); }; };
