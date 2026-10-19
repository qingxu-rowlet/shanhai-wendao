/* ============================================================
   山海问道 · 拜师: spiritual roots, four sects, masters, sect skills, spirit pets, daily fortune
   ============================================================ */
const ELEMENTS = {
  金:{col:'#f2f0e6', bonus:'攻击 +8%'}, 木:{col:'#6fd17a', bonus:'生命 +10%'}, 水:{col:'#6fb6f2', bonus:'灵力 +15%'},
  火:{col:'#f2704e', bonus:'法术伤害 +15%'}, 土:{col:'#e0b45a', bonus:'防御 +15%'},
};
const ROOT_KINDS = {
  1:{name:'天灵根', mul:2,   med:1.4,  note:'万中无一的天才资质！修炼速度极快。'},
  2:{name:'双灵根', mul:1.2, med:1.15, note:'上佳的资质，前途无量。'},
  3:{name:'三灵根', mul:1,   med:1,    note:'寻常修士的资质，勤能补拙。'},
  4:{name:'伪灵根', mul:.6,  med:.85,  note:'资质平平……不过听说有位姓韩的前辈，当年也是伪灵根，后来靠着一只小绿瓶，一路修成了大能。（机缘更多：灵石掉落 +20%）'},
};
const SECTS = {
  jian:{name:'青云剑宗', cloth:0, motto:'一剑破万法。', desc:'剑修。攻击最强，招式简单直接。',
    skill:{name:'万剑归宗', mp:14, desc:'召来漫天剑雨，造成 3 倍攻击的伤害。'}, passive:'攻击 +20%',
    master:{id:'m_jian', name:'凌虚剑尊', x:8, y:8, look:{g:'m',skin:1,hair:0,hairColor:3,style:'robe',cloth:0}}},
  dan:{name:'药王谷', cloth:7, motto:'悬壶济世，以药入道。', desc:'药修。炼丹火候更好掌控，丹火还能灼烧敌人。苏小棠也拜在这里。',
    skill:{name:'丹火', mp:10, desc:'1.6 倍伤害，并灼烧敌人 3 回合。'}, passive:'炼丹火候区更宽；回春丹效果 +50%',
    master:{id:'m_dan', name:'药尘长老', x:14, y:10, look:{g:'m',skin:2,hair:1,hairColor:3,style:'robe',cloth:7}}},
  shou:{name:'万兽谷', cloth:3, motto:'万物有灵，以心御之。', desc:'驭兽师。击败山林妖兽后能收服为灵宠，灵宠会跟着你、帮你战斗。',
    skill:{name:'兽魂共鸣', mp:10, desc:'灵宠全力一击，造成 2.4 倍伤害。'}, passive:'可以收服妖兽；灵宠每回合追加攻击',
    master:{id:'m_shou', name:'苍姑', x:8, y:10, look:{g:'f',skin:3,hair:2,hairColor:2,style:'jin',cloth:3}}},
  tianji:{name:'天机阁', cloth:4, motto:'窥天机，布星阵。', desc:'符修。定身符能让敌人动弹不得，每日卜卦趋吉避凶。',
    skill:{name:'定身符', mp:10, desc:'1.8 倍伤害，并让敌人下回合无法行动（对首领 65% 生效）。'}, passive:'灵力 +30%、防御 +15%；每日卜卦：吉日灵石更多、更容易暴击',
    master:{id:'m_tianji', name:'天机子', x:17, y:8, look:{g:'m',skin:0,hair:5,hairColor:5,style:'robe',cloth:4}}},
};
const FORTUNES = [ {name:'大吉', stones:1.5, crit:.18}, {name:'吉', stones:1.25, crit:.12}, {name:'平', stones:1, crit:.06}, {name:'凶', stones:.8, crit:.03} ];

SPR.altar=['................','......eeee......','.....ezzzze.....','....ezzqqzze....','....ezqjjqze....','....ezqjjqze....','....ezzqqzze....','....ezzzzzze....','....eezzzzee....','....ezzzzzze....','....ezzzzzze....','...EEeeeeeeEE...','..EEEEEEEEEEEE..','..eeeeeeeeeeee..','................','................'];
SPR.sparkle=['................','................','.......y........','.......y........','......yxy.......','..y.yyxxxyy.y...','......yxy.......','.......y........','...y...y....y...','..yxy......yxy..','...y........y...','......l.........','.....lxl........','......l.........','................','................'];

