/* ============================================================
   山海问道 · 第三章 · 京城日常 — so the days in the capital have something in them:
   - shops that sell things to give: 野山茶 at the 花铺, 桃花酿 at 醉仙居, and new — a 绣帕 (cloth stall), a 玉簪 (trinket
     stall), 桂花糕 (东市 小吃铺), 明前茶 (the river's tea stall), an old book (西市's book stall). Everyone you can give to
     has a taste among them.
   - work for 灵石, once a day each: 抓药 for 孙大夫 at 回春堂, copying books for the 琅琊阁's keeper.
   - the other sects' entrants at 四方馆: talk, chat, gifts and hearts, a 切磋 a day, and one favour each (程小剑's tassel
     the 八哥 at 西市 ran off with; 乌兰's 阿毛 loose in 东市 after the sweets; 温玄's three old coins from the antique
     seller; 卜小鱼's 糖人; 林沧 wants only to cross swords).
   ============================================================ */
const DAY3={ st(){ const c=C3.st(); c.d3=c.d3||{job:{}, spar:{}, fav:{}}; return c.d3; } };

/* ---------- things to buy, and who likes what ---------- */
Object.assign(ITEMS,{
  jc_pa:{name:'绣帕', icon:'i_flower', sell:12, desc:'锦绣布庄出的绣帕，一角绣着一枝兰草。'},
  jc_zan:{name:'玉簪', icon:'i_slip', sell:30, desc:'首饰摊上的白玉簪子，簪头雕成一朵小小的玉兰。'},
  jc_gao:{name:'桂花糕', icon:'i_zhuguo', sell:6, desc:'东市小吃铺的桂花糕，一层一层的，甜得不腻。'},
  jc_tea:{name:'明前茶', icon:'i_lingcao', sell:15, desc:'护城河边茶摊的明前茶，一小包，闻着有豆香。'},
  jc_oldbook:{name:'旧书', icon:'i_book', sell:4, desc:'西市旧书摊上淘来的一本旧书，书页发黄，有人在空白处写满了批注。'},
});
const SHOP3={
  sell(who,items){ UI.say([{choice:`${who}　（你有 ${S.stones} 灵石）`, options:[...items.map(([id,p])=>({text:`${ITEMS[id].name}　${p} 灵石`, fn:()=>{ if(S.stones<p) return UI.say([['旁白',`灵石不够了。（要 ${p}）`]]); S.stones-=p; addItem(id,1); Sound.coin(); UI.hud(); save(); UI.toast(`买了${ITEMS[id].name}`); }})),{text:'不买了', fn:()=>{}}]}]); },
  // which stall sells what: [map, act, which] -> [who, [[item, price]...]]
  stall(o){ const k=RT.mapId+':'+o.act+':'+(o.si!=null?o.si:o.id||''), L={
      'jc_zhuque:jcstall:0':['布摊',[['jc_pa',25]]], 'jc_zhuque:jcstall:1':['首饰摊',[['jc_zan',60]]],
      'jc_zhuque:jcshop:jiulou':['醉仙居',[['wine',40]]],
      'jc_dongkou:zyflower:':['花铺',[['flower',15]]], 'jc_dongkou:zytea:':['茶摊',[['jc_tea',30]]],
      'jc_dongshi:dsshop:eat':['小吃铺',[['jc_gao',12],['jc_bao',5]]], 'jc_xishi:xsstall:0':['旧书摊',[['jc_oldbook',8]]],
    }[k]; if(!L) return false; SHOP3.sell(L[0],L[1]); return true; },
};
// tastes: the people you can give to in the capital
NPCS.xie.likes.push('jc_zan','jc_tea'); NPCS.xie.hates.push('jc_gao');
NPCS.tang.likes.push('jc_gao','jc_pa'); NPCS.tang.loves.push('jc_tangren');
NPCS.xiao.likes.push('jc_gao','jc_oldbook');
NPCS.qinghe.loves=['jc_pa']; NPCS.qinghe.likes=['jc_tea','jc_tangren','wine']; NPCS.qinghe.hates=['flower'];   // 「花会谢」
Object.assign(NPCS,{
  sf_lin:{name:'林沧', loves:['wine'], likes:['jc_tea','jc_zan'], hates:['jc_tangren','flower']},
  sf_wulan:{name:'乌兰', loves:['jc_bao'], likes:['jc_hulu','jc_gao','wine'], hates:['jc_oldbook']},
  sf_wenxuan:{name:'温玄', loves:['jc_oldbook'], likes:['jc_tea'], hates:['wine']},
  sf_cheng:{name:'程小剑', loves:['jc_gao'], likes:['jc_bao','jc_hulu'], hates:['jc_tea']},
  sf_bu:{name:'卜小鱼', loves:['jc_tangren'], likes:['jc_hulu','jc_gao','flower'], hates:['jc_oldbook']},
});
Object.assign(TALK,{
  sf_lin:[['……','（他在擦剑）'],['你的身手，有点意思。','……明天再来。'],['剑宗的规矩：剑不离身。睡觉也是。','你出手的时候，会先看对方的眼睛。别看眼睛，看肩膀。'],['我在剑宗，没有朋友。','……你算一个。']],
  sf_wulan:[['阿毛！别偷吃！','你会骑马吗？万兽谷的人，三岁就会骑狼。'],['京城的包子，比谷里的小！','阿毛说你身上的狼味淡了一点。'],['我阿爸说，京城的人心眼多。','可你不一样。'],['以后来万兽谷，我带你去看狼王。','阿毛已经不怕你了，你看。']],
  sf_wenxuan:[['……今日宜静坐。','你想算一卦吗？……不算也好。'],['天机阁的人，算得出别人，算不出自己。','卦象是死的。人是活的。'],['我算过你的命。','……卦象很乱。乱得很好看。'],['等大比完了，我想去北边看看。','那边的星星，少了好多颗。']],
  sf_cheng:[['师兄说我练剑不用心……','你说，剑穗是不是越长越好看？'],['我、我昨天站桩站了两个时辰！','你比我师兄还厉害吗？'],['以后我要当剑宗最快的剑！','……第二快也行。'],['你教我一招好不好？','就一招！']],
  sf_bu:[['我算到你今天会来。','嘘——我在算这一步。'],['糖人是天底下最好吃的东西。','我算过，下雨天吃糖人最甜。'],['温师兄老说我算得不准。','可我算你，从来没错过。'],['你知道吗，卦象里有你。','……我不告诉你是什么卦。']],
});
Object.assign(GIFT_LINES.love,{xiao:'（他接过去，看了很久）……没有人送过我东西。', qinghe:'（她把东西捧在手心里，笑了）……你怎么知道的。', sf_lin:'……好东西。（他难得地点了点头）', sf_wulan:'哈！你最好了！', sf_wenxuan:'（他愣了一下）……卦象里没算到这个。', sf_cheng:'给我的？！谢谢谢谢！', sf_bu:'我就知道你会送这个！我算到了！'});
Object.assign(GIFT_LINES.like,{xiao:'……嗯。收下了。', qinghe:'有心了。', sf_lin:'嗯。', sf_wulan:'谢啦！', sf_wenxuan:'多谢。', sf_cheng:'嘿嘿，谢谢！', sf_bu:'谢谢～'});
Object.assign(GIFT_LINES.neutral,{xiao:'……', qinghe:'谢谢。', sf_lin:'……放那儿吧。', sf_wulan:'嗯？这是什么？', sf_wenxuan:'嗯。', sf_cheng:'哦……谢谢。', sf_bu:'嗯……'});
Object.assign(GIFT_LINES.hate,{xiao:'（他没有接）……你自己留着。', qinghe:'（她笑了笑，推了回来）这个……我收不得。', sf_lin:'拿走。', sf_wulan:'咦——阿毛都不吃这个！', sf_wenxuan:'……这个，我不碰。', sf_cheng:'呃……我不太喜欢这个……', sf_bu:'哼，我不要。'});

