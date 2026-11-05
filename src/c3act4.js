/* ============================================================
   山海问道 · 第三章「京城」 · 第四幕 · 人吃人 — the morning after the back gate, 顾长歌 and 二师兄 are in 四方馆's yard.
   The way in: the boatman said empty boats row east to the 宗庙 at night — there is a water gate. 苏小棠 brews 醒神汤
   against the 醉仙散; 大师姐 breaks her confinement ("after tonight there will be no rumour"). Under the 宗庙: the 地宫.
   Two men in black on the stair and before the inner gate; the cells with the drugged in them — the disciple you beat,
   鲁三, a woman from 安平村, the 柳河村 man's mother. Wake them, and 二师兄 takes them out by the water. Then the 鼎, and
   the 八卦镜's last look into it: something with a man's face opens its eyes in the black water at the bottom. The
   国师: the 观天鉴 was for choosing the best roots to feed it — and 顾长歌 knows the mask. 萧烬 steps out of the dark: he
   always knew. "People? People eat people. What's that to me." Then he looks at you. If he has come to care for you, he
   comes to your side — not for them; for you. If not, he walks away. 顾长歌 and 萧烬 face to face. The 国师 laughs and
   strikes the 鼎: it cracks, and something climbs out. Act 4 ends.
   Also: after the first meeting, 萧烬 is in the 小巷 on any night, to talk to or give things to.
   ============================================================ */
const A4={
  st(){ const c=C3.st(); c.a4=c.a4||{woke:[]}; return c.a4; },
  loveOK:()=>Social.rel('xiao').pts>=100&&(C3.st().xj||{hate:0}).hate<30,
};
Object.assign(ITEMS,{c3_xingshen:{name:'醒神汤', icon:'i_pill', quest:true, keep:true, desc:'苏小棠熬的，专解醉仙散。闻一闻就醒，苦得人直皱眉。'}});

/* ---------- 萧烬 in the 小巷, any night after the first ---------- */
MAPS.jc_xiang.objects.push({type:'npc', id:'xiao', x:5, y:4, look:LOOK_XIAO, name:'萧烬', act:'talk', cond:s=>XX.night(s)&&!!s.flags.c3_xj_met&&!s.flags.c3_a4_done});
On.talk(id=>{ if(RT.mapId!=='jc_xiang'||id!=='xiao'||!S.flags.c3_xj_met) return false;
  C3.menu('xiao',S.flags.c3_a3_done?[['萧烬','（他蹲着喂狗，没有回头）……你去过宗庙后门了。'],['萧烬','别再去了。']]:[['萧烬','（他在喂那条瘸腿的狗）又睡不着？'],['萧烬','……坐吧。']]); return true; });

/* ---------- 四方馆: the morning after the back gate ---------- */
MAPS.jc_sifang.objects.push(
  {type:'npc', id:'ge', x:16, y:13, look:LOOK_GE, name:'顾长歌', act:'talk', cond:s=>!!s.flags.c3_a3_done&&!s.flags.c3_a4_go},
  {type:'npc', id:'c3_man', x:18, y:13, look:LOOK_MAN, name:'何满仓', act:'talk', cond:s=>!!s.flags.c3_a3_done&&!s.flags.c3_a4_go});
On.enter(id=>{ if(id!=='jc_sifang'||!S.flags.c3_a3_done||S.flags.c3_a4_plan||S.min<5*60||S.min>14*60) return;
  setTimeout(()=>{ if(RT.mapId==='jc_sifang'&&!S.flags.c3_a4_plan) UI.say(A4.plan(),()=>{ UI.hud(); Story.check(); }); },700); });
A4.plan=()=>[
  ['旁白','天亮了。槐树底下多了两个人。'],
  ['苏小棠','（她看见顾长歌，一下子跳了起来）顾大哥！'],
  ['顾长歌','（他点了点头，嘴角动了一下）……小棠。'],
  ['何满仓','（他捧着苏小棠塞给他的包子，一口一口地吃，吃得很用力）'],
  ['谢霁月','二师弟。'],
  ['何满仓','（他抬起头，眼圈一下子红了）大师姐……'],
  ['顾长歌','宗庙的后门守得很严。正门更不用说。'],
  ['我','护城河上有船。船家说，夜里总有不点灯的空船往宗庙那头划。'],
  ['顾长歌','……水门。'],
  ['苏小棠','被抬进去的人，喝的都是醉仙散。我熬醒神汤！闻一闻就能醒！'],
  {give:{c3_xingshen:4}},
  ['谢霁月','（她站起来，把剑系在腰上）我也去。'],
  ['苏小棠','可是师姐，你被禁足了——'],
  ['谢霁月','流言说我夜里出去吸人精气。'],
  ['谢霁月','今夜过后，就没有流言了。'],
  {flag:'c3_a4_plan'},
  ['旁白','（入夜，找顾长歌，从护城河坐船去宗庙的水门。）']];
