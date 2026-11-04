/* ============================================================
   山海问道 · 第三章「京城」 · 第二幕 · 小巷：遇见萧烬 — the night after 结丹 you can't sleep. Past curfew you go out, through
   西市 and under the 牌坊 into the alleys. At the end of the lane a young man in a plain robe is crouched by the wall
   feeding a lame stray; a red-headed wolf sits on the wall above him. Without turning round he says your name: "you look
   younger than in the mirror". He has a white bone ring on his finger. The ridge, the 雅间 — and he says his name: 萧烬.
   萧大人: the curfew, 安平村's notice, the sedan. Then the night watch is coming, and he goes over the wall with the wolf.
   Tomorrow, the 大比 opens.
   The map: a narrow lane winding north between high plastered walls, washing on lines, a well, broken baskets, a lantern
   or two; open by day too (no one there but the dog).
   ============================================================ */
{ const W=12, H=26, G=[...Array(H)].map(()=>Array(W).fill('Q'));
  const lane=y=>y>=19?[5,7]:y>=13?[3,5]:y>=7?[6,8]:[3,8];          // the lane jogs left, then right, then opens into a little dead end
  for(let y=1;y<H;y++){ const [a,b]=lane(y); for(let x=a;x<=b;x++) G[y][x]='P'; }
  for(const [y,a,b] of [[19,3,7],[13,3,8],[7,3,8]]) for(let x=a;x<=b;x++) G[y][x]='P';   // the corners, where it turns
  for(let y=0;y<H;y++) for(let x=0;x<W;x++) if(G[y][x]==='Q'&&y+1<H&&G[y+1][x]==='P') G[y][x]='R';   // a wall's face wherever the lane runs below it
  const objects=[
    {type:'lantern', x:8, y:16}, {type:'lantern', x:2, y:9},
    {type:'well', x:7, y:3, act:'xxwell'},
    {type:'jc_barrels', x:3, y:16, spr:'jc_barrels'}, {type:'jc_barrels', x:8, y:10, spr:'jc_barrels'},
    {type:'jc_dog', x:4, y:4, spr:'jc_dog', act:'xxdog'},
    {type:'jc_wolfs', x:5, y:0, spr:'jc_wolfs', cond:s=>XX.night(s)&&!s.flags.c3_xj_met},
    {type:'npc', id:'xiao', x:5, y:4, look:LOOK_XIAO, name:'穿素衣的年轻人', act:'talk', cond:s=>XX.night(s)&&!s.flags.c3_xj_met},
  ];
  MAPS.jc_xiang={ name:'京城 · 小巷', w:W, h:H, ground:G.map(r=>r.join('')), objects, exits:[{x:5,y:25,to:'jc_xishi',tx:15,ty:1},{x:6,y:25,to:'jc_xishi',tx:15,ty:1},{x:7,y:25,to:'jc_xishi',tx:16,ty:1}] }; }
const XX={ night:s=>!!s.flags.c3_jd_done&&(s.min>=21*60||s.min<4*60) };
// the lane north of 西市 opens once you have 结丹 (the barriers go; the way under the 牌坊 leads here)
for(const o of MAPS.jc_xishi.objects) if(o.way==='xiang') o.cond=s=>!s.flags.c3_jd_done;
MAPS.jc_xishi.exits.push({x:15,y:0,to:'jc_xiang',tx:6,ty:24},{x:16,y:0,to:'jc_xiang',tx:6,ty:24});
NPCS.xiao={name:'萧烬', romance:true, loves:['jc_bao'], likes:['wine','hide','jc_hulu'], hates:['flower','huichun']};
TALK.xiao=[['……','你又来了。'],['京城的狗，比人老实。','你身上有雷的味道。还没散。'],['那条狗的腿好了。你要不要去看看？','我小时候，也是这样被人喂过的。……不是人。'],['你在乎的东西，太多了。','……我在学。']];
Object.assign(JC.CHAT,{xiao:['……']});

