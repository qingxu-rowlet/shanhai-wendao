/* ============================================================
   山海问道 · people: friendship, gifts, two love interests, side quests
   Edit freely — lines use {名} for the player's name.
   ============================================================ */

/* ---------- new items & sprites ---------- */
Object.assign(SPR, {
  i_flower:['............','....p..p....','...pPpPPp...','..pPyPPyPp..','...pPPPPp...','....pPPp....','.....GG.....','....G.GG....','......G.....','.....GG.....','............','............'],
  i_wine:['............','.....NN.....','.....tt.....','....pppp....','...pPppppp..','...pppppPp..','...ppPpppp..','...pppppPp..','....pppp....','............','............','............'],
  i_chicken:['............','.....rr.....','....wwww....','...wkwwww...','..yywwwwww..','....wwwwwww.','....wwwwwwz.','.....wwwwz..','......y.y...','............','............','............'],
  flowerspot:['................','................','................','................','................','.....p....P.....','....pyp..PyP....','.....p.j..P.....','...P..jj.j...p..','..PyP..Jj...pyp.','...P.j.J..j..p..','.....jJJ.Jj.....','......JJJJ......','................','................','................'],
  chicken:['................','................','................','.......rr.......','......wwww......','.....wkwwww.....','....yywwwwww....','......wwwwwwww..','......wwwwwwwz..','.......wwwwwz...','........wwzz....','........y..y....','................','................','................','................'],
});
Object.assign(ITEMS, {
  flower:  {name:'野山茶', icon:'i_flower',  sell:10, desc:'山间开的粉色山茶花，香气清淡。'},
  wine:    {name:'桃花酿', icon:'i_wine',    price:40, sell:20, desc:'桃源镇特产的桃花酒，甜而不烈。'},
  chicken: {name:'芦花鸡', icon:'i_chicken', quest:true, desc:'阿禾家走失的芦花鸡，咯咯哒。'},
});
SHOP.sell.push('wine');

/* ---------- where things are ---------- */
const LOOK_TANG={g:'f',skin:0,hair:4,hairColor:1,style:'qun',cloth:3};
const LOOK_GE={g:'m',skin:2,hair:2,hairColor:0,style:'robe',cloth:1};
MAPS.town.objects.push(
  {type:'npc', id:'tang', x:8, y:14, look:LOOK_TANG, name:'苏小棠', act:'talk'},
  {type:'npc', id:'ge',   x:21, y:12, look:LOOK_GE, name:'顾长歌', act:'talk'});
MAPS.home.objects.push({type:'gather', x:19, y:9, item:'flower', spr:'flowerspot'},{type:'gather', x:2, y:12, item:'flower', spr:'flowerspot'});
MAPS.forest.objects.push({type:'gather', x:25, y:11, item:'flower', spr:'flowerspot'},{type:'gather', x:10, y:15, item:'flower', spr:'flowerspot'},
  {type:'gather', x:5, y:21, item:'flower', spr:'flowerspot'},
  {type:'gather', x:26, y:22, item:'chicken', spr:'chicken', free:true, cond:s=>s.side.chick==='active'&&!count(s,'chicken')});

