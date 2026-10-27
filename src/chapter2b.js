/* ============================================================
   山海问道 · 第二章 第二幕「秘境」 — the four of them camp in the 秘境. Three days of chores at the camp and in the 雾林,
   and each night something is a little more wrong: half the food gone, wings beating outside the tents, 大师兄's handwriting
   going crooked, footsteps leaving in the dark. On the fourth morning 大师兄 is gone; a bloodied white feather lies in his tent.
   The fog thickens every day.
   ============================================================ */
Object.assign(SPR, {
  mj_log:['................','................','................','................','..NNNNNNNNNNNN..','.NnnnnnnnnnnnnN.','NtTnnnnnnnnnnnnN','NTtnnNnnnnnNnnnN','.NnnnnnnnnnnnnN.','..NNNNNNNNNNNN..'],
  mj_woodpile:['................','................','................','.....NN.NN......','....NtTNtTN.....','...NNNNNNNNN....','..NtTNtTNtTN....','..NNNNNNNNNNN...','.NtTNtTNtTNtTN..','.NNNNNNNNNNNNN..'],
  mj_stump:['................','................','................','................','................','.....NNNNN......','....NtTtTtN.....','....NnnnnnN.....','....NnnnnnN.....','...NNnnnnnNN....'],
  mj_shroom:['................','................','................','................','................','................','...rr...........','..rwrr....rr....','..rrrr...rwrr...','...cc....rrrr...','...cc.....cc....'],
  mj_tent:['..........NN..........','.........NttN.........','........NtttTN........','.......NttttTTN.......','......NtttttTTTN......','.....NttttttkTTTN.....','....NtttttttkkTTTN....','...NttttttttkkkTTTN...','..NtttttttttkkkkTTTN..','.NttttttttttkkkkkTTTN.','NNNNNNNNNNNNNNNNNNNNNN'],
  mj_fire:['................','......y.........','.....yoy..y.....','....yoOoy.oy....','....oOrOo.oo....','...yorrroyo.....','....orrRro......','..nNnnnnnNnnn...','.NnnNnnnNnnnN...','..NNNNNNNNNN....'],
  mj_pot:['.....N....N.....','....N......N....','...N........N...','..N..EEEEEE..N..','..N.EeeeeeeE.N..','..N.EEEEEEEE.N..','.N..EEEEEEEE..N.','.N...EEEEEE...N.','N.....oyo......N','N....yorry.....N'],
  mj_stake:['..........','..........','....nn....','....nn....','..eeeeee..','..eEEEEe..','..eeeeee..'],
  mj_flag:['.nrrrrrr..','.nrRRrrr..','.nrrrrrr..','.nrrrr....','.n........','.n........','.n........','.n........','.n........','.N........','eeee......'],
  mj_bag:['................','.....TTT........','....TtttT.......','...TtttttT..www.','..TtttkttT.wwwwe','..TttkkktT..wwe.','...TtttttT......','....TTTTT.r.....'],
  mj_feather:['......w.','.....wwe','....wwe.','...wwe..','..wwe...','.wwe....','we.r....','.r......'],
});
Object.assign(ITEMS, {
  mj_feather:{name:'带血的白羽', icon:'i_feather', quest:true, keep:true, desc:'大师兄帐篷里留下的一根白羽，羽根上沾着血。'},
});

