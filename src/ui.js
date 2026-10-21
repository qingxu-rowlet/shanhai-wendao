/* ============================================================
   山海问道 · UI: HUD, dialogue, menus, shop, alchemy, battle, story, sound
   ============================================================ */
const isRod=id=>id==='rod'||id==='rod_bamboo';   // the plain rod or the 青竹钓竿
const $=(s,el=document)=>el.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ICONC={};
function iconURL(key,color){ const k=key+(color||''); if(ICONC[k]) return ICONC[k]; return ICONC[k]=sprite(key,color).toDataURL(); }
function itemIcon(id){ const it=ITEMS[id]; return `<img class="px" alt="" src="${iconURL(it.icon,it.color)}">`; }
function fmtTime(min){ const h=Math.floor(min/60)%24, m=Math.floor(min%60/10)*10; const tag=h<5?'凌晨':h<11?'上午':h<13?'中午':h<18?'下午':'晚上'; const hh=h%12===0?12:h%12; return `${tag} ${hh}:${String(m).padStart(2,'0')}`; }

/* ---------- sound ---------- */
const Sound = (()=>{
  let ac=null;
  const ok=()=>{ if(S&&S.mute) return null; try{ ac=ac||new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); }catch(e){ return null; } return ac; };
  const tone=(f,dur,type='triangle',vol=.15,slide=0,delay=0)=>{ const a=ok(); if(!a) return; const t=a.currentTime+delay, o=a.createOscillator(), g=a.createGain();
    o.type=type; o.frequency.setValueAtTime(f,t); if(slide) o.frequency.exponentialRampToValueAtTime(f*slide,t+dur);
    g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+dur); o.connect(g).connect(a.destination); o.start(t); o.stop(t+dur+.02); };
  return { unlock(){ ok(); }, tick(){ tone(880,.04,'square',.04); }, coin(){ tone(988,.08,'square',.06); tone(1319,.15,'square',.06,0,.07); },
    pick(){ tone(660,.08); tone(990,.12,'triangle',.12,0,.06); }, dig(){ tone(160,.12,'sawtooth',.08,.6); }, water(){ tone(500,.25,'sine',.08,.5); },
    step(){ tone(300,.06,'sine',.05); }, hit(){ tone(220,.12,'square',.12,.5); }, hurt(){ tone(140,.2,'sawtooth',.12,.6); },
    magic(){ tone(520,.25,'sine',.12,2); tone(780,.3,'triangle',.08,1.5,.05); }, guard(){ tone(330,.2,'triangle',.1,1.2); },
    levelup(){ [523,659,784,1047].forEach((f,i)=>tone(f,.25,'triangle',.12,0,i*.1)); }, talk(){ tone(600+Math.random()*120,.03,'square',.025); } };
})();

/* ---------- story & quests ---------- */
const Story = {
  quest(){ return QUESTS[S.quest]; },
  check(){
    if(typeof Replay!=='undefined'&&Replay.active) return;
    if(UI.busy()) { Story._pending=true; return; }
    Story._pending=false;
    const q=Story.quest(); if(!q) return;
    if(S.questStarted!==S.quest){ S.questStarted=S.quest; UI.hud(); if(q.start){ UI.say(SCRIPTS[q.start]); return; } }
    if(q.check(S)){
      if(q.id==='sect'&&S.questBack!=null){ S.quest=S.questBack; delete S.questBack; } else S.quest++; UI.hud(); UI.toast('完成：'+q.title); save();
      if(q.done) UI.say(SCRIPTS[q.done]); else Story.check();
    }
  },
  talk(id){
    const q=Story.quest()?.id;
    if(id==='qian'){ if(Story.side('qian', ()=>Social.menu('qian'))) return; return Social.menu('qian'); }   // the shop is one of his options, not where every talk ends
    if(id==='tang'||id==='ge'){ if(Story.side(id)) return; return Social.menu(id); }
    if(id==='ahe'){
      if(q==='q3'&&!S.flags.met_ahe) return UI.say(SCRIPTS.ahe_q3);
      if(Story.side('ahe')) return;
      if(S.flags.qiongqi_done&&!S.flags.ahe_gift){ S.flags.ahe_gift=true; return UI.say(SCRIPTS.talk_ahe_after); }
      return Social.menu('ahe');
    }
    if(id==='yunyou'){ if(Story.side('yunyou')) return; return Social.menu('yunyou'); }
    if(Story.side(id)) return;            // sect masters and anyone else: their side quest first,
    if(NPCS[id]) return Social.menu(id);  // then chat / gifts
  },
  shrine(){
    const q=Story.quest()?.id;
    const off=SIDES.find(x=>x.id==='offering'); if(S.side.offering==='active' && sideReady(S,off)) return Story.finishSide(off);
    if(q==='q6'&&!S.flags.qiongqi_done) return UI.say(SCRIPTS.qiongqi_meet);
    if(q==='q8') return UI.say(SCRIPTS.huli_meet);
    UI.say([['旁白', S.flags.huli_friend?'狐祠里飘着淡淡的狐火，暖暖的。':'青丘狐祠。香炉里还有余温。']]);
  }
};

