/* ============================================================
   山海问道 · 第三章「京城」 · 剧情 — act 1 「北上」. Spring: the master gives back the 八卦镜 with one face unsealed and
   sends you and 大师姐 north to the 宗门大比. A night at a camp by the road (sticks, water, a pot of porridge, 大师姐 by the
   fire: last time the 头名 was hers, this time it is yours). Next day, 安平村: empty, sealed by order of a 钦差 named 萧;
   大师兄's 长生牌位 split under four claw marks; an old man by the well who stayed behind; a small cairn on the back hill
   with fresh flowers. That night 猲狙 come into the camp, and when their leader falls a whistle from the ridge calls them
   off: a man stands there in the moonlight with the pack around him, looks at you a long while, and goes.
   Needs: chapter two's end (chapters.js, Chapters.C2). Touches chapter two in one place only: its last quest («第二章 完»)
   becomes the door — talk to your master when you are ready. Everything else goes through On (on.js).
   On the live site, while window.CH3_LOCKED is set, the door stays shut.
   ============================================================ */
const C3_LOCKED=!!window.CH3_LOCKED;
const C3={
  st(){ return S.c3=S.c3||{wood:[], water:0}; },
  F:()=>S.flags,
  dan:()=>S.sect==='dan',
  ta:()=>{ const M=SECTS[S.sect].master; return M.look&&M.look.g==='f'?'她':'他'; },
  // set a flag and show its effect on the map at once: people and things whose cond depends on it come and go where you
  // stand (a map only looks at conds when it is entered)
  set(f){ S.flags[f]=true; C3.sync(); UI.hud(); save(); },
  sync(){ if(!RT.map) return; for(const o of RT.map.objects){ if(!o.cond||o.type==='building'||o.type==='gather') continue; const want=!!o.cond(S), has=RT.ents.includes(o);
      if(want&&!has){ RT.ents.push(o); RT.solid[o.y][o.x]=true; } else if(!want&&has){ RT.ents=RT.ents.filter(e=>e!==o); RT.solid[o.y][o.x]=false; } } },
  // 大师姐 (and 苏小棠) on the road: what they have to say just now, and talk / gifts / hearts as anywhere else
  menu(id,lines){ const n=NPCS[id], h=Social.hearts(id);
    UI.say([{choice:`${n.name}　${'♥'.repeat(h)}${'♡'.repeat(Math.max(0,(n.romance?10:8)-h))}${Social.rel(id).gifted===S.day?'　（今天已送过礼）':''}`, options:[
      {text:'说说话', fn:()=>UI.say(lines)},{text:'聊天', fn:()=>Social.chat(id)},{text:'送礼', fn:()=>Social.giftPick(id)},{text:'离开', fn:()=>{}}]}]); },
  // a scene, then a fade, then somewhere else at some hour, then maybe another scene
  move(map,x,y,dir,hour,after){ RT.paused=true; RT.fadeTo=()=>{ if(hour!=null) S.min=hour*60; enterMap(map,x,y); RT.dir=dir||'down'; RT.paused=false; UI.sync(); UI.hud(); save(); after&&after(); }; },
};

/* ---------- the door: chapter two's last quest, and the master ---------- */
{ const q=QUESTS.find(q=>q.id==='c2z');
  if(!C3_LOCKED) Object.assign(q,{desc:'第二章「秘境」完。第三章「京城」：开春了，准备好了就去找师尊。', check:s=>!!s.flags.c3_go,
    progress:s=>'准备好了，就去找师尊', target:s=>s.sect?npcAt(SECTS[s.sect].master.id):null}); }
if(!C3_LOCKED){ const i=C2Y.moEnd.findIndex(st=>Array.isArray(st)&&/第三章「京城」/.test(st[1])); if(i>=0) C2Y.moEnd[i]=['旁白','（第三章「京城」——开春以后，准备好了，就去找师尊。）']; }
C3.depart=()=>{ const m=master(); return [
  [m,`${S.name}。`],
  [m,'冬天过去了。京城的大比，该动身了。'],
  {choice:'要现在出发去京城吗？（之后随时能用传送阵回宗门）', options:[{text:'弟子准备好了', go:'c3_go'},{text:'再等等', go:'c3_wait'}]}]; };
