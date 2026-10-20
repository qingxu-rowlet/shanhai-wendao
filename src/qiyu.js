/* ============================================================
   山海问道 · 奇遇 — a bigger pool of chance encounters in 青丘山林, drawn from the 山海经.
   Each morning one may appear (common / rare / legendary); some only at night, some need good deeds,
   a certain spiritual root, sect or realm. Rare ones grant lasting gifts (S.bonus). The 图鉴 records them.
   ============================================================ */
Object.assign(ITEMS, {
  peiyuan: {name:'培元丹', icon:'i_pill', color:'#e86a5a', sell:90, use:'exp', amount:150, desc:'服下增加 150 修为。丹香里带着一丝暖意。'},
  xueshen: {name:'雪参',   icon:'i_lingcao', color:'#f1ece2', sell:120, use:'heal', amount:200, desc:'雪线上才长的老参。恢复 200 生命。'},
  rod_bamboo:{name:'青竹钓竿', icon:'i_rod', color:'#5fa35a', price:400, sell:0, desc:'老竹子做的好钓竿。放在行囊里，钓鱼时自动换用：收线框更大，鱼也游得慢一些。'},
  wuse:    {name:'五色石', icon:'i_feather', color:'#8b5bc5', sell:260, desc:'传说是女娲补天剩下的碎石，五色流转。值不少灵石。'},
});
SHOP.sell.push('rod_bamboo');
// lasting gifts from encounters: {hp, mp, atk, def, med}
{ const _stats=stats; stats=function(){ const s=_stats(), b=S.bonus||{}; return {...s, hp:s.hp+(b.hp||0), mp:s.mp+(b.mp||0), atk:s.atk+(b.atk||0), def:s.def+(b.def||0)}; }; }
{ const _med=Sect.medMul; Sect.medMul=function(){ return +(_med.call(Sect)*(1+((S.bonus||{}).med||0))).toFixed(2); }; }
function perk(k, n, text){ S.bonus=S.bonus||{}; S.bonus[k]=(S.bonus[k]||0)+n; const st=stats(); if(k==='hp') S.hp=st.hp; if(k==='mp') S.mp=st.mp; UI.hud(); Sound.levelup(); UI.banner(text); }
const karma=n=>{ S.karma=(S.karma||0)+n; };
const night=()=>{ const h=S.min/60; return h>=19||h<5; };
const hasRoot=el=>S.root&&Sect.rootName().includes(el);

// seeds left over from old quest rewards become fruit on load
{ const _m=Sect.migrate; Sect.migrate=function(){ const r=_m.apply(this,arguments); if(S&&S.inv){ for(const [k,to] of [['seed_zg','zhuguo'],['seed_lc','lingcao']]) if(S.inv[k]){ S.inv[to]=(S.inv[to]||0)+S.inv[k]; delete S.inv[k]; } } return r; }; }
// encounter rewards scale with realm
function QX(n){ return Math.round(n*(1+S.L*.3)); }
function QG(n){ return Math.round(n*(1+S.L*.15)); }
// fix the two old encounters that still spoke of farming
{ const h=QIYU.find(q=>q.id==='hunter'); h.run=()=>[['老猎人','年轻人，我这儿有颗南边换来的朱果。拿 2 张兽皮来换，怎么样？'],
    {choice:'换吗？', options:[
      {text:'换（2 兽皮 → 1 朱果）', fn:()=>{ if((S.inv.hide||0)<2) return UI.say([['老猎人','兽皮不够啊，下次吧。']]); addItem('hide',-2); UI.say([['老猎人','爽快！'],{give:{zhuguo:1}}]); }},
      {text:'不了', fn:()=>UI.say([['老猎人','好嘞，山里见。']])}]}]; }
{ const s=QIYU.find(q=>q.id==='spring'); s.run=()=>[['旁白','山石间涌出一汪泛着微光的泉水，灵气浓得几乎化不开。'],
    {choice:'在灵泉里泡一会儿？', options:[
      {text:'泡一会儿', fn:()=>{ const st=stats(); S.hp=st.hp; S.mp=st.mp; S.min+=60; UI.hud(); UI.say([['旁白','暖流游遍全身，疲惫一扫而空。（生命、灵力全满）'],{exp:QX(40)}]); }},
      {text:'在泉边采药', fn:()=>UI.say([['旁白','泉水滋养的灵草格外肥美。'],{give:{lingcao:3}}])}]}]; }
