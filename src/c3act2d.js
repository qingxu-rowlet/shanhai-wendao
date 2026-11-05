/* ============================================================
   山海问道 · 第三章「京城」 · 第二幕 · 回春堂 — the second herb. The 掌柜 has one piece of 千年石钟乳 and won't sell it:
   孙大夫 keeps it for someone who needs it. 孙大夫 is taking the pulse of a man from the north who eats and eats and is
   always hungry, and thinner every day; forty years a doctor and he has never seen it. 苏小棠 feels the pulse: it is
   empty, as if something were drawing his 精气 away. His village (柳河村, near 安平村) was taken by soldiers last autumn;
   he hid in the cellar; since then he dreams of a great mouth, a great pot. 孙大夫 is short-handed: help him make up
   three prescriptions (抓药) and the 石钟乳 is yours — free if you get every herb right, at cost otherwise.
   ============================================================ */
const HC={
  st(){ const c=C3.st(); c.hc=c.hc||{round:0, miss:0}; return c.hc; },
  go(){ enterMap('jc_huichun',8,10); RT.dir='up'; UI.hud(); },
  // the three prescriptions: what goes in, and what a careless hand might reach for instead (with why it's wrong)
  RX:[
    {who:'北边来的汉子', name:'四君子汤', say:'人参、白术、茯苓。先把他的气补上。', need:['人参','白术','茯苓'],
      wrong:{附子:'附子大热，他这身子，受不住。', 大黄:'大黄是泻药！他本来就虚……', 麻黄:'麻黄发汗的，他没受寒。'}},
    {who:'抱孩子的妇人', name:'银翘散', say:'孩子发热，嗓子疼。金银花、连翘、薄荷。', need:['金银花','连翘','薄荷'],
      wrong:{肉桂:'肉桂是热的，孩子本来就烧着呢。', 干姜:'干姜也是热的……', 鹿茸:'鹿茸？给一个三岁的孩子？'}},
    {who:'老婆婆', name:'酸枣仁汤', say:'夜里睡不着，心慌。酸枣仁、茯神、远志。', need:['酸枣仁','茯神','远志'],
      wrong:{黄连:'黄连太苦了，又凉，老人家脾胃弱。', 巴豆:'巴豆！吃了要拉三天的！', 麻黄:'麻黄让人更睡不着。'}},
  ],
  shuffle(l){ const R=rng(S.day*7+l.length+HC.st().round*13+(HC.st().miss||0)); l=[...l]; for(let i=l.length-1;i>0;i--){ const j=Math.floor(R()*(i+1)); [l[i],l[j]]=[l[j],l[i]]; } return l; },
  CHAT:{hc_zhang:['称好了，您拿好。'], hc_tu:['够不着……'], hc_sun:['伸手。','舌头。'], hc_bei:['……饿。'], hc_mu:['乖，不哭……'], hc_po:['睡不着啊……']},
};
JC.CHAT=Object.assign(JC.CHAT,HC.CHAT);

/* ---------- arriving ---------- */
On.enter(id=>{ if(id==='jc_huichun'&&!S.flags.c3_hc_in) setTimeout(()=>{ if(RT.mapId==='jc_huichun'&&!S.flags.c3_hc_in) UI.say(HC.arrive(),()=>{ UI.hud(); Story.check(); }); },500); });
HC.arrive=()=>[
  ['旁白','回春堂里一股苦香。一整面墙的小抽屉，从地上一直摞到房梁，每一格上都贴着药名。'],
  ['旁白','靠墙的长凳上坐满了等着看病的人。里头一张桌子后面，一个白胡子老大夫正在给人号脉。'],
  ['苏小棠','（她站在百子柜前面，仰着头，半天没说话）……'],
  ['苏小棠','……比我们谷里的药房还大。'],
  {flag:'c3_hc_in'},
  ['旁白','（问问柜台后面的掌柜，有没有千年石钟乳。）']];

/* ---------- the 掌柜, and 孙大夫 ---------- */
HC.ask=()=>[
  ['回春堂掌柜','千年石钟乳？有，就一块。'],
  ['回春堂掌柜','不过不卖。'],
  ['苏小棠','为什么呀？'],
  ['回春堂掌柜','那是孙大夫留着的。他说，那块石钟乳，要给用得着的人。'],
  ['回春堂掌柜','（他朝里头努了努嘴）你们自己去问他吧。今天人多，他怕是没工夫搭理你们。'],
  {flag:'c3_hc_ask'}];
