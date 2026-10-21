/* ============================================================
   山海问道 · engine: state, rendering, movement, time, farming, beasts
   ============================================================ */
const TILE = 16;
const SAVE_KEY = 'shanhai-wendao.v1';
const MIN_SEC = 0.6;           // real seconds per game minute
const DAY_START = 6*60;

let S = null;                  // saved game state
let RT = {                     // runtime-only state
  paused:true, mapId:null, map:null, solid:null, ents:[], beasts:[],
  fx:0, fy:0, stamina:100, winded:false, runHeld:false, runToggle:false, running:false, moving:false, path:[], pending:null, dir:'down', step:0, keys:[], walk:0, slot:0, autoNav:false, navPath:[], navT:0, tileKey:'',
  cam:{x:0,y:0}, scale:3, dpr:1, fade:0, fadeTo:null, t:0, toastT:0, shake:0
};

function newState(){
  return { map:'home', x:11, y:6, L:0, exp:0, hp:50, mp:16, energy:100, stones:20, day:1, min:DAY_START,
    inv:{}, sel:'hoe', farm:{}, gathered:{}, killed:{}, quest:0, questStarted:-1, flags:{},
    st:{planted:0, watered:0, kills:0, harvested:0, meditated:0, gathered:0}, seen:{}, mute:false, side:{}, track:'main', name:'无名', look:defaultLook('m'), qv:4, karma:0 };
}
function maxEnergy(){ return 100 + 10*S.L + (S.bonusEnergy||0); }
function stats(){ return Sect.apply(statsFor(S.L)); }
function save(){ if(typeof Replay!=='undefined'&&Replay.active) return true; try{ localStorage.setItem(slotKey(RT.slot), JSON.stringify(S)); return true; }catch(e){ return false; } }
function loadSave(i){ const s=readSlot(i); if(s){ s.side=s.side||{}; s.track=s.track||'main'; s.look=s.look||defaultLook('m'); s.name=s.name||'无名'; s.st.meditated=s.st.meditated||0; if(s.quest>0) s.flags.intro_done=true; } return s; }
function addItem(id,n=1){ S.inv[id]=(S.inv[id]||0)+n; if(S.inv[id]<=0) delete S.inv[id]; UI.hud(); if(typeof Story!=='undefined') Story._pending=true; }

/* ---------- sprite & tile caches ---------- */
const SPRC = {};
function sprite(key, color){
  const ck = key+(color||''); if(SPRC[ck]) return SPRC[ck];
  const rows = SPR[key]; const h=rows.length, w=Math.max(...rows.map(r=>r.length));
  const c=document.createElement('canvas'); c.width=w+2; c.height=h+2; const g=c.getContext('2d');
  const filled=(x,y)=>y>=0&&y<h&&x>=0&&x<w&&rows[y][x]&&rows[y][x]!=='.';
  // outline first, then pixels
  g.fillStyle=PAL.k;
  for(let y=-1;y<=h;y++) for(let x=-1;x<=w;x++){ if(filled(x,y)) continue;
    if(filled(x-1,y)||filled(x+1,y)||filled(x,y-1)||filled(x,y+1)) g.fillRect(x+1,y+1,1,1); }
  for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const ch=rows[y][x]; if(!ch||ch==='.') continue;
    g.fillStyle = ch==='X' ? (color||'#fff') : (PAL[ch]||'#f0f'); g.fillRect(x+1,y+1,1,1); }
  // anchor: last row with pixels (so a tall sprite stands on its tile)
  let bottom=h-1; while(bottom>0 && !rows[bottom].replace(/\./g,'')) bottom--;
  c.bottom=bottom+2; return SPRC[ck]=c;
}
function rng(seed){ let s=seed>>>0||1; return ()=>((s=Math.imul(s^s>>>15,1|s)+0x6D2B79F5|0, ((s^s>>>14)>>>0)%10000)/10000); }
const TILEC = {};
function tileCanvas(ch, v, frame){
  const key=ch+v+(frame||0); if(TILEC[key]) return TILEC[key];
  const c=document.createElement('canvas'); c.width=c.height=TILE; const g=c.getContext('2d'), R=rng(ch.charCodeAt(0)*977+v*131+(frame||0)*7);
  const px=(x,y,col)=>{ g.fillStyle=col; g.fillRect(x,y,1,1); };
  const grass=()=>{ g.fillStyle='#6fbf4f'; g.fillRect(0,0,16,16);
    for(let i=0;i<22;i++) px(R()*16|0,R()*16|0, R()<.5?'#5fae43':'#83cf5c');
    for(let i=0;i<3;i++){ const x=R()*14|0,y=2+R()*12|0; px(x,y,'#4f9a3a'); px(x+1,y-1,'#4f9a3a'); } };
  switch(ch){
    case ',': grass(); for(let i=0;i<3;i++){ const x=1+R()*13|0,y=1+R()*13|0, col=['#f2f2a0','#f5a3c0','#ffffff','#b9a3f5'][R()*4|0]; px(x,y,col); px(x+1,y,col); px(x,y+1,col); px(x+1,y+1,'#e8b84a'); } break;
    case ':': grass(); for(let i=0;i<5;i++){ const x=R()*14|0,y=4+R()*10|0; for(let k=0;k<4;k++){ px(x,y-k,'#3f8a33'); } px(x+1,y-2,'#3f8a33'); px(x-1,y-1,'#58a744'); } break;
    case '=': g.fillStyle='#d4ae78'; g.fillRect(0,0,16,16); for(let i=0;i<14;i++) px(R()*16|0,R()*16|0, R()<.5?'#c49c66':'#e0bd88');
      for(let i=0;i<2;i++){ const x=R()*14|0,y=R()*14|0; px(x,y,'#a7895f'); px(x+1,y,'#bfa27a'); } break;
    case '#': { g.fillStyle='#9a8c74'; g.fillRect(0,0,16,16);
      const slab=(x,y,w,h)=>{ const tone=['#cfc2a8','#c6b89d','#d6cab2'][R()*3|0]; g.fillStyle=tone; g.fillRect(x,y,w,h); g.fillStyle='#e4dac6'; g.fillRect(x,y,w,1); g.fillRect(x,y,1,h);
        g.fillStyle='#ad9f86'; g.fillRect(x,y+h-1,w,1); g.fillRect(x+w-1,y,1,h); for(let i=0;i<3;i++) px(x+1+R()*(w-2)|0,y+1+R()*(h-2)|0,'#b8aa90'); };
      const s=v%2?5:10; slab(0,0,s,8); slab(s,0,16-s,8); slab(0,8,16-s,8); slab(16-s,8,s,8);
      if(R()<.3){ px(3+R()*10|0,15,'#6fa84f'); } break; }
    case '~': g.fillStyle='#4a9fd8'; g.fillRect(0,0,16,16);
      for(let i=0;i<3;i++){ const x=(R()*12|0)+((frame||0)?1:0), y=R()*15|0; g.fillStyle='#8fd0f5'; g.fillRect(x,y,3,1); }
      for(let i=0;i<6;i++) px(R()*16|0,R()*16|0,'#3f8fc6'); break;
    case 'B': g.fillStyle='#4a9fd8'; g.fillRect(0,0,16,16); g.fillStyle='#a8743f'; g.fillRect(0,1,16,14);
      g.fillStyle='#8a5a30'; for(let y=1;y<15;y+=4) g.fillRect(0,y,16,1); g.fillStyle='#5e3a20'; g.fillRect(0,1,16,1); g.fillRect(0,14,16,1); break;
    case 'W': { g.fillStyle='#6f604e'; g.fillRect(0,0,16,16);
      // stacked rocks, lit from the top-left
      const rock=(x,y,w,h)=>{ g.fillStyle=['#8b7a64','#948370','#857360'][R()*3|0]; g.fillRect(x+1,y,w-2,h); g.fillRect(x,y+1,w,h-2);
        g.fillStyle='#a8957a'; g.fillRect(x+1,y,w-2,1); g.fillRect(x,y+1,1,h-3); g.fillStyle='#5f5242'; g.fillRect(x+1,y+h-1,w-2,1); g.fillRect(x+w-1,y+1,1,h-2); };
      const o=v%2?0:4; rock(-o,0,9,6); rock(9-o,0,11,6); rock(0,5,7,6); rock(7,5,9,6); rock(-o+2,10,8,6); rock(10-o,10,10,6);
      for(let i=0;i<4;i++) px(R()*16|0,R()*16|0,'#a8957a'); if(R()<.35){ const x=R()*13|0; px(x,6,'#5f9e43'); px(x+1,6,'#4f8a3a'); px(x,7,'#4f8a3a'); } break; }
    case 'F': g.fillStyle='#b98b5a'; g.fillRect(0,0,16,16); for(let i=0;i<14;i++) px(R()*16|0,R()*16|0,R()<.5?'#a87c4e':'#c99a68'); break;
    case 't': g.fillStyle='#7a5232'; g.fillRect(0,0,16,16); g.fillStyle='#664228'; for(let y=2;y<16;y+=4) g.fillRect(1,y,14,1);
      for(let i=0;i<8;i++) px(R()*16|0,R()*16|0,'#8a6040'); break;
    case 'w': g.fillStyle='#57391f'; g.fillRect(0,0,16,16); g.fillStyle='#46301a'; for(let y=2;y<16;y+=4) g.fillRect(1,y,14,1);
      for(let i=0;i<6;i++) px(R()*16|0,R()*16|0,'#6a4628'); break;
    case 'f': grass(); g.fillStyle='#8a5a36'; g.fillRect(0,6,16,2); g.fillRect(0,10,16,2); g.fillStyle='#5e3a20'; g.fillRect(2,4,3,10); g.fillRect(11,4,3,10);
      g.fillStyle='#a8743f'; g.fillRect(2,4,3,1); g.fillRect(11,4,3,1); break;
    default: grass();
  }
  return TILEC[key]=c;
}