SCRIPTS.c3_wait=[['旁白','师尊点点头，没有催你。'],['旁白','（准备好了，再来找师尊。）']];
Object.defineProperty(SCRIPTS,'c3_go',{configurable:true, get(){ const m=master(), F=S.flags; return [
  ['旁白','冬去春来。山门外的桃树，开了今年的第一枝花。'],
  [m,'霁月，{名}。'],
  ['谢霁月','弟子在。'],
  [m,'这面镜子，为师解开了一面封印。'],
  ['旁白',`${m}把八卦镜放进你手里。镜面只亮了一角，像一只半睁的眼睛。`],
  {give:{c2_bagua:1}},
  [m,'只够照几回。用在要紧的地方。'],
  [m,'京城不比宗门。多长一只眼睛。'],
  [m,'霁月，路上照看着你{称}。'],
  ['谢霁月','是。'],
  ['旁白','山门口，外门弟子们都来了。'],
  ['外门弟子·周小川','师姐、{称}，把头名拿回来！'],
  ['外门弟子·吴阿蛮','{称}！{称}！等一下——'],
  ['旁白','吴阿蛮从人堆里挤出来，跑得气喘吁吁。'],
  ['外门弟子·吴阿蛮','我听山下的货郎说，京城的糖葫芦，一颗山楂有鸡蛋那么大！'],
  ['外门弟子·吴阿蛮','我这辈子还没出过山……你给我带一串回来，好不好？'],
  ['我','（……鸡蛋那么大？）'],
  ['我','好。'],
  ['外门弟子·吴阿蛮','说好了！拉钩！'],
  {flag:'c3_wu_hulu'},
  ['守门弟子·老钟','……去了，记得回来。'],
  ...(C3.dan()?[['苏小棠','{名}！等等我——'],['苏小棠','长老说，谷里派去大比的就是我们俩。路上，我们一起走！'],['谢霁月','（她看了苏小棠一眼）……跟紧了。']]:[]),
  ['旁白','你们沿着官道，一路往北。'],
  {run:()=>{ F.c3_go=true; C3.st(); C3.move('c3_road',10,13,'up',17.5,()=>setTimeout(()=>UI.say(C3.arrive(),()=>{ UI.hud(); Story.check(); }),300)); }}]; }});
On.talk(id=>{ if(C3_LOCKED||!S.sect||id!==SECTS[S.sect].master.id) return false;
  const q=Story.quest()&&Story.quest().id; if(q==='c2z'&&!S.flags.c3_go){ UI.say(C3.depart()); return true; } return false; });
// 大师姐 is on the road with you, not in the sect; and the weekly visits wait while you are away
for(const k in SECTS) for(const o of MAPS['zong_'+k].objects) if(o.id==='xie'){ const c=o.cond; o.cond=s=>(!c||c(s))&&!s.flags.c3_go; }
SectLife.away(s=>!!s.flags.c3_go&&!s.flags.c3_back);
// the 传送阵 knows the camp once you have been there
{ const _d=Portal.dests; Portal.dests=function(){ const l=_d.call(Portal); if(S.flags.c3_go&&RT.mapId!=='c3_road') l.push({name:'北上营地', map:'c3_road', x:3, y:13}); return l; }; }

/* ---------- the first night on the road ---------- */
C3.arrive=()=>[
  ['旁白','太阳落到了山后面。官道边上，有一块平地，旁边是一条小溪。'],
  ['谢霁月','今晚在这儿扎营。'],
  ['谢霁月','我去四周看看。{称}，柴和水交给你。'],
  ...(C3.dan()?[['苏小棠','我来帮你看着锅！'],['苏小棠','……锅呢？'],['谢霁月','（远远地）在火边。']]:[]),
  ['旁白','（捡三根柴火，去溪边的泉眼打水，然后在锅里煮一锅粥。）']];
