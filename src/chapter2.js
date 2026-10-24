/* ============================================================
   山海问道 · 第二章 第一幕「入门」 — the master takes you from 桃源镇 to your sect.
   传送阵: town ⇄ sect ⇄ 风眼 (the 狂暴穷奇 rematch), any time, no walking.
   The sect: one layout, four looks (roof colour, ground, props). 大师兄 陆正衡, 大师姐 谢霁月, 二师兄 何满仓
   each hand you one chore a day for three days; then the master sends the four of you to the 秘境 (第二幕, to come).
   ============================================================ */
Object.assign(SPR, {
  c2_portal:['................','....eeeeeeee....','..eeuuuuuuuuee..','.euulqqqqqqluue.','eulqql.xx.lqqlue','.euulqqqqqqluue.','..eeuuuuuuuuee..','....eeeeeeee....'],
  c2_dummy:['.....tttt.......','....tTttTt......','....tttttt......','.....tTTt.......','..nnnnnnnnnn....','..NnnnnnnnnN....','......nn........','.....tttt.......','.....tTTt.......','......nn........','......nn........','......nn........','......nN........','.....NNNN.......'],
  c2_leaves:['................','................','....o..y........','..yoOo.oy..o....','.oyOyoyOyoOy....','..OyoyOyoyo.....'],
  c2_stele:['....eeee....','...ezzzze...','..ezzzzzze..','..ezrzzrze..','..ezzzzzze..','..ezrrrrze..','..ezzzzzze..','..ezzrzzze..','..ezzrzzze..','..ezzzzzze..','..EEEEEEEE..','.EEEEEEEEEE.'],
  c2_stove:['................','.....EEEEEE.....','....EeeeeeeE....','....EEEEEEEE....','..rRRRRRRRRRRr..','..RrrRrrRrrRrR..','..RRRRRRRRRRRR..','..RrN.oyyo.NrR..','..RrN.yoxy.NrR..','..RRRRRRRRRRRR..','..NNNNNNNNNNNN..'],
  c2_sword:['.....yy.....','.....nn.....','.....nn.....','..yyyyyyyy..','.....xe.....','.....xe.....','.....xe.....','.....xe.....','.....xe.....','.....xe.....','.....xe.....','...EEEEEE...','..EeeeeeeE..','.EeeeeeeeeE.'],
  c2_star:['....YYYYYYYY....','..YYyyyyyyyyYY..','.YyybbbbbbbbyyY.','YyybbxbbbbbxbbyY','YybbbbbbxbbbbbyY','YyybbbxbbbbbbyyY','.YyybbbbbbbbyyY.','..YYyyyyyyyyYY..','....YYYYYYYY....','.......NN.......','......NNNN......'],
  c2_fence:['................','.n...n...n...n..','nnnnnnnnnnnnnnnn','.N...N...N...N..','.n...n...n...n..','nnnnnnnnnnnnnnnn','.N...N...N...N..','.N...N...N...N..'],
});
Object.assign(ITEMS, {
  c2_soup:{name:'灵菇汤', icon:'i_lingmo', quest:true, desc:'你在宗门膳堂煮的一锅灵菇汤，香气飘满了半座山。'},
});
Object.assign(ITEMS.hu_wei, {keep:true, sell:0, desc:'九尾狐留下的一缕尾毛，暖暖的。好像在什么时候会派上用场——不能卖，也不能送人。'});   // needed in act four

/* ---------- the three seniors ---------- */
const LOOK_LU ={g:'m',skin:1,hair:0,hairColor:0,style:'robe',cloth:5};
const LOOK_XIE={g:'f',skin:0,hair:4,hairColor:0,style:'qun',cloth:1};
const LOOK_MAN={g:'m',skin:2,hair:1,hairColor:1,style:'jin',cloth:7};
const LOOK_ZHISHI={g:'m',skin:2,hair:0,hairColor:2,style:'robe',cloth:3};   // 许执事 keeps the sect's little shop
Object.assign(NPCS, {
  lu: {name:'陆正衡', loves:['juqi'], likes:['huichun','hide','lingcao'], hates:['flower','wine']},
  xie:{name:'谢霁月', loves:['flower','wine'], likes:['lingcao','huichun','zhuguo'], hates:['hide','qq_yu']},
  man:{name:'何满仓', loves:['zhuguo','lingmo'], likes:['wine','huichun','juqi','lingcao'], hates:['flower']},
  zhishi:{name:'许执事', shop:true, loves:['wine'], likes:['lingcao','hide','zhuguo'], hates:['flower']},
});
Object.assign(TALK, {
  lu:[['门规第一条：不得懈怠。','练功不可一日荒废。'],
      ['你的根基比我想的扎实。','修道之人，当惩恶扬善——这是我入门那天，师尊教我的第一句话。'],
      ['我下山除过不少妖。有个村子，至今还给我立着长生牌位。','名声？名声是修士的第二条命。'],
      ['{称}，你比我当年强。……这话别让满仓听见。']],
  xie:[['……有事？','（她看了你一眼，又低头擦剑。）'],
       ['外面的人怎么说我，你不必在意。我也不在意。','剑比人可靠。'],
       ['你和他们不一样。你看我的时候，看的是我的剑。','……谢谢你上次的花。'],
       ['{称}，以后有人欺负你，报我的名字。']],
  man:[['{称}！饿不饿？我、我这里有馒头……半个。','膳堂的饭总是不够吃，你说奇不奇怪？'],
       ['我小时候住的村子，叫丰年村。名字很好听吧？','师尊说我吃得多，是长身体。可我怎么一直不长呢……'],
       ['{称}，你知道吗，饭要趁热吃，凉了就……就没了。','我有时候会做梦，梦里怎么吃都吃不饱。'],
       ['有你在，膳堂都热闹了。……这块饼，分你一半。']],
  zhishi:[['要点什么？宗门弟子，不加价。','钓竿、丹药、杂货，桃源镇有的我这儿大多也有。'],
          ['你师兄满仓？他是我这儿的老主顾，干粮一买就是一大包。','山下的钱掌柜？我们是老相识了，他进货，我转手。'],
          ['给你留了几样好货，别告诉别人。','修行再忙，也别忘了吃饭。'],
          ['{称}，以后缺什么，说一声就行。']],
});