/* ---------- buildings (drawn procedurally) ---------- */
const BLDC = {};
function building(o){
  const key=o.style+o.w+'x'+o.h; if(BLDC[key]) return BLDC[key];
  const W=o.w*TILE, H=(o.h+1)*TILE; const c=document.createElement('canvas'); c.width=W; c.height=H; const g=c.getContext('2d');
  if(o.style==='cave'){
    g.fillStyle='#7d6c58'; g.beginPath(); g.moveTo(0,H); g.quadraticCurveTo(4,6,W/2,4); g.quadraticCurveTo(W-4,6,W,H); g.fill();
    g.fillStyle='#958168'; g.beginPath(); g.moveTo(8,H); g.quadraticCurveTo(14,14,W/2,12); g.quadraticCurveTo(W-14,14,W-8,H); g.fill();
    g.fillStyle='#5f9e43'; g.fillRect(W/2-20,5,40,3); g.fillRect(W/2-12,3,24,3);
    g.fillStyle='#2a1e1a'; g.beginPath(); g.ellipse(W/2,H-2,13,20,0,Math.PI,0); g.fill(); g.fillRect(W/2-13,H-2,26,2);
    g.fillStyle='#c8413b'; g.fillRect(W/2-18,H-34,36,8); g.fillStyle='#e8b84a'; g.fillRect(W/2-16,H-32,32,4);
    g.fillStyle='#6f604e'; for(let i=0;i<10;i++) g.fillRect(10+(i*37)%(W-20), 18+(i*23)%(H-30), 4,1);
  } else {
    const wallTop=Math.round(H*0.42), shop=o.style==='shop';
    const roof=shop?['#22384f','#2e4a68','#3d5f84','#5a7fa6']:['#4a1f1f','#642a2a','#7e3636','#a0504a'], beam='#5e3a20', beamL='#8a5a36';
    // stone base, plaster wall with timber frame
    g.fillStyle='#8b7a64'; g.fillRect(3,H-6,W-6,6); g.fillStyle='#a8957a'; for(let x=4;x<W-6;x+=7) g.fillRect(x,H-6,6,2); g.fillStyle='#6f604e'; g.fillRect(3,H-1,W-6,1);
    g.fillStyle=shop?'#f3e6c8':'#eee0c2'; g.fillRect(5,wallTop,W-10,H-6-wallTop);
    g.fillStyle='rgba(120,90,50,.08)'; for(let i=0;i<40;i++) g.fillRect(6+(i*37)%(W-12), wallTop+2+(i*17)%(H-10-wallTop), 2, 1);
    g.fillStyle='rgba(60,40,20,.18)'; g.fillRect(5,wallTop,W-10,4);                                // shade under the eaves
    g.fillStyle=beam; g.fillRect(4,wallTop,3,H-6-wallTop); g.fillRect(W-7,wallTop,3,H-6-wallTop); g.fillRect(4,H-9,W-8,3);
    for(let x=26;x<W-24;x+=22){ g.fillRect(x,wallTop,2,H-6-wallTop); } g.fillStyle=beamL; g.fillRect(4,wallTop,1,H-6-wallTop); g.fillRect(4,H-9,W-8,1);
    // lattice windows (窗棂)
    const win=(x,y)=>{ g.fillStyle=beam; g.fillRect(x-1,y-1,18,14); g.fillStyle='#f6dd94'; g.fillRect(x,y,16,12); g.fillStyle='#9a6a3a';
      for(let k=0;k<=16;k+=4) g.fillRect(x+k-(k===16?1:0),y,1,12); for(let k=0;k<=12;k+=4) g.fillRect(x,y+k-(k===12?1:0),16,1);
      g.fillStyle='rgba(255,255,255,.35)'; g.fillRect(x+1,y+1,3,3); g.fillStyle=beamL; g.fillRect(x-2,y+12,20,2); };
    win(12,wallTop+9); win(W-28,wallTop+9);
    // door with frame and a plaque above
    g.fillStyle=beam; g.fillRect(W/2-11,H-27,22,21); g.fillStyle='#7a4a2a'; g.fillRect(W/2-9,H-25,8,19); g.fillRect(W/2+1,H-25,8,19);
    g.fillStyle='#5e3a20'; for(let y=H-23;y<H-8;y+=4){ g.fillRect(W/2-8,y,6,1); g.fillRect(W/2+2,y,6,1); } g.fillStyle='#e8b84a'; g.fillRect(W/2-3,H-17,2,2); g.fillRect(W/2+1,H-17,2,2);
    g.fillStyle='#2a1e1a'; g.fillRect(W/2-12,H-33,24,7); g.fillStyle=shop?'#2c4560':'#7a2a2a'; g.fillRect(W/2-11,H-32,22,5); g.fillStyle='#f2c14e'; for(let k=0;k<3;k++) g.fillRect(W/2-7+k*6,H-31,3,3);
    // roof: curved tile rows with upturned eaves and a ridge
    const top=wallTop-17;
    g.fillStyle=roof[0]; g.beginPath(); g.moveTo(-3,wallTop+5); g.quadraticCurveTo(8,wallTop-1,14,top); g.lineTo(W-14,top); g.quadraticCurveTo(W-8,wallTop-1,W+3,wallTop+5); g.lineTo(W-4,wallTop+3); g.lineTo(4,wallTop+3); g.fill();
    g.save(); g.clip();
    for(let y=top;y<wallTop+5;y+=4){ g.fillStyle=roof[2]; g.fillRect(0,y,W,3); g.fillStyle=roof[1]; g.fillRect(0,y+3,W,1); }
    for(let x=-2;x<W;x+=5){ g.fillStyle=roof[3]; g.fillRect(x,top,1,wallTop+5-top); g.fillStyle=roof[0]; g.fillRect(x+3,top,1,wallTop+5-top); }
    g.restore();
    g.fillStyle=roof[0]; g.fillRect(2,wallTop+2,W-4,2);                                                // eave edge
    g.fillStyle='#2a1e1a'; g.fillRect(12,top-3,W-24,4); g.fillStyle=roof[3]; g.fillRect(12,top-3,W-24,1);   // ridge
    g.fillStyle='#2a1e1a'; g.fillRect(8,top-6,5,4); g.fillRect(W-13,top-6,5,4); g.fillRect(6,top-8,3,3); g.fillRect(W-9,top-8,3,3);  // upturned ridge ends
    g.fillStyle='#e8b84a'; g.fillRect(W/2-2,top-6,4,3);
    // hanging lanterns at the eaves
    for(const lx of [9,W-14]){ g.fillStyle='#2a1e1a'; g.fillRect(lx+2,wallTop+3,1,2); g.fillStyle='#c8413b'; g.fillRect(lx,wallTop+5,5,7); g.fillRect(lx+1,wallTop+4,3,9);
      g.fillStyle='#ffd27a'; g.fillRect(lx+1,wallTop+7,3,3); g.fillStyle='#e8b84a'; g.fillRect(lx+2,wallTop+13,1,2); }
  }
  return BLDC[key]=c;
}