On.act('c3twig',o=>{ const c=C3.st(); if(!c.wood.includes(o.ti)){ c.wood.push(o.ti); Sound.pick(); UI.float(o.x,o.y,`柴火 ${c.wood.length}/3`); RT.ents=RT.ents.filter(e=>e!==o); RT.solid[o.y][o.x]=false; UI.hud(); save();
    if(c.wood.length>=3) UI.toast(c.water?'柴和水都够了，去锅边煮粥':'柴够了，再去溪边打水'); } });
On.act('c3water',o=>{ const c=C3.st(); if(S.flags.c3_cooked) return UI.say([['旁白','泉眼里的水很凉，很清。']]);
  if(c.water) return UI.say([['旁白','水已经打好了。']]); c.water=1; Sound.water(); UI.float(o.x,o.y,'打满了一壶水'); UI.hud(); save();
  UI.toast((c.wood||[]).length>=3?'柴和水都够了，去锅边煮粥':'水打好了，再去捡些柴火'); });
On.act('c3pot',o=>{ const c=C3.st();
  if(S.flags.c3_cooked) return UI.say([['旁白','锅底还剩一点粥，已经凉了。']]);
  if((c.wood||[]).length<3||!c.water) return UI.say([['旁白',`锅是空的。（柴火 ${(c.wood||[]).length}/3，水${c.water?'有了':'还没打'}）`]]);
  S.flags.c3_cooked=true; UI.hud(); save(); UI.say(C3.dinner(), ()=>{ UI.hud(); Story.check(); }); });
C3.dinner=()=>[
  ['旁白','你生起火，烧开了水，又在路边掐了一把野菜，煮了一锅粥。'],
  ...(C3.dan()?[['苏小棠','（她往锅里撒了一小撮干草药）加一点这个，晚上不容易着凉。']]:[]),
  ['旁白','篝火噼啪作响。大师姐回来了，坐在你对面，剑横在膝上。'],
  ['谢霁月','上一回的大比，是我拿的头名。'],
  ['谢霁月','那年我十三岁。下了擂台，没有一个人跟我说一声恭喜。'],
  ['谢霁月','他们只说，评判的长老看直了眼。'],
  {choice:'你——', options:[{text:'这一回，我也去拿头名', go:'c3_din_a'},{text:'（盛一碗粥，递给她）', go:'c3_din_b'}]}];
C3.dinner2=()=>[
  ['旁白','远处的山里，传来一声狼嚎。很长，很长。'],
  ['谢霁月','（她的手按在了剑上，过了一会儿，又松开）……睡吧。前半夜我守着。'],
  {flag:'c3_dinner'},
  ['旁白','（回帐篷睡一觉。）']];
SCRIPTS.c3_din_a=[['我','这一回，我也去拿头名。'],['谢霁月','（她看着你，过了一会儿）……好。'],['谢霁月','拿了，我第一个跟你说恭喜。'],{love:{xie:30}},...C3.dinner2()];
SCRIPTS.c3_din_b=[['旁白','你盛了一碗粥，递给她。'],['谢霁月','（她接过去，吹了吹）……烫。'],['谢霁月','这一回的头名，该你了。'],['谢霁月','拿了，我第一个跟你说恭喜。'],{love:{xie:30}},...C3.dinner2()];

On.act('c3tent',o=>{ const F=S.flags;
  if(!F.c3_dinner) return UI.say([['旁白','还没吃饭呢。（捡柴、打水，在锅里煮一锅粥。）']]);
  if(F.c3_night&&!F.c3_raid_won) return UI.say([['旁白','狼就在林子边上。现在不是睡觉的时候。']]);
  UI.confirm('回帐篷休息，睡到天亮？', ()=>sleep(false)); });
