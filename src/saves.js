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
    RT.slot=slot; S=JSON.parse(JSON.stringify(rec.state)); S=C2.rollback(loadFromObject(S));
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

/* ---------- carry a save to another browser or phone: a file, or a code to paste ----------
   Each browser keeps its own saves (Safari, WeChat, the app you tapped the link in…), so a save can be taken along by hand. */
const Carry = {
  PREFIX:'山海问道存档:',
  enc(s){ return btoa(unescape(encodeURIComponent(JSON.stringify({game:'shanhai-wendao', v:1, at:Date.now(), save:s})))); },
  code(s){ return Carry.PREFIX+Carry.enc(s); },
  // accepts a code (with or without the prefix) or the text of a save file
  parse(text){ text=String(text||'').trim(); let o=null;
    try{ if(text.startsWith('{')) o=JSON.parse(text); else o=JSON.parse(decodeURIComponent(escape(atob(text.replace(Carry.PREFIX,'').replace(/\s+/g,''))))); }catch(e){ return null; }
    const s=o&&o.save?o.save:o; if(!s||typeof s!=='object'||s.L==null||s.quest==null||!s.flags||!s.inv) return null;
    if(!MAPS[s.map]){ s.map='home'; s.x=11; s.y=6; } return s; },
  fileName(s){ return `山海问道-${s.name||'存档'}-第${s.day}天.json`; },
  download(s){ const blob=new Blob([JSON.stringify({game:'shanhai-wendao', v:1, at:Date.now(), save:s})],{type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=Carry.fileName(s); document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },1500); },
  async copy(text){ try{ await navigator.clipboard.writeText(text); return true; }catch(e){ return false; } },
  // the export block (存档 page)
  exportHTML(){ return `<div class="carry wood"><b>带走存档（换浏览器、换手机）</b>
      <p class="muted">每个浏览器的存档是分开的：Safari、微信里打开、从聊天窗口点开，都各存各的。想在别处接着玩，就把存档带过去。</p>
      <div class="carry-btns"><button class="btn mini main" id="cxFile">导出存档文件</button><button class="btn mini" id="cxCode">复制存档码</button><button class="btn mini" id="cxIn">导入存档</button></div>
      <textarea id="cxOut" class="carry-code" readonly hidden></textarea></div>`; },
  bindExport(b){
    $('#cxFile',b).onclick=()=>{ save(); Carry.download(S); Sound.coin(); UI.toast('已导出。iPhone 可以选「存储到“文件”」'); };
    $('#cxCode',b).onclick=async()=>{ save(); const c=Carry.code(S), ok=await Carry.copy(c), t=$('#cxOut',b); t.hidden=false; t.value=c; t.select();
      UI.toast(ok?'存档码已复制，可以发到微信，在另一处「导入存档」时粘贴':'请长按下面的存档码全选、复制'); };
    $('#cxIn',b).onclick=()=>{ Sound.tick(); UI.closePanel(); UI.panel('导入存档', `<div id="cxForm"></div>`, p=>Carry.form($('#cxForm',p), RT.slot, true)); };
  },
  // the import form; on the title screen you pick which of the three profiles it goes into
  form(host, slot, inGame){
    const slots=[...Array(SLOTS)].map((_,i)=>readSlot(i));
    host.innerHTML=`<div class="carry wood"><b>导入存档</b>
      <p class="muted">选一个存档文件，或者把存档码粘贴到下面。</p>
      <input type="file" id="ciFile" accept=".json,.txt,application/json,text/plain">
      <textarea id="ciCode" class="carry-code" placeholder="粘贴存档码（以「山海问道存档:」开头）"></textarea>
      ${inGame?`<p class="muted">导入后会替换当前这个存档（${esc(S.name||'')}）。</p>`:`<div class="carry-slots">${slots.map((s,i)=>`<label><input type="radio" name="ciSlot" value="${i}" ${i===slot?'checked':''}> 存档 ${i+1}${s?'（'+esc(s.name||'无名')+'，会被替换）':'（空）'}</label>`).join('')}</div>`}
      <div class="carry-btns"><button class="btn mini main" id="ciGo">导入</button><button class="btn mini" id="ciX">取消</button></div><p class="muted" id="ciMsg"></p></div>`;
    let fileText='';
    $('#ciFile',host).onchange=e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ fileText=String(r.result); $('#ciMsg',host).textContent='已选择：'+f.name; }; r.readAsText(f); };
    $('#ciX',host).onclick=()=>{ Sound.tick(); if(inGame) UI.closePanel(); else host.innerHTML=''; };
    $('#ciGo',host).onclick=()=>{
      const s=Carry.parse(fileText||$('#ciCode',host).value); if(!s){ $('#ciMsg',host).textContent='没认出这个存档，请检查文件或存档码是否完整。'; Sound.hurt(); return; }
      const i=inGame?RT.slot:+((host.querySelector('[name=ciSlot]:checked')||{}).value||0);
      try{ localStorage.setItem(slotKey(i), JSON.stringify(s)); }catch(e){ $('#ciMsg',host).textContent='保存失败（浏览器存储已满或被禁用）。'; return; }
      Sound.levelup(); UI.toast(`导入成功：${s.name||'无名'} · ${realmName(s.L)} · 第 ${s.day} 天`);
      if(inGame){ UI.closePanel(); S=loadSave(i); Sect.migrate(); enterMap(S.map,S.x,S.y); UI.hud(); UI.sync(); Story.check(); } else UI.title(); };
  },
};
// the 存档 page gets the export block
{ const _p=SaveSys.panel; SaveSys.panel=function(){ _p.apply(SaveSys,arguments); const body=$('#panel .pbody'); if(!body||!S) return;
    const d=document.createElement('div'); d.innerHTML=Carry.exportHTML(); body.appendChild(d); Carry.bindExport(d); }; }
