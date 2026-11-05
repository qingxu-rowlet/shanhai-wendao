/* ============================================================
   山海问道 · 第三章「京城」 · 第三幕 · 擂台赛 — one round a day on the 擂台 before the 贡院: first the 观天鉴, then the
   fight. Lose and you are not out: 大师姐 sends you back to train, and you go up again when you're ready. Round two is
   always 苏小棠: halfway through she sees you are stronger and stops — "go and be first; I want to see you at the top".
   Every night the one who lost is put into a 礼部 carriage "to be sent home to their sect" (苏小棠 alone may stay: the
   clerk looks in his book — 萧大人 left word). The final; 萧烬 claps twice; you are 魁首.
   ============================================================ */
const LT={
  st(){ const c=KM.st(); c.round=c.round||0; return c; },
  opp:()=>{ const c=LT.st(); return (c.bracket||KM.bracket())[c.round]; },
  ROUND:['第一轮','第二轮','第三轮','决赛'],
  // what each says before and after
  PRE:{
    sf_cheng:[['程小剑','（他握剑的手在抖）请、请多指教！']], sf_bu:[['卜小鱼','我算过了，这一局我会输。'],['卜小鱼','……不过我还是要打的。']],
    tang:()=>S.sect==='dan'?[['苏小棠','（她站在擂台那一头，冲你挥了挥手）同门切磋！'],['苏小棠','长老说，药王谷的弟子，上了台就不许哭。']]:[['苏小棠','（她站在擂台那一头，深吸了一口气）……{名}。'],['苏小棠','我说过的，你不许让我。']],
    sf_lin:[['林沧','（他拔出剑。剑身很窄，亮得刺眼）'],['林沧','我说过。我的剑，不会等你。']],
    sf_wulan:[['乌兰','阿毛，上！'],['旁白','白耳朵的狌狌跳上擂台，冲你龇牙。它还是怕你身上的狼味，可它没有退。']],
    sf_wenxuan:[['温玄','（他在掌心里摇了摇三枚铜钱）……这一卦，是「既济」。'],['温玄','事已经成了。只是，成的是谁的事。']],
  },
  WIN:{
    sf_cheng:[['程小剑','（他坐在地上，揉着手腕）……师兄说得对，我还得练。']], sf_bu:[['卜小鱼','你看，我算得多准。']],
    sf_lin:[['林沧','（他看着地上断成两截的剑穗，很久没有说话）'],['林沧','……你的剑，比我快。'],['林沧','我回去，再练十年。']],
    sf_wulan:[['乌兰','（阿毛缩在她怀里，她摸着它的脑袋笑了）哈！输得痛快！'],['乌兰','下回去万兽谷，我请你吃烤羊腿。']],
    sf_wenxuan:[['温玄','（他捡起地上的铜钱，看了一眼，又看了你一眼）……原来是你的事。'],['温玄','保重。京城的卦，越来越乱了。']],
  },
};

/* ---------- the 擂台 ---------- */
LT.go=()=>{ const c=LT.st(), id=LT.opp();
  if(!S.flags.c3_km_done) return false;
  if(c.round>=4) return UI.say([['旁白','擂台上空空荡荡的。红毡上，还留着几道剑痕。']]);
  if(c.day===S.day) return UI.say([['礼部尚书','今日的比完了。明日辰时再来。']]);
  UI.say([['旁白',`四宗大比 · ${LT.ROUND[c.round]}。`],['旁白','上台之前，你又在观天鉴前站了一下。镜面晃了晃，记下了什么。'],
    ...(typeof LT.PRE[id]==='function'?LT.PRE[id]():LT.PRE[id]),
    {choice:`${LT.ROUND[c.round]}：对 ${KM.NAME[id]}`, options:[{text:'上台', fn:()=>LT.fight()},{text:'再准备一下', fn:()=>{}}]}]); return true; };
