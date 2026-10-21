/* ============================================================
   山海问道 · 新手引导 — one short tip the first time each thing comes up (walk, tasks, interact, bag, meditate, dodge),
   worded for touch or keyboard. On phones the task list folds down to the tracked task; tap to unfold.
   ============================================================ */
const TIPS = {
  move:  {touch:'点地面上任何地方，角色就会走过去。', key:'用 WASD 或方向键走路，也可以用鼠标点地面。'},
  quest: {touch:'左上角是任务。点「寻路」，角色会自动走到目的地。', key:'左上角是任务。点「寻路」自动走过去，按 J 看全部任务。'},
  talk:  {touch:'靠近人或东西时，头顶会出现「聊 / 采 / 点」——点一下它就能互动。', key:'靠近人或东西时头顶会出现 E，按 E 互动。'},
  bag:   {touch:'左下角「囊」是行囊：物品、修炼、人物、图鉴、存档都在里面。', key:'左下角「囊」是行囊（Esc 打开）：物品、修炼、人物、图鉴、存档都在里面。'},
  med:   {touch:'在蒲团上打坐可以选择打坐多久，修为会一点点涨上去。', key:'在蒲团上打坐可以选择打坐多久，修为会一点点涨上去。'},
  dodge: {touch:'敌人的回合要躲弹幕：手指按住屏幕任意处拖动，绿色灵珠会跟着移动。被打中会掉血。', key:'敌人的回合要躲弹幕：用 WASD / 方向键移动绿色灵珠。被打中会掉血。'},
};
const Guide = {
  seen(k){ S.tips=S.tips||{}; return !!S.tips[k]; },
  show(k, cb){
    if(!S||Guide.seen(k)||Dodge.auto) return cb&&cb(); S.tips[k]=true;
    const t=TIPS[k], el=document.createElement('div'); el.className='tip wood'; el.innerHTML=`<span class="tip-i">💡</span><p>${FINE_POINTER?t.key:t.touch}</p><button class="btn mini">知道了</button>`;
    document.body.appendChild(el); requestAnimationFrame(()=>el.classList.add('on'));
    let done=false; const close=()=>{ if(done) return; done=true; el.classList.remove('on'); setTimeout(()=>el.remove(),250); cb&&cb(); };
    el.querySelector('button').onclick=e=>{ e.stopPropagation(); Sound.tick(); close(); }; el.onclick=close; setTimeout(close, cb?9000:7000);
  },
  // checked once a second: the first tip whose moment has come
  tick(){
    if(!S||!RT.map||UI.busy()||Dodge.auto||$('.tip')||(!S.flags.intro_done)) return;
    if(!Guide.seen('move')) return Guide.show('move');
    if(!Guide.seen('quest')) return Guide.show('quest');
    if(!Guide.seen('talk')&&RT.prompt) return Guide.show('talk');
    if(!Guide.seen('bag')&&Object.keys(S.inv).length>1) return Guide.show('bag');
    if(!Guide.seen('med')&&RT.mapId==='home'&&Math.abs(S.x-16)+Math.abs(S.y-4)<=2) return Guide.show('med');
  },
};
setInterval(()=>{ try{ Guide.tick(); }catch(e){} },1000);
// the first dodge round waits for its tip
{ const _run=Dodge.run; Dodge.run=function(pat,s,done){ if(!Guide.seen('dodge')&&!Dodge.auto) return Guide.show('dodge',()=>_run.call(Dodge,pat,s,done)); return _run.call(Dodge,pat,s,done); }; }
// phones: fold the task list down to the tracked task
{ const _hud=UI.hud; UI.hud=function(){ _hud.apply(UI,arguments); const q=$('#hQuest'); if(!q) return;
    const small=innerWidth<560; q.classList.toggle('compact', small&&!RT.hudOpen);
    if(small){ const head=q.querySelector('.qhead'); if(head&&!head.querySelector('.qfold')){ const b=document.createElement('button'); b.className='qfold'; b.textContent=RT.hudOpen?'收起':'展开';
        b.onclick=e=>{ e.stopPropagation(); Sound.tick(); RT.hudOpen=!RT.hudOpen; UI.hud(); }; head.insertBefore(b, head.querySelector('.qall')); } } }; }
addEventListener('resize',()=>{ if(S) UI.hud(); });
