/* ============================================================
   山海问道 · 第二章 第五幕「饿鬼洞」(后半) and 尾声 — 饕餮 fought by three: you, with 顾长歌 and 大师姐 striking after each of
   your turns. It pulls (吞噬), sends its hungry ghosts after you (饿鬼), and bites, eating your 灵力 or a pill (饥饿). Halfway,
   二师兄's voice comes out of it. Brought low, it does not die: its claws are still in him, and the three of you pull its soul
   out (剥离神魂). The 八卦镜 takes it in. 二师兄 wakes, eats, and for the first time is not hungry; 苏小棠 comes to tend him;
   at dawn he leaves with 顾长歌 to make amends. Back at the sect, two rooms stand empty, and 大师姐 will teach you the sword.
   ============================================================ */
SPRC.c2_taotie=FineArt.taotie();
BEASTS.c2_taotie={name:'饕餮', spr:'c2_taotie', boss:true, big:true, hp:2300, atk:44, def:14, exp:420, stones:[220,220], theme:'qiongqi',
  lore:'《山海经》郭璞注：其状如羊身人面，其目在腋下，虎齿人爪，贪食无厌。它在丰年村的灰烬里，睡进了一个饿坏了的孩子身体里。',
  moves:['devour','ghosts','hunger','atk','ghosts','devour'],
  phase2:{at:.5, moves:['ghosts','devour','hunger','ghosts','atk','devour'], line:'饕餮仰头长嚎——洞里所有的骨头都在震！'}};
