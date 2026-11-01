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
C3A.ridgeCG=function(){
  PixCG.open({ink:(g,W,H,R)=>{ Land.sky(g,W,H,['#070912','#121830','#232a4c','#2e3254']);
      for(let k=0;k<90;k++){ g.fillStyle=`rgba(230,230,255,${.2+R()*.6})`; g.fillRect(R()*W,R()*H*.55,R()<.1?2:1,R()<.1?2:1); }
      const mx=W*.74, my=H*.24, mr=H*.11, mg=g.createRadialGradient(mx,my,mr*.8,mx,my,mr*3); mg.addColorStop(0,'rgba(240,234,210,.35)'); mg.addColorStop(1,'rgba(240,234,210,0)');
      g.fillStyle=mg; g.fillRect(0,0,W,H); g.fillStyle='#f0ead2'; g.beginPath(); g.arc(mx,my,mr,0,7); g.fill(); g.fillStyle='rgba(200,194,170,.5)'; g.beginPath(); g.arc(mx-mr*.3,my+mr*.2,mr*.2,0,7); g.arc(mx+mr*.25,my-mr*.3,mr*.12,0,7); g.fill();
      Land.peaks(g,W,H,R,{y:H*.5,amp:H*.18,n:6,a:.55,tint:'#1a1e34'}); Land.mist(g,W,H,H*.55,H*.08,.12);
      // the near ridge: a long black line across, rising to the right where he stands
      g.fillStyle='#07080e'; g.beginPath(); g.moveTo(0,H*.66); for(let x=0;x<=W;x+=W/40){ const u=x/W; g.lineTo(x,H*(.66-.22*Math.max(0,Math.sin(u*Math.PI*.95-.2))+Math.sin(u*31)*.006)); } g.lineTo(W,H); g.lineTo(0,H); g.closePath(); g.fill();
      // the pack along the ridge, sitting
      const ridgeY=u=>H*(.66-.22*Math.max(0,Math.sin(u*Math.PI*.95-.2))+Math.sin(u*31)*.006);
      for(const [u,s,f] of [[.56,.06,1],[.62,.07,1],[.81,.065,-1],[.87,.055,-1],[.92,.05,-1]]) C3A.wolf(g,W*u,ridgeY(u)+H*.004,H*s,f,R);
      // below: the dark slope down to the camp, the fire a small warm point
      const fx=W*.2, fy=H*.9, fg=g.createRadialGradient(fx,fy,0,fx,fy,W*.25); fg.addColorStop(0,'rgba(255,150,70,.45)'); fg.addColorStop(1,'rgba(255,150,70,0)'); g.fillStyle=fg; g.fillRect(0,0,W,H); },
    cast:[{who:'me', x:.12, pose:'stand', face:1, s:.8},{look:LOOK_XIE, x:.24, pose:'sword', prop:'sword', face:1, s:.8},
      {get cv(){ return C3A.sil(LOOK_XIAO,'stand'); }, x:.715, y:.455, s:.85, face:-1}],
    title:'山脊', small:'第三章 · 北上', seed:6102});
  const c=PixCG.cur, ridgeY=u=>(.66-.22*Math.max(0,Math.sin(u*Math.PI*.95-.2))+Math.sin(u*31)*.006);
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
