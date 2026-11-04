/* ============================================================
   山海问道 · 第三章「京城」 · 第二幕 · 聚宝楼 — the third herb. Back at 四方馆 大师姐 gives her purse (the last 大比's
   prize, never spent) and 苏小棠 shakes out all her pocket money; if it's still not enough, 大师姐 unties the jade bead
   from her sword tassel, her master's gift, and has it pawned. On the seventh night, the auction: the hall whispers
   when it sees her; 萧府's steward buys everything he bids on; for the last lot, 九转还魂草, you bid against a salt
   merchant and the steward. Then a boy runs down from the right-hand 雅间 and whispers; the steward looks up at the
   curtain and withdraws, and the herb is yours. Through a gap in the curtain: a hand on the rail, a white bone ring.
   ============================================================ */
const JU={
  st(){ const c=C3.st(); c.ju=c.ju||{pool:0, pawn:0}; return c.ju; },
  enter(){ enterMap('jc_jubao',10,12); RT.dir='up'; UI.hud(); },
  budget:()=>S.stones+JU.st().pool,
  CHAT:{ju_host:['下一件——'], ju_yan:['这个，这个我要了！'], ju_guanjia:['……'], ju_boy:['……'], ju_g1:['就是她……'], ju_g2:['萧府又来了。']},
};
JC.CHAT=Object.assign(JC.CHAT,JU.CHAT);

/* ---------- 四方馆: the money ---------- */
JU.pool=()=>{ const own=S.stones, base=550, pawn=Math.max(0,1200-(own+base)); return [
  ['我','大师姐。还差最后一味，九转还魂草，在聚宝楼的拍卖会上。起价八百。'],
  ['谢霁月','（她没说话，从怀里摸出一个旧荷包，放在你手里）四百。'],
  ['谢霁月','上一届大比的赏钱。一直没花。'],
  ['苏小棠','（她也把荷包倒过来，抖出一把碎灵石）我、我还有一百五！我所有的零花钱！'],
  ...(pawn?[
    ['旁白',`三个人的灵石加在一起，只有 ${own+base}。萧府的人要是也来抢……`],
    ['谢霁月','（她低下头，解下剑穗上的一颗青玉珠子）这个，当了吧。'],
    ['我','这是……'],
    ['谢霁月','师父给的。'],
    ['谢霁月','……不要紧。剑还在就行。'],
    ['旁白',`青玉珠在朱雀大街的当铺当了 ${pawn} 灵石。`],{flag:'c3_xie_pawn'}]:[['谢霁月','够了。']]),
  {run:()=>{ const j=JU.st(); j.pool=base+pawn; j.pawn=pawn; save(); }},{flag:'c3_ju_pool'},
  ['谢霁月',`拍卖会在第 ${XS.auctionDay()} 天晚上。我和你们一起去。`]]; };

/* ---------- 聚宝楼's door ---------- */
JU.door=()=>{ const d=XS.auctionDay();
  if(!S.flags.c3_ju_pool) return [...XS.ju(),['苏小棠','……{名}，我们先回四方馆，跟大师姐商量商量吧。']];
  if(S.day<d) return [['聚宝楼伙计',`拍卖会在第 ${d} 天晚上。客官到时候再来。`],['旁白','（回四方馆的厢房睡觉，等到那一天。）']];
  if(S.min<18*60) return [['聚宝楼伙计','今晚开场！天一黑就开门。'],{choice:'等到天黑？', options:[{text:'在西市逛到天黑', fn:()=>{ S.min=18*60; UI.clock(); UI.say([['旁白','天黑了。聚宝楼门口的灯笼一盏一盏亮起来。']],()=>JU.enter()); }},{text:'晚点再来', fn:()=>{}}]}];
  return [['聚宝楼伙计','（他看了一眼你们的宗门腰牌，笑着让开）三位里边请！'],{choice:'进聚宝楼？', options:[{text:'进去', fn:()=>JU.enter()},{text:'等一下', fn:()=>{}}]}]; };

