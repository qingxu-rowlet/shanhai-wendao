/* ============================================================
   山海问道 · 第三章「京城」 · 第二幕 · 四方馆 — the 礼部's clerk writes you into the register (and looks twice at 大师姐);
   the other sects' entrants are in the yard: 林沧 of 青云剑宗 (the fastest sword of his generation, and knows it), 乌兰 of
   万兽谷 and her 狌狌 阿毛 (who smells wolf on you), 温玄 of 天机阁 (whose coins say something is eating the stars);
   苏小棠 is here for 药王谷, whatever your sect. Toward evening 大师姐, under the 槐树, says why she was first last time:
   she was a realm above everyone. Ten days to the 大比 — 结丹. 苏小棠 has 药尘长老's recipe: 龙血竭 (西市), 千年石钟乳
   (回春堂), 九转还魂草 (only at the auction). The curfew drum sounds; you sleep in your sect's wing.
   ============================================================ */
const SF={
  st(){ const c=C3.st(); c.met=c.met||[]; return c; },
  met(id){ const c=SF.st(); if(!c.met.includes(id)) c.met.push(id); },
  rivals:()=>['sf_lin','sf_wulan','sf_wenxuan'].filter(id=>{ const o=MAPS.jc_sifang.objects.find(o=>o.id===id); return !o.cond||o.cond(S); }),
  ready:()=>!!S.flags.c3_sf_tang&&SF.st().met.filter(id=>SF.rivals().includes(id)).length>=Math.min(2,SF.rivals().length),
  wing:()=>SF_WING[S.sect],
};
// your own wing's door is your room: sleep there; elsewhere a word about whose it is
On.act('sfroom',o=>{ if(S.flags.c3_xf_in&&XF.door(o)) return; if(o.sect!==S.sect) return UI.say([['旁白',`${SECTS[o.sect].name}的厢房。门关着，里面有人在低声说话。`]]);
  if(S.flags.c3_jd_done&&!S.flags.c3_xj_met) return XX.room();
  if(!S.flags.c3_sf_recipe) return UI.say([['旁白','你们的厢房。被褥是新晒过的，有一股太阳的味道。'],['旁白','（天还没黑。先在院子里走走。）']]);
  UI.confirm('回厢房睡觉？', ()=>sleep(false)); });
On.wake((passedOut,from)=>{ if(!String(from).startsWith('jc_')) return false; const [x,y]=SF.wing(); enterMap('jc_sifang',x+3,y+3); RT.dir='down'; UI.hud(); save();
  if(S.flags.c3_sf_recipe&&!S.flags.c3_sf_morning){ S.flags.c3_sf_morning=true; setTimeout(()=>UI.say(SF.morning(),()=>{ UI.hud(); Story.check(); }),900); } return true; });
On.act('sfhall',o=>UI.say([['旁白','四方馆的正厅。案上摊着一本厚厚的名册，四宗弟子的名字一行一行写在上面。'],['旁白','墙上挂着一幅字：「四方来贺」。']]));
On.act('sftree',o=>UI.say([['旁白','一棵老槐树，树干要两个人才抱得过来。'],['旁白','树上开着一串一串的小白花，风一吹，落了一地。']]));
On.act('sfchess',o=>UI.say([['旁白','石桌上画着棋盘，黑子白子下了半盘。'],['旁白','看样子，白子要输了。']]));
On.act('sfpet',o=>UI.say([['旁白','一只白耳朵的狌狌，蹲在乌兰脚边，正歪着头看你。'],['旁白','它冲你嗅了嗅，忽然往后一缩。']]));
On.act('sffuton',o=>S.flags.c3_dan_done?JD.futon():UI.say(S.flags.c3_sf_recipe?[['旁白','后院僻静，一块太湖石，一个蒲团。'],['旁白','（等结丹丹炼好了，就在这里闭关。）']]:[['旁白','后院僻静，一块太湖石，一个蒲团。没有人来。']]));

