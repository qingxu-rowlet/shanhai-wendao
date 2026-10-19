/* ============================================================
   山海问道 · navigation: tracked task, GPS trail, auto-walk, minimap, world map, task list, profiles
   ============================================================ */
const WORLD = { home:[0,0], town:[24,1], forest:[-3,17] };   // where each area sits on the world map (in tiles)

const Nav = {
  tracked(){
    if(S.track && S.track!=='main'){
      const q=SIDES.find(x=>x.id===S.track), st=q&&S.side[q.id];
      if(q && st!=='done'){
        if(!st) return {kind:'avail', id:q.id, title:q.title, desc:q.desc, progress:'去找'+npcAt(q.giver)[3]+'接取', target:npcAt(q.giver)};
        return {kind:'side', id:q.id, title:q.title, desc:q.desc, progress:sideReady(S,q)?'可以交付了':sideProgress(S,q), target:q.target(S)};
      }
      S.track='main';
    }
    const q=QUESTS[S.quest]; if(!q) return null;
    return {kind:'main', id:q.id, title:q.title, desc:q.desc, progress:q.progress?q.progress(S):'', target:q.target?q.target(S):null};
  },
  goal(){
    const tr=Nav.tracked(), t=tr&&tr.target; if(!t||!RT.map) return null;
    if(t[0]===RT.mapId) return {x:t[1], y:t[2], final:true, label:t[3]};
    const prev={[RT.mapId]:null}, q=[RT.mapId];
    while(q.length){ const m=q.shift(); if(m===t[0]) break; for(const e of MAPS[m].exits) if(!(e.to in prev)){ prev[e.to]=m; q.push(e.to); } }
    if(!(t[0] in prev)) return null;
    let m=t[0]; while(prev[m]!==RT.mapId) m=prev[m];
    const exits=RT.map.exits.filter(e=>e.to===m).sort((a,b)=>(Math.abs(a.x-S.x)+Math.abs(a.y-S.y))-(Math.abs(b.x-S.x)+Math.abs(b.y-S.y)));
    return {x:exits[0].x, y:exits[0].y, final:false, label:'前往'+MAPS[m].name.replace(/.*· /,'')};
  },
  pathTo(g){
    const solid=RT.solid[g.y]&&RT.solid[g.y][g.x];
    const reach = !g.final ? (x,y)=>x===g.x&&y===g.y
      : solid ? (x,y)=>Math.abs(x-g.x)+Math.abs(y-g.y)===1 : (x,y)=>Math.abs(x-g.x)+Math.abs(y-g.y)<=1;
    return bfs(S.x,S.y,reach);
  },
  tick(dt){
    RT.navT-=dt; if(RT.navT>0) return; RT.navT=0.25;
    const g=Nav.goal(); RT.navGoal=g; RT.navPath=g&&S.gps!==false?(Nav.pathTo(g)||[]):[];
    UI.miniDraw();
  },
  go(cont){
    if(UI.busy()&&!cont) UI.closePanel();
    const g=Nav.goal(); if(!g){ UI.toast('这个任务没有要去的地方'); return; }
    const p=Nav.pathTo(g); if(!p){ UI.toast('找不到路'); RT.autoNav=false; return; }
    RT.autoNav=true; RT.pending=null; RT.keys=[];
    if(!p.length){ Nav.arrive(); return; }
    setPath(p); if(!cont) UI.toast('自动寻路：'+g.label);
  },
  arrive(){
    RT.autoNav=false; const g=Nav.goal(); if(!g||!g.final) return;
    const o=entAt(g.x,g.y);
    if(o&&(o.type==='npc'||o.act||o.type==='gather')){ face(g.x,g.y); interact(o); }
    else UI.toast('到了：'+g.label);
  },
  drawWorld(g, ox, oy, T, Z){
    const goal=RT.navGoal; if(!goal) return;
    // breadcrumb trail: flowing gold dots
    const path=RT.navPath;
    for(let i=0;i<path.length && i<40;i++){
      const [x,y]=path[i], a=0.35+0.45*Math.max(0,Math.sin(RT.t*5-i*0.6)), r=(i%2?1:1.6)*Z;
      g.fillStyle=`rgba(255,214,90,${a})`; g.beginPath(); g.arc(ox+(x+.5)*T, oy+(y+.55)*T, r, 0, 7); g.fill();
    }
    // target marker
    const mx=ox+(goal.x+.5)*T, my=oy+goal.y*T - (4+Math.abs(Math.sin(RT.t*3))*4)*Z;
    g.fillStyle='rgba(255,214,90,.25)'; g.beginPath(); g.ellipse(ox+(goal.x+.5)*T, oy+(goal.y+.85)*T, 7*Z, 3*Z, 0, 0, 7); g.fill();
    g.fillStyle='#ffd65a'; g.strokeStyle='#5a2e12'; g.lineWidth=Z;
    g.beginPath(); g.moveTo(mx-4*Z,my-6*Z); g.lineTo(mx+4*Z,my-6*Z); g.lineTo(mx,my); g.closePath(); g.fill(); g.stroke();
  },
  drawArrow(g, ox, oy, T, Z){
    const goal=RT.navGoal; if(!goal) return;
    const tx=ox+(goal.x+.5)*T, ty=oy+(goal.y+.5)*T, W=cv.width, H=cv.height, m=40*RT.dpr;
    if(tx>m&&tx<W-m&&ty>m*2.2&&ty<H-m*2.2) return;
    const px=ox+(RT.fx+.5)*T, py=oy+(RT.fy+.2)*T, ang=Math.atan2(ty-py,tx-px);
    // the arrow circles the hero, so it never hides behind the HUD
    const ax=px+Math.cos(ang)*T*1.5, ay=py+Math.sin(ang)*T*1.5, s=5*RT.dpr*Math.max(1,RT.scale/2.5);
    g.save(); g.translate(ax,ay);
    g.globalAlpha=0.75+0.25*Math.sin(RT.t*5); g.fillStyle='rgba(74,35,11,.85)'; g.beginPath(); g.arc(0,0,s*1.6,0,7); g.fill();
    g.rotate(ang); g.fillStyle='#ffd65a'; g.beginPath(); g.moveTo(s,0); g.lineTo(-s*.7,-s*.75); g.lineTo(-s*.3,0); g.lineTo(-s*.7,s*.75); g.closePath(); g.fill();
    g.restore(); g.globalAlpha=1;
  },
};

