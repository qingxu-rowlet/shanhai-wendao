/* ============================================================
   山海问道 · 第三章「京城」 · 萧府外墙 — east of 东市, where the officials live: a high grey wall, a black-lacquered gate
   with no name on it but 「萧府」, and on either side of the steps two stone beasts that aren't lions. Look closer: a wolf's
   body, a red-stained head, rat's eyes — 猲狙. The gatekeeper turns everyone away. An old servant sweeps the lane; he came
   with the house, years before its master, and remembers the boy who was brought in off the street: he ate crouched in a
   corner, and the first sweet thing he ever had was a piece of 桂花糕 the old man gave him. "If you see him, take him
   one. Don't say it was me." In the corner of the wall, a little stone bowl of incense faces north. By the side door,
   every evening, someone sets out a bowl of meat for the strays. Some nights, after curfew, 萧烬 is there himself.
   ============================================================ */
// the gate, the beasts, the incense bowl, the strays' bowl
{ const FA=FineArt;
  const gate=FA.paint(64,70,P=>{ const t='#3e4650', tl='#68727e', tk='#22262c';
    P.rect(4,26,56,44,'#4a4e56'); P.rect(4,26,56,2,'#5e636c');                                                            // the gatehouse wall
    P.rect(16,32,32,38,'#141418'); P.rect(17,33,14,37,'#1e1e24'); P.rect(33,33,14,37,'#1e1e24');                          // black-lacquered doors
    for(const x of [28,36]){ P.ell(x,52,2.6,2.6,'#8a6a2a'); P.ell(x,52,1.4,1.4,'#1e1e24'); P.ell(x,49,1.2,1.2,'#a8843a'); } // the bronze rings
    for(let r=0;r<4;r++) for(let k=0;k<2;k++){ P.ell(21+k*4,39+r*7,.9,.9,'#5a4a2a'); P.ell(39+k*4,39+r*7,.9,.9,'#5a4a2a'); }
    P.rect(14,66,36,4,'#7a756a'); P.rect(12,68,40,2,'#8a857a');                                                            // the steps
    P.rect(22,18,20,8,'#141418'); P.rect(23,19,18,6,'#1e1e24');                                                            // the plaque
    P.poly([[0,28],[10,13],[54,13],[64,28],[58,26],[6,26]],t); for(let x=8;x<58;x+=4) P.rect(x,14,2,12,tk); P.rect(10,11,44,3,tl);
    P.poly([[10,11],[5,6],[14,10]],tk); P.poly([[54,11],[59,6],[50,10]],tk);
    for(const x of [9,55]){ P.line(x,28,x,31,'#2a2420'); P.ell(x,35,3.4,4.4,'#c83a2a'); P.ell(x,35,2,3.2,'#e85a3a'); P.rect(x-2,30,4,1,'#2a2420'); P.rect(x-2,39,4,1,'#2a2420'); } });
  // a sitting wolf in grey stone: long muzzle, ears up, the head stained red; rat's eyes
  const wolf=face=>{ const c=FA.paint(20,28,P=>{ const st='#a8a294', sd='#7a756a', lt='#c8c2b4';
      P.rect(2,22,16,5,sd); P.rect(2,22,16,1,lt);                                                                         // plinth
      P.ell(9,17,5,6,st); P.cap(6,21,6,14,1.6,st); P.cap(12,21,12,15,1.6,sd); P.cap(4,21,2,15,1.4,sd);                  // haunches, forelegs, the tail
      P.ell(10,9,4.5,4,'#8a5a4e'); P.poly([[12,8],[19,10],[18,12],[12,12]],'#8a5a4e'); P.poly([[7,6],[8,1],[10,6]],'#7a4a40'); P.poly([[10,6],[12,1],[13,6]],'#7a4a40');
      P.set(12,8,'#e8c050'); P.set(14,9,'#e8c050'); P.rect(15,11,4,1,'#4a2a24'); P.set(18,10,'#2a2420');                // small yellow eyes, the mouth
      P.ell(10,14,3,2,'#9a6a5e'); });
    if(face>0) return c; const d=document.createElement('canvas'); d.width=c.width; d.height=c.height; const g=d.getContext('2d'); g.translate(c.width,0); g.scale(-1,1); g.drawImage(c,0,0); d.bottom=c.bottom; d.fine=true; return d; };
  const xiang=FA.paint(16,18,P=>{ P.ell(8,16,6,1.6,'#00000030'); P.rect(3,10,10,6,'#6a645c'); P.rect(2,9,12,2,'#8a847a'); P.rect(4,11,8,1,'#4a443c');
    for(const x of [6,8,10]){ P.rect(x,3,1,7,'#a84a3a'); P.set(x,2,'#e8a050'); } P.ell(9,0.5,2,1,'rgba(220,220,220,.35)'); });
  const bowl=FA.paint(14,10,P=>{ P.ell(7,8,6,1.6,'#00000030'); P.ell(7,5,6,2.6,'#5a4a3a'); P.ell(7,4.4,5,1.8,'#8a3a2a'); P.ell(5,4,1.6,1,'#b85a4a'); P.ell(9,4.2,1.4,.9,'#a84a3a'); });
  const door=FA.paint(20,26,P=>{ P.rect(1,2,18,24,'#3e4650'); P.rect(3,5,14,21,'#2a2a30'); P.rect(10,5,1,21,'#141418'); P.ell(8,16,.9,.9,'#8a6a2a'); P.ell(12,16,.9,.9,'#8a6a2a'); P.poly([[0,3],[10,0],[20,3]],'#22262c'); });
  Object.assign(SPR,{xf_gate:['x'], xf_wolfL:['x'], xf_wolfR:['x'], xf_xiang:['x'], xf_bowl:['x'], xf_door:['x']});
  Object.assign(SPRC,{xf_gate:gate, xf_wolfL:wolf(1), xf_wolfR:wolf(-1), xf_xiang:xiang, xf_bowl:bowl, xf_door:door}); }

