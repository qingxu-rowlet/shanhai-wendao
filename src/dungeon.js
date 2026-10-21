/* ============================================================
   山海问道 · 风穴 — the 穷奇 dungeon, and the realm bottlenecks.
   风谷: gusts blow down the valley; shelter behind the rocks, gather three 穷奇羽 to break the wind wall.
   枯骨林: a fog you can barely see through, three phantoms of 穷奇's victims, three lanterns lit in the right order.
   风眼: 穷奇 in three phases (a whirlwind that drags your bead in, a rain of feathers), and 顾长歌 arrives at the end.
   Entering a layer saves; falling in the dungeon sends you back to the start of that layer.
   Bottlenecks: 炼气三层 needs three beasts slain, 炼气六层 needs the 风谷 crossed, 炼气九层 needs a 筑基丹.
   ============================================================ */

/* ---------- bottlenecks ---------- */
function bottleneck(L){
  if(!S) return null;
  if(L===3 && !((S.st.kills||0)>=3)) return '炼气三层瓶颈：去青丘山林击败 3 只野兽，在搏杀中感悟。';
  if(L===6 && !S.flags.fx_valley) return '炼气六层瓶颈：穿过风穴的风谷，在狂风里稳住心神。';
  return null;
}
{ const capped=L=>L===9||L>=12||!!bottleneck(L);
  // the same climb as before, but a bottleneck stops it like 炼气九层 does; returns how much actually landed
  const climb=n=>{ const L0=S.L, e0=S.exp; let up=false; S.exp+=n;
    while(true){ const need=expNeed(S.L); if(capped(S.L)){ if(S.exp>need) S.exp=need; break; } if(S.exp<need) break; S.exp-=need; S.L++; up=true; }
    const n2=bottleneck(S.L); if(n2&&S.exp>=expNeed(S.L)&&S._neckSaid!==S.L){ S._neckSaid=S.L; setTimeout(()=>UI.toast(n2),300); }
    return {up, got:S.L>L0?n:Math.max(0,S.exp-e0)}; };
  gainExp=function(n){ const {up}=climb(n); if(up){ const st=stats(); S.hp=st.hp; S.mp=st.mp; Sound.levelup(); UI.banner('突破！'+realmName(S.L)); } UI.hud(); Story.check(); };
  gainExpQuiet=function(n){ return climb(n).got; };
  const _full=Med.full; Med.full=function(){ return _full.call(Med) || (!!bottleneck(S.L) && S.exp>=expNeed(S.L)); };
  const _sim=Med.sim; Med.sim=function(h){ let L=S.L, exp=S.exp, total=0;
    for(let i=0;i<Med.blocks(h);i++){ const cap=(L===9||L>=12||bottleneck(L)); if(cap&&exp>=expNeed(L)) break; const g=Med.block(L), e0=exp; exp+=g;
      while(true){ const need=expNeed(L); if(L===9||L>=12||bottleneck(L)){ exp=Math.min(exp,need); break; } if(exp<need) break; exp-=need; L++; }
      total+=exp>=e0?exp-e0:g; }
    return {L, exp, total, capped:(L===9||L>=12||!!bottleneck(L))&&exp>=expNeed(L)}; };
  const _ahead=Med.ahead; Med.ahead=function(){ const out=[]; let L=S.L, exp=S.exp, blocks=0;
    while(out.length<4 && blocks<6*400){ const need=expNeed(L); if((L===9||L>=12||bottleneck(L))&&exp>=need) break; exp+=Med.block(L); blocks++;
      if(L!==9&&L<12&&!bottleneck(L)&&exp>=need){ exp-=need; L++; out.push([L,blocks]); } else if(exp>=need){ exp=need; out.push([L+.5,blocks]); } }
    return out.map(([L,b])=>[L===9.5?9.5:L%1?L:L,b]); };
}