/* ---------- the sect: one layout, four looks ---------- */
const C2_GROUND=[
'WWWWWWWWWWWWWWWWWWWWWWWWWW',
'W........................W',
'W........................W',
'W........................W',
'W...........==...........W',
'W.AAAAAA.##########.BBBBBW',
'W.AAAAAA.##########.BBBBBW',
'W.AAAAAA.##########.BBBBBW',
'W.AAAAAA....==......BBBBBW',
'W.AAAAAA....==......BBBBBW',
'W...........==...........W',
'W...........==...........W',
'W...........==...........W',
'W...........==...........W',
'W..=================.....W',
'W...........==...........W',
'W~~~~~......==......,,,,,W',
'W~~~~~......==......,,,,,W',
'W~~~~.......==...........W',
'WWWWWWWWWWWWWWWWWWWWWWWWWW'];
const C2_LOOK={
  jian:  {A:'#', B:'#', roof:['#1f2e3f','#2b3f56','#3a5574','#6a8bb0'], props:[['c2_sword',7,2],['c2_sword',18,2],['c2_sword',17,9]]},
  dan:   {A:'#', B:',', roof:['#1f3a24','#2b5232','#3b6e43','#6aa36a'], props:[['furnace',7,2],['furnace',18,2],['herb',17,9]]},
  shou:  {A:':', B:'.', roof:['#3a2614','#553820','#704b2c','#a37848'], props:[['dangkang',7,2],['xingxing',18,2],['c2_fence',16,9],['c2_fence',17,9],['c2_fence',18,9]]},
  tianji:{A:'#', B:'#', roof:['#2a1f3f','#3d2c5a','#523d78','#8a73b8'], props:[['c2_star',7,2],['c2_star',18,2],['c2_star',17,9]]},
};
const zongId=()=>'zong_'+(S&&S.sect||'jian');
for(const k in SECTS){ const L=C2_LOOK[k], sc=SECTS[k], m=sc.master, mine=s=>s.sect===k;
  MAPS['zong_'+k]={ name:sc.name, w:26, h:20, ground:C2_GROUND.map(r=>r.replace(/A/g,L.A).replace(/B/g,L.B)),
    objects:[
      {type:'building', x:9, y:1, w:8, h:3, style:'house', roof:L.roof, label:sc.name+' · 主殿', door:[12,4]},
      {type:'building', x:1, y:11, w:5, h:3, style:'house', roof:L.roof, label:'你的房间', door:[3,14], act:'c2bed'},
      {type:'building', x:6, y:11, w:5, h:3, style:'house', roof:L.roof, label:'二师兄的房间', door:[8,14], act:'c2room'},
      {type:'building', x:17, y:11, w:6, h:3, style:'shop', label:'膳堂', door:[19,14], act:'c2kitchen'},
      {type:'npc', id:m.id, x:15, y:5, look:m.look, name:m.name, act:'talk', cond:mine},
      {type:'npc', id:'lu',  x:5, y:8,  look:LOOK_LU,  name:'陆正衡', act:'talk', cond:s=>mine(s)&&!s.flags.c2_depart},
      {type:'npc', id:'xie', x:24, y:6, look:LOOK_XIE, name:'谢霁月', act:'talk', cond:s=>mine(s)&&!s.flags.c2_depart},
      {type:'npc', id:'man', x:17, y:15, look:LOOK_MAN, name:'何满仓', act:'talk', cond:s=>mine(s)&&!s.flags.c2_depart},
      {type:'npc', id:'zhishi', x:16, y:12, look:LOOK_ZHISHI, name:'许执事', act:'talk', cond:mine},
      {type:'sign', x:16, y:10, text:'小卖部　——　许执事。钓竿、丹药、杂货，宗门弟子不加价。'},
      {type:'mailbox', x:5, y:15, act:'mail', spr:'mailbox'},
      ...(k==='dan'?[{type:'npc', id:'tang', x:23, y:9, look:LOOK_TANG, name:'苏小棠', act:'talk', cond:s=>s.sect==='dan'&&!!s.flags.c2_arrive}]:[]),
      {type:'c2_dummy', x:3, y:6, spr:'c2_dummy', act:'dummy'},{type:'c2_dummy', x:6, y:6, spr:'c2_dummy', act:'dummy'},
      {type:'furnace', x:22, y:6, act:'alchemy'},
      {type:'gather', x:20, y:8, item:'lingcao', spr:'herbspot'},{type:'gather', x:22, y:8, item:'lingcao', spr:'herbspot'},{type:'gather', x:24, y:8, item:'lingcao', spr:'herbspot'},{type:'gather', x:21, y:9, item:'lingcao', spr:'herbspot'},
      {type:'gather', x:8, y:9, item:'lingmo', spr:'mushspot'},
      {type:'sign', x:21, y:3, text:'往上是后山　——　灵菇、朱果，还有一口池塘。'},
      {type:'c2_stove', x:21, y:15, spr:'c2_stove', act:'stove'},
      {type:'c2_portal', x:10, y:17, spr:'c2_portal', act:'portal'},
      {type:'sign', x:14, y:17, text:sc.name+'　——　山门。旁边的传送阵通往桃源镇。'},
      {type:'c2_stele', x:2, y:2, spr:'c2_stele', act:'stele', id:'st0'},{type:'c2_stele', x:23, y:2, spr:'c2_stele', act:'stele', id:'st1'},{type:'c2_stele', x:8, y:17, spr:'c2_stele', act:'stele', id:'st2'},
      ...[[11,16],[14,15],[11,18],[14,18],[15,16]].map(([x,y],i)=>({type:'c2_leaves', x, y, spr:'c2_leaves', act:'leaf', li:i, cond:s=>C2.task('lu')==='sweep'&&s.c2.got.lu===1&&!s.c2.p.leaves.includes(i)})),
      {type:'lantern', x:11, y:10},{type:'lantern', x:14, y:10},
      {type:'pine', x:1, y:9},{type:'pine', x:24, y:11},{type:'pine', x:24, y:18},{type:'tree', x:4, y:2},{type:'tree', x:21, y:2},
      ...L.props.map(([spr,x,y])=>spr==='herb'?{type:'gather', x, y, item:'lingcao', spr:'herbspot'}:spr==='furnace'?{type:'furnace', x, y}:{type:'deco', x, y, spr}),
    ],
    exits:[{x:19,y:0,to:'c2_houshan',tx:10,ty:14},{x:20,y:0,to:'c2_houshan',tx:11,ty:14}]};
  // the mountain path behind the hall: east of it along the front, then up to the 后山
  const G=MAPS['zong_'+k].ground.map(r=>r.split('')); for(let x=14;x<=20;x++) G[4][x]='='; for(let y=0;y<4;y++){ G[y][19]='='; G[y][20]='='; } MAPS['zong_'+k].ground=G.map(r=>r.join(''));
}
// 后山: one hill behind every sect (each sect's own path leads up to it, and back down to it)
{ const W=22, H=16, R=rng(2024), G=[...Array(H)].map((_,y)=>[...Array(W)].map((_,x)=>(x===0||y===0||x===W-1||y===H-1)?'W':'.'));
  for(let y=2;y<H;y++){ G[y][10]='='; G[y][11]='='; } for(let x=6;x<=16;x++) G[8][x]='=';
  for(let y=3;y<=5;y++) for(let x=2;x<=7;x++) if(!(y===5&&(x===2||x===7))) G[y][x]='~';
  for(const [x,y] of [[3,10],[4,10],[15,3],[16,3],[18,11],[19,11],[5,13],[14,13],[8,2],[13,2]]) G[y][x]=R()<.5?',':':';
  const objects=[
    {type:'gather', x:15, y:11, item:'lingmo', spr:'mushspot'},{type:'gather', x:17, y:13, item:'lingmo', spr:'mushspot'},{type:'gather', x:6, y:11, item:'lingmo', spr:'mushspot'},
    {type:'gather', x:14, y:5, item:'zhuguo', spr:'fruitspot'},{type:'gather', x:17, y:5, item:'zhuguo', spr:'fruitspot'},{type:'gather', x:19, y:8, item:'zhuguo', spr:'fruitspot'},
    {type:'sign', x:12, y:13, text:'后山　——　往下回宗门。'},
    {type:'pine', x:2, y:8},{type:'pine', x:4, y:1},{type:'pine', x:19, y:2},{type:'pine', x:20, y:12},{type:'pine', x:1, y:13},{type:'tree', x:8, y:5},{type:'tree', x:15, y:8},{type:'tree', x:3, y:13},{type:'tree', x:18, y:3},{type:'pine', x:8, y:12},
  ];
  const back=(x,tx)=>{ const e={x, y:H-1, tx, ty:1}; Object.defineProperty(e,'to',{enumerable:true, get:()=>zongId()}); return e; };
  G[H-1][10]='='; G[H-1][11]='=';
  MAPS.c2_houshan={ name:'后山', w:W, h:H, ground:G.map(r=>r.join('')), objects, exits:[back(10,19),back(11,20)] }; }