/* ---------- battle ---------- */
const Battle = {
  start(kind, cb){
    const B=BEASTS[kind];
    if(B.boss && typeof SCENES!=='undefined' && SCENES[kind]) Cine.play(kind, ()=>Battle._begin(kind,cb));
    else Battle._begin(kind,cb);
  },
  actsHTML(B){
    const sc=S.sect&&SECTS[S.sect];
    return `<button data-a="atk">剑击</button><button data-a="skill">御剑术<small>8灵力</small></button>${sc?`<button data-a="sect" class="sectb">${sc.skill.name}<small>${sc.skill.mp}灵力</small></button>`:''}
      <button data-a="guard">护体</button><button data-a="pill">丹药</button><button data-a="flee" ${B.boss?'disabled':''}>${B.boss?'—':'遁走'}</button>`;
  },
  _begin(kind, cb){
    const B=BEASTS[kind], st=stats();
    if(B.self){ B.hp=Math.round(st.hp*1.4); B.atk=Math.round(st.atk*.85); B.def=Math.round(st.def*.8); }
    S.seen[kind]=S.seen[kind]||1;
    Battle.s={kind, B, hp:B.hp, max:B.hp, i:0, moves:B.moves, cb, guard:false, charmed:false, stun:0, burn:0, over:false};
    const el=$('#battle'); el.hidden=false; el.className='battle '+(B.boss?'boss':'');
    el.innerHTML=`<div class="b-top"><div class="b-name">${B.name}${B.boss?'<small>首领</small>':''}</div><div class="hpbar"><i id="bEhp"></i></div></div>
      <div class="b-stage"><div class="b-intent" id="bIntent"></div><canvas id="bEnemy" class="px${B.self?' self':''}"></canvas><div class="b-floats" id="bFloats"></div></div>
      <div class="b-log" id="bLog"></div>
      <div class="b-panel wood">
        <div class="b-me"><b>${realmName(S.L)}${S.pet?` · 灵宠 ${BEASTS[S.pet.kind].name} Lv${S.pet.lv}`:''}</b><span>生命</span><div class="hpbar me"><i id="bPhp"></i></div><em id="bPhpT"></em>
          <span>灵力</span><div class="hpbar mp"><i id="bPmp"></i></div><em id="bPmpT"></em></div>
        <div class="b-acts">${Battle.actsHTML(B)}</div>
      </div>`;
    const c=$('#bEnemy'), sp=B.self?lookSprite(S.look,'down',0):sprite(B.spr); c.width=sp.width; c.height=sp.height; c.getContext('2d').drawImage(sp,0,0);
    c.style.width=(B.self?sp.width*9:B.big?Math.min(innerWidth*.8, sp.width*7):sp.width*9)+'px';
    el.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>Battle.act(b.dataset.a));
    if(B.boss && typeof SCENES!=='undefined' && SCENES[kind]) BossBg.start(kind); else Music.play(B.self?'qiongqi':'battle');
    Battle.log(B.self?'另一个你冷冷地看着你。':`${B.name}出现了！`); Battle.ui(); UI.sync();
  },
  intent(){ const s=Battle.s; return s.moves[s.i%s.moves.length]; },
  ui(){
    const s=Battle.s, st=stats();
    $('#bEhp').style.width=Math.max(0,s.hp/s.max*100)+'%';
    $('#bPhp').style.width=Math.max(0,S.hp/st.hp*100)+'%'; $('#bPhpT').textContent=`${Math.max(0,Math.ceil(S.hp))}/${st.hp}`;
    $('#bPmp').style.width=Math.max(0,S.mp/st.mp*100)+'%'; $('#bPmpT').textContent=`${S.mp}/${st.mp}`;
    const it=Battle.intent(), a=s.B.atk;
    const txt={atk:`攻击 · 约 ${Math.max(1,a-st.def)}`, double:`连击 ×2`, charge:'蓄力中……', big:`重击！约 ${Math.round(a*2.4)}（快护体）`, roar:'怒吼（震散灵力）',
      charm:'魅惑（护体可抵挡）', fire:`狐火 · 约 ${Math.round(a*1.6)}`, wind:`风刃 · 约 ${Math.round(a*1.3)}（护体只挡一半）`}[it];
    $('#bIntent').textContent=(s.stun?'被定身 · ':'')+txt+(s.burn?`　灼烧×${s.burn}`:''); $('#bIntent').className='b-intent'+(!s.stun&&(it==='big'||it==='charm')?' warn':'');
    const sk=$('#battle').querySelector('[data-a="skill"]'); if(sk) sk.disabled=S.mp<8;
    const sb=$('#battle').querySelector('[data-a="sect"]'); if(sb) sb.disabled=S.mp<SECTS[S.sect].skill.mp;
  },
  log(t){ $('#bLog').textContent=t; },
  float(t,cls){ const f=document.createElement('div'); f.className='b-float '+(cls||''); f.textContent=t; $('#bFloats').appendChild(f); setTimeout(()=>f.remove(),900); },
  hitFx(){ const en=$('#bEnemy'); en.classList.remove('hit'); void en.offsetWidth; en.classList.add('hit'); },
  act(a){
    const s=Battle.s; if(!s||s.over||s.busy) return; const st=stats(); s.guard=false;
    if(s.charmed){ s.charmed=false; Battle.log('你被魅惑，心神恍惚，这一回合什么也做不了……'); return Battle.enemyTurn(); }
    if(a==='pill') return Battle.pillMenu();
    if(a==='flee'){ if(s.B.boss) return; if(Math.random()<.65){ Battle.end('flee'); return; } Battle.log('没能逃掉！'); return Battle.enemyTurn(); }
    if(a==='guard'){ s.guard=true; S.mp=Math.min(st.mp,S.mp+5); Sound.guard(); Battle.log('你运转灵力护住全身。（灵力 +5）'); return Battle.enemyTurn(); }
    const rnd=()=>0.9+Math.random()*.2, def=s.B.def; let dmg=0, msg='';
    if(a==='skill'){ if(S.mp<8) return; S.mp-=8; dmg=st.atk*2.2*Sect.spellMul()*rnd()-def/4; Sound.magic(); msg='御剑术！飞剑化作一道青光。'; }
    else if(a==='sect'){ const sc=SECTS[S.sect]; if(!sc||S.mp<sc.skill.mp) return; S.mp-=sc.skill.mp; Sound.magic();
      if(S.sect==='jian'){ dmg=st.atk*3*Sect.spellMul()*rnd()-def/4; msg='万剑归宗！漫天剑雨倾泻而下！'; BossBg.flash('rgba(170,210,255,.55)'); }
      if(S.sect==='dan'){ dmg=st.atk*1.6*Sect.spellMul()*rnd(); s.burn=3; msg='丹火！敌人被金色的火焰缠住了。'; BossBg.flash('rgba(255,170,60,.45)'); }
      if(S.sect==='shou'){ dmg=(S.pet?st.atk*(1+(S.pet.lv-1)*.15):st.atk)*2.4*rnd()-def/3; msg=S.pet?`兽魂共鸣！${BEASTS[S.pet.kind].name}全力扑了上去！`:'没有灵宠……你学着野兽的样子扑了上去！'; }
      if(S.sect==='tianji'){ const ok=!s.B.boss||Math.random()<.65; dmg=st.atk*1.8*Sect.spellMul()*rnd()-def/4; if(ok){ s.stun=1; msg='定身符！敌人动弹不得。'; } else msg='定身符被一股妖力震碎了！'; BossBg.flash('rgba(200,160,255,.45)'); } }
    else { dmg=st.atk*rnd()-def/2; Sound.hit(); msg='你挥剑斩去。'; }
    const crit=Math.random()<Sect.crit(); if(crit){ dmg*=1.8; msg+=' 暴击！'; }
    dmg=Math.max(1,Math.round(dmg)); s.hp-=dmg; Battle.float((crit?'暴击 ':'')+'-'+dmg, crit?'crit':''); Battle.hitFx();
    if(S.pet && s.hp>0){ const pd=Sect.petAtk(); s.hp-=pd; msg+=` ${BEASTS[S.pet.kind].name}追加攻击 ${pd}。`; setTimeout(()=>Battle.float('-'+pd,'pet'),260); }
    Battle.log(msg); Battle.phaseCheck(); Battle.ui();
    if(s.hp<=0){ s.busy=true; s.dead=true; return setTimeout(()=>Battle.end('win'),500); }
    Battle.enemyTurn();
  },
  phaseCheck(){ const s=Battle.s, p=s.B.phase2; if(p && !s.phase2 && s.hp>0 && s.hp<=s.max*p.at){ s.phase2=true; s.moves=p.moves; s.i=0;
    BossBg.flash('rgba(255,255,255,.75)'); Music.stinger('boss'); const n=$('#battle .b-name'); if(n) n.classList.add('enraged'); setTimeout(()=>{ if(Battle.s===s) Battle.log(p.line); },500); } },
  pillMenu(){
    const box=$('#battle .b-acts'); const pills=['huichun','juqi'].filter(p=>S.inv[p]);
    if(!pills.length){ Battle.log('身上没有能用的丹药。'); return; }
    box.innerHTML=pills.map(p=>`<button data-p="${p}">${itemIcon(p)}${ITEMS[p].name}<small>×${S.inv[p]}</small></button>`).join('')+'<button data-p="">返回</button>';
    box.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{ const p=b.dataset.p; Battle.restoreActs(); if(!p) return;
      addItem(p,-1); const st=stats(), heal=Math.round(60*(S.sect==='dan'?1.5:1));
      if(p==='huichun'){ S.hp=Math.min(st.hp,S.hp+heal); Battle.log(`服下回春丹，生命恢复 ${heal}。`); }
      if(p==='juqi'){ S.mp=st.mp; Battle.log('服下聚气丹，灵力充盈。'); }
      Sound.magic(); Battle.ui(); Battle.enemyTurn(); });
  },
  restoreActs(){ const box=$('#battle .b-acts'); box.innerHTML=Battle.actsHTML(Battle.s.B); box.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>Battle.act(b.dataset.a)); Battle.ui(); },
  enemyTurn(){
    const s=Battle.s; s.busy=true; Battle.ui();
    setTimeout(()=>{
      if(Battle.s!==s||s.dead) return; // battle ended meanwhile
      const st=stats(), it=Battle.intent(), a=s.B.atk; let dmg=0, msg='';
      const hurt=(raw,pierce,guardMul=.35)=>{ let d=Math.max(1,Math.round(raw*(0.9+Math.random()*.2)-(pierce?0:st.def))); if(s.guard) d=Math.max(1,Math.round(d*guardMul)); return d; };
      if(s.stun){ s.stun=0; msg=`${s.B.name}被定身符定住，动弹不得！`; }
      else {
        if(it==='atk'){ dmg=hurt(a); msg=`${s.B.name}扑了过来！`; }
        if(it==='double'){ dmg=hurt(a*.65)+hurt(a*.65); msg=`${s.B.name}连续抓挠！`; }
        if(it==='charge'){ msg=`${s.B.name}伏低身子，蓄积力量……`; }
        if(it==='big'){ dmg=hurt(a*2.4); msg=s.guard?`${s.B.name}猛扑！被你的护体挡下大半。`:`${s.B.name}全力猛扑！`; if(s.B.boss) BossBg.flash('rgba(255,60,40,.35)'); }
        if(it==='roar'){ S.mp=Math.max(0,S.mp-6); msg=`${s.B.name}一声怒吼，震散了你 6 点灵力！`; }
        if(it==='charm'){ if(s.guard) msg=`${s.B.name}眼波流转……你守住了心神。`; else { s.charmed=true; msg=`${s.B.name}眼波流转……你心神一荡！（下回合无法行动）`; } }
        if(it==='fire'){ dmg=hurt(a*1.6,true); msg='幽蓝的狐火扑面而来！'; if(s.B.boss) BossBg.flash('rgba(120,170,255,.35)'); }
        if(it==='wind'){ dmg=hurt(a*1.3,false,.6); msg='风刃呼啸而来！'; if(s.B.boss) BossBg.flash('rgba(230,240,230,.35)'); }
        s.i++;
      }
      if(dmg){ S.hp-=dmg; Sound.hurt(); $('#battle').classList.remove('shake'); void $('#battle').offsetWidth; $('#battle').classList.add('shake'); Battle.float('-'+dmg,'me'); }
      let tail='';
      if(s.burn>0 && s.hp>0){ const bd=Math.max(1,Math.round(st.atk*.6)); s.hp-=bd; s.burn--; tail=` 丹火灼烧 ${bd}。`; setTimeout(()=>Battle.float('-'+bd,'burn'),200); }
      Battle.log(msg+(dmg?`（-${dmg}）`:'')+tail); s.busy=false; Battle.phaseCheck(); Battle.ui();
      if(s.hp<=0){ s.busy=true; s.dead=true; return setTimeout(()=>Battle.end('win'),500); }
      if(S.hp<=0){ S.hp=0; setTimeout(()=>Battle.end('lose'),600); }
    },650);
  },
  end(result){
    const s=Battle.s; if(!s||s.over) return; s.over=true; const B=s.B; const lines=[];
    if(result==='win'){
      S.seen[s.kind]=2; Music.stinger('win');
      const stones=Math.round((B.stones[0]+Math.floor(Math.random()*(B.stones[1]-B.stones[0]+1)))*Sect.stoneMul()); S.stones+=stones; Sound.coin();
      lines.push(`击败了${B.name}！`, `修为 +${B.exp}`); if(stones) lines.push(`灵石 +${stones}`);
      if(B.drop&&Math.random()<B.drop[1]){ addItem(B.drop[0]); lines.push(`获得 ${ITEMS[B.drop[0]].name}`); }
      if(S.pet&&!B.self) Sect.petXp();
    }
    const el=$('#battle');
    if(result==='win'){
      el.querySelector('.b-panel').innerHTML=`<div class="b-result"><b>胜利</b>${lines.slice(1).map(l=>`<span>${l}</span>`).join('')}<button class="btn main" id="bOk">继续</button></div>`;
      $('#bOk').onclick=()=>{ Battle.close(); if(B.exp) gainExp(B.exp); s.cb&&s.cb('win'); };
      $('#bEnemy').classList.add('gone');
    } else { if(result==='lose'){ const st=stats(); S.hp=Math.round(st.hp*.5); } Battle.close(); s.cb&&s.cb(result); }
  },
  close(){ $('#battle').hidden=true; Battle.s=null; BossBg.stop(); Music.play(areaTheme()); UI.sync(); UI.hud(); }
};