{ const W=24, H=14, G=[...Array(H)].map((_,y)=>[...Array(W)].map((_,x)=>y<=4?'Q':y===5?'Y':y===H-1||x===W-1?'Q':'P'));
  const P=(id,x,y,name,look,extra)=>({type:'npc', id, x, y, look, name, act:'talk', ...(extra||{})});
  const objects=[
    {type:'xf_gate', x:12, y:5, spr:'xf_gate', act:'xfgate', flagText:'萧府', flagInk:'#c8a85a', flagX:32, flagY:22.5, flagSize:7},
    {type:'xf_wolf', x:9, y:6, spr:'xf_wolfL', act:'xfwolf'}, {type:'xf_wolf', x:15, y:6, spr:'xf_wolfR', act:'xfwolf'},
    {type:'xf_door', x:3, y:5, spr:'xf_door', act:'xfdoor'}, {type:'xf_bowl', x:4, y:6, spr:'xf_bowl', act:'xfbowl'},
    {type:'xf_xiang', x:21, y:6, spr:'xf_xiang', act:'xfxiang'},
    {type:'jc_willow', x:6, y:11, spr:'jc_willow'}, {type:'jc_willow', x:18, y:11, spr:'jc_willow'},
    {type:'lantern', x:7, y:7}, {type:'lantern', x:17, y:7},
    {type:'jc_barrier', x:22, y:9, spr:'jc_barrier', act:'xfway'}, {type:'jc_barrier', x:22, y:10, spr:'jc_barrier', act:'xfway'},
    P('xf_men',13,7,'门房',{g:'m',skin:1,hair:0,hairColor:0,style:'jin',cloth:7,face:'mid'}),
    P('xf_old',8,10,'扫地的老仆',{g:'m',skin:2,hair:0,hairColor:3,style:'robe',cloth:6,face:'small',beard:'#d8d4cc'}),
    P('xf_kid',3,9,'讨饭的孩子',{g:'m',skin:2,hair:1,hairColor:0,style:'jin',cloth:6,face:'small'}),
    P('xiao',19,6,'萧烬',LOOK_XIAO,{cond:s=>XX.night(s)&&!!s.flags.c3_xj_met&&!s.flags.c3_a4_done}),
  ];
  MAPS.jc_xiaofu={ name:'京城 · 萧府外墙', w:W, h:H, ground:G.map(r=>r.join('')), objects, exits:[{x:0,y:8,to:'jc_dongshi',tx:26,ty:7},{x:0,y:9,to:'jc_dongshi',tx:26,ty:8}] }; }
