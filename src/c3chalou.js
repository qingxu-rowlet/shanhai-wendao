/* ============================================================
   山海问道 · 第三章「京城」 · 听雨轩（茶楼） — inside the teahouse on 朱雀大街: the storyteller's table under a hanging
   scroll, tea tables full of listeners, a 茶博士 with his long-spouted kettle, the stair to the private rooms. One tale a
   day for two 灵石 of tea money. The first is always 「狐仙夺魁」 — the slander about 大师姐 — and you can sit through it
   or stand up and take it apart. The others each lean on the story: 大师兄 slaying the wolf demon told as a hero's tale;
   how 萧大人 rose from nowhere; the emperor and his 长生丹; 贰负 and 窫窳 from the 山海经; and, once it's over, the court's
   version of the night in the 宗庙.
   ============================================================ */
{ const W=18, H=13, G=[...Array(H)].map((_,y)=>[...Array(W)].map((_,x)=>x===0||x===W-1||y===0||y===H-1?'M':y===1?'K':y===2?'L':y===3&&x>=6&&x<=11?'E':'D'));
  for(const x of [8,9]) G[H-1][x]='D';
  const P=(id,x,y,name,look)=>({type:'npc', id, x, y, look, name, act:'talk'});
  const objects=[
    {type:'hc_plaque', x:9, y:1, spr:'hc_plaque', flagText:'听雨', flagInk:'#e8c870', flagX:32, flagY:9.5, flagSize:9},
    {type:'hc_desk', x:9, y:5, spr:'hc_desk', act:'clstage', fw:1},
    {type:'zy_screen', x:3, y:3, spr:'zy_screen'}, {type:'zy_stairs', x:15, y:4, spr:'zy_stairs', act:'clstairs'},
    {type:'zy_table', x:4, y:8, spr:'zy_table'}, {type:'zy_table', x:13, y:8, spr:'zy_table'}, {type:'zy_table', x:9, y:9, spr:'zy_table'},
    {type:'lantern', x:2, y:6}, {type:'lantern', x:15, y:7}, {type:'lantern', x:6, y:10}, {type:'lantern', x:12, y:10},
    P('cl_teller',9,4,'说书先生',{g:'m',skin:1,hair:0,hairColor:3,style:'robe',cloth:5,face:'small',beard:'#ece8e0'}),
    P('cl_boshi',14,5,'茶博士',{g:'m',skin:2,hair:1,hairColor:0,style:'jin',cloth:1,face:'mid'}),
    P('cl_a',3,8,'喝茶的老汉',{g:'m',skin:2,hair:0,hairColor:3,style:'robe',cloth:6,face:'small',beard:'#d8d4cc'}),
    P('cl_b',14,8,'嗑瓜子的妇人',{g:'f',skin:1,hair:3,hairColor:1,style:'qun',cloth:4,face:'mid'}),
    P('cl_c',8,10,'书生',{g:'m',skin:0,hair:2,hairColor:0,style:'robe',cloth:2,face:'small'}),
    P('cl_d',11,9,'穿绸衫的胖子',{g:'m',skin:1,hair:0,hairColor:1,style:'robe',cloth:7,face:'mid'}),
  ];
  MAPS.jc_chalou={ name:'京城 · 听雨轩', w:W, h:H, ground:G.map(r=>r.join('')), objects, exits:[{x:8,y:12,to:'jc_zhuque',tx:22,ty:13},{x:9,y:12,to:'jc_zhuque',tx:22,ty:13}], indoor:true }; }
On.theme(id=>id==='jc_chalou'?'calm':null);

