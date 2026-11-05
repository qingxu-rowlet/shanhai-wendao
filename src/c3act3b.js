/* ============================================================
   山海问道 · 第三章「京城」 · 第三幕 · 宗门来信 — the morning after the final a paper crane comes from your master: the
   other sects have written — not one of their beaten disciples ever came home. By noon the street outside 四方馆 is
   saying it: "the 狐仙 who was 魁首 last time drinks people's 精气 at night". The 礼部 confines 大师姐 to 四方馆 and posts
   a guard at the gate. She says: go and find out. Four clues: the 八卦镜 on an empty room, 苏小棠 and the dregs in a tea
   bowl, what 青禾 at 醉月楼 heard, the 千金坊's ledger. Here: the first two, both in 四方馆.
   The 八卦镜 has three looks in it (照房间、照人、照真相); this is the first.
   ============================================================ */
const XF={
  st(){ const c=C3.st(); c.xf=c.xf||{clue:{}}; c.bagua=c.bagua==null?3:c.bagua; return c.xf; },
  n:()=>Object.keys(XF.st().clue).length,
  SECT_OF:{sf_cheng:'jian', sf_bu:'tianji', sf_lin:'jian', sf_wulan:'shou', sf_wenxuan:'tianji'},
  // the room to look into: the one who lost the third round (the strongest of those taken)
  who:()=>{ const b=(KM.st().bracket||KM.bracket()); return b[2]; },
  whoName:()=>KM.NAME[XF.who()].replace(/（.*/,''),
  room:()=>XF.SECT_OF[XF.who()],
};
ITEMS.c2_bagua.desc+='（第三章：师尊解开了一面封印。还能照三次：照房间、照人、照真相。）';
Object.assign(ITEMS,{c3_dregs:{name:'茶碗里的药渣', icon:'i_lingmo', quest:true, keep:true, desc:'失踪弟子房里，一只茶碗底下的药渣。黑褐色，闻着有一股铁锈味。'}});

/* ---------- the morning after: letters, rumours, the guard ---------- */
On.enter(id=>{ if(id!=='jc_sifang'||!S.flags.c3_lt_done||S.flags.c3_xf_in||S.min<5*60||S.min>14*60) return;
  setTimeout(()=>{ if(RT.mapId==='jc_sifang'&&!S.flags.c3_xf_in) UI.say(XF.morning(),()=>{ UI.hud(); Story.check(); }); },700); });
XF.morning=()=>{ const m=SECTS[S.sect].master.name, others=Object.keys(SECTS).filter(k=>k!==S.sect).map(k=>SECTS[k].name).join('、'); return [
  ['旁白','天刚亮，一只纸鹤从窗缝里钻进来，落在你的枕头边上。'],
  ['旁白',`是${m}的字。`],
  ['旁白',`「${others}来书：本宗落败弟子，无一人归山。」`],
  ['旁白','「礼部的马车，不曾到过任何一座山门。」'],
  ['旁白','「速查。勿轻举。」'],
  ['苏小棠','（她拿着另一只纸鹤冲进来，脸都白了）{名}！长老也来信了……他问我，大比完了，怎么还不回去……'],
  ['苏小棠','他说……这几年，京城里来大比的弟子，回去的越来越少了。'],
  ['旁白','到了中午，四方馆门外聚了一群人，指指点点。'],
  ['看热闹的人','就是这儿……那位「狐仙」住的地方。'],
  ['看热闹的人','听说了吗？夜里吸人精气！上一届就是这么夺的魁，这一届又来了！'],
  ['看热闹的人','她住哪儿，哪儿就丢人……'],
  ['旁白','礼部尚书带着一队禁军进了院子。'],
  ['礼部尚书','谢霁月。'],
  ['礼部尚书','京城近日流言四起，事关参赛弟子失踪。即日起，禁足四方馆，听候发落。'],
  ['苏小棠','凭什么！大师姐什么都没做！'],
  ['谢霁月','（她按住苏小棠的肩膀，没有看礼部尚书，只看着你）……'],
  ['谢霁月','我不走。'],
  ['旁白','禁军在馆门口站了一排。礼部尚书走了。'],
  {run:()=>C3.set('c3_xf_in')},
  ['谢霁月','（等人都走了，她才开口，声音很低）去查。'],
  ['谢霁月','先看他们住过的屋子。你怀里那面镜子，还照得出东西。'],
  ['谢霁月','苏小棠认药。有什么吃的喝的，拿给她看。'],
  ['谢霁月','还有……城里的人知道的，比我们多。听说书的、喝酒的、赌钱的。'],
  ['旁白',`（线索：用八卦镜照${XF.whoName()}住过的屋子；找苏小棠验药；醉月楼、千金坊也许有人知道什么。）`]]; };

/* ---------- clue 1: the empty room, and the 八卦镜 ---------- */
XF.roomScene=()=>{ const c=C3.st(), n=XF.whoName(); return [
  ['旁白',`${n}住过的厢房。门没有锁。`],
  ['旁白','屋里收拾得很干净，干净得不像住过人。床铺叠得整整齐齐，包袱不见了。'],
  ['旁白','桌上只剩一只茶碗，碗底干了，留着一圈黑褐色的渣子。'],
  {choice:`用八卦镜照一照？（还能照 ${c.bagua} 次）`, options:[
    {text:'照', fn:()=>UI.say(XF.mirror(),()=>{ UI.hud(); Story.check(); })},
    {text:'先不照', fn:()=>{}}]}]; };
