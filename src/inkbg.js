/* ============================================================
   山海问道 · 水墨背景 — rice paper, ink mountains, mist, pines, bamboo, water, lanterns.
   Used as the backgrounds of the pixel CGs (the characters stay pixel chibis). Only the `base` painters are used;
   the scene tables also keep their old figure layouts, which nothing calls.
   ============================================================ */
const SUMI = {
  ink:(a)=>`rgba(26,22,19,${a})`,
  paper:'#efe5cf',
};
/* ---------- brush basics ---------- */
function brush(g, pts, w, a, col){ // a stroke through points, slightly dry: a wide faint pass and a narrow dark pass
  if(pts.length<2) return; g.lineCap='round'; g.lineJoin='round';
  for(const [k,al] of [[1.35,.35],[1,1]]){ g.strokeStyle=col||SUMI.ink(a*al); g.lineWidth=w*k; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]);
    for(let i=1;i<pts.length-1;i++){ const mx=(pts[i][0]+pts[i+1][0])/2, my=(pts[i][1]+pts[i+1][1])/2; g.quadraticCurveTo(pts[i][0],pts[i][1],mx,my); }
    const L=pts[pts.length-1]; g.lineTo(L[0],L[1]); g.stroke(); }
}
function blob(g, pts, fill){ g.fillStyle=fill; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++){ const p=pts[i], n=pts[(i+1)%pts.length]; g.quadraticCurveTo(p[0],p[1],(p[0]+n[0])/2,(p[1]+n[1])/2); } g.closePath(); g.fill(); }
function rgba(hex,a){ const n=parseInt(hex.slice(1),16); return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`; }
function lighten(hex,k){ const n=parseInt(hex.slice(1),16), f=v=>Math.round(v+(255-v)*k); return '#'+[n>>16&255,n>>8&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join(''); }

/* ---------- landscape ---------- */
const Land = {
  paper(g,W,H,R,tone){
    g.fillStyle=tone||SUMI.paper; g.fillRect(0,0,W,H);
    for(let i=0;i<W*H/260;i++){ g.fillStyle=R()<.5?'rgba(255,255,255,.06)':'rgba(120,90,50,.035)'; g.fillRect(R()*W,R()*H,1+R()*5,1); }
    for(let i=0;i<40;i++){ const x=R()*W, y=R()*H, r=20+R()*120, gr=g.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,'rgba(150,120,80,.035)'); gr.addColorStop(1,'rgba(150,120,80,0)'); g.fillStyle=gr; g.fillRect(x-r,y-r,r*2,r*2); }
  },
  edge(g,W,H){ const gr=g.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.max(W,H)*.78); gr.addColorStop(0,'rgba(90,60,30,0)'); gr.addColorStop(1,'rgba(90,60,30,.28)'); g.fillStyle=gr; g.fillRect(0,0,W,H); },
  sky(g,W,H,cols){ const s=g.createLinearGradient(0,0,0,H); cols.forEach((c,i)=>s.addColorStop(i/(cols.length-1),c)); g.fillStyle=s; g.fillRect(0,0,W,H); },
  // steep Chinese peaks: a ridge made of gaussian bumps, dark at the crest, melting into mist at the foot
  peaks(g,W,H,R,{y, amp, n=5, a=.5, tint=null, pines=0, cun=1}){
    const P=[]; for(let i=0;i<n;i++) P.push({x:R()*W*1.2-W*.1, h:amp*(.45+R()*.55), w:W*(.05+R()*.11), k:R()*6});
    const ridge=x=>{ let m=0; for(const p of P){ const d=(x-p.x)/p.w; m=Math.max(m, p.h*Math.exp(-d*d*1.4)*(1+.06*Math.sin(x*.07+p.k))); } return y-m-amp*.04*Math.sin(x/W*9+P[0].k); };
    const top=y-amp, gr=g.createLinearGradient(0,top,0,y+amp*.35);
    gr.addColorStop(0, tint?rgba(tint,a):SUMI.ink(a)); gr.addColorStop(.55, tint?rgba(tint,a*.45):SUMI.ink(a*.45)); gr.addColorStop(1, tint?rgba(tint,0):SUMI.ink(0));
    g.fillStyle=gr; g.beginPath(); g.moveTo(0,y+amp*.4); for(let x=0;x<=W;x+=3) g.lineTo(x,ridge(x)); g.lineTo(W,y+amp*.4); g.closePath(); g.fill();
    // crest line and 皴 texture strokes
    const pts=[]; for(let x=0;x<=W;x+=W/80) pts.push([x,ridge(x)]); brush(g,pts,Math.max(1,W/700),a*.55);
    for(let i=0;i<n*14*cun;i++){ const x=R()*W, ry=ridge(x); if(ry>y-amp*.08) continue; const len=amp*(.06+R()*.12), dir=R()<.5?-1:1;
      brush(g,[[x,ry+2],[x+dir*len*.3,ry+len*.5],[x+dir*len*.2,ry+len]],Math.max(1,W/900),a*.35); }
    for(let i=0;i<pines;i++){ const x=R()*W, ry=ridge(x); if(ry>y-amp*.15) continue; Land.tinyPine(g,x,ry,amp*.08,a*1.2); }
    return ridge;
  },
  tinyPine(g,x,y,s,a){ g.fillStyle=SUMI.ink(Math.min(.9,a)); g.fillRect(x-s*.04,y-s,s*.08,s); for(let k=0;k<4;k++){ g.beginPath(); g.ellipse(x,y-s*(.35+k*.2),s*(.38-k*.07),s*.09,0,0,7); g.fill(); } },
  mist(g,W,H,y,h,a){ const gr=g.createLinearGradient(0,y-h/2,0,y+h/2); gr.addColorStop(0,'rgba(245,240,228,0)'); gr.addColorStop(.5,`rgba(245,240,228,${a})`); gr.addColorStop(1,'rgba(245,240,228,0)'); g.fillStyle=gr; g.fillRect(0,y-h/2,W,h); },
  orb(g,x,y,r,col,glow){ if(glow){ const gr=g.createRadialGradient(x,y,r*.6,x,y,r*glow); gr.addColorStop(0,rgba(col,.35)); gr.addColorStop(1,rgba(col,0)); g.fillStyle=gr; g.fillRect(x-r*glow,y-r*glow,r*glow*2,r*glow*2); }
    g.fillStyle=col; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); },
  ground(g,W,H,y,a,col){ const gr=g.createLinearGradient(0,y-H*.02,0,H); gr.addColorStop(0,col?rgba(col,0):SUMI.ink(0)); gr.addColorStop(.15,col?rgba(col,a):SUMI.ink(a)); gr.addColorStop(1,col?rgba(col,a*1.3):SUMI.ink(a*1.3)); g.fillStyle=gr; g.fillRect(0,y-H*.02,W,H-y+H*.02); },
  grass(g,x,y,s,n,R,a,col){ for(let i=0;i<n;i++){ const bx=x+(R()-.5)*s*2, h=s*(.4+R()*.8), lean=(R()-.5)*s*.8; brush(g,[[bx,y],[bx+lean*.4,y-h*.6],[bx+lean,y-h]],Math.max(1,s*.05),a,col&&rgba(col,a)); } },
  pine(g,x,y,s,R,a=.85){ // trunk leaning, layered needle pads
    const lean=(R()-.5)*s*.5, top=[x+lean,y-s];
    brush(g,[[x,y],[x+lean*.3,y-s*.4],[x+lean*.7,y-s*.75],top],s*.07,a);
    for(let i=0;i<5;i++){ const t=.35+i*.14, bx=x+lean*t, by=y-s*t, dir=i%2?1:-1, L=s*(.32-i*.04)*(.8+R()*.4), ex=bx+dir*L, ey=by-s*.04;
      brush(g,[[bx,by],[bx+dir*L*.5,by-s*.02],[ex,ey]],s*.025,a*.9);
      for(let k=0;k<26;k++){ const ang=(R()-.5)*Math.PI*.9-Math.PI/2, len=s*(.05+R()*.07), px=ex-dir*R()*L*.5, py=ey; g.strokeStyle=SUMI.ink(a*(.4+R()*.4)); g.lineWidth=Math.max(1,s*.012);
        g.beginPath(); g.moveTo(px,py); g.lineTo(px+Math.cos(ang)*len*1.8,py+Math.sin(ang)*len*.6); g.stroke(); }
      g.fillStyle=SUMI.ink(a*.25); g.beginPath(); g.ellipse(ex-dir*L*.25,ey-s*.01,L*.55,s*.045,0,0,7); g.fill(); }
  },
  tree(g,x,y,s,R,a=.8,blossom){ // broadleaf / blossom tree: crooked trunk, wet dabs
    const lean=(R()-.5)*s*.4; brush(g,[[x,y],[x+lean*.4,y-s*.4],[x+lean,y-s*.7]],s*.045,a); brush(g,[[x+lean*.6,y-s*.55],[x+lean,y-s*.75],[x+lean*1.1,y-s*.9]],s*.025,a);
    for(let b=0;b<4;b++){ const sx=x+lean*(.45+b*.15), sy=y-s*(.45+b*.1), dir=b%2?1:-1; brush(g,[[sx,sy],[sx+dir*s*.12,sy-s*.1]],s*.014,a); brush(g,[[sx+dir*s*.12,sy-s*.1],[sx+dir*s*.26,sy-s*.2]],s*.007,a); }
    for(let k=0;k<70;k++){ const ang=R()*Math.PI*2, rr=s*.32*Math.sqrt(R()), px=x+lean+Math.cos(ang)*rr*1.3, py=y-s*.8+Math.sin(ang)*rr*.8;
      g.fillStyle=blossom&&R()<.5?rgba(blossom,.55):SUMI.ink(a*(.15+R()*.35)); g.beginPath(); g.ellipse(px,py,s*.035,s*.022,R()*3,0,7); g.fill(); }
  },
  bamboo(g,x,y0,y1,w,R,a=.8){ // segmented culm and blade leaves
    const segs=Math.max(3,Math.round((y0-y1)/(w*9))), sl=(y0-y1)/segs, bend=(R()-.5)*w*3;
    for(let i=0;i<segs;i++){ const t0=i/segs, t1=(i+1)/segs, ax=x+bend*t0*t0, bx=x+bend*t1*t1; g.strokeStyle=SUMI.ink(a*(.55+R()*.3)); g.lineWidth=w; g.lineCap='butt';
      g.beginPath(); g.moveTo(ax,y0-sl*i-1); g.lineTo(bx,y0-sl*(i+1)+2); g.stroke(); g.fillStyle=SUMI.ink(a); g.fillRect(bx-w*.7,y0-sl*(i+1),w*1.4,w*.25);
      if(R()<.5){ const dir=R()<.5?-1:1; for(let k=0;k<3;k++){ const lx=bx, ly=y0-sl*(i+1), ang=dir*(.6+k*.35)+(R()-.5)*.3, L=w*(4+R()*3);
        g.fillStyle=SUMI.ink(a*(.5+R()*.4)); g.beginPath(); g.moveTo(lx,ly); g.quadraticCurveTo(lx+Math.sin(ang)*L*.5+w*.6,ly+Math.cos(ang)*L*.5-w, lx+Math.sin(ang)*L, ly+Math.cos(ang)*L*.6);
        g.quadraticCurveTo(lx+Math.sin(ang)*L*.5-w*.6,ly+Math.cos(ang)*L*.5+w*.3, lx,ly); g.fill(); } } }
  },
  rock(g,x,y,w,h,R,a=.75){ const pts=[[x-w/2,y],[x-w*.45,y-h*.55],[x-w*.2,y-h],[x+w*.15,y-h*.92],[x+w*.45,y-h*.5],[x+w/2,y]];
    blob(g,pts,SUMI.ink(a*.25)); brush(g,[...pts.slice(0,5),[x+w/2,y]],Math.max(1.5,w*.025),a);
    for(let i=0;i<4;i++){ const sx=x+(R()-.5)*w*.6, sy=y-h*(.3+R()*.5); brush(g,[[sx,sy],[sx+w*.06,sy+h*.12],[sx+w*.03,sy+h*.25]],Math.max(1,w*.015),a*.6); } },
  water(g,W,y,H,R,a=.35,tint){ if(tint){ const gr=g.createLinearGradient(0,y,0,H); gr.addColorStop(0,rgba(tint,.18)); gr.addColorStop(1,rgba(tint,.3)); g.fillStyle=gr; g.fillRect(0,y,W,H-y); }
    for(let i=0;i<70;i++){ const yy=y+(H-y)*Math.pow(R(),1.4), x=R()*W, l=W*(.03+R()*.08)*(1+(yy-y)/(H-y)); brush(g,[[x,yy],[x+l*.5,yy-1],[x+l,yy]],Math.max(1,W/900),a*(.3+R()*.5)); } },
  lantern(g,x,y,r,glow){ if(glow){ const gr=g.createRadialGradient(x,y,0,x,y,r*glow); gr.addColorStop(0,'rgba(255,170,80,.45)'); gr.addColorStop(1,'rgba(255,170,80,0)'); g.fillStyle=gr; g.fillRect(x-r*glow,y-r*glow,r*glow*2,r*glow*2); }
    g.fillStyle='#c8413b'; g.beginPath(); g.ellipse(x,y,r*.8,r,0,0,7); g.fill(); g.fillStyle='rgba(255,215,140,.75)'; g.beginPath(); g.ellipse(x,y,r*.4,r*.6,0,0,7); g.fill();
    g.fillStyle=SUMI.ink(.85); g.fillRect(x-r*.45,y-r*1.05,r*.9,r*.18); g.fillRect(x-r*.45,y+r*.9,r*.9,r*.16); g.strokeStyle='#e8b84a'; g.lineWidth=Math.max(1,r*.08); g.beginPath(); g.moveTo(x,y+r*1.05); g.lineTo(x,y+r*1.6); g.stroke(); },
  roof(g,x,y,w,h,a=.85){ // a pavilion / hut roof with upturned eaves
    g.fillStyle=SUMI.ink(a); g.beginPath(); g.moveTo(x-w*.6,y+h*.15); g.quadraticCurveTo(x-w*.42,y+h*.05,x-w*.3,y-h*.55); g.lineTo(x+w*.3,y-h*.55); g.quadraticCurveTo(x+w*.42,y+h*.05,x+w*.6,y+h*.15);
    g.quadraticCurveTo(x+w*.4,y+h*.25,x,y+h*.25); g.quadraticCurveTo(x-w*.4,y+h*.25,x-w*.6,y+h*.15); g.fill();
    g.strokeStyle='rgba(239,229,207,.25)'; g.lineWidth=Math.max(1,w*.006); for(let i=-6;i<=6;i++){ g.beginPath(); g.moveTo(x+i*w*.045,y-h*.5); g.lineTo(x+i*w*.07,y+h*.2); g.stroke(); } },
  seal(g,x,y,s,text){ g.fillStyle='rgba(190,40,30,.88)'; g.fillRect(x,y,s,s*(text.length>2?1.4:1)); g.fillStyle=SUMI.paper; g.font=`${s*.42}px "Ma Shan Zheng",KaiTi,serif`; g.textAlign='center'; g.textBaseline='middle';
    const ch=[...text]; ch.forEach((c,i)=>{ const col=i%2, row=Math.floor(i/2), cols=Math.min(2,ch.length); g.fillText(c, x+s*(cols===1?.5:col?.28:.72), y+s*(.3+row*.42)); }); },
  birds(g,x,y,s,n,R,a=.8){ for(let i=0;i<n;i++){ const bx=x+(R()-.5)*s*6, by=y+(R()-.5)*s*2, w=s*(.6+R()*.5); brush(g,[[bx-w,by-w*.2],[bx-w*.3,by-w*.35],[bx,by]],Math.max(1,s*.12),a); brush(g,[[bx,by],[bx+w*.3,by-w*.35],[bx+w,by-w*.25]],Math.max(1,s*.12),a); } },
};

// helper: a standard far landscape
function farHills(g,W,H,R,y,tint){ Land.peaks(g,W,H,R,{y:y-H*.04,amp:H*.28,n:6,a:.16,tint}); Land.mist(g,W,H,y-H*.02,H*.1,.6); Land.peaks(g,W,H,R,{y,amp:H*.18,n:5,a:.32,pines:6,tint}); Land.mist(g,W,H,y+H*.04,H*.08,.5); }
const SCENES_INK = {
  /* ---- 苏小棠 ---- */
  herb:{ base(g,W,H,R){ Land.paper(g,W,H,R); Land.orb(g,W*.78,H*.16,Math.min(W,H)*.05,'#e0523e',3); farHills(g,W,H,R,H*.52);
      Land.ground(g,W,H,H*.66,.08,'#6a9a50'); for(let r=0;r<5;r++){ const y=H*(.7+r*.06); for(let x=(r%2)*W*.04;x<W;x+=W*.08) Land.grass(g,x,y,H*.03,5,R,.5,'#4a7a40'); }
      Land.tree(g,W*.12,H*.7,H*.35,R,.75,'#f2a0b0'); Land.rock(g,W*.86,H*.74,W*.14,H*.08,R,.6); },
    fx:'petals', cast:{npc:{x:.68,pose:'reach',face:-1,basket:true,prop:'herb', moods:{blush:{pose:'give',prop:'sachet'},smile:{pose:'kneel',prop:'herb'}}}, me:{x:.3,pose:'stand',face:1}}, ground:.88 },
  sunset:{ base(g,W,H,R){ Land.paper(g,W,H,R,'#f1dcc4'); Land.sky(g,W,H*.6,['rgba(240,170,120,.0)','rgba(230,140,100,.25)']); Land.orb(g,W*.7,H*.42,Math.min(W,H)*.07,'#d8452e',4);
      farHills(g,W,H,R,H*.56,'#5a3040'); Land.water(g,W,H*.6,H,R,.35,'#d88a6a');
      for(let i=0;i<9;i++){ const x=R()*W, y=H*(.68+R()*.28); g.fillStyle='rgba(60,100,60,.5)'; g.beginPath(); g.ellipse(x,y,W*.035,H*.01,0,.3,Math.PI*2-.3); g.fill(); if(R()<.5){ g.fillStyle='rgba(240,150,170,.8)'; g.beginPath(); g.ellipse(x,y-H*.015,W*.008,H*.012,0,0,7); g.fill(); } }
      for(let i=0;i<20;i++){ const x=R()<.5?R()*W*.2:W*.82+R()*W*.18; Land.grass(g,x,H*.68,H*.12,2,R,.6); }
      },
    fx:'fireflies', cast:{npc:{x:.6,pose:'sit',face:-1,y:.8},me:{x:.38,pose:'sit',face:1,y:.8}}, ground:.82 },
  rainpath:{ base(g,W,H,R){ Land.paper(g,W,H,R,'#e3dccd'); Land.peaks(g,W,H,R,{y:H*.5,amp:H*.3,n:6,a:.25}); Land.mist(g,W,H,H*.5,H*.2,.7);
      Land.pine(g,W*.12,H*.86,H*.5,R,.8); Land.pine(g,W*.9,H*.88,H*.45,R,.75);
      g.fillStyle=SUMI.ink(.12); g.beginPath(); g.moveTo(W*.3,H); g.quadraticCurveTo(W*.5,H*.75,W*.56,H*.56); g.lineTo(W*.62,H*.56); g.quadraticCurveTo(W*.68,H*.75,W*.8,H); g.fill();
      Land.roof(g,W*.6,H*.5,W*.16,H*.05,.85); g.fillStyle=SUMI.ink(.6); g.fillRect(W*.54,H*.52,W*.12,H*.07); g.fillStyle='rgba(255,200,120,.6)'; g.fillRect(W*.585,H*.535,W*.025,H*.035); },
    fx:'rain', cast:{me:{x:.5,pose:'walk',face:1,y:.92,h:.5}}, ground:.92 },
  herbhut:{ base(g,W,H,R){ Land.paper(g,W,H,R,'#e8dcc4');
      g.fillStyle=SUMI.ink(.12); g.fillRect(0,0,W,H); for(let x=0;x<W;x+=W*.07){ brush(g,[[x,0],[x+2,H]],Math.max(1,W*.004),.25); }
      g.fillStyle='rgba(239,229,207,.9)'; g.fillRect(W*.62,H*.14,W*.28,H*.32); g.strokeStyle=SUMI.ink(.85); g.lineWidth=W*.008; g.strokeRect(W*.62,H*.14,W*.28,H*.32);
      for(let i=1;i<4;i++){ g.beginPath(); g.moveTo(W*.62+i*W*.07,H*.14); g.lineTo(W*.62+i*W*.07,H*.46); g.stroke(); } g.beginPath(); g.moveTo(W*.62,H*.3); g.lineTo(W*.9,H*.3); g.stroke();
      Land.peaks(g,W,H,R,{y:H*.44,amp:H*.12,n:3,a:.18});
      g.fillStyle=SUMI.ink(.75); g.fillRect(W*.04,H*.2,W*.3,H*.012); g.fillRect(W*.04,H*.38,W*.3,H*.012);
      for(let i=0;i<7;i++){ const x=W*.06+i*W*.04; g.fillStyle=['rgba(90,140,70,.7)','rgba(200,65,59,.6)','rgba(232,184,74,.7)','rgba(120,90,160,.6)'][i%4]; g.fillRect(x,H*.2-H*.05,W*.025,H*.05); }
      for(let i=0;i<5;i++){ g.fillStyle='rgba(184,146,90,.7)'; g.beginPath(); g.ellipse(W*.08+i*W*.055,H*.38-H*.025,W*.022,H*.025,0,0,7); g.fill(); }
      Land.lantern(g,W*.45,H*.22,Math.min(W,H)*.03,6); Land.ground(g,W,H,H*.84,.25); },
    fx:'rainwindow', cast:{npc:{x:.66,pose:'crouch',face:-1, moods:{normal:{pose:'kneel',prop:'basket'}}},me:{x:.3,pose:'stand',face:1}}, ground:.9 },
  lantern:{ base(g,W,H,R){ Land.paper(g,W,H,R,'#d8d2c4'); Land.sky(g,W,H,['rgba(20,24,50,.75)','rgba(40,40,80,.55)','rgba(60,50,80,.4)']);
      Land.orb(g,W*.82,H*.12,Math.min(W,H)*.045,'#f4efdc',4); Land.peaks(g,W,H,R,{y:H*.5,amp:H*.18,n:5,a:.45});
      Land.water(g,W,H*.62,H,R,.25,'#2a3050');
      g.strokeStyle=SUMI.ink(.9); g.lineWidth=H*.03; g.beginPath(); g.moveTo(-W*.05,H*.86); g.quadraticCurveTo(W*.5,H*.58,W*1.05,H*.86); g.stroke();
      g.lineWidth=H*.006; g.beginPath(); g.moveTo(-W*.05,H*.8); g.quadraticCurveTo(W*.5,H*.52,W*1.05,H*.8); g.stroke();
      for(let i=0;i<=12;i++){ const u=i/12, x=-W*.05+u*W*1.1, y=H*.8-(1-Math.pow(2*u-1,2))*H*.14; g.fillRect(x-1,y,3,H*.04); }
      g.strokeStyle=SUMI.ink(.6); g.lineWidth=1; g.beginPath(); g.moveTo(0,H*.18); g.quadraticCurveTo(W*.5,H*.3,W,H*.16); g.stroke();
      for(let i=0;i<11;i++){ const u=i/10; Land.lantern(g,u*W,H*.18+Math.sin(u*Math.PI)*H*.1+H*.02,Math.min(W,H)*.018,3); }
      for(let i=0;i<24;i++){ const x=R()*W, y=H*(.86+R()*.12); Land.lantern(g,x,y,Math.min(W,H)*.012,3); } },
    fx:'lanterns', cast:{npc:{x:.62,pose:'lantern',face:-1,prop:'lantern',y:.71, moods:{blush:{pose:'give',prop:'sachet'}}},me:{x:.36,pose:'stand',face:1,y:.71}}, ground:.71 },
  /* ---- 顾长歌 ---- */
  bamboo:{ base(g,W,H,R){ Land.paper(g,W,H,R,'#ece6d4'); Land.peaks(g,W,H,R,{y:H*.45,amp:H*.2,n:4,a:.12}); Land.mist(g,W,H,H*.5,H*.3,.7);
      for(let i=0;i<14;i++){ const x=R()*W, w=W*(.008+R()*.012); Land.bamboo(g,x,H*1.02,-H*.05,w,R,.35+R()*.5); }
      Land.ground(g,W,H,H*.86,.12); Land.rock(g,W*.12,H*.9,W*.18,H*.08,R,.6); },
    fx:'leaves', cast:{npc:{x:.74,pose:'guard',face:-1,prop:'sword', moods:{smile:{pose:'stand',prop:'backsword'}}},me:{x:.26,pose:'sword',face:1,prop:'wood'}}, ground:.9 },
  moon:{ base(g,W,H,R){ Land.paper(g,W,H,R,'#d6d2c6'); Land.sky(g,W,H,['rgba(25,30,55,.7)','rgba(50,55,85,.45)','rgba(80,80,100,.2)']);
      Land.orb(g,W*.7,H*.22,Math.min(W,H)*.09,'#f6f1dc',5); farHills(g,W,H,R,H*.62);
      g.fillStyle=SUMI.ink(.85); g.beginPath(); g.moveTo(0,H); g.lineTo(0,H*.78); g.quadraticCurveTo(W*.3,H*.74,W*.62,H*.8); g.lineTo(W*.7,H); g.fill();
      Land.pine(g,W*.1,H*.8,H*.42,R,.9); },
    fx:'fireflies', cast:{npc:{x:.42,pose:'sitwipe',face:1,y:.79, moods:{smile:{pose:'sit'}}},me:{x:.24,pose:'sit',face:1,y:.79}}, ground:.79 },
  campfire:{ base(g,W,H,R){ Land.paper(g,W,H,R,'#cfc8b8'); Land.sky(g,W,H,['rgba(15,15,25,.85)','rgba(25,25,35,.75)','rgba(40,35,35,.6)']);
      for(let i=0;i<120;i++){ g.fillStyle=`rgba(255,250,230,${.3+R()*.6})`; g.fillRect(R()*W,R()*H*.5,R()<.1?2:1,R()<.1?2:1); }
      for(let i=0;i<8;i++) Land.pine(g,R()*W,H*.8,H*(.3+R()*.3),R,.95); Land.ground(g,W,H,H*.82,.6);
      g.fillStyle=SUMI.ink(.85); g.beginPath(); g.moveTo(W*.78,H*.86); g.lineTo(W*.86,H*.62); g.lineTo(W*.95,H*.86); g.fill(); },
    fx:'campfire', cast:{npc:{x:.66,pose:'sit',face:-1,prop:'jade', moods:{sad:{pose:'sitwipe',prop:null}}},me:{x:.3,pose:'sit',face:1}}, ground:.86, fire:[.5,.86] },
  dusk:{ base(g,W,H,R){ Land.paper(g,W,H,R,'#ecd0b4'); Land.sky(g,W,H*.7,['rgba(120,60,80,.3)','rgba(230,140,90,.3)']); Land.orb(g,W*.5,H*.5,Math.min(W,H)*.08,'#d8452e',4);
      farHills(g,W,H,R,H*.6,'#3a1a26'); for(let i=0;i<6;i++) Land.tree(g,R()*W,H*.88,H*(.3+R()*.25),R,.85); Land.ground(g,W,H,H*.86,.35);
      Land.birds(g,W*.3,H*.2,W*.02,3,R,.85); },
    fx:'leaves', cast:{npc:{x:.56,pose:'guard',face:1,prop:'sword', moods:{smile:{pose:'stand',prop:'backsword'}}},me:{x:.44,pose:'guard',face:-1,prop:'sword'}}, ground:.9 },
};

const QY_INK = {
  wounded:{ base(g,W,H,R){ Land.paper(g,W,H,R); farHills(g,W,H,R,H*.55); Land.tree(g,W*.66,H*.86,H*.55,R,.85); Land.ground(g,W,H,H*.84,.1,'#6a8a50'); Land.grass(g,W*.5,H*.86,H*.04,20,R,.5); },
    live(g,W,H,t,h,gy){ figure(g,W*.62,H*gy,h,{pose:'lean',face:-1,robe:'#a8b8c8',hair:'#2b2533',style:'top',sash:'#5a6a7a',mood:'sad'},t);
      for(let i=0;i<6;i++){ g.fillStyle='rgba(180,40,30,.7)'; g.beginPath(); g.arc(W*.6+i*h*.02,H*gy-h*.2+i*h*.02,h*.008,0,7); g.fill(); } figure(g,W*.32,H*gy,h,{...meFigure(),pose:'stand',face:1},t); } },
  ruins:{ base(g,W,H,R){ Land.paper(g,W,H,R); g.fillStyle=SUMI.ink(.7); g.beginPath(); g.moveTo(W*.15,H); g.lineTo(W*.2,H*.2); g.quadraticCurveTo(W*.5,H*.05,W*.85,H*.2); g.lineTo(W*.9,H); g.fill();
      g.fillStyle=SUMI.ink(.95); g.beginPath(); g.ellipse(W*.52,H*.82,W*.13,H*.26,0,Math.PI,0); g.fill(); g.fillRect(W*.39,H*.82,W*.26,H*.2);
      g.fillStyle='rgba(239,229,207,.18)'; g.fillRect(W*.43,H*.58,W*.18,H*.24); g.font=`${H*.04}px "Ma Shan Zheng",serif`; g.fillStyle='rgba(232,184,74,.55)'; g.textAlign='center'; g.fillText('封',W*.52,H*.66); g.fillText('印',W*.52,H*.72);
      for(let i=0;i<14;i++){ const x=W*(.2+R()*.65), len=H*(.1+R()*.3); brush(g,[[x,H*.15],[x+W*.01,H*.15+len*.5],[x-W*.01,H*.15+len]],Math.max(1,W*.003),.6,'rgba(70,100,60,.7)'); for(let k=0;k<6;k++){ g.fillStyle='rgba(70,110,60,.55)'; g.beginPath(); g.ellipse(x+(R()-.5)*W*.02,H*.15+R()*len,W*.008,H*.006,R()*3,0,7); g.fill(); } }
      Land.ground(g,W,H,H*.9,.2); },
    live(g,W,H,t,h,gy){ figure(g,W*.5,H*gy,h*.8,{...meFigure(),style:'back',pose:'stand',face:1},t); } },
  spring:{ base(g,W,H,R){ Land.paper(g,W,H,R); farHills(g,W,H,R,H*.5); Land.rock(g,W*.22,H*.72,W*.32,H*.22,R,.7); Land.rock(g,W*.8,H*.74,W*.3,H*.2,R,.7);
      g.fillStyle='rgba(150,200,210,.35)'; g.beginPath(); g.ellipse(W*.52,H*.8,W*.3,H*.07,0,0,7); g.fill(); Land.water(g,W,H*.78,H*.86,R,.3); Land.pine(g,W*.85,H*.6,H*.35,R,.8); },
    live(g,W,H,t,h,gy){ FX.mist(g,W,H,t,H*.72); figure(g,W*.32,H*gy,h,{...meFigure(),pose:'kneel',face:1},t); } , gy:.84 },
  fox:{ base(g,W,H,R){ Land.paper(g,W,H,R); farHills(g,W,H,R,H*.56); Land.ground(g,W,H,H*.8,.08,'#6a8a50'); for(let i=0;i<30;i++) Land.grass(g,R()*W,H*(.8+R()*.15),H*.05,3,R,.6); },
    live(g,W,H,t,h,gy){ Beast.fox(g,W*.6,H*gy,h*.45,t); figure(g,W*.36,H*gy,h,{...meFigure(),pose:'reach',face:1,prop:'herb'},t); } },
  hunter:{ base(g,W,H,R){ Land.paper(g,W,H,R); farHills(g,W,H,R,H*.55); Land.pine(g,W*.85,H*.88,H*.5,R); Land.ground(g,W,H,H*.86,.1); },
    live(g,W,H,t,h,gy){ figure(g,W*.62,H*gy,h,{pose:'stand',face:-1,robe:'#b8a88a',hair:'#d8d4dc',style:'top',sash:'#6a4a2a',prop:'bow'},t); figure(g,W*.34,H*gy,h,{...meFigure(),pose:'stand',face:1},t); } },
  scholar:{ base(g,W,H,R){ Land.paper(g,W,H,R); farHills(g,W,H,R,H*.52); g.fillStyle=SUMI.ink(.1); g.beginPath(); g.moveTo(W*.2,H); g.quadraticCurveTo(W*.45,H*.75,W*.7,H*.6); g.lineTo(W*.78,H*.62); g.quadraticCurveTo(W*.55,H*.8,W*.5,H); g.fill(); Land.tree(g,W*.15,H*.85,H*.45,R); },
    live(g,W,H,t,h,gy){ figure(g,W*.62,H*gy,h,{pose:'walk',face:-1,robe:'#d8d4c4',hair:'#2b2533',style:'top',sash:'#4a6fa5',prop:'bookbox'},t); figure(g,W*.34,H*gy,h,{...meFigure(),pose:'point',face:1},t); } },
  dangkang:{ base(g,W,H,R){ Land.paper(g,W,H,R); Land.orb(g,W*.78,H*.18,Math.min(W,H)*.05,'#e0523e',3); farHills(g,W,H,R,H*.55); Land.ground(g,W,H,H*.72,.12,'#7aa050');
      for(let i=0;i<60;i++){ const x=R()*W, y=H*(.74+R()*.24); Land.grass(g,x,y,H*.03,4,R,.6,'#4a7a40'); if(R()<.3){ g.fillStyle='rgba(240,230,140,.8)'; g.beginPath(); g.arc(x,y-H*.03,H*.005,0,7); g.fill(); } } },
    live(g,W,H,t,h,gy){ Beast.boar(g,W*.62+Math.sin(t*.5)*W*.01,H*gy,h*.5,t); figure(g,W*.32,H*gy,h,{...meFigure(),pose:'walk',face:1},t); } },
  xingxing:{ base(g,W,H,R){ Land.paper(g,W,H,R); farHills(g,W,H,R,H*.6); brush(g,[[W*.2,H],[W*.3,H*.5],[W*.45,H*.3],[W*1.05,H*.25]],H*.04,.85); Land.tree(g,W*.75,H*.32,H*.3,R,.6); Land.ground(g,W,H,H*.88,.1); },
    live(g,W,H,t,h,gy){ Beast.monkey(g,W*.66,H*.27,h*.45,t); figure(g,W*.42,H*gy,h,{...meFigure(),pose:'look',face:1},t); } },
  peddler:{ base(g,W,H,R){ Land.paper(g,W,H,R); farHills(g,W,H,R,H*.55); Land.tree(g,W*.88,H*.85,H*.5,R,.8,'#f2a0b0'); Land.ground(g,W,H,H*.86,.1); },
    live(g,W,H,t,h,gy){ figure(g,W*.62,H*gy,h,{pose:'stand',face:-1,robe:'#c8b89a',hair:'#2b2533',style:'top',sash:'#c8413b',prop:'pole'},t); figure(g,W*.3,H*gy,h,{...meFigure(),pose:'stand',face:1},t); } },
  herbalist:{ base(g,W,H,R){ Land.paper(g,W,H,R); farHills(g,W,H,R,H*.5); g.fillStyle=SUMI.ink(.15); g.beginPath(); g.moveTo(0,H*.7); g.quadraticCurveTo(W*.5,H*.65,W,H*.85); g.lineTo(W,H); g.lineTo(0,H); g.fill(); for(let i=0;i<40;i++) Land.grass(g,R()*W,H*(.75+R()*.2),H*.04,3,R,.5,'#4a7a40'); },
    live(g,W,H,t,h,gy){ figure(g,W*.62,H*gy,h*.85,{pose:'bow',face:-1,robe:'#a8988a',hair:'#d8d4dc',style:'bun',sash:'#6a4a2a',prop:'cane',basket:true},t); figure(g,W*.32,H*gy,h,{...meFigure(),pose:'stand',face:1},t); } },
  chess:{ base(g,W,H,R){ Land.paper(g,W,H,R); farHills(g,W,H,R,H*.5); Land.pine(g,W*.1,H*.84,H*.6,R,.9); Land.ground(g,W,H,H*.84,.1);
      g.fillStyle=SUMI.ink(.6); g.fillRect(W*.42,H*.74,W*.16,H*.03); g.fillRect(W*.47,H*.77,W*.06,H*.07); for(let i=0;i<12;i++){ g.fillStyle=i%2?SUMI.ink(.95):'#fbf8f0'; g.beginPath(); g.arc(W*.44+R()*W*.12,H*.745,W*.004,0,7); g.fill(); } },
    live(g,W,H,t,h,gy){ Beast.crane(g,W*.2+Math.sin(t*.3)*W*.05,H*.22,h*.3,t); Beast.crane(g,W*.82+Math.sin(t*.25)*W*.05,H*.16,h*.25,t+1);
      figure(g,W*.34,H*gy,h*.9,{pose:'sit',face:1,robe:'#e8e0d0',hair:'#d8d4dc',style:'top',sash:'#5a6a7a'},t); figure(g,W*.66,H*gy,h*.9,{pose:'sit',face:-1,robe:'#4a4a4a',hair:'#d8d4dc',style:'top',sash:'#c8413b'},t);
      figure(g,W*.85,H*gy,h*.75,{...meFigure(),pose:'stand',face:-1},t); } },
  tomb:{ base(g,W,H,R){ Land.paper(g,W,H,R,'#e0d8c8'); Land.peaks(g,W,H,R,{y:H*.5,amp:H*.25,n:5,a:.2}); Land.mist(g,W,H,H*.55,H*.2,.7);
      g.fillStyle=SUMI.ink(.35); g.beginPath(); g.ellipse(W*.6,H*.86,W*.2,H*.08,0,Math.PI,0); g.fill(); g.fillStyle=SUMI.ink(.75); g.fillRect(W*.56,H*.62,W*.07,H*.2);
      g.fillStyle='rgba(239,229,207,.35)'; g.font=`${H*.03}px "Ma Shan Zheng",serif`; g.textAlign='center'; g.fillText('散',W*.595,H*.68); g.fillText('修',W*.595,H*.72); g.fillText('之',W*.595,H*.76); g.fillText('墓',W*.595,H*.8);
      Land.pine(g,W*.85,H*.88,H*.45,R,.8); Land.ground(g,W,H,H*.86,.15); },
    live(g,W,H,t,h,gy){ figure(g,W*.32,H*gy,h,{...meFigure(),pose:'bow',face:1},t); }, fx:'rain' },
  wenyao:{ base(g,W,H,R){ Land.paper(g,W,H,R,'#d4d0c4'); Land.sky(g,W,H,['rgba(20,25,50,.8)','rgba(40,45,75,.6)','rgba(60,60,85,.4)']); Land.orb(g,W*.6,H*.25,Math.min(W,H)*.11,'#f6f1dc',5);
      Land.peaks(g,W,H,R,{y:H*.58,amp:H*.15,n:5,a:.5}); Land.water(g,W,H*.62,H,R,.35,'#3a4a70'); },
    live(g,W,H,t,h,gy){ for(let i=0;i<7;i++){ const u=((t*.08+i/7)%1); Beast.flyfish(g,W*(1.1-u*1.2),H*(.5-Math.sin(u*Math.PI)*.25)+i*H*.015,h*.18,t); }
      figure(g,W*.2,H*gy,h*.8,{...meFigure(),style:'back',pose:'stand',face:1},t); }, gy:.72 },
  lushu:{ base(g,W,H,R){ Land.paper(g,W,H,R); farHills(g,W,H,R,H*.5); Land.water(g,W,H*.8,H,R,.3,'#7aa0b0'); Land.ground(g,W,H,H*.76,.08,'#6a9a50'); Land.tree(g,W*.1,H*.8,H*.5,R,.8,'#f2a0b0'); },
    live(g,W,H,t,h,gy){ Beast.horse(g,W*.64,H*gy,h*.75,t); figure(g,W*.3,H*gy,h,{...meFigure(),pose:'sit',face:1},t); }, gy:.8 },
  foxfire:{ base(g,W,H,R){ Land.paper(g,W,H,R,'#cfcac0'); Land.sky(g,W,H,['rgba(20,25,50,.85)','rgba(30,35,60,.65)']); Land.orb(g,W*.2,H*.18,Math.min(W,H)*.05,'#f6f1dc',4);
      Land.tree(g,W*.62,H*.86,H*.7,R,.95); Land.ground(g,W,H,H*.84,.5); },
    live(g,W,H,t,h,gy){ Beast.fox(g,W*.58,H*gy,h*.5,t,true); figure(g,W*.32,H*gy,h,{...meFigure(),pose:'kneel',face:1},t); }, fx:'fireflies' },
  swordtomb:{ base(g,W,H,R){ Land.paper(g,W,H,R,'#e4dccb'); farHills(g,W,H,R,H*.55); Land.ground(g,W,H,H*.7,.15);
      for(let i=0;i<60;i++){ const x=R()*W, y=H*(.72+R()*.25), L=H*(.05+R()*.05), a=(R()-.5)*.5; g.strokeStyle=SUMI.ink(.6+R()*.3); g.lineWidth=Math.max(1,W*.003); g.beginPath(); g.moveTo(x,y); g.lineTo(x+Math.sin(a)*L,y-Math.cos(a)*L); g.stroke();
        g.fillRect(x+Math.sin(a)*L*.75-W*.006,y-Math.cos(a)*L*.75,W*.012,Math.max(1,H*.003)); } },
    live(g,W,H,t,h,gy){ const sx=W*.62, sy=H*gy; const gr=g.createRadialGradient(sx,sy-h*.2,0,sx,sy-h*.2,h*.5*(1+.1*Math.sin(t*4))); gr.addColorStop(0,'rgba(220,240,255,.7)'); gr.addColorStop(1,'rgba(220,240,255,0)'); g.fillStyle=gr; g.fillRect(sx-h*.6,sy-h*.8,h*1.2,h*1.2);
      g.strokeStyle='#eef4f8'; g.lineWidth=h*.02; g.beginPath(); g.moveTo(sx,sy); g.lineTo(sx,sy-h*.4); g.stroke(); g.fillStyle=SUMI.ink(.9); g.fillRect(sx-h*.05,sy-h*.32,h*.1,h*.02);
      figure(g,W*.4,H*gy,h,{...meFigure(),pose:'point',face:1},t); } },
  danghost:{ base(g,W,H,R){ Land.paper(g,W,H,R,'#c8c2b4'); Land.sky(g,W,H,['rgba(15,15,25,.85)','rgba(30,30,40,.7)']); for(let i=0;i<6;i++) Land.pine(g,R()*W,H*.8,H*(.3+R()*.3),R,.95); Land.ground(g,W,H,H*.82,.55);
      g.fillStyle=SUMI.ink(.95); g.beginPath(); g.ellipse(W*.6,H*.78,W*.08,H*.06,0,0,7); g.fill(); g.fillRect(W*.54,H*.8,W*.02,H*.06); g.fillRect(W*.64,H*.8,W*.02,H*.06); g.fillRect(W*.55,H*.7,W*.1,H*.02); },
    live(g,W,H,t,h,gy){ FX.fire(g,W*.6,H*.73,h*.12,t); figure(g,W*.75,H*gy,h,{pose:'ghost',face:-1,robe:'#c8d8e8',hair:'#d8d4dc',style:'top',alpha:.45+.1*Math.sin(t*2)},t);
      figure(g,W*.3,H*gy,h,{...meFigure(),pose:'stand',face:1,mood:'sad'},t); } },
  baize:{ base(g,W,H,R){ Land.paper(g,W,H,R); Land.peaks(g,W,H,R,{y:H*.45,amp:H*.3,n:5,a:.2}); Land.mist(g,W,H,H*.55,H*.35,.85); Land.rock(g,W*.62,H*.8,W*.5,H*.14,R,.6); Land.pine(g,W*.9,H*.75,H*.45,R,.6); },
    live(g,W,H,t,h,gy){ FX.mist(g,W,H,t,H*.6); Beast.baize(g,W*.6,H*.67,h*.7,t); figure(g,W*.25,H*gy,h,{...meFigure(),pose:'bow',face:1},t); }, gy:.88 },
  qingniao:{ base(g,W,H,R){ Land.paper(g,W,H,R); Land.orb(g,W*.2,H*.2,Math.min(W,H)*.05,'#e0523e',3); farHills(g,W,H,R,H*.6); brush(g,[[W*1.05,H*.45],[W*.75,H*.42],[W*.55,H*.46]],H*.02,.85); Land.tree(g,W*.9,H*.9,H*.6,R,.8,'#f2a0b0'); Land.ground(g,W,H,H*.88,.1); },
    live(g,W,H,t,h,gy){ for(let i=0;i<3;i++) Beast.bird(g,W*(.62+i*.1),H*(.4-i*.01)+Math.sin(t*2+i)*H*.005,h*.16,t+i,['#3f6fa0','#4a8fb8','#2f5f90'][i]); figure(g,W*.3,H*gy,h,{...meFigure(),pose:'hold',face:1},t); } },
  zhulong:{ base(g,W,H,R){ Land.paper(g,W,H,R,'#c8c0b0'); Land.sky(g,W,H,['rgba(255,220,180,.35)','rgba(40,30,30,.5)']); farHills(g,W,H,R,H*.66); g.fillStyle=SUMI.ink(.9); g.beginPath(); g.moveTo(0,H); g.lineTo(0,H*.8); g.lineTo(W*.4,H*.82); g.lineTo(W*.45,H); g.fill(); },
    live(g,W,H,t,h,gy){ Beast.dragon(g,W,H,Math.min(W,H)*.9,t); figure(g,W*.2,H*.81,h*.5,{...meFigure(),style:'back',pose:'stand',face:1},t); } },
};