On.act('c3tent2',o=>UI.say([['旁白','大师姐的帐篷。帘子边上，靠着她的剑鞘。']]));
On.act('c3log',o=>UI.say([['旁白','几根倒下的树横在路上。天快黑了，明天一早再赶路吧。']]));
On.act('c3fire',o=>{ const F=S.flags; if(F.c3_night&&!F.c3_raid_won) return UI.say(C3.raidAgain());
  UI.say([['旁白',F.c3_cooked?'篝火噼啪作响，火光照得人脸上发烫。':'篝火刚刚生起来，还没有架锅。']]); });
// waking (after a night, or after being knocked down): back at the camp
On.wake((passedOut,from)=>{ if(!String(from).startsWith('c3_')) return false; const F=S.flags;
  if(!passedOut&&F.c3_a1_done&&!F.c3_jc_go){ F.c3_jc_go=true; enterMap('c3_road',4,11); RT.dir='down'; UI.hud(); save(); setTimeout(()=>UI.say(JC.toCity(),()=>{ UI.hud(); Story.check(); }),700); return true; }
  if(passedOut&&F.c3_night&&!F.c3_raid_won){ S.min=21*60; enterMap('c3_road',7,9); RT.dir='up'; UI.hud(); save(); setTimeout(()=>UI.say(C3.raidLose),400); return true; }
  enterMap('c3_road',4,11); RT.dir='down'; UI.hud(); save();
  if(F.c3_dinner&&!F.c3_morning) setTimeout(()=>UI.say(C3.morning(),()=>{ UI.hud(); Story.check(); }),900);
  return true; });
C3.morning=()=>[
  ['旁白','天亮了。大师姐已经收好了帐篷，站在路边，看着北边。'],
  ['谢霁月','往北再走半日，就是安平村。'],
  ['谢霁月','大师兄从前在那儿斩过一窝狼妖。村里给他立了长生牌位，香火一年都没断过。'],
  ['谢霁月','……顺路。去看一眼吧。'],
  ['旁白','路上横着的那几根树，不知道什么时候已经被挪开了。'],
  {run:()=>C3.set('c3_morning')}];   // the logs across the road go now, not next time you come

/* ---------- 安平村 ---------- */
On.enter(id=>{ if(id==='c3_anping'&&!S.flags.c3_anping_in) setTimeout(()=>{ if(RT.mapId==='c3_anping'&&!S.flags.c3_anping_in) UI.say(C3.village(),()=>{ UI.hud(); Story.check(); }); },350);
  // back at the camp after the back hill: night, and the wolves
  if(id==='c3_road'&&S.flags.c3_grave&&!S.flags.c3_night) setTimeout(()=>{ if(RT.mapId==='c3_road'&&!S.flags.c3_night) UI.say(C3.raid()); },400); });
C3.village=()=>[
  ['旁白','村口的牌坊上，刻着「安平」两个字。'],
  ['旁白','村子里一点声音都没有。没有鸡叫，没有狗吠，没有炊烟。'],
  ['谢霁月','……太静了。'],
  ...(C3.dan()?[['苏小棠','（她不自觉地往你身边靠了靠）……人呢？']]:[]),
  {flag:'c3_anping_in'}];
On.act('c3notice',o=>{ const first=!S.flags.c3_notice; S.flags.c3_notice=true; UI.hud(); UI.say([
  ['旁白','村口立着一块告示牌，上面贴着一张官府的告示：'],
  ['旁白','「安平村妖患未靖。奉上谕，阖村迁出，另行安置。擅入者，以通妖论。」'],
  ['旁白','落款是一方朱红的大印：「钦差　萧」。'],
  ...(first?[['谢霁月','……萧。'],['旁白','她没有再说什么，只是盯着那个字看了很久。'],['旁白','（去村子北边的祠堂看看。）']]:[])], ()=>{ UI.hud(); Story.check(); }); });