const CL={
  st(){ const c=C3.st(); c.cl=c.cl||{heard:[]}; return c.cl; },
  CHAT:{cl_teller:['上回书说到——'], cl_boshi:['续水——'], cl_a:['好！'], cl_b:['（咔嚓咔嚓）'], cl_c:['……荒唐。'], cl_d:['再来一段！']},
  // the tales, in the order they come round; 「狐仙夺魁」 is always first
  TALES:{
    huxian:{title:'狐仙夺魁', lines:[
      ['说书先生','（醒木一拍）上回书说到，那一年四宗大比，擂台上来了一位女弟子——'],
      ['说书先生','生得是闭月羞花，沉鱼落雁。她往台上一站，对面的男弟子，剑都拿不稳了！'],
      ['看客','（哄堂大笑）'],
      ['说书先生','诸位，您道她是怎么赢的？不是剑快，是眼波快！一个眼神递过去——'],
      ['说书先生','对手就自己跳下了擂台！'],
      ['说书先生','有人说啊，这女子是青丘来的狐仙，夜里要吸人精气的……'],
      ['旁白','满堂的人都在笑。'],
      ['我','（……那是大师姐。）']]},
    langyao:{title:'少侠斩狼妖', get lines(){ return [
      ['说书先生','今日说一段新鲜的：北边安平村，有狼妖作乱，叼走了三个娃娃。'],
      ['说书先生','一位宗门少侠，单人独剑，追进狼山，一剑——斩了那狼妖的头！'],
      ['看客','好！'],
      ['说书先生','可奇怪的是，那狼妖临死，不跑，不逃，只是挡在一个草窝前头……'],
      ['说书先生','少侠后来说，草窝里头，什么也没有。'],
      ['旁白','你想起大师兄说过的话。草窝里的狼，到死都挡在洞口。'],
      ...(S.flags.c3_xj_met?[['我','（……草窝里，有一个孩子。）']]:[])]; }},   // read when told, not when the page loads
    xiao:{title:'萧大人发迹', lines:[
      ['说书先生','京城人人都知道萧大人。可萧大人是从哪儿来的，没人知道。'],
      ['说书先生','有人说他是北边山里出来的，十几岁进京，睡过屋顶，讨过饭。'],
      ['说书先生','后来不知怎么，入了国师的眼。三年，从一个跑腿的，做到了天子跟前。'],
      ['说书先生','（他压低声音）有人说，萧大人鼻子灵，能闻出谁身上有「好东西」。'],
      ['说书先生','……这个，小老儿就不敢往下说了。'],
      ['旁白','茶楼里静了一下。然后有人咳嗽，有人喝茶，没人接话。']]},
    changsheng:{title:'天子求长生', lines:[
      ['说书先生','今天说一段宫里的事。当今天子，最想要的是什么？'],
      ['说书先生','是长生。'],
      ['说书先生','国师替天子炼长生丹，一炼就是十年。丹炉不在宫里，在宗庙底下。'],
      ['说书先生','炼丹要药引子。药引子是什么？——这就没人知道了。'],
      ['说书先生','只知道，宗庙后门，夜里常有车进去。'],
      ['看客','（嗑瓜子的声音停了）……']]},
    yayu:{title:'贰负杀窫窳', lines:[
      ['说书先生','今天说一段《山海经》。上古有一位天神，名叫窫窳。'],
      ['说书先生','另有一位天神，名叫贰负。贰负听了他手下「危」的挑唆，和危一起，把窫窳杀了。'],
      ['说书先生','天帝大怒，把贰负和危锁在疏属山上，反绑双手，脚上戴着枷，挂在山顶的树上。'],
      ['说书先生','窫窳呢？窫窳死得冤。天帝让神医救他，救是救活了——'],
      ['说书先生','可活过来的窫窳，人面、牛身、马足，从此只吃人。'],
      ['说书先生','诸位，被冤杀的，最后变成了吃人的东西。这世上的事，常常是这样。']]},
    pingyao:{title:'萧大人平妖', lines:[
      ['说书先生','（醒木一拍）今天说一段新鲜热乎的——宗庙妖物作乱，萧大人单刀平妖！'],
      ['说书先生','那妖物人面牛身，一口能吞十个人！萧大人带着他的狼，杀进地宫——'],
      ['看客','好！萧大人威武！'],
      ['旁白','你坐在角落里，听着这个故事。故事里没有你，没有大师姐，没有顾长歌，也没有那些被关在地宫里的人。'],
      ['旁白','国师的名字，一次也没有出现。'],
      ['我','（……名声，又一次压过了真相。）']]},
  },
  order:()=>S.flags.c3_a5_win?['pingyao','yayu','huxian']:['huxian','langyao','xiao','changsheng','yayu'],
  today(){ const c=CL.st(), o=CL.order(); if(!c.heard.includes(o[0])) return o[0]; return o[S.day%o.length]; },
};
Object.assign(JC.CHAT,CL.CHAT);

/* ---------- the tale ---------- */
CL.listen=()=>{ const c=CL.st(); if(c.day===S.day) return UI.say([['说书先生','今天的书说完了。客官明儿请早。']]);
  if(S.stones<2) return UI.say([['茶博士','客官，茶钱两个灵石……没有？那、那您站着听吧。']],()=>CL.tell());
  S.stones-=2; UI.hud(); CL.tell(); };
CL.tell=()=>{ const c=CL.st(), k=CL.today(), t=CL.TALES[k]; c.day=S.day; if(!c.heard.includes(k)) c.heard.push(k); save();
  UI.say([['旁白',`茶博士给你倒了一碗茶。说书先生今天讲的是：「${t.title}」。`],...t.lines,...(k==='huxian'&&!c.huxian?[{choice:'你——', options:[{text:'站起来：「这是假的。」', fn:()=>CL.chai()},{text:'（攥紧茶碗，忍着）', fn:()=>CL.ren()}]}]:[])],()=>{ UI.hud(); Story.check(); }); };