/* ---------- the night: you can't sleep ---------- */
// (called from 四方馆's room handler, which owns the doors there)
XX.room=()=>UI.say([['旁白','你躺下了。丹田里那颗珠子一圈一圈地转，热乎乎的，怎么也睡不着。'],['旁白','窗外，月亮很亮。'],
  {choice:'出去走走？（宵禁了）', options:[{text:'悄悄出去走走', fn:()=>XX.out()},{text:'睡觉', fn:()=>sleep(false)}]}]);
XX.out=()=>{ C3.move('jc_xiang',6,24,'up',23,()=>setTimeout(()=>UI.say([['旁白','你翻过四方馆的后墙，穿过空荡荡的西市，钻进了牌坊北边的巷子。'],['旁白','巷子很深，七拐八拐的。尽头好像有人。']],()=>{ UI.hud(); Story.check(); }),400)); };
On.enter(id=>{ if(id==='jc_xiang'&&!XX.night(S)&&!S.flags.c3_xx_day){ S.flags.c3_xx_day=true; setTimeout(()=>UI.say([['旁白','白天的小巷里没有人。只有一条瘸了腿的黄狗，趴在墙根下晒太阳。']]),500); } });

/* ---------- 萧烬 ---------- */
// three parts: what he says first; then you ask him something (or don't); then his name, and the watch coming
XX.meet=()=>UI.say([
  {run:()=>C3A.xiangCG()},
  ['旁白','巷子尽头，一个穿玄色素衣的年轻人蹲在墙根下，正把一个包子掰开，喂给一条瘸了腿的黄狗。他的头发没有束，灰白的，垂到腰上。'],
  ['旁白','墙头上蹲着一只狼。狼的头是红的。它低头看着你，没有动。'],
  ['穿素衣的年轻人','（他头也不回）{名}。'],
  ['穿素衣的年轻人','你比镜子里看起来，要小一些。'],
  {choice:'……', options:[{text:'你认识我？', fn:()=>XX.meet2()},{text:'（手按在剑上）', fn:()=>XX.meet2()}]}]);
XX.meet2=()=>UI.say([
  ['旁白','他站起来，拍了拍手上的包子屑，转过身。'],
  ['旁白','是一张很年轻的脸。笑起来很温和，像是隔壁人家的读书人。'],
  ['旁白','他的手指上，套着一枚白骨扳指。'],
  ...(S.flags.c3_ju_won?[['我','（……聚宝楼，雅间里的那只手。）']]:[]),
  ['穿素衣的年轻人','山脊上，见过一回。'],
  ...(S.flags.c3_ju_won?[['穿素衣的年轻人','聚宝楼，也算见过一回。那株草，好用吗？']]:[]),
  ['穿素衣的年轻人','今晚的雷，劈了一炷香。整个京城都看见了。'],
  ['穿素衣的年轻人','……结丹了啊。'],
  ['旁白','黄狗吃完了包子，一瘸一拐地蹭着他的腿。'],
  ['穿素衣的年轻人','它的腿，是人打断的。'],
  ['穿素衣的年轻人','人就是这样。'],
  {choice:'你想问他：', options:[
    {text:'你为什么要帮我？', fn:()=>XX.meet3('why')},
    {text:'安平村的人，是你带走的？', fn:()=>XX.meet3('anping')},
    {text:'（什么也不问）', fn:()=>XX.meet3('none')}]}]);
XX.meet3=a=>{ XX.st().ask=a; UI.say([...XX.answer(),
  ['穿素衣的年轻人','我叫萧烬。'],
  ['我','……萧？'],
  ['我','（宵禁的告示。安平村的封条，落款「钦差　萧」。朱雀大街上那顶轿子上的「萧」字……）'],
  ['萧烬','（他好像知道你在想什么，笑了一下）嗯。就是那个萧。'],
  ['旁白','远处传来梆子声，还有脚步声。巡夜的兵丁往这边来了。'],
  ['萧烬','巡夜的快到了。……回去吧。'],
  ['萧烬','明天大比开幕。'],
  ['萧烬','我会看着你的。'],
  ['旁白','他一撑墙头，翻了上去。红头的狼跟在他身后，一眨眼，就不见了。'],
  ['旁白','只剩那条瘸腿的黄狗，坐在月光里，冲你摇了摇尾巴。'],
  {flag:'c3_xj_met'}],()=>XX.back()); };