// roofs in the sect's colour
{ const _b=building; building=function(o){ if(!o.roof) return _b(o); const k=o.style+o.w+'x'+o.h+o.roof.join(''); if(BLDC[k]) return BLDC[k];
    const sv=o.style;
    // paint with the house painter, then recolour its roof tones
    const c=_b({...o, roof:undefined}); const out=document.createElement('canvas'); out.width=c.width; out.height=c.height; const g=out.getContext('2d'); g.drawImage(c,0,0);
    const from=(sv==='shop'?['#22384f','#2e4a68','#3d5f84','#5a7fa6']:['#4a1f1f','#642a2a','#7e3636','#a0504a']).map(ART.rgb), to=o.roof.map(ART.rgb);
    const img=g.getImageData(0,0,out.width,out.height), D=img.data;
    for(let i=0;i<D.length;i+=4) for(let j=0;j<4;j++) if(D[i]===from[j][0]&&D[i+1]===from[j][1]&&D[i+2]===from[j][2]){ D[i]=to[j][0]; D[i+1]=to[j][1]; D[i+2]=to[j][2]; break; }
    g.putImageData(img,0,0); out.bottom=c.bottom; return BLDC[k]=out; }; }

// the masters leave town with you; 苏小棠 moves to 药王谷 if that is your sect
for(const o of MAPS.town.objects) if(o.id&&/^m_/.test(o.id)){ const c=o.cond; o.cond=s=>c(s)&&!s.flags.c2_arrive; }
{ const t=MAPS.town.objects.find(o=>o.id==='tang'); if(t){ const c=t.cond; t.cond=s=>(!c||c(s))&&!(s.sect==='dan'&&s.flags.c2_arrive); } }
// npcAt: skip people who aren't there right now (the master in town vs. in the sect)
npcAt=function(id){ for(const m in MAPS) for(const o of MAPS[m].objects) if(o.id===id&&(!o.cond||!S||o.cond(S))) return [m,o.x,o.y,o.name]; return null; };