const C3_DOORS=[
  [['旁白','门上交叉贴着两道封条。门缝底下，掉着一只布老虎。'],['旁白','没有人回来捡。']],
  [['旁白','门上贴着封条。院子里晾着的衣服，已经被晒得发白了。']],
  [['旁白','门上贴着封条。窗台上摆着一碗饭，早就干成了一块。'],['旁白','筷子还搭在碗沿上，像是有人吃到一半，被叫走了。']],
  [['旁白','门上贴着封条。门框上，用炭写着几个歪歪扭扭的字：「阿娘，我去去就回」。']]];
On.act('c3door',o=>UI.say(C3_DOORS[o.di||0]));
On.act('c3well',o=>UI.say([['旁白','井水还是清的。井绳断了一半，木桶倒扣在井边。']]));
On.act('c3shrine',o=>{ if(S.flags.c3_shrine) return UI.say([['旁白','祠堂里落满了灰。那块裂开的牌位，还立在供桌上。']]);
  UI.say(C3.shrine(),()=>{ UI.hud(); Story.check(); }); });
C3.shrine=()=>[
  {run:()=>C3A.shrineCG()},
  ['旁白','祠堂里落满了灰。供桌上，只摆着一块牌位。'],
  ['旁白',`「长生禄位　${sectName()}　陆仙长正衡」`],
  ['旁白','牌位从正中间裂开了。'],
  ['旁白','裂口上，压着四道很深的爪痕。像是有什么东西，一爪子按在了上面。'],
  ['谢霁月','……'],
  ['我','（大师兄要是看见了……）'],
  ['谢霁月','（她伸手，想把牌位扶正。手停在半空，又收了回来）……走吧。'],
  ['谢霁月','这里没有人了。'],
  {run:()=>PixCG.close()},
  {run:()=>C3.set('c3_shrine')},   // the old man is by the well now
  ['旁白','（出祠堂的时候，你看见村口的井边，好像坐着一个人。）']];
On.talk(id=>{ if(id!=='c3_old') return false;
  if(S.flags.c3_old) UI.say([['老人','……往北。往京城的方向。'],['老人','你们要是到了京城，见着安平村的人，替我说一声：我还在这儿。']]);
  else UI.say(C3.old(),()=>{ UI.hud(); Story.check(); });
  return true; });
C3.old=()=>[
  ['旁白','井边坐着一个老人，拄着拐，眼睛半闭着。'],
  ['老人','……你们是哪个宗门的？'],
  ['我',`${sectName()}。`],
  ['老人',`${sectName()}……陆仙长的同门？`],
  ['旁白','他颤巍巍地撑着拐站起来。'],
  ['老人','陆仙长是好人啊。那年后山闹狼，是他一个人上山，把狼全杀了。'],
  ['老人','村里给他立了长生牌位，年年上香……'],
  ['老人','去年秋天，京城来了一位大人。年纪很轻，笑起来很和气。'],
  ['老人','他站在祠堂里，看着陆仙长的牌位，看了很久，很久。'],
  ['老人','第二天，兵就来了。说村里闹妖患，全村迁走，另行安置。'],
  ['老人','我腿脚不好，躲在井边的柴堆里，他们没找着我。'],
  ['老人','走的那些人……一个也没回来过。'],
  {choice:'你问——', options:[{text:'他们被带去哪儿了？', go:'c3_old_a'},{text:'陆仙长……真的是好人吗？', go:'c3_old_b'}]}];
