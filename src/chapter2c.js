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
// the wolves in the mirror
Object.assign(PXB, {
  wolf:['.............x.x..','............xxxx..','x..........xxkxxxk','.x.xxxxxxxxxxxxtt.','..xxxxxxxxxxxxtt..','..xxxxxxxxxxxt....','..xtxxxxxxxxt.....','..x.x.....x.x.....','..k.k.....k.k.....'],
  wolfdown:['..............x.x.','.............xxxx.','xx..........xxkxxk','.xxxxxxxxxxxxxxxt.','.xtttttttttttxxt..','..x.x.x...x.x.....'],
  cub:['.......x.x','......xxxk','.x...xxkx.','..xxxxxxt.','..xtxxxt..','..x.x.x.x.'],
});
const LOOK_WOLFBOY={g:'m',skin:3,hair:5,hairColor:0,style:'jin',cloth:5};
const LOOK_LU_YOUNG={...LOOK_LU, cloth:1};
const C2V=[{g:'m',skin:2,hair:1,hairColor:0,style:'jin',cloth:7},{g:'f',skin:1,hair:2,hairColor:1,style:'qun',cloth:2},{g:'m',skin:1,hair:0,hairColor:3,style:'robe',cloth:1},{g:'m',skin:3,hair:1,hairColor:1,style:'jin',cloth:0}];

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
    ['旁白','那一年，「青云陆正衡」的名字，传遍了整座山。'],
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
    ['旁白','（八卦镜在你手里发烫。战斗中可以用它照穿大师兄的护盾。）'],
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
    ['陆正衡','放我出来！我是青云陆正衡！我斩过的妖，比你吃过的人还多！'],
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
      for(const [x,w] of [[.12,.18],[.36,.16],[.78,.2]]){ Land.roof(g,W*x,H*.56,W*w,H*.08,.8); g.fillStyle='rgba(60,46,34,.55)'; g.fillRect(W*(x-w*.38),H*.6,W*w*.76,H*.14); }
      // the archway with the wolf skins hung on it
      g.fillStyle='rgba(40,30,24,.85)'; g.fillRect(W*.55,H*.42,W*.015,H*.36); g.fillRect(W*.72,H*.42,W*.015,H*.36); g.fillRect(W*.53,H*.42,W*.22,H*.03);
      g.fillStyle='rgba(150,30,24,.85)'; g.fillRect(W*.6,H*.455,W*.08,H*.035); g.fillStyle='#f6eedc'; g.font=`${H*.025}px "Ma Shan Zheng",KaiTi,serif`; g.textAlign='center'; g.fillText('安平村',W*.64,H*.482);
      for(const x of [.585,.665]){ g.fillStyle='rgba(140,140,130,.85)'; g.beginPath(); g.moveTo(W*x,H*.5); g.lineTo(W*(x+.045),H*.5); g.lineTo(W*(x+.035),H*.6); g.lineTo(W*(x+.01),H*.6); g.closePath(); g.fill(); }
      Land.ground(g,W,H,H*.74,.55,'#8a6a46'); for(let i=0;i<8;i++) Land.lantern(g,W*(.05+i*.13),H*.38+(i%2)*H*.03,Math.min(W,H)*.012,3); };
    const mountain=(g,W,H,R)=>{ Land.paper(g,W,H,R,'#d8ccb4'); Land.sky(g,W,H,['rgba(90,60,46,.8)','rgba(160,96,60,.55)','rgba(210,170,120,.25)']);
      Land.peaks(g,W,H,R,{y:H*.46,amp:H*.24,n:4,a:.55,pines:6}); Land.mist(g,W,H,H*.5,H*.16,.25);
      for(let i=0;i<6;i++){ const x=W*(.08+i*.17); Land.pine(g,x,H*.74,H*(.18+R()*.1),R,.5); }
      for(let i=0;i<5;i++){ const x=W*(.1+i*.2)+R()*W*.05; Land.orb(g,x,H*.66,Math.min(W,H)*.03,'#ff8a3a',4); }       // the wood burning
      g.fillStyle='rgba(50,36,28,.8)'; g.beginPath(); g.ellipse(W*.22,H*.8,W*.12,H*.07,0,Math.PI,0); g.fill();        // the den in the hillside
      Land.ground(g,W,H,H*.78,.6,'#5a4030'); };
    const night=(g,W,H,R)=>{ Land.paper(g,W,H,R,'#9a8a80'); Land.sky(g,W,H,['rgba(14,8,10,.96)','rgba(40,16,16,.9)','rgba(70,30,24,.75)']); Land.orb(g,W*.72,H*.15,Math.min(W,H)*.06,'#d87a5a',4);
      for(let i=0;i<8;i++) Land.pine(g,W*(.04+i*.13),H*(.66+R()*.04),H*(.28+R()*.12),R,.65);
      Land.ground(g,W,H,H*.72,.85,'#1a0e0c'); for(let i=0;i<16;i++) Land.grass(g,W*R()*.45,H*(.9+R()*.08),H*.08,4,R,.75,'#140a08'); };
    const P=.62;   // people in the mirror are drawn small: it is far away and long ago
    const scenes=[
      {ink:village, title:'安平村', cast:[
        {look:LOOK_LU_YOUNG, x:.5, pose:'stand', prop:'sword', face:-1, s:P*1.05},
        {look:C2V[0], x:.27, pose:'point', face:1, s:P},{look:C2V[1], x:.36, pose:'stand', face:1, s:P},{look:C2V[2], x:.65, pose:'stand', face:-1, s:P},{look:C2V[3], x:.74, pose:'point', face:-1, s:P},
        {beast:'wolfdown', x:.42, y:.92, face:1, s:.55},{beast:'wolfdown', x:.6, y:.93, face:-1, s:.5}]},
      {ink:mountain, title:'后山', cast:[
        {look:C2V[0], x:.62, pose:'hold', prop:'lantern', face:-1, s:P},{look:C2V[3], x:.71, pose:'hold', prop:'wood', face:-1, s:P},{look:C2V[2], x:.8, pose:'stand', face:-1, s:P},
        {beast:'cub', x:.4, y:.86, face:1, s:.5},{beast:'cub', x:.46, y:.87, face:-1, s:.45},
        {beast:'wolf', x:.27, y:.85, face:1, s:.6}]},
      {ink:night, title:'那一夜', cast:[
        {beast:'wolfdown', x:.6, y:.84, face:-1, s:.7},
        {look:C2V[0], x:.76, pose:'hold', prop:'lantern', face:-1, alpha:.55, s:P},{look:C2V[3], x:.84, pose:'stand', face:-1, alpha:.5, s:P},
        {look:LOOK_WOLFBOY, x:.3, y:.9, pose:'crouch', face:1, s:P*1.15}]},
    ];
    const sc=scenes[n];
    if(n===0){ PixCG.open({ink:sc.ink, cast:sc.cast, title:sc.title, small:'镜中往事', seed:731}); Music.play('night',true); }
    else { PixCG.swap({ink:sc.ink, cast:sc.cast}); const t=$('#cg .cg-title b'); if(t) t.textContent=sc.title; }
    const c=PixCG.cur; c.gy=.86;
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
      if(u>=1){ const mx=W*.42, my=H*.55, al=.5+.2*Math.sin(t*5);           // the mirror's beam
        const gr=g.createLinearGradient(mx,my,x,y-h*.5); gr.addColorStop(0,`rgba(255,236,170,${al})`); gr.addColorStop(1,'rgba(255,236,170,.05)'); g.strokeStyle=gr; g.lineWidth=fp*6; g.beginPath(); g.moveTo(mx,my); g.lineTo(x,y-h*.5); g.stroke();
        g.fillStyle='#ffe9a8'; g.beginPath(); g.arc(mx,my,fp*3,0,7); g.fill(); }
      if(u>=2){ const ex=x, ey=y-h*.5, R=Math.max(w,h)*.7, rot=t*1.4;      // a turning ring of the eight trigrams, and the chains
        g.strokeStyle='rgba(255,226,150,.85)'; g.lineWidth=fp; g.beginPath(); g.arc(ex,ey,R,0,7); g.stroke();
        for(let i=0;i<8;i++){ const a=rot+i*Math.PI/4, cx=ex+Math.cos(a)*R, cy=ey+Math.sin(a)*R;
          for(let j=0;j<3;j++){ const broken=(i>>j)&1; g.fillStyle='#fff3c8'; if(broken){ g.fillRect(cx-fp*3,cy-fp*2+j*fp*1.6,fp*2,fp); g.fillRect(cx+fp,cy-fp*2+j*fp*1.6,fp*2,fp); } else g.fillRect(cx-fp*3,cy-fp*2+j*fp*1.6,fp*6,fp); }
          g.strokeStyle='rgba(255,226,150,.5)'; g.setLineDash([fp*2,fp*2]); g.beginPath(); g.moveTo(cx,cy); g.lineTo(ex+Math.cos(a)*R*.2,ey+Math.sin(a)*R*.2); g.stroke(); g.setLineDash([]); } }
      // wind
      for(let i=0;i<10;i++){ const yy=H*(.1+i*.08), xx=((t*W*.4*(1+i%3*.3)+i*173)%(W*1.3))-W*.15; g.strokeStyle='rgba(245,248,250,.25)'; g.lineWidth=Math.max(1,fp*.6); g.beginPath(); g.moveTo(xx,yy); g.quadraticCurveTo(xx-W*.05,yy-fp*3,xx-W*.1,yy+fp); g.stroke(); } };
  },
};
Object.assign(SCRIPTS, { c2c_flash:C2C.flash, c2c_why1:[...C2C.why1, ...C2C.land()], c2c_why2:[...C2C.why2, ...C2C.land()], c2c_win:C2C.win, c2c_lose:C2C.lose });
// the mirror's pictures follow the lines; the 'freeze' line ends the scene
{ const _cd=UI.closeDlg; UI.closeDlg=function(){ const r=_cd.apply(UI,arguments); setTimeout(()=>{ if(PixCG.on&&$('#dlg').hidden&&!Battle.s&&(C2C.sealOn||PixCG.cur&&/镜中往事/.test($('#cg .cg-title b')?.textContent||''))){ C2C.sealOn=false; PixCG.close(); } },80); return r; }; }

