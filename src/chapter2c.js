/* ============================================================
   山海问道 · 第二章 第三幕「白羽崖」 — the trail of white feathers leads north out of the 雾林 to a cliff. On top lies 大师兄's
   八卦镜; it shows what happened in 安平村 (the wolves were wronged, and he knew), and ends on a boy raised by a wolf.
   Then 穷奇 comes down: it ate 陆正衡 because everyone called him good — and his heart was bitter. Three phases: 穷奇 alone,
   his head pushes up out of its crown (明正典刑 light pillars, 清誉护体 shield, which the 八卦镜 breaks), and the two heads
   quarrel while 谢霁月 joins in. 穷奇 is sealed back into the 风穴 with him inside it, the two of them arguing forever.
   ============================================================ */
Object.assign(SPR, {
  mj_thorn:['................','..G...G....G....','.GgG.GgG..GgG...','..GgGGgGGGgG.G..','.G.GgggggggGGgG.','..GGgNgggNggGG..','.GgggggNggggggG.','GgGNggggggNgggGG','.GggggNggggggGg.','GGgNgggggNgggGG.','.GggggggggggNgG.','..GGgNggggggGG..','...GGGGGGGGGG...','....N..N..N.....'],
  mj_whitefeather:['.....w.','..wwwwe','wwe....'],
  c2_baguastand:['................','.....yyyyyy.....','....yYlxxlYy....','....ylxxxxly....','....yYlxxlYy....','.....yyyyyy.....','...eeeeeeeeee...','....EeeeeeeE....','.....eeeeee.....','.....eEeeEe.....','.....eeeeee.....','....eeeeeeee....','.w.EEEEEEEEEE.w.','ww............ww'],
  c2_standempty:['................','................','................','................','................','................','...eeeeeeeeee...','....EeeeeeeE....','.....eeeeee.....','.....eEeeEe.....','.....eeeeee.....','....eeeeeeee....','...EEEEEEEEEE...'],
  c2_token:['................','................','................','................','......kk........','.....qqqq.......','....qqkqqq......','....qkkkqq......','....qqkqwq......','....qkkkkq......','.....qqqq.......','..w..........w..','.ww..r......ww..'],
  i_bagua:['...yyyy...','..yYkkYy..','.yk.kk.ky.','yYk.ll.kYy','yk.lxxl.ky','yk.lxxl.ky','yYk.ll.kYy','.yk.kk.ky.','..yYkkYy..','...yyyy...'],
  i_lutoken:['...kk...','..qqqq..','.qqkqqq.','.qkkkqq.','.qqkqwq.','.qkkkkq.','..qqqq..'],
});
Object.assign(ITEMS, {
  c2_bagua:{name:'八卦镜', icon:'i_bagua', quest:true, keep:true, desc:'大师兄从不离身的八卦镜。照得出往事，照得出真相——却分不开纠缠在一起的东西。'},
  c2_lutoken:{name:'「正」字玉牌', icon:'i_lutoken', quest:true, keep:true, desc:'大师兄腰间的玉牌，裂了一道缝。背面刻着一行小字：「名正，则言顺。」'},
});
// the wolves in the mirror and the boy in a wolf's pelt: painted on the fine grid, the same pixel size as the CG chibis
const FineArt = {
  cache:{},
  // a small painter: shapes into a pixel list, then one dark outline round everything
  paint(W,H,fn){ const px=new Array(W*H).fill(null), set=(x,y,c)=>{ x=Math.round(x); y=Math.round(y); if(x>=0&&y>=0&&x<W&&y<H&&c) px[y*W+x]=c; };
    const P={ set,
      rect(x,y,w,h,c){ for(let j=0;j<h;j++) for(let i=0;i<w;i++) set(x+i,y+j,c); },
      ell(cx,cy,rx,ry,c){ for(let y=Math.floor(cy-ry);y<=cy+ry;y++) for(let x=Math.floor(cx-rx);x<=cx+rx;x++) if(((x+.5-cx)/rx)**2+((y+.5-cy)/ry)**2<=1) set(x,y,c); },
      cap(ax,ay,bx,by,r,c){ for(let y=Math.floor(Math.min(ay,by)-r-1);y<=Math.max(ay,by)+r+1;y++) for(let x=Math.floor(Math.min(ax,bx)-r-1);x<=Math.max(ax,bx)+r+1;x++){ const vx=bx-ax, vy=by-ay, L=vx*vx+vy*vy||1, u=Math.max(0,Math.min(1,((x+.5-ax)*vx+(y+.5-ay)*vy)/L)), dx=x+.5-(ax+u*vx), dy=y+.5-(ay+u*vy); if(dx*dx+dy*dy<=r*r) set(x,y,c); } },
      poly(pts,c){ const xs=pts.map(p=>p[0]), ys=pts.map(p=>p[1]); for(let y=Math.floor(Math.min(...ys));y<=Math.max(...ys);y++) for(let x=Math.floor(Math.min(...xs));x<=Math.max(...xs);x++){ let inside=false;
        for(let i=0,j=pts.length-1;i<pts.length;j=i++){ const [xi,yi]=pts[i],[xj,yj]=pts[j]; if(((yi>y+.5)!==(yj>y+.5))&&(x+.5<(xj-xi)*(y+.5-yi)/(yj-yi)+xi)) inside=!inside; } if(inside) set(x,y,c); } },
      line(ax,ay,bx,by,c){ const n=Math.max(Math.abs(bx-ax),Math.abs(by-ay))||1; for(let i=0;i<=n;i++) set(ax+(bx-ax)*i/n, ay+(by-ay)*i/n, c); } };
    fn(P);
    const c=document.createElement('canvas'); c.width=W; c.height=H; const g=c.getContext('2d'), on=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&px[y*W+x];
    g.fillStyle='#2a1e1a'; for(let y=0;y<H;y++) for(let x=0;x<W;x++){ if(on(x,y)) continue; if(on(x-1,y)||on(x+1,y)||on(x,y-1)||on(x,y+1)) g.fillRect(x,y,1,1); }
    for(let y=0;y<H;y++) for(let x=0;x<W;x++){ const col=px[y*W+x]; if(col){ g.fillStyle=col; g.fillRect(x,y,1,1); } }
    let b=H-1; while(b>0&&!px.slice(b*W,b*W+W).some(Boolean)) b--; c.bottom=b+2; c.fine=true; return c; },
  // grey wolf fur: back, body, belly, legs in shadow
  F:{back:'#5f5b55', fur:'#8c877e', lit:'#a9a398', belly:'#cfc8ba', dark:'#4a4640', paw:'#3a3632', eye:'#e8b84a', nose:'#2a2220', tooth:'#f6f2e8'},
  wolf(){ return FineArt.cache.wolf||(FineArt.cache.wolf=FineArt.paint(66,36,P=>{ const F=FineArt.F;
    // bushy tail, held low
    P.cap(12,15,4,25,3.2,F.fur); P.cap(6,22,3,27,2.4,F.belly);
    // far legs (in shadow), then the body, then the near legs
    P.cap(19,21,17,32,2.3,F.dark); P.cap(41,21,43,32,2.3,F.dark); P.rect(15,32,4,2,F.paw); P.rect(42,32,4,2,F.paw);
    P.ell(29,17,16,7.5,F.fur); P.ell(28,12.5,15,3.5,F.back); P.ell(31,21.5,12,3,F.belly);
    for(let x=16;x<42;x+=4) P.set(x,11+(x%3),F.dark);
    P.cap(23,21,22,33,2.5,F.lit); P.cap(44,20,46,33,2.5,F.lit); P.rect(20,33,5,2,F.paw); P.rect(45,33,5,2,F.paw);
    // neck ruff, head, snout, ears; teeth bared
    P.poly([[39,10],[48,6],[52,15],[43,22]],F.fur); P.poly([[42,14],[48,12],[47,22],[43,22]],F.belly);
    P.ell(51,10,6.5,5.5,F.fur); P.poly([[54,8],[64,11],[64,14],[54,15]],F.lit); P.rect(55,14,8,1,F.belly);
    P.set(64,11,F.nose); P.set(63,11,F.nose); P.line(56,14,63,14,F.nose); P.set(58,15,F.tooth); P.set(61,15,F.tooth);
    P.poly([[46,7],[47,0],[51,5]],F.back); P.poly([[51,5],[54,0],[56,7]],F.back); P.set(48,3,F.belly); P.set(54,3,F.belly);
    P.set(54,9,F.eye); P.set(55,9,F.nose); P.line(52,7,56,8,F.dark); })); },
  // lying on its side: legs out, head down, eye shut
  wolfdown(){ return FineArt.cache.down||(FineArt.cache.down=FineArt.paint(68,22,P=>{ const F=FineArt.F;
    P.cap(12,11,3,15,2.8,F.fur); P.cap(5,14,2,16,2,F.belly);
    P.cap(22,15,17,20,2,F.dark); P.cap(42,15,47,20,2,F.dark);
    P.ell(31,11,18,5.5,F.fur); P.ell(31,7.5,17,2.5,F.back); P.ell(32,14.5,13,2.2,F.belly);
    P.cap(27,15,24,20,2.2,F.lit); P.cap(38,15,40,21,2.2,F.lit);
    P.ell(53,13,6.5,4.5,F.fur); P.poly([[57,11],[66,13],[66,16],[57,17]],F.lit); P.set(66,13,F.nose);
    P.poly([[49,9],[50,4],[53,9]],F.back); P.line(54,12,57,12,F.dark); })); },
  // a cub, sitting
  cub(){ return FineArt.cache.cub||(FineArt.cache.cub=FineArt.paint(30,22,P=>{ const F=FineArt.F;
    P.cap(6,16,2,19,2,F.fur); P.ell(13,14,7,5.5,F.lit); P.ell(14,17,5,2.5,F.belly); P.cap(12,17,12,20,1.6,F.fur); P.cap(17,17,18,20,1.6,F.fur);
    P.ell(20,8,5.5,5,F.lit); P.poly([[23,8],[28,9],[28,11],[23,12]],F.belly); P.set(28,9,F.nose);
    P.poly([[16,5],[17,0],[19,4]],F.fur); P.poly([[20,4],[22,0],[24,5]],F.fur); P.set(23,7,F.nose); })); },
  // the boy: small, crouching in the grass, a wolf's pelt over his head and back (the wolf's own head as a hood)
  wolfboy(){ if(FineArt.cache.boy) return FineArt.cache.boy;
    const base=cgChibi(LOOK_WOLFBOY,'crouch','dim',null,null,false), W=base.width, H=base.height, d=base.getContext('2d').getImageData(0,0,W,H).data;
    return FineArt.cache.boy=FineArt.paint(W,H,P=>{ const F=FineArt.F;
      for(let y=0;y<H;y++) for(let x=0;x<W;x++){ const i=(y*W+x)*4; if(d[i+3]) P.set(x,y,'#'+[d[i],d[i+1],d[i+2]].map(v=>v.toString(16).padStart(2,'0')).join('')); }
      const cx=2*(PCX+7), cy=2*PCY+12;
      // the pelt down his back, its tail trailing behind
      P.poly([[cx-10,cy-4],[cx-2,cy+8],[cx-4,cy+26],[cx-15,cy+30],[cx-17,cy+12]],F.fur); P.poly([[cx-13,cy+4],[cx-8,cy+9],[cx-9,cy+24],[cx-14,cy+26]],F.back);
      P.cap(cx-15,cy+28,cx-24,cy+33,2.4,F.fur); P.cap(cx-22,cy+32,cx-26,cy+34,1.8,F.belly);
      // the hood: the wolf's head over his hair, ears up, its snout over his brow
      P.ell(cx-1,cy-7,13.5,7,F.fur); P.ell(cx-2,cy-9,11,4,F.back);
      P.poly([[cx-10,cy-11],[cx-8,cy-19],[cx-4,cy-12]],F.back); P.poly([[cx+1,cy-13],[cx+4,cy-20],[cx+7,cy-11]],F.back); P.set(cx-7,cy-15,F.belly); P.set(cx+4,cy-16,F.belly);
      P.poly([[cx+6,cy-9],[cx+16,cy-6],[cx+16,cy-3],[cx+6,cy-3]],F.lit); P.set(cx+16,cy-6,F.nose); P.set(cx+9,cy-7,F.dark);
      for(let x=cx-11;x<cx+10;x+=3) P.set(x,cy-1-(x%2),F.lit);         // ragged edge of the fur over his forehead
      // a forepaw of the pelt hanging over his shoulder
      P.cap(cx-4,cy+2,cx-1,cy+10,1.8,F.fur); P.rect(cx-2,cy+10,3,1,F.paw); }); },
};
const LOOK_WOLFBOY={g:'m',skin:3,hair:5,hairColor:0,style:'jin',cloth:5};
// the main cast keep their big eyes; the villagers each have a face of their own
const LOOK_LU_YOUNG={...LOOK_LU, cloth:1};
const C2V=[
  {g:'m',skin:1,hair:0,hairColor:3,style:'robe',cloth:5,face:'small',beard:'#ece8e0'},   // the old village head: white topknot and beard
  {g:'f',skin:2,hair:3,hairColor:1,style:'qun',cloth:3,face:'mid'},                       // a farmer's wife, hair in two buns
  {g:'m',skin:4,hair:1,hairColor:0,style:'jin',cloth:2,face:'mid'},                       // a big dark-skinned hunter
  {g:'m',skin:1,hair:5,hairColor:1,style:'jin',cloth:7,face:'small'},                     // a thin young man with a bob
  {g:'f',skin:2,hair:0,hairColor:3,style:'qun',cloth:5,face:'small'}];                    // an old woman, grey hair pinned up

