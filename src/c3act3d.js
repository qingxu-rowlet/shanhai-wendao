/* ============================================================
   山海问道 · 第三章「京城」 · 第三幕 · 东市、千金坊：账本 — the fourth clue. Past the river, 东市: food and noise, a juggler,
   a 糖人 stall where a little girl waits. Her father 鲁三, a carpenter deep in debt to 千金坊, went off in a carriage the
   night before last "to work out of town" — the same night a disciple vanished. At 千金坊 the owner smiles and knows
   nothing; the counting room is locked, and only a guest who wins big is asked into the back hall for tea. So: the dice
   (猜大小; a cultivator can 凝神 and hear the cup, for 灵力; the house caps what you can lose in a day), three wins in a
   row at the owner's own table, tea in the back hall, and the 八卦镜's second look at the gilt 财神: behind it, the
   real ledger. Names of men who couldn't pay, each with a little 「宗」 by it; the dates are the nights the disciples
   vanished; the last line is 鲁三.
   ============================================================ */
{ const W=28, H=18, G=[...Array(H)].map((_,y)=>[...Array(W)].map((_,x)=>y<=1?(y===1?'R':'Q'):y>=15?(y===15?'R':'Q'):x===W-1?'Q':'P'));
  const roofs={red:['#3a1612','#561e18','#742a20','#a84a3a'], grey:['#22262c','#2e343c','#3e4650','#68727e'], brown:['#2c2018','#3e2e22','#56402e','#86684c']};
  const P=(id,x,y,name,look)=>({type:'npc', id, x, y, look, name, act:'talk'});
  const objects=[
    {type:'building', x:10, y:2, w:10, h:4, style:'shop', roof:roofs.red, label:'千金坊', door:[15,6], act:'qjin', fa:{storeys:2, wall:'brick', sign:'千金坊', signBg:'#1a1410', signInk:'#e8c050', lit:true, open:true, lanternText:'赌', pillar:'#3a3632', deco:['gold','doorLanterns'], roof:roofs.red}},
    {type:'building', x:1, y:2, w:6, h:3, style:'shop', roof:roofs.brown, label:'小吃铺', door:[4,5], act:'dsshop', id:'eat', fa:{wall:'wood', sign:'小吃', open:true, windows:false, deco:['jars'], roof:roofs.brown}},
    {type:'building', x:22, y:2, w:5, h:3, style:'shop', roof:roofs.grey, label:'杂货铺', door:[24,5], act:'dsshop', id:'za', fa:{wall:'plaster', sign:'杂货', open:true, windows:false, deco:['cloth'], roof:roofs.grey}},
    {type:'ds_tangren', x:6, y:10, spr:'ds_tangren', act:'dstang'},
    {type:'jc_stall', x:21, y:10, spr:'ds_stall_wonton', act:'dsstall', fw:1},
    {type:'jc_steamer', x:3, y:7, spr:'jc_steamer'},
    {type:'lantern', x:9, y:7}, {type:'lantern', x:20, y:7}, {type:'lantern', x:12, y:13}, {type:'lantern', x:17, y:13},
    {type:'jc_barrels', x:25, y:13, spr:'jc_barrels'},
    P('ds_girl',7,11,'卖糖人的小姑娘',{g:'f',skin:1,hair:3,hairColor:0,style:'qun',cloth:2,face:'small'}),
    P('ds_old',5,11,'糖人师傅',{g:'m',skin:2,hair:0,hairColor:3,style:'robe',cloth:5,face:'small',beard:'#d8d4cc'}),
    P('ds_juggler',14,10,'耍杂技的',{g:'m',skin:3,hair:1,hairColor:0,style:'jin',cloth:2,face:'mid'}),
    P('ds_wonton',23,10,'卖馄饨的',{g:'f',skin:2,hair:3,hairColor:1,style:'qun',cloth:5,face:'mid'}),
    P('ds_thug',17,7,'千金坊的打手',{g:'m',skin:3,hair:0,hairColor:0,style:'jin',cloth:5,face:'mid'}),
    P('ds_gambler',12,7,'输光了的赌客',{g:'m',skin:1,hair:1,hairColor:0,style:'robe',cloth:6,face:'mid'}),
  ];
  MAPS.jc_dongshi={ name:'京城 · 东市', w:W, h:H, ground:G.map(r=>r.join('')), objects, exits:[{x:0,y:5,to:'jc_dongkou',tx:24,ty:5},{x:0,y:6,to:'jc_dongkou',tx:24,ty:6}] }; }
