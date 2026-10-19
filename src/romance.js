/* ============================================================
   山海问道 · 心动事件 — visual-novel scenes for 苏小棠 and 顾长歌
   Painted backgrounds with props, a large half-length portrait with expressions, and longer scripts.
   Script steps: {cg:'scene', who, title} opens · {cgscene:'scene'} changes the background · {face:'smile'}
   changes the expression (normal / smile / blush / sad) · {love:{tang:50}} changes affection · {cgend:true} closes.
   ============================================================ */

/* ---------- half-length portraits: the left half of each row, mirrored ---------- */
const BUST = {
  tang:{ half:[
'................','................','..........HHHHHH','.......HHHHHHHHH','.....HHHHHHHHHHH','....HHHHHHhhHHHH','...HHHHHHhHHHHHH','...HHHHHhHHHHHHH',
'..HHHHHHHHHHHHHH','..HHHHHHHHHHHHHH','..HHHHHHSHHHHHSH','..HHHHHSSSHHHSSS','..HHHHSSSSSHSSSS','..HHHHSSSSSSSSSS','..HHHSSSEEEESSSS','..HHHSSEeIIESSSS',
'..HHHSSEIIIESSSS','..HHHSSSEEEESSSS','..HHHSSSSSSSSSSS','..HHHSSMMSSSSSSS','..HHHHSSSSSSSSSS','..HHHHSSSSSSSSmm','..HHHHHSSSSSSSSS','.HHHHHHHSSSSSSSS',
'.HHHHHHHHSSSSSSS','.HHHHHHHHHsSSSSS','.HHHHHHHHWWsSSSS','HHHHHHHHWWCCWWSS','HHHHHHHCCCCCCWWS','HHHHHHCCCCCCCCWW','HHHHHCCCCcCCCCCW','HHHHCCCCCcCCCCCC',
'HHHCCCCCCCCCCCCC','HHCCCCCCcCCCCCCY','HCCCCCCCCCCCCCYY','CCCCCCCCCCCCCCYY'],
    faces:{ smile:{14:'..HHHSSSSSSSSSSS',15:'..HHHSSSSEESSSSS',16:'..HHHSSSESSESSSS',17:'..HHHSSSSSSSSSSS',21:'..HHHHSSSSSSSmSS',22:'..HHHHHSSSSSSSmm'},
      blush:{19:'..HHHSMMMSSSSSSS',20:'..HHHHSMMSSSSSSS',21:'..HHHHSSSSSSSSSm'},
      sad:{14:'..HHHSSSSSSSSSSS',15:'..HHHSSEEEESSSSS',16:'..HHHSSEIIESSSSS',17:'..HHHSSSSSSSSSSS',21:'..HHHHSSSSSSSSSS',22:'..HHHHHSSSSSSSmm'} },
    // the camellia hairpin over her left ear
    extra:[[5,24,'P'],[6,23,'P'],[6,24,'Y'],[6,25,'P'],[7,24,'P'],[8,25,'G'],[7,26,'G']],
    pal:()=>({H:'#3a2a26',h:'#5e463a',S:'#fbe0c8',s:'#e8c0a0',E:'#2b2533',e:'#ffffff',I:'#8a5a36',M:'#f2a0b0',m:'#c8505a',W:'#fbf3e4',
      C:S&&S.flags.tang_sect?'#e0aa3e':'#3f8f6a', c:S&&S.flags.tang_sect?'#b8862d':'#2f6b4f', Y:'#c8413b', P:'#f2a0b0', G:'#5fa35a'}) },
  ge:{ half:[
'................','............HHHH','...........HHRRR','...........HHHHH','........HHHHHHHH','......HHHHHHHHHH','.....HHHHhHHHHHH','....HHHHhHHHHHHH',
'...HHHHHHHHHHHHH','...HHHHHHHHHHHHH','..HHHHHHHHSHHHHS','..HHHHHHHSSSHHSS','..HHHHHSSSSSSSSS','..HHHHSSEEESSSSS','..HHHHSSSSSSSSSS','..HHHHSSEEEESSSS',
'..HHHHSSEeIESSSS','..HHHHSSSEEESSSS','..HHHHSSSSSSSSSS','..HHHHSSSSSSSSSS','..HHHHHSSSSSSSSS','..HHHHHSSSSSSSmm','..HHHHHHSSSSSSSS','..HHHHHHHSSSSSSS',
'..HHHHHHHHSSSSSS','...HHHHHHHHsSSSS','...HHHHHHHWWsSSS','....HHHHHWWCCWWS','....HHHHWCCCCCWW','...HHHHWCCCCCCCW','...HHHCCCCcCCCCC','...CCCCCCCcCCCCC',
'..CCCCCCCCCCCCCC','.CCCCCCCCCCCCCCC','CCCCCCCCCCCCCCCC','CCCCCCCCCCCCCCCC'],
    faces:{ smile:{21:'..HHHHHSSSSSSmSS',22:'..HHHHHHSSSSSSmm'},
      blush:{19:'..HHHHSMMSSSSSSS',21:'..HHHHHSSSSSSSSm'},
      sad:{13:'..HHHHSSSEEESSSS',15:'..HHHHSSSSSSSSSS',16:'..HHHHSSEEEESSSS',17:'..HHHHSSSEIESSSS'} },
    // red hair ribbon, and the sword hilt with its tassel over the shoulder
    extra:[[19,3,'N'],[20,3,'N'],[21,4,'N'],[22,4,'T'],[22,5,'T'],[22,3,'T'],[23,5,'N'],[24,5,'N'],[25,6,'N'],[23,2,'R'],[24,2,'R'],[25,1,'R']],
    pal:()=>({H:'#1e1a22',h:'#3a3446',S:'#e8b890',s:'#d09a72',E:'#1e1a22',e:'#ffffff',I:'#5a6a8a',M:'#e89a8a',m:'#9a4a44',W:'#2b2533',C:'#f1ece2',c:'#cfc6b6',R:'#c8413b',T:'#e0aa3e',N:'#4a3020'}) },
};
const BUSTC={};
function bust(id, face){
  const B=BUST[id], pal=B.pal(), key=id+face+pal.C; if(BUSTC[key]) return BUSTC[key];
  const half=B.half.map((r,i)=>(B.faces[face]&&B.faces[face][i])||r);
  const rows=half.map(r=>(r+r.split('').reverse().join('')).split(''));
  for(const [y,x,ch] of B.extra) if(rows[y]) rows[y][x]=ch;
  const h=rows.length, w=32, c=document.createElement('canvas'); c.width=w+2; c.height=h+1; const g=c.getContext('2d');
  const on=(x,y)=>y>=0&&y<h&&x>=0&&x<w&&rows[y][x]!=='.';
  g.fillStyle='#2a1e1a'; for(let y=-1;y<h;y++) for(let x=-1;x<=w;x++){ if(on(x,y)) continue; if(on(x-1,y)||on(x+1,y)||on(x,y-1)||on(x,y+1)) g.fillRect(x+1,y+1,1,1); }
  for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const ch=rows[y][x]; if(ch==='.') continue; g.fillStyle=pal[ch]||'#f0f'; g.fillRect(x+1,y+1,1,1); }
  return BUSTC[key]=c;
}