/* ---------- maps ---------- */
function tileAt(x,y){ const m=RT.map; if(x<0||y<0||x>=m.w||y>=m.h) return 'W'; return m.ground[y][x]||'.'; }
function farmKey(x,y){ return S.map+':'+x+','+y; }
function enterMap(id, x, y){
  RT.mapId=id; RT.map=MAPS[id]; S.map=id; S.x=x; S.y=y; RT.fx=x; RT.fy=y; RT.path=[]; RT.pending=null; RT.moving=false; RT.tileKey=id+x+','+y; RT.navPath=[]; RT.navT=0;
  if(id==='forest') Hooks.placeQiyu();
  Sect.syncLooks();
  const m=RT.map; RT.solid=[...Array(m.h)].map((_,yy)=>[...Array(m.w)].map((_,xx)=>'W~f'.includes(tileAt(xx,yy))));
  RT.ents=[];
  for(const o of m.objects){
    if(o.type==='building'){ for(let yy=o.y;yy<o.y+o.h;yy++) for(let xx=o.x;xx<o.x+o.w;xx++) RT.solid[yy][xx]=true; }
    else if(o.cond && !o.cond(S)) continue;
    else if(o.type==='gather'){ if(S.gathered[id+':'+o.x+','+o.y]===S.day) continue; RT.solid[o.y][o.x]=true; }
    else RT.solid[o.y][o.x]=true;
    RT.ents.push(o);
  }
  spawnBeasts();
  UI.mapName(m.name); UI.miniReset&&UI.miniReset(); Music.play(areaTheme());
}
function spawnBeasts(){
  RT.beasts=[]; const m=RT.map; if(!m.spawns) return;
  const now=S.day*1440+S.min, killed=(S.killed[S.day+':'+RT.mapId]||[]).filter(k=>typeof k==='number'||now-k.t<240).map(k=>typeof k==='number'?k:k.i); let idx=0;
  const R=rng(S.day*31+RT.mapId.length);
  for(const sp of m.spawns){
    for(let k=0;k<sp.n;k++,idx++){
      if(killed.includes(idx)) continue;
      if(sp.minRealm && S.L<sp.minRealm) continue;
      for(let tries=0;tries<40;tries++){
        const x=sp.area[0]+(R()*(sp.area[2]-sp.area[0]+1)|0), y=sp.area[1]+(R()*(sp.area[3]-sp.area[1]+1)|0);
        if(!RT.solid[y][x] && tileAt(x,y)!=='=' && Math.abs(x-S.x)+Math.abs(y-S.y)>5){ RT.beasts.push({kind:sp.kind, idx, x, y, fx:x, fy:y, area:sp.area, t:R()*2, stun:0}); break; }
      }
    }
  }
}
function blockedForWalk(x,y){ if(x<0||y<0||x>=RT.map.w||y>=RT.map.h) return true; return RT.solid[y][x]; }

/* ---------- pathfinding ---------- */
function bfs(sx,sy, goal){ // goal(x,y) → true when reached
  const m=RT.map, prev=new Map(), q=[[sx,sy]], k=(x,y)=>y*m.w+x; prev.set(k(sx,sy),null);
  while(q.length){ const [x,y]=q.shift(); if(goal(x,y)){ const path=[]; let c=k(x,y); while(c!=null && c!==k(sx,sy)){ path.unshift([c%m.w,(c/m.w)|0]); c=prev.get(c); } return path; }
    for(const [dx,dy] of [[0,1],[1,0],[0,-1],[-1,0]]){ const nx=x+dx, ny=y+dy; if(blockedForWalk(nx,ny)||prev.has(k(nx,ny))) continue; prev.set(k(nx,ny),k(x,y)); q.push([nx,ny]); } }
  return null;
}