/* ---------- UI ---------- */
const UI = {
  dlgQ:null,
  busy(){ return !!(!$('#dlg').hidden || !$('#panel').hidden || !$('#battle').hidden || !$('#title').hidden || UI.fx); },
  sync(){ RT.paused=UI.busy(); if(!RT.paused && Story._pending) Story.check(); },
  hud(){
    if(!S) return; const st=stats(), q=QUESTS[S.quest];
    $('#hRealm').textContent=realmName(S.L);
    $('#hExp').style.width=Math.min(100,S.exp/expNeed(S.L)*100)+'%';
    $('#hStones').textContent=S.stones;
    const list=Nav.list();
    $('#hQuest').innerHTML=`<div class="qhead"><b>任务</b><button class="qall" id="qAll">全部（J）</button></div>`+list.map(t=>`<div class="qrow${(S.track||'main')===t.key?' on':''}" data-trk="${t.key}" role="button" tabindex="0">
      <span class="qk ${t.kind}">${t.kind==='main'?'主线':t.kind==='avail'?'可接':'支线'}</span><div class="qt"><b>${esc(t.title)}</b>${t.progress?`<span>${esc(t.progress)}</span>`:''}</div>
      ${t.target?`<button class="qgo" data-qgo="${t.key}" aria-label="寻路：${esc(t.title)}">寻路</button>`:''}</div>`).join('');
    $('#qAll').onclick=e=>{ e.stopPropagation(); Sound.tick(); UI.tasks(); };
    $('#hQuest').querySelectorAll('[data-trk]').forEach(r=>r.onclick=e=>{ if(e.target.closest('.qgo')) return; Sound.tick(); S.track=r.dataset.trk; RT.navT=0; UI.hud(); });
    $('#hQuest').querySelectorAll('[data-qgo]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); Sound.tick(); S.track=b.dataset.qgo; RT.navT=0; UI.hud(); Nav.go(); });
    UI.clock(); UI.hotbar(); UI.musicBtn&&UI.musicBtn();
  },
  clock(){ if(!S) return; const st=stats(); $('#hHp').style.width=Math.max(0,S.hp/st.hp*100)+'%'; $('#hMp').style.width=Math.max(0,S.mp/st.mp*100)+'%'; $('#hHpT').textContent=`${Math.ceil(S.hp)}/${st.hp}`; $('#hMpT').textContent=`${S.mp}/${st.mp}`; $('#hDay').textContent=`第 ${S.day} 天`; $('#hTime').textContent=fmtTime(S.min);
    const h=S.min/60; $('#hSun').className='sun '+(h>=18||h<6?'moon':''); },
  // three quick slots: what you put there stays; a slot whose item ran out is refilled with the next default (best rod, then pills)
  hotbarItems(){ const has=id=>id&&S.inv[id]>0;
    if(!Array.isArray(S.bar)) S.bar=[null,null,null];
    const defs=[S.inv.rod_bamboo?'rod_bamboo':'rod','huichun','juqi',S.inv.rod_bamboo?'rod':null].filter(has);
    for(let i=0;i<3;i++){ if(has(S.bar[i])) continue; const d=defs.find(id=>!S.bar.includes(id)&&!(isRod(id)&&S.bar.some(isRod))); S.bar[i]=d||null; }
    return S.bar.filter(has); },
  barable(id){ const it=ITEMS[id]; return !!(it&&(it.tool||it.use)); },
  putInBar(id,i){ if(!Array.isArray(S.bar)) UI.hotbarItems(); const j=S.bar.indexOf(id); if(j>=0) S.bar[j]=S.bar[i]; S.bar[i]=id; if(isRod(S.sel)&&isRod(id)) S.sel=id; UI.hotbar(); save&&save(); },
  hotbar(){
    const ids=UI.hotbarItems(); if(!ids.includes(S.sel)) S.sel=ids[0]||'';
    $('#hotbar').hidden=!ids.length;
    $('#hotbar').innerHTML=ids.map((id,i)=>`<button class="slot${S.sel===id?' on':''}" data-id="${id}" aria-label="${ITEMS[id].name}">${itemIcon(id)}${ITEMS[id].tool?'':`<b>${S.inv[id]}</b>`}<kbd>${i+1}</kbd></button>`).join('');
    $('#hotbar').querySelectorAll('.slot').forEach(b=>b.onclick=()=>UI.selectItem(b.dataset.id));
  },
  pickSlot(i){ const id=UI.hotbarItems()[i]; if(id) UI.selectItem(id); },
  selectItem(id){ Sound.tick(); const it=ITEMS[id];
    if(it.use){ if(S.sel===id){ UI.useItem(id); return; } S.sel=id; UI.hotbar(); UI.toast(it.name+'：再点一次服用'); return; }
    S.sel=S.sel===id&&isRod(id)?'':id; UI.hotbar(); UI.toast(S.sel?it.name+(isRod(id)?'：靠近水边，点水面或按 E 钓鱼':''):'收起了'+it.name); },
  useItem(id){ const it=ITEMS[id]; if(!S.inv[id]) return; addItem(id,-1); Sound.magic();
    if(it.use==='exp'){ gainExp(it.amount); UI.toast(`服下${it.name}，修为 +${it.amount}`); }
    if(it.use==='heal'){ const st=stats(); S.hp=Math.min(st.hp,S.hp+it.amount*(S.sect==='dan'?1.5:1)); UI.toast(`服下${it.name}，生命恢复`); }
    UI.hud(); },
  toast(t){ const el=$('#toast'); el.textContent=t; el.classList.remove('on'); void el.offsetWidth; el.classList.add('on'); clearTimeout(UI._tt); UI._tt=setTimeout(()=>el.classList.remove('on'),1800); },
  float(x,y,t){ const Z=RT.scale; const el=document.createElement('div'); el.className='wfloat'; el.textContent=t;
    el.style.left=((x+.5)*TILE-RT.cam.x)*Z+'px'; el.style.top=(y*TILE-RT.cam.y)*Z+'px'; document.body.appendChild(el); setTimeout(()=>el.remove(),1200); },
  banner(t){ const el=$('#banner'); el.textContent=t; el.classList.remove('on'); void el.offsetWidth; el.classList.add('on'); },
  mapName(t){ const el=$('#mapname'); el.textContent=t; el.classList.remove('on'); void el.offsetWidth; el.classList.add('on'); },

  /* dialogue runner */
  say(steps, cb){ UI.dlgQ={steps:[...steps], i:0, cb}; $('#dlg').hidden=false; UI.sync(); UI.next(); },
  next(){
    const q=UI.dlgQ; if(!q) return;
    while(q.i<q.steps.length){
      const st=q.steps[q.i++];
      if(Array.isArray(st)) return UI.line(st[0],st[1]);
      if(CG.replaying && (st.give||st.love||st.flag||st.exp||st.stones)) continue;
      if(st.cg){ CG.open(st.cg, st.who, st.title); continue; }
      if(st.face){ CG.setFace(st.face); continue; }
      if(st.cgscene){ CG.setScene(st.cgscene); continue; }
      if(st.cgend){ CG.close(); CG.replaying=false; continue; }
      if(st.love){ for(const k in st.love) Social.add(k, st.love[k]); Sound.pick(); continue; }
      if(st.give||st.stones||st.exp){
        const got=[]; let s2=st;
        while(true){
          if(s2.give){ for(const k in s2.give){ addItem(k,s2.give[k]); got.push(`${ITEMS[k].name} ×${s2.give[k]}`); } }
          if(s2.stones){ S.stones+=s2.stones; got.push(`灵石 ×${s2.stones}`); }
          if(s2.exp){ gainExp(s2.exp); got.push(`修为 +${s2.exp}`); }
          const nx=q.steps[q.i]; if(nx&&!Array.isArray(nx)&&(nx.give||nx.stones||nx.exp)&&!CG.replaying){ s2=nx; q.i++; } else break;
        }
        Sound.coin(); UI.hud(); return UI.line('获得', '✦ '+got.join('　✦ '));
      }
      if(st.flag){ S.flags[st.flag]=true; continue; }
      if(st.run){ if(!CG.replaying) st.run(); continue; }
      if(st.go){ q.steps=[...SCRIPTS[st.go]]; q.i=0; continue; }
      if(st.end){ q.i=q.steps.length; break; }
      if(st.roottest){ $('#dlg').hidden=true; Sect.rootTest(()=>{ $('#dlg').hidden=false; UI.sync(); UI.next(); }); return; }
      if(st.cine){ $('#dlg').hidden=true; Cine.play(st.cine, ()=>{ $('#dlg').hidden=false; UI.sync(); UI.next(); }); return; }
      if(st.choice) return UI.choice(st);
      if(st.battle){ const after=st; $('#dlg').hidden=true; UI.dlgQ=null; Battle.start(st.battle, r=>{ const id=r==='win'?after.win:after.lose; const fin=()=>{ if(r==='lose') sleep(true); q.cb&&q.cb(); }; if(id) UI.say(r==='win'?UI.commit(SCRIPTS[id]):SCRIPTS[id], fin); else fin(); }); return; }
    }
    UI.closeDlg(true);
  },
  closeDlg(runCb){ const q=UI.dlgQ; UI.dlgQ=null; $('#dlg').hidden=true; UI.sync(); if(!Battle.s&&!UI.fx&&RT.mapId) Music.play(areaTheme()); if(runCb&&q&&q.cb) q.cb(); if(!UI.busy()) Story.check(); },
  line(who,text){
    text=String(text).replace(/\{名\}/g, S.name||'').replace(/\{称\}/g, S.look&&S.look.g==='f'?'小师妹':'小师弟');
    const isMe=who==='我'; if(isMe) who=S.name||'我';
    const npcId=Object.keys(NPCS).find(k=>NPCS[k].name===who);
    const d=$('#dlg'), port=isMe?'__me':PORTRAIT[who]||(npcId&&!PORTRAIT[who]?'__npc':null);
    d.innerHTML=`<div class="dlg wood">${port?`<div class="port"><canvas id="dPort" class="px"></canvas><span>${esc(who)}</span></div>`:''}
      <div class="dtext ${who==='旁白'?'narr':''}${who==='获得'?' gain':''}">${port?'':(who!=='旁白'?`<span class="who">${esc(who)}</span>`:'')}<p id="dText"></p></div><i class="more">▼</i></div>`;
    if(port){ const c=$('#dPort'), sp=port==='__me'?lookSprite(S.look,'down',0):port==='__npc'?npcSprite(npcId):sprite(port); c.width=sp.width; c.height=sp.height; c.getContext('2d').drawImage(sp,0,0); }
    const p=$('#dText'); let n=0; UI.typing=true; clearInterval(UI._ti);
    UI._ti=setInterval(()=>{ n++; p.textContent=text.slice(0,n); if(n%2===0) Sound.talk(); if(n>=text.length){ clearInterval(UI._ti); UI.typing=false; } },28);
    d.onclick=()=>{ if(UI.typing){ clearInterval(UI._ti); p.textContent=text; UI.typing=false; return; } Sound.tick(); UI.next(); };
    UI._lineAt=performance.now();
  },
  choice(st){
    const d=$('#dlg');
    d.innerHTML=`<div class="dlg wood"><div class="dtext"><p>${esc(st.choice)}</p><div class="choices">${st.options.map((o,i)=>`<button data-i="${i}">${esc(o.text)}</button>`).join('')}</div></div></div>`;
    d.onclick=null;
    d.querySelectorAll('[data-i]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); Sound.tick(); const o=st.options[+b.dataset.i]; if(o.fn){ UI.closeDlg(false); o.fn(); return; } if(o.flag) S.flags[o.flag]=true;
      if(o.go){ UI.dlgQ.steps=[...SCRIPTS[o.go]]; UI.dlgQ.i=0; } UI.next(); });
    d.querySelectorAll('p').forEach(p=>p.textContent=p.textContent.replace(/\{名\}/g,S.name||''));
  },
  // a won battle counts the moment it is won: its flags and rewards are applied and saved now, and the lines that follow only show them
  // (on a phone the page can reload while the player is still reading the victory scene)
  commit(steps){ const out=[]; let got=[]; const fx=UI.fx; UI.fx=true;   // quest checks wait until the scene has been read
    const flush=()=>{ if(got.length){ out.push(['获得','✦ '+got.join('　✦ ')]); got=[]; } };
    for(const st of steps){
      if(Array.isArray(st)||!(st.flag||st.give||st.stones||st.exp)){ flush(); out.push(st); continue; }
      if(st.flag) S.flags[st.flag]=true;
      if(st.give) for(const k in st.give){ addItem(k,st.give[k]); got.push(`${ITEMS[k].name} ×${st.give[k]}`); }
      if(st.stones){ S.stones+=st.stones; got.push(`灵石 ×${st.stones}`); }
      if(st.exp){ gainExp(st.exp); got.push(`修为 +${st.exp}`); }
    }
    UI.fx=fx; flush(); UI.hud(); save(); return out; },
  confirm(text, yes){ UI.say([{choice:text, options:[{text:'好', go:'__yes'},{text:'算了', go:'__no'}]}], null);
    SCRIPTS.__yes=[{end:true}]; SCRIPTS.__no=[{end:true}];
    const btns=$('#dlg').querySelectorAll('[data-i]');
    btns[0].onclick=e=>{ e.stopPropagation(); Sound.tick(); UI.closeDlg(false); yes(); };
    btns[1].onclick=e=>{ e.stopPropagation(); Sound.tick(); UI.closeDlg(false); }; },

  /* panels */
  panel(title, html, onBind){
    const p=$('#panel'); p.hidden=false;
    p.innerHTML=`<div class="pwin wood"><div class="ptitle"><h2>${title}</h2><button class="x" id="pX" aria-label="关闭">×</button></div><div class="pbody" id="pBody">${html}</div></div>`;
    $('#pX').onclick=()=>UI.closePanel(); p.onclick=e=>{ if(e.target===p) UI.closePanel(); };
    onBind&&onBind($('#pBody')); UI.sync();
  },
  closePanel(){ $('#panel').hidden=true; UI._panelKind=''; UI.sync(); UI.hud(); },
  menu(tab){
    if(!$('#panel').hidden){ UI.closePanel(); return; }
    tab=tab||UI._tab||'bag'; UI._tab=tab;
    const tabs=[['bag','行囊'],['cult','修炼'],['people','人物'],['mail','信件'],['book','图鉴'],['quest','任务'],['replay','往事'],['save','存档'],['set','设置']];
    const head=`<div class="tabs">${tabs.map(([k,n])=>`<button data-t="${k}" class="${k===tab?'on':''}">${n}</button>`).join('')}</div>`;
    let body='';
    if(tab==='bag'){
      const ids=Object.keys(S.inv).filter(k=>S.inv[k]>0);
      body=`<div class="grid">${ids.map(id=>`<button class="cell" data-id="${id}">${itemIcon(id)}<b>${S.inv[id]}</b></button>`).join('')||'<p class="muted">行囊空空。</p>'}</div><div class="idesc" id="idesc">点一下物品查看说明。</div>
        <p class="muted">灵石：${S.stones}</p>`;
    }
    if(tab==='cult'){ const st=stats(), need=expNeed(S.L);
      body=`<div class="cult"><div class="realm-big">${realmName(S.L)}</div><div class="xbar"><i style="width:${Math.min(100,S.exp/need*100)}%"></i></div><p class="muted">修为 ${Math.floor(S.exp)} / ${need}</p>
        <div class="stats"><span>生命<b>${st.hp}</b></span><span>灵力<b>${st.mp}</b></span><span>攻击<b>${st.atk}</b></span><span>防御<b>${st.def}</b></span></div>
        <div class="tip"><b>灵根</b> ${Sect.rootName()}　<b>门派</b> ${S.sect?SECTS[S.sect].name+'（绝学：'+SECTS[S.sect].skill.name+'）':'未拜师'}${S.pet?'　<b>灵宠</b> '+BEASTS[S.pet.kind].name+' Lv'+S.pet.lv:''}${Sect.fortune()?'　<b>今日卦象</b> '+Sect.fortune().name:''}　<b>善恶</b> ${(S.karma||0)>=0?'善 '+(S.karma||0):'恶 '+(-S.karma)}</div>
        <p class="tip">${S.L===0?'到蒲团上打坐，引气入体。':S.L<9?'打坐、服用聚气丹、击败妖兽都能增加修为。修为圆满会自动突破到下一层。':S.L===9?'炼气九层圆满后，需要服下筑基丹，在蒲团上冲击筑基。':'已入筑基。下一章的修行敬请期待。'}</p></div>`; }
    if(tab==='book'){
      body=Life.bookHTML(UI._bookTab||'beast'); }
    if(tab==='quest'){ const q=QUESTS[S.quest];
      body=`<div class="qcur"><b>${esc(q.title)}</b><p>${esc(q.desc)}</p>${q.progress?`<p class="muted">进度：${esc(q.progress(S))}</p>`:''}</div>
        <ul class="qdone">${QUESTS.slice(0,S.quest).map(x=>`<li>✓ ${esc(x.title)}</li>`).join('')}</ul>`; }
    if(tab==='people'){ body=`<div class="people">${UI.people()}</div><p class="muted">每天和大家聊聊天、送一份礼物，好感就会慢慢上升。好感各自独立，不会吃醋，可以和每个人都到 8 心。</p>`; }
    if(tab==='replay'){ body=Replay.html(); }
    if(tab==='set'){ body=`<div class="set"><button class="btn" id="sMute">声音：${S.mute?'关':'开'}</button><button class="btn" id="sMusic">音乐：${S.music===false?'关':'开'}</button><button class="btn" id="sDodge">首领战：${S.dodgeOff?'经典回合制':'回合 + 躲弹幕'}</button><button class="btn" id="sSave">保存游戏</button><button class="btn" id="sSlots">存档 / 读档</button>
      <button class="btn" id="sTitle">回到标题</button><p class="muted">每晚睡觉时会自动存档。<br>电脑：WASD 移动（可斜走），E/空格 互动（靠近时头顶会出现 E），鼠标滚轮或 1–6 选道具，Esc 行囊，M 地图，J 任务。<br>手机：按住屏幕拖动出现摇杆，往哪拖就往哪走；轻点人物或物体会走过去互动；行囊里点道具可以「放进快捷栏」；点左上角任务的「寻路」自动前往。<br>iPhone 若听不到音乐，请关闭侧边的静音开关。</p></div>`; }
    UI.panel('行囊', head+body, b=>{
      b.querySelectorAll('[data-t]').forEach(t=>t.onclick=()=>{ Sound.tick(); if(t.dataset.t==='quest'){ $('#panel').hidden=true; UI._panelKind=''; return UI.tasks(); } if(t.dataset.t==='mail'){ $('#panel').hidden=true; UI._panelKind=''; return Mail.open(); } if(t.dataset.t==='save'){ $('#panel').hidden=true; return SaveSys.panel(); } UI._tab=t.dataset.t; $('#panel').hidden=true; UI.menu(t.dataset.t); });
      b.querySelectorAll('.cell').forEach(c=>c.onclick=()=>{ const id=c.dataset.id, it=ITEMS[id];
        const bar=UI.barable(id)?(UI.hotbarItems(), S.bar):null;
        $('#idesc').innerHTML=`<b>${it.name}</b> ${esc(it.desc||'')} ${it.use?`<button class="btn mini" id="iUse">服用</button>`:''}
          ${bar?`<div class="barpick"><span>放进快捷栏：</span>${bar.map((b,i)=>`<button class="btn mini${b===id?' on':''}" data-slot="${i}">${i+1}号 · ${b?esc(ITEMS[b].name):'空'}</button>`).join('')}</div>`:''}`;
        const u=$('#iUse'); if(u) u.onclick=()=>{ UI.useItem(id); $('#panel').hidden=true; UI.menu('bag'); };
        $('#idesc').querySelectorAll('[data-slot]').forEach(x=>x.onclick=()=>{ Sound.tick(); const i=+x.dataset.slot; if(S.bar[i]===id) return; const old=S.bar[i]; UI.putInBar(id,i); UI.toast(`${it.name}放进了快捷栏 ${i+1} 号${old&&old!==id?'，换下了'+ITEMS[old].name:''}`); c.click(); }); });
      b.querySelectorAll('[data-replay]').forEach(x=>x.onclick=()=>{ Sound.tick(); Replay.start(x.dataset.replay); });
      b.querySelectorAll('[data-bk]').forEach(x=>x.onclick=()=>{ Sound.tick(); UI._bookTab=x.dataset.bk; $('#panel').hidden=true; UI.menu('book'); });
      b.querySelectorAll('[data-cg]').forEach(x=>x.onclick=()=>{ const [id,lv]=x.dataset.cg.split(':'); CG.replaying=true; CG.replay(id,+lv); });
      b.querySelectorAll('[data-npc]').forEach(c=>{ const sp=npcSprite(c.dataset.npc); if(sp) c.getContext('2d').drawImage(sp,0,0); });
      const m=$('#sMute'); if(m) m.onclick=()=>{ S.mute=!S.mute; m.textContent='声音：'+(S.mute?'关':'开'); };
      const dg=$('#sDodge'); if(dg) dg.onclick=()=>{ S.dodgeOff=!S.dodgeOff; dg.textContent='首领战：'+(S.dodgeOff?'经典回合制':'回合 + 躲弹幕'); save(); };
      const mu=$('#sMusic'); if(mu) mu.onclick=()=>{ S.music=S.music===false; mu.textContent='音乐：'+(S.music===false?'关':'开'); if(S.music===false) Music.stop(); else Music.play(areaTheme(),true); };
      const ss=$('#sSlots'); if(ss) ss.onclick=()=>{ $('#panel').hidden=true; SaveSys.panel(); };
      const sv=$('#sSave'); if(sv) sv.onclick=()=>{ UI.toast(save()?'已保存':'保存失败（浏览器不允许存储）'); };
      const tt=$('#sTitle'); if(tt) tt.onclick=()=>{ save(); UI.closePanel(); UI.title(); };
    });
  },
  shop(){
    const render=(tab)=>{
      let body=`<div class="tabs"><button data-t="buy" class="${tab==='buy'?'on':''}">买</button><button data-t="sell" class="${tab==='sell'?'on':''}">卖</button></div><p class="muted">灵石：<b id="shStones">${S.stones}</b></p>`;
      if(tab==='buy') body+=SHOP.sell.map(id=>`<div class="row">${itemIcon(id)}<div><b>${ITEMS[id].name}</b><small>${esc(ITEMS[id].desc)}</small></div><button class="btn mini" data-buy="${id}" ${S.stones<ITEMS[id].price||(ITEMS[id].sell===0&&S.inv[id])?'disabled':''}>${ITEMS[id].sell===0&&S.inv[id]?'已拥有':ITEMS[id].price+' 灵石'}</button></div>`).join('');
      else { const ids=Object.keys(S.inv).filter(k=>ITEMS[k].sell&&S.inv[k]>0);
        body+=ids.map(id=>`<div class="row">${itemIcon(id)}<div><b>${ITEMS[id].name} ×${S.inv[id]}</b><small>每个 ${ITEMS[id].sell} 灵石</small></div><button class="btn mini" data-sell="${id}">卖 1</button><button class="btn mini" data-sellall="${id}">全卖</button></div>`).join('')||'<p class="muted">没有可以卖的东西。灵草、灵菇、兽皮和丹药都能卖。</p>'; }
      UI.panel('钱记杂货', `<p class="greet">钱掌柜：「客官，看看有什么需要的？」</p>`+body, b=>{
        b.querySelectorAll('[data-t]').forEach(t=>t.onclick=()=>{ Sound.tick(); render(t.dataset.t); });
        b.querySelectorAll('[data-buy]').forEach(x=>x.onclick=()=>{ const id=x.dataset.buy; if(S.stones<ITEMS[id].price||(ITEMS[id].sell===0&&S.inv[id])) return; S.stones-=ITEMS[id].price; addItem(id); Sound.coin(); render('buy'); });
        b.querySelectorAll('[data-sell]').forEach(x=>x.onclick=()=>{ const id=x.dataset.sell; addItem(id,-1); S.stones+=ITEMS[id].sell; Sound.coin(); render('sell'); });
        b.querySelectorAll('[data-sellall]').forEach(x=>x.onclick=()=>{ const id=x.dataset.sellall, n=S.inv[id]; addItem(id,-n); S.stones+=ITEMS[id].sell*n; Sound.coin(); render('sell'); });
      });
    };
    render('buy');
  },
  alchemy(){
    const render=()=>{
      const body=`<p class="muted">每次炼丹需要半个时辰。</p>`+RECIPES.map((r,i)=>{ const ok=Object.entries(r.need).every(([k,n])=>(S.inv[k]||0)>=n);
        return `<div class="row">${itemIcon(r.out)}<div><b>${ITEMS[r.out].name}</b><small>${Object.entries(r.need).map(([k,n])=>`<span class="${(S.inv[k]||0)>=n?'have':'lack'}">${ITEMS[k].name} ${S.inv[k]||0}/${n}</span>`).join(' ')}</small><small>${esc(ITEMS[r.out].desc)}</small></div><button class="btn mini" data-r="${i}" ${ok?'':'disabled'}>炼制</button></div>`; }).join('');
      UI.panel('丹炉', body, b=>b.querySelectorAll('[data-r]').forEach(x=>x.onclick=()=>{ const r=RECIPES[+x.dataset.r];
        for(const [k,n] of Object.entries(r.need)) addItem(k,-n); UI.closePanel();
        Mini.alchemy(r, grade=>{ const n={top:2,mid:1,low:1,fail:0}[grade]+(grade==='top'&&S.sect==='dan'&&Math.random()<.3?1:0);
          if(n) addItem(r.out,n); S.min+=30; S.st.crafted=S.st.crafted||{}; S.st.crafted[r.out]=(S.st.crafted[r.out]||0)+n; if(grade==='top') S.st.topGrade=(S.st.topGrade||0)+1;
          UI.toast(n?`炼成 ${ITEMS[r.out].name} ×${n}`:'炸炉了，药材化为灰烬……'); UI.hud(); Story._pending=true; UI.sync(); }); }));
    };
    render();
  },
  meditateFx(cb){
    UI.fx=true; UI.sync(); const el=$('#medfx'); el.hidden=false; el.classList.remove('on'); void el.offsetWidth; el.classList.add('on'); Sound.magic();
    setTimeout(()=>{ el.hidden=true; UI.fx=false; cb(); UI.sync(); },1800);
  },
  dayCard(passedOut){
    const ready=Object.values(S.farm).filter(p=>p.crop&&p.stage>=3).length;
    UI.fx=true; UI.sync(); const el=$('#daycard'); el.hidden=false;
    el.innerHTML=`<div><b>第 ${S.day} 天</b><span>${passedOut?'你在洞府醒来，丢了一些灵石……':'晨光透进洞府，新的一天开始了。'}</span>${ready?`<span>有 ${ready} 株灵植可以收获了！</span>`:''}${Sect.fortune()?`<span>今日卦象：${Sect.fortune().name}</span>`:''}${S.qiyu?`<span>${Qiyu.hint()}</span>`:''}${S._puppetNote?`<span>${S._puppetNote}</span>`:''}<span>桃源镇的悬赏榜贴出了新的委托。</span>${Mail.unread()?`<span>信箱里有 ${Mail.unread()} 封新信。</span>`:''}${(S.glow||[]).length?'<span>池塘里好像有金光在闪……</span>':''}</div>`; S._puppetNote='';
    el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
    setTimeout(()=>{ el.hidden=true; UI.fx=false; UI.hud(); UI.sync(); },2200);
  },
  title(){
    const t=$('#title'); t.hidden=false; const has=!!loadSave();
    t.innerHTML=`<div class="title-in"><h1>山海问道</h1><p class="sub">修仙 · 降妖 · 奇遇　——　青丘篇</p>
      <div class="tbtns">${has?'<button class="btn main" id="tCont">继续修行</button>':''}<button class="btn ${has?'':'main'}" id="tNew">新的修行</button></div>
      <p class="tnote" id="tNote"></p></div>`;
    UI.sync();
    if(has) $('#tCont').onclick=()=>{ Sound.unlock(); S=loadSave(); t.hidden=true; enterMap(S.map,S.x,S.y); UI.hud(); UI.sync(); Story.check(); };
    $('#tNew').onclick=()=>{ Sound.unlock();
      if(has && !UI._sure){ UI._sure=true; $('#tNote').textContent='已有存档。再点一次「新的修行」会覆盖它。'; return; }
      S=newState(); t.hidden=true; enterMap('home',11,6); UI.hud(); UI.say(SCRIPTS.intro, ()=>{ S.questStarted=0; Story.check(); }); };
  },
  onKey(e){
    if(!$('#dlg').hidden && (e.code==='Space'||e.code==='Enter'||e.code==='KeyE')){ e.preventDefault(); const d=$('#dlg'); if(d.onclick) d.onclick(); return true; }
    if(!$('#panel').hidden && (e.code==='Escape'||e.code==='Tab'||e.code==='KeyI')){ e.preventDefault(); UI.closePanel(); return true; }
    if(!$('#battle').hidden){ const map={Digit1:'atk',Digit2:'skill',Digit3:'guard',Digit4:'pill',Digit5:'flee'}; if(map[e.code]){ Battle.act(map[e.code]); return true; } }
    return false;
  },
};
// a tap anywhere on the screen moves the dialogue on (not just on the box); the tap that opened it is ignored
addEventListener('click', e=>{
  const d=$('#dlg'); if(d.hidden||!d.onclick||d.contains(e.target)) return;
  if(performance.now()-(UI._lineAt||0)<250) return;
  if(e.target.closest('#reviewNote,#panel,#minigame,#battle,#title,button,a,input')) return;
  d.onclick();
});
$('#menuB').onclick=()=>{ Sound.tick(); UI.menu(); };
$('#mini').onclick=()=>{ Sound.tick(); UI.worldMap(); };
UI.musicBtn=()=>{ const b=$('#musicB'); if(b) b.classList.toggle('off', !!(S&&S.music===false)); };
$('#musicB').onclick=()=>{ Music.unlock(); Sound.unlock(); if(!S) return; S.music=S.music===false; if(S.music===false){ Music.stop(); UI.toast('音乐：关'); } else { Music.play(Battle.s?'battle':areaTheme(),true); UI.toast('音乐：开（iPhone 静音开关打开时也能听到）'); } UI.musicBtn(); };


