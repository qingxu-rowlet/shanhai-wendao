/* ============================================================
   山海问道 · 第三章「京城」 · 京城的小事 — four small stories for the days in the capital, each one person and a few steps:
   - 寻亲: the woman just in from the north, whose villages emptied, came to find her uncle 赵木匠. His shop in 东市 is shut;
     the wonton seller knows he moved to 西市 to mend 博古斋's shelves. Find him; bring her the news; she goes to him.
   - 书生的文章: the scholar on 朱雀大街, three years at the exams, wrote 《北村记》 — the empty villages, the notice
     「妖患，迁」. No print shop will touch it. Take it to 琅琊阁; the old keeper reads it and copies it out, unsigned.
     The next days the patrols tear copies off the walls, and can't tear them all.
   - 卖花的小姑娘: at dusk by the river her flowers haven't sold and her mother's ill. Buy them all; she gives you the
     lantern she folded herself and asks you to let it go for her mother.
   - 赌客的债: the gambler in 东市 who'll be sent "to work out of town" like 鲁三. Pay his 100 灵石 and he goes home;
     don't, and after it's over he's one of the people let out from under the 宗庙.
   ============================================================ */
const SQ={ st(){ const c=C3.st(); c.sq=c.sq||{}; return c.sq; }, on:()=>!!S.flags.c3_sf_in };
Object.assign(ITEMS,{
  jc_fu:{name:'平安符', icon:'i_slip', color:'#c84a3a', sell:1, desc:'红布缝的平安符，针脚歪歪扭扭的。北边来的那个女人亲手缝的。'},
  jc_wen:{name:'《北村记》', icon:'i_book', sell:0, desc:'落第书生写的文章，写北边那些空了的村子。没有一家书坊肯刻。'},
  jc_shan:{name:'题诗扇', icon:'i_slip', color:'#e8e0c8', sell:20, desc:'书生题了诗的折扇：「北村无犬吠，京华有笙歌。」'},
});
NPCS.tang.likes.push('jc_fu'); NPCS.xie.likes.push('jc_shan'); NPCS.xiao.loves.push('jc_shan');

/* ---------- 寻亲 ---------- */
MAPS.jc_xishi.objects.push(
  {type:'npc', id:'sq_zhao', x:20, y:18, look:{g:'m',skin:2,hair:0,hairColor:1,style:'jin',cloth:3,face:'mid',beard:'#5a4a3a'}, name:'赵木匠', act:'talk', cond:s=>!!s.flags.c3_sq_qin_ask},
  {type:'npc', id:'sq_niece', x:19, y:19, look:{g:'f',skin:1,hair:4,hairColor:1,style:'qun',cloth:3,face:'mid'}, name:'赶路的人', act:'talk', cond:s=>!!s.flags.c3_sq_qin_done});
for(const o of MAPS.jc_zhuque.objects) if(o.id==='jc_traveler') o.cond=s=>!s.flags.c3_sq_qin_done;
Object.assign(JC.CHAT,{jc_traveler:['有人认识赵木匠吗……'], jc_scholar:['……没有一家书坊肯刻。'], sq_zhao:['（叮叮当当）'], sq_niece:['表舅，钉子——']});
{ const base=JC.TALK.jc_traveler; JC.TALK.jc_traveler=()=>{ const F=S.flags;
    if(!SQ.on()) return base;
    if(F.c3_sq_qin_found) return [['旁白','你告诉她：赵木匠在西市，博古斋，修架子。'],['赶路的人','（她愣住了）……还在？'],['赶路的人','他还在？'],
      ['旁白','她把包袱往肩上一甩，跑了两步，又跑回来，从怀里摸出一个红布包，塞进你手里。'],['赶路的人','平安符。我娘教我缝的。……我们村，就剩我会缝了。'],
      {give:{jc_fu:1}},{exp:150},{flag:'c3_sq_qin_done'},{run:()=>C3.sync()},['旁白','她跑远了。朝着西市。']];
    if(F.c3_sq_qin_ask) return [['赶路的人','东市那边，我去问过了，铺子关着……'],['赶路的人','你要是打听到了，告诉我。我就在这儿等。']];
    return [...base,['赶路的人','我表舅姓赵，是个木匠。从前在东市杂货铺隔壁做活。'],['赶路的人','我去了，铺子关着门。问谁都说不知道……'],
      {choice:'帮她找？', options:[{text:'我帮你打听', fn:()=>{ C3.set('c3_sq_qin_ask'); UI.say([['赶路的人','（她眼睛红了）……谢谢。谢谢。']]); }},{text:'（走开）', fn:()=>{}}]}]; }; }
{ const base=QJ.TALK.ds_wonton; QJ.TALK.ds_wonton=()=>{ const F=S.flags, L=[];
    if(F.c3_sq_qin_ask&&!F.c3_sq_qin_found) L.push(['卖馄饨的','赵木匠？他呀，铺子租不起了，搬去西市了。'],['卖馄饨的','听说在给博古斋修架子。'],{flag:'c3_sq_qin_hint'});
    if(F.c3_sq_du===2) L.push(['卖馄饨的','那个赌鬼？回家了。他媳妇拿着擀面杖，追了他三条街。'],['卖馄饨的','（她笑了）该。']);
    else if(F.c3_a5_win) L.push(['卖馄饨的','那个赌鬼……听说是从宗庙底下放出来的。'],['卖馄饨的','瘦了一圈。再也不赌了。']);
    return L.length?L:(typeof base==='function'?base():base); }; }
