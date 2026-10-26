/* ============================================================
   山海问道 · 第二章 · 铺垫与因果 — what the sect says about the three, and why it all comes apart in the 秘境.
   - 外门弟子 in every sect: pairs that gossip as you walk by (大师兄 the paragon; 大师姐 「一路睡上来的」; 二师兄 the
     glutton who never gets fat, his hoarded food gone mouldy). You can answer them back once; 大师姐 remembers.
   - The 八卦镜 is the thread: it shows each person the line they fear most. Shut in the fog with 穷奇's 戾气 still in the
     air, it takes them one by one — 大师兄, then 大师姐 (who kept it after the sealing), then 二师兄.
   - 大师姐's three memories as pictures, a white 九尾狐, and a fuller ending in which she lets the 心魔 go herself.
   ============================================================ */

/* ---------- 外门弟子 ---------- */
const C2L_LOOKS=[{g:'m',skin:1,hair:1,hairColor:1,style:'jin',cloth:0,face:'small'},{g:'m',skin:3,hair:1,hairColor:0,style:'jin',cloth:7,face:'mid'},
  {g:'f',skin:1,hair:2,hairColor:0,style:'qun',cloth:6,face:'mid'},{g:'m',skin:2,hair:5,hairColor:1,style:'robe',cloth:3,face:'small'},
  {g:'m',skin:2,hair:0,hairColor:0,style:'jin',cloth:2,face:'small'},{g:'f',skin:0,hair:3,hairColor:1,style:'qun',cloth:3,face:'mid'},
  {g:'m',skin:1,hair:0,hairColor:3,style:'robe',cloth:5,face:'small',beard:'#d8d4cc'}];
const C2L = {
  // pairs stand together and talk; each day a different exchange (what you overhear walking past)
  pairs:[
    {ids:['c2d_zhou','c2d_wu'], names:['周小川','吴阿蛮'], at:[[2,8],[3,8]], looks:[0,1], days:[
      [[0,'陆师兄昨天又下山斩了一头妖。'],[1,'听说那个村子给他立了长生牌位！'],[0,'人家才是正道楷模。']],
      [[1,'陆师兄练剑，三更起，五更收。'],[0,'他说过：规矩就是规矩。'],[1,'我要有他一半名声就好了……']],
      [[0,'「{宗}陆正衡」，这几个字在山下可值钱了。'],[1,'有陆师兄在，山下的妖都不敢过界。']]]},
    {ids:['c2d_lin','c2d_meng'], names:['林巧儿','孟大壮'], at:[[21,5],[22,5]], looks:[2,3], days:[
      [[0,'你看谢师姐，又一个人站在那儿。'],[1,'人家是真传，跟咱们说话掉价。'],[0,'真传？……我听说，她是一路睡上来的。'],[1,'嘘——小声点，她的剑可快。']],
      [[1,'昨天又有人看见她半夜从后山回来。'],[0,'后山？去干什么？'],[1,'谁知道呢，长成那样……']],
      [[0,'宗门大比那年，评判的长老都看直了眼。'],[1,'所以她才拿的头名嘛。'],[0,'哈哈哈……']]]},
    {ids:['c2d_sun','c2d_liu'], names:['孙小六','柳青青'], at:[[20,16],[21,16]], looks:[4,5], days:[
      [[0,'何师兄今天又吃了五碗。'],[1,'五碗？那小身板，吃下去都去哪了？'],[0,'饿死鬼投胎呗。']],
      [[1,'上回帮他收拾屋子，床底下一包点心都长毛了。'],[0,'他还抢回去，说还能吃！'],[1,'哈哈哈，真是个奇葩！']],
      [[0,'其实何师兄的功夫不差的。'],[1,'不差有什么用，整天就知道吃。'],[0,'也是。']]]},
  ],
  talks:{
    c2d_zhou:[['外门弟子·周小川','你就是宗主新收的真传？啧，宗主统共就收了四个真传：陆师兄、谢师姐、何师兄，再加上你。'],
      ['外门弟子·周小川','陆师兄可是我们这一辈的楷模。斩妖除魔，名声在外，连山下的县令都要敬他三分。'],
      ['外门弟子·吴阿蛮','你可别在他面前偷懒，他最讲规矩了。']],
    c2d_wu:[['外门弟子·吴阿蛮','陆师兄说过，修道之人，名正才能言顺。'],['外门弟子·吴阿蛮','我抄在墙上了，天天看。']],
    c2d_lin:[['外门弟子·林巧儿','新来的？离谢师姐远点。'],['外门弟子·林巧儿','长那么好看，又是真传——你说，凭什么？'],
      ['外门弟子·孟大壮','外门的老人都说，她是一路睡上来的。'],
      {choice:'你……', options:[{text:'你们亲眼看见了？', go:'c2l_defend'},{text:'（不说话）', go:'c2l_quiet'}]}],
    c2d_meng:null,
    c2d_sun:[['外门弟子·孙小六','你找何师兄？他八成又在膳堂。'],['外门弟子·柳青青','说来也怪，他一顿吃五碗，可瘦得跟竹竿似的，怎么都吃不胖。'],
      ['外门弟子·孙小六','他屋里到处藏着吃的，馒头、干粮、剩饭……都发霉了还舍不得扔。宗门里没人不笑话他。'],
      ['外门弟子·柳青青','其实他功夫不差的，就是……唉，真是个奇葩。']],
    c2d_liu:null,
    c2d_zhong:[['守门弟子·老钟','宗主收徒挑得很，这么多年，只收了四个真传。你能进来，是福气。'],
      ['守门弟子·老钟','不过啊，人多嘴杂。宗门里的闲话，听听就算了，别往心里去。'],
      ['守门弟子·老钟','……也别全不往心里去。有些话说多了，是会要人命的。']],
  },
  near(p){ const [a,b]=p.at, cx=(a[0]+b[0])/2+.5, cy=(a[1]+b[1])/2+.5; return Math.hypot(RT.fx+.5-cx,RT.fy+.5-cy)<3.6; },
  on(s){ return !!s.sect&&!!s.flags.c2_arrive&&!s.flags.c2_depart; },
};
C2L.talks.c2d_meng=C2L.talks.c2d_lin; C2L.talks.c2d_liu=C2L.talks.c2d_sun;
SCRIPTS.c2l_defend=[['我','你们亲眼看见了？'],['外门弟子·孟大壮','……这种事，还用得着亲眼看见？大家都这么说。'],
  ['外门弟子·林巧儿','哟，新来的护上了？小心哪天你也被她……'],
  ['旁白','你没有再接话。远处，谢霁月擦剑的手停了一下。她没有回头。'],{flag:'c2_defend_xie'}];
