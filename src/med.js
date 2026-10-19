/* ============================================================
   山海问道 · 闭关 — choose how long to meditate (two hours up to a month), see which realm you will reach,
   then watch a progress bar. Long sessions pass whole days (letters, 奇遇 and fortunes still roll each morning).
   Midnight no longer knocks you out: the day simply turns over.
   ============================================================ */
const MED_STEPS = [[2,'2 小时'],[4,'4 小时'],[6,'半天'],[24,'1 天'],[48,'2 天'],[72,'3 天'],[120,'5 天'],[168,'7 天'],[240,'10 天'],[360,'15 天'],[720,'30 天']];
const Med = {
  // cultivation from one 2-hour block at level L; a full day counts as six blocks (the rest is eating and sleeping)
  block(L){ return Math.round((14+4*L)*(L>=10?1.6:1)*2*Sect.medMul()); },
  blocks(h){ return h<24 ? h/2 : Math.round(h/24*6); },
  // run the numbers without touching the save
  sim(h){ let L=S.L, exp=S.exp, total=0;
    for(let i=0;i<Med.blocks(h);i++){ const g=Med.block(L); total+=g; exp+=g;
      while(true){ const need=expNeed(L); if(L===9||L>=12){ exp=Math.min(exp,need); break; } if(exp<need) break; exp-=need; L++; } }
    return {L, exp, total, capped:(L===9||L>=12)&&exp>=expNeed(L)}; },
  // how many days of 闭关 until each of the next few realms
  ahead(){ const out=[]; let L=S.L, exp=S.exp, blocks=0;
    while(out.length<4 && blocks<6*400){ if((L===9||L>=12)&&exp>=expNeed(L)) break; exp+=Med.block(L); blocks++;
      const need=expNeed(L); if(L!==9&&L<12&&exp>=need){ exp-=need; L++; out.push([L, blocks]); } else if(L===9&&exp>=need){ out.push([9.5, blocks]); exp=need; } }
    return out; },
  when(blocks){ const h=blocks*2; return h<24?`${h} 小时`:`${Math.ceil(blocks/6)} 天`; },
  open(){
    if(S.L===9 && S.exp>=expNeed(9)){
      if(S.inv.zhuji) return UI.confirm('炼气九层圆满。服下筑基丹，冲击筑基？（将面对心魔与天劫）', ()=>Mini.breakthrough());
      return UI.say([['旁白','炼气九层已经圆满，再打坐也无法精进。需要一颗筑基丹才能冲击筑基。']]);
    }
    if(S.L>=12 && S.exp>=expNeed(12)) return UI.say([['旁白','你的修为已经到了这一章的顶点。下一章的修行敬请期待。']]);
    let k=Med._k||0;
    const ahead=Med.ahead().map(([L,b])=>`<li><b>${L===9.5?'炼气九层圆满':realmName(L)}</b><span>约 ${Med.when(b)}</span></li>`).join('');
    UI.panel('闭关打坐', `<div class="med">
      <p class="muted">现在：<b>${realmName(S.L)}</b>　修为 ${Math.floor(S.exp)} / ${expNeed(S.L)}　（${Sect.rootName()}${Sect.medMul()!==1?'，打坐 ×'+Sect.medMul():''}）</p>
      <label class="med-len">打坐多久：<b id="medLen"></b></label>
      <input type="range" id="medR" min="0" max="${MED_STEPS.length-1}" step="1" value="${k}">
      <div class="med-out" id="medOut"></div>
      ${ahead?`<div class="med-ahead"><small>一直闭关的话：</small><ul>${ahead}</ul></div>`:''}
      <p class="muted">闭关一天按六个时辰算（其余时间吃饭睡觉）。闭关期间日子照常过：会收到信件，也会错过当天的奇遇。</p>
      <div class="mg-btns"><button class="btn main" id="medGo">开始打坐</button><button class="btn" id="medNo">算了</button></div></div>`, b=>{
      const r=$('#medR'), show=()=>{ k=+r.value; Med._k=k; const [h,name]=MED_STEPS[k], s=Med.sim(h);
        $('#medLen').textContent=name;
        $('#medOut').innerHTML=`修为 <b>+${s.total}</b>　→　<b>${realmName(s.L)}</b>${s.capped&&s.L===9?'（圆满，需筑基丹）':''}${s.L>S.L?`<span class="up">突破 ${s.L-S.L} 层！</span>`:''}<br><span class="muted">结束时：第 ${S.day+Math.floor((S.min+h*60)/(24*60))} 天 ${fmtTime((S.min+h*60)%(24*60))}</span>`; };
      r.oninput=show; show();
      $('#medGo').onclick=()=>{ UI.closePanel(); Med.run(MED_STEPS[k][0]); };
      $('#medNo').onclick=()=>UI.closePanel(); });
  },
  run(h){
    const blocks=Med.blocks(h), dur=Math.min(4.5, 1.4+Math.log2(1+h/2)*.45)*1000, L0=S.L;
    UI.fx=true; UI.sync(); Sound.magic();
    const el=document.createElement('div'); el.id='medbar'; el.innerHTML=`<div class="medbox"><b>闭关中……</b><div class="xbar"><i></i></div><span class="mtxt"></span><span class="mrealm">${realmName(S.L)}</span></div>`;
    document.body.appendChild(el);
    let done=0, gained=0; const t0=performance.now(), bar=el.querySelector('i'), txt=el.querySelector('.mtxt'), rl=el.querySelector('.mrealm');
    const step=now=>{
      const f=Math.min(1,(now-t0)/dur), want=Math.round(blocks*f);
      while(done<want){ done++; const g=Med.block(S.L), before=S.L; gained+=g; gainExpQuiet(g);
        // time passes with each block: a day-long block is four game hours
        Med.advance(h<24?120:24*60/6);
        if(S.L>before){ rl.textContent=realmName(S.L); rl.classList.remove('pop'); void rl.offsetWidth; rl.classList.add('pop'); Sound.levelup(); } }
      bar.style.width=(f*100)+'%'; txt.textContent=`第 ${S.day} 天 ${fmtTime(S.min)}　修为 +${gained}`;
      if(f<1) return requestAnimationFrame(step);
      setTimeout(()=>{ el.remove(); UI.fx=false; S.st.meditated++; const st=stats(); S.hp=st.hp; S.mp=st.mp;
        if(S.L>L0) UI.banner('突破！'+realmName(S.L)); UI.float(S.x,S.y,`+${gained} 修为`); UI.clock(); UI.hud(); save(); UI.sync(); Story.check(); },500);
    };
    requestAnimationFrame(step);
  },
  // move the clock forward, turning the day over at midnight
  advance(min){ S.min+=min; while(S.min>=24*60){ S.min-=24*60; passDay(); } },
};
// like gainExp but without the banner/sound per level (the bar shows those)
function gainExpQuiet(n){ S.exp+=n;
  while(true){ const need=expNeed(S.L); if(S.L===9||S.L>=12){ S.exp=Math.min(S.exp,need); break; } if(S.exp<need) break; S.exp-=need; S.L++; } }
