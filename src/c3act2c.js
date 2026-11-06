/* ============================================================
   山海问道 · 第三章「京城」 · 第二幕 · 西市 — 苏小棠 takes you to the market of rare things the morning after the recipe.
   At 百草行 the dealer brings out 龙血竭: 苏小棠 rubs it on paper and calls it 松香 dyed red; laughing, he fetches the real
   thing from the back (萧府 has been buying it up), and she beats him down on the price. The 琅琊阁 sells 散修's 功法, a
   new lot every three days, each a lasting gift; on the 琅琊榜 by its door this year's entrants are ranked (大师姐 with a
   note beside her name, you at the bottom: 新人，不详). The 聚宝楼's auction is every seventh night, on a pass from 萧大人;
   its last lot this time is 九转还魂草. On the back lane a woman is still asking after 阿秀.
   ============================================================ */
const XS={
  st(){ const c=C3.st(); c.gf=c.gf||[]; return c; },
  // the 琅琊阁's 功法: three of these on its shelves at a time, a new lot every three days
  GF:[
    {id:'gf_tie', name:'铁衣诀', price:160, k:'def', n:3, desc:'练皮的功夫。一个散修在北边的矿里琢磨出来的。', gain:'防御 +3'},
    {id:'gf_chang', name:'长生桩', price:180, k:'hp', n:40, desc:'站桩养气。据说写它的人活了一百四十岁。', gain:'生命上限 +40'},
    {id:'gf_lie', name:'裂石掌', price:200, k:'atk', n:4, desc:'一掌下去，青石开裂。散修里流传最广的一本。', gain:'攻击 +4'},
    {id:'gf_hai', name:'纳海诀', price:180, k:'mp', n:16, desc:'把丹田练得像一口井，越深越好。', gain:'灵力上限 +16'},
    {id:'gf_xi', name:'息心篇', price:220, k:'med', n:.08, desc:'打坐的心法。字写得很小，像是在牢里写的。', gain:'打坐修为 +8%'},
    {id:'gf_feng', name:'追风步', price:150, k:'def', n:2, desc:'跑得快，就挨得少。', gain:'防御 +2'},
    {id:'gf_xue', name:'血河经', price:240, k:'atk', n:6, desc:'残本。最后几页被人撕掉了。', gain:'攻击 +6'},
    {id:'gf_mu', name:'枯木回春', price:200, k:'hp', n:50, desc:'一个药修写的。扉页上写着：「给阿竹」。', gain:'生命上限 +50'},
  ],
  batch:()=>Math.floor(Math.max(0,S.day-1)/3),
  shelf(){ const b=XS.batch(), R=rng(b*97+13), l=[...XS.GF]; for(let i=l.length-1;i>0;i--){ const j=Math.floor(R()*(i+1)); [l[i],l[j]]=[l[j],l[i]]; } return l.slice(0,3); },
  nextLot:()=>(XS.batch()+1)*3+1,
  auctionDay:()=>Math.ceil(S.day/7)*7,
  CHAT:{xs_lang:['功法换了一批。','……字写得真好。'], xs_ju:['拍卖会，七日一场！','好东西，都在压轴。'], xs_book:['旧书，旧书，三文一本——'], xs_fu:['镇宅符，平安符，驱邪符——'],
    xs_bird:['画眉、黄鹂、八哥——会说话的八哥！'], xs_gu:['前朝的，真是前朝的！'], xs_yao:['龙血竭、石斛、何首乌——'], xs_sanxiu:['又涨价了……'], xs_mother:['阿秀……阿秀……']},
};
JC.CHAT=Object.assign(JC.CHAT,XS.CHAT);

/* ---------- arriving ---------- */
On.enter(id=>{ if(id==='jc_xishi'&&!S.flags.c3_xs_in) setTimeout(()=>{ if(RT.mapId==='jc_xishi'&&!S.flags.c3_xs_in) UI.say(XS.arrive(),()=>{ UI.hud(); Story.check(); }); },500); });
XS.arrive=()=>[
  ['旁白','西市比朱雀大街窄，人却一点也不少。卖的东西，一样比一样稀奇。'],
  ['旁白','旧书、符纸、鸟笼、铜鼎……还有一个摊子上摆着一排玻璃罐子，里面泡着说不出名字的东西。'],
  ['苏小棠','（她拉着你的袖子，眼睛都不够用了）{名}你看！那个鸟会说话！'],
  ['苏小棠','……先办正事。龙血竭，药材行。'],
  ['苏小棠','（她指了指南边挂着药旗的铺子）百草行！'],
  {flag:'c3_xs_in'}];

