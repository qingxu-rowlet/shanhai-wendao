/* ============================================================
   山海问道 · 审查节点 — every review point has its own link: …/#t-<id>
   Opening it builds a test character (save slot 3), sets up the story state, puts you right next to
   the thing to check, and pins a note saying what to look at. …/#review lists every node.
   ============================================================ */
const Review = {
  NODES:[
    // 流程
    {id:'prologue', group:'流程', title:'新开存档 · 序章', check:'创建角色 → 测灵根 → 云游子交代采灵草。节奏顺不顺？提示看不看得懂？',
      run(){ RT.slot=SLOTS-1; try{ localStorage.removeItem(slotKey(RT.slot)); }catch(e){} Creator.open(RT.slot); }},
    {id:'gather', group:'流程', title:'采灵草 → 打坐', check:'站在灵草旁：头顶有没有「E / 采」提示？采完后去右上的蒲团打坐，主线能不能推进？',
      run(){ Review.base({quest:'q1', L:0}); Review.at('home',4,9,'up'); }},
    {id:'town', group:'流程', title:'初到桃源镇', check:'阿禾的对话里有没有介绍小棠和长歌？左上任务列表会出现新的支线。',
      run(){ Review.base({quest:'q3', L:1}); Review.at('town',15,10,'right'); }},
    {id:'qiongqi', group:'剧情', title:'讨伐穷奇', check:'站在狐祠前，点狐祠开战。登场动画、战斗音乐、半血换阶段、战后顾长歌出手。',
      run(){ Review.base({quest:'q6', L:5, inv:{huichun:3}, kills:3}); Review.at('forest',15,20,'down'); }},
    {id:'zhuji', group:'剧情', title:'筑基：心魔 + 天劫', check:'站在蒲团旁，点蒲团冲击筑基：心魔战 → 躲天雷。',
      run(){ Review.base({quest:'q7', L:9, full:true, flags:{qiongqi_done:true}, inv:{zhuji:1, huichun:3}}); Review.at('home',16,5,'up'); }},
    {id:'sect', group:'剧情', title:'拜师大典', check:'站在测灵石旁，点它：小棠拜入药王谷、长歌说「我是散修」、选门派、师父叫你小师弟/小师妹。',
      run(){ Review.base({quest:'sect', L:10, flags:{qiongqi_done:true, sect_open:true}}); Review.at('town',12,8,'up'); }},
    {id:'huli', group:'剧情', title:'青丘狐影 → 饕餮', check:'站在狐祠前，点狐祠：九尾狐登场、二选一、饕餮登场动画、第一章结束。',
      run(){ Review.base({quest:'q8', L:10, sect:'jian', flags:{qiongqi_done:true, sect_open:true, tang_sect:true}, inv:{huichun:4}}); Review.at('forest',15,20,'down'); }},
    // 界面
    {id:'hud', group:'界面', title:'任务列表 HUD', check:'左上角同时有主线和几个支线：字够不够大？点一行切换追踪，点「寻路」自动走过去。手机上会不会挡视线？',
      run(){ Review.base({quest:'q5', L:3, sect:null, flags:{met_ahe:true}, side:{soup:'active'}}); Review.at('town',12,11,'down'); }},
    {id:'prompt', group:'界面', title:'互动提示（E 键）', check:'走近阿禾、灵草、狐祠等：头顶出现 E（手机上是「聊 / 采 / 点」），按 E 能不能直接互动？',
      run(){ Review.base({quest:'q4', L:2}); Review.at('town',15,10,'right'); }},
    // 钓鱼
    {id:'fish', group:'钓鱼', title:'手持鱼竿 + 钓鱼', check:'手里拿着鱼竿；靠近水边按 E（或点水面）抛竿，能看到鱼线和浮漂，咬钩时浮漂下沉；钓鱼面板在屏幕下方。',
      run(){ Review.base({quest:'q4', L:2, inv:{rod:1}}); S.sel='rod'; Review.at('town',5,14,'down'); }},
    {id:'fishking', group:'钓鱼', title:'金光水面 · 鱼王', check:'脚下就是金光水面，夜里钓鱼王的概率最高。鱼王上钩时的特效和难度是否合适？',
      run(){ Review.base({quest:'q4', L:2, inv:{rod:1}}); S.sel='rod'; S.min=22*60; S.glow=[{map:'town',x:5,y:15}]; Review.at('town',5,14,'down'); }},
    {id:'meditate', group:'修炼', title:'闭关打坐', check:'站在洞府的蒲团旁，按 E 打坐：拖动滑条选时长（2 小时到 30 天），看预计境界和「一直闭关的话」多久到哪一层，再看进度条。也可以等到半夜 12 点，确认不会再昏倒。',
      run(){ Review.base({quest:'q4', L:2}); S.min=22*60; Review.at('home',4,9,'up'); setTimeout(()=>meditate(),400); }},
    {id:'art-town', group:'美术', title:'桃源镇（白天）', check:'新画的房子、石板广场、土路边缘、池塘、飘落的花瓣和云影。',
      run(){ Review.base({quest:'q4', L:2}); S.min=11*60; Review.at('town',11,5,'down'); }},
    {id:'art-forest', group:'美术', title:'青丘山林（傍晚）', check:'树的光影、池塘深浅和沙岸、高草、落叶，以及傍晚的暖色。',
      run(){ Review.base({quest:'q4', L:2}); S.min=17*60; Review.at('forest',8,11,'down'); }},
    {id:'art-night', group:'美术', title:'洞府（夜里）', check:'萤火虫、灯笼的光、夜里的路和崖壁。',
      run(){ Review.base({quest:'q4', L:2}); S.min=21*60; Review.at('home',11,6,'down'); }},
    // 配乐
    {id:'music-village', group:'配乐', title:'村庄主题', check:'桃源镇白天的古筝 + 箫。点一下画面开始播放（iPhone 请关闭静音开关）。',
      run(){ Review.base({quest:'q4', L:2}); S.min=10*60; Review.at('town',12,11,'down'); Music.play('village',true); }},
    {id:'music-battle', group:'配乐', title:'战斗主题', check:'琵琶轮指 + 战鼓。会直接进入一场普通战斗（已开无敌）。',
      run(){ Review.base({quest:'q4', L:2}); Review.at('forest',14,4,'down'); Dev.god=true; setTimeout(()=>Battle.start('dangkang',()=>{ Dev.god=false; }),400); }},
    {id:'music-romance', group:'配乐', title:'浪漫主题', check:'心动事件「池畔晚霞」里的箫 + 古筝分解和弦。',
      run(){ Review.base({quest:'q8', L:10, sect:'dan', flags:{qiongqi_done:true, tang_sect:true}}); Review.at('town',9,14,'left'); setTimeout(()=>Dev.run('cg:tang:4'),400); }},
    // 心动事件
    ...['tang','ge'].flatMap(id=>[2,4,6,8].map(lv=>({id:`cg-${id}-${lv}`, group:'心动事件', title:`${id==='tang'?'苏小棠':'顾长歌'} ${lv}♥`, check:'插画场景、人物位置、选项和好感变化。',
      run(){ Review.base({quest:'q8', L:10, sect:'dan', flags:{qiongqi_done:true, tang_sect:true}}); Review.at('town',12,11,'down'); setTimeout(()=>Dev.run(`cg:${id}:${lv}`),400); }}))),
    {id:'mail', group:'心动事件', title:'信箱', check:'洞府门口的信箱上有红色「!」。打开看看几封信，收下礼物；也可以从行囊 → 信件打开。',
      run(){ Review.base({quest:'q8', L:10, sect:'dan', flags:{qiongqi_done:true, tang_sect:true}}); for(const id of ['tang','ge','ahe']) Social.rel(id).pts=650;
        S.mail=[{id:'tang',from:'苏小棠',li:2,day:S.day,read:false,taken:false},{id:'ge',from:'顾长歌',li:2,day:S.day,read:false,taken:false},{id:'ahe',from:'阿禾',li:0,day:S.day,read:false,taken:false}]; Review.at('home',8,6,'up'); }},
    // 存档与回放
    {id:'replay', group:'存档', title:'往事回廊：重温拜师大典', check:'这个存档已拜入青云剑宗。重温时选别的门派，结束后打开行囊确认门派还是青云剑宗。',
      run(){ Review.base({quest:'end', L:10, sect:'jian', flags:{qiongqi_done:true, tang_sect:true, chapter1_done:true}}); Review.at('town',12,11,'down'); setTimeout(()=>{ UI._tab='replay'; UI.menu('replay'); },400); }},
    {id:'reroll', group:'存档', title:'刷灵根（读「测灵根前」）', check:'测完灵根后，打开 行囊 → 存档，读取「测灵根前」，能不能重测出不同的结果？',
      run(){ Review.NODES.find(n=>n.id==='prologue').run(); }},
    {id:'oldsave', group:'存档', title:'老存档迁移（种田退款）', check:'模拟一个有锄头、种子、灵泉阵、播种傀儡的老存档：读档后应提示退还灵石，背包里没有种田道具。',
      run(){ RT.slot=SLOTS-1; S=newState(); S.name='老存档'; S.qv=3; S.quest=QUESTS.findIndex(q=>q.id==='q4'); S.L=2; S.root={els:['木','水'],n:2}; S.flags.intro_done=true; S.flags.met_ahe=true;
        S.inv={slip:1,hoe:1,can:1,seed_lc:4,seed_zg:2,sprinkler:1,huichun:1}; S.puppet=true; S.farm={'home:4,7':{tilled:1,crop:'lingcao',stage:1,days:1},'home:5,8':{tilled:1,sprinkler:1}};
        const before=S.stones; localStorage.setItem(slotKey(RT.slot),JSON.stringify(S)); S=loadSave(RT.slot); Sect.migrate(); $('#title').hidden=true; enterMap(S.map,S.x,S.y); UI.hud(); UI.sync(); SaveSys.resume();
        UI.toast(`退还后灵石：${before} → ${S.stones}`); }},
    {id:'end', group:'剧情', title:'第一章结束后的自由时间', check:'第一章完成后能否继续逛、做支线、钓鱼、重温往事。',
      run(){ Review.base({quest:'end', L:10, sect:'dan', flags:{qiongqi_done:true, tang_sect:true, chapter1_done:true, huli_friend:true}, inv:{rod:1}}); Review.at('home',11,6,'down'); }},
  ],
  // a fresh test character in save slot 3 with the given story state
  base(o){
    RT.slot=SLOTS-1; S=newState(); S.name='审查员'; S.look={g:'f',skin:1,hair:4,hairColor:0,style:'qun',cloth:6}; S.root={els:['火','木','水'],n:3};
    S.flags.intro_done=true; S.flags.chest=true; S.inv={slip:1, ...(o.inv||{})};
    const qi=QUESTS.findIndex(q=>q.id===o.quest); S.quest=qi; S.questStarted=qi;
    S.L=o.L||0; if(o.full) S.exp=expNeed(S.L); S.sect=o.sect===undefined?(S.L>=10&&o.quest!=='sect'?'jian':null):o.sect;
    if(S.quest>QUESTS.findIndex(q=>q.id==='q3')) S.flags.met_ahe=true;
    Object.assign(S.flags, o.flags||{}); Object.assign(S.side, o.side||{}); if(o.kills) S.st.kills=o.kills;
    const st=stats(); S.hp=st.hp; S.mp=st.mp; S.min=S.min||9*60; Dev.god=false;
  },
  at(map,x,y,dir){
    $('#title').hidden=true; clearInterval(Creator.timer); Mini.close&&Mini.close(); Battle.s&&Battle.close(); UI.dlgQ=null; $('#dlg').hidden=true; $('#panel').hidden=true; $('#cg').hidden=true;
    enterMap(map,x,y); RT.dir=dir||'down'; UI.hud(); UI.sync(); save(); Music.play(areaTheme());
  },
  go(id){
    const n=Review.NODES.find(x=>x.id===id); if(!n){ clearTimeout(Review._miss); Review._miss=setTimeout(()=>UI.toast('没有这个审查节点：'+id),3000); return; }  // wait: a stale cached page reloads itself first
    $('#reviewHub')&&$('#reviewHub').remove(); n.run(); Review.note(n);
  },
  note(n){
    let el=$('#reviewNote'); if(!el){ el=document.createElement('div'); el.id='reviewNote'; el.className='wood'; document.body.appendChild(el); }
    const i=Review.NODES.indexOf(n), next=Review.NODES[i+1];
    el.innerHTML=`<b>审查 · ${esc(n.title)}</b><p>${esc(n.check)}</p><div class="rn-btns"><button class="btn mini" id="rnHub">全部节点</button>${next?`<button class="btn mini" id="rnNext">下一个：${esc(next.title)}</button>`:''}<button class="btn mini" id="rnX">收起</button></div>`;
    $('#reviewPill')&&$('#reviewPill').remove();
    $('#rnHub').onclick=()=>Review.hub(); $('#rnX').onclick=()=>{ el.remove(); const p=document.createElement('button'); p.id='reviewPill'; p.className='wood'; p.textContent='审查：'+n.title+' ▾'; p.onclick=()=>{ p.remove(); Review.note(n); }; document.body.appendChild(p); }; if(next) $('#rnNext').onclick=()=>{ location.hash='t-'+next.id; };
  },
  hub(){
    $('#reviewHub')&&$('#reviewHub').remove();
    const groups=[...new Set(Review.NODES.map(n=>n.group))], base=location.href.split('#')[0];
    const el=document.createElement('div'); el.id='reviewHub';
    el.innerHTML=`<div class="rh-box wood"><h3>审查节点</h3><p class="muted">点任何一项，直接进入那个场景（测试角色用第 3 个存档位，不影响你自己的存档）。每一项也可以单独分享：链接后面加 <code>#t-名字</code>。</p>
      ${groups.map(g=>`<h4>${g}</h4><div class="rh-list">${Review.NODES.filter(n=>n.group===g).map(n=>`<a class="rh-item" href="${base}#t-${n.id}"><b>${esc(n.title)}</b><span>${esc(n.check)}</span><code>#t-${n.id}</code></a>`).join('')}</div>`).join('')}
      <div class="rn-btns"><a class="btn mini main" href="${base}#selftest">跑一遍自检 #selftest</a><button class="btn mini" id="rhX">关闭</button></div></div>`;
    document.body.appendChild(el); $('#rhX').onclick=()=>el.remove();
  },
  route(){
    const h=location.hash.replace('#','');
    if(h==='review') return Review.hub();
    if(h==='selftest') return;
    if(h.startsWith('t-')) return Review.go(h.slice(2));
  },
};
addEventListener('hashchange', ()=>Review.route());
setTimeout(()=>Review.route(), 400);