// the river street now goes on east to 东市
MAPS.jc_dongkou.objects=MAPS.jc_dongkou.objects.filter(o=>o.way!=='east');
MAPS.jc_dongkou.exits.push({x:25,y:5,to:'jc_dongshi',tx:1,ty:5},{x:25,y:6,to:'jc_dongshi',tx:1,ty:6});
// inside 千金坊: dice tables, the owner's counter, the counting-room door
{ const W=18, H=13, G=[...Array(H)].map((_,y)=>[...Array(W)].map((_,x)=>x===0||x===W-1||y===0||y===H-1?'M':y===1?'K':y===2?'L':'D'));
  for(const x of [8,9]) G[H-1][x]='D';
  const P=(id,x,y,name,look)=>({type:'npc', id, x, y, look, name, act:'talk'});
  const objects=[
    {type:'hc_counter', x:6, y:4, spr:'hc_counter', act:'qjboss', fw:3},
    {type:'qj_door', x:15, y:2, spr:'qj_door', act:'qjdoor'},
    {type:'qj_table', x:4, y:8, spr:'qj_table', act:'qjdice', fw:1}, {type:'qj_table', x:12, y:8, spr:'qj_table', act:'qjdice', fw:1},
    {type:'lantern', x:2, y:5}, {type:'lantern', x:15, y:6}, {type:'lantern', x:8, y:10},
    P('qj_boss',10,4,'千金坊老板',{g:'m',skin:1,hair:0,hairColor:1,style:'robe',cloth:7,face:'mid',beard:'#3a2a20'}),
    P('qj_dealer',4,7,'摇骰子的伙计',{g:'m',skin:2,hair:1,hairColor:0,style:'jin',cloth:5,face:'mid'}),
    P('qj_g1',11,9,'赌红了眼的人',{g:'m',skin:3,hair:0,hairColor:0,style:'jin',cloth:6,face:'mid'}),
    P('qj_g2',13,9,'摇扇子的公子',{g:'m',skin:0,hair:2,hairColor:0,style:'robe',cloth:4,face:'small'}),
  ];
  MAPS.jc_qianjin={ name:'京城 · 千金坊', w:W, h:H, ground:G.map(r=>r.join('')), objects, exits:[{x:8,y:12,to:'jc_dongshi',tx:15,ty:7},{x:9,y:12,to:'jc_dongshi',tx:15,ty:7}], indoor:true }; }
// the back hall: tea, and the 财神
{ const W=10, H=8, G=[...Array(H)].map((_,y)=>[...Array(W)].map((_,x)=>x===0||x===W-1||y===0||y===H-1?'M':y===1?'K':y===2?'L':'D'));
  G[H-1][4]='D';
  const objects=[{type:'qj_caishen', x:4, y:2, spr:'qj_caishen', act:'qjcaishen'}, {type:'zy_table', x:6, y:5, spr:'zy_table'}, {type:'lantern', x:2, y:4},
    {type:'npc', id:'qj_boss', x:7, y:4, look:{g:'m',skin:1,hair:0,hairColor:1,style:'robe',cloth:7,face:'mid',beard:'#3a2a20'}, name:'千金坊老板', act:'talk'}];
  MAPS.jc_qjhoutang={ name:'千金坊 · 后堂', w:W, h:H, ground:G.map(r=>r.join('')), objects, exits:[{x:4,y:7,to:'jc_qianjin',tx:15,ty:3}], indoor:true }; }

const QJ={
  st(){ const c=C3.st(); c.qj=c.qj||{streak:0, lostDay:-1, lost:0}; return c.qj; },
  CAP:300,                     // the most the house lets you lose in a day
  CHAT:{ds_girl:['糖人——糖人——'], ds_old:['捏个什么？'], ds_juggler:['看好了！'], ds_wonton:['馄饨——热乎的馄饨——'], ds_thug:['……'], ds_gambler:['再借我十文……'],
    qj_boss:['客官手气如何？'], qj_dealer:['买定离手！'], qj_g1:['大！大！大！'], qj_g2:['……小。']},
  dice:()=>[1,2,3].map(()=>1+Math.floor(Math.random()*6)),
  face:d=>'⚀⚁⚂⚃⚄⚅'[d-1],
};
Object.assign(JC.CHAT,QJ.CHAT);
Object.assign(ITEMS,{jc_tangren:{name:'糖人', icon:'i_zhuguo', sell:3, desc:'东市糖人师傅捏的，一只小老虎。对着太阳看，是透亮的金色。'},
  c3_ledger:{name:'千金坊的暗账', icon:'i_book', quest:true, keep:true, desc:'藏在财神像后面的账本。还不上钱的人名，名字旁边画着一个小小的「宗」字。最后一行，是鲁三。'}});