/* ---------- the way north: the brambles at the top of the 雾林 were torn open by something with wings ---------- */
{ const m=MAPS.mj_wood, G=m.ground.map(r=>r.split(''));
  for(const [x,y] of [[13,0],[14,0],[13,1],[14,1]]) G[y][x]='=';
  m.ground=G.map(r=>r.join(''));
  m.exits.push({x:13,y:0,to:'mj_cliff',tx:9,ty:22},{x:14,y:0,to:'mj_cliff',tx:10,ty:22});
  m.objects.push({type:'mj_thorn', x:13, y:1, spr:'mj_thorn', act:'mjthorn', cond:s=>!s.flags.lu_gone},{type:'mj_thorn', x:14, y:1, spr:'mj_thorn', act:'mjthorn', cond:s=>!s.flags.lu_gone}); }

/* ---------- 白羽崖: drawn by code; 'r' is bare rock, 'C' is the drop into the fog ---------- */
{ const W=20, H=24, R=rng(919), G=[...Array(H)].map(()=>Array(W).fill('r'));
  for(let y=0;y<19;y++){ const l=1+(R()*2|0)+(y<3?2:0), r=1+(R()*2|0)+(y<3?2:0); for(let x=0;x<W;x++) if(x<l||x>=W-r) G[y][x]='C'; }
  for(let x=0;x<W;x++){ G[0][x]='C'; if(x<5||x>14) G[1][x]='C'; }
  for(let y=19;y<H;y++) for(let x=0;x<W;x++) G[y][x]=(x===0||x===W-1||y===H-1)?'W':'.';
  // the path up: from the wood, west along a ledge, back east, and onto the top
  for(let y=15;y<H;y++){ G[y][9]='='; G[y][10]='='; }
  for(let x=5;x<=10;x++) G[15][x]='='; for(let y=10;y<=15;y++) G[y][5]='='; for(let x=5;x<=13;x++) G[10][x]='='; for(let y=5;y<=10;y++) G[y][13]='=';
  for(let x=10;x<=13;x++) G[5][x]='=';
  for(const [x,y] of [[8,12],[15,13],[16,8],[7,7],[3,17],[16,17],[11,13],[3,11],[15,3]]) if(G[y][x]==='r') G[y][x]='W';
  for(const [x,y] of [[2,20],[6,21],[14,20],[17,21],[4,22],[13,22]]) G[y][x]=':';
  const objects=[
    {type:'c2_stand', x:10, y:3, spr:'c2_baguastand', act:'c2mirror', cond:s=>!s.flags.c2_mirror},
    {type:'boss', x:10, y:3, spr:'qiongqi', act:'c2qq', cond:s=>!!s.flags.c2_mirror&&!s.flags.c2_qq_sealed},
    {type:'c2_stand', x:10, y:3, spr:'c2_standempty', act:'c2stand', cond:s=>!!s.flags.c2_qq_sealed},
    {type:'c2_token', x:14, y:12, spr:'c2_token', act:'c2token', cond:s=>!s.flags.c2_token},
    {type:'npc', id:'xie', x:8, y:5, look:LOOK_XIE, name:'谢霁月', act:'talk', cond:s=>!!s.flags.c2_cliff_in},
    {type:'npc', id:'man', x:12, y:7, look:LOOK_MAN, name:'何满仓', act:'talk', cond:s=>!!s.flags.c2_cliff_in},
  ];
  for(const [x,y] of [[1,19],[3,20],[16,19],[18,20],[1,22],[18,22],[7,20],[12,21]]) objects.push({type:R()<.6?'pine':'tree', x, y});
  MAPS.mj_cliff={ name:'秘境 · 白羽崖', w:W, h:H, ground:G.map(r=>r.join('')), objects, exits:[{x:9,y:23,to:'mj_wood',tx:13,ty:1},{x:10,y:23,to:'mj_wood',tx:14,ty:1}] }; }

// the two new tiles
{ const _tc=tileCanvas; tileCanvas=function(ch,v,frame){ if(ch!=='r'&&ch!=='C') return _tc(ch,v,frame);
    const key=ch+v+(frame||0); if(TILEC[key]) return TILEC[key];
    const c=document.createElement('canvas'); c.width=c.height=TILE; const g=c.getContext('2d'), R=rng(ch.charCodeAt(0)*977+v*131);
    const px=(x,y,col)=>{ g.fillStyle=col; g.fillRect(x,y,1,1); };
    if(ch==='r'){ g.fillStyle='#8e8a80'; g.fillRect(0,0,16,16);
      for(let i=0;i<26;i++) px(R()*16|0,R()*16|0,R()<.5?'#9c988e':'#7f7b72');
      const cx=R()*12|0, cy=R()*12|0; for(let k=0;k<5;k++) px(cx+k,cy+((k*7)%3),'#66625a');           // a crack
      if(R()<.35){ const x=R()*13|0, y=R()*13|0; g.fillStyle='#a8a498'; g.fillRect(x,y,3,2); px(x,y+2,'#6e6a62'); px(x+1,y+2,'#6e6a62'); px(x+2,y+2,'#6e6a62'); }
      if(R()<.2) px(R()*15|0,R()*15|0,'#5f8a48'); }
    else { const gr=g.createLinearGradient(0,0,0,16); gr.addColorStop(0,'#3a404a'); gr.addColorStop(1,'#2a2f38'); g.fillStyle=gr; g.fillRect(0,0,16,16);
      for(let i=0;i<4;i++){ g.fillStyle='rgba(200,208,216,.12)'; g.fillRect(R()*10|0,R()*16|0,4+(R()*6|0),1); } }
    return TILEC[key]=c; }; }
{ const _em=enterMap; enterMap=function(id,x,y){ const r=_em(id,x,y); const m=RT.map;
    if(id==='mj_cliff') for(let yy=0;yy<m.h;yy++) for(let xx=0;xx<m.w;xx++) if(m.ground[yy][xx]==='C') RT.solid[yy][xx]=true;
    if(id==='mj_cliff'&&!S.flags.c2_cliff_in) setTimeout(()=>{ if(RT.mapId==='mj_cliff'&&!S.flags.c2_cliff_in) UI.say(C2C.arrive(), ()=>{ enterMap('mj_cliff',S.x,S.y); UI.hud(); }); },350);
    return r; }; }