XX.st=()=>{ const c=C3.st(); c.xj=c.xj||{hate:0}; return c.xj; };
XX.answer=()=>{ const a=XX.st().ask; return a==='why'?[
    ['穿素衣的年轻人','（他想了一会儿）……不知道。'],['穿素衣的年轻人','那天在山脊上，你的狼打得很狠，可是你没有杀它。'],['穿素衣的年轻人','我想看看，你是个什么样的人。'],{love:{xiao:40}}]
  :a==='anping'?[
    ['穿素衣的年轻人','（他看着你，看了很久）……是。'],['穿素衣的年轻人','你在乎？'],['旁白','你没有回答。他也没有再问。'],['穿素衣的年轻人','……有意思。'],{love:{xiao:20}},{run:()=>{ XX.st().hate+=10; S.flags.c3_xj_anping=true; }}]
  :[['旁白','你什么也没问。'],['穿素衣的年轻人','（他好像有点意外）……你不怕我。'],['穿素衣的年轻人','很少有人不怕我。'],{love:{xiao:30}}]; };
On.talk(id=>{ if(RT.mapId!=='jc_xiang'||id!=='xiao') return false; if(!S.flags.c3_xj_met){ XX.meet(); return true; } return false; });
// the watch is coming: back over the wall, and to bed
XX.back=()=>{ PixCG.close(); const [x,y]=SF_WING[S.sect]; C3.move('jc_sifang',x+3,y+3,'up',23.6,()=>UI.say([['旁白','你翻回四方馆的时候，大师姐的窗子还亮着。'],['旁白','你没有敲门。']],()=>{ UI.hud(); Story.check(); sleep(false); })); };
On.act('xxdog',o=>UI.say(S.flags.c3_xj_met?[['旁白','瘸腿的黄狗。它认得你了，冲你摇尾巴。'],...(count(S,'jc_bao')?[{choice:'喂它一个包子？', options:[{text:'喂', fn:()=>{ addItem('jc_bao',-1); UI.say([['旁白','它叼着包子，一瘸一拐地跑到墙根下，慢慢地吃。']]); }},{text:'不了', fn:()=>{}}]}]:[])]:[['旁白','一条瘸了腿的黄狗。']]));
On.act('xxwell',o=>UI.say([['旁白','一口老井。井沿被绳子磨出了一道一道的槽。']]));
On.theme(id=>id==='jc_xiang'?'night':null);
{ const _d=Portal.dests; Portal.dests=function(){ const l=_d.call(Portal); if(S.flags.c3_xj_met&&RT.mapId!=='jc_xiang') l.push({name:'京城 · 小巷', map:'jc_xiang', x:6, y:23}); return l; }; }

/* ---------- the quests ---------- */
{ const q=QUESTS.find(q=>q.id==='c3j'); Object.assign(q,{desc:'结丹了。离大比开幕，只剩一夜。', check:s=>!!s.flags.c3_xj_met,
    progress:s=>RT.mapId==='jc_xiang'?'巷子的尽头':'夜里，回厢房', target:s=>{ if(RT.mapId==='jc_xiang') return ['jc_xiang',5,5,'巷子尽头']; const [x,y]=SF_WING[s.sect]; return ['jc_sifang',x+3,y+3,'你们的厢房']; }}); }
QUESTS.splice(QUESTS.findIndex(q=>q.id==='c3j')+1,0,
  {id:'c3k', title:'大比开幕', desc:'萧烬说：明天大比开幕，他会看着你。', check:s=>false,
    progress:s=>'大比开幕式（之后的剧情正在做）', target:s=>['jc_sifang',12,10,'大师姐']});