SQ.TALK={
  sq_zhao:()=>S.flags.c3_sq_qin_done?[['赵木匠','（他在钉架子，手停了一下）……你就是那个，告诉她我在这儿的人？'],['赵木匠','我姐家，就剩她一个了。'],['赵木匠','（他低下头，接着钉）……谢了。']]
    :[['赵木匠','（叮叮当当）客官要修什么？'],['我','北边来了一个人，在朱雀大街找你。她说你是她表舅。'],['赵木匠','（锤子掉在了地上）……北边？哪个村的？'],
      ['赵木匠','……她还活着？'],['赵木匠','我写了三封信回去，一封都没有回。我还以为……'],['赵木匠','（他擦了擦手，又擦了擦，好像不知道手该往哪儿放）'],['赵木匠','你、你让她来。我这儿有地方住。'],{flag:'c3_sq_qin_found'}],
  sq_niece:[['赶路的人','（她在给赵木匠递钉子，看见你，笑了）'],['赶路的人','表舅说，等开了春，再带我回去看一趟。'],['赶路的人','……看看还有没有人。']],
};
On.talk(id=>{ const L=SQ.TALK[id]; if(!L) return false; UI.say(typeof L==='function'?L():L,()=>{ UI.hud(); save(); }); return true; });

/* ---------- 书生的文章 ---------- */
{ const base=JC.TALK.jc_scholar; JC.TALK.jc_scholar=()=>{ const F=S.flags, c=SQ.st();
    if(!SQ.on()) return base;
    if(F.c3_sq_shu_done) return S.day>c.shuDay?[['书生','（他压低声音）你看见了吗？满城都在传抄。'],['书生','今早巡街的撕了好几张。'],['书生','（他笑了）撕不完的。']]
      :[['书生','我还是去考。三年一考。'],['书生','可是这一回，我知道自己写的东西，有人看了。']];
    if(F.c3_sq_shu_print) return [['旁白','你告诉他：琅琊阁主看了，说替他抄一百份，不署名。'],['书生','（他张着嘴，半天没说出话来）……一百份？'],
      ['书生','（他把手里的折扇打开，咬破手指，想了想，又换了支笔，在扇面上写了两行字）'],['书生','这个给你。我身上，就这个还值点钱。'],
      {give:{jc_shan:1}},{exp:150},{run:()=>{ SQ.st().shuDay=S.day; }},{flag:'c3_sq_shu_done'}];
    if(F.c3_sq_shu_ask) return [['书生','琅琊阁……阁主那个人，脾气怪，可是识字。'],['书生','你替我问问。']];
    return [...base,['书生','（他犹豫了一下，从怀里抽出一卷纸）……这是我写的。《北村记》。'],
      ['旁白','你接过来看了几行。写的是北边的村子：门上的封条，「妖患，迁」；空了的灶台；没人收的麦子。'],
      ['书生','京城所有的书坊我都去过了。没有一家肯刻。他们说，惹不起。'],
      {choice:'帮他？', options:[{text:'我替你拿去琅琊阁问问', fn:()=>{ addItem('jc_wen',1); C3.set('c3_sq_shu_ask'); UI.say([['书生','（他朝你深深作了一揖）']]); }},{text:'（还给他）', fn:()=>{}}]}]; }; }
{ const base=XS.TALK.xs_lang; XS.TALK.xs_lang=()=>{ if(!count(S,'jc_wen')||S.flags.c3_sq_shu_print) return base();
    addItem('jc_wen',-1); S.flags.c3_sq_shu_print=true; save();
    return [['琅琊阁主','（他接过那卷纸）时文？琅琊阁不收时文。'],['旁白','他还是看了。看完一页，又翻回去，再看一遍。'],['琅琊阁主','……'],
      ['琅琊阁主','（他把纸卷好，放在柜台上，压了一块镇纸）我替他抄。一百份。'],['琅琊阁主','不署名。署了名，他就考不成了。'],['琅琊阁主','……也活不成了。']]; }; }

