/* ============================================================
   山海问道 · the player's look: layered pixel templates + character creator + profiles
   Body letters: S skin  s skin shade  E eye  e eye shine  L lash (girls)  M blush  m mouth
                 W inner collar  C cloth  c cloth shade  A sash  P lower garment  p its shade  F shoes
   Hair letters: H hair  h hair highlight  Y gold pin  R red ribbon
   ============================================================ */
const LOOK = {
  skins:['#fbe0c8','#f2c29a','#e5ab80','#c98a5e','#a46a43','#7a4a2c'],
  hairs:['#2b2533','#4a3426','#8a5236','#d8d4dc','#b2452f','#33427a'],
  cloths:['#4a6fa5','#f1ece2','#c8413b','#3f8f6a','#8b5bc5','#33303f','#eaa0bb','#e0aa3e'],
  styles:[{id:'robe',name:'道袍'},{id:'jin',name:'劲装'},{id:'qun',name:'襦裙'}],
  hairstyles:[{id:'topknot',name:'道髻'},{id:'short',name:'短发'},{id:'pony',name:'马尾'},{id:'buns',name:'双丫髻'},{id:'long',name:'长发'},{id:'bob',name:'齐耳'}],
};
const NAMES_M=['云起','玄舟','青岚','墨白','长风','子瑜','清远','凌霄'], NAMES_F=['若雪','听荷','小满','青禾','念安','灵犀','月见','初晴'];
function defaultLook(g){ return g==='f' ? {g:'f',skin:1,hair:4,hairColor:0,style:'qun',cloth:6} : {g:'m',skin:1,hair:0,hairColor:0,style:'robe',cloth:0}; }
function randomLook(g){ const r=n=>Math.floor(Math.random()*n); g=g||(Math.random()<.5?'m':'f');
  return {g, skin:r(LOOK.skins.length), hair:r(LOOK.hairstyles.length), hairColor:r(LOOK.hairs.length), style:LOOK.styles[r(3)].id, cloth:r(LOOK.cloths.length)}; }

const BODY = {
 down:[
'................',
'................',
'.....SSSSSS.....',
'....SSSSSSSS....',
'...SSSSSSSSSS...',
'...SSSSSSSSSS...',
'...SSSSSSSSSS...',
'...SLEESSEELS...',
'...SSEeSSeESS...',
'...sMSSSSSSMs...',
'....sSSmmSSs....',
'.....ssssss.....',
'....WWCCCCWW....',
'...CCWWCCWWCC...',
'..SCCCCWWCCCCS..',
'..SCCAAAAAACCS..',
'...PPPPPPPPPP...',
'...PPPPPPPPPP...',
'...pPPPPPPPPp...',
'....FF....FF....'],
 up:[
'................',
'................',
'.....SSSSSS.....',
'....SSSSSSSS....',
'...SSSSSSSSSS...',
'...SSSSSSSSSS...',
'...SSSSSSSSSS...',
'...SSSSSSSSSS...',
'...SSSSSSSSSS...',
'...sSSSSSSSSs...',
'....sSSSSSSs....',
'.....ssssss.....',
'....CCCCCCCC....',
'...CCCCCCCCCC...',
'..SCCCCCCCCCCS..',
'..SCCAAAAAACCS..',
'...PPPPPPPPPP...',
'...PPPPPPPPPP...',
'...pPPPPPPPPp...',
'....FF....FF....'],
 side:[
'................',
'................',
'.....SSSSS......',
'....SSSSSSS.....',
'...SSSSSSSSS....',
'...SSSSSSSSS....',
'...SSSSSSSSSS...',
'...SSSSSSSLEE...',
'...SSSSSSSSeE...',
'...SSSSSSSSMS...',
'....SSSSSSmS....',
'.....ssssss.....',
'.....WCCCCW.....',
'....CCWCCCC.....',
'....CCCCCSC.....',
'....CAAAAAA.....',
'....PPPPPPP.....',
'....PPPPPPP.....',
'....pPPPPPp.....',
'.....FF..FF.....'],
};
const FEET = { down:['....FF....FF....','...FF......FF...','....FF....FF....','.....FF..FF.....'],
               up:  ['....FF....FF....','...FF......FF...','....FF....FF....','.....FF..FF.....'],
               side:['.....FF..FF.....','....FF....FF....','.....FF..FF.....','......FFFF......'] };
