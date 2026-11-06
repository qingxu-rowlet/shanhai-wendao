/* ============================================================
   山海问道 · 宗门生活 — what goes on in the sect whichever chapter it is: the three seniors' 好感 and the things they say
   at 2♥ and 4♥, gifts and what everyone says to them, 大师姐 who can come to love you, the 蒲团 by your room and how slow
   sitting still gets after 筑基, and 苏小棠 and 顾长歌 coming to the gate once a week. It starts the day you arrive in the
   sect with your master (第二章) and needs nothing else from any chapter's story. A chapter that takes everyone away from
   the sect for a while says so with SectLife.away(…), and the visits wait until they are back.
   (Moved here from the chapter 2 files on 2026-11-01; save data keeps its old names: s.c2v, flags c2v_tang / c2v_ge.)
   ============================================================ */
const SectLife={
  joined:s=>!!(s&&s.flags&&s.flags.c2_arrive),
  // chapters register the stretches when you are away from the sect (第二章: the 秘境)
  awayRules:[], away(fn){ SectLife.awayRules.push(fn); },
  isAway:s=>SectLife.awayRules.some(f=>f(s)),
};

/* ---------- the seniors' 好感 ---------- */
Object.assign(HEART_EVENTS, {
  lu:{2:[['旁白','三更天，练功场上只有一个人。大师兄一剑一剑地练，汗水把衣服都湿透了。'],
        ['陆正衡','……睡不着？'],
        ['陆正衡','你知道我为什么每天三更起吗？'],
        ['陆正衡','我爹是村里的教书先生。有一年，村长家丢了一块玉，全村都说是他偷的。'],
        ['陆正衡','后来玉找到了，在村长儿子的枕头底下。可没有一个人来道歉。'],
        ['陆正衡','我爹到死都没再进过学堂。'],
        ['陆正衡','（他把剑收回鞘里）所以我要名声。要一个谁都说不出不是的名声。'],
        ['陆正衡','……这话，你听过就忘了吧。'],
        {love:{lu:30}}],
      4:[['旁白','大师兄站在界碑旁边，看着北边的山，看了很久。'],
        ['陆正衡','{称}。安平村的事，你听说过吧？我在那儿斩了一窝狼妖。'],
        ['陆正衡','村民给我立了长生牌位。你知道吗，到现在，每年都有人去给它上香。'],
        ['陆正衡','……可我有时候会梦见一只母狼。'],
        ['陆正衡','它到死，都挡在一个草窝前面。'],
        ['陆正衡','（他沉默了一会儿）它们是妖。妖，本来就该死。'],
        ['陆正衡','{称}，你说——是不是只要大家都说你是对的，你就是对的？'],
        {choice:'你——', options:[{text:'对不对，你自己心里知道', go:'c2g_lu_a'},{text:'（不知道该怎么回答）', go:'c2g_lu_b'}]}]},
  xie:{2:[['旁白','夜里路过药圃，你看见大师姐坐在石阶上，膝盖上横着她的剑。'],
        ['谢霁月','……你今天在药圃，听见他们说什么了吧。'],
        ['谢霁月','我十三岁进山门。第一天，就有人说我是靠脸进来的。'],
        ['谢霁月','那时候我还会笑。笑起来，他们说我狐媚；不笑，他们说我装清高。'],
        ['谢霁月','后来我就不笑了。反正，怎么样都不对。'],
        {choice:'你对大师姐说——', options:[{text:'我不信他们', go:'c2g_xie_a'},{text:'你笑起来一定很好看', go:'c2g_xie_b'}]}],
      4:[['旁白','天刚亮，大师姐把你叫到练功场。她手里拿着两柄木剑。'],
        ['谢霁月','握剑的时候，手腕要松。太紧了，剑就是死的。'],
        ['旁白','她站到你身后，扶正你的手腕。她的手很凉。'],
        ['谢霁月','……再来一遍。'],
        ['旁白','你们练到太阳升起来。她收了木剑，看了你一眼。'],
        ['谢霁月','这一招，我谁都没教过。'],
        ['谢霁月','你是第一个。'],
        {choice:'你——', options:[{text:'那我以后每天都来', go:'c2g_xie_c'},{text:'（认认真真地再练一遍）', go:'c2g_xie_d'}]}]},
  man:{2:[['旁白','二师兄蹲在膳堂后面，对着一个空碗发呆。'],
        ['何满仓','{称}，你吃过观音土吗？'],
        ['何满仓','……没、没什么。我随便问问。'],
        ['何满仓','我小时候，有一年什么吃的都没有。我什么都记不清了，只记得我娘的手，很凉，很凉。'],
        ['何满仓','后来我就怕饿。一饿，就怕。'],
        ['何满仓','（他挠挠头，又笑了）所以我才吃这么多嘛！哈哈……'],
        {love:{man:30}}],
      4:[['何满仓','{称}，给你看个东西。'],
        ['旁白','他从袖子里掏出半个馒头，硬得像石头，边上都发黄了。'],
        ['何满仓','我揣了很多年了。'],
        ['何满仓','不能给你吃哦。但是……可以让你摸一下。'],
        ['旁白','你碰了一下。真的很硬。'],
        ['何满仓','我总觉得，只要它还在，我就不会饿死。'],
        ['旁白','他把馒头小心地揣回袖子里，拍了拍，像是在哄一个睡着的小孩。'],
        {love:{man:40}}]},
});
Object.assign(SCRIPTS, {
  c2g_lu_a:[['我','对不对，你自己心里知道。'],['陆正衡','……'],['旁白','他看了你很久，没有说话。转身走了。'],['旁白','走出几步，他停下来：「……你比我当年胆子大。」'],{love:{lu:40}}],
  c2g_lu_b:[['旁白','你不知道该怎么回答。'],['陆正衡','（他自嘲地笑了一下）……我也不知道。'],['陆正衡','回去睡吧。'],{love:{lu:30}}],
  c2g_xie_a:[['我','我不信他们。'],['谢霁月','（她转过头，看了你一眼）……你才来几天。'],['我','几天就够了。'],['旁白','她没有再说话。可她膝盖上那柄剑，被她攥得没那么紧了。'],{love:{xie:50}},{cgend:true}],
  c2g_xie_b:[['我','你笑起来，一定很好看。'],['谢霁月','……胡说。'],['旁白','她把脸转开了。月光底下，你好像看见她的耳朵红了一点。'],{love:{xie:60}},{cgend:true}],
  c2g_xie_c:[['我','那我以后每天都来。'],['谢霁月','……随你。'],['旁白','她走了两步，又回头：「卯时。迟了，就不教了。」'],{love:{xie:60}},{cgend:true}],
  c2g_xie_d:[['旁白','你什么也没说，又认认真真地把那一招练了一遍。手腕松着，剑是活的。'],['谢霁月','（她看着，嘴角动了一下）……嗯。'],{love:{xie:50}},{cgend:true}],
});
// 大师姐 can come to love you, as 苏小棠 and 顾长歌 can: her hearts go to ten, and what she says warms as they rise
NPCS.xie.romance=true;
// what each of them says to a gift (they had no lines, so a gift came back as «undefined»)
Object.assign(GIFT_LINES.love, {lu:'……聚气丹？（他咳了一声）我正缺这个。谢了，{称}。', xie:'……（她看了你很久）你怎么知道，我喜欢这个。', man:'给我的？！{称}你真是太好了！我、我先藏一半，留着明天吃！', zhishi:'哎哟，好酒！这个面子，许某记下了。'});
Object.assign(GIFT_LINES.like, {lu:'嗯。用得上。', xie:'……收下了。', man:'嘿嘿，谢谢{称}！', zhishi:'有心了，有心了。'});
Object.assign(GIFT_LINES.neutral, {lu:'嗯。', xie:'嗯。', man:'哦？谢谢……', zhishi:'放这儿吧。'});
Object.assign(GIFT_LINES.hate, {lu:'这东西……你自己留着吧。', xie:'……拿走。', man:'这个……这个不能吃吧？', zhishi:'这玩意儿，小店可不收。'});
// and if anyone is ever missing a line, they say something plain instead of «undefined»
for(const k of ['love','like','neutral','hate']) GIFT_LINES[k]=new Proxy(GIFT_LINES[k], {get:(o,id)=>o[id]!==undefined?o[id]:({love:'……谢谢，我很喜欢。', like:'谢谢。', neutral:'嗯，谢谢。', hate:'……这个，还是算了吧。'})[k]});
TALK.xie[2]=TALK.xie[2].concat(['今天的剑，比昨天稳。……我看得出来。','你要是累了，就歇会儿。我替你看着。']);
TALK.xie[3]=TALK.xie[3].concat(['……别看了。我脸上又没有字。','（她把一颗朱果放进你手里）路上吃。']);