/* ---------- 百草行: 龙血竭 ---------- */
XS.xue=()=>{ const price=120, short=Math.max(0,price-S.stones); return [
  ['百草行掌柜','两位要点什么？'],
  ['苏小棠','龙血竭。要好的。'],
  ['旁白','掌柜从柜台底下拿出一个小匣子，里面躺着几块暗红色的东西，像凝住的血。'],
  ['百草行掌柜','上好的龙血竭，南边来的。三百灵石。'],
  ['旁白','苏小棠拈起一块，放在鼻子底下闻了闻，又在一张白纸上轻轻一抹。'],
  ['苏小棠','……'],
  ['苏小棠','真的龙血竭，抹在纸上是透亮的红，像血，不粘手。'],
  ['苏小棠','这个，抹上去是一层黄，还粘手。是松香，拿红花染的。'],
  ['旁白','掌柜愣了一下，然后哈哈大笑起来。'],
  ['百草行掌柜','好眼力！好眼力！小姑娘是药王谷的吧？'],
  ['百草行掌柜','（他转身进了后屋，过了好一会儿，才捧着一个小布包出来）这才是真的。'],
  ['百草行掌柜','就剩这一块了。前些日子萧府的人来过一趟，把真的全收走了，说是给宫里炼丹用。'],
  ['苏小棠','（她小声对你说）……萧府要这么多龙血竭干什么？'],
  ['苏小棠','（然后转过身，声音一下子大了）你拿假的糊弄人，还好意思要三百？'],
  ['百草行掌柜','……一百二。不能再少了。'],
  ...(short?[['旁白',`你身上的灵石不够。苏小棠从荷包里数出 ${short} 灵石，塞到你手里。`],['苏小棠','先拿着！等你当了魁首，请我吃糖葫芦。']]:[]),
  {run:()=>{ S.stones=Math.max(0,S.stones+short-price); addItem('c3_xue',1); Sound.coin(); UI.hud(); }},
  {flag:'c3_xs_xue'},
  ['旁白','（得到「龙血竭」。）'],
  ['苏小棠','一味了！下一味，千年石钟乳……回春堂。'],
  ['苏小棠','回春堂在朱雀大街上。我们回去的时候，顺路！']]; };
Object.assign(ITEMS,{c3_xue:{name:'龙血竭', icon:'i_xue', quest:true, keep:true, desc:'结丹丹的第一味主药。暗红色，抹在纸上是透亮的红，像血。百草行的最后一块，苏小棠砍的价。'}});

/* ---------- 琅琊阁: 功法 ---------- */
XS.lang=()=>{ const first=!S.flags.c3_xs_lang; S.flags.c3_xs_lang=true; const shelf=XS.shelf(), have=XS.st().gf;
  return [
    ...(first?[['琅琊阁主','（一个白胡子老头，趴在柜台上抄书，头也不抬）看书自己看，买书找我。'],
      ['琅琊阁主','琅琊阁只收散修的功法。没门没派的人，一辈子琢磨出来的东西，都在这儿了。'],
      ['琅琊阁主','三天换一批。今天不买，下回就不一定有了。']]:[['琅琊阁主','（他还在抄书）……看吧。']]),
    {choice:`琅琊阁的书架（第 ${XS.nextLot()} 天换下一批）　灵石：${S.stones}`, options:[
      ...shelf.map(g=>({text:have.includes(g.id)?`${g.name}（已经学过了）`:`${g.name}　${g.price} 灵石　· ${g.gain}`, fn:()=>XS.buyGf(g)})),
      {text:'不买了', fn:()=>{}}]}]; };
XS.buyGf=g=>{ const have=XS.st().gf;
  if(have.includes(g.id)) return UI.say([['琅琊阁主','这本你已经学会了。一本书，不用看两遍。']]);
  UI.say([['旁白',`《${g.name}》：${g.desc}`],{choice:`买下《${g.name}》？（${g.price} 灵石 · ${g.gain}）`, options:[
    {text:'买', fn:()=>{ if(S.stones<g.price) return UI.say([['琅琊阁主',`${g.price} 灵石，少一个也不卖。`],['旁白',`（你身上只有 ${S.stones} 灵石。）`]]);
      S.stones-=g.price; have.push(g.id); Sound.coin(); save();
      UI.say([['旁白',`你翻开《${g.name}》，在角落里坐了一下午。`],['琅琊阁主','（他抬头看了你一眼）……悟性不错。'],{run:()=>perk(g.k,g.n,`习得《${g.name}》：${g.gain}`)}],()=>UI.hud()); }},
    {text:'再看看', fn:()=>{}}]}]); };