XF.mirror=()=>{ const n=XF.whoName(); return [
  {run:()=>{ C3.st().bagua--; }},
  ['旁白','你把八卦镜举起来。镜面那一角亮了，像一只半睁的眼睛。'],
  ['旁白','镜子里，屋里点着灯。是那天夜里。'],
  ['旁白',`${n}坐在桌边收拾包袱。门开了，礼部的小吏端着一只茶碗进来。`],
  ['礼部小吏','（镜子里）送行茶。大比辛苦了，喝了好上路。'],
  ['旁白',`${n}喝了。没过一会儿，就趴在了桌子上。`],
  ['旁白','门外又进来两个人，一身黑衣，脸看不清。他们把人架起来，往额头上贴了一张黄符。'],
  ['旁白','符上没有字，画着一面圆圆的镜子。'],
  ['我','（……观天鉴。）'],
  ['旁白','镜面暗了下去。'],
  ['我','（……送行茶。）'],
  {give:{c3_dregs:1}},
  {run:()=>{ XF.st().clue.room=true; save(); }},
  ['旁白','（你把茶碗里的药渣包了起来。线索：失踪弟子的屋子。）']]; };
XF.roomAgain=()=>[['旁白','空了的厢房。桌上的茶碗已经被你收走了。']];

/* ---------- clue 2: 苏小棠 and the dregs ---------- */
XF.dregs=()=>[
  ['苏小棠','药渣？给我看看。'],
  ['旁白','她把药渣倒在手心里，捻了捻，又凑到鼻子底下闻。'],
  ['苏小棠','安神的……酸枣仁、夜交藤，还有曼陀罗。这是「醉仙散」，喝了能睡三天三夜。'],
  ['苏小棠','还有一味……'],
  ['旁白','她的手停住了。'],
  ['苏小棠','苦的。像铁锈。'],
  ['苏小棠','（她的脸一点一点白下去）{名}……这股味道，我闻过。'],
  ['苏小棠','回春堂那个北边来的汉子。他身上，就是这股味道。'],
  ['苏小棠','精气被吸走的人，身上的味道。'],
  {run:()=>{ XF.st().clue.dregs=true; save(); }},
  ['旁白','（线索：药渣。和柳河村那个汉子身上的味道一样。）']];

/* ---------- hooks in 四方馆 ---------- */
// the guard at the gate while 大师姐 is confined
MAPS.jc_sifang.objects.push({type:'npc', id:'xf_guard', x:13, y:19, look:{g:'m',skin:2,hair:0,hairColor:0,style:'jin',cloth:2,face:'mid'}, name:'禁军', act:'talk', cond:s=>!!s.flags.c3_xf_in});
Object.assign(JC.CHAT,{xf_guard:['……']});
XF.talk=id=>{ const F=S.flags;
  if(id==='xf_guard'){ UI.say([['禁军','谢姑娘不许出馆。'],['禁军','……别的人，随意。']]); return true; }
  if(id==='tang'&&count(S,'c3_dregs')&&!XF.st().clue.dregs){ UI.say(XF.dregs(),()=>{ UI.hud(); Story.check(); }); return true; }
  if(id==='xie'){ const c=XF.st().clue; C3.menu('xie',[['谢霁月','（她坐在槐树底下，剑横在膝头，看着馆门口的禁军）'],
    ['谢霁月',!c.room?`先去${XF.whoName()}的屋子看看。`:!c.dregs?'药渣，拿给苏小棠。':'城里的人，知道的比我们多。醉月楼，千金坊……去问问。'],
    ['谢霁月','……我没事。别担心我。']]); return true; }
  return false; };
// the empty room: a wing that isn't yours, once you are looking
XF.door=o=>{ if(!S.flags.c3_xf_in||o.sect!==XF.room()) return false; if(XF.st().clue.room) return UI.say(XF.roomAgain()), true; UI.say(XF.roomScene()); return true; };

/* ---------- the quest ---------- */
{ const q=QUESTS.find(q=>q.id==='c3m'); Object.assign(q,{desc:'落败的弟子没有一个回到宗门。京城里说是大师姐吸了他们的精气，她被禁足在四方馆。去查。', check:s=>XF.n()>=4,
    progress:s=>{ if(!s.flags.c3_xf_in) return '天亮了'; const c=XF.st().clue;
      return `线索 ${XF.n()}/4：`+[c.room?'屋子 ✓':'用八卦镜照空屋', c.dregs?'药渣 ✓':'找苏小棠验药', c.qinghe?'醉月楼 ✓':'醉月楼（之后的地图）', c.ledger?'千金坊 ✓':'千金坊（之后的地图）'].join('、'); },
    target:s=>{ if(!s.flags.c3_xf_in) return ['jc_sifang',12,10,'大师姐']; const c=XF.st().clue, [x,y]=SF_WING[XF.room()];
      return !c.room?['jc_sifang',x+3,y+3,XF.whoName()+'的屋子']:!c.dregs?['jc_sifang',8,13,'苏小棠']:['jc_sifang',12,10,'大师姐']; }}); }
