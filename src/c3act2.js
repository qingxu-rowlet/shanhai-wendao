/* ============================================================
   山海问道 · 第三章「京城」 · 第二幕「京城」 — so far: the road's last day and 朱雀门. The guards look at the sect's papers
   and then at 大师姐; inside, the avenue is loud and full; on the notice wall at the crossroads: the 大比 (三月十五，贡院前),
   萧大人's curfew, and a torn notice for a lost child. You can buy a 糖葫芦 (吴阿蛮 asked for one) and a 包子, and talk
   to everyone. 四方馆 is west across the cross street — the next map.
   ============================================================ */
const JC={
  dan:()=>S.sect==='dan',
  // people say things over their heads as you pass
  CHAT:{
    jc_guard1:['下一个！','路引！路引拿出来！'], jc_guard2:['大比的往西走。','天黑之前进城，宵禁不等人。'],
    jc_patrol:['都让让！','……今天又少了一个。'], jc_baoniang:['包子——刚出笼的包子——','肉馅的五文，素的三文！'],
    jc_hulu:['糖葫芦——又甜又脆的糖葫芦——'], jc_huolang:['针头线脑，胭脂花粉——','小娘子，看看这把梳子？'],
    jc_suanming:['看相，测字，不准不要钱。','这位，你印堂……嗯，还行。'], jc_kid1:['抓不着我！'], jc_kid2:['等等我——'],
    jc_scholar:['……三年一考，三年一考啊。'], jc_bearer1:['大人在里面喝茶，咱们等着。'], jc_bearer2:['腿都站麻了……'], jc_traveler:['总算到了。'],
  },
};

/* ---------- the road's last day, and the gate ---------- */
JC.toCity=()=>[
  ['旁白','天亮了。大师姐已经收好了帐篷。昨晚那个人站过的山脊上，什么也没有。'],
  ['谢霁月','走吧。'],
  {run:()=>C3.move('jc_zhuque',13,32,'up',16.5)}];
On.enter(id=>{ if(id==='jc_zhuque'&&!S.flags.c3_jc_in) setTimeout(()=>{ if(RT.mapId==='jc_zhuque'&&!S.flags.c3_jc_in) UI.say(JC.gate(),()=>{ UI.hud(); Story.check(); }); },500); });
JC.gate=()=>[
  ['旁白','傍晚，京城的城墙出现在官道的尽头。'],
  ['旁白','城墙比青云山的山门还要高。城楼上挂着一块匾：「朱雀门」。'],
  ['旁白','城门口排着长长的队：挑担的，赶车的，骑马的，抬轿的……吵吵嚷嚷，一直排到护城的柳树底下。'],
  ['守城兵','站住。哪儿来的？'],
  ['谢霁月',`（她递上文书）${sectName()}，进京赴大比。`],
  ['守城兵','大比的？'],
  ['旁白','他看了一眼文书上的印，又看了一眼大师姐，眼睛停了一下。'],
  ['守城兵','……进去吧。四方馆在西边，过了十字街往西走。'],
  ['守城兵','天黑以前找好落脚的地方。萧大人有令，入夜宵禁。'],
  ['旁白','城门里飘出来一股熬糖的甜味。'],
  ...(JC.dan()?[['苏小棠','好多人……{名}，你看那边！有卖糖葫芦的！']]:[]),
  ...(S.flags.c3_wu_hulu?[['我','（……对了。答应过吴阿蛮，给他带一串糖葫芦。）']]:[]),
  ['谢霁月','跟紧了。'],
  {flag:'c3_jc_in'},
  ['旁白','（进城看看。十字街口有告示，四方馆在西边。）']];
// 大师姐 (and 苏小棠) walk with you in the city too
MAPS.jc_zhuque.objects.push(
  {type:'npc', id:'xie', x:14, y:24, look:LOOK_XIE, name:'谢霁月', act:'talk', cond:s=>!!s.flags.c3_jc_in},
  {type:'npc', id:'tang', x:12, y:20, look:LOOK_TANG, name:'苏小棠', act:'talk', cond:s=>s.sect==='dan'&&!!s.flags.c3_jc_in});
