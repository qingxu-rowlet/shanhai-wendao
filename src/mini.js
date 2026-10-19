/* ============================================================
   山海问道 · mini-games: 炼丹火候, 突破 (心魔 + 天劫), 钓鱼, 奇遇
   Each game runs its own small loop; `Mini.step(dt)` advances it (handy when the page is in the background).
   ============================================================ */
Object.assign(SPR, {
  i_rod:['............','.........n..','........n...','.......n....','......n...e.','.....n....e.','....n.....e.','...n......e.','..N.......e.','.NN......eue','............','............'],
  i_fish:['............','............','............','.....XXXX...','..X.XXwkXX..','..XXXXXXXXX.','..X.XXXXXX..','.....XXXX...','............','............','............','............'],
});
Object.assign(ITEMS, {
  rod:     {name:'钓竿', icon:'i_rod', tool:true, price:50, desc:'选中钓竿后点水面即可垂钓。'},
  fish_li: {name:'灵鲤', icon:'i_fish', color:'#e07b39', sell:25, desc:'池塘里常见的鲤鱼，带着一点灵气。'},
  fish_yin:{name:'银鳞鱼', icon:'i_fish', color:'#c9d1dc', sell:45, desc:'鳞片像月光一样的鱼。'},
  fish_mo: {name:'墨鳞', icon:'i_fish', color:'#4a4a6a', sell:70, desc:'只在夜里出没的黑色鱼。'},
  fish_jin:{name:'青丘锦鲤', icon:'i_fish', color:'#f2a0b0', sell:160, desc:'传说是九尾狐养在青丘的锦鲤，可遇不可求。'},
});
SHOP.sell.push('rod');
NPCS.ge.likes.push('fish_li','fish_yin'); NPCS.ahe.likes.push('fish_yin'); NPCS.tang.loves.push('fish_jin'); NPCS.qian.likes.push('fish_mo');
BEASTS.xinmo={name:'心魔', self:true, boss:true, hp:120, atk:14, def:3, exp:0, stones:[0,0], moves:['atk','charm','atk','charge','big'],
  lore:'修士突破时，心中的恐惧与执念化作心魔。胜过它，才能道心通明。'};