/* ---------- world objects ---------- */
MAPS.town.objects.push({type:'altar', x:12, y:7, act:'altar', label:'测灵石'});
for(const k in SECTS){ const m=SECTS[k].master; MAPS.town.objects.push({type:'npc', id:m.id, x:m.x, y:m.y, look:m.look, name:m.name, act:'talk', cond:s=>s.flags.sect_open||!!s.sect}); }
// moving 云游子 aside to make room for the altar
MAPS.town.objects.find(o=>o.id==='yunyou').y=9; MAPS.town.objects.find(o=>o.id==='yunyou').x=12;

/* ---------- the main quest gains a step after 打坐引气 ---------- */
QUESTS.splice(QUESTS.findIndex(q=>q.id==='q8'),0,{id:'sect', title:'拜师大典', desc:'四大宗门的长老来到了桃源镇。到广场的测灵石前，参加拜师大典。', start:'sect_start', check:s=>!!s.sect, target:s=>['town',12,7,'测灵石']});
SCRIPTS.sect_start=[
  ['旁白','你筑基成功、击退穷奇的消息，很快传遍了青丘一带。'],
  ['云游子','{名}，四大宗门的长老听说了你，亲自来了桃源镇，要在广场上开拜师大典。'],
  ['云游子','老道只是个云游的闲散道人，能教你的，都已经教完了。去吧，选一个你喜欢的宗门。'],
  ['云游子','对了，小棠那丫头也想去试一试。'],{flag:'sect_open'},
];
SCRIPTS.ceremony=[
  ['凌虚剑尊','这就是击退穷奇的那个孩子？筑基期便有这份胆识，不错。'],
  ['药尘长老','老夫药王谷，今日也想收一个弟子。'],
  ['苏小棠','长、长老！我……我也想拜入药王谷！我从小跟爹学药理，认得三百多种草药……'],
  ['药尘长老','哦？你这丫头身上草木灵气充盈，是木灵根……好，老夫收下了！'],
  ['旁白','苏小棠高兴得眼眶都红了，回头朝你用力挥了挥手。'],{flag:'tang_sect'},
  ['凌虚剑尊','（望向人群外）那边持剑的年轻人，剑意凛冽——可愿入我青云剑宗？'],
  ['顾长歌','……不必。我是散修。'],
  ['旁白','顾长歌转身离开。凌虚剑尊望着他的背影，眉头微皱。'],
  ['凌虚剑尊','那剑法……老夫好像在哪里见过。'],
  ['苍姑','好了好了，别吓着孩子。{名}，轮到你了。'],
];
const Sect = {
  migrate(){ // older saves: keep the player on the same quest after the chapter was reordered
    if(S.qv>=3) return Sect.migrate4();
    const v1=['q1','q2','q3','q4','q5','q6','q7','q8','end'], v2=['q1','q2','sect','q3','q4','q5','q6','q7','q8','end'];
    let id=(S.qv===2?v2:v1)[S.questBack!=null?S.questBack:S.quest]||'end'; if(id==='sect') id='q3';
    S.quest=Math.max(0,QUESTS.findIndex(q=>q.id===id)); S.questStarted=S.quest; delete S.questBack; S.qv=3;
    if(!S.root && S.L>=1) S.root=Sect.rollRoots();
    Sect.migrate4();
  },
  migrate4(){ // v4: farming and energy were removed — refund what was spent on them
    if(S.qv>=4) return; S.qv=4; let refund=0;
    for(const k of Object.keys(S.inv)){ const it=ITEMS[k]; if(k==='hoe'||k==='can'){ delete S.inv[k]; continue; } if(it&&(it.seed||k==='sprinkler'||k==='puppet')){ refund+=(it.price||0)*S.inv[k]; delete S.inv[k]; } }
    for(const k in S.farm||{}){ if(S.farm[k].sprinkler) refund+=300; }
    if(S.puppet) refund+=500; S.farm={}; S.puppet=false; S.sel='';
    if(refund){ S.stones+=refund; S._refund=refund; }
  },
  syncLooks(){ LOOK_TANG.cloth = S&&S.flags.tang_sect ? 7 : 3; },
  info(){ return S.sect?SECTS[S.sect]:null; },
  rollRoots(){
    const r=Math.random(), n=r<.12?1:r<.45?2:r<.85?3:4, all=Object.keys(ELEMENTS).sort(()=>Math.random()-.5);
    return {els:all.slice(0,n), n};
  },
  rootName(){ const r=S.root; return r?ROOT_KINDS[r.n].name+'（'+r.els.join('')+'）':'未测'; },
  has(el){ return S.root&&S.root.els.includes(el); },
  mul(el){ return Sect.has(el)?ROOT_KINDS[S.root.n].mul:0; },
  medMul(){ return S.root?ROOT_KINDS[S.root.n].med:1; },
  apply(st){ // stat bonuses from roots, sect, permanent rewards
    const out={...st};
    out.atk*=1+.08*Sect.mul('金')+(S.sect==='jian'?.2:0); out.hp*=1+.10*Sect.mul('木'); out.mp*=1+.15*Sect.mul('水'); out.def*=1+.15*Sect.mul('土');
    if(S.sect==='tianji'){ out.mp*=1.3; out.def*=1.15; }
    out.atk+=S.bonusAtk||0;
    for(const k in out) out[k]=Math.round(out[k]); return out;
  },
  spellMul(){ return 1+.15*Sect.mul('火'); },
  fortune(){ return S.sect==='tianji'&&S.fortune!=null?FORTUNES[S.fortune]:null; },
  crit(){ const f=Sect.fortune(); return f?f.crit:.05; },
  stoneMul(){ let m=1; const f=Sect.fortune(); if(f) m*=f.stones; if(S.root&&S.root.n===4) m*=1.2; return m; },
  newDay(){
    if(S.sect==='tianji'){ let r=Math.random(); S.fortune = r<.15?0:r<.45?1:r<.85?2:3; if(S.flags.tianji_up&&S.fortune===3) S.fortune=2; }
  },
  altar(){
    if(S.sect) return UI.say([['旁白','测灵石静静立着。你的灵根：'+Sect.rootName()+'，宗门：'+SECTS[S.sect].name+'。']]);
    if(!S.flags.sect_open) return UI.say([['旁白','一块古朴的石碑，上面刻着「测灵」二字。']]);
    UI.say(SCRIPTS.ceremony, ()=>{ if(!S.root) return Sect.rootTest(); Sect.choose(); });
  },
  rootTest(done){
    // keep a snapshot from just before the test, so the roots can be rerolled by loading it
    if(!S.root){ try{ localStorage.setItem(SaveSys.key(RT.slot,'pre_root'), JSON.stringify({meta:SaveSys.meta(S), state:S})); }catch(e){} }
    const el=$('#minigame'); el.hidden=false; UI.fx=true; UI.sync(); Music.play('calm');
    el.innerHTML=`<div class="mg wood root"><h3>测灵根</h3><div class="stone"><div class="orbs">${Object.keys(ELEMENTS).map(e=>`<span class="orb" data-e="${e}" style="--c:${ELEMENTS[e].col}">${e}</span>`).join('')}</div></div>
      <p class="mg-tip" id="rtTip">把手放在测灵石上，注入一丝灵力……</p><button class="btn main" id="rtGo">注入灵力</button></div>`;
    $('#rtGo').onclick=()=>{ if(!S.root) S.root=Sect.rollRoots(); const R=S.root, kind=ROOT_KINDS[R.n];
      $('#rtGo').disabled=true; Sound.magic(); const orbs=[...el.querySelectorAll('.orb')]; let i=0;
      const tickOne=()=>{ if(i<orbs.length){ const o=orbs[i++]; o.classList.add('scan'); setTimeout(()=>{ o.classList.remove('scan'); if(R.els.includes(o.dataset.e)){ o.classList.add('lit'); Sound.pick(); } tickOne(); },380); }
        else { $('#rtTip').innerHTML=`<b>${kind.name} · ${R.els.join('')}</b><br>${kind.note}<br><small>${R.els.map(e=>e+'：'+ELEMENTS[e].bonus).join('　')}</small><br><small class="reroll">不满意？可以在「行囊 → 存档」读取「测灵根前」重新测。</small>`; save();
          const b=$('#rtGo'); b.disabled=false; b.textContent=done?'继续':'选择门派'; b.onclick=()=>{ Sound.tick(); if(done){ el.hidden=true; el.innerHTML=''; UI.fx=false; UI.sync(); Music.play(areaTheme(),true); done(); } else Sect.choose(); }; Sound.levelup(); } };
      tickOne(); };
  },
  choose(){
    const el=$('#minigame');
    el.hidden=false; UI.fx=true; UI.sync();
    el.innerHTML=`<div class="mg wood sects"><h3>选择门派</h3><p class="mg-tip">你的灵根：${Sect.rootName()}</p><div class="sect-list">${Object.entries(SECTS).map(([k,s])=>`<button class="sect-card" data-s="${k}">
      <canvas class="px" data-m="${k}" width="18" height="22"></canvas><div><b>${s.name}</b><i>${s.motto}</i><p>${s.desc}</p>
      <small>绝学：${s.skill.name}——${s.skill.desc}<br>天赋：${s.passive}</small></div></button>`).join('')}</div></div>`;
    el.querySelectorAll('[data-m]').forEach(c=>c.getContext('2d').drawImage(lookSprite(SECTS[c.dataset.m].master.look,'down',0),0,0));
    el.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{ Sound.tick(); Sect.confirm(b.dataset.s); });
  },
  confirm(k){
    const s=SECTS[k], el=$('#minigame');
    el.innerHTML=`<div class="mg wood"><h3>拜入${s.name}？</h3><p class="mg-tip">${s.desc}<br>入门之后不能更改。</p>
      <label class="gps-t"><input type="checkbox" id="scUni" checked> 换上宗门服饰</label>
      <div class="mg-btns"><button class="btn" id="scBack">再想想</button><button class="btn main" id="scYes">拜师！</button></div></div>`;
    $('#scBack').onclick=()=>{ Sound.tick(); Sect.choose(); };
    $('#scYes').onclick=()=>{ const uni=$('#scUni').checked; el.hidden=true; el.innerHTML=''; UI.fx=false;
      S.sect=k; Sect.syncLooks(); if(uni){ S.look={...S.look, cloth:s.cloth, style:S.look.style==='jin'?'jin':'robe'}; }
      if(k==='tianji') Sect.newDay();
      Sound.levelup(); UI.banner('拜入'+s.name);
      UI.say([[s.master.name, k==='jian'?'好！从今往后，你便是我青云剑宗弟子。你上面还有几位师兄师姐，回宗门后自会相见——你就是他们的{称}了。':k==='dan'?'好孩子。你和小棠一同入门，往后便是同门。丹道漫长，老夫会一步步教你，{称}。':k==='shou'?'哈哈，万兽谷又多了一个小崽子！你那几位师兄师姐要是知道来了个{称}，准得乐坏了。':'天机不可泄露……不过，你的命数，倒是很有意思。从今往后，你便是天机阁的{称}。'],
        ...(k==='dan'?[['苏小棠','{名}！我们是同门了！以后……以后一起采药炼丹吧！']]:[]),
        ['云游子','好，好。{名}，记得常回洞府打坐。宗门长老这几日都在镇上，有事可以去找你的师父。']], ()=>{ Music.play(areaTheme(),true); UI.hud(); Story.check(); });
    };
  },
  /* ---------- spirit pets (万兽谷) ---------- */
  tame(kind, after){
    if(S.sect!=='shou'||BEASTS[kind].boss){ after&&after(); return; }
    const B=BEASTS[kind];
    UI.say([{choice:`${B.name}倒在地上，眼神里没有了敌意。要试着收服它吗？${S.pet?`（会替换现在的灵宠${BEASTS[S.pet.kind].name}）`:''}`, options:[
      {text:'收服', fn:()=>{ if(Math.random()<.75){ S.pet={kind, lv:1, xp:0}; Sound.levelup(); UI.say([['旁白',`${B.name}蹭了蹭你的手——它成为了你的灵宠！`]], after); } else UI.say([['旁白',`${B.name}警惕地跑开了……下次再试试吧。`]], after); }},
      {text:'放它走', fn:()=>{ UI.say([['旁白',`${B.name}一溜烟跑回了山林。`]], after); }}]}]);
  },
  petAtk(){ if(!S.pet) return 0; return Math.round(stats().atk*.35*(1+(S.pet.lv-1)*.15)); },
  petXp(){ if(!S.pet) return; S.pet.xp++; if(S.pet.xp>=4){ S.pet.xp=0; S.pet.lv++; UI.toast(`灵宠${BEASTS[S.pet.kind].name}升到了 ${S.pet.lv} 级！`); } },
};