for(const q of QIYU) q.tier=q.tier||'common';
QIYU.find(q=>q.id==='ruins').tier='rare';

QIYU.push(
  /* ---------- common ---------- */
  {id:'dangkang', tier:'common', title:'当康报丰年', run:()=>[['旁白','草丛里钻出一头长着獠牙的小野猪，「当康、当康」地叫着自己的名字。'],
    ['旁白','《山海经》说，当康现身，则天下大穰——是丰年的兆头。'],
    {choice:'你要怎么做？', options:[
      {text:'跟着它走', fn:()=>UI.say([['旁白','当康一路拱着鼻子，把你带到一片没人来过的林地——灵草和灵菇长得密密麻麻。'],{give:{lingcao:3, lingmo:2}},['旁白','它叫了两声，钻回林子里去了。']])},
      {text:'抓住它！', fn:()=>UI.say([['旁白','当康獠牙一挺，冲了过来！'],{battle:'dangkang', win:'qy_dk_win', lose:'qy_lose'}])}]}]},
  {id:'xingxing', tier:'common', title:'学舌的狌狌', run:()=>[['旁白','树上一只白耳朵的猴子盯着你看。你刚开口「咦？」，它也跟着「咦？」'],
    ['旁白','趁你愣神，它一伸手，把你腰间的钱袋摘了去！'],
    {choice:'你要怎么做？', options:[
      {text:'追！', fn:()=>UI.say([['旁白','狌狌「伏行人走」，跑得飞快——你追到林中空地，它回身龇牙。'],{battle:'xingxing', win:'qy_xx_win', lose:'qy_lose'}])},
      {text:'扔给它一颗朱果，换回钱袋', fn:()=>{ if(!S.inv.zhuguo){ S.stones=Math.max(0,S.stones-15); UI.hud(); return UI.say([['旁白','你身上没有朱果。狌狌掏走 15 块灵石，把空钱袋扔了回来。']]); }
        addItem('zhuguo',-1); karma(1); UI.say([['旁白','狌狌接住朱果，开心地啃起来，把钱袋还给你，还从树洞里掏出一把灵菇塞给你。'],{give:{lingmo:3}},['旁白','（善念 +1）']]); }},
      {text:'算了，几块灵石而已', fn:()=>{ S.stones=Math.max(0,S.stones-15); UI.hud(); UI.say([['旁白','狌狌学着你的语气说了句「算了」，蹦蹦跳跳地走了。（灵石 -15）']]); }}]}]},
  {id:'peddler', tier:'common', title:'云游货郎', run:()=>[['货郎','摇铃——摇铃——走过路过别错过！小哥，看看我这担子里的好东西？'],
    {choice:`要买点什么？（你有 ${S.stones} 灵石）`, options:[
      {text:'培元丹（120 灵石）', fn:()=>{ if(S.stones<120) return UI.say([['货郎','差了点儿，下回吧！']]); S.stones-=120; UI.say([['货郎','这可是好货！'],{give:{peiyuan:1}}]); }},
      {text:'雪参（90 灵石）', fn:()=>{ if(S.stones<90) return UI.say([['货郎','差了点儿，下回吧！']]); S.stones-=90; UI.say([['货郎','雪线上挖的，老参！'],{give:{xueshen:1}}]); }},
      {text:'用 3 张兽皮换一块五色石', fn:()=>{ if((S.inv.hide||0)<3) return UI.say([['货郎','兽皮不够三张哩。']]); addItem('hide',-3); UI.say([['货郎','嘿，换得好！这石头城里的阔老爷抢着要。'],{give:{wuse:1}}]); }},
      {text:'不买了', fn:()=>UI.say([['货郎','摇铃——摇铃——']])}]}]},
  {id:'herbalist', tier:'common', title:'采药的老婆婆', run:()=>[['老婆婆','哎哟，这腰……仙长，老身想给孙子熬汤，可灵菇长在那边的坡上，实在下不去了。'],
    {choice:'你要怎么做？', options:[
      {text:'给她 2 朵灵菇', fn:()=>{ if((S.inv.lingmo||0)<2) return UI.say([['旁白','你身上灵菇不够。你记下了，下次再来帮她。']]); addItem('lingmo',-2); karma(2);
        UI.say([['老婆婆','好孩子，好孩子！这两颗丹药是我家老头子年轻时炼的，你拿着。'],{give:{huichun:2}},['旁白','（善念 +2）']]); }},
      {text:'替她下坡去采', fn:()=>{ S.min+=60; karma(1); UI.say([['旁白','你下到坡底采了一篮灵菇。老婆婆分了你一半。'],{give:{lingmo:2}},{exp:QX(20)},['旁白','（善念 +1）']]); }},
      {text:'没空', fn:()=>UI.say([['老婆婆','唉……']])}]}]},
  {id:'chess', tier:'common', title:'松下对弈', run:()=>[['旁白','老松树下，两位白胡子老人在下棋，已经僵持了很久。'],['执黑的老人','后生，你来看看，这一手该落在哪里？'],
    {choice:'你看了看棋盘……', options:[
      {text:'落在天元', fn:()=>UI.say([['执白的老人','哈！好大的口气！'],['执黑的老人','……妙，妙啊。'],['旁白','两位老人对视一笑，一阵风过，石桌上只剩一枚棋子。'],{exp:QX(60)}])},
      {text:'劝他们和棋', fn:()=>{ karma(1); UI.say([['两位老人','哈哈哈——和棋，和棋！'],['旁白','他们留下一枚聚气丹，飘然而去。'],{give:{juqi:1}},['旁白','（善念 +1）']]); }},
      {text:'观棋不语', fn:()=>UI.say([['旁白','你看了整整一个时辰。等你回过神，棋盘上的黑白子化成了两只鹤，冲天飞走了。'],{exp:QX(90)}])}]}]},
  {id:'tomb', tier:'common', title:'无名修士墓', run:()=>[['旁白','一场山雨把土冲开了，露出一块残碑：「……散修……葬于此，后来者……」后面的字看不清了。'],
    {choice:'你要怎么做？', options:[
      {text:'整理坟土，拜一拜', fn:()=>{ karma(2); UI.say([['旁白','你把坟土培好，恭恭敬敬拜了三拜。'],['旁白','起身时，碑后的泥里露出一枚玉简——记着一段前人的心得。'],{exp:QX(70)},['旁白','（善念 +2）']]); }},
      {text:'挖开看看有什么陪葬', fn:()=>{ karma(-2); if(Math.random()<.4) return UI.say([['旁白','墓里的尸骨猛地坐了起来——是被阴气养出来的蛊雕！'],{battle:'guidiao', win:'qy_tomb_win', lose:'qy_lose'}]);
        UI.say([['旁白','你挖出一只朽烂的储物袋。'],{stones:QG(80)},['旁白','（恶念 +2）']]); }}]}]},

  /* ---------- rare ---------- */
  {id:'wenyao', tier:'rare', title:'文鳐夜飞', night:true, hint:'听说今夜青丘山林的水边，会有东西飞起来……', run:()=>[['旁白','夜色里，池水忽然泛起银光——一群长着鸟翅的鱼跃出水面，在月下滑翔！'],
    ['旁白','《山海经》：文鳐鱼，状如鲤鱼，鱼身而鸟翼，常行西海，游于东海，以夜飞。'],
    {choice:'你要怎么做？', options:[
      {text:'静静看着', fn:()=>{ const st=stats(); S.mp=st.mp; UI.hud(); perk('med',.05,'心境澄明：打坐效率 +5%'); UI.say([['旁白','鱼群掠过月亮，像一阵银色的雨。你忽然觉得心里很静。'],['旁白','（永久：打坐效率 +5%）']]); }},
      {text:'伸手去捞一条', fn:()=>UI.say([['旁白','你捞住一条，它在你掌心扑腾了两下，吐出一颗亮晶晶的珠子，又飞走了。'],{stones:QG(120)},{exp:QX(60)}])}]}]},
  {id:'lushu', tier:'rare', title:'鹿蜀之歌', run:()=>[['旁白','林间传来一阵歌声，像有人在唱谣。循声看去——一匹白头、虎纹、红尾的马站在溪边。'],
    ['旁白','《山海经》：鹿蜀，其状如马而白首，其文如虎而赤尾，其音如谣，佩之宜子孙。'],
    {choice:'你要怎么做？', options:[
      {text:'跟着它的歌声哼唱', fn:()=>{ perk('hp',20,'鹿蜀赠毛：生命上限 +20'); UI.say([['旁白','鹿蜀歪头看着你，打了个响鼻，蹭落一缕红尾毛，然后踏着歌声走远了。'],['旁白','你把尾毛编进腰带里，整个人都暖洋洋的。（永久：生命上限 +20）']]); }},
      {text:'悄悄走近想骑它', fn:()=>UI.say([['旁白','鹿蜀一扬蹄子，你摔了个结结实实，它的歌声听起来像在笑。'],{exp:QX(30)}])}]}]},
  {id:'foxfire', tier:'rare', title:'狐火引路', need:()=>!!S.flags.fox_kind, hint:'林子里亮着一点淡蓝色的狐火，像是在等谁……', run:()=>[['旁白','一团淡蓝的狐火在你面前晃了晃——是那只你喂过灵草的小狐狸！'],
    ['旁白','它咬住你的衣角，把你带到一棵老树下，用爪子刨了几下。'],
    ['旁白','树洞里藏着一只小小的玉匣。'],{give:{peiyuan:1, juqi:2}},
    ['旁白','小狐狸尾巴一甩，九条尾巴的影子在月光下一闪而过……再看时，只有一只小白狐蹲在那里。'],
    {choice:'……', options:[
      {text:'摸摸它的头', fn:()=>{ karma(1); perk('mp',8,'狐仙眷顾：灵力上限 +8'); UI.say([['旁白','它眯起眼睛蹭了蹭你的手心。（永久：灵力上限 +8）']]); }}]}]},
  {id:'swordtomb', tier:'rare', need:()=>S.L>=3, title:'剑冢', run:()=>[['旁白','山坳里插着几百柄锈迹斑斑的古剑。有一柄还亮着，剑身在轻轻鸣响。'],
    {choice:'要拔出那柄剑吗？', options:[
      {text:'拔！', fn:()=>{ const fit=S.sect==='jian'||hasRoot('金');
        if(fit){ perk('atk',3,'剑意入体：攻击 +3'); return UI.say([['旁白','剑「锵」地一声出鞘，一道剑意顺着手臂流进你的经脉——然后它化作光点散去了。'],['旁白','（永久：攻击 +3）'],S.sect==='jian'?['旁白','你隐约听见剑冢深处有人在笑：「青云剑宗的后辈……不错。」']:['旁白','你的金灵根嗡嗡作响，和剑意共鸣。']]); }
        UI.say([['旁白','剑纹丝不动。剑冢里所有的剑一齐鸣叫起来——一道剑灵扑了出来！'],{battle:'guidiao', win:'qy_sword_win', lose:'qy_lose'}]); }},
      {text:'拜一拜，离开', fn:()=>{ karma(1); UI.say([['旁白','你对着剑冢拜了三拜。剑鸣声渐渐平息，像是在送你。'],{exp:QX(50)},['旁白','（善念 +1）']]); }}]}]},
  {id:'danghost', tier:'rare', night:true, hint:'听说夜里的山林深处，有人在炼丹……', title:'丹鬼', run:()=>[['旁白','深夜的林子里亮着一点炉火。一个半透明的老人守着丹炉，嘴里念念有词。'],
    ['丹鬼','缺一味……缺一味……后生，你身上有没有灵草、灵菇、朱果？老夫炼了三百年，就差这一炉……'],
    {choice:'给他药材吗？（各 1 份）', options:[
      {text:'给', fn:()=>{ if(!S.inv.lingcao||!S.inv.lingmo||!S.inv.zhuguo) return UI.say([['丹鬼','不够……不够啊……'],['旁白','老人的身影慢慢淡去了。']]);
        addItem('lingcao',-1); addItem('lingmo',-1); addItem('zhuguo',-1); karma(2);
        UI.say([['旁白','丹炉「轰」地一声，金光冲天。'],['丹鬼','成了……成了！三百年……'],['旁白','老人笑着化作青烟，丹炉里留下三颗红润的丹药。'],{give:{peiyuan:3}},['旁白','（善念 +2）']]); }},
      {text:'吓得转身就跑', fn:()=>UI.say([['旁白','你一口气跑出林子，回头看——什么都没有。']])}]}]},

  /* ---------- legendary ---------- */
  {id:'baize', tier:'legend', need:()=>(S.karma||0)>=3, hint:'有人说，山林里来了一位能说人话的神兽……', title:'白泽问道', run:()=>Qiyu.baize()},
  {id:'qingniao', tier:'legend', need:()=>S.L>=5, title:'三青鸟', run:()=>[['旁白','三只青色的大鸟落在你面前的枝头，羽毛像天空一样蓝。'],
    ['旁白','《山海经》：三青鸟，为西王母取食。'],
    ['青鸟','王母娘娘的蟠桃园里，今年结了一颗小桃。娘娘说，送给青丘山下那个修士。'],
    {choice:'你……', options:[
      {text:'恭敬地收下', fn:()=>{ perk('hp',30,'蟠桃：生命 +30，灵力 +10'); perk('mp',10,'蟠桃：生命 +30，灵力 +10'); UI.say([['旁白','小桃入口即化，一股清气直冲百会。'],['旁白','（永久：生命上限 +30，灵力上限 +10）'],['青鸟','娘娘还说，等你修到元婴，再来昆仑做客。']]); }},
      {text:'问它们娘娘为什么选你', fn:()=>{ perk('med',.1,'青鸟指点：打坐效率 +10%'); UI.say([['青鸟','……娘娘说，你在山里做的事，她都看见了。'],['旁白','青鸟在你额头轻轻啄了一下，飞走了。（永久：打坐效率 +10%）']]); }}]}]},
  {id:'zhulong', tier:'legend', night:true, need:()=>S.L>=7, hint:'今夜的天，好像比平常亮……', title:'烛龙睁目', run:()=>[['旁白','夜空忽然变成了白昼。北方的山脊上，一条人面蛇身、通体赤红的巨龙缓缓睁开了眼睛。'],
    ['旁白','《山海经》：钟山之神，名曰烛阴，视为昼，暝为夜，吹为冬，呼为夏。'],
    ['旁白','它看了你一眼。只一眼，你就觉得经脉里的灵力全都烧了起来。'],{exp:QX(300)},
    ['旁白','它闭上眼睛，夜色重新落下，好像什么都没发生过。'],
    {choice:'……', options:[{text:'对着北方深深一拜', fn:()=>{ perk('def',2,'烛龙一瞥：防御 +2'); UI.say([['旁白','（永久：防御 +2）']]); }}]}]},
);
Object.assign(SCRIPTS, {
  qy_lose:[['旁白','你被打得眼前一黑……']],
  qy_dk_win:[['旁白','当康哼哼两声跑了。它刚才站的地方，土里冒出一片灵草。'],{give:{lingcao:2}}],
  qy_xx_win:[['旁白','狌狌把钱袋扔了回来，里面还多了几块它不知从哪儿摸来的灵石。'],{stones:35}],
  qy_tomb_win:[['旁白','蛊雕散成一团黑气。墓里有一只沉甸甸的储物袋。'],{stones:140},{give:{wuse:1}}],
  qy_sword_win:[['旁白','剑灵消散前对你点了点头。那柄剑终于松动了——你拔出它，剑意流进经脉，剑身化作光点散去。'],{run:()=>perk('atk',3,'剑意入体：攻击 +3')},['旁白','（永久：攻击 +3）']],
});