const C3_OLD_END=[['老人','对了。那位大人走之前，一个人去了后山。'],['老人','待到天黑，才下来。'],{flag:'c3_old'},['旁白','（去后山看看。路在村子东边，往北。）']];
SCRIPTS.c3_old_a=[['老人','往北。往京城的方向。'],['老人','车一辆接着一辆，走了一整天。'],...C3_OLD_END];
SCRIPTS.c3_old_b=[['老人','（他愣住了）你这孩子，问的什么话。'],['老人','他杀了狼，救了村子……'],['旁白','他低下头，过了很久。'],['老人','……只是那几年，后山的狼，从来没有下山咬过人。'],{flag:'c3_doubt'},...C3_OLD_END];
On.act('c3grave',o=>{ const F=S.flags;
  if(F.c3_grave) return UI.say([['旁白','小小的石堆。石堆前的野花，还没有谢。']]);
  if(!F.c3_old) return UI.say([['旁白','后山上，一个小小的石堆。'],['旁白','（先在村子里看看吧。）']]);
  UI.say(C3.grave()); });
C3.grave=()=>[
  ['旁白','后山上，有一个塌了的草窝。草早就枯了。'],
  ['旁白','草窝边上，垒着一个小小的石堆。'],
  ['旁白','石堆前面摆着一束野花。还没有谢。'],
  ['旁白','石头上没有字。只有四道爪痕——和祠堂里那块牌位上的，一模一样。'],
  ['谢霁月','……是坟。'],
  ['谢霁月','有人每年都回来。'],
  ['旁白','怀里的八卦镜，微微发烫。你想起白羽崖上，镜子里那个伏在草丛里的少年。'],
  ...(F=>F.c3_doubt?[['我','（「那几年，后山的狼，从来没有下山咬过人。」）']]:[])(S.flags),
  ['谢霁月','天要黑了。这村子不能住。'],
  ['谢霁月','回昨晚的营地。'],
  {run:()=>C3.set('c3_grave')},
  {run:()=>C3.move('c3_road',7,9,'up',20.5)}];

/* ---------- the night: 猲狙 ---------- */
C3.raid=()=>[
  {flag:'c3_night'},
  ['旁白','回到营地时，天已经全黑了。'],
  ['旁白','篝火刚生起来，林子里就亮起了一对一对的眼睛。红的。'],
  ['谢霁月','（拔剑）{称}，背靠着火。'],
  ...(C3.dan()?[['苏小棠','（她攥着药篓，声音发抖）是、是狼吗？'],['谢霁月','小棠，躲到{称}后面去。']]:[]),
  ['旁白','是狼。可它们的头是红的，一双眼睛小得像老鼠——'],
  ['我','（云游子讲过的《山海经》……「其状如狼，赤首鼠目，是食人。」）'],
  ['我','猲狙！'],
  ['旁白','最大的那一只，从火光外面，慢慢地走了进来。'],
  ['谢霁月','其余的我挡着。头狼——交给你。'],
  {battle:'c3_hejv', win:'c3_raid_win', lose:'c3_raid_lose'}];
C3.raidAgain=()=>[['旁白','红色的眼睛还在林子边上转。头狼低低地吼着。'],['谢霁月','还能打吗？'],{battle:'c3_hejv', win:'c3_raid_win', lose:'c3_raid_lose'}];
C3.raidLose=[['旁白','狼牙擦着你的肩膀过去，你被扑倒在火边——'],['旁白','大师姐一剑，把头狼逼回了林子边上。'],['谢霁月','起来。'],['旁白','（歇口气。准备好了，去篝火边再迎战。）']];
SCRIPTS.c3_raid_lose=[];   // the wake handler above says it, once you are back by the fire
Object.defineProperty(SCRIPTS,'c3_raid_win',{configurable:true, get(){ return [
  {flag:'c3_raid_won'},
  ['旁白','头狼倒在火边，喘着粗气。它没有再扑上来。'],
  ['旁白','这时候，山脊上响起一声口哨。'],
  ['旁白','所有的猲狙，一齐回过头。它们夹着尾巴，退进了黑暗里。头狼爬起来，一瘸一拐地跟在最后。'],
  {run:()=>C3A.ridgeCG()},
  ['旁白','月亮底下，山脊上站着一个人。'],
  ['旁白','他披着一件深色的大氅，身边蹲着几只狼。离得太远，看不清脸。'],
  ['旁白','他看了你们很久。'],
  ['谢霁月','……狼。'],
  ['旁白','那人转过身，走了。狼群跟在他后面，一声也没有叫。'],
  {run:()=>PixCG.close()},
  ['谢霁月','（她把剑收回鞘里）他在看你。'],
  ['我','……看我？'],
  ['谢霁月','从你拔剑开始，他就一直在看你。'],
  ...(C3.dan()?[['苏小棠','（她小声说）……他会不会，跟着我们去京城？']]:[]),
  ['谢霁月','睡吧。明天，进京。'],
  {flag:'c3_a1_done'},
  ['旁白','【第三章 第一幕「北上」完】'],
  ['旁白','（回帐篷睡一觉。天亮，进京。）']]; }});