/* ---------- maps: the camp, and the 雾林 above it ---------- */
const MJ_CAMP=[
'WWWWWWWWWW==WWWWWWWWWW',
'W.........==.........W',
'W..::.....==......:..W',
'W.........==.........W',
'W....................W',
'W....................W',
'W....................W',
'W....................W',
'W....................W',
'W...................~W',
'W..................~~W',
'W.................~~~W',
'W..................~~W',
'W...................~W',
'W....................W',
'WWWWWWWWWWWWWWWWWWWWWW'];
const mjOn=s=>!!s.flags.c2_depart;
MAPS.mj_camp={ name:'秘境 · 营地', w:22, h:16, ground:MJ_CAMP,
  objects:[
    {type:'mj_tent', x:4, y:11, spr:'mj_tent', act:'mjtent', label:'你的帐篷'},
    {type:'mj_tent', x:12, y:3, spr:'mj_tent', act:'mjtent4', label:'二师兄的帐篷'},
    {type:'mj_tent', x:7, y:4, act:'mjtent2', label:'大师兄的帐篷', get spr(){ return (S&&S.c2&&S.c2.night||0)>=2?'mj_tent_torn':'mj_tent'; }},   // claw marks in the cloth from the third day
    {type:'mj_tent', x:15, y:4, spr:'mj_tent', act:'mjtent3', label:'大师姐的帐篷'},
    {type:'mj_fire', x:10, y:8, act:'mjfire', get spr(){ return (S&&S.c2&&S.c2.night||0)>=2?'mj_fire_low':'mj_fire'; }},   // the fire burns lower each night
    {type:'mj_pot', x:12, y:9, spr:'mj_pot', act:'mjpot'},
    {type:'c2_portal', x:2, y:14, spr:'c2_portal', act:'portal'},
    ...[[3,2],[18,3],[6,14]].map(([x,y],i)=>({type:'mj_stake', x, y, act:'mjflag', fi:i, get spr(){ const m=S&&S.c2&&S.c2.p&&S.c2.p.mj; if(i===1&&(S&&S.c2&&S.c2.night||0)>=2) return 'mj_flagtorn'; return (S&&S.c2&&S.c2.n>3)||(m&&(m.flags||[]).includes(i))?'mj_flag':'mj_stake'; }})),
    {type:'npc', id:'lu',  x:9, y:6,  look:LOOK_LU,  name:'陆正衡', act:'talk', cond:s=>mjOn(s)&&!s.flags.lu_gone&&!(s.c2&&s.c2.night>=2)},   // from the third morning he keeps to his tent
    {type:'npc', id:'xie', x:13, y:6, look:LOOK_XIE, name:'谢霁月', act:'talk', cond:mjOn},
    {type:'npc', id:'man', x:11, y:10, look:LOOK_MAN, name:'何满仓', act:'talk', cond:mjOn},
    {type:'mj_log', x:13, y:11, spr:'mj_log'},{type:'mj_wood', x:6, y:9, spr:'mj_woodpile'},{type:'mj_stump', x:15, y:9, spr:'mj_stump'},{type:'mj_stump', x:8, y:12, spr:'mj_stump'},
    {type:'rock', x:16, y:13},{type:'bush', x:5, y:7},{type:'bush', x:15, y:7},{type:'mj_shroom', x:3, y:8, spr:'mj_shroom'},{type:'mj_shroom', x:17, y:6, spr:'mj_shroom'},
  ],
  exits:[{x:10,y:0,to:'mj_wood',tx:13,ty:20},{x:11,y:0,to:'mj_wood',tx:14,ty:20}]};
// the camp sits in a clearing: a thick wood all round its edges, flowers and long grass inside
{ const m=MAPS.mj_camp, G=m.ground.map(r=>r.split('')), R=rng(777);
  const keep=new Set(); const k=(x,y)=>keep.add(x+','+y);
  for(const o of m.objects){ k(o.x,o.y); for(const [dx,dy] of [[0,1],[1,0],[-1,0],[0,-1]]) k(o.x+dx,o.y+dy); }
  for(let y=0;y<4;y++){ k(10,y); k(11,y); k(9,y); k(12,y); }                          // the path north
  for(let y=8;y<=14;y++) for(let x=15;x<=18;x++) k(x,y);                            // the bank of the stream
  for(const [x,y] of [[10,12],[4,12],[3,14],[2,13],[10,9],[11,9]]) k(x,y);
  for(let y=1;y<m.h-1;y++) for(let x=1;x<m.w-1;x++){ if(keep.has(x+','+y)||G[y][x]!=='.'&&G[y][x]!==':') continue;
    const edge=Math.min(x-1,m.w-2-x,y-1,m.h-2-y);
    if(edge===0&&R()<.85||edge===1&&R()<.45) m.objects.push({type:R()<.55?'pine':'tree', x, y});
    else if(edge>=2&&R()<.12) G[y][x]=R()<.5?',':':'; }
  m.ground=G.map(r=>r.join(''));
  // keep a way open to the 传送阵 in the south-west corner (the edge trees had walled it in)
  const lane=new Set(['2,13','3,13','4,13','5,13','2,12','1,13','7,13','6,13']); m.objects=m.objects.filter(o=>!((o.type==='pine'||o.type==='tree')&&lane.has(o.x+','+o.y)));
  // and a trodden dirt path to it, so it reads as a way through
  { const G2=m.ground.map(r=>r.split('')); for(const [x,y] of [[8,12],[7,12],[6,12],[6,13],[5,13],[4,13],[3,13],[3,14]]) if(!m.objects.some(o=>o.x===x&&o.y===y)) G2[y][x]='='; m.ground=G2.map(r=>r.join('')); } }
