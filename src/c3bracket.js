/* ============================================================
   山海问道 · 第三章 — 四宗大比的对阵表, done properly: sixteen entrants, four from each sect (the named ones you have met,
   the rest other disciples of the four sects), drawn into a knockout. Before a round is fought nobody knows who goes
   through, so the table shows only what is decided: the first round's pairs, and after that 「第 N 场胜者」 until the
   matches are fought. Each match is a card with both portraits and names; yours is marked. The other matches of a round
   are fought the same day as yours, and whoever loses goes home — not only the ones you beat.
   上一届魁首 (谢霁月) does not go up again: by custom she leads her sect's party and watches.
   ============================================================ */
const KB={
  SECT:{jian:'青云剑宗', dan:'药王谷', shou:'万兽谷', tianji:'天机阁'},
  NAMED:{jian:['sf_lin','sf_cheng'], dan:['tang'], shou:['sf_wulan'], tianji:['sf_wenxuan','sf_bu']},
  // the other disciples of each sect who came up to the capital
  GEN:{
    jian:[['周子衡','m'],['陆青崖','m'],['秦照','f']], dan:[['白芷','f'],['孟回春','m'],['林若薇','f']],
    shou:[['巴图','m'],['塔娜','f'],['阿古拉','m']], tianji:[['沈观星','m'],['闻人默','m'],['顾衍','f']],
  },
  gen:{},
  sectOf(id){ if(id==='me') return S.sect; for(const s in KB.NAMED) if(KB.NAMED[s].includes(id)) return s; return (KB.gen[id]||{}).sect; },
  name(id){ if(id==='me') return S.name; if(KB.gen[id]) return KB.gen[id].name; return (KM.NAME[id]||id).replace(/（.*/,''); },
  look(id){ if(id==='me') return S.look; if(id==='tang') return LOOK_TANG; if(KB.gen[id]) return KB.gen[id].look;
    const o=MAPS.jc_sifang.objects.find(o=>o.id===id); return o&&o.look; },
  present(id){ if(id==='tang') return true; const o=MAPS.jc_sifang.objects.find(o=>o.id===id); return !!o&&(!o.cond||o.cond(S)); },
  // the sixteen, in bracket order: your path (KM.bracket) placed so each meets you in the right round, the rest around them
  draw(){ const st=KM.st(); if(st.draw&&st.draw.length===16) { KB.mkGen(st.draw); return st.draw; } KB._busy=true; try{ return KB.draw0(st); } finally{ KB._busy=false; } },
  draw0(st){
    const path=st.bracket||KM.bracket(), R=rng(S.day*7+S.name.length*13+3), sects=['jian','dan','shou','tianji'], pool=[];
    for(const s of sects){ const named=s===S.sect?(s==='dan'?['tang']:[]):KB.NAMED[s].filter(id=>KB.present(id)); const mine=s===S.sect?['me']:[];
      const list=[...mine,...named]; KB.GEN[s].forEach(([nm,g],i)=>{ if(list.length<4) list.push('g_'+s+i); }); pool.push(...list.slice(0,4)); }
    const rest=pool.filter(id=>id!=='me'&&!path.includes(id)), named=rest.filter(id=>!id.startsWith('g_')), gens=rest.filter(id=>id.startsWith('g_')).sort(()=>R()-.5);
    // slot 0 you, 1 your first opponent; 2–3 苏小棠's pair; 4–7 the third-round opponent's quarter; 8–15 the other half, where the finalist comes from
    const D=Array(16).fill(null); D[0]='me'; D[1]=path[0]; D[2]=path[1]; D[4]=path[2]; D[8]=path[3];
    const free=[3,5,6,7,9,10,11,12,13,14,15]; // the named ones who aren't on your path go to the far side, each against a disciple
    for(const id of named){ const i=[10,12,14,6].find(k=>D[k]===null); if(i!=null) D[i]=id; }
    for(const k of free) if(D[k]===null) D[k]=gens.shift()||rest.find(id=>!D.includes(id));
    // a real draw keeps two of one sect apart in the first round: swap a disciple across until no pair shares a sect
    const sec=id=>id==='me'?S.sect:id.startsWith('g_')?id.slice(2,-1):KB.sectOf(id);
    for(let pass=0;pass<4;pass++) for(let k=0;k<8;k++){ const a=D[2*k], b=D[2*k+1]; if(sec(a)!==sec(b)) continue;
      const i=[2*k+1,2*k].find(i=>D[i].startsWith('g_')); if(i==null) continue;
      const j=free.find(j=>j!==i&&D[j].startsWith('g_')&&sec(D[j])!==sec(D[i^1])&&sec(D[i])!==sec(D[j^1])); if(j!=null) [D[i],D[j]]=[D[j],D[i]]; }
    st.draw=D; save(); KB.mkGen(D); return D; },
  mkGen(D){ for(const id of D) if(id&&id.startsWith('g_')&&!KB.gen[id]){ const s=id.slice(2,-1), i=+id.slice(-1), [nm,g]=KB.GEN[s][i], R=rng(nm.charCodeAt(0)*31+i);
      KB.gen[id]={name:nm, sect:s, look:{g, skin:R()*3|0, hair:R()*5|0, hairColor:R()*4|0, style:g==='f'?'qun':(R()<.5?'robe':'jin'), cloth:R()*8|0, face:'small'}}; } },
  // how strong each is, for the matches you aren't in: your path's opponents always reach you; then the named; then the rest
  rank(id){ const path=KM.st().bracket||KM.bracket(), i=path.indexOf(id); if(id==='me') return 100; if(i>=0) return 50+i*10; if(!id.startsWith('g_')) return 30; return 10+(id.charCodeAt(id.length-1)%7); },
  done:()=>LT.st().round||0,                                                                         // rounds fought
  // who is in round r's match k (null if not known yet), and who won it (null if not fought)
  who(r,k){ const D=KB.draw(); if(r===0) return [D[2*k],D[2*k+1]]; return [KB.won(r-1,2*k),KB.won(r-1,2*k+1)]; },
  won(r,k){ if(r>=KB.done()) return null; const [a,b]=KB.who(r,k); if(!a||!b) return null; return KB.rank(a)>=KB.rank(b)?a:b; },
  out(id){ const D=KB.draw(); if(!D.includes(id)) return false; for(let r=0;r<KB.done();r++) for(let k=0;k<8>>r;k++){ const p=KB.who(r,k); if(p.includes(id)&&KB.won(r,k)!==id) return true; } return false; },
  face:{},
  portrait(id){ if(!id) return ''; const key=id==='me'?'me'+JSON.stringify(S.look):id; if(KB.face[key]) return KB.face[key]; const look=KB.look(id); if(!look) return '';
    try{ KB.face[key]=chibiCard(look,'bust').toDataURL(); }catch(e){ KB.face[key]=''; } return KB.face[key]; },
  css(){ if($('#kbcss')) return; const s=document.createElement('style'); s.id='kbcss'; s.textContent=`
    .kb-r{margin:10px 0 4px;text-align:center;font-weight:bold;letter-spacing:2px}.kb-r small{display:block;font-weight:normal;letter-spacing:0;opacity:.7}
    .kb-m{display:flex;align-items:center;justify-content:center;gap:8px;margin:6px auto;padding:6px 8px;border-radius:8px;background:rgba(120,90,50,.08);width:100%;max-width:440px;box-sizing:border-box}
    .kb-m.me{background:rgba(200,140,40,.22);box-shadow:inset 0 0 0 2px rgba(200,140,40,.6)}
    .kb-p{flex:1;display:flex;align-items:center;gap:6px;min-width:0}.kb-p.r{flex-direction:row-reverse;text-align:right}
    .kb-p img,.kb-p i{width:40px;height:49px;image-rendering:pixelated;border-radius:6px;background:rgba(0,0,0,.08);flex:none;display:grid;place-items:center;font-style:normal;font-size:20px;opacity:.9}
    .kb-p span{min-width:0;line-height:1.25;white-space:nowrap}.kb-p small{display:block;opacity:.65;font-size:11px}
    .kb-p.lost{opacity:.4}.kb-p.won b::after{content:" ✓";color:#3a8a3a}.kb-vs{flex:none;font-size:12px;opacity:.6}`; document.head.appendChild(s); },
  card(r,k){ const [a,b]=KB.who(r,k), w=KB.won(r,k), mine=a==='me'||b==='me';
    const P=(id,side,from)=>{ const cls=`kb-p ${side}${w&&id?(w===id?' won':' lost'):''}`;
      if(!id) return `<div class="${cls}"><i>？</i><span><b>待定</b><small>第 ${from+1} 场胜者</small></span></div>`;
      const img=KB.portrait(id); return `<div class="${cls}">${img?`<img src="${img}" alt="">`:'<i>·</i>'}<span><b>${esc(KB.name(id))}${id==='me'?'（你）':''}</b><small>${KB.SECT[KB.sectOf(id)]||''}</small></span></div>`; };
    return `<div class="kb-m${mine?' me':''}">${P(a,'',2*k)}<span class="kb-vs">对</span>${P(b,'r',2*k+1)}</div>`; },
  show(){ KB.css(); const names=['第一轮','第二轮','第三轮','决赛'], done=KB.done(); let h=`<p class="muted" style="text-align:center">三月十五起，贡院前设擂，每日一轮。十六人，输一场即回宗门。<br>上一届魁首谢霁月，照例不再上擂。</p>`;
    for(let r=0;r<4;r++){ const st=r<done?'已赛完':r===done?(LT.st().day===S.day&&r>0?'明日开擂':'下一轮'):'还没开始';
      h+=`<div class="kb-r">${names[r]}<small>${st}</small></div>`; for(let k=0;k<8>>r;k++) h+=KB.card(r,k); }
    UI.panel('四宗大比 · 对阵表', h); },
};
KM.show=()=>KB.show();
// a fresh draw whenever the bracket is (re)made at the 抽签
{ const _b=KM.bracket; KM.bracket=function(){ const r=_b.apply(KM,arguments); const st=KM.st(); if(st&&!st.bracket) st.draw=null; return r; }; }
// whoever has lost is gone from 四方馆 and the square, not only the ones you beat
{ const _g=LT.gone; LT.gone=id=>{ if(_g(id)) return true; if(KB._busy) return false; try{ return !!(S&&S.c3&&S.c3.km&&S.c3.km.bracket&&id!=='tang'&&KB.out(id)); }catch(e){ return false; } }; }