const Mini = {
  loop:null, run(fn){ Mini.stop(); let last=performance.now(); const tick=now=>{ if(!Mini.loop) return; const dt=Math.min(.05,(now-last)/1000); last=now; fn(dt); if(Mini.loop) requestAnimationFrame(tick); }; Mini.loop=fn; requestAnimationFrame(tick); },
  step(dt){ if(Mini.loop) Mini.loop(dt); },
  stop(){ Mini.loop=null; },
  open(html){ const el=$('#minigame'); el.hidden=false; el.innerHTML=html; UI.fx=true; UI.sync(); return el; },
  close(){ Mini.stop(); const el=$('#minigame'); el.hidden=true; el.innerHTML=''; UI.fx=false; UI.sync(); },
  hold(btn, set){ const on=e=>{ e.preventDefault(); set(true); }, off=()=>set(false);
    btn.addEventListener('pointerdown',on); btn.addEventListener('pointerup',off); btn.addEventListener('pointerleave',off); btn.addEventListener('pointercancel',off);
    const kd=e=>{ if(e.code==='Space'||e.code==='KeyE'){ e.preventDefault(); set(true); } }, ku=e=>{ if(e.code==='Space'||e.code==='KeyE') set(false); };
    addEventListener('keydown',kd); addEventListener('keyup',ku); return ()=>{ removeEventListener('keydown',kd); removeEventListener('keyup',ku); }; },

  /* ---------- 炼丹：keep the heat inside the moving sweet spot ---------- */
  alchemy(recipe, done){
    const out=ITEMS[recipe.out], wide=S.sect==='dan'?.17:.12, total=7;
    const el=Mini.open(`<div class="mg wood alc"><h3>炼制 ${out.name}</h3>
      <div class="alc-wrap"><div class="furnace"><div class="flame" id="alcFlame"></div></div>
        <div class="heat"><div class="zone" id="alcZone"></div><div class="needle" id="alcNeedle"></div></div></div>
      <div class="xbar"><i id="alcProg"></i></div><p class="mg-tip" id="alcTip">按住「鼓风」让火变旺，松开火会变弱。把火候保持在金色区域里！</p>
      <button class="btn main big" id="alcBtn">鼓风（按住）</button></div>`);
    let h=.3, v=0, t=-1.2, inside=0, holding=false; const unbind=Mini.hold($('#alcBtn'), x=>holding=x);
    Mini.run(dt=>{
      t+=dt; v+=(holding?1.7:-1.15)*dt; v*=.94; h=Math.max(0,Math.min(1,h+v*dt*2.2)); if(h===0||h===1) v=0;
      const c=.5+.26*Math.sin(t*1.25)+.1*Math.sin(t*3.3);
      if(t>0){ if(Math.abs(h-c)<wide) inside+=dt; }
      $('#alcZone').style.bottom=((c-wide)*100)+'%'; $('#alcZone').style.height=(wide*200)+'%';
      $('#alcNeedle').style.bottom=(h*100)+'%'; $('#alcFlame').style.transform=`scale(${.5+h*.9})`; $('#alcFlame').style.opacity=.5+h*.5;
      $('#alcProg').style.width=Math.max(0,t/total*100)+'%';
      if(t<0) $('#alcTip').textContent='准备……';
      else if(Math.abs(h-c)<wide) $('#alcTip').textContent='火候正好！'; else $('#alcTip').textContent=h>c?'火太旺了！':'火太弱了！';
      if(t>=total){ unbind(); Mini.stop(); const r=inside/total, grade=r>=.68?'top':r>=.42?'mid':r>=.2?'low':'fail';
        const name={top:'上品',mid:'中品',low:'下品',fail:'炸炉'}[grade];
        el.querySelector('.alc').innerHTML=`<h3>${grade==='fail'?'炸炉了……':name+out.name}</h3><p class="mg-tip">火候命中 ${Math.round(r*100)}%</p><button class="btn main" id="alcOk">好</button>`;
        if(grade==='fail') Sound.hurt(); else Sound.levelup();
        $('#alcOk').onclick=()=>{ Mini.close(); done(grade); }; }
    });
  },

  /* ---------- 天劫：dodge the lightning ---------- */
  tribulation(done){
    const lanes=5; let pos=2, hp=3, t=0, wave=0, strikes=[], nextAt=1.2;
    const el=Mini.open(`<div class="mg wood trib"><h3>天劫</h3><p class="mg-tip" id="trTip">左右移动，躲开落下的天雷！</p>
      <div class="arena" id="trArena">${'<div class="lane"></div>'.repeat(lanes)}<div class="me" id="trMe"></div></div>
      <div class="trib-hp" id="trHp"></div><div class="mg-btns"><button class="btn big" id="trL">◀ 左</button><button class="btn big" id="trR">右 ▶</button></div></div>`);
    const me=$('#trMe'), ln=[...el.querySelectorAll('.lane')]; me.innerHTML=''; const pc=document.createElement('canvas'); pc.className='px'; const sp=lookSprite(S.look,'up',0); pc.width=sp.width; pc.height=sp.height; pc.getContext('2d').drawImage(sp,0,0); me.appendChild(pc);
    const move=d=>{ pos=Math.max(0,Math.min(lanes-1,pos+d)); Sound.tick(); };
    $('#trL').onclick=()=>move(-1); $('#trR').onclick=()=>move(1);
    $('#trArena').onpointerdown=e=>{ const r=e.currentTarget.getBoundingClientRect(); pos=Math.max(0,Math.min(lanes-1,Math.floor((e.clientX-r.left)/r.width*lanes))); };
    const kd=e=>{ if(e.code==='ArrowLeft'||e.code==='KeyA') move(-1); if(e.code==='ArrowRight'||e.code==='KeyD') move(1); }; addEventListener('keydown',kd);
    Music.stinger('thunder');
    Mini.run(dt=>{
      t+=dt; me.style.left=(pos/lanes*100)+'%'; $('#trHp').textContent='护体 '+'◆'.repeat(hp)+'◇'.repeat(3-hp)+'　·　第 '+Math.min(3,wave+1)+' / 3 道天雷';
      if(t>=nextAt && wave<3){ const n=1+wave; const set=new Set(); while(set.size<Math.min(lanes-1,n+1)) set.add(Math.floor(Math.random()*lanes));
        for(const l of set){ strikes.push({l, at:t+.9}); ln[l].classList.add('warn'); } wave++; nextAt=t+2.1; }
      for(const s of strikes){ if(!s.done && t>=s.at){ s.done=true; ln[s.l].classList.remove('warn'); ln[s.l].classList.add('bolt'); setTimeout(()=>ln[s.l]&&ln[s.l].classList.remove('bolt'),300);
        Music.stinger('thunder'); if(s.l===pos){ hp--; Sound.hurt(); el.querySelector('.trib').classList.remove('shake'); void el.offsetWidth; el.querySelector('.trib').classList.add('shake'); } } }
      if(hp<=0 || (wave>=3 && strikes.every(s=>s.done) && t>nextAt-1)){ Mini.stop(); removeEventListener('keydown',kd); const ok=hp>0;
        el.querySelector('.trib').innerHTML=`<h3>${ok?'渡劫成功！':'天劫未过……'}</h3><p class="mg-tip">${ok?'雷光散去，天地间一片清明。':'你被天雷击伤，这次突破失败了。筑基丹还在，养好伤再来。'}</p><button class="btn main" id="trOk">好</button>`;
        $('#trOk').onclick=()=>{ Mini.close(); done(ok); }; }
    });
  },
  breakthrough(){
    UI.say([['旁白','你服下筑基丹，盘膝而坐。丹田中灵气翻涌……'],['旁白','忽然，眼前浮现出另一个自己——那是你的心魔！']], ()=>{
      Battle.start('xinmo', r=>{
        if(r!=='win'){ UI.say([['旁白','心魔的冷笑在耳边回荡……你从入定中惊醒，突破失败了。筑基丹还在，下次再来。']]); return; }
        UI.say([['旁白','心魔消散，道心通明。可天空中，雷云已经聚起……']], ()=>Mini.tribulation(ok=>{
          if(!ok){ S.exp=Math.round(S.exp*.7); UI.hud(); return; }
          addItem('zhuji',-1);
          UI.say(SCRIPTS.zhuji_break, ()=>{ S.exp=0; S.L=10; const st=stats(); S.hp=st.hp; S.mp=st.mp; Sound.levelup(); UI.banner('筑基成功！'); UI.hud(); Story.check(); });
        }));
      });
    });
  },

  /* ---------- 钓鱼 ---------- */
  fishPick(){
    const night=S.min/60>=19||S.min/60<6, forest=RT.mapId==='forest', r=Math.random();
    if(forest && r<(night?.12:.06)) return {id:'fish_jin', speed:1.9, jumpy:1.6};
    if(night && r<.35) return {id:'fish_mo', speed:1.5, jumpy:1.2};
    if(r<.6) return {id:'fish_li', speed:.8, jumpy:.6};
    return {id:'fish_yin', speed:1.2, jumpy:.9};
  },
  fish(){
    if(!useEnergy(3)) return;
    const el=Mini.open(`<div class="mg wood fishg"><h3>垂钓</h3><p class="mg-tip" id="fsTip">静静等待鱼儿咬钩……</p>
      <div class="pond"><div class="bobber" id="fsBob"></div></div><button class="btn main big" id="fsBtn">收竿</button></div>`);
    Music.play('calm');
    let t=0, bite=1+Math.random()*2.5, phase='wait', biteT=0; const fish=Mini.fishPick();
    $('#fsBtn').onclick=()=>{ if(phase==='wait'){ $('#fsTip').textContent='太早了，鱼被吓跑了……'; phase='end'; setTimeout(()=>{ Mini.close(); Music.play(areaTheme()); },900); }
      else if(phase==='bite'){ phase='reel'; Mini.reel(fish); } };
    Mini.run(dt=>{ t+=dt; if(phase==='wait'&&t>=bite){ phase='bite'; biteT=t; $('#fsTip').textContent='咬钩了！快收竿！'; $('#fsBob').classList.add('bite'); Sound.pick(); }
      if(phase==='bite'&&t-biteT>.9){ phase='end'; $('#fsTip').textContent='鱼儿溜走了……'; $('#fsBob').classList.remove('bite'); setTimeout(()=>{ Mini.close(); Music.play(areaTheme()); },900); } });
  },
  reel(fish){
    const el=$('#minigame'), it=ITEMS[fish.id];
    el.innerHTML=`<div class="mg wood fishg"><h3>收线！</h3><div class="reel-wrap"><div class="reel"><div class="catch" id="rcBox"></div><div class="fishi" id="rcFish"><img class="px" src="${iconURL(it.icon,it.color)}" alt=""></div></div>
      <div class="rprog"><i id="rcProg"></i></div></div><p class="mg-tip">按住「提竿」让绿框上升，把鱼框住！</p><button class="btn main big" id="rcBtn">提竿（按住）</button></div>`;
    let b=.1, bv=0, f=.5, fv=0, fTarget=.5, p=.3, holding=false, t=0; const box=.26; const unbind=Mini.hold($('#rcBtn'), x=>holding=x);
    Mini.run(dt=>{
      t+=dt; bv+=(holding?1.8:-1.6)*dt; bv*=.93; b=Math.max(0,Math.min(1-box,b+bv*dt*2)); if(b===0||b===1-box) bv=0;
      if(Math.random()<dt*fish.jumpy) fTarget=Math.random(); f+=(fTarget-f)*Math.min(1,dt*fish.speed*2);
      const inside=f>=b&&f<=b+box; p=Math.max(0,Math.min(1,p+(inside?.32:-.22)*dt));
      $('#rcBox').style.bottom=(b*100)+'%'; $('#rcBox').style.height=(box*100)+'%'; $('#rcFish').style.bottom=`calc(${f*100}% - 12px)`; $('#rcProg').style.height=(p*100)+'%';
      $('#rcBox').classList.toggle('on',inside);
      if(p>=1||p<=0){ Mini.stop(); unbind(); const ok=p>=1; if(ok){ addItem(fish.id); Sound.levelup(); } else Sound.hurt();
        el.querySelector('.fishg').innerHTML=`<h3>${ok?'钓到了！':'鱼跑了……'}</h3>${ok?`<p class="mg-tip"><img class="px" style="width:48px" src="${iconURL(it.icon,it.color)}" alt=""><br>${it.name}　${esc(it.desc)}</p>`:''}<button class="btn main" id="rcOk">好</button>`;
        $('#rcOk').onclick=()=>{ Mini.close(); Music.play(areaTheme()); }; }
    });
  },
};