SCRIPTS.c2l_quiet=[['旁白','你没有说话。远处的谢霁月像是什么也没听见，一下一下地擦着她的剑。']];
for(const k in SECTS){ const M=MAPS['zong_'+k], mine=s=>s.sect===k&&C2L.on(s);
  for(const p of C2L.pairs) p.ids.forEach((id,i)=>M.objects.push({type:'npc', id, x:p.at[i][0], y:p.at[i][1], look:C2L_LOOKS[p.looks[i]], name:'外门弟子·'+p.names[i], act:'talk', cond:mine}));
  M.objects.push({type:'npc', id:'c2d_zhong', x:16, y:17, look:C2L_LOOKS[6], name:'守门弟子·老钟', act:'talk', cond:mine}); }
{ const _t=Story.talk; Story.talk=function(id){ if(C2L.talks[id]) return UI.say(C2L.talks[id]); return _t.call(Story,id); }; }
// what you overhear: a little speech bubble over whoever is talking, while you are close by
{ const _r=render; render=function(){ _r(); if(!RT.map||!/^zong_/.test(RT.mapId)||!S||!C2L.on(S)||UI.busy()) return;
    const g=ctx, Z=RT.scale*RT.dpr, T=TILE*Z, ox=Math.round(-RT.cam.x*Z), oy=Math.round(-RT.cam.y*Z), day=Math.min(2,S.c2&&S.c2.days||0);
    for(const p of C2L.pairs){ if(!C2L.near(p)) continue; const lines=p.days[day], k=Math.floor(RT.t/3.2)%lines.length, [who,raw]=lines[k], text=raw.replace(/\{宗\}/g,zongName()), [x,y]=p.at[who];
      const u=(RT.t/3.2)%1, al=Math.min(1,u*6,(1-u)*6);
      g.save(); g.globalAlpha=al; g.font=`${Math.round(T*.34)}px "PingFang SC","Microsoft YaHei",sans-serif`; const w=g.measureText(text).width+T*.36, h=T*.56, bx=Math.round(ox+(x+.5)*T-w/2), by=Math.round(oy+y*T-T*.95);
      g.fillStyle='rgba(255,250,240,.95)'; g.strokeStyle='#2a1e1a'; g.lineWidth=Math.max(1,Z*.6); g.beginPath(); g.roundRect?g.roundRect(bx,by,w,h,h*.3):g.rect(bx,by,w,h); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(bx+w/2-T*.12,by+h); g.lineTo(bx+w/2,by+h+T*.16); g.lineTo(bx+w/2+T*.12,by+h); g.fill();
      g.fillStyle='#2a1e1a'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(text,bx+w/2,by+h/2+1); g.restore(); } }; }