// 东市 opens east, onto the lane
{ const m=MAPS.jc_dongshi; m.ground=m.ground.map((r,y)=>y===7||y===8?r.slice(0,-1)+'P':r);
  m.exits.push({x:27,y:7,to:'jc_xiaofu',tx:1,ty:8},{x:27,y:8,to:'jc_xiaofu',tx:1,ty:9}); }
On.theme(id=>id==='jc_xiaofu'?'calm':null);

const XFU={
  CHAT:{xf_men:['走开走开。'], xf_old:['（沙——沙——）'], xf_kid:['……'], xiao:['……']},
  gaoLines:()=>[
    ['萧烬','（他看着那块桂花糕，没有接）'],
    ['萧烬','……东市那家？'],
    ['我','嗯。'],
    ['萧烬','（他接过去，掰了一小块，放进嘴里，嚼得很慢）'],
    ['萧烬','我十四岁进这个府。府里的人都怕我。我吃饭蹲在墙角，用手抓。'],
    ['萧烬','只有一个扫地的老头，不怕。他塞给我一块这个。'],
    ['萧烬','……那是我第一回知道，东西可以是甜的。'],
    ['萧烬','（他把剩下的包好，收进袖子里）'],
    ['萧烬','是他让你带的吧。'],
    ['萧烬','……别告诉他我知道了。'],
    {love:{xiao:60}},{flag:'c3_xfu_gao'}],
};
Object.assign(JC.CHAT,XFU.CHAT);
XFU.TALK={
  xf_men:()=>S.flags.c3_a5_win?[['门房','（他靠着门打盹，被你吵醒了）……大人不在。大人最近，不怎么回来。']]
    :S.flags.c3_xj_met?[['门房','（他上下打量你）……你就是那个魁首？'],['门房','大人不见客。'],['门房','……大人说了，你要是来，就说他不在。']]
    :[['门房','走开走开。'],['门房','萧大人府上，不收拜帖，不见客，不施粥。'],['门房','……施粥是有的。那是给狗的。']],
  xf_old:()=>S.flags.c3_xfu_gao?[['扫地的老仆','（他扫着地，没抬头）……他吃了？'],['扫地的老仆','（他笑了，脸上的皱纹全挤在一起）吃了就好，吃了就好。']]
    :S.flags.c3_xfu_ask?[['扫地的老仆','桂花糕，东市小吃铺就有。'],['扫地的老仆','别说是我。']]
    :[['扫地的老仆','（沙——沙——）这府里的主人，换过三回了。我没换。'],
      ['扫地的老仆','现在这位，是十几年前来的。那时候他还是个半大孩子，从街上带进来的。'],
      ['扫地的老仆','不说话，不睡床，吃饭蹲在墙角，用手抓生肉。府里的丫头都怕他，说他是狼变的。'],
      ['扫地的老仆','我不怕。我塞给他一块桂花糕。'],
      ['扫地的老仆','他拿着闻了很久，吃了一口，然后……'],
      ['扫地的老仆','（他停下扫帚）……然后哭了。一点声音都没有。'],
      ['扫地的老仆','如今他是大人了，什么都有。可我总觉得，他什么都没有。'],
      ...(S.flags.c3_xj_met?[['扫地的老仆','（他看了你一眼）你……见过他吧？'],['扫地的老仆','你要是再见着他，替我带一块桂花糕。'],['扫地的老仆','……别说是我。'],{flag:'c3_xfu_ask'}]:[])],
  xf_kid:()=>[['讨饭的孩子','（他盯着角门边那碗肉）'],['讨饭的孩子','……那是给狗的。我知道。'],['讨饭的孩子','可是，有一回，那碗边上，多放了两个馒头。'],
    ...(S.stones>=5?[{choice:'给他点什么？', options:[{text:'给他 5 灵石买包子', fn:()=>{ S.stones-=5; UI.hud(); save(); UI.say([['讨饭的孩子','（他攥着灵石跑了，跑出去几步，又回头冲你鞠了一躬）']]); }},{text:'走开', fn:()=>{}}]}]:[])],
};
On.talk(id=>{ if(RT.mapId!=='jc_xiaofu') return false;
  if(id==='xiao'){ C3.menu('xiao',[['萧烬','（他蹲在墙角，正往那只石碗里插一炷香。香头冲着北边）'],['萧烬','……又是你。'],
    ...(S.flags.c3_xfu_xiang?[['萧烬','坐吧。']]:[['萧烬','（他没回头）北边是狼山。'],['萧烬','今天是她的日子。'],['旁白','他没说「她」是谁。你也没问。'],{flag:'c3_xfu_xiang'},{love:{xiao:20}}])]); return true; }
  const L=XFU.TALK[id]; if(!L) return false; UI.say(typeof L==='function'?L():L,()=>{ UI.hud(); Story.check(); }); return true; });