/* ---------- ground details: a trail of white feathers, the lip of the cliff, wind ---------- */
const C2C_TRAIL={
  mj_wood:[[14,19,.2],[14,17,1.1],[13,15,2.4],[14,13,.7],[14,11,2],[13,9,.4],[14,7,1.6],[15,6,3],[12,4,.9],[13,2,2.2],[14,1,.5],[13,0,1.3]],
  mj_cliff:[[9,21,1],[10,18,2.1],[9,16,.3],[7,15,1.4],[5,13,2.6],[5,11,.8],[8,10,1.9],[11,10,.2],[13,8,1.2],[13,6,2.8],[11,5,.6],[9,4,1.7],[11,2,2.3],[7,3,.4],[12,4,1.1],[8,2,3]],
};
{ const _dg=Life.drawGround; Life.drawGround=function(g,ox,oy,T,Z){ _dg.call(Life,g,ox,oy,T,Z);
    if(!S||!S.flags.lu_gone) return; const tr=C2C_TRAIL[RT.mapId]; if(!tr) return;
    const sp=sprite('mj_whitefeather'), w=sp.width*Z, h=sp.height*Z;
    if(RT.mapId==='mj_cliff') for(let y=0;y<RT.map.h;y++) for(let x=0;x<RT.map.w;x++){ if(RT.map.ground[y][x]!=='C') continue;
      // the rock lip where the ground falls away
      const land=(a,b)=>a>=0&&b>=0&&a<RT.map.w&&b<RT.map.h&&RT.map.ground[b][a]!=='C';
      g.fillStyle='#55524c'; if(land(x,y-1)) g.fillRect(ox+x*T,oy+y*T,T,3*Z); if(land(x-1,y)) g.fillRect(ox+x*T,oy+y*T,2*Z,T); if(land(x+1,y)) g.fillRect(ox+(x+1)*T-2*Z,oy+y*T,2*Z,T);
      g.fillStyle='#6e6a62'; if(land(x,y-1)) g.fillRect(ox+x*T,oy+y*T,T,Z); }
    for(const [x,y,a] of tr){ const px=Math.round(ox+(x+.15+(a%1)*.5)*T), py=Math.round(oy+(y+.3+(a*.37%1)*.4)*T);
      g.save(); g.translate(px+w/2,py+h/2); g.rotate(a); g.drawImage(sp,-w/2,-h/2,w,h); g.restore();
      if(a>2){ g.fillStyle='#7a1e1a'; g.fillRect(px-2*Z,py+h,Z*2,Z); g.fillRect(px+w,py-Z,Z,Z); } } }; }
{ const _r=render; render=function(){ _r(); if(RT.mapId!=='mj_cliff'||!RT.map) return; const g=ctx, W=cv.width, H=cv.height;
    g.fillStyle='rgba(205,212,220,.16)'; g.fillRect(0,0,W,H);
    // wind: long pale streaks that blow across the cliff
    for(let i=0;i<14;i++){ const sp=.5+((i*37)%10)/10, y=((i*97)%100)/100*H, x=((RT.t*W*.35*sp+i*211)%(W*1.4))-W*.2, l=W*(.06+.05*sp);
      g.strokeStyle=`rgba(240,244,248,${.10+.12*sp})`; g.lineWidth=Math.max(1,RT.dpr*1.2); g.beginPath(); g.moveTo(x,y); g.quadraticCurveTo(x-l*.5,y-6,x-l,y+2); g.stroke(); }
    const vg=g.createRadialGradient(W/2,H/2,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.75); vg.addColorStop(0,'rgba(20,24,32,0)'); vg.addColorStop(1,'rgba(20,24,32,.45)'); g.fillStyle=vg; g.fillRect(0,0,W,H); }; }