/* ---------- interaction ---------- */
function entAt(x,y){ // something you can use wins over scenery on the same tile
  let any=null;
  for(const o of RT.ents){
    let hit=false;
    if(o.type==='building'){ hit=(x>=o.x&&x<o.x+o.w&&y>=o.y&&y<o.y+o.h)||(o.door&&o.door[0]===x&&o.door[1]===y&&!!o.act); }
    else hit=o.x===x&&o.y===y;
    if(!hit) continue; if(o.act||o.type==='npc'||o.type==='gather'||o.type==='sign'||o.type==='building') return o; any=any||o;
  }
  return any;
}
function setPath(path){ if(!path) return false; if(Math.hypot(RT.fx-S.x,RT.fy-S.y)>0.05) path.unshift([S.x,S.y]); RT.path=path; return true; }
function tapWorld(tx,ty){
  if(RT.paused) return; RT.autoNav=false;
  const o=entAt(tx,ty), isFarm=tileAt(tx,ty)==='F';
  if(isRod(S.sel) && tileAt(tx,ty)==='~'){ goAndDo((x,y)=>Math.abs(x-tx)+Math.abs(y-ty)===1, ()=>{ face(tx,ty); Mini.fish(tx,ty); }); return; }
  if(o && (o.act||o.type==='npc'||o.type==='gather'||o.type==='sign'||o.type==='building')){
    const reach=o.type==='building' ? (x,y)=>o.door&&x===o.door[0]&&y===o.door[1] : (x,y)=>Math.abs(x-tx)+Math.abs(y-ty)===1;
    goAndDo(reach, ()=>{ face(tx, o.type==='building'?y0(o):ty); interact(o); });
    return;
  }
  if(isFarm){ goAndDo((x,y)=>Math.max(Math.abs(x-tx),Math.abs(y-ty))<=1, ()=>{ face(tx,ty); farmAct(tx,ty); }); return; }
  const path=bfs(S.x,S.y,(x,y)=>x===tx&&y===ty); if(path){ setPath(path); RT.pending=null; }
}
function y0(o){ return o.y+o.h-1; }
function goAndDo(reach, fn){
  if(reach(S.x,S.y)){ RT.path=[]; fn(); return; }
  const path=bfs(S.x,S.y,reach); if(path){ setPath(path); RT.pending=fn; } else UI.toast('过不去');
}
function face(tx,ty){ const dx=tx-S.x, dy=ty-S.y; if(Math.abs(dx)>Math.abs(dy)) RT.dir=dx>0?'right':'left'; else if(dy) RT.dir=dy>0?'down':'up'; }
function facedTile(){ const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[RT.dir]; return [S.x+d[0], S.y+d[1]]; }
function interactFacing(){
  if(RT.prompt){ const p=RT.prompt; if(p.o){ face(p.x,p.y); return interact(p.o); } if(p.fish){ face(p.x,p.y); return Mini.fish(p.x,p.y); } }
  const [x,y]=facedTile(); const o=entAt(x,y);
  if(o){ interact(o); return; }
  if(isRod(S.sel) && tileAt(x,y)==='~'){ Mini.fish(x,y); return; }
  if(tileAt(x,y)==='F') farmAct(x,y); else if(tileAt(S.x,S.y)==='F') farmAct(S.x,S.y);
}
function interact(o){
  if(o.type==='npc') return Story.talk(o.id);
  if(o.type==='gather') return gather(o);
  if(o.type==='sign') return UI.say([['旁白', o.text]]);
  switch(o.act){
    case 'sleep': return UI.confirm('回洞府休息，结束今天？', ()=>sleep(false));
    case 'meditate': return meditate();
    case 'alchemy': return UI.alchemy();
    case 'shop': return UI.shop();
    case 'chest': if(!S.flags.chest){ S.flags.chest=true; addItem('huichun',2); S.stones+=20; Sound.coin(); return UI.say([['旁白','箱子里有云游子留下的两颗回春丹和二十块灵石。']]); }
      return UI.say([['旁白','空空的木箱。']]);
    case 'shrine': return Story.shrine();
    case 'mail': return Mail.open();
    case 'board': return Bounty.open();
    case 'altar': return Sect.altar();
    case 'puppet': return Life.puppetMenu();
    case 'qiyu': return Hooks.qiyu(o);
  }
  if(typeof Dungeon!=='undefined' && Dungeon.act(o)) return;
  if(o.type==='building' && o.label) UI.toast(o.label);
}
function useEnergy(n){ return true; } // energy was retired; kept so older calls still work

function farmAct(x,y){
  const k=farmKey(x,y), p=S.farm[k], sel=S.sel, item=ITEMS[sel];
  if(p&&p.crop&&p.stage>=3){ const c=CROPS[p.crop]; addItem(c.yield[0],c.yield[1]); S.st.harvested++; delete p.crop; p.stage=0; p.days=0; Sound.pick();
    UI.float(x,y,`+${c.yield[1]} ${ITEMS[c.yield[0]].name}`); Story.check(); return; }
  if(sel==='hoe'){ if(p&&p.tilled) return UI.toast('已经翻过土了'); if(!useEnergy(2)) return; S.farm[k]={tilled:1,water:0,stage:0,days:0}; Sound.dig(); return; }
  if(sel==='can'){ if(!p||!p.tilled) return UI.toast('先用锄头翻土'); if(p.water) return UI.toast('今天已经浇过水了'); if(!useEnergy(2)) return; p.water=1; S.st.watered++; Sound.water(); Story.check(); return; }
  if(item&&item.seed){ if(!p||!p.tilled) return UI.toast('先用锄头翻土'); if(p.crop) return UI.toast('这里已经种了'+CROPS[p.crop].name);
    if(!S.inv[sel]) return; addItem(sel,-1); p.crop=item.seed; p.stage=0; p.days=0; S.st.planted++; Sound.dig(); Story.check(); return; }
  if(p&&p.crop) return UI.toast(`${CROPS[p.crop].name}：还要 ${Math.max(1,CROPS[p.crop].days-p.days)} 天${p.water?'':'（今天还没浇水）'}`);
  UI.toast('选择锄头、水壶或种子来照料灵田');
}
function gather(o){
  if(!o.free && !useEnergy(1)) return;
  S.gathered[RT.mapId+':'+o.x+','+o.y]=S.day; RT.ents=RT.ents.filter(e=>e!==o); RT.solid[o.y][o.x]=false;
  const n=o.free?1:1+(Math.random()<.35?1:0); addItem(o.item,n); Sound.pick(); UI.float(o.x,o.y,`+${n} ${ITEMS[o.item].name}`);
  if(!ITEMS[o.item].quest){ S.st.gathered=(S.st.gathered||0)+1; const C=Life.col(), r=C.crops[o.item]=C.crops[o.item]||{n:0}; r.n++; Life.checkSets(); }
  Story.check();
}

/* ---------- cultivation ---------- */
function gainExp(n){
  S.exp+=n; let up=false;
  while(true){
    const need=expNeed(S.L);
    if(S.L===9){ S.exp=Math.min(S.exp,need); break; }
    if(S.L>=12){ S.exp=Math.min(S.exp,need); break; }
    if(S.exp<need) break;
    S.exp-=need; S.L++; up=true;
  }
  if(up){ const st=stats(); S.hp=st.hp; S.mp=st.mp; Sound.levelup(); UI.banner('突破！'+realmName(S.L)); }
  UI.hud(); Story.check();
}
function meditate(){ Med.open(); }  // the 闭关 panel lives in med.js
// the calendar turns over (bed, midnight or a long 闭关); the player stays where they are
function passDay(){
  S.day++;
  for(const k in S.killed) if(!k.startsWith(S.day+':')) delete S.killed[k];
  Hooks.newDay();
}
function sleep(passedOut){
  // going to bed before midnight sleeps through to the next morning; after midnight the day has already turned
  if(S.min>=DAY_START) passDay(); S.min=DAY_START; S.energy=maxEnergy(); const st=stats(); S.hp=st.hp; S.mp=st.mp;
  if(passedOut){ const lost=Math.floor(S.stones*0.1); S.stones-=lost; S.energy=Math.round(maxEnergy()*0.6); }
  for(const k in S.farm){ const p=S.farm[k]; if(p.crop&&p.water){ p.days++; const c=CROPS[p.crop]; p.stage=p.days>=c.days?3:Math.max(1,Math.min(2,Math.floor(p.days/c.days*3))); } p.water=0; }
  enterMap('home', 11, 5); RT.dir='down';
  save();
  UI.dayCard(passedOut);
}