/* ---------- 九尾狐: white, as the story says — the small sprite and a new picture ---------- */
SPR.huli=SPR.huli.map((r,y)=>r.replace(/o/g,'z').replace(/w/g,y<8?'l':'x'));
for(const k of Object.keys(SPRC)) if(/^huli/.test(k)&&k!=='huli_big') delete SPRC[k];
// sitting tall in profile, facing left: a long neck, a narrow muzzle, a golden almond eye lined in red, a flame mark on the brow,
// slender straight forelegs, and nine long tails flowing up behind her like white flames
// 九尾狐 in pixels, side-on as in the author's references: a slender white fox facing left, and nine great tails sweeping
// back and up from her haunch and curling over, much bigger than she is — white with a shaded underside, the curled tips
// dipped in ink (two in gold); tall ears black-tipped and red within, a narrow red-lined eye, red flame swirls
FineArt.fox=function(){ return FineArt.cache.foxside13||(FineArt.cache.foxside13=FineArt.paint(120,80,P=>{
  const Wt='#fffaf0', Cr='#ece4d4', Sh='#cfc7ba', G1='#b4b0b6', G2='#75717a', Ik='#2b2533', Gd='#e0b040', Rd='#c8413b', Dk='#2a1e1a', oy=27;
  // a tail: a full, fluffy plume — thick, with tufted edges, drawn to a soft point that curls forward; a grey rim first so
  // the layers read apart, then the white, a creamy underside, and the tip dipped in ink or gold like a brush
  const tail=(ax,ay,a0,len,bend,r0,gold,seam)=>{ const pts=[]; let x=ax, y=ay; const n=80;
    for(let i=0;i<=n;i++){ const t=i/n, a=(a0+bend*Math.pow(t,1.3)*57.3)*Math.PI/180; x+=Math.cos(a)*len/n; y+=Math.sin(a)*len/n; pts.push([x,y,t]); }
    // wide almost to the end, then rounding off like a brush; the edge tufted so it reads as fur
    const tuft=t=>1+.13*Math.abs(((t*11)%1)-.5)*2;
    const rad=t=>Math.max(.9, r0*Math.min(1,.45+t*3)*(t>.6?.12+.88*Math.pow(Math.max(0,1-Math.pow((t-.6)/.4,2)),.8):1)*tuft(t));
    for(const [x,y,t] of pts) P.cap(x+.5,y+1.6,x+.5,y+1.6,rad(t),t>.5?G1:Sh);
    for(const [x,y,t] of pts) P.cap(x,y,x,y,rad(t)*.9, t>.95?(gold?Gd:Ik):t>.9?G2:t>.84?G1:Wt);
    // a fine seam along the upper edge, where this tail lies over the one behind it
    if(seam) for(let i=1;i<pts.length-1;i++){ const [x,y,t]=pts[i]; if(t<.22||t>.8) continue; const dx=pts[i+1][0]-pts[i-1][0], dy=pts[i+1][1]-pts[i-1][1], d=Math.hypot(dx,dy)||1, r=rad(t)*.82; P.set(Math.round(x+dy/d*r),Math.round(y-dx/d*r),G1); } };
  // nine tails leaving the rump together and curling up by different amounts, so the tips spread in a soft crest; the
  // ones arching furthest over her back sit behind, the flatter ones in front
  const T=[[-64,50,-2.0,5.6,0],[-56,56,-1.8,6.0,0],[-48,60,-1.6,6.2,1],[-40,62,-1.4,6.4,0],[-32,62,-1.2,6.4,0],[-24,60,-1.0,6.2,0],[-16,56,-.8,6.0,1],[-8,50,-.6,5.6,0],[0,44,-.4,5.2,0]];
  T.forEach(([a0,len,bend,r,gold],k)=>tail(45,29+oy,a0,len,bend,r,gold,k>0));
  // a leg: a smooth curve through its joints, thick at the top and fine at the paw, the lower part in an ink sock
  const limb=(J,r0,r1,col,sock)=>{ const C=[];
    for(let i=0;i<J.length-1;i++){ const p0=J[Math.max(0,i-1)], p1=J[i], p2=J[i+1], p3=J[Math.min(J.length-1,i+2)];
      for(let k=0;k<8;k++){ const u=k/8, u2=u*u, u3=u2*u, f=(a,b,c,d)=>.5*(2*b+(-a+c)*u+(2*a-5*b+4*c-d)*u2+(-a+3*b-3*c+d)*u3); C.push([f(p0[0],p1[0],p2[0],p3[0]),f(p0[1],p1[1],p2[1],p3[1])]); } }
    C.push(J[J.length-1]);
    C.forEach(([x,y],i)=>{ const t=i/(C.length-1); P.cap(x,y+oy,x,y+oy,r0+(r1-r0)*Math.pow(t,.7), t>.68?sock:col); });
    const f=C[C.length-1], d=C[C.length-3]; P.ell(f[0]-.8+(f[0]-d[0])*.3,f[1]+oy+.2,1.8,1.1,sock); };
  // walking as in the reference: far foreleg planted, far hind leg pushing off behind
  limb([[25,33],[24.5,40],[25.5,46.5],[24.8,51]],2.3,1.1,Sh,G2);
  limb([[42,33],[44.5,39],[48.5,44.5],[48,50.5]],3,1.1,Sh,G2);
  // the body: a soft full barrel, a round haunch, a deep chest
  P.ell(32,31+oy,9.6,5.2,Wt); P.ell(39.5,31+oy,6.2,6,Wt); P.ell(24,30+oy,5.4,6,Wt); P.ell(32,34.8+oy,7,1.3,Cr);
  // near hind leg under her: a full thigh, the knee forward, the hock back, then down to the paw
  P.ell(40,34.5+oy,5,5.6,Wt);
  limb([[39.5,35],[37,40.5],[39.8,45.5],[38.6,51]],3.3,1.2,Wt,Ik);
  // near foreleg raised mid-step: the elbow back, the forearm reaching forward, the paw hanging loose from the wrist
  limb([[22.5,33],[21.5,38.5],[17.5,41],[15.2,44.8]],2.6,1.2,Wt,Ik);
  // a thick neck and a fluffy ruff spilling down the chest
  P.cap(23,28+oy,17,20+oy,4,Wt);
  P.poly([[21,23+oy],[16,29+oy],[18,29+oy],[16.5,32+oy],[19,31+oy],[18.5,35+oy],[22,32+oy],[24,34+oy]],Wt); P.set(18,30+oy,Cr); P.set(19,33+oy,Cr); P.set(20,31+oy,Cr);
  // the head: rounder, with a shorter muzzle and fluffy cheeks
  P.ell(15.5,18+oy,5.2,4.4,Wt); P.poly([[12,16.5+oy],[6.5,19.5+oy],[7,21.5+oy],[13,22+oy]],Wt);
  P.poly([[17,21+oy],[13,24+oy],[16,23.5+oy],[15,26+oy],[19,23+oy]],Wt);
  P.set(6,19+oy,Dk); P.set(6,20+oy,Dk); P.set(7,19+oy,Dk); P.line(8,21+oy,11,21+oy,Sh);
  // ears: tall, black at the tip, red within
  P.poly([[12.5,15+oy],[14,5+oy],[17.5,14.5+oy]],Wt); P.poly([[14,13.5+oy],[14.5,8+oy],[16.3,13.5+oy]],Rd); P.set(14,5+oy,Ik); P.set(14,6+oy,Ik); P.set(14,7+oy,Ik); P.set(15,7+oy,Ik);
  P.poly([[17.5,15+oy],[20.5,6+oy],[21,16.5+oy]],Cr); P.set(20,6+oy,Ik); P.set(20,7+oy,Ik); P.set(21,7+oy,Ik); P.set(20,8+oy,Ik);
  // the eye: narrow, red-lined, drawn out toward the ear
  P.set(11,17+oy,Dk); P.set(12,17+oy,Dk); P.set(13,17+oy,Dk); P.set(12,18+oy,Rd); P.set(13,18+oy,Rd); P.set(14,17+oy,Rd); P.set(15,16+oy,Rd);
  // red flame swirls: brow, shoulder, haunch
  P.set(16,14+oy,Rd); P.set(16,13+oy,Rd); P.set(17,14+oy,Rd);
  P.set(25,28+oy,Rd); P.set(26,27+oy,Rd); P.set(26,29+oy,Rd); P.set(27,28+oy,Gd);
  P.set(40,29+oy,Rd); P.set(41,28+oy,Rd); P.set(41,30+oy,Rd); P.set(42,29+oy,Gd); })); };