// the 雾林: drawn by code so the rows stay square
{ const W=26, H=22, G=[...Array(H)].map((_,y)=>[...Array(W)].map((_,x)=>(x===0||y===0||x===W-1||y===H-1)?'W':'.'));
  for(let y=6;y<=20;y++) G[y][14]='=';
  for(let x=12;x<=15;x++){ G[2][x]='='; G[5][x]='='; } for(let y=2;y<=5;y++){ G[y][12]='='; G[y][15]='='; }
  G[21][13]='='; G[21][14]='='; G[20][13]='=';
  for(const [x0,y0] of [[5,1],[14,1],[3,5],[21,6],[6,7],[19,9],[19,12],[3,13],[8,15],[20,16],[3,18]]) for(let k=0;k<3;k++) if(G[y0][x0+k]==='.') G[y0][x0+k]=':';
  for(const [x,y] of [[4,9],[5,9],[6,9],[3,10],[4,10],[5,10],[6,10],[7,10],[4,11],[5,11],[6,11]]) G[y][x]='~';
  const ground=G.map(r=>r.join(''));
  const objects=[
    {type:'c2_stele', x:13, y:3, spr:'c2_stele', act:'mjstele'},
    {type:'mj_bag', x:21, y:15, spr:'mj_bag', act:'mjbag', cond:s=>C2.task('man')==='mjbag'&&s.c2.got.man===1&&!s.c2.p.mj.bag},
    {type:'gather', x:9, y:4, item:'lingcao', spr:'herbspot'},{type:'gather', x:18, y:3, item:'lingcao', spr:'herbspot'},{type:'gather', x:10, y:12, item:'lingcao', spr:'herbspot'},{type:'gather', x:17, y:18, item:'lingcao', spr:'herbspot'},
    {type:'gather', x:22, y:4, item:'zhuguo', spr:'fruitspot'},{type:'gather', x:3, y:16, item:'zhuguo', spr:'fruitspot'},{type:'gather', x:22, y:11, item:'zhuguo', spr:'fruitspot'},
    {type:'gather', x:8, y:18, item:'lingmo', spr:'mushspot'},{type:'gather', x:17, y:7, item:'lingmo', spr:'mushspot'},{type:'gather', x:2, y:7, item:'lingmo', spr:'mushspot'},
  ];
  // a dense wood: trees wherever nothing else stands
  const R=rng(4242), taken=new Set(objects.map(o=>o.x+','+o.y));
  for(let i=0;i<70;i++){ const x=1+(R()*(W-2)|0), y=1+(R()*(H-2)|0), k=x+','+y; if(G[y][x]!=='.'||taken.has(k)||Math.abs(x-14)<2||(y<7&&x>10&&x<17)) continue; taken.add(k); objects.push({type:R()<.6?'pine':'tree', x, y}); }
  MAPS.mj_wood={ name:'秘境 · 雾林', w:W, h:H, ground, objects, exits:[{x:13,y:21,to:'mj_camp',tx:10,ty:1},{x:14,y:21,to:'mj_camp',tx:11,ty:1}] };
  // after the night of the wings, nothing lives in the 雾林
  Object.defineProperty(MAPS.mj_wood,'spawns',{configurable:true, get(){ return S&&S.c2&&(S.c2.night||0)>=2?[]:[{kind:'dangkang', n:2, area:[2,8,12,19]},{kind:'xingxing', n:2, area:[16,8,24,19]},{kind:'guidiao', n:1, area:[2,1,10,6]}]; }});
}