/* ---------- the scenes ---------- */
const C2C = {
  arrive:()=>[
    ['旁白','雾林的尽头，荆棘丛被什么东西从中间撕开了。白色的羽毛挂在刺上，一路往北。'],
    ['旁白','雾散开的地方，是一面陡峭的石崖。崖壁上到处是爪痕，风里全是羽毛。'],
    ['何满仓','（缩着脖子）这、这地方……连根草都不长。'],
    ['谢霁月','白羽崖。我听师尊提过——穷奇吃饱了，就会飞到高处来晒羽毛。'],
    ['谢霁月','血迹往上去了。跟紧我。'],
    {flag:'c2_cliff_in'},
    ['旁白','（顺着山道爬上崖顶。路边好像掉了什么东西。）']],
  token:()=>[
    ['旁白','山道边的石缝里，卡着一块青玉牌。上面一个「正」字，裂了一道缝。'],
    ['何满仓','是大师兄的玉牌！他天天挂在腰上，谁碰都不让……'],
    ['旁白','你把玉牌翻过来。背面刻着一行小字：「名正，则言顺。」'],
    ['谢霁月','……他最在乎的，就是这个「名」字。'],
    {give:{c2_lutoken:1}}, {flag:'c2_token'}],
  mirror:()=>[
    ['旁白','崖顶的风停了。石台上，静静地躺着一面八卦镜。四周的白羽围成一圈，像是有什么东西在这里守了很久。'],
    ['谢霁月','这是大师兄的八卦镜。他从不离身。'],
    ['何满仓','镜、镜子里……有东西在动！'],
    {choice:'镜面像水一样，一圈一圈地晃——', options:[
      {text:'拿起八卦镜', go:'c2c_flash'},
      {text:'……先别碰', fn:()=>UI.say([['谢霁月','（看了你一眼）它在等人去看。总得有人看。'],['旁白','（准备好了，再来石台前。）']])}]}],
  flash:[
    {run:()=>C2C.cg(0)},
    ['旁白','镜面泛起一圈涟漪。你看见了一个村子，村口的牌坊上写着三个字——「安平村」。'],
    ['村民','陆仙长为民除害！后山的狼妖，一只都没跑掉！'],
    ['旁白','村民们把狼皮挂上牌坊，敲锣打鼓。人群中间站着一个年轻人，腰间的「正」字玉牌在太阳下发亮。'],
    ['陆正衡','斩妖除魔，本是我辈分内之事。'],
    ['旁白','那一年，「{宗}陆正衡」的名字，传遍了整座山。'],
    {run:()=>C2C.cg(1)},
    ['旁白','镜面又是一晃。画面往回倒去——'],
    ['旁白','那是更早的时候。村民们扛着锄头、举着火把上了后山。他们烧林开荒，掏了狼窝，把还没睁眼的小狼一只只拎出来卖。'],
    ['旁白','狼群这才下了山。它们叼走了几只羊……没有伤过一个人。'],
    ['旁白','后来，村里凑了一袋银子，请来了一位仙长。'],
    ['陆正衡','（镜中）狼窝里的小狼呢？'],
    ['村民','……早没了。仙长，您只管除妖，别的不用管。'],
    ['旁白','年轻的大师兄沉默了一会儿。然后，他收下了那袋银子。'],
    ['陆正衡','……知道了。'],
    {run:()=>C2C.cg(2)},
    ['旁白','最后一个画面，是夜里。'],
    ['旁白','一头母狼倒在火光中间。它到死都挡在一个草窝前面。村民的刀，剖开了它的肚子。'],
    ['旁白','不远处的草丛里，伏着一个披着狼皮的少年。他瘦得只剩骨头，指甲缝里全是泥。'],
    ['旁白','他没有哭，也没有出声。他只是看着那些人的脸——一张，一张，记住。'],
    {run:()=>{ C2C.freeze=true; }},
    ['旁白','画面在这里定住了。少年的眼睛，好像隔着镜子，看了你一眼。'],
    {run:()=>{ C2C.freeze=false; PixCG.close(); }},
    ['旁白','镜面恢复了平静，只照出你自己的脸。'],
    ['何满仓','那……那些狼，是先被人欺负的？'],
    ['谢霁月','他知道。'],
    ['谢霁月','镜子里，他问了小狼的事。他什么都知道，还是收下了那袋银子。'],
    {choice:'你想说——', options:[
      {text:'大师兄……也许有苦衷', go:'c2c_why1'},
      {text:'他要的，是那个名声', go:'c2c_why2'}]}],
  why1:[['谢霁月','苦衷？'],['谢霁月','（她笑了一下，笑得很冷）被人泼脏水的人，从来没有人问过她有没有苦衷。']],
  why2:[['谢霁月','嗯。好名声这种东西……'],['谢霁月','（她低下头）有人拿命去换，有人什么都没做，就被人拿走了。']],
  land:()=>[
    {flag:'c2_mirror'},
    ['旁白','崖顶的风，忽然停了。'],
    ['旁白','一大片影子从头顶压下来。翅膀扇了两下，白羽像雪一样落了一地。'],
    {run:()=>{ MJ.wings(); enterMap('mj_cliff',S.x,S.y); }},
    ['穷奇','呕——'],
    ['穷奇','苦。好苦。'],
    ['穷奇','我穷奇一辈子，专吃好人。好人的心，是甜的。'],
    ['穷奇','这个人，满山的人都说他好，说他正直、说他公道……我闻着香，一口就吞了。'],
    ['穷奇','可他的心是苦的！苦得我三天三夜，吐都吐不出来！'],
    ['何满仓','它、它肚子里……在动！'],
    ['旁白','穷奇的肚皮上，鼓起一张人脸的形状。那张脸张着嘴，好像在喊什么。'],
    ['谢霁月','（拔剑）把师兄吐出来。'],
    ['穷奇','吐得出来，我早吐了！'],
    ['旁白','（八卦镜在你手里发烫。战斗中可以用它照穿大师兄的护盾，照完之后，你的下一击伤害翻倍。）'],
    {battle:'c2_qqlu', win:'c2c_win', lose:'c2c_lose'}],
  again:[
    ['穷奇','呕……又是你。你闻着倒是挺甜的。'],
    ['陆正衡','（从穷奇肚子里，闷闷的）……师弟妹？把镜子收起来！听见没有！'],
    {battle:'c2_qqlu', win:'c2c_win', lose:'c2c_lose'}],
  lose:[
    ['旁白','穷奇一翅膀扇过来，你被卷下了崖顶。'],
    ['谢霁月','（把你从石头堆里拉起来）还能站吗？'],
    ['旁白','（回到崖下的山道。调整好了，再上崖顶去找穷奇。）']],
  win:[
    {run:()=>C2C.sealCG()},
    ['旁白','穷奇重重摔在崖顶，双翼散了一地白羽。它头顶那颗人头还在骂个不停——是大师兄。'],
    ['陆正衡','放我出来！我是{宗}陆正衡！我斩过的妖，比你吃过的人还多！'],
    ['穷奇','闭嘴……你好苦……'],
    ['谢霁月','（举起八卦镜）师兄。镜子里的事，是真的吗？'],
    ['陆正衡','……'],
    ['陆正衡','那又如何？村民要一个交代，我就给了他们一个交代。没有我，安平村早就——'],
    ['谢霁月','早就怎么样？被几只丢了孩子的狼，叼走几只羊？'],
    ['陆正衡','……'],
    ['何满仓','大、大师姐，那现在怎么办？把大师兄……剖出来吗？'],
    {run:()=>{ C2C.sealU=1; }},
    ['旁白','八卦镜照向穷奇。镜光里，大师兄和穷奇的影子缠在一起，早就分不清哪里是人，哪里是兽。'],
    ['谢霁月','分不开了。'],
    ['谢霁月','他的名声，是穷奇最想吃的东西；他的心，是穷奇最吐不掉的东西。'],
    ['谢霁月','{称}，帮我。把它封回风穴去。'],
    {run:()=>{ C2C.sealU=2; Sound.magic(); }},
    ['旁白','你和大师姐一起举起八卦镜。镜光化作八道锁链，把穷奇一圈一圈缠住，往东边的风里拖去。'],
    ['穷奇','都怪你！我要是没吃你——'],
    ['陆正衡','都怪你！我要是没被你吃——'],
    ['穷奇','苦死了！'],
    ['陆正衡','畜生！'],
    {run:()=>{ C2C.sealU=3; }},
    ['旁白','吵架声越飘越远，最后被风卷进了东边的天际——风穴的方向。'],
    {run:()=>{ C2C.sealOn=false; PixCG.close(); S.flags.c2_qq_sealed=true; if(RT.mapId==='mj_cliff') enterMap('mj_cliff',S.x,S.y); }},
    ['旁白','崖顶安静了下来。只剩下一地的白羽。'],
    ['何满仓','（小声）大师兄……以后就一直待在那里面了吗？'],
    ['谢霁月','嗯。和他最讨厌的东西，待在一起。'],
    ['旁白','谢霁月低头看着手里的八卦镜。镜子里的她，嘴唇动了动，好像在说什么。'],
    ['旁白','她很快把镜子翻了过去，塞进你手里。'],
    ['谢霁月','……你先拿着。'],
    {give:{c2_bagua:1}},
    ['何满仓','（肚子「咕——」地响了一声，整座崖都听得见）'],
    ['何满仓','嘿嘿……我、我饿了。'],
    ['旁白','他笑着，眼睛却一直盯着地上那滩穷奇的血。'],
    {flag:'c2_qq_sealed'},
    ['旁白','（第三幕「白羽崖」完。第四幕「大师姐的心魔」正在制作中，敬请期待。）']],
  // the pictures in the mirror (0: the village cheers; 1: the back mountain, earlier; 2: the night, frozen)
  freeze:false,
  cg(n){
    const village=(g,W,H,R)=>{ Land.paper(g,W,H,R,'#e9dcc0'); Land.sky(g,W,H,['rgba(250,232,196,.9)','rgba(240,220,180,.6)','rgba(236,226,206,.2)']); Land.orb(g,W*.8,H*.16,Math.min(W,H)*.06,'#f0a050',3);
      Land.peaks(g,W,H,R,{y:H*.5,amp:H*.2,n:5,a:.35}); Land.mist(g,W,H,H*.52,H*.12,.4);
      for(const [x,w,h] of [[.13,.22,.24],[.36,.17,.2],[.86,.22,.24]]) C2C.house(g,W*x,H*.75,W*w,H*h,R);
      // the archway with the wolf skins hung on it
      g.fillStyle='rgba(40,30,24,.85)'; g.fillRect(W*.55,H*.42,W*.015,H*.36); g.fillRect(W*.72,H*.42,W*.015,H*.36); g.fillRect(W*.53,H*.42,W*.22,H*.03);
      g.fillStyle='rgba(150,30,24,.85)'; g.fillRect(W*.6,H*.455,W*.08,H*.035); g.fillStyle='#f6eedc'; g.font=`${H*.025}px "Ma Shan Zheng",KaiTi,serif`; g.textAlign='center'; g.fillText('安平村',W*.64,H*.482);
      for(const x of [.585,.665]){ g.fillStyle='rgba(140,140,130,.85)'; g.beginPath(); g.moveTo(W*x,H*.5); g.lineTo(W*(x+.045),H*.5); g.lineTo(W*(x+.035),H*.6); g.lineTo(W*(x+.01),H*.6); g.closePath(); g.fill(); }
      Land.ground(g,W,H,H*.74,.55,'#8a6a46'); g.strokeStyle='rgba(60,44,32,.8)'; g.lineWidth=Math.max(1,W*.003); g.beginPath(); g.moveTo(0,H*.36); for(let i=0;i<=8;i++){ const x=W*i/8; g.quadraticCurveTo(x-W/16,H*.4,x,H*.36); } g.stroke();
      for(let i=0;i<8;i++){ const x=W*(i+.5)/8; g.beginPath(); g.moveTo(x,H*.383); g.lineTo(x,H*.395); g.stroke(); Land.lantern(g,x,H*.405,Math.min(W,H)*.012,3); } };
    const mountain=(g,W,H,R)=>{ Land.paper(g,W,H,R,'#d8ccb4'); Land.sky(g,W,H,['rgba(90,60,46,.8)','rgba(160,96,60,.55)','rgba(210,170,120,.25)']);
      Land.peaks(g,W,H,R,{y:H*.46,amp:H*.24,n:4,a:.55,pines:6}); Land.mist(g,W,H,H*.5,H*.16,.25);
      for(let i=0;i<6;i++){ const x=W*(.08+i*.17); Land.pine(g,x,H*.74,H*(.18+R()*.1),R,.5); }
      g.fillStyle='rgba(50,36,28,.8)'; g.beginPath(); g.ellipse(W*.22,H*.8,W*.12,H*.07,0,Math.PI,0); g.fill();        // the den in the hillside
      Land.ground(g,W,H,H*.78,.6,'#5a4030'); };
    const night=(g,W,H,R)=>{ Land.paper(g,W,H,R,'#9a8a80'); Land.sky(g,W,H,['rgba(14,8,10,.96)','rgba(40,16,16,.9)','rgba(70,30,24,.75)']); Land.orb(g,W*.72,H*.15,Math.min(W,H)*.06,'#d87a5a',4);
      for(let i=0;i<8;i++) Land.pine(g,W*(.04+i*.13),H*(.66+R()*.04),H*(.28+R()*.12),R,.65);
      Land.ground(g,W,H,H*.72,.85,'#1a0e0c'); for(let i=0;i<16;i++) Land.grass(g,W*R()*.45,H*(.9+R()*.08),H*.08,4,R,.75,'#140a08'); };
    const P=.62;   // people in the mirror are drawn small: it is far away and long ago
    const scenes=[
      {ink:village, title:'安平村', cast:[
        {look:LOOK_LU_YOUNG, x:.5, pose:'stand', prop:'sword', face:-1, s:P*1.05},
        {look:C2V[0], x:.27, pose:'point', face:1, s:P},{look:C2V[1], x:.36, pose:'stand', face:1, s:P},{look:C2V[4], x:.65, pose:'stand', face:-1, s:P},{look:C2V[3], x:.74, pose:'point', face:-1, s:P},
        {cv:FineArt.wolfdown(), x:.42, y:.93, face:1, s:P},{cv:FineArt.wolfdown(), x:.6, y:.94, face:-1, s:P*.9}]},
      {ink:mountain, title:'后山', cast:[
        {look:C2V[2], x:.62, pose:'hold', prop:'lantern', face:-1, s:P},{look:C2V[3], x:.71, pose:'hold', prop:'wood', face:-1, s:P},{look:C2V[0], x:.8, pose:'point', face:-1, s:P},
        {cv:FineArt.cub(), x:.42, y:.87, face:1, s:P},{cv:FineArt.cub(), x:.48, y:.88, face:-1, s:P*.9},
        {cv:FineArt.wolf(), x:.28, y:.86, face:1, s:P*1.05}]},
      {ink:night, title:'那一夜', cast:[
        {cv:FineArt.wolfdown(), x:.6, y:.85, face:-1, s:P*1.1},
        {look:C2V[2], x:.76, pose:'hold', prop:'lantern', face:-1, alpha:.55, s:P},{look:C2V[3], x:.84, pose:'stand', face:-1, alpha:.5, s:P},
        {cv:FineArt.wolfboy(), x:.3, y:.93, face:1, s:P*.8}]},
    ];
    const sc=scenes[n];
    if(n===0){ PixCG.open({ink:sc.ink, cast:sc.cast, title:sc.title, small:'镜中往事', seed:731}); Music.play('night',true); }
    else { PixCG.swap({ink:sc.ink, cast:sc.cast}); const t=$('#cg .cg-title b'); if(t) t.textContent=sc.title; }
    const c=PixCG.cur; c.gy=.86;
    // the wood burns behind the people on the back mountain: flames at the foot of the pines, smoke and sparks going up
    c.stage=n!==1?null:(g,W,H,fp,t)=>{
        for(let i=1;i<6;i++){ const x=W*(.08+i*.17), y=H*.75, sz=Math.min(W,H)*(.07+.02*((i*7)%3));
          const gl=g.createRadialGradient(x,y-sz*.4,0,x,y-sz*.4,sz*2.2); gl.addColorStop(0,'rgba(255,140,50,.35)'); gl.addColorStop(1,'rgba(255,140,50,0)'); g.fillStyle=gl; g.fillRect(x-sz*2.2,y-sz*2.6,sz*4.4,sz*4.4);
          for(let k=0;k<3;k++){ const u=((t*.35+i*.27+k/3)%1), sx=x+Math.sin(t*.8+i+k)*sz*.6*u, sy=y-sz*1.2-u*sz*4; g.fillStyle=`rgba(70,60,56,${.32*(1-u)})`; g.beginPath(); g.ellipse(sx,sy,sz*(.35+u*.9),sz*(.25+u*.5),0,0,7); g.fill(); }
          C2C.flame(g,x,y,sz,t+i*1.7);
          for(let k=0;k<4;k++){ const u=((t*.7+i*.31+k/4)%1); g.fillStyle=`rgba(255,${190-u*80|0},80,${1-u})`; g.fillRect(x+Math.sin(t*3+k*2+i)*sz*.7,y-sz*.8-u*sz*3,Math.max(2,fp*.8),Math.max(2,fp*.8)); } }
    };
    c.front=(g,W,H,fp,t)=>{
      // the round mirror frame: everything outside the glass is dark, and the glass ripples at its rim
      const R0=Math.min(W,H)*.62, cx=W/2, cy=H*.5;
      if(n===2){ // the fire's light on the body
        const gr=g.createRadialGradient(W*.7,H*.84,0,W*.7,H*.84,W*.3); gr.addColorStop(0,'rgba(255,120,60,.28)'); gr.addColorStop(1,'rgba(255,120,60,0)'); g.fillStyle=gr; g.fillRect(0,0,W,H);
        g.fillStyle='rgba(120,20,16,.55)'; g.beginPath(); g.ellipse(W*.6,H*.845,W*.07,H*.014,0,0,7); g.fill();
        // the long grass he hides in, in front of him
        g.strokeStyle='rgba(12,7,6,.92)'; g.lineCap='round'; for(let i=0;i<46;i++){ const x=W*(.08+((i*37)%100)/100*.42), h=H*(.05+((i*53)%10)/10*.07), lean=Math.sin(t*1.2+i)*W*.006+((i%5)-2)*W*.004;
          g.lineWidth=Math.max(1.5,fp*.9); g.beginPath(); g.moveTo(x,H*.99); g.quadraticCurveTo(x+lean*.5,H*.99-h*.6,x+lean*2,H*.99-h); g.stroke(); }
        if(C2C.freeze){ g.fillStyle='rgba(120,30,24,.22)'; g.fillRect(0,0,W,H); g.strokeStyle='rgba(255,255,255,.07)'; g.lineWidth=1; for(let i=0;i<6;i++){ const x=((i*137+Math.floor(t*3)*53)%W); g.beginPath(); g.moveTo(x,0); g.lineTo(x+4,H); g.stroke(); } } }
      const vg=g.createRadialGradient(cx,cy,R0*.72,cx,cy,R0*1.05); vg.addColorStop(0,'rgba(10,8,6,0)'); vg.addColorStop(1,'rgba(10,8,6,.88)'); g.fillStyle=vg; g.fillRect(0,0,W,H);
      g.strokeStyle=`rgba(232,190,110,${.3+.1*Math.sin(t*2)})`; g.lineWidth=Math.max(2,fp); g.beginPath(); g.arc(cx,cy,R0*.98+Math.sin(t*3)*fp,0,7); g.stroke();
    };
  },
  // the sealing: 穷奇 (with his head) on the cliff, the mirror's light, eight chains dragging it away east
  sealU:0, sealOn:false,
  sealCG(){ C2C.sealU=0; C2C.sealOn=true; QQLU.headSprite();
    PixCG.open({ink:(g,W,H,R)=>{ Land.paper(g,W,H,R,'#cfd2d4'); Land.sky(g,W,H,['rgba(70,80,96,.85)','rgba(150,160,170,.6)','rgba(220,224,226,.3)']);
        Land.peaks(g,W,H,R,{y:H*.55,amp:H*.18,n:5,a:.4}); Land.mist(g,W,H,H*.58,H*.2,.45);
        g.fillStyle='rgba(70,68,64,.92)'; g.beginPath(); g.moveTo(0,H*.8); g.lineTo(W*.1,H*.74); g.lineTo(W*.9,H*.74); g.lineTo(W,H*.8); g.lineTo(W,H); g.lineTo(0,H); g.closePath(); g.fill();
        for(let i=0;i<20;i++){ g.fillStyle='rgba(250,250,246,.8)'; g.beginPath(); g.ellipse(W*R(),H*(.78+R()*.18),W*.012,H*.004,R()*3,0,7); g.fill(); } },
      cast:[{who:'me', x:.24, pose:'guard', prop:'swordup', face:1},{look:LOOK_XIE, x:.36, pose:'sword', prop:'sword', face:1},{look:LOOK_MAN, x:.11, pose:'crouch', face:1}],
      title:'封', small:'第二章 · 白羽崖', seed:557 });
    const c=PixCG.cur; c.gy=.84; let pull=0, last=0;
    c.front=(g,W,H,fp,t)=>{ const dt=Math.max(0,t-last); last=t; const u=C2C.sealU;
      if(u>=2) pull=Math.min(1,pull+dt*(u>=3?.5:.08));
      const sp=QQLU.headSprite(), s=fp*2.2*(1-pull*.75), w=sp.width*s, h=sp.height*s, x=W*(.68+pull*.5), y=H*(.8-pull*.45);
      g.save(); g.globalAlpha=1-pull*.6; g.imageSmoothingEnabled=false; g.drawImage(sp,x-w/2,y-h,w,h); g.restore();
      // the 八卦镜, raised between you and 大师姐; from the second line on it shines on the beast
      const mx=W*.3, my=H*.4+Math.sin(t*1.6)*fp, al=.5+.2*Math.sin(t*5);
      if(u>=1){ const gr=g.createLinearGradient(mx,my,x,y-h*.5); gr.addColorStop(0,`rgba(255,236,170,${al})`); gr.addColorStop(1,'rgba(255,236,170,.05)'); g.strokeStyle=gr; g.lineWidth=fp*7; g.beginPath(); g.moveTo(mx,my); g.lineTo(x,y-h*.5); g.stroke(); }
      C2C.bagua(g,mx,my,fp*9,t,u>=1);
      if(u>=2){ const ex=x, ey=y-h*.5, R=Math.max(w,h)*.7, rot=t*1.4;      // a turning ring of the eight trigrams, and the chains
        g.strokeStyle='rgba(255,226,150,.85)'; g.lineWidth=fp; g.beginPath(); g.arc(ex,ey,R,0,7); g.stroke();
        for(let i=0;i<8;i++){ const a=rot+i*Math.PI/4, cx=ex+Math.cos(a)*R, cy=ey+Math.sin(a)*R;
          for(let j=0;j<3;j++){ const broken=(i>>j)&1; g.fillStyle='#fff3c8'; if(broken){ g.fillRect(cx-fp*3,cy-fp*2+j*fp*1.6,fp*2,fp); g.fillRect(cx+fp,cy-fp*2+j*fp*1.6,fp*2,fp); } else g.fillRect(cx-fp*3,cy-fp*2+j*fp*1.6,fp*6,fp); }
          g.strokeStyle='rgba(255,226,150,.5)'; g.setLineDash([fp*2,fp*2]); g.beginPath(); g.moveTo(cx,cy); g.lineTo(ex+Math.cos(a)*R*.2,ey+Math.sin(a)*R*.2); g.stroke(); g.setLineDash([]); } }
      // wind
      for(let i=0;i<10;i++){ const yy=H*(.1+i*.08), xx=((t*W*.4*(1+i%3*.3)+i*173)%(W*1.3))-W*.15; g.strokeStyle='rgba(245,248,250,.25)'; g.lineWidth=Math.max(1,fp*.6); g.beginPath(); g.moveTo(xx,yy); g.quadraticCurveTo(xx-W*.05,yy-fp*3,xx-W*.1,yy+fp); g.stroke(); } };
  },
};
// a village house for the mirror's 安平村: stone footing, a plaster wall in a timber frame, a door with couplets, a lattice window, a tiled roof
C2C.house=function(g,x,y,w,h,R){ const L=x-w/2, top=y-h*.6;
  g.fillStyle='rgba(110,104,92,.9)'; g.fillRect(L-w*.03,y-h*.08,w*1.06,h*.08); g.fillStyle='rgba(80,74,66,.6)'; for(let i=0;i<6;i++) g.fillRect(L+i*w/6,y-h*.08,1,h*.08);
  g.fillStyle='rgba(232,220,196,.96)'; g.fillRect(L,top,w,y-h*.08-top);
  g.fillStyle='rgba(74,54,38,.95)'; for(const px of [L,L+w*.48,L+w-w*.045]) g.fillRect(px,top,w*.045,y-h*.08-top); g.fillRect(L,top,w,h*.05); g.fillRect(L,top+h*.24,w,h*.03);
  const dx=L+w*.12, dw=w*.26, dy=top+h*.18; g.fillStyle='rgba(58,40,28,.96)'; g.fillRect(dx,dy,dw,y-h*.08-dy); g.fillStyle='rgba(120,84,52,.9)'; g.fillRect(dx+dw*.47,dy,dw*.06,y-h*.08-dy); g.fillRect(dx,dy,dw,h*.025);
  g.fillStyle='rgba(176,36,28,.9)'; g.fillRect(dx-w*.06,dy+h*.02,w*.04,h*.2); g.fillRect(dx+dw+w*.02,dy+h*.02,w*.04,h*.2);
  const wx=L+w*.6, ww=w*.28, wy=top+h*.08, wh=h*.15; g.fillStyle='rgba(74,54,38,.95)'; g.fillRect(wx-2,wy-2,ww+4,wh+4); g.fillStyle='rgba(246,226,180,.95)'; g.fillRect(wx,wy,ww,wh);
  g.strokeStyle='rgba(74,54,38,.9)'; g.lineWidth=Math.max(1,w*.012); for(let i=1;i<4;i++){ g.beginPath(); g.moveTo(wx+ww*i/4,wy); g.lineTo(wx+ww*i/4,wy+wh); g.stroke(); } g.beginPath(); g.moveTo(wx,wy+wh/2); g.lineTo(wx+ww,wy+wh/2); g.stroke();
  Land.roof(g,x,top+h*.02,w*1.3,h*.42,.9); g.fillStyle='rgba(40,30,24,.9)'; g.fillRect(x-w*.32,top-h*.21,w*.64,h*.035);
  g.fillStyle='rgba(74,64,56,.9)'; g.fillRect(x+w*.2,top-h*.36,w*.07,h*.14); for(let i=0;i<3;i++){ g.fillStyle=`rgba(240,236,226,${.35-i*.09})`; g.beginPath(); g.ellipse(x+w*.24+i*w*.05,top-h*(.45+i*.13),w*(.05+i*.03),h*(.04+i*.015),0,0,7); g.fill(); } };