/* ---------- the boss: 穷奇, with 陆正衡 inside it ---------- */
BEASTS.c2_qqlu={name:'穷奇', spr:'qiongqi_big', boss:true, big:BEASTS.qiongqi.big, hp:950, atk:34, def:10, exp:320, stones:[160,160], drop:['qq_yu',1], mirror:true, theme:'qiongqi',
  lore:'吞下了陆正衡的穷奇。它专吃好人，这一回却被一颗苦心卡住了喉咙。',
  moves:['atk','wind','double','featherrain','big','wind'],
  phase2:{at:.7, moves:['pillar','featherrain','shield','wind','pillar','big'], line:'穷奇的头顶鼓起一团——一颗人头挣了出来。是大师兄！「放肆！谁敢动我青云陆正衡！」'},
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
    const base=sprite('qiongqi_big'), hd=lookSprite(LOOK_LU,'down',0), hh=13, top=10, c=document.createElement('canvas');
    c.width=base.width; c.height=base.height+top; const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
    g.drawImage(base,0,top);
    const hx=Math.round((base.width-hd.width)/2), cx=base.width/2;
    g.drawImage(hd,0,0,hd.width,hh,hx,0,hd.width,hh);
    // the beast's fur closes round his neck
    g.fillStyle='#2a1e1a'; g.fillRect(cx-6,hh-1,12,1); g.fillStyle='#e07b39'; g.fillRect(cx-5,hh,10,5); g.fillStyle='#b0532a'; g.fillRect(cx-5,hh+4,10,1); g.fillRect(cx-2,hh,1,1); g.fillRect(cx+2,hh+1,1,1);
    c.bottom=c.height; return SPRC.c2_qqlu_big=c; },
  showHead(s){ const c=$('#bEnemy'); if(!c||s.head) return; s.head=true; const old=c.width, w=parseFloat(c.style.width)||c.getBoundingClientRect().width, sp=QQLU.headSprite();
    c.width=sp.width; c.height=sp.height; const g=c.getContext('2d'); g.imageSmoothingEnabled=false; g.drawImage(sp,0,0); c.style.width=(w*sp.width/old)+'px';
    if(QQLU.is(s)){ s.B={...s.B, name:'穷奇 · 陆正衡'}; const n=$('#battle .b-name'); if(n) n.firstChild.textContent=s.B.name; } },
  // speech bubbles above the stage: 穷奇 on the left, 陆正衡 on the right
  say(who,text,delay=0){ setTimeout(()=>{ const st=$('#battle .b-stage'); if(!st) return; const b=document.createElement('div'); b.className='b-say '+(who==='陆正衡'?'r':'l'); b.innerHTML=`<small>${who}</small>${esc(text)}`; st.appendChild(b); setTimeout(()=>b.remove(),2600); },delay); },
  LINES:{
    qq:['呕……好苦……','你闻着倒是挺甜的。','我只吃好人！','滚出我的肚子！'],
    pillar:['明正典刑！','妖就是妖，该杀！','我是为了村民！','天理昭昭！'],
    shield:['我问心无愧！','青云陆正衡，清清白白！','谁敢污我名声！'],
    quarrel:[['往左！','往右！'],['苦死了，吐出去！','你敢！'],['那些狼本来就该死！','那你也该死！'],['都怪你！','都怪你！'],['闭嘴！','你先闭嘴！']],
    mirror:['……别照了。','把镜子拿开！','那不是我……','……'],
  },
  pick(a){ return a[Math.random()*a.length|0]; },
  chatter(s,it){
    if(it==='quarrel'||(s.phase3&&Math.random()<.5)||QQLU.bicker(s)&&Math.random()<.6){ const [a,b]=QQLU.pick(QQLU.LINES.quarrel); const first=Math.random()<.5;
      QQLU.say(first?'穷奇':'陆正衡',a); QQLU.say(first?'陆正衡':'穷奇',b,700); return; }
    if(!s.head){ if(Math.random()<.5) QQLU.say('穷奇',QQLU.pick(QQLU.LINES.qq)); return; }
    if(it==='pillar') QQLU.say('陆正衡',QQLU.pick(QQLU.LINES.pillar)); else if(Math.random()<.4) QQLU.say('穷奇',QQLU.pick(QQLU.LINES.qq)); },
  // with classic turns on there is nothing to dodge: the new moves fall back on old ones
  classic(s){ if(!Dodge.on(s)) s.moves=s.moves.map(m=>({pillar:'big', quarrel:'double', tornado:'wind', featherrain:'atk'})[m]||m); },
};
// a fight begins: the shield lives on the enemy's life (any hit while shielded only does a third), the rematch keeps his head
{ const _b=Battle._begin; Battle._begin=function(kind,cb){ const r=_b.call(Battle,kind,cb); const s=Battle.s;
    if(QQLU.is(s)){ let hp=s.hp; s.shield=0; QQLU.classic(s);
      Object.defineProperty(s,'hp',{enumerable:true, get(){ return hp; }, set(v){ if(v<hp&&s.shield>0){ const d=hp-v; v=hp-Math.max(1,Math.round(d/3)); if(!s.shieldTip||performance.now()-s.shieldTip>700){ s.shieldTip=performance.now(); setTimeout(()=>Battle.float('清誉护体 · 伤害大减','shield'),120); } } hp=v; }}); }
    if(QQLU.bicker(s)){ QQLU.showHead(s); QQLU.say('陆正衡','又是你！放我出去！',600); QQLU.say('穷奇','闭嘴，打架呢！',1400); }
    return r; }; }
{ const _pc=Battle.phaseCheck; Battle.phaseCheck=function(){ const s=Battle.s, p2=s&&s.phase2, p3=s&&s.phase3; _pc.call(Battle);
    if(!QQLU.is(s)) return; if(s.phase2!==p2||s.phase3!==p3) QQLU.classic(s);
    if(s.phase2&&!p2){ QQLU.showHead(s); QQLU.say('陆正衡','放肆！',500); }
    if(s.phase3&&!p3){ QQLU.say('穷奇','苦死了！',700); QQLU.say('陆正衡','畜生，往哪儿走！',1300); } }; }