/* ---------- arriving ---------- */
On.enter(id=>{ if(id==='jc_sifang'&&!S.flags.c3_sf_in) setTimeout(()=>{ if(RT.mapId==='jc_sifang'&&!S.flags.c3_sf_in) UI.say(SF.arrive(),()=>{ UI.hud(); Story.check(); }); },500); });
SF.arrive=()=>{ const sn=SECTS[S.sect].name, w=S.sect==='jian'||S.sect==='dan'?'西':'东'; return [
  ['旁白','四方馆是礼部给四宗弟子安排的住处。一进门，是一个四四方方的大院子，一棵老槐树开得正好。'],
  ['礼部小吏','（他从正厅里迎出来，手里捧着一本名册）哪个宗门的？'],
  ['谢霁月',`${sn}。谢霁月，${S.name}。`],
  ['礼部小吏',`${sn}……${w}厢。`],
  ['旁白','他提笔写名字，写到「谢霁月」三个字时，笔尖停了一下，抬头看了大师姐一眼。'],
  ['礼部小吏','……上一届的魁首。久仰。'],
  ['旁白','他的语气很客气。可那一眼，和城门口那个守城兵一模一样。'],
  ['礼部小吏','馆里有规矩：天黑以后，不许出馆门。萧大人的令。'],
  ['谢霁月','……知道了。'],
  {flag:'c3_sf_in'},
  ['旁白','（四宗的弟子都住在这里。在院子里走走，见见别的宗门的人。）'],
  ...(S.sect==='dan'?[]:[['旁白','（药王谷的厢房在西南边。）']])]; };

/* ---------- 苏小棠 ---------- */
SF.tangMeet=()=>S.sect==='dan'?[
  ['苏小棠','{名}，我们的屋子在这边！'],
  ['苏小棠','我刚才去看过了，隔壁住的是天机阁的人。神神秘秘的，一直在屋里摇铜钱……'],
  ['苏小棠','（她压低声音）还有万兽谷那个姐姐，带了一只猴子！会作揖的！'],
  {flag:'c3_sf_tang'}]:[
  ['苏小棠','{名}——！'],
  ['旁白','她从药王谷的厢房里冲出来，差点撞翻门口的花盆。'],
  ['苏小棠',`我就知道你会来！长老说${SECTS[S.sect].name}派的是谢师姐，还有一个新弟子——我一猜就是你！`],
  ['苏小棠','我们药王谷就来了我一个。长老说，让我来见见世面。'],
  ['苏小棠','……'],
  ['苏小棠','其实，我是想来看你比武的。'],
  {love:{tang:30}},{flag:'c3_sf_tang'}];
SF.recipe=()=>[
  ['苏小棠','结丹丹？'],
  ['苏小棠','（她眼睛一下子亮了）我带了！长老的方子，我偷偷抄了一份，就压在枕头底下！'],
  ['旁白','她跑回厢房，拿出一张折得方方正正的纸。'],
  ['苏小棠','三味主药。'],
  ['苏小棠','「龙血竭」——西市的药材行就有。'],
  ['苏小棠','「千年石钟乳」——要那种一滴一滴，滴了一千年的。回春堂兴许有，就是贵。'],
  ['苏小棠','还有一味最难的……「九转还魂草」。'],
  ['苏小棠','这个我只在书上见过。京城里，只有拍卖会上才可能有。'],
  ['苏小棠','药材凑齐了，我帮你炼！我看火候，可准了。'],
  {give:{c3_recipe:1}},{flag:'c3_sf_recipe'},
  ['旁白','外面传来一声梆子响。天黑了。'],
  ['苏小棠','宵禁了……{名}，快回去睡吧。明天，我陪你去西市！']];
Object.assign(ITEMS,{c3_recipe:{name:'结丹丹方', icon:'i_slip', quest:true, keep:true, desc:'苏小棠从药尘长老那里抄来的结丹丹方。三味主药：龙血竭（西市药材行）、千年石钟乳（回春堂）、九转还魂草（拍卖会）。'}});

