/* ============================================================
   山海问道 · 第二章 · 来访 — once you have gone with your master, 苏小棠 and 顾长歌 are no longer in 桃源镇; they come to
   the sect instead, once a week. 苏小棠 comes to swap notes (药王谷's elder sends his disciples out to learn from other
   sects; unless you are of 药王谷 yourself, then she is there every day). 顾长歌 says he was passing by — he never says
   from where. He only starts after 饿鬼洞: before that he is off on 饕餮's trail, which is where you find him in act 5.
   They stand by the gate on their day, and you can talk and give gifts as you could in town.
   ============================================================ */
const C2Visit={
  // the day each of them comes: 苏小棠 the day after you arrive and every seventh day from then; 顾长歌 two days after you
  // are back from the 秘境, and every seventh day from then
  st(s){ s.c2v=s.c2v||{met:{}}; if(s.c2v.arr==null) s.c2v.arr=s.day; if(s.flags.c2_master_back&&s.c2v.back==null) s.c2v.back=s.day; return s.c2v; },
  away:s=>!!s.flags.c2_depart&&!s.flags.c2_master_back,   // everyone is in the 秘境
  here(id,s){ if(!s.flags.c2_arrive||C2Visit.away(s)) return false; const v=C2Visit.st(s);
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
// they stand by the gate on their day
for(const k in SECTS) MAPS['zong_'+k].objects.push(
  {type:'npc', id:'tang', x:10, y:14, look:LOOK_TANG, name:'苏小棠', act:'talk', cond:s=>C2Visit.here('tang',s)},
  {type:'npc', id:'ge',   x:14, y:14, look:LOOK_GE,   name:'顾长歌', act:'talk', cond:s=>C2Visit.here('ge',s)});
// the first time, they say why they have come; after that it is talk and gifts as in town
{ const _t=Story.talk; Story.talk=function(id){
    if((id==='tang'||id==='ge')&&String(RT.mapId).startsWith('zong_')&&C2Visit.here(id,S)&&!S.flags['c2v_'+id]) return UI.say(C2Visit.INTRO[id], ()=>Social.menu(id));
    return _t.call(Story,id); }; }
// arriving in the sect on their day, you hear that someone is waiting at the gate
{ const _em=enterMap; enterMap=function(id,x,y){ const r=_em(id,x,y);
    if(String(id).startsWith('zong_')&&S.flags&&S.flags.c2_arrive){ const v=C2Visit.st(S); for(const w of ['tang','ge']) if(C2Visit.here(w,S)&&v.met[w]!==S.day){ v.met[w]=S.day;
        setTimeout(()=>UI.toast(w==='tang'?'苏小棠来宗门找你了，在山门边。':'山门边的老松底下，好像站着一个人。'),900); } }
    return r; }; }
// the master says where they went, once you are in the sect
{ const _a=C2S.arrive; if(typeof _a==='function') C2S.arrive=function(){ const r=_a.apply(C2S,arguments); return Array.isArray(r)?r.concat([['旁白',S.sect==='dan'?'（顾长歌又不知道去了哪儿，桃源镇里见不到他了。苏小棠倒是跟你进了同一个山门。）':'（苏小棠回药王谷去了，顾长歌又不知道去了哪儿。桃源镇里见不到他们了——不过，说不定他们会来宗门找你。）']]):r; }; }
