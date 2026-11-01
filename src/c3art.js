/* ============================================================
   山海问道 · 第三章「京城」 · 插画 — act 1: 「裂开的牌位」 (安平村's shrine: dust in a shaft of light, the altar, and
   大师兄's 长生禄位 split down the middle under four claw marks) and 「山脊」 (night after the wolves: a full moon, a man
   on the ridge in a dark cloak with the pack sitting round him, the camp fire small below).
   ============================================================ */
const LOOK_XIAO={g:'m',skin:0,hair:2,hairColor:0,style:'robe',cloth:7};   // 萧烬 — only ever a dark shape in act 1
const C3A={};

/* ---------- 裂开的牌位 ---------- */
C3A.shrineCG=function(){
  PixCG.open({ink:(g,W,H,R)=>{ Land.paper(g,W,H,R,'#3a2e26'); g.fillStyle='rgba(24,16,12,.88)'; g.fillRect(0,0,W,H);
      // plank walls, a beam, the window high on the left
      for(let x=0;x<W;x+=W/18){ g.fillStyle=`rgba(${70+R()*16|0},${50+R()*10|0},${36+R()*8|0},.55)`; g.fillRect(x,0,W/18-W*.004,H*.78); }
      g.fillStyle='rgba(40,26,18,.95)'; g.fillRect(0,H*.12,W,H*.035);
      g.fillStyle='rgba(230,214,170,.25)'; g.fillRect(W*.08,H*.2,W*.1,H*.14); g.strokeStyle='rgba(40,26,18,.9)'; g.lineWidth=W*.006; for(let k=1;k<4;k++){ g.beginPath(); g.moveTo(W*(.08+k*.025),H*.2); g.lineTo(W*(.08+k*.025),H*.34); g.stroke(); }
      // the light falling from the window across to the altar
      const sh=g.createLinearGradient(W*.12,H*.25,W*.55,H*.75); sh.addColorStop(0,'rgba(255,236,180,.28)'); sh.addColorStop(1,'rgba(255,236,180,0)');
      g.fillStyle=sh; g.beginPath(); g.moveTo(W*.08,H*.2); g.lineTo(W*.18,H*.2); g.lineTo(W*.72,H*.8); g.lineTo(W*.42,H*.8); g.closePath(); g.fill();
      // the floor
      g.fillStyle='rgba(30,22,16,.95)'; g.fillRect(0,H*.78,W,H*.22); for(let k=0;k<20;k++){ g.fillStyle='rgba(120,100,80,.25)'; g.fillRect(R()*W,H*(.8+R()*.18),W*(.02+R()*.05),H*.004); }
      // the altar: a long table, a cold incense burner, two burnt-out candles
      const ax=W*.56, ay=H*.62; g.fillStyle='#4a2a1c'; g.fillRect(ax-W*.2,ay,W*.4,H*.04); g.fillStyle='#38200f'; g.fillRect(ax-W*.18,ay+H*.04,W*.03,H*.13); g.fillRect(ax+W*.15,ay+H*.04,W*.03,H*.13);
      g.fillStyle='rgba(120,80,60,.9)'; g.fillRect(ax-W*.17,ay+H*.04,W*.34,H*.012);
      g.fillStyle='#6a5a40'; g.beginPath(); g.ellipse(ax,ay-H*.012,W*.035,H*.015,0,0,7); g.fill(); g.fillRect(ax-W*.03,ay-H*.03,W*.06,H*.02);
      g.fillStyle='rgba(180,170,150,.6)'; for(let k=0;k<5;k++) g.fillRect(ax-W*.012+k*W*.006,ay-H*.06,W*.002,H*.03);   // incense stubs, long cold
      for(const s of [-1,1]){ g.fillStyle='#b8a888'; g.fillRect(ax+s*W*.13,ay-H*.035,W*.012,H*.035); g.fillStyle='#2a2018'; g.fillRect(ax+s*W*.13,ay-H*.04,W*.012,H*.006); }
      // the tablet: red lacquer, a gold rim, split down the middle; the two halves leaning apart
      const tx=ax, ty=ay-H*.36, tw=W*.075, th=H*.33;
      for(const s of [-1,1]){ g.save(); g.translate(tx+s*W*.006,ty+th); g.rotate(s*.035);
        g.fillStyle='#7a1e18'; g.fillRect(s<0?-tw/2:0,-th,tw/2,th); g.fillStyle='#c8a050'; g.fillRect(s<0?-tw/2:tw/2-W*.006,-th,W*.006,th); g.fillRect(s<0?-tw/2:0,-th,tw/2,H*.008);
        g.restore(); }
      g.fillStyle='#c8a050'; g.beginPath(); g.moveTo(tx-tw*.62,ty+H*.012); g.quadraticCurveTo(tx,ty-H*.05,tx+tw*.62,ty+H*.012); g.lineTo(tx+tw*.55,ty+H*.02); g.lineTo(tx-tw*.55,ty+H*.02); g.closePath(); g.fill();
      g.fillStyle='#5a1610'; g.fillRect(tx-tw*.6,ty+th,tw*1.2,H*.02);
      // the words, top to bottom, the crack running through them
      g.fillStyle='#e8c870'; g.textAlign='center'; g.font=`${Math.round(H*.026)}px "Ma Shan Zheng",KaiTi,serif`;
      const words=['长','生','禄','位'], name=(sectName()+'陆仙长正衡').split('');
      words.forEach((c,i)=>g.fillText(c,tx-tw*.22,ty+H*(.05+i*.034)));
      g.font=`${Math.round(H*.02)}px "Ma Shan Zheng",KaiTi,serif`; name.forEach((c,i)=>g.fillText(c,tx+tw*.2,ty+H*(.05+i*.026)));
      g.strokeStyle='#120806'; g.lineWidth=W*.004; g.beginPath(); g.moveTo(tx,ty-H*.02); for(let k=1;k<=10;k++) g.lineTo(tx+(k%2?1:-1)*W*.004,ty+th*k/10); g.stroke();
      // four claw marks, raked down across it
      g.strokeStyle='rgba(20,10,8,.95)'; g.lineWidth=W*.005; g.lineCap='round';
      for(let k=0;k<4;k++){ const x0=tx-tw*.5+k*tw*.27, y0=ty+H*.04; g.beginPath(); g.moveTo(x0,y0); g.quadraticCurveTo(x0+tw*.12,y0+th*.35,x0+tw*.3,y0+th*.62); g.stroke(); }
      g.strokeStyle='rgba(230,200,150,.35)'; g.lineWidth=W*.0015; for(let k=0;k<4;k++){ const x0=tx-tw*.5+k*tw*.27+W*.003, y0=ty+H*.04; g.beginPath(); g.moveTo(x0,y0); g.quadraticCurveTo(x0+tw*.12,y0+th*.35,x0+tw*.3,y0+th*.62); g.stroke(); }
      Land.edge&&Land.edge(g,W,H); },
    cast:[{who:'me', x:.14, pose:'stand', face:1},{look:LOOK_XIE, x:.27, pose:'stand', face:1, mood:'dim'}],
    title:'裂开的牌位', small:'第三章 · 北上', seed:6101});
  PixCG.cur.front=(g,W,H,fp,t)=>{ // dust turning in the light
    for(let k=0;k<26;k++){ const u=(t*.03+k*.0385)%1, x=W*(.12+u*.5+Math.sin(t*.6+k)*.02), y=H*(.24+u*.5+Math.cos(t*.5+k*1.7)*.03);
      g.fillStyle=`rgba(255,240,200,${.35*Math.sin(u*Math.PI)})`; g.fillRect(x,y,Math.max(1,fp*.5),Math.max(1,fp*.5)); } }; };