// the title screen gets 导入存档 and, on an iPhone outside the home-screen app, a tip about where saves live
{ const _t=UI.title; UI.title=function(){ _t.apply(UI,arguments); const t=$('#title'), note=t&&t.querySelector('.tnote'); if(!note) return;
    const b=document.createElement('div'); b.className='title-carry'; b.innerHTML='<button class="btn mini" id="tImport">导入存档</button>'; note.before(b);
    $('#tImport').onclick=()=>{ Sound.tick(); Carry.form($('#tSaves'), [...Array(SLOTS)].findIndex((_,i)=>!readSlot(i))>=0?[...Array(SLOTS)].findIndex((_,i)=>!readSlot(i)):0, false); };
    const ios=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
    if(ios&&!navigator.standalone){ const p=document.createElement('p'); p.className='tnote hs'; p.textContent='提示：在 Safari 里点「分享 → 添加到主屏幕」，以后从桌面图标进入。存档只存在当前浏览器里，Safari 长时间不打开时可能会清掉网页数据；从桌面图标进入就不会。也可以在「行囊 → 存档」里导出存档备份。'; note.after(p); } }; }

/* ---------- a reminder to take a copy: every seven days, and when a chapter ends. Saves live only in this browser, and
   some browsers clear them (Safari after a week away, the browser inside WeChat whenever it likes) ---------- */
Carry.ask=function(why){ if(!S||S.review||document.getElementById('selftest')||!SaveSys.canSave()) return;
  S.carryAsk=S.day; save();
  UI.panel('备份一下存档？', `<p>${why}</p><p class="muted">存档只存在这个浏览器里。iPhone 的 Safari 七天没打开、微信里的浏览器清理缓存，都可能把它清掉。导出一份放在手机「文件」里或发给自己，丢了也能用「导入存档」找回来。</p><div id="cxAsk"></div>`,
    p=>{ const d=$('#cxAsk',p); d.innerHTML=Carry.exportHTML(); Carry.bindExport(d); }); };
{ const _d=UI.dayCard; UI.dayCard=function(){ const r=_d.apply(UI,arguments); if(!S||S.review) return r;
    const F=S.flags||{}, why=F.c2_done&&!F.carry_c2d?(F.carry_c2d=true,'第二章打完了，恭喜！'):F.c2_arrive&&!F.carry_c2?(F.carry_c2=true,'第一章打完了，已经拜入宗门。'):S.day>=3&&S.day-(S.carryAsk||0)>=7?'又过了一阵子了。':null;
    if(why){ let n=0; const t=setInterval(()=>{ if(++n>40) return clearInterval(t); if(!$('#dlg').hidden||!$('#panel').hidden||!$('#daycard').hidden||RT.fadeTo||(Battle.s&&!$('#battle').hidden)) return; clearInterval(t); Carry.ask(why); },1500); }
    return r; }; }