On.act('xfgate',o=>UI.say([['旁白','黑漆的大门，铜环擦得锃亮。门匾上只有两个字：萧府。'],['旁白','门关着。门缝里，隐约有狼的气味。']]));
On.act('xfwolf',o=>UI.say(S.flags.c3_xfu_wolf?[['旁白','两只石狼，一左一右，盯着这条街。']]:[
  ['旁白','门口蹲着两只石兽。远看像狮子，可是没有鬃毛。'],
  ['旁白','你走近一看——是狼。脸长，耳尖，头上涂着一层暗红，眼睛小小的，像老鼠。'],
  ['我','（赤首鼠目……猲狙。）'],
  ...(S.flags.c3_xj_met?[['我','（他把狼摆在门口，当石狮子用。）']]:[['我','（谁家门口，会摆两只狼？）']]),
  {flag:'c3_xfu_wolf'}]));
On.act('xfdoor',o=>UI.say([['旁白','角门。门槛上有好几道爪子抓过的印子，深深浅浅的。']]));
On.act('xfbowl',o=>UI.say([['旁白','角门边上放着一只粗陶碗，碗里是新切的生肉。'],['旁白','碗边上，还有两个白面馒头。']]));
On.act('xfxiang',o=>UI.say(XX.night(S)&&S.flags.c3_xj_met&&!S.flags.c3_a4_done?[['旁白','石碗里插着一炷新香，香头冲着北边。']]:[['旁白','墙角有一只小小的石碗，碗里积满了香灰。'],['旁白','所有的香，都插得朝着北边。']]));
On.act('xfway',o=>UI.say([['旁白','再往东是别家的府邸，一家比一家的门高。'],['旁白','巡街的兵丁在那边转来转去。没有事，还是别过去了。']]));
// the 桂花糕 the old man asked you to bring him
{ const _g=Social.give; Social.give=(id,item)=>{ if(id==='xiao'&&item==='jc_gao'&&S.flags.c3_xfu_ask&&!S.flags.c3_xfu_gao){ const r=Social.rel(id);
    addItem(item,-1); r.gifted=S.day; r.known[item]='like'; Sound.coin(); save(); return UI.say(XFU.gaoLines(),()=>{ UI.hud(); save(); }); } return _g(id,item); }; }

/* ============================================================
   护城河 · 河灯与垂钓 — from dusk until curfew the 花铺 sells 河灯; take one down the stone steps, write a wish on it and
   let it go (one a day): for 大师兄, for the people who went missing, for a name you don't tell anyone, or for nothing.
   Lanterns drift on the water all evening. And the 船家 will lend you a rod: the river gives up 鲤 and 银鱼, and once,
   something else — a child's silver 长命锁 engraved 「柳河 · 穗」. 青禾 knows whose it is.
   ============================================================ */