/* ---------- 传送阵 ---------- */
MAPS.town.objects.push({type:'c2_portal', x:21, y:5, spr:'c2_portal', act:'portal', cond:s=>!!s.flags.c2_arrive||Portal.fx(s)});
MAPS.fx3.objects.push({type:'c2_portal', x:12, y:2, spr:'c2_portal', act:'portal', cond:s=>Portal.fx(s)});
MAPS.home.objects.push({type:'c2_portal', x:14, y:6, spr:'c2_portal', act:'portal', cond:s=>!!s.flags.c2_arrive||Portal.fx(s)});
MAPS.forest.objects.push({type:'c2_portal', x:12, y:2, spr:'c2_portal', act:'portal', cond:s=>!!s.flags.c2_arrive||Portal.fx(s)});
const Portal={
  fx:s=>!!s.flags.qiongqi_done&&!!s.sect&&s.L>=10,
  dests(){ return [
    {name:'桃源镇', map:'town', x:21, y:6},
    {name:'洞府', map:'home', x:14, y:7},
    {name:'青丘山林（钓鱼、打妖兽）', map:'forest', x:12, y:3},
    ...(S.flags.c2_arrive?[{name:SECTS[S.sect].name, map:zongId(), x:11, y:17}]:[]),
    ...(Portal.fx(S)?[{name:'风眼 · 狂暴穷奇', map:'fx3', x:12, y:3}]:[]),
  ].filter(d=>d.map!==RT.mapId); },
  open(){ Sound.magic(); UI.say([{choice:'传送阵泛着淡淡的青光。要去哪里？', options:[...Portal.dests().map(d=>({text:d.name, fn:()=>Portal.go(d)})), {text:'不去了', fn:()=>{}}]}]); },
  go(d){ RT.path=[]; RT.pending=null; RT.keys=[]; RT.paused=true; Sound.magic();
    RT.fadeTo=()=>{ enterMap(d.map,d.x,d.y); RT.dir='down'; RT.paused=false; UI.sync(); save(); UI.toast('传送到了：'+d.name); Story.check(); if(RT.autoNav) Nav.go(true); }; },
};

/* ---------- quests ---------- */
const C2_LOCKED=!!window.CH2_LOCKED;   // the live site: no way into chapter 2 yet
{ const e=QUESTS.find(q=>q.id==='end');
  if(C2_LOCKED) e.check=s=>!!s.flags.c2_arrive;   // only saves already in the sect move on
  else Object.assign(e, {title:'拜别桃源镇', desc:'第一章完。师尊在桃源镇广场等你——准备好了就去找师尊，随他回宗门（之后随时能用传送阵回来）。',
    check:s=>!!s.flags.c2_arrive, target:s=>s.sect?npcAt(SECTS[s.sect].master.id):['town',12,7,'测灵石']}); }
QUESTS.push(
  {id:'c2b', title:'宗门日常', desc:'大师兄、大师姐、二师兄每天会各派给你一件事。做完三天的功课，熟悉宗门。', check:s=>(s.c2&&s.c2.days||0)>=3,
    progress:s=>`第 ${Math.min(3,(s.c2&&s.c2.days||0)+1)} 天 · 已完成 ${s.c2&&s.c2.days||0}/3 天`, target:s=>['zong_'+s.sect,15,5,'宗门']},
  {id:'c2c', title:'师尊召见', desc:'三天的功课做完了。师尊在主殿前等你们。', start:'c2_summon', check:s=>!!s.flags.c2_order, target:s=>npcAt(SECTS[s.sect].master.id)},
  {id:'c2d', title:'山门集合', desc:'师尊命你们四人去秘境历练。明日一早，到山门找大师兄集合。', check:s=>!!s.flags.c2_depart, target:s=>['zong_'+s.sect,12,16,'山门（找大师兄）']});