// 苏小棠's round ends in her own scene (she stops at half); should a blow finish her first, the scene still follows
LT.fight=()=>{ const id=LT.opp(); Battle.start('c3r_'+id, r=>{ if(r!=='win') return LT.lose(); if(id==='tang') return setTimeout(()=>{ if(!S.flags.c3_lt_tang) LT.tangAfter(); },400); LT.win(); }); };
LT.lose=()=>{ S.hp=Math.max(1,Math.round(stats().hp*.4)); UI.hud(); const c=LT.st(); c.lost=(c.lost||0)+1; save();
  UI.say([['旁白','你被打下了擂台。'],['谢霁月','（她把你扶起来，拍掉你肩上的灰）……没事。'],
    ['谢霁月','魁首不是一次打出来的。回去，打坐，练剑，吃药。'],['谢霁月','练好了，再上去。礼部那边，我去说。'],{flag:'c3_lt_lost'}]); };
LT.win=()=>{ const c=LT.st(), id=LT.opp(), fin=c.round===3; c.round++; c.day=S.day; S.stones+=fin?400:[100,150,200][c.round-1]; save();
  UI.say([...(LT.WIN[id]||[]),['旁白',`（${LT.ROUND[c.round-1]}，胜。灵石 +${fin?400:[100,150,200][c.round-1]}。）`],...(fin?LT.crown():[])],()=>{ UI.hud(); LT.evening(id); }); };

/* ---------- 苏小棠: she stops halfway ---------- */
LT.yield=s=>{ if(s.yielded) return; s.yielded=true; s.busy=true; Battle.ui();
  QQLU.talk([['苏小棠','（她忽然停下来，丹火在她掌心里慢慢灭了）……'],['苏小棠','{名}，你比我厉害。厉害好多。'],['苏小棠','我早就知道了。从桃源镇，你帮我采药那天就知道了。'],
    ['苏小棠','（她笑了，眼睛红红的）我认输。'],['苏小棠','你去拿头名吧。'],['苏小棠','我要看你站在最上面。']],()=>{ if(Battle.s!==s) return; s.dead=true; Battle.end('win'); }); };
{ const _act=Battle.act; Battle.act=function(a){ const s=Battle.s; const r=_act.call(Battle,a); if(s&&s.kind==='c3r_tang'&&Battle.s===s&&!s.yielded&&!s.over&&s.hp<=s.max*.5){ s.dead=false; s.hp=Math.max(1,s.hp); LT.yield(s); } return r; }; }
{ const _et=Battle.enemyTurn; Battle.enemyTurn=function(){ const s=Battle.s; if(s&&s.kind==='c3r_tang'&&!s.yielded&&s.hp<=s.max*.5) return LT.yield(s); return _et.call(Battle); }; }
LT.tangAfter=()=>{ const c=LT.st(); c.round++; c.day=S.day; S.stones+=150; S.flags.c3_lt_tang=true; save();
  UI.say([['旁白','（第二轮，胜。苏小棠认输。灵石 +150。）'],['旁白','台下嗡的一声。有人喊「让的！」，有人喊「药王谷没人了！」'],
    ['苏小棠','（她跳下擂台，跑到你身边，小声说）……我一点都不难过。真的。'],{love:{tang:40}}],()=>{ UI.hud(); LT.evening('tang'); }); };

/* ---------- the evening: the loser goes "home" ---------- */
LT.evening=id=>{ const c=LT.st(), [x,y]=SF_WING[S.sect];
  C3.move('jc_sifang',x+3,y+4,'up',19,()=>setTimeout(()=>UI.say(LT.night(id),()=>{ UI.hud(); Story.check(); }),500)); };