/* ---------- masters: friendship + their sect quest ---------- */
Object.assign(NPCS, {
  m_jian:{name:'凌虚剑尊', loves:['qq_yu'], likes:['wine','hide'], hates:['flower']},
  m_dan:{name:'药尘长老', loves:['zhuguo'], likes:['lingcao','lingmo','juqi','huichun'], hates:['hide']},
  m_shou:{name:'苍姑', loves:['hide','fish_jin'], likes:['fish_li','fish_yin','lingmo'], hates:['wine']},
  m_tianji:{name:'天机子', loves:['wine','hu_wei'], likes:['flower','juqi'], hates:['lingmo']},
});
Object.assign(TALK, {
  m_jian:[['剑，要握稳。','青云剑宗不收软骨头。'],['你的剑路有几分我年轻时的样子。'],['等你筑基，我传你真正的剑诀。'],['你是我最得意的弟子。']],
  m_dan:[['火候，火候，还是火候。','炼丹急不得。'],['你炼的丹，成色越来越好了。'],['丹道的尽头，是济世。'],['老夫的丹方，以后都留给你。']],
  m_shou:[['山里的家伙们，脾气都不坏。','灵宠也要吃饭的，记得喂它。'],['你的灵宠很亲近你，好事。'],['有一天，你说不定能和九尾狐做朋友。'],['万兽谷永远是你的家。']],
  m_tianji:[['天机不可泄露。','今日宜修行，忌冲动。'],['你的命盘，有一颗很亮的星。'],['饕餮将醒……这是天机，也是劫数。'],['我算不出你的未来——这很少见。']],
});
for(const k in SECTS){ const id=SECTS[k].master.id; GIFT_LINES.love[id]='哦？有心了！'; GIFT_LINES.like[id]='不错。'; GIFT_LINES.neutral[id]='嗯。'; GIFT_LINES.hate[id]='……这个就免了。'; }
SIDES.push(
  {id:'jianxin', giver:'m_jian', title:'剑心试炼', desc:'凌虚剑尊让你去山林击败 5 只妖兽，磨砺剑心。', count:{type:'killall', n:5},
    unlock:s=>s.sect==='jian', reward:{atk:3, heart:{m_jian:80}},
    start:[['凌虚剑尊','剑修的剑，是在血里磨出来的。去山林斩五只妖兽回来。']], done:[['凌虚剑尊','剑心已成雏形。（攻击永久 +3）']],
    target:s=>sideReady(s,SIDES.find(q=>q.id==='jianxin'))?npcAt('m_jian'):['forest',8,8,'山林里的妖兽']},
  {id:'danchen', giver:'m_dan', title:'丹道初成', desc:'药尘长老要你炼出一颗「上品」丹药（掌握好丹炉的火候）。', count:{type:'grade', n:1},
    unlock:s=>s.sect==='dan', reward:{give:{juqi:3, zhuguo:2}, heart:{m_dan:80}},
    start:[['药尘长老','炼丹，七分靠火候。回你的洞府，用丹炉炼出一颗上品丹给我看看。']], done:[['药尘长老','好丹！色泽圆润，丹香扑鼻。这些是给你的奖励。']],
    target:s=>sideReady(s,SIDES.find(q=>q.id==='danchen'))?npcAt('m_dan'):['home',18,4,'丹炉']},
  {id:'lingchong', giver:'m_shou', title:'第一只灵宠', desc:'苍姑让你去山林收服一只妖兽作为灵宠（击败后选择「收服」）。', count:{type:'pet', n:1},
    unlock:s=>s.sect==='shou', reward:{stones:80, petlv:2, heart:{m_shou:80}},
    start:[['苍姑','万兽谷的弟子，第一课就是交朋友。'],['苍姑','去山林里打赢一只妖兽，然后试着收服它。']], done:[['苍姑','哈哈，你们很合得来嘛！我给它喂了点好东西。（灵宠 +2 级）']],
    target:s=>s.pet?npcAt('m_shou'):['forest',8,8,'山林里的妖兽']},
  {id:'buzhen', giver:'m_tianji', title:'星阵三眼', desc:'天机子让你到青丘山林的三处阵眼贴上符箓。', need:{zhenyan:3},
    unlock:s=>s.sect==='tianji', reward:{tianji:1, heart:{m_tianji:80}},
    start:[['天机子','青丘山林里有三处星阵的阵眼，我要你去贴上镇符。'],['天机子','阵眼会发光，你一看便知。']], done:[['天机子','星阵已成。从今往后，你的卦象不会再有「凶」。']],
    target:s=>count(s,'zhenyan')>=3?npcAt('m_tianji'):(['forest',[[2,8],[24,9],[18,23]].find(([x,y])=>!s.gathered['forest:'+x+','+y])||[4,7]].flat().concat(['阵眼']))},
);
Object.assign(ITEMS,{zhenyan:{name:'已贴的阵眼', icon:'i_slip', quest:true, desc:'星阵阵眼上贴好的符箓。'}});
for(const [x,y] of [[2,8],[24,9],[18,23]]) MAPS.forest.objects.push({type:'gather', x, y, item:'zhenyan', spr:'sparkle', free:true, cond:s=>s.side.buzhen==='active'&&!s.gathered['forest:'+x+','+y]});