const sectName=()=>SECTS[S.sect].name, master=()=>SECTS[S.sect].master.name;
const C2S={
  depart:()=>{ const m=master(); return [
    [m,'{称}，桃源镇的事，你做得很好。'],
    [m,'是时候随为师回宗门了。你那几位师兄师姐，等你很久了。'],
    {choice:'现在就随师尊回'+sectName()+'吗？（之后可以用传送阵随时回来）', options:[
      {text:'跟师尊走', fn:()=>UI.say(C2S.leave())},
      {text:'再等等', fn:()=>UI.say([[m,'也好。准备好了，再来找为师。']])}]}]; },
  leave:()=>{ const m=master(); return [
    ['旁白','云游子、钱掌柜和阿禾，都来镇口送你。'],
    ['阿禾','{名}！你要常回来看我们呀！'],
    ['云游子','去吧。桃源镇永远是你的家。'],
    ['旁白',m+'袖袍一卷，你们脚下亮起一圈青光——'],
    {run:()=>{ RT.paused=true; RT.fadeTo=()=>{ S.flags.c2_arrive=true; S.c2=C2.fresh(); enterMap(zongId(),12,15); RT.dir='up'; RT.paused=false; UI.sync(); save(); UI.say(C2S.arrive(), ()=>{ UI.hud(); Story.check(); }); }; }}]; },
  arrive:()=>{ const m=master(), sn=sectName(); return [
    ['旁白','青光散去，眼前是云雾缭绕的山门——'+sn+'。'],
    [m,'这就是我'+sn+'。'],
    ['陆正衡','弟子陆正衡，恭迎师尊回山。'],
    ['陆正衡','你就是新来的{称}？我是大师兄。'+sn+'的门规第一条：不得懈怠。'],
    ['谢霁月','……谢霁月。大师姐。'],
    ['旁白','她很美，美得让人不敢多看。可她的眼神冷得像山顶的雪。'],
    ['何满仓','哎呀，可算来了！我是二师兄何满仓！'],
    ['何满仓','{称}饿不饿？我这儿有馒头——'],
    ['旁白','他从袖子里掏出半个馒头，想了想，又塞了回去。'],
    ['何满仓','……那个，晚饭再吃！晚饭我请！'],
    ['陆正衡','满仓。'],
    ['何满仓','是是是，大师兄。'],
    [m,'这几日，让你三位师兄师姐带你熟悉宗门。每天他们会各派给你一件功课，好好学。'],
    [m,'山门前那座传送阵，连着桃源镇。想家了，随时可以回去看看。'],
    ['旁白','（左上角的任务栏里是三位师兄师姐今天的吩咐。先去找他们说说话吧。）']]; },
};
SCRIPTS.c2_summon=[['旁白','三天的功课都做完了。一只纸鹤落在你肩上——是师尊的传召。'],['旁白','（去主殿前找师尊。）']];
const C2_ORDER=()=>{ const m=master(); return [
  [m,'都过来。'],
  [m,'这几日，你们带{称}熟悉宗门，为师都看在眼里。'],
  [m,'北边有一处秘境，近来灵气翻涌。你们四人一同前去历练。一来见见世面，二来……'],
  ['旁白','师尊顿了顿，没有说下去。'],
  [m,'正衡，你是大师兄，路上照看好他们。'],
  ['陆正衡','弟子遵命。'],
  ['何满仓','秘境里……有好吃的吗？'],
  ['谢霁月','……'],
  ['陆正衡','明日一早，山门集合。'],
  {flag:'c2_order'}, {run:()=>{ S.c2.orderDay=S.day; }},
  ['旁白','（第一幕「入门」完。明天一早，去山门找大师兄。）']]; };