/* ---------- 山脊 ---------- */
// a figure against the night sky: all one cold near-black (C2Y.sil is warm, for firelit caves)
C3A.sil=function(look,pose){ const key='c3sil'+JSON.stringify([look,pose]); if(FineArt.cache[key]) return FineArt.cache[key];
  const b=cgChibi(look,pose,null,null,null,false), W=b.width, H=b.height, d=b.getContext('2d').getImageData(0,0,W,H).data;
  return FineArt.cache[key]=FineArt.paint(W,H,P=>{ for(let y=0;y<H;y++) for(let x=0;x<W;x++) if(d[(y*W+x)*4+3]) P.set(x,y,y<H*.5?'#0b0c14':'#08090f'); }); };
C3A.wolf=(g,x,y,s,face,R)=>{ // a sitting wolf, black against the sky, the head red, a glint for an eye
  g.save(); g.translate(x,y); g.scale(face,1); g.fillStyle='#0a0b12';
  g.beginPath(); g.moveTo(-s*.5,0); g.quadraticCurveTo(-s*.55,-s*.7,-s*.1,-s*.95); g.lineTo(s*.2,-s*.9); g.quadraticCurveTo(s*.35,-s*.4,s*.3,0); g.closePath(); g.fill();   // body, sitting
  g.beginPath(); g.moveTo(-s*.5,0); g.quadraticCurveTo(-s*.95,-s*.05,-s*.85,-s*.35); g.lineTo(-s*.75,-s*.3); g.quadraticCurveTo(-s*.8,-s*.1,-s*.45,-s*.06); g.fill();     // tail
  g.fillStyle='#5a1414'; g.beginPath(); g.moveTo(-s*.12,-s*.9); g.lineTo(s*.45,-s*1.02); g.lineTo(s*.5,-s*.92); g.lineTo(s*.2,-s*.78); g.closePath(); g.fill();          // the red head, snout out
  g.beginPath(); g.moveTo(-s*.05,-s*.95); g.lineTo(0,-s*1.22); g.lineTo(s*.1,-s*.98); g.fill(); g.beginPath(); g.moveTo(s*.08,-s*.97); g.lineTo(s*.16,-s*1.2); g.lineTo(s*.22,-s*.96); g.fill();   // ears
  g.restore(); };