/* ---------- people ---------- */
const NPCS = {
  ahe:   {name:'阿禾',   loves:['flower'], likes:['lingmo','zhuguo','chicken'], hates:['hide','qq_yu']},
  qian:  {name:'钱掌柜', loves:['qq_yu','hu_wei'], likes:['hide','wine','zhuji'], hates:['flower','lingmo']},
  yunyou:{name:'云游子', loves:['wine'], likes:['juqi','lingcao','zhuguo'], hates:['hide']},
  tang:  {name:'苏小棠', romance:true, loves:['flower','zhuguo'], likes:['lingcao','lingmo','huichun'], hates:['hide','qq_yu']},
  ge:    {name:'顾长歌', romance:true, loves:['wine','qq_yu'], likes:['juqi','zhuguo','hide'], hates:['flower','lingmo']},
};
const TALK = { // by friendship tier: 0 (<2♥) · 1 (2–3♥) · 2 (4–5♥) · 3 (6♥+)
  ahe:[['你好呀，{名}！今天也要去山里吗？','镇上的鸡都快被我数清楚了，一只都不能少！'],
       ['{名}，你身上有山林的味道，我一闻就知道。','奶奶说你是个好人，我也这么觉得。'],
       ['等我长大了，也要像你一样修仙！','你下次去山里，能带我去看看灵菇长在哪里吗？'],
       ['你是我在桃源镇最好的朋友！这个秘密只告诉你：我在后院藏了一罐糖。']],
  qian:[['客官里面请～','做生意讲究童叟无欺，这是我钱家的祖训。'],
        ['{名}啊，你采来的药材成色不错，以后有好货先给我留着。','最近城里的药价涨了，嘿嘿。'],
        ['跟你说句实话，我年轻时也想修仙，可惜没有灵根。','你是我见过最实在的修士。'],
        ['以后店里的东西，你随便看，给你算便宜点！']],
  yunyou:[['修行之道，一张一弛。','莫急，莫躁。'],
          ['你的气息比刚来时稳多了。','老道年轻时，也在这青丘山下住过。'],
          ['你可知山海经里记载的妖兽，并非都是恶的？','若遇见九尾狐，不妨先听听她怎么说。'],
          ['老道这一生收过三个徒弟，你是最有灵性的一个。']],
  tang:[['……你好。我在采药，你别踩到我的药苗就好。','这片水边的草药长得最好。'],
        ['{名}，你又来啦。今天要不要看看我新采的药？','我爹以前是镇上的郎中，药理都是他教我的。'],
        ['你每天打坐，手却还是这么凉……我给你配一副暖身的方子吧。','听说你一个人去打穷奇，我……我有点担心。'],
        ['{名}，你来的时候，我总是忍不住先抬头看看。','这包药草，是专门给你留的。']],
  ge:[['……','散修不需要宗门。','别跟着我。'],
      ['你的剑路很稳。我？没有师门，也不需要。','我在找一样东西……或者说，一只妖。','穷奇那一剑？顺手而已。'],
      ['我的剑法，是一个已经不在的人教的。','我从北方来，一路追着饕餮的踪迹。','那些宗门长老……最好别查我的来历。'],
      ['{名}，有你在，这一路好像没那么冷了。','若有一天我要离开桃源镇……你会来送我吗？']],
};
const GIFT_LINES = {
  love:{ahe:'哇！这是给我的吗？我最最喜欢这个了！',qian:'哎呀呀，这可是好东西！客官太客气了！',yunyou:'哈哈，知老道者，{名}也！',tang:'这……是送给我的？谢谢你，我会好好收着的。',ge:'……你怎么知道我喜欢这个。多谢。'},
  like:{ahe:'谢谢你，{名}！',qian:'嗯，不错不错。',yunyou:'有心了。',tang:'谢谢，正好用得上。',ge:'多谢。'},
  neutral:{ahe:'嗯？谢谢……',qian:'哦，好的。',yunyou:'嗯。',tang:'谢谢。',ge:'嗯。'},
  hate:{ahe:'呜……这个有点吓人……',qian:'这东西……我可不收啊。',yunyou:'这个嘛……老道心领了。',tang:'……我不太喜欢这个。',ge:'拿走。'},
};
const HEART_EVENTS = {
  tang:{2:[['苏小棠','{名}，等一下！'],['旁白','苏小棠从药篓里拿出一个绣着山茶花的小香囊，红着脸塞进你手里。'],['苏小棠','里面是安神的药草……打坐的时候戴着，会好一些。'],{give:{huichun:1}}],
        4:[['旁白','夕阳下，苏小棠坐在池塘边，轻轻哼着一首小调。'],['苏小棠','这是我娘以前唱给我听的。她说，等我遇见想一起看夕阳的人，就唱给他听。'],['苏小棠','……我刚才什么都没说！'],{exp:40}]},
  ge:{2:[['顾长歌','你来得正好。'],['旁白','顾长歌把一柄木剑抛给你。'],['顾长歌','陪我练一招。不用留手。'],['旁白','几个回合后，他收剑而立，嘴角难得地扬了一下。'],['顾长歌','不错。这个给你，路上用得着。'],{give:{juqi:1}}],
      4:[['旁白','月色下，顾长歌独自擦拭着他的佩剑。'],['顾长歌','这把剑是我师父留下的。他死在饕餮口中。'],['顾长歌','……我从没跟别人说过这件事。'],['顾长歌','{名}，谢谢你听我说完。'],{exp:40}]},
};