NPCS.tang.likes.push('jc_tangren'); NPCS.qinghe.likes.push('jc_tangren');

/* ---------- 东市: the 糖人 girl ---------- */
QJ.girl=()=>S.flags.c3_xf_in&&!S.flags.c3_qj_girl?[
  ['卖糖人的小姑娘','（她蹲在糖人摊旁边，手里攥着一只糖人小老虎，一直没舍得吃）'],
  ['卖糖人的小姑娘','大哥哥大姐姐，你们见过我爹吗？他叫鲁三，是个木匠。'],
  ['卖糖人的小姑娘','前天夜里，来了一辆马车，说带他去外地做工，工钱高。'],
  ['卖糖人的小姑娘','他说回来给我买新衣裳。可是……他没跟我说再见。'],
  ['糖人师傅','（他叹了口气）鲁三欠了千金坊一屁股债。那车……是千金坊叫来的。'],
  ['我','（前天夜里……也是一个弟子被送走的那一夜。）'],
  ['卖糖人的小姑娘','这只小老虎是给我爹的。你们要是见到他，帮我给他好不好？'],
  {give:{jc_tangren:1}},{flag:'c3_qj_girl'},
  ['旁白','（线索要去千金坊找。）']]
:[['卖糖人的小姑娘','我爹会回来的。'],['卖糖人的小姑娘','他说回来给我买新衣裳。']];
QJ.TALK={
  ds_old:()=>[['糖人师傅','捏个糖人？十文。'],{choice:'买一只糖人？（10 灵石）', options:[{text:'买', fn:()=>JC.buy('jc_tangren',10,'糖人',1)},{text:'不了', fn:()=>{}}]}],
  ds_juggler:[['耍杂技的','（他头顶着三只碗，单脚站在凳子上）……看好了！'],['旁白','碗一只也没掉。周围的人哄地叫起好来。']],
  ds_wonton:[['卖馄饨的','客官来碗馄饨？'],['卖馄饨的','……那千金坊啊，夜里后门老停着车。别去，别去。']],
  ds_thug:[['千金坊的打手','（他抱着胳膊，上下打量你）……进去就进去，别在门口站着。']],
  ds_gambler:[['输光了的赌客','（他蹲在墙角，两眼发直）……输了，全输了。'],['输光了的赌客','老板说，还不上钱，就去外地做工……'],['输光了的赌客','外地……鲁三就是去外地了。']],
  qj_dealer:[['摇骰子的伙计','客官，玩两把？押大押小，一把二十。'],['摇骰子的伙计','（他压低声音）老板那桌是一把一百的。连赢三把的，老板请喝茶。']],
  qj_g1:[['赌红了眼的人','大！这把一定是大！']],
  qj_g2:[['摇扇子的公子','（他摇着扇子，看都不看骰子）……这里的骰子，会听人话。'],['摇扇子的公子','你要是修行的人，就竖起耳朵听听。']],
};