C3A.ridgeY=u=>(.66-.22*Math.max(0,Math.sin(u*Math.PI*.95-.2))+Math.sin(u*31)*.006);   // the near ridge's crest, 0..1 of the height
// a range of mountains as one jagged silhouette; the side facing the moon (up and to the right) catches a thin light
C3A.range=(g,W,H,R,base,amp,n,col,rim,jag)=>{ const pts=[]; for(let k=0;k<=n;k++){ const u=k/n; pts.push([W*u, H*(base-amp*(.35+.65*Math.abs(Math.sin(u*Math.PI*(1.3+R()*.4)+R()*3)))*(.55+R()*.45))]); }
  const ys=[]; for(let k=0;k<=220;k++){ const x=W*k/220; const f=x/W*n, i=Math.min(n-1,Math.floor(f)), t=f-i, a=pts[i][1], b=pts[i+1][1]; ys.push([x,a+(b-a)*(t*t*(3-2*t))+(R()-.5)*H*jag]); }
  g.fillStyle=col; g.beginPath(); g.moveTo(0,H); ys.forEach(([x,y])=>g.lineTo(x,y)); g.lineTo(W,H); g.closePath(); g.fill();
  if(rim){ g.strokeStyle=rim; g.lineWidth=Math.max(1,W*.0018); g.beginPath(); for(let k=1;k<ys.length;k++){ const [x,y]=ys[k], [px,py]=ys[k-1]; if(py>y){ g.moveTo(px,py); g.lineTo(x,y); } } g.stroke(); } };
// a pine as a dark shape: a thin trunk, tiers getting smaller towards the top
C3A.pine=(g,x,y,h,col)=>{ g.fillStyle=col; g.fillRect(x-h*.025,y-h*.25,h*.05,h*.25);
  for(let k=0;k<5;k++){ const ty=y-h*(.18+k*.17), w=h*(.32-k*.055); g.beginPath(); g.moveTo(x-w,ty); g.lineTo(x,ty-h*.26); g.lineTo(x+w,ty); g.closePath(); g.fill(); } };