SCENES.c2_taotie={...(SCENES.taotie||SCENES.qiongqi), title:'饕餮', sub:'贪于饮食，冒于货贿　——　《左传》'};
DODGE.c2_taotie={
  // 吞噬: everything is pulled toward its mouth in the middle — you, and the stones and bones flying in from the edges
  devour:{name:'吞噬', hit:.55, dur:5, pull:20, spawn(P,t,dt,m){ P.once('maw',true,()=>P.add({k:'maw', x:50, y:50, r:7, ttl:5}));
      P.every('s',.3/m,()=>{ const a=Math.random()*Math.PI*2, x=50+Math.cos(a)*62, y=50+Math.sin(a)*62, sp=(30+Math.random()*14)*m; P.add({k:'stone', x, y, vx:-Math.cos(a)*sp, vy:-Math.sin(a)*sp, r:2.4, ttl:58/sp}); }); }},
  // 饿鬼: little hungry ghosts come in from the sides and chase you; they give up after a few seconds
  ghosts:{name:'饿鬼', hit:.5, dur:5, spawn(P,t,dt,m){ P.every('g',.55/m,()=>{ const side=Math.random()*4|0, p=10+Math.random()*80, x=[p,106,p,-6][side], y=[-6,p,106,p][side]; P.add({k:'ghost', x, y, vx:0, vy:0, r:2.6, ttl:3.4}); });
      for(const b of P.list) if(b.k==='ghost'){ const dx=P.me.x-b.x, dy=P.me.y-b.y, d=Math.hypot(dx,dy)||1, sp=(18+b.t*5)*m, k=Math.min(1,dt*2.2); b.vx+=(dx/d*sp-b.vx)*k; b.vy+=(dy/d*sp-b.vy)*k; } }},
  // 饥饿: the jaws close on the row you are in; afterwards it eats — your 灵力, or a pill
  hunger:{name:'饥饿', hit:.75, dur:4.6, spawn(P,t,dt,m){ for(const at of m>1?[.3,1.4,2.5,3.5]:[.3,1.7,3.1]) P.once('j'+at,t>=at,()=>P.add({k:'band', dir:'h', at:P.me.y, w:16, warn:.8/m, act:.25}));
      P.every('f',.7/m,()=>P.add({k:'stone', x:Math.random()*100, y:-4, vx:0, vy:30*m, r:2})); },
    after(hits,s){ const want=10+hits*5; if(S.mp>=want){ S.mp-=want; return `饕餮吞掉了你 ${want} 点灵力。`; }
      const pill=['huichun','juqi','zhuji'].find(k=>count(S,k)>0); if(pill){ addItem(pill,-1); return `饕餮抢走了一颗${ITEMS[pill].name}，一口吞了下去！`; }
      const m=S.mp; S.mp=0; return m?`饕餮吞掉了你仅剩的 ${m} 点灵力。`:''; }},
  atk:{...DODGE.qiongqi.double, name:'虎爪'},
};
// what it says between its turns, and what the others say
const TT = {
  is(s){ return !!s&&s.kind==='c2_taotie'; },
  LINES:[[['饕餮','……饿……']],[['顾长歌','{名}，它的眼睛在腋下！']],[['谢霁月','别被它吸进去——往外顶！']],[['饕餮','（用二师兄的声音）娘……我饿……']],[['顾长歌','……师父。我找到它了。']],[['饕餮','饿。饿。饿。饿。']]],
  lines(s){ s.etn=(s.etn||0)+1; if(s.pendingTalk){ const t=s.pendingTalk; s.pendingTalk=null; return t; } return s.etn%2?null:TT.LINES[(s.etn/2|0)%TT.LINES.length]; },
  // the two of them fight beside you: a figure each at the left of the stage, a blow each after your turn
  stands(){ const st=$('#battle .b-stage'); if(!st) return; for(const [id,look,left] of [['allyStand',LOOK_GE,'3%'],['allyStand2',LOOK_XIE,'19%']]){ let c=$('#'+id); if(!c){ c=document.createElement('canvas'); c.id=id; st.appendChild(c); }
      const sp=cgChibi(look,'stand','normal','sword',null,false); c.width=sp.width; c.height=sp.height; c.getContext('2d').drawImage(sp,0,0);
      if(id==='allyStand2') c.style.cssText=`position:absolute;left:${left};bottom:4%;width:min(24vw,140px);image-rendering:pixelated;animation:allyBob 1.9s ease-in-out infinite;filter:drop-shadow(0 4px 0 rgba(0,0,0,.25))`; } },
  strike(s,who,delay){ setTimeout(()=>{ if(Battle.s!==s||s.dead||s.stripping) return; const d=Math.round((who==='顾长歌'?20:18)+Math.random()*8); s.hp-=d;
      const st=$(who==='顾长歌'?'#allyStand':'#allyStand2'); if(st){ st.classList.remove('hit'); void st.offsetWidth; st.classList.add('hit'); }
      BossBg.flash('rgba(220,235,255,.4)'); Battle.float(who+' -'+d,'pet'); Battle.hitFx(); Battle.ui();
      if(s.hp<=s.max*.15) TT.strip(s); },delay); },
};
{ const _b=Battle._begin; Battle._begin=function(kind,cb){ const r=_b.call(Battle,kind,cb); const s=Battle.s; if(TT.is(s)){ TT.stands(); s.pendingTalk=[['饕餮','饿——！'],['顾长歌','{名}，大师姐——一起上！']]; } return r; }; }
{ const _pc=Battle.phaseCheck; Battle.phaseCheck=function(){ const s=Battle.s, p2=s&&s.phase2; _pc.call(Battle);
    if(TT.is(s)&&s.phase2&&!p2) s.pendingTalk=[['何满仓','（从饕餮的肚子里，很远很远）……{称}……'],['何满仓','好黑……这里面好黑……'],['谢霁月','满仓！听得见吗？撑住——！'],['何满仓','……我、我撑着……'],['顾长歌','（剑势一沉）听见了吗，{名}。他还在。']]; }; }
{ const _et=Battle.enemyTurn; Battle.enemyTurn=function(){ const s=Battle.s; if(!TT.is(s)) return _et.call(Battle);
    if(s.stripping) return;
    if(!s.stun&&!s.talked&&!Dodge.auto){ const lines=TT.lines(s); if(lines){ s.talked=true; s.busy=true; Battle.ui(); return QQLU.talk(lines,()=>{ if(Battle.s!==s||s.dead) return; s.busy=false; Battle.enemyTurn(); }); } }
    s.talked=false; return _et.call(Battle); }; }
// after each of your turns (not when you only take a pill), 顾长歌 and 大师姐 strike too; bring it low and the fight turns
{ const _act=Battle.act; Battle.act=function(a){ const s=Battle.s; if(!TT.is(s)||s.over||s.busy||s.dead||s.stripping) return _act.call(Battle,a);
    const r=_act.call(Battle,a); if(Battle.s!==s) return r;
    if(s.hp<=s.max*.15){ s.dead=false; s.hp=Math.max(1,s.hp); TT.strip(s); return r; }
    if(a!=='pill'&&!s.dead){ TT.strike(s,'顾长歌',380); TT.strike(s,'谢霁月',760); }
    return r; }; }
