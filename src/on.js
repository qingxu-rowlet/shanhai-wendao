/* ============================================================
   山海问道 · 登记处 (On) — from chapter 3 on, a chapter does not wrap the game's functions one more time; it registers what
   it wants to happen here, and these few wrappers (the last ones) ask everything registered:
     On.talk(fn)          fn(id) → true when it handled talking to that person
     On.act(name, fn)     fn(o) → anything but false when it handled clicking an object with act:name
     On.enter(fn)         fn(mapId, x, y) after a map is entered (start a scene, adjust the map)
     On.wake(fn)          fn(passedOut, fromMap) after a night's sleep or a lost fight: return true when it placed the player
     On.theme(fn)         fn(mapId) → a music theme for that map, or nothing
     On.draw(fn)          fn({g, T, ox, oy}) after the map is drawn (on top of everything): g the canvas, T a tile, ox/oy the offset
     On.building(fn)      fn(o, canvas) → a canvas to draw for that building instead (paint something onto the house itself)
   Chapters 1 and 2 still use their own wrappers underneath; nothing of theirs changes.
   ============================================================ */
const On={
  _talk:[], _act:{}, _enter:[], _wake:[], _theme:[], _draw:[], _bld:[],
  talk(fn){ On._talk.push(fn); }, act(name,fn){ (On._act[name]=On._act[name]||[]).push(fn); }, enter(fn){ On._enter.push(fn); },
  wake(fn){ On._wake.push(fn); }, theme(fn){ On._theme.push(fn); }, draw(fn){ On._draw.push(fn); }, building(fn){ On._bld.push(fn); },
};
{ const _t=Story.talk; Story.talk=function(id){ for(const f of On._talk) if(f(id)===true) return; return _t.call(Story,id); }; }
{ const _a=Dungeon.act; Dungeon.act=function(o){ for(const f of (o&&On._act[o.act])||[]) if(f(o)!==false) return true; return _a.call(Dungeon,o); }; }
{ const _em=enterMap; enterMap=function(id,x,y){ const r=_em(id,x,y); for(const f of On._enter) f(id,x,y); return r; }; }
{ const _s=sleep; sleep=function(passedOut){ const from=RT.mapId; const r=_s(passedOut); for(const f of On._wake) if(f(passedOut,from)===true) break; return r; }; }
{ const _at=areaTheme; areaTheme=function(){ for(const f of On._theme){ const t=f(RT.mapId); if(t) return t; } return _at(); }; }
{ const _r=render; render=function(){ _r(); if(!RT.map||!On._draw.length) return; const Z=RT.scale*RT.dpr, v={g:ctx, T:TILE*Z, ox:Math.round(-RT.cam.x*Z), oy:Math.round(-RT.cam.y*Z)}; for(const f of On._draw) f(v); }; }
{ const _b=building; building=function(o){ let c=_b(o); for(const f of On._bld) c=f(o,c)||c; return c; }; }