On.talk(id=>{ if(RT.mapId!=='jc_zhuque') return false; const F=S.flags;
  if(id==='xie'){ C3.menu('xie',F.c3_jc_board?[['谢霁月','宵禁……'],['谢霁月','（她看了一眼天色）先去四方馆。']]:[['谢霁月','京城……比上一回来的时候，人多了。'],['谢霁月','十字街口有告示，去看看。']]); return true; }
  if(id==='tang'&&JC.dan()){ C3.menu('tang',[['苏小棠','回春堂！京城最大的药铺！我、我能进去看一眼吗？'],['苏小棠','……就一眼！']]); return true; }
  const L=JC.TALK[id]; if(!L) return false; UI.say(typeof L==='function'?L():L); return true; });
JC.TALK={
  jc_guard1:[['守城兵','大比的往西走，四方馆。别在大街上乱晃。']],
  jc_guard2:[['守城兵','最近夜里不太平。'],['守城兵','……别问。宵禁就是宵禁。']],
  jc_patrol:()=>[['巡街兵丁','让让，让让——'],['旁白','他走过去的时候，你听见他压低声音对同伴说：'],['巡街兵丁','西市那边，昨晚又少了一个。'],{flag:'c3_jc_heard'}],
  jc_baoniang:()=>[['包子铺老板娘','客官，来两个包子？刚出笼的！'],{choice:'买包子吗？（5 灵石）', options:[{text:'来两个', fn:()=>JC.buy('jc_bao',5,'包子',2)},{text:'不了', fn:()=>{}}]}],
  jc_hulu:()=>[['卖糖葫芦的老汉','糖葫芦——又甜又脆的糖葫芦——'],{choice:'买一串糖葫芦吗？（10 灵石）', options:[{text:'买一串', fn:()=>JC.buy('jc_hulu',10,'糖葫芦',1)},{text:'不了', fn:()=>{}}]}],
  jc_huolang:[['货郎','胭脂花粉、针头线脑，要不要看看？'],['货郎','……听说没有？大比今年改在贡院前头比，萧大人亲自看。']],
  jc_suanming:()=>[['算命先生','这位小友，留步。'],['旁白','他眯着眼睛，盯着你的脸看了好一会儿。'],['算命先生','……你这面相，命里有一劫。'],['算命先生','不在刀剑，在人心。'],['算命先生','十文钱，我给你细说？'],['旁白','你摇摇头。他也不恼，又眯起了眼睛。']],
  jc_kid1:[['小孩','你是仙人吗？你会飞吗？'],['小孩','我娘说，晚上不许出门，会被抓走的。']],
  jc_kid2:[['小孩','阿秀姐姐也是晚上出门，就没回来了……'],['旁白','另一个孩子赶紧拉了拉她的袖子。']],
  jc_scholar:[['书生','（他手里攥着一卷书，嘴里念念有词）……'],['书生','啊，失礼。在下进京赶考，三年了。'],['书生','听说今年的大比，萧大人也要去看。那位大人，从前也是……唉，算了。']],
  jc_bearer1:[['轿夫','我们大人在醉仙居里头喝茶呢。'],['轿夫','哪位大人？……这可不能说。']],
  jc_bearer2:[['轿夫','（他揉着肩膀）抬了一天了。'],['轿夫','京城的大人，一个比一个沉。']],
  jc_traveler:[['赶路的人','我是从北边来的。我们那儿……好几个村子都空了。'],['赶路的人','我来京城投亲戚。也不知道，亲戚还在不在。']],
};
JC.buy=(item,price,name,n)=>{ if(S.stones<price) return UI.say([['旁白',`灵石不够了。（要 ${price} 灵石）`]]); S.stones-=price; addItem(item,n); Sound.coin(); UI.hud(); save(); UI.toast(`买了${n>1?n+'个':'一串'}${name}`); };
Object.assign(ITEMS, {
  jc_hulu:{name:'糖葫芦', icon:'i_zhuguo', sell:4, desc:'京城朱雀大街上买的糖葫芦，糖衣又薄又脆。吴阿蛮要过一串。'},
  jc_bao:{name:'包子', icon:'i_zhuguo', sell:2, desc:'朱雀大街上刚出笼的肉包子，还烫手。可以送人。'},
});
NPCS.tang.loves.push('jc_hulu'); NPCS.xie.likes.push('jc_hulu'); NPCS.ge.likes.push('jc_bao');