/* ---------- the daily chores ---------- */
const C2_TASKS={
  lu:[
    {id:'train', title:'大师兄：练功', ask:['练功场有两个木桩。一共打八下，一下都不能少。'], goal:'在练功场打木桩', need:s=>s.c2.p.dummy>=8, prog:s=>`木桩 ${Math.min(8,s.c2.p.dummy)}/8`,
      tgt:s=>['c2',3,6,'练功场的木桩'], done:[['陆正衡','……招式还算干净。明日继续。']]},
    {id:'sweep', title:'大师兄：扫山门', ask:['山门前落了一地叶子。宗门的脸面，就是山门。','去扫干净。'], goal:'打扫山门前的落叶', need:s=>s.c2.p.leaves.length>=5, prog:s=>`落叶 ${s.c2.p.leaves.length}/5`,
      tgt:s=>{ const L=[[11,16],[14,15],[11,18],[14,18],[15,16]].find((_,i)=>!s.c2.p.leaves.includes(i)); return ['c2',L[0],L[1],'山门前的落叶']; },
      done:[['陆正衡','嗯。'],['旁白','他看了一眼山门，像是在确认一片叶子都没剩。']]},
    {id:'patrol', title:'大师兄：巡视界碑', ask:['宗门四周有三块界碑。去看看，有没有被妖兽碰过。'], goal:'看一看三块界碑', need:s=>s.c2.p.steles.length>=3, prog:s=>`界碑 ${s.c2.p.steles.length}/3`,
      tgt:s=>{ const L=[[2,2],[23,2],[8,17]].find((_,i)=>!s.c2.p.steles.includes('st'+i)); return ['c2',L[0],L[1],'界碑']; },
      done:[['我','第三块界碑底下有几道很深的抓痕，像是……狼的爪子。'],['陆正衡','抓痕？'],['陆正衡','……是旧痕。不必大惊小怪。'],['旁白','他答得很快，像是不想再提。']]},
  ],
  xie:[
    {id:'herb', title:'大师姐：采灵草', ask:['药圃里的灵草熟了。采三株给我。','根要完整。'], goal:'采 3 株灵草交给大师姐', need:s=>count(s,'lingcao')>=3, prog:s=>`灵草 ${Math.min(3,count(s,'lingcao'))}/3`, take:{lingcao:3},
      tgt:s=>count(s,'lingcao')>=3?null:['c2',20,8,'药圃的灵草'], done:[['谢霁月','……根都完整。'],['旁白','她的语气没有变，但把灵草收得很仔细。']]},
    {id:'pill', title:'大师姐：炼丹', ask:['丹房的丹炉空着。炼一颗回春丹给我看看。'], goal:'交给大师姐 1 颗回春丹', need:s=>count(s,'huichun')>=1, prog:s=>`回春丹 ${Math.min(1,count(s,'huichun'))}/1`, take:{huichun:1},
      tgt:s=>count(s,'huichun')>=1?null:['c2',22,6,'丹房的丹炉'], done:[['谢霁月','火候还行。'],['谢霁月','……以后受了伤，自己会治，就不必求人。']]},
    {id:'fruit', title:'大师姐：摘朱果', ask:['后山的朱果。两颗。'], goal:'摘 2 颗朱果交给大师姐', need:s=>count(s,'zhuguo')>=2, prog:s=>`朱果 ${Math.min(2,count(s,'zhuguo'))}/2`, take:{zhuguo:2},
      tgt:s=>count(s,'zhuguo')>=2?null:['c2_houshan',14,5,'后山的朱果'], done:[['谢霁月','嗯。'],['旁白','她把其中一颗朱果放回你手里。'],['谢霁月','这颗，你自己吃。……别告诉满仓。']], give:{zhuguo:1}},
  ],
  man:[
    {id:'cook', title:'二师兄：做饭', ask:['{称}！今晚轮到我做饭，可我一个人忙不过来……','后山有灵菇，采两朵来，到膳堂门口的灶台煮一锅汤！'], goal:'采 2 朵灵菇，在灶台煮一锅汤', need:s=>count(s,'c2_soup')>=1, prog:s=>count(s,'c2_soup')?'汤煮好了':`灵菇 ${Math.min(2,count(s,'lingmo'))}/2`, take:{c2_soup:1},
      tgt:s=>count(s,'c2_soup')?null:count(s,'lingmo')>=2?['c2',21,15,'膳堂门口的灶台']:['c2_houshan',15,11,'后山的灵菇'],
      done:[['何满仓','好香好香！'],['旁白','他一口气喝了三碗，又盯着锅底看了好久。'],['何满仓','……{称}，你做得真好。'],['何满仓','我……我好像还是有点饿。']]},
    {id:'fish', title:'二师兄：钓鱼', ask:['听说后山池塘里有鱼！钓一条来，我们烤着吃！','（没有钓竿的话，桃源镇的钱掌柜那里有卖。）'], goal:'在池塘钓一条鱼交给二师兄', need:s=>!!C2.fish(s), prog:s=>C2.fish(s)?'钓到了':'还没钓到',
      tgt:s=>C2.fish(s)?null:['c2_houshan',5,6,'后山的池塘（选中钓竿，点水面）'], done:[['何满仓','哇——！'],['旁白','鱼还没烤熟，他就已经咽了好几次口水。'],['何满仓','{称}，鱼头给你，鱼身给我……不对不对，鱼身给你！']]},
    {id:'room', title:'二师兄：收拾房间', ask:['{称}……能不能帮我收拾一下房间？','大师兄说今天要查房，我、我那屋有点乱……'], goal:'帮二师兄收拾房间', need:s=>!!s.c2.p.room, prog:s=>s.c2.p.room?'收拾好了':'还没收拾',
      tgt:s=>['c2',8,14,'二师兄的房间'], done:[['何满仓','谢谢你，{称}。'],['旁白','他朝你笑了笑。笑容和平时一样，只是眼睛有点红。']]},
  ],
};
const WHO={lu:'陆正衡', xie:'谢霁月', man:'何满仓'};
const C2={
  fresh:()=>({n:0, got:{lu:0,xie:0,man:0}, p:{dummy:0, leaves:[], steles:[], room:false}, doneDay:-1, days:0, counted:-1}),
  on:()=>!!(S&&S.flags.c2_arrive&&S.c2&&Story.quest()&&['c2b','c2e'].includes(Story.quest().id)),
  inMJ:()=>!!(Story.quest()&&Story.quest().id==='c2e'),
  task(who){ return S&&S.c2?C2_TASKS[who][S.c2.n].id:null; },
  def(who){ return C2_TASKS[who][S.c2.n]; },
  fish(s){ return Object.keys(s.inv).find(k=>k.startsWith('fish_')&&s.inv[k]>0); },
  allDone(){ return ['lu','xie','man'].every(k=>S.c2.got[k]===2); },
  // a new morning brings the next set of chores, once the last set is done
  // (in the 秘境 a new day's chores come with the morning scene instead)
  refresh(){ if(!C2.on()||C2.inMJ()) return; const c=S.c2; if(C2.allDone()&&c.counted===c.n&&c.days<3&&S.day>c.doneDay){ c.n=c.days; c.got={lu:0,xie:0,man:0}; c.p={dummy:0, leaves:[], steles:[], room:false}; UI.hud(); } },
  where(t){ return t&&t[0]==='c2'?[zongId(),t[1],t[2],t[3]]:t; },
  items(){ if(!C2.on()) return []; C2.refresh(); const c=S.c2, out=[];
    if(C2.allDone()) return [C2.inMJ()?{key:'c2_rest', kind:'side', title:'今天的事做完了', progress:'回帐篷休息，明天还有新的吩咐', target:['mj_camp',4,11,'你的帐篷']}
      :{key:'c2_rest', kind:'side', title:'今天的功课做完了', progress:'回房间睡一觉，明天还有新的吩咐', target:[zongId(),3,14,'你的房间']}];
    for(const w of ['lu','xie','man']){ const d=C2.def(w), g=c.got[w]; if(g===2) continue;
      const pos=npcAt(w)||(w==='lu'&&C2.inMJ()?['mj_camp',7,4,'大师兄的帐篷']:null);   // 大师兄 may be inside his tent
      if(g===0) out.push({key:'c2_'+w, kind:'side', title:d.title, progress:'去找'+WHO[w], target:pos});
      else { const ok=d.need(S); out.push({key:'c2_'+w, kind:'side', title:d.title, progress:ok?'回去找'+WHO[w]+'交差':d.prog(S), target:ok?pos:(C2.where(d.tgt(S))||pos)}); } }
    return out; },
  // things that come and go with a chore (the fallen leaves) appear without leaving the map
  sync(){ if(!RT.map) return; for(const o of RT.map.objects){ if(!o.cond||o.type==='building'||o.type==='gather') continue; const want=!!o.cond(S), has=RT.ents.includes(o);
      if(want&&!has){ RT.ents.push(o); RT.solid[o.y][o.x]=true; } else if(!want&&has){ RT.ents=RT.ents.filter(e=>e!==o); RT.solid[o.y][o.x]=false; } } },
  rewards(who){ return [{stones:20},{exp:30},{love:{[who]:40}}]; },
  talk(id){
    if(!S.c2||!S.flags.c2_arrive) return false;
    if(SECTS[S.sect]&&id===SECTS[S.sect].master.id){ return C2.master(); }
    if(!WHO[id]||!C2.on()) return false; C2.refresh();
    const c=S.c2, d=C2.def(id), g=c.got[id];
    if(g===0){ c.got[id]=1; d.accept&&d.accept(S); C2.sync(); UI.hud(); UI.say([...d.ask.map(t=>[WHO[id],t]), ['旁白','（任务：'+d.goal+'。）']]); return true; }
    if(g===1){
      if(!d.need(S)){ UI.say([[WHO[id], {lu:'还没做完？',xie:'……还没好。',man:'不急不急，慢慢来～'}[id]], ['旁白','（'+d.goal+'：'+d.prog(S)+'）']]); return true; }
      if(d.take) for(const k in d.take) addItem(k,-d.take[k]);
      if(d.id==='fish') addItem(C2.fish(S),-1);
      c.got[id]=2;
      UI.say([...d.done, ...(d.give?[{give:d.give}]:[]), ...C2.rewards(id)], ()=>{ C2.check(); UI.hud(); }); return true; }
    return false;
  },
  check(){ const c=S.c2; if(!C2.allDone()||c.counted===c.n) return;   // each set of three chores counts once
    c.counted=c.n; c.days++; c.doneDay=S.day; save();
    if(C2.inMJ()) UI.say([['旁白','今天的事都做完了。天色暗下来，营地里只剩篝火的噼啪声。回帐篷休息吧。']]);
    else if(c.days<3) UI.say([['旁白','今天的功课都做完了。回房间睡一觉，明天还有新的吩咐。']]); else Story.check(); },
  master(){ const m=master(), q=Story.quest()?.id;
    if(q==='c2c'&&!S.flags.c2_order){ UI.say(C2_ORDER(), ()=>{ UI.hud(); Story.check(); }); return true; }
    if(Story.side(SECTS[S.sect].master.id)) return true;
    const lines=q==='c2b'?['你三位师兄师姐，各有各的好处。用心看，用心学。','正衡严，霁月冷，满仓……满仓心善。']:['秘境之行，切莫大意。','修道先修心。'];
    UI.say([[m, lines[S.day%lines.length]]]); return true; },
  act(o){
    switch(o.act){
      case 'portal': Portal.open(); return true;
      case 'dummy': if(C2.on()&&C2.task('lu')==='train'&&S.c2.got.lu===1&&S.c2.p.dummy<8){ S.c2.p.dummy++; Sound.hit(); UI.float(o.x,o.y,`木桩 ${S.c2.p.dummy}/8`); UI.hud(); if(S.c2.p.dummy>=8) UI.toast('练完了，回去找大师兄交差'); }
        else { Sound.hit(); UI.float(o.x,o.y,'啪！'); } return true;
      case 'leaf': { const p=S.c2.p; if(!p.leaves.includes(o.li)) p.leaves.push(o.li); RT.ents=RT.ents.filter(e=>e!==o); RT.solid[o.y][o.x]=false; Sound.pick(); UI.float(o.x,o.y,`落叶 ${p.leaves.length}/5`); UI.hud();
        if(p.leaves.length>=5) UI.toast('扫干净了，回去找大师兄交差'); return true; }
      case 'stele': { const on=C2.on()&&C2.task('lu')==='patrol'&&S.c2.got.lu===1, p=S.c2&&S.c2.p;
        if(on&&!p.steles.includes(o.id)){ p.steles.push(o.id); UI.hud(); }
        const last=o.id==='st2';
        UI.say([['旁白','界碑上刻着「'+sectName()+'」四个大字，完好无损。'], ...(last?[['旁白','碑底下有几道很深的抓痕，已经长了青苔。像是……狼的爪子。']]:[]),
          ...(on&&p.steles.length>=3?[['旁白','（三块界碑都看过了，回去找大师兄交差。）']]:[])]); return true; }
      case 'stove': if(C2.on()&&C2.task('man')==='cook'&&S.c2.got.man===1&&!count(S,'c2_soup')){
          if(count(S,'lingmo')<2) return UI.say([['旁白','灶台上架着一口大锅。还差灵菇——后山能采到。（灵菇 '+count(S,'lingmo')+'/2）']]), true;
          addItem('lingmo',-2); UI.say([['旁白','你生起火，把灵菇切好丢进锅里。'],['旁白','咕嘟咕嘟——香气飘满了半座山。'],{give:{c2_soup:1}},['旁白','（端去给二师兄吧。）']], ()=>UI.hud()); return true; }
        UI.say([['旁白','膳堂门口的灶台，锅还温着。']]); return true;
      case 'c2bed': UI.confirm('回房休息，结束今天？', ()=>{ sleep(false); enterMap(zongId(),3,15); RT.dir='down'; save(); UI.hud(); }); return true;
      case 'c2kitchen': UI.say([['旁白','膳堂里飘着饭香。墙上贴着一张纸：「每人每餐一碗，不得多盛。——陆正衡」'],['旁白','纸的角落里，有人用很小的字添了一句：「能不能两碗」。']]); return true;
      case 'c2room':
        if(C2.on()&&C2.task('man')==='room'&&S.c2.got.man===1&&!S.c2.p.room){ UI.say(C2_ROOM()); return true; }
        UI.say([['旁白','二师兄的房间。门口挂着一串晒干的果子。']]); return true;
    }
    return false;
  },
};
const C2_ROOM=()=>[
  ['旁白','二师兄的房间不大，乱倒是不乱——只是……'],
  ['旁白','床底下、柜子里、枕头边，到处塞着吃的。干粮、馒头、晒干的果子，用油纸和叶子一层层包得整整齐齐。'],
  ['旁白','柜子最里面，有一包点心。你打开油纸——已经发霉了。'],
  {choice:'这包发霉的点心……', options:[
    {text:'扔掉吧', fn:()=>UI.say([
      ['何满仓','别扔！'],
      ['旁白','他不知什么时候站在了门口，一把把点心抢了回去，紧紧抱在怀里。'],
      ['何满仓','还、还能吃的……刮掉外面就能吃……'],
      ['旁白','他说完自己也愣住了。过了好一会儿，才勉强笑了笑。'],
      ['何满仓','……对不起啊，{称}。我就是……就是怕饿。'],
      {run:()=>{ S.c2.p.room=true; S.flags.c2_mold='took'; UI.hud(); }}, ['旁白','（回去找二师兄交差。）']])},
    {text:'原样包好，放回去', fn:()=>UI.say([
      ['旁白','你想了想，把点心原样包好，放回了柜子最里面。'],
      ['何满仓','……谢谢你，{称}。'],
      ['旁白','二师兄站在门口。他没有问你看到了什么，你也没有说。'],
      {run:()=>{ S.c2.p.room=true; S.flags.c2_mold='kept'; UI.hud(); }}, ['旁白','（回去找二师兄交差。）']])}]}];

