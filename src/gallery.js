/* ============================================================
   山海问道 · 画卷 — the CG gallery. Every picture you are shown (PixCG: story pictures, heart events, 奇遇) is kept the
   first time it appears: a snapshot of the finished frame, your own look in it included, in this browser's IndexedDB
   (the beta and the live game each keep their own). On the title screen 「画卷 · CG 收集」 opens them, grouped by
   chapter; tap one to see it large and page through, or 「全部播放」 to watch them all in the order you unlocked them.
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
  async keep(title, small, part){ if(Gallery.off()||Gallery.viewing||!title) return; const id=(small||'')+'|'+title+(part?'|'+part:''); if(await Gallery.has(id)) return;
    const img=Gallery.snap(); if(img) Gallery.put({id, title:title+(part?'（'+'二三四五'[part-1]+'）':''), small:small||'', img, at:Date.now()}); },
  group(small){ const s=(small||'').split(' · ')[0]; return s||'其他'; },
  ORDER:['第一章','第二章','第三章','心动事件','奇遇'],
  css(){ if($('#galcss')) return; const s=document.createElement('style'); s.id='galcss'; s.textContent=`
    #gal{position:fixed;inset:0;z-index:60;background:#18140f;color:#f2e8d4;overflow:auto;padding:16px 16px 40px;box-sizing:border-box}
    #gal h2{text-align:center;margin:6px 0 2px;letter-spacing:4px}#gal .gsub{text-align:center;opacity:.7;font-size:13px;margin-bottom:10px}
    #gal .gbar{display:flex;justify-content:center;gap:8px;margin:8px 0 14px}#gal h3{margin:14px auto 6px;max-width:960px;font-size:15px;letter-spacing:2px;border-bottom:1px solid rgba(242,232,212,.2);padding-bottom:4px}
    #gal .ggrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;max-width:960px;margin:0 auto}
    #gal .gi{cursor:pointer;border-radius:8px;overflow:hidden;background:#000;box-shadow:0 2px 8px rgba(0,0,0,.5)}#gal .gi img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block}
    #gal .gi span{display:block;padding:4px 6px;font-size:12px;background:rgba(0,0,0,.6)}#gal .gi small{opacity:.6;margin-left:4px}
    #gal .gempty{text-align:center;opacity:.7;margin-top:40px;line-height:1.8}
    #galv{position:fixed;inset:0;z-index:61;background:#000;display:grid;place-items:center}#galv img{max-width:100vw;max-height:calc(100vh - 70px);object-fit:contain;transition:opacity .6s}
    #galv .gcap{position:absolute;left:0;right:0;bottom:0;padding:10px 16px;background:linear-gradient(transparent,rgba(0,0,0,.85));color:#f2e8d4;text-align:center}
    #galv .gcap b{font-size:18px;letter-spacing:3px}#galv .gcap small{display:block;opacity:.7}
    #galv .gnav{position:absolute;top:50%;transform:translateY(-50%);font-size:34px;color:#f2e8d4;background:rgba(0,0,0,.35);border:0;width:48px;height:64px;border-radius:8px;cursor:pointer}
    #galv .gl{left:8px}#galv .gr{right:8px}#galv .gx{position:absolute;top:10px;right:12px}`; document.head.appendChild(s); },
  async open(){ Gallery.css(); const list=(await Gallery.all()).sort((a,b)=>a.at-b.at); Gallery.list=list; Gallery.viewing=true;
    let el=$('#gal'); if(!el){ el=document.createElement('div'); el.id='gal'; document.body.appendChild(el); } el.hidden=false;
    const groups={}; for(const r of list){ const k=Gallery.group(r.small); (groups[k]=groups[k]||[]).push(r); }
    const keys=Object.keys(groups).sort((a,b)=>((Gallery.ORDER.indexOf(a)+99)%99)-((Gallery.ORDER.indexOf(b)+99)%99));
    el.innerHTML=`<h2>画卷</h2><div class="gsub">已解锁 ${list.length} 张。在游戏里第一次看到的插画，都会收在这里。</div>
      <div class="gbar">${list.length?'<button class="btn main" id="galPlay">全部播放</button>':''}<button class="btn" id="galX">返回</button></div>`+
      (list.length?keys.map(k=>`<h3>${esc(k)}　<small>${groups[k].length} 张</small></h3><div class="ggrid">${groups[k].map(r=>`<div class="gi" data-i="${list.indexOf(r)}"><img src="${r.img}" alt=""><span>${esc(r.title)}<small>${esc((r.small||'').split(' · ').slice(1).join(' · '))}</small></span></div>`).join('')}</div>`).join('')
        :'<div class="gempty">还没有收到插画。<br>开始修行吧——每一张在故事里见到的插画，都会收进画卷。</div>');
    $('#galX').onclick=()=>Gallery.close(); if($('#galPlay')) $('#galPlay').onclick=()=>Gallery.view(0,true);
    el.querySelectorAll('.gi').forEach(d=>d.onclick=()=>Gallery.view(+d.dataset.i,false)); },
  close(){ Gallery.stop(); const v=$('#galv'); if(v) v.remove(); const el=$('#gal'); if(el) el.hidden=true; Gallery.viewing=false; },
  stop(){ clearInterval(Gallery.timer); Gallery.timer=null; },
  view(i,play){ const L=Gallery.list; if(!L||!L.length) return; Gallery.stop(); let v=$('#galv'); if(!v){ v=document.createElement('div'); v.id='galv'; document.body.appendChild(v); }
    const show=j=>{ Gallery.at=(j+L.length)%L.length; const r=L[Gallery.at], img=v.querySelector('img');
      if(img){ img.style.opacity=0; setTimeout(()=>{ img.src=r.img; img.style.opacity=1; },play?300:0); } v.querySelector('.gcap').innerHTML=`<b>${esc(r.title)}</b><small>${esc(r.small)}　·　${Gallery.at+1} / ${L.length}</small>`; };
    v.innerHTML=`<img alt=""><div class="gcap"></div><button class="gnav gl">‹</button><button class="gnav gr">›</button><button class="btn gx">${play?'停止':'关闭'}</button>`;
    v.querySelector('.gl').onclick=e=>{ e.stopPropagation(); Gallery.stop(); show(Gallery.at-1); };
    v.querySelector('.gr').onclick=e=>{ e.stopPropagation(); Gallery.stop(); show(Gallery.at+1); };
    v.querySelector('.gx').onclick=e=>{ e.stopPropagation(); Gallery.stop(); v.remove(); };
    v.onclick=()=>{ Gallery.stop(); show(Gallery.at+1); };
    show(i); if(play) Gallery.timer=setInterval(()=>{ if(Gallery.at>=L.length-1){ Gallery.stop(); v.querySelector('.gx').textContent='关闭'; return; } show(Gallery.at+1); },4500); },
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
document.addEventListener('keydown',e=>{ const v=$('#galv'); if(v){ if(e.code==='Escape'){ Gallery.stop(); v.remove(); } else if(e.code==='ArrowRight'){ Gallery.stop(); Gallery.view&&v.querySelector('.gr').click(); } else if(e.code==='ArrowLeft'){ v.querySelector('.gl').click(); } e.stopPropagation(); return; }
  const g=$('#gal'); if(g&&!g.hidden&&e.code==='Escape'){ Gallery.close(); e.stopPropagation(); } }, true);
