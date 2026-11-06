/* ============================================================
   山海问道 · 第三章「京城」 · 第三幕 · 醉月楼：青禾 — the third clue. East along the cross street, the 护城河: willows on the
   embankment, a boat tied up, and 醉月楼, two storeys of lanterns. Its 花魁 青禾 plays the 琵琶 on the little stage;
   the city calls her a fox spirit. The first time she sees you she laughs: "your 师姐 — I heard it from the storyteller.
   When the people of this city see a pretty woman, they only know one word." 青禾 is her village name; she won't change
   it. She ran from 柳河村 the night the soldiers came — the same village as the starving man at 回春堂. She's been
   waiting for someone to ask what she saw. Help her (carry her letter to him, or buy back her 琵琶, held by the 鸨母
   against her debt) and she tells you: a drunken official, a few nights ago — "the 宗庙 wants another cartload."
   ============================================================ */
// the river street: the cross street runs on east from 朱雀大街 (东市 beyond it is a map still to come)
{ const W=26, H=18, G=[...Array(H)].map((_,y)=>[...Array(W)].map((_,x)=>y<=1?'Q':y===12?'G':y>12?'~':'P'));
  for(let y=0;y<=1;y++) for(let x=0;x<W;x++) G[y][x]=y===1?'R':'Q';
  const roofs={red:['#3a1612','#561e18','#742a20','#a84a3a'], grey:['#22262c','#2e343c','#3e4650','#68727e']};
  const objects=[
    {type:'building', x:8, y:2, w:10, h:4, style:'shop', roof:roofs.red, label:'醉月楼', door:[13,6], act:'zyin', fa:{storeys:2, wall:'wood', sign:'醉月楼', lit:true, open:true, lanternText:'月', pillar:'#8a2a22', deco:['balconyLanterns','doorLanterns','blinds'], roof:roofs.red}},
    {type:'building', x:1, y:2, w:5, h:3, style:'shop', roof:roofs.grey, label:'茶摊', door:[3,5], act:'zytea', fa:{wall:'wood', sign:'茶', open:true, windows:false, deco:['jars'], roof:roofs.grey}},
    {type:'building', x:20, y:2, w:5, h:3, style:'shop', roof:roofs.grey, label:'花铺', door:[22,5], act:'zyflower', fa:{wall:'plaster', sign:'花', open:true, windows:false, deco:['cloth'], roof:roofs.grey}},
    ...[2,6,10,15,19,23].map(x=>({type:'jc_willow', x, y:11, spr:'jc_willow'})),
    {type:'zy_boat', x:12, y:14, spr:'zy_boat'},
    {type:'lantern', x:7, y:7}, {type:'lantern', x:18, y:7},
    {type:'jc_barrier', x:25, y:5, spr:'jc_barrier', act:'jcway', way:'east'}, {type:'jc_barrier', x:25, y:6, spr:'jc_barrier', act:'jcway', way:'east'},
    {type:'npc', id:'zy_flower', x:21, y:7, look:{g:'f',skin:0,hair:3,hairColor:0,style:'qun',cloth:6,face:'small'}, name:'卖花的小姑娘', act:'talk'},
    {type:'npc', id:'zy_drunk', x:15, y:8, look:{g:'m',skin:2,hair:0,hairColor:1,style:'robe',cloth:4,face:'mid'}, name:'喝醉的公子', act:'talk'},
    {type:'npc', id:'zy_boatman', x:12, y:11, look:{g:'m',skin:3,hair:1,hairColor:0,style:'jin',cloth:5,face:'mid'}, name:'船家', act:'talk'},
  ];
  MAPS.jc_dongkou={ name:'京城 · 护城河边', w:W, h:H, ground:G.map(r=>r.join('')), objects, exits:[{x:0,y:4,to:'jc_zhuque',tx:26,ty:14},{x:0,y:5,to:'jc_zhuque',tx:26,ty:15}] }; }
