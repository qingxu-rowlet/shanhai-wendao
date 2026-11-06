/* ============================================================
   山海问道 · 第三章「京城」 · 礼部 — west off the square before the 贡院 (open once the 大比 has begun): the ministry's front
   yard. The hall under its plaque, stone lions, the notice board where the bracket, the results and every decree go up;
   the records room where a 主事 keeps the entrants' register; the carriage shed with the black-hooded carriage that takes
   the losers "home"; and the 登闻鼓, the petition drum, where an old woman comes every day about her son.
   What changes as the story goes: the board (the bracket → 「败者已送归本宗」 → 大师姐's confinement, which you can tear
   down → 「萧大人平妖」); the carriage wheels, once you know to look, have red clay on them — only the ground behind the
   宗庙 is red; for 50 灵石 the 主事 lets you see the register, where every loser's name has a tiny 「宗」 by it; and if you
   beat the drum for the old woman, the 礼部 sends you to the 刑部 and the 刑部 sends you back. After it's over, her son
   is among the people let out.
   ============================================================ */
{ const W=24, H=18, G=[...Array(H)].map((_,y)=>[...Array(W)].map((_,x)=>y<=1?(y===1?'R':'Q'):y===H-1||x===0?'Q':'P'));
  const roofs={grey:['#22262c','#2e343c','#3e4650','#68727e'], green:['#1c3028','#28423a','#36584c','#5e8a78'], brown:['#2c2018','#3e2e22','#56402e','#86684c']};
  const P=(id,x,y,name,look)=>({type:'npc', id, x, y, look, name, act:'talk'});
  const objects=[
    {type:'building', x:7, y:2, w:10, h:4, style:'shop', roof:roofs.green, label:'礼部 · 大堂', door:[12,6], act:'lbhall', fa:{storeys:2, wall:'brick', sign:'礼部', signBg:'#1a1410', signInk:'#e8c870', pillar:'#8a2a22', windows:false, roof:roofs.green}},
    {type:'building', x:1, y:2, w:5, h:3, style:'shop', roof:roofs.grey, label:'档房', door:[3,5], act:'lbdang', fa:{wall:'plaster', sign:'档房', pillar:'#3a3632', deco:['scrolls'], roof:roofs.grey}},
    {type:'building', x:18, y:2, w:5, h:3, style:'shop', roof:roofs.brown, label:'车棚', door:[20,5], act:'lbshed', fa:{wall:'wood', sign:'车马', open:true, windows:false, roof:roofs.brown}},
    {type:'jc_lion', x:10, y:7, spr:'jc_lionL'}, {type:'jc_lion', x:14, y:7, spr:'jc_lionR'},
    {type:'yj_cart', x:20, y:8, spr:'yj_cart', act:'lbcart', fw:1},
    {type:'jc_board', x:12, y:11, spr:'jc_board', act:'lbboard', fw:1},
    {type:'jc_drum', x:4, y:9, spr:'jc_drum', act:'lbdrum'},
    {type:'jc_willow', x:2, y:14, spr:'jc_willow'}, {type:'jc_willow', x:21, y:14, spr:'jc_willow'},
    {type:'lantern', x:8, y:7}, {type:'lantern', x:16, y:7},
    P('lb_menzi',12,8,'门子',{g:'m',skin:2,hair:0,hairColor:0,style:'jin',cloth:7,face:'mid'}),
    P('lb_zhushi',3,7,'档房主事',{g:'m',skin:1,hair:0,hairColor:1,style:'robe',cloth:2,face:'small',beard:'#4a3a2a'}),
    P('lb_chefu',18,9,'车夫',{g:'m',skin:3,hair:0,hairColor:3,style:'jin',cloth:5,face:'mid',beard:'#8a847a'}),
    P('lb_laofu',5,11,'告状的老妇',{g:'f',skin:2,hair:3,hairColor:3,style:'qun',cloth:5,face:'small'}),
    P('lb_shuli',15,12,'抄告示的书吏',{g:'m',skin:0,hair:2,hairColor:0,style:'robe',cloth:4,face:'small'}),
  ];
  MAPS.jc_libu={ name:'京城 · 礼部', w:W, h:H, ground:G.map(r=>r.join('')), objects, exits:[{x:23,y:12,to:'jc_gongyuan',tx:1,ty:15},{x:23,y:13,to:'jc_gongyuan',tx:1,ty:16}] }; }
// the square before the 贡院 opens west onto the 礼部's yard
{ const m=MAPS.jc_gongyuan; m.ground=m.ground.map((r,y)=>y===15||y===16?'P'+r.slice(1):r);
  m.exits.push({x:0,y:15,to:'jc_libu',tx:22,ty:12},{x:0,y:16,to:'jc_libu',tx:22,ty:13}); }
On.theme(id=>id==='jc_libu'?'calm':null);