// the 八卦镜 takes the place of 遁走 (which a boss fight never allows anyway)
{ const _h=Battle.actsHTML; Battle.actsHTML=function(B){ const h=_h.call(Battle,B); return B&&B.mirror?h.replace(/<button data-a="flee"[^>]*>[\s\S]*?<\/button>/,'<button data-a="mirror" class="mirrorb">八卦镜<small>照破护盾</small></button>'):h; }; }
{ const _ui=Battle.ui; Battle.ui=function(){ _ui.call(Battle); const s=Battle.s; if(!QQLU.is(s)) return;
    const mb=$('#battle').querySelector('[data-a="mirror"]'); if(mb) mb.disabled=!(s.shield>0);
    const en=$('#bEnemy'); if(en) en.classList.toggle('shielded',s.shield>0);
    const el=$('#bIntent'); if(!el) return;
    if(!s.stun&&Battle.intent()==='shield'){ el.textContent='清誉护体（开启护盾：受到的伤害大减。用八卦镜照破它）'; el.className='b-intent warn'; }
    if(s.shield>0) el.textContent+=`　护盾 ${s.shield} 回合`; }; }
{ const _act=Battle.act; Battle.act=function(a){ const s=Battle.s;
    if(!QQLU.is(s)||s.over||s.busy||s.dead) return _act.call(Battle,a);
    if(a==='mirror'){ if(!(s.shield>0)) return; if(s.charmed) return _act.call(Battle,a);
      s.shield=0; s.stun=1; s.mirrorStun=true; Sound.magic(); BossBg.flash('rgba(255,236,170,.75)');
      Battle.log('你举起八卦镜——镜中映出安平村的后山。「清誉护体」应声而碎，陆正衡愣住了！'); Battle.float('护盾破碎','crit'); Battle.hitFx();
      QQLU.say('陆正衡',QQLU.pick(QQLU.LINES.mirror),200); Battle.ui(); return Battle.enemyTurn(); }
    const had=s.shield>0; const r=_act.call(Battle,a); if(had&&s.shield>0&&Battle.s===s){ s.shield--; Battle.ui(); } return r; }; }
{ const _et=Battle.enemyTurn; Battle.enemyTurn=function(){ const s=Battle.s;
    if(QQLU.bicker(s)&&!s.stun) QQLU.chatter(s,Battle.intent());
    if(!QQLU.is(s)) return _et.call(Battle);
    if(s.stun&&s.mirrorStun){ s.busy=true; Battle.ui(); return setTimeout(()=>{ if(Battle.s!==s||s.dead) return; s.stun=0; s.mirrorStun=false;
        Battle.log('陆正衡盯着镜子里的自己，一动不动。穷奇被他拽着，这一回合没能出手。'); s.busy=false; Battle.ui(); },700); }
    const it=Battle.intent();
    if(it==='shield'&&!s.stun){ s.busy=true; Battle.ui(); QQLU.say('陆正衡',QQLU.pick(QQLU.LINES.shield));
      return setTimeout(()=>{ if(Battle.s!==s||s.dead) return; s.shield=3; s.i++; BossBg.flash('rgba(255,220,120,.45)');
        Battle.log('「清誉护体」！一层金光罩住了穷奇。（护盾在时伤害大减——用八卦镜照破它！）'); s.busy=false; Battle.ui(); },700); }
    if(!s.stun) QQLU.chatter(s,it);
    return _et.call(Battle); }; }

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