// 朱雀大街's cross street now runs on east to here
MAPS.jc_zhuque.objects=MAPS.jc_zhuque.objects.filter(o=>o.way!=='east');
MAPS.jc_zhuque.exits.push({x:27,y:14,to:'jc_dongkou',tx:1,ty:4},{x:27,y:15,to:'jc_dongkou',tx:1,ty:5});
// inside 醉月楼: the stage, tables, a screen, the stair
{ const W=18, H=13, G=[...Array(H)].map((_,y)=>[...Array(W)].map((_,x)=>x===0||x===W-1||y===0||y===H-1?'M':y===1?'K':y===2?'L':(y===3)&&x>=6&&x<=11?'E':'D'));
  for(const x of [8,9]) G[H-1][x]='D';
  const P=(id,x,y,name,look)=>({type:'npc', id, x, y, look, name, act:'talk'});
  const objects=[
    {type:'zy_screen', x:3, y:3, spr:'zy_screen'}, {type:'zy_stairs', x:15, y:4, spr:'zy_stairs', act:'zystairs', fw:1},
    {type:'zy_table', x:4, y:7, spr:'zy_table'}, {type:'zy_table', x:13, y:8, spr:'zy_table'}, {type:'zy_table', x:9, y:9, spr:'zy_table'},
    {type:'lantern', x:2, y:5}, {type:'lantern', x:15, y:7}, {type:'lantern', x:6, y:10}, {type:'lantern', x:12, y:10},
    P('qinghe',9,4,'青禾',LOOK_QINGHE),
    P('zy_bao',3,9,'鸨母',{g:'f',skin:2,hair:3,hairColor:1,style:'qun',cloth:4,face:'mid'}),
    P('zy_guan',14,9,'醉醺醺的官老爷',{g:'m',skin:1,hair:0,hairColor:3,style:'robe',cloth:2,face:'mid',beard:'#5a4a3a'}),
    P('zy_maid',5,6,'小丫鬟',{g:'f',skin:0,hair:3,hairColor:0,style:'qun',cloth:6,face:'small'}),
  ];
  MAPS.jc_zuiyue={ name:'京城 · 醉月楼', w:W, h:H, ground:G.map(r=>r.join('')), objects, exits:[{x:8,y:12,to:'jc_dongkou',tx:13,ty:7},{x:9,y:12,to:'jc_dongkou',tx:13,ty:7}] }; }

const ZY={
  st(){ const c=C3.st(); c.zy=c.zy||{}; return c.zy; },
  CHAT:{zy_flower:['卖花——卖花——'], zy_drunk:['再、再来一壶……'], zy_boatman:['游河吗？'], zy_bao:['哟，贵客！'], zy_guan:['喝！'], zy_maid:['……'], qinghe:['……']},
};
Object.assign(JC.CHAT,ZY.CHAT);
NPCS.qinghe={name:'青禾', loves:['flower'], likes:['jc_hulu','wine'], hates:['hide']};

/* ---------- 青禾 ---------- */
ZY.meet=()=>[
  ...(S.flags.c3_zy_met?[['青禾','（她看见你，放下了琵琶）……你又来了。']]:[
  ['旁白','醉月楼里点满了灯。台子上，一个穿红裙的女子抱着琵琶，正弹到一半。'],
  ['旁白','满堂的人都在看她。没有人在听。'],
  ['旁白','一曲弹完，她抬起头，看见了你。然后笑了。'],
  ['青禾','你就是那位魁首？'],
  ['青禾','你师姐的事，我听说书的讲了。'],
  ['青禾','京城的人啊，见了好看的女人，就只会说一个词。'],
  ['青禾','（她拨了一下弦）……我也是「狐狸精」。'],
  ['青禾','我叫青禾。'],
  ['鸨母','（在台下尖着嗓子）跟你说了多少回，改个花名！「青禾」青禾，土里土气的！'],
  ['青禾','（她没理）田里长的东西，叫这个名字，记得住家。']]),
  ...(S.flags.c3_xf_in?[
    ['我','……你的家在哪儿？'],
    ['青禾','（她的手指停在弦上）北边。柳河村。'],
    ['青禾','去年秋天，一夜之间，就没了。'],
    ...(S.flags.c3_hc_pulse?[['我','（柳河村……回春堂那个吃不饱的汉子，也是柳河村的。）']]:[]),
    ['青禾','我那天晚上跑出来了，路上被人牙子卖进了京城。'],
    ['青禾','我一直在等。等有人问我，那天晚上看见了什么。'],
    ['青禾','可是没有人问。'],
    ['青禾','（她看着你）你要问，就先帮我一个忙。'],
    ...ZY.ask()]:[['旁白','（青禾又弹起了琵琶。）']]),
  {flag:'c3_zy_met'}];