const LB={
  st(){ const c=C3.st(); c.lb=c.lb||{}; return c.lb; },
  CHAT:{lb_menzi:['礼部重地！'], lb_zhushi:['（他在翻名册）'], lb_chefu:['……'], lb_laofu:['青天大老爷……'], lb_shuli:['（他在写字）']},
  stage:()=>S.flags.c3_a5_win?'after':S.flags.c3_xf_in?'clue':S.flags.c3_lt_done?'done':'lt',
  confined:()=>S.flags.c3_xf_in&&!S.flags.c3_a4_done,
};
Object.assign(JC.CHAT,LB.CHAT);

/* ---------- the notice board ---------- */
On.act('lbboard',o=>{ const s=LB.stage(), c=LB.st();
  if(s==='lt') return UI.say([['旁白','告示栏上贴着大比的对阵表，红笔勾着每一场的胜负。'],['旁白','底下一行小字：「败者，由礼部车马送归本宗。」']]);
  if(s==='done') return UI.say([['旁白',`告示栏上，红纸黑字：「四宗大比魁首：${sectName()}，${S.name}。」`],['旁白','旁边一张：「败者四人，已由礼部车马送归本宗。」']]);
  if(s==='after') return UI.say([['旁白','告示栏换了新的：「宗庙妖患，已由钦差萧大人平定。」'],['旁白','「失踪人等，悉数寻回。国师为国祈福，闭关静修。」'],
    ['我','（国师闭关……）'],['抄告示的书吏','（他在旁边小声说）……写的人不信，看的人也不信。可是都得这么写。']]);
  const torn=c.tear===S.day;
  UI.say([['旁白','「败者四人，已由礼部车马送归本宗。」'],['我','（……没有一个回去。）'],
    ...(torn?[['旁白','你撕下来的那张告示的地方，空着一块。']]:[
    ['旁白','旁边新贴了一张：「谢霁月，涉京城流言一案，禁足四方馆，听候发落。」'],
    ['旁白','有人在「谢霁月」三个字旁边，用炭笔画了一只狐狸。'],
    {choice:'你——', options:[{text:'把它撕下来', fn:()=>LB.tear()},{text:'（算了）', fn:()=>{}}]}])]); });
LB.tear=()=>{ const c=LB.st(), first=!c.torn; c.tear=S.day; c.torn=(c.torn||0)+1; save();
  UI.say([['旁白','你把那张告示撕了下来，揉成一团。'],['门子','（他从门洞里冲出来）干什么！礼部的告示也敢撕——'],['门子','（他看清了你，愣了一下）……魁首？'],
    ['门子','（他压低声音）……撕了也没用，明儿一早还得贴一张新的。'],
    ...(first?[['门子','……可这只狐狸，不是我画的。'],{love:{xie:40}},{flag:'c3_lb_tear'}]:[['门子','你又来了。']])],()=>{ UI.hud(); Story.check(); }); };

/* ---------- the carriage ---------- */
On.act('lbcart',o=>{ if(!S.flags.c3_xf_in) return UI.say([['旁白','车棚底下停着一辆马车，黑篷，没有灯。'],['车夫','（他在给马刷毛，没抬头）']]);
  UI.say([['旁白','黑篷马车。就是每天夜里停在四方馆门口的那一辆。'],['旁白','你蹲下来看车轮。轮辐的缝里，结着一层干了的泥。'],['旁白','红的。'],
    ['我','（京城的路，铺的都是青石板。）'],['我','（只有东边，宗庙后墙外头那一片，是红泥地。）'],...(S.flags.c3_lb_mud?[]:[{flag:'c3_lb_mud'}])]); });
On.act('lbshed',o=>UI.say([['旁白','车棚里拴着两匹黑马，草料槽是满的。'],['旁白','马蹄铁是新钉的。这辆车，跑得很勤。']]));

/* ---------- the drum ---------- */
On.act('lbdrum',o=>{ const s=LB.stage();
  if(s==='after') return UI.say([['旁白','登闻鼓。鼓面上落了一层灰。']]);
  if(S.flags.c3_lb_drum) return UI.say([['旁白','登闻鼓。鼓槌就挂在边上。'],['我','（礼部推刑部，刑部推礼部。再敲也没有人出来。）']]);
  UI.say([['旁白','登闻鼓。告御状的鼓，鼓面破了一个小洞。'],['旁白','那个老妇人每天都来，敲三下，等一天，回去。'],
    {choice:'替她敲？', options:[{text:'敲', fn:()=>LB.drum()},{text:'不了', fn:()=>{}}]}]); });
LB.drum=()=>UI.say([['旁白','咚——咚——咚——'],['旁白','鼓声在院子里荡开。过了很久，门子才慢吞吞地走出来。'],
  ['门子','又是谁？……哟，魁首。您也告状？'],['我','有人不见了。很多人。'],
  ['门子','不见了，那是刑部的事。礼部管的是礼。'],['我','去过刑部了吗？'],['告状的老妇','（她拽住你的袖子）去过了，去过了！刑部的老爷说，失踪的人里有大比的弟子，大比是礼部办的，归礼部管……'],
  ['门子','（他叹了口气）……您看，就是这么回事。'],['门子','（他看了看左右，声音更低了）萧大人的案子，谁也不接。您也别敲了。'],
  {flag:'c3_lb_drum'},['告状的老妇','（她攥着你的袖子没放）……我儿子叫王二，卖炭的。左边眉毛上有颗痣。'],['告状的老妇','你要是……见着了……']],()=>{ UI.hud(); Story.check(); });

