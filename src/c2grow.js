/* ============================================================
   山海问道 · 第二章 · 好感与修炼 — talking to 大师兄, 大师姐 and 二师兄 raises 好感 like everyone else, and at 2♥ and 4♥ each
   says something they would not say to just anyone (大师兄 until 穷奇 takes him, 二师兄 until he leaves; 大师姐 is one of
   the two you can come to love, so hers change the most). Talking to them in the middle of a chore no longer only asks
   whether you have finished. And growing stronger: a 蒲团 in the sect and at the camp, 打坐 slowing right down after 筑基
   (each realm takes days), the bosses' 修为 doing the real work, and a word after a lost fight about the 风穴.
   ============================================================ */
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
  c2g_xie_a:[['我','我不信他们。'],['谢霁月','（她转过头，看了你一眼）……你才来几天。'],['我','几天就够了。'],['旁白','她没有再说话。可她膝盖上那柄剑，被她攥得没那么紧了。'],{love:{xie:50}}],
  c2g_xie_b:[['我','你笑起来，一定很好看。'],['谢霁月','……胡说。'],['旁白','她把脸转开了。月光底下，你好像看见她的耳朵红了一点。'],{love:{xie:60}}],
  c2g_xie_c:[['我','那我以后每天都来。'],['谢霁月','……随你。'],['旁白','她走了两步，又回头：「卯时。迟了，就不教了。」'],{love:{xie:60}}],
  c2g_xie_d:[['旁白','你什么也没说，又认认真真地把那一招练了一遍。手腕松着，剑是活的。'],['谢霁月','（她看着，嘴角动了一下）……嗯。'],{love:{xie:50}}],
});
// mid-chore, talking to them is not only being asked whether you have finished
{ const _ct=C2.talk; C2.talk=function(id){
    if(C2.on()&&WHO[id]&&S.c2&&S.c2.got&&S.c2.got[id]===1&&!C2.def(id).need(S)){ const d=C2.def(id), n=NPCS[id], h=Social.hearts(id);
      UI.say([{choice:`${n.name}　${'♥'.repeat(h)}${'♡'.repeat(Math.max(0,(n.romance?10:8)-h))}${Social.rel(id).gifted===S.day?'　（今天已送过礼）':''}`, options:[
        {text:'问问功课', fn:()=>UI.say([[WHO[id], {lu:'还没做完？',xie:'……还没好。',man:'不急不急，慢慢来～'}[id]], ['旁白','（'+d.goal+'：'+d.prog(S)+'）']])},
        {text:'聊天', fn:()=>Social.chat(id)},{text:'送礼', fn:()=>Social.giftPick(id)},{text:'离开', fn:()=>{}}]}]); return true; }
    return _ct.call(C2,id); }; }
// 大师姐 can come to love you, as 苏小棠 and 顾长歌 can: her hearts go to ten, and what she says warms as they rise
NPCS.xie.romance=true;
TALK.xie[2]=TALK.xie[2].concat(['今天的剑，比昨天稳。……我看得出来。','你要是累了，就歇会儿。我替你看着。']);
TALK.xie[3]=TALK.xie[3].concat(['……别看了。我脸上又没有字。','（她把一颗朱果放进你手里）路上吃。']);

/* ---------- growing stronger ---------- */
// after 筑基, sitting still gives little: days for a realm, and the 风穴 and the bosses give far more
{ const _b=Med.block; Med.block=L=>L>=10?Math.max(4,Math.round((14+4*L)*2*Sect.medMul()*(L===10?.2:.13))):_b(L); }
{ const _o=Med.open; Med.open=function(){ const r=_o.apply(Med,arguments);
    if(S.L>=10) setTimeout(()=>{ const p=document.querySelector('#panel .muted'); if(p&&!document.getElementById('medHint')) p.insertAdjacentHTML('afterend','<p class="muted" id="medHint">筑基之后，打坐一天比一天慢，一个境界要坐上好几天。想快些变强：用传送阵去风穴挑战狂暴穷奇，修为和灵石都来得快；打赢秘境里的强敌，修为也会涨一大截。</p>'); },30);
    return r; }; }
// a 蒲团 in the sect, beside your room, and one at the camp, beside your tent
for(const k in SECTS) MAPS['zong_'+k].objects.push({type:'futon', x:2, y:15, act:'meditate'});
MAPS.mj_camp.objects.push({type:'futon', x:6, y:11, act:'meditate'});
// a lost fight in the 秘境 says where to get stronger
for(const sc of [SCRIPTS.c2c_lose, SCRIPTS.c2x_lose, SCRIPTS.c2y_lose]) if(Array.isArray(sc)) sc.push(['旁白','（打不过的话：营地的传送阵能去风穴，挑战狂暴穷奇，修为和灵石都来得快。也可以在帐篷边的蒲团上打坐，只是筑基之后，打坐越来越慢。）']);
