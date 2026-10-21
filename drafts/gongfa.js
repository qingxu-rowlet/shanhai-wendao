/* ============================================================
   山海问道 · 功法 — 身法 and 心性: a choice at each breakthrough (炼气三层, 六层, 九层), one of three.
   They only change how dodging feels (speed, size, warnings, a shield, a counter); how you fight is the sect's business.
   ============================================================ */
const GONGFA = {
  shen1:{school:'身法', name:'凌波微步', desc:'躲弹幕时灵珠移动速度 +25%。'},
  shen2:{school:'身法', name:'残影', desc:'被弹幕打中后，无敌时间 +0.5 秒。'},
  shen3:{school:'身法', name:'风行', desc:'每一轮弹幕的时间缩短 15%。'},
  xin1: {school:'心性', name:'灵台清明', desc:'灵珠的判定缩小 30%，更容易从缝隙钻过去。'},
  xin2: {school:'心性', name:'处变不惊', desc:'每一轮弹幕的第一下伤害被完全挡下。'},
  xin3: {school:'心性', name:'后发制人', desc:'一轮弹幕完全躲开后，下一次出手伤害 +40%。'},
  xin4: {school:'心性', name:'定心', desc:'红线、红框这类预警多停留 40% 的时间。'},
  xin5: {school:'心性', name:'静观', desc:'所有弹幕慢 10%。'},
};
const GF_TIERS=[3,6,9];
const Gongfa = {
  has(id){ return !!(S&&(S.gf||[]).includes(id)); },
  // one choice owed for every tier reached; old saves with techniques that no longer exist get a fresh pick
  owed(){ if(!S) return 0; S.gf=(S.gf||[]).filter(k=>GONGFA[k]); return GF_TIERS.filter(t=>S.L>=t).length-S.gf.length; },
  offer(){ const own=S.gf||[]; return Object.keys(GONGFA).filter(k=>!own.includes(k)).sort(()=>Math.random()-.5).slice(0,3); },
  ask(){
    if(Gongfa.owed()<=0||Gongfa.open) return;
    const ids=Gongfa.offer(); if(!ids.length) return;
    if(Dodge.auto){ S.gf.push(ids[0]); return; }          // the self-test takes the first
    Gongfa.open=true; const tier=GF_TIERS[S.gf.length];
    UI.panel('突破 · 参悟功法', `<p class="muted">踏入${realmName(tier)}，你在打坐中隐约参悟了三门身法心性，只能择其一。它们只影响躲弹幕。（已学：${S.gf.map(k=>GONGFA[k].name).join('、')||'无'}）</p>
      <div class="gf">${ids.map(k=>{ const g=GONGFA[k]; return `<button class="gfcard s-${g.school}" data-gf="${k}"><small>${g.school}</small><b>${g.name}</b><span>${g.desc}</span></button>`; }).join('')}</div>`, b=>{
      b.querySelectorAll('[data-gf]').forEach(btn=>btn.onclick=()=>{ S.gf.push(btn.dataset.gf); Gongfa.open=false; Sound.levelup(); UI.closePanel(); UI.banner('习得功法：'+GONGFA[btn.dataset.gf].name);
        UI.hud(); save(); setTimeout(()=>Gongfa.ask(),600); }); });
  },
};
// offer a choice whenever one is owed and nothing else is on screen; a closed panel is asked again later
setInterval(()=>{ try{ if(Gongfa.open&&$('#panel').hidden) Gongfa.open=false; if(S&&RT.map&&!UI.busy()&&Gongfa.owed()>0) Gongfa.ask(); }catch(e){} },800);
// what the dodge box reads
Dodge.mods=()=>({speed:Gongfa.has('shen1')?1.25:1, inv:Gongfa.has('shen2')?.5:0, dur:Gongfa.has('shen3')?.85:1, r:Gongfa.has('xin1')?.7:1,
  shield:Gongfa.has('xin2'), warn:Gongfa.has('xin4')?1.4:1, slow:Gongfa.has('xin5')?.9:1});
// 静观 slows every pattern; 后发制人 arms a counter after a clean round
{ const _run=Dodge.run; Dodge.run=function(pat,s,done){
    if(Gongfa.has('xin5')){ const orig=pat.spawn; pat={...pat, spawn:(P,t,dt,m)=>orig(P,t,dt,m*.9)}; }
    return _run.call(Dodge,pat,s,hits=>{ if(hits===0&&Gongfa.has('xin3')){ s.counter=true; setTimeout(()=>{ if(Battle.s===s) Battle.float('后发制人','crit'); },300); } done(hits); }); }; }
{ const _act=Battle.act; Battle.act=function(a){ const s=Battle.s; if(!s||s.over||s.busy||s.dead||!s.counter||(a!=='atk'&&a!=='skill'&&a!=='sect')) return _act.call(Battle,a);
    const hp0=s.hp, r=_act.call(Battle,a); if(Battle.s===s&&s.hp<hp0&&!s.dead){ const extra=Math.round((hp0-s.hp)*.4); s.hp-=extra; s.counter=false; setTimeout(()=>{ if(Battle.s===s){ Battle.float('反击 -'+extra,'crit'); Battle.ui(); } },200);
      if(s.hp<=0){ s.busy=true; s.dead=true; setTimeout(()=>Battle.end('win'),700); } }
    return r; }; }
// the 修炼 tab lists what you have learned
{ const _menu=UI.menu; UI.menu=function(tab){ const r=_menu.apply(UI,arguments); const t=tab||UI._tab; if(t==='cult'&&!$('#panel').hidden){ const host=$('#panel .cult'); if(host&&!host.querySelector('.gflist')){
      const own=(S.gf||[]).filter(k=>GONGFA[k]); const div=document.createElement('div'); div.className='gflist';
      div.innerHTML=`<h4>功法（身法 · 心性）</h4>${own.length?own.map(k=>`<p><b>${GONGFA[k].name}</b>（${GONGFA[k].school}）${GONGFA[k].desc}</p>`).join(''):'<p class="muted">还没有参悟功法。突破到炼气三层、六层、九层时，各能从三门身法心性里选一门。</p>'}`; host.appendChild(div); } } return r; }; }