/* ---------- cultivation after 筑基 ---------- */
// after 筑基, sitting still gives little: days for a realm, and the 风穴 and the bosses give far more
{ const _b=Med.block; Med.block=L=>L>=10?Math.max(4,Math.round((14+4*L)*2*Sect.medMul()*(L===10?.2:.13))):_b(L); }
{ const _o=Med.open; Med.open=function(){ const r=_o.apply(Med,arguments);
    if(S.L>=10) setTimeout(()=>{ const p=document.querySelector('#panel .muted'); if(p&&!document.getElementById('medHint')) p.insertAdjacentHTML('afterend','<p class="muted" id="medHint">筑基之后，打坐一天比一天慢，一个境界要坐上好几天。想快些变强：用传送阵去风穴挑战狂暴穷奇，修为和灵石都来得快；打赢秘境里的强敌，修为也会涨一大截。</p>'); },30);
    return r; }; }
// a 蒲团 in the sect, beside your room
for(const k in SECTS) MAPS['zong_'+k].objects.push({type:'futon', x:2, y:15, act:'meditate'});

/* ---------- 苏小棠 and 顾长歌 come to the gate once a week ----------
   Once you have gone with your master they are no longer in 桃源镇. 苏小棠 comes to swap notes (药王谷's elder sends his
   disciples out to learn from other sects; if you are of 药王谷 yourself she is there every day). 顾长歌 says he was passing
   by — he never says from where. He only starts after 饿鬼洞: before that he is off on 饕餮's trail. */