// a flame: three tongues of colour, flickering
C2C.flame=function(g,x,y,s,t){ for(const [k,col] of [[1,'rgba(196,48,28,.9)'],[.72,'rgba(255,128,40,.95)'],[.42,'rgba(255,220,120,1)']]){
    for(let j=-1;j<=1;j++){ const fl=1+.18*Math.sin(t*9+j*2)+.1*Math.sin(t*15+j), hh=s*k*(j?1.1:1.6)*fl, ww=s*k*(j?.42:.55), cx=x+j*s*.42*k;
      g.fillStyle=col; g.beginPath(); g.moveTo(cx-ww,y); g.quadraticCurveTo(cx-ww*.9,y-hh*.55,cx+Math.sin(t*6+j)*ww*.4,y-hh); g.quadraticCurveTo(cx+ww*.9,y-hh*.55,cx+ww,y); g.closePath(); g.fill(); } } };
// the 八卦镜 itself: an octagonal bronze frame with the eight trigrams round its rim, a round mirror in the middle, a red tassel
C2C.bagua=function(g,x,y,r,t,lit){
  const oct=(R,rot=Math.PI/8)=>{ g.beginPath(); for(let i=0;i<8;i++){ const a=rot+i*Math.PI/4; g[i?'lineTo':'moveTo'](x+Math.cos(a)*R,y+Math.sin(a)*R); } g.closePath(); };
  if(lit){ const hl=g.createRadialGradient(x,y,r*.3,x,y,r*2.6); hl.addColorStop(0,`rgba(255,236,170,${.55+.15*Math.sin(t*5)})`); hl.addColorStop(1,'rgba(255,236,170,0)'); g.fillStyle=hl; g.fillRect(x-r*2.6,y-r*2.6,r*5.2,r*5.2); }
  // tassel hanging from the bottom
  g.strokeStyle='#8a1e18'; g.lineWidth=Math.max(1,r*.08); g.beginPath(); g.moveTo(x,y+r*.95); g.lineTo(x+Math.sin(t*2)*r*.06,y+r*1.35); g.stroke();
  g.fillStyle='#c8282a'; g.fillRect(x-r*.12,y+r*1.3,r*.24,r*.14); for(let k=-2;k<=2;k++){ g.fillRect(x+k*r*.06-r*.02+Math.sin(t*2+k)*r*.03,y+r*1.42,r*.04,r*.45); }
  // the bronze frame
  g.fillStyle='#2a1e1a'; oct(r*1.06); g.fill();
  const br=g.createLinearGradient(x-r,y-r,x+r,y+r); br.addColorStop(0,'#e0b060'); br.addColorStop(.5,'#b0802c'); br.addColorStop(1,'#6e4a18'); g.fillStyle=br; oct(r); g.fill();
  g.strokeStyle='#5a3a12'; g.lineWidth=Math.max(1,r*.05); oct(r*.74); g.stroke();
  // eight trigrams, one on each face, read from the centre outwards (solid bar = 1, broken = 0)
  const tri=['111','000','010','101','100','011','001','110'];
  g.fillStyle='#2a1e1a';
  for(let i=0;i<8;i++){ const a=i*Math.PI/4; g.save(); g.translate(x+Math.cos(a)*r*.87,y+Math.sin(a)*r*.87); g.rotate(a+Math.PI/2);
    const bw=r*.36, bh=Math.max(1,r*.055); for(let j=0;j<3;j++){ const yy=(j-1)*bh*1.9; if(tri[i][j]==='1') g.fillRect(-bw/2,yy-bh/2,bw,bh); else { g.fillRect(-bw/2,yy-bh/2,bw*.4,bh); g.fillRect(bw*.1,yy-bh/2,bw*.4,bh); } }
    g.restore(); }
  // the mirror
  g.fillStyle='#4a2e0c'; g.beginPath(); g.arc(x,y,r*.66,0,7); g.fill();
  const mg=g.createRadialGradient(x-r*.18,y-r*.2,r*.05,x,y,r*.6); mg.addColorStop(0,lit?'#ffffff':'#f6f2e0'); mg.addColorStop(.6,lit?'#fff0b8':'#cfc8b0'); mg.addColorStop(1,lit?'#e8c060':'#8a8670');
  g.fillStyle=mg; g.beginPath(); g.arc(x,y,r*.58,0,7); g.fill();
  g.save(); g.beginPath(); g.arc(x,y,r*.58,0,7); g.clip(); g.fillStyle='rgba(255,255,255,.75)'; g.translate(x,y); g.rotate(-.7); g.fillRect(-r*.7,-r*.34,r*1.4,r*.1); g.fillRect(-r*.7,-r*.18,r*1.4,r*.04); g.restore(); };