// it cannot simply be killed: a win becomes the pulling of its soul out of him
{ const _end=Battle.end; Battle.end=function(r){ const s=Battle.s; if(TT.is(s)&&r==='win'&&!s.stripDone){ s.over=false; s.dead=false; s.hp=Math.max(1,s.hp); TT.strip(s); return; } return _end.call(Battle,r); }; }
TT.strip=function(s){ if(s.stripping) return; s.stripping=true; s.busy=true; Battle.ui(); BossBg.flash('rgba(255,230,200,.8)');
  QQLU.talk([['旁白','饕餮跪倒在地，可它的爪子还深深扣在二师兄的身上——它在往回缩，要缩回他的身体里去！'],['顾长歌','抓住它！'],['谢霁月','{称}——一起拉！']],()=>{ if(Battle.s!==s) return;
    Strip.run(()=>{ if(Battle.s!==s) return; s.stripDone=true; s.dead=true; s.hp=0; Battle.ui(); setTimeout(()=>Battle.end('win'),300); }); }); };

/* ---------- 剥离神魂: tap to pull; when it lashes back (the red light), let go ---------- */
const Strip = {
  run(done){
    if(Dodge.auto) return setTimeout(done,60);
    const ov=document.createElement('div'); ov.className='dodge strip';
    ov.innerHTML=`<div class="dg-head"><b>剥离神魂</b><span>${FINE_POINTER?'连按 空格 / J 往外拉':'连点屏幕往外拉'}　·　红光亮起时松手！</span></div><canvas></canvas><div class="dg-time"><i style="background:#e8b84a"></i></div><div class="st-say"></div>`;
    $('#battle').appendChild(ov);
    const cv2=ov.querySelector('canvas'), g=cv2.getContext('2d'), dpr=Math.min(2,devicePixelRatio||1), L=Math.min(320, innerWidth*.84, innerHeight*.42); cv2.style.width=cv2.style.height=L+'px'; cv2.width=cv2.height=Math.round(L*dpr);
    const say=ov.querySelector('.st-say'); say.style.cssText='text-align:center;color:#f2e6c8;font-size:14px;min-height:20px;margin-top:6px';
    let p=0, t=0, last=performance.now(), ended=false, next=2.4, warn=0, lash=0, lashHit=0, shake=0, pulled=0, said={};
    const pull=()=>{ if(ended) return; if(lash>0){ shake=.35; if(!lashHit){ lashHit=1; p=Math.max(0,p-.1); Sound.hurt(); } say.textContent='它反扑了——松手！'; return; } p=Math.min(1,p+.022); pulled=.12; Sound.tick(); };   // only the first pull into a lash costs you
    const kd=e=>{ if(['Space','KeyJ','Enter','KeyE'].includes(e.code)){ e.preventDefault(); e.stopPropagation(); if(!e.repeat) pull(); } };
    addEventListener('keydown',kd,true); ov.addEventListener('pointerdown',e=>{ e.preventDefault(); pull(); });
    const man=cgChibi(LOOK_MAN,'kneel','sad',null,null,false), T=FineArt.taotie();
    const lines=[[.25,'顾长歌：别松手！'],[.5,'何满仓：……{称}……我在这儿……'],[.75,'谢霁月：快了——再用力！']];
    const step=now=>{ if(ended) return; const dt=Math.min(.05,(now-last)/1000); last=now; t+=dt;
      p=Math.min(1,p+dt*.012);                                     // 顾长歌 and 大师姐 pull too, slowly
      if(lash>0){ lash-=dt; if(lash<=0){ next=t+1.8+Math.random()*1.6; say.textContent=''; } }
      else if(warn>0){ warn-=dt; if(warn<=0){ lash=.95; lashHit=0; BossBg.flash('rgba(255,60,40,.5)'); say.textContent='它反扑了——松手！'; } }
      else if(t>=next){ warn=.55; say.textContent='它要反扑了……'; }
      for(const [at,text] of lines) if(p>=at&&!said[at]){ said[at]=1; if(!lash&&!warn) say.textContent=text.replace(/\{称\}/g,S.look&&S.look.g==='f'?'小师妹':'小师弟'); }
      shake=Math.max(0,shake-dt); pulled=Math.max(0,pulled-dt);
      // draw: the cave, him kneeling, its soul being pulled up out of him on three golden threads
      const W=cv2.width, H=cv2.height, k=W/100; g.setTransform(1,0,0,1,0,0); g.fillStyle='#120a08'; g.fillRect(0,0,W,H);
      const gl=g.createRadialGradient(W/2,H*.7,0,W/2,H*.7,W*.6); gl.addColorStop(0,'rgba(232,184,74,.22)'); gl.addColorStop(1,'rgba(232,184,74,0)'); g.fillStyle=gl; g.fillRect(0,0,W,H);
      g.imageSmoothingEnabled=false; const sx=(shake>0?(Math.random()-.5)*k*3:0);
      const ms=k*.6, mw=man.width*ms, mh=man.height*ms; g.drawImage(man,W/2-mw/2+sx,H*.96-mh,mw,mh);
      const lift=p*.5-(lash>0?.08:0)-(warn>0?.02:0), ts=k*.62, tw=T.width*ts, th=T.height*ts, tx=W/2-tw/2+sx, ty=H*.86-th-lift*H+(pulled>0?-k:0);
      g.save(); g.globalAlpha=.55+.45*(1-p); if(lash>0){ g.filter='brightness(1.6) saturate(1.6)'; } g.drawImage(T,tx,ty,tw,th); g.restore();
      // the threads: from you (bottom left), 顾长歌 (left), 大师姐 (right) to its neck
      const nx=W/2+sx, ny=ty+th*.42; g.strokeStyle=lash>0?'rgba(255,90,60,.9)':`rgba(255,220,120,${.6+.3*Math.sin(t*9)})`; g.lineWidth=k*(.6+p*.4);
      for(const [x,y] of [[.06,.98],[.02,.55],[.98,.6]]){ g.beginPath(); g.moveTo(W*x,H*y); g.quadraticCurveTo((W*x+nx)/2,(H*y+ny)/2+(lash>0?k*6:-k*4),nx,ny); g.stroke(); }
      if(warn>0||lash>0){ g.strokeStyle=lash>0?'rgba(255,40,30,.9)':'rgba(255,200,60,.8)'; g.lineWidth=k*2; g.strokeRect(k,k,W-2*k,H-2*k); }
      ov.querySelector('.dg-time i').style.width=Math.round(p*100)+'%';
      if(p>=1){ ended=true; removeEventListener('keydown',kd,true); say.textContent='——拉出来了！'; Sound.magic(); setTimeout(()=>{ ov.classList.add('out'); setTimeout(()=>ov.remove(),250); done(); },700); return; }
      requestAnimationFrame(step); };
    requestAnimationFrame(step); },
};