/* ---------- minimap ---------- */
const TILECOL = {'.':'#6fbf4f',',':'#78c556',':':'#4f9a3a','=':'#d4ae78','#':'#cdbfa6','~':'#4a9fd8','B':'#a8743f','W':'#7d6c58','F':'#b98b5a','f':'#8a5a36'};
const MINIC = {};
function miniBase(id){
  if(MINIC[id]) return MINIC[id]; const m=MAPS[id], s=3, c=document.createElement('canvas'); c.width=m.w*s; c.height=m.h*s; const g=c.getContext('2d');
  for(let y=0;y<m.h;y++) for(let x=0;x<m.w;x++){ g.fillStyle=TILECOL[m.ground[y][x]]||'#6fbf4f'; g.fillRect(x*s,y*s,s,s); }
  for(const o of m.objects){
    if(o.type==='building'){ g.fillStyle='#7a3d3d'; g.fillRect(o.x*s,o.y*s,o.w*s,o.h*s); g.fillStyle='#f3e3c3'; g.fillRect(o.x*s+1,(o.y+o.h)*s-2,o.w*s-2,2); }
    else if(o.type==='tree'||o.type==='pine'||o.type==='bush'){ g.fillStyle='#2f6b2c'; g.fillRect(o.x*s,o.y*s,s,s); }
    else if(o.type==='rock'){ g.fillStyle='#9aa0a6'; g.fillRect(o.x*s,o.y*s,s,s); }
    else if(o.type==='shrine'){ g.fillStyle='#c8413b'; g.fillRect(o.x*s-1,o.y*s-1,s+2,s+2); }
    else if(o.type==='futon'||o.type==='furnace'){ g.fillStyle='#e8b84a'; g.fillRect(o.x*s,o.y*s,s,s); }
  }
  for(const e of m.exits){ g.fillStyle='#fff3a0'; g.fillRect(e.x*s,e.y*s,s,s); }
  return MINIC[id]=c;
}
UI.miniReset=()=>{ const c=$('#mini'); if(!c||!RT.map) return; const b=miniBase(RT.mapId); c.width=b.width; c.height=b.height; UI.miniDraw(); };
UI.miniDraw=()=>{
  const c=$('#mini'); if(!c||!RT.map) return; const g=c.getContext('2d'), s=3; if(c.width!==miniBase(RT.mapId).width) return UI.miniReset();
  g.drawImage(miniBase(RT.mapId),0,0);
  for(const o of RT.ents) if(o.type==='npc'){ g.fillStyle='#4a7fd0'; g.fillRect(o.x*s,o.y*s,s,s); }
  for(const b of RT.beasts){ g.fillStyle='#e0402e'; g.fillRect(Math.round(b.fx*s),Math.round(b.fy*s),s,s); }
  const goal=RT.navGoal; if(goal){ g.fillStyle=(Math.floor(RT.t*3)%2)?'#ffd65a':'#fff'; g.fillRect(goal.x*s-1,goal.y*s-1,s+2,s+2); }
  g.fillStyle='#fff'; g.fillRect(Math.round(RT.fx*s)-1,Math.round(RT.fy*s)-1,s+2,s+2); g.fillStyle='#c8413b'; g.fillRect(Math.round(RT.fx*s),Math.round(RT.fy*s),s,s);
};