Object.assign(ITEMS,{
  jc_deng:{name:'河灯', icon:'i_flower', color:'#e8a050', sell:2, desc:'纸扎的莲花灯，中间一截小蜡烛。花铺黄昏才卖。'},
  jc_lock:{name:'长命锁', icon:'i_slip', color:'#c8c8d0', sell:1, desc:'护城河里钓上来的银长命锁，锁面刻着「柳河」，背面刻着一个「穗」字。'},
});
const HD={
  dusk:()=>S.min>=18*60&&S.min<21*60,
  st(){ const c=C3.st(); c.hd=c.hd||{}; return c.hd; },
  live:[],                                                    // the lanterns you let go, drifting
  WHO:['xie','tang','ge','xiao'],
};
// the 花铺 sells 河灯 from dusk
{ const _s=SHOP3.stall; SHOP3.stall=o=>{ if(RT.mapId==='jc_dongkou'&&o.act==='zyflower'&&HD.dusk()){ SHOP3.sell('花铺',[['flower',15],['jc_deng',5]]); return true; } return _s(o); }; }
MAPS.jc_dongkou.objects.push({type:'hd_stair', x:8, y:12, spr:'hd_stair'}, {type:'hd_step', x:9, y:12, spr:'hd_step', act:'hdstep'});
// the stone steps down to the water: you can stand on them (and fish from them)
On.enter(id=>{ if(id==='jc_dongkou') RT.solid[12][8]=false; });
{ const c=FineArt.paint(20,14,P=>{ P.rect(1,2,18,4,'#8a857a'); P.rect(1,2,18,1,'#a8a294'); P.rect(3,6,14,4,'#7a756a'); P.rect(5,10,10,3,'#6a645c'); P.rect(5,12,10,1,'#4a6a7a'); });
  const b=FineArt.paint(18,16,P=>{ P.rect(1,0,16,5,'#7a756a'); P.rect(1,0,16,1,'#a8a294'); P.rect(2,5,14,3,'#8a857a'); P.rect(2,5,14,1,'#a8a294');   // a ledge, lanterns waiting on it
    for(const x of [5,12]){ P.poly([[x-3,3],[x,0],[x+3,3]],'#e85a6a'); P.rect(x-3,3,6,1,'#f0a0a8'); } });
  SPR.hd_stair=['x']; SPRC.hd_stair=c; SPR.hd_step=['x']; SPRC.hd_step=b; }
On.act('hdstep',o=>{ const h=HD.st();
  if(!HD.dusk()) return UI.say([['旁白','河埠头。几级石阶一直伸进水里。'],['船家','到了黄昏，这里全是放河灯的人。']]);
  if(h.day===S.day) return UI.say([['旁白','你的河灯已经漂远了。河面上，还有别人的灯，一盏一盏的。']]);
  if(!count(S,'jc_deng')) return UI.say([['旁白','河面上漂着好多河灯。岸上的人蹲着，一盏一盏往水里放。'],['旁白','（花铺黄昏卖河灯。）']]);
  const who=HD.WHO.filter(id=>NPCS[id]&&Social.hearts(id)>=2);
  UI.say([['旁白','你蹲在石阶上，点亮了河灯。灯芯边上，有一张小纸条，可以写一句话。'],{choice:'你写——', options:[
    {text:'「大师兄」', fn:()=>HD.let('xiong')},
    {text:S.flags.c3_a5_win?'「愿回来的人，都好好的」':'「愿不见了的人，都能回家」', fn:()=>HD.let('home')},
    ...(who.length?[{text:'写一个名字', fn:()=>UI.say([{choice:'写谁的名字？', options:[...who.map(id=>({text:NPCS[id].name, fn:()=>HD.let('name',id)})),{text:'算了', fn:()=>HD.let('none')}]}])}]:[]),
    ...(HD.more||[]).map(f=>f()).filter(Boolean),
    {text:'什么也不写', fn:()=>HD.let('none')}]}]); });
HD.let=(k,id)=>{ const h=HD.st(); h.day=S.day; h.n=(h.n||0)+1; addItem('jc_deng',-1); if(id) Social.add(id,30); save();
  HD.live.push({x:8.5, y:13.2, t:0, seed:Math.random()*9});
  UI.say({
    xiong:[['旁白','你在纸条上写了两个字：大师兄。'],['旁白','河灯晃了晃，慢慢漂了出去。'],['我','（……安平村的牌位裂了。可这盏灯，是亮的。）']],
    home:S.flags.c3_a5_win?[['旁白','河灯漂出去，混进了别人的灯里。'],['旁白','你分不清哪一盏是你的了。这样也好。']]
      :[['旁白','你写好了，把河灯放进水里。'],['旁白','它往东漂。宗庙那边。'],['我','（……等着。）']],
    name:[['旁白',`你在纸条上写了一个名字。写得很小。`],['旁白','你没有告诉任何人，你写的是谁。'],['旁白','河灯漂远了。']],
    none:[['旁白','你什么也没写。'],['旁白','空着的河灯，漂得最远。']],
  }[k],()=>{ UI.hud(); Story.check(); }); };