A4.go=()=>[
  ['顾长歌','天黑了。'],
  {choice:'今夜去宗庙？', options:[{text:'去', fn:()=>{ S.flags.c3_a4_go=true; save(); C3.move('jc_digong',5,18,'up',23.5,()=>setTimeout(()=>UI.say(A4.arrive(),()=>{ UI.hud(); Story.check(); }),500)); }},{text:'再等等', fn:()=>{}}]}];
A4.arrive=()=>[
  ['旁白','船家的空船，没有点灯。顾长歌撑着篙，船贴着宗庙的墙根，滑进了一道水门。'],
  ['旁白','水门里面是往下走的石阶。越往下越冷，墙上点着火把。'],
  ['旁白','空气里，全是那股铁锈味。'],
  ['何满仓','（他捂住肚子，脸色发白）……饿。好饿。'],
  ['谢霁月','（她扶住他）撑住。'],
  ['旁白','（地宫：打倒守卫，拿到牢门的钥匙，用醒神汤叫醒被关的人。）']];

/* ---------- the 地宫 ---------- */
{ const W=28, H=24, G=[...Array(H)].map(()=>Array(W).fill('J'));
  const open=(a,b,c,d)=>{ for(let y=b;y<=d;y++) for(let x=a;x<=c;x++) G[y][x]='H'; };
  open(8,1,19,5);                          // the 鼎's chamber
  open(12,6,15,18);                        // the long hall
  open(3,7,9,9); open(3,12,9,14); open(18,7,24,9); open(18,12,24,14);   // four cells
  open(2,17,15,19);                        // the landing from the water
  for(let y=20;y<=22;y++) for(let x=2;x<=8;x++) G[y][x]='O';
  for(const [x,y] of [[10,8],[10,13],[11,8],[11,13],[16,8],[16,13],[17,8],[17,13]]) G[y][x]='H';     // the cells' doors (barred)
  const P=(id,x,y,name,look,cond)=>({type:'npc', id, x, y, look, name, act:'talk', cond});
  const objects=[
    {type:'dg_ding', x:13, y:4, spr:'dg_ding', act:'dgding', rect:[11,2,16,4], locked:true},   // locked: behind bars until the story opens them (the map walk skips it)
    ...[[10,8,0],[10,13,1],[17,8,2],[17,13,3]].map(([x,y,i])=>({type:'dg_bars', x, y, spr:'dg_bars', act:'dgbars', cell:i, cond:s=>!(A4.st().open||[]).includes(i)})),
    ...[12,13,14,15].map(x=>({type:'dg_bars', x, y:6, spr:'dg_bars', act:'dginner', cond:s=>A4.st().woke.length<4})),
    ...[[11,10],[16,10],[11,16],[16,16],[9,3],[18,3]].map(([x,y])=>({type:'dg_torch', x, y, spr:'dg_torch'})),
    P('dg_g1',13,15,'黑衣人',{g:'m',skin:1,hair:0,hairColor:0,style:'jin',cloth:5,face:'mid'},s=>!A4.st().g1),
    P('dg_g2',14,9,'黑衣人',{g:'m',skin:2,hair:1,hairColor:0,style:'jin',cloth:5,face:'mid'},s=>!A4.st().g2),
    ...[[0,5,8],[1,5,13],[2,21,8],[3,21,13]].map(([i,x,y])=>({...P('dg_p'+i,x,y,'被关的人',null,s=>!A4.st().woke.includes(i)), locked:true})),
    P('ge',11,18,'顾长歌',LOOK_GE), P('c3_man',15,18,'何满仓',LOOK_MAN,s=>A4.st().woke.length<4), P('xie',13,19,'谢霁月',LOOK_XIE),
  ];
  MAPS.jc_digong={ name:'宗庙 · 地宫', w:W, h:H, ground:G.map(r=>r.join('')), objects, exits:[], indoor:true }; }