/* ---------- 回春堂: 抓药 for 孙大夫, once a day ---------- */
const JOB={
  RX:[
    {name:'四君子汤', need:['人参','白术','茯苓'], wrong:['附子','大黄','麻黄']},
    {name:'银翘散', need:['金银花','连翘','薄荷'], wrong:['肉桂','干姜','鹿茸']},
    {name:'酸枣仁汤', need:['酸枣仁','茯神','远志'], wrong:['黄连','巴豆','麻黄']},
    {name:'麻黄汤', need:['麻黄','桂枝','杏仁'], wrong:['黄连','石膏','熟地']},
    {name:'六味地黄丸', need:['熟地','山药','山茱萸'], wrong:['麻黄','巴豆','附子']},
    {name:'藿香正气散', need:['藿香','紫苏','白芷'], wrong:['熟地','鹿茸','人参']},
  ],
  zhua(){ const d=DAY3.st(); if(d.job.zhua===S.day) return UI.say([['孙大夫','今天的药都抓完了。明天再来吧。']]);
    const rx=JOB.RX[(S.day*7+3)%JOB.RX.length], left=[...rx.need]; let miss=0; d.job.zhua=S.day; save();
    const pick=()=>{ const R=rng(S.day*31+left.length*7+miss), opts=[...left.slice(0,2),...rx.wrong].sort(()=>R()-.5).slice(0,4); if(!opts.some(n=>left.includes(n))) opts[0]=left[0];
      UI.say([{choice:`《${rx.name}》　还差 ${left.length} 味`, options:opts.map(n=>({text:`拉开「${n}」那一格`, fn:()=>{ if(left.includes(n)){ left.splice(left.indexOf(n),1); Sound.coin&&Sound.coin(); return left.length?pick():done(); } miss++; UI.say([['小学徒','（他小声提醒）……不是这一格。']],pick); }}))}]); };
    const done=()=>{ const pay=Math.max(20,80-miss*20); S.stones+=pay; UI.hud(); save(); UI.say([['孙大夫',miss?'嗯，还行。':'一味不错。好手。'],['旁白',`（工钱：${pay} 灵石。）`]]); };
    UI.say([['孙大夫','今天人多。帮老夫抓一副——'],['孙大夫',`《${rx.name}》：${rx.need.join('、')}。`]],pick); },
  // 琅琊阁: copying a 功法 out fair; pick the right character where the old hand is hard to read
  COPY:[{word:'知己',ans:'己',opts:['已','己','巳']},{word:'戊戌',ans:'戌',opts:['戍','戌','戊']},{word:'未来',ans:'未',opts:['末','未']},{word:'斥候',ans:'斥',opts:['斤','斥']},
    {word:'辨别',ans:'辨',opts:['辩','辨','辫']},{word:'毫末',ans:'末',opts:['末','未']},{word:'刺客',ans:'刺',opts:['剌','刺']},{word:'候补',ans:'候',opts:['侯','候']}],
  copy(){ const d=DAY3.st(); if(d.job.copy===S.day) return UI.say([['琅琊阁主','今天的抄完了。明天再来。']]);
    d.job.copy=S.day; save(); const R=rng(S.day*13+5), qs=[...JOB.COPY].sort(()=>R()-.5).slice(0,3); let right=0, i=0;
    const ask=()=>{ if(i>=qs.length){ const pay=right*25+(right===3?15:0); S.stones+=pay; UI.hud(); save(); return UI.say([['琅琊阁主',right===3?'（他把纸凑到眼前看了半天）……一个错字都没有。':right?'错了几个。凑合。':'……你还是去看书吧。'],['旁白',`（工钱：${pay} 灵石。）`]]); }
      const q=qs[i++]; UI.say([['旁白',`原稿上写着「${q.word}」，墨迹晕开了一半。`],{choice:`「${q.word.replace(q.ans,'□')}」里的□是：`, options:q.opts.map(o=>({text:o, fn:()=>{ if(o===q.ans) right++; ask(); }}))}]); };
    UI.say([['琅琊阁主','（他把一摞旧稿推过来）抄。抄错一个字，扣钱。']],ask); },
};

