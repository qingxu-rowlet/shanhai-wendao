/* ============================================================
   山海问道 · 羁绊 — the heart events come from the story, not from gifts. This is a story game (弹幕 fights and a
   cultivator's tale): nobody has time to hand out presents every day to push a number up, and in chapter 1 苏小棠 or
   顾长歌 could end at two hearts or at eight depending on how many flowers you bought — which made no sense.
   So: no 好感 numbers on screen, no 送礼. Every heart event (all sixteen with pictures, and the seniors' ones in words)
   plays once, by itself, at its own point in the main story — the first quiet moment after that point (or, for a
   morning scene, the first morning after it), and only during its stretch of the story: an old save already past that
   stretch doesn't get a pile of them at once. What you choose inside a scene still changes what is said.
   Story items someone is waiting for (萧烬's 桂花糕, 青禾's 长命锁, 阿禾's hen) are handed over with 「交给他／她」.
   How close you are (for chat lines and letters) now follows the scenes you've lived through together.
   ============================================================ */
const BOND={
  qi:id=>QUESTS.findIndex(q=>q.id===id),
  past:id=>{ const i=BOND.qi(id); return i>=0&&S.quest>i; },                  // that quest is done
  at:id=>{ const i=BOND.qi(id); return i>=0&&S.quest>=i; },                   // that quest has been reached
  seen:(id,lv)=>!!(S.rel&&S.rel[id]&&S.rel[id].ev&&S.rel[id].ev[lv]),
  seenBefore:(id,lv)=>{ const r=S.rel&&S.rel[id]; return BOND.seen(id,lv)&&!!(r.evDay&&r.evDay[lv]<S.day); },   // on an earlier day
  F:()=>S.flags,
  // in story order; wake: a morning scene (plays on the first morning in its stretch); pre: lines before the picture
  LIST:[
    // 第一章 · 桃源镇
    {id:'tang', lv:2, wake:true, from:()=>BOND.F().met_ahe, until:()=>BOND.F().chapter1_done},               // 药香（清晨）
    {id:'ge',   lv:2, from:()=>BOND.past('q4'), until:()=>BOND.F().qiongqi_done},                              // 木剑
    {id:'tang', lv:4, from:()=>BOND.past('q5'), until:()=>BOND.F().qiongqi_done},                              // 池畔晚霞
    {id:'ge',   lv:4, from:()=>BOND.F().qiongqi_done, until:()=>S.L>=10},                                     // 月下拭剑：他救了你那天夜里
    {id:'tang', lv:6, from:()=>BOND.F().qiongqi_done&&BOND.seenBefore('ge',4), until:()=>BOND.F().chapter1_done},   // 雨中药庐：穷奇的伤还没好
    {id:'ge',   lv:6, from:()=>S.L>=10&&BOND.F().qiongqi_done, until:()=>BOND.F().chapter1_done},             // 北方来信：筑基以后
    {id:'ge',   lv:8, from:()=>BOND.F().chapter1_done, until:()=>BOND.F().c2_arrive||BOND.at('c2b')},                          // 并肩：饕餮醒了，他往北走
    {id:'tang', lv:8, from:()=>BOND.F().chapter1_done, until:()=>BOND.F().c2_arrive||BOND.at('c2b')},                          // 灯会花笺
    // 第二章 · 宗门、秘境
    {id:'xie',  lv:2, from:()=>(S.c2&&S.c2.days||0)>=1, until:()=>BOND.F().c2_depart},                       // 药圃夜谈：头一天的功课做完
    {id:'xie',  lv:4, wake:true, from:()=>BOND.seenBefore('xie',2), until:()=>BOND.F().c2_depart},           // 木剑：第二天卯时
    {id:'man',  lv:2, from:()=>(S.c2&&S.c2.days||0)>=2, until:()=>BOND.F().c2_depart},                       // 观音土：两天的功课做完
    {id:'lu',   lv:2, from:()=>BOND.seen('man',2), until:()=>BOND.F().c2_depart},                             // 三更的练功场
    {id:'man',  lv:4, from:()=>BOND.at('c2d'), until:()=>BOND.F().c2_depart},                                // 半个馒头：收拾行装去秘境
    {id:'lu',   lv:4, from:()=>BOND.at('c2e'), until:()=>BOND.F().lu_gone},                                   // 界碑、母狼：秘境营地
    // 第三章 · 京城
    {id:'xiao', lv:2, from:()=>BOND.F().c3_lt_n1, until:()=>BOND.F().c3_lt_done},                             // 瘸腿的狗：第一轮那天夜里
    {id:'xie',  lv:6, from:()=>BOND.F().c3_lt_done, until:()=>BOND.F().c3_qj_girl},                           // 槐树：你拿了魁首的那天夜里
    {id:'xiao', lv:4, from:()=>BOND.F().c3_qj_girl, until:()=>BOND.F().c3_yj_go},                             // 赌一局：查千金坊的时候
    {id:'xiao', lv:6, from:()=>BOND.F().c3_a3_done, until:()=>BOND.F().c3_a4_go},                             // 屋顶：宗庙后门那一夜以后
    {id:'xie',  lv:8, from:()=>BOND.F().c3_a5_notice, until:()=>BOND.F().c3_done},                            // 河灯：告示之后，离开之前
    {id:'xiao', lv:8, from:()=>BOND.F().c3_done, until:()=>false,                                              // 草窝：回宗门的路上
      pre:[['旁白','回宗门的路上，你们又经过了安平村。'],['旁白','黄昏。大师姐她们在村口歇脚，你一个人上了后山。']]},
  ],
  has:id=>BOND.LIST.some(e=>e.id===id),
  steps(e){ const cg=typeof HEART_CG!=='undefined'&&HEART_CG[e.id]&&HEART_CG[e.id][e.lv];
    const body=cg?[{cg:cg.scene, who:e.id, title:cg.title}, ...cg.steps]:(HEART_EVENTS[e.id]&&HEART_EVENTS[e.id][e.lv]);
    return body?[...(e.pre||[]), ...body]:null; },
  due(){ if(!S||!S.flags) return null;
    for(const e of BOND.LIST){ if(BOND.seen(e.id,e.lv)) continue; let ok=false; try{ ok=!!e.from()&&!e.until(); }catch(_){ ok=false; }
      if(!ok) continue; if(e.wake&&!(BOND.wokeDay===S.day&&S.min<11*60)) continue; return e; }
    return null; },
  play(e,cb){ const steps=BOND.steps(e); if(!steps) return false; const r=Social.rel(e.id); r.ev=r.ev||{}; r.evDay=r.evDay||{};
    r.ev[e.lv]=true; r.evDay[e.lv]=S.day; save(); Sound.levelup(); UI.say(steps,()=>{ UI.hud(); save(); cb&&cb(); Story.check(); }); return true; },
  // quiet: nothing on screen, nobody moving the player, no fight, no picture, no self-test
  idle(){ const dlg=$('#dlg'), cine=$('#cine');
    return !!(RT.mapId&&!RT.paused&&!RT.fadeTo&&!Battle.s&&(!dlg||dlg.hidden)&&(!cine||cine.hidden)&&!(typeof PixCG!=='undefined'&&PixCG.on)&&!(typeof CG!=='undefined'&&CG.on)
      &&!(typeof Gallery!=='undefined'&&Gallery._sb)&&!/selftest/.test(location.hash)&&!BOND.off); },
  // look again in a moment, and only go when it has stayed quiet (a story often chains one scene into the next)
  tick(){ clearTimeout(BOND._t); BOND._t=setTimeout(()=>{ if(!BOND.idle()||!BOND.due()) return;
      BOND._t=setTimeout(()=>{ const e=BOND.due(); if(e&&BOND.idle()) BOND.play(e); },700); },700); },
};
// when to look: after any story step, on coming into a place, and on waking
{ const _c=Story.check; Story.check=function(){ const r=_c.apply(Story,arguments); BOND.tick(); return r; }; }
On.enter(()=>BOND.tick());
On.wake(()=>{ BOND.wokeDay=S.day; BOND.tick(); });

