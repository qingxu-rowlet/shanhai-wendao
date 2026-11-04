/* ============================================================
   山海问道 · 第三章的审查点 — each beat of act 1 「北上」 as a save you can open with #t-<id> (or from #review). Every save
   starts from chapter two's end (Chapters.C2) and adds only what this chapter has done by then.
   ============================================================ */
const XS_RV={c3_raid_won:true,c3_a1_done:true,c3_jc_go:true,c3_jc_in:true,c3_jc_board:true,c3_sf_in:true,c3_sf_tang:true,c3_sf_jiedan:true,c3_sf_recipe:true,c3_sf_morning:true};
{ const A=['c3_go','c3_cooked','c3_dinner','c3_morning','c3_anping_in','c3_notice','c3_shrine','c3_old','c3_grave','c3_night'];
  const upto=f=>Object.fromEntries(A.slice(0,A.indexOf(f)+1).map(k=>[k,true]));
  const go=(flags,map,x,y,dir,quest,hour)=>{ Review.base({quest, L:12, sect:'jian'}); Chapters.C2.ensure(S); Object.assign(S.flags,flags);
    S.c3={wood:flags.c3_cooked?[0,1,2]:[], water:flags.c3_cooked?1:0}; if(flags.c3_go){ S.inv.c2_bagua=1; S.flags.c3_wu_hulu=true; } S.min=(hour||10)*60; Review.at(map,x,y,dir); Story.check(); };
  const N=(id,title,check,run)=>({id:'c3-'+id, group:'第三章', title, check, run});
  Review.NODES.push(
    N('go','开春：师尊交镜，出发北上','第二章已经打完，站在师尊面前。点师尊：「弟子准备好了」/「再等等」。准备好了：师尊把解开一面的八卦镜交给你，外门弟子送行（药王谷弟子：苏小棠一起走），黑屏后到官道边的营地。',
      ()=>go({},'zong_jian',15,6,'up','c2z')),
    N('road','第一夜：捡柴、打水、煮粥','官道边的营地，傍晚。左上角任务：捡三根柴火（林子边上）、去溪边的泉眼打水，然后在锅边煮粥。路北横着几根倒树，过不去。',
      ()=>{ go(upto('c3_go'),'c3_road',10,12,'up','c3a',18); setTimeout(()=>UI.say(C3.arrive()),400); }),
    N('dinner','篝火边：大师姐说起上一届的头名','柴和水都齐了，站在锅边。点锅：煮粥，大师姐坐到对面，说上一届大比是她拿的头名。两个回答都试一下。远处传来狼嚎。然后回帐篷睡觉，第二天早上路通了。',
      ()=>{ go(upto('c3_go'),'c3_road',8,11,'up','c3a',19); S.c3={wood:[0,1,2], water:1}; enterMap('c3_road',8,11); UI.hud(); }),
    N('anping','安平村：空村、告示、封条','进村：没有人声。村口告示「奉上谕，阖村迁出」，落款「钦差　萧」。四间屋子门上都贴着封条，点一点有不同的东西。',
      ()=>go(upto('c3_morning'),'c3_road',10,2,'up','c3b',12)),
    N('shrine','安平村：祠堂（插画「裂开的牌位」）','站在祠堂门口。进去：插画「裂开的牌位」，大师兄的长生禄位从中间裂开，上面压着四道爪痕。看完，井边出现一个老人。',
      ()=>go(upto('c3_notice'),'c3_anping',11,6,'up','c3b',14)),
    N('old','安平村：井边的老人','老人讲去年秋天京城来的大人，第二天全村被兵带走。两个问题都试一下（「陆仙长真的是好人吗」会多一句：那几年狼从没下山咬过人）。最后他说那位大人去过后山。',
      ()=>go(upto('c3_shrine'),'c3_anping',8,13,'down','c3b',15)),
    N('grave','后山：小小的石堆','后山上塌了的草窝，旁边一个石堆，摆着没谢的野花，石头上四道爪痕。看完，天黑，回到营地。',
      ()=>go(upto('c3_old'),'c3_anping',20,5,'up','c3b',17)),
    N('raid','夜袭：猲狙头狼（Boss）','营地，入夜。红头的狼从林子里围上来，大师姐挡住狼群，头狼交给你。打输了会回到篝火边，点篝火再打。',
      ()=>go(upto('c3_grave'),'c3_road',7,10,'up','c3c',20.5)),
    N('ridge','打完之后：山脊上的人（插画「山脊」）','头狼倒下，山脊上一声口哨，狼群退走。插画「山脊」：月亮底下，一个披大氅的人和他的狼。大师姐：「他一直在看你。」第一幕完。',
      ()=>{ go(upto('c3_night'),'c3_road',7,9,'up','c3c',21); setTimeout(()=>UI.say(SCRIPTS.c3_raid_win,()=>{ UI.hud(); Story.check(); }),400); }),
    N('tocity','第二幕：天亮进京','打完猲狙的那一夜，站在帐篷前。回帐篷睡觉：第二天早上收拾上路，黑屏后到京城朱雀门外，守城兵查文书。',
      ()=>go({...upto('c3_night'),c3_raid_won:true,c3_a1_done:true},'c3_road',4,11,'up','c3z',21)),
    N('gate','朱雀门：进城','傍晚，朱雀门外。城门楼、石狮子、守门的兵；守城兵看文书时多看了大师姐一眼，提醒「萧大人有令，入夜宵禁」。',
      ()=>go({...upto('c3_night'),c3_raid_won:true,c3_a1_done:true,c3_jc_go:true},'jc_zhuque',13,32,'up','c3d',16.5)),
    N('city','朱雀大街：逛一逛、看告示','城里，朱雀大街。两边是酒楼、当铺、布庄、药铺、茶楼、客栈；十字街上有包子摊、布摊、首饰摊、水果摊，糖葫芦（10 灵石，吴阿蛮要的）、包子（5 灵石）能买；走近的人头顶会冒出一句话；每个人都能说话。十字街口的告示：大比、宵禁、寻人。西边、东边、北边的路口暂时拦着（之后的地图）。',
      ()=>go({...upto('c3_night'),c3_raid_won:true,c3_a1_done:true,c3_jc_go:true,c3_jc_in:true},'jc_zhuque',13,22,'up','c3e',16.5)),
    N('sifang','四方馆：登记入住','四方馆门口。进门：礼部小吏登记，写到「谢霁月」时停了一下；四宗的厢房、老槐树、下棋的两个人、后院的月洞门。',
      ()=>go({...upto('c3_night'),c3_raid_won:true,c3_a1_done:true,c3_jc_go:true,c3_jc_in:true,c3_jc_board:true},'jc_sifang',15,19,'up','c3e',17)),
    N('yard','四方馆：苏小棠和别的宗门','已经登记。找苏小棠（不管哪个宗门都在药王谷的厢房；药王谷弟子是另一段）；和别的宗门的参赛弟子说话：林沧、乌兰（她的狌狌闻到你身上有狼味）、温玄（「有什么东西在吃星星」）；下棋的两个人。',
      ()=>go({...upto('c3_night'),c3_raid_won:true,c3_a1_done:true,c3_jc_go:true,c3_jc_in:true,c3_jc_board:true,c3_sf_in:true},'jc_sifang',12,15,'up','c3f',17)),
    N('jiedan','槐树底下：大师姐说结丹','苏小棠和别的宗门都见过了。去槐树底下找大师姐：上一回她能拿头名，是因为比别人高一个境界——离大比十天，结丹。然后去找苏小棠要丹方（三味主药），宵禁的梆子响，回自己宗门的厢房睡觉，第二天早上苏小棠拉你去西市。',
      ()=>{ go({...upto('c3_night'),c3_raid_won:true,c3_a1_done:true,c3_jc_go:true,c3_jc_in:true,c3_jc_board:true,c3_sf_in:true,c3_sf_tang:true},'jc_sifang',12,11,'up','c3f',18); S.c3.met=['sf_lin','sf_wulan','sf_wenxuan']; Story.check(); }),
    N('xishi','西市：进门','四方馆住下的第二天早上，从四方馆门外往西走到西市。苏小棠一进来眼睛就不够用。北边：琅琊阁和门口的琅琊榜、牌坊、聚宝楼；中间：旧书、符纸、鸟笼、古玩四个摊子；南边：百草行、玄铁斋、博古斋，后街上晒着药材，一个妇人在找孩子。',
      ()=>{ go({...upto('c3_night'),...XS_RV},'jc_xishi',30,10,'left','c3g',9); }),
    N('xue','百草行：龙血竭（苏小棠识破假货）','百草行门口。和掌柜说话：他先拿出假的龙血竭，苏小棠抹在纸上识破，掌柜从后屋拿出真的（萧府把真的都收走了），砍价到 120 灵石，灵石不够时苏小棠帮你垫上。',
      ()=>{ go({...upto('c3_night'),...XS_RV,c3_xs_in:true},'jc_xishi',5,18,'up','c3g',10); }),
    N('lang','琅琊阁：功法和琅琊榜','琅琊阁门口，身上有 600 灵石。和阁主说话：书架上三本散修功法（每三天换一批），买一本，属性永久增加。门口的琅琊榜：另外三宗的弟子、大师姐（旁边有人添了一行字）、苏小棠、你（「新人，不详」）。聚宝楼的伙计：拍卖会七天一场，压轴是九转还魂草。',
      ()=>{ go({...upto('c3_night'),...XS_RV,c3_xs_in:true},'jc_xishi',8,7,'up','c3g',10); S.stones=600; UI.hud(); }),
    N('huichun','回春堂：进门、问石钟乳','买到龙血竭以后，在回春堂里（从朱雀大街的回春堂门口进来）。一整面墙的百子柜、柜台、孙大夫的诊桌、长凳上等着看病的人、煎药的炉子。问掌柜：千年石钟乳只有一块，不卖，是孙大夫留着的。',
      ()=>{ go({...upto('c3_night'),...XS_RV,c3_xs_in:true,c3_xs_xue:true},'jc_huichun',8,10,'up','c3g',11); addItem('c3_xue',1); }),
    N('zhua','回春堂：孙大夫号脉、抓药','掌柜已经问过了，站在孙大夫旁边。点孙大夫：北边来的汉子吃多少都饿，苏小棠摸出他的脉是空的；他是柳河村的（离安平村不远）。然后帮孙大夫抓三副药（四君子汤、银翘散、酸枣仁汤），每次从四个抽屉里选一味；抓错了苏小棠会拦住你。一味没错，石钟乳白送；错过就收 80 灵石。',
      ()=>{ go({...upto('c3_night'),...XS_RV,c3_xs_in:true,c3_xs_xue:true,c3_hc_in:true,c3_hc_ask:true},'jc_huichun',13,5,'right','c3g',11); addItem('c3_xue',1); }),
    N('pool','四方馆：凑拍卖的钱（大师姐当了青玉珠）','石钟乳已经拿到，回到四方馆，站在大师姐旁边，身上只有 100 灵石。点大师姐：她拿出上一届大比的赏钱四百，苏小棠倒出一百五；还不够，大师姐解下剑穗上师父给的青玉珠，拿去当了。',
      ()=>{ go({...upto('c3_night'),...XS_RV,c3_xs_in:true,c3_xs_xue:true,c3_hc_in:true,c3_hc_ask:true,c3_hc_pulse:true,c3_hc_ru:true},'jc_sifang',12,11,'up','c3g',10); S.stones=100; UI.hud(); }),
    N('auction','聚宝楼：拍卖会（九转还魂草）','第七天，天黑以后，站在聚宝楼门口，钱已经凑好了。点伙计进去：看客认出大师姐，萧府管家一千、两千地买；压轴的九转还魂草和盐商、萧府管家抢，举几次牌以后，楼上的小厮下来传话，管家不要了。雅间的帘子掀开一道缝：一只手，一枚白骨扳指。',
      ()=>{ go({...upto('c3_night'),...XS_RV,c3_xs_in:true,c3_xs_xue:true,c3_hc_in:true,c3_hc_ask:true,c3_hc_pulse:true,c3_hc_ru:true,c3_ju_pool:true,c3_xie_pawn:true},'jc_xishi',26,7,'up','c3g',18.5); S.day=7; S.stones=100; JU.st().pool=1100; UI.hud(); Story.check(); }),
    N('lu','彩蛋：风眼里的大师兄问牌位','去过安平村祠堂以后，在风眼挑战狂暴穷奇：开打前大师兄问你路过安平村没有；打赢后问牌位还在不在。「裂了」和「还在」两种回答。',
      ()=>{ go({...upto('c3_shrine'),c3_a1_done:true},'fx3',8,8,'up','c3z'); S.fxRematchDay=-1; }),
  ); }
if(window.CH3_LOCKED) Review.NODES=Review.NODES.filter(n=>!n.id.startsWith('c3-'));