/* ---------- the 琅琊榜 ---------- */
XS.bang=()=>{ const R=SF.rivals(), row={sf_lin:'林沧（青云剑宗）　剑快。今年的头名，十有八九。', sf_wulan:'乌兰（万兽谷）　带灵兽上台，一人当两人。', sf_wenxuan:'温玄（天机阁）　看不透。押他的人最少，赢得最多。'};
  const first=!S.flags.c3_xs_bang; S.flags.c3_xs_bang=true; let n=0; const num=['一','二','三','四','五','六','七'];
  return [
    ['旁白','琅琊阁门口立着一块红漆木牌，上面写着「琅琊榜」，底下一行小字：「四宗大比，琅琊阁评。」'],
    ...R.map(id=>['旁白',`第${num[n++]}：${row[id]}`]),
    ['旁白',`第${num[n++]}：谢霁月（${sectName()}）　上届魁首。旁边有人用墨笔添了一行小字：「靠的什么，大家心里有数。」`],
    ['旁白',`第${num[n++]}：苏小棠（药王谷）　药修。不擅打。`],
    ['旁白',`第${num[n++]}：${S.name}（${sectName()}）　新人。不详。`],
    ...(first?[
      ['苏小棠','（她盯着大师姐名字旁边那行小字，脸都气红了）谁写的！'],
      ['苏小棠','……还有，什么叫「不擅打」！'],
      ['苏小棠','（她转过头看你，愣了一下，又笑了）……「不详」。'],
      ['苏小棠','那正好。到时候，让他们都知道知道。'],
      {love:{tang:10}}]:[])]; };

/* ---------- 聚宝楼: the auction ---------- */
XS.ju=()=>{ const d=XS.auctionDay(), first=!S.flags.c3_xs_lot; S.flags.c3_xs_lot=true; return [
  ['聚宝楼伙计','客官，拍卖会七天一场，入夜开场。'],
  ['我','入夜？不是宵禁吗？'],
  ['聚宝楼伙计','（他嘿嘿一笑，指了指门上挂的一块铜牌）萧大人特许的夜牌。来聚宝楼的，都是贵人。'],
  ['聚宝楼伙计',d===S.day?'下一场就在今天晚上。':`下一场：第 ${d} 天晚上。`],
  ['旁白','他递过来一张拍品单。最底下一行，用朱笔圈着：'],
  ['旁白','「压轴：九转还魂草，一株。起价，八百灵石。」'],
  ...(first?[['苏小棠','……八百！'],['苏小棠','（她掰着手指头算了半天，脸垮了下来）……{名}，我们得想想办法。']]:[])]; };

/* ---------- the stalls, the herbs, the people ---------- */
On.act('xsshop',o=>{ if(o.id==='yao') return Story.talk('xs_yao'); if(o.id==='lang') return Story.talk('xs_lang'); if(o.id==='ju') return Story.talk('xs_ju');
  UI.say({fa:[['旁白','玄铁斋。墙上挂满了刀剑，每一把都开过刃。'],['旁白','掌柜在后头打铁，叮叮当当的。'],['旁白','（法器都贵得吓人。最便宜的一把匕首，也要两千灵石。）']],
    gu:[['旁白','博古斋。架子上摆着瓷瓶、铜镜、玉璧，每一件底下都压着一张红纸，写着「前朝」。'],['旁白','角落里有一只小小的青铜鼎，鼎身上刻着一张兽脸，只有嘴，没有身子。'],['苏小棠','……这个兽，长得好凶。'],{flag:'c3_xs_ding'}]}[o.id]||[['旁白',o.label]]); });
On.act('xsbang',o=>UI.say(XS.bang(),()=>{ UI.hud(); Story.check(); }));
On.act('xsherbs',o=>UI.say([['旁白','竹匾里晒着药材：何首乌、黄精、石斛……一股暖烘烘的苦味。'],...(S.sect==='dan'||S.flags.c3_xs_in?[['苏小棠','（她抓起一片闻了闻）晒得太干了。药性要跑掉一半。']]:[])]));
On.act('xsstall',o=>SHOP3.stall(o)||UI.say([
  [['旁白','旧书摊上堆着发黄的书：话本、医书、半本《山海经》。'],['旧书摊的书生','三文一本。不过那本《山海经》不卖，我自己还没看完。']],
  [['旁白','一根绳子上挂满了黄色的符纸，风一吹，哗啦哗啦地响。'],['卖符纸的道士','镇宅、平安、驱邪，一张十文。'],['卖符纸的道士','（他压低声音）最近买驱邪符的人，可多了。']],
  [['旁白','竹竿上挂着三只鸟笼。一只八哥歪着头看你。'],['旁白','八哥：「宵禁！宵禁！」'],['鸟贩','嘿，这几天跟巡街的学的。']],
  [['旁白','古玩摊上摆着瓷瓶、铜鼎、青花碗。'],['古董贩子','前朝的！都是前朝的！']]][o.si||0]));