/* ---------- the night: she kept the mirror; you see her at the stream with it (seen through your tent flap) ---------- */
C2L.nightCG=function(){ MJ.dark(false); C2L.nightOn=true;
  PixCG.open({ink:(g,W,H,R)=>{ Land.paper(g,W,H,R,'#c4c8d0'); Land.sky(g,W,H,['rgba(8,12,26,.95)','rgba(22,28,48,.88)','rgba(44,50,66,.72)']);
      Land.mist(g,W,H,H*.35,H*.2,.3); for(let i=0;i<7;i++) Land.pine(g,W*(.06+i*.15),H*(.6+R()*.05),H*(.3+R()*.12),R,.4);
      Land.ground(g,W,H,H*.66,.75,'#141820'); g.fillStyle='rgba(60,80,110,.55)'; g.beginPath(); g.moveTo(0,H*.8); g.quadraticCurveTo(W*.5,H*.72,W,H*.78); g.lineTo(W,H*.86); g.quadraticCurveTo(W*.5,H*.8,0,H*.9); g.fill(); },
    cast:[{look:LOOK_XIE, x:.5, y:.8, pose:'kneel', face:1, mood:'sad', s:.9}], title:'镜中人', small:'第二章 · 第四幕', seed:5151 });
  const c=PixCG.cur; c.front=(g,W,H,fp,t)=>{
    const mx=W*.5+fp*14, my=H*.8-fp*16; const gl=g.createRadialGradient(mx,my,0,mx,my,fp*30); gl.addColorStop(0,'rgba(190,220,255,.45)'); gl.addColorStop(1,'rgba(190,220,255,0)'); g.fillStyle=gl; g.fillRect(mx-fp*30,my-fp*30,fp*60,fp*60);
    C2C.bagua(g,mx,my,fp*5,t,true);
    g.font=`${Math.round(H*.04)}px "Ma Shan Zheng",KaiTi,serif`; g.textAlign='center';
    for(let i=0;i<7;i++){ const u=(t*.12+i/7)%1, w=['狐媚','靠脸','一路睡上来的','妖女','装清高','祸水','不检点'][i]; g.fillStyle=`rgba(220,226,240,${Math.sin(u*Math.PI)*.7})`; g.fillText(w,mx+Math.sin(t*.7+i*1.7)*W*.18,my-u*H*.45); }
    for(const s of [-1,1]){ const x0=s<0?0:W, gr=g.createLinearGradient(x0,0,W/2,0); gr.addColorStop(0,'rgba(30,22,16,.98)'); gr.addColorStop(.6,'rgba(70,54,36,.9)'); gr.addColorStop(1,'rgba(70,54,36,0)');
      g.fillStyle=gr; g.beginPath(); g.moveTo(x0,0); g.lineTo(W/2+s*W*.24,0); g.quadraticCurveTo(W/2+s*W*.32,H*.5, W/2+s*W*.4,H); g.lineTo(x0,H); g.closePath(); g.fill(); } }; };