/* ---------- sprites ---------- */
Object.assign(SPR, {
  fxcave:['................','.....kkkkkk.....','...kkEEEEEEkk...','..kEEeeeeeeEEk..','.kEEe......eEEk.','.kEe........eEk.','kEEe........eEEk','kEe..........eEk','kEe..........eEk','kEe..........eEk','kEe..........eEk','kEe..........eEk','kEEe........eEEk','.kEEeeeeeeeeEEk.','..kkkkkkkkkkkk..','................'],
  fxwall:['....l..l..l.....','...l..l..l...l..','..l..l..l...l...','.l..l..l...l..l.','l..l..l...l..l..','..l..l...l..l..l','.l..l...l..l..l.','l..l...l..l..l..','..l...l..l..l...','.l...l..l..l..l.','l...l..l..l..l..','...l..l..l..l..l','..l..l..l..l..l.','.l..l..l..l..l..','l..l..l..l..l...','..l..l..l..l....'],
  lamp_off:['................','......kk........','.....kEEk.......','....kEeeEk......','....kEeeEk......','....kEeeEk......','.....kEEk.......','......kk........','......nn........','......nn........','......nn........','......nn........','......nn........','.....nnnn.......','....nnnnnn......','................'],
  bones:['................','................','................','................','................','................','................','................','.....w...w......','....www.www.....','.....wwwww......','......www.......','.....w.w.w......','....ww...ww.....','................','................'],
});
/* ---------- maps ---------- */
const FX_MAP = (rows)=>rows;
MAPS.fx1 = { name:'风穴 · 风谷', w:14, h:26, ground:[
'WWWWWW==WWWWWW','W............W','W..W......W..W','W............W','W.....WW.....W','W............W','W..W.......W.W','W............W','W......W.....W','W............W','W.W.......W..W','W............W','W.....W......W','W............W','W...W.....W..W','W............W','W.......WW...W','W............W','W..W.........W','W.........W..W','W............W','W.....W......W','W............W','W............W','W............W','WWWWWW==WWWWWW'],
  objects:[
    {type:'shard', x:2, y:17, act:'shard', spr:'i_feather', id:1, cond:s=>!s.flags.fx_s1},
    {type:'shard', x:11, y:9, act:'shard', spr:'i_feather', id:2, cond:s=>!s.flags.fx_s2},
    {type:'shard', x:3, y:3, act:'shard', spr:'i_feather', id:3, cond:s=>!s.flags.fx_s3},
    {type:'fxwall', x:6, y:1, spr:'fxwall', act:'fxwall', cond:s=>!s.flags.fx_gate},
    {type:'fxwall', x:7, y:1, spr:'fxwall', act:'fxwall', cond:s=>!s.flags.fx_gate},
    {type:'sign', x:9, y:23, text:'风谷：风从谷口往下灌。起风时躲到岩石的下方（背风处），就不会被吹回去。'},
  ],
  spawns:[{kind:'xingxing', n:2, area:[1,12,12,22]},{kind:'guidiao', n:2, area:[1,2,12,11]}],
  exits:[{x:6,y:25,to:'forest',tx:26,ty:2},{x:7,y:25,to:'forest',tx:26,ty:2},{x:6,y:0,to:'fx2',tx:1,ty:7},{x:7,y:0,to:'fx2',tx:1,ty:8}]};
MAPS.fx2 = { name:'风穴 · 枯骨林', w:24, h:16, ground:[
'WWWWWWWWWWWWWWWWWWWWWWWW','W......:::.........:...W','W..::......W...........W','W......................W','W.:....W.......::......W','W......................W','W...........,..........W','=......................=','=......................=','W.......::.............W','W..W...........W.......W','W......................W','W..::.......:::........W','W.........W............W','W......................W','WWWWWWWWWWWWWWWWWWWWWWWW'],
  objects:[
    {type:'lamp', x:4, y:3, act:'lamp', lamp:'来路', spr:'lamp_off'},
    {type:'lamp', x:19, y:2, act:'lamp', lamp:'亡者', spr:'lamp_off'},
    {type:'lamp', x:13, y:13, act:'lamp', lamp:'己身', spr:'lamp_off'},
    {type:'sign', x:11, y:8, act:'tablet', spr:'sign'},
    {type:'phantom', x:4, y:11, act:'phantom', ph:'woodcutter', ghost:true, look:{g:'m',skin:2,hair:1,hairColor:1,style:'jin',cloth:5}, cond:s=>!s.flags.ph_woodcutter},
    {type:'phantom', x:19, y:11, act:'phantom', ph:'bandit', ghost:true, look:{g:'m',skin:3,hair:1,hairColor:0,style:'jin',cloth:2}, cond:s=>!s.flags.ph_bandit},
    {type:'phantom', x:15, y:5, act:'phantom', ph:'girl', ghost:true, look:{g:'f',skin:0,hair:3,hairColor:1,style:'qun',cloth:6}, cond:s=>!s.flags.ph_girl},
    {type:'tree', x:2, y:6},{type:'tree', x:9, y:2},{type:'pine', x:21, y:5},{type:'tree', x:7, y:13},{type:'pine', x:17, y:14},{type:'tree', x:22, y:12},
    {type:'deco', x:6, y:9, spr:'bones'},{type:'deco', x:16, y:9, spr:'bones'},{type:'deco', x:11, y:4, spr:'bones'},
    {type:'fxwall', x:22, y:7, spr:'fxwall', act:'fog', cond:s=>!s.flags.fx_lit},
    {type:'fxwall', x:22, y:8, spr:'fxwall', act:'fog', cond:s=>!s.flags.fx_lit},
  ],
  exits:[{x:0,y:7,to:'fx1',tx:6,ty:2},{x:0,y:8,to:'fx1',tx:7,ty:2},{x:23,y:7,to:'fx3',tx:7,ty:11},{x:23,y:8,to:'fx3',tx:8,ty:11}]};
