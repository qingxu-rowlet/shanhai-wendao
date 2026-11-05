/* ============================================================
   山海问道 · 第三章自检 — open the game with #selftest3 and it plays chapter three (so far: act 1 「北上」) by itself, as a
   disciple of one sect picked at random (#selftest3all: all four). It starts from chapter two's end (Chapters.C2) and plays
   it as a player would: the master, the camp, the village, the night, both answers of every choice, 大师兄's question in
   the 风眼, both pictures. Every line is kept and checked, and the run is saved to the test log (#testlog).
   Uses save slot 3 and puts it back afterwards.
   ============================================================ */
const SelfTest3={
  lines:[],
  async run(){
    const W=ms=>new Promise(r=>setTimeout(r,ms)), errs=[]; const onErr=e=>errs.push((e.message||String(e))+` @${e.lineno}:${e.colno}`); addEventListener('error',onErr);
    const el=document.createElement('div'); el.id='selftest'; el.innerHTML=`<div class="st-box wood"><h3>第三章自检中…</h3><ol id="stList"></ol><p class="muted" id="stNote">${SelfTest3.all?'四个宗门各走一遍':'随机选一个宗门走一遍'}第三章${SelfTest3.only?'（只测：'+SelfTest3.only.join('、')+'，加上地图、台词、脚本错误）':''}，每句台词都会检查。</p></div>`; document.body.appendChild(el);
    const list=$('#stList'); let pass=0, fail=0, sect='', cur=''; TestLog.begin((SelfTest3.all?'第三章（四个宗门）':'第三章')+(SelfTest3.only?' · 只测 '+SelfTest3.only.join('、'):'')); SelfTest3.lines=[];
    const report=(name,ok,info='')=>{ ok?pass++:fail++; TestLog.item(name,ok,info); const li=document.createElement('li'); li.className=ok?'ok':'bad'; li.textContent=`${ok?'✓':'✗'} ${name}${info?' — '+info:''}`; list.appendChild(li); li.scrollIntoView({block:'nearest'}); };
    const step=async(name,fn)=>{ if(SelfTest3.only&&!/地图都走一遍|台词检查|没有脚本错误/.test(name)&&!SelfTest3.only.some(w=>name.includes(w))) return; try{ const r=await fn(); report(`[${SECTS[sect].name}] ${name}`, r!==false&&!(r&&r.fail), r&&r.info||''); }catch(e){ report(`[${SECTS[sect].name}] ${name}`,false,String(e&&e.message||e)); } finally{ PixCG.close(); if(Battle.s&&!$('#battle').hidden) Battle.close(); } };
    const rec=(kind,text)=>{ text=String(text||'').replace(/\s*▼\s*$/,'').trim(); if(text){ SelfTest3.lines.push({sect,node:cur,text}); TestLog.line(SECTS[sect].name+' · '+cur,kind,text); } };
    // dialogue to its end; pick = an option's index, or words it contains. Fades run on the frame loop, which stops in a
    // hidden window, so they are stepped here.
    const adv=async(pick=0,max=600)=>{ let idle=0; for(let i=0;i<max;i++){ if(RT.fadeTo) update(.1); const d=$('#dlg');
        if(d.hidden){ await W(60); if($('#dlg').hidden&&!RT.fadeTo&&++idle>6) return; continue; } idle=0;
        const ch=[...d.querySelectorAll('[data-i]')]; if(ch.length){ rec('选项',ch.map(c=>c.textContent).join(' / ')); const c=typeof pick==='string'?(ch.find(c=>c.textContent.includes(pick))||ch[0]):ch[Math.min(pick,ch.length-1)]; c.click(); }
        else if(d.onclick){ if(UI.typing) d.onclick(); rec('对话',(d.querySelector('.port span,.who')?.textContent||'旁白')+'：'+(d.querySelector('#dText')?.textContent||'')); d.onclick&&d.onclick(); }
        await W(10); } };
    const cine=()=>{ const c=$('#cine'); if(c&&!c.hidden&&c.onclick) c.onclick(); document.querySelectorAll('.boss-intro,#bossIntro').forEach(e=>e.click()); };
    const talkB=()=>document.querySelectorAll('#battle .b-talk').forEach(b=>{ rec('战斗对话',b.innerText.replace(/\s*\n\s*/g,'：').replace(/：?▼$/,'')); b.click(); });
    const fight=async()=>{ Dev.god=true; let n=0; for(let i=0;i<150&&!(Battle.s&&!Battle.s.busy);i++){ cine(); await W(80); }
      while(Battle.s&&!Battle.s.over&&n<90){ const s=Battle.s, st=stats(); S.hp=Math.max(S.hp,st.hp*.6|0); if(s.busy){ talkB(); await W(50); continue; }
        if(S.sect&&s.jianyi&&S.mp>=SECTS[S.sect].skill.mp) Battle.act('sect'); else if(S.mp>=Battle.skillMp()) Battle.act('skill'); else { S.mp=st.mp; Battle.act('atk'); } n++; await W(200); }
      for(let i=0;i<40&&!$('#bOk');i++) await W(100); const ok=$('#bOk'); if(ok) ok.click(); await W(400); Dev.god=false; return {won:!!ok, turns:n}; };
    const node=id=>Review.NODES.find(x=>x.id===id);
    const obj=act=>RT.ents.find(e=>e.act===act)||RT.map.objects.find(e=>e.act===act);
    // the whole act, as a player: picks = [dinner, old man]
    const play=async(picks)=>{ cur='出发'; node('c3-go').run(); await W(400); Story.talk(SECTS[sect].master.id); await adv('准备好'); await W(500); await adv();
      cur='第一夜'; for(const ti of [0,1,2]){ const o=RT.ents.find(e=>e.act==='c3twig'&&e.ti===ti); o&&Dungeon.act(o); } Dungeon.act(obj('c3water')); await adv();
      const xieMenu=await (async()=>{ Story.talk('xie'); await W(150); const o=[...document.querySelectorAll('#dlg [data-i]')].map(c=>c.textContent); await adv(0); return o.includes('聊天')&&o.includes('送礼'); })();
      Dungeon.act(obj('c3pot')); await adv(picks[0]); Dungeon.act(obj('c3tent')); await adv(0); await W(1200); await adv();
      const logsGone=!RT.ents.some(e=>e.act==='c3log');   // without leaving the map
      cur='安平村'; enterMap('c3_anping',11,16); await W(500); await adv(); Dungeon.act(obj('c3notice')); await adv();
      for(let i=0;i<4;i++){ Dungeon.act({act:'c3door',di:i}); await adv(); }
      Dungeon.act(obj('c3shrine')); await W(300); const cg1=PixCG.on; await adv();
      const oldThere=RT.ents.some(e=>e.id==='c3_old');   // by the well as soon as the shrine scene ends
      Story.talk('c3_old'); await adv(picks[1]); Dungeon.act(obj('c3grave')); await adv(); await W(600);
      cur='夜袭'; await adv(); for(let i=0;i<60&&!Battle.s;i++) await W(100); const f=await fight(); await W(300);
      let cg2=false; for(let i=0;i<300;i++){ if(PixCG.on) cg2=true; const d=$('#dlg'); if(d.hidden){ await W(80); if($('#dlg').hidden&&!RT.fadeTo&&i>20) break; continue; } if(UI.typing) d.onclick(); rec('对话',(d.querySelector('.port span,.who')?.textContent||'旁白')+'：'+(d.querySelector('#dText')?.textContent||'')); d.onclick&&d.onclick(); await W(10); }
      for(let i=0;i<60&&QUESTS[S.quest].id!=='c3z';i++){ await adv(); UI.sync(); Story.check(); await W(100); }   // a check put off while something was on screen runs once it closes
      return {cg1, cg2, f, xieMenu, logsGone, oldThere}; };
    const backup=localStorage.getItem(slotKey(2)); Dodge.auto=true; Dev.god=false; RT.slot=2;
    const ALL=['jian','dan','shou','tianji'], RUN=SelfTest3.all?ALL:[ALL[Math.floor(Math.random()*4)]];
    try{
      for(const k of RUN){ sect=k; Review.sect=k;
        await step('每个第三章审查点都能进入，任务栏有目标，寻路走得通', async()=>{ const bad=[], NODES=Review.NODES.filter(n=>n.group==='第三章');
          for(const nd of NODES){ try{ cur=nd.id; nd.run(); await W(400); await adv(0,60);
              // a scene that ends in a fight opens it after its title card: wait for it, then close it, so it is not left open behind the next save
              for(let i=0;i<30&&!Battle.s&&(UI.fx||!$('#battle').hidden||document.querySelector('.boss-intro,#bossIntro'));i++){ document.querySelectorAll('.boss-intro,#bossIntro').forEach(e=>e.click()); await W(100); }
              if(Battle.s) Battle.close(); $('#battle').hidden=true; PixCG.close(); UI.closeDlg&&UI.closeDlg(false);
              const tr=Nav.tracked(), g=Nav.goal(); if(!tr) bad.push(nd.id+'：没有任务'); else if(tr.target&&!g) bad.push(nd.id+'：找不到去的路'); else if(g&&!Nav.pathTo(g)) bad.push(nd.id+'：寻路走不通'); }
            catch(e){ bad.push(nd.id+'：'+e.message); } }
          return {fail:bad.length>0, info:bad.length?bad.slice(0,3).join('；'):`${NODES.length} 个审查点`}; });
        await step('第一幕从头走到尾：出发 → 营地 → 安平村 → 夜袭 → 山脊', async()=>{ const n0=SelfTest3.lines.length, r=await play([0,0]); const F=S.flags;
          const ok=r.xieMenu&&r.logsGone&&r.oldThere&&r.cg1&&r.cg2&&r.f.won&&F.c3_go&&F.c3_dinner&&F.c3_morning&&F.c3_notice&&F.c3_shrine&&F.c3_old&&F.c3_grave&&F.c3_raid_won&&F.c3_a1_done&&QUESTS[S.quest].id==='c3z'&&count(S,'c2_bagua')===1;
          const miss=['c3_go','c3_dinner','c3_morning','c3_notice','c3_shrine','c3_old','c3_grave','c3_raid_won','c3_a1_done'].filter(f=>!F[f]);
          return {fail:!ok, info:`${miss.length?'没走到：'+miss.join(' ')+'，':''}${r.xieMenu?'':'大师姐没有聊天/送礼 ✗，'}${r.logsGone?'':'早上路没通 ✗，'}${r.oldThere?'':'老人没出现 ✗，'}${r.cg1?'牌位':'牌位 ✗'}，猲狙 ${r.f.won?r.f.turns+' 回合':'✗'}，${r.cg2?'山脊':'山脊 ✗'}，${QUESTS[S.quest].id}，${SelfTest3.lines.length-n0} 句`}; });
        await step('另一种选择：递粥 / 问「陆仙长真的是好人吗」', async()=>{ const n0=SelfTest3.lines.length; await play([1,1]); return {fail:!(S.flags.c3_doubt&&S.flags.c3_a1_done), info:`${SelfTest3.lines.length-n0} 句`}; });
        await step('第二幕：天亮进京 → 朱雀门 → 告示，街上每个人都能说话', async()=>{ const n0=SelfTest3.lines.length; cur='进京';
          node('c3-tocity').run(); await W(400); Dungeon.act(obj('c3tent')); await adv(0); await W(1500); await adv(); for(let i=0;i<40&&RT.mapId!=='jc_zhuque';i++){ if(RT.fadeTo) update(.1); await W(60); }
          await W(800); await adv(); const inCity=RT.mapId==='jc_zhuque'&&S.flags.c3_jc_in&&QUESTS[S.quest].id==='c3e';
          cur='朱雀大街'; S.stones=Math.max(S.stones,100); const bad=[];
          for(const o of RT.ents.filter(o=>o.type==='npc')){ Story.talk(o.id); await W(80); if($('#dlg').hidden) bad.push(o.id); await adv(0); }
          for(const act of ['jcshop','jcsedan','jcstall','jcway']) for(const o of RT.map.objects.filter(o=>o.act===act)){ Dungeon.act(o); await adv(); }
          Dungeon.act(obj('jcboard')); await adv(); const hulu=count(S,'jc_hulu')>0;
          return {fail:!(inCity&&S.flags.c3_jc_board&&hulu&&!bad.length), info:`${inCity?'进城':'进城 ✗'}，${S.flags.c3_jc_board?'告示':'告示 ✗'}，${hulu?'糖葫芦':'糖葫芦 ✗'}${bad.length?'，没反应：'+bad.join(' '):''}，${SelfTest3.lines.length-n0} 句`}; });
        await step('第二幕：四方馆 → 苏小棠 → 别的宗门 → 大师姐说结丹 → 丹方 → 宵禁睡觉', async()=>{ const n0=SelfTest3.lines.length; cur='四方馆';
          node('c3-city').run(); await W(400); S.flags.c3_jc_board=true; enterMap('jc_sifang',28,22); await W(900); await adv(); const inSf=!!S.flags.c3_sf_in;
          Story.talk('tang'); await adv(); for(const o of RT.ents.filter(o=>o.type==='npc'&&o.id.startsWith('sf_'))){ Story.talk(o.id); await adv(); }
          Story.talk('xie'); await adv(); Story.talk('tang'); await adv(); const got=count(S,'c3_recipe')>0;
          const [x,y]=SF_WING[sect]; Dungeon.act(RT.map.objects.find(o=>o.act==='sfroom'&&o.sect===sect)); await adv(0); await W(1500); await adv();
          for(let i=0;i<30&&QUESTS[S.quest].id!=='c3g';i++){ await adv(); UI.sync(); Story.check(); await W(100); }
          const F=S.flags, ok=inSf&&F.c3_sf_tang&&F.c3_sf_jiedan&&F.c3_sf_recipe&&got&&F.c3_sf_morning&&QUESTS[S.quest].id==='c3g';
          return {fail:!ok, info:`${inSf?'登记':'登记 ✗'}，${F.c3_sf_tang?'苏小棠':'苏小棠 ✗'}，${F.c3_sf_jiedan?'结丹':'结丹 ✗'}，${got?'丹方':'丹方 ✗'}，${F.c3_sf_morning?'第二天':'第二天 ✗'}，${QUESTS[S.quest].id}，${SelfTest3.lines.length-n0} 句`}; });
        await step('第二幕：西市 → 百草行买龙血竭 → 琅琊阁买功法 → 琅琊榜 → 聚宝楼，西市每个人、每样东西都能点', async()=>{ const n0=SelfTest3.lines.length; cur='西市';
          node('c3-xishi').run(); await W(900); await adv(); const inXs=!!S.flags.c3_xs_in; S.stones=Math.min(S.stones,50);
          Story.talk('xs_yao'); await adv(); const xue=count(S,'c3_xue')===1&&S.stones>=0;
          S.stones=500; const b0=JSON.stringify(S.bonus||{}); Story.talk('xs_lang'); await adv(0); await adv('买'); await W(200); await adv(); const gf=XS.st().gf.length===1&&JSON.stringify(S.bonus||{})!==b0;
          const bad=[]; for(const o of RT.ents.filter(o=>o.type==='npc')){ Story.talk(o.id); await W(80); if($('#dlg').hidden) bad.push(o.id); await adv('不买'); }
          for(const act of ['xsshop','xsstall','xsherbs','xsbang','jcway']) for(const o of RT.map.objects.filter(o=>o.act===act)){ Dungeon.act(o); await adv('不买'); }
          UI.sync(); Story.check(); const F=S.flags, q=QUESTS[S.quest], prog=q&&q.progress?q.progress(S):'';
          const ok=inXs&&xue&&gf&&F.c3_xs_xue&&F.c3_xs_bang&&F.c3_xs_lot&&F.c3_xs_axiu&&!bad.length&&q.id==='c3g'&&/回春堂/.test(prog);
          return {fail:!ok, info:`${inXs?'进西市':'进西市 ✗'}，${xue?'龙血竭':'龙血竭 ✗'}，${gf?'功法':'功法 ✗'}，${F.c3_xs_bang?'琅琊榜':'琅琊榜 ✗'}，${F.c3_xs_lot?'拍品单':'拍品单 ✗'}，${F.c3_xs_axiu?'阿秀娘':'阿秀娘 ✗'}，任务「${prog}」${bad.length?'，没反应：'+bad.join(' '):''}，${SelfTest3.lines.length-n0} 句`}; });
        await step('第二幕：回春堂 → 问石钟乳 → 孙大夫号脉 → 抓三副药（故意抓错一次）→ 千年石钟乳', async()=>{ const n0=SelfTest3.lines.length; cur='回春堂';
          node('c3-xishi').run(); await W(300); S.flags.c3_xs_in=true; S.flags.c3_xs_xue=true; addItem('c3_xue',1); enterMap('jc_zhuque',22,7); await W(300); await adv();
          Dungeon.act(RT.map.objects.find(o=>o.act==='jcshop'&&o.id==='yao')); await W(900); await adv(); const inHc=RT.mapId==='jc_huichun'&&!!S.flags.c3_hc_in;
          Story.talk('hc_zhang'); await adv(); Story.talk('hc_sun'); let wrong=false, rounds=0;
          for(let i=0;i<400;i++){ if(RT.fadeTo) update(.1); const d=$('#dlg'); if(d.hidden){ await W(60); if($('#dlg').hidden&&++rounds>8) break; continue; } rounds=0;
            const ch=[...d.querySelectorAll('[data-i]')];
            if(ch.length){ rec('选项',ch.map(c=>c.textContent).join(' / ')); const h=HC.st(), rx=HC.RX[h.round], good=c=>(h.left||rx.need).some(n=>c.textContent.includes('「'+n+'」'));
              const c=!wrong?(ch.find(c=>!good(c))||ch[0]):(ch.find(good)||ch[0]); if(!good(c)) wrong=true; c.click(); }
            else if(d.onclick){ if(UI.typing) d.onclick(); rec('对话',(d.querySelector('.port span,.who')?.textContent||'旁白')+'：'+(d.querySelector('#dText')?.textContent||'')); d.onclick&&d.onclick(); }
            await W(10); }
          const bad=[]; for(const o of RT.ents.filter(o=>o.type==='npc')){ Story.talk(o.id); await W(80); if($('#dlg').hidden) bad.push(o.id); await adv(); }
          for(const act of ['hccounter','hcdesk','hcstove','hcnian']){ Dungeon.act(obj(act)); await adv(); }
          UI.sync(); Story.check(); const F=S.flags, q=QUESTS[S.quest], prog=q.progress?q.progress(S):'', got=count(S,'c3_ru')===1, miss=HC.st().miss;
          const ok=inHc&&F.c3_hc_ask&&F.c3_hc_pulse&&F.c3_hc_ru&&got&&miss===1&&!bad.length&&/大师姐商量拍卖/.test(prog);
          return {fail:!ok, info:`${inHc?'进门':'进门 ✗'}，${F.c3_hc_ask?'问掌柜':'问掌柜 ✗'}，${F.c3_hc_pulse?'号脉':'号脉 ✗'}，抓错 ${miss} 次，${got?'石钟乳':'石钟乳 ✗'}，任务「${prog}」${bad.length?'，没反应：'+bad.join(' '):''}，${SelfTest3.lines.length-n0} 句`}; });
        await step('第二幕：四方馆凑钱（大师姐当青玉珠）→ 等到第七天晚上 → 聚宝楼拍卖会 → 九转还魂草', async()=>{ const n0=SelfTest3.lines.length; cur='拍卖会';
          node('c3-pool').run(); await W(400); Story.talk('xie'); await adv(); const pooled=!!S.flags.c3_ju_pool&&JU.st().pool>=1100&&!!S.flags.c3_xie_pawn;
          S.day=6; enterMap('jc_xishi',26,7); await W(300); Story.talk('xs_ju'); await adv(); const waitOk=RT.mapId==='jc_xishi';
          S.day=7; S.min=12*60; Story.talk('xs_ju'); await adv(0); await W(900); await adv(0); await W(900); await adv(0); const inJu=RT.mapId==='jc_jubao';
          const bad=[]; for(const o of RT.ents.filter(o=>o.type==='npc')){ Story.talk(o.id); await W(80); if($('#dlg').hidden) bad.push(o.id); await adv(); }
          for(const act of ['jubox','jugong']){ Dungeon.act(obj(act)); await adv(); }
          for(let i=0;i<20&&QUESTS[S.quest].id!=='c3h';i++){ UI.sync(); Story.check(); await W(100); }
          const F=S.flags, ok=pooled&&waitOk&&inJu&&F.c3_ju_won&&count(S,'c3_hun')===1&&S.stones>=0&&!bad.length&&QUESTS[S.quest].id==='c3h';
          return {fail:!ok, info:`${pooled?'凑钱':'凑钱 ✗'}，${waitOk?'没到日子不开门':'日子 ✗'}，${inJu?'进楼':'进楼 ✗'}，${F.c3_ju_won?'拍到':'拍到 ✗'}，${QUESTS[S.quest].id}${bad.length?'，没反应：'+bad.join(' '):''}，${SelfTest3.lines.length-n0} 句`}; });
        await step('第二幕：炼结丹丹（先炸一次炉，再按苏小棠说的火候炼）→ 大师姐说闭关', async()=>{ const n0=SelfTest3.lines.length; cur='炼丹';
          node('c3-dan').run(); await W(400); Story.talk('tang'); await adv(); const lu=!!RT.ents.find(e=>e.act==='sfdan');
          // the furnace: first let the fire die (it bursts), then keep the needle on the gold band
          const play=async(good)=>{ for(let i=0;i<60&&!$('#alcBtn');i++){ const d=$('#dlg'); if(!d.hidden){ if(UI.typing) d.onclick(); rec('对话',(d.querySelector('.port span,.who')?.textContent||'旁白')+'：'+(d.querySelector('#dText')?.textContent||'')); d.onclick&&d.onclick(); } await W(20); }
            let hold=false, coach=new Set(); const b=$('#alcBtn'); for(let i=0;i<13*30;i++){ const z=$('#alcZone'), n=$('#alcNeedle'); if(!z||$('#alcOk')) break; coach.add($('#alcTip').textContent); const zc=parseFloat(z.style.bottom)+parseFloat(z.style.height)/2, nb=parseFloat(n.style.bottom), want=good&&nb<zc-1.5; if(want!==hold){ hold=want; b.dispatchEvent(new PointerEvent(want?'pointerdown':'pointerup',{bubbles:true})); } Mini.step(1/30); }
            const t=$('.alc h3')?.textContent||''; if($('#alcOk')) $('#alcOk').click(); await W(30); return {t, coach:[...coach].some(x=>x.startsWith('苏小棠'))}; };
          Dungeon.act(obj('sfdan')); const r1=await play(false); const r2=await play(true); await adv();
          for(let i=0;i<20&&QUESTS[S.quest].id!=='c3i';i++){ UI.sync(); Story.check(); await W(100); }
          const F=S.flags, ok=lu&&/炸炉/.test(r1.t)&&r1.coach&&F.c3_dan_done&&count(S,'c3_jiedan')===1&&!count(S,'c3_hun')&&QUESTS[S.quest].id==='c3i';
          return {fail:!ok, info:`${lu?'丹炉':'丹炉 ✗'}，第一炉「${r1.t}」，第二炉「${r2.t}」，${r1.coach?'苏小棠看火':'看火 ✗'}，${F.c3_dan_done?'结丹丹':'结丹丹 ✗'}，${QUESTS[S.quest].id}，${SelfTest3.lines.length-n0} 句`}; });
        await step('第二幕：闭关 → 七个人离开 → 心魔之战 → 雷劫（五道）→ 结丹初期 → 插画「雷云」', async()=>{ const n0=SelfTest3.lines.length; cur='闭关';
          node('c3-biguan').run(); await W(400); const L0=S.L; Dungeon.act(obj('sffuton')); let gone=0, cg1=false;
          for(let i=0;i<300&&!Battle.s;i++){ if(PixCG.on) cg1=true; const d=$('#dlg'); if(!d.hidden){ const ch=d.querySelector('[data-i]'); if(ch){ ch.click(); } else { if(UI.typing) d.onclick(); const t=d.querySelector('#dText')?.textContent||''; if(/转过身，走了/.test(t)) gone++; rec('对话',(d.querySelector('.port span,.who')?.textContent||'旁白')+'：'+t); d.onclick&&d.onclick(); } } await W(15); }
          const f=await fight(); await adv(); for(let i=0;i<40&&!$('#trL');i++) await W(50);
          // the 雷劫: step aside from every lane that lights up
          for(let i=0;i<16*30;i++){ const warn=[...document.querySelectorAll('#trArena .lane')].map(l=>l.classList.contains('warn')); if(!warn.length||$('#trOk')) break; const me=$('#trMe'); const pos=Math.round(parseFloat(me.style.left)/20);
            if(warn[pos]){ const safe=warn.findIndex(w=>!w), dd=Math.sign(safe-pos); if(dd) $(dd<0?'#trL':'#trR').click(); } Mini.step(1/30); }
          const trib=$('.trib h3')?.textContent||''; if($('#trOk')) $('#trOk').click(); await W(50);
          let cg2=false; for(let i=0;i<200;i++){ if(PixCG.on) cg2=true; const d=$('#dlg'); if(d.hidden){ await W(60); if($('#dlg').hidden&&i>20) break; continue; } if(UI.typing) d.onclick(); rec('对话',(d.querySelector('.port span,.who')?.textContent||'旁白')+'：'+(d.querySelector('#dText')?.textContent||'')); d.onclick&&d.onclick(); await W(10); }
          for(let i=0;i<20&&QUESTS[S.quest].id!=='c3j';i++){ UI.sync(); Story.check(); await W(100); }
          const F=S.flags, ok=cg1&&gone===7&&f.won&&/成功/.test(trib)&&F.c3_jd_done&&S.L===13&&L0===12&&realmName(S.L)==='结丹初期'&&cg2&&!count(S,'c3_jiedan')&&QUESTS[S.quest].id==='c3j';
          return {fail:!ok, info:`${cg1?'心魔':'心魔 ✗'}，走了 ${gone}/7 个，心魔之战 ${f.won?f.turns+' 回合':'✗'}，雷劫「${trib}」，${realmName(S.L)}，${cg2?'雷云':'雷云 ✗'}，${QUESTS[S.quest].id}，${SelfTest3.lines.length-n0} 句`}; });
        await step('境界表：结丹三层，筑基后期和结丹后期是瓶颈，打坐不会越过去', async()=>{ const names=[12,13,14,15].map(realmName).join('/'), caps=[9,12,15].every(realmCap)&&![10,13,14].some(realmCap);
          const st12=statsFor(12), st13=statsFor(13); S.L=12; S.exp=0; gainExp(99999); const held12=S.L===12; S.L=13; S.exp=0; gainExp(99999); const to15=S.L===15;
          return {fail:!(names==='筑基后期/结丹初期/结丹中期/结丹后期'&&caps&&held12&&to15&&st13.hp>st12.hp+100), info:`${names}，筑基后期${held12?'停住':'✗'}，结丹打坐到${realmName(S.L)}，生命 ${st12.hp}→${st13.hp}`}; });
        await step('第二幕：结丹那一夜 → 小巷 → 遇见萧烬（三种问法）→ 回四方馆睡觉', async()=>{ const n0=SelfTest3.lines.length, got=[]; let cg=false;
          for(const pick of ['为什么','安平村','什么也不问']){ cur='小巷'; node('c3-xiang').run(); await W(400);
            Dungeon.act(RT.map.objects.find(o=>o.act==='sfroom'&&o.sect===sect)); await adv('出去'); for(let i=0;i<40&&RT.mapId!=='jc_xiang';i++){ if(RT.fadeTo) update(.1); await W(60); } await W(600); await adv();
            const there=RT.mapId==='jc_xiang'&&!!RT.ents.find(e=>e.id==='xiao'); Story.talk('xiao'); for(let i=0;i<20&&!PixCG.on;i++) await W(30); if(PixCG.on) cg=true; await adv(pick);
            for(let i=0;i<60&&RT.mapId!=='jc_sifang';i++){ if(RT.fadeTo) update(.1); await W(60); } await W(400); await adv(); for(let i=0;i<20&&QUESTS[S.quest].id!=='c3k';i++){ UI.sync(); Story.check(); await W(100); }
            got.push({there, met:!!S.flags.c3_xj_met, home:['jc_sifang','jc_gongyuan'].includes(RT.mapId), q:QUESTS[S.quest].id, love:Social.rel('xiao').pts||0, ask:XX.st().ask}); }
          const ok=cg&&got.every(g=>g.there&&g.met&&g.home&&g.q==='c3k')&&got.map(g=>g.ask).join()==='why,anping,none';
          return {fail:!ok, info:`${cg?'小巷':'小巷 ✗'}，`+got.map(g=>`${g.ask}：${g.there?'':'没遇到 ✗ '}${g.met?'':'没说完 ✗ '}好感 ${g.love}`).join('；')+`，${got[2]&&got[2].q}，${SelfTest3.lines.length-n0} 句`}; });
        await step('第二幕：大比开幕 → 礼部来接 → 高台（天子、萧烬、国师）→ 观天鉴 → 抽签、对阵表', async()=>{ const n0=SelfTest3.lines.length; cur='开幕式'; let cg=false;
          node('c3-kaimu').run(); await W(1300);
          for(let i=0;i<400;i++){ if(RT.fadeTo) update(.1); if(PixCG.on) cg=true; const d=$('#dlg'); if(d.hidden){ await W(60); if($('#dlg').hidden&&!RT.fadeTo&&i>40&&S.flags.c3_km_done) break; continue; }
            const ch=d.querySelector('[data-i]'); if(ch){ rec('选项',ch.textContent); ch.click(); } else { if(UI.typing) d.onclick(); rec('对话',(d.querySelector('.port span,.who')?.textContent||'旁白')+'：'+(d.querySelector('#dText')?.textContent||'')); d.onclick&&d.onclick(); } await W(10); }
          const panel=!$('#panel').hidden&&/对阵表/.test($('#panel').innerHTML); UI.closePanel&&UI.closePanel();
          const b=KM.st().bracket||[], inSq=RT.mapId==='jc_gongyuan';
          const bad=[]; for(const o of RT.ents.filter(o=>o.type==='npc')){ Story.talk(o.id); await W(80); if($('#dlg').hidden&&!document.querySelector('.panel:not([hidden]),#panel:not([hidden])')) bad.push(o.id); await adv('说说话'); UI.closePanel&&UI.closePanel(); }
          for(const act of ['kmgaotai','kmleitai','kmjian']){ Dungeon.act(obj(act)); await adv(); }
          for(let i=0;i<20&&QUESTS[S.quest].id!=='c3l';i++){ UI.sync(); Story.check(); await W(100); }
          const ok=cg&&inSq&&S.flags.c3_km_call&&S.flags.c3_km_done&&b.length===4&&b[1]==='tang'&&b.every(id=>KM.NAME[id])&&!bad.length&&QUESTS[S.quest].id==='c3l';
          return {fail:!ok, info:`${S.flags.c3_km_call?'礼部来接':'来接 ✗'}，${inSq?'贡院前':'贡院前 ✗'}，${cg?'高台':'高台 ✗'}，对阵 ${b.map(id=>(KM.NAME[id]||id+'?').slice(0,3)).join('→')}，${panel?'对阵表':'(对阵表面板?)'}${bad.length?'，没反应：'+bad.join(' '):''}，${QUESTS[S.quest].id}，${SelfTest3.lines.length-n0} 句`}; });
        await step('第三幕：擂台赛四轮（先输一次再练）→ 苏小棠收手 → 魁首；输的人当晚被马车带走', async()=>{ const n0=SelfTest3.lines.length, log=[]; cur='擂台赛';
          node('c3-r1').run(); await W(400); const B=KM.st().bracket.slice();
          // lose once: the round is not lost for good
          Dungeon.act(obj('kmleitai')); await adv('上台'); for(let i=0;i<160&&!Battle.s;i++){ cine(); await W(80); }
          if(Battle.s){ Battle.s.busy=false; Battle.end('lose'); } for(let i=0;i<40&&!$('#bOk');i++) await W(80); $('#bOk')&&$('#bOk').click(); await W(300); await adv(); const lostOk=KM.st().round===0&&!!S.flags.c3_lt_lost;
          for(let r=0;r<4;r++){ enterMap('jc_gongyuan',14,15); S.day+=1; await W(200); Dungeon.act(obj('kmleitai')); await adv('上台'); const f=await fight(); await W(600);
            for(let i=0;i<300;i++){ if(RT.fadeTo) update(.1); const d=$('#dlg'); if(d.hidden){ await W(60); if($('#dlg').hidden&&!RT.fadeTo&&i>30&&RT.mapId==='jc_sifang') break; continue; } const ch=d.querySelector('[data-i]'); if(ch) ch.click(); else { if(UI.typing) d.onclick(); rec('对话',(d.querySelector('.port span,.who')?.textContent||'旁白')+'：'+(d.querySelector('#dText')?.textContent||'')); d.onclick&&d.onclick(); } await W(10); }
            log.push(`${KM.NAME[B[r]].slice(0,3)} ${f.won?f.turns+'回合':'✗'}`); }
          const gone=B.filter(id=>id!=='tang').every(id=>!RT.ents.some(e=>e.id===id)), tangStays=RT.ents.some(e=>e.id==='tang');
          for(let i=0;i<20&&QUESTS[S.quest].id!=='c3m';i++){ UI.sync(); Story.check(); await W(100); }
          const F=S.flags, ok=lostOk&&KM.st().round===4&&F.c3_lt_tang&&F.c3_lt_n2&&F.c3_kuishou&&F.c3_lt_done&&gone&&tangStays&&QUESTS[S.quest].id==='c3m';
          return {fail:!ok, info:`${lostOk?'输了再来':'输 ✗'}，${log.join('，')}，${F.c3_lt_tang?'苏小棠收手':'收手 ✗'}，${F.c3_lt_n2?'苏小棠留下':'留下 ✗'}，${F.c3_kuishou?'魁首':'魁首 ✗'}，${gone?'输的人都走了':'还在 ✗'}${tangStays?'':'，苏小棠不见了 ✗'}，${QUESTS[S.quest].id}，${SelfTest3.lines.length-n0} 句`}; });
        await step('第三幕：宗门来信 → 大师姐禁足 → 八卦镜照空屋 → 苏小棠验药渣（线索 2/4）', async()=>{ const n0=SelfTest3.lines.length; cur='宗门来信';
          node('c3-letter').run(); await W(1300); await adv(); const jin=!!S.flags.c3_xf_in&&RT.ents.some(e=>e.id==='xf_guard');
          const b0=C3.st().bagua; Dungeon.act(RT.map.objects.find(o=>o.act==='sfroom'&&o.sect===XF.room())); await adv('照'); const room=!!XF.st().clue.room&&count(S,'c3_dregs')===1&&C3.st().bagua===b0-1;
          Story.talk('tang'); await adv(); Story.talk('xie'); await adv('说说话'); Story.talk('xf_guard'); await adv();
          const F=S.flags, q=QUESTS[S.quest], prog=q.progress(S), ok=jin&&room&&XF.st().clue.dregs&&XF.n()===2&&q.id==='c3m'&&/2\/4/.test(prog);
          return {fail:!ok, info:`${jin?'禁足':'禁足 ✗'}，${room?'空屋（八卦镜 '+C3.st().bagua+' 次）':'空屋 ✗'}，${XF.st().clue.dregs?'药渣':'药渣 ✗'}，「${prog}」，${SelfTest3.lines.length-n0} 句`}; });
        await step('第三幕：醉月楼 → 青禾 → 送信 / 赎琵琶 → 「宗庙那边，又要一车」（线索 3/4）', async()=>{ const n0=SelfTest3.lines.length, got=[]; cur='醉月楼';
          for(const how of ['letter','pipa']){ node('c3-zuiyue').run(); await W(400); Dungeon.act(RT.map.objects.find(o=>o.act==='zyin')); await W(200); const inside=RT.mapId==='jc_zuiyue';
            Story.talk('qinghe'); await adv(); const hasLetter=count(S,'c3_letter')===1;
            if(how==='letter'){ enterMap('jc_huichun',13,8); await W(100); Story.talk('hc_bei'); await adv(); enterMap('jc_zuiyue',9,5); await W(100); }
            else { Story.talk('zy_bao'); await adv('赎'); }
            Story.talk('qinghe'); await adv(); got.push({how, inside, hasLetter, clue:!!XF.st().clue.qinghe, told:ZY.st().told}); }
          const bad=[]; for(const m of ['jc_zuiyue','jc_dongkou']){ enterMap(m, m==='jc_zuiyue'?9:13, m==='jc_zuiyue'?11:7); await W(100); for(const o of RT.ents.filter(o=>o.type==='npc')){ Story.talk(o.id); await W(80); if($('#dlg').hidden) bad.push(o.id); await adv('算了'); } for(const o of RT.ents.filter(o=>o.act&&o.type!=='npc'&&o.act!=='zyin')){ Dungeon.act(o); await adv(); } }
          const prog=QUESTS[S.quest].progress(S), ok=got.every(g=>g.inside&&g.hasLetter&&g.clue&&g.told===g.how)&&!bad.length&&/3\/4/.test(prog);
          return {fail:!ok, info:got.map(g=>`${g.how==='letter'?'送信':'赎琵琶'}：${g.inside?'':'没进楼 ✗ '}${g.clue?'线索':'线索 ✗'}`).join('，')+`${bad.length?'，没反应：'+bad.join(' '):''}，「${prog.slice(0,30)}」，${SelfTest3.lines.length-n0} 句`}; });
        await step('第三幕：千金坊 → 糖人小姑娘 → 赌大小（凝神听、每日上限）→ 连赢老板三把 → 后堂八卦镜 → 暗账（线索 4/4）', async()=>{ const n0=SelfTest3.lines.length; cur='千金坊';
          node('c3-qianjin').run(); await W(400); Story.talk('ds_girl'); await adv(); const girl=!!S.flags.c3_qj_girl&&count(S,'jc_tangren')===1;
          Dungeon.act(RT.map.objects.find(o=>o.act==='qjin')); await W(200); const inside=RT.mapId==='jc_qianjin';
          const real=QJ.dice; QJ.dice=()=>[5,5,6];   // every roll comes up 大
          // answer each choice in turn from a list, then 「不」 to whatever comes after
          const seq=async picks=>{ let idle=0; for(let i=0;i<300;i++){ const d=$('#dlg'); if(d.hidden){ await W(50); if(++idle>8) return; continue; } idle=0; const ch=[...d.querySelectorAll('[data-i]')];
            if(ch.length){ const want=picks.length?picks.shift():'不'; rec('选项',ch.map(c=>c.textContent).join(' / ')); (ch.find(c=>c.textContent.includes(want))||ch[ch.length-1]).click(); } else { if(UI.typing) d.onclick(); rec('对话',(d.querySelector('.port span,.who')?.textContent||'旁白')+'：'+(d.querySelector('#dText')?.textContent||'')); d.onclick&&d.onclick(); } await W(10); } };
          S.mp=stats().mp; Dungeon.act(obj('qjdice')); await seq(['凝神','押大','不玩了']); const mpUsed=S.mp<stats().mp;
          Story.talk('qj_boss'); await seq(['赌','押大','再来','押大','再来','押大']); QJ.dice=real; const invited=!!QJ.st().invited;
          Dungeon.act(obj('qjdoor')); await W(700); await adv(); const hall=RT.mapId==='jc_qjhoutang'; const b0=C3.st().bagua;
          Dungeon.act(obj('qjcaishen')); await adv('照'); const ledger=count(S,'c3_ledger')===1&&C3.st().bagua===b0-1&&!!XF.st().clue.ledger;
          // the daily cap
          QJ.st().lostDay=S.day; QJ.st().lost=QJ.CAP; enterMap('jc_qianjin',8,10); await W(100); Dungeon.act(obj('qjdice')); await W(80); if(UI.typing) $('#dlg').onclick(); await W(30); const capped=/手气背/.test($('#dText')?.textContent||''); await adv();
          const bad=[]; for(const m of ['jc_dongshi','jc_qianjin']){ enterMap(m,m==='jc_dongshi'?10:8,m==='jc_dongshi'?8:10); await W(100); for(const o of RT.ents.filter(o=>o.type==='npc')){ Story.talk(o.id); await W(80); if($('#dlg').hidden) bad.push(o.id); await adv('不'); } }
          const prog=QUESTS[S.quest].progress(S), ok=girl&&inside&&mpUsed&&invited&&hall&&ledger&&capped&&XF.n()===4&&!bad.length;
          return {fail:!ok, info:`${girl?'糖人小姑娘':'小姑娘 ✗'}，${inside?'进坊':'进坊 ✗'}，${mpUsed?'凝神听':'凝神 ✗'}，${invited?'连赢三把':'三把 ✗'}，${hall?'后堂':'后堂 ✗'}，${ledger?'暗账（八卦镜 '+C3.st().bagua+' 次）':'暗账 ✗'}，${capped?'每日上限':'上限 ✗'}${bad.length?'，没反应：'+bad.join(' '):''}，「${prog.slice(0,24)}」，${SelfTest3.lines.length-n0} 句`}; });
        await step('彩蛋：风眼里大师兄问牌位（裂了 / 还在）', async()=>{ const got=[]; for(const pick of ['裂了','还在']){ cur='彩蛋'; node('c3-lu').run(); await W(400);
            Dungeon.act(obj('fxboss2')); await adv(); for(let i=0;i<60&&!Battle.s;i++) await W(100); await fight(); await adv(pick); got.push(!!S.flags.c3_lu_egg); }
          return {fail:!got.every(Boolean), info:got.map(x=>x?'✓':'✗').join(' ')}; });
        await step('每张第三章的地图都走一遍：所有门、人、能点的东西都走得到', async()=>{ const bad=[];
          for(const [id,x,y] of [['c3_road',10,13],['c3_anping',11,16],['jc_zhuque',13,32],['jc_sifang',28,22],['jc_xishi',30,10],['jc_huichun',8,10],['jc_jubao',10,12],['jc_xiang',6,24],['jc_gongyuan',13,21],['jc_dongkou',2,4],['jc_zuiyue',8,11],['jc_dongshi',1,5],['jc_qianjin',8,11],['jc_qjhoutang',4,6]]){ enterMap(id,x,y); await W(100); const m=RT.map, sol=(a,b)=>a<0||b<0||a>=m.w||b>=m.h||RT.solid[b][a], seen=new Set([x+','+y]), q=[[x,y]];
            while(q.length){ const [a,b]=q.shift(); for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const k=(a+dx)+','+(b+dy); if(!seen.has(k)&&!sol(a+dx,b+dy)){ seen.add(k); q.push([a+dx,b+dy]); } } }
            const near=(a,b)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>seen.has((a+dx)+','+(b+dy)));
            for(const o of RT.ents){ if(o.type==='building'){ if(o.act&&o.door&&!seen.has(o.door.join())) bad.push(`${m.name}：${o.label}的门`); continue; }
              if((o.act||o.type==='npc')&&!near(o.x,o.y)) bad.push(`${m.name}：${o.name||o.label||o.spr||o.type}`); } }
          return {fail:bad.length>0, info:bad.length?bad.slice(0,4).join('；'):'14 张地图'}; });
        await step('台词检查：没有没替换的 {…}、undefined、「制作中」', async()=>{ const mine=SelfTest3.lines.filter(l=>l.sect===k), bad=mine.filter(l=>/\{[^{}]{0,6}\}|undefined|NaN|\[object|制作中/.test(l.text)&&!/第二幕「京城」正在制作中/.test(l.text));
          bad.forEach(l=>TestLog.issue(`${SECTS[k].name} ${l.node}「${l.text.slice(0,40)}」`)); return {fail:bad.length>0, info:bad.length?bad.slice(0,2).map(l=>`${l.node}「${l.text.slice(0,30)}」`).join('；'):`${mine.length} 句都没问题`}; });
      }
      await step('第三章的插画都能打开', async()=>{ const bad=[]; for(const [n,f] of [['裂开的牌位',()=>C3A.shrineCG()],['山脊',()=>C3A.ridgeCG()],['雷云',()=>JD.cg()],['小巷',()=>C3A.xiangCG()],['开幕式的高台',()=>KM.cg()]]){ try{ f(); await W(150); if(!PixCG.on) bad.push(n); }catch(e){ bad.push(n+'：'+e.message); } PixCG.close(); }
        return {fail:bad.length>0, info:bad.length?bad.join('；'):'5 张'}; });
      await step('没有脚本错误', async()=>({fail:errs.length>0, info:errs.slice(0,2).join(' | ')}));
    } finally { Review.sect=null; Dodge.auto=false; Dev.god=false; removeEventListener('error',onErr); if(Battle.s) Battle.close(); PixCG.close();
      try{ if(backup) localStorage.setItem(slotKey(2),backup); else localStorage.removeItem(slotKey(2)); }catch(e){} }
    el.querySelector('h3').textContent=`第三章自检完成：${pass} 项通过${fail?`，${fail} 项失败`:''}（共检查 ${SelfTest3.lines.length} 句）`; el.querySelector('.st-box').classList.add(fail?'bad':'ok');
    errs.forEach(e=>TestLog.issue('脚本错误：'+e)); TestLog.end(pass,fail); TestLog.buttons($('#stNote'), ()=>{ el.remove(); UI.title(); });
    console.log(`[selftest3] ${pass} passed, ${fail} failed, ${SelfTest3.lines.length} lines`);
  },
};
// #selftest3:醉月楼,擂台 runs only the steps whose names contain one of those words (and the map walk, line check and
// script-error check, which are cheap); use it when only those parts changed
{ const h=decodeURIComponent(location.hash); if(/^#selftest3(all)?(:|$)/.test(h)){ SelfTest3.all=h.startsWith('#selftest3all'); const m=h.split(':')[1]; SelfTest3.only=m?m.split(/[,，]/).filter(Boolean):null; setTimeout(()=>SelfTest3.run(),900); } }