LT.night=id=>{ const nm=KM.NAME[id].replace(/（.*/,''), c=LT.st();
  if(id==='tang') return [
    ['旁白','天黑了。四方馆门口停着一辆礼部的马车，黑篷，没有灯。'],
    ['礼部小吏','（他翻着册子）药王谷，苏小棠——败。按规矩，今夜送回宗门。'],
    ['我','她不走。'],
    ['苏小棠','（她拽住你的袖子）我……我想看完决赛再走。行吗？'],
    ['旁白','小吏皱着眉头翻册子，翻到某一页，手指停住了。'],
    ['礼部小吏','……苏姑娘可以留下。'],
    ['礼部小吏','萧大人吩咐过的。'],
    ['苏小棠','（她一脸茫然）萧大人？我不认识什么萧大人啊……'],
    ['我','（……）'],
    ['旁白','那辆马车在门口等了一会儿，空着走了。'],
    {flag:'c3_lt_n2'}];
  if(c.round>=4) return [
    ['旁白','那天夜里，四方馆的院子里点满了灯。可是院子空了一大半。'],
    ['旁白','四宗来的弟子，一个一个都「送回宗门」了。'],
    ['苏小棠','（她抱着膝盖坐在台阶上）……{名}，你说，他们到家了吗？'],
    ['谢霁月','（她看着门外黑漆漆的街）明天，给宗门写封信。问问。'],
    {flag:'c3_lt_done'}];
  return [
    ['旁白','天黑了。四方馆门口停着一辆礼部的马车，黑篷，没有灯。'],
    ['旁白',`${nm}背着包袱上了车。礼部小吏在册子上勾了一笔：「败者，今夜送回宗门。」`],
    ...(id==='sf_cheng'||id==='sf_bu'?[['旁白',`${nm}从车窗里探出头，冲你挥了挥手。`]]:[['旁白',`${nm}上车之前，回头看了你一眼，点了点头。`]]),
    ['旁白','马车没有往城门的方向走。它往东拐了，拐进了一条你不认识的街。'],
    ['谢霁月','（她站在门口，看着马车走远）……送回宗门，为什么要连夜送？'],
    {flag:'c3_lt_n'+c.round},
    ['旁白',`（明日：${LT.ROUND[c.round]}。回厢房睡觉。）`]]; };

/* ---------- the final: 魁首 ---------- */
LT.crown=()=>[
  ['礼部尚书','（他的声音在广场上回荡）四宗大比——'],
  ['礼部尚书',`魁首：${sectName()}，${S.name}！`],
  ['旁白','鼓响了。广场上一下子炸开了锅。'],
  ['苏小棠','（她在台下又跳又叫，眼泪鼻涕一起流）{名}——！'],
  ['谢霁月','（她站在人群里，没有喊，只是看着你。过了很久，轻轻点了一下头）'],
  ['旁白','你抬起头。高台上，萧烬站在天子身边，看着你。'],
  ['旁白','他拍了两下手。'],
  ['旁白','然后他身后的阴影里，那张青铜面具，也慢慢地转向了你。'],
  {run:()=>{ S.flags.c3_kuishou=true; perk('atk',5,'四宗大比魁首：攻击 +5'); }},
  ['旁白','（你是这一届四宗大比的魁首。）']];

/* ---------- hooks: the 擂台 on the square, 苏小棠 talking, the quests ---------- */
KM.TALK.sf_cheng=[['程小剑','明天就要上台了……我腿都软了。']]; KM.TALK.sf_bu=[['卜小鱼','我算过了。'],['卜小鱼','……不告诉你。']];
{ const q=QUESTS.find(q=>q.id==='c3l'); Object.assign(q,{check:s=>!!s.flags.c3_kuishou,
    progress:s=>{ const c=LT.st(); if(c.round>=4) return '魁首'; const nm=KM.NAME[LT.opp()].replace(/（.*/,'');
      return c.day===S.day?`今天的比完了：回厢房睡觉（明日${LT.ROUND[c.round]}，对${nm}）`:`${LT.ROUND[c.round]}：对${nm}${s.flags.c3_lt_lost?'（输了不要紧，练好了再上）':''}`; },
    target:s=>{ const c=LT.st(), [x,y]=SF_WING[s.sect]; return c.day===S.day?['jc_sifang',x+3,y+3,'你们的厢房']:['jc_gongyuan',14,14,'擂台']; }}); }
QUESTS.splice(QUESTS.findIndex(q=>q.id==='c3l')+1,0,
  {id:'c3m', title:'宗门来信', desc:'你是四宗大比的魁首。可每天夜里，礼部的马车都往东拐。', check:s=>false,
    progress:s=>'（之后的剧情正在做）', target:s=>['jc_sifang',12,10,'大师姐']});

// whoever lost and was "sent home" is gone from 四方馆 and the square (苏小棠 stays)
LT.gone=id=>{ const c=S&&S.c3&&S.c3.km; if(!c||!c.bracket||id==='tang') return false; const i=c.bracket.indexOf(id); return i>=0&&i<(c.round||0); };
for(const m of ['jc_sifang','jc_gongyuan']) for(const o of MAPS[m].objects) if(['sf_cheng','sf_bu','sf_lin','sf_wulan','sf_wenxuan'].includes(o.id)){ const c0=o.cond; o.cond=s=>(!c0||c0(s))&&!LT.gone(o.id); }