MAPS.fx3 = { name:'风穴 · 风眼', w:16, h:14, ground:[
'WWWWWWWWWWWWWWWW','W..............W','W..............W','W....::..::....W','W..............W','W..............W','W.......,......W','W..............W','W..............W','W....::..::....W','W..............W','W..............W','W..............W','WWWWWWW==WWWWWWW'],
  objects:[
    {type:'boss', x:8, y:5, spr:'qiongqi', act:'fxboss', cond:s=>!s.flags.qiongqi_done},
    {type:'deco', x:3, y:2, spr:'bones'},{type:'deco', x:12, y:10, spr:'bones'},
  ],
  exits:[{x:7,y:13,to:'fx2',tx:22,ty:7},{x:8,y:13,to:'fx2',tx:22,ty:8}]};
// the entrance in the north-east corner of 青丘山林
MAPS.forest.objects.push({type:'fxcave', x:26, y:1, spr:'fxcave', act:'dungeon', label:'风穴'});

/* ---------- scripts ---------- */
Object.assign(SCRIPTS, {
  fx_enter_locked:[['旁白','崖壁上裂开一道黑黢黢的洞口，狂风从里面呼啸而出，吹得人站不住脚。'],['旁白','以你现在的修为，还是先别进去了。']],
  fx_enter:[['旁白','洞口的风声像野兽的喘息。地上散落着几片沾血的白羽——穷奇就在里面。'],['旁白','（风穴共三层：风谷、枯骨林、风眼。每进入一层都会自动存档，在里面倒下会回到这一层的入口。）']],
  fx_gate:[['旁白','三片穷奇羽在你手中轻轻颤动，像是在互相呼应。'],['旁白','谷口的风障发出一声尖啸，散成了一阵乱风。'],['旁白','你在狂风里站稳了脚跟，心神前所未有地安定。（炼气六层瓶颈已破）']],
  fx_tablet:[['旁白','石碑上刻着几行被风蚀了大半的字——'],['旁白','「穷奇食善，善者之魂不散。来者执灯，先照来路，再照亡者，后照己身。」'],['旁白','林中三盏石灯，灯座上分别刻着「来路」「亡者」「己身」。']],
  fx_wrong:[['旁白','石灯「噗」地灭了，三盏一齐暗了下去。雾里传来骨头摩擦的声音——'],{battle:'guidiao', win:'fx_wrong_win', lose:'fx_lose'}],
  fx_wrong_win:[['旁白','雾气重新合拢。看来顺序不对，得从头再点。']],
  fx_lit:[['旁白','第三盏灯亮起的一刻，三道灯光连成一线，林中的雾像被风卷走一样散开了。'],['旁白','东边露出了一条下坡的小路，风声越来越响——风眼就在前面。']],
  fx_lose:[['旁白','你眼前一黑……再睁眼时，已被狂风卷回了这一层的入口。']],
  fx_boss_meet:[
    ['旁白','风穴最深处是一片圆形的谷底，四壁的风围着中间打转，地上堆满了白骨。'],
    ['穷奇','吼——又一个送上门的好心人。'],
    ['穷奇','你一路行善，我闻得出来……善人的血，最香。'],
    {battle:'qiongqi', win:'fx_win', lose:'fx_boss_lose'}],
  fx_boss_lose:[['旁白','穷奇双翼一扇，你被狂风卷出了风眼。'],['旁白','（回到风眼入口，可以调整好再来。）']],
  fx_win:[
    ['旁白','穷奇哀嚎一声，双翼上的白羽被剑气削落了大半，它撞开风壁，狼狈地逃入了云中。'],
    ['顾长歌','……还不错。'],
    ['顾长歌','下次，别一个人来。'],
    ['旁白','顾长歌收剑入鞘，转身走进了风里。地上只留下几片穷奇的白羽，和一道浅浅的剑痕。'],
    ['阿禾','（风穴外远远传来喊声）{名}——你没事吧！镇上的人都说看见山里的风停了！'],
    {stones:120},{give:{qq_yu:1}},{flag:'qiongqi_done'},{run:()=>{ if(!S.flags.fx_clear){ S.flags.fx_clear=true; perk('atk',2,'风眼淬体：攻击 +2'); } }}],
  // 枯骨林 · three phantoms of those 穷奇 devoured (or rewarded)
  ph_woodcutter:[
    ['旁白','一棵枯树下，坐着一个半透明的樵夫，膝上横着一把锈斧，正低头看着地上的一堆白骨。'],
    ['樵夫的幻影','那是我……那堆骨头，就是我。'],
    ['樵夫的幻影','那天镇上的恶霸欺负一个卖花的孩子，我多嘴说了句公道话。夜里那怪物就从天上扑下来……'],
    ['樵夫的幻影','它说，好人的心，是甜的。'],
    {choice:'你要怎么做？', options:[
      {text:'替他把遗骨掩埋好', fn:()=>UI.say([['旁白','你用手刨开冻土，把白骨一块块放进去，再压上一块石头。'],['樵夫的幻影','……谢谢你，后生。我在这林子里转了好多年，终于能走了。'],['樵夫的幻影','听我一句：穷奇专挑心软的人下手。你越想救人，它就越想吃你。别怕，把那份心护住就好。'],['旁白','樵夫的身影化作点点微光散去。你觉得心里清明了许多。'],{run:()=>{ S.karma=(S.karma||0)+2; S.flags.fx_clear_heart=true; S.flags.ph_woodcutter=true; }},['旁白','（善念 +2；获得「清心」：风眼里穷奇的弹幕变慢。）']])},
      {text:'问他穷奇的弱点', fn:()=>UI.say([['樵夫的幻影','弱点？……它扇翅膀之前，左翼会先抖一下。我就是看着它抖的那一下死的。'],['旁白','樵夫不再理你，又低下头去看那堆骨头。'],{run:()=>{ S.flags.ph_woodcutter=true; S.flags.fx_tell=true; }},['旁白','（获得「看破」：风眼里穷奇的招式说明更详细。）']])},
      {text:'绕开他', fn:()=>UI.say([['旁白','你从枯树旁绕了过去。身后传来一声很轻的叹息。']])}]}],
  ph_bandit:[
    ['旁白','雾里走出一个满脸横肉的汉子，身影比别的幻影浓得多，腰间别着一串叮当作响的钱袋。'],
    ['恶霸的幻影','哟，又来一个送死的。别紧张，我跟那些冤死鬼不一样——我是被穷奇「赏」死的。'],
    ['恶霸的幻影','我做了一辈子坏事，它每回都叼来金银赏我。最后我撑死了，哈哈哈！'],
    ['恶霸的幻影','它赏我的力气，还剩一半没用完。分给你，怎么样？只要你答应我一件事——出去以后，替我把那个卖花的小丫头……'],
    {choice:'你……', options:[
      {text:'一口回绝', fn:()=>UI.say([['恶霸的幻影','啐！跟那个樵夫一个德性。'],['旁白','汉子的影子在雾里扭曲了一下，消失了。'],{run:()=>{ S.karma=(S.karma||0)+1; S.flags.ph_bandit=true; }},['旁白','（善念 +1）']])},
      {text:'收下力量，敷衍他', fn:()=>UI.say([['旁白','一股黑气钻进你的经脉，浑身的骨头都在发烫。'],['恶霸的幻影','爽快！记住你答应我的事。'],['旁白','……你当然不会去做。可那股力气是真的。'],{run:()=>{ S.karma=(S.karma||0)-3; S.flags.fx_wrath=true; S.flags.ph_bandit=true; }},['旁白','（恶念 +3；获得「戾气」：风眼里你的攻击 +30%，但每回合损失少量生命。）']])}]}],
  ph_girl:[
    ['旁白','雾里传来细细的哭声。一个扎着双丫髻的小姑娘蹲在地上，怀里抱着一篮早就枯掉的花。'],
    ['小姑娘的幻影','呜……大哥哥说要送我回家的，可是一阵风刮过来，他就不见了……'],
    ['小姑娘的幻影','娘说，迷路的时候，先看来时的路，再看走丢的人，最后看看自己……'],
    {choice:'你要怎么做？', options:[
      {text:'蹲下来陪她说说话', fn:()=>UI.say([['旁白','你蹲下来，轻轻摸了摸她的头。小姑娘止住了哭，把一朵枯花放进你手里。'],['小姑娘的幻影','大哥哥要是看见你，一定会很高兴……他说过，好人不应该害怕。'],['旁白','她笑了一下，和那篮枯花一起散成了雾。你手心里的花却慢慢变得鲜艳起来。'],{run:()=>{ S.karma=(S.karma||0)+1; S.flags.ph_girl=true; addItem('flower',1); }},['旁白','（善念 +1；获得 野山茶 ×1。她说的那句话，或许和石灯有关。）']])},
      {text:'告诉她你得赶路', fn:()=>UI.say([['小姑娘的幻影','……嗯。'],['旁白','你走出好远，哭声还在雾里飘着。']])}]}],
});