// hair: shared cap per direction + per-style extras (rows from the top; '.' keeps what is under it)
const HAIR_CAP = {
 down:{ topknot:[
'.......YY.......',
'......HHHH......',
'.....HHHHHH.....',
'....HHHHHHHH....',
'...HHHHHHHHHH...',
'...HHhHHHHhHH...',
'...HH......HH...',
'...H........H...'],
  short:[
'................',
'....H.HHHH.H....',
'...HHHHHHHHHH...',
'..HHHHHHHHHHHH..',
'..HHHHHHHHHHHH..',
'..HHHhHHhHHhHH..',
'..HH.H.HH.H.HH..',
'..H..........H..',
'..H..........H..'],
  pony:[
'......HHHH......',
'.....HHRRHH.....',
'....HHHHHHHH....',
'...HHHHHHHHHH...',
'...HHHHHHHHHH...',
'...HhHHHHHHhH...',
'...HH.HHHH.HH...',
'...H........H...'],
  buns:[
'..HHH......HHH..',
'.HHhHH....HHhHH.',
'.HHRHHHHHHHHRHH.',
'..HHHHHHHHHHHH..',
'...HHHHHHHHHH...',
'...HHhHHHHhHH...',
'...HH.H..H.HH...',
'...H........H...'],
  long:[
'................',
'.....HHHHHH.....',
'....HHHHHHHH....',
'...HHHHHHHHHH...',
'..HHHHHHHHHHHH..',
'..HHHhHHHHhHHH..',
'..HHHHHHHHHHHH..',
'..HH........HH..',
'..HH........HH..',
'..HH........HH..',
'..HH........HH..',
'..HHh......hHH..',
'..HHh......hHH..',
'..HH........HH..',
'..hH........Hh..',
'...h........h...'],
  bob:[
'................',
'.....HHHHHH.....',
'....HHHHHHHH....',
'...HHHHHHHHHH...',
'..HHHHHHHHHHHH..',
'..HHHHHHHHHHHH..',
'..HHhHHHHHHhHH..',
'..HH........HH..',
'..HH........HH..',
'..HHH......HHH..',
'..hh........hh..'] },
 up:{ base:[
'................',
'.....HHHHHH.....',
'....HHHHHHHH....',
'...HHHHHHHHHH...',
'...HHHHHHHHHH...',
'...HHHHHHHHHH...',
'...HHHHHHHHHH...',
'...HHHHHHHHHH...',
'...HHHHHHHHHH...',
'...HHHHHHHHHH...',
'....HHHHHHHH....'],
  topknot:{0:'.......YY.......',1:'......HHHH......'},
  short:{1:'....H.HHHH.H....',2:'...HHHHHHHHHH...'},
  pony:{0:'......HHHH......',1:'.....HHRRHH.....',10:'....HHHHHHHH....',11:'......HHHH......',12:'......HHHH......',13:'.......HH.......'},
  buns:{0:'..HHH......HHH..',1:'.HHHHH....HHHHH.',2:'.HHRHHHHHHHHRHH.'},
  long:{3:'..HHHHHHHHHHHH..',4:'..HHHHHHHHHHHH..',10:'..HHHHHHHHHHHH..',11:'..HHHHHHHHHHHH..',12:'..HHHHHHHHHHHH..',13:'..HHHHHHHHHHHH..',14:'...HHHHHHHHHH...',15:'....HHHHHHHH....'},
  bob:{4:'..HHHHHHHHHHHH..',5:'..HHHHHHHHHHHH..',9:'..HHHHHHHHHHHH..',10:'..hHHHHHHHHHHh..'} },
 side:{ base:[
'................',
'.....HHHHH......',
'....HHHHHHH.....',
'...HHHHHHHHH....',
'...HHHHHHHHHH...',
'...HHHHhHHHHH...',
'...HHHHHHH......',
'...HHHHH........',
'...HHHH.........',
'...HHH..........',
'....HH..........'],
  topknot:{0:'......YY........',1:'.....HHHH.......'},
  short:{1:'....H.HHHH......',2:'...HHHHHHHH.....',6:'..HHHHHHHHH.....'},
  pony:{0:'.....HHHH.......',1:'...RRHHHHH......',2:'.HHHHHHHHHH.....',3:'HHHHHHHHHHHH....',4:'HH.HHHHHHHHHH...',5:'H..HHHHhHHHHH...',6:'H..HHHHHHH......',7:'...HHHHH........'},
  buns:{0:'..HHH...........',1:'.HHhHHHHH.......',2:'.HHRHHHHHH......'},
  long:{11:'...HHH..........',12:'...HHH..........',13:'...HHh..........',14:'...HHh..........',15:'....h...........'},
  bob:{9:'...HHHH.........',10:'...hHHH.........'} },
};