/* ---------- the other sects' entrants ---------- */
const DS={
  IDS:['sf_lin','sf_wulan','sf_wenxuan','sf_cheng','sf_bu'],
  // the favours: what they ask, whether it's done, what they say when it is
  FAV:{
    sf_cheng:{ask:[['程小剑','（他快哭了）我师兄送的剑穗……昨天在西市，被一只八哥叼走了！'],['程小剑','那是师兄自己编的……要是让他知道……']], have:()=>count(S,'c3_suizi'), item:'c3_suizi',
      done:[['程小剑','（他抱着剑穗，又哭又笑）找回来了！找回来了！'],['程小剑','你是我见过最好的人！']]},
    sf_wulan:{ask:[['乌兰','阿毛一早就不见了！它最爱吃甜的……'],['乌兰','它要是跑去东市偷糖人，会被打死的！']], have:()=>DAY3.st().fav.amao==='found',
      done:[['旁白','阿毛一看见乌兰，「嗖」地跳进她怀里。'],['乌兰','（她抱着阿毛又亲又骂）你个小馋鬼！'],['乌兰','谢谢你！以后你就是万兽谷的朋友！']]},
    sf_wenxuan:{ask:[['温玄','能帮我一个忙吗？'],['温玄','西市古董贩子那儿，有三枚前朝的旧铜钱。我的铜钱……用得太久，不灵了。']], have:()=>count(S,'c3_coins'), item:'c3_coins',
      done:[['温玄','（他把三枚铜钱抛起来，接住，看了一眼）……灵。'],['温玄','谢礼——我替你算一卦。'],['温玄','……你会被一个不是人养大的人，放在心上。'],['温玄','（他收起铜钱）卦象是这么说的。我也不懂。']]},
    sf_bu:{ask:[['卜小鱼','我算到了，你今天会给我买糖人。'],['卜小鱼','……东市的。小老虎的那种。']], have:()=>count(S,'jc_tangren'), item:'jc_tangren',
      done:[['卜小鱼','（她举着糖人，左看右看，舍不得吃）……我算得准吧！']]},
  },
  menu(id){ const n=NPCS[id], h=Social.hearts(id), d=DAY3.st(), f=DS.FAV[id], fs=d.fav[id];
    const opts=[{text:'说说话', fn:()=>UI.say(SF.TALK[id]())},{text:'聊天', fn:()=>Social.chat(id)},{text:'送礼', fn:()=>Social.giftPick(id)}];
    if(f&&fs!=='done') opts.push({text:fs==='asked'?(f.have()?'交给他／她':'（还在找）'):'有什么要帮忙的？', fn:()=>DS.favour(id)});
    if(!LT.gone(id)&&d.spar[id]!==S.day) opts.push({text:'切磋一下', fn:()=>DS.spar(id)});
    opts.push({text:'离开', fn:()=>{}});
    UI.say([{choice:`${n.name}　${'♥'.repeat(h)}${'♡'.repeat(Math.max(0,8-h))}${Social.rel(id).gifted===S.day?'　（今天已送过礼）':''}`, options:opts}]); },
  favour(id){ const d=DAY3.st(), f=DS.FAV[id], fs=d.fav[id];
    if(!fs){ d.fav[id]='asked'; if(id==='sf_wulan') d.fav.amao='lost'; save(); return UI.say(f.ask,()=>{ UI.hud(); }); }
    if(!f.have()) return UI.say([[NPCS[id].name,'……还没找到吗？']]);
    if(f.item) addItem(f.item,-1); d.fav[id]='done'; S.stones+=40; Social.add(id,80); save(); UI.say([...f.done,['旁白','（好感 +80，灵石 +40。）']],()=>UI.hud()); },
  spar(id){ const d=DAY3.st(); d.spar[id]=S.day; save();
    UI.say([[NPCS[id].name,{sf_lin:'（他已经拔出了剑）……来。',sf_wulan:'好啊！阿毛，上！',sf_wenxuan:'点到为止。',sf_cheng:'请、请指教！',sf_bu:'我算过了，我会输。不过来吧！'}[id]]],
      ()=>Battle.start('c3r_'+id,r=>{ if(r!=='win'){ S.hp=Math.max(1,Math.round(stats().hp*.5)); UI.hud(); return UI.say([[NPCS[id].name,'承让。'],['旁白','（明天再来。）']]); }
        S.stones+=50; Social.add(id,30); UI.hud(); save(); UI.say([[NPCS[id].name,{sf_lin:'……又快了。下回，我不会输。',sf_wulan:'哈！痛快！',sf_wenxuan:'（他收起铜钱）……你，我算不准。',sf_cheng:'你、你好厉害……',sf_bu:'看吧，我算得多准。'}[id]],['旁白','（切磋胜。灵石 +50，好感 +30。）']]); })); },
};
Object.assign(ITEMS,{c3_suizi:{name:'剑穗', icon:'i_slip', quest:true, keep:true, desc:'程小剑的剑穗，他师兄亲手编的。被西市的八哥叼走了，又吐了出来。'},
  c3_coins:{name:'前朝铜钱', icon:'i_slip', quest:true, keep:true, desc:'三枚前朝的旧铜钱，磨得发亮。温玄要的。'}});
