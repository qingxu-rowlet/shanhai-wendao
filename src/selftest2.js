/* ============================================================
   山海问道 · 第二章自检 — open the game with #selftest2 and it walks chapter two by itself from the review nodes: every node
   loads with a task and a way to walk there, the sect's gossip and chores, all three bosses (dodging resolves at once),
   大师姐's ending, 饿鬼洞 through 饕餮 and the pulling of its soul, the epilogue at the sect, and every picture of the
   chapter. Uses save slot 3 and puts it back afterwards. (#selftest still plays chapter one.)
   ============================================================ */
const SelfTest2 = {
  async run(){
    const W=ms=>new Promise(r=>setTimeout(r,ms)), errs=[]; const onErr=e=>errs.push(e.message||String(e)); addEventListener('error',onErr);
    const el=document.createElement('div'); el.id='selftest'; el.innerHTML='<div class="st-box wood"><h3>第二章自检中…</h3><ol id="stList"></ol><p class="muted" id="stNote">会自动走一遍第二章，大约需要三分钟。</p></div>'; document.body.appendChild(el);
    const list=$('#stList'); let pass=0, fail=0;
    const report=(name, ok, info='')=>{ ok?pass++:fail++; const li=document.createElement('li'); li.className=ok?'ok':'bad'; li.textContent=`${ok?'✓':'✗'} ${name}${info?' — '+info:''}`; list.appendChild(li); li.scrollIntoView({block:'nearest'}); };
    const step=async(name, fn, keep)=>{ try{ const r=await fn(); report(name, r!==false&&!(r&&r.fail), r&&r.info||''); }catch(e){ report(name,false,String(e&&e.message||e)); } finally{ if(!keep){ PixCG.close(); if(Battle.s&&!$('#battle').hidden) Battle.close(); } } };
    const node=id=>{ const n=Review.NODES.find(x=>x.id===id); if(!n) throw new Error('没有审查点 '+id); return n; };
    const load=async id=>{ node(id).run(); await W(700); };
    // dialogue: click through (pick = which option to take), also the bubbles that talk in battle
    const adv=async(pick=0,max=400)=>{ let n=0; for(let i=0;i<max;i++){ document.querySelectorAll('#battle .b-talk').forEach(b=>b.click());
        const d=$('#dlg'); if(d.hidden){ await W(60); if($('#dlg').hidden) return n; continue; } const ch=d.querySelectorAll('[data-i]');
        if(ch.length) ch[Math.min(pick,ch.length-1)].click(); else if(d.onclick){ if(UI.typing) d.onclick(); d.onclick&&d.onclick(); n++; } await W(12); } return n; };
    // a fight: 御剑术 to gather 剑意, then the 绝学; a pill when low; the result button at the end
    // (the test player cannot die: this checks that the story runs, not how hard the fights are)
    const fight=async()=>{ let n=0; Dev.god=true; for(let i=0;i<120&&!(Battle.s&&!Battle.s.busy);i++){ document.querySelectorAll('.boss-intro,#bossIntro,#battle .b-talk').forEach(e=>e.click()); await W(80); }
      while(Battle.s&&!Battle.s.over&&n<90){ document.querySelectorAll('#battle .b-talk').forEach(b=>b.click()); const s=Battle.s; const st=stats(); S.hp=Math.max(S.hp,st.hp*.6|0); if(s.busy){ await W(60); continue; }
        if(S.hp<st.hp*.35&&count(S,'huichun')){ $('[data-a="pill"]').click(); await W(5); const p=$('[data-p="huichun"]'); p&&p.click(); }
        else if(S.sect&&s.jianyi&&S.mp>=SECTS[S.sect].skill.mp) Battle.act('sect'); else if(S.mp>=Battle.skillMp()) Battle.act('skill'); else Battle.act('atk');
        n++; await W(260); }
      for(let i=0;i<40&&!$('#bOk');i++){ document.querySelectorAll('#battle .b-talk').forEach(b=>b.click()); await W(100); }
      const ok=$('#bOk'); if(ok) ok.click(); await W(400); Dev.god=false; return {won:!!ok, turns:n}; };
    const backup=localStorage.getItem(slotKey(2)), realRandom=Math.random; Dev.god=false; Dodge.auto=true;
    try{
      // every node: loads, says where to go, and the way there can be walked
      await step('每个第二章审查点都能进入，任务栏有目标，寻路走得通', async()=>{ const bad=[]; let n=0;
        for(const nd of Review.NODES.filter(x=>x.group==='第二章')){ try{ nd.run(); await W(350); await adv(0,40); if(Battle.s){ Battle.close(); } PixCG.close(); UI.closeDlg&&UI.closeDlg(false); n++;
            const tr=Nav.tracked(), g=Nav.goal(); if(!tr) bad.push(nd.id+'：没有任务'); else if(tr.target&&!g) bad.push(nd.id+'：找不到去的路'); else if(g&&!Nav.pathTo(g)) bad.push(nd.id+'：寻路走不通'); }
          catch(e){ bad.push(nd.id+'：'+e.message); } }
        return {fail:bad.length>0, info:bad.length?bad.slice(0,3).join('；'):`${n} 个审查点`}; });
      await step('宗门：外门弟子的闲话，替大师姐说话会被记住', async()=>{ await load('c2-gossip'); await adv(); Story.talk('c2d_lin'); await adv(0); return {fail:!S.flags.c2_defend_xie}; });
      await step('宗门日常：接大师兄的练功 → 打 8 下木桩 → 交差', async()=>{ await load('c2-jian'); await adv(); Story.talk('lu'); await adv();
        for(let i=0;i<8;i++){ const o=RT.ents.find(e=>e.act==='dummy'); if(!o) break; Dungeon.act(o); }
        Story.talk('lu'); await adv(); return {fail:S.c2.got.lu!==2, info:`木桩 ${S.c2.p.dummy}/8`}; });
      await step('第三幕 Boss：穷奇 · 陆正衡，打赢后封印', async()=>{ await load('c2-boss1'); await adv(); const r=await fight(); await adv(); return {fail:!(r.won&&S.flags.c2_qq_sealed), info:`${r.turns} 回合`}; });
      await step('第四幕 Boss：心魔 · 霁影 → 九尾狐 → 大师姐的结局', async()=>{ await load('c2-xinmo'); await adv(); const r=await fight(); await adv(0); return {fail:!(r.won&&S.flags.c2_xin_done&&count(S,'c2_bagua')), info:`${r.turns} 回合`}; });
      await step('第五幕：饿鬼洞剧情（往事三张插画、饕餮苏醒、对顾长歌的选择）', async()=>{ await load('c2-cave'); await adv(2); for(let i=0;i<200&&!Battle.s;i++) await W(100); return {fail:!(S.flags.c2_awake&&S.flags.c2_ge_r==='hand'&&Battle.s&&Battle.s.kind==='c2_taotie')}; }, true);
      await step('第五幕 Boss：饕餮（三人一起）→ 剥离神魂 → 结局', async()=>{ const r=await fight(); await adv(0); return {fail:!(r.won&&S.flags.c2_sealed&&S.flags.c2_man_saved&&RT.mapId==='mj_south'), info:`${r.turns} 回合`}; });
      await step('尾声：传送阵回宗门 → 师尊收走八卦镜 → 外门弟子的新话 → 回房睡觉 → 早课，第二章完', async()=>{ await load('c2-epilogue'); S.inv.c2_bagua=1; Portal.open(); await W(700); await adv();
        const mirror=!count(S,'c2_bagua'), back=!!S.flags.c2_master_back; Story.talk('c2d_sun'); await adv(); const o=RT.map.objects.find(o=>o.act==='c2bed'); Dungeon.act(o); await adv(0); await W(1100); await adv(); for(let i=0;i<20&&QUESTS[S.quest].id!=='c2z';i++){ await W(150); Story.check(); }
        return {fail:!(mirror&&back&&S.flags.c2_done&&QUESTS[S.quest].id==='c2z'), info:QUESTS[S.quest].title}; });
      await step('第二章的插画都能打开', async()=>{ const bad=[]; await load('c2-cave'); await adv(0,2); PixCG.close(); UI.closeDlg&&UI.closeDlg(false);
        const cgs={'镜中人':()=>C2L.nightCG(),'往事 ×3':()=>[0,1,2].forEach(i=>C2L.echoCG(i)),'九尾':()=>C2X.foxCG(),'洞口':()=>C2Y.meetCG(),'饿':()=>C2Y.caveCG(),'丰年村 / 别出声 / 大火':()=>[0,1,2].forEach(i=>C2Y.memCG(i)),'饕餮':()=>C2Y.wakeCG(),'镜收':()=>C2Y.sealCG(),'长歌':()=>C2Y.dawnCG(),'早课':()=>C2Y.morningCG()};
        for(const k in cgs){ try{ cgs[k](); await W(120); if(!PixCG.on) bad.push(k); }catch(e){ bad.push(k+'：'+e.message); } PixCG.close(); }
        return {fail:bad.length>0, info:bad.length?bad.join('；'):`${Object.keys(cgs).length} 组`}; });
      await step('没有脚本错误', async()=>({fail:errs.length>0, info:errs.slice(0,2).join(' | ')}));
    } finally { Dodge.auto=false; Math.random=realRandom; Dev.god=false; removeEventListener('error',onErr); if(Battle.s) Battle.close(); PixCG.close();
      try{ if(backup) localStorage.setItem(slotKey(2),backup); else localStorage.removeItem(slotKey(2)); }catch(e){} }
    el.querySelector('h3').textContent=`第二章自检完成：${pass} 项通过${fail?`，${fail} 项失败`:''}`; el.querySelector('.st-box').classList.add(fail?'bad':'ok');
    $('#stNote').innerHTML=`<button class="btn mini" id="stClose">关闭</button>　第 3 个存档位已恢复原样。`; $('#stClose').onclick=()=>{ el.remove(); UI.title(); };
    console.log(`[selftest2] ${pass} passed, ${fail} failed`);
  },
};
if(location.hash==='#selftest2') setTimeout(()=>SelfTest2.run(),900);