/* ---------- the dungeon ---------- */
const Dungeon = {
  inside(){ return !!(RT.mapId&&RT.mapId.startsWith('fx')); },
  starts:{fx1:[6,23], fx2:[2,7], fx3:[8,11]},
  gust:{t:0, phase:'calm'},
  act(o){
    switch(o.act){
      case 'dungeon':
        if(S.quest<QUESTS.findIndex(q=>q.id==='q6')&&!S.flags.qiongqi_done) return UI.say(SCRIPTS.fx_enter_locked), true;
        UI.say(SCRIPTS.fx_enter, ()=>{ RT.fadeTo=()=>{ enterMap('fx1',6,23); save(); UI.sync(); }; }); return true;
      case 'shard': { S.flags['fx_s'+o.id]=true; Sound.pick(); RT.ents=RT.ents.filter(e=>e!==o); RT.solid[o.y][o.x]=false;
        const n=[1,2,3].filter(i=>S.flags['fx_s'+i]).length; UI.toast(`拾得穷奇羽（${n}/3）`);
        if(n>=3&&!S.flags.fx_gate){ S.flags.fx_gate=true; S.flags.fx_valley=true; for(const w of RT.ents.filter(e=>e.type==='fxwall')){ RT.solid[w.y][w.x]=false; } RT.ents=RT.ents.filter(e=>e.type!=='fxwall'); Sound.levelup(); UI.say(SCRIPTS.fx_gate,()=>{ gainExp(0); save(); }); }
        return true; }
      case 'fxwall': return UI.say([['旁白','狂风在谷口凝成一道看不见的墙，推得你寸步难行。也许和散落在谷里的穷奇羽有关。']]), true;
      case 'fog': return UI.say([['旁白','浓得化不开的雾，伸手不见五指。林子里好像有几盏没点亮的石灯。']]), true;
      case 'tablet': return UI.say(SCRIPTS.fx_tablet), true;
      case 'phantom': return UI.say(SCRIPTS['ph_'+o.ph], ()=>{ if(S.flags['ph_'+o.ph]){ RT.ents=RT.ents.filter(e=>e!==o); RT.solid[o.y][o.x]=false; } }), true;
      case 'lamp': return Dungeon.lamp(o), true;
      case 'fxboss': return Dungeon.boss(), true;
    }
    return false;
  },
  order:['来路','亡者','己身'],
  lamp(o){
    if(S.flags.fx_lit) return UI.say([['旁白','石灯静静地亮着。']]);
    S.fxLamps=S.fxLamps||[]; if(S.fxLamps.includes(o.lamp)) return UI.say([['旁白',`「${o.lamp}」灯已经亮了。`]]);
    const want=Dungeon.order[S.fxLamps.length];
    if(o.lamp!==want){ S.fxLamps=[]; for(const e of RT.ents) if(e.type==='lamp') e.spr='lamp_off'; Sound.hurt(); return UI.say(SCRIPTS.fx_wrong); }
    S.fxLamps.push(o.lamp); o.spr='lantern'; Sound.magic(); UI.toast(`点亮了「${o.lamp}」灯（${S.fxLamps.length}/3）`);
    if(S.fxLamps.length===3){ S.flags.fx_lit=true; for(const w of RT.ents.filter(e=>e.type==='fxwall')) RT.solid[w.y][w.x]=false; RT.ents=RT.ents.filter(e=>e.type!=='fxwall'); UI.say(SCRIPTS.fx_lit,()=>save()); }
  },
  boss(){ if(S.flags.qiongqi_done) return; Dungeon.inBoss=true; UI.say(SCRIPTS.fx_boss_meet); },
  // falling inside: back to the start of the layer with half health
  retry(){ const [x,y]=Dungeon.starts[RT.mapId]||[6,23]; const st=stats(); S.hp=Math.max(S.hp,Math.round(st.hp*.6)); S.mp=st.mp;
    RT.fadeTo=()=>{ enterMap(RT.mapId,x,y); UI.sync(); UI.hud(); save(); }; },
  // 风谷: calm → warning → gust (pushes you back down the valley unless a rock shields you from above)
  tick(dt){
    // a phantom whose story is settled fades away
    if(RT.mapId==='fx2') for(const e of RT.ents.filter(e=>e.type==='phantom'&&S.flags['ph_'+e.ph])){ RT.ents=RT.ents.filter(x=>x!==e); RT.solid[e.y][e.x]=false; }
    if(RT.mapId!=='fx1'||S.flags.fx_gate&&S.flags.fx_valley_calm){ Dungeon.gust.phase='calm'; return; }
    if(RT.paused) return;
    const G=Dungeon.gust; G.t+=dt;
    if(G.phase==='calm'&&G.t>4.2){ G.phase='warn'; G.t=0; UI.toast('风来了！躲到岩石下方！'); Sound.tick(); }
    else if(G.phase==='warn'&&G.t>1.1){ G.phase='gust'; G.t=0; Sound.hurt(); }
    else if(G.phase==='gust'){ if(G.t>1.7){ G.phase='calm'; G.t=0; }
      else if(!Dungeon.sheltered()){ RT.path=[]; RT.autoNav=false; moveFree(0, 6.5*dt); } }
  },
  sheltered(){ const x=Math.floor(RT.fx+.5), y=Math.floor(RT.fy+.75); return tileAt(x,y-1)==='W'||tileAt(x,y-2)==='W'&&tileAt(x,y-1)!=='.'; },
  // wind streaks, the fog of 枯骨林
  draw(g,ox,oy,T,Z){
    if(RT.mapId==='fx1'){ const G=Dungeon.gust; const a=G.phase==='gust'?.55:G.phase==='warn'?.18:.06, n=G.phase==='gust'?60:20;
      g.strokeStyle=`rgba(235,240,245,${a})`; g.lineWidth=Math.max(1,Z*.6);
      for(let i=0;i<n;i++){ const x=((i*97)%cv.width), y=((i*53+RT.t*(G.phase==='gust'?900:200)*Z/3)%(cv.height+80))-40; g.beginPath(); g.moveTo(x,y); g.lineTo(x+Z*2,y+Z*(G.phase==='gust'?18:8)); g.stroke(); }
      if(G.phase==='gust'&&Dungeon.sheltered()){ const px=ox+(RT.fx+.5)*T, py=oy+RT.fy*T-T*.2; g.fillStyle='rgba(255,255,255,.85)'; g.font=`bold ${Math.round(7*Z)}px system-ui,sans-serif`; g.textAlign='center'; g.fillText('避风',px,py); } }
    // withered colours: the bone grove is grey-brown, the eye of the storm is cold
    if(RT.mapId==='fx2'){ g.fillStyle='rgba(90,75,55,.32)'; g.globalCompositeOperation='multiply'; g.fillRect(0,0,cv.width,cv.height); g.globalCompositeOperation='source-over'; g.fillStyle='rgba(150,140,120,.18)'; g.fillRect(0,0,cv.width,cv.height); }
    if(RT.mapId==='fx3'){ g.fillStyle='rgba(70,80,100,.3)'; g.globalCompositeOperation='multiply'; g.fillRect(0,0,cv.width,cv.height); g.globalCompositeOperation='source-over'; }
    if(RT.mapId==='fx2'&&!S.flags.fx_lit){ const c=Dungeon.fogC||(Dungeon.fogC=document.createElement('canvas')); c.width=cv.width; c.height=cv.height; const f=c.getContext('2d');
      f.fillStyle='rgba(200,205,210,.93)'; f.fillRect(0,0,c.width,c.height); f.globalCompositeOperation='destination-out';
      const px=ox+(RT.fx+.5)*T, py=oy+(RT.fy+.5)*T, r=T*3.4, gr=f.createRadialGradient(px,py,r*.35,px,py,r); gr.addColorStop(0,'rgba(0,0,0,1)'); gr.addColorStop(1,'rgba(0,0,0,0)'); f.fillStyle=gr; f.fillRect(px-r,py-r,r*2,r*2);
      for(const e of RT.ents) if(e.type==='lamp'&&e.spr==='lantern'){ const lx=ox+(e.x+.5)*T, ly=oy+(e.y+.5)*T, lr=T*2.6, lg=f.createRadialGradient(lx,ly,0,lx,ly,lr); lg.addColorStop(0,'rgba(0,0,0,1)'); lg.addColorStop(1,'rgba(0,0,0,0)'); f.fillStyle=lg; f.fillRect(lx-lr,ly-lr,lr*2,lr*2); }
      f.globalCompositeOperation='source-over'; g.drawImage(c,0,0); }
  },
};
{ const _u=update; update=function(dt){ _u(dt); Dungeon.tick(dt); }; }
{ const _r=render; render=function(){ _r(); if(Dungeon.inside()&&RT.map){ const Z=RT.scale*RT.dpr, T=TILE*Z, ox=Math.round(-RT.cam.x*Z), oy=Math.round(-RT.cam.y*Z); Dungeon.draw(ctx,ox,oy,T,Z); } }; }
{ const _sl=sleep; sleep=function(passedOut){ if(passedOut&&Dungeon.inside()) return Dungeon.retry(); return _sl(passedOut); }; }
{ const _at=areaTheme; areaTheme=function(){ if(RT.mapId==='fx3') return 'qiongqi'; if(RT.mapId==='fx1'||RT.mapId==='fx2') return 'night'; return _at(); }; }
// the old shrine fight now points to the dungeon
{ const _sh=Story.shrine; Story.shrine=function(){ const q=Story.quest()?.id; if(q==='q6'&&!S.flags.qiongqi_done) return UI.say([['旁白','狐祠前满地都是带血的白羽，一路往北延伸——穷奇逃回了山林东北角崖壁上的风穴。']]); return _sh.call(Story); }; }
{ const q6=QUESTS.find(q=>q.id==='q6'); q6.desc='穷奇盘踞在青丘山林东北角的风穴里。穿过风谷和枯骨林，在风眼击败它。';
  q6.target=s=>{ const m=RT.mapId;
    if(m==='fx1') return s.flags.fx_gate?['fx1',6,1,'谷口']:([[1,2,17],[2,11,9],[3,3,3]].filter(([i])=>!s.flags['fx_s'+i]).map(([,x,y])=>['fx1',x,y,'穷奇羽'])[0]||['fx1',6,1,'谷口']);
    if(m==='fx2'){ if(s.flags.fx_lit) return ['fx2',23,7,'风眼']; const want=Dungeon.order[(s.fxLamps||[]).length]; const L=MAPS.fx2.objects.find(o=>o.lamp===want); return ['fx2',L.x,L.y+1,`石灯「${want}」`]; }
    if(m==='fx3') return ['fx3',8,7,'穷奇'];
    return ['forest',26,2,'风穴入口']; }; }