/* ---------- people to talk to on the road ---------- */
On.talk(id=>{ if(!String(RT.mapId).startsWith('c3_')) return false; const F=S.flags;
  if(id==='xie'){ C3.menu('xie',F.c3_raid_won?[['谢霁月','……别想了。到了京城，他自己会来找你。']]:F.c3_grave?[['谢霁月','天黑之前，回营地。']]:F.c3_shrine?[['谢霁月','（她看着祠堂的方向）……大师兄知道了，会难过的。']]:F.c3_anping_in?[['谢霁月','别分开走。']]:F.c3_morning?[['谢霁月','往北走，就到安平村了。']]:[['谢霁月','柴火在林子边上，泉眼在溪边。']]); return true; }
  if(id==='tang'&&C3.dan()){ C3.menu('tang',F.c3_raid_won?[['苏小棠','我、我刚才一点都没怕！……就一点点。']]:F.c3_anping_in?[['苏小棠','{名}，你看这些封条上的印，都是新的。']]:[['苏小棠','京城听说有好多好多药铺！到了，你陪我去逛好不好？']]); return true; }
  return false; });
// they walk with you: 大师姐 by the fire, 苏小棠 too if she is your fellow disciple
MAPS.c3_road.objects.push(
  {type:'npc', id:'xie', x:9, y:6, look:LOOK_XIE, name:'谢霁月', act:'talk', cond:s=>!!s.flags.c3_go},
  {type:'npc', id:'tang', x:5, y:7, look:LOOK_TANG, name:'苏小棠', act:'talk', cond:s=>s.sect==='dan'&&!!s.flags.c3_go});
MAPS.c3_anping.objects.push({type:'npc', id:'xie', x:13, y:12, look:LOOK_XIE, name:'谢霁月', act:'talk', cond:s=>!!s.flags.c3_go&&!s.flags.c3_grave});
On.theme(id=>id==='c3_road'?(S.flags.c3_night&&!S.flags.c3_raid_won?'night':S.min>=19*60?'night':'calm'):id==='c3_anping'?'night':null);

/* ---------- 大师兄, inside 狂暴穷奇: has anyone been to 安平村? ---------- */
On.act('fxboss2',o=>{ const F=S.flags; if(!(F.c3_shrine&&F.c2_qq_sealed&&!F.c3_lu_egg&&S.fxRematchDay!==S.day)) return false; UI.say(C3.luMeet()); return true; });
C3.luMeet=()=>[
  ['旁白','风眼里的风又乱了起来。狂暴穷奇从天而降——头顶上，还顶着那颗气鼓鼓的人头。'],
  ['陆正衡','{称}！听说你们开春去了京城？'],
  ['陆正衡','……路上，经过安平村没有？'],
  ['穷奇','打完再说！'],
  {battle:'qiongqi2', win:'c3_lu_win', lose:'fx_boss_lose'}];
Object.defineProperty(SCRIPTS,'c3_lu_win',{configurable:true, get(){ return [
  ['陆正衡','……我的牌位。还在吗？'],
  {choice:'你说——', options:[{text:'裂了', go:'c3_lu_a'},{text:'还在，好好的', go:'c3_lu_b'}]}]; }});