ZY.ask=()=>[
  ['青禾','我的琵琶。这一把是楼里的。我自己的那把，从家里背出来的，被妈妈扣下了，抵我的身价。'],
  ['青禾','还有一封信。我写了一年了，不知道往哪儿寄。村子都没了。'],
  ...(S.flags.c3_hc_pulse?[['我','回春堂有一个柳河村的人。他还活着。'],['青禾','（她的手一下子攥紧了琵琶）……谁？'],['我','一个汉子。躲在地窖里，才没被带走。他说他在京城找他娘。'],['青禾','（她低下头，过了很久）……把信，给他。']]:[]),
  {run:()=>{ if(S.flags.c3_hc_pulse&&!count(S,'c3_letter')) addItem('c3_letter',1); ZY.st().asked=true; save(); }},
  ['旁白',S.flags.c3_hc_pulse?'（青禾把信交给你。送到回春堂那个汉子手里，或者替她赎回琵琶。做一件就够了。）':'（替她赎回琵琶：找鸨母。）']];
Object.assign(ITEMS,{c3_letter:{name:'青禾的信', icon:'i_slip', quest:true, keep:true, desc:'青禾写了一年的信，叠得方方正正。写给柳河村，写给不知道还在不在的人。'}});
ZY.tell=how=>[
  ...(how==='letter'?[
    ['青禾','（她看见你，站了起来）……他收到了？'],['我','他说：「青禾姐还活着？」然后哭了。'],['青禾','（她笑了，眼泪掉下来）……他是村东头李家的小三子。小时候，我背过他。']]
  :[['青禾','（她把自己的琵琶抱在怀里，手指一根一根摸过琴弦）……就是这把。'],['青禾','弦断过一根，是我爹给我接的。']]),
  ['青禾','你想知道那天晚上，我看见了什么。'],
  ['青禾','黑篷的车。没有灯。车上的人，额头上都贴着一张黄符。'],
  ['青禾','符上画着一面镜子。'],
  ['青禾','还有……'],
  ['青禾','（她压低了声音）前几天，楼上有位官老爷喝醉了，抱着酒坛子说胡话。'],
  ['青禾','他说：「宗庙那边，又要一车。」'],
  ['青禾','「一车」。他说的是人，不是货。'],
  {run:()=>{ XF.st().clue.qinghe=true; ZY.st().told=how; save(); }},{love:{qinghe:60}},
  ['旁白','（线索：醉月楼。宗庙那边，又要一车。）']];
ZY.pipa=()=>{ const price=300; return [
  ['鸨母','赎琵琶？那可是她的身价！'],['鸨母','……三百灵石。少一个子儿都不行。'],
  {choice:`替青禾赎回琵琶？（${price} 灵石，你有 ${S.stones}）`, options:[
    {text:'赎', fn:()=>{ if(S.stones<price) return UI.say([['鸨母','没钱就别在这儿碍事！']]);
      S.stones-=price; Sound.coin(); UI.hud(); ZY.st().pipa=true; save(); UI.say([['旁白','鸨母从柜子里取出一把旧琵琶，琴头上刻着一棵小小的禾苗。'],['旁白','（拿去给青禾。）']]); }},
    {text:'算了', fn:()=>{}}]}]; };

/* ---------- 回春堂: the letter reaches him ---------- */
ZY.deliver=()=>[
  ['我','柳河村，有个叫青禾的姑娘，托我带封信给你。'],
  ['北边来的汉子','（他愣住了）……青禾？青禾姐？'],
  ['北边来的汉子','她还活着？'],
  ['旁白','他拆开信，看了没几行，就蹲在地上哭了起来。'],
  ['北边来的汉子','她在哪儿？我、我要去见她——'],
  ['我','醉月楼。'],
  ['北边来的汉子','（他的哭声停了一下，然后更大声了）……'],
  {run:()=>{ addItem('c3_letter',-1); ZY.st().letter=true; save(); }},
  ['旁白','（回醉月楼告诉青禾。）']];

