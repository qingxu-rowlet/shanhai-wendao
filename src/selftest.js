/* ============================================================
   山海问道 · 自检 (self test) — open the game with #selftest and it plays through chapter one by itself,
   then shows a ✓/✗ report. It uses save slot 3 and puts it back afterwards.
   ============================================================ */
const SelfTest = {
  errors:[],
  async run(){
    const W=ms=>new Promise(r=>setTimeout(r,ms));
    const el=document.createElement('div'); el.id='selftest'; el.innerHTML='<div class="st-box wood"><h3>自检中…</h3><ol id="stList"></ol><p class="muted" id="stNote">会自动完成整章流程，大约需要两分钟。</p></div>'; document.body.appendChild(el);
    const list=$('#stList'); let pass=0, fail=0;
    const report=(name, ok, info='')=>{ ok?pass++:fail++; const li=document.createElement('li'); li.className=ok?'ok':'bad'; li.textContent=`${ok?'✓':'✗'} ${name}${info?' — '+info:''}`; list.appendChild(li); li.scrollIntoView({block:'nearest'}); };
    const step=async(name, fn)=>{ try{ const r=await fn(); report(name, r!==false&&!(r&&r.fail), r&&r.info||''); }catch(e){ report(name,false,String(e&&e.message||e)); } };
    const adv=async(pick=0)=>{ for(let i=0;i<120;i++){ const d=$('#dlg'); if(d.hidden) return; const ch=d.querySelectorAll('[data-i]'); if(ch.length) ch[Math.min(pick,ch.length-1)].click(); else if(d.onclick){ d.onclick(); d.onclick&&d.onclick(); } await W(15); } };
    const fight=async()=>{ let n=0; while(Battle.s&&!Battle.s.over&&n<80){ if(Battle.s.busy){ await W(60); continue; } const it=Battle.intent(), st=stats();
        if(S.hp<st.hp*.4&&S.inv.huichun){ $('[data-a="pill"]').click(); await W(5); const p=$('[data-p="huichun"]'); p&&p.click(); }
        else if(it==='big'||it==='charm') Battle.act('guard'); else if(S.sect&&S.mp>=SECTS[S.sect].skill.mp) Battle.act('sect'); else if(S.mp>=8) Battle.act('skill'); else Battle.act('atk');
        n++; await W(680); }
      const ok=$('#bOk'); if(ok) ok.click(); await W(50); return !!ok; };
    const backup=localStorage.getItem(slotKey(2)); const realRandom=Math.random;
    Dev.god=false; RT.slot=2;
    try{
      await step('开局：创建角色、序章对话', async()=>{ localStorage.removeItem(slotKey(2)); Creator.open(2); await W(30); $('#crGo').click(); await W(80);
        for(let i=0;i<40&&!$('#rtGo');i++){ const d=$('#dlg'); const ch=d.querySelectorAll('[data-i]'); if(ch.length) ch[0].click(); else d.onclick&&(d.onclick(),d.onclick&&d.onclick()); await W(15); }
        return !!$('#rtGo'); });
      await step('测灵根（按下时才随机，有「测灵根前」存档）', async()=>{ const pre=!!SaveSys.read(2,'pre_root'), before=S.root; $('#rtGo').click(); await W(2300); const got=S.root; $('#rtGo').click(); await W(30); await adv();
        return {fail:!(pre&&!before&&got), info:Sect.rootName()}; });
      await step('序章完成：拿到玉简，主线「采一株灵草」', async()=>({fail:!(S.inv.slip&&QUESTS[S.quest].id==='q1'&&S.flags.intro_done)}));
      await step('采集灵草 → 主线推进', async()=>{ const o=RT.ents.find(e=>e.type==='gather'&&e.item==='lingcao'); gather(o); await W(30); await adv(); return {fail:QUESTS[S.quest].id!=='q2', info:'灵草 '+(S.inv.lingcao||0)}; });
      await step('打坐 → 炼气一层', async()=>{ meditate(); await W(60); $('#medGo').click(); await W(2600); await adv(); await W(30); await adv(); return {fail:!(S.L>=1&&QUESTS[S.quest].id==='q3'), info:realmName(S.L)}; });
      await step('初到桃源镇：认识阿禾', async()=>{ enterMap('town',12,11); Story.check(); await adv(); Story.talk('ahe'); await adv(); await W(30); await adv(); return {fail:QUESTS[S.quest].id!=='q4'}; });
      await step('山林怪声：击败 3 只野兽', async()=>{ enterMap('forest',14,3); for(let i=0;i<3;i++){ const st=stats(); S.hp=st.hp; S.mp=st.mp; Battle.start('dangkang',r=>{ if(r==='win'){ S.st.kills++; Story.check(); } }); await fight(); await adv(); }
        await W(50); await adv(); return {fail:QUESTS[S.quest].id!=='q5'}; });
      await step('战斗结束后不能再放技能扣灵力', async()=>{ Battle._begin('dangkang',()=>{}); Battle.s.hp=1; S.mp=40; Battle.act('skill'); const m=S.mp; Battle.act('skill'); Battle.act('skill'); const after=S.mp; await W(700); $('#bOk')&&$('#bOk').click(); await W(30); return {fail:after!==m, info:`灵力 ${m} → ${after}`}; });
      await step('备战：修到炼气五层、买 2 颗回春丹', async()=>{ while(S.L<5) gainExp(60); await W(30); await adv(); S.stones+=300; UI.shop(); $('[data-buy="huichun"]').click(); $('[data-buy="huichun"]').click(); UI.closePanel(); await W(30); await adv();
        return {fail:QUESTS[S.quest].id!=='q6'}; });
      await step('讨伐穷奇：登场动画 + 二阶段 + 顾长歌出手', async()=>{ Dev.god=true; Story.shrine(); await adv(); await W(200); const cine=!$('#cine').hidden; await W(1300); $('#cine').click(); await W(200);
        let phase=false; const iv=setInterval(()=>{ if(Battle.s&&Battle.s.phase2) phase=true; },100); await fight(); clearInterval(iv); Dev.god=false; await W(60);
        const lines=[]; for(let i=0;i<40&&!$('#dlg').hidden;i++){ const d=$('#dlg'); if(UI.typing&&d.onclick) d.onclick(); lines.push(d.innerText); d.onclick&&d.onclick(); await W(15); } await adv();
        return {fail:!(cine&&phase&&S.flags.qiongqi_done&&lines.join('').includes('顾长歌')), info:QUESTS[S.quest].id}; });
      await step('炼丹：上品筑基丹（火候小游戏）', async()=>{ S.inv.zhuguo=3; S.inv.lingmo=2; enterMap('home',18,5); UI.alchemy(); $('[data-r="2"]').click(); await W(20);
        let hold=false; const b=$('#alcBtn'); for(let i=0;i<9*30;i++){ const z=$('#alcZone'), n=$('#alcNeedle'); if(!z) break; const zc=parseFloat(z.style.bottom)+parseFloat(z.style.height)/2, nb=parseFloat(n.style.bottom); const want=nb<zc-2; if(want!==hold){ hold=want; b.dispatchEvent(new PointerEvent(want?'pointerdown':'pointerup',{bubbles:true})); } Mini.step(1/30); }
        const grade=$('.alc h3').textContent; $('#alcOk').click(); await W(30); return {fail:!S.inv.zhuji, info:grade}; });
      await step('筑基：心魔 + 天劫', async()=>{ S.L=9; S.exp=expNeed(9); Dev.god=true; meditate(); await W(30); $('#dlg [data-i]').click(); await W(30); await adv(); await W(100); await fight(); Dev.god=false; await W(80); await adv(); await W(80);
        for(let i=0;i<10*30;i++){ if(!$('.arena')) break; const L=[...document.querySelectorAll('.lane')], warn=L.map(l=>l.classList.contains('warn')), pos=Math.round(parseFloat($('#trMe').style.left||'40')/20);
          if(warn[pos]){ const safe=warn.findIndex(w=>!w), d=Math.sign(safe-pos); if(d) $(d<0?'#trL':'#trR').click(); } Mini.step(1/30); }
        $('#trOk')&&$('#trOk').click(); await W(50); await adv(); await W(30); await adv(); return {fail:!(S.L===10&&QUESTS[S.quest].id==='sect'), info:realmName(S.L)}; });
      await step('拜师大典：小棠入药王谷、长歌拒绝、选择门派', async()=>{ enterMap('town',12,9); Story.check(); await adv(); const alt=RT.ents.find(o=>o.act==='altar'); interact(alt);
        const lines=[]; for(let i=0;i<60&&!document.querySelector('.sect-card');i++){ const d=$('#dlg'); if(UI.typing&&d.onclick) d.onclick(); lines.push(d.innerText); d.onclick&&d.onclick(); await W(15); }
        $('[data-s="dan"]').click(); await W(20); $('#scYes').click(); await W(30); await adv(); const all=lines.join('');
        return {fail:!(S.sect==='dan'&&S.flags.tang_sect&&all.includes('散修')&&QUESTS[S.quest].id==='q8')}; });
      await step('点击宗门长老有反应', async()=>{ const m=RT.ents.find(o=>o.id==='m_shou'); interact(m); await W(20); const ok=!$('#dlg').hidden; await adv(2); return ok; });
      await step('青丘狐影：放过九尾狐 → 饕餮苏醒 → 第一章完', async()=>{ Story.shrine(); await W(30);
        for(let i=0;i<80;i++){ if(!$('#cine').hidden){ $('#cine').click(); await W(50); continue; } const d=$('#dlg'); if(d.hidden) break; const ch=d.querySelectorAll('[data-i]'); if(ch.length) ch[1].click(); else d.onclick&&(d.onclick(),d.onclick&&d.onclick()); await W(20); }
        return {fail:!(S.flags.chapter1_done&&S.flags.huli_friend&&QUESTS[S.quest].id==='end')}; });
      await step('支线：阿禾的灵菇汤（接取 → 交付）', async()=>{ S.inv.lingmo=3; Story.side('ahe'); await adv(); Story.side('ahe'); await adv(); return {fail:S.side.soup!=='done'}; });
      await step('心动事件 CG：小棠、长歌各 4 段', async()=>{ let n=0; for(const id of ['tang','ge']) for(const lv of [2,4,6,8]){ Dev.run(`cg:${id}:${lv}`); await W(40); if(!$('#cg').hidden) n++; await adv(1); }
        return {fail:n!==8||!$('#cg').hidden, info:`${n}/8 段`}; });
      await step('钓鱼：金光水面钓到鱼王', async()=>{ addItem('rod'); enterMap('town',8,14); let title='';
        for(let tries=0; tries<3 && !Life.col().fish.fish_heluo; tries++){ S.glow=undefined; render(); const g=S.glow.find(x=>x.map==='town'); S.min=22*60; Math.random=()=>.01;
          Mini.fish(g.x,g.y); for(let i=0;i<4*30;i++){ Mini.step(1/30); if($('#fsBob.bite')){ $('#fsBtn').click(); break; } } Math.random=realRandom;
          let hold=false; const b=$('#rcBtn'); for(let i=0;i<30*30;i++){ const box=$('#rcBox'), f=$('#rcFish'); if(!box||!f) break; const bb=parseFloat(box.style.bottom), bh=parseFloat(box.style.height), fb=parseFloat((f.style.bottom.match(/([\d.]+)%/)||[0,50])[1]); const want=fb>bb+bh*.45; if(want!==hold){ hold=want; b.dispatchEvent(new PointerEvent(want?'pointerdown':'pointerup',{bubbles:true})); } Mini.step(1/30); }
          title=$('.fishg h3')?.textContent; if($('#rcOk')) $('#rcOk').click(); else Mini.close(); await W(20); }
        return {fail:!Life.col().fish.fish_heluo, info:title}; });
      await step('存档：手动存 → 改动 → 读取复原', async()=>{ SaveSys.write('m1'); const st=S.stones; S.stones+=9999; SaveSys.load(2,'m1'); await W(50); await adv(); return {fail:S.stones!==st}; });
      await step('往事回廊：重温讨伐穷奇后回到现在', async()=>{ const st=S.stones, L=S.L; Dev.god=true; Replay.start('qiongqi'); await W(1100); await adv(); await W(1500); $('#cine').click(); await W(150); await fight(); Dev.god=false; await adv(); await W(1200);
        return {fail:!(Replay.active===null&&S.L===L&&S.stones===st&&S.flags.qiongqi_done)}; });
      await step('没有脚本错误', async()=>({fail:SelfTest.errors.length>0, info:SelfTest.errors.slice(0,2).join(' | ')}));
    } finally {
      Math.random=realRandom; Dev.god=false;
      try{ if(backup) localStorage.setItem(slotKey(2),backup); else localStorage.removeItem(slotKey(2)); }catch(e){}
    }
    el.querySelector('h3').textContent=`自检完成：${pass} 项通过${fail?`，${fail} 项失败`:''}`; el.querySelector('.st-box').classList.add(fail?'bad':'ok');
    $('#stNote').innerHTML=`<button class="btn mini" id="stClose">关闭</button>　第 3 个存档位已恢复原样。`; $('#stClose').onclick=()=>{ el.remove(); UI.title(); };
    console.log(`[selftest] ${pass} passed, ${fail} failed`);
  },
};
addEventListener('error', e=>SelfTest.errors.push(e.message||String(e)));
if(location.hash.includes('selftest')) setTimeout(()=>SelfTest.run(),600);