/* ---------- three days of chores in the 秘境 (sets 3, 4, 5 after the sect's 0–2) ---------- */
const CAMP=(x,y,l)=>['mj_camp',x,y,l], WOOD=(x,y,l)=>['mj_wood',x,y,l];
C2_TASKS.lu.push(
  {id:'mjflags', title:'大师兄：插阵旗', ask:['营地四周有三处木桩。每处插一面阵旗，夜里有动静，阵旗会先知道。'], goal:'在营地四周的木桩上插三面阵旗', need:s=>(s.c2.p.mj.flags||[]).length>=3, prog:s=>`阵旗 ${(s.c2.p.mj.flags||[]).length}/3`,
    tgt:s=>{ const L=[[3,2],[18,3],[6,14]].find((_,i)=>!(s.c2.p.mj.flags||[]).includes(i)); return CAMP(L[0],L[1],'营地四周的木桩'); }, done:[['陆正衡','嗯。阵旗插得很正。'],['陆正衡','秘境不比宗门。夜里不要一个人出营地。']]},
  {id:'mjhunt', title:'大师兄：清理雾林', ask:['雾林里有妖兽靠近营地。去打退两只。','记住——除恶务尽。'], goal:'在雾林里打败 2 只妖兽', accept:s=>{ s.c2.p.mj.kb=s.st.kills||0; },
    need:s=>(s.st.kills||0)-(s.c2.p.mj.kb||0)>=2, prog:s=>`雾林妖兽 ${Math.min(2,(s.st.kills||0)-(s.c2.p.mj.kb||0))}/2`, tgt:s=>WOOD(8,14,'雾林里的妖兽'),
    done:[['陆正衡','……做得好。'],['旁白','他说「除恶务尽」的时候，眼睛望着雾林深处，好像在想别的事。']]},
  {id:'mjstele', title:'大师兄：去北边', ask:['（大师兄没有出来，只从帐篷里递出一张纸条。）'], note:true, goal:'去雾林北边的石碑看看', need:s=>!!s.c2.p.mj.stele, prog:s=>s.c2.p.mj.stele?'看过了':'还没去',
    tgt:s=>WOOD(13,3,'雾林北边的石碑'), done:[['旁白','你回到大师兄的帐篷前，隔着帘子把石碑的事说了一遍。'],['陆正衡','（帐篷里）……看过了？'],['我','石碑上写着「白羽」两个字，别的都被抓花了。'],['陆正衡','白羽……'],['旁白','帐篷里传来布料被攥紧的声音。'],['陆正衡','（帐篷里）知道了。……下去吧。']]},
);
C2_TASKS.xie.push(
  {id:'mjherb', title:'大师姐：采灵草', ask:['雾林里的灵草长得比宗门的好。采三株。','雾大，别走太远。'], goal:'在雾林采 3 株灵草交给大师姐', need:s=>count(s,'lingcao')>=3, prog:s=>`灵草 ${Math.min(3,count(s,'lingcao'))}/3`, take:{lingcao:3},
    tgt:s=>count(s,'lingcao')>=3?null:WOOD(9,4,'雾林里的灵草'), done:[['谢霁月','……嗯。'],['谢霁月','你衣服上沾了露水。去火边烤一烤。']]},
  {id:'mjfruit', title:'大师姐：摘朱果', ask:['朱果。两颗。','……满仓昨晚说他饿得睡不着。'], goal:'在雾林摘 2 颗朱果交给大师姐', need:s=>count(s,'zhuguo')>=2, prog:s=>`朱果 ${Math.min(2,count(s,'zhuguo'))}/2`, take:{zhuguo:2},
    tgt:s=>count(s,'zhuguo')>=2?null:WOOD(22,4,'雾林里的朱果'), done:[['谢霁月','我拿去给满仓。'],['旁白','她嘴上没说，却把那两颗朱果洗得干干净净。']]},
  {id:'mjmush', title:'大师姐：采薰草', ask:['替我采两株薰草。我要配一副安神的药。','……这几天，大家都睡不好。'], goal:'在雾林采 2 株薰草交给大师姐', need:s=>count(s,'xuncao')>=2, prog:s=>`薰草 ${Math.min(2,count(s,'xuncao'))}/2`, take:{xuncao:2},
    tgt:s=>{ if(count(s,'xuncao')>=2) return null; const p=[[20,9],[6,19]].find(([x,y])=>(s.gathered||{})['mj_wood:'+x+','+y]!==s.day)||[20,9]; return WOOD(p[0],p[1],'雾林里的薰草'); }, done:[['谢霁月','……'],['谢霁月','你也觉得大师兄不对劲，对吗？'],['旁白','她没等你回答，转身走开了。']]},
);
C2_TASKS.man.push(
  {id:'mjcook', title:'二师兄：做晚饭', ask:['{称}！营地第一顿饭，得吃顿好的！','我在书上看过，雾林里长着一种叫「祝余」的草——吃了就不会饿！采两株来，到篝火边的锅里煮！'], goal:'在雾林采 2 株祝余，在营地的锅里煮晚饭', need:s=>!!s.c2.p.mj.cooked, prog:s=>s.c2.p.mj.cooked?'煮好了':`祝余 ${Math.min(2,count(s,'zhuyu'))}/2`,
    tgt:s=>s.c2.p.mj.cooked?null:count(s,'zhuyu')>=2?CAMP(12,9,'篝火边的锅'):WOOD(6,3,'雾林里的祝余'),
    done:[['何满仓','香！'],['旁白','四个人围着篝火吃饭。二师兄一连喝了三碗祝余汤。'],['何满仓','……奇怪。'],['何满仓','书上说吃了就不饿的……我怎么，还是饿呢。'],['旁白','他笑了笑，把剩下的汤盛进锅里盖好。'],['何满仓','留着明天早上吃！'] ]},
  {id:'mjfish', title:'二师兄：钓鱼', ask:['营地边上有条小溪，我看见里面有鱼！','钓一条来，我……我给大家烤。'], goal:'在营地的小溪钓一条鱼交给二师兄', need:s=>!!C2.fish(s), prog:s=>C2.fish(s)?'钓到了':'还没钓到',
    tgt:s=>C2.fish(s)?null:CAMP(17,10,'营地边的小溪（选中钓竿，点水面）'), done:[['何满仓','好、好鱼！'],['旁白','他把鱼烤好，分给每个人，最后自己只啃了鱼尾。'],['何满仓','我不饿。真的。']]},
  {id:'mjbag', title:'二师兄：干粮袋', ask:['{称}……我的干粮袋不见了。','我明明藏在帐篷里的……会不会掉在雾林里了？东边那块。'], goal:'在雾林东边找到二师兄的干粮袋', need:s=>!!s.c2.p.mj.bag, prog:s=>s.c2.p.mj.bag?'找到了':'还没找到',
    tgt:s=>s.c2.p.mj.bag?null:WOOD(21,15,'雾林东边'), done:[['何满仓','空、空的？'],['何满仓','谁会偷我的干粮……'],['旁白','他把撕破的袋子叠好，揣进怀里，一句话也没再说。']]},
);
// the daily set grows to six, and the morning scene (not the calendar) starts the next one in the 秘境
C2.nextSet=n=>{ const c=S.c2; c.n=n; c.got={lu:0,xie:0,man:0}; c.p={dummy:0, leaves:[], steles:[], room:false, mj:{}}; UI.hud(); save(); };
{ const _f=C2.fresh; C2.fresh=()=>{ const c=_f(); c.p.mj={}; return c; }; }