const zongName=()=>({jian:'青云',dan:'药王谷',shou:'万兽谷',tianji:'天机阁'})[S&&S.sect]||'青云';
{ const _l=UI.line; UI.line=function(who,text){ return _l.call(UI,who,String(text).replace(/\{宗\}/g,zongName())); }; }
{ const _lg=Battle.log; Battle.log=function(t){ return _lg.call(Battle,String(t).replace(/\{宗\}/g,zongName())); }; }
Object.assign(SCRIPTS, { c2c_flash:C2C.flash, c2c_why1:[...C2C.why1, ...C2C.land()], c2c_why2:[...C2C.why2, ...C2C.land()], c2c_win:C2C.win, c2c_lose:C2C.lose });
// the mirror's pictures follow the lines; the 'freeze' line ends the scene
{ const _cd=UI.closeDlg; UI.closeDlg=function(){ const r=_cd.apply(UI,arguments); setTimeout(()=>{ if(PixCG.on&&$('#dlg').hidden&&!Battle.s&&(C2C.sealOn||PixCG.cur&&/镜中往事/.test($('#cg .cg-title b')?.textContent||''))){ C2C.sealOn=false; PixCG.close(); } },80); return r; }; }

/* ---------- the boss: 穷奇, with 陆正衡 inside it ---------- */
BEASTS.c2_qqlu={name:'穷奇', spr:'qiongqi_big', boss:true, big:BEASTS.qiongqi.big, hp:1800, atk:46, def:14, exp:320, stones:[160,160], drop:['qq_yu',1], mirror:true, theme:'qiongqi',
  lore:'吞下了陆正衡的穷奇。它专吃好人，这一回却被一颗苦心卡住了喉咙。',
  moves:['atk','wind','roar','double','featherrain','big','wind'],
  phase2:{at:.7, moves:['pillar','featherrain','shield','wind','pillar','big'], line:'穷奇的头顶鼓起一团——一颗人头挣了出来。是大师兄！「放肆！谁敢动我{宗}陆正衡！」'},
  phase3:{at:.35, ally:'谢霁月', moves:['quarrel','pillar','tornado','shield','quarrel','big'], line:'两颗头吵了起来，穷奇的身子被扯得东倒西歪！就在这时，一道剑光落下——「师兄，够了。」谢霁月站到了你身边。'}};
