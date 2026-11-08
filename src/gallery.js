/* ============================================================
   山海问道 · 画卷 — the CG gallery. Every picture you are shown (PixCG: story pictures, heart events, 奇遇) is kept the
   first time it appears: a snapshot of the finished frame, your own look in it included, in this browser's IndexedDB
   (the beta and the live game each keep their own). On the title screen 「画卷 · CG 收集」 opens them, grouped by
   chapter in story order, every picture in the game listed (the ones not reached yet as ？？？). A picture you have reached —
   by a snapshot kept when you saw it, or because one of your saves is past that point — plays live, your look in it.
   ============================================================ */
const Gallery={
  DB:/\/beta\//.test(location.pathname)?'shanhai-wendao-beta.gallery':'shanhai-wendao.gallery',
  off:()=>/selftest/.test(location.hash),                                                 // the self-tests don't unlock anything
  db(){ return Gallery._db||(Gallery._db=new Promise((ok,no)=>{ try{ const r=indexedDB.open(Gallery.DB,1); r.onupgradeneeded=()=>r.result.createObjectStore('cg',{keyPath:'id'}); r.onsuccess=()=>ok(r.result); r.onerror=()=>no(r.error); }catch(e){ no(e); } })); },
  async all(){ try{ const d=await Gallery.db(); return await new Promise(ok=>{ const q=d.transaction('cg').objectStore('cg').getAll(); q.onsuccess=()=>ok(q.result||[]); q.onerror=()=>ok([]); }); }catch(e){ return []; } },
  async has(id){ try{ const d=await Gallery.db(); return await new Promise(ok=>{ const q=d.transaction('cg').objectStore('cg').get(id); q.onsuccess=()=>ok(!!q.result); q.onerror=()=>ok(false); }); }catch(e){ return false; } },
  async put(rec){ try{ const d=await Gallery.db(); d.transaction('cg','readwrite').objectStore('cg').put(rec); }catch(e){} },
  // a snapshot of the picture as it stands now, ~960 wide
  snap(){ const c=$('#cgBg'); if(!c||!c.width) return null; const w=Math.min(960,c.width), h=Math.round(c.height*w/c.width), o=document.createElement('canvas'); o.width=w; o.height=h;
    const g=o.getContext('2d'); g.drawImage(c,0,0,w,h); try{ return o.toDataURL('image/jpeg',.86); }catch(e){ return null; } },
  async keep(title, small, part){ if(Gallery.off()||!title) return; const id=(small||'')+'|'+title+(part?'|'+part:''); if(await Gallery.has(id)) return;
    const img=Gallery.snap(); if(img) Gallery.put({id, title:title+(part?'（'+'二三四五'[part-1]+'）':''), small:small||'', img, at:Date.now()}); },
  // ---------- the catalogue: every picture in the game, in story order, how to replay it, and when a save has reached it ----------
  qdone:id=>s=>{ const q=QUESTS.find(q=>q.id===id); try{ return !!(q&&q.check&&q.check(s)); }catch(e){ return false; } },
  flag:f=>s=>!!(s.flags&&s.flags[f]),
  list(){ if(Gallery._L) return Gallery._L; const L=[], add=(group,title,small,open,unl,snap)=>L.push({group,title,small,open,unl,snap:snap||(small+'|'+title)});
    const Q=Gallery.qdone, F=Gallery.flag, any=(...ps)=>s=>ps.some(p=>p(s));
    const heart=(ids,group)=>{ for(const id of ids){ const ev=typeof HEART_CG!=='undefined'&&HEART_CG[id]; if(!ev) continue; for(const lv of [2,4,6,8]){ const e=ev[lv]; if(!e||!e.scene) continue;
        add(group,e.title,'心动事件 · '+(NPCS[id]&&NPCS[id].name||id),()=>CG.open(e.scene,id,e.title),s=>!!(s.rel&&s.rel[id]&&s.rel[id].ev&&s.rel[id].ev[lv])); } } };
    // 第二章
    add('第二章','雾中背影','第二章 · 秘境',()=>MJH.peekCG(),any(F('mj_peeked'),Q('c2e')));
    ['安平村','后山','那一夜'].forEach((t,n)=>add('第二章',t,'镜中往事',()=>{ C2C.cg(0); if(n) C2C.cg(n); },Q('c2f'),'镜中往事|安平村'+(n?'|'+n:'')));
    add('第二章','封','第二章 · 白羽崖',()=>C2C.sealCG(),any(F('c2_mirror'),Q('c2f')));
    add('第二章','心镜湖','第二章 · 第四幕',()=>C2X.lakeCG(),any(F('c2_lake_in'),Q('c2g')));
    add('第二章','九尾','第二章 · 第四幕',()=>C2X.foxCG(),any(F('c2_xin_done'),Q('c2g')));
    add('第二章','镜中人','第二章 · 第四幕',()=>C2L.nightCG(),Q('c2g'));
    ['入门那年','那位师兄','宗门大比'].forEach((t,i)=>add('第二章',t,'水中的往事',()=>C2L.echoCG(i),s=>!!(s.c2x&&s.c2x.echo&&s.c2x.echo.includes(i))||Q('c2g')(s)));
    add('第二章','洞口','第二章 · 第五幕',()=>C2Y.meetCG(),any(F('c2_bun'),Q('c2h')));
    add('第二章','饿','第二章 · 第五幕',()=>C2Y.caveCG(),any(F('c2_cave_in'),Q('c2h')));
    ['丰年村','别出声','大火'].forEach((t,i)=>add('第二章',t,'二师兄的梦',()=>C2Y.memCG(i),s=>!!(s.c2y&&s.c2y.dream&&s.c2y.dream.includes(i))||Q('c2h')(s)));
    add('第二章','镜中的你','二师兄的梦',()=>C2Y.shardCG('look'),Q('c2h'));
    add('第二章','扣下','二师兄的梦',()=>C2Y.shardCG('no'),Q('c2h'));
    add('第二章','饕餮','第二章 · 第五幕',()=>C2Y.wakeCG(),any(F('c2_awake'),Q('c2h')));
    add('第二章','镜收','第二章 · 第五幕',()=>C2Y.sealCG(),any(F('c2_sealed'),Q('c2h')));
    add('第二章','长歌','第二章 · 第五幕',()=>C2Y.dawnCG(),any(F('c2_man_saved'),Q('c2h')));
    add('第二章','早课','第二章 · 尾声',()=>C2Y.morningCG(),any(F('c2_done'),Q('c2i')));
    // 第三章
    add('第三章','裂开的牌位','第三章 · 北上',()=>C3A.shrineCG(),any(F('c3_old'),Q('c3b')));
    add('第三章','山脊','第三章 · 北上',()=>C3A.ridgeCG(),any(F('c3_raid_won'),Q('c3c')));
    add('第三章','心魔','第三章 · 结丹',()=>PixCG.open({ink:JD.void, cast:[{who:'me', x:.24, pose:'stand', face:1}], title:'心魔', small:'第三章 · 结丹', seed:7301}),F('c3_jd_done'));
    add('第三章','雷云','第三章 · 结丹',()=>JD.cg(),F('c3_jd_done'));
    add('第三章','小巷','第三章 · 京城',()=>C3A.xiangCG(),F('c3_xj_met'));
    add('第三章','开幕式的高台','第三章 · 京城',()=>KM.cg(),F('c3_km_done'));
    add('第三章','鼎','第三章 · 人吃人',()=>JA10.cg(),any(F('c3_dg_key'),Q('c3p')));
    // 心动事件: a column of their own, one person after another (chapter 1 has no story pictures of its own)
    heart(['tang','ge','xiao','xie'],'心动事件');
    // 奇遇
    if(typeof QIYU!=='undefined') for(const q of QIYU) if(QY_PX[q.id]) add('奇遇',q.title,'奇遇 · '+Qiyu.TIER[q.tier],()=>QyCG.open(q),s=>!!(s.qiyuSeen&&s.qiyuSeen[q.id]));
    return Gallery._L=L; },
  saves(){ const out=[]; for(let i=0;i<SLOTS;i++){ try{ const s=readSlot(i); if(s) out.push(s); }catch(e){} } return out; },
  css(){ if($('#galcss')) return; const s=document.createElement('style'); s.id='galcss'; s.textContent=`
    #gal{position:fixed;inset:0;z-index:60;background:#18140f;color:#f2e8d4;overflow:auto;padding:16px 16px 40px;box-sizing:border-box}
    #gal h2{text-align:center;margin:6px 0 2px;letter-spacing:4px}#gal .gsub{text-align:center;opacity:.7;font-size:13px;margin-bottom:10px}
    #gal .gbar{display:flex;justify-content:center;gap:8px;margin:8px 0 14px}#gal h3{margin:14px auto 6px;max-width:960px;font-size:15px;letter-spacing:2px;border-bottom:1px solid rgba(242,232,212,.2);padding-bottom:4px}
    #gal .ggrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;max-width:960px;margin:0 auto}
    #gal .gi{cursor:pointer;border-radius:8px;overflow:hidden;background:#2a2620;box-shadow:0 2px 8px rgba(0,0,0,.5)}#gal .gi .th{width:100%;aspect-ratio:4/3;object-fit:cover;display:grid;place-items:center;font-size:30px;color:rgba(242,232,212,.35);background:linear-gradient(135deg,#3a3228,#221e18)}
    #gal .gi span{display:block;padding:4px 6px;font-size:12px;background:rgba(0,0,0,.6)}#gal .gi small{opacity:.6;margin-left:4px}
    #gal .gi.lock{cursor:default;opacity:.45}#gal .gi.lock span{color:rgba(242,232,212,.6)}
    body.gal-live #cg{z-index:62 !important}
    body.gal-gen #cg{opacity:0 !important;pointer-events:none}
    #galc{position:fixed;left:0;right:0;bottom:0;z-index:63;display:flex;align-items:center;justify-content:center;gap:10px;padding:10px;background:linear-gradient(transparent,rgba(0,0,0,.9));color:#f2e8d4}
    #galc .gcap{min-width:160px;text-align:center}#galc b{font-size:17px;letter-spacing:3px}#galc small{display:block;opacity:.7}
    #galc .gnav{font-size:28px;color:#f2e8d4;background:rgba(255,255,255,.08);border:0;width:46px;height:46px;border-radius:8px;cursor:pointer}
    #galback{position:fixed;inset:0;z-index:61;background:#000}`; document.head.appendChild(s); },
  async open(){ Gallery.css(); Gallery.viewing=true; const L=Gallery.list(), saves=Gallery.saves(), snaps=await Gallery.all(), byId={};
    for(const r of snaps) byId[r.id]=r;
    for(const e of L){ e.img=(byId[e.snap]||{}).img||null; e.ok=!!e.img||saves.some(s=>{ try{ return e.unl(s); }catch(x){ return false; } }); }
    Gallery.items=L.filter(e=>e.ok);
    let el=$('#gal'); if(!el){ el=document.createElement('div'); el.id='gal'; document.body.appendChild(el); } el.hidden=false;
    const groups=[]; for(const e of L){ let g=groups.find(g=>g.k===e.group); if(!g) groups.push(g={k:e.group, l:[]}); g.l.push(e); }
    const n=Gallery.items.length;
    el.innerHTML=`<h2>画卷</h2><div class="gsub">已解锁 ${n} / ${L.length} 张。故事里走到过的插画都在这里，按剧情的顺序排。</div>
      <div class="gbar">${n?'<button class="btn main" id="galPlay">全部播放</button>':''}<button class="btn" id="galX">返回</button></div>`+
      groups.map(g=>`<h3>${esc(g.k)}　<small>${g.l.filter(e=>e.ok).length} / ${g.l.length}</small></h3><div class="ggrid">${g.l.map(e=>e.ok
        ?`<div class="gi" data-i="${Gallery.items.indexOf(e)}">${e.img?`<img class="th" src="${e.img}" alt="">`:'<div class="th">▶</div>'}<span>${esc(e.title)}<small>${esc(e.small.split(' · ').slice(1).join(' · ')||e.small)}</small></span></div>`
        :`<div class="gi lock"><div class="th">？</div><span>？？？</span></div>`).join('')}</div>`).join('');
    $('#galX').onclick=()=>Gallery.close(); if($('#galPlay')) $('#galPlay').onclick=()=>Gallery.view(0,true);
    el.querySelectorAll('.gi[data-i]').forEach(d=>d.onclick=()=>Gallery.view(+d.dataset.i,false)); Gallery.fill(); },
  // draw the missing thumbnails: open each picture out of sight, keep its first frame, put it in the grid
  async fill(){ if(Gallery._filling) return; Gallery._filling=true; const todo=Gallery.items.filter(e=>!e.img);
    for(const e of todo){ if(!Gallery.viewing||$('#galc')) break; const keepS=S; let img=null;
      try{ if(!S){ const sv=Gallery.saves().sort((a,b)=>(b.L||0)-(a.L||0))[0]; S=sv?JSON.parse(JSON.stringify(sv)):newState(); }
        document.body.classList.add('gal-gen'); e.open(); await new Promise(r=>setTimeout(r,120)); const cv=$('#cgBg'); if(cv&&PixCG.cur) PixCG.frame(cv.getContext('2d'),1.5); img=Gallery.snap(); }catch(x){}
      try{ if(CG.on) CG.on=false; if(QyCG.on) QyCG.on=false; PixCG.close(); for(const [o,k] of [['C2L','nightOn'],['C2C','sealOn'],['C2X','cgOn'],['MJH','peekOn']]) if(eval('typeof '+o)!=='undefined') eval(o)[k]=false; }catch(x){}
      S=keepS; document.body.classList.remove('gal-gen');
      if(img){ e.img=img; Gallery.put({id:e.snap, title:e.title, small:e.small, img, at:Date.now()}); const d=$(`#gal .gi[data-i="${Gallery.items.indexOf(e)}"] .th`); if(d) d.outerHTML=`<img class="th" src="${img}" alt="">`; }
      await new Promise(r=>setTimeout(r,30)); }
    Gallery._filling=false; },
  close(){ Gallery.endLive(); const el=$('#gal'); if(el) el.hidden=true; Gallery.viewing=false; },
  stop(){ clearTimeout(Gallery.timer); Gallery.timer=null; },
  // the picture itself, live (your own look in it): borrow your furthest save while it plays, then put things back
  endLive(){ Gallery.stop(); try{ if(CG.on) CG.on=false; if(QyCG.on) QyCG.on=false; PixCG.close(); for(const [o,k] of [['C2L','nightOn'],['C2C','sealOn'],['C2X','cgOn'],['MJH','peekOn']]) if(window[o]||eval('typeof '+o+"!=='undefined'")) eval(o)[k]=false; }catch(e){} document.body.classList.remove('gal-live');
    for(const id of ['galc','galback']){ const x=$('#'+id); if(x) x.remove(); } if(Gallery._S!==undefined){ S=Gallery._S; Gallery._S=undefined; } },
  view(i,play){ const L=Gallery.items; if(!L||!L.length) return; Gallery.endLive();
    if(Gallery._S===undefined){ Gallery._S=S; if(!S){ const sv=Gallery.saves().sort((a,b)=>(b.L||0)-(a.L||0))[0]; S=sv?JSON.parse(JSON.stringify(sv)):newState(); } }
    document.body.classList.add('gal-live'); const back=document.createElement('div'); back.id='galback'; document.body.appendChild(back);
    const c=document.createElement('div'); c.id='galc'; c.innerHTML=`<button class="gnav gl">‹</button><div class="gcap"></div><button class="gnav gr">›</button><button class="btn gx">${play?'停止':'关闭'}</button>`; document.body.appendChild(c);
    const show=j=>{ Gallery.at=(j+L.length)%L.length; const e=L[Gallery.at]; try{ if(CG.on) CG.on=false; PixCG.close(); e.open(); }catch(x){ console.warn('画卷',e.title,x); }
      c.querySelector('.gcap').innerHTML=`<b>${esc(e.title)}</b><small>${esc(e.small)}　·　${Gallery.at+1} / ${L.length}</small>`;
      if(play){ Gallery.stop(); Gallery.timer=setTimeout(()=>{ if(Gallery.at>=L.length-1){ c.querySelector('.gx').textContent='关闭'; return; } show(Gallery.at+1); },5000); } };
    c.querySelector('.gl').onclick=()=>{ play=false; Gallery.stop(); show(Gallery.at-1); };
    c.querySelector('.gr').onclick=()=>{ play=false; Gallery.stop(); show(Gallery.at+1); };
    c.querySelector('.gx').onclick=()=>{ Gallery.endLive(); Gallery.open(); };
    show(i); },
};
// keep each picture when it is shown (after it has faded in), and the second scene of a two-part picture too
{ const _o=PixCG.open; PixCG.open=function(o){ const r=_o.apply(PixCG,arguments); const tok=PixCG.token; PixCG._gal={title:o&&o.title, small:o&&o.small, part:0};
    setTimeout(()=>{ if(PixCG.on&&PixCG.token===tok) Gallery.keep(o.title,o.small,0); },1600); return r; }; }
{ const _s=PixCG.swap; PixCG.swap=function(){ const r=_s.apply(PixCG,arguments); const g=PixCG._gal, tok=PixCG.token; if(g){ g.part++; const p=g.part; setTimeout(()=>{ if(PixCG.on&&PixCG.token===tok) Gallery.keep(g.title,g.small,p); },1600); } return r; }; }
// the title screen: 画卷 · CG 收集
Gallery.button=function(){ if($('#tGal')) return; let box=$('#title .title-carry')||$('#title .tbtns'); if(!box){ const note=$('#title .tnote'); if(!note) return; box=document.createElement('div'); box.className='title-carry'; note.before(box); }
    const b=document.createElement('button'); b.className='btn mini'; b.style.marginLeft='8px'; b.id='tGal'; b.textContent='画卷 · CG 收集'; b.onclick=()=>{ Sound.unlock&&Sound.unlock(); Sound.tick&&Sound.tick(); Gallery.open(); }; box.appendChild(b); };
{ const _t=UI.title; UI.title=function(){ const r=_t.apply(UI,arguments); Gallery.button(); return r; }; }
setTimeout(()=>{ if(!$('#title').hidden) Gallery.button(); },0);   // the title screen was already drawn before this file loaded
document.addEventListener('keydown',e=>{ const c=$('#galc'); if(c){ if(e.code==='Escape') c.querySelector('.gx').click(); else if(e.code==='ArrowRight') c.querySelector('.gr').click(); else if(e.code==='ArrowLeft') c.querySelector('.gl').click(); e.stopPropagation(); e.preventDefault(); return; }
  const g=$('#gal'); if(g&&!g.hidden&&e.code==='Escape'){ Gallery.close(); e.stopPropagation(); } }, true);