HC.pulse=()=>[
  ['旁白','孙大夫三根手指搭在一个汉子的手腕上，眉头越皱越紧。'],
  ['北边来的汉子','大夫……我吃多少都饿。一顿吃五个馍，还是饿。'],
  ['北边来的汉子','可人倒是一天比一天瘦。'],
  ['孙大夫','脉虚得厉害，像是饿了一整年的人。可他明明吃得下……'],
  ['孙大夫','老夫行医四十年，没见过这种病。'],
  ['苏小棠','（她犹豫了一下）……大夫，我能摸摸看吗？'],
  ['旁白','孙大夫看了她一眼，让开了。苏小棠搭上脉，闭着眼睛，过了很久。'],
  ['苏小棠','……脉是空的。'],
  ['苏小棠','不是病。像是……有什么东西，把他的精气，一点一点地吸走了。'],
  ['北边来的汉子','（他的手抖了一下）……'],
  ['北边来的汉子','我们村子，去年秋天来了官兵，把人都带走了。我躲在地窖里，才没被带走。'],
  ['北边来的汉子','从那以后，夜里老做一个梦。梦见一张大嘴，一口好大的锅……'],
  ['我','你们村子，叫什么？'],
  ['北边来的汉子','柳河村。北边的，离安平村不远。'],
  ['我','（……柳河村。安平村的隔壁。）'],
  {flag:'c3_hc_pulse'},
  ['孙大夫','（他捋着胡子，看着苏小棠）小姑娘，药王谷的？'],
  ['孙大夫','看不了的病，就先补着。可今天外头还排着十几个人，老夫一个人忙不过来。'],
  ['孙大夫','你们两个，帮老夫抓药。抓对了，那块石钟乳，就给你们。'],
  ['苏小棠','（她冲你眨了眨眼睛）{名}，你来抓，我在旁边看着。']];

/* ---------- 抓药: three prescriptions, three herbs each, four drawers to choose from each time ---------- */
HC.zhua=()=>{ const h=HC.st(); if(h.round>=HC.RX.length) return HC.done(); const rx=HC.RX[h.round]; h.left=h.left&&h.left.length?h.left:[...rx.need];
  UI.say([['孙大夫',`${rx.who}：${rx.name}。${rx.say}`]],()=>HC.pick()); };
HC.pick=()=>{ const h=HC.st(), rx=HC.RX[h.round], got=rx.need.length-h.left.length, wrong=HC.shuffle(Object.keys(rx.wrong)).slice(0,4-Math.min(h.left.length,2)), opts=HC.shuffle([...h.left.slice(0,2),...wrong]);
  UI.say([{choice:`《${rx.name}》　抓第 ${got+1} 味（共 ${rx.need.length} 味）`, options:opts.map(n=>({text:`拉开「${n}」那一格`, fn:()=>HC.take(n)}))}]); };
HC.take=n=>{ const h=HC.st(), rx=HC.RX[h.round];
  if(rx.need.includes(n)){ h.left=h.left.filter(x=>x!==n); Sound.coin&&Sound.coin(); save();
    if(h.left.length) return UI.say([['旁白',`你从「${n}」那一格里抓出一把，放在戥子上称好，倒在纸上。`]],()=>HC.pick());
    h.round++; h.left=null; save(); return UI.say([['旁白','三味药包进纸里，拿红绳一扎。'],['孙大夫','（他看了一眼）嗯。'],...(h.round<HC.RX.length?[['旁白','下一个。']]:[])],()=>HC.zhua()); }
  h.miss++; save(); UI.say([['苏小棠',`（她一把按住你的手）等等！${rx.wrong[n]}`],['孙大夫','……再想想。']],()=>HC.pick()); };
HC.done=()=>{ const h=HC.st(), price=h.miss?80:0, pay=Math.min(price,S.stones); UI.say([
  ['孙大夫','手脚还算麻利。'],
  ...(h.miss?[['孙大夫',`错了 ${h.miss} 回。……那块石钟乳，收你们八十灵石，算个本钱。`],...(pay<price?[['孙大夫','（他看了看你瘪瘪的钱袋）……有多少给多少吧。']]:[])]:[['孙大夫','一味都没抓错。那块石钟乳，送你们了。']]),
  ['旁白','掌柜从柜台最底下的一格里，捧出一个锦盒。里面是一截乳白色的石头，摸上去凉凉的，像是还在往下滴水。'],
  {run:()=>{ S.stones-=pay; addItem('c3_ru',1); Sound.coin(); UI.hud(); }}, {flag:'c3_hc_ru'},
  ['旁白','（得到「千年石钟乳」。）'],
  ['苏小棠','两味了！'],
  ['苏小棠','还差最后一味……九转还魂草。聚宝楼的拍卖会，八百灵石起价……'],
  ['孙大夫','九转还魂草？'],
  ['孙大夫','（他沉默了一会儿）……拍卖会上，有人会跟你们抢的。萧府的人，最近什么药都收。'],
  ['孙大夫','小姑娘。那个汉子的脉，你要是想明白了，回来告诉老夫一声。']],()=>{ UI.hud(); Story.check(); }); };