/* ---------- the battle from the story; losing; the boss on the map ---------- */
C2Y.part1end.splice(C2Y.part1end.findIndex(st=>Array.isArray(st)&&/第五幕前半完/.test(st[1])),1);
C2Y.part1end.push({battle:'c2_taotie', win:'c2y_win', lose:'c2y_lose'});
SCRIPTS.c2y_lose=[['旁白','饕餮的吸力把你掀翻在地。顾长歌一把拽住你的后领，三个人退到了洞口。'],['顾长歌','……再来。'],['旁白','（饕餮还蹲在洞底。准备好了，再进去。）']];
SCRIPTS.c2y_again=[['饕餮','……饿……'],['顾长歌','{名}，准备好了？'],{battle:'c2_taotie', win:'c2y_win', lose:'c2y_lose'}];
MAPS.mj_cave.objects.push({type:'boss', x:12, y:3, spr:'taotie', act:'c2ytaotie', cond:s=>!!s.flags.c2_awake&&!s.flags.c2_sealed});
{ const _a=Dungeon.act; Dungeon.act=function(o){ if(o.act==='c2ytaotie'){ UI.say(SCRIPTS.c2y_again); return true; } return _a.call(Dungeon,o); }; }
{ const _sl=sleep; sleep=function(passedOut){ const cave=passedOut&&RT.mapId==='mj_cave'; const r=_sl(passedOut); if(cave){ enterMap('mj_cave',10,13); RT.dir='up'; UI.hud(); } return r; }; }