/* ---------- painted scenes ---------- */
const CG_SCENES = {
  herb:    {sky:['#bfe3f2','#e6f4d8','#f8f0d0'], sun:'#fff6d0', sunY:.18, hills:['#a8cf9a','#86b874','#6aa05c'], fx:'petals', fore:'herbfield'},
  sunset:  {sky:['#3c2a5a','#e0765a','#f8c48a'], sun:'#ffdca0', sunY:.5, hills:['#7a4a6a','#5a3456','#3a2240'], fx:'fireflies', fore:'pond'},
  rainpath:{sky:['#4a5a6a','#7a8a96','#a0aab0'], sun:null, hills:['#5a6a72','#46545a','#343e44'], fx:'rain', fore:'rainpath'},
  herbhut: {sky:['#3a2a1a','#4a3626','#5a4430'], sun:null, hills:[], fx:'rainwindow', fore:'hut'},
  lantern: {sky:['#0a1030','#1a2458','#3a3a78'], sun:'#f6f0d6', sunY:.14, hills:['#1a1a3a','#141430'], fx:'lanterns', fore:'bridge'},
  bamboo:  {sky:['#d8ecd0','#eef6e0','#fbf8e8'], sun:'#fffbe0', sunY:.1, hills:['#9cc79a','#7fb07c'], fx:'leaves', fore:'bamboo'},
  moon:    {sky:['#0c1228','#1c2850','#3a4a7a'], sun:'#f6f2dc', sunY:.22, hills:['#28305a','#1e2448','#141834'], fx:'fireflies', fore:'cliff'},
  campfire:{sky:['#05070e','#0e1420','#1a2030'], sun:null, hills:['#141a22','#0e1218','#080a0e'], fx:'sparks', fore:'camp', stars:true},
  dusk:    {sky:['#2a1a3a','#9a4a5a','#f0a070'], sun:'#ffc890', sunY:.48, hills:['#5a2a40','#401c30','#28101e'], fx:'leaves', fore:'duskwood'},
};
const CG = {
  parts:[], on:false, who:null, face:'normal', scene:null,
  bake(sc, w, h){
    const b=document.createElement('canvas'); b.width=w; b.height=h; const g=b.getContext('2d'), R=rng((sc.fore||'x').length*131+sc.sky.join('').length);
    const sky=g.createLinearGradient(0,0,0,h); sc.sky.forEach((col,i)=>sky.addColorStop(i/(sc.sky.length-1),col)); g.fillStyle=sky; g.fillRect(0,0,w,h);
    if(sc.stars) for(let i=0;i<160;i++){ g.fillStyle=`rgba(255,255,240,${.3+R()*.7})`; g.fillRect(R()*w,R()*h*.6,R()<.1?2:1,R()<.1?2:1); }
    if(sc.sun){ const sx=w*.72, sy=h*sc.sunY, r=Math.min(w,h)*.08, gl=g.createRadialGradient(sx,sy,r*.4,sx,sy,r*4.5); gl.addColorStop(0,sc.sun+'aa'); gl.addColorStop(1,sc.sun+'00'); g.fillStyle=gl; g.fillRect(0,0,w,h); g.fillStyle=sc.sun; g.beginPath(); g.arc(sx,sy,r,0,7); g.fill();
      for(let i=0;i<5;i++){ g.fillStyle='rgba(255,255,255,.14)'; const cy=h*(.08+R()*.3), cx=R()*w; for(let k=0;k<5;k++){ g.beginPath(); g.ellipse(cx+k*28-60,cy+Math.sin(k)*6,40,10,0,0,7); g.fill(); } } }
    sc.hills.forEach((col,li)=>{ const base=h*(.46+li*.1), amp=h*(.12-li*.02), ph=R()*9;
      for(let pass=0;pass<4;pass++){ g.globalAlpha=pass===3?1:.2; g.fillStyle=col; g.beginPath(); g.moveTo(0,h);
        for(let x=0;x<=w;x+=4) g.lineTo(x, base-amp*(.6*Math.sin(x/w*Math.PI*2+ph)+.3*Math.sin(x/w*Math.PI*6+ph*2))+(3-pass)*3*(R()-.3)); g.lineTo(w,h); g.fill(); }
      g.globalAlpha=1; const mist=g.createLinearGradient(0,base,0,base+h*.1); mist.addColorStop(0,'rgba(255,255,255,0)'); mist.addColorStop(.5,'rgba(240,240,235,.12)'); mist.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=mist; g.fillRect(0,base,w,h*.12); });
    CG.fore(g, sc.fore, w, h, R);
    const vg=g.createRadialGradient(w/2,h/2,Math.min(w,h)*.35,w/2,h/2,Math.max(w,h)*.75); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,.35)'); g.fillStyle=vg; g.fillRect(0,0,w,h);
    return b;
  },
  fore(g, kind, w, h, R){
    const tree=(x,y,s,col,col2)=>{ g.fillStyle=col2; g.fillRect(x-s*.08,y-s*.6,s*.16,s*.6); g.fillStyle=col; for(let k=0;k<6;k++){ g.beginPath(); g.arc(x+(R()-.5)*s*.6,y-s*.6-R()*s*.5,s*(.2+R()*.15),0,7); g.fill(); } };
    if(kind==='herbfield'){ g.fillStyle='#6aa84f'; g.fillRect(0,h*.72,w,h*.28);
      for(let r=0;r<5;r++){ const y=h*(.76+r*.05); g.fillStyle='#8a5a36'; g.fillRect(0,y,w,h*.012); for(let x=(r%2)*20;x<w;x+=40){ g.fillStyle=r%2?'#4f9a3a':'#7fca5c'; g.beginPath(); g.ellipse(x,y-4,10,7,0,0,7); g.fill(); g.fillStyle='#f2f2a0'; g.fillRect(x-1,y-10,3,3); } }
      g.fillStyle='#8a5a36'; for(let x=0;x<w*.35;x+=26){ g.fillRect(x,h*.66,5,h*.08); } g.fillRect(0,h*.68,w*.35,4); g.fillRect(0,h*.71,w*.35,4);
      const bx=w*.18, by=h*.84; g.fillStyle='#b88a4a'; g.beginPath(); g.moveTo(bx-30,by-30); g.lineTo(bx+30,by-30); g.lineTo(bx+22,by+10); g.lineTo(bx-22,by+10); g.fill();
      g.strokeStyle='#8a5a36'; g.lineWidth=2; for(let i=-2;i<=2;i++){ g.beginPath(); g.moveTo(bx+i*10,by-30); g.lineTo(bx+i*8,by+10); g.stroke(); } g.fillStyle='#5fa35a'; g.beginPath(); g.ellipse(bx,by-32,26,8,0,0,7); g.fill(); }
    if(kind==='pond'){ const wg=g.createLinearGradient(0,h*.64,0,h); wg.addColorStop(0,'#e0866a'); wg.addColorStop(1,'#3a2440'); g.fillStyle=wg; g.fillRect(0,h*.64,w,h*.36);
      for(let i=0;i<9;i++){ const x=R()*w, y=h*(.72+R()*.22); g.fillStyle='#3f7a4a'; g.beginPath(); g.ellipse(x,y,22,8,0,.3,Math.PI*2-.3); g.fill(); if(R()<.4){ g.fillStyle='#f6b0c0'; g.beginPath(); g.ellipse(x+4,y-6,6,8,0,0,7); g.fill(); } }
      g.fillStyle='#24142a'; for(let i=0;i<40;i++){ const x=R()<.5?R()*w*.25:w*.8+R()*w*.2, hh=h*(.08+R()*.14); g.fillRect(x,h*.68-hh,2,hh); g.fillRect(x-2,h*.68-hh,6,6); }
      g.fillStyle='#4a3a4a'; g.beginPath(); g.ellipse(w*.38,h*.7,70,22,0,0,7); g.fill(); }
    if(kind==='rainpath'){ g.fillStyle='#3a464c'; g.beginPath(); g.moveTo(w*.35,h); g.quadraticCurveTo(w*.5,h*.7,w*.55,h*.55); g.lineTo(w*.62,h*.55); g.quadraticCurveTo(w*.7,h*.7,w*.75,h); g.fill();
      tree(w*.15,h*.8,h*.5,'#2e3c38','#232a28'); tree(w*.88,h*.82,h*.45,'#2e3c38','#232a28');
      g.fillStyle='#4a3a2a'; g.fillRect(w*.58,h*.45,40,30); g.fillStyle='#2a2018'; g.beginPath(); g.moveTo(w*.58-10,h*.45); g.lineTo(w*.58+20,h*.4); g.lineTo(w*.58+50,h*.45); g.fill(); g.fillStyle='#e8b84a'; g.fillRect(w*.58+16,h*.47,8,10); }
    if(kind==='hut'){ g.fillStyle='#5a4028'; for(let x=0;x<w;x+=36){ g.fillRect(x,0,30,h); } g.fillStyle='#3a2818'; for(let x=30;x<w;x+=36) g.fillRect(x,0,6,h);
      g.fillStyle='#24303a'; g.fillRect(w*.62,h*.15,w*.26,h*.3); g.fillStyle='#4a3020'; g.fillRect(w*.62,h*.15,w*.26,6); g.fillRect(w*.62,h*.45-6,w*.26,6); g.fillRect(w*.75-3,h*.15,6,h*.3);
      g.fillStyle='#6a4a2a'; g.fillRect(w*.05,h*.25,w*.3,10); g.fillRect(w*.05,h*.42,w*.3,10);
      for(let i=0;i<7;i++){ const x=w*.07+i*w*.04; g.fillStyle=['#5fa35a','#c8413b','#e8b84a','#8b5bc5','#4a7fd0'][i%5]; g.fillRect(x,h*.25-22,16,22); g.fillStyle='#d8c8a8'; g.fillRect(x+2,h*.25-26,12,5); }
      for(let i=0;i<6;i++){ const x=w*.08+i*w*.045; g.fillStyle='#b88a4a'; g.beginPath(); g.ellipse(x+8,h*.42-12,10,12,0,0,7); g.fill(); }
      g.fillStyle='#3a2818'; g.fillRect(0,h*.82,w,h*.18); const lx=w*.45, ly=h*.3, gl=g.createRadialGradient(lx,ly,0,lx,ly,h*.5); gl.addColorStop(0,'rgba(255,190,100,.35)'); gl.addColorStop(1,'rgba(255,190,100,0)'); g.fillStyle=gl; g.fillRect(0,0,w,h);
      g.fillStyle='#c8413b'; g.fillRect(lx-12,ly-16,24,30); g.fillStyle='#ffdc8a'; g.fillRect(lx-6,ly-10,12,18); }
    if(kind==='bridge'){ g.fillStyle='#0e1430'; g.fillRect(0,h*.7,w,h*.3);
      for(let i=0;i<30;i++){ const x=R()*w, y=h*(.74+R()*.24); g.fillStyle='rgba(255,180,90,.9)'; g.beginPath(); g.moveTo(x-8,y); g.lineTo(x+8,y); g.lineTo(x+5,y+5); g.lineTo(x-5,y+5); g.fill(); g.fillStyle='rgba(255,200,120,.25)'; g.fillRect(x-1,y+6,2,14); }
      g.strokeStyle='#2a1e3a'; g.lineWidth=14; g.beginPath(); g.moveTo(-20,h*.78); g.quadraticCurveTo(w*.5,h*.48,w+20,h*.78); g.stroke();
      g.strokeStyle='#3a2a4a'; g.lineWidth=3; g.beginPath(); g.moveTo(-20,h*.72); g.quadraticCurveTo(w*.5,h*.42,w+20,h*.72); g.stroke();
      for(let i=0;i<=10;i++){ const t=i/10, x=-20+(w+40)*t, y=h*.72-(1-Math.pow(2*t-1,2))*h*.15; g.fillStyle='#3a2a4a'; g.fillRect(x-2,y,4,h*.06); }
      g.strokeStyle='rgba(255,200,120,.6)'; g.lineWidth=1; g.beginPath(); g.moveTo(0,h*.2); g.quadraticCurveTo(w*.5,h*.32,w,h*.18); g.stroke();
      for(let i=0;i<14;i++){ const x=i/13*w, y=h*.2+Math.sin(i/13*Math.PI)*h*.1-(i===0||i===13?h*.01:0); g.fillStyle='#e0503a'; g.fillRect(x-5,y,10,13); g.fillStyle='#ffd88a'; g.fillRect(x-2,y+3,4,7); } }
    if(kind==='bamboo'){ for(let i=0;i<20;i++){ const x=R()*w, ww=8+R()*12; g.fillStyle=`rgba(${70+R()*40|0},${130+R()*40|0},70,${.55+R()*.45})`; g.fillRect(x,0,ww,h); for(let y=R()*60;y<h;y+=60+R()*30){ g.fillStyle='rgba(30,70,30,.5)'; g.fillRect(x-1,y,ww+2,3); g.fillStyle='rgba(70,140,60,.8)'; g.beginPath(); g.ellipse(x+ww+10,y+6,14,4,.4,0,7); g.fill(); } }
      g.fillStyle='rgba(255,255,220,.12)'; for(let i=0;i<4;i++){ g.beginPath(); g.moveTo(w*(.2+i*.2),0); g.lineTo(w*(.3+i*.2),0); g.lineTo(w*(.1+i*.2),h); g.lineTo(w*(.0+i*.2),h); g.fill(); }
      g.fillStyle='#8a6a4a'; g.fillRect(0,h*.86,w,h*.14); g.fillStyle='#6a4a2a'; g.fillRect(w*.12,h*.55,18,h*.31); g.fillRect(w*.12-14,h*.62,46,8); g.fillRect(w*.12-14,h*.72,46,8); }
    if(kind==='cliff'){ g.fillStyle='rgba(255,255,255,.12)'; for(let i=0;i<4;i++){ g.beginPath(); g.ellipse(R()*w,h*(.15+R()*.25),120,14,0,0,7); g.fill(); }
      g.fillStyle='#0c1020'; g.beginPath(); g.moveTo(0,h); g.lineTo(0,h*.72); g.lineTo(w*.35,h*.7); g.lineTo(w*.55,h*.78); g.lineTo(w,h*.76); g.lineTo(w,h); g.fill();
      const px=w*.12, py=h*.72; g.fillStyle='#0a0e1a'; g.fillRect(px,py-h*.32,8,h*.32); for(let k=0;k<5;k++){ g.beginPath(); g.ellipse(px+30-k*4,py-h*.3+k*h*.05,60-k*6,10,-.15,0,7); g.fill(); } }
    if(kind==='camp'){ g.fillStyle='#06080c'; g.fillRect(0,h*.86,w,h*.14); for(let i=0;i<14;i++){ const x=R()*w, th=h*(.3+R()*.4); g.fillStyle='#0a0e14'; g.beginPath(); g.moveTo(x,h*.86-th); g.lineTo(x-34,h*.86); g.lineTo(x+34,h*.86); g.fill(); }
      g.fillStyle='#2a2018'; g.beginPath(); g.moveTo(w*.72,h*.86); g.lineTo(w*.82,h*.62); g.lineTo(w*.92,h*.86); g.fill(); g.fillStyle='#3a2a1a'; g.beginPath(); g.moveTo(w*.79,h*.86); g.lineTo(w*.82,h*.7); g.lineTo(w*.85,h*.86); g.fill();
      g.fillStyle='#4a3020'; g.save(); g.translate(w*.5,h*.86); g.rotate(.3); g.fillRect(-30,-4,60,8); g.rotate(-.6); g.fillRect(-30,-4,60,8); g.restore(); }
    if(kind==='duskwood'){ for(let i=0;i<8;i++) tree(R()*w,h*(.85+R()*.1),h*(.3+R()*.2),'#2a1420','#1a0a12'); g.fillStyle='#1a0a12'; g.fillRect(0,h*.86,w,h*.14);
      for(let i=0;i<3;i++){ const x=w*(.2+i*.3), y=h*.88; g.fillStyle='#3a2a2a'; g.beginPath(); g.ellipse(x,y,26,8,0,0,7); g.fill(); g.fillStyle='#5a4a4a'; g.beginPath(); g.moveTo(x-10,y-4); g.lineTo(x-30,y-16); g.lineTo(x-8,y-8); g.fill(); } }
  },
  paint(c, sc, t, dt){
    const g=c.getContext('2d'), w=c.width, h=c.height; if(!c._base||c._sc!==sc){ c._base=CG.bake(sc,w,h); c._sc=sc; CG.parts=[]; }
    g.drawImage(c._base,0,0);
    if(sc.fore==='pond'){ for(let i=0;i<14;i++){ const y=h*.68+i*h*.018, a=.25-i*.015; g.fillStyle=`rgba(255,210,150,${a})`; const wv=Math.sin(t*1.5+i)*12; g.fillRect(w*.62+wv-30+i*2, y, 60-i*3, 2); } }
    if(sc.fore==='camp'){ const fx=w*.5, fy=h*.84, r=h*.38*(1+.05*Math.sin(t*9)), gl=g.createRadialGradient(fx,fy,0,fx,fy,r); gl.addColorStop(0,'rgba(255,170,60,.55)'); gl.addColorStop(1,'rgba(255,120,40,0)'); g.fillStyle=gl; g.fillRect(0,0,w,h);
      g.fillStyle='#ff7a30'; g.beginPath(); g.ellipse(fx,fy,22,16,0,0,7); g.fill(); g.fillStyle='#ffcf60'; g.beginPath(); g.ellipse(fx,fy-10,14+3*Math.sin(t*12),28+6*Math.sin(t*9),0,0,7); g.fill(); }
    if(sc.fore==='hut'){ const f=.85+.15*Math.sin(t*7); g.fillStyle=`rgba(255,200,120,${.08*f})`; g.fillRect(0,0,w,h); }
    const P=CG.parts, want={petals:34,fireflies:30,rain:140,rainwindow:60,lanterns:26,leaves:26,sparks:44}[sc.fx]||0;
    while(P.length<want) P.push({x:Math.random()*w, y:Math.random()*h, s:Math.random(), v:.5+Math.random()});
    for(const p of P){
      if(sc.fx==='petals'||sc.fx==='leaves'){ p.y+=dt*h*.06*p.v; p.x+=Math.sin(t+p.s*9)*dt*30; if(p.y>h+10){ p.y=-10; p.x=Math.random()*w; }
        g.fillStyle=sc.fx==='petals'?`rgba(245,170,190,${.6+.4*p.s})`:`rgba(${150+p.s*60|0},${120+p.s*40|0},70,.85)`; g.save(); g.translate(p.x,p.y); g.rotate(t*p.v+p.s*6); g.fillRect(-4,-2,8,4); g.restore();
        if(sc.fx==='petals'&&p.s>.92){ const bx=(p.x*1.7)%w, by=h*.6+Math.sin(t*3+p.s*30)*30, fl=Math.sin(t*14)>0?3:1; g.fillStyle='#fff6a0'; g.fillRect(bx-4,by,4,fl); g.fillRect(bx+1,by,4,fl); } }
      if(sc.fx==='fireflies'){ p.x+=Math.sin(t*.7+p.s*9)*dt*20; p.y+=Math.cos(t*.5+p.s*7)*dt*14; const a=.4+.6*Math.abs(Math.sin(t*2+p.s*10));
        const gl=g.createRadialGradient(p.x,p.y,0,p.x,p.y,18); gl.addColorStop(0,`rgba(255,250,170,${a})`); gl.addColorStop(1,'rgba(255,250,170,0)'); g.fillStyle=gl; g.fillRect(p.x-18,p.y-18,36,36); }
      if(sc.fx==='rain'){ p.y+=dt*h*1.6*p.v; p.x-=dt*60; if(p.y>h){ p.y=-20; p.x=Math.random()*w*1.1; } g.strokeStyle='rgba(220,230,240,.35)'; g.lineWidth=1; g.beginPath(); g.moveTo(p.x,p.y); g.lineTo(p.x-4,p.y+16); g.stroke(); }
      if(sc.fx==='rainwindow'){ const x0=w*.62, y0=h*.15, ww=w*.26, hh=h*.3; p.y+=dt*hh*1.5*p.v; if(p.y>y0+hh||p.y<y0) p.y=y0; const x=x0+(p.x/w)*ww; g.strokeStyle='rgba(200,220,240,.5)'; g.lineWidth=1; g.beginPath(); g.moveTo(x,p.y); g.lineTo(x-2,Math.min(y0+hh,p.y+10)); g.stroke(); }
      if(sc.fx==='lanterns'){ p.y-=dt*h*.03*p.v; p.x+=Math.sin(t*.6+p.s*5)*dt*8; if(p.y<-30){ p.y=h*.7; p.x=Math.random()*w; } const s=8+p.s*10;
        const gl=g.createRadialGradient(p.x,p.y,0,p.x,p.y,s*2.5); gl.addColorStop(0,'rgba(255,200,110,.6)'); gl.addColorStop(1,'rgba(255,160,80,0)'); g.fillStyle=gl; g.fillRect(p.x-s*2.5,p.y-s*2.5,s*5,s*5);
        g.fillStyle='#ffb050'; g.fillRect(p.x-s/2,p.y-s*.6,s,s*1.2); g.fillStyle='#ffe0a0'; g.fillRect(p.x-s/4,p.y-s*.3,s/2,s*.6); }
      if(sc.fx==='sparks'){ p.y-=dt*h*.25*p.v; p.x=w*.5+Math.sin(t*3+p.s*20)*40*p.s+(p.s-.5)*30; if(p.y<h*.3){ p.y=h*.82; } g.fillStyle=`rgba(255,${150+p.s*90|0},60,${.4+.6*p.s})`; g.fillRect(p.x,p.y,2,2); }
    }
  },
  draw(pop){ const her=$('#cgHer'); if(!her||!CG.who) return; const sp=bust(CG.who,CG.face); her.width=sp.width; her.height=sp.height; her.getContext('2d').drawImage(sp,0,0);
    if(pop){ her.classList.remove('pop'); void her.offsetWidth; her.classList.add('pop'); } },
  open(scene, who, title){
    const el=$('#cg'); el.hidden=false; CG.parts=[]; CG.on=true; CG.who=who; CG.face='normal'; CG.scene=CG_SCENES[scene]; const token=CG.token=(CG.token||0)+1;
    el.innerHTML=`<canvas id="cgBg"></canvas><div class="cg-chars"><canvas id="cgMe" class="px"></canvas><canvas id="cgHer" class="px bust"></canvas></div><div class="cg-title"><small>心动事件 · ${esc(NPCS[who].name)}</small><b>${esc(title)}</b></div>`;
    const bg=$('#cgBg'), dpr=Math.min(2,devicePixelRatio||1); bg.width=innerWidth*dpr; bg.height=innerHeight*dpr;
    const me=$('#cgMe'), ms=lookSprite(S.look,'side',0); me.width=ms.width; me.height=ms.height; me.getContext('2d').drawImage(ms,0,0);
    CG.draw(false); let t0=performance.now(), last=t0;
    const loop=now=>{ if(!CG.on||CG.token!==token) return; const dt=Math.min(.05,(now-last)/1000); last=now; CG.paint(bg,CG.scene,(now-t0)/1000,dt); requestAnimationFrame(loop); };
    CG.paint(bg,CG.scene,0,0); requestAnimationFrame(loop);
    el.classList.remove('go'); void el.offsetWidth; el.classList.add('go'); Music.play('romance', true);
  },
  setScene(scene){ const bg=$('#cgBg'); if(!bg||!CG_SCENES[scene]) return; CG.scene=CG_SCENES[scene]; const el=$('#cg'); el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap'); CG.paint(bg,CG.scene,0,0); },
  setFace(f){ if(CG.face===f) return; CG.face=f; CG.draw(true); },
  close(){ CG.on=false; CG.who=null; const el=$('#cg'); el.hidden=true; el.innerHTML=''; Music.play(areaTheme(),true); },
};

