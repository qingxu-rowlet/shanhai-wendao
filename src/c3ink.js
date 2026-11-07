/* ============================================================
   山海问道 · 第三章 — ink-painted backgrounds for the chapter-3 heart events, in the same 水墨 style as chapters 1–2
   (the characters stay pixel chibis): 萧烬 — 瘸腿的狗 (the alley), 赌一局 (千金坊's back hall), 屋顶 (over the city),
   草窝 (the hillside above 安平村); 大师姐 — 药圃夜谈, 木剑, 槐树, 河灯.
   ============================================================ */
const C3INK={
  // a wall in perspective: a dark wash with brick courses, a tiled coping along its top
  wall(g,x0,x1,top0,top1,bot0,bot1,a,R){ g.fillStyle=SUMI.ink(a); g.beginPath(); g.moveTo(x0,top0); g.lineTo(x1,top1); g.lineTo(x1,bot1); g.lineTo(x0,bot0); g.closePath(); g.fill();
    for(let i=1;i<14;i++){ const u=i/14, ya=top0+(bot0-top0)*u, yb=top1+(bot1-top1)*u; brush(g,[[x0,ya],[x1,yb]],1,a*.35); }
    g.strokeStyle=SUMI.ink(Math.min(.95,a+.3)); g.lineWidth=Math.max(2,Math.abs(top0-bot0)*.03); g.beginPath(); g.moveTo(x0,top0); g.lineTo(x1,top1); g.stroke();
    for(let i=0;i<=16;i++){ const u=i/16, x=x0+(x1-x0)*u, y=top0+(top1-top0)*u; brush(g,[[x,y-3],[x+(x1-x0)*.02,y+4]],1.4,a*.8); } },
  // tiled roofs seen from above and far off: a ridge, the eaves turned up, rows of tiles
  roofs(g,W,y,s,n,R,a,lit){ for(let k=0;k<n;k++){ const x=W*(k+.5)/n+(R()-.5)*W*.06, w=s*(1+R()*.6), h=s*.35;
      Land.roof(g,x,y+(R()-.5)*s*.15,w,h,a); g.fillStyle=SUMI.ink(a); g.fillRect(x-w*.42,y+h*.25,w*.84,s*.5);
      if(lit&&R()<.7){ const wx=x+(R()-.5)*w*.5, wy=y+h*.4+R()*s*.15, gr=g.createRadialGradient(wx,wy,0,wx,wy,s*.25); gr.addColorStop(0,'rgba(255,190,100,.55)'); gr.addColorStop(1,'rgba(255,190,100,0)'); g.fillStyle=gr; g.fillRect(wx-s*.25,wy-s*.25,s*.5,s*.5); g.fillStyle='rgba(255,210,130,.9)'; g.fillRect(wx-s*.03,wy-s*.02,s*.06,s*.05); } } },
  night(g,W,H,R,tone){ Land.paper(g,W,H,R,tone||'#d2cec4'); Land.sky(g,W,H,['rgba(14,18,40,.86)','rgba(30,34,62,.66)','rgba(52,50,74,.42)']);
    for(let i=0;i<110;i++){ g.fillStyle=`rgba(255,250,232,${.25+R()*.55})`; g.fillRect(R()*W,R()*H*.5,R()<.12?2:1,R()<.12?2:1); } },
  hangLantern(g,x,y,r){ g.strokeStyle=SUMI.ink(.8); g.lineWidth=Math.max(1,r*.08); g.beginPath(); g.moveTo(x,y-r*2.4); g.lineTo(x,y-r); g.stroke(); Land.lantern(g,x,y,r,7); },
  washing(g,x0,y0,x1,y1,R){ brush(g,[[x0,y0],[(x0+x1)/2,Math.max(y0,y1)+12],[x1,y1]],1,.7);
    for(let i=0;i<5;i++){ const u=.15+i*.17, x=x0+(x1-x0)*u, y=y0+(y1-y0)*u+12*Math.sin(u*Math.PI), w=10+R()*12, h=18+R()*20;
      g.fillStyle=['rgba(120,150,180,.55)','rgba(230,226,214,.6)','rgba(170,90,80,.5)','rgba(140,160,120,.5)'][i%4]; g.fillRect(x-w/2,y,w,h); brush(g,[[x-w/2,y],[x+w/2,y]],1,.6); } },
};
Object.assign(SCENES_INK,{
  /* ---- 萧烬 ---- */
  // 2♥ 瘸腿的狗: the narrow lane at night, a strip of moonlit sky between two high walls, one red lantern, washing on a line
  xj_alley:{ base(g,W,H,R){ C3INK.night(g,W,H,R,'#cfcac0');
      Land.orb(g,W*.52,H*.1,Math.min(W,H)*.05,'#f4efda',5);
      C3INK.wall(g,-W*.02,W*.36,H*.06,H*.24,H*.98,H*.86,.8,R); C3INK.wall(g,W*1.02,W*.64,H*.04,H*.24,H*.98,H*.86,.86,R);
      g.fillStyle=SUMI.ink(.6); g.fillRect(W*.36,H*.24,W*.28,H*.62);                                           // the far end of the lane
      C3INK.roofs(g,W,H*.22,W*.06,3,R,.7,true);
      C3INK.washing(g,W*.06,H*.34,W*.94,H*.3,R);
      C3INK.hangLantern(g,W*.25,H*.46,Math.min(W,H)*.03);
      Land.ground(g,W,H,H*.86,.55); const gr=g.createRadialGradient(W*.5,H*.9,0,W*.5,H*.9,W*.4); gr.addColorStop(0,'rgba(210,215,235,.22)'); gr.addColorStop(1,'rgba(210,215,235,0)'); g.fillStyle=gr; g.fillRect(0,H*.7,W,H*.3);
      for(let i=0;i<26;i++){ const y=H*(.88+R()*.11), x=R()*W; brush(g,[[x,y],[x+W*.04,y]],1,.25); }           // wet flagstones
      Land.rock(g,W*.86,H*.88,W*.08,H*.05,R,.7); g.fillStyle=SUMI.ink(.75); g.fillRect(W*.1,H*.8,W*.07,H*.08); brush(g,[[W*.1,H*.8],[W*.17,H*.8]],2,.9); } },  // a broken basket
  // 4♥ 赌一局: 千金坊's back hall, one lamp: a lattice screen, the long table, the dice cup between you
  xj_dice:{ base(g,W,H,R){ Land.paper(g,W,H,R,'#e2d0b2'); g.fillStyle='rgba(40,24,14,.62)'; g.fillRect(0,0,W,H);
      const gl=g.createRadialGradient(W*.5,H*.5,0,W*.5,H*.5,W*.55); gl.addColorStop(0,'rgba(255,196,120,.38)'); gl.addColorStop(1,'rgba(255,196,120,0)'); g.fillStyle=gl; g.fillRect(0,0,W,H);
      // the lattice screen behind
      g.strokeStyle='rgba(30,16,8,.7)'; g.lineWidth=Math.max(2,W*.005); for(let x=W*.12;x<=W*.88;x+=W*.04){ g.beginPath(); g.moveTo(x,H*.08); g.lineTo(x,H*.62); g.stroke(); } for(let y=H*.08;y<=H*.62;y+=H*.06){ g.beginPath(); g.moveTo(W*.12,y); g.lineTo(W*.88,y); g.stroke(); }
      g.fillStyle='rgba(240,214,170,.12)'; g.fillRect(W*.12,H*.08,W*.76,H*.54);
      Land.seal(g,W*.46,H*.13,W*.07,'財');
      for(const x of [.08,.92]) C3INK.hangLantern(g,W*x,H*.26,Math.min(W,H)*.035);
      // the floor, the table between the two of you
      g.fillStyle='rgba(50,30,16,.75)'; g.fillRect(0,H*.62,W,H*.38); for(let i=0;i<8;i++) brush(g,[[0,H*(.66+i*.045)],[W,H*(.66+i*.045)]],1,.3);
      g.fillStyle='#3a5a3e'; g.beginPath(); g.moveTo(W*.36,H*.6); g.lineTo(W*.64,H*.6); g.lineTo(W*.68,H*.72); g.lineTo(W*.32,H*.72); g.closePath(); g.fill();
      brush(g,[[W*.36,H*.6],[W*.64,H*.6]],2,.9); g.fillStyle='rgba(20,12,6,.9)'; g.fillRect(W*.32,H*.72,W*.36,H*.03); for(const x of [.34,.66]) g.fillRect(W*x-W*.01,H*.75,W*.02,H*.12);
      g.fillStyle='#6a4424'; g.beginPath(); g.ellipse(W*.5,H*.6,W*.03,H*.015,0,0,7); g.fill(); g.fillRect(W*.47,H*.53,W*.06,H*.07); g.fillStyle='#8a5e34'; g.beginPath(); g.ellipse(W*.5,H*.53,W*.03,H*.014,0,0,7); g.fill();   // the cup
      for(const [x,y] of [[.43,.66],[.56,.64]]){ g.fillStyle='#f0e8d4'; g.fillRect(W*x,H*y,W*.018,W*.018); g.fillStyle='#c8413b'; g.fillRect(W*x+W*.007,H*y+W*.007,W*.004,W*.004); } } },
  // 6♥ 屋顶: over the sleeping city: roofs to the horizon, a few lit windows, the big moon; you sit on the ridge
  xj_roof:{ base(g,W,H,R){ C3INK.night(g,W,H,R,'#cccad0');
      Land.orb(g,W*.78,H*.18,Math.min(W,H)*.1,'#f6f1dc',5);
      Land.peaks(g,W,H,R,{y:H*.46,amp:H*.12,n:5,a:.28,tint:'#20243a'}); Land.mist(g,W,H,H*.46,H*.08,.25);
      C3INK.roofs(g,W,H*.5,W*.06,9,R,.55,true); C3INK.roofs(g,W,H*.58,W*.09,6,R,.72,true);
      // the ridge you sit on: a long tiled roof in the foreground
      g.fillStyle=SUMI.ink(.92); g.beginPath(); g.moveTo(-W*.05,H*.76); g.quadraticCurveTo(W*.5,H*.72,W*1.05,H*.76); g.lineTo(W*1.05,H); g.lineTo(-W*.05,H); g.fill();
      g.strokeStyle='rgba(200,200,220,.18)'; g.lineWidth=1; for(let x=-W*.05;x<W*1.05;x+=W*.022){ g.beginPath(); g.moveTo(x,H*.77); g.lineTo(x-W*.03,H); g.stroke(); }
      brush(g,[[-W*.05,H*.755],[W*.5,H*.735],[W*1.05,H*.755]],Math.max(3,H*.012),.95);
      for(const x of [.04,.96]){ g.fillStyle=SUMI.ink(.95); g.beginPath(); g.moveTo(W*x,H*.75); g.quadraticCurveTo(W*x+(x<.5?-1:1)*W*.03,H*.71,W*x+(x<.5?-1:1)*W*.05,H*.68); g.lineTo(W*x+(x<.5?1:-1)*W*.01,H*.76); g.fill(); } } },   // the upturned ridge ends
  // 8♥ 草窝: dusk on the hill above 安平村: a little cairn, wild flowers, one pine
  xj_grave:{ base(g,W,H,R){ Land.paper(g,W,H,R,'#efd3b2'); Land.sky(g,W,H*.7,['rgba(90,40,60,.32)','rgba(220,120,70,.32)','rgba(245,190,120,.1)']);
      Land.orb(g,W*.22,H*.48,Math.min(W,H)*.08,'#d8452e',4); farHills(g,W,H,R,H*.6,'#5a3040');
      Land.ground(g,W,H,H*.8,.22,'#6a5a30'); for(let i=0;i<60;i++) Land.grass(g,R()*W,H*(.82+R()*.16),H*.05,3,R,.55,'#4a4a28');
      // the cairn: stones piled, four claw marks scored across the top one
      const cx=W*.5, cy=H*.85; for(const [dx,dy,s] of [[-.05,0,1],[.04,0,1.1],[0,-.05,.9],[-.02,-.1,.7],[.02,-.14,.5]]) Land.rock(g,cx+W*dx,cy+H*dy,W*.07*s,H*.06*s,R,.7);
      for(let k=0;k<4;k++) brush(g,[[cx-W*.02+k*W*.008,cy-H*.17],[cx-W*.01+k*W*.008,cy-H*.13]],1.5,.9);
      for(const [dx,c] of [[-.1,'#f2e27a'],[-.07,'#f2a0b8'],[.08,'#ffffff'],[.11,'#b8a0f0'],[.13,'#f2e27a']]){ const x=cx+W*dx, y=cy; brush(g,[[x,y],[x,y-H*.05]],1.2,.6); g.fillStyle=c; for(let p=0;p<5;p++){ g.beginPath(); g.ellipse(x+Math.cos(p*1.26)*3,y-H*.05+Math.sin(p*1.26)*3,2.6,2.6,0,0,7); g.fill(); } }
      Land.pine(g,W*.88,H*.86,H*.5,R,.9); Land.birds(g,W*.66,H*.24,W*.01,3,R,.7); } },
  /* ---- 大师姐 ---- */
  // 2♥ 药圃夜谈: the herb garden at night, rows of beds, the stone steps where she sits
  xie_yaopu:{ base(g,W,H,R){ C3INK.night(g,W,H,R,'#cfd2c8'); Land.orb(g,W*.78,H*.16,Math.min(W,H)*.06,'#f4efdc',5); farHills(g,W,H,R,H*.6,'#203030');
      Land.ground(g,W,H,H*.66,.3,'#2a4a2a'); for(let r=0;r<5;r++){ const y=H*(.7+r*.06); for(let x=(r%2)*W*.04;x<W*.5;x+=W*.06) Land.grass(g,x,y,H*.035,5,R,.6,'#2a5a2a'); }
      for(let k=0;k<4;k++){ g.fillStyle=SUMI.ink(.35+k*.08); g.fillRect(W*(.5-k*.02),H*(.86-k*.035),W*(.5+k*.04),H*.035); brush(g,[[W*(.5-k*.02),H*(.86-k*.035)],[W,H*(.86-k*.035)]],1.5,.7); }
      Land.bamboo(g,W*.95,H*.86,H*.2,W*.012,R,.8); Land.bamboo(g,W*.9,H*.86,H*.28,W*.01,R,.7); } },
  // 4♥ 木剑: the practice ground at sunset, a rack of wooden swords
  xie_jian:{ base(g,W,H,R){ Land.paper(g,W,H,R,'#f0dcc0'); Land.orb(g,W*.18,H*.46,Math.min(W,H)*.07,'#e0623e',4); farHills(g,W,H,R,H*.56,'#6a4a3a');
      Land.ground(g,W,H,H*.66,.14,'#8a7050'); for(let y=H*.68;y<H;y+=H*.05){ brush(g,[[0,y],[W,y]],1,.18); for(let x=((y/(H*.05))%2)*W*.05;x<W;x+=W*.1) brush(g,[[x,y],[x,y+H*.05]],1,.14); }
      g.fillStyle=SUMI.ink(.85); g.fillRect(W*.82,H*.52,W*.012,H*.2); g.fillRect(W*.92,H*.52,W*.012,H*.2); g.fillRect(W*.8,H*.56,W*.15,H*.012);
      for(let i=0;i<4;i++) brush(g,[[W*(.835+i*.025),H*.5],[W*(.835+i*.025),H*.66]],2,.85);
      Land.tree(g,W*.06,H*.68,H*.42,R,.8,'#e8a060'); } },
  // 6♥ 槐树: 四方馆's courtyard at night, the old 槐树 in white flower, the white wall behind
  xie_huai:{ base(g,W,H,R){ C3INK.night(g,W,H,R,'#d0cec6'); Land.orb(g,W*.84,H*.14,Math.min(W,H)*.06,'#f4efdc',5);
      g.fillStyle='rgba(236,230,214,.92)'; g.fillRect(0,H*.5,W,H*.2); g.fillStyle=SUMI.ink(.85); g.fillRect(0,H*.48,W,H*.03); for(let x=0;x<W;x+=W*.03) brush(g,[[x,H*.48],[x+W*.01,H*.51]],1.5,.9);
      g.fillStyle=SUMI.ink(.5); g.fillRect(0,H*.7,W,H*.3); for(let i=0;i<10;i++) brush(g,[[0,H*(.72+i*.03)],[W,H*(.72+i*.03)]],1,.2);
      // the 槐树: a thick old trunk, spreading boughs, white flowers hanging in clusters
      const x=W*.5, y=H*.86; brush(g,[[x-W*.02,y],[x-W*.01,y-H*.25],[x+W*.02,y-H*.45]],W*.035,.9); brush(g,[[x,y-H*.3],[x-W*.16,y-H*.5],[x-W*.28,y-H*.55]],W*.014,.85); brush(g,[[x+W*.01,y-H*.36],[x+W*.18,y-H*.56],[x+W*.3,y-H*.58]],W*.013,.85);
      for(let k=0;k<220;k++){ const a=R()*Math.PI*2, rr=Math.sqrt(R()), px=x+Math.cos(a)*W*.3*rr, py=y-H*.6+Math.sin(a)*H*.2*rr; g.fillStyle=SUMI.ink(.15+R()*.32); g.beginPath(); g.ellipse(px,py,W*.009,H*.007,R()*3,0,7); g.fill(); }   // the leaves, dark wet dabs
      for(let k=0;k<55;k++){ const a=R()*Math.PI*2, rr=Math.sqrt(R()), px=x+Math.cos(a)*W*.28*rr, py=y-H*.58+Math.sin(a)*H*.2*rr+H*.03;     // white flowers hanging in little clusters
        for(let j=0;j<5;j++){ g.fillStyle=`rgba(255,252,238,${.75+R()*.2})`; g.beginPath(); g.arc(px+(R()-.5)*W*.008,py+j*H*.006,W*.0035*(1-j*.12),0,7); g.fill(); } }
      Land.ground(g,W,H,H*.84,.3); } },
  // 8♥ 河灯: the 护城河 on 花朝节: lotus lanterns drifting, the city's roofs across the water, the stone embankment
  xie_river:{ base(g,W,H,R){ C3INK.night(g,W,H,R,'#cfcbc4'); Land.orb(g,W*.72,H*.14,Math.min(W,H)*.06,'#f6f1dc',5);
      C3INK.roofs(g,W,H*.42,W*.07,8,R,.7,true); g.fillStyle=SUMI.ink(.8); g.fillRect(0,H*.45,W,H*.06);
      Land.water(g,W,H*.5,H,R,.3,'#2a3456');
      for(let i=0;i<10;i++){ const x=W*(.44+R()*.54), y=H*(.56+i*.04+R()*.02); g.fillStyle='rgba(255,190,100,.2)'; g.fillRect(x-W*.004,y,W*.008,H*(.06+R()*.04)); }   // their light on the water
      for(let i=0;i<16;i++){ const x=W*(.4+R()*.6), y=H*(.54+R()*.42), s=W*(.008+(y/H-.5)*.03), gl=g.createRadialGradient(x,y,0,x,y,s*4);
        gl.addColorStop(0,'rgba(255,190,100,.5)'); gl.addColorStop(1,'rgba(255,190,100,0)'); g.fillStyle=gl; g.fillRect(x-s*4,y-s*4,s*8,s*8);
        for(let p=-2;p<=2;p++){ g.fillStyle=p%2?'#e87888':'#f4a8b4'; g.beginPath(); g.ellipse(x+p*s*.55,y,s*.42,s*.95,p*.35,0,7); g.fill(); } g.fillStyle='#ffe090'; g.fillRect(x-s*.12,y-s*.9,s*.24,s*.6); }
      // the embankment where you stand, a willow over it
      g.fillStyle=SUMI.ink(.85); g.beginPath(); g.moveTo(0,H*.72); g.lineTo(W*.42,H*.72); g.lineTo(W*.46,H); g.lineTo(0,H); g.fill(); brush(g,[[0,H*.72],[W*.42,H*.72]],3,.95);
      for(let i=0;i<8;i++) brush(g,[[W*.02+i*W*.05,H*.74],[W*.02+i*W*.05,H*.98]],1,.4);
      brush(g,[[W*.05,H*.72],[W*.07,H*.5],[W*.12,H*.3]],W*.014,.9); for(let k=0;k<22;k++){ const sx=W*(.06+R()*.16), sy=H*(.28+R()*.08); brush(g,[[sx,sy],[sx+W*.01,sy+H*.15],[sx+W*.005,sy+H*(.25+R()*.15)]],1.2,.55); } } },
});
Object.assign(INK_ROM,{ xj_alley:{gy:.88}, xj_dice:{gy:.84}, xj_roof:{gy:.745}, xj_grave:{gy:.85}, xie_yaopu:{gy:.85}, xie_jian:{gy:.86}, xie_huai:{gy:.86}, xie_river:{gy:.72} });
PXSCENES.xie_river.fx=null;      // the lanterns are painted on the water now (the pixel ones floated in the sky)