/* ---------- side quests ----------
   need:{item:n} items handed over · count:{type:'meditated'|'kill'|'craft', key, n} things you do after accepting
   reward:{stones, give:{item:n}, heart:{npc:points}, energy:n} */
const SIDES = [
  {id:'soup', giver:'ahe', title:'阿禾的灵菇汤', desc:'阿禾想给生病的奶奶炖一锅灵菇汤，需要 3 朵灵菇。', need:{lingmo:3},
    unlock:s=>s.flags.met_ahe, reward:{stones:60, give:{huichun:1}, heart:{ahe:60}},
    start:[['阿禾','奶奶这几天咳得厉害……听说灵菇炖汤最补了。'],['阿禾','{名}，你去山林的时候，能帮我采 3 朵灵菇吗？']],
    done:[['阿禾','哇，好新鲜的灵菇！奶奶喝了一定会好起来的。'],['阿禾','这些灵石你收下，还有这颗回春丹是奶奶以前留的。']],
    target:s=>count(s,'lingmo')>=3?npcAt('ahe'):['forest',3,11,'灵菇']},
  {id:'chick', giver:'ahe', title:'走失的芦花鸡', desc:'阿禾家的芦花鸡跑进了青丘山林深处，把它带回来。', need:{chicken:1},
    unlock:s=>s.side.soup==='done', reward:{stones:50, give:{zhuguo:2}, heart:{ahe:80}},
    start:[['阿禾','呜呜，{名}，我家的芦花鸡不见了！'],['阿禾','有人说看见它往山林南边跑了，在狐祠东边那一带……你能帮我找找吗？']],
    done:[['阿禾','芦花！你回来啦！'],['旁白','芦花鸡咯咯叫着扑进阿禾怀里。'],['阿禾','谢谢你，{名}！这两颗朱果是我从奶奶那里求来的，给你！']],
    target:s=>count(s,'chicken')?npcAt('ahe'):['forest',26,22,'芦花鸡']},
  {id:'order', giver:'qian', title:'钱掌柜的订单', desc:'钱掌柜要收 5 株灵草，送去城里的药铺。', need:{lingcao:5},
    unlock:s=>s.quest>=3, reward:{stones:90, heart:{qian:40}},
    start:[['钱掌柜','{名}啊，城里药铺跟我订了一批灵草，5 株，价钱好说！'],['钱掌柜','山林里就采得到，灵草在洞府前和山林北边最多。']],
    done:[['钱掌柜','好好好，这成色！说好的，90 灵石，童叟无欺。']],
    target:s=>count(s,'lingcao')>=5?npcAt('qian'):['forest',4,2,'灵草（山林采集）']},
  {id:'hides', giver:'qian', title:'兽皮生意', desc:'钱掌柜想收 4 张兽皮，做成冬天的皮袄。', need:{hide:4},
    unlock:s=>s.quest>=4, reward:{stones:120, heart:{qian:40}},
    start:[['钱掌柜','山里的野兽多了，兽皮也多了——这可是好生意！'],['钱掌柜','帮我弄 4 张兽皮来，打败当康、蛊雕都可能掉。']],
    done:[['钱掌柜','啧啧，这毛色！今年冬天镇上的人不愁冷了。']],
    target:s=>count(s,'hide')>=4?npcAt('qian'):['forest',8,8,'山林里的野兽']},
  {id:'daily', giver:'yunyou', title:'勤修不辍', desc:'云游子让你在蒲团上打坐 3 次，稳固根基。', count:{type:'meditated', n:3},
    unlock:s=>s.L>=1, reward:{give:{juqi:2}, heart:{yunyou:40}},
    start:[['云游子','修行最忌一曝十寒。从今日起，你在蒲团上打坐三次，老道看看你的心性。']],
    done:[['云游子','根基扎实了不少。这两颗聚气丹，拿去吧。']],
    target:s=>sideReady(s,SIDES.find(q=>q.id==='daily'))?npcAt('yunyou'):['home',16,4,'蒲团']},
  {id:'dan', giver:'yunyou', title:'初窥丹道', desc:'在洞府的丹炉里炼成一颗聚气丹（2 株灵草）。', count:{type:'craft', key:'juqi', n:1},
    unlock:s=>s.quest>=4, reward:{give:{zhuguo:3}, heart:{yunyou:40}},
    start:[['云游子','修仙者，丹药为辅。你洞府旁那只丹炉，是老道年轻时用过的。'],['云游子','先试着炼一颗聚气丹吧，两株灵草便够。']],
    done:[['云游子','火候虽然欠一点，但丹成了。好！'],['云游子','这三颗朱果，以后炼筑基丹用得上。']],
    target:s=>sideReady(s,SIDES.find(q=>q.id==='dan'))?npcAt('yunyou'):['home',18,4,'丹炉']},
  {id:'letters', giver:'tang', title:'小棠的花笺', desc:'苏小棠想用野山茶做花笺，需要 3 朵野山茶。', need:{flower:3},
    unlock:s=>(s.rel&&s.rel.tang&&s.rel.tang.pts>0), reward:{give:{huichun:2}, heart:{tang:100}},
    start:[['苏小棠','你知道吗，野山茶的花瓣压干了，可以做成花笺写字。'],['苏小棠','洞府附近和山林里都有……你能帮我采 3 朵吗？']],
    done:[['苏小棠','好香……谢谢你，{名}。'],['苏小棠','第一张花笺做好了，我……我先不给你看。这两颗回春丹你拿着。']],
    target:s=>count(s,'flower')>=3?npcAt('tang'):['home',19,9,'野山茶']},
  {id:'sword', giver:'ge', title:'长歌试剑', desc:'顾长歌想看看你的身手：击败 2 只蛊雕（炼气四层后出现在山林西南）。', count:{type:'kill', key:'guidiao', n:2},
    unlock:s=>s.L>=4&&(s.rel&&s.rel.ge&&s.rel.ge.pts>0), reward:{give:{juqi:2}, heart:{ge:100}},
    start:[['顾长歌','听说山林西南有蛊雕伤人。'],['顾长歌','你去斩两只回来。我想看看，你的剑能不能护住别人。']],
    done:[['顾长歌','……干净利落。'],['顾长歌','以后若要去危险的地方，叫上我。']],
    target:s=>sideReady(s,SIDES.find(q=>q.id==='sword'))?npcAt('ge'):['forest',6,19,'蛊雕出没处']},
  {id:'offering', giver:'tang', title:'狐祠供奉', desc:'按小棠说的，把 2 株灵草供在山林南边的青丘狐祠前。', need:{lingcao:2}, deliverAt:'shrine',
    unlock:s=>s.flags.qiongqi_done, reward:{exp:80, give:{huichun:2}, heart:{tang:40}},
    start:[['苏小棠','我娘说，青丘狐祠里住着守护这片山的狐仙。'],['苏小棠','穷奇被赶走了，我们该去谢谢她。你帮我供两株灵草，好不好？']],
    done:[['旁白','你把灵草轻轻放在香炉前。一缕温暖的狐火在祠中亮起，又悄悄熄灭。'],['旁白','你只觉灵台一片清明，修为又精进了一些。']],
    target:s=>count(s,'lingcao')>=2?['forest',15,21,'青丘狐祠']:['forest',4,2,'灵草（山林采集）']},
];
function sideCountNow(s,c){ s.st.kb=s.st.kb||{}; s.st.crafted=s.st.crafted||{};
  return c.type==='meditated'?s.st.meditated:c.type==='kill'?(s.st.kb[c.key]||0):c.type==='killall'?s.st.kills:c.type==='grade'?(s.st.topGrade||0):c.type==='pet'?(s.pet?1:0):(s.st.crafted[c.key]||0); }
