/* ============================================================
   山海问道 · 审查节点 — every review point has its own link: …/#t-<id>
   Opening it builds a test character (save slot 3), sets up the story state, puts you right next to
   the thing to check, and pins a note saying what to look at. …/#review lists every node.
   ============================================================ */
const Review = {
  NODES:[
    // 流程
    {id:'prologue', group:'流程', title:'新开存档 · 序章', check:'创建角色 → 测灵根 → 云游子交代采灵草。节奏顺不顺？提示看不看得懂？',
      run(){ RT.slot=SLOTS-1; try{ localStorage.removeItem(slotKey(RT.slot)); }catch(e){} Creator.open(RT.slot); }},
    {id:'gather', group:'流程', title:'采灵草 → 打坐', check:'站在灵草旁：头顶有没有「E / 采」提示？采完后去右上的蒲团打坐，主线能不能推进？',
      run(){ Review.base({quest:'q1', L:0}); Review.at('home',4,9,'up'); }},
    {id:'town', group:'流程', title:'初到桃源镇', check:'阿禾的对话里有没有介绍小棠和长歌？左上任务列表会出现新的支线。',
      run(){ Review.base({quest:'q3', L:1}); Review.at('town',15,10,'right'); }},
    {id:'qiongqi', group:'剧情', title:'讨伐穷奇', check:'站在狐祠前，点狐祠开战。登场动画、战斗音乐、半血换阶段、战后顾长歌出手。',
      run(){ Review.base({quest:'q6', L:5, inv:{huichun:3}, kills:3}); Review.at('forest',15,20,'down'); }},
    {id:'zhuji', group:'剧情', title:'筑基：心魔 + 天劫', check:'站在蒲团旁，点蒲团冲击筑基：心魔战 → 躲天雷。',
      run(){ Review.base({quest:'q7', L:9, full:true, flags:{qiongqi_done:true}, inv:{zhuji:1, huichun:3}}); Review.at('home',16,5,'up'); }},
    {id:'sect', group:'剧情', title:'拜师大典', check:'站在测灵石旁，点它：小棠拜入药王谷、长歌说「我是散修」、选门派、师父叫你小师弟/小师妹。',
      run(){ Review.base({quest:'sect', L:10, flags:{qiongqi_done:true, sect_open:true}}); Review.at('town',12,8,'up'); }},
    {id:'huli', group:'剧情', title:'青丘狐影 → 饕餮', check:'站在狐祠前，点狐祠：九尾狐出来道谢（只有对话，没有战斗）、两个问题二选一、饕餮登场动画、第一章结束。',
      run(){ Review.base({quest:'q8', L:10, sect:'jian', flags:{qiongqi_done:true, sect_open:true, tang_sect:true}, inv:{huichun:4}}); Review.at('forest',15,20,'down'); }},
    // 界面
    {id:'hud', group:'界面', title:'任务列表 HUD', check:'左上角同时有主线和几个支线：字够不够大？点一行切换追踪，点「寻路」自动走过去。手机上会不会挡视线？',
      run(){ Review.base({quest:'q5', L:3, sect:null, flags:{met_ahe:true}, side:{soup:'active'}}); Review.at('town',12,11,'down'); }},
    {id:'prompt', group:'界面', title:'互动提示（E 键）', check:'走近阿禾、灵草、狐祠等：头顶出现 E（手机上是「聊 / 采 / 点」），按 E 能不能直接互动？',
      run(){ Review.base({quest:'q4', L:2}); Review.at('town',15,10,'right'); }},
    // 钓鱼
    {id:'fish', group:'钓鱼', title:'手持鱼竿 + 钓鱼', check:'手里拿着鱼竿；靠近水边按 E（或点水面）抛竿，能看到鱼线和浮漂，咬钩时浮漂下沉；钓鱼面板在屏幕下方。',
      run(){ Review.base({quest:'q4', L:2, inv:{rod:1}}); S.sel='rod'; Review.at('town',5,14,'down'); }},
    {id:'fishking', group:'钓鱼', title:'金光水面 · 鱼王', check:'脚下就是金光水面，夜里钓鱼王的概率最高。鱼王上钩时的特效和难度是否合适？',
      run(){ Review.base({quest:'q4', L:2, inv:{rod:1}}); S.sel='rod'; S.min=22*60; S.glow=[{map:'town',x:5,y:15}]; Review.at('town',5,14,'down'); }},
    {id:'meditate', group:'修炼', title:'闭关打坐', check:'站在洞府的蒲团旁，按 E 打坐：拖动滑条选时长（2 小时到 30 天），看预计境界和「一直闭关的话」多久到哪一层，再看进度条。也可以等到半夜 12 点，确认不会再昏倒。',
      run(){ Review.base({quest:'q4', L:2}); S.min=22*60; Review.at('home',4,9,'up'); setTimeout(()=>meditate(),400); }},
    {id:'art-town', group:'美术', title:'桃源镇（白天）', check:'新画的房子、石板广场、土路边缘、池塘、飘落的花瓣和云影。',
      run(){ Review.base({quest:'q4', L:2}); S.min=11*60; Review.at('town',11,5,'down'); }},
    {id:'art-forest', group:'美术', title:'青丘山林（傍晚）', check:'树的光影、池塘深浅和沙岸、高草、落叶，以及傍晚的暖色。',
      run(){ Review.base({quest:'q4', L:2}); S.min=17*60; Review.at('forest',8,11,'down'); }},
    {id:'art-night', group:'美术', title:'洞府（夜里）', check:'萤火虫、灯笼的光、夜里的路和崖壁。',
      run(){ Review.base({quest:'q4', L:2}); S.min=21*60; Review.at('home',11,6,'down'); }},
    {id:'qiyu', group:'奇遇', title:'奇遇一览（直接触发任意一个）', check:'从列表里挑一个奇遇直接开始。测试角色已有灵草、灵菇、朱果、兽皮和灵石，善念 5、炼气七层，所有条件都满足。看完可以在 行囊 → 图鉴 → 奇遇 里看记录。',
      run(){ Review.base({quest:'q8', L:7, inv:{lingcao:3, lingmo:3, zhuguo:2, hide:4, huichun:2}, flags:{fox_kind:true}}); S.karma=5; S.stones=400; S.min=22*60; Review.at('forest',14,12,'down');
        setTimeout(()=>Qiyu.pickFor(),500); }},
    {id:'qiyu-map', group:'奇遇', title:'山林里的奇遇闪光', check:'今天的奇遇已经放在山林里（白泽问道）。跟着闪光找过去，按 E。',
      run(){ Review.base({quest:'q8', L:7}); S.karma=5; S.qiyu={ev:'baize', spot:1, done:false}; Hooks.placeQiyu(); S.min=10*60; Review.at('forest',16,10,'right'); }},
    {id:'bounty', group:'悬赏榜', title:'悬赏榜', check:'面前就是悬赏榜，按 E。测试角色已经能交付一个悬赏，并有 12 点声望可以兑换东西。看看委托的文字、进度、交付 / 领赏和声望兑换。',
      run(){ Review.base({quest:'q8', L:5, inv:{lingcao:4, lingmo:3, hide:3, huichun:2, juqi:1, fish_li:1}}); S.rep=12; Bounty.roll(); S.bounty.list[0]={kind:'item', key:'lingcao', n:3, who:'钱掌柜', text:'城里药铺订了一批灵草——交 3 个灵草', pay:38, rep:1, done:false}; Review.at('town',14,8,'up'); setTimeout(()=>Bounty.open(),500); }},
    {id:'dodge', group:'战斗', title:'穷奇 · 回合 + 躲弹幕', check:'你的回合照常选招式；穷奇的回合会弹出一个框，用 WASD / 方向键（手机：按住屏幕拖动）操纵灵珠躲开弹幕。打一整场：五种弹幕的难度、时长、伤害合不合适？护体后弹幕会变慢、伤害减半。',
      run(){ Review.base({quest:'q6', L:5, inv:{huichun:3, juqi:1}, kills:3}); Review.at('forest',15,20,'down'); setTimeout(()=>Battle.start('qiongqi',r=>UI.toast(r==='win'?'赢了！':'输了')),400); }},
    {id:'dodge-p2', group:'战斗', title:'穷奇二阶段（风刃、怒吼）', check:'直接从穷奇半血开始，看二阶段的风刃（找缝隙）和怒吼（找圆环的缺口）。弹幕比一阶段快一些。',
      run(){ Review.base({quest:'q6', L:5, inv:{huichun:3, juqi:1}, kills:3}); Review.at('forest',15,20,'down'); setTimeout(()=>{ Battle._begin('qiongqi',r=>UI.toast(r==='win'?'赢了！':'输了')); const s=Battle.s; s.hp=Math.round(s.max*.52); Battle.act('atk'); },400); }},
    {id:'alchemy', group:'v0.9.7 试玩修正', title:'炼丹（变简单了）', check:'站在丹炉前，材料够炼好几炉。按住「鼓风」把火候保持在金色区域里，看上品是不是能炼出来了（上品 58%，中品 35%）。',
      run(){ Review.base({quest:'q8', L:9, inv:{lingcao:12, lingmo:6, zhuguo:6, qq_yu:2}}); Review.at('home',18,5,'up'); setTimeout(()=>UI.alchemy(),500); }},
    {id:'med-full', group:'v0.9.7 试玩修正', title:'修为圆满后静坐、坐到天黑', check:'炼气九层圆满、身上有筑基丹。按 E 打坐：先问冲击筑基还是静坐；选静坐，面板会说明修为不再增长，试试「坐到天黑」。',
      run(){ Review.base({quest:'q8', L:9, inv:{zhuji:1}}); S.exp=expNeed(9); S.min=10*60; Review.at('home',16,5,'up'); setTimeout(()=>meditate(),500); }},
    {id:'med-cap', group:'v0.9.7 试玩修正', title:'闭关修为不再虚高', check:'炼气八层。把滑条拉到 30 天：修为应该只显示到炼气九层圆满为止（几百，不是上万），开始后修满会提前出关。',
      run(){ Review.base({quest:'q8', L:8}); S.min=10*60; Review.at('home',16,5,'up'); setTimeout(()=>meditate(),500); }},
    {id:'rod', group:'v0.9.7 试玩修正', title:'青竹钓竿', check:'钱掌柜的店里能买青竹钓竿（400 灵石，你有 600）。买了以后去池塘边钓几条鱼，收线框应该更大、鱼更慢。悬赏榜也能用 8 声望换。',
      run(){ Review.base({quest:'q8', L:5, inv:{rod:1}}); S.stones=600; S.rep=10; Review.at('town',5,6,'up'); setTimeout(()=>UI.shop(),500); }},
    {id:'beasts', group:'成长', title:'新妖兽：狸力、鵸鵌、朱厌', check:'直接挑一只打：每种都有自己的弹幕。当康（冲撞）、狌狌（扔果子）也改成躲弹幕了。',
      run(){ Review.base({quest:'q8', L:7, inv:{huichun:3}, kills:3}); Review.at('forest',20,20,'down');
        setTimeout(()=>UI.say([{choice:'和谁打一场？', options:['lili','qitu','zhuyan','dangkang','xingxing'].map(k=>({text:BEASTS[k].name, fn:()=>Battle.start(k,()=>{})}))}]),500); }},
    {id:'stick', group:'成长', title:'手机摇杆 · 地图边缘不被挡住', check:'用手机打开，站在青丘山林最上面。按住屏幕任意处拖动会出现摇杆，松手就停；轻点地面或人物仍然会自己走过去。往上走能从顶上的路口回洞府——地图最上面一排不再被任务栏挡住，最下面一排也不被血条和物品栏挡住。',
      run(){ Review.base({quest:'q6', L:7}); Review.at('forest',14,2,'up'); }},
    {id:'hotbar', group:'成长', title:'快捷栏换道具 · 行囊下拉', check:'用手机打开。行囊里有普通钓竿和青竹钓竿（绿色的）。点青竹钓竿，下面会出现「放进快捷栏：1号 / 2号 / 3号」，点一个就换上去。再看「人物」和「图鉴」两页，内容长的时候能上下滑动。',
      run(){ Review.base({quest:'q8', L:10, sect:'jian', inv:{rod:1, rod_bamboo:1, huichun:3, juqi:2}, flags:{qiongqi_done:true, tang_sect:true, met_ahe:true}}); S.bar=null; Review.at('town',12,12,'down'); setTimeout(()=>{ UI._tab='bag'; UI.menu('bag'); },500); }},
    {id:'guide', group:'成长', title:'新手引导（手机）', check:'用手机打开：会依次弹出走路、任务、互动、行囊的提示；左上角任务栏只显示正在追踪的一条，点「展开」看全部。',
      run(){ Review.base({quest:'q1', L:0}); S.tips={}; Review.at('home',11,6,'down'); }},
    {id:'fx-enter', group:'风穴副本', title:'风穴入口 → 风谷', check:'站在山林东北角的风穴洞口前，按 E 进去。风谷里每隔几秒起风，会把你往下吹；躲在岩石正下方（头上是石头）就不会被吹走，头顶会显示「避风」。收集 3 片穷奇羽打开谷口。路上有蛊雕和狌狌，蛊雕也要躲弹幕。',
      run(){ Review.base({quest:'q6', L:6, inv:{huichun:3}, kills:3}); S.exp=expNeed(6); Review.at('forest',26,2,'up'); }},
    {id:'fx-grove', group:'风穴副本', title:'枯骨林（迷雾、幻影、点灯）', check:'只看得清身边一小圈。找到三个幻影（樵夫、恶霸、小姑娘），选项会改变善恶，并给风眼之战加成。读石碑，按「来路 → 亡者 → 己身」点亮三盏石灯，点错会灭灯并遇到伏击。',
      run(){ Review.base({quest:'q6', L:7, inv:{huichun:3}, kills:3, flags:{fx_valley:true, fx_gate:true, fx_s1:true, fx_s2:true, fx_s3:true}}); Review.at('fx2',2,7,'right'); }},
    {id:'fx-boss', group:'风穴副本', title:'风眼 · 穷奇三阶段', check:'按 E 挑战穷奇。半血进二阶段（风刃、怒吼），四分之一血进三阶段：漩涡会把灵珠往中间吸，还有羽雨；顾长歌会赶来，每次你出手后他补一剑。猛扑和漩涡时记得护体。带了「清心」（弹幕变慢）。',
      run(){ Review.base({quest:'q6', L:7, inv:{huichun:3}, kills:3, flags:{fx_valley:true, fx_gate:true, fx_lit:true, fx_clear_heart:true}}); Review.at('fx3',8,8,'up'); }},
    {id:'fx-rematch', group:'风穴副本', title:'狂暴穷奇（入宗门后再战）', check:'已拜入剑宗、筑基。风眼里有狂暴穷奇，按 E 挑战：血更厚、出手更狠、弹幕更快，这次没有顾长歌帮忙，要靠宗门绝学。每回合只被打中一两下、该护体时护体，带的回春丹够用就能赢。第一次赢得称号「镇风」、300 灵石、生命上限 +30；之后每天能再打一次，给 100 灵石。',
      run(){ Review.base({quest:'q8', L:10, sect:'jian', inv:{huichun:4, juqi:2}, flags:{qiongqi_done:true, tang_sect:true, fx_valley:true, fx_gate:true, fx_lit:true}}); Review.at('fx3',8,8,'up'); }},
    {id:'zhenfeng', group:'风穴副本', title:'师父传音：镇风支线', check:'已拜剑宗、筑基、打败过穷奇，站在洞府里。一两秒后会飘来师父的传音符，提醒你狂暴穷奇回来了；左上角任务栏会多出支线「镇风」并自动追踪，点「寻路」会走到风穴洞口。',
      run(){ Review.base({quest:'q8', L:10, sect:'jian', inv:{huichun:4}, flags:{qiongqi_done:true, tang_sect:true, fx_valley:true, fx_gate:true, fx_lit:true}}); S.side.zhenfeng=undefined; Review.at('home',11,8,'down'); }},
    {id:'skillfx', group:'成长', title:'宗门绝学动画', check:'直接进入和狂暴穷奇的战斗，灵力无限。点宗门绝学看动画；点上方的门派按钮换一个宗门再看：剑宗万剑归宗（剑雨 + 巨剑）、药王谷丹火（火球 + 烈焰）、万兽谷兽魂共鸣（灵宠虚影冲锋 + 三道爪痕）、天机阁定身符（符纸 + 八卦阵 + 光链）。',
      run(){ Review.base({quest:'q8', L:10, sect:'jian', flags:{qiongqi_done:true, tang_sect:true}}); S.pet={kind:'dangkang',lv:3,xp:0}; Review.at('fx3',8,8,'up');
        const bar=document.createElement('div'); bar.id='fxPick'; bar.innerHTML=Object.entries(SECTS).map(([k,s])=>`<button class="btn mini" data-k="${k}">${s.name}</button>`).join('');
        document.body.appendChild(bar); bar.querySelectorAll('button').forEach(b=>b.onclick=()=>{ Sound.tick(); if(Battle.s) Battle.close(); S.sect=b.dataset.k; start(); });
        const start=()=>{ S.mp=999; Battle._begin('qiongqi2',()=>{}); const keep=setInterval(()=>{ if(!Battle.s){ clearInterval(keep); return; } S.mp=999; if(Battle.s.hp<300) Battle.s.hp=1250; S.hp=stats().hp; Battle.ui(); },500); };
        setTimeout(start,600); }},
    {id:'neck', group:'风穴副本', title:'修炼瓶颈', check:'炼气六层修为已满，打坐面板会提示「炼气六层瓶颈：穿过风穴的风谷」，闭关也不会再涨修为。',
      run(){ Review.base({quest:'q6', L:6, kills:3}); S.exp=expNeed(6); S.min=10*60; Review.at('home',16,5,'up'); setTimeout(()=>meditate(),500); }},
    // 配乐
    {id:'music-village', group:'配乐', title:'村庄主题', check:'桃源镇白天的古筝 + 箫。点一下画面开始播放（iPhone 请关闭静音开关）。',
      run(){ Review.base({quest:'q4', L:2}); S.min=10*60; Review.at('town',12,11,'down'); Music.play('village',true); }},
    {id:'music-battle', group:'配乐', title:'战斗主题', check:'琵琶轮指 + 战鼓。会直接进入一场普通战斗（已开无敌）。',
      run(){ Review.base({quest:'q4', L:2}); Review.at('forest',14,4,'down'); Dev.god=true; setTimeout(()=>Battle.start('dangkang',()=>{ Dev.god=false; }),400); }},
    {id:'music-romance', group:'配乐', title:'浪漫主题', check:'心动事件「池畔晚霞」里的箫 + 古筝分解和弦。',
      run(){ Review.base({quest:'q8', L:10, sect:'dan', flags:{qiongqi_done:true, tang_sect:true}}); Review.at('town',9,14,'left'); setTimeout(()=>Dev.run('cg:tang:4'),400); }},
    // 心动事件
    ...['tang','ge'].flatMap(id=>[2,4,6,8].map(lv=>({id:`cg-${id}-${lv}`, group:'心动事件', title:`${id==='tang'?'苏小棠':'顾长歌'} ${lv}♥`, check:'插画场景、人物位置、选项和好感变化。',
      run(){ Review.base({quest:'q8', L:10, sect:'dan', flags:{qiongqi_done:true, tang_sect:true}}); Review.at('town',12,11,'down'); setTimeout(()=>Dev.run(`cg:${id}:${lv}`),400); }}))),
    {id:'mail', group:'心动事件', title:'信箱', check:'洞府门口的信箱上有红色「!」。打开看看几封信，收下礼物；也可以从行囊 → 信件打开。',
      run(){ Review.base({quest:'q8', L:10, sect:'dan', flags:{qiongqi_done:true, tang_sect:true}}); for(const id of ['tang','ge','ahe']) Social.rel(id).pts=650;
        S.mail=[{id:'tang',from:'苏小棠',li:2,day:S.day,read:false,taken:false},{id:'ge',from:'顾长歌',li:2,day:S.day,read:false,taken:false},{id:'ahe',from:'阿禾',li:0,day:S.day,read:false,taken:false}]; Review.at('home',8,6,'up'); }},
    // 存档与回放
    {id:'replay', group:'存档', title:'往事回廊：重温拜师大典', check:'这个存档已拜入青云剑宗。重温时选别的门派，结束后打开行囊确认门派还是青云剑宗。',
      run(){ Review.base({quest:'end', L:10, sect:'jian', flags:{qiongqi_done:true, tang_sect:true, chapter1_done:true}}); Review.at('town',12,11,'down'); setTimeout(()=>{ UI._tab='replay'; UI.menu('replay'); },400); }},
    {id:'reroll', group:'存档', title:'刷灵根（读「测灵根前」）', check:'测完灵根后，打开 行囊 → 存档，读取「测灵根前」，能不能重测出不同的结果？',
      run(){ Review.NODES.find(n=>n.id==='prologue').run(); }},
    {id:'oldsave', group:'存档', title:'老存档迁移（种田退款）', check:'模拟一个有锄头、种子、灵泉阵、播种傀儡的老存档：读档后应提示退还灵石，背包里没有种田道具。',
      run(){ RT.slot=SLOTS-1; S=newState(); S.name='老存档'; S.qv=3; S.quest=QUESTS.findIndex(q=>q.id==='q4'); S.L=2; S.root={els:['木','水'],n:2}; S.flags.intro_done=true; S.flags.met_ahe=true;
        S.inv={slip:1,hoe:1,can:1,seed_lc:4,seed_zg:2,sprinkler:1,huichun:1}; S.puppet=true; S.farm={'home:4,7':{tilled:1,crop:'lingcao',stage:1,days:1},'home:5,8':{tilled:1,sprinkler:1}};
        const before=S.stones; localStorage.setItem(slotKey(RT.slot),JSON.stringify(S)); S=loadSave(RT.slot); Sect.migrate(); $('#title').hidden=true; enterMap(S.map,S.x,S.y); UI.hud(); UI.sync(); SaveSys.resume();
        UI.toast(`退还后灵石：${before} → ${S.stones}`); }},
    {id:'carry', group:'存档', title:'带走存档（导出 / 导入）', check:'打开的是「存档」页。最下面有「导出存档文件」「复制存档码」「导入存档」。在另一个浏览器（比如微信里打开）的标题画面点「导入存档」，粘贴存档码或选存档文件，选一个存档位导入。iPhone 用 Safari 打开时，标题画面会提示「添加到主屏幕」。',
      run(){ Review.base({quest:'end', L:10, sect:'jian', side:{zhenfeng:'active'}, flags:{qiongqi_done:true, tang_sect:true, chapter1_done:true, huli_friend:true}, inv:{rod:1, hu_wei:1}}); Review.at('town',12,10,'down'); setTimeout(()=>SaveSys.panel(),500); }},
    {id:'end', group:'剧情', title:'第一章结束后的自由时间', check:'第一章完成后能否继续逛、做支线、钓鱼、重温往事。',
      run(){ Review.base({quest:'end', L:10, sect:'dan', flags:{qiongqi_done:true, tang_sect:true, chapter1_done:true, huli_friend:true}, inv:{rod:1}}); Review.at('home',11,6,'down'); }},
    // 第二章 第一幕
    {id:'c2-depart', group:'第二章', title:'拜别桃源镇', check:'第一章已完成、已拜入青云剑宗，站在桃源镇广场的师尊面前。点师尊：可以选「再等等」或「跟师尊走」。跟走后有送行、传送，到宗门后见到大师兄、大师姐、二师兄。',
      run(){ Review.base({quest:'end', L:10, sect:'jian', side:{zhenfeng:'active'}, flags:{qiongqi_done:true, tang_sect:true, chapter1_done:true, huli_friend:true}, inv:{hu_wei:1}}); Review.at('town',8,9,'up'); }},
    ...['jian','dan','shou','tianji'].map(k=>({id:'c2-'+k, group:'第二章', title:'宗门第一天（'+SECTS[k].name+'）', check:'四个宗门布局一样，屋顶颜色、地面和摆设不一样'+(k==='dan'?'；苏小棠也在药王谷，药圃旁边能找到她':'')+'。左上角是三位师兄师姐今天的吩咐：先找他们说话接任务，做完回去交差。三件都做完后回房间睡觉，第二天有新的吩咐。山门旁的传送阵能去桃源镇、洞府、风眼。',
      run(){ Review.base({quest:'c2b', L:10, sect:k, side:{zhenfeng:'active'}, flags:{qiongqi_done:true, tang_sect:true, chapter1_done:true, huli_friend:true, c2_arrive:true}, inv:{rod:1, hu_wei:1}}); S.c2=C2.fresh(); Review.at('zong_'+k,12,15,'up'); }})),
    {id:'c2-gossip', group:'第二章', title:'宗门里的闲话（外门弟子）', check:'刚到宗门的第一天。练功场、药圃、膳堂门口各有两个外门弟子在说悄悄话，走近就能听见头顶冒出的对话（每天说的不一样）；点他们能聊更多。药圃那两个说大师姐的闲话时可以选「你们亲眼看见了？」，第四幕大师姐会记得。山门旁还有一位守门的老弟子。',
      run(){ Review.base({quest:'c2b', L:10, sect:'jian', side:{zhenfeng:'active'}, flags:{qiongqi_done:true, tang_sect:true, chapter1_done:true, huli_friend:true, c2_arrive:true}, inv:{rod:1, hu_wei:1}}); S.c2=C2.fresh(); Review.at('zong_jian',20,7,'up'); }},
    {id:'c2-day3', group:'第二章', title:'宗门第三天（界碑抓痕、二师兄的房间）', check:'第三天的吩咐：大师兄让你看三块界碑（第三块底下有狼爪痕），大师姐要两颗朱果，二师兄请你收拾房间（发霉的点心，两种选择）。三件都交差后，师尊会传召。',
      run(){ Review.base({quest:'c2b', L:10, sect:'jian', side:{zhenfeng:'active'}, flags:{qiongqi_done:true, tang_sect:true, chapter1_done:true, huli_friend:true, c2_arrive:true}, inv:{rod:1, hu_wei:1, zhuguo:2}}); S.c2=C2.fresh(); S.c2.n=2; S.c2.days=2; S.c2.counted=1; Review.at('zong_jian',12,15,'up'); }},
    {id:'c2-mjgo', group:'第二章', title:'山门集合 → 秘境', check:'第一幕已完成，是师尊下令的第二天早上。去山门找大师兄（寻路会带你去），出发去秘境、扎营。',
      run(){ Review.base({quest:'c2d', L:10, sect:'jian', side:{zhenfeng:'active'}, flags:{qiongqi_done:true, tang_sect:true, chapter1_done:true, huli_friend:true, c2_arrive:true, c2_order:true}, inv:{rod:1, hu_wei:1}}); S.c2=C2.fresh(); S.c2.days=3; S.c2.n=2; S.c2.counted=2; S.c2.got={lu:2,xie:2,man:2}; S.c2.orderDay=S.day-1; Review.at('zong_jian',12,13,'down'); }},
    ...[[1,'秘境第一天（插阵旗、采灵草、煮晚饭）',3],[2,'秘境第二天（饭少了一半、打妖兽、摘朱果、钓鱼）',4],[3,'秘境第三天（翅膀声之后：鸟兽全无、大师兄的纸条、干粮袋）',5]].map(([d,t,n])=>({id:'c2-mj'+d, group:'第二章', title:t, check:'在秘境营地，这一天的吩咐都还没接。做完三件事后回左下的帐篷休息，会有夜里的怪事和第二天早上的剧情。'+(d===3?'这一天做完再睡，第二天早上大师兄就不见了（第二幕结尾）。':''),
      run(){ Review.base({quest:'c2e', L:10, sect:'jian', side:{zhenfeng:'active'}, flags:{qiongqi_done:true, tang_sect:true, chapter1_done:true, huli_friend:true, c2_arrive:true, c2_order:true, c2_depart:true}, inv:{rod:1, hu_wei:1}}); S.c2=C2.fresh(); S.c2.days=3+d-1; S.c2.counted=n-1; S.c2.night=d-1; C2.nextSet(n); Review.at('mj_camp',10,12,'up'); }})),
    ...(()=>{ const F={qiongqi_done:true, tang_sect:true, chapter1_done:true, huli_friend:true, c2_arrive:true, c2_order:true, c2_depart:true, lu_gone:true}, I={rod:1, hu_wei:1, mj_feather:1, huichun:5, juqi:2};
      const go=(flags,map,x,y,dir,quest='c2f')=>{ Review.base({quest, L:11, sect:'jian', side:{zhenfeng:'active'}, flags:{...F,...flags}, inv:{...I}}); S.c2=C2.fresh(); S.c2.days=6; S.c2.night=3; S.c2.counted=5; Review.at(map,x,y,dir); };
      return [
      {id:'c2-cliff', group:'第二章', title:'第三幕：顺着白羽去白羽崖', check:'大师兄刚失踪，你在秘境营地。地上有一串白羽毛：穿过雾林，最北边的荆棘丛已经被撕开（寻路会带路）。上到白羽崖时有一段对话，山道边能捡到大师兄的「正」字玉牌。',
        run(){ go({},'mj_camp',10,8,'up'); }},
      {id:'c2-mirror', group:'第二章', title:'第三幕：八卦镜里的往事（安平村）', check:'站在白羽崖顶的石台前。点石台拿起八卦镜：三段往事插画（村民庆功 → 后山真相 → 夜里的狼孩，最后定格），然后选一句话，穷奇落下，开打。',
        run(){ go({c2_cliff_in:true, c2_token:true},'mj_cliff',10,5,'up'); }},
      {id:'c2-boss1', group:'第二章', title:'第三幕 Boss：穷奇 · 陆正衡', check:'直接开打。三个阶段：穷奇单打 → 70% 血时大师兄的头从穷奇头顶冒出来（明正典刑光柱、清誉护体护盾，护盾时用「八卦镜」按钮照破）→ 35% 血时两个头吵架、身子被左右拉扯，大师姐加入助战。头上会冒出对话气泡。',
        run(){ go({c2_cliff_in:true, c2_token:true, c2_mirror:true},'mj_cliff',10,5,'up'); setTimeout(()=>UI.say(C2C.again),400); }},
      {id:'c2-seal', group:'第二章', title:'第三幕结尾：封印穷奇', check:'打赢穷奇之后的剧情：插画「封」，八卦镜锁链把穷奇（和大师兄）拖回风穴，两个吵个不停；最后大师姐和二师兄各有一个伏笔。',
        run(){ go({c2_cliff_in:true, c2_token:true, c2_mirror:true},'mj_cliff',10,5,'up'); setTimeout(()=>UI.say(UI.commit(SCRIPTS.c2c_win),()=>Story.check()),400); }},
      ...(()=>{ const A3={c2_cliff_in:true, c2_token:true, c2_mirror:true, c2_qq_sealed:true}, act4=(flags,map,x,y,dir,echo)=>{ go({...A3,...flags},map,x,y,dir,'c2g'); if(flags.c2_xin_done) S.inv.c2_bagua=1; S.inv.c2_lutoken=1; S.c2x={echo:echo||[]}; enterMap(map,x,y); RT.dir=dir; save(); };   // re-enter so the lake's fog wall sees the memories already seen
        return [
      {id:'c2-xin-night', group:'第二章', title:'第四幕：封印之后的那一夜', check:'穷奇刚被封印，你回到了营地。去自己的帐篷（左下）休息：夜里八卦镜照见大师姐，第二天早上大师姐不见了，营地东边的芦苇被分开了。',
        run(){ act4({},'mj_camp',5,11,'left'); }},
      {id:'c2-lake', group:'第二章', title:'第四幕：顺着脚印去心镜湖', check:'大师姐刚不见。营地里有一串湿脚印通到东边的溪水，顺着走进新地图「心镜湖」：湖面上漂着字，路边三处水面映着大师姐的往事（入门、那位师兄、宗门大比），看完三处，湖心的雾才散开。',
        run(){ act4({c2_xin_night:true, c2_xin_start:true},'mj_camp',18,12,'right'); }},
      {id:'c2-island', group:'第二章', title:'第四幕：湖心岛（插画「心镜湖」）', check:'三段往事已经看过。走上湖心岛，点大师姐：插画里水中的倒影站起来、眼睛变红，心魔现身，开打。',
        run(){ act4({c2_xin_night:true, c2_xin_start:true, c2_lake_in:true},'mj_lake',17,8,'right',[0,1,2]); }},
      {id:'c2-xinmo', group:'第二章', title:'第四幕 Boss：心魔 · 霁影', check:'直接开打。剑光十字斩（红线预警的十字）、残影突刺（红线预警的直线）、流言（「狐媚」「妖女」「靠脸」这些字朝你飞过来）。血量低于六成后流言更密；打到三成血以下或者撑过十三回合，九尾狐现身，战斗转成剧情。战斗中间心魔会说话。',
        run(){ act4({c2_xin_night:true, c2_xin_start:true, c2_lake_in:true, c2_xin_met:true},'mj_lake',19,8,'right',[0,1,2]); setTimeout(()=>UI.say(C2X.again),400); }},
      {id:'c2-fox', group:'第二章', title:'第四幕：九尾狐与大师姐（插画「九尾」）', check:'打完心魔之后的剧情：九尾狐落在湖面上，和大师姐说话；你可以选一句话对大师姐说（这个测试存档当作你在宗门里替她说过话，所以有三个选项）；最后大师姐自己让心魔化成水，第一次笑了。',
        run(){ act4({c2_xin_night:true, c2_xin_start:true, c2_lake_in:true, c2_xin_met:true, c2_defend_xie:true},'mj_lake',19,8,'right',[0,1,2]); setTimeout(()=>UI.say(UI.commit(SCRIPTS.c2x_fox)),400); }},
      {id:'c2-act4end', group:'第二章', title:'第四幕结尾：二师兄不见了', check:'从心镜湖回到营地：篝火灭了，锅底被舔得发亮，二师兄不见了（第五幕的开头）。',
        run(){ act4({c2_xin_night:true, c2_xin_start:true, c2_lake_in:true, c2_xin_met:true, c2_xin_done:true},'mj_lake',2,8,'left',[0,1,2]); }},
      ]; })(),
      {id:'c2-town', group:'第二章', title:'第二章里回到桃源镇', check:'已经跟师尊去了宗门、在秘境里。用营地的传送阵回到桃源镇：苏小棠（去了药王谷）和顾长歌（去做散修）都不在镇上了，阿禾、钱掌柜他们还在。',
        run(){ go({},'mj_camp',3,13,'down'); }},
      {id:'c2-rematch', group:'第二章', title:'第二章之后的狂暴穷奇（两个头）', check:'封印穷奇之后再去风眼打狂暴穷奇：穷奇头顶多了大师兄的头，打的时候两个头互相拆台。',
        run(){ go({c2_cliff_in:true, c2_token:true, c2_mirror:true, c2_qq_sealed:true},'fx3',8,8,'up'); }},
      ]; })(),
    {id:'c2-portal', group:'第二章', title:'传送阵（直达风眼打狂暴穷奇）', check:'桃源镇广场东边的传送阵：已经筑基、拜师、打过穷奇，就能直接传送到风眼打狂暴穷奇；风眼里也有传送阵可以回来。到了第二章，还能去宗门。',
      run(){ Review.base({quest:'end', L:10, sect:'jian', side:{zhenfeng:'active'}, flags:{qiongqi_done:true, tang_sect:true, chapter1_done:true, huli_friend:true}, inv:{huichun:4, hu_wei:1}}); Review.at('town',21,7,'up'); }},
  ],
  // a fresh test character in save slot 3 with the given story state
  base(o){
    RT.slot=SLOTS-1; S=newState(); S.name='审查员'; S.look={g:'f',skin:1,hair:4,hairColor:0,style:'qun',cloth:6}; S.root={els:['火','木','水'],n:3};
    S.flags.intro_done=true; S.flags.chest=true; S.inv={slip:1, ...(o.inv||{})};
    const qi=QUESTS.findIndex(q=>q.id===o.quest); S.quest=qi; S.questStarted=qi;
    S.L=o.L||0; if(o.full) S.exp=expNeed(S.L); S.sect=o.sect===undefined?(S.L>=10&&o.quest!=='sect'?'jian':null):o.sect;
    if(Review.sect&&S.sect) S.sect=Review.sect;                                   // …#t-<id>@shou: the same node as another sect's disciple
    if(S.sect==='shou'&&!S.pet) S.pet={kind:'dangkang',lv:3,xp:0};                 // 万兽谷 disciples fight with a companion
    if(S.quest>QUESTS.findIndex(q=>q.id==='q3')) S.flags.met_ahe=true;
    Object.assign(S.flags, o.flags||{}); Object.assign(S.side, o.side||{}); if(o.kills) S.st.kills=o.kills;
    // review characters have already picked their techniques and seen the tips, so nothing pops up over what is being checked
    S.tips={move:1,quest:1,talk:1,bag:1,med:1,dodge:1};
    const st=stats(); S.hp=st.hp; S.mp=st.mp; S.min=S.min||9*60; Dev.god=false;
  },
  at(map,x,y,dir){
    if(Review.sect&&/^zong_/.test(map)) map='zong_'+Review.sect;
    $('#title').hidden=true; clearInterval(Creator.timer); Mini.close&&Mini.close(); Battle.s&&Battle.close(); UI.dlgQ=null; $('#dlg').hidden=true; $('#panel').hidden=true; $('#cg').hidden=true;
    enterMap(map,x,y); RT.dir=dir||'down'; UI.hud(); UI.sync(); save(); Music.play(areaTheme());
  },
  sect:null,
  // testers needn't redo the day's three chores: count them all done and stand by the bed (or tent), ready for the night
  skipChores(){
    if(!S||!S.c2||typeof C2==='undefined'||!C2.on()) return UI.toast('现在没有日常任务可以跳过');
    if(C2.allDone()) return UI.toast('今天的日常已经做完了，回去睡觉吧');
    UI.dlgQ=null; $('#dlg').hidden=true; $('#panel').hidden=true; UI.sync();
    S.c2.got={lu:2,xie:2,man:2}; S.track='main';
    if(C2.inMJ()){ enterMap('mj_camp',5,11); RT.dir='left'; } else { enterMap(zongId(),3,15); RT.dir='up'; }
    UI.hud(); save(); C2.check(); UI.toast('已跳过今天的日常');
  },
  go(id){
    const [nid,sk]=id.split('@'); id=nid; Review.sect=SECTS[sk]?sk:null;
    const n=Review.NODES.find(x=>x.id===id); if(!n) return Review.missing(id);
    $('#reviewHub')&&$('#reviewHub').remove(); n.run(); Review.note(n);
  },
  // an unknown node usually means this page is older than the link (the tab stayed open, or the browser cached it):
  // fetch the newest page and reload into it; only if this already is the newest, say the node doesn't exist
  missing(id){
    const meta=document.querySelector('meta[name=build]'), mine=meta&&meta.dataset.build;
    if(!mine) return UI.toast('没有这个审查节点：'+id);
    UI.toast('正在检查新版本……');
    fetch(location.pathname+'?fresh='+Date.now(),{cache:'no-store'}).then(r=>r.text()).then(t=>{ const m=t.match(/data-build="([0-9a-f]+)"/);
      if(m&&m[1]!==mine){ const u=new URL(location.href); u.searchParams.set('v',m[1]); location.replace(u.href); }
      else UI.toast('没有这个审查节点：'+id); }).catch(()=>UI.toast('没有这个审查节点：'+id));
  },
  note(n){
    let el=$('#reviewNote'); if(!el){ el=document.createElement('div'); el.id='reviewNote'; el.className='wood'; document.body.appendChild(el); }
    const i=Review.NODES.indexOf(n), next=Review.NODES[i+1];
    el.innerHTML=`<b>审查 · ${esc(n.title)}</b><p>${esc(n.check)}</p><div class="rn-btns"><button class="btn mini" id="rnHub">全部节点</button>${next?`<button class="btn mini" id="rnNext">下一个：${esc(next.title)}</button>`:''}<button class="btn mini" id="rnX">收起</button></div>`;
    $('#reviewPill')&&$('#reviewPill').remove();
    $('#rnHub').onclick=()=>Review.hub(); $('#rnX').onclick=()=>{ el.remove(); const p=document.createElement('button'); p.id='reviewPill'; p.className='wood'; p.textContent='审查：'+n.title+' ▾'; p.onclick=()=>{ p.remove(); Review.note(n); }; document.body.appendChild(p); }; if(next) $('#rnNext').onclick=()=>{ location.hash='t-'+next.id+(Review.sect?'@'+Review.sect:''); };
    // chapter 2 nodes can be replayed as a disciple of any of the four sects
    if(n.id.startsWith('c2-')){ const row=document.createElement('div'); row.className='rn-btns rn-sect'; row.innerHTML='<span>宗门：</span>'+Object.keys(SECTS).map(k=>`<button class="btn mini${(Review.sect||S.sect)===k?' main':''}" data-sk="${k}">${SECTS[k].name}</button>`).join('');
      el.appendChild(row); row.querySelectorAll('[data-sk]').forEach(b=>b.onclick=()=>{ location.hash='t-'+n.id+'@'+b.dataset.sk; });
      const sk=document.createElement('div'); sk.className='rn-btns'; sk.innerHTML='<button class="btn mini main" id="rnSkip">跳过今天的日常</button>'; el.appendChild(sk); $('#rnSkip').onclick=()=>Review.skipChores(); }
  },
  hub(){
    $('#reviewHub')&&$('#reviewHub').remove();
    const groups=[...new Set(Review.NODES.map(n=>n.group))], base=location.href.split('#')[0];
    const el=document.createElement('div'); el.id='reviewHub';
    const sk=Review.sect?'@'+Review.sect:'';
    el.innerHTML=`<div class="rh-box wood"><h3>审查节点</h3><div class="rn-btns rn-sect"><span>第二章用哪个宗门的弟子：</span>${Object.keys(SECTS).map(k=>`<button class="btn mini${(Review.sect||'jian')===k?' main':''}" data-sk="${k}">${SECTS[k].name}</button>`).join('')}</div><p class="muted">点任何一项，直接进入那个场景（测试角色用第 3 个存档位，不影响你自己的存档）。每一项也可以单独分享：链接后面加 <code>#t-名字</code>。</p>
      ${groups.map(g=>`<h4>${g}</h4><div class="rh-list">${Review.NODES.filter(n=>n.group===g).map(n=>`<a class="rh-item" href="${base}#t-${n.id}${n.id.startsWith('c2-')?sk:''}"><b>${esc(n.title)}</b><span>${esc(n.check)}</span><code>#t-${n.id}</code></a>`).join('')}</div>`).join('')}
      <div class="rn-btns"><a class="btn mini main" href="${base}#selftest">跑一遍自检 #selftest</a><button class="btn mini" id="rhX">关闭</button></div></div>`;
    document.body.appendChild(el); $('#rhX').onclick=()=>el.remove();
    el.querySelectorAll('[data-sk]').forEach(b=>b.onclick=()=>{ Review.sect=b.dataset.sk==='jian'?null:b.dataset.sk; Review.hub(); });
  },
  route(){
    const h=location.hash.replace('#','');
    if(h==='review') return Review.hub();
    if(h==='selftest') return;
    if(h.startsWith('t-')) return Review.fresh(()=>Review.go(h.slice(2)));
  },
  // jumping between nodes only changes the #hash, so a tab left open would keep running old code: check for a newer build first and reload into it
  fresh(then){ const meta=document.querySelector('meta[name=build]'), mine=meta&&meta.dataset.build; if(!mine||Review._checked) return then();
    fetch(location.pathname+'?fresh='+Date.now(),{cache:'no-store'}).then(r=>r.text()).then(t=>{ const m=t.match(/data-build="([0-9a-f]+)"/);
      if(m&&m[1]!==mine){ UI.toast('有新版本，正在更新……'); const u=new URL(location.href); u.searchParams.set('v',m[1]); location.replace(u.href); }
      else { Review._checked=Date.now(); setTimeout(()=>{ Review._checked=0; },20000); then(); } }).catch(()=>then()); },
};
// the live site has chapter 2 closed: its review links (which drop you into the sect) are left out there
if(window.CH2_LOCKED) Review.NODES=Review.NODES.filter(n=>!(n.id.startsWith('c2-')&&n.id!=='c2-portal'));
addEventListener('hashchange', ()=>Review.route());
setTimeout(()=>Review.route(), 400);