On.enter(id=>{ if(id!=='jc_digong') return; for(const o of RT.ents) if(o.rect){ const [a,b,c,d]=o.rect; for(let y=b;y<=d;y++) for(let x=a;x<=c;x++) RT.solid[y][x]=true; } });
On.theme(id=>id==='jc_digong'?'night':null);
// who is in each cell: the one you beat in the third round, 鲁三, a woman from 安平村, the 柳河村 man's mother
A4.PRIS=()=>{ const n=XF.whoName(), lk=RIVAL[XF.who()].look; return [
  {name:n, look:lk, lines:[['旁白',`${n}迷迷糊糊地睁开眼睛。`],[n,'……这是哪儿？送行茶……我喝了送行茶……'],[n,'（他看清了你，愣住了）……你？你怎么在这儿？']]},
  {name:'鲁三', look:{g:'m',skin:3,hair:1,hairColor:1,style:'jin',cloth:6,face:'mid'}, lines:[['鲁三','（他打了个喷嚏，醒了）……我、我欠的钱，我会还的——'],...(count(S,'jc_tangren')?[['旁白','你把那只糖人小老虎放在他手里。'],['鲁三','（他看着糖人，看了很久，忽然哭了）……小满……']]:[['我','你女儿在东市等你。']])]},
  {name:'安平村的人', look:{g:'f',skin:2,hair:3,hairColor:1,style:'qun',cloth:5,face:'mid'}, lines:[['安平村的人','（她醒过来，第一句话是）……孩子呢？我的孩子呢？'],['我','你是安平村的？'],['安平村的人','（她点头，又摇头）去年秋天……一车一车地拉来……一批一批地，带出去，就没回来……'],['安平村的人','……我们村，就剩我们几个了。']]},
  {name:'柳河村的李大娘', look:{g:'f',skin:2,hair:3,hairColor:3,style:'qun',cloth:5,face:'small'}, lines:[['柳河村的李大娘','（她醒了，抓住你的袖子）……小三子？你见过我家小三子吗？'],['我','他在京城。回春堂。他一直在找你。'],['柳河村的李大娘','（她捂着脸，哭不出声音）……']]}]; };
for(const [i,id] of ['dg_p0','dg_p1','dg_p2','dg_p3'].entries()) Object.defineProperty(MAPS.jc_digong.objects.find(o=>o.id===id),'look',{get(){ return A4.PRIS()[i].look; }});
// the guards: men in black, who fight like the 宗庙's own
{ const R={name:'黑衣人', look:{g:'m',skin:1,hair:0,hairColor:0,style:'jin',cloth:5,face:'mid'}, hp:1500, atk:46, def:13, moves:['cut','fu','sweep','cut'], sub:'宗庙 · 守门的人'};
  RIVAL.dg_guard=R; BEASTS.c3r_dg_guard={name:R.name, spr:'c3r_dg_guard', person:true, big:true, boss:true, hp:R.hp, atk:R.atk, def:R.def, exp:200, stones:[80,80], moves:R.moves, lore:R.sub};
  DODGE.c3r_dg_guard=Object.fromEntries(R.moves.map(k=>[k,RIVAL_PAT[k]]));
  SCENES.c3r_dg_guard={...SCENES.qiongqi, sky:['#0a0a10','#14141c','#1e1e28'], moon:'#c86a3a', hills:['#1a1a20','#141418','#0e0e12','#08080a'], fx:null, title:'黑衣人', sub:'宗庙地宫', ink:'#05050a'}; }
A4.guard=k=>{ UI.say([['黑衣人','……什么人！'],{choice:'拔剑？', options:[{text:'拔剑', fn:()=>Battle.start('c3r_dg_guard',r=>{ if(r!=='win') return UI.say([['旁白','你被打退了几步。顾长歌和大师姐扶住你。'],['顾长歌','歇一口气，再来。']]);
      A4.st()[k]=true; if(k==='g2') S.flags.c3_dg_key=true; save(); C3.sync&&C3.sync(); UI.say(k==='g2'?[['旁白','黑衣人倒下了。他的腰上挂着一串铜钥匙。'],['旁白','（得到牢门的钥匙。）']]:[['旁白','黑衣人倒下了。']],()=>{ UI.hud(); Story.check(); }); })},{text:'等一下', fn:()=>{}}]}]); };
A4.cell=i=>{ const a=A4.st(); if(!S.flags.c3_dg_key) return UI.say([['旁白','铁栏杆，上了锁。钥匙在守卫身上。']]);
  a.open=a.open||[]; if(!a.open.includes(i)){ a.open.push(i); save(); C3.sync&&C3.sync(); UI.say([['旁白','钥匙「咔」地一转，牢门开了。']]); } };