/* ---------- 吴阿蛮's 糖葫芦: promised at the gate of the sect, kept when you go back ---------- */
On.talk(id=>{ if(id!=='c2d_wu'||!S.flags.c3_wu_hulu||S.flags.c3_wu_done||!count(S,'jc_hulu')) return false;
  addItem('jc_hulu',-1); S.flags.c3_wu_done=true; UI.say([
    ['外门弟子·吴阿蛮','{称}！你回来了！'],['旁白','你把糖葫芦递给他。'],['外门弟子·吴阿蛮','（他举着看了半天）……没有鸡蛋那么大嘛。'],
    ['外门弟子·吴阿蛮','（他咬了一口，眼睛一下子亮了）……可是好甜！'],['外门弟子·吴阿蛮','我留一颗给老钟！'],{stones:20},['旁白','（老钟后来说，那颗山楂他舍不得吃，晒干了挂在门房里。）']]); return true; });

/* ---------- the street's things ---------- */
const JC_SHOPS={
  jiulou:[['旁白','醉仙居。二楼的窗子里，传出划拳和笑声。'],['旁白','门口停着一顶轿子。']],
  dang:[['旁白','当铺的柜台比人还高。'],['旁白','柜台后面的朝奉头也不抬：「当什么？」'],['旁白','（你什么也没当。）']],
  bu:[['旁白','锦绣布庄。门口挂着一匹红绸子，被风吹得一飘一飘的。']],
  yao:()=>[['旁白','回春堂。一进门就是一股苦香。整面墙的小抽屉，每一格上都写着药名。'],...(JC.dan()?[['苏小棠','（她眼睛都亮了）……']]:[])],
  cha:[['旁白','听雨轩。门半掩着，里面醒木一拍：'],['旁白','「……上回说到，那一年宗门大比，有一位女弟子，生得是闭月羞花——」'],['谢霁月','……'],['旁白','（茶楼是之后的地图，到时候可以进去听书。）']],
  kezhan:[['旁白','悦来客栈。掌柜在门口打着算盘：「打尖还是住店？」'],['旁白','（大比的弟子都住四方馆。）']],
};
On.act('jcshop',o=>{ const L=JC_SHOPS[o.id]; UI.say(typeof L==='function'?L():L||[['旁白',o.label]]); });
On.act('jcsedan',o=>UI.say([['旁白','一顶红呢大轿。轿帘放着，里面没有人。'],['旁白','轿杠上，刻着一个小小的「萧」字。'],{flag:'c3_jc_sedan'}]));
On.act('jcbao',o=>Story.talk('jc_baoniang'));
On.act('jchulu',o=>Story.talk('jc_hulu'));
On.act('jcstall',o=>UI.say([[['旁白','布摊上摆着一匹一匹的花布，摊主忙着给一位大娘量尺寸。']],[['旁白','首饰摊上的簪子、耳坠，在灯笼底下一闪一闪的。']],[['旁白','水果摊上堆着橘子和柿子。北边来的果子，比桃源镇的小一圈。']]][o.si||0]));
On.act('jcboard',o=>{ const first=!S.flags.c3_jc_board; UI.say([
  ['旁白','十字街口的墙上，贴着三张告示。'],
  ['旁白','第一张：「四宗大比，三月十五起，于贡院前设擂。四宗弟子，凭宗门文书至礼部报名。——礼部」'],
  ['旁白','第二张：「京畿近有妖患。钦差萧大人令：入夜宵禁，违者拘押。」'],
  ['旁白','第三张被撕掉了一半，只剩几行字：「寻人：小女阿秀，七岁，正月里在西市走失。身穿红袄，左耳下有一颗痣……」'],
  ...(first?[['谢霁月','（她看着第三张，看了很久）……'],['谢霁月','走吧。先去四方馆。'],{flag:'c3_jc_board'},['旁白','（四方馆在西边：沿着十字街往西走。）']]:[])], ()=>{ UI.hud(); Story.check(); }); });