CL.chai=()=>{ CL.st().huxian='chai'; save(); UI.say([
  ['旁白','你站了起来。满堂的笑声停了。'],
  ['我','这是假的。'],
  ['说书先生','（他眯起眼睛）哦？这位客官，说书说书，说的就是个热闹。您说是假的——那真的是什么样？'],
  ['我','真的是，她三更起来练剑，练了十几年。'],
  ['我','真的是，她赢的那一场，对手断了三根肋骨。不是跳下去的，是被她打下去的。'],
  ['我','真的是，她拿了头名的那天晚上，没有一个人去恭喜她。'],
  ['旁白','茶楼里没有人说话。'],
  ['书生','（角落里那个书生，慢慢地放下茶碗，鼓了两下掌）'],
  ['穿绸衫的胖子','嘁，较什么真……'],
  ['说书先生','（他看了你很久，然后把醒木轻轻放下了）……这位客官说得是。今儿这段，不说了。'],
  {love:{xie:100}},{flag:'c3_cl_chai'},
  ['旁白','（你走出茶楼的时候，听见身后有人在小声议论：「……那是她师弟师妹吧？」）']],()=>{ UI.hud(); Story.check(); }); };
CL.ren=()=>{ CL.st().huxian='ren'; save(); UI.say([
  ['旁白','你攥紧了茶碗，没有站起来。'],
  ['旁白','说书先生又说了半个时辰。你一句也没听进去。'],
  ['旁白','茶碗上，被你攥出了一道裂纹。'],
  {love:{xie:20}},{flag:'c3_cl_ren'}],()=>{ UI.hud(); Story.check(); }); };
// 大师姐 hears of it: the next time you talk to her, wherever she is
CL.xieLine=()=>S.flags.c3_cl_chai&&!S.flags.c3_cl_xie?(S.flags.c3_cl_xie=true,[['谢霁月','（她看着你，过了很久）……听雨轩的事，我听说了。'],['谢霁月','以后别做这种事。'],['谢霁月','……'],['谢霁月','谢谢。'],{love:{xie:30}}])
  :S.flags.c3_cl_ren&&!S.flags.c3_cl_xie?(S.flags.c3_cl_xie=true,[['谢霁月','你去听雨轩了？'],['谢霁月','（她看见你手上被茶碗硌出的红印）……我听了三年了。不疼的。']]):null;

/* ---------- talking ---------- */
CL.TALK={
  cl_teller:()=>[['说书先生','客官来了？今儿说一段——'],{choice:'听书？（茶钱 2 灵石，一天一段）', options:[{text:'听', fn:()=>CL.listen()},{text:'不了', fn:()=>{}}]}],
  cl_boshi:()=>[['茶博士','客官喝点什么？'],{choice:'买茶？', options:[{text:'明前茶一包（30 灵石）', fn:()=>{ if(S.stones<30) return UI.say([['茶博士','钱不够呀客官。']]); S.stones-=30; addItem('jc_tea',1); Sound.coin(); UI.hud(); save(); UI.toast('买了明前茶'); }},{text:'不了', fn:()=>{}}]}],
  cl_a:[['喝茶的老汉','听了三十年书了。'],['喝茶的老汉','书里的人，都是好人坏人。书外头的人，哪有那么简单。']],
  cl_b:()=>S.flags.c3_cl_chai?[['嗑瓜子的妇人','（她看见你，往旁边挪了挪）……那天站起来的，就是你吧？'],['嗑瓜子的妇人','我回去想了想，你说的，好像也有道理。']]:[['嗑瓜子的妇人','（咔嚓）听说了吗，那位狐仙又来京城了。'],['嗑瓜子的妇人','（咔嚓）啧啧啧。']],
  cl_c:[['书生','我进京赶考三年了。'],['书生','我写的文章，没人看。说书先生编的段子，满京城都在传。'],['书生','你说，这世上，真的是假的赢，还是真的赢？']],
  cl_d:()=>[['穿绸衫的胖子','说书嘛，图个乐子！'],...(S.flags.c3_cl_chai?[['穿绸衫的胖子','（他瞥了你一眼）……较什么真。']]:[])],
};
On.talk(id=>{ if(RT.mapId!=='jc_chalou') return false; const L=CL.TALK[id]; if(!L) return false; UI.say(typeof L==='function'?L():L); return true; });
On.act('clstage',o=>Story.talk('cl_teller'));
On.act('clstairs',o=>UI.say([['旁白','楼上是雅座。帘子垂着，里面有人在低声说话。'],['茶博士','雅座有人订了，客官楼下坐。']]));
CL.go=()=>{ enterMap('jc_chalou',8,11); RT.dir='up'; UI.hud(); };
{ const _m=C3.menu; C3.menu=(id,lines)=>{ if(id==='xie'){ const x=CL.xieLine(); if(x) return UI.say(x,()=>{ save(); }); } return _m(id,lines); }; }