SCENES.c2_qqlu={...SCENES.qiongqi, title:'穷奇', sub:'闻人忠信，辄食其鼻　——　《神异经》'};
DODGE.c2_qqlu={...DODGE.qiongqi,
  pillar:{name:'明正典刑', hit:.6, dur:4.8, spawn(P,t,dt,m){
    P.every('p',.6/m,()=>P.add({k:'pillar', at:6+Math.random()*88, w:10, warn:.75/m, act:.5}));
    P.every('pm',1.5/m,()=>P.add({k:'pillar', at:P.me.x, w:12, warn:.85/m, act:.5})); }},
  quarrel:{name:'两头争吵', hit:.55, dur:5.2, spawn(P,t,dt,m){
    P.me.x+=Math.sin(t*1.9)*34*m*dt;                                                         // the body is yanked left and right
    P.every('qf',.42/m,()=>P.add({k:'feather', x:-4, y:8+Math.random()*84, vx:(36+Math.random()*12)*m, vy:(Math.random()-.5)*8, r:2.1}));
    P.every('qp',1.05/m,()=>P.add({k:'pillar', at:8+Math.random()*84, w:10, warn:.7/m, act:.45})); }},
};
const QQLU = {
  is(s){ return !!s&&s.kind==='c2_qqlu'; },
  bicker(s){ return !!s&&s.kind==='qiongqi2'&&!!S.flags.c2_qq_sealed; },
  // 穷奇's big art with 陆正衡's head pushing up out of its crown (cached as a sprite so the CG can use it too)
  headSprite(){ if(SPRC.c2_qqlu_big) return SPRC.c2_qqlu_big;
    const base=sprite('qiongqi_big'), hd=lookSprite(LOOK_LU,'down',0), hh=13, top=13, c=document.createElement('canvas');
    c.width=base.width; c.height=base.height+top; const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
    g.drawImage(base,0,top);
    const hx=Math.round((base.width-hd.width)/2), cx=base.width/2, p=(x,y,col)=>{ g.fillStyle=col; g.fillRect(hx+x,y,1,1); };
    // his neck and the collar of his robe come up out of the beast's crown; its fur closes round them
    g.fillStyle='#2a1e1a'; g.fillRect(hx+6,hh,6,3); g.fillStyle='#f2c29a'; g.fillRect(hx+7,hh,4,2); g.fillStyle='#d3a986'; g.fillRect(hx+7,hh,1,2); g.fillRect(hx+7,hh,4,1);
    g.fillStyle='#2a1e1a'; g.fillRect(hx+4,hh+2,10,3); g.fillStyle='#33303f'; g.fillRect(hx+5,hh+2,8,2); g.fillStyle='#fbf3e4'; g.fillRect(hx+6,hh+2,2,1); g.fillRect(hx+10,hh+2,2,1); g.fillRect(hx+8,hh+3,2,1);
    g.fillStyle='#2a1e1a'; g.fillRect(cx-8,hh+4,16,1); g.fillStyle='#e07b39'; g.fillRect(cx-7,hh+5,14,4); g.fillStyle='#b0532a'; g.fillRect(cx-7,hh+8,14,1); for(const x of [-6,-3,1,4]) g.fillRect(cx+x,hh+4,2,1);
    g.drawImage(hd,0,0,hd.width,hh,hx,0,hd.width,hh);
    // not smiling, but not frightening either: cross, flustered, a bit ridiculous — brows tipped, a small tight mouth, a bead of sweat
    p(6,7,'#1b1618'); p(11,7,'#1b1618');
    p(8,11,'#b0504a'); p(9,11,'#b0504a');
    p(15,4,'#9fd3ef'); p(15,5,'#9fd3ef'); p(16,5,'#cfeeff'); p(15,6,'#cfeeff');
    c.bottom=c.height; return SPRC.c2_qqlu_big=c; },
  showHead(s){ const c=$('#bEnemy'); if(!c||s.head) return; s.head=true; const old=c.width, w=parseFloat(c.style.width)||c.getBoundingClientRect().width, sp=QQLU.headSprite();
    c.width=sp.width; c.height=sp.height; const g=c.getContext('2d'); g.imageSmoothingEnabled=false; g.drawImage(sp,0,0); c.style.width=(w*sp.width/old)+'px';
    if(QQLU.is(s)){ s.B={...s.B, name:'穷奇 · 陆正衡'}; const n=$('#battle .b-name'); if(n) n.firstChild.textContent=s.B.name; } },
  // the quarrel is told between turns, in a small dialogue box over the bottom of the fight (never while you dodge); tap to go on
  talk(lines,cb){ const host=$('#battle'); if(!host||host.hidden||!lines||!lines.length){ cb&&cb(); return; }
    const box=document.createElement('div'); host.appendChild(box); let i=0;
    const show=()=>{ const [who,text]=lines[i]; box.className='b-talk wood '+(who==='陆正衡'?'lu':who==='穷奇'?'qq':''); box.innerHTML=`<b>${esc(who)}</b><p>${esc(text.replace(/\{宗\}/g,zongName()))}</p><i>▼</i>`; };
    box.onclick=e=>{ e.stopPropagation(); Sound.tick(); if(++i<lines.length) show(); else { box.remove(); cb&&cb(); } };
    show(); },
  LINES:{
    qq:['呕……好苦……','你闻着倒是挺甜的。','我只吃好人！','滚出我的肚子！'],
    pillar:['明正典刑！','妖就是妖，该杀！','我是为了村民！','天理昭昭！'],
    shield:['我问心无愧！','{宗}陆正衡，清清白白！','谁敢污我名声！'],
    quarrel:[[['穷奇','往左！'],['陆正衡','往右！']],[['穷奇','苦死了，吐出去！'],['陆正衡','你敢！']],[['陆正衡','那些狼本来就该死！'],['穷奇','那你也该死！']],[['陆正衡','都怪你！'],['穷奇','都怪你！']],[['穷奇','闭嘴！'],['陆正衡','你先闭嘴！']],[['陆正衡','我是为了村民！'],['穷奇','你是为了你自己！']]],
    mirror:['……别照了。','把镜子拿开！','那不是我……','……'],
  },
  pick(a){ return a[Math.random()*a.length|0]; },
  // what they say before the enemy acts: whatever just happened first, then every other turn once his head is out
  lines(s,it){ s.etn=(s.etn||0)+1; const L=QQLU.LINES, P=QQLU.pick;
    if(s.pendingTalk){ const t=s.pendingTalk; s.pendingTalk=null; return t; }
    if(QQLU.is(s)&&it==='shield') return [['陆正衡',P(L.shield)],['穷奇','又来了……']];
    if(!s.head) return s.etn%3===1?[['穷奇',P(L.qq)]]:null;
    if(s.etn%2) return null;
    if(it==='pillar') return [['陆正衡',P(L.pillar)],['穷奇',P(L.qq)]];
    return P(L.quarrel); },
  // with classic turns on there is nothing to dodge: the new moves fall back on old ones
  classic(s){ if(!Dodge.on(s)) s.moves=s.moves.map(m=>({pillar:'big', quarrel:'double', tornado:'wind', featherrain:'atk'})[m]||m); },
};
// a fight begins: the shield lives on the enemy's life (any hit while shielded only does a third), the rematch keeps his head
{ const _b=Battle._begin; Battle._begin=function(kind,cb){ const r=_b.call(Battle,kind,cb); const s=Battle.s;
    if(QQLU.is(s)){ let hp=s.hp; s.shield=0; QQLU.classic(s);
      Object.defineProperty(s,'hp',{enumerable:true, get(){ return hp; }, set(v){ if(v<hp&&s.dbl){ v=hp-(hp-v)*2; if(!s.dblTip||performance.now()-s.dblTip>700){ s.dblTip=performance.now(); setTimeout(()=>Battle.float('破绽 ×2','crit'),120); } }   // after the 八卦镜: he is wide open
        if(v<hp&&s.shield>0){ const d=hp-v; v=hp-Math.max(1,Math.round(d/3)); if(!s.shieldTip||performance.now()-s.shieldTip>700){ s.shieldTip=performance.now(); setTimeout(()=>Battle.float('清誉护体 · 伤害大减','shield'),120); } } hp=v; }}); }
    if(QQLU.bicker(s)){ QQLU.showHead(s); s.pendingTalk=[['陆正衡','又是你！放我出去！'],['穷奇','闭嘴，打架呢！']]; }
    return r; }; }
{ const _pc=Battle.phaseCheck; Battle.phaseCheck=function(){ const s=Battle.s, p2=s&&s.phase2, p3=s&&s.phase3; _pc.call(Battle);
    if(!QQLU.is(s)) return; if(s.phase2!==p2||s.phase3!==p3) QQLU.classic(s);
    if(s.phase2&&!p2){ QQLU.showHead(s); s.pendingTalk=[['陆正衡','放肆！谁敢动我{宗}陆正衡！'],['穷奇','你给我缩回去！'],['陆正衡','你才缩回去！']]; }
    if(s.phase3&&!p3) s.pendingTalk=[['穷奇','苦死了！我要把你吐出去！'],['陆正衡','你敢！我话还没说完——'],['谢霁月','师兄。够了。']]; }; }