C2X.night=[
  {run:()=>{ if(count(S,'c2_bagua')) addItem('c2_bagua',-count(S,'c2_bagua')); }},     // (from an older beta, when the mirror was handed to you at the sealing)
  ['旁白','这一夜，雾比哪一天都浓。营地四周白茫茫的，连来时的路都看不见了。'],
  ['旁白','半夜，你被一阵很轻的声音吵醒，像是有人在说话，又像是在哭。'],
  {run:()=>C2L.nightCG()},
  ['旁白','你掀开帐篷的一角。溪边跪着一个人——是大师姐。'],
  ['旁白','她手里捧着那面八卦镜。镜面亮着，青白的光照在她脸上。'],
  ['谢霁月','（很小声）……不是。……不是的。'],
  ['旁白','镜子里飘出一行一行的字，像烟一样往上升——「狐媚」「靠脸」「一路睡上来的」……'],
  ['旁白','她伸手去捂，字从她指缝里漏出来，越飘越多。'],
  ['旁白','你想出去叫她。可帐篷外的雾忽然涌了进来，眼前一片白。'],
  {run:()=>{ C2L.nightOn=false; PixCG.close(); MJ.dark(true); }},
  ['旁白','等你回过神，你已经躺回了铺上。溪边的声音，不见了。']];

/* ---------- the lake is the mirror's light; she holds it on the island ---------- */
{ const isl=C2X.island; C2X.island=()=>{ const st=isl(); const i=st.findIndex(x=>Array.isArray(x)&&/长发垂进了湖里/.test(x[1]));
    st.splice(i+1,0,['旁白','她手里捧着那面八卦镜。镜面上的光，和这片湖的光，一模一样。'],['我','（这片湖……是镜子照出来的？）']); return st; }; }
{ const _l=C2X.lakeCG; C2X.lakeCG=function(){ _l(); const c=PixCG.cur, f=c.front; c.front=(g,W,H,fp,t)=>{ f(g,W,H,fp,t); if(!C2X.risen) C2C.bagua(g,W*.42+fp*11,H*.6-fp*12,fp*2.6,t,true); }; }; }