const Qiyu = {
  // review helper: choose any encounter and play it right here
  pickFor(){ UI.say([{choice:'触发哪个奇遇？', options:QIYU.map(q=>({text:`【${Qiyu.TIER[q.tier]}】${q.title}`, fn:()=>{ S.qiyuSeen=S.qiyuSeen||{}; S.qiyuSeen[q.id]=(S.qiyuSeen[q.id]||0)+1; UI.say(q.run(), ()=>setTimeout(()=>Qiyu.pickFor(),300)); }}))}]); },
  WEIGHT:{common:10, rare:4, legend:1},
  TIER:{common:'普通', rare:'稀有', legend:'传说'},
  // pick today's encounter: weighted by rarity, only ones whose conditions are met, not one of the last three
  pick(){
    const recent=S.qiyuRecent||[], pool=QIYU.filter(q=>!q.need||q.need()).filter(q=>!recent.includes(q.id));
    const tot=pool.reduce((a,q)=>a+Qiyu.WEIGHT[q.tier],0); let r=Math.random()*tot;
    for(const q of pool){ r-=Qiyu.WEIGHT[q.tier]; if(r<=0) return q; } return pool[0];
  },
  baize(){
    const beasts=['dangkang','xingxing','guidiao','qiongqi','huli'].filter(k=>BEASTS[k]);
    const qs=[...beasts].sort(()=>Math.random()-.5).slice(0,3); let right=0;
    const ask=i=>{
      if(i>=qs.length){ const steps=[['白泽','三问已毕。你答对了 '+right+' 问。']];
        if(right===3){ perk('med',.15,'白泽授道：打坐效率 +15%'); steps.push(['白泽','善。天下妖兽一万一千五百二十种，你已识得几分。'],{exp:QX(200)},['旁白','（永久：打坐效率 +15%）']); }
        else if(right>0) steps.push(['白泽','还需多看多记。'],{exp:QX(60*right)});
        else steps.push(['白泽','……回去好好读读《山海经》吧。']);
        steps.push(['旁白','白泽化作一团白光，消失在林间。']); return UI.say(steps); }
      const k=qs[i], others=beasts.filter(x=>x!==k).sort(()=>Math.random()-.5).slice(0,2), opts=[k,...others].sort(()=>Math.random()-.5);
      const lore=BEASTS[k].lore.replace(/^《[^》]+》[：:]?/,'').replace(new RegExp(BEASTS[k].name,'g'),'□□').replace(/穷奇|九尾/g,'□□');
      UI.say([{choice:`白泽第${'一二三'[i]}问：「${lore}」此为何兽？`, options:opts.map(o=>({text:BEASTS[o].name, fn:()=>{ if(o===k){ right++; Sound.pick(); UI.say([['白泽','善。']],()=>ask(i+1)); } else UI.say([['白泽',`非也。是${BEASTS[k].name}。`]],()=>ask(i+1)); }}))}]);
    };
    UI.say([['旁白','林间雾气散开，一头通体雪白、头生独角的神兽卧在石上，正看着你。'],['旁白','《山海经》注：白泽，能言语，达知万物之情。'],
      ['白泽','你在山里行善，我都看见了。来，我问你三问——答得好，有赏。']], ()=>ask(0));
  },
  bookHTML(sub){
    const seen=S.qiyuSeen||{}, got=QIYU.filter(q=>seen[q.id]).length, order=['common','rare','legend'];
    const list=[...QIYU].sort((a,b)=>order.indexOf(a.tier)-order.indexOf(b.tier));
    return sub+`<p class="muted">已遇见 ${got}/${QIYU.length}　·　每天清晨有机会在青丘山林里出现（地图上的闪光）。有的只在夜里出现，有的要多行善事才会遇到。</p>
      <div class="book">${list.map(q=>`<div class="bk qy ${seen[q.id]?'':'unk'} t-${q.tier}"><div class="qyt">${Qiyu.TIER[q.tier]}</div><div><b>${seen[q.id]?esc(q.title):'？？？'}</b><p>${seen[q.id]?`遇见 ${seen[q.id]} 次`:q.tier==='legend'?'传说中的奇遇……':'还没有遇见过。'}</p></div></div>`).join('')}</div>`;
  },
};
// replaces the old daily roll (Sect.newDay is kept); 70% of days have an encounter
Hooks.newDay=function(){
  Sect.newDay();
  if(Math.random()<.7){ const q=Qiyu.pick(); S.qiyu={ev:q.id, spot:Math.floor(Math.random()*QIYU_SPOTS.length), done:false}; S.qiyuRecent=[q.id,...(S.qiyuRecent||[])].slice(0,3); }
  else S.qiyu=null;
  Hooks.placeQiyu();
};
// night-only encounters only show their sparkle at night
{ const o=MAPS.forest.objects.find(o=>o.type==='qiyu'); o.cond=s=>{ if(!s.qiyu||s.qiyu.done) return false; const q=QIYU.find(x=>x.id===s.qiyu.ev); return !q||!q.night||night(); }; }
{ const _q=Hooks.qiyu; Hooks.qiyu=function(o){ const id=S.qiyu&&S.qiyu.ev; S.qiyuSeen=S.qiyuSeen||{}; if(id) S.qiyuSeen[id]=(S.qiyuSeen[id]||0)+1;
    const q=QIYU.find(x=>x.id===id); if(q&&q.tier!=='common'){ UI.banner((q.tier==='legend'?'传说奇遇':'稀有奇遇')+'：'+q.title); } return _q.call(Hooks,o); }; }
Qiyu.hint=()=>{ if(!S.qiyu) return ''; const q=QIYU.find(x=>x.id===S.qiyu.ev); return (q&&q.hint)||'听说青丘山林里今天有些不寻常……'; };