/* ---------- scenes ---------- */
const MJ={
  depart:()=>{ const sn=sectName(); return [
    ['旁白','天还没亮，山门前已经站着三个人。'],
    ['陆正衡','都到齐了。'],
    ['何满仓','（打着哈欠）我带了三天的干粮……不对，是五天的。'],
    ['谢霁月','……走吧。'],
    ['旁白','师尊在秘境入口布下一座传送阵，四人踏进青光——'],
    {run:()=>{ RT.paused=true; RT.fadeTo=()=>{ S.flags.c2_depart=true; C2.nextSet(3); S.c2.night=0; enterMap('mj_camp',10,12); RT.dir='up'; RT.paused=false; UI.sync(); save(); UI.say(MJ.arrive(), ()=>{ UI.hud(); Story.check(); }); }; }}]; },
  arrive:()=>[
    ['旁白','秘境里没有风。树很高，雾很白，连鸟叫声都闷闷的。'],
    ['陆正衡','就在这里扎营。'],
    ['陆正衡','秘境里的规矩：每天的事，我们三个各派一件给你。做完再歇。'],
    ['何满仓','我去生火！'],
    ['谢霁月','……这雾，不太对。'],
    ['陆正衡','秘境就是这样。不必多想。'],
    ['旁白','（左上角是三位师兄师姐今天的吩咐。营地北边是雾林，西南角有师尊留下的传送阵。）']],
  // night n → morning n+1
  night:[
    [['旁白','夜深了。你躺在帐篷里，听见隔壁传来二师兄的梦话——'],['何满仓','（梦话）饿……好饿……'],['旁白','你翻了个身，很快也睡着了。']],
    [['旁白','半夜，你忽然醒了。'],{run:()=>MJ.wings()},['旁白','帐篷外传来翅膀扇动的声音。很大，很近，像有什么巨大的东西从营地上空掠过。'],['旁白','篝火「呼」地暗了一下。'],['旁白','……然后，什么声音都没有了。']],
    [['旁白','这一夜，你睡得很浅。'],['旁白','快天亮的时候，你听见有人从帐篷里走出去。脚步声很轻，一步，一步，往北边去了。'],
      {choice:'外面的脚步声越来越远……', options:[{text:'掀开帐篷看看', go:'mj_peek'},{text:'继续睡', go:'mj_sleepon'}]}],
  ],
  morning:[
    // day 2: half the food gone
    ()=>[
      ['何满仓','啊——！锅里的饭呢？！'],
      ['旁白','昨晚留下的半锅饭，只剩锅底一层。'],
      ['陆正衡','满仓。'],
      ['何满仓','不是我！……我、我昨晚是饿醒了一次，可我没有起来！'],
      ['谢霁月','……'],
      {choice:'大家都看着二师兄……', options:[
        {text:'我相信二师兄', fn:()=>UI.say([{flag:'c2_trust_man'},['我','二师兄说不是他，那就不是他。'],['何满仓','{称}……'],['旁白','二师兄眼眶一红，低头扒拉着锅底。'],{love:{man:60}},['陆正衡','……罢了。今日照常。'],{run:()=>C2.nextSet(4)}])},
        {text:'（什么也不说）', fn:()=>UI.say([['旁白','你没有说话。二师兄看了你一眼，低下头去。'],['陆正衡','……罢了。今日照常。'],{run:()=>C2.nextSet(4)}])}]}],
    // day 3: the birds are gone; 大师兄's note
    ()=>[
      ['旁白','早上起来，营地静得出奇。'],
      ['谢霁月','雾林里……一声鸟叫都没有了。'],
      ['何满仓','昨、昨晚你们听见了吗？那个声音……'],
      ['旁白','没有人回答。大师兄的帐篷帘子垂着，里面伸出一只手，递出三张纸条。'],
      ['谢霁月','他的字……'],
      ['旁白','纸条上的字迹歪歪扭扭，一笔一画都在发抖，不像大师兄平时一丝不苟的字。'],
      ['陆正衡','（帐篷里）……我有些累。今天的事，照纸条做。'],
      {run:()=>C2.nextSet(5)}],
    // day 4: he is gone
    ()=>[
      ['何满仓','大师兄？大师兄！'],
      ['旁白','天刚亮，二师兄的喊声就把所有人都叫醒了。'],
      ['旁白','大师兄的帐篷是空的。被褥叠得整整齐齐，像是没有人睡过。'],
      ['旁白','枕边，放着一根白色的羽毛。羽根上，沾着已经发黑的血。'],
      ...(S.flags.mj_peeked?[['我','我昨晚……看见他往北边走了。赤着脚，头歪着。他没有回头。'],['何满仓','你、你怎么不叫住他！'],['谢霁月','……别怪{称}。换了谁，都不敢叫。']]:[]),
      {give:{mj_feather:1}},
      ['谢霁月','（握紧了剑）这羽毛……'],
      {choice:'这根白羽，你在哪里见过——', options:[
        {text:'是穷奇的羽毛！', fn:()=>UI.say(MJ.end())},
        {text:'……风穴里，那头凶兽', fn:()=>UI.say(MJ.end())}]}],
  ],
  end:()=>[
    ['我','是穷奇……它又出来作恶了。'],
    ['何满仓','穷、穷奇？！它把大师兄……'],
    ['谢霁月','别说了。'],
    ['谢霁月','血还没干透多久。羽毛是从北边飘过来的。'],
    ['谢霁月','……我们去找他。'],
    {flag:'lu_gone'},
    ['旁白','（第二幕「秘境」完。第三幕「大师兄失踪」正在制作中，敬请期待。）']],
  // wings at night: a low flutter and a shaking screen
  wings(){ for(let i=0;i<9;i++) setTimeout(()=>{ Sound.dig(); },i*110); const b=document.body; b.classList.remove('mjshake'); void b.offsetWidth; b.classList.add('mjshake'); setTimeout(()=>b.classList.remove('mjshake'),1300); },
  // the dark behind a night scene
  dark(on){ let d=$('#mjDark'); if(on){ if(!d){ d=document.createElement('div'); d.id='mjDark'; document.body.appendChild(d); } d.classList.add('on'); } else if(d){ d.classList.remove('on'); } },
  // the tent: only once today's chores are done; night scene, sleep, morning scene
  tent(){
    if(!C2.on()||!C2.inMJ()){ return UI.confirm('在帐篷里休息，结束今天？', ()=>{ sleep(false); enterMap('mj_camp',5,11); RT.dir='down'; save(); UI.hud(); }); }
    if(!C2.allDone()) return UI.say([['旁白','今天的事还没做完。大师兄说过：今天的事，今天做完。'],['旁白','（左上角还有没做完的吩咐。）']]);
    UI.confirm('回帐篷休息，结束今天？', ()=>{ const k=S.c2.night||0; MJ.dark(true); MJ.nightOn=true;
      UI.say(MJ.night[Math.min(k,2)], ()=>{ MJ.nightOn=false; sleep(false); S.c2.night=k+1; enterMap('mj_camp',5,11); RT.dir='down'; save(); MJ.dark(false); UI.hud();
        setTimeout(()=>UI.say(MJ.morning[Math.min(k,2)](), ()=>{ UI.hud(); Story.check(); }),400); }); }); },
};