/* ---------- 大师姐's three memories, as pictures ---------- */
C2L.LOOK_SENIOR={g:'m',skin:1,hair:0,hairColor:0,style:'robe',cloth:2,face:'mid'};
C2L.echoCG=function(i){ const XIE_YOUNG=LOOK_XIE, inks=[
    (g,W,H,R)=>{ Land.paper(g,W,H,R,'#e6dcc4'); Land.sky(g,W,H,['rgba(246,236,210,.9)','rgba(236,222,196,.5)','rgba(230,222,206,.2)']); Land.peaks(g,W,H,R,{y:H*.46,amp:H*.22,n:5,a:.4}); Land.mist(g,W,H,H*.5,H*.14,.4);
      g.fillStyle='rgba(40,30,24,.85)'; g.fillRect(W*.18,H*.36,W*.02,H*.42); g.fillRect(W*.8,H*.36,W*.02,H*.42); g.fillRect(W*.15,H*.36,W*.7,H*.035); Land.roof(g,W*.5,H*.36,W*.76,H*.06,.85);
      g.fillStyle='rgba(150,30,24,.85)'; g.fillRect(W*.44,H*.4,W*.12,H*.04); g.fillStyle='#f6eedc'; g.font=`${H*.028}px "Ma Shan Zheng",KaiTi,serif`; g.textAlign='center'; g.fillText('山门',W*.5,H*.43);
      for(let k=0;k<5;k++){ g.fillStyle=`rgba(${150-k*8},${140-k*8},${126-k*8},.95)`; g.fillRect(W*(.3-k*.03),H*(.76+k*.04),W*(.4+k*.06),H*.04); }
      g.fillStyle='rgba(120,116,108,.95)'; g.fillRect(W*.6,H*.56,W*.05,H*.2); },
    (g,W,H,R)=>{ Land.paper(g,W,H,R,'#a08a70'); g.fillStyle='rgba(60,40,26,.92)'; g.fillRect(0,0,W,H); g.fillStyle='rgba(84,58,38,.9)'; for(let x=0;x<W;x+=W/9) g.fillRect(x,0,W*.012,H*.8);
      g.fillStyle='rgba(246,220,160,.85)'; g.fillRect(W*.7,H*.2,W*.16,H*.2); g.strokeStyle='rgba(60,40,26,.9)'; g.lineWidth=W*.006; for(let k=1;k<4;k++){ g.beginPath(); g.moveTo(W*(.7+k*.04),H*.2); g.lineTo(W*(.7+k*.04),H*.4); g.stroke(); }
      Land.lantern(g,W*.25,H*.3,Math.min(W,H)*.03,5); Land.ground(g,W,H,H*.8,.8,'#3a2618'); },
    (g,W,H,R)=>{ Land.paper(g,W,H,R,'#e8dcc0'); Land.sky(g,W,H,['rgba(244,226,196,.9)','rgba(236,214,180,.5)','rgba(230,220,200,.2)']); Land.peaks(g,W,H,R,{y:H*.44,amp:H*.18,n:5,a:.35});
      for(const x of [.15,.35,.65,.85]){ g.fillStyle='rgba(40,30,24,.85)'; g.fillRect(W*x,H*.2,W*.008,H*.4); g.fillStyle='rgba(176,40,30,.85)'; g.fillRect(W*x+W*.008,H*.22,W*.05,H*.12); }
      g.fillStyle='rgba(120,90,60,.95)'; g.fillRect(W*.2,H*.66,W*.6,H*.06); g.fillStyle='rgba(90,66,44,.95)'; g.fillRect(W*.2,H*.72,W*.6,H*.04);
      Land.ground(g,W,H,H*.8,.5,'#8a6a46'); }];
  const casts=[
    [{look:XIE_YOUNG, x:.56, y:.78, pose:'stand', face:1, s:.62},{look:C2V[0], x:.74, y:.78, pose:'stand', face:-1, s:.75},{look:C2V[1], x:.22, y:.9, pose:'point', face:1, s:.75},{look:C2V[3], x:.32, y:.9, pose:'stand', face:1, s:.75}],
    [{look:XIE_YOUNG, x:.38, y:.84, pose:'sword', prop:'sword', face:1, s:.85},{look:C2L.LOOK_SENIOR, x:.58, y:.84, pose:'reach', face:-1, s:.85}],
    [{look:XIE_YOUNG, x:.5, y:.66, pose:'hold', prop:'jade', face:1, s:.78},{look:C2V[0], x:.16, y:.95, pose:'point', face:1, s:.7, alpha:.75},{look:C2V[2], x:.3, y:.96, pose:'stand', face:1, s:.7, alpha:.75},{look:C2V[4], x:.7, y:.96, pose:'stand', face:-1, s:.7, alpha:.75},{look:C2V[3], x:.84, y:.95, pose:'point', face:-1, s:.7, alpha:.75}]];
  const titles=['入门那年','那位师兄','宗门大比'], words=[['看脸','靠脸'],['勾引','恼羞成怒'],['狐媚子','靠的什么']];
  PixCG.open({ink:inks[i], cast:casts[i], title:titles[i], small:'水中的往事', seed:6100+i});
  const c=PixCG.cur; c.gy=.84;
  c.front=(g,W,H,fp,t)=>{
    if(i===0){ const gx=W*.625, gy=H*.6; const gl=g.createRadialGradient(gx,gy,0,gx,gy,W*.12); gl.addColorStop(0,'rgba(255,255,240,.8)'); gl.addColorStop(1,'rgba(255,255,240,0)'); g.fillStyle=gl; g.fillRect(gx-W*.12,gy-W*.12,W*.24,W*.24); }
    g.font=`${Math.round(H*.04)}px "Ma Shan Zheng",KaiTi,serif`; g.textAlign='center';
    for(let k=0;k<4;k++){ const u=(t*.1+k/4)%1; g.fillStyle=`rgba(120,40,40,${Math.sin(u*Math.PI)*.7})`; g.fillText(words[i][k%2],W*(.2+k*.2),H*(.5-u*.25)); }
    // the edge of the water: the picture ripples, it is a reflection
    const vg=g.createRadialGradient(W/2,H*.55,Math.min(W,H)*.3,W/2,H*.55,Math.max(W,H)*.7); vg.addColorStop(0,'rgba(20,30,50,0)'); vg.addColorStop(1,'rgba(20,30,50,.6)'); g.fillStyle=vg; g.fillRect(0,0,W,H);
    g.strokeStyle='rgba(200,214,240,.18)'; g.lineWidth=Math.max(1,fp*.5); for(let k=0;k<5;k++){ const y=H*(.1+k*.2)+Math.sin(t*1.3+k)*fp*2; g.beginPath(); g.moveTo(0,y); g.quadraticCurveTo(W/2,y+fp*3*Math.sin(t+k),W,y); g.stroke(); } };
};
{ const _a=Dungeon.act; Dungeon.act=function(o){
    if(o.act==='c2echo'){ S.c2x=S.c2x||{echo:[]}; const seen=S.c2x.echo.includes(o.ei);
      UI.say([{run:()=>C2L.echoCG(o.ei)}, ...C2X.echoes[o.ei], {run:()=>{ PixCG.close(); if(!seen){ S.c2x.echo.push(o.ei); if(S.c2x.echo.length===3){ enterMap('mj_lake',S.x,S.y); UI.toast('湖心的雾散开了'); } save(); UI.hud(); } }}]); return true; }
    return _a.call(Dungeon,o); }; }