/* ---------- main loop ---------- */
function update(dt){
  RT.t+=dt;
  if(RT.fadeTo){ RT.fade=Math.min(1,RT.fade+dt*4); if(RT.fade>=1){ const f=RT.fadeTo; RT.fadeTo=null; f(); } }
  else if(RT.fade>0) RT.fade=Math.max(0,RT.fade-dt*4);
  if(RT.paused) return;
  // clock
  S.min+=dt/MIN_SEC; if(Math.floor(S.min)%10===0){ UI.clock(); Music.play(areaTheme()); }
  { const st=stats(); if(S.hp<st.hp) S.hp=Math.min(st.hp, S.hp+dt/MIN_SEC*st.hp/240); } // wounds heal over ~4 game hours
  if(S.min>=24*60){ S.min-=24*60; passDay(); UI.toast(`子时已过，第 ${S.day} 天了`); }
  // movement: keys walk freely (diagonals, slide around corners); taps follow a path without stopping per tile
  const kv=keyVector(), want=false;
  RT.running = want && !RT.winded && RT.stamina>0;
  if(RT.running){ RT.stamina=Math.max(0,RT.stamina-26*dt); if(RT.stamina<=0){ RT.winded=true; UI.toast('跑不动了，歇一歇……'); } }
  else { RT.stamina=Math.min(100,RT.stamina+(kv||RT.path.length?16:30)*dt); if(RT.winded&&RT.stamina>=35) RT.winded=false; }
  const SPEED=6;
  if(kv){ RT.path=[]; RT.pending=null; RT.autoNav=false; moveFree(kv[0]*SPEED*dt, kv[1]*SPEED*dt); RT.moving=true; }
  else if(RT.path.length){ followPath(SPEED*dt); RT.moving=true; }
  else RT.moving=false;
  if(RT.moving){ RT.trail=RT.trail||[]; RT.trail.push([RT.fx,RT.fy]); if(RT.trail.length>40) RT.trail.shift(); }
  if(RT.paused) return;
  if(!RT.path.length && RT.pending && !kv){ const f=RT.pending; RT.pending=null; f(); }
  else if(!RT.path.length && RT.autoNav && !kv && !RT.fadeTo) Nav.arrive();
  Nav.tick(dt);
  updateBeasts(dt);
}
function keyVector(){
  if(RT.stick&&!RT.paused){ const [sx,sy]=RT.stick; RT.dir=Math.abs(sx)>Math.abs(sy)?(sx>0?'right':'left'):(sy>0?'down':'up'); return RT.stick; }
  if(!RT.keys.length||RT.paused) return null;
  let dx=0, dy=0; for(const k of RT.keys){ if(k==='left') dx--; if(k==='right') dx++; if(k==='up') dy--; if(k==='down') dy++; }
  if(!dx&&!dy) return null; const last=RT.keys[RT.keys.length-1];
  RT.dir = (last==='left'&&dx<0)||(last==='right'&&dx>0)||(last==='up'&&dy<0)||(last==='down'&&dy>0) ? last : (dx? (dx>0?'right':'left') : (dy>0?'down':'up'));
  const n=Math.hypot(dx,dy); return [dx/n, dy/n];
}
function hitsAt(x,y){ // feet hitbox inside the player's tile
  const l=x+0.22, r=x+0.78, top=y+0.5, bot=y+0.96;
  for(const [cx,cy] of [[l,top],[r,top],[l,bot],[r,bot]]) if(blockedForWalk(Math.floor(cx),Math.floor(cy))) return true;
  return false;
}
function moveFree(dx,dy){
  if(dx){ if(!hitsAt(RT.fx+dx,RT.fy)) RT.fx+=dx; else if(!dy){ const c=Math.round(RT.fy), d=c-RT.fy; if(Math.abs(d)<0.5&&Math.abs(d)>0.01&&!hitsAt(RT.fx+dx,c)) RT.fy+=Math.sign(d)*Math.min(Math.abs(d),Math.abs(dx)); } }
  if(dy){ if(!hitsAt(RT.fx,RT.fy+dy)) RT.fy+=dy; else if(!dx){ const c=Math.round(RT.fx), d=c-RT.fx; if(Math.abs(d)<0.5&&Math.abs(d)>0.01&&!hitsAt(c,RT.fy+dy)) RT.fx+=Math.sign(d)*Math.min(Math.abs(d),Math.abs(dy)); } }
  RT.walk+=Math.hypot(dx,dy); onTile();
}
function followPath(dist){
  while(dist>0 && RT.path.length && !RT.paused){
    const [tx,ty]=RT.path[0]; if(blockedForWalk(tx,ty)){ RT.path=[]; RT.pending=null; break; }
    const dx=tx-RT.fx, dy=ty-RT.fy, d=Math.hypot(dx,dy);
    if(Math.abs(dx)>0.01||Math.abs(dy)>0.01){ if(Math.abs(dx)>Math.abs(dy)) RT.dir=dx>0?'right':'left'; else RT.dir=dy>0?'down':'up'; }
    if(d<=dist){ RT.fx=tx; RT.fy=ty; dist-=d; RT.walk+=d; RT.path.shift(); onTile(); }
    else { RT.fx+=dx/d*dist; RT.fy+=dy/d*dist; RT.walk+=dist; dist=0; onTile(); }
  }
}
function onTile(){
  const nx=Math.floor(RT.fx+0.5), ny=Math.floor(RT.fy+0.75), k=RT.mapId+nx+','+ny;
  if(k===RT.tileKey) return; RT.tileKey=k; S.x=nx; S.y=ny;
  const ex=RT.map.exits.find(e=>e.x===S.x&&e.y===S.y);
  if(ex){ RT.path=[]; RT.pending=null; RT.keys=[]; RT.paused=true; RT.fadeTo=()=>{ enterMap(ex.to,ex.tx,ex.ty); RT.paused=false; UI.sync(); save(); Story.check(); if(RT.autoNav) Nav.go(true); }; Sound.step(); }
}
function updateBeasts(dt){
  for(const b of RT.beasts){
    b.stun=Math.max(0,b.stun-dt); b.t-=dt;
    if(b.t<=0 && b.stun<=0){
      const near=Math.abs(b.x-S.x)+Math.abs(b.y-S.y)<=4;
      let opts=[[0,1],[1,0],[0,-1],[-1,0]];
      if(near) opts.sort((a,c)=>(Math.abs(b.x+a[0]-S.x)+Math.abs(b.y+a[1]-S.y))-(Math.abs(b.x+c[0]-S.x)+Math.abs(b.y+c[1]-S.y)));
      else opts.sort(()=>Math.random()-.5);
      for(const [dx,dy] of opts){ const nx=b.x+dx, ny=b.y+dy;
        if(nx<b.area[0]-2||ny<b.area[1]-2||nx>b.area[2]+2||ny>b.area[3]+2) continue;
        if(blockedForWalk(nx,ny)||RT.beasts.some(o=>o!==b&&o.x===nx&&o.y===ny)) continue;
        b.x=nx; b.y=ny; break; }
      b.t=near?0.45:0.8+Math.random()*1.4;
    }
    const sp=(Math.abs(b.x-S.x)+Math.abs(b.y-S.y)<=4?4:2.2)*dt, dx=b.x-b.fx, dy=b.y-b.fy, d=Math.hypot(dx,dy);
    if(d<=sp){ b.fx=b.x; b.fy=b.y; } else { b.fx+=dx/d*sp; b.fy+=dy/d*sp; }
    if(b.stun<=0 && Math.hypot(b.fx-RT.fx,b.fy-RT.fy)<0.7){ startWildBattle(b); return; }
  }
}
function startWildBattle(b){
  RT.path=[]; RT.pending=null; RT.keys=[]; RT.autoNav=false; if(typeof Stick!=='undefined') Stick.end();
  Battle.start(b.kind, result=>{
    if(result==='win'){ Sect.tame(b.kind); const key=S.day+':'+RT.mapId; (S.killed[key]=S.killed[key]||[]).push({i:b.idx, t:S.day*1440+S.min}); RT.beasts=RT.beasts.filter(o=>o!==b); S.st.kills++; S.st.kb=S.st.kb||{}; S.st.kb[b.kind]=(S.st.kb[b.kind]||0)+1; Story.check(); }
    else if(result==='flee'){ b.stun=3; }
    else if(result==='lose'){ UI.say([['旁白', typeof Dungeon!=='undefined'&&Dungeon.inside()?'你眼前一黑……再睁眼时，已被狂风卷回了这一层的入口。':'你眼前一黑……醒来时已躺在洞府里。']], ()=>sleep(true)); }
  });
}