function sideProgress(s,q){
  if(q.progress) return q.progress(s);
  if(q.need) return Object.entries(q.need).map(([k,n])=>`${ITEMS[k].name} ${Math.min(count(s,k),n)}/${n}`).join(' · ');
  if(q.count){ const c=q.count, done=sideCountNow(s,c)-(s.side[q.id+'_base']||0);
    const label={meditated:'打坐',killall:'击败妖兽',grade:'上品丹',pet:'收服灵宠'}[c.type]||(c.type==='kill'?'击败'+BEASTS[c.key].name:'炼成'+ITEMS[c.key].name);
    return `${label} ${Math.min(c.n,done)}/${c.n}`; }
  return '';
}
function sideReady(s,q){
  if(q.need) return Object.entries(q.need).every(([k,n])=>count(s,k)>=n);
  if(q.count) return sideCountNow(s,q.count)-(s.side[q.id+'_base']||0)>=q.count.n;
  return false;
}

/* ---------- friendship ---------- */
const Social = {
  rel(id){ S.rel=S.rel||{}; return S.rel[id]=S.rel[id]||{pts:0, talked:0, gifted:0, known:{}, ev:{}}; },
  hearts(id){ return Math.min(10, Math.floor(Social.rel(id).pts/100)); },
  tier(id){ const h=Social.hearts(id); return h>=6?3:h>=4?2:h>=2?1:0; },
  add(id,n){ const r=Social.rel(id), before=Social.hearts(id); r.pts=Math.max(0,Math.min(1000,r.pts+n)); const after=Social.hearts(id);
    if(after>before) UI.toast(`${NPCS[id].name} 好感 ${'♥'.repeat(after)}`); },
  menu(id){
    const n=NPCS[id]; if(!n) return;
    const opts=[];
    if(id==='qian') opts.push({text:'买卖', fn:()=>UI.shop()});
    if(id==='yunyou') opts.push({text:'请教', fn:()=>{ const q=Story.quest(); UI.say(q&&q.id!=='end'?[['云游子','眼下要做的事——'+q.title+'：'+q.desc]]:SCRIPTS.talk_yunyou); }});
    opts.push({text:'聊天', fn:()=>Social.chat(id)},{text:'送礼', fn:()=>Social.giftPick(id)},{text:'离开', fn:()=>{}});
    UI.say([{choice:`${n.name}　${'♥'.repeat(Social.hearts(id))}${'♡'.repeat(Math.max(0,(n.romance?10:8)-Social.hearts(id)))}${Social.rel(id).gifted===S.day?'　（今天已送过礼）':''}`, options:opts}]);
  },
  chat(id){
    const r=Social.rel(id), n=NPCS[id], h=Social.hearts(id);
    const ev=HEART_EVENTS[id]; if(ev) for(const lv of [2,4]) if(h>=lv && !r.ev[lv]){ r.ev[lv]=true; Sound.levelup(); UI.say(ev[lv]); return; }
    let pool=TALK[id][Social.tier(id)];
    if(id==='tang'&&S.flags.tang_sect) pool=pool.concat(S.sect==='dan'?['{名}，我们是同门呢！药尘长老说，你的火候比我稳。','今天长老教我认了三十种灵药，你要不要听我背一遍？']:['药王谷的功课好多……不过我很开心！','你在宗门里过得好吗？要是受了伤，记得来找我。']);
    const line=pool[Math.floor(Math.random()*pool.length)];
    if(r.talked!==S.day){ r.talked=S.day; Social.add(id,20); }
    UI.say([[n.name,line]]);
  },
  giftPick(id){
    const r=Social.rel(id), n=NPCS[id];
    if(r.gifted===S.day) return UI.say([[n.name,'今天已经收过你的礼物啦。']]);
    const ids=Object.keys(S.inv).filter(k=>S.inv[k]>0&&!ITEMS[k].tool&&k!=='slip');
    UI.panel(`送礼给 ${n.name}`, ids.length?`<p class="muted">每人每天可以送一份礼物。送过的礼物，会记下对方的喜好。</p><div class="grid">${ids.map(k=>`<button class="cell" data-g="${k}" aria-label="${ITEMS[k].name}">${itemIcon(k)}<b>${S.inv[k]}</b>${r.known[k]?`<i class="pref ${r.known[k]}">${{love:'最爱',like:'喜欢',neutral:'一般',hate:'讨厌'}[r.known[k]]}</i>`:''}</button>`).join('')}</div>`:'<p class="muted">行囊里没有可以送的东西。</p>', b=>{
      b.querySelectorAll('[data-g]').forEach(x=>x.onclick=()=>{ UI.closePanel(); Social.give(id,x.dataset.g); }); });
  },
  give(id,item){
    const r=Social.rel(id), n=NPCS[id];
    const kind=n.loves.includes(item)?'love':n.likes.includes(item)?'like':n.hates.includes(item)?'hate':'neutral';
    if(item==='chicken'&&S.side.chick==='active'&&id==='ahe') return Story.side('ahe');
    addItem(item,-1); r.gifted=S.day; r.known[item]=kind;
    Social.add(id,{love:80,like:45,neutral:20,hate:-30}[kind]); Sound[kind==='hate'?'hurt':'coin']();
    UI.say([[n.name,GIFT_LINES[kind][id]]]);
  },
};