// night three: look out, or don't
SCRIPTS.mj_peek=[
  ['旁白','你轻轻掀开帐篷的一角。'],
  ['旁白','雾里，一个人影赤着脚，一步一步往北走。月光照在他的背上——是大师兄。'],
  ['我','（小声）……大师兄？'],
  ['旁白','他没有回头。'],
  ['旁白','他走路的样子很奇怪。头歪向一边，像是有什么东西，在雾的那一头，拽着他的脖子。'],
  ['旁白','一眨眼，人影就被雾吞没了。你在帐篷口站了很久，才敢躺回去。'],
  {flag:'mj_peeked'}];
SCRIPTS.mj_sleepon=[['旁白','……大概是大师兄去巡夜了吧。你这样想着，又闭上了眼睛。']];
/* ---------- quests ---------- */
QUESTS.push(
  {id:'c2e', title:'秘境', desc:'在秘境营地历练。每天三位师兄师姐各派一件事，做完回帐篷休息。雾，好像一天比一天浓。', check:s=>!!s.flags.lu_gone,
    progress:s=>`秘境第 ${(s.c2&&s.c2.night||0)+1} 天`, target:s=>['mj_camp',10,8,'营地']},
  {id:'c2f', title:'第三幕 · 大师兄失踪（制作中）', desc:'大师兄不见了，帐篷里只剩一根带血的白羽。第三幕正在制作中，敬请期待。', check:s=>false});
