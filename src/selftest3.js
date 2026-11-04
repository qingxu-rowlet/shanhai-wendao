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
    const el=document.createElement('div'); el.id='selftest'; el.innerHTML=`<div class="st-box wood"><h3>第三章自检中…</h3><ol id="stList"></ol><p class="muted" id="stNote">${SelfTest3.all?'四个宗门各走一遍':'随机选一个宗门走一遍'}第三章，每句台词都会检查。</p></div>`; document.body.appendChild(el);
    const list=$('#stList'); let pass=0, fail=0, sect='', cur=''; TestLog.begin(SelfTest3.all?'第三章（四个宗门）':'第三章'); SelfTest3.lines=[];
    const report=(name,ok,info='')=>{ ok?pass++:fail++; TestLog.item(name,ok,info); const li=document.createElement('li'); li.className=ok?'ok':'bad'; li.textContent=`${ok?'✓':'✗'} ${name}${info?' — '+info:''}`; list.appendChild(li); li.scrollIntoView({block:'nearest'}); };
    const step=async(name,fn)=>{ try{ const r=await fn(); report(`[${SECTS[sect].name}] ${name}`, r!==false&&!(r&&r.fail), r&&r.info||''); }catch(e){ report(`[${SECTS[sect].name}] ${name}`,false,String(e&&e.message||e)); } finally{ PixCG.close(); if(Battle.s&&!$('#battle').hidden) Battle.close(); } };
    const rec=(kind,text)=>{ text=String(text||'').replace(/\s*▼\s*$/,'').trim(); if(text){ SelfTest3.lines.push({sect,node:cur,text}); TestLog.line(SECTS[sect].name+' · '+cur,kind,text); } };
    // dialogue to its end; pick = an option's index, or words it contains. Fades run on the frame loop, which stops in a
    // hidden window, so they are stepped here.
    const adv=async(pick=0,max=600)=>{ let idle=0; for(let i=0;i<max;i++){ if(RT.fadeTo) update(.1); const d=$('#dlg');
        if(d.hidden){ await W(60); if($('#dlg').hidden&&!RT.fadeTo&&++idle>6) return; continue; } idle=0;
        const ch=[...d.querySelectorAll('[data-i]')]; if(ch.length){ rec('选项',ch.map(c=>c.textContent).join(' / ')); const c=typeof pick==='string'?(ch.find(c=>c.textContent.includes(pick))||ch[0]):ch[Math.min(pick,ch.length-1)]; c.click(); }
        else if(d.onclick){ if(UI.typing) d.onclick(); rec('对话',(d.querySelector('.port span,.who')?.textContent||'旁白')+'：'+(d.querySelector('#dText')?.textContent||'')); d.onclick&&d.onclick(); }
        await W(10); } };
    const fight=async()=>{ Dev.god=true; let n=0; for(let i=0;i<150&&!(Battle.s&&!Battle.s.busy);i++){ document.querySelectorAll('.boss-intro,#bossIntro').forEach(e=>e.click()); await W(80); }
      while(Battle.s&&!Battle.s.over&&n<90){ const s=Battle.s, st=stats(); S.hp=Math.max(S.hp,st.hp*.6|0); if(s.busy){ await W(50); continue; }
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
        await step('彩蛋：风眼里大师兄问牌位（裂了 / 还在）', async()=>{ const got=[]; for(const pick of ['裂了','还在']){ cur='彩蛋'; node('c3-lu').run(); await W(400);
            Dungeon.act(obj('fxboss2')); await adv(); for(let i=0;i<60&&!Battle.s;i++) await W(100); await fight(); await adv(pick); got.push(!!S.flags.c3_lu_egg); }
          return {fail:!got.every(Boolean), info:got.map(x=>x?'✓':'✗').join(' ')}; });
        await step('每张第三章的地图都走一遍：所有门、人、能点的东西都走得到', async()=>{ const bad=[];
          for(const [id,x,y] of [['c3_road',10,13],['c3_anping',11,16],['jc_zhuque',13,32],['jc_sifang',28,22],['jc_xishi',30,10],['jc_huichun',8,10],['jc_jubao',10,12]]){ enterMap(id,x,y); await W(100); const m=RT.map, sol=(a,b)=>a<0||b<0||a>=m.w||b>=m.h||RT.solid[b][a], seen=new Set([x+','+y]), q=[[x,y]];
            while(q.length){ const [a,b]=q.shift(); for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const k=(a+dx)+','+(b+dy); if(!seen.has(k)&&!sol(a+dx,b+dy)){ seen.add(k); q.push([a+dx,b+dy]); } } }
            const near=(a,b)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>seen.has((a+dx)+','+(b+dy)));
            for(const o of RT.ents){ if(o.type==='building'){ if(o.act&&o.door&&!seen.has(o.door.join())) bad.push(`${m.name}：${o.label}的门`); continue; }
              if((o.act||o.type==='npc')&&!near(o.x,o.y)) bad.push(`${m.name}：${o.name||o.label||o.spr||o.type}`); } }
          return {fail:bad.length>0, info:bad.length?bad.slice(0,4).join('；'):'7 张地图'}; });
        await step('台词检查：没有没替换的 {…}、undefined、「制作中」', async()=>{ const mine=SelfTest3.lines.filter(l=>l.sect===k), bad=mine.filter(l=>/\{[^{}]{0,6}\}|undefined|NaN|\[object|制作中/.test(l.text)&&!/第二幕「京城」正在制作中/.test(l.text));
          bad.forEach(l=>TestLog.issue(`${SECTS[k].name} ${l.node}「${l.text.slice(0,40)}」`)); return {fail:bad.length>0, info:bad.length?bad.slice(0,2).map(l=>`${l.node}「${l.text.slice(0,30)}」`).join('；'):`${mine.length} 句都没问题`}; });
      }
      await step('第三章的插画都能打开', async()=>{ const bad=[]; for(const [n,f] of [['裂开的牌位',()=>C3A.shrineCG()],['山脊',()=>C3A.ridgeCG()]]){ try{ f(); await W(150); if(!PixCG.on) bad.push(n); }catch(e){ bad.push(n+'：'+e.message); } PixCG.close(); }
        return {fail:bad.length>0, info:bad.length?bad.join('；'):'2 张'}; });
      await step('没有脚本错误', async()=>({fail:errs.length>0, info:errs.slice(0,2).join(' | ')}));
    } finally { Review.sect=null; Dodge.auto=false; Dev.god=false; removeEventListener('error',onErr); if(Battle.s) Battle.close(); PixCG.close();
      try{ if(backup) localStorage.setItem(slotKey(2),backup); else localStorage.removeItem(slotKey(2)); }catch(e){} }
    el.querySelector('h3').textContent=`第三章自检完成：${pass} 项通过${fail?`，${fail} 项失败`:''}（共检查 ${SelfTest3.lines.length} 句）`; el.querySelector('.st-box').classList.add(fail?'bad':'ok');
    errs.forEach(e=>TestLog.issue('脚本错误：'+e)); TestLog.end(pass,fail); TestLog.buttons($('#stNote'), ()=>{ el.remove(); UI.title(); });
    console.log(`[selftest3] ${pass} passed, ${fail} failed, ${SelfTest3.lines.length} lines`);
  },
};
if(location.hash==='#selftest3'||location.hash==='#selftest3all'){ SelfTest3.all=location.hash==='#selftest3all'; setTimeout(()=>SelfTest3.run(),900); }
