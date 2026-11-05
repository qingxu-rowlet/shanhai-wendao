/* ============================================================
   山海问道 · 第三章「京城」 · 第三幕（完） · 夜里的马车 — with all four clues 大师姐 says: tonight, follow the carriage (she
   can't go: she's confined; and if she's seen out, it proves the rumour). The night streets: the black-hooded carriage
   with no lamp rolls east and you keep behind it — too close and the driver hears you, at every corner he stops and looks
   back, too far and it turns a corner and is gone. It stops at a high wall with yellow tiles: the 宗庙's back gate. Men in
   black carry people in, each with the mirror talisman on his forehead; one has a carpenter's ink line at his belt. The
   iron smell comes out of the gate. A guard looks your way — and a hand pulls you into the dark: 顾长歌, and behind him
   二师兄 何满仓, who stands staring at the wall: "this hunger. Just like in my dream." Act 3 ends.
   ============================================================ */
// the carriage: black hood, no lamp, a black horse
{ const c=FineArt.paint(46,30,P=>{ P.ell(23,28,20,2,'#00000040');
    P.rect(4,10,4,10,'#1a1a20'); P.ell(6,8,4,3,'#1a1a20'); P.rect(2,6,3,3,'#1a1a20'); P.rect(5,19,1,9,'#14141a'); P.rect(7,19,1,9,'#14141a');   // the horse
    P.line(8,14,16,16,'#5e3a20');
    P.rect(16,6,26,16,'#16161c'); P.poly([[15,7],[29,1],[43,7]],'#22222a'); P.rect(18,9,8,7,'#0c0c10');                                 // the hooded cart, a dark window
    for(const x of [20,38]){ P.ell(x,24,4,4,'#2a2420'); P.ell(x,24,1.4,1.4,'#5e3a20'); } });
  SPR.yj_cart=['x']; SPRC.yj_cart=c; }
// the 宗庙's back gate: dark red doors in a high wall, yellow-glazed tiles
{ const c=FineArt.paint(64,70,P=>{ const y='#c89a2a', yl='#e8c050', yk='#8a6a1a';
    P.rect(4,26,56,44,'#5a1a14'); P.rect(18,34,28,36,'#3a0e0a'); P.rect(19,35,12,35,'#6a1a12'); P.rect(33,35,12,35,'#6a1a12');
    for(let r=0;r<5;r++) for(let k=0;k<3;k++){ P.ell(23+k*3,40+r*6,1,1,yl); P.ell(37+k*3,40+r*6,1,1,yl); }                               // the door studs
    P.poly([[0,28],[10,14],[54,14],[64,28],[58,26],[6,26]],y); for(let x=8;x<58;x+=4) P.rect(x,15,2,11,yk); P.rect(10,12,44,3,yl); P.poly([[10,12],[5,7],[14,11]],yk); P.poly([[54,12],[59,7],[50,11]],yk); });
  SPR.yj_gate=['x']; SPRC.yj_gate=c; }

// the night streets: a lane that turns four times, from near 四方馆 east to the 宗庙's back wall
const YJ_WP=[[5,8],[10,8],[10,3],[19,3],[19,12],[27,12],[27,7],[31,7]];
{ const W=34, H=16, G=[...Array(H)].map(()=>Array(W).fill('Q'));
  const open=(x,y)=>{ if(x>0&&y>0&&x<W-1&&y<H-1) G[y][x]='P'; };
  for(let i=0;i<YJ_WP.length-1;i++){ const [a,b]=YJ_WP[i], [c,d]=YJ_WP[i+1]; for(let x=Math.min(a,c);x<=Math.max(a,c);x++) for(let y=Math.min(b,d);y<=Math.max(b,d);y++) for(const [dx,dy] of [[0,0],[1,0],[0,1],[1,1]]) open(x+dx,y+dy); }
  for(let x=1;x<=5;x++) for(const y of [8,9]) open(x,y);
  for(let y=6;y<=9;y++) for(let x=27;x<=32;x++) open(x,y);                 // the open ground before the wall
  for(let x=27;x<=32;x++) G[5][x]='Y';                                       // the 宗庙's wall
  for(let y=0;y<H;y++) for(let x=0;x<W;x++) if(G[y][x]==='Q'&&y+1<H&&G[y+1][x]==='P') G[y][x]='R';
  const objects=[
    {type:'yj_gate', x:30, y:5, spr:'yj_gate', act:'yjgate'},
    {type:'jc_barrels', x:11, y:6, spr:'jc_barrels'}, {type:'jc_barrels', x:20, y:9, spr:'jc_barrels'}, {type:'jc_barrels', x:28, y:13, spr:'jc_barrels'},
    {type:'lantern', x:13, y:2}, {type:'lantern', x:24, y:11},
  ];
  MAPS.jc_yejie={ name:'京城 · 夜街', w:W, h:H, ground:G.map(r=>r.join('')), objects, exits:[] }; }