/* ---------- the events ---------- */
const HEART_CG = {
  tang:{
    2:{scene:'herb', title:'药香', steps:[
      ['旁白','清晨的雾还没散。你路过镇外的药圃，看见苏小棠蹲在田垄间，裙摆上沾满了露水。'],
      ['苏小棠','啊，{名}！你来得正好——帮我扶一下这株，对，就是这样，轻一点……'],
      ['旁白','你扶住那株细弱的灵草。她屏住呼吸，用小铲一点点松开根边的土，像在对待一件易碎的瓷器。'],
      {face:'smile'},['苏小棠','好啦！这株叫「凝露草」，最怕伤根。我爹说，草药和人一样，挪了窝都要难受好几天。'],
      ['苏小棠','所以要轻轻的，慢慢的，它才会愿意在新地方活下来。'],
      {face:'normal'},['旁白','她把凝露草放进药篓，拍了拍手上的泥，又像是想起什么，从袖子里摸出一样东西。'],
      {face:'blush'},['苏小棠','这个……给你。'],
      ['旁白','一个绣着山茶花的小香囊，针脚有些歪，却缝得很密。'],
      {choice:'你要怎么说？', options:[{text:'好香，是你亲手绣的？', go:'tang2a'},{text:'谢谢，我会一直带着。', go:'tang2b'}]}]},
    4:{scene:'sunset', title:'池畔晚霞', steps:[
      ['旁白','夕阳把池塘染成了橘红色。苏小棠坐在池边的大石头上，赤着脚，裙角浸在水里，轻轻哼着一首小调。'],
      ['旁白','你在她身边坐下。歌声停了一瞬，又继续唱了下去，比刚才更轻。'],
      {face:'smile'},['苏小棠','这是我娘以前唱给我听的。她不在好多年了……我只记得这首歌，还有她身上的药香。'],
      {face:'sad'},['苏小棠','有时候我会怕，怕哪天连这首歌也忘了。'],
      ['旁白','一只萤火虫落在她的发梢，她没有察觉。'],
      {face:'normal'},['苏小棠','娘说，等我遇见想一起看夕阳的人，就唱给他听。'],
      {face:'blush'},['苏小棠','……我、我只是随口一说！你别多想！'],
      {choice:'……', options:[{text:'那我能一直听你唱吗？', go:'tang4a'},{text:'（安静地陪她看完夕阳）', go:'tang4b'},{text:'这首歌叫什么名字？', go:'tang4c'}]}]},
    6:{scene:'rainpath', title:'雨中药庐', steps:[
      ['旁白','午后，一场急雨毫无预兆地落了下来。你沿着山路跑向山脚的旧药庐。'],
      ['旁白','药庐的屋檐下，蹲着一个浑身湿透的身影。'],
      {cgscene:'herbhut'},
      {face:'sad'},['苏小棠','阿嚏！……{名}？你怎么也在这儿……'],
      ['苏小棠','我、我只是想多采一株雪莲。长老说雪莲要淋过雨才最有药性，没想到雨这么大……'],
      ['旁白','她冻得嘴唇发白，怀里却紧紧抱着药篓。你低头一看——那株雪莲上，一滴雨水都没有沾到。'],
      {face:'normal'},['苏小棠','你上次打穷奇受的伤，到现在还没好全吧？雪莲配回春丹……能好得快一些。'],
      {choice:'你要怎么做？', options:[{text:'把外衣披在她身上', go:'tang6a'},{text:'运转灵力帮她烘干衣裳', go:'tang6b'},{text:'数落她不要命', go:'tang6c'}]}]},
    8:{scene:'lantern', title:'灯会花笺', steps:[
      ['旁白','一年一度的桃源灯会。千盏河灯顺着溪水漂向远方，石桥上挂满了红灯笼，夜空亮如白昼。'],
      ['苏小棠','{名}，这边——！'],
      {face:'smile'},['旁白','她提着一盏小小的山茶花灯，穿过人群朝你跑来，额前的碎发都跑乱了。'],
      ['苏小棠','我找了你好久……你看，这盏灯是我自己扎的，花瓣是用你帮我采的那些野山茶染的颜色。'],
      {face:'normal'},['旁白','你们并肩站在石桥上。桥下的河灯一盏接一盏地漂过，把她的侧脸映得忽明忽暗。'],
      {face:'blush'},['苏小棠','还有……花笺。第一张，我想送给你。'],
      ['旁白','花笺上压着一片山茶花瓣，旁边是一行娟秀的小字——'],
      ['旁白','「青丘晚霞好，愿与君同看。」'],
      ['苏小棠','你、你不用马上回答！我就是……想让你知道。'],
      {choice:'你……', options:[{text:'我也愿意。', go:'tang8a'},{text:'（郑重地把花笺收进怀里）', go:'tang8b'}]}]},
  },
  ge:{
    2:{scene:'bamboo', title:'木剑', steps:[
      ['旁白','镇外的竹林里，剑风扫过，竹叶纷纷扬扬地落下。顾长歌收剑回身，看见了你。'],
      ['顾长歌','你来得正好。'],
      ['旁白','他随手削下一截竹枝，三两下削成木剑，抛给你。'],
      ['顾长歌','陪我练一招。木剑伤不了人——但你若不用心，会疼。'],
      ['旁白','他摆开起手式。那是你从未见过的剑架，看似松散，却找不到一丝破绽。'],
      {choice:'你要怎么出剑？', options:[{text:'全力出手', go:'ge2a'},{text:'留三分力，看看他的剑路', go:'ge2b'}]}]},
    4:{scene:'moon', title:'月下拭剑', steps:[
      ['旁白','深夜，你在镇外的崖边找到了顾长歌。月光很亮，他独自坐着，用一块旧布一遍遍擦拭着佩剑。'],
      ['顾长歌','……睡不着？'],
      ['旁白','你在他身边坐下。崖下的山林一片漆黑，只有远处的狐祠亮着一点微光。'],
      {face:'sad'},['顾长歌','这把剑，是我师父留下的。'],
      ['顾长歌','十年前，他挡在我身前，被饕餮一口吞了下去。剑掉在我脚边，还是热的。'],
      ['顾长歌','我追了它十年。从北到南，一个山头一个山头地找。'],
      {face:'normal'},['顾长歌','……我从没跟别人说过这件事。'],
      {choice:'你要说什么？', options:[{text:'我陪你一起找饕餮。', go:'ge4a'},{text:'（在他身边坐下，什么也不说）', go:'ge4b'}]}]},
    6:{scene:'campfire', title:'北方来信', steps:[
      ['旁白','深夜的山林里，你循着一点火光找了过去。顾长歌坐在篝火旁，手里捏着一块碎掉的玉牌。'],
      ['顾长歌','……你来了。坐吧。'],
      ['旁白','篝火噼啪作响。他把玉牌递给你看——上面刻着半个模糊的徽记，像一柄剑，又像一团火焰。'],
      ['顾长歌','今天收到一封信，从北边来的。信上只有一句话：「门中尚有人在」。'],
      {face:'sad'},['顾长歌','十年前，我的师门一夜之间满门尽灭。我一直以为……只剩我一个了。'],
      ['顾长歌','这块玉牌，是我从废墟里扒出来的。另一半，到现在都没找到。'],
      {choice:'你要问吗？', options:[{text:'是谁做的？', go:'ge6a'},{text:'（不再追问，往火堆里添一根柴）', go:'ge6b'}]}]},
    8:{scene:'dusk', title:'并肩', steps:[
      ['旁白','黄昏的山林，妖气骤然翻涌。三只蛊雕从林梢扑下，婴儿般的啼哭声刺得耳膜生疼。'],
      ['顾长歌','背靠背。别分心。'],
      ['旁白','你们的后背抵在一起。你能感觉到他的呼吸，平稳得像一潭深水。'],
      ['旁白','剑光与灵光交织。第一只蛊雕被他一剑斩落，第二只扑向他的死角——你的剑先到了。'],
      ['旁白','最后一只蛊雕坠地时，夕阳正好沉进山后。'],
      {face:'smile'},['顾长歌','……你的剑，可以托付后背了。'],
      ['旁白','这是你第一次看见他真正地笑。很短，像夕阳最后的那一线光。'],
      {face:'normal'},['顾长歌','饕餮醒了。信上说，北边已经有三个村子被吞了。'],
      ['顾长歌','我要往北走。'],
      {choice:'你……', options:[{text:'我跟你一起去。', go:'ge8a'},{text:'我等你回来。', go:'ge8b'}]}]},
  },
};
Object.assign(SCRIPTS, {
  tang2a:[{face:'blush'},['苏小棠','嗯……绣得歪歪扭扭的，你别笑。里面装的是安神的药草，打坐的时候戴着，心会静一些。'],['苏小棠','我绣坏了三个，这是最好的一个……'],{love:{tang:30}},{give:{huichun:1}},{cgend:true}],
  tang2b:[{face:'blush'},['苏小棠','……一、一直？'],{face:'smile'},['苏小棠','那你可要说话算话。要是哪天我发现你没戴，我就……我就不给你配药了！'],{love:{tang:50}},{give:{huichun:1}},{cgend:true}],
  tang4a:[{face:'blush'},['苏小棠','你、你在说什么呀！'],['旁白','她把脸埋进膝盖里，耳朵红得像天边的晚霞。过了好一会儿，才闷闷地传来一句。'],['苏小棠','……那你下次，还要来。'],{love:{tang:50}},{cgend:true}],
  tang4b:[['旁白','谁都没有说话。萤火虫一只只亮起来，最后一缕阳光沉进了山后。'],['旁白','她悄悄地，往你身边靠近了一点点。'],{face:'smile'},['苏小棠','……谢谢你，{名}。'],{love:{tang:60}},{cgend:true}],
  tang4c:[{face:'smile'},['苏小棠','叫《青丘谣》。讲的是一只小狐狸，在山里等一个不会回来的人。'],['苏小棠','……下次，我教你唱。'],{love:{tang:30}},{cgend:true}],
  tang6a:[['旁白','你把外衣披在她肩上。她愣了一下，把半张脸藏进衣领里。'],{face:'blush'},['苏小棠','……有你的味道。'],['苏小棠','啊！我是说，有、有灵草的味道！你身上全是药圃的味道！'],['旁白','雨声很大。你们并肩坐在药庐里，等雨停。'],{love:{tang:60}},{cgend:true}],
  tang6b:[['旁白','你掌心泛起暖暖的灵光，她衣裳上的水汽化作白雾，袅袅散去。'],{face:'smile'},['苏小棠','好厉害……{名}，你越来越像一个真正的修士了。'],{face:'sad'},['苏小棠','……也越来越远了呢。'],['旁白','她说得很轻，轻得几乎被雨声盖过。'],{love:{tang:40}},{cgend:true}],
  tang6c:[{face:'sad'},['苏小棠','……我知道错了嘛。'],['苏小棠','可是你下次再受伤的时候，用得上雪莲的。我、我不想看你疼。'],['旁白','你一下子说不出话来。'],{love:{tang:20}},{cgend:true}],
  tang8a:[{face:'blush'},['苏小棠','……嗯！'],['旁白','她抬起头，眼睛亮得像桥下所有的河灯。'],{face:'smile'},['苏小棠','等你在宗门里站稳了脚跟，我们再一起看一次灯会，好不好？'],['旁白','【小棠的故事，将在第二章继续……】'],{love:{tang:60}},{flag:'tang_promise'},{cgend:true}],
  tang8b:[['旁白','你把花笺仔细折好，收进最贴身的衣襟里。她看着你的动作，笑得眼睛弯成了月牙。'],{face:'smile'},['苏小棠','等你在宗门里站稳了脚跟，我们再一起看一次灯会，好不好？'],['旁白','【小棠的故事，将在第二章继续……】'],{love:{tang:50}},{flag:'tang_promise'},{cgend:true}],
  ge2a:[['旁白','木剑相交的一瞬，你被震得虎口发麻，连退三步才站稳。'],{face:'smile'},['顾长歌','……不错，够狠。'],['顾长歌','剑修最怕的不是输，是不敢出剑。你敢。'],['顾长歌','这个给你，路上用得着。'],{give:{juqi:1}},{love:{ge:50}},{cgend:true}],
  ge2b:[['旁白','你只守不攻。十几个回合后，顾长歌收剑而立。'],['顾长歌','你在看我的剑路？……眼力不错。'],{face:'smile'},['顾长歌','不过下次，别让对手看出来你在看。'],{give:{juqi:1}},{love:{ge:40}},{cgend:true}],
  ge4a:[['顾长歌','……那是我的仇，不是你的。'],['旁白','他沉默了很久。月亮从云后出来，又躲回去。'],['旁白','最后，他把剑柄上一枚旧剑穗解下来，放在了你手里。'],{face:'smile'},['顾长歌','可若真有那一天……我不会拒绝。'],{love:{ge:60}},{cgend:true}],
  ge4b:[['旁白','月光照在剑身上，像一道细长的河。你们就这样并肩坐着，谁也没有说话，一直坐到东方发白。'],{face:'smile'},['顾长歌','……{名}，谢谢你听我说完。'],{love:{ge:50}},{cgend:true}],
  ge6a:[['顾长歌','……我不确定。'],{face:'sad'},['顾长歌','那天晚上火光冲天。我只看见一个人站在废墟中间，脸上戴着一张青铜面具。'],['顾长歌','面具上的纹路……像极了饕餮。'],['旁白','火堆里的一根柴「啪」地断开，火星飞向夜空。'],{flag:'ge_mask'},{love:{ge:30}},{cgend:true}],
  ge6b:[['旁白','火光噼啪作响。你往火堆里添了一根柴，什么也没问。'],['旁白','过了很久，顾长歌低声开口。'],{face:'smile'},['顾长歌','谢谢你没有问。……总有一天，我会全都告诉你。'],{love:{ge:60}},{cgend:true}],
  ge8a:[['顾长歌','……傻子。你有你的宗门，你的师兄师姐。'],{face:'smile'},['顾长歌','不过——等你修为稳了，北边见。'],['旁白','【长歌的故事，将在第二章继续……】'],{love:{ge:60}},{flag:'ge_promise'},{cgend:true}],
  ge8b:[['顾长歌','……好。'],['旁白','他转过身，背影在晚霞里拉得很长很长。走出很远，他忽然停下，没有回头，只是抬手挥了一下。'],['旁白','【长歌的故事，将在第二章继续……】'],{love:{ge:50}},{flag:'ge_promise'},{cgend:true}],
});

/* chat triggers the next heart event once the hearts are there */
{ const _chat=Social.chat;
  Social.chat=function(id){
    const ev=HEART_CG[id];
    if(ev){ const r=Social.rel(id), h=Social.hearts(id);
      for(const lv of [2,4,6,8]) if(h>=lv && !r.ev[lv]){ r.ev[lv]=true; if(r.talked!==S.day){ r.talked=S.day; } Sound.levelup();
        const e=ev[lv]; return UI.say([{cg:e.scene, who:id, title:e.title}, ...e.steps]); } }
    return _chat.call(Social,id);
  };
}
// replay any event from the 人物 tab once it has been seen
CG.replay=(id,lv)=>{ const e=HEART_CG[id][lv]; UI.closePanel(); UI.say([{cg:e.scene, who:id, title:e.title}, ...e.steps.map(s=>s.choice?{...s, options:s.options.map(o=>({...o}))}:s)]); };