SCRIPTS.q5_done=(SCRIPTS.q5_done||[]).map(st=>Array.isArray(st)?[st[0],String(st[1]).replace('穷奇就在山林南边的狐祠附近出没——去吧','穷奇盘踞在山林东北角的风穴里——去吧')]:st);

/* ---------- 穷奇 in the 风眼: tougher, a third phase, 顾长歌 joins ---------- */
BEASTS.qiongqi.hp=680; BEASTS.qiongqi.atk=25; BEASTS.qiongqi.def=6;
BEASTS.qiongqi.phase3={at:.25, moves:['tornado','featherrain','big','tornado','wind','featherrain'], line:'穷奇发狂了！风眼开始旋转——就在这时，一道剑光破风而至：「我来。」顾长歌落在你身边。'};
DODGE.qiongqi.tornado={name:'风眼漩涡', hit:.55, dur:5, pull:24, spawn(P,t,dt,m){ P.every('o',.5/m,()=>{ const a=Math.random()*Math.PI*2; P.add({k:'orbit', a, R:30, va:(1.6+Math.random()*.6)*m, vr:-4, r:2.4}); });
  P.every('f',.8/m,()=>P.add({k:'feather', x:Math.random()*100, y:-4, vx:0, vy:26*m, r:2})); }};
DODGE.qiongqi.featherrain={name:'羽雨', hit:.5, dur:4.8, spawn(P,t,dt,m){ P.every('rw',.75/m,()=>{ const gap=10+Math.random()*80; for(let x=4;x<100;x+=7) if(Math.abs(x-gap)>11) P.add({k:'feather', x, y:-4, vx:0, vy:40*m, r:2.2}); }); }};
// minions in the dungeon dodge too
DODGE.guidiao={atk:{...DODGE.qiongqi.atk, name:'蛊雕俯冲', dur:3.4}, double:{...DODGE.qiongqi.double, name:'利爪', dur:3.4}, big:{...DODGE.qiongqi.big, name:'蛊雕扑击', dur:3.6}};
{ const _pc=Battle.phaseCheck; Battle.phaseCheck=function(){ _pc.call(Battle); const s=Battle.s, p=s&&s.B.phase3;
    if(p&&s.phase2&&!s.phase3&&s.hp>0&&s.hp<=s.max*p.at){ s.phase3=true; s.ally='顾长歌'; s.moves=p.moves; s.i=0; BossBg.flash('rgba(255,255,255,.85)'); Music.stinger('boss'); setTimeout(()=>{ if(Battle.s===s) Battle.log(p.line); },500); } }; }