/* ---------- the ending ---------- */
C2Y.win=()=>{ const F=S.flags, dan=S.sect==='dan', R=F.c2_ge_r; return [
  {run:()=>C2Y.sealCG()},
  ['旁白','最后一下。'],
  ['旁白','三个人同时往后一拽——有什么东西，从二师兄的身体里，整个地被拉了出来。'],
  ['饕餮','……饿……'],
  {run:()=>{ C2Y.sealing=1; }},
  ['旁白','八卦镜的光扑了上去。青铜的脸、羊的身子、腋下的金眼睛，被那道光一点一点地卷进了镜子里。'],
  ['旁白','它没有挣扎。'],
  ['旁白','镜子里最后映出来的，不是一头凶兽。是一个很瘦很瘦的影子，蜷着身子，像是饿了很久很久。'],
  ['饕餮','……饱了吗。'],
  ['谢霁月','（很轻）……睡吧。'],
  {run:()=>{ C2Y.sealing=2; }},
  ['旁白','镜面合上了。洞里一下子安静下来，静得能听见水珠从石头上滴下来的声音。'],
  {flag:'c2_sealed'},
  ['顾长歌','满仓！'],
  ['旁白','二师兄躺在骨头堆里，脸白得像纸。可是胸口，还在一起一伏。'],
  ['旁白','顾长歌在他身边跪了下来。'],
  ...(F.c2_bun?[['旁白','你把那半个馒头递了过去。顾长歌接过来，掰下一小块，放进二师兄嘴里。']]:[['旁白','顾长歌从怀里摸出一块干粮，掰下一小块，放进二师兄嘴里。']]),
  ['旁白','二师兄的喉咙动了一下。'],
  ['旁白','又动了一下。'],
  ['何满仓','（眼睛慢慢睁开）……'],
  ['何满仓','……甜的。'],
  ['顾长歌','嗯。'],
  ['旁白','顾长歌笑了。不是那种一闪就过去的笑。是真正的，把十年都放下了的笑。'],
  ['顾长歌','你这下，绝对可以吃饱了。'],
  ['旁白','二师兄愣了很久，摸了摸自己的肚子。'],
  ['何满仓','……不饿了。'],
  ['何满仓','{称}，大师姐……我不饿了。'],
  ['旁白','他哭了。哭得像一个七岁的孩子。'],
  {run:()=>{ PixCG.close(); }},
  ['旁白','洞口传来急匆匆的脚步声。'],
  ['苏小棠','{名}！'],
  ['旁白','苏小棠背着药篓冲了进来。看见满地的骨头，她的脸一下子白了，可脚步一步也没停。'],
  ...(dan?[['苏小棠','谷里的长老说秘境里有凶兽的气息，我跟着送药的队伍进来了……还好，还好赶上了。']]:[['苏小棠','我在药王谷听说秘境里出了事，求着长老让我跟着送药的队伍进来……还好，还好赶上了。']]),
  ['苏小棠','让开让开，我看看——'],
  ['旁白','她跪在二师兄身边，手指搭上他的脉。眉头越皱越紧，又慢慢松开了。'],
  ['苏小棠','……没事了。就是饿坏了，还有很多年的旧伤，要慢慢养。'],
  ['苏小棠','先喝药。然后，吃这个——我自己蒸的，枣泥的。'],
  ['何满仓','（小声）……可以吃吗。'],
  ['苏小棠','当然可以！'],
  ['旁白','二师兄捧着那个枣泥包子，看了很久。然后，小小地咬了一口。'],
  {love:{tang:30}},
  {run:()=>C2Y.dawnCG()},
  ['旁白','走出饿鬼洞的时候，天亮了。'],
  ['旁白','雾散了。这是你们进秘境以来，第一次看见太阳。'],
  ['旁白','林子里，有一只鸟叫了一声。又一声。'],
  ['何满仓','{称}。'],
  ['何满仓','我想跟长歌走。'],
  ['谢霁月','……满仓。'],
  ['何满仓','它在我身体里睡了十几年。睡着的时候，我也在吃。吃了多少，我不知道。'],
  ['何满仓','北边那几个村子……我想去看看。能做点什么，就做点什么。'],
  ['何满仓','做散修，一个村子一个村子地走。就像长歌找它那样。'],
  ['顾长歌','……路很苦。'],
  ['何满仓','我不怕苦。'],
  ['旁白','他笑了。眼睛弯弯的，和从前一模一样。'],
  ['何满仓','我只怕饿。现在，不饿了。'],
  ['谢霁月','（沉默了很久）……师尊那边，我去说。'],
  ['谢霁月','记得写信。'],
  ['何满仓','嗯！'],
  ['顾长歌','{名}。'],
  ...(R==='side'?[['顾长歌','你说你陪我。……你做到了。'],['顾长歌','仇报不报，已经不重要了。可那句话，我记着。']]
    :R==='split'?[['顾长歌','谢谢你，替我说出那句话。'],['顾长歌','我恨了十年的东西，原来只是一个饿坏了的孩子。……我早该知道的。']]
    :R==='hand'?[['旁白','他低头，看了看自己的手。'],['顾长歌','那时候……你的手很暖。'],['顾长歌','我大概，会记很久。']]
    :[['顾长歌','谢谢你。']]),
  ['顾长歌', F.ge_promise?'北边见。':'……以后，北边见。'],
  {run:()=>{ C2Y.leaving=1; }},
  ['旁白','他转过身。晨光落在他的肩上，长发和剑穗一起，在风里扬了起来。'],
  ['旁白','走出很远，他停下来。没有回头，只是抬起手，挥了一下。'],
  ['旁白','二师兄跟在他身后，回过头来，用力地、用力地挥着手。'],
  ['何满仓','{称}——！大师姐——！我会吃饱的——！'],
  {run:()=>{ PixCG.close(); C2Y.leaving=0; C2Y.sealing=0; }},
  {love:{ge:40}},
  {flag:'c2_man_saved'},
  {run:()=>{ if(count(S,'c2_bun')) addItem('c2_bun',-count(S,'c2_bun')); enterMap('mj_south',11,13); RT.dir='up'; UI.hud(); }},
  ['旁白','（第五幕「饿鬼洞」完。回营地，用传送阵离开秘境吧。）']]; };