/* ---------- world map ---------- */
UI.worldMap=()=>{
  if(!$('#panel').hidden){ UI.closePanel(); return; }
  const tr=Nav.tracked();
  UI.panel('地图', `<canvas id="wm" class="px wm"></canvas>
    <div class="legend"><span><i style="background:#c8413b"></i>你</span><span><i style="background:#ffd65a"></i>任务目标</span><span><i style="background:#4a7fd0"></i>人物</span><span><i style="background:#e0402e"></i>妖兽</span></div>
    ${tr?`<div class="qcur"><b>${esc(tr.title)}</b><p>${esc(tr.target?tr.target[3]+' · '+MAPS[tr.target[0]].name:'')}</p><button class="btn mini" id="wmGo">寻路</button></div>`:''}`, b=>{
    const c=$('#wm'), s=3; let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
    for(const id in WORLD){ const [wx,wy]=WORLD[id], m=MAPS[id]; x0=Math.min(x0,wx); y0=Math.min(y0,wy); x1=Math.max(x1,wx+m.w); y1=Math.max(y1,wy+m.h); }
    c.width=(x1-x0)*s; c.height=(y1-y0)*s; const g=c.getContext('2d');
    g.fillStyle='#d9c08a'; g.fillRect(0,0,c.width,c.height);
    for(const id in WORLD){ const [wx,wy]=WORLD[id]; g.drawImage(miniBase(id),(wx-x0)*s,(wy-y0)*s); }
    const t=tr&&tr.target; if(t){ const [wx,wy]=WORLD[t[0]]; g.fillStyle='#ffd65a'; g.strokeStyle='#5a2e12'; g.lineWidth=1; g.fillRect((wx-x0+t[1])*s-2,(wy-y0+t[2])*s-2,s+4,s+4); g.strokeRect((wx-x0+t[1])*s-2.5,(wy-y0+t[2])*s-2.5,s+5,s+5); }
    const [px,py]=WORLD[RT.mapId]; g.fillStyle='#fff'; g.fillRect((px-x0+RT.fx)*s-2,(py-y0+RT.fy)*s-2,s+4,s+4); g.fillStyle='#c8413b'; g.fillRect((px-x0+RT.fx)*s-1,(py-y0+RT.fy)*s-1,s+2,s+2);
    // area names as HTML labels over the canvas
    const wrap=document.createElement('div'); wrap.className='wm-wrap'; c.replaceWith(wrap); wrap.appendChild(c);
    for(const id in WORLD){ const [wx,wy]=WORLD[id], m=MAPS[id]; const l=document.createElement('span'); l.className='wm-label'; l.textContent=m.name.replace(/.*· /,'');
      l.style.left=((wx-x0+m.w/2)/(x1-x0)*100)+'%'; l.style.top=((wy-y0+1.2)/(y1-y0)*100)+'%'; wrap.appendChild(l); }
    const go=$('#wmGo'); if(go) go.onclick=()=>{ UI.closePanel(); Nav.go(); };
  });
};