// the order of quests: 山门集合 (c2d) leads into 秘境 (c2e)
{ const d=QUESTS.findIndex(q=>q.id==='c2d'), e=QUESTS.findIndex(q=>q.id==='c2e'); if(e!==d+1){ const [q]=QUESTS.splice(e,1); QUESTS.splice(d+1,0,q); } }

// 陆正衡 waits at the 山门 the morning after the order
for(const k in SECTS) MAPS['zong_'+k].objects.unshift({type:'npc', id:'lu', x:12, y:16, look:LOOK_LU, name:'陆正衡', act:'talk', cond:s=>s.sect===k&&!s.flags.c2_depart&&Story.quest()&&Story.quest().id==='c2d'});
{ const _t=Story.talk; Story.talk=function(id){
    const q=Story.quest()?.id;
    if(q==='c2d'&&id==='lu'){ if(S.day<=(S.c2.orderDay||0)) return UI.say([['陆正衡','明日一早出发。今晚早些歇着。']]); return UI.say(MJ.depart()); }
    return _t.call(Story,id); }; }
{ const _a=Dungeon.act; Dungeon.act=function(o){
    const p=S.c2&&S.c2.p&&S.c2.p.mj;
    switch(o.act){
      case 'mjtent': MJ.tent(); return true;
      case 'mjtent2':
        if(!S.flags.lu_gone&&C2.inMJ()&&S.c2&&S.c2.night>=2&&S.c2.got.lu<2){ Story.talk('lu'); return true; }   // the note, and the report, both through the tent flap
        UI.say([['旁白', S.flags.lu_gone?'大师兄的被褥叠得整整齐齐。':S.c2&&S.c2.night>=2?'帐篷里很安静。你知道大师兄在里面——可他一点声音都没有。':'大师兄的帐篷。门帘系得很紧。']]); return true;
      case 'mjtent3': UI.say([['旁白','大师姐的帐篷。门口插着她的剑鞘。']]); return true;
      case 'mjtent4': UI.say([['旁白', (S.c2&&S.c2.night||0)>=1?'二师兄的帐篷。门口堆着几个空了的干粮袋，叠得整整齐齐。':'二师兄的帐篷。门口挂着一串晒干的果子。']]); return true;
      case 'mjfire': UI.say([['旁白', (S.c2&&S.c2.night||0)>=2?'篝火烧得很旺，可你总觉得背后发凉。':'篝火噼啪作响，暖烘烘的。']]); return true;
      case 'mjpot':
        if(C2.on()&&C2.task('man')==='mjcook'&&S.c2.got.man===1&&!p.cooked){
          if(count(S,'zhuyu')<2) return UI.say([['旁白','锅里只有清水。还差祝余——雾林里能采到。（祝余 '+count(S,'zhuyu')+'/2）']]), true;
          addItem('zhuyu',-2); p.cooked=true; UI.hud(); UI.say([['旁白','你把祝余切碎丢进锅里，咕嘟咕嘟——一股青草的清香在雾里散开。'],['旁白','（回去告诉二师兄，饭好了。）']]); return true; }
        UI.say([['旁白','篝火边的铁锅。']]); return true;
      case 'mjflag':
        if(C2.on()&&C2.task('lu')==='mjflags'&&S.c2.got.lu===1){ p.flags=p.flags||[]; if(!p.flags.includes(o.fi)){ p.flags.push(o.fi); Sound.pick(); UI.float(o.x,o.y,`阵旗 ${p.flags.length}/3`); UI.hud(); if(p.flags.length>=3) UI.toast('阵旗插好了，回去找大师兄'); } return true; }
        UI.say([['旁白', o.spr==='mj_flag'?'阵旗在雾里一动不动。':'一根削尖的木桩。']]); return true;
      case 'mjstele':
        if(C2.on()&&C2.task('lu')==='mjstele'&&S.c2.got.lu===1&&!p.stele){ p.stele=true; UI.hud();
          UI.say([['旁白','一块半埋在土里的石碑。碑面上满是爪痕，深得能塞进手指。'],['旁白','你辨认了好久，只认出两个字——'],['旁白','「白羽」。'],['旁白','（回去告诉大师兄。）']]); return true; }
        UI.say([['旁白','布满爪痕的石碑。依稀能认出「白羽」两个字。']]); return true;
      case 'mjbag':
        if(p&&!p.bag){ p.bag=true; RT.ents=RT.ents.filter(e=>e!==o); RT.solid[o.y][o.x]=false; UI.hud();
          UI.say([['旁白','草丛里躺着二师兄的干粮袋。袋口被撕开了，里面空空的。'],['旁白','袋子旁边，落着一根白色的羽毛。'],['旁白','你伸手去捡，羽毛却被一阵不知从哪来的风卷走了。'],['旁白','（回去找二师兄。）']]); return true; }
        return true;
    }
    return _a.call(Dungeon,o); }; }