On.theme(id=>id==='jc_yejie'?'night':null);

const YJ={
  on:false, cart:null, seg:0, wait:0, trail:[], SPEED:2.2, NEAR:2.4, CORNER:4.5, FAR:10,
  // keep behind it: how far, and what it means
  dist(){ return YJ.cart?Math.hypot(RT.fx-YJ.cart.x, RT.fy-YJ.cart.y):0; },
  begin(){ YJ.cart=RT.ents.find(e=>e.type==='yj_cart'); if(!YJ.cart){ YJ.cart={type:'yj_cart', spr:'yj_cart', x:YJ_WP[0][0], y:YJ_WP[0][1]}; RT.ents.push(YJ.cart); }
    YJ.cart.x=YJ_WP[0][0]; YJ.cart.y=YJ_WP[0][1]; YJ.seg=0; YJ.wait=1.2; YJ.trail=[]; YJ.on=true; },
  tick(dt){ if(!YJ.on||RT.mapId!=='jc_yejie'||RT.paused||RT.fadeTo||!$('#dlg').hidden) return; const c=YJ.cart; if(!c) return;
    const d=YJ.dist();
    if(d<YJ.NEAR) return YJ.fail('near');
    if(YJ.wait>0){ YJ.wait-=dt; if(YJ.seg>0&&d<YJ.CORNER) return YJ.fail('corner'); return; }
    if(d>YJ.FAR) return YJ.fail('far');
    const [tx,ty]=YJ_WP[YJ.seg+1]||[]; if(tx==null) return;
    const dx=tx-c.x, dy=ty-c.y, l=Math.hypot(dx,dy), s=YJ.SPEED*dt;
    if(l<=s){ c.x=tx; c.y=ty; YJ.seg++; YJ.trail.push([c.x,c.y]); if(YJ.seg>=YJ_WP.length-1){ YJ.on=false; return YJ.arrive(); } YJ.wait=1.6; return; }
    c.x+=dx/l*s; c.y+=dy/l*s; YJ.trail.push([c.x,c.y]); },
  fail(why){ YJ.on=false; UI.say([['旁白',{near:'车夫猛地回过头：「谁？！」',corner:'马车在街角停下来。车夫回头张望——正好看见了你。',far:'马车拐过一个街角，等你追上去，街上已经空了。'}[why]],
      ['旁白','（回到街口，等下一辆。）']],()=>YJ.restart()); },
  restart(){ RT.fadeTo=()=>{ enterMap('jc_yejie',1,8); RT.dir='right'; UI.hud(); YJ.begin(); }; },
};
{ const _u=update; update=function(dt){ _u(dt); YJ.tick(dt); }; }
// a line at the top of the screen: how far you are
On.draw(({g})=>{ if(!YJ.on||RT.mapId!=='jc_yejie') return; const d=YJ.dist(), W=g.canvas.width;
  const [t,c]=d<YJ.NEAR+1?['太近了！','#e05040']:d>YJ.FAR-2?['要跟丢了！','#e0a040']:YJ.wait>0&&YJ.seg>0?['车停了……别靠近','#e0c060']:['跟着它','#a8d0a0'];
  g.font=`${Math.round(W*.022)}px "Ma Shan Zheng","KaiTi",serif`; g.textAlign='center'; g.fillStyle='rgba(10,10,16,.6)'; g.fillRect(W/2-W*.12,8,W*.24,W*.04); g.fillStyle=c; g.fillText(t,W/2,8+W*.03); });

/* ---------- 大师姐 sends you ---------- */
YJ.send=()=>[
  ['谢霁月','（你把四样东西摆在她面前：八卦镜里看见的、药渣、青禾的话、暗账）'],
  ['谢霁月','……送行茶，醉仙散，宗庙，「宗」。'],
  ['谢霁月','今天夜里，还会有一辆车。'],
  ['谢霁月','跟着它。看它去哪儿。'],
  ['苏小棠','我也去！'],
  ['谢霁月','你留下。（她看着你）我出不去。我要是被人看见在外面，流言就成真了。'],
  ['谢霁月','一个人去。别逞强。看清楚了，就回来。'],
  {choice:'今夜跟着马车？', options:[{text:'去', fn:()=>YJ.go()},{text:'等一等', fn:()=>{}}]}];