Object.assign(ITEMS,{c3_ru:{name:'千年石钟乳', icon:'i_ru', quest:true, keep:true, desc:'结丹丹的第二味主药。乳白色，摸上去凉凉的，像是还在往下滴水。回春堂孙大夫留着的那一块。'}});
Object.assign(SPR,{i_ru:['............','...zzzzzz...','....zxxz....','....zxxz....','.....zxz....','.....zz.....','......z.....','......l.....','............','......l.....']});

/* ---------- talking, and the things in the room ---------- */
HC.TALK={
  hc_zhang:()=>S.flags.c3_hc_ru?[['回春堂掌柜','那块石钟乳，孙大夫藏了十年了。'],['回春堂掌柜','……他肯给你们，是看得起你们。']]:S.flags.c3_hc_ask?[['回春堂掌柜','去问孙大夫吧。']]:HC.ask(),
  hc_sun:()=>{ const F=S.flags; if(!F.c3_hc_ask) return [['孙大夫','（他正给人号脉，头也不抬）……排队。']];
    if(!F.c3_hc_pulse) return HC.pulse(); if(!F.c3_hc_ru) return null;
    return [['孙大夫','那个汉子的脉……老夫也想了一宿。'],['孙大夫','精气被吸走……人怎么会被吸走精气呢。']]; },
  hc_tu:[['小学徒','（他踮着脚，够最上面一格抽屉）……够不着。'],['小学徒','师父说，等我够得着最上面那一格，就能出师了。']],
  hc_bei:()=>S.flags.c3_hc_pulse?[['北边来的汉子','……谢谢你们。'],['北边来的汉子','我娘也被带走了。我在京城等着，说不定哪天，能找到她。']]:[['北边来的汉子','（他捧着肚子，脸色蜡黄）……饿。']],
  hc_mu:()=>S.flags.c3_hc_ru?[['抱孩子的妇人','多谢小神医！孩子喝了药，睡着了。']]:[['抱孩子的妇人','孩子烧了两天了……'],['抱孩子的妇人','晚上不让出门，想请大夫都请不来。']],
  hc_po:[['老婆婆','睡不着啊……'],['老婆婆','一闭眼，就想起我那小孙子。去年冬天，在城西走丢的。'],['老婆婆','官府说，走丢的孩子多了，找不过来。']],
};
On.talk(id=>{ if(RT.mapId!=='jc_huichun') return false;
  if(id==='hc_bei'&&count(S,'c3_letter')){ UI.say(ZY.deliver(),()=>{ UI.hud(); Story.check(); }); return true; }   // 青禾's letter (third act)
  if(id==='tang'){ C3.menu('tang',S.flags.c3_hc_ru?[['苏小棠','那个汉子的脉……'],['苏小棠','{名}，我从来没摸过那样的脉。像一口井，底下是空的。']]:[['苏小棠','这么多抽屉……我能在这里待一整天。']]); return true; }
  if(id==='hc_sun'&&S.flags.c3_hc_pulse&&!S.flags.c3_hc_ru){ HC.zhua(); return true; }
  const L=HC.TALK[id]; if(!L) return false; const lines=typeof L==='function'?L():L;
  UI.say(lines,()=>{ UI.hud(); Story.check(); if(id==='hc_sun'&&S.flags.c3_hc_pulse&&!S.flags.c3_hc_ru) setTimeout(()=>HC.zhua(),200); }); return true; });
On.act('hccounter',o=>Story.talk('hc_zhang'));
On.act('hcdesk',o=>Story.talk('hc_sun'));
On.act('hcstove',o=>UI.say([['旁白','炉子上咕嘟咕嘟煎着药，一屋子苦香。']]));
On.act('hcnian',o=>UI.say([['旁白','一只铁药碾。碾槽里还剩着一点没碾完的药末。']]));
On.theme(id=>id==='jc_huichun'?'calm':null);

/* ---------- the quest ---------- */
{ const q=QUESTS.find(q=>q.id==='c3g'), _p=q.progress, _t=q.target; Object.assign(q,{
    progress:s=>{ const F=s.flags; if(!F.c3_xs_xue) return _p(s); return !F.c3_hc_ask?'去回春堂问千年石钟乳（朱雀大街东边）':!F.c3_hc_ru?'回春堂：问孙大夫，帮他抓药':`九转还魂草：聚宝楼的拍卖会（第 ${XS.auctionDay()} 天晚上，下一步）`; },
    target:s=>{ const F=s.flags; if(!F.c3_xs_xue) return _t(s); const In=RT.mapId==='jc_huichun';
      if(!F.c3_hc_ask) return In?['jc_huichun',5,6,'掌柜']:['jc_zhuque',22,6,'回春堂'];
      if(!F.c3_hc_ru) return In?['jc_huichun',13,5,'孙大夫']:['jc_zhuque',22,6,'回春堂'];
      return ['jc_xishi',26,6,'聚宝楼']; }}); }