// the note-giving morning: 大师兄 hands out his chore from inside the tent
{ const _t=Story.talk; Story.talk=function(id){ if(id==='lu'&&C2.inMJ()&&S.c2&&C2.task('lu')==='mjstele'&&S.c2.got.lu===0){ S.c2.got.lu=1; UI.hud();
      return UI.say([['旁白','你走到大师兄的帐篷前。帘子没有掀开。'],['我','大师兄？'],['旁白','过了很久，帘子底下伸出一只手。手指冰凉，指甲缝里全是泥。它把一张纸条塞进你手里，又缩了回去。'],['旁白','纸条上歪歪扭扭地写着：「去……北边……石碑……看看……」'],['旁白','（任务：去雾林北边的石碑看看。）']]); }
    return _t.call(Story,id); }; }
// losing a fight in the 秘境 wakes you in the camp, not at home
{ const _s=sleep; sleep=function(passedOut){ const inMJ=RT.mapId&&RT.mapId.startsWith('mj_'); _s(passedOut); if(inMJ&&passedOut){ enterMap('mj_camp',5,11); RT.dir='down'; save(); } }; }
// the portal knows the camp once you have been there
{ const _d=Portal.dests; Portal.dests=function(){ const l=_d.call(Portal); if(S.flags.c2_depart&&!C2_LOCKED&&RT.mapId!=='mj_camp') l.splice(3,0,{name:'秘境营地', map:'mj_camp', x:3, y:14}); return l; }; }
// mood: the fog thickens each night; in the 雾林 you only see a little way
{ const _r=render; render=function(){ _r(); if(!RT.map||!RT.mapId.startsWith('mj_')) return;
    const g=ctx, Z=RT.scale*RT.dpr, T=TILE*Z, ox=Math.round(-RT.cam.x*Z), oy=Math.round(-RT.cam.y*Z), n=S.c2&&S.c2.night||0;
    if(RT.mapId==='mj_camp'){ g.fillStyle=`rgba(215,222,228,${.10+.08*n})`; g.fillRect(0,0,cv.width,cv.height);
      const f=RT.ents.find(e=>e.act==='mjfire'); if(f){ const fx=ox+(f.x+.5)*T, fy=oy+(f.y+.5)*T, r=T*(Math.max(.9,2.2-.55*n)+.15*Math.sin(RT.t*6)); const gr=g.createRadialGradient(fx,fy,0,fx,fy,r); gr.addColorStop(0,`rgba(255,170,70,${Math.max(.12,.32-.07*n)})`); gr.addColorStop(1,'rgba(255,170,70,0)'); g.fillStyle=gr; g.fillRect(fx-r,fy-r,r*2,r*2); } }
    if(RT.mapId==='mj_wood'){ const c=MJ.fogC||(MJ.fogC=document.createElement('canvas')); c.width=cv.width; c.height=cv.height; const f=c.getContext('2d');
      f.fillStyle=`rgba(212,218,224,${Math.min(.95,.78+.06*n)})`; f.fillRect(0,0,c.width,c.height); f.globalCompositeOperation='destination-out';
      const px=ox+(RT.fx+.5)*T, py=oy+(RT.fy+.5)*T, r=T*(Math.max(2.6,5.2-.9*n)+(count(S,'migu')?1.4:0)),   /* 迷穀花: 佩之不迷 */ gr=f.createRadialGradient(px,py,r*.35,px,py,r); gr.addColorStop(0,'rgba(0,0,0,1)'); gr.addColorStop(1,'rgba(0,0,0,0)'); f.fillStyle=gr; f.fillRect(px-r,py-r,r*2,r*2);
      f.globalCompositeOperation='source-over'; g.drawImage(c,0,0); }
  }; }
{ const _at=areaTheme; areaTheme=function(){ if(RT.mapId&&RT.mapId.startsWith('mj_')) return 'night'; return _at(); }; }
// the dark of a night scene never outlives it
{ const _c=UI.closeDlg; UI.closeDlg=function(){ const r=_c.apply(UI,arguments); if(!MJ.nightOn&&$('#mjDark')) MJ.dark(false); return r; }; }
