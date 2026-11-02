/* ============================================================
   山海问道 · 第三章的审查点 — each beat of act 1 「北上」 as a save you can open with #t-<id> (or from #review). Every save
   starts from chapter two's end (Chapters.C2) and adds only what this chapter has done by then.
   ============================================================ */
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
    N('lu','彩蛋：风眼里的大师兄问牌位','去过安平村祠堂以后，在风眼挑战狂暴穷奇：开打前大师兄问你路过安平村没有；打赢后问牌位还在不在。「裂了」和「还在」两种回答。',
      ()=>{ go({...upto('c3_shrine'),c3_a1_done:true},'fx3',8,8,'up','c3z'); S.fxRematchDay=-1; }),
  ); }
if(window.CH3_LOCKED) Review.NODES=Review.NODES.filter(n=>!n.id.startsWith('c3-'));
