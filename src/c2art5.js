/* ============================================================
   山海问道 · 第五幕的插画 — the cave mouth, 二师兄 in the dark, the three things the mirror shows (丰年村, the cellar, the
   fire), and 饕餮 standing up out of his shadow.
   ============================================================ */
const LOOK_MAN_SMALL={...LOOK_MAN, cloth:2};                                   // in the famine year: a little boy in a faded smock
const LOOK_MAN_MA={g:'f',skin:2,hair:4,hairColor:1,style:'qun',cloth:0,face:'mid'};   // his mother: long brown hair, a faded blue dress
// 何满仓 in the cave: crouched with his back to you, then turning — the same figure, his mouth red
C2Y.manFig=function(mode){ const key='man_'+mode; if(FineArt.cache[key]) return FineArt.cache[key];
  if(mode==='back') return FineArt.cache[key]=cgChibi(LOOK_MAN,'crouch','dim',null,null,true);
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
// what he was eating: a boar-sized beast on its side, legs stiff, opened along the belly
FineArt.carcass=function(){ return FineArt.cache.carcass||(FineArt.cache.carcass=FineArt.paint(52,22,P=>{
  const F='#5a4636', F2='#45362a', L='#6e5844', Bn='#e8dccb', Bl='#8c1a14', B2='#c8413b';
  P.cap(14,8,10,1,1.6,F2); P.cap(22,8,22,1,1.6,F2); P.cap(32,8,34,1,1.6,F2); P.cap(40,9,44,3,1.6,F2);
  P.ell(28,13,18,7,F); P.ell(28,10,16,3,L); P.ell(8,14,6.5,5,F); P.poly([[3,13],[-1,15],[0,18],[4,18]],L); P.cap(4,16,1,13,.8,Bn);
  P.ell(28,17,11,3,Bl); for(let x=20;x<=36;x+=3) P.cap(x,15,x+1,19,.7,Bn); P.rect(22,19,10,1,B2);
  P.rect(14,21,26,1,Bl); P.set(9,12,'#1a1010'); })); };
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
  const man={x:.7, face:-1, get cv(){ return after?null:C2Y.manFig(C2Y.turned?'blood':'back'); }, get pose(){ return 'kneel'; }, look:LOOK_MAN, mood:'sad'};
  const cast=[{who:'me', x:.08, pose:'stand', face:1},{who:'ge', x:.24, pose:'lantern', prop:'lantern', face:1},{look:LOOK_XIE, x:.4, pose:'stand', face:1, mood:'sad'}];
  if(!after) cast.push({cv:FineArt.carcass(), x:.88, s:1, face:-1}, man); else cast.push({look:LOOK_MAN, x:.7, pose:'kneel', face:-1, mood:'sad'});
  if(PixCG.on&&PixCG.cur&&PixCG.cur.caveScene){ PixCG.swap({ink:C2Y.caveInk, cast}); PixCG.cur.caveScene=1; C2Y.caveFront(); return; }
  PixCG.open({ink:C2Y.caveInk, cast, title:'饿', small:'第二章 · 第五幕', seed:5202}); PixCG.cur.caveScene=1; C2Y.caveFront(); };
C2Y.caveFront=function(){ const c=PixCG.cur; c.front=(g,W,H,fp,t)=>{
    const fl=1+Math.sin(t*9)*.04; const gr=g.createRadialGradient(W*.22,H*.5,W*.1*fl,W*.22,H*.5,W*.75*fl); gr.addColorStop(0,'rgba(10,4,4,0)'); gr.addColorStop(1,'rgba(10,4,4,.55)'); g.fillStyle=gr; g.fillRect(0,0,W,H);
    if(C2Y.turned!==undefined){ g.font=`${Math.round(H*.05)}px "Ma Shan Zheng",KaiTi,serif`; g.textAlign='center';
      for(let k=0;k<5;k++){ const u=(t*.09+k/5)%1; g.fillStyle=`rgba(200,140,120,${Math.sin(u*Math.PI)*.45})`; g.fillText(k%2?'饿':'好饿',W*(.56+((k*.13)%.36)),H*(.6-u*.38)); } } }; };

