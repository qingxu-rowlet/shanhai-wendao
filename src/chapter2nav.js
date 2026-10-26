/* ============================================================
   山海问道 · 第二章 — the parts that wrap Nav (nav.js boots the game, so the maps in chapter2.js load before it and these after it):
   portal glow, routing through a portal, the seniors' chores in the task list.
   ============================================================ */
// glow over every portal
{ const _dw=Nav.drawWorld; Nav.drawWorld=function(g,ox,oy,T,Z){ for(const o of RT.ents) if(o.act==='portal'){ const cx=ox+(o.x+.5)*T, cy=oy+(o.y+.75)*T, a=.25+.15*Math.sin(RT.t*3);
      g.fillStyle=`rgba(111,214,192,${a})`; g.beginPath(); g.ellipse(cx,cy,8*Z,3.5*Z,0,0,7); g.fill();
      for(let i=0;i<4;i++){ const u=(RT.t*.6+i/4)%1; g.fillStyle=`rgba(200,255,240,${(1-u)*.8})`; g.fillRect(cx+Math.sin(i*2.3+RT.t)*5*Z, cy-u*14*Z, Z, Z); } }
    return _dw.call(Nav,g,ox,oy,T,Z); }; }
// pathfinding across maps that only a portal connects: head for the portal
{ const _goal=Nav.goal; Nav.goal=function(){ const g=_goal.call(Nav); if(g) return g; const tr=Nav.tracked(), t=tr&&tr.target; if(!t||!RT.map||t[0]===RT.mapId) return g;
    const p=RT.ents.find(o=>o.act==='portal'); return p?{x:p.x, y:p.y, final:true, label:'传送阵'}:null; }; }
{ const _l=Nav.list; Nav.list=function(){ const extra=C2.items(); if(!extra.length) return _l.call(Nav); const rest=_l.call(Nav).filter(x=>x.kind!=='main');
    const all=[...extra, ...rest]; if(!all.some(x=>x.key===S.track)) S.track=extra[0].key;   // the folded phone HUD shows the tracked row only
    const tk=S.track; all.sort((a,b)=>(b.key===tk)-(a.key===tk)); return all.slice(0,3); }; }
{ const _tr=Nav.tracked; Nav.tracked=function(){ if(S.track&&S.track.startsWith('c2_')){ const it=C2.items().find(x=>x.key===S.track); if(it) return {kind:'side', id:it.key, title:it.title, desc:it.progress, progress:it.progress, target:it.target}; }
    if(C2.on()&&(!S.track||S.track==='main')){ const it=C2.items()[0]; if(it) return {kind:'side', id:it.key, title:it.title, desc:it.progress, progress:it.progress, target:it.target}; }
    return _tr.call(Nav); }; }
Nav.extraTasks=()=>C2.items();