/* ---------- 大师姐 under the 槐树: 结丹 ---------- */
SF.jiedan=()=>{ const R=SF.rivals(), who={sf_lin:['谢霁月','林沧。剑宗这一辈里最快的剑。他自己也知道。'], sf_wulan:['谢霁月','乌兰。带着灵兽上台，一个人当两个人用。'], sf_wenxuan:['谢霁月','温玄……天机阁的人，你永远不知道他们在算什么。']}; return [
  ['旁白','天快黑了。大师姐坐在槐树底下，剑横在膝上。槐花落在她的剑鞘上。'],
  ['谢霁月','都见过了？'],
  ...R.map(id=>who[id]),
  ['谢霁月','他们都是筑基后期。和你一样。'],
  ['谢霁月','上一回我能拿头名，不是因为我的剑比别人快。'],
  ['谢霁月','是因为那时候，我已经比他们高一个境界。'],
  ['我','……结丹？'],
  ['谢霁月','离大比还有十天。够了。'],
  ['谢霁月','结丹丹的方子，药王谷有。'],
  ['谢霁月',S.sect==='dan'?'你那位同门小师妹，应该知道。':'你那位小棠姑娘，应该知道。'],
  {flag:'c3_sf_jiedan'}]; };
SF.morning=()=>[
  ['旁白','天亮了。槐花落了一院子。'],
  ['苏小棠','{名}！西市一早就开了，我们走吧！'],
  ['谢霁月','我在馆里等你。'],
  ['旁白','（西市在四方馆门外的街上，往西走。）']];

/* ---------- talking in the yard ---------- */
SF.TALK={
  sf_clerk:()=>S.flags.c3_sf_in?[['礼部小吏','大比三月十五开擂，在贡院前头。到时候礼部会来馆里接人。'],['礼部小吏','天黑以后，别出馆门。']]:[['礼部小吏','……']],
  sf_lin:()=>[['林沧','（他靠着廊柱，抱着剑，眼皮都没抬）……你就是谢霁月的师弟妹？'],['林沧','我听说，你们那位大师兄，叫一只妖兽给吃了。'],['林沧','……可惜。我本来想在擂台上会会他。'],['林沧','大比上见。我的剑，不会等你。']],
  sf_cheng:()=>[['程小剑','（他盯着棋盘，额头冒汗）师兄说，这一局要是输了，罚我扎三天马步……'],...(KB.present('sf_bu')?[['卜小鱼','（对面的小姑娘笑眯眯地落了一子）你已经输了。']]:[['旁白','对面一个别宗的弟子笑眯眯地落了一子。程小剑的脸更白了。']])],
  sf_wulan:()=>[['乌兰','哈！你就是谢霁月的师弟妹？长得倒是挺顺眼！'],['乌兰','我叫乌兰，万兽谷的。这是阿毛。'],['旁白','她脚边的狌狌冲你嗅了嗅，忽然往她身后一缩，龇了龇牙。'],['乌兰','咦？阿毛怕你？'],['乌兰','（她凑过来闻了闻，皱起眉头）……你身上，怎么有一股狼的味道？'],['乌兰','你在路上，见过狼？']],
  sf_wenxuan:()=>[['温玄','（他在指尖转着三枚铜钱，没有抬头）……你今天，不宜出门。'],['温玄','玩笑话。'],['温玄','不过，最近京城的卦，确实很乱。'],['旁白','他把三枚铜钱往桌上一撒。'],['温玄','……又是这一卦。'],['温玄','像是有什么东西，在一颗一颗地，吃星星。']],
  sf_bu:()=>[['卜小鱼','嘘——我在算这一步。'],['卜小鱼','……好啦，算完了。他输了。']],
};
JC.CHAT=Object.assign(JC.CHAT,{sf_clerk:['名册……名册……'], sf_lin:['……'], sf_cheng:['这步……这步怎么走……'], sf_wulan:['阿毛，别乱跑！'], sf_wenxuan:['……又是这一卦。'], sf_bu:['你输啦～']});
On.talk(id=>{ if(RT.mapId!=='jc_sifang') return false; const F=S.flags;
  if(F.c3_xf_in&&XF.talk(id)) return true;
  if((id==='xie'||id==='tang')&&F.c3_km_done&&!F.c3_lt_done){ C3.menu(id,KM.day(id)); return true; }
  if(id==='tang'&&F.c3_ju_won&&!F.c3_dan_done){ DAN.talk(); return true; }
  if(id==='tang'){ if(!F.c3_sf_tang){ UI.say(SF.tangMeet(),()=>{ UI.hud(); Story.check(); }); return true; }
    if(F.c3_sf_jiedan&&!F.c3_sf_recipe){ UI.say(SF.recipe(),()=>{ UI.hud(); Story.check(); }); return true; }
    C3.menu('tang',F.c3_sf_recipe?[['苏小棠','龙血竭、石钟乳、九转还魂草……我都背下来啦！']]:[['苏小棠','京城的槐花，可以入药的。清热、凉血……'],['苏小棠','……你看我干什么。']]); return true; }
  if(id==='xie'&&F.c3_hc_ru&&!F.c3_ju_pool){ UI.say(JU.pool(),()=>{ UI.hud(); Story.check(); }); return true; }
  if(id==='xie'){ if(SF.ready()&&!F.c3_sf_jiedan){ UI.say(SF.jiedan(),()=>{ UI.hud(); Story.check(); }); return true; }
    C3.menu('xie',F.c3_sf_jiedan?[['谢霁月','去找苏小棠。']]:F.c3_sf_in?[['谢霁月','去见见他们。将来在擂台上，你会一个一个遇到。']]:[['谢霁月','……']]); return true; }
  if(DS.IDS.includes(id)&&F.c3_sf_in&&SF.st().met.includes(id)){ DS.menu(id); return true; }   // once met: talk, chat, gifts, 切磋, a favour
  const L=SF.TALK[id]; if(!L) return false; SF.met(id); UI.say(L(),()=>{ UI.hud(); Story.check(); }); return true; });
