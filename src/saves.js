/* ============================================================
   山海问道 · saving: autosave + three manual snapshots per profile + a "测灵根前" snapshot
   Players may save any time outside battles and mini-games (and reroll their roots — that's a feature).
   ============================================================ */
const SaveSys = {
  SNAPS:['m1','m2','m3'],
  key(slot, snap){ return slotKey(slot)+'.'+snap; },
  canSave(){ return !!S && !Battle.s && !UI.fx && !(typeof Replay!=='undefined'&&Replay.active); },
  meta(s){ const q=QUESTS[s.quest]; return {name:s.name, realm:realmName(s.L), day:s.day, time:fmtTime(s.min), map:MAPS[s.map]?MAPS[s.map].name:'', quest:q?q.title:'', root:s.root?ROOT_KINDS[s.root.n].name+'（'+s.root.els.join('')+'）':'未测', at:Date.now()}; },
  read(slot, snap){ try{ return JSON.parse(localStorage.getItem(SaveSys.key(slot,snap))||'null'); }catch(e){ return null; } },
  write(snap){
    if(!SaveSys.canSave()) return false;
    S.x=S.x; const rec={meta:SaveSys.meta(S), state:S};
    try{ localStorage.setItem(SaveSys.key(RT.slot,snap), JSON.stringify(rec)); save(); return true; }catch(e){ return false; }
  },
  // load a snapshot into this profile's slot and step into it
  load(slot, snap){
    const rec=SaveSys.read(slot,snap); if(!rec) return false;
    RT.slot=slot; S=JSON.parse(JSON.stringify(rec.state)); S=loadFromObject(S);
    Sect.migrate(); Hooks.placeQiyu(); save();
    Battle.s&&Battle.close(); Mini.close(); $('#dlg').hidden=true; UI.dlgQ=null; $('#panel').hidden=true; $('#title').hidden=true; clearInterval(Creator.timer);
    enterMap(S.map,S.x,S.y); RT.dir='down'; UI.hud(); UI.sync();
    SaveSys.resume(); UI.toast('已读取存档'); return true;
  },
  // a save made during the prologue replays it (so the root test can be taken again)
  resume(){
    if(S._refund){ UI.toast(`种田系统已移除，退还 ${S._refund} 灵石`); delete S._refund; }
    if(!S.flags.intro_done && S.quest===0){ UI.say(S.root?SCRIPTS.intro_post:SCRIPTS.intro, ()=>{ S.questStarted=0; Story.check(); }); return; }
    Story.check();
  },
  ago(t){ const m=Math.round((Date.now()-t)/60000); return m<1?'刚刚':m<60?m+' 分钟前':m<1440?Math.round(m/60)+' 小时前':Math.round(m/1440)+' 天前'; },
  card(slot, snap, label, canWrite){
    const rec=SaveSys.read(slot,snap), m=rec&&rec.meta;
    return `<div class="savecard"><div class="sc-l"><b>${label}</b>${m?`<span>${esc(m.realm)} · 第 ${m.day} 天 ${esc(m.time)}</span><span class="muted">${esc(m.map)} · ${esc(m.quest)}</span><span class="muted">灵根：${esc(m.root)} · ${SaveSys.ago(m.at)}</span>`:'<span class="muted">（空）</span>'}</div>
      <div class="sc-r">${canWrite?`<button class="btn mini" data-sv="${snap}">${m?'覆盖':'存到这里'}</button>`:''}${m?`<button class="btn mini main" data-ld="${slot}:${snap}">读取</button>`:''}</div></div>`;
  },
  bind(root, after){
    root.querySelectorAll('[data-sv]').forEach(b=>b.onclick=()=>{
      if(b.textContent==='覆盖'){ b.textContent='确定覆盖？'; return; }
      if(!SaveSys.write(b.dataset.sv)) return UI.toast(SaveSys.canSave()?'存档失败（浏览器不允许存储）':'战斗或小游戏中不能存档');
      Sound.coin(); UI.toast('已存档'); after&&after(); });
    root.querySelectorAll('[data-ld]').forEach(b=>b.onclick=()=>{
      if(b.textContent==='读取'){ b.textContent='确定读取？'; setTimeout(()=>{ if(b.isConnected) b.textContent='读取'; },2500); return; }
      const [slot,snap]=b.dataset.ld.split(':'); Sound.tick(); SaveSys.load(+slot,snap); });
  },
  panel(){
    if(!S) return;
    const auto=readSlot(RT.slot);
    UI.panel('存档', `<p class="muted">战斗和小游戏以外，随时都可以存档、读档。每晚睡觉、换地图、完成任务、切出游戏时也会自动存档。</p>
      <div class="savecard auto"><div class="sc-l"><b>自动存档</b>${auto?`<span>${realmName(auto.L)} · 第 ${auto.day} 天 ${fmtTime(auto.min)}</span>`:'<span class="muted">（空）</span>'}</div><div class="sc-r"><button class="btn mini" id="svAuto">立即自动存档</button></div></div>
      ${SaveSys.SNAPS.map((s,i)=>SaveSys.card(RT.slot,s,'手动存档 '+(i+1),true)).join('')}
      ${SaveSys.read(RT.slot,'pre_root')?SaveSys.card(RT.slot,'pre_root','测灵根前（自动）',false):''}
      <p class="muted">想重新测灵根？读取「测灵根前」即可。</p>`, b=>{
        $('#svAuto').onclick=()=>{ if(!SaveSys.canSave()) return UI.toast('战斗或小游戏中不能存档'); UI.toast(save()?'已存档':'存档失败'); Sound.coin(); UI.closePanel(); SaveSys.panel(); };
        SaveSys.bind(b, ()=>{ UI.closePanel(); SaveSys.panel(); });
      });
  },
  // title screen: list a profile's snapshots inline
  titleList(slot, host){
    const list=[...SaveSys.SNAPS.map((s,i)=>[s,'手动存档 '+(i+1)]), ['pre_root','测灵根前']].filter(([s])=>SaveSys.read(slot,s));
    host.innerHTML=list.length?list.map(([s,l])=>SaveSys.card(slot,s,l,false)).join(''):'<p class="muted" style="color:#fff3dc">这个角色还没有手动存档。</p>';
    SaveSys.bind(host);
  },
  autoTick:0,
};
function loadFromObject(s){ s.side=s.side||{}; s.track=s.track||'main'; s.look=s.look||defaultLook('m'); s.name=s.name||'无名'; s.st.meditated=s.st.meditated||0; if(s.quest>0) (s.flags=s.flags||{}).intro_done=true; return s; }

/* ---------- autosave on more occasions ---------- */
addEventListener('visibilitychange', ()=>{ if(document.hidden && SaveSys.canSave()) save(); });
addEventListener('pagehide', ()=>{ if(SaveSys.canSave()) save(); });
setInterval(()=>{ if(S && RT.map && !RT.paused && SaveSys.canSave()){ const half=Math.floor(S.min/30); if(half!==SaveSys.autoTick){ SaveSys.autoTick=half; save(); } } }, 2000);