/* ---------- the ending at the lake: 九尾狐's own story, what 大师姐 never said, what you say to her, and her letting it go ---------- */
C2X.fox=()=>[
  {run:()=>C2X.foxCG()},
  ['旁白','一团雪白的狐火落在湖面上，化作一只九尾的白狐。九条尾巴在她身后展开，像一把雪做的扇子，把整片湖都照亮了。'],
  ['九尾狐', count(S,'hu_wei')?'小修士，又见面了。你带着的尾毛告诉我，这里有人在哭。':'小修士，又见面了。青丘的风告诉我，这里有人在哭。'],
  ['心魔','九尾狐？呵……你也是来看笑话的。人人都说你会魅惑人心，会吃人——你和她，不过是一样的东西。'],
  ['九尾狐','是啊。人人都说。'],
  ['九尾狐','小修士，你还记得吗？我说过，从前有个人类的小姑娘，常来狐祠给我放野山茶。'],
  ['九尾狐','她长大以后，嫁了人。有一年，她男人病了，整夜整夜地说胡话。村里人说，是狐狸精迷了他的魂。'],
  ['九尾狐','那天夜里，她举着火把，带着全村的人来烧我的狐祠。'],
  ['九尾狐','我连她男人长什么样子，都不知道。'],
  ['谢霁月','……'],
  ['九尾狐','我恨过她，恨了很多年。后来不恨了——不是原谅她，是我不想把这三百年，全都拿去恨一个人。'],
  ['九尾狐','他们骂的那只狐狸，是他们心里捏出来的。我可以不去当她。'],
  ['谢霁月','（握剑的手松了一点）……可是我呢？'],
  ['谢霁月','我十三岁进山门，他们说我靠脸。我把剑练到同辈第一，他们说我靠脸。我一句话都不跟人说，他们说我装清高，背地里还是靠脸。'],
  ['谢霁月','我以为只要不笑，不说话，就没有人能说我什么。我把自己弄得很冷，冷到连我自己都快不认得了。'],
  ['谢霁月','可他们还是说。'],
  ['心魔','所以，别挣扎了。'],
  ['心魔','做他们说的那个人吧。反正他们早就信了。至少……那样不会这么累。'],
  ['旁白','大师姐低下头。湖面上，那些字又一个一个地浮了起来。'],
  {choice:'你想对大师姐说——', options:[
    ...(S.flags.c2_defend_xie?[{text:'那天在宗门，我问过他们是不是亲眼看见了', go:'c2l_r_def'}]:[]),
    {text:'我看见你的剑了。那不是靠脸练出来的', go:'c2l_r_sword'},
    {text:'你不用证明给任何人看', go:'c2l_r_free'}]}];
