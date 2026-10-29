/* ============================================================
   山海问道 · 从第二章开始 — for players who have played chapter one already (or lost that save): after making a character,
   「从第二章开始」 tests the roots, picks a sect, asks who you were close to in 桃源镇, tells the story so far, and puts you
   in the town square before your master at the end of chapter one: 筑基初期, the things a finished chapter one leaves you
   with. 万兽谷 disciples start with 当康 as their companion. Not on the live site while chapter two is closed.
   ============================================================ */
const Skip1={
  RECAP:[['旁白','（前情提要）'],
    ['旁白','你在青丘山下的洞府里醒来，什么都不记得了。一位叫云游子的老人教你采灵草、打坐引气。'],
    ['旁白','东边的桃源镇，住着卖面的阿禾、钱掌柜、还有采药的小姑娘苏小棠。'],
    ['旁白','后来山林里有了怪声。穷奇从风穴里出来了——你和一个叫顾长歌的散修，在狐祠前把它打退。'],
    ['旁白','你炼了筑基丹，在蒲团上破了境。又去狐祠看了狐火的来历，和那只九尾狐成了朋友。'],
    ['旁白','测灵石前，各宗门的长老来收徒。你拜了师。'],
    ['旁白','如今，师尊在桃源镇广场上等你。该回宗门了。']],
  start(){ const name=(Creator.name||'').trim()||'无名';
    RT.slot=Creator.slot; S=newState(); S.look={...Creator.look}; S.name=name; $('#title').hidden=true; clearInterval(Creator.timer);
    S.flags.intro_done=true; S.flags.chest=true; S.flags.met_ahe=true; S.flags.sect_open=true; S.flags.qiongqi_done=true; S.flags.tang_sect=true; S.flags.huli_friend=true; S.flags.chapter1_done=true; S.flags.skip_c1=true;
    S.L=10; S.quest=S.questStarted=QUESTS.findIndex(q=>q.id==='end');
    enterMap('town',8,9); RT.dir='up'; UI.hud(); UI.sync();
    Sect.rootTest(()=>Skip1.sect()); },
  sect(){ const el=$('#minigame'); el.hidden=false; UI.fx=true; UI.sync();
    el.innerHTML=`<div class="mg wood sects"><h3>你拜入了哪个宗门？</h3><p class="mg-tip">你的灵根：${Sect.rootName()}</p><div class="sect-list">${Object.entries(SECTS).map(([k,s])=>`<button class="sect-card" data-s="${k}">
      <canvas class="px" data-m="${k}" width="18" height="22"></canvas><div><b>${s.name}</b><i>${s.motto}</i><p>${s.desc}</p>
      <small>绝学：${s.skill.name}——${s.skill.desc}<br>天赋：${s.passive}</small>${k==='shou'?'<small><br>灵宠：默认是当康（3 级）。想换别的，可以去桃源镇外的山林里收服妖兽。</small>':''}</div></button>`).join('')}</div></div>`;
    el.querySelectorAll('[data-m]').forEach(c=>drawCard(c, SECTS[c.dataset.m].master.look, 'bust'));
    el.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{ Sound.tick(); const k=b.dataset.s, s=SECTS[k]; el.hidden=true; el.innerHTML=''; UI.fx=false;
      S.sect=k; S.look={...S.look, cloth:s.cloth, style:S.look.style==='jin'?'jin':'robe'}; Sect.syncLooks(); if(k==='tianji') Sect.newDay();
      if(k==='shou') S.pet={kind:'dangkang',lv:3,xp:0};
      UI.sync(); Skip1.friends(); }); },
  // who you were close to: their hearts, and the talks that come with those hearts counted as had
  friends(){ const set=(id,h)=>{ const r=Social.rel(id); r.pts=h*100; r.ev=r.ev||{}; for(let e=2;e<=h;e+=2) r.ev[e]=true; };
    UI.say([{choice:'第一章里，你和谁走得比较近？', options:[
      {text:'苏小棠', fn:()=>{ set('tang',4); set('ge',1); Skip1.finish(); }},
      {text:'顾长歌', fn:()=>{ set('ge',4); set('tang',1); Skip1.finish(); }},
      {text:'两个都还不错', fn:()=>{ set('tang',2); set('ge',2); Skip1.finish(); }},
      {text:'都不太熟', fn:()=>Skip1.finish()}]}]); },
  finish(){
    S.stones=600; S.inv={...S.inv, rod:1, hu_wei:1, huichun:5, juqi:3, lingcao:4, zhuguo:2};
    const st=stats(); S.hp=st.hp; S.mp=st.mp; S.min=9*60; save();
    UI.say([...Skip1.RECAP,
      ['旁白',`（已经替你准备好了：筑基初期、${SECTS[S.sect].name}弟子、灵石 600、回春丹 5、聚气丹 3、钓竿。${S.sect==='shou'?'灵宠是当康，想换可以去山林里收服别的妖兽。':''}）`],
      ['旁白','（点广场上的师尊，就能随他回宗门，开始第二章。）']], ()=>{ UI.hud(); Story.check(); save(); }); },
};
// the second button on the character screen
{ const _r=Creator.render; Creator.render=function(){ const r=_r.apply(Creator,arguments); if(window.CH2_LOCKED) return r;
    const go=$('#crGo'); if(go&&!$('#crSkip')){ const b=document.createElement('button'); b.className='btn'; b.id='crSkip'; b.textContent='从第二章开始'; b.title='玩过第一章的，可以直接从第二章开始';
      b.onclick=()=>{ Sound.unlock(); Sound.tick(); const box=b.parentElement;   // asked right here on the character screen
        box.innerHTML='<p class="muted" style="flex-basis:100%;margin:0 0 6px">跳过第一章（新手教学、穷奇、筑基、拜师），直接以筑基初期的宗门弟子开始。第一次玩，建议从头开始。</p><button class="btn" id="crSkipNo">再想想</button><button class="btn main" id="crSkipYes">从第二章开始</button>';
        box.style.flexWrap='wrap'; $('#crSkipNo').onclick=()=>{ Sound.tick(); Creator.render(); }; $('#crSkipYes').onclick=()=>Skip1.start(); };
      go.before(b); }
    return r; }; }