/* ---------- rendering ---------- */
const cv=document.getElementById('cv'), ctx=cv.getContext('2d');
function resize(){
  RT.dpr=Math.min(3,window.devicePixelRatio||1);
  const w=innerWidth, h=innerHeight; cv.width=Math.round(w*RT.dpr); cv.height=Math.round(h*RT.dpr);
  cv.style.width=w+'px'; cv.style.height=h+'px';
  RT.scale=Math.max(2, Math.min(5, Math.floor(Math.min(w,h)/(TILE*11))));
}
addEventListener('resize',resize);
function render(){
  const g=ctx, Z=RT.scale*RT.dpr, m=RT.map; g.imageSmoothingEnabled=false;
  g.fillStyle='#1b2a1c'; g.fillRect(0,0,cv.width,cv.height);
  if(!m) return;
  const vw=cv.width/Z, vh=cv.height/Z;
  // camera
  let cx=RT.fx*TILE+8-vw/2, cy=RT.fy*TILE+8-vh/2;
  RT.padT=(RT.padT||0)+((RT.padTgo||0)-(RT.padT||0))*.15; RT.padB=(RT.padB||0)+((RT.padBgo||0)-(RT.padB||0))*.15;
  const pt=RT.padT/RT.scale, pb=(RT.padB||0)/RT.scale;
  cx = m.w*TILE<=vw ? (m.w*TILE-vw)/2 : Math.max(0,Math.min(m.w*TILE-vw,cx));
  cy = m.h*TILE+pt+pb<=vh ? (m.h*TILE-(vh-pt-pb))/2-pt : Math.max(-pt,Math.min(m.h*TILE-vh+pb,cy));
  RT.cam.x=cx; RT.cam.y=cy;
  const ox=Math.round(-cx*Z), oy=Math.round(-cy*Z), T=TILE*Z;
  const x0=Math.max(0,Math.floor(cx/TILE)), y0=Math.max(0,Math.floor(cy/TILE)), x1=Math.min(m.w-1,Math.ceil((cx+vw)/TILE)), y1=Math.min(m.h-1,Math.ceil((cy+vh)/TILE));
  drawGround(g, ox, oy, T, Z);
  Life.drawGround(g, ox, oy, T, Z);
  // y-sorted drawables
  const list=[];
  for(const o of m.objects===undefined?[]:RT.ents){
    if(o.type==='building') list.push({y:o.y+o.h, draw:()=>{ const c=building(o); g.fillStyle='rgba(20,40,20,.25)'; g.beginPath(); g.ellipse(ox+(o.x+o.w/2)*T, oy+(o.y+o.h)*T-Z, o.w*T*.52, 3*Z, 0, 0, 7); g.fill(); g.drawImage(c, ox+o.x*T, oy+(o.y+o.h)*T-c.height*Z, c.width*Z, c.height*Z); }});
    else if(o.look){ list.push({y:o.y+0.99, draw:()=>{ if(o.ghost){ g.save(); g.globalAlpha=.5+.12*Math.sin(RT.t*2+o.x); } drawObjShadow(g, {type:'npc',x:o.x,y:o.y}, ox, oy, T, Z); const c=lookSprite(o.look,'down',Math.floor(RT.t*1.5+o.x)%2?0:2); const w=c.width*Z,h=c.height*Z; g.drawImage(c, Math.round(ox+o.x*T+(T-w)/2), Math.round(oy+o.y*T+T-c.bottom*Z), w, h);  if(o.ghost) g.restore();}}); }
    else { const key=objSprite(o); if(!SPR[key]) continue;
      list.push({y:o.y+0.99, draw:()=>(drawObjShadow(g, o, ox, oy, T, Z), drawSprite(key, ox+o.x*T, oy+o.y*T, Z, o.type==='npc'?Math.sin(RT.t*2+o.x)*0.4:0))}); }
  }
  for(const k in S.farm){ if(!k.startsWith(RT.mapId+':')) continue; const p=S.farm[k]; if(!p.crop) continue;
    const [x,y]=k.split(':')[1].split(',').map(Number); const key=CROPS[p.crop].stages[p.stage];
    list.push({y:y+0.5, draw:()=>{ drawSprite(key, ox+x*T, oy+y*T, Z, 0); if(p.stage>=3){ g.fillStyle='rgba(255,240,150,'+(0.35+0.25*Math.sin(RT.t*4))+')'; g.fillRect(ox+x*T+7*Z, oy+y*T-2*Z, 2*Z, 2*Z); } }}); }
  for(const b of RT.beasts){ list.push({y:b.fy+0.99, draw:()=>{ drawShadow(ox+b.fx*T, oy+b.fy*T, Z); drawSprite(BEASTS[b.kind].spr, ox+b.fx*T, oy+b.fy*T, Z, Math.abs(Math.sin(RT.t*6+b.idx))*-1, b.fx>b.x); }}); }
  list.push({y:RT.fy+0.99, draw:()=>drawPlayer(ox+RT.fx*T, oy+RT.fy*T, Z)});
  if(S.pet){ const tr=RT.trail||[], p=tr.length>16?tr[tr.length-16]:[RT.fx-.9,RT.fy+.1];
    list.push({y:p[1]+0.98, draw:()=>{ drawShadow(ox+p[0]*T, oy+p[1]*T, Z); drawSprite(BEASTS[S.pet.kind].spr, ox+p[0]*T, oy+p[1]*T, Z, RT.moving?-Math.abs(Math.sin(RT.t*9))*1.5:0, p[0]>RT.fx); }}); }
  list.sort((a,b)=>a.y-b.y).forEach(d=>d.draw());
  Nav.drawWorld(g, ox, oy, T, Z);
  drawPrompt(g, ox, oy, T, Z); Mail.drawFlag(g, ox, oy, T, Z);
  // path marker
  if(RT.path.length){ const [tx,ty]=RT.path[RT.path.length-1]; g.strokeStyle='rgba(255,255,255,.7)'; g.lineWidth=Z; g.strokeRect(ox+tx*T+2*Z, oy+ty*T+2*Z, T-4*Z, T-4*Z); }
  drawNight(g, ox, oy, T, Z);
  drawAtmosphere(g, Z);
  if(RT.stamina<100){ const px=ox+(RT.fx+.95)*T, py=oy+(RT.fy-.15)*T, r=3.2*Z;
    g.lineWidth=1.6*Z; g.strokeStyle='rgba(40,25,10,.6)'; g.beginPath(); g.arc(px,py,r,0,7); g.stroke();
    g.strokeStyle=RT.winded?((Math.floor(RT.t*6)%2)?'#e0402e':'#ff9a7a'):RT.stamina>40?'#7be05a':'#f2c14e'; g.beginPath(); g.arc(px,py,r,-Math.PI/2,-Math.PI/2+Math.PI*2*RT.stamina/100); g.stroke(); }
  Nav.drawArrow(g, ox, oy, T, Z);
  if(RT.fade>0){ g.fillStyle=`rgba(10,8,6,${RT.fade})`; g.fillRect(0,0,cv.width,cv.height); }
}
function drawShadow(x,y,Z){ ctx.fillStyle='rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(x+8*Z, y+15*Z, 6*Z, 2*Z, 0, 0, 7); ctx.fill(); }
function drawSprite(key, x, y, Z, bob, flip){
  const c=sprite(key); const w=c.width*Z, h=c.height*Z;
  const dx=Math.round(x+(TILE*Z-w)/2), dy=Math.round(y+TILE*Z-c.bottom*Z+(bob||0)*Z);
  if(flip){ ctx.save(); ctx.translate(dx+w,dy); ctx.scale(-1,1); ctx.drawImage(c,0,0,w,h); ctx.restore(); }
  else ctx.drawImage(c,dx,dy,w,h);
}
function drawPlayer(x,y,Z){
  drawShadow(x,y,Z);
  const d=RT.dir==='up'?'up':RT.dir==='down'?'down':'side', f=RT.moving?Math.floor(RT.walk*3.2)%4:0;
  const c=lookSprite(S.look,d,f), w=c.width*Z, h=c.height*Z, bob=(f===1||f===3)?-Z:0;
  const dx=Math.round(x+(TILE*Z-w)/2), dy=Math.round(y+TILE*Z-c.bottom*Z+bob);
  if(RT.dir==='left'){ ctx.save(); ctx.translate(dx+w,dy); ctx.scale(-1,1); ctx.drawImage(c,0,0,w,h); ctx.restore(); } else ctx.drawImage(c,dx,dy,w,h);
  if(isRod(S.sel) && S.inv[S.sel]) drawRod(dx, dy, w, Z);
}
// the fishing rod in hand; while fishing it reaches out over the water with a line and a bobber
function drawRod(dx, dy, w, Z){
  const g=ctx, F=RT.fishing, T=TILE*Z;
  let hx, hy, tx, ty;
  if(RT.dir==='left'){ hx=dx+3*Z; hy=dy+14*Z; tx=hx-9*Z; ty=hy-12*Z; }
  else if(RT.dir==='right'){ hx=dx+w-3*Z; hy=dy+14*Z; tx=hx+9*Z; ty=hy-12*Z; }
  else if(RT.dir==='up'){ hx=dx+w-4*Z; hy=dy+13*Z; tx=hx+3*Z; ty=hy-15*Z; }
  else { hx=dx+w-3*Z; hy=dy+15*Z; tx=hx+5*Z; ty=hy-13*Z; }
  if(F){ const bx=Math.round(-RT.cam.x*RT.scale*RT.dpr+(F.x+.5)*T), by=Math.round(-RT.cam.y*RT.scale*RT.dpr+(F.y+.5)*T)+(F.bite?Math.sin(RT.t*30)*2*Z:Math.sin(RT.t*3)*Z);
    tx=hx+(bx-hx)*.45; ty=Math.min(hy,by)-10*Z;
    g.strokeStyle='rgba(240,240,240,.85)'; g.lineWidth=Math.max(1,Z*.5); g.beginPath(); g.moveTo(tx,ty); g.quadraticCurveTo((tx+bx)/2,(ty+by)/2+8*Z,bx,by); g.stroke();
    g.fillStyle='#d84a4a'; g.fillRect(bx-1.5*Z,by-3*Z,3*Z,2*Z); g.fillStyle='#fff'; g.fillRect(bx-1.5*Z,by-Z,3*Z,1.5*Z);
    if(F.bite){ g.strokeStyle='rgba(255,255,255,.6)'; g.lineWidth=Z*.6; g.beginPath(); g.ellipse(bx,by,5*Z+Math.sin(RT.t*20)*Z,2*Z,0,0,7); g.stroke(); } }
  g.strokeStyle='#6a4022'; g.lineWidth=Math.max(1.5,Z*.9); g.lineCap='round'; g.beginPath(); g.moveTo(hx,hy); g.lineTo(tx,ty); g.stroke();
  g.strokeStyle='#a8743f'; g.lineWidth=Math.max(1,Z*.45); g.beginPath(); g.moveTo(hx,hy); g.lineTo(hx+(tx-hx)*.4,hy+(ty-hy)*.4); g.stroke();
}
// "E" (or "点") above whatever you can interact with right now
const FINE_POINTER=matchMedia('(pointer:fine)').matches;
function findPrompt(){
  if(RT.paused||RT.moving) return null; const near=[];
  for(const o of RT.ents){
    if(o.type==='building'){ if(o.act&&o.door&&Math.abs(o.door[0]-S.x)+Math.abs(o.door[1]-S.y)===0) near.push({o,x:o.door[0],y:o.door[1]-1,d:0}); continue; }
    if(!(o.type==='npc'||o.type==='gather'||o.act||o.type==='sign')) continue;
    const d=Math.max(Math.abs(o.x-S.x),Math.abs(o.y-S.y)); if(d<=1) near.push({o,x:o.x,y:o.y,d:Math.abs(o.x-S.x)+Math.abs(o.y-S.y)});
  }
  const [fx,fy]=facedTile(); near.sort((a,b)=>((a.x===fx&&a.y===fy)?-1:0)-((b.x===fx&&b.y===fy)?-1:0)||a.d-b.d);
  if(near.length) return near[0];
  if(isRod(S.sel)&&S.inv[S.sel]){ for(const [dx,dy] of [[fx-S.x,fy-S.y],[0,1],[1,0],[0,-1],[-1,0]]){ const x=S.x+dx,y=S.y+dy; if(tileAt(x,y)==='~') return {fish:true,x,y}; } }
  return null;
}
function drawPrompt(g, ox, oy, T, Z){
  RT.prompt=findPrompt(); const p=RT.prompt; if(!p) return;
  const cx=ox+(p.x+.5)*T, cy=oy+p.y*T-(p.o&&p.o.type==='npc'?18:10)*Z+Math.sin(RT.t*4)*Z, r=6*Z;
  g.fillStyle='rgba(42,30,26,.85)'; g.beginPath(); g.roundRect?g.roundRect(cx-r,cy-r,r*2,r*2,2*Z):g.rect(cx-r,cy-r,r*2,r*2); g.fill();
  g.strokeStyle='#f2c14e'; g.lineWidth=Z*.8; g.stroke();
  g.fillStyle='#fff3dc'; g.font=`bold ${Math.round(8*Z)}px system-ui,-apple-system,"PingFang SC",Arial,sans-serif`; g.textAlign='center'; g.textBaseline='middle';
  g.fillText(FINE_POINTER?'E':(p.fish?'钓':p.o&&p.o.type==='npc'?'聊':p.o&&p.o.type==='gather'?'采':'点'), cx, cy+Z*.5);
}
const NIGHT=document.createElement('canvas');
function drawNight(g, ox, oy, T, Z){
  const h=S.min/60; let a=0;
  if(h>=17.5) a=Math.min(0.55,(h-17.5)/3.5*0.55); if(h<5) a=0.55; else if(h<7) a=(7-h)/2*0.55;
  if(a<=0.01) return;
  NIGHT.width=cv.width; NIGHT.height=cv.height; const n=NIGHT.getContext('2d');
  n.fillStyle=`rgba(18,24,60,${a})`; n.fillRect(0,0,NIGHT.width,NIGHT.height);
  n.globalCompositeOperation='destination-out';
  const lights=RT.ents.filter(o=>o.type==='lantern'||o.type==='furnace'||o.type==='shrine'||o.type==='building');
  for(const o of lights){ const lx=ox+(o.x+(o.w||1)/2)*T, ly=oy+(o.y+(o.h||1)/2)*T, r=(o.type==='building'?4:2.6)*T;
    const gr=n.createRadialGradient(lx,ly,0,lx,ly,r); gr.addColorStop(0,'rgba(0,0,0,.9)'); gr.addColorStop(1,'rgba(0,0,0,0)'); n.fillStyle=gr; n.fillRect(lx-r,ly-r,r*2,r*2); }
  const px=ox+(RT.fx+.5)*T, py=oy+(RT.fy+.5)*T, pr=2.2*T, gp=n.createRadialGradient(px,py,0,px,py,pr); gp.addColorStop(0,'rgba(0,0,0,.6)'); gp.addColorStop(1,'rgba(0,0,0,0)'); n.fillStyle=gp; n.fillRect(px-pr,py-pr,pr*2,pr*2);
  n.globalCompositeOperation='source-over';
  g.drawImage(NIGHT,0,0);
  g.globalCompositeOperation='lighter';
  for(const o of lights){ if(o.type!=='lantern') continue; const lx=ox+(o.x+.5)*T, ly=oy+(o.y+.3)*T, r=1.4*T, gr=g.createRadialGradient(lx,ly,0,lx,ly,r); gr.addColorStop(0,`rgba(255,170,60,${a*0.5})`); gr.addColorStop(1,'rgba(255,170,60,0)'); g.fillStyle=gr; g.fillRect(lx-r,ly-r,r*2,r*2); }
  g.globalCompositeOperation='source-over';
}

/* ---------- input ---------- */
const tapAt=(px,py)=>{ const Z=RT.scale, x=px/Z+RT.cam.x, y=py/Z+RT.cam.y; tapWorld(Math.floor(x/TILE), Math.floor(y/TILE)); };
const Stick={ el:null, id:null, x:0, y:0, t:0, on:false,
  show(){ if(!Stick.el){ Stick.el=document.createElement('div'); Stick.el.id='stick'; Stick.el.innerHTML='<i></i>'; document.body.appendChild(Stick.el); }
    Stick.el.style.left=Stick.x+'px'; Stick.el.style.top=Stick.y+'px'; Stick.el.classList.add('on'); },
  knob(dx,dy){ Stick.el.firstChild.style.transform=`translate(${dx}px,${dy}px)`; },
  end(){ Stick.id=null; Stick.on=false; RT.stick=null; if(Stick.el) Stick.el.classList.remove('on'); } };
cv.addEventListener('pointerdown', e=>{
  Sound.unlock();
  // while someone is talking, a tap anywhere turns the page (choices still need their own buttons)
  const dlg=document.getElementById('dlg'); if(dlg&&!dlg.hidden&&!dlg.querySelector('.choices')){ dlg.click(); return; }
  if(RT.paused||!RT.map) return;
  if(e.pointerType==='mouse') return tapAt(e.clientX,e.clientY);
  if(Stick.id!==null) return; Stick.id=e.pointerId; Stick.x=e.clientX; Stick.y=e.clientY; Stick.t=performance.now(); Stick.on=false;
  try{ cv.setPointerCapture(e.pointerId); }catch(_){}
  // holding still for a moment also brings up the stick
  setTimeout(()=>{ if(Stick.id===e.pointerId&&!Stick.on&&!RT.paused){ Stick.on=true; RT.path=[]; RT.pending=null; RT.autoNav=false; Stick.show(); Stick.knob(0,0); } },260);
});
cv.addEventListener('pointermove', e=>{
  if(e.pointerId!==Stick.id) return; let dx=e.clientX-Stick.x, dy=e.clientY-Stick.y, d=Math.hypot(dx,dy);
  if(!Stick.on&&d>6){ Stick.on=true; RT.path=[]; RT.pending=null; RT.autoNav=false; Stick.show(); }
  if(!Stick.on) return; const R=44;
  // the ring follows a finger that runs past its edge, so turning back is instant
  if(d>R){ Stick.x+=dx/d*(d-R); Stick.y+=dy/d*(d-R); dx=e.clientX-Stick.x; dy=e.clientY-Stick.y; d=R; Stick.el.style.left=Stick.x+'px'; Stick.el.style.top=Stick.y+'px'; }
  Stick.knob(dx,dy);
  if(d<5){ RT.stick=null; return; }
  // eight directions (doorways and gaps between trees are easier to hit); full speed from a short drag
  const a=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*(Math.PI/4), sp=Math.min(1,.6+d/26*.4);
  RT.stick=[Math.round(Math.cos(a)*1e3)/1e3*sp, Math.round(Math.sin(a)*1e3)/1e3*sp];
});
const stickUp=e=>{ if(e.pointerId!==Stick.id) return; const tap=!Stick.on&&performance.now()-Stick.t<400; Stick.end(); if(tap&&!RT.paused) tapAt(e.clientX,e.clientY); };
cv.addEventListener('pointerup', stickUp); cv.addEventListener('pointercancel', e=>{ if(e.pointerId===Stick.id) Stick.end(); });
// keep the map's top and bottom rows clear of the HUD (measured twice a second; eased so unfolding the task list doesn't jerk the view)
setInterval(()=>{ const h=innerHeight; let t=0, b=h;
  for(const s of ['.hud-tl','.hud-tr']){ const el=$(s); if(el&&el.offsetParent!==null){ const r=el.getBoundingClientRect(); if(r.height) t=Math.max(t,r.bottom); } }
  for(const s of ['.vitals','#hotbar','#menuB']){ const el=$(s); if(el&&el.offsetParent!==null){ const r=el.getBoundingClientRect(); if(r.height) b=Math.min(b,r.top); } }
  RT.padTgo=Math.min(t+4,h*.4); RT.padBgo=Math.min(h-b+4,h*.3); },500);
const KEYDIR={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
addEventListener('keydown', e=>{
  Sound.unlock();
  if(UI.onKey(e)) return;
  if(RT.paused) return;
  if(KEYDIR[e.code]){ const d=KEYDIR[e.code]; RT.keys=RT.keys.filter(k=>k!==d); RT.keys.push(d); e.preventDefault(); }
  else if(e.code==='KeyM'){ e.preventDefault(); UI.worldMap(); }
  else if(e.code==='KeyQ'||e.code==='KeyJ'){ e.preventDefault(); UI.tasks(); }
  else if(e.code==='KeyE'||e.code==='Space'||e.code==='Enter'){ e.preventDefault(); interactFacing(); }
  else if(/^Digit[1-8]$/.test(e.code)){ UI.pickSlot(+e.code.slice(5)-1); }
  else if(e.code==='Escape'||e.code==='Tab'||e.code==='KeyI'){ e.preventDefault(); UI.menu(); }
});
addEventListener('keyup', e=>{ if(e.key==='Shift') RT.runHeld=false; const d=KEYDIR[e.code]; if(d) RT.keys=RT.keys.filter(k=>k!==d); });
addEventListener('blur', ()=>{ RT.keys=[]; RT.runHeld=false; });
let wheelAcc=0;
addEventListener('wheel', e=>{
  if(!S||RT.paused||!$('#panel').hidden) return; e.preventDefault();
  wheelAcc+=e.deltaY; if(Math.abs(wheelAcc)<40) return; const dir=Math.sign(wheelAcc); wheelAcc=0;
  const ids=UI.hotbarItems(); let i=ids.indexOf(S.sel); i=(i+dir+ids.length)%ids.length; S.sel=ids[i]; UI.hotbar(); Sound.tick();
}, {passive:false});

let last=performance.now();
function frame(now){ const dt=Math.min(0.05,(now-last)/1000); last=now; update(dt); render(); requestAnimationFrame(frame); }