Object.defineProperty(SCRIPTS,'c2x_fox',{configurable:true, get(){ return C2X.fox(); }});
Object.assign(SCRIPTS, {
  c2l_r_def:[['我','那天在宗门，他们那样说你。我问他们，是不是亲眼看见了。'],['谢霁月','（她愣了一下）……我听见了。'],['谢霁月','那是第一次，有人替我问了这一句。'],{love:{xie:60}},{go:'c2l_r_end'}],
  c2l_r_sword:[['我','大师姐，我看见你的剑了。在白羽崖，你一剑挡在我前面。'],['我','那不是靠脸练出来的。'],['谢霁月','……'],{love:{xie:40}},{go:'c2l_r_end'}],
  c2l_r_free:[['我','你不用证明给任何人看。累了，就歇一会儿。'],['谢霁月','（她看了你一眼）……你和那只狐狸，说的一样。'],{love:{xie:30}},{go:'c2l_r_end'}],
  c2l_r_end:[
    ['旁白','大师姐慢慢站了起来。她转过身，看着那个和她一模一样的影子。'],
    ['谢霁月','你说的那些话，我听了太多遍。听到最后，连我自己都快信了。'],
    ['谢霁月','你也是我。是我一个人的时候，偷偷信了他们的那一部分我。'],
    ['谢霁月','可你不是全部的我。'],
    ['旁白','她放下剑，伸手碰了碰那个影子的脸。'],
    ['谢霁月','……回去吧。我不怪你。'],
    {run:()=>{ C2X.fade=1; }},
    ['旁白','心魔看着她，红色的眼睛一点一点暗了下去。它张了张嘴，最后什么也没说，化成一捧水，落回了湖里。'],
    ['旁白','湖面上漂着的那些字，一个接一个，沉了下去。'],
    ['九尾狐','这面八卦镜，照得出真相，也照得出人心里最怕的那一句话。'],
    ['九尾狐','你们被困在这秘境里，雾封了来路，穷奇的戾气又没散干净。镜子醒了——你们那位大师兄，大概也是被它照着，一步一步走进雾里的。'],
    ['谢霁月','（脸色一白）……所以，它会一个一个地照下去。'],
    ['九尾狐','所以，别再让人一个人看它。'],
    {run:()=>C2X.smile()},
    ['旁白','大师姐低头看着湖水里自己的倒影。过了很久，她的嘴角轻轻弯了一下。'],
    ['旁白','那是你第一次看见她笑。'],
    ['九尾狐','（尾巴尖扫过大师姐的头顶）这孩子，笑起来比我还好看。'],
    ['谢霁月','（脸一下子红了）……'],
    ['九尾狐','我该回青丘了。小修士，饕餮已经醒了。你们身边的人，要多留个心。'],
    {run:()=>{ C2X.foxGone=1; }},
    ['旁白','狐火一闪，白狐不见了。湖面上只剩一轮月亮。'],
    {run:()=>{ PixCG.close(); C2X.cgOn=false; }},
    ['谢霁月','{称}。……谢谢你。'],
    ['谢霁月','这面镜子，你拿着。别再让任何人一个人看它——包括我。'],
    {give:{c2_bagua:1}},
    {flag:'c2_xin_done'}, {love:{xie:80}},
    ['谢霁月','……回营地吧。满仓一个人，该等急了。']],
});
// the fox stands on the lake facing you now (the new picture is drawn facing front)
{ const _f=C2X.foxCG; C2X.foxCG=function(){ _f(); const c=PixCG.cur; c.stage=(g,W,H,fp,t)=>{ if(C2X.foxGone) return; const fox=FineArt.fox(), s=Math.max(1,Math.floor(Math.min(W*.6/fox.width, H*.42/fox.height))), w=fox.width*s, h=fox.height*s, x=W-w*.52, y=H*.7+Math.sin(t*1.2)*fp*.6;   // whole pixels, so she stays crisp
      const gl=g.createRadialGradient(x,y-h*.5,0,x,y-h*.5,w*.9); gl.addColorStop(0,'rgba(200,220,255,.35)'); gl.addColorStop(1,'rgba(200,220,255,0)'); g.fillStyle=gl; g.fillRect(x-w,y-h*1.4,w*2,h*1.8);
      g.save(); g.imageSmoothingEnabled=false; g.drawImage(fox,x-w/2,y-h,w,h); g.restore();
      for(let k=0;k<7;k++){ const u=((t*.2+k/7)%1), fx=x+Math.sin(t+k*2)*w*.6, fy=y-h*.3-u*h, r=fp*(1.2+Math.sin(t*3+k)*.3); const fg=g.createRadialGradient(fx,fy,0,fx,fy,r*4); fg.addColorStop(0,`rgba(150,200,255,${.8*(1-u)})`); fg.addColorStop(1,'rgba(150,200,255,0)'); g.fillStyle=fg; g.fillRect(fx-r*4,fy-r*4,r*8,r*8); }
      g.fillStyle='rgba(220,236,255,.25)'; g.beginPath(); g.ellipse(x,y+fp,w*.4,fp*2.5,0,0,7); g.fill(); }; }; }
// back at camp: the mirror shows who is next
{ const _g=C2X.gone; C2X.gone=()=>{ const st=_g(); const i=st.findIndex(x=>Array.isArray(x)&&/拖着一道长长的/.test(x[1]));
    st.splice(i+1,0,['旁白','行囊里的八卦镜忽然烫了一下。你拿出来，镜面上映出一个瘦小的背影，正一步一步往南走。'],['谢霁月','……是满仓。镜子照到他了。']); return st; }; }
