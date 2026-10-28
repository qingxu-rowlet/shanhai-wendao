/* ============================================================
   山海问道 · 第二章自检 — open the game with #selftest2 and it plays chapter two by itself, once as a disciple of each of the
   four sects: every review node of the chapter played to the end of its scene (fights included, dodging resolves at once),
   every branch of every choice, the gossip, the chores, the three bosses, 饿鬼洞 and the pulling of 饕餮's soul, the epilogue,
   and every picture. Every line that appears — dialogue, choices, the bubbles in battle, the battle log, the notices — is
   kept and checked: nothing left like {宗} or undefined, nothing «正在制作中», and no other sect's name where yours should
   be. Takes a while (about 20 minutes). Uses save slot 3 and puts it back afterwards. (#selftest still plays chapter one.)
   ============================================================ */
const SelfTest2 = {
  lines:[], issues:[], cross:[],
  async run(){
    const W=ms=>new Promise(r=>setTimeout(r,ms)), errs=[]; const onErr=e=>{ errs.push((e.message||String(e))+` @${e.lineno}:${e.colno}`); SelfTest2.errStacks=(SelfTest2.errStacks||[]).concat([(e.error&&e.error.stack||'').split(String.fromCharCode(10)).slice(0,4).join(' | ')]); }; addEventListener('error',onErr);
    const el=document.createElement('div'); el.id='selftest'; el.innerHTML='<div class="st-box wood"><h3>第二章自检中…</h3><ol id="stList"></ol><p class="muted" id="stNote">会用四个宗门各走一遍第二章，每句台词都会检查，大约需要二十分钟。</p></div>'; document.body.appendChild(el);
    const list=$('#stList'); let pass=0, fail=0, sect='', cur='';
    const report=(name, ok, info='')=>{ ok?pass++:fail++; const li=document.createElement('li'); li.className=ok?'ok':'bad'; li.textContent=`${ok?'✓':'✗'} ${name}${info?' — '+info:''}`; list.appendChild(li); li.scrollIntoView({block:'nearest'}); };
    const step=async(name, fn, keep)=>{ try{ const r=await fn(); report(`[${SECTS[sect].name}] ${name}`, r!==false&&!(r&&r.fail), r&&r.info||''); }catch(e){ report(`[${SECTS[sect].name}] ${name}`,false,String(e&&e.message||e)); } finally{ if(!keep){ PixCG.close(); if(Battle.s&&!$('#battle').hidden) Battle.close(); } } };
    const node=id=>{ const n=Review.NODES.find(x=>x.id===id); if(!n) throw new Error('没有审查点 '+id); return n; };
    // every line that shows is kept, with the sect and the scene it came from
    const rec=(kind,text)=>{ text=String(text||'').replace(/\s*▼\s*$/,'').trim(); if(text) SelfTest2.lines.push({sect, node:cur, kind, text}); };
    const _log=Battle.log, _toast=UI.toast; Battle.log=function(t){ const r=_log.apply(Battle,arguments); rec('战斗',$('#bLog')&&$('#bLog').textContent); return r; }; UI.toast=function(t){ const r=_toast.apply(UI,arguments); rec('提示',$('#toast')&&$('#toast').textContent); return r; };   // what actually shows, after the game fills in {宗} and the rest
    const bubbles=()=>document.querySelectorAll('#battle .b-talk').forEach(b=>{ rec('战斗对话',b.innerText.replace(/\n+/g,'：')); b.click(); });
    // dialogue: finish each line, keep it, go on (pick = which option to take at a choice)
    const adv=async(pick=0,max=500)=>{ let n=0; for(let i=0;i<max;i++){ bubbles();
        const d=$('#dlg'); if(d.hidden){ await W(60); if($('#dlg').hidden) return n; continue; } const ch=d.querySelectorAll('[data-i]');
        if(ch.length){ rec('选项',d.querySelector('.dtext p')?.textContent+' → '+[...ch].map(c=>c.textContent).join(' / ')); ch[Math.min(pick,ch.length-1)].click(); }
        else if(d.onclick){ if(UI.typing) d.onclick(); const who=d.querySelector('.port span,.who')?.textContent||'旁白'; rec('对话',who+'：'+(d.querySelector('#dText')?.textContent||'')); d.onclick&&d.onclick(); n++; }
        await W(10); } return n; };
    // a fight: the mirror at a shield, 御剑术 to gather 剑意 then the 绝学, a pill when low (the test player cannot die:
    // this checks the story and the words, not how hard the fights are)
    const fight=async()=>{ let n=0; Dev.god=true; for(let i=0;i<150&&!(Battle.s&&!Battle.s.busy);i++){ document.querySelectorAll('.boss-intro,#bossIntro').forEach(e=>e.click()); bubbles(); await W(80); }
      while(Battle.s&&!Battle.s.over&&n<90){ bubbles(); const s=Battle.s; const st=stats(); S.hp=Math.max(S.hp,st.hp*.6|0); if(s.busy){ await W(50); continue; }
        if(s.shield>0&&$('[data-a="mirror"]')) Battle.act('mirror');
        else if(S.sect&&s.jianyi&&S.mp>=SECTS[S.sect].skill.mp) Battle.act('sect'); else if(S.mp>=Battle.skillMp()) Battle.act('skill'); else { S.mp=st.mp; Battle.act('atk'); }
        n++; await W(200); }
      for(let i=0;i<40&&!$('#bOk');i++){ bubbles(); await W(100); }
      const ok=$('#bOk'); if(ok) ok.click(); await W(400); Dev.god=false; return {won:!!ok, turns:n}; };
    // a scene to its end: the dialogue, a fight if one starts, what follows it; scenes that start a moment after a map loads too
    // 二师兄's dream: the well, the kitchen, the cellar, then the shard that looks at you (pick: 0 look, 1 not)
    const dream=async(pick=0)=>{ for(const act of ['c2dwell','c2dhouse','c2dcellar','c2dshard']){ if(RT.mapId!=='mj_dream') return; const o=RT.map.objects.find(o=>o.act===act); if(!o) continue; Dungeon.act(o); await adv(pick); await W(500); } await adv(pick); };
    const play=async(id,pick=0)=>{ cur=id; node(id).run(); await W(800); for(let k=0;k<12;k++){ await adv(pick); if(RT.mapId==='mj_dream'){ await dream(pick); continue; } if(Battle.s){ await fight(); continue; } await W(700); if($('#dlg').hidden&&!Battle.s) break; } };
    const backup=localStorage.getItem(slotKey(2)), realRandom=Math.random; Dev.god=false; Dodge.auto=true; SelfTest2.lines=[]; SelfTest2.issues=[]; SelfTest2.cross=[];
    const NODES=Review.NODES.filter(x=>x.group==='第二章');
    const other=k=>Object.keys(SECTS).filter(j=>j!==k).flatMap(j=>[SECTS[j].name, SECTS[j].master.name, ({jian:'青云',dan:'药王谷',shou:'万兽谷',tianji:'天机阁'})[j]]);
    try{
      for(const k of ['jian','dan','shou','tianji']){ sect=k; Review.sect=k;
        await step('每个第二章审查点都能进入，任务栏有目标，寻路走得通', async()=>{ const bad=[];
          for(const nd of NODES){ try{ cur=nd.id; nd.run(); await W(350); await adv(0,40); if(Battle.s) Battle.close(); PixCG.close(); UI.closeDlg&&UI.closeDlg(false);
              const tr=Nav.tracked(), g=Nav.goal(); if(!tr) bad.push(nd.id+'：没有任务'); else if(tr.target&&!g) bad.push(nd.id+'：找不到去的路'); else if(g&&!Nav.pathTo(g)) bad.push(nd.id+'：寻路走不通'); }
            catch(e){ bad.push(nd.id+'：'+e.message); } }
          return {fail:bad.length>0, info:bad.length?bad.slice(0,3).join('；'):`${NODES.length} 个审查点`}; });
        await step('每个审查点的剧情都完整走一遍（含战斗）', async()=>{ const bad=[], n0=SelfTest2.lines.length;
          for(const nd of NODES){ try{ await play(nd.id); } catch(e){ bad.push(nd.id+'：'+e.message); } if(Battle.s) Battle.close(); PixCG.close(); }
          return {fail:bad.length>0, info:bad.length?bad.slice(0,3).join('；'):`${SelfTest2.lines.length-n0} 句`}; });
        await step('每个选项的分支都走一遍', async()=>{ const n0=SelfTest2.lines.length;
          for(const [id,picks] of [['c2-mj2',[1]],['c2-fox',[1,2]],['c2-cave',[0,1]],['c2-dream',[0,1]],['c2-act5end',[1,2]]]) for(const p of picks){ await play(id,p); if(Battle.s) Battle.close(); PixCG.close(); }
          cur='c2-gossip'; node('c2-gossip').run(); await W(700); await adv(); for(const id of ['c2d_lin','c2d_zhou','c2d_sun','c2d_zhong']){ Story.talk(id); await adv(1); }
          cur='c2-mjgo'; node('c2-mjgo').run(); await W(700); await adv(); Story.talk('lu'); await W(300); await adv(); await W(900); await adv();   // the morning at the gate: 苏小棠's packet
          return {info:`${SelfTest2.lines.length-n0} 句`}; });
        await step('宗门：替大师姐说话会被记住', async()=>{ cur='c2-gossip'; node('c2-gossip').run(); await W(700); await adv(); Story.talk('c2d_lin'); await adv(0); return {fail:!S.flags.c2_defend_xie}; });
        await step('宗门日常：三位师兄师姐各派一件事', async()=>{ cur='c2-jian'; node('c2-jian').run(); await W(700); await adv(); for(const w of ['lu','xie','man']){ Story.talk(w); await adv(); }
          for(let i=0;i<8;i++){ const o=RT.ents.find(e=>e.act==='dummy'); if(!o) break; Dungeon.act(o); }
          Story.talk('lu'); await adv(); return {fail:!(S.c2.got.lu===2&&S.c2.got.xie===1&&S.c2.got.man===1)}; });
        await step('三个 Boss 都能打完，剧情接得上', async()=>{ const r=[];
          cur='c2-boss1'; node('c2-boss1').run(); await W(800); await adv(); let f=await fight(); await adv(); r.push(f.won&&S.flags.c2_qq_sealed?`穷奇 ${f.turns}`:'穷奇 ✗');
          cur='c2-xinmo'; node('c2-xinmo').run(); await W(800); await adv(); f=await fight(); await adv(0); r.push(f.won&&S.flags.c2_xin_done&&count(S,'c2_bagua')?`心魔 ${f.turns}`:'心魔 ✗');
          cur='c2-cave'; node('c2-cave').run(); await W(800); await adv(2); await dream(1); await adv(2); for(let i=0;i<200&&!Battle.s;i++) await W(100); f=await fight(); await adv(0); r.push(f.won&&S.flags.c2_man_saved&&RT.mapId==='mj_south'?`饕餮 ${f.turns}`:'饕餮 ✗');
          return {fail:r.some(x=>x.includes('✗')), info:r.join('，')+' 回合'}; });
        await step('尾声：师尊收镜 → 外门弟子的新话 → 回房睡觉 → 早课，第二章完', async()=>{ cur='c2-epilogue'; node('c2-epilogue').run(); await W(800); S.inv.c2_bagua=1; Portal.open(); await W(700); await adv();
          const mirror=!count(S,'c2_bagua'), back=!!S.flags.c2_master_back; for(const id of ['c2d_zhou','c2d_lin','c2d_sun','c2d_zhong','xie',SECTS[k].master.id]){ Story.talk(id); await adv(); }
          const o=RT.map.objects.find(o=>o.act==='c2bed'); Dungeon.act(o); await adv(0); await W(1100); await adv(); for(let i=0;i<20&&QUESTS[S.quest].id!=='c2z';i++){ await W(150); Story.check(); }
          return {fail:!(mirror&&back&&S.flags.c2_done&&QUESTS[S.quest].id==='c2z')}; });
        await step('台词检查：没有没替换的 {…}、undefined、「制作中」', async()=>{ const mine=SelfTest2.lines.filter(l=>l.sect===k), bad=mine.filter(l=>/\{[^{}]{0,6}\}|undefined|NaN|\bnull\b|\[object|制作中|敬请期待。）$/.test(l.text)&&!/第三章，敬请期待/.test(l.text));
          SelfTest2.issues.push(...bad); const others=other(k), cross=mine.filter(l=>others.some(w=>l.text.includes(w))); SelfTest2.cross.push(...cross);
          return {fail:bad.length>0, info:bad.length?bad.slice(0,2).map(l=>`${l.node}「${l.text.slice(0,30)}」`).join('；'):`${mine.length} 句都没问题${cross.length?`；提到别的宗门 ${cross.length} 处（人工看一下）`:''}`}; });
      }
      sect='jian';
      await step('第二章的插画都能打开', async()=>{ const bad=[]; cur='c2-cave'; node('c2-cave').run(); await W(700); await adv(0,2); PixCG.close(); UI.closeDlg&&UI.closeDlg(false);
        const cgs={'镜中人':()=>C2L.nightCG(),'往事 ×3':()=>[0,1,2].forEach(i=>C2L.echoCG(i)),'九尾':()=>C2X.foxCG(),'洞口':()=>C2Y.meetCG(),'饿':()=>C2Y.caveCG(),'丰年村 / 别出声 / 大火':()=>[0,1,2].forEach(i=>C2Y.memCG(i)),'饕餮':()=>C2Y.wakeCG(),'镜收':()=>C2Y.sealCG(),'长歌':()=>C2Y.dawnCG(),'早课':()=>C2Y.morningCG(),'镜中的你':()=>C2Y.shardCG('look'),'扣下':()=>C2Y.shardCG('no')};
        for(const c in cgs){ try{ cgs[c](); await W(120); if(!PixCG.on) bad.push(c); }catch(e){ bad.push(c+'：'+e.message); } PixCG.close(); }
        return {fail:bad.length>0, info:bad.length?bad.join('；'):`${Object.keys(cgs).length} 组`}; });
      await step('没有脚本错误', async()=>({fail:errs.length>0, info:errs.slice(0,2).join(' | ')}));
    } finally { Battle.log=_log; UI.toast=_toast; Review.sect=null; Dodge.auto=false; Math.random=realRandom; Dev.god=false; removeEventListener('error',onErr); if(Battle.s) Battle.close(); PixCG.close();
      try{ if(backup) localStorage.setItem(slotKey(2),backup); else localStorage.removeItem(slotKey(2)); }catch(e){} }
    el.querySelector('h3').textContent=`第二章自检完成：${pass} 项通过${fail?`，${fail} 项失败`:''}（共检查 ${SelfTest2.lines.length} 句）`; el.querySelector('.st-box').classList.add(fail?'bad':'ok');
    $('#stNote').innerHTML=`<button class="btn mini" id="stClose">关闭</button>　第 3 个存档位已恢复原样。`; $('#stClose').onclick=()=>{ el.remove(); UI.title(); };
    console.log(`[selftest2] ${pass} passed, ${fail} failed, ${SelfTest2.lines.length} lines`);
  },
};
if(location.hash==='#selftest2') setTimeout(()=>SelfTest2.run(),900);