Object.defineProperty(SCRIPTS,'c3_lu_a',{configurable:true, get(){ return [
  ['我','裂了。从正中间。'],['陆正衡','……'],['穷奇','哈！裂得好。'],['陆正衡','闭嘴。'],['旁白','过了很久，穷奇头顶上传来一声很轻的叹气。'],['陆正衡','……裂了，也好。'],
  {flag:'c3_lu_egg'}, ...SCRIPTS.fx_rematch_win]; }});
Object.defineProperty(SCRIPTS,'c3_lu_b',{configurable:true, get(){ return [
  ['我','还在。好好的。'],['陆正衡','……是吗。'],['旁白','他的声音低了下去。'],['陆正衡','那就好。'],['穷奇','你骗他做什么。'],['旁白','你没有回答。陆正衡也没有再问。'],
  {flag:'c3_lu_egg'}, ...SCRIPTS.fx_rematch_win]; }});

/* ---------- the quests ---------- */
{ const T=(m,x,y,l)=>[m,x,y,l];
  QUESTS.push(
  {id:'c3a', title:'第三章 · 北上', desc:'开春了。你和大师姐北上京城，去参加宗门大比。第一夜，在官道边扎营。',
    check:s=>!!s.flags.c3_morning,
    progress:s=>{ const c=s.c3||{}, w=(c.wood||[]).length, F=s.flags; if(!F.c3_cooked) return (w<3?`捡柴火 ${w}/3`:'柴够了')+(c.water?'，水打好了':'，去溪边打水')+(w>=3&&c.water?'，去锅边煮粥':''); return F.c3_dinner?'回帐篷睡一觉':'和大师姐在篝火边坐坐'; },
    target:s=>{ const c=s.c3||{}, F=s.flags; if(!F.c3_cooked){ const t=[[2,3],[15,2],[16,12]].map(([x,y],i)=>({x,y,i})).find(t=>!(c.wood||[]).includes(t.i));
        if(t) return T('c3_road',t.x,t.y,'林子边的柴火'); if(!c.water) return T('c3_road',18,8,'溪边的泉眼'); return T('c3_road',8,10,'锅'); }
      return T('c3_road',4,10,'你的帐篷'); }},
  {id:'c3b', title:'安平村', desc:'往北半日，是大师兄斩过狼妖的安平村。村里给他立过长生牌位。',
    check:s=>!!s.flags.c3_grave,
    progress:s=>{ const F=s.flags; return !F.c3_anping_in?'沿官道往北，去安平村':!F.c3_notice?'看看村口的告示':!F.c3_shrine?'去村子北边的祠堂':!F.c3_old?'和井边的老人说说话':'去后山看看'; },
    target:s=>{ const F=s.flags; if(!F.c3_anping_in) return RT.mapId==='c3_anping'?T('c3_anping',11,15,'安平村'):T('c3_road',10,0,'往北的官道');
      return !F.c3_notice?T('c3_anping',13,15,'村口的告示'):!F.c3_shrine?T('c3_anping',11,5,'祠堂'):!F.c3_old?T('c3_anping',8,15,'井边的老人'):T('c3_anping',20,3,'后山'); }},
  {id:'c3c', title:'狼', desc:'天黑了。营地外面的林子里，亮起了红色的眼睛。',
    check:s=>!!s.flags.c3_a1_done,
    progress:s=>s.flags.c3_night?'篝火边，迎战猲狙头狼':'回昨晚的营地',
    target:s=>T('c3_road',7,8,'篝火')},
  {id:'c3z', title:'第三章 · 第一幕 完', desc:'第一幕「北上」完。睡一觉，天亮就进京。', check:s=>!!s.flags.c3_jc_go,
    progress:s=>'回帐篷睡一觉，天亮进京', target:s=>T('c3_road',4,10,'你的帐篷')}); }