SectLife.away(s=>!!s.flags.c2_depart&&!s.flags.c2_master_back);   // 第二章: everyone is in the 秘境
SectLife.visit={
  // the day each of them comes: 苏小棠 the day after you arrive and every seventh day from then; 顾长歌 two days after you
  // are back from the 秘境, and every seventh day from then
  st(s){ s.c2v=s.c2v||{met:{}}; if(s.c2v.arr==null) s.c2v.arr=s.day; if(s.flags.c2_master_back&&s.c2v.back==null) s.c2v.back=s.day; return s.c2v; },
  here(id,s){ if(!SectLife.joined(s)||SectLife.isAway(s)) return false; const v=SectLife.visit.st(s);
    if(id==='tang') return s.sect!=='dan'&&(s.day-v.arr)%7===1;
    if(id==='ge') return v.back!=null&&s.day>v.back&&(s.day-v.back)%7===2;
    return false; },
  INTRO:{
    tang:[['旁白','山门口探进来一个熟悉的脑袋，背上的药篓比她人还高。'],
      ['苏小棠','{名}！找到你啦！'],
      ['苏小棠','药尘长老说，闭门炼丹是炼不出好丹的，要我们多出去走走，跟别的宗门交流交流。'],
      ['苏小棠','我……我就第一个想到你了。'],
      ['苏小棠','（她把药篓往身后藏了藏）才、才不是特意来的！是长老让的！'],
      ['苏小棠','以后我每七天来一次，就在山门这儿。你可别让我扑空呀。'],
      {flag:'c2v_tang'}],
    ge:[['旁白','山门边那棵老松底下，有人抱着剑靠着，像是已经站了很久。'],
      ['顾长歌','……哟。'],
      ['顾长歌','别多想。路过。'],
      ['我','从哪儿能路过到我们山门口？'],
      ['顾长歌','（他抬头看了看天）……东边。'],
      ['顾长歌','饿鬼洞的伤，好了没有。'],
      ['我','好了。你呢？'],
      ['顾长歌','我又没伤。'],
      ['旁白','他左手的袖子底下，还缠着一圈绷带。'],
      ['顾长歌','……酒带了没有？没带就算了。我坐一会儿就走。'],
      ['旁白','他没说下回什么时候来。可是七天以后，老松底下又多了一个抱着剑的人。'],
      {flag:'c2v_ge'}]},
};
const C2Visit=SectLife.visit;   // the old name, for anything that still says it
// they stand by the gate on their day
for(const k in SECTS) MAPS['zong_'+k].objects.push(
  {type:'npc', id:'tang', x:10, y:14, look:LOOK_TANG, name:'苏小棠', act:'talk', cond:s=>SectLife.visit.here('tang',s)},
  {type:'npc', id:'ge',   x:14, y:14, look:LOOK_GE,   name:'顾长歌', act:'talk', cond:s=>SectLife.visit.here('ge',s)});
// the first time, they say why they have come; after that it is talk and gifts as in town
{ const _t=Story.talk; Story.talk=function(id){
    if((id==='tang'||id==='ge')&&String(RT.mapId).startsWith('zong_')&&SectLife.visit.here(id,S)&&!S.flags['c2v_'+id]) return UI.say(SectLife.visit.INTRO[id], ()=>Social.menu(id));
    return _t.call(Story,id); }; }
// arriving in the sect on their day, you hear that someone is waiting at the gate
{ const _em=enterMap; enterMap=function(id,x,y){ const r=_em(id,x,y);
    if(String(id).startsWith('zong_')&&SectLife.joined(S)){ const v=SectLife.visit.st(S); for(const w of ['tang','ge']) if(SectLife.visit.here(w,S)&&v.met[w]!==S.day){ v.met[w]=S.day;
        setTimeout(()=>UI.toast(w==='tang'?'苏小棠来宗门找你了，在山门边。':'山门边的老松底下，好像站着一个人。'),900); } }
    return r; }; }
