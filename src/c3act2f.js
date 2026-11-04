/* ============================================================
   山海问道 · 第三章「京城」 · 第二幕 · 炼结丹丹 — back at 四方馆 with all three herbs, 苏小棠 carries her little bronze
   furnace out to the back courtyard. The fire is harder than any pill before: the gold band moves faster and in the
   last half it shivers ("九转"). She watches the fire for you and calls it. If the furnace bursts she catches the herbs
   in time and you go again. Then the pill, ash on her face, and 大师姐 in the moon gate: tomorrow, 闭关.
   ============================================================ */
const DAN={
  st(){ const c=C3.st(); return c; },
  opt:()=>({wide:S.sect==='dan'?.17:.135, total:10, speed:1.35, jolt:.07,
    coach:(st,t,total)=>t>total/2&&t<total/2+1.2?'苏小棠：要转九转了——稳住！':{ok:'苏小棠：对，就这样……别动！',hot:'苏小棠：太旺了！松一松！',cold:'苏小棠：火要灭了，快鼓风！'}[st]}),
};
MAPS.jc_sifang.objects.push({type:'furnace', x:7, y:17, act:'sfdan', cond:s=>!!s.flags.c3_dan_lu});
Object.assign(ITEMS,{c3_jiedan:{name:'结丹丹', icon:'i_pill', quest:true, keep:true, desc:'苏小棠看着火候，在四方馆后院炼成的结丹丹。龙血竭、千年石钟乳、九转还魂草。闭关时服下。'}});

/* ---------- 苏小棠 brings out her furnace ---------- */
DAN.start=()=>[
  ['苏小棠','{名}！三味都齐了！'],
  ['苏小棠','（她跑回厢房，抱出一只小小的铜丹炉，炉身被摸得发亮）这是我自己的炉子。从谷里一路背过来的。'],
  ['苏小棠','去后院！那里没人，风也小。'],
  {run:()=>C3.set('c3_dan_lu')},
  ['旁白','（后院月洞门里，太湖石旁边，苏小棠把丹炉架好了。）']];
DAN.before=()=>[
  ['苏小棠','结丹丹的火候，和筑基丹不一样。'],
  ['苏小棠','要转九转。前一半还好，后一半，火会自己乱跳。'],
  ['苏小棠','你鼓风，我看火。我说大，你就大；我说小，你就小。'],
  ['苏小棠','……别紧张。'],
  ['苏小棠','（她自己的手，其实也在抖）']];
DAN.go=()=>{ const need=['c3_xue','c3_ru','c3_hun'].filter(k=>!count(S,k)); if(need.length) return UI.say([['苏小棠','药材不齐……']]);
  Mini.alchemy({out:'c3_jiedan'}, grade=>{ S.min+=60; UI.hud();
    if(grade==='fail') return UI.say([['旁白','「砰」的一声，炉盖跳了起来，一股黑烟冲上天。'],['苏小棠','（她扑过去，用袖子把药材从炉膛里扒了出来）……还好！还好我手快！'],['苏小棠','（她脸上一道一道的黑灰，却笑了）药没坏。再来一次！']],()=>UI.say(DAN.before().slice(-2),()=>DAN.go()));
    for(const k of ['c3_xue','c3_ru','c3_hun']) addItem(k,-1); addItem('c3_jiedan',1); S.c3.danGrade=grade; save();
    UI.say(DAN.after(grade),()=>{ UI.hud(); Story.check(); }); }, DAN.opt()); };
DAN.after=g=>[
  ['旁白','炉火慢慢小了下去。苏小棠揭开炉盖，一股清香冲出来，满院子的槐花香都被压下去了。'],
  ['旁白',`炉底躺着一颗丹药，${{top:'圆润透亮，丹纹九道，一道不少',mid:'圆润，丹纹七八道',low:'有点歪，丹纹只有五六道'}[g]}。`],
  ...(g==='top'?[['苏小棠','（她捧着丹药，半天没说话）……上品。'],['苏小棠','长老一辈子，也就炼出过三颗上品结丹丹。']]:g==='mid'?[['苏小棠','成了！成色还不错！']]:[['苏小棠','成了……就是丑了一点。'],['苏小棠','药力是一样的！真的！']]),
  ['苏小棠','（她用袖子擦了擦脸，把黑灰抹得更开了）{名}……你要结丹了。'],
  {love:{tang:20}},{flag:'c3_dan_done'},
  ['旁白','（得到「结丹丹」。）'],
  ['旁白','月洞门那边，大师姐不知道什么时候来的，靠在门框上。'],
  ['谢霁月','……炼好了？'],
  ['谢霁月','明天开始闭关。就在这里。'],
  ['谢霁月','我替你守着。']];

/* ---------- where it happens ---------- */
// (called from 四方馆's own talk handler, which owns 苏小棠 there)
DAN.talk=()=>{ if(!S.flags.c3_dan_lu) return UI.say(DAN.start(),()=>{ UI.hud(); Story.check(); });
  C3.menu('tang',[['苏小棠','丹炉架在后院了！快来！']]); };
On.act('sfdan',o=>{ if(S.flags.c3_dan_done) return UI.say([['旁白','苏小棠的小铜炉。炉身还是温的。']]);
  UI.say(DAN.before(),()=>DAN.go()); });

/* ---------- the quests ---------- */
{ const q=QUESTS.find(q=>q.id==='c3h'); Object.assign(q,{check:s=>!!s.flags.c3_dan_done,
    progress:s=>!s.flags.c3_dan_lu?'回四方馆，找苏小棠':'后院的丹炉：和苏小棠炼结丹丹',
    target:s=>!s.flags.c3_dan_lu?(RT.mapId==='jc_sifang'?['jc_sifang',8,13,'苏小棠']:['jc_sifang',15,19,'四方馆']):['jc_sifang',7,18,'丹炉']}); }
QUESTS.splice(QUESTS.findIndex(q=>q.id==='c3h')+1,0,
  {id:'c3i', title:'结丹 · 闭关', desc:'结丹丹炼好了。大师姐说：明天开始闭关，她替你守着。', check:s=>false,
    progress:s=>'在后院的蒲团上闭关（下一步）', target:s=>['jc_sifang',6,19,'蒲团']});
