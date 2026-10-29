/* ============================================================
   山海问道 · developer mode — jump anywhere, trigger any scene, cheat freely
   Turn on: add #dev to the link, tap the title 5 times, or press ` in game.
   ============================================================ */
const Dev = {
  on(){ try{ return location.hash.includes('dev') || localStorage.getItem('shanhai-dev')==='1'; }catch(e){ return location.hash.includes('dev'); } },
  enable(){ try{ localStorage.setItem('shanhai-dev','1'); }catch(e){} Dev.button(); UI.toast('开发者模式已开启'); },
  button(){ if(!Dev.on()||$('#devB')) return; const b=document.createElement('button'); b.id='devB'; b.className='wood'; b.textContent='调试'; b.setAttribute('aria-label','开发者面板');
    b.onclick=()=>{ Sound.tick(); Dev.panel(); }; $('#hud').appendChild(b); },
  // a ready-made game state for each chapter point
  ensure(){ if(!S){ RT.slot=SLOTS-1; S=newState(); S.name='测试修士'; S.look=defaultLook('m'); enterMap('home',11,6); }
    else if(!RT.map) enterMap(S.map,S.x,S.y);
    if(!$('#title').hidden){ $('#title').hidden=true; clearInterval(Creator.timer); } UI.hud(); UI.sync(); },
  setup(point){
    Dev.ensure(); const idx=id=>QUESTS.findIndex(q=>q.id===id);
    S.root=S.root||{els:['火','木','水'],n:3}; S.flags.met_ahe=true; S.flags.sect_open=true; S.flags.chest=true;
    const base=()=>{ S.inv={...S.inv, slip:1}; S.flags.intro_done=true; };
    if(point==='sect'){ S.L=10; S.exp=0; S.sect=null; S.flags.qiongqi_done=true; S.flags.tang_sect=false; S.quest=idx('sect'); S.questStarted=-1; base(); }
    if(point==='forest'){ S.L=2; S.sect=null; S.quest=idx('q4'); S.questStarted=S.quest; base(); S.inv.huichun=2; }
    if(point==='qiongqi'){ S.L=5; S.sect=null; S.quest=idx('q6'); S.questStarted=S.quest; base(); S.inv.huichun=3; S.st.kills=Math.max(S.st.kills,3); }
    if(point==='zhuji'){ S.L=9; S.exp=expNeed(9); S.sect=null; S.flags.qiongqi_done=true; S.quest=idx('q7'); S.questStarted=S.quest; base(); S.inv.zhuji=1; S.inv.huichun=3; S.inv.qq_yu=0; }
    if(point==='huli'){ S.L=10; S.exp=0; S.sect=S.sect||'jian'; S.flags.tang_sect=true; S.flags.qiongqi_done=true; S.quest=idx('q8'); S.questStarted=S.quest; base(); S.inv.huichun=4; }
    if(point==='end'){ S.L=10; S.sect=S.sect||'jian'; S.flags.tang_sect=true; S.flags.qiongqi_done=true; S.flags.chapter1_done=true; S.quest=idx('end'); S.questStarted=S.quest; base(); }
    const st=stats(); S.hp=st.hp; S.mp=st.mp; S.min=9*60;
    const at={sect:['town',12,10],forest:['forest',14,3],qiongqi:['forest',15,19],zhuji:['home',16,5],huli:['forest',15,19],end:['home',11,6]}[point];
    UI.closePanel(); $('#dlg').hidden=true; UI.dlgQ=null; enterMap(...at); UI.hud(); UI.sync(); save(); UI.toast('已跳到：'+Dev.POINTS[point]);
  },
  POINTS:{forest:'山林怪声', qiongqi:'讨伐穷奇前', zhuji:'筑基突破前', sect:'拜师大典前（已筑基）', huli:'青丘狐影前（已拜师）', end:'第一章结束'},
  panel(){
    Dev.ensure();
    const sel=(id,opts,cur)=>`<select id="${id}">${opts.map(([v,t])=>`<option value="${v}" ${String(v)===String(cur)?'selected':''}>${t}</option>`).join('')}</select>`;
    const realms=[...Array(13)].map((_,L)=>[L,realmName(L)]);
    const sects=[['','（无）'],...Object.entries(SECTS).map(([k,s])=>[k,s.name])];
    UI.panel('开发者面板', `
      <div class="dev"><button class="btn main" id="dvReview">审查节点（每个节点都有直达链接）</button><h4>跳到剧情节点</h4><div class="devg">${Object.entries(Dev.POINTS).map(([k,t])=>`<button class="btn mini" data-pt="${k}">${t}</button>`).join('')}</div>
      <h4>直接体验</h4><div class="devg">
        <button class="btn mini" data-x="cine_qiongqi">穷奇登场动画</button><button class="btn mini" data-x="cine_huli">九尾狐登场动画</button><button class="btn mini" data-x="cine_taotie">饕餮登场动画</button>
        <button class="btn mini" data-x="fight_qiongqi">打穷奇</button><button class="btn mini" data-x="fight_huli">打九尾狐</button><button class="btn mini" data-x="fight_wild">打一只野兽</button>
        <button class="btn mini" data-x="xinmo">心魔+天劫</button><button class="btn mini" data-x="tianjie">只玩天劫</button>
        <button class="btn mini" data-x="alchemy">炼丹小游戏</button><button class="btn mini" data-x="fish">钓鱼小游戏</button>
        <button class="btn mini" data-x="root">测灵根</button><button class="btn mini" data-x="ceremony">拜师大典</button><button class="btn mini" data-x="tame">收服灵宠</button>
        <button class="btn mini" data-x="heart_tang">小棠心动事件</button><button class="btn mini" data-x="heart_ge">长歌心动事件</button>
        ${QIYU.map(q=>`<button class="btn mini" data-qy="${q.id}">奇遇：${q.title}</button>`).join('')}
        ${['tang','ge'].map(id=>[2,4,6,8].map(lv=>`<button class="btn mini" data-x="cg:${id}:${lv}">${NPCS[id].name}${lv}♥ ${HEART_CG[id][lv].title}</button>`).join('')).join('')}
        <button class="btn mini" data-x="glow">刷新金光水面</button></div>
      <h4>修改状态</h4><div class="devrow"><label>境界 ${sel('dvL',realms,S.L)}</label><label>门派 ${sel('dvSect',sects,S.sect||'')}</label>
        <label>灵根 ${sel('dvRoot',[[1,'天灵根'],[2,'双灵根'],[3,'三灵根'],[4,'伪灵根']],S.root?S.root.n:3)}</label></div>
      <div class="devg"><button class="btn mini" data-c="items">所有物品 ×10</button><button class="btn mini" data-c="stones">灵石 +1000</button><button class="btn mini" data-c="heal">回满状态</button>
        <button class="btn mini" data-c="hearts">好感全满</button><button class="btn mini" data-c="god">${Dev.god?'关闭':'开启'}无敌</button><button class="btn mini" data-c="seen">图鉴全开</button><button class="btn mini" data-x="bosslow">战斗中：Boss 只剩一成血</button></div>
      <h4>时间与地点</h4><div class="devg"><button class="btn mini" data-t="6">清晨</button><button class="btn mini" data-t="12">中午</button><button class="btn mini" data-t="18">傍晚</button><button class="btn mini" data-t="22">深夜</button>
        <button class="btn mini" data-c="day">下一天</button>${Object.keys(MAPS).map(m=>`<button class="btn mini" data-map="${m}">去${MAPS[m].name.replace(/.*· /,'')}</button>`).join('')}</div>
      <p class="muted">提示：在链接后面加 #dev，或在标题画面连点「山海问道」5 次即可打开开发者模式。测试会自动用第 ${SLOTS} 个存档位。</p></div>`, b=>{
      $('#dvReview').onclick=()=>{ UI.closePanel(); Review.hub(); };
      b.querySelectorAll('[data-pt]').forEach(x=>x.onclick=()=>Dev.setup(x.dataset.pt));
      b.querySelectorAll('[data-x]').forEach(x=>x.onclick=()=>{ UI.closePanel(); Dev.run(x.dataset.x); });
      b.querySelectorAll('[data-qy]').forEach(x=>x.onclick=()=>{ UI.closePanel(); const ev=QIYU.find(q=>q.id===x.dataset.qy); UI.say(ev.run()); });
      b.querySelectorAll('[data-c]').forEach(x=>x.onclick=()=>{ Dev.cheat(x.dataset.c); UI.closePanel(); Dev.panel(); });
      b.querySelectorAll('[data-t]').forEach(x=>x.onclick=()=>{ S.min=+x.dataset.t*60; UI.hud(); Music.play(areaTheme()); UI.toast('时间已调整'); });
      b.querySelectorAll('[data-map]').forEach(x=>x.onclick=()=>{ const m=x.dataset.map, at={home:[11,6],town:[12,11],forest:[14,2]}[m]; UI.closePanel(); enterMap(m,...at); UI.sync(); });
      $('#dvL').onchange=e=>{ S.L=+e.target.value; S.exp=0; const st=stats(); S.hp=st.hp; S.mp=st.mp; UI.hud(); };
      $('#dvSect').onchange=e=>{ S.sect=e.target.value||null; if(S.sect){ S.flags.sect_open=true; if(S.sect==='tianji') Sect.newDay(); } UI.hud(); };
      $('#dvRoot').onchange=e=>{ const n=+e.target.value; S.root={els:Object.keys(ELEMENTS).sort(()=>Math.random()-.5).slice(0,n),n}; UI.hud(); };
    });
  },
  cheat(c){
    if(c==='items'){ for(const k of ['rod','huichun','juqi','zhuji','lingcao','lingmo','zhuguo','flower','wine','hide','qq_yu','hu_wei','fish_li','fish_yin']) addItem(k, k==='rod'?1-(S.inv.rod||0):10); }
    if(c==='stones'){ S.stones+=1000; }
    if(c==='heal'){ const st=stats(); S.hp=st.hp; S.mp=st.mp; }
    if(c==='hearts'){ for(const k in NPCS) Social.rel(k).pts=1000; }
    if(c==='god'){ Dev.god=!Dev.god; }
    if(c==='seen'){ for(const k in BEASTS) S.seen[k]=2; }
    if(c==='day'){ sleep(false); }
    UI.hud(); save();
  },
  run(x){
    Dev.ensure();
    if(x.startsWith('cg:')){ const [,id,lv]=x.split(':'); const r=Social.rel(id); r.pts=Math.max(r.pts,+lv*100); for(const l of [2,4,6,8]) r.ev[l]=l<+lv; return Social.chat(id); }
    if(x==='bosslow') return Dev.bossLow();
    if(x==='glow'){ S.glow=undefined; return UI.toast('金光水面已刷新（桃源镇池塘、青丘湖各一处）'); }
    if(x==='puppet'){ addItem('puppet'); Life.newDay(); return UI.toast('傀儡已就位，下一天清晨开始工作'); }
    if(x.startsWith('cine_')) return Cine.play(x.slice(5), ()=>Music.play(areaTheme()));
    if(x==='fight_qiongqi'||x==='fight_huli'){ const st=stats(); S.hp=st.hp; S.mp=st.mp; return Battle.start(x.slice(6), ()=>{}); }
    if(x==='fight_wild'){ const k=['dangkang','xingxing','guidiao'][Math.floor(Math.random()*3)]; return Battle.start(k, r=>{ if(r==='win') Sect.tame(k); }); }
    if(x==='xinmo'){ S.inv.zhuji=(S.inv.zhuji||0)+1; if(S.L<9){ S.L=9; } S.exp=expNeed(9); return Mini.breakthrough(); }
    if(x==='tianjie') return Mini.tribulation(ok=>UI.toast(ok?'渡劫成功（测试）':'渡劫失败（测试）'));
    if(x==='alchemy') return Mini.alchemy(RECIPES[0], g=>UI.toast('结果：'+{top:'上品',mid:'中品',low:'下品',fail:'炸炉'}[g]));
    if(x==='fish'){ if(!S.inv.rod) addItem('rod'); return Mini.fish(); }
    if(x==='root'){ S.root=null; return Sect.rootTest(()=>UI.toast('灵根：'+Sect.rootName())); }
    if(x==='ceremony'){ S.sect=null; S.flags.sect_open=true; return Sect.altar(); }
    if(x==='tame'){ const was=S.sect; S.sect='shou'; Sect.tame(['dangkang','xingxing','guidiao'][Math.floor(Math.random()*3)], ()=>{ S.sect=was; UI.hud(); }); return; }
    if(x==='heart_tang'||x==='heart_ge'){ const id=x.slice(6), r=Social.rel(id); r.pts=Math.max(r.pts,450); r.ev={}; return Social.chat(id); }
  },
};
// for testing a fight's end without playing it all: the enemy down to a tenth of its life (its own rules — 九尾狐 coming,
// the pulling of 饕餮's soul — still apply on the next blow); on the battle screen in review saves and in dev mode
Dev.bossLow=function(){ const s=Battle.s; if(!s) return UI.toast('现在不在战斗中'); s.hp=Math.max(1,Math.round(s.max*.1)); Battle.ui(); UI.toast(`${s.B.name} 只剩一成血了，再打一下`); };
{ const _b=Battle._begin; Battle._begin=function(){ const r=_b.apply(Battle,arguments);
    if(Dev.on()||(S&&S.review)){ const top=$('#battle .b-top'); if(top&&!$('#devBoss')){ const b=document.createElement('button'); b.id='devBoss'; b.className='btn mini'; b.textContent='测试：Boss 一成血'; b.style.cssText='position:absolute;right:8px;top:100%;margin-top:4px;z-index:5;opacity:.85'; b.onclick=e=>{ e.stopPropagation(); Dev.bossLow(); }; top.style.position=top.style.position||'relative'; top.appendChild(b); } }
    return r; }; }
// invincibility for testing
{ const _end=Battle.enemyTurn; Battle.enemyTurn=function(){ const r=_end.apply(this,arguments); if(Dev.god){ setTimeout(()=>{ const st=stats(); S.hp=st.hp; if(Battle.s) Battle.ui(); },700); } return r; }; }
// ways in: #dev, five taps on the title, or the ` key
addEventListener('keydown', e=>{ if(e.code==='Backquote'){ e.preventDefault(); if(!Dev.on()) Dev.enable(); if(S&&$('#title').hidden) Dev.panel(); } });
{ let taps=0, tt=0; document.addEventListener('click', e=>{ if(!e.target.closest('#title h1')) return; taps++; clearTimeout(tt); tt=setTimeout(()=>taps=0,1500);
  if(taps>=5){ taps=0; Dev.enable(); const t=$('#title .tnote'); if(t) t.innerHTML='开发者模式已开启。<button class="btn mini" id="devGo">直接进入测试</button>'; const g=$('#devGo'); if(g) g.onclick=()=>{ Dev.ensure(); Dev.panel(); }; } }); }

Dev.button();