// the 八卦镜 takes the place of 遁走 (which a boss fight never allows anyway)
{ const _h=Battle.actsHTML; Battle.actsHTML=function(B){ const h=_h.call(Battle,B); return B&&B.mirror?h.replace(/<button data-a="flee"[^>]*>[\s\S]*?<\/button>/,'<button data-a="mirror" class="mirrorb">八卦镜<small>破盾 · 下一击×2</small></button>'):h; }; }
{ const _ui=Battle.ui; Battle.ui=function(){ _ui.call(Battle); const s=Battle.s; if(!QQLU.is(s)) return;
    const mb=$('#battle').querySelector('[data-a="mirror"]'); if(mb) mb.disabled=!(s.shield>0);
    const en=$('#bEnemy'); if(en) en.classList.toggle('shielded',s.shield>0);
    const el=$('#bIntent'); if(!el) return;
    if(!s.stun&&Battle.intent()==='shield'){ el.textContent='清誉护体（开启护盾：受到的伤害大减。用八卦镜照破它）'; el.className='b-intent warn'; }
    if(s.shield>0) el.textContent+=`　护盾 ${s.shield} 回合`;
    if(s.exposed){ el.textContent='陆正衡愣住了 · 破绽大开：你的下一击伤害翻倍'; el.className='b-intent'; } }; }
{ const _act=Battle.act; Battle.act=function(a){ const s=Battle.s;
    if(!QQLU.is(s)||s.over||s.busy||s.dead) return _act.call(Battle,a);
    if(a==='mirror'){ if(!(s.shield>0)) return; if(s.charmed) return _act.call(Battle,a);
      s.shield=0; s.stun=1; s.mirrorStun=true; s.exposed=true; Sound.magic(); BossBg.flash('rgba(255,236,170,.75)');
      Battle.log('你举起八卦镜——镜中映出安平村的后山。「清誉护体」应声而碎，陆正衡愣住了！（破绽大开：你的下一击伤害翻倍）'); Battle.float('护盾破碎','crit'); Battle.hitFx();
      s.busy=true; Battle.ui(); return QQLU.talk([['陆正衡',QQLU.pick(QQLU.LINES.mirror)],['穷奇','哈！照得好！']],()=>{ if(Battle.s!==s||s.dead) return; s.busy=false; Battle.enemyTurn(); }); }
    // the opening the mirror made: the next blow (yours, and 大师姐's alongside it) lands double; it closes when the enemy acts again
    if(s.exposed&&a!=='guard'&&a!=='pill'){ s.exposed=false; s.dbl=true; }
    const had=s.shield>0; const r=_act.call(Battle,a); if(had&&s.shield>0&&Battle.s===s){ s.shield--; Battle.ui(); } return r; }; }
{ const _et=Battle.enemyTurn; Battle.enemyTurn=function(){ const s=Battle.s;
    if(!(QQLU.is(s)||QQLU.bicker(s))) return _et.call(Battle);
    s.dbl=false;
    // a few lines between the two heads first, then the enemy's turn as usual
    if(!s.stun&&!s.talked&&!Dodge.auto){ const lines=QQLU.lines(s,Battle.intent()); if(lines){ s.talked=true; s.busy=true; Battle.ui(); return QQLU.talk(lines,()=>{ if(Battle.s!==s||s.dead) return; s.busy=false; Battle.enemyTurn(); }); } }
    s.talked=false;
    if(!QQLU.is(s)) return _et.call(Battle);
    if(s.stun&&s.mirrorStun){ s.busy=true; Battle.ui(); return setTimeout(()=>{ if(Battle.s!==s||s.dead) return; s.stun=0; s.mirrorStun=false;
        Battle.log('陆正衡盯着镜子里的自己，一动不动。穷奇被他拽着，这一回合没能出手。'); s.busy=false; Battle.ui(); },700); }
    const it=Battle.intent();
    if(it==='shield'&&!s.stun){ s.busy=true; Battle.ui();
      return setTimeout(()=>{ if(Battle.s!==s||s.dead) return; s.shield=3; s.i++; BossBg.flash('rgba(255,220,120,.45)');
        Battle.log('「清誉护体」！一层金光罩住了穷奇。（护盾在时伤害大减——用八卦镜照破它！）'); s.busy=false; Battle.ui(); },700); }
    return _et.call(Battle); }; }

/* ---------- 狂暴穷奇 after the sealing: 陆正衡 comes with it, and the scene says so ---------- */
Object.assign(SCRIPTS, {
  fx_rematch_meet2:[
    ['旁白','风眼里的风又乱了起来。云层裂开，狂暴穷奇从天而降——头顶上，还顶着一颗气鼓鼓的人头。'],
    ['陆正衡','{称}！快、快想办法把我弄出去！'],
    ['穷奇','闭嘴！好不容易有人来陪我打一架。'],
    ['陆正衡','你这畜生，吃了我还嫌我吵——'],
    ['穷奇','你本来就吵！'],
    {battle:'qiongqi2', win:'fx_rematch_win2', lose:'fx_boss_lose'}],
  get fx_rematch_win2(){ return [
    ['陆正衡','……哼。打得还算像样。'],
    ['穷奇','你闭嘴，是它打的，又不是你。'],
    ...SCRIPTS.fx_rematch_win]; },
});
{ const _a=Dungeon.act; Dungeon.act=function(o){ if(o.act==='fxboss2'&&S.flags.c2_qq_sealed&&S.fxRematchDay!==S.day){ UI.say(SCRIPTS.fx_rematch_meet2); return true; } return _a.call(Dungeon,o); }; }

/* ---------- the map's actions, talk and the way back after a fall ---------- */
{ const _a=Dungeon.act; Dungeon.act=function(o){
    if(o.act==='mjthorn'){ UI.say([['旁白','一大丛荆棘，长得比人还高，刺上挂着雾珠。过不去。']]); return true; }
    if(o.act==='c2token'){ UI.say(C2C.token()); return true; }
    if(o.act==='c2mirror'){ UI.say(C2C.mirror()); return true; }
    if(o.act==='c2qq'){ UI.say(C2C.again); return true; }
    if(o.act==='c2stand'){ UI.say([['旁白','空空的石台。风吹过的时候，好像还能听见两个声音在吵架。']]); return true; }
    return _a.call(Dungeon,o); }; }
{ const _t=Story.talk; Story.talk=function(id){ const q=Story.quest()?.id;
    if((q==='c2f'||q==='c2g')&&(id==='xie'||id==='man')){
      const F=S.flags, L={
        xie: F.c2_qq_sealed?[['谢霁月','（她把剑擦了一遍又一遍）……我没事。']]:F.c2_mirror?[['谢霁月','它就在崖顶。准备好了就上。']]:F.c2_cliff_in?[['谢霁月','血迹往崖顶去了。']]:[['谢霁月','羽毛是从北边来的。雾林最北边——走。']],
        man: F.c2_qq_sealed?[['何满仓','（他嚼着什么东西，嚼得很用力）……嗯？没、没什么。']]:F.c2_mirror?[['何满仓','它肚子里……真的是大师兄吗……']]:F.c2_cliff_in?[['何满仓','好多羽毛……全是白的。']]:[['何满仓','大师兄会没事的，对吧？对吧？']]}[id];
      return UI.say(L); }
    return _t.call(Story,id); }; }
{ const _sl=sleep; sleep=function(passedOut){ const cliff=passedOut&&RT.mapId==='mj_cliff'; const r=_sl(passedOut); if(cliff){ enterMap('mj_cliff',9,20); RT.dir='up'; UI.hud(); } return r; }; }

/* ---------- quests: 第三幕, then the placeholder for 第四幕 ---------- */
{ const q=QUESTS.find(q=>q.id==='c2f');
  Object.assign(q,{title:'白羽崖', desc:'大师兄不见了，帐篷里只剩一根带血的白羽。羽毛从北边飘来——穿过雾林，去找他。',
    check:s=>!!s.flags.c2_qq_sealed,
    progress:s=>!s.flags.c2_cliff_in?'顺着白羽，穿过雾林往北':!s.flags.c2_mirror?'登上白羽崖顶':'在崖顶击败穷奇',
    target:s=>{ const m=RT.mapId; if(m==='mj_cliff') return ['mj_cliff',10,4,s.flags.c2_mirror?'穷奇':'崖顶的石台']; if(m==='mj_wood') return ['mj_wood',13,0,'白羽崖']; return ['mj_wood',13,1,'雾林北边']; }});
  QUESTS.splice(QUESTS.indexOf(q)+1,0,{id:'c2g', title:'第四幕 · 大师姐的心魔（制作中）', desc:'穷奇被封回了风穴，大师兄永远留在了它肚子里。第四幕正在制作中，敬请期待。', check:s=>false}); }
// the end of 第二幕 now points the way
{ const _e=MJ.end; MJ.end=()=>_e().map(st=>Array.isArray(st)&&/第三幕「大师兄失踪」正在制作中/.test(st[1])?['旁白','（第二幕「秘境」完。顺着白羽往北走——雾林最北边的荆棘丛，被什么东西撕开了。）']:st); }
{ const _at=areaTheme; areaTheme=function(){ if(RT.mapId==='mj_cliff') return 'qiongqi'; return _at(); }; }