// 西市: the 八哥 has the tassel; the antique seller has the coins
{ const b=XS.TALK.xs_bird, g=XS.TALK.xs_gu;
  XS.TALK.xs_bird=()=>DAY3.st().fav.sf_cheng==='asked'&&!count(S,'c3_suizi')?[['鸟贩','剑穗？（他看了一眼笼子里的八哥）……这畜生，昨天叼回来一个。'],['旁白','八哥歪着头看你，「呸」地吐出一个剑穗。'],{give:{c3_suizi:1}},['旁白','（得到剑穗。拿回去给程小剑。）']]:b;
  XS.TALK.xs_gu=()=>DAY3.st().fav.sf_wenxuan==='asked'&&!count(S,'c3_coins')?[['古董贩子','前朝的铜钱？有！三枚，三十灵石！'],{choice:'买下三枚铜钱？（30 灵石）', options:[{text:'买', fn:()=>{ if(S.stones<30) return UI.say([['古董贩子','钱不够？那就算了。']]); S.stones-=30; addItem('c3_coins',1); UI.hud(); save(); UI.say([['旁白','（得到前朝铜钱。拿回去给温玄。）']]); }},{text:'不买', fn:()=>{}}]}]:g; }
// 东市: 阿毛, at the 糖人 stall
MAPS.jc_dongshi.objects.push({type:'jc_pet', x:8, y:12, spr:'xingxing', act:'dspet', cond:s=>DAY3.st().fav.amao==='lost'});
On.act('dspet',o=>{ DAY3.st().fav.amao='found'; save(); C3.sync&&C3.sync(); UI.say([['旁白','一只白耳朵的狌狌蹲在糖人摊底下，嘴里叼着半个糖人。'],['糖人师傅','这猴子是你的？偷了我两个糖人了！'],['旁白','你赔了糖人钱，把阿毛抱了起来。它没有躲。'],{run:()=>{ S.stones=Math.max(0,S.stones-10); UI.hud(); }},['旁白','（带阿毛回四方馆找乌兰。）']]); });