/* ---------- 卖花的小姑娘 ---------- */
{ const base=ZY.TALK.zy_flower; ZY.TALK.zy_flower=()=>{ const F=S.flags, c=SQ.st();
    if(F.c3_sq_hua_done) return S.day>c.huaDay?[['卖花的小姑娘','（她今天笑着）大哥哥大姐姐！我娘好些了！'],['卖花的小姑娘','（她塞给你一枝海棠）不要钱！']]:[['卖花的小姑娘','……灯，放了吗？'],['卖花的小姑娘','嗯。谢谢。']];
    if(F.c3_sq_hua_deng) return [['卖花的小姑娘','河埠头，就在柳树那边。'],['卖花的小姑娘','写我娘的名字……我娘叫春娘。']];
    if(!SQ.on()||!HD.dusk()) return base;
    return [['卖花的小姑娘','（她蹲在花铺门口，篮子里的花还剩一大半）'],['卖花的小姑娘','……天黑了，花就要蔫了。'],['卖花的小姑娘','我娘病了好几天了。今天卖不完，就抓不起药了。'],
      {choice:'你——', options:[{text:'全买下（30 灵石）', fn:()=>{ if(S.stones<30) return UI.say([['旁白','你摸了摸钱袋。不够。']]); S.stones-=30; addItem('flower',3); UI.hud(); S.flags.c3_sq_hua_deng=true; addItem('jc_deng',1); save();
        UI.say([['卖花的小姑娘','（她愣了一下，抱着空篮子站起来）……都买？'],['卖花的小姑娘','（她从篮子底下摸出一盏纸叠的河灯，叠得歪歪扭扭的）'],
          ['卖花的小姑娘','这个是我自己叠的，本来想给我娘放。可是我得赶紧去抓药了……'],['卖花的小姑娘','你帮我放，好不好？写我娘的名字。她叫春娘。'],['旁白','（得到：河灯。去河埠头放。）']],()=>UI.hud()); }},
      {text:'买一枝（15 灵石）', fn:()=>{ if(S.stones<15) return; S.stones-=15; addItem('flower',1); UI.hud(); save(); UI.say([['卖花的小姑娘','谢谢……']]); }},
      {text:'（走开）', fn:()=>{}}]}]; }; }
HD.more=HD.more||[];
HD.more.push(()=>S.flags.c3_sq_hua_deng&&!S.flags.c3_sq_hua_done?{text:'写「春娘」——卖花小姑娘的娘', fn:()=>{ const h=HD.st(); h.day=S.day; addItem('jc_deng',-1);
  HD.live.push({x:8.5, y:13.2, t:0, seed:Math.random()*9}); S.flags.c3_sq_hua_done=true; SQ.st().huaDay=S.day; save();
  UI.say([['旁白','你在纸条上写了两个字：春娘。'],['旁白','那盏歪歪扭扭的河灯，在水里转了一圈，才慢慢漂出去。'],['旁白','它漂得很稳。'],{exp:100}],()=>{ UI.hud(); Story.check(); }); }}:null);

/* ---------- 赌客的债 ---------- */
for(const o of MAPS.jc_dongshi.objects) if(o.id==='ds_gambler') o.cond=s=>s.flags.c3_sq_du!==2;
{ const base=QJ.TALK.ds_gambler; QJ.TALK.ds_gambler=()=>{ const b=typeof base==='function'?base():base;
    if(!SQ.on()||S.flags.c3_sq_du||S.flags.c3_a4_done) return b;
    return [...b,['输光了的赌客','（他抬头看你）……一百灵石。就差一百灵石。'],
      {choice:'你——', options:[
        {text:'替他还了（100 灵石）', fn:()=>{ if(S.stones<100) return UI.say([['旁白','你身上没有一百灵石。']]); S.stones-=100; S.flags.c3_sq_du=2; UI.hud(); save();
          UI.say([['旁白','你走到千金坊门口，把一百灵石扔给了打手。'],['千金坊的打手','（他数了数，看了那赌客一眼）……行。'],['千金坊的打手','（他小声嘟囔）少一个也不打紧。'],
            ['输光了的赌客','（他扑通跪下，给你磕了个头，爬起来就往家跑）'],{exp:100}],()=>{ C3.sync(); UI.hud(); Story.check(); }); }},
        {text:'给他 10 灵石吃饭', fn:()=>{ if(S.stones<10) return; S.stones-=10; S.flags.c3_sq_du=1; UI.hud(); save();
          UI.say([['输光了的赌客','（他接过灵石，眼睛亮了）'],['旁白','他转身，进了千金坊。']]); }},
        {text:'（走开）', fn:()=>{}}]}]; }; }