/* ---------- how close you are: the scenes lived through, not the presents ---------- */
// someone with heart events: two hearts for every scene seen (letters, chat lines and the 河灯 still ask for "hearts");
// anyone else keeps what talking, favours and the story gave them
{ const _h=Social.hearts; Social.hearts=function(id){ if(BOND.has(id)){ const ev=(S.rel&&S.rel[id]&&S.rel[id].ev)||{}; return Math.min(10,[2,4,6,8].filter(l=>ev[l]).length*2); } return _h.call(Social,id); }; }
// no numbers popping up
{ const _a=Social.add; Social.add=function(id,n){ return _a.call(Social,id,n,true); }; }

/* ---------- handing over what someone is waiting for (instead of 送礼) ---------- */
Social.DELIVER=[
  {id:'xiao', item:'jc_gao', when:s=>s.flags.c3_xfu_ask&&!s.flags.c3_xfu_gao},
  {id:'qinghe', item:'jc_lock', when:s=>!s.flags.c3_hd_lock},
  {id:'ahe', item:'chicken', when:s=>s.side&&s.side.chick==='active'},
];
Social.giveOpts=id=>Social.DELIVER.filter(d=>d.id===id&&count(S,d.item)>0&&d.when(S)).map(d=>({text:`把${ITEMS[d.item].name}交给${(NPCS[id]&&NPCS[id].name)||'他'}`, fn:()=>Social.give(id,d.item)}));
Social.giftPick=id=>{ const o=Social.giveOpts(id); if(o.length) return o[0].fn(); UI.say([[(NPCS[id]&&NPCS[id].name)||'','……']]); };
// the menu: just their name, and no 送礼
Social.menu=function(id){ const n=NPCS[id]; if(!n) return; const opts=[];
  if(id==='qian'||n.shop) opts.push({text:'买卖', fn:()=>UI.shop(id)});
  if(id==='yunyou') opts.push({text:'请教', fn:()=>{ const q=Story.quest(); UI.say(q&&q.id!=='end'?[['云游子','眼下要做的事——'+q.title+'：'+q.desc]]:SCRIPTS.talk_yunyou); }});
  opts.push({text:'聊天', fn:()=>Social.chat(id)},...Social.giveOpts(id),{text:'离开', fn:()=>{}});
  UI.say([{choice:n.name, options:opts}]); };
// 苏小棠 and 顾长歌's little side errands open once you've met them in town, not once you've chatted
for(const q of SIDES) if(q.giver==='tang') q.unlock=s=>!!s.flags.met_ahe; else if(q.giver==='ge') q.unlock=s=>s.L>=4&&!!s.flags.met_ahe;

/* ---------- 人物 tab: who they are, and the scenes you've had together ---------- */
UI.people=()=>Object.keys(NPCS).map(id=>{ const n=NPCS[id], r=Social.rel(id), evs=BOND.LIST.filter(e=>e.id===id);
  const cg=typeof HEART_CG!=='undefined'&&HEART_CG[id];
  const list=evs.map(e=>{ const c=cg&&cg[e.lv], seen=r.ev&&r.ev[e.lv];
    return seen?(c?`<button class="btn mini cgb" data-cg="${id}:${e.lv}">${c.title}</button>`:'<span class="pref like">已经历</span>'):'<span class="lock">剧情里会遇到</span>'; }).join(' ');
  return `<div class="person"><canvas class="px" data-npc="${id}" width="18" height="22"></canvas><div class="pinfo"><b>${n.name}</b>${evs.length?`<span class="kn">心动事件：${list}</span>`:''}</div></div>`; }).join('');