/* ---------- the dice ---------- */
// one round: you may 凝神 and listen to the cup first (10 灵力: right nine times in ten), then call 大 or 小
QJ.round=(stake,boss)=>{ const q=QJ.st();
  if(q.lostDay===S.day&&q.lost>=QJ.CAP) return UI.say([['摇骰子的伙计','客官，今儿手气背，明儿再来吧。'],['旁白',`（千金坊一天最多让人输 ${QJ.CAP} 灵石。）`]]);
  if(S.stones<stake) return UI.say([['旁白',`灵石不够。（一把 ${stake}）`]]);
  const d=QJ.dice(), sum=d[0]+d[1]+d[2], big=sum>=11; let heard=null;
  const call=pick=>{ const win=(pick==='大')===big; if(q.lostDay!==S.day){ q.lostDay=S.day; q.lost=0; }
    if(win){ S.stones+=stake; if(boss) q.streak++; } else { S.stones-=stake; q.lost+=stake; if(boss) q.streak=0; } Sound.coin&&Sound.coin(); UI.hud(); save();
    UI.say([['旁白',`开！${d.map(QJ.face).join(' ')}　${d.join('、')}——${sum} 点，${big?'大':'小'}！`],['旁白',win?`你赢了 ${stake} 灵石。`:`你输了 ${stake} 灵石。`],
      ...(boss?(win?(q.streak>=3?QJ.invite():[['千金坊老板',q.streak===1?'（他笑了笑）客官好手气。':'（他的笑僵了一下）……再来。'],{run:()=>{}}]):[['千金坊老板','（他眯起眼睛笑了）运气这东西，来得快，去得也快。']]):[])],
      ()=>{ UI.hud(); if(boss&&q.streak>=3) return; QJ.again(stake,boss); }); };
  const ask=()=>UI.say([{choice:`${boss?'老板那桌':'散桌'}　一把 ${stake}${boss?`　连赢 ${q.streak} / 3`:''}${heard?`　（你听着像：${heard}）`:''}`, options:[
    {text:'押大', fn:()=>call('大')},{text:'押小', fn:()=>call('小')},
    ...(heard?[]:[{text:'凝神听一听（灵力 10）', fn:()=>{ if(S.mp<10) return UI.say([['旁白','灵力不够了。']],ask); S.mp-=10; UI.hud(); heard=Math.random()<.9?(big?'大':'小'):(big?'小':'大'); UI.say([['旁白',`你闭上眼睛。骰盅里，三颗骰子落定的声音……像是「${heard}」。`]],ask); }}]),
    {text:'不玩了', fn:()=>{}}]}]);
  UI.say([['旁白',boss?'老板亲自摇骰盅。骰子在盅里哗啦啦地响，「啪」地扣在桌上。':'伙计摇了三下骰盅，「啪」地扣在桌上。'],['摇骰子的伙计','买定离手——']],ask); };
QJ.again=(stake,boss)=>UI.say([{choice:'再来一把？', options:[{text:'再来', fn:()=>QJ.round(stake,boss)},{text:'不玩了', fn:()=>{}}]}]);
QJ.invite=()=>[
  ['千金坊老板','（他放下骰盅，看了你很久，然后哈哈大笑）好！好！'],
  ['千金坊老板','连赢老夫三把的，今年还是头一个。'],
  ['千金坊老板','后堂请——老夫请客官喝杯茶。'],
  {run:()=>{ QJ.st().invited=true; save(); }}];

/* ---------- the back hall: tea, and the 财神 ---------- */
QJ.houtang=()=>{ enterMap('jc_qjhoutang',4,6); RT.dir='up'; UI.hud(); setTimeout(()=>UI.say([
  ['旁白','后堂不大。正中供着一尊镀金的财神，香火很旺。'],
  ['千金坊老板','（他慢悠悠地斟茶）客官哪个宗门的？……哦，魁首！失敬失敬。'],
  ['千金坊老板','（他起身去拿点心，背对着你）'],
  ['旁白','（就是现在。）']]),400); };
QJ.mirror=()=>{ const c=C3.st(); return [
  {choice:`用八卦镜照财神像？（还能照 ${c.bagua} 次）`, options:[{text:'照', fn:()=>UI.say(QJ.ledger(),()=>{ UI.hud(); Story.check(); })},{text:'先不', fn:()=>{}}]}]; };
QJ.ledger=()=>[
  {run:()=>{ C3.st().bagua--; }},
  ['旁白','镜面那一角亮了。镜子里的财神像，后背是空的。'],
  ['旁白','你伸手往财神像背后一摸——一本薄薄的账册。'],
  ['旁白','账上一行一行，都是人名。还不上钱的人。每个名字旁边，都用朱笔画着一个小小的「宗」字。'],
  ['旁白','日子你认得。正月十七，二月初三，二月十九……三月十六，三月十七，三月十八。'],
  ['我','（三月十六、十七、十八——大比的那几夜。礼部的马车，往东拐的那几夜。）'],
  ['旁白','最后一行，墨还没干透：「鲁三，欠银四十两，三月十七，宗。」'],
  ['旁白','老板端着点心回来的时候，账本已经在你怀里了。'],
  ['千金坊老板','客官，尝尝？'],
  ['我','……不了。'],
  {give:{c3_ledger:1}},
  {run:()=>{ XF.st().clue.ledger=true; save(); }},
  ['旁白','（线索：千金坊的暗账。还不上钱的人，和失踪的弟子，是同一辆马车拉走的。）'],
  ['旁白','（四条线索都齐了。回四方馆，告诉大师姐。）']];