/* ---------- hooks ---------- */
{ const _t=Story.talk; Story.talk=function(id){
    const q=Story.quest()?.id;
    if(!C2_LOCKED&&q==='end'&&S.sect&&id===SECTS[S.sect].master.id&&!S.flags.c2_arrive){ UI.say(C2S.depart()); return; }
    if(C2.talk(id)) return; return _t.call(Story,id); }; }
{ const _a=Dungeon.act; Dungeon.act=function(o){ return C2.act(o)||_a.call(Dungeon,o); }; }
{ const _c=Story.check; Story.check=function(){ if(S&&S.c2) C2.refresh(); return _c.call(Story); }; }

/* ---------- 奇遇 wander: once you live in the sect, a day's encounter may turn up there instead of in 青丘山林 ---------- */
const QIYU_SPOTS_ZONG=[[4,10],[15,11],[23,10],[7,16],[19,18],[2,4]];
const qyCond=map=>s=>{ if(!s.qiyu||s.qiyu.done||(s.qiyu.map||'forest')!==map) return false; const q=QIYU.find(x=>x.id===s.qiyu.ev); return !q||!q.night||night(); };
for(const k in SECTS) MAPS['zong_'+k].objects.push({type:'qiyu', x:0, y:0, act:'qiyu', spr:'sparkle', dyn:true, cond:qyCond('zong_'+k)});
{ const o=MAPS.forest.objects.find(o=>o.type==='qiyu'); o.cond=qyCond('forest'); }
{ const _nd=Hooks.newDay; Hooks.newDay=function(){ _nd.apply(Hooks,arguments);
    if(S.qiyu&&S.flags.c2_arrive&&S.sect&&Math.random()<.5){ S.qiyu.map='zong_'+S.sect; S.qiyu.spot=Math.floor(Math.random()*QIYU_SPOTS_ZONG.length); } Hooks.placeQiyu(); }; }
{ const _pq=Hooks.placeQiyu; Hooks.placeQiyu=function(){ _pq.apply(Hooks,arguments); if(!S||!S.qiyu||!S.qiyu.map||S.qiyu.map==='forest') return;
    const o=(MAPS[S.qiyu.map]||{objects:[]}).objects.find(o=>o.type==='qiyu'); if(o) [o.x,o.y]=QIYU_SPOTS_ZONG[S.qiyu.spot%QIYU_SPOTS_ZONG.length]; }; }
{ const _h=Qiyu.hint; Qiyu.hint=function(){ const t=_h.apply(Qiyu,arguments); const m=S&&S.qiyu&&S.qiyu.map; return m&&m!=='forest'?t.replace(/青丘山林|山林/g, MAPS[m].name):t; }; }

/* ---------- the live site: saves that went to the sect while chapter 2 was briefly public go back to the end of chapter 1 ----------
   Level, items, stones and friendships stay; only the chapter 2 progress is undone. When chapter 2 opens, the master takes them again. */
C2.rollback=function(s){ if(!C2_LOCKED||!s||!s.flags||!s.flags.c2_arrive) return s;
  for(const k of ['c2_arrive','c2_order','c2_mold']) delete s.flags[k]; delete s.c2;
  if(s.inv) delete s.inv.c2_soup;
  s.quest=QUESTS.findIndex(q=>q.id==='end'); s.questStarted=s.quest; s.track='main';
  if(String(s.map).startsWith('zong')){ s.map='town'; s.x=12; s.y=10; }
  if(s.qiyu&&s.qiyu.map&&s.qiyu.map!=='forest') s.qiyu=null;
  setTimeout(()=>UI.toast('第二章还在制作中：存档回到了第一章结束（等级、物品、灵石都保留）'),1200);
  return s; };
{ const _ls=loadSave; loadSave=function(i){ return C2.rollback(_ls(i)); }; }