/* ---------- task list ---------- */
UI.tasks=()=>{
  if(!$('#panel').hidden && UI._panelKind==='tasks'){ UI.closePanel(); return; }
  const q=QUESTS[S.quest], rows=[];
  rows.push(`<div class="task ${S.track==='main'?'on':''}"><div class="tk-head"><span class="tag main">主线</span><b>${esc(q.title)}</b></div><p>${esc(q.desc)}</p>
    ${q.progress?`<p class="muted">进度：${esc(q.progress(S))}</p>`:''}
    <div class="tk-btns"><button class="btn mini" data-track="main">${S.track==='main'?'追踪中':'追踪'}</button>${q.target?'<button class="btn mini main" data-go="main">寻路</button>':''}</div></div>`);
  for(const s of SIDES){ const st=S.side[s.id]; if(st==='done'||!s.unlock(S)) continue;
    const giver=npcAt(s.giver)[3];
    rows.push(`<div class="task ${S.track===s.id?'on':''}"><div class="tk-head"><span class="tag">${st?'支线':'可接取'}</span><b>${esc(s.title)}</b></div>
      <p>${esc(st?s.desc:'去找'+giver+'聊聊，看看有什么能帮忙的。')}</p>${st?`<p class="muted">进度：${esc(sideReady(S,s)?'可以交付给'+giver+'了':sideProgress(S,s))}</p>`:''}
      <div class="tk-btns"><button class="btn mini" data-track="${s.id}">${S.track===s.id?'追踪中':'追踪'}</button><button class="btn mini main" data-go="${s.id}">寻路</button></div></div>`); }
  const done=[...QUESTS.slice(0,S.quest).map(x=>x.title), ...SIDES.filter(s=>S.side[s.id]==='done').map(s=>s.title)];
  UI.panel('任务', rows.join('')+(done.length?`<details class="qdone-d"><summary>已完成（${done.length}）</summary><ul class="qdone">${done.map(t=>`<li>✓ ${esc(t)}</li>`).join('')}</ul></details>`:'')
    +`<label class="gps-t"><input type="checkbox" id="gpsT" ${S.gps!==false?'checked':''}> 显示地面引路光点</label>`, b=>{
    b.querySelectorAll('[data-track]').forEach(x=>x.onclick=()=>{ Sound.tick(); S.track=x.dataset.track; RT.navT=0; UI.hud(); UI._panelKind=''; $('#panel').hidden=true; UI.tasks(); });
    b.querySelectorAll('[data-go]').forEach(x=>x.onclick=()=>{ Sound.tick(); S.track=x.dataset.go; RT.navT=0; UI.closePanel(); UI.hud(); Nav.go(); });
    $('#gpsT').onchange=e=>{ S.gps=e.target.checked; RT.navT=0; };
  });
  UI._panelKind='tasks';
};