// 顾长歌 strikes after each of your turns once he has joined; 戾气 hits harder but bleeds you
{ const _act=Battle.act; Battle.act=function(a){ const s=Battle.s; const hp0=s&&s.hp; const r=_act.call(Battle,a); const s2=Battle.s;
    if(s2&&s2===s&&!s2.over&&s2.hp>0&&s2.hp<hp0){
      if(S.flags.fx_wrath&&s2.kind==='qiongqi'){ const extra=Math.round((hp0-s2.hp)*.3); s2.hp-=extra; S.hp=Math.max(1,S.hp-4); setTimeout(()=>Battle.float('戾气 -'+extra,'crit'),150); }
      if(s2.ally){ const d=Math.round(12+Math.random()*8); s2.hp-=d; setTimeout(()=>{ if(Battle.s===s2){ Battle.float('顾长歌 -'+d,'pet'); Battle.hitFx(); Battle.ui(); } },350); }
      if(s2.hp<=0&&!s2.dead){ s2.busy=true; s2.dead=true; setTimeout(()=>Battle.end('win'),700); } }
    return r; }; }
// 清心 slows the bullets; 看破 explains the moves
{ const _run=Dodge.run; Dodge.run=function(pat,s,done){ if(S.flags.fx_clear_heart&&s.kind==='qiongqi'&&Dungeon.inside()) pat={...pat, spawn:(P,t,dt,m)=>pat.spawn(P,t,dt,m*.88)}; return _run.call(Dodge,pat,s,done); }; }