/* ---------- 人物 tab ---------- */
UI.people=()=>{
  const rows=Object.keys(NPCS).map(id=>{ const n=NPCS[id], r=Social.rel(id), h=Social.hearts(id), max=n.romance?10:8;
    const known=Object.entries(r.known).filter(([,v])=>v==='love'||v==='like').map(([k,v])=>`<span class="pref ${v}">${ITEMS[k].name}</span>`).join('');
    return `<div class="person"><canvas class="px" data-npc="${id}" width="18" height="22"></canvas><div class="pinfo"><b>${n.name}${n.romance?'<small class="rom">可结缘</small>':''}</b>
      <span class="hearts">${'<i class="on">♥</i>'.repeat(h)}${'<i>♥</i>'.repeat(Math.max(0,max-h))}</span>
      <span class="muted">${r.talked===S.day?'今天聊过了':'今天还没聊天'} · ${r.gifted===S.day?'今天送过礼':'今天还能送礼'}</span>
      ${known?`<span class="kn">已知喜好：${known}</span>`:''}${typeof HEART_CG!=='undefined'&&HEART_CG[id]?`<span class="kn">心动事件：${[2,4,6,8].map(lv=>r.ev[lv]?`<button class="btn mini cgb" data-cg="${id}:${lv}">${HEART_CG[id][lv].title}</button>`:`<span class="lock">${lv}♥ 解锁</span>`).join(' ')}</span>`:''}</div></div>`; }).join('');
  return rows;
};
function npcSprite(id){
  for(const m in MAPS) for(const o of MAPS[m].objects) if(o.id===id) return o.look?lookSprite(o.look,'down',0):sprite(o.spr);
  return null;
}