function shade(hex, f){ const n=parseInt(hex.slice(1),16); let r=n>>16, g=n>>8&255, b=n&255;
  const t=f<0?0:255, k=Math.abs(f); r=Math.round(r+(t-r)*k); g=Math.round(g+(t-g)*k); b=Math.round(b+(t-b)*k);
  return '#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1); }
function mix(a,b,t){ const A=parseInt(a.slice(1),16), B=parseInt(b.slice(1),16); const c=i=>Math.round(((A>>i)&255)*(1-t)+((B>>i)&255)*t);
  return '#'+((1<<24)|(c(16)<<16)|(c(8)<<8)|c(0)).toString(16).slice(1); }
function lookPalette(look){
  const skin=LOOK.skins[look.skin], hair=LOOK.hairs[look.hairColor], cloth=LOOK.cloths[look.cloth];
  const light=parseInt(hair.slice(1,3),16)>150;
  const lower = look.style==='jin' ? '#3a3048' : look.style==='qun' ? shade(cloth,.18) : cloth;
  const sash = look.style==='jin' ? '#5e3a20' : look.style==='qun' ? (look.cloth===1?'#d9708a':'#fbf3e4') : (look.cloth===7?'#c8413b':'#e0aa3e');
  return { S:skin, s:shade(skin,-.13), E:'#2b2533', e:'#ffffff', L:look.g==='f'?'#2b2533':skin, M:mix(skin,'#ff7a8a',.35), m:'#b5534a',
    W:look.cloth===1?'#c9b48a':'#fbf3e4', C:cloth, c:shade(cloth,-.25), A:sash, P:lower, p:shade(lower,-.22), F:'#4a2a1a',
    H:hair, h:light?shade(hair,-.12):shade(hair,.12), Y:'#e8b84a', R:'#d84a4a' };
}
function composeRows(dir, look, frame){
  const rows=BODY[dir].map(r=>r.split(''));
  // girls' dresses flare at the hem
  if(look.style==='qun'){ for(const y of [17,18]){ if(dir==='side'){ rows[y][3]='P'; rows[y][11]='P'; } else { rows[y][2]='P'; rows[y][13]='P'; } } }
  rows[19]=FEET[dir][frame%4].split('');
  const st=LOOK.hairstyles[look.hair].id;
  const put=(y,line)=>{ if(y>=rows.length) return; for(let x=0;x<16;x++){ const ch=line[x]; if(ch&&ch!=='.') rows[y][x]=ch; } };
  if(dir==='down') HAIR_CAP.down[st].forEach((l,y)=>put(y,l));
  else { HAIR_CAP[dir].base.forEach((l,y)=>put(y,l)); const ex=HAIR_CAP[dir][st]; for(const y in ex) put(+y,ex[y]); }
  return rows.map(r=>r.join(''));
}
const LOOKC={};
function lookSprite(look, dir, frame){
  const key=JSON.stringify(look)+dir+frame; if(LOOKC[key]) return LOOKC[key];
  const rows=composeRows(dir,look,frame), pal=lookPalette(look), h=rows.length, w=16;
  const c=document.createElement('canvas'); c.width=w+2; c.height=h+2; const g=c.getContext('2d');
  const filled=(x,y)=>y>=0&&y<h&&x>=0&&x<w&&rows[y][x]!=='.';
  g.fillStyle='#2a1e1a';
  for(let y=-1;y<=h;y++) for(let x=-1;x<=w;x++){ if(filled(x,y)) continue; if(filled(x-1,y)||filled(x+1,y)||filled(x,y-1)||filled(x,y+1)) g.fillRect(x+1,y+1,1,1); }
  for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const ch=rows[y][x]; if(ch==='.') continue; g.fillStyle=pal[ch]||'#f0f'; g.fillRect(x+1,y+1,1,1); }
  c.bottom=h+1; return LOOKC[key]=c;
}

/* ---------- profiles (3 save slots) ---------- */
const SLOTS=3;
const slotKey=i=>'shanhai-wendao.slot'+i;
function readSlot(i){ try{ const s=JSON.parse(localStorage.getItem(slotKey(i))||'null'); return s&&s.map?s:null; }catch(e){ return null; } }
(function migrate(){ try{ const old=localStorage.getItem('shanhai-wendao.v1'); if(old&&!localStorage.getItem(slotKey(0))){ const s=JSON.parse(old); s.look=s.look||defaultLook('m'); s.name=s.name||'无名'; localStorage.setItem(slotKey(0),JSON.stringify(s)); } localStorage.removeItem('shanhai-wendao.v1'); }catch(e){} })();