/* ---------- the auction ---------- */
On.enter(id=>{ if(id==='jc_jubao'&&!S.flags.c3_ju_won&&!S.flags.c3_ju_in) setTimeout(()=>{ if(RT.mapId==='jc_jubao'&&!S.flags.c3_ju_won) UI.say(JU.open(),()=>JU.bid()); },500); });
JU.open=()=>[
  ['旁白','聚宝楼的大堂里点满了灯。台子上铺着红毡，一张桌子，桌上蒙着红布。'],
  ['旁白','底下坐满了人。抬头看，后墙高处有两间雅间，红帘子垂着。'],
  ['看客','（压低了声音）……就是她。'],
  ['看客','上一届那个？「狐仙夺魁」那个？'],
  ['谢霁月','（她目不斜视，在椅子上坐下）……'],
  ['拍卖师','（一声锣响）诸位贵客，今夜聚宝楼开场！'],
  ['拍卖师','头一件：前朝铜镜一面，起价两百——'],
  ['盐商','三百！'],['旁白','没人跟。锣响。盐商眉开眼笑。'],
  ['拍卖师','第二件：北地雪狐皮一张——'],
  ['萧府管家','一千。'],['旁白','大堂里一下子安静了。没有人再举牌。'],
  ['拍卖师','第三件：鲛人泪一颗——'],
  ['萧府管家','两千。'],
  ['苏小棠','（她小声说）……萧府什么都要。'],
  ['谢霁月','是什么都不让别人要。'],
  {flag:'c3_ju_in'},
  ['拍卖师','（他揭开最后一块红布）压轴——九转还魂草，一株！'],
  ['旁白','布底下是一株通体碧绿的小草，叶子一圈一圈地盘着，像是在慢慢地转。'],
  ['拍卖师','起价八百灵石！']];
JU.bid=(b)=>{ b=b||{price:800, mine:0, n:0, yan:true, holder:''}; JU._b=b; const have=JU.budget(), opts=[];
  if(!b.mine&&!b.holder) opts.push({text:'举牌：八百', fn:()=>JU.raise(b,800)});
  else { for(const add of [100,300]) if(b.price+add<=have) opts.push({text:`加${add===100?'一':'三'}百：${b.price+add}`, fn:()=>JU.raise(b,b.price+add)}); opts.push({text:'不跟了', fn:()=>JU.signal(b)}); }
  UI.say([{choice:`九转还魂草　现价 ${b.price}${b.holder?`（${b.holder}）`:''}　你们一共有 ${have} 灵石`, options:opts}]); };
JU.raise=(b,p)=>{ b.price=p; b.mine=p; b.n++; b.holder='你'; Sound.coin&&Sound.coin();
  if(b.n>=3||b.price>=1100||b.price+100>JU.budget()) return UI.say([['我',`${p}！`]],()=>JU.signal(b));
  const L=[['我',`${p}！`]];
  if(b.yan&&b.price+100<=1000){ b.price+=100; b.holder='盐商'; L.push(['盐商',`${b.price}！`]); if(b.price>=1000) b.yan=false; }
  else { if(b.yan){ b.yan=false; L.push(['盐商','（他擦了擦汗，把牌子放下了）……算了，算了。']); } b.price+=200; b.holder='萧府管家'; L.push(['萧府管家',`${b.price}。`]); }
  UI.say(L,()=>JU.bid(b)); };
JU.signal=b=>{ const price=b.mine, pay=Math.max(0,price-JU.st().pool); UI.say([
  ['旁白','萧府管家正要再举牌，一个小厮从楼梯上跑下来，凑到他耳边说了一句什么。'],
  ['旁白','管家的脸色变了一下。他抬起头，看了一眼右边的雅间。'],
  ['旁白','雅间的帘子垂着，一动不动。'],
  ['萧府管家','……这株草，本府不要了。'],
  ...(b.holder!=='你'?[['拍卖师','（他愣了一下）那、那就按这位客官的价——']]:[]),
  ['拍卖师',`${price} 灵石，一次！两次！……成交！`],
  {run:()=>{ S.stones=Math.max(0,S.stones-pay); addItem('c3_hun',1); Sound.coin&&Sound.coin(); UI.hud(); save(); }},{flag:'c3_ju_won'},
  ['旁白','（得到「九转还魂草」。）'],
  ['旁白','你抬起头。右边雅间的帘子掀开了一道缝。'],
  ['旁白','缝里看不见人。只看见一只手搭在栏杆上，指头上套着一枚白骨扳指。'],
  ['旁白','然后，帘子落了下来。'],
  ['谢霁月','（她也在看那个雅间）……萧府的人，为什么要让？'],
  ['苏小棠','（她根本没注意，抱着锦盒，眼睛亮亮的）三味！三味都齐了！'],
  ['苏小棠','{名}，回去我就给你炼！'],
  ...(S.flags.c3_xie_pawn?[['我','（……大师姐的青玉珠，还当在朱雀大街的当铺里。）']]:[]),
  ['旁白','（结丹丹的三味主药都齐了。回四方馆，找苏小棠炼丹。）']],()=>{ UI.hud(); Story.check(); }); };