/* ---------- 奇遇: a random encounter appears in the forest some days ---------- */
const QIYU = [
  {id:'wounded', title:'受伤的修士', run:()=>[['旁白','林间小道上，一名青衣修士靠在树下，衣襟上满是血迹。'],['受伤的修士','咳……道友……可否……'],
    {choice:'你要怎么做？', options:[
      {text:'给他一颗回春丹', fn:()=>{ if(!S.inv.huichun) return UI.say([['旁白','你摸了摸行囊——没有回春丹了。修士苦笑着摆摆手。']]); addItem('huichun',-1); S.karma=(S.karma||0)+2;
        UI.say([['受伤的修士','多谢道友救命之恩！这是我宗门的玉简，或许对你有用。'],{exp:60},{stones:30},['旁白','（善念 +2）']]); }},
      {text:'搜刮他的储物袋', fn:()=>{ S.karma=(S.karma||0)-3; UI.say([['旁白','你趁他无力反抗，取走了他的储物袋……'],{stones:90},['旁白','（恶念 +3）他的眼神，你大概会记很久。']]); }},
      {text:'默默离开', fn:()=>UI.say([['旁白','你转身离开。身后传来一声叹息。']])}]}]},
  {id:'ruins', title:'洞府遗迹', run:()=>[['旁白','藤蔓后面，藏着一处坍塌的古修洞府，石门上刻着模糊的符文。'],
    {choice:'要进去看看吗？', options:[
      {text:'进去', fn:()=>UI.say([['旁白','洞府深处传来振翅声——一只妖兽守着这里！'],{battle:S.L>=4?'guidiao':'xingxing', win:'qiyu_ruins_win'}])},
      {text:'太危险了，离开', fn:()=>UI.say([['旁白','你记下了这个地方，悄悄退了出去。']])}]}]},
  {id:'spring', title:'灵泉', run:()=>[['旁白','山石间涌出一汪泛着微光的泉水，灵气浓得几乎化不开。'],
    {choice:'在灵泉里泡一会儿？', options:[
      {text:'泡一会儿', fn:()=>{ const st=stats(); S.hp=st.hp; S.mp=st.mp; S.energy=maxEnergy(); S.min+=60; UI.hud(); UI.say([['旁白','暖流游遍全身，疲惫一扫而空。（体力、生命、灵力全满）'],{exp:30}]); }},
      {text:'装一壶带走', fn:()=>UI.say([['旁白','你装了一壶泉水，回去浇在灵田里一定很好。'],{give:{lingcao:2}}])}]}]},
  {id:'fox', title:'迷路的小狐狸', run:()=>[['旁白','草丛里，一只白色的小狐狸瑟瑟发抖，尾巴尖上有一点淡淡的蓝光。'],
    {choice:'你要怎么做？', options:[
      {text:'喂它一株灵草', fn:()=>{ if(!S.inv.lingcao) return UI.say([['旁白','你身上没有灵草。小狐狸歪着头看了你一会儿，跑掉了。']]); addItem('lingcao',-1); S.karma=(S.karma||0)+1; S.flags.fox_kind=true;
        UI.say([['旁白','小狐狸小口小口地吃完灵草，蹭了蹭你的手，消失在一团淡蓝的狐火里。'],['旁白','（善念 +1）……它好像在哪里见过你。']]); }},
      {text:'把它赶走', fn:()=>{ S.karma=(S.karma||0)-1; UI.say([['旁白','小狐狸吓得一溜烟跑了。（恶念 +1）']]); }}]}]},
  {id:'hunter', title:'老猎人', run:()=>[['老猎人','年轻人，我这儿有几颗从南边换来的朱果种。拿 2 张兽皮来换，怎么样？'],
    {choice:'换吗？', options:[
      {text:'换（2 兽皮 → 2 朱果种）', fn:()=>{ if((S.inv.hide||0)<2) return UI.say([['老猎人','兽皮不够啊，下次吧。']]); addItem('hide',-2); UI.say([['老猎人','爽快！'],{give:{seed_zg:2}}]); }},
      {text:'不了', fn:()=>UI.say([['老猎人','好嘞，山里见。']])}]}]},
  {id:'scholar', title:'迷路的书生', run:()=>[['书生','这位仙长！小生进山采风，结果迷了路……请问桃源镇往哪边走？'],
    {choice:'你怎么回答？', options:[
      {text:'给他指路，送他一程', fn:()=>{ S.karma=(S.karma||0)+1; S.min+=30; UI.say([['书生','多谢仙长！这点盘缠不成敬意。'],{stones:20},['旁白','（善念 +1）']]); }},
      {text:'收了「带路费」再指个错的方向', fn:()=>{ S.karma=(S.karma||0)-2; UI.say([['旁白','书生千恩万谢地付了钱，朝着更深的山里走去……'],{stones:45},['旁白','（恶念 +2）']]); }}]}]},
];
SCRIPTS.qiyu_ruins_win=[['旁白','妖兽倒下后，你在石台上找到一只落满灰尘的木匣。'],{give:{juqi:2}},{stones:50}];
const QIYU_SPOTS=[[6,4],[19,10],[9,13],[25,17],[12,23],[3,14]];
MAPS.forest.objects.push({type:'qiyu', x:0, y:0, act:'qiyu', spr:'sparkle', cond:s=>!!s.qiyu&&!s.qiyu.done, dyn:true});
const Hooks = {
  newDay(){
    Sect.newDay();
    S.qiyu = Math.random()<.6 ? {ev:QIYU[Math.floor(Math.random()*QIYU.length)].id, spot:Math.floor(Math.random()*QIYU_SPOTS.length), done:false} : null;
    const o=MAPS.forest.objects.find(o=>o.type==='qiyu'); if(S.qiyu){ [o.x,o.y]=QIYU_SPOTS[S.qiyu.spot]; }
  },
  placeQiyu(){ const o=MAPS.forest.objects.find(o=>o.type==='qiyu'); if(S&&S.qiyu){ [o.x,o.y]=QIYU_SPOTS[S.qiyu.spot]; } },
  qiyu(o){ const ev=QIYU.find(q=>q.id===S.qiyu.ev); S.qiyu.done=true; RT.ents=RT.ents.filter(e=>e!==o); RT.solid[o.y][o.x]=false; Sound.magic(); UI.toast('奇遇：'+ev.title); UI.say(ev.run()); },
};