// lanterns on the water from dusk till curfew, and yours, drifting east
On.draw(({g,T,ox,oy})=>{ if(RT.mapId!=='jc_dongkou') return; const dusk=HD.dusk();
  const lamp=(x,y,a)=>{ const px=ox+x*T, py=oy+y*T, s=T*.22; g.globalAlpha=a; g.fillStyle='rgba(255,180,90,.22)'; g.beginPath(); g.ellipse(px,py+s*.6,s*2.2,s*.8,0,0,Math.PI*2); g.fill();
    g.fillStyle='#e85a6a'; g.beginPath(); g.moveTo(px-s,py); g.lineTo(px,py-s*1.2); g.lineTo(px+s,py); g.closePath(); g.fill();
    g.fillStyle='#f0a0a8'; g.fillRect(px-s,py,s*2,s*.35); g.fillStyle='#ffe08a'; g.fillRect(px-s*.15,py-s*.6,s*.3,s*.5); g.globalAlpha=1; };
  if(dusk) for(let k=0;k<9;k++){ const x=((k*2.9+RT.t*.12)%27)-.5, y=13.6+(k%3)*1.2+Math.sin(RT.t*.7+k)*.12; lamp(x,y,.9); }
  for(const l of HD.live){ l.t+=1/60; lamp(l.x+l.t*.35, l.y+Math.min(1.6,l.t*.25)+Math.sin(l.t+l.seed)*.08, Math.max(0,1-l.t/40)); }
  HD.live=HD.live.filter(l=>l.t<40); });
// the 船家 lends a rod
ZY.TALK.zy_boatman=()=>[['船家','护城河绕城一圈。黄昏放河灯，好看着呢。'],
  ...(S.inv.rod?[['船家','钓鱼？埠头那边水深，鲤鱼肥。']]:[['船家','想钓鱼？（他从船舱里摸出一根旧竿子）拿去，用完放船上就成。'],{run:()=>{ addItem('rod',1); UI.toast('借到一根钓竿'); }}]),
  ['船家','就是最近，夜里总有空船往东边宗庙那头划。不点灯。']];
// what the river gives up
{ const _p=Mini.fishPick; Mini.fishPick=function(){ if(typeof RT!=='undefined'&&RT.mapId==='jc_dongkou'&&!S.flags.c3_hd_lock&&!count(S,'jc_lock')&&Math.random()<.3) return {id:'jc_lock', speed:.9, jumpy:.7};
  return _p.apply(Mini,arguments); }; }
// 青禾 knows whose it is
{ const _g=Social.give; Social.give=(id,item)=>{ if(id==='qinghe'&&item==='jc_lock'&&!S.flags.c3_hd_lock){ const r=Social.rel(id);
    addItem(item,-1); r.gifted=S.day; r.known[item]='love'; Social.add('qinghe',100); S.flags.c3_hd_lock=true; Sound.coin(); save();
    return UI.say([['青禾','（她接过那把锁，翻过来，看见那个「穗」字，手停住了）'],['青禾','……小穗。'],['青禾','我们村的。东头李家的闺女，那年才六岁。生下来体弱，她娘求了这把锁，天天给她戴着。'],
      ['青禾','那天晚上，她也被带走了。'],['青禾','你说……是在护城河里钓上来的？'],['青禾','（她把锁攥紧了）那她，是从河上走的。'],
      ...(S.flags.c3_a5_win?[['青禾','（她忽然站起来）放出来的那些人里——有一个小姑娘，脖子上空空的。'],['青禾','我这就去。我给她，戴回去。']]
        :[['青禾','我替她收着。'],['青禾','等她回来。']])],()=>{ UI.hud(); save(); }); } return _g(id,item); }; }