/* ---------- hooks into the places ---------- */
// 回春堂: 孙大夫 offers work once the 石钟乳 business is done
{ const t=HC.TALK.hc_sun; HC.TALK.hc_sun=()=>S.flags.c3_hc_ru?[['孙大夫','（他忙得头都不抬）……来得正好。'],{choice:'帮孙大夫抓药？（每天一次，有工钱）', options:[{text:'帮忙', fn:()=>JOB.zhua()},{text:'改天', fn:()=>{}}]}]:t(); }
// 琅琊阁: the keeper will pay for fair copies
{ const l=XS.lang; XS.lang=()=>{ const L=l(), last=L[L.length-1]; if(last&&last.choice) last.options.splice(last.options.length-1,0,{text:DAY3.st().job.copy===S.day?'（今天已经帮阁主抄过书了）':'帮阁主抄书（每天一次，有工钱）', fn:()=>JOB.copy()}); return L; }; }
// 当铺: the 朝奉 takes what you bring (fish at full price — 醉仙居's kitchen buys them off him every morning; anything else
// at eight-tenths), and sells what nobody came back for. While 大师姐's 青玉珠 is still on his shelf, that comes first.
Object.assign(ITEMS,{
  jc_jing:{name:'铜镜', icon:'i_lingmo', sell:30, desc:'当铺的死当。背面铸着一对衔草的鸾鸟，镜面磨得还很亮。'},
  jc_pei:{name:'旧玉佩', icon:'i_slip', sell:50, desc:'当铺的死当。一块青白玉佩，刻着半句诗，另外半句不知道在谁手里。'},
});
NPCS.xie.likes=[...(NPCS.xie.likes||[]),'jc_jing','jc_pei']; NPCS.tang.likes=[...(NPCS.tang.likes||[]),'jc_jing'];
if(NPCS.xiao) NPCS.xiao.likes=[...(NPCS.xiao.likes||[]),'jc_pei']; if(NPCS.qinghe) NPCS.qinghe.likes=[...(NPCS.qinghe.likes||[]),'jc_jing'];
const DANG={
  GOODS:[['huichun',60],['rod',50],['jc_jing',40],['jc_pei',70]],
  KEEP:['jc_lock','jc_fu','jc_wen','jc_shan','jc_deng','c3_bead'],               // story things he won't take
  price(id){ const it=ITEMS[id]; if(!it||!it.sell||it.quest||it.keep||DANG.KEEP.includes(id)) return 0; return id.startsWith('fish_')?it.sell:Math.max(1,Math.floor(it.sell*.8)); },
  open(){ const bead=S.flags.c3_xie_pawn&&!S.flags.c3_bead;
    if(bead) return UI.say([['朝奉','（他头也不抬）当，还是赎？'],{choice:'当铺', options:[{text:'赎回大师姐的青玉珠', fn:()=>XIE.dang()},{text:'当东西、看看死当', fn:()=>DANG.panel('sell')},{text:'走了', fn:()=>{}}]}]);
    DANG.panel('sell'); },
  panel(tab){
    let body=`<div class="tabs"><button data-t="sell" class="${tab==='sell'?'on':''}">当（卖）</button><button data-t="buy" class="${tab==='buy'?'on':''}">死当（买）</button></div><p class="muted">灵石：<b>${S.stones}</b></p>`;
    if(tab==='buy') body+=DANG.GOODS.map(([id,p])=>`<div class="row">${itemIcon(id)}<div><b>${ITEMS[id].name}</b><small>${esc(ITEMS[id].desc)}</small></div><button class="btn mini" data-buy="${id}" data-p="${p}" ${S.stones<p?'disabled':''}>${p} 灵石</button></div>`).join('');
    else { const ids=Object.keys(S.inv).filter(k=>S.inv[k]>0&&DANG.price(k)>0);
      body+=ids.map(id=>`<div class="row">${itemIcon(id)}<div><b>${ITEMS[id].name} ×${S.inv[id]}</b><small>每个 ${DANG.price(id)} 灵石${id.startsWith('fish_')?'（鲜鱼，原价收）':''}</small></div><button class="btn mini" data-sell="${id}">当 1</button><button class="btn mini" data-sellall="${id}">全当</button></div>`).join('')
        ||'<p class="muted">朝奉看了看你的行囊：「没什么值钱的。」（鱼、灵草、兽皮、丹药、礼物都能当。）</p>'; }
    UI.panel('当铺', `<p class="greet">朝奉：「${tab==='buy'?'过了期没人赎的，都在这儿了。':'鱼也收——醉仙居的后厨天天来我这儿拿。别的，八成价。'}」</p>`+body, b=>{
      b.querySelectorAll('[data-t]').forEach(t=>t.onclick=()=>{ Sound.tick(); DANG.panel(t.dataset.t); });
      b.querySelectorAll('[data-buy]').forEach(x=>x.onclick=()=>{ const id=x.dataset.buy, p=+x.dataset.p; if(S.stones<p) return; S.stones-=p; addItem(id,1); Sound.coin(); UI.hud(); save(); DANG.panel('buy'); });
      const sell=(id,n)=>{ const p=DANG.price(id); if(!p||!S.inv[id]) return; n=Math.min(n,S.inv[id]); addItem(id,-n); S.stones+=p*n; Sound.coin(); UI.hud(); save(); DANG.panel('sell'); };
      b.querySelectorAll('[data-sell]').forEach(x=>x.onclick=()=>sell(x.dataset.sell,1));
      b.querySelectorAll('[data-sellall]').forEach(x=>x.onclick=()=>sell(x.dataset.sellall,S.inv[x.dataset.sellall]));
    }); },
};
// 回春堂 is a 药铺: the 掌柜 at the counter sells 回春丹 (cheaper than the 当铺), any time after you've first come in
HC.SELL=[['huichun',50],['juqi',60]];   // 聚气丹: in a fight it fills your 灵力
{ const z=HC.TALK.hc_zhang; HC.TALK.hc_zhang=()=>{ const L=z(); if(!S.flags.c3_hc_ask) return L;
    return [...L,{choice:'回春堂掌柜：「抓药，还是买现成的丹？」', options:[{text:'买丹（回春丹 50 · 聚气丹 60）', fn:()=>SHOP3.sell('回春堂',HC.SELL)},{text:'不用了', fn:()=>{}}]}]; }; }
// 四方馆 gets a mailbox just inside its gate, so letters from friends reach you in the capital too
MAPS.jc_sifang.objects.push({type:'mailbox', x:17, y:19, act:'mail', spr:'mailbox'});