C3A.ridgeCG=function(){
  PixCG.open({ink:(g,W,H,R)=>{ Land.sky(g,W,H,['#05070f','#0d1328','#1b2446','#2c3660','#3a4268']);
      for(let k=0;k<140;k++){ const y=R()*H*.6; g.fillStyle=`rgba(230,232,255,${(.15+R()*.6)*(1-y/(H*.7))})`; g.fillRect(R()*W,y,R()<.08?2:1,R()<.08?2:1); }
      // the moon, its halo, a thin cloud drifting across the lower half of it
      const mx=W*.74, my=H*.22, mr=H*.1;
      for(const [r,a] of [[mr*4.5,.08],[mr*2.4,.16],[mr*1.4,.22]]){ const mg=g.createRadialGradient(mx,my,mr*.9,mx,my,r); mg.addColorStop(0,`rgba(236,232,210,${a})`); mg.addColorStop(1,'rgba(236,232,210,0)'); g.fillStyle=mg; g.fillRect(0,0,W,H); }
      g.fillStyle='#f2eed8'; g.beginPath(); g.arc(mx,my,mr,0,7); g.fill();
      g.fillStyle='rgba(196,190,166,.55)'; for(const [dx,dy,r] of [[-.3,.2,.2],[.25,-.3,.13],[.1,.35,.1],[-.1,-.1,.08]]){ g.beginPath(); g.arc(mx+mr*dx,my+mr*dy,mr*r,0,7); g.fill(); }
      for(let k=0;k<14;k++){ const cx=mx+W*(-.14+k*.022+(R()-.5)*.02), cy=my+mr*(.45+Math.sin(k*.9)*.18+(R()-.5)*.1), rx=W*(.03+R()*.03), ry=H*(.008+R()*.008);   // a thin cloud, soft at its edges
        const cg=g.createRadialGradient(cx,cy,0,cx,cy,rx); cg.addColorStop(0,'rgba(34,40,72,.42)'); cg.addColorStop(1,'rgba(34,40,72,0)'); g.fillStyle=cg; g.save(); g.translate(cx,cy); g.scale(1,ry/rx); g.translate(-cx,-cy); g.beginPath(); g.arc(cx,cy,rx,0,7); g.fill(); g.restore(); }
      // three ranges going back, each paler, mist lying in the valleys between them, the moon catching their crests
      C3A.range(g,W,H,R,.5,.26,11,'#2a3358','rgba(200,206,236,.3)',.0012);
      { const mg=g.createLinearGradient(0,H*.42,0,H*.56); mg.addColorStop(0,'rgba(170,180,215,0)'); mg.addColorStop(.6,'rgba(170,180,215,.22)'); mg.addColorStop(1,'rgba(170,180,215,0)'); g.fillStyle=mg; g.fillRect(0,H*.42,W,H*.14); }
      C3A.range(g,W,H,R,.58,.18,13,'#181e38','rgba(180,188,224,.22)',.0015);
      for(let k=0;k<26;k++){ const x=R()*W, y=H*(.5+R()*.07); if(R()<.6) C3A.pine(g,x,y,H*(.03+R()*.025),'#151a32'); }
      { const mg=g.createLinearGradient(0,H*.52,0,H*.64); mg.addColorStop(0,'rgba(160,170,210,0)'); mg.addColorStop(.5,'rgba(160,170,210,.16)'); mg.addColorStop(1,'rgba(160,170,210,0)'); g.fillStyle=mg; g.fillRect(0,H*.52,W,H*.12); }
      // the near ridge, rising to the right where he stands; a moonlit edge along its crest
      const Y=u=>H*C3A.ridgeY(u);
      g.fillStyle='#07080e'; g.beginPath(); g.moveTo(0,H); for(let x=0;x<=W;x+=W/120) g.lineTo(x,Y(x/W)); g.lineTo(W,H); g.closePath(); g.fill();
      g.strokeStyle='rgba(150,162,210,.45)'; g.lineWidth=Math.max(1,W*.002); g.beginPath(); for(let x=W*.3;x<=W;x+=W/120){ const y=Y(x/W); x===W*.3?g.moveTo(x,y):g.lineTo(x,y); } g.stroke();
      // the outcrop under him: broken rock, its tops lit
      const bx=W*.715, by=Y(.715);
      for(const [dx,w,h] of [[-.045,.035,.05],[.0,.05,.075],[.04,.03,.04],[.07,.025,.03]]){ const x=bx+W*dx, y=by+H*.01;
        g.fillStyle='#0a0b12'; g.beginPath(); g.moveTo(x-W*w/2,y); g.lineTo(x-W*w*.35,y-H*h); g.lineTo(x+W*w*.1,y-H*h*1.08); g.lineTo(x+W*w/2,y-H*h*.5); g.lineTo(x+W*w/2,y); g.closePath(); g.fill();
        g.strokeStyle='rgba(160,172,220,.5)'; g.lineWidth=Math.max(1,W*.0015); g.beginPath(); g.moveTo(x-W*w*.35,y-H*h); g.lineTo(x+W*w*.1,y-H*h*1.08); g.lineTo(x+W*w/2,y-H*h*.5); g.stroke(); }
      // pines on the ridge, and long grass standing against the sky
      for(const [u,h] of [[.4,.13],[.45,.09],[.97,.15],[.93,.1],[.33,.07]]) C3A.pine(g,W*u,Y(u)+H*.01,H*h,'#06070c');
      g.strokeStyle='#07080e'; g.lineWidth=Math.max(1,W*.0012); for(let k=0;k<70;k++){ const u=.3+R()*.7, x=W*u, y=Y(u); if(Math.abs(u-.715)<.06) continue; const h=H*(.008+R()*.018), l=(R()-.5)*W*.01;
        g.beginPath(); g.moveTo(x,y+1); g.quadraticCurveTo(x+l*.3,y-h*.6,x+l,y-h); g.stroke(); }
      // the pack along the ridge, sitting
      for(const [u,sz,f] of [[.56,.06,1],[.62,.07,1],[.81,.065,-1],[.87,.055,-1],[.92,.05,-1]]) C3A.wolf(g,W*u,Y(u)+H*.004,H*sz,f,R);
      // the slope down to the camp: faint folds, a tent lit on one side by the fire
      for(let k=0;k<8;k++){ const x=R()*W, y=H*(.72+R()*.24); g.strokeStyle='rgba(40,46,70,.28)'; g.lineWidth=Math.max(1,W*.001); g.beginPath(); g.moveTo(x,y); g.quadraticCurveTo(x+W*.04,y-H*.01,x+W*.09,y+H*.004); g.stroke(); }
      const tx=W*.33, ty=H*.86; g.fillStyle='#0c0b10'; g.beginPath(); g.moveTo(tx-W*.05,ty); g.lineTo(tx,ty-H*.085); g.lineTo(tx+W*.05,ty); g.closePath(); g.fill();
      g.fillStyle='rgba(200,110,50,.2)'; g.beginPath(); g.moveTo(tx-W*.05,ty); g.lineTo(tx,ty-H*.085); g.lineTo(tx-W*.012,ty); g.closePath(); g.fill();
      const fx=W*.19, fy=H*.86, fg=g.createRadialGradient(fx,fy,0,fx,fy,W*.28); fg.addColorStop(0,'rgba(255,150,70,.42)'); fg.addColorStop(.4,'rgba(255,130,60,.12)'); fg.addColorStop(1,'rgba(255,150,70,0)'); g.fillStyle=fg; g.fillRect(0,0,W,H); },
    cast:[{who:'me', x:.12, pose:'stand', face:1, s:.8},{look:LOOK_XIE, x:.24, pose:'sword', prop:'sword', face:1, s:.8},
      {get cv(){ return C3A.sil(LOOK_XIAO,'stand'); }, x:.715, y:.455, s:.85, face:-1}],
    title:'山脊', small:'第三章 · 北上', seed:6102});
  const c=PixCG.cur, ridgeY=C3A.ridgeY;
  c.front=(g,W,H,fp,t)=>{
    // the wolves' eyes: small red points that come and go
    for(const [u,s,f,k] of [[.56,.06,1,0],[.62,.07,1,1],[.81,.065,-1,2],[.87,.055,-1,3],[.92,.05,-1,4]]){ if(Math.sin(t*1.3+k*2.1)<-.85) continue;
      g.fillStyle='rgba(255,70,50,.95)'; g.fillRect(W*u+f*H*s*.28,H*ridgeY(u)-H*s*.93,Math.max(2,fp*.7),Math.max(2,fp*.7)); }
    // his cloak in the wind
    const bx=W*.715, by=H*.455; g.fillStyle='rgba(6,6,12,.95)'; g.beginPath(); g.moveTo(bx-W*.006,by-H*.1); g.quadraticCurveTo(bx+W*(.03+.012*Math.sin(t*2.2)),by-H*.06,bx+W*(.045+.015*Math.sin(t*2.2+.6)),by-H*.005); g.lineTo(bx+W*.005,by-H*.01); g.closePath(); g.fill();
    // the fire flickering below
    const fx=W*.19, fy=H*.86, fl=.6+.4*Math.sin(t*9)*Math.sin(t*5.3), u=Math.max(2,fp);
    g.fillStyle='#2a1a10'; g.fillRect(fx-u*5,fy-u,u*10,u*1.4); g.fillRect(fx-u*3,fy-u*1.8,u*6,u);              // two logs
    for(const [dx,h,c] of [[-u*2,4.5,'#e0702c'],[u*1.6,4,'#e0702c'],[0,6.5,'#f4a040'],[0,3.5,'#ffe08a']]){ const hh=u*h*(1+.25*fl*Math.sin(t*7+dx));
      g.fillStyle=c; g.beginPath(); g.moveTo(fx+dx-u*1.6,fy-u*1.2); g.quadraticCurveTo(fx+dx-u*.6,fy-u*1.2-hh*.6,fx+dx+Math.sin(t*6+dx)*u*.6,fy-u*1.2-hh); g.quadraticCurveTo(fx+dx+u*.8,fy-u*1.2-hh*.5,fx+dx+u*1.6,fy-u*1.2); g.closePath(); g.fill(); }
    for(let k=0;k<4;k++){ const q=(t*.8+k*.25)%1; g.fillStyle=`rgba(255,200,120,${1-q})`; g.fillRect(fx+Math.sin(t*3+k*2)*u*2,fy-u*3-q*u*10,Math.max(1,u*.5),Math.max(1,u*.5)); } }; };