On.act('jcway',o=>UI.say([['旁白',{west:'往西：西市。',east:'往东：东市。',north:'往北：皇城。'}[o.way]],
  ['旁白',{west:'（西市是下一张地图，做好以后从这里走。）',east:'（东市是之后的地图。）',north:'（皇城只有大比开幕那天才能进。）'}[o.way]]]));
On.theme(id=>id&&id.startsWith('jc_')?'village':null);
{ const _d=Portal.dests; Portal.dests=function(){ const l=_d.call(Portal); if(S.flags.c3_jc_in&&RT.mapId!=='jc_zhuque') l.push({name:'京城 · 朱雀门', map:'jc_zhuque', x:3, y:31}); return l; }; }

/* ---------- what people say over their heads as you pass ---------- */
On.draw(({g,T,ox,oy})=>{ if(!String(RT.mapId).startsWith('jc_')||!$('#dlg').hidden) return;
  const near=RT.ents.filter(o=>o.type==='npc'&&JC.CHAT[o.id]&&Math.abs(o.x-RT.fx)+Math.abs(o.y-RT.fy)<=4);
  for(const o of near){ const lines=JC.CHAT[o.id], k=Math.floor((RT.t+o.x*1.7)/4)%(lines.length+1); if(k===lines.length) continue; const text=lines[k];
    // a slip of 宣纸 with an ink edge, written with a brush (the font of the pictures' titles)
    g.font=`${Math.round(T*.42)}px "Ma Shan Zheng","STKaiti","KaiTi",serif`; const cx=ox+(o.x+.5)*T, w=g.measureText(text).width+T*.5, h=T*.62, x=cx-w/2, y=oy+(o.y-1.45)*T, rr=T*.14;
    g.beginPath(); g.moveTo(x+rr,y); g.lineTo(x+w-rr,y); g.quadraticCurveTo(x+w,y,x+w,y+rr); g.lineTo(x+w,y+h-rr); g.quadraticCurveTo(x+w,y+h,x+w-rr,y+h);
    g.lineTo(cx+T*.12,y+h); g.lineTo(cx,y+h+T*.16); g.lineTo(cx-T*.12,y+h); g.lineTo(x+rr,y+h); g.quadraticCurveTo(x,y+h,x,y+h-rr); g.lineTo(x,y+rr); g.quadraticCurveTo(x,y,x+rr,y); g.closePath();
    g.fillStyle='rgba(246,236,212,.95)'; g.fill(); g.strokeStyle='rgba(70,46,30,.85)'; g.lineWidth=Math.max(1,T*.05); g.stroke();
    g.fillStyle='#2a1c14'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(text,cx,y+h*.54); g.textBaseline='alphabetic'; } });

/* ---------- the quests ---------- */
QUESTS.push(
  {id:'c3d', title:'第二幕 · 进京', desc:'北上的最后一段路。傍晚，京城的城墙出现在官道尽头。', check:s=>!!s.flags.c3_jc_in,
    progress:s=>'走到朱雀门', target:s=>['jc_zhuque',13,30,'朱雀门']},
  {id:'c3e', title:'京城', desc:'京城比桃源镇大一百倍。十字街口贴着告示，四方馆在西边。', check:s=>false,
    progress:s=>!s.flags.c3_jc_board?'看看十字街口的告示':'去四方馆（往西，下一张地图）',
    target:s=>!s.flags.c3_jc_board?['jc_zhuque',19,14,'十字街口的告示']:['jc_zhuque',2,14,'往西的十字街']});