XS.TALK={
  xs_lang:()=>XS.lang(),
  xs_ju:()=>S.flags.c3_hc_ru&&!S.flags.c3_ju_won?JU.door():XS.ju(),
  xs_yao:()=>S.flags.c3_xs_xue?[['百草行掌柜','（他看见苏小棠，赶紧拱了拱手）小神医，又来了？'],['百草行掌柜','龙血竭真没了。萧府那边，说下个月还要。']]:XS.xue(),
  xs_book:[['旧书摊的书生','我从前也想考功名。后来发现，卖书比读书挣得多。'],['旧书摊的书生','……其实也没多多少。']],
  xs_fu:[['卖符纸的道士','小友是修行之人吧？那你说说，这京城里头的「邪」，是符纸驱得走的吗？'],['旁白','他也不等你回答，自己摇了摇头。']],
  xs_bird:[['鸟贩','买只鸟吧？八哥会说话，画眉会唱歌。'],['鸟贩','……以前还有人来买放生的。现在晚上不让出门，谁还放生。']],
  xs_gu:[['古董贩子','这位客官，看看这只鼎？'],['古董贩子','前朝的！不，前前朝的！'],['古董贩子','……行吧，是我去年在城外河沟里捡的。']],
  xs_sanxiu:[['散修','（她攥着一个瘪瘪的钱袋，盯着琅琊阁的书架）……'],['散修','你们宗门的人，功法是师父教的吧？'],['散修','我们没有师父。只能买别人琢磨出来的。'],['散修','一本书，就是一个人的一辈子。']],
  xs_mother:()=>[['找孩子的妇人','（她手里攥着一根红头绳，一个一个地拉住过路的人）你们……你们见过一个穿红袄的小姑娘吗？'],
    ['找孩子的妇人','七岁，左耳下面有颗痣。正月里，就在这儿，买糖人的工夫……'],['找孩子的妇人','官府说是走丢了。可她认得路的，她认得回家的路的……'],
    ...(S.flags.c3_xs_axiu?[]:[['苏小棠','（她轻轻握住那个妇人的手）……我们帮你留意。'],{flag:'c3_xs_axiu'}]),['旁白','妇人点点头，又去拉下一个人了。']],
};
On.talk(id=>{ if(RT.mapId!=='jc_xishi') return false;
  if(id==='tang'){ C3.menu('tang',S.flags.c3_xs_xue?[['苏小棠','龙血竭有了。还差石钟乳和还魂草……'],['苏小棠','八百灵石……要是拍卖会能用丹药换就好了。']]:[['苏小棠','先去百草行！南边挂药旗的那家。']]); return true; }
  const L=XS.TALK[id]; if(!L) return false; UI.say(typeof L==='function'?L():L,()=>{ UI.hud(); Story.check(); }); return true; });
{ const _d=Portal.dests; Portal.dests=function(){ const l=_d.call(Portal); if(S.flags.c3_xs_in&&RT.mapId!=='jc_xishi') l.push({name:'京城 · 西市', map:'jc_xishi', x:29, y:10}); return l; }; }

/* ---------- the quest ---------- */
{ const q=QUESTS.find(q=>q.id==='c3g'); Object.assign(q,{
    progress:s=>{ const F=s.flags; return !F.c3_sf_morning?'宵禁了，回自己宗门的厢房睡觉':!F.c3_xs_in?'去西市（四方馆门外往西）':!F.c3_xs_xue?'去百草行买龙血竭（西市南边）':'千年石钟乳：回春堂（朱雀大街，下一步）'; },
    target:s=>{ const F=s.flags, [x,y]=SF_WING[s.sect]; if(!F.c3_sf_morning) return ['jc_sifang',x+3,y+3,'你们的厢房'];
      if(!F.c3_xs_xue) return RT.mapId==='jc_xishi'?['jc_xishi',5,17,'百草行']:['jc_sifang',1,23,'往西的街'];
      return ['jc_zhuque',22,6,'回春堂']; }}); }