/* ---------- side quests through NPC talk ---------- */
Story.finishSide=(q, after)=>{
  if(q.need) for(const [k,n] of Object.entries(q.need)) addItem(k,-n);
  S.side[q.id]='done'; const r=q.reward||{}; if(r.stones){ S.stones+=r.stones; } if(r.give) for(const k in r.give) addItem(k,r.give[k]);
  if(r.energy){ S.bonusEnergy=(S.bonusEnergy||0)+r.energy; S.energy+=r.energy; }
  if(r.atk) S.bonusAtk=(S.bonusAtk||0)+r.atk;
  if(r.petlv&&S.pet) S.pet.lv+=r.petlv;
  if(r.tianji){ S.flags.tianji_up=true; if(S.fortune===3) S.fortune=2; }
  if(r.heart) for(const k in r.heart) Social.add(k,r.heart[k]);
  if(S.track===q.id) S.track='main'; UI.hud();
  UI.say(q.done.concat([['旁白',`完成支线「${q.title}」`+([r.stones?`灵石 +${r.stones}`:'', ...Object.keys(r.give||{}).map(k=>ITEMS[k].name+'×'+r.give[k]), r.energy?`体力上限 +${r.energy}`:'', ...Object.keys(r.heart||{}).map(k=>NPCS[k].name+'好感 ↑')].filter(Boolean).map((x,i)=>(i?'，':'：')+x).join(''))]]), after);
  Sound.coin(); return true;
};
Story.side=(id, after)=>{
  for(const q of SIDES){ if(q.giver!==id||!q.unlock(S)) continue; const st=S.side[q.id];
    if(st==='active' && sideReady(S,q)){
      if(q.deliverAt==='shrine'){ UI.say([[NPCS[id].name,'灵草带来了？那就去山林南边的青丘狐祠，供在香炉前吧。']], after); return true; }
      return Story.finishSide(q, after);
    }
    if(!st){ S.side[q.id]='active'; if(q.count) S.side[q.id+'_base']=sideCountNow(S,q.count); S.track=q.id; UI.hud(); RT.navT=0;
      UI.say(q.start.concat([['旁白',`接下支线「${q.title}」，已设为追踪。`]]), after); return true; }
  }
  return false;
};

/* ---------- title screen with three profiles ---------- */
UI.title=()=>{
  const t=$('#title'); t.hidden=false; clearInterval(Creator.timer); Music.play('calm');
  const slots=[...Array(SLOTS)].map((_,i)=>readSlot(i));
  t.innerHTML=`<div class="title-in"><h1>山海问道</h1><p class="sub">种田 · 修仙 · 降妖　——　青丘篇</p>
    <div class="slots">${slots.map((s,i)=>s?`<div class="slot-card wood"><canvas class="px" data-pv="${i}" width="18" height="22"></canvas>
        <div class="sc-info"><b>${esc(s.name||'无名')}</b><span>${realmName(s.L)} · 第 ${s.day} 天</span><span class="muted">${esc(MAPS[s.map].name)}</span></div>
        <div class="sc-btns"><button class="btn main mini" data-play="${i}">继续</button><button class="btn mini" data-saves="${i}">读档</button><button class="btn mini" data-del="${i}">删除</button></div></div>`
      :`<button class="slot-card empty wood" data-new="${i}"><span class="plus">＋</span><span>新的修行</span><span class="muted">存档 ${i+1}</span></button>`).join('')}</div>
    <div class="title-saves" id="tSaves"></div><p class="tnote">每个存档是一位独立的修士。</p><p class="copyright">© 2026 qingxu-rowlet · 山海问道 · CC BY-NC-SA 4.0 · 禁止商用</p></div>`;
  t.querySelectorAll('[data-pv]').forEach(c=>{ const s=slots[+c.dataset.pv]; c.getContext('2d').drawImage(lookSprite(s.look||defaultLook('m'),'down',0),0,0); });
  t.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>{ Sound.unlock(); const i=+b.dataset.play; RT.slot=i; S=loadSave(i); Sect.migrate(); Hooks.placeQiyu(); t.hidden=true; enterMap(S.map,S.x,S.y); UI.hud(); UI.sync(); SaveSys.resume(); });
  t.querySelectorAll('[data-saves]').forEach(b=>b.onclick=()=>{ Sound.tick(); SaveSys.titleList(+b.dataset.saves, $('#tSaves')); });
  t.querySelectorAll('[data-new]').forEach(b=>b.onclick=()=>{ Sound.unlock(); Sound.tick(); Creator.open(+b.dataset.new); });
  t.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{ if(!b.classList.contains('sure')){ b.classList.add('sure'); b.textContent='确定?'; setTimeout(()=>{ if(b.isConnected){ b.classList.remove('sure'); b.textContent='删除'; } },2500); return; }
    try{ localStorage.removeItem(slotKey(+b.dataset.del)); }catch(e){} UI.title(); });
  UI.sync();
};

/* ---------- boot ---------- */
addEventListener('pointerdown', ()=>{ if(Music._want) Music.play(Music._want,true); }, {once:true});
addEventListener('keydown', ()=>{ if(Music._want) Music.play(Music._want,true); }, {once:true});
resize();
requestAnimationFrame(frame);
UI.title();