A4.wake=i=>{ const a=A4.st(), p=A4.PRIS()[i]; if(!(a.open||[]).includes(i)) return UI.say([['旁白','隔着铁栏杆，一个人躺在稻草上，额头上贴着画镜子的符，一动不动。']]);
  if(!count(S,'c3_xingshen')) return UI.say([['旁白','醒神汤用完了。']]);
  UI.say([['旁白','你揭掉他额头上的符，把醒神汤凑到他鼻子底下。'],...p.lines,{run:()=>{ addItem('c3_xingshen',-1); a.woke.push(i); save(); }},
    ...(a.woke.length>=3?[['何满仓','（他把醒过来的人一个一个扶起来）我、我带他们从水门出去！'],['何满仓','你们……小心。'],['旁白','（里面的铁栏杆，不知道被谁打开了。）'],{run:()=>{ a.woke.length=Math.max(a.woke.length,4); }}]:[])],()=>{ C3.sync&&C3.sync(); UI.hud(); Story.check(); }); };

/* ---------- the 鼎: the last look, the 国师, 萧烬 ---------- */
A4.ding=()=>{ const c=C3.st(); UI.say([
  ['旁白','地宫最深处，一只青铜大鼎，比一间屋子还高。鼎腹上铸着一张兽脸，只有嘴，没有身子。'],
  ['旁白','鼎底下烧着火。鼎里，黑水咕嘟咕嘟地冒着泡。'],
  {choice:`用八卦镜照鼎？（还能照 ${c.bagua} 次）`, options:[{text:'照', fn:()=>UI.say(A4.reveal(),()=>A4.face())},{text:'先不', fn:()=>{}}]}]); };
A4.reveal=()=>[
  {run:()=>{ C3.st().bagua=Math.max(0,C3.st().bagua-1); JA10.cg(); }},
  ['旁白','镜面那一角亮了。镜子里，鼎底的黑水一点一点变清。'],
  ['旁白','水底下盘着一样东西。很大。比鼎还大，像是被硬塞进去的。'],
  ['旁白','它睁开了眼睛。是一张人的脸。'],
  ['旁白','「咔」的一声，八卦镜裂了一道缝。镜面暗了，再也没有亮起来。']];
A4.face=()=>{ const side=A4.loveOK(); UI.say([
  ['？？？','（鼎后面传来一声轻笑）……魁首。'],
  ['旁白','一个穿黑袍的人从鼎后面走出来。脸上戴着一张青铜面具，面具上是一张只有嘴的兽脸。'],
  ['国师','观天鉴说，你的灵根，是这一届里最好的。'],
  ['国师','老夫等你，等了好几天了。'],
  ['我','（……观天鉴。原来是挑「食材」用的。）'],
  ['顾长歌','（他的剑在发抖）……是你。'],
  ['顾长歌','十年前。那一夜。废墟中间站着的人，就是这张脸。'],
  ['国师','（他歪了歪头）十年前？吃过的门派太多，记不清了。'],
  ['旁白','鼎的影子里，又走出来一个人。灰白的长发，一身玄衣。他身边蹲着一只红头的狼。'],
  ['我','……萧烬。'],
  ['萧烬','（他看着你，神色很平静）嗯。'],
  ['我','你一直都知道？'],
  ['萧烬','一直都知道。'],
  ['萧烬','人？人吃人，跟我有什么关系。'],
  ['萧烬','杀我娘的，就是人。'],
  ['旁白','他说完，看着你。看了很久。'],
  ['萧烬','……可是你在乎。'],
  ...(side?[
    ['萧烬','（他慢慢走过来，站到了你身边。红头的狼跟着他，冲国师龇起了牙）'],
    ['萧烬','我不在乎他们。'],
    ['萧烬','我在乎你。'],
    ['国师','（面具底下传来一声冷笑）……萧大人，你这是做什么？'],
    ['萧烬','做我想做的。'],
    {run:()=>{ S.flags.c3_xj_side=true; Social.add('xiao',60); }}]:[
    ['萧烬','（他转过身）这是你们的事。'],
    ['旁白','他走进了黑暗里。红头的狼回头看了你一眼，跟着他走了。'],
    {run:()=>{ S.flags.c3_xj_left=true; }}]),
  ['旁白','顾长歌和萧烬，第一次面对面。'],
  ...(side?[['顾长歌','……你是国师的人。'],['萧烬','是过。'],['萧烬','灭你师门的，不是我。'],['顾长歌','我知道。'],['旁白','两个人都没有再说话。他们都看向你。']]
    :[['顾长歌','（他看着萧烬走掉的方向）……他是国师的人。'],['顾长歌','可灭我师门的，不是他。'],['旁白','顾长歌看向你。']]),
  ['国师','（他忽然笑了起来，笑声在地宫里撞来撞去）好，好，好。'],
  ['国师','既然都来了——'],
  ['旁白','他一掌拍在鼎上。'],
  ['旁白','青铜大鼎「嗡」地响了一声，鼎腹上那张兽脸，裂开了一道缝。'],
  ['旁白','黑水从裂缝里涌出来。水里，有什么东西，正在往外爬。'],
  {run:()=>{ PixCG.close(); S.flags.c3_a4_done=true; save(); }},
  ['旁白','（第四幕「人吃人」完。）']],()=>{ UI.hud(); Story.check(); setTimeout(()=>YY.go(),400); }); };