/* ---------- talking ---------- */
ZY.TALK={
  zy_flower:[['卖花的小姑娘','买枝花吧？醉月楼的姐姐们最喜欢了。'],['卖花的小姑娘','……青禾姐姐从来不要花。她说，花会谢。']],
  zy_drunk:[['喝醉的公子','（他扶着柳树吐了一口）……醉月楼的青禾，看都不看我一眼……'],['喝醉的公子','狐狸精！我爹说的！']],
  zy_boatman:[['船家','护城河绕城一圈。夜里放河灯，好看着呢。'],['船家','就是最近，夜里总有空船往东边宗庙那头划。不点灯。']],
  zy_bao:()=>ZY.st().asked&&!ZY.st().pipa&&!XF.st().clue.qinghe?ZY.pipa():[['鸨母','哟，贵客！喝茶还是听曲儿？'],['鸨母','我们青禾，那可是京城第一的琵琶！']],
  zy_guan:[['醉醺醺的官老爷','（他抱着酒坛子，眼睛都睁不开了）……喝！'],['醉醺醺的官老爷','差事？什么差事……今晚又要……嗝……'],['旁白','他一头栽在桌上，打起了呼噜。']],
  zy_maid:[['小丫鬟','（她小声说）青禾姐姐对我们可好了。'],['小丫鬟','她每天晚上都往北边看。']],
};
On.talk(id=>{ if(!['jc_dongkou','jc_zuiyue','jc_huichun'].includes(RT.mapId)) return false; const z=ZY.st();
  if(id==='qinghe'){
    if(!S.flags.c3_zy_met||(S.flags.c3_xf_in&&!z.asked)){ UI.say(ZY.meet(),()=>{ UI.hud(); Story.check(); }); return true; }
    if(!XF.st().clue.qinghe&&(z.letter||z.pipa)){ UI.say(ZY.tell(z.letter?'letter':'pipa'),()=>{ UI.hud(); Story.check(); }); return true; }
    UI.say(XF.st().clue.qinghe?[['青禾','（她弹着自己的琵琶，弹的是北边的调子）'],['青禾','……你要去宗庙，就小心些。']]:[['青禾','信送到了吗？或者，我的琵琶……']]); return true; }
  const L=ZY.TALK[id]; if(!L) return false; UI.say(typeof L==='function'?L():L,()=>{ UI.hud(); Story.check(); }); return true; });
On.act('zyin',o=>{ enterMap('jc_zuiyue',8,11); RT.dir='up'; UI.hud(); });
On.act('zytea',o=>SHOP3.stall(o)||UI.say([['旁白','河边的茶摊。茶碗粗，茶也粗，可是看得见河。']]));
On.act('zyflower',o=>SHOP3.stall(o)||UI.say([['旁白','花铺门口摆着芍药、海棠，还有一桶刚剪下来的柳枝。']]));
On.act('zystairs',o=>UI.say([['旁白','楼梯通到楼上的雅间。门口站着人，不让上。']]));
On.theme(id=>id==='jc_zuiyue'?'calm':null);
{ const _d=Portal.dests; Portal.dests=function(){ const l=_d.call(Portal); if(S.flags.c3_zy_met&&RT.mapId!=='jc_dongkou') l.push({name:'京城 · 护城河边', map:'jc_dongkou', x:13, y:8}); return l; }; }
// the jcway text for the east barrier, here
{ const q=QUESTS.find(q=>q.id==='c3m'), _p=q.progress, _t=q.target; Object.assign(q,{
    progress:s=>_p(s).replace('醉月楼（之后的地图）','醉月楼（十字街往东，护城河边）'),
    target:s=>{ const c=XF.st().clue; if(!s.flags.c3_xf_in||!c.room||!c.dregs) return _t(s); if(c.qinghe) return _t(s); const z=ZY.st();
      if(RT.mapId==='jc_zuiyue'||RT.mapId==='jc_dongkou'){ if(z.asked&&!z.letter&&!z.pipa&&count(s,'c3_letter')) return ['jc_huichun',13,8,'柳河村的汉子']; return RT.mapId==='jc_zuiyue'?['jc_zuiyue',9,5,'青禾']:['jc_dongkou',13,7,'醉月楼']; }
      if(count(s,'c3_letter')) return RT.mapId==='jc_huichun'?['jc_huichun',13,8,'柳河村的汉子']:['jc_zhuque',22,6,'回春堂'];
      return ['jc_dongkou',13,7,'醉月楼']; }}); }

// rooms have no sky
for(const m of ['jc_huichun','jc_jubao','jc_zuiyue']) MAPS[m].indoor=true;