/* ---------- talking ---------- */
LB.TALK={
  lb_menzi:()=>({lt:[['门子','礼部重地，闲人免进。'],['门子','大比的事？对阵表贴在告示栏上，自己看。']],
    done:[['门子','（他满脸堆笑）魁首！恭喜恭喜！'],['门子','赏？赏赐要等大比全完了，礼部尚书亲自送到四方馆。']],
    clue:LB.confined()?[['门子','（他看见你，笑容收了一半）……魁首，您师姐的事，礼部也是奉命。'],['门子','奉谁的命？……您别问我。']]:[['门子','（他朝东边努了努嘴）……事情了了？了了就好。']],
    after:[['门子','（他在打瞌睡）……啊？大人们都在里头写奏折。写的都是同一件事：萧大人平妖。']]}[LB.stage()]),
  lb_zhushi:()=>{ const s=LB.stage();
    if(s==='lt'||s==='done') return [['档房主事','四宗弟子的名册，都在老夫这儿。籍贯、师承、灵根、修为……'],['档房主事','观天鉴照过的，一样一样，都记着。'],['我','（……记这些做什么？）']];
    if(s==='after') return [['档房主事','（他把那本名册锁进了柜子）这本，不用再记了。'],['档房主事','上面让烧。老夫……没舍得。']];
    if(S.flags.c3_lb_ce) return [['档房主事','（他看都不看你）老夫什么都没给你看过。']];
    return [['档房主事','名册？名册不能给外人看。'],{choice:'你——', options:[
      {text:'塞给他 50 灵石', fn:()=>{ if(S.stones<50) return UI.say([['档房主事','（他掂了掂你递过来的那点灵石，又推了回来）……']]); S.stones-=50; UI.hud(); LB.ce(); }},
      {text:'算了', fn:()=>{}}]}]; },
  lb_chefu:()=>S.flags.c3_xf_in?[['车夫','（他是个哑巴。你问他夜里马车去哪儿，他看了你很久）'],['车夫','（他拿马鞭在地上写了一个字，又用脚抹掉了）'],['我','（……「宗」。）']]
    :[['车夫','（他是个哑巴。他冲你比划了一下：吃了吗）']],
  lb_laofu:()=>{ if(LB.stage()==='after') return S.flags.c3_lb_drum?[['告状的老妇','（她看见你，扑过来，攥住你的手）回来了！我儿子回来了！'],['告状的老妇','瘦得不成人样了，眉毛上那颗痣还在……'],['告状的老妇','（她往你手里塞了两个烤红薯，还是热的）'],{flag:'c3_lb_son'}]
      :[['告状的老妇','（她今天没有敲鼓。她坐在台阶上，笑着跟人说话）……我儿子回来了。']];
    return [['告状的老妇','（她坐在登闻鼓边上，抱着一个包袱）'],['告状的老妇','我儿子王二，卖炭的。上个月去城东送炭，就再没回来。'],
      ['告状的老妇','我每天来敲三下。老爷们总会出来的吧。'],...(S.flags.c3_lb_drum?[['告状的老妇','……你替我敲过了。我记着。']]:[])]; },
  lb_shuli:()=>[['抄告示的书吏','（他头也不抬）告示一天抄十张，贴出去，第二天又换。'],
    ...(LB.confined()?[['抄告示的书吏','那张禁足的告示……'],['抄告示的书吏','（他停下笔）狐狸不是我画的。可是我也没擦。']]:[['抄告示的书吏','写的人不信，看的人也不信。']])],
};
LB.ce=()=>UI.say([['档房主事','（他把灵石拢进袖子，咳了一声，把名册往你这边推了推，转身去倒茶）'],
  ['旁白','名册一页一页，写着四宗弟子的名字、籍贯、灵根、修为。观天鉴照出来的，一样不落。'],
  ['旁白','大比输了的人，名字边上都画着一个小小的记号。'],
  ['旁白','「宗」。'],
  ...(XF.st().clue.ledger?[['我','（……和千金坊暗账上的记号，一模一样。）']]:[['我','（「宗」……是宗庙的宗。）']]),
  ['旁白','你又往前翻了几页。上一届大比的名册也在这里。'],
  ['旁白','上一届输了的人，名字边上，也有这个记号。'],
  ['我','（……上一届就开始了。）'],
  {flag:'c3_lb_ce'}],()=>{ UI.hud(); save(); Story.check(); });
On.talk(id=>{ if(RT.mapId!=='jc_libu') return false; const L=LB.TALK[id]; if(!L) return false; UI.say(typeof L==='function'?L():L,()=>{ UI.hud(); Story.check(); }); return true; });
On.act('lbhall',o=>UI.say(LB.stage()==='after'?[['旁白','大堂里人来人往，每张桌子上都摊着奏折。'],['门子','闲人免进。']]
  :[['旁白','礼部大堂。门口立着「肃静」「回避」两块牌子。'],['门子','闲人免进！有事去档房。']]));
On.act('lbdang',o=>Story.talk('lb_zhushi'));
