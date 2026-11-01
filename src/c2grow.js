/* ============================================================
   山海问道 · 第二章 · 功课和秘境里的小事 — talking to a senior in the middle of a chore is more than being asked whether you
   have finished; a 蒲团 at the 秘境 camp; after a lost fight in the 秘境, a word about where to get stronger; and on the day
   you arrive, a line saying where 苏小棠 and 顾长歌 went. (The seniors' 好感, gifts, the sect's 蒲团, slow 打坐 after 筑基
   and the weekly visits are sect life, not this chapter's story: they live in sectlife.js.)
   ============================================================ */
// mid-chore, talking to them is not only being asked whether you have finished
{ const _ct=C2.talk; C2.talk=function(id){
    if(C2.on()&&WHO[id]&&S.c2&&S.c2.got&&S.c2.got[id]===1&&!C2.def(id).need(S)){ const d=C2.def(id), n=NPCS[id], h=Social.hearts(id);
      UI.say([{choice:`${n.name}　${'♥'.repeat(h)}${'♡'.repeat(Math.max(0,(n.romance?10:8)-h))}${Social.rel(id).gifted===S.day?'　（今天已送过礼）':''}`, options:[
        {text:'问问功课', fn:()=>UI.say([[WHO[id], {lu:'还没做完？',xie:'……还没好。',man:'不急不急，慢慢来～'}[id]], ['旁白','（'+d.goal+'：'+d.prog(S)+'）']])},
        {text:'聊天', fn:()=>Social.chat(id)},{text:'送礼', fn:()=>Social.giftPick(id)},{text:'离开', fn:()=>{}}]}]); return true; }
    return _ct.call(C2,id); }; }

/* ---------- the 秘境 ---------- */
// a 蒲团 at the camp, beside your tent
MAPS.mj_camp.objects.push({type:'futon', x:6, y:11, act:'meditate'});
// a lost fight in the 秘境 says where to get stronger
for(const sc of [SCRIPTS.c2c_lose, SCRIPTS.c2x_lose, SCRIPTS.c2y_lose]) if(Array.isArray(sc)) sc.push(['旁白','（打不过的话：营地的传送阵能去风穴，挑战狂暴穷奇，修为和灵石都来得快。也可以在帐篷边的蒲团上打坐，只是筑基之后，打坐越来越慢。）']);
// the day you arrive: where they went
{ const _a=C2S.arrive; if(typeof _a==='function') C2S.arrive=function(){ const r=_a.apply(C2S,arguments); return Array.isArray(r)?r.concat([['旁白',S.sect==='dan'?'（顾长歌又不知道去了哪儿，桃源镇里见不到他了。苏小棠倒是跟你进了同一个山门。）':'（苏小棠回药王谷去了，顾长歌又不知道去了哪儿。桃源镇里见不到他们了——不过，说不定他们会来宗门找你。）']]):r; }; }