/* ---------- talking, hooks ---------- */
A4.TALK={
  ge:()=>S.flags.c3_a4_go?[['顾长歌','跟紧我。']]:S.flags.c3_a4_plan?A4.go():[['顾长歌','（他看着宗庙的方向）……']],
  c3_man:()=>S.flags.c3_a4_go?[['何满仓','（他咬着牙）我、我没事。'],['何满仓','这股饿……是从最里面传出来的。']]:[['何满仓','{称}……'],['何满仓','我在北边，每天夜里都梦见一口锅。好大的锅。'],['何满仓','锅里，有人在喊饿。']],
};
On.talk(id=>{ const m=RT.mapId; if(m!=='jc_digong'&&!(m==='jc_sifang'&&['ge','c3_man'].includes(id)&&S.flags.c3_a3_done)) return false;
  if(m==='jc_digong'){ const a=A4.st();
    if(id==='dg_g1') return A4.guard('g1'), true;
    if(id==='dg_g2') return A4.guard('g2'), true;
    const p=['dg_p0','dg_p1','dg_p2','dg_p3'].indexOf(id); if(p>=0) return A4.wake(p), true;
    if(id==='xie'){ C3.menu('xie',[['谢霁月','（她的剑一直没有入鞘）……我在你后面。']]); return true; } }
  const L=A4.TALK[id]; if(!L) return false; const l=typeof L==='function'?L():L; UI.say(l,()=>{ UI.hud(); Story.check(); }); return true; });
On.act('dgbars',o=>A4.cell(o.cell));
On.act('dginner',o=>UI.say([['旁白','一道铁栏杆横在路上。后面就是那股铁锈味最浓的地方。'],['旁白','（先把被关的人救出来。）']]));
On.act('dgding',o=>!S.flags.c3_a4_done?A4.ding():!S.flags.c3_a5_win?YY.go():UI.say([['旁白','鼎底下的火灭了。鼎上那张兽脸，闭着嘴。']]));
// the sifang talk handler owns 顾长歌 there only for this act; make sure it is reachable from it
{ const _t=XF.talk; XF.talk=id=>{ if(['ge','c3_man'].includes(id)&&S.flags.c3_a3_done){ const L=A4.TALK[id]; UI.say(L(),()=>{ UI.hud(); Story.check(); }); return true; } return _t(id); }; }

/* ---------- the quests ---------- */
{ const q=QUESTS.find(q=>q.id==='c3o'); Object.assign(q,{check:s=>!!s.flags.c3_a4_done,
    progress:s=>{ const F=s.flags, a=A4.st(); if(!F.c3_a4_plan) return '天亮了'; if(!F.c3_a4_go) return '入夜，找顾长歌：坐船去宗庙的水门';
      return !a.g1?'地宫：打倒石阶上的守卫':!a.g2?'地宫：打倒里面的守卫，拿钥匙':a.woke.length<4?`打开牢门，用醒神汤叫醒被关的人 ${a.woke.length}/4`:'地宫最深处：鼎'; },
    target:s=>{ const F=s.flags, a=A4.st(); if(!F.c3_a4_go) return ['jc_sifang',16,14,'顾长歌'];
      if(!a.g1) return ['jc_digong',13,16,'守卫']; if(!a.g2) return ['jc_digong',14,10,'守卫'];
      if(a.woke.length<4){ const i=[0,1,2,3].find(i=>!a.woke.includes(i)), [x,y]=[[11,8],[11,13],[16,8],[16,13]][i]; return ['jc_digong',x,y,'牢门']; }
      return ['jc_digong',13,5,'鼎']; }}); }
QUESTS.splice(QUESTS.findIndex(q=>q.id==='c3o')+1,0,
  {id:'c3p', title:'第五幕 · 鼎', desc:'青铜大鼎裂开了。黑水里，有什么东西在往外爬。', check:s=>false, progress:s=>'（第五幕正在做）', target:s=>['jc_digong',13,5,'鼎']});