/* ---------- hooks ---------- */
On.talk(id=>{ if(!['jc_dongshi','jc_qianjin','jc_qjhoutang'].includes(RT.mapId)) return false;
  if(id==='ds_girl'){ UI.say(QJ.girl(),()=>{ UI.hud(); Story.check(); }); return true; }
  if(id==='qj_boss'){ if(RT.mapId==='jc_qjhoutang'){ UI.say(XF.st().clue.ledger?[['千金坊老板','客官，茶凉了，再续一杯？']]:[['千金坊老板','（他背对着你，在柜子里翻点心）……']]); return true; }
    UI.say(QJ.st().invited?[['千金坊老板','客官，后堂请。']]:[['千金坊老板','（他笑眯眯的）客官，玩两把？'],['千金坊老板','鲁三？不认识。我们千金坊的客人多，记不住。'],['我','账房里呢？'],['千金坊老板','账房？（他笑得更和气了）那是贵客才进得去的地方。'],
      {choice:'跟老板赌？（一把 100 灵石，连赢三把请进后堂）', options:[{text:'赌', fn:()=>QJ.round(100,true)},{text:'不了', fn:()=>{}}]}]); return true; }
  const L=QJ.TALK[id]; if(!L) return false; UI.say(typeof L==='function'?L():L); return true; });
On.act('qjin',o=>{ enterMap('jc_qianjin',8,11); RT.dir='up'; UI.hud(); });
On.act('qjdice',o=>QJ.round(20,false));
On.act('qjboss',o=>Story.talk('qj_boss'));
On.act('qjdoor',o=>QJ.st().invited?QJ.houtang():UI.say([['旁白','一扇上了锁的红漆门。门上挂着一块木牌：「账房重地，闲人免进」。']]));
On.act('qjcaishen',o=>XF.st().clue.ledger||!S.flags.c3_xf_in?UI.say([['旁白','一尊镀金的财神，笑眯眯的，手里捧着元宝。']]):UI.say([['旁白','财神笑眯眯的。香炉里的灰，扫得太干净了。'],...QJ.mirror()]));
On.act('dstang',o=>Story.talk('ds_old'));
On.act('dsstall',o=>Story.talk('ds_wonton'));
On.act('dsshop',o=>SHOP3.stall(o)||UI.say({eat:[['旁白','小吃铺门口摆着蒸笼、油锅，香味飘了半条街。']], za:[['旁白','杂货铺里什么都有：针线、灯油、铜锁、木屐。']]}[o.id]));
{ const _d=Portal.dests; Portal.dests=function(){ const l=_d.call(Portal); if(S.flags.c3_qj_girl&&RT.mapId!=='jc_dongshi') l.push({name:'京城 · 东市', map:'jc_dongshi', x:15, y:8}); return l; }; }

/* ---------- the quest ---------- */
{ const q=QUESTS.find(q=>q.id==='c3m'), _p=q.progress, _t=q.target; Object.assign(q,{
    progress:s=>_p(s).replace('千金坊（之后的地图）','千金坊（护城河边再往东，东市）'),
    target:s=>{ const c=XF.st().clue; if(!s.flags.c3_xf_in||!c.room||!c.dregs||!c.qinghe||c.ledger) return _t(s);
      if(RT.mapId==='jc_qjhoutang') return ['jc_qjhoutang',4,3,'财神像'];
      if(RT.mapId==='jc_qianjin') return QJ.st().invited?['jc_qianjin',15,3,'后堂']:['jc_qianjin',6,5,'老板'];
      return !s.flags.c3_qj_girl&&RT.mapId==='jc_dongshi'?['jc_dongshi',7,12,'卖糖人的小姑娘']:['jc_dongshi',15,6,'千金坊']; }}); }
QUESTS.splice(QUESTS.findIndex(q=>q.id==='c3m')+1,0,
  {id:'c3n', title:'夜里的马车', desc:'四条线索都齐了：送行茶、醉仙散和铁锈味、「宗庙那边，又要一车」、画着「宗」字的暗账。今夜，跟着那辆马车。', check:s=>false,
    progress:s=>'回四方馆，告诉大师姐（之后的剧情正在做）', target:s=>['jc_sifang',12,10,'大师姐']});