Object.assign(ITEMS,{c3_hun:{name:'九转还魂草', icon:'i_hun', quest:true, keep:true, desc:'结丹丹的第三味主药。通体碧绿，叶子一圈一圈地盘着，像是在慢慢地转。聚宝楼拍卖会的压轴。'}});
Object.assign(SPR,{i_hun:['............','.....gg.....','...gGggGg...','..gG.gg.Gg..','..g.gGGg.g..','..gG.gg.Gg..','...gGggGg...','.....GG.....','.....G......','....GG......']});

/* ---------- talking, and the things in the hall ---------- */
JU.TALK={
  ju_host:()=>S.flags.c3_ju_won?[['拍卖师','（他擦着额头上的汗）客官好福气。萧府让价，聚宝楼开张二十年，头一回。']]:[['拍卖师','客官稍坐，马上开场。']],
  ju_yan:[['盐商','（他抱着那面铜镜，美滋滋的）前朝的！前朝的！'],['盐商','……你说萧府的人？惹不起，惹不起。']],
  ju_guanjia:()=>S.flags.c3_ju_won?[['萧府管家','（他看都没看你）……'],['萧府管家','少……楼上的意思，我们照办就是了。']]:[['萧府管家','（他闭着眼睛，手里转着一对核桃）……']],
  ju_boy:[['萧府小厮','我、我什么都没说！'],['萧府小厮','（他往楼上看了一眼，赶紧跑开了）']],
  ju_g1:[['看客','（她用扇子挡着脸）你就是谢霁月的师弟妹？'],['看客','茶楼里说书的，说她上一届……嘻嘻，你自己去听吧。']],
  ju_g2:[['看客','萧府的管家，每回都来。看上什么，就是什么。'],['看客','今晚倒是稀奇。']],
};
On.talk(id=>{ if(RT.mapId!=='jc_jubao') return false; const F=S.flags;
  if(id==='xie'){ C3.menu('xie',F.c3_ju_won?[['谢霁月','那个雅间……'],['谢霁月','（她摇了摇头）走吧。回去炼丹。']]:[['谢霁月','别回头看他们。']]); return true; }
  if(id==='tang'){ C3.menu('tang',F.c3_ju_won?[['苏小棠','三味都齐了！我们快回去！']]:[['苏小棠','好多人……我手心都是汗。']]); return true; }
  if(!F.c3_ju_won&&F.c3_ju_in&&id==='ju_host'){ JU.bid(JU._b); return true; }
  const L=JU.TALK[id]; if(!L) return false; UI.say(typeof L==='function'?L():L); return true; });
On.act('jubox',o=>UI.say(S.flags.c3_ju_won?[['旁白','右边的雅间，帘子垂着。'],['旁白','里面已经没有人了。']]:[['旁白','右边的雅间，红帘子垂着。'],['旁白','里面好像有人。']]));
On.act('jugong',o=>UI.say([['旁白','一面铜锣，擦得锃亮。每成交一件，拍卖师就敲一下。']]));
On.theme(id=>id==='jc_jubao'?'calm':null);

/* ---------- the quests ---------- */
{ const q=QUESTS.find(q=>q.id==='c3g'), _p=q.progress, _t=q.target; Object.assign(q,{check:s=>!!s.flags.c3_ju_won,
    progress:s=>{ const F=s.flags; if(!F.c3_hc_ru) return _p(s); const d=XS.auctionDay();
      return !F.c3_ju_pool?'回四方馆，跟大师姐商量拍卖的钱':s.day<d?`拍卖会在第 ${d} 天晚上：回厢房睡觉，等日子`:'九转还魂草：入夜去西市的聚宝楼'; },
    target:s=>{ const F=s.flags; if(!F.c3_hc_ru) return _t(s); const [x,y]=SF_WING[s.sect];
      return !F.c3_ju_pool?['jc_sifang',12,10,'大师姐']:s.day<XS.auctionDay()?['jc_sifang',x+3,y+3,'你们的厢房']:['jc_xishi',26,6,'聚宝楼']; }}); }
QUESTS.splice(QUESTS.findIndex(q=>q.id==='c3g')+1,0,
  {id:'c3h', title:'结丹 · 炼丹', desc:'三味主药都齐了：龙血竭、千年石钟乳、九转还魂草。苏小棠说，她来看火候。', check:s=>false,
    progress:s=>'回四方馆，找苏小棠炼结丹丹（下一步）', target:s=>['jc_sifang',8,13,'苏小棠']});