/* ---------- the three things the mirror shows ---------- */
C2Y.bunAt=[.545,.79];
C2Y.memCG=function(i){
  const inks=[
    // 丰年村 in the drought: a white sun, cracked fields, bare stripped trees, the village roofs
    (g,W,H,R)=>{ Land.paper(g,W,H,R,'#e4cf9c'); Land.sky(g,W,H,['rgba(250,232,180,.95)','rgba(236,206,150,.6)','rgba(226,196,140,.2)']);
      const sx=W*.74, sy=H*.2, sr=Math.min(W,H)*.09; const sg=g.createRadialGradient(sx,sy,sr*.6,sx,sy,sr*3.2); sg.addColorStop(0,'rgba(255,250,230,.9)'); sg.addColorStop(1,'rgba(255,250,230,0)'); g.fillStyle=sg; g.fillRect(sx-sr*3.2,sy-sr*3.2,sr*6.4,sr*6.4); g.fillStyle='rgba(255,252,240,.95)'; g.beginPath(); g.arc(sx,sy,sr,0,7); g.fill();
      Land.peaks(g,W,H,R,{y:H*.5,amp:H*.16,n:5,a:.28,tint:'#7a5a30'});
      for(const [x,w] of [[.12,.2],[.36,.16],[.56,.22]]) Land.roof(g,W*(x+w/2),H*.5,W*w,H*.07,.7);
      g.fillStyle='rgba(120,90,50,.5)'; g.fillRect(0,H*.56,W,H*.44);
      g.strokeStyle='rgba(70,46,24,.55)'; g.lineWidth=Math.max(1,W*.002); for(let k=0;k<40;k++){ let x=R()*W, y=H*(.6+R()*.4); g.beginPath(); g.moveTo(x,y); for(let j=0;j<5;j++){ x+=(R()-.5)*W*.05; y+=R()*H*.03; g.lineTo(x,y); } g.stroke(); }
      for(const x of [.06,.9]){ g.fillStyle='rgba(236,226,200,.95)'; g.fillRect(W*x,H*.34,W*.014,H*.34); g.strokeStyle='rgba(236,226,200,.9)'; g.lineWidth=W*.005; for(let k=0;k<3;k++){ const y=H*(.38+k*.08); g.beginPath(); g.moveTo(W*x+W*.007,y); g.lineTo(W*(x+(k%2?.04:-.03)),y-H*.07); g.stroke(); } } },
    // 别出声: the kitchen at dusk, the stove, the cellar door open; at the far door, the grown-ups, their eyes
    (g,W,H,R)=>{ Land.paper(g,W,H,R,'#5a4632'); g.fillStyle='rgba(40,28,20,.9)'; g.fillRect(0,0,W,H);
      g.fillStyle='rgba(200,150,90,.35)'; g.fillRect(W*.78,H*.18,W*.14,H*.56); g.fillStyle='rgba(30,20,14,.9)'; for(let k=0;k<3;k++) g.fillRect(W*(.8+k*.045),H*.3,W*.02,H*.44);
      g.fillStyle='rgba(96,76,60,.95)'; g.fillRect(W*.05,H*.46,W*.3,H*.3); g.fillStyle='rgba(70,54,42,.95)'; g.fillRect(W*.05,H*.44,W*.3,H*.04); g.fillStyle='rgba(20,12,10,.95)'; g.beginPath(); g.arc(W*.2,H*.46,W*.06,Math.PI,0); g.fill();
      g.fillStyle='rgba(10,6,6,.98)'; g.fillRect(W*.38,H*.82,W*.2,H*.1); g.fillStyle='rgba(120,90,60,.95)'; g.save(); g.translate(W*.38,H*.82); g.rotate(-1.1); g.fillRect(0,-H*.02,W*.2,H*.025); g.restore();
      Land.ground(g,W,H,H*.8,.75,'#2e2016'); },
    // 大火: the cellar, the fire outside coming through the cracks of the board above
    (g,W,H,R)=>{ Land.paper(g,W,H,R,'#2a1814'); g.fillStyle='rgba(20,8,6,.94)'; g.fillRect(0,0,W,H);
      g.fillStyle='rgba(60,34,22,.95)'; g.fillRect(0,0,W,H*.14); for(let k=0;k<8;k++){ g.fillStyle='rgba(30,16,10,.95)'; g.fillRect(W*(k/8),0,W*.006,H*.14); }
      Land.ground(g,W,H,H*.8,.8,'#1a0c08'); }];
  const casts=[
    [{look:LOOK_MAN_MA, x:.42, pose:'kneel', face:1, mood:'sad'},{look:LOOK_MAN_SMALL, x:.57, pose:'hold', face:-1, s:.6},{look:C2V[2], x:.16, pose:'crouch', face:1, s:.72, alpha:.7},{look:C2V[4], x:.82, pose:'crouch', face:-1, s:.72, alpha:.7}],
    [{look:LOOK_MAN_MA, x:.44, pose:'reach', face:1, mood:'sad'},{look:LOOK_MAN_SMALL, x:.54, y:1.0, pose:'reach', face:-1, s:.6, mood:'sad'}],
    [{look:LOOK_MAN_SMALL, x:.42, pose:'crouch', face:1, s:.6, mood:'sad'}]];
  const titles=['丰年村','别出声','大火'];
  PixCG.open({ink:inks[i], cast:casts[i], title:titles[i], small:'镜中的往事', seed:5300+i});
  const c=PixCG.cur; c.gy=.86;
  c.front=(g,W,H,fp,t)=>{
    if(i===0){ // the half 馒头 in his hands, the heat shimmer
      const bx=Math.round(W*C2Y.bunAt[0]), by=Math.round(H*C2Y.bunAt[1]); FP.r(g,bx-fp*3,by-fp*2,6,3,fp,'#2a1e1a'); FP.r(g,bx-fp*2,by-fp*3,4,1,fp,'#2a1e1a'); FP.r(g,bx-fp*2,by-fp*2,4,2,fp,'#fffaf0'); FP.r(g,bx-fp*3+fp,by-fp,5,1,fp,'#f3e3c3'); FP.r(g,bx-fp,by-fp*2,1,1,fp,'#ffffff');
      g.strokeStyle='rgba(255,250,230,.12)'; g.lineWidth=fp; for(let k=0;k<6;k++){ const y=H*(.3+k*.06); g.beginPath(); for(let x=0;x<=W;x+=W/30) g.lineTo(x,y+Math.sin(x*.03+t*2+k)*fp*1.5); g.stroke(); } }
    if(i===1){ // the grown-ups at the door, in the dark: only their eyes
      const px=W*.44, pw=W*.2; g.fillStyle='#0a0606'; g.fillRect(px,H*.93,pw,H*.07); g.fillStyle='rgba(46,32,22,1)'; g.fillRect(0,H*.965,W,H*.04);
      g.fillStyle='#7a5a3a'; g.save(); g.translate(px+pw,H*.93); g.rotate(-1.25); g.fillRect(0,-fp*2,H*.16,fp*2); g.fillStyle='#5a4028'; g.fillRect(0,-fp*.6,H*.16,fp*.6); g.restore();
      for(const [x,y] of [[.8,.36],[.85,.4],[.89,.35],[.83,.5]]){ const bl=(Math.floor(t*1.3+x*20)%7)===0; if(bl) continue; g.fillStyle='rgba(255,236,190,.85)'; g.fillRect(W*x,H*y,fp*1.4,fp*.8); g.fillRect(W*x+fp*3,H*y,fp*1.4,fp*.8); } }
    if(i===2){ // firelight through the boards, flickering; and later, two huge eyes opening in the dark behind him
      for(let k=0;k<8;k++){ const x=W*(k/8+.003), a=.25+.2*Math.sin(t*7+k*2); const gr=g.createLinearGradient(x,H*.14,x+W*.06,H*.85); gr.addColorStop(0,`rgba(255,110,40,${a})`); gr.addColorStop(1,'rgba(255,110,40,0)');
        g.fillStyle=gr; g.beginPath(); g.moveTo(x,H*.14); g.lineTo(x+W*.008,H*.14); g.lineTo(x+W*.1,H*.85); g.lineTo(x+W*.07,H*.85); g.closePath(); g.fill(); }
      if(C2Y.eyes){ C2Y.eyesT=C2Y.eyesT||t; const u=Math.min(1,(t-C2Y.eyesT)/2.2), e=u*u*(3-2*u);
        // the old bronze scrollwork of a face, coming out of the dark around them
        g.save(); g.globalAlpha=.32*e; g.strokeStyle='#c9a24a'; g.lineWidth=fp*.8; const cx=W*.68, cy=H*.4;
        for(const s of [-1,1]){ const sp=[[-.2,-.1],[.02,-.1],[.02,.08],[-.13,.08],[-.13,-.03],[-.04,-.03],[-.04,.03]]; g.beginPath(); sp.forEach(([a,b],k)=>{ const x=cx+s*W*(.1+a*-1)*1, y=cy+H*b; k?g.lineTo(x,y):g.moveTo(x,y); }); g.stroke(); }
        g.beginPath(); g.moveTo(cx,cy-H*.14); g.lineTo(cx,cy+H*.06); g.stroke(); g.beginPath(); g.moveTo(cx-W*.16,cy+H*.14); g.quadraticCurveTo(cx,cy+H*.24,cx+W*.16,cy+H*.14); g.stroke();
        for(let k=-5;k<=5;k++){ const x=cx+k*W*.026; g.beginPath(); g.moveTo(x-W*.008,cy+H*.15+Math.abs(k)*-H*.004); g.lineTo(x,cy+H*.18); g.lineTo(x+W*.008,cy+H*.15+Math.abs(k)*-H*.004); g.stroke(); } g.restore();
        for(const s of [-1,1]){ const ex=W*(.68+s*.1), ey=H*.4, rw=W*.065, rh=H*.034*e;
          const gl=g.createRadialGradient(ex,ey,0,ex,ey,rw*2.2); gl.addColorStop(0,`rgba(255,120,40,${.35*e})`); gl.addColorStop(1,'rgba(255,120,40,0)'); g.fillStyle=gl; g.fillRect(ex-rw*2.2,ey-rw*2.2,rw*4.4,rw*4.4);
          if(rh<1) continue; const eye=()=>{ g.beginPath(); g.moveTo(ex-rw,ey+rh*.3*s); g.quadraticCurveTo(ex-rw*.1,ey-rh*1.9,ex+rw,ey-rh*.3*s); g.quadraticCurveTo(ex+rw*.1,ey+rh*1.9,ex-rw,ey+rh*.3*s); g.closePath(); };
          const ig=g.createRadialGradient(ex,ey,0,ex,ey,rw); ig.addColorStop(0,'#fff0a0'); ig.addColorStop(.35,'#ffc030'); ig.addColorStop(.8,'#d04018'); ig.addColorStop(1,'#5a0c06');
          eye(); g.fillStyle=ig; g.fill(); g.strokeStyle='#1a0604'; g.lineWidth=fp; eye(); g.stroke();
          g.fillStyle='#120202'; g.beginPath(); g.ellipse(ex,ey,fp*1.1,rh*1.1,0,0,7); g.fill(); g.fillStyle='rgba(255,255,230,.8)'; g.fillRect(ex-rw*.4,ey-rh*.6,fp*1.5,fp); } }
      else C2Y.eyesT=0; }
    // the mirror's edge: a pale ring, the picture is in the glass
    const vg=g.createRadialGradient(W/2,H*.5,Math.min(W,H)*.32,W/2,H*.5,Math.max(W,H)*.68); vg.addColorStop(0,'rgba(200,220,230,0)'); vg.addColorStop(1,'rgba(30,40,50,.6)'); g.fillStyle=vg; g.fillRect(0,0,W,H); }; };

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