Object.defineProperty(SCRIPTS,'c2y_win',{configurable:true, get(){ return C2Y.win(); }});

/* ---------- 尾声: back at the sect ---------- */
C2Y.epilogue=function(){ PixCG.close(); enterMap(zongId(),3,14); RT.dir='down'; UI.hud(); Music.play(areaTheme(),true);
  setTimeout(()=>UI.say([
    ['旁白','秘境的雾，在那天之后，就散了。'],
    ['旁白','你和大师姐回到了宗门。'],
    ['旁白','山门还是老样子。练功场上，外门弟子们还在说着闲话。'],
    ['外门弟子','……听说了吗？陆师兄在秘境里失踪了。'],
    ['外门弟子','何师兄跟一个散修走了，说是去北边……'],
    ['外门弟子','那谢师姐呢？'],
    ['旁白','没有人敢接这句话。'],
    ['旁白','大师兄的房间空着，门上落了一层灰。'],
    ['旁白','二师兄的房间也空了。床底下干干净净，一块点心都没剩下——他走之前，自己收拾好了。'],
    ['旁白','第二天清早，你在练功场上遇见了大师姐。'],
    {run:()=>C2Y.morningCG()},
    ['谢霁月','……{称}。'],
    ['谢霁月','以后的早课，我来带你。'],
    ['旁白','她转身走开了。走了两步，又停下来。'],
    ['谢霁月','（没有回头）……别迟到。'],
    {run:()=>{ C2Y.morningSmile=1; }},
    ['旁白','你好像看见，她的嘴角弯了一下。'],
    {love:{xie:50}},
    {run:()=>PixCG.close()},
    {flag:'c2_done'},
    ['旁白','【第二章「秘境」完】'],
    ['旁白','（大师姐的心动事件以后会加上；狂暴穷奇那里，还能听见大师兄和穷奇互相拆台。第三章，敬请期待。）']], ()=>{ UI.hud(); Story.check(); save(); }),400); };
{ const _o=Portal.open; Portal.open=function(){ if(RT.mapId==='mj_camp'&&S.flags.c2_man_saved&&!S.flags.c2_done) return C2Y.epilogue(); return _o.apply(Portal,arguments); }; }

/* ---------- the quests ---------- */
{ const q=QUESTS.find(q=>q.id==='c2h'), pr=q.progress, tg=q.target;
  q.progress=s=>s.flags.c2_awake&&!s.flags.c2_sealed?'打败饕餮，把二师兄救出来（和洞底的饕餮说话）':pr(s);
  q.target=s=>s.flags.c2_awake&&!s.flags.c2_sealed?(RT.mapId==='mj_cave'?['mj_cave',12,3,'饕餮']:['mj_south',11,17,'洞口']):tg(s);
  QUESTS.splice(QUESTS.indexOf(q)+1,0,
    {id:'c2i', title:'尾声', desc:'二师兄跟着顾长歌走了。秘境的雾散了，该回宗门了。', check:s=>!!s.flags.c2_done, progress:()=>'回营地，用传送阵离开秘境', target:()=>['mj_camp',2,14,'传送阵']},
    {id:'c2z', title:'第二章 完', desc:'第二章「秘境」完。第三章敬请期待。可以继续做日常、钓鱼、刷狂暴穷奇。', check:s=>false}); }