YJ.go=()=>{ S.flags.c3_yj_go=true; save(); C3.move('jc_yejie',1,8,'right',23,()=>setTimeout(()=>UI.say([
  ['旁白','子时。四方馆门口，那辆黑篷马车又来了。没有灯。'],
  ['旁白','车里装了什么，你看不见。车夫一甩鞭子，马车往东去了。'],
  ['旁白','（跟着它。别太近，别跟丢。拐弯的时候，车夫会回头。）']],()=>YJ.begin()),500)); };

/* ---------- the 宗庙's back gate ---------- */
YJ.arrive=()=>{ const n=XF.whoName(); UI.say([
  ['旁白','马车在一堵高墙底下停住了。墙比城墙还高，墙头上的瓦是黄的。'],
  ['我','（……宗庙。）'],
  ['旁白','后门开了一条缝。车上下来两个黑衣人，从车里一个一个往下抬人。'],
  ['旁白','每个人的额头上，都贴着一张画着镜子的黄符。'],
  ['旁白',`你认出了一个：${n}。`],
  ['旁白','还有一个手上全是老茧的汉子，腰上别着一把墨斗。'],
  ['我','（……鲁三。）'],
  ...(count(S,'jc_tangren')?[['我','（怀里那只糖人小老虎，硌着你的胸口。）']]:[]),
  ['旁白','门缝里飘出来一股味道。苦的。像铁锈。'],
  ['旁白','一个黑衣人忽然停下，朝你藏身的地方看了一眼。'],
  ['黑衣人','……谁在那儿？'],
  ['旁白','他往这边走过来。你的手按上了剑——'],
  ['旁白','一只手从背后捂住了你的嘴，把你拖进了更深的影子里。'],
  ['顾长歌','（贴着你的耳朵，极轻地）……别出声。'],
  ['旁白','黑衣人站了一会儿，什么也没看见，回去了。后门「吱呀」一声关上了。'],
  ['我','……顾长歌？'],
  ['顾长歌','（他松开手。月光底下，他瘦了很多，衣服上全是赶路的灰）北边最后一车人，三天前进了京城。我们一路跟过来的。'],
  ['顾长歌','……就是这里。'],
  ['旁白','他身后，还站着一个人。'],
  ['我','……二师兄？'],
  ['何满仓','（他没有看你。他直直地盯着那堵墙，脸白得像纸）'],
  ['何满仓','……这股饿。'],
  ['何满仓','跟我梦里的，一模一样。'],
  {run:()=>{ S.flags.c3_yj_done=true; S.flags.c3_a3_done=true; save(); }},
  ['旁白','（第三幕「宗门大比」完。）']],()=>{ const [x,y]=SF_WING[S.sect]; C3.move('jc_sifang',x+3,y+4,'up',23.8,()=>{ UI.hud(); Story.check(); }); }); };
On.act('yjgate',o=>UI.say([['旁白','宗庙的后门。门上的铜钉，一颗一颗，冷冰冰的。']]));

/* ---------- hooks: 大师姐, the quests ---------- */
{ const _t=XF.talk; XF.talk=id=>{ if(id==='xie'&&XF.n()>=4&&!S.flags.c3_yj_done){ UI.say(YJ.send()); return true; } return _t(id); }; }
{ const q=QUESTS.find(q=>q.id==='c3n'); Object.assign(q,{check:s=>!!s.flags.c3_yj_done,
    progress:s=>RT.mapId==='jc_yejie'?'跟着马车（别太近，别跟丢）':'回四方馆，告诉大师姐',
    target:s=>RT.mapId==='jc_yejie'&&YJ.cart?['jc_yejie',Math.round(YJ.cart.x),Math.round(YJ.cart.y),'马车']:['jc_sifang',12,10,'大师姐']}); }
QUESTS.splice(QUESTS.findIndex(q=>q.id==='c3n')+1,0,
  {id:'c3o', title:'第四幕 · 人吃人', desc:'顾长歌和二师兄跟着北边最后一车人，进了京城。宗庙的墙后面，有一股饿。', check:s=>false,
    progress:s=>'（第四幕正在做）', target:s=>['jc_sifang',12,10,'大师姐']});