On.theme(id=>id==='jc_sifang'?'calm':null);
{ const _d=Portal.dests; Portal.dests=function(){ const l=_d.call(Portal); if(S.flags.c3_sf_in&&RT.mapId!=='jc_sifang') l.push({name:'京城 · 四方馆', map:'jc_sifang', x:15, y:19}); return l; }; }

/* ---------- the quests ---------- */
{ const q=QUESTS.find(q=>q.id==='c3e'); Object.assign(q,{check:s=>!!s.flags.c3_sf_in,
    progress:s=>!s.flags.c3_jc_board?'看看十字街口的告示':'去四方馆（十字街往西）',
    target:s=>!s.flags.c3_jc_board?['jc_zhuque',19,14,'十字街口的告示']:(RT.mapId==='jc_sifang'?['jc_sifang',15,20,'四方馆']:['jc_zhuque',1,14,'往西的十字街'])}); }
QUESTS.push(
  {id:'c3f', title:'四方馆', desc:'四宗弟子都住在四方馆。将来在擂台上，会一个一个遇到。', check:s=>!!s.flags.c3_sf_recipe,
    progress:s=>{ const F=s.flags, n=(s.c3&&s.c3.met||[]).filter(id=>SF.rivals().includes(id)).length, need=Math.min(2,SF.rivals().length);
      return !F.c3_sf_tang?'找苏小棠（药王谷的厢房）':n<need?`见见别的宗门的人 ${n}/${need}`:!F.c3_sf_jiedan?'大师姐在槐树底下':'问苏小棠要结丹丹方'; },
    target:s=>{ const F=s.flags; if(!F.c3_sf_tang) return ['jc_sifang',8,13,'苏小棠'];
      if(!SF.ready()){ const id=SF.rivals().find(id=>!(s.c3&&s.c3.met||[]).includes(id)); const o=MAPS.jc_sifang.objects.find(o=>o.id===id); return o?['jc_sifang',o.x,o.y+1,o.name]:null; }
      return !F.c3_sf_jiedan?['jc_sifang',12,10,'大师姐']:['jc_sifang',8,13,'苏小棠']; }},
  {id:'c3g', title:'结丹 · 凑药材', desc:'离大比还有十天。凑齐结丹丹的三味主药：龙血竭（西市药材行）、千年石钟乳（回春堂）、九转还魂草（拍卖会）。', check:s=>false,
    progress:s=>!s.flags.c3_sf_morning?'宵禁了，回自己宗门的厢房睡觉':'去西市（四方馆门外往西，下一张地图）',
    target:s=>{ const [x,y]=SF_WING[s.sect]; return !s.flags.c3_sf_morning?['jc_sifang',x+3,y+3,'你们的厢房']:['jc_sifang',2,23,'往西的街']; }});
// the order: c3f and c3g come after c3e
{ const ids=QUESTS.map(q=>q.id), e=ids.indexOf('c3e'); for(const id of ['c3g','c3f']){ const i=QUESTS.findIndex(q=>q.id===id); const [q]=QUESTS.splice(i,1); QUESTS.splice(e+1,0,q); } }