/* ---------- character creator ---------- */
const Creator = {
  open(slot){
    const t=$('#title'); t.hidden=false; Creator.slot=slot; Creator.look=defaultLook('m'); Creator.name=NAMES_M[Math.floor(Math.random()*NAMES_M.length)];
    Creator.render(); UI.sync();
  },
  render(){
    const L=Creator.look, t=$('#title');
    const sw=(arr,key)=>arr.map((c,i)=>`<button class="sw${L[key]===i?' on':''}" data-k="${key}" data-v="${i}" style="background:${c}" aria-label="颜色 ${i+1}"></button>`).join('');
    t.innerHTML=`<div class="creator wood">
      <h2>捏脸 · 创建角色</h2>
      <div class="cr-top"><canvas id="crPrev" class="px" width="18" height="22" aria-label="角色预览"></canvas>
        <div class="cr-name"><label for="crName">道号</label><input id="crName" maxlength="6" value="${esc(Creator.name)}" autocomplete="off">
          <div class="seg2"><button data-g="m" class="${L.g==='m'?'on':''}">男</button><button data-g="f" class="${L.g==='f'?'on':''}">女</button></div>
          <button class="btn mini" id="crRand">随机</button></div></div>
      <div class="cr-rows">
        <div class="cr-row"><span>肤色</span><div class="sws">${sw(LOOK.skins,'skin')}</div></div>
        <div class="cr-row"><span>发型</span><div class="opts">${LOOK.hairstyles.map((h,i)=>`<button class="${L.hair===i?'on':''}" data-k="hair" data-v="${i}">${h.name}</button>`).join('')}</div></div>
        <div class="cr-row"><span>发色</span><div class="sws">${sw(LOOK.hairs,'hairColor')}</div></div>
        <div class="cr-row"><span>服饰</span><div class="opts">${LOOK.styles.map(s=>`<button class="${L.style===s.id?'on':''}" data-k="style" data-v="${s.id}">${s.name}</button>`).join('')}</div></div>
        <div class="cr-row"><span>衣色</span><div class="sws">${sw(LOOK.cloths,'cloth')}</div></div>
      </div>
      <div class="cr-btns"><button class="btn" id="crBack">返回</button><button class="btn main" id="crGo">开始修行</button></div>
    </div>`;
    t.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{ Sound.tick(); const k=b.dataset.k; L[k]=k==='style'?b.dataset.v:+b.dataset.v; Creator.render(); });
    t.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{ Sound.tick(); const g=b.dataset.g; if(g===L.g) return; const keepName=Creator.name;
      Creator.look=Object.assign(defaultLook(g),{skin:L.skin,hairColor:L.hairColor});
      if(NAMES_M.includes(keepName)||NAMES_F.includes(keepName)) Creator.name=(g==='f'?NAMES_F:NAMES_M)[Math.floor(Math.random()*8)];
      Creator.render(); });
    $('#crName').oninput=e=>{ Creator.name=e.target.value; };
    $('#crRand').onclick=()=>{ Sound.tick(); Creator.look=randomLook(); Creator.name=(Creator.look.g==='f'?NAMES_F:NAMES_M)[Math.floor(Math.random()*8)]; Creator.render(); };
    $('#crBack').onclick=()=>{ Sound.tick(); clearInterval(Creator.timer); UI.title(); };
    $('#crGo').onclick=()=>{ Sound.unlock(); clearInterval(Creator.timer); const name=(Creator.name||'').trim()||'无名';
      RT.slot=Creator.slot; S=newState(); S.look={...Creator.look}; S.name=name; t.hidden=true;
      enterMap('home',11,6); UI.hud(); save(); UI.say(SCRIPTS.intro, ()=>{ S.questStarted=0; Story.check(); }); };
    clearInterval(Creator.timer); let i=0; const dirs=['down','down','side','up','side'];
    const draw=()=>{ const c=$('#crPrev'); if(!c){ clearInterval(Creator.timer); return; } const d=dirs[Math.floor(i/8)%dirs.length], f=Math.floor(i/2)%4, sp=lookSprite(L,d,f);
      const g=c.getContext('2d'); g.clearRect(0,0,c.width,c.height); if(d==='side'&&Math.floor(i/8)%dirs.length===4){ g.save(); g.translate(18,0); g.scale(-1,1); g.drawImage(sp,0,0); g.restore(); } else g.drawImage(sp,0,0); i++; };
    draw(); Creator.timer=setInterval(draw,120);
  }
};
