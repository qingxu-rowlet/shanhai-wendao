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
    const pull=()=>{ if(ended) return; if(lash>0){ shake=.35; if(!lashHit){ lashHit=1; p=Math.max(0,p-.15); Sound.hurt(); } say.textContent='它反扑了——松手！'; return; } p=Math.min(1,p+.017); pulled=.12; Sound.tick(); };   // only the first pull into a lash costs you
    const kd=e=>{ if(['Space','KeyJ','Enter','KeyE'].includes(e.code)){ e.preventDefault(); e.stopPropagation(); if(!e.repeat) pull(); } };
    addEventListener('keydown',kd,true); ov.addEventListener('pointerdown',e=>{ e.preventDefault(); pull(); });
    const man=cgChibi(LOOK_MAN,'kneel','sad',null,null,false), T=FineArt.taotie();
    const lines=[[.25,'顾长歌：别松手！'],[.5,'何满仓：……{称}……我在这儿……'],[.75,'谢霁月：快了——再用力！']];
    const step=now=>{ if(ended) return; const dt=Math.min(.05,(now-last)/1000); last=now; t+=dt;
      if(pulled<=0&&lash<=0) p=Math.max(0,p-dt*.035*(.4+p));        // it keeps dragging itself back in; the harder you have it, the harder it drags
      p=Math.min(1,p+dt*.006);                                     // 顾长歌 and 大师姐 pull too, slowly
      if(lash>0){ lash-=dt; if(lash<=0){ next=t+1.2+Math.random()*1.3; say.textContent=''; } }
      else if(warn>0){ warn-=dt; if(warn<=0){ lash=1.1; lashHit=0; BossBg.flash('rgba(255,60,40,.5)'); say.textContent='它反扑了——松手！'; } }
      else if(t>=next){ warn=.45; say.textContent='它要反扑了……'; }
      for(const [at,text] of lines) if(p>=at&&!said[at]){ said[at]=1; if(!lash&&!warn) say.textContent=text.replace(/\{称\}/g,S.look&&S.look.g==='f'?'小师妹':'小师弟'); }
      shake=Math.max(0,shake-dt); pulled=Math.max(0,pulled-dt*.35);
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
  {run:()=>Music.play('romance',true)},
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
  ...(dan?[['苏小棠','谷里的长老说秘境里有凶兽的气息，我就跟着送药的队伍进来了。'],['苏小棠','我说过的——出了事，我就来找你。……还好，还好赶上了。']]
    :[['苏小棠','谷里说秘境里出了事，我求着长老，跟着送药的队伍进来了。'],['苏小棠','字条上写的，你看了吧？我说过的——出了事，我就来找你。……还好，还好赶上了。']]),
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
  ['何满仓','{称}。'],
  ['何满仓','你来宗门的第一天，我给了你半个馒头。你还记得吗？'],
  ['我','记得。你说，晚饭你请。'],
  ['何满仓','（他挠挠头，笑了）……欠着呢。'],
  {choice:'你对二师兄说——', options:[
    {text:'一言为定。一桌，少一个菜都不行', go:'c2y_m_feast'},
    {text:'路上饿了，就写信回来', go:'c2y_m_letter'},
    {text:'（把他的干粮袋缝好，还给他）', go:'c2y_m_bag'}]}]; };
Object.assign(SCRIPTS, {
  c2y_m_feast:[['我','一言为定。一桌，少一个菜都不行。'],['何满仓','一言为定！'],['何满仓','……还要加一大锅祝余汤。这回，我一定喝得饱。'],{love:{man:50}},{go:'c2y_ge_bye'}],
  c2y_m_letter:[['我','二师兄，路上饿了，就写信回来。'],['何满仓','……嗯。'],['何满仓','（他把手按在肚子上，按了很久）……不过，我想以后不会了。'],{love:{man:50}},{go:'c2y_ge_bye'}],
  c2y_m_bag:[['旁白','你从他手里拿过那个被撕破的干粮袋，借了大师姐的针线，一针一针地缝好。'],['旁白','针脚歪歪扭扭的。'],['何满仓','（他捧着袋子，眼圈红了）……这下，装得住了。'],{love:{man:50}},{go:'c2y_ge_bye'}],
});
Object.defineProperty(SCRIPTS,'c2y_ge_bye',{configurable:true, get(){ return C2Y.geBye(); }});
C2Y.geBye=()=>{ const F=S.flags, R=F.c2_ge_r; return [
  ['旁白','顾长歌走到你身边。你们并肩站着，看太阳一点一点爬上山头。'],
  ['顾长歌','……这十年，我每天早上醒来，想的第一件事，都是它在哪儿。'],
  ['顾长歌','今天早上，我什么都没想。'],
  ['我','那你现在在想什么？'],
  ['顾长歌','（他看了你一眼）……在想，日出原来是这个颜色。'],
  ['顾长歌','{名}。'],
  ...(R==='side'?[['顾长歌','你说你陪我。……你做到了。'],['顾长歌','仇报不报，已经不重要了。可那句话，我记着。']]
    :R==='split'?[['顾长歌','谢谢你，替我说出那句话。'],['顾长歌','我恨了十年的东西，原来只是一个饿坏了的孩子。……我早该知道的。']]
    :R==='hand'?[['旁白','他低头，看了看自己的手。'],['顾长歌','那时候……你的手很暖。'],['顾长歌','我大概，会记很久。']]
    :[['顾长歌','谢谢你。']]),
  ['顾长歌','那把剑，我背了十年。今天，好像轻了一点。'],
  ['顾长歌','可是有一件事，我想不通。'],
  ['顾长歌','饕餮在满仓身体里睡了十几年。那十年前吞掉我师父的……三个月前吞掉北边那两个村子的……又是什么？'],
  ['谢霁月','……难道，不止一个饕餮？'],
  ['顾长歌','或者——有人借着它的样子。'],
  ...(F.ge_mask?[['顾长歌','那张青铜面具……十年前那个晚上，戴着它站在火光里的，是一个人。'],['顾长歌','我得弄清楚，他是谁。']]:[['顾长歌','北边的事，我得弄清楚。']]),
  ['顾长歌','我和满仓先往北走。'],
  ['顾长歌', F.ge_promise?'等你修为稳了——北边见。':'……以后，北边见。'],
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

/* ---------- 尾声: back at the sect — 师尊 at the gate (four went, two came back; he takes the mirror to seal it away), the sect
   talking about it, your room, and in the morning 大师姐 ---------- */
C2Y.epilogue=function(){ PixCG.close(); S.flags.c2_back=true; enterMap(zongId(),11,17); RT.dir='up'; UI.hud(); Music.play('calm',true);
  const M=SECTS[S.sect].master, m=M.name, F=S.flags, k=S.look&&S.look.g==='f'?'师妹':'师弟', ta=M.look&&M.look.g==='f'?'她':'他', teach={jian:'剑',dan:'医术',shou:'驯兽',tianji:'卜算'}[S.sect]||'剑';   // 苍姑 is a woman; each master taught him their own art
  setTimeout(()=>UI.say([
    ['旁白','秘境的雾，在那天之后，就散了。'],
    ['旁白','你和大师姐走上山门的石阶。台阶还是那么长，山风还是那么凉。'],
    ['旁白',`山门下站着一个人。是${m}。`],
    [m,'……回来了。'],
    ['旁白','师尊看着你们身后。山路上空荡荡的。'],
    [m,'去了四个。'],
    [m,'回来两个。'],
    ['旁白',`${ta}沉默了很久，长长地，叹了一口气。`],
    ['谢霁月','师尊，大师兄他……'],
    [m,'我知道。'],
    [m,`（${ta}闭上眼睛）正衡那孩子，太要名声了。他心里那根刺，我早该看出来的。`],
    ['谢霁月','满仓跟着一个散修，往北边去了。他说……要去赎罪。'],
    [m,'……满仓。'],
    [m,'当年我从丰年村的灰烬里把他抱出来，他手里攥着半个馒头，怎么掰都不肯松手。'],
    [m,`我教了他十几年${teach}，从没教会他吃饱。`],
    [m,'由他去吧。吃饱了的人，才走得动远路。'],
    [m,'那面镜子，给我。'],
    ['旁白','你把八卦镜递了过去。镜面冰凉。里面隐约有一个小小的影子，蜷着身子，睡得很沉。'],
    [m,'穷奇照过它。霁月照过它。满仓也照过它。'],
    [m,'这面镜子，照过太多人心里最怕的东西了。'],
    [m,'我把它封进藏经阁最底下那一层。以后，谁也别再看它。'],
    {run:()=>{ if(count(S,'c2_bagua')) addItem('c2_bagua',-count(S,'c2_bagua')); UI.toast('八卦镜交给了师尊'); }},
    [m,'霁月。'],
    ['谢霁月','弟子在。'],
    [m,`从今往后，你就是这一门的大师姐了。真正的那种。带好你${k}。`],
    ['谢霁月','（她低下头）……是。'],
    [m,'{名}，你也辛苦了。回房好好睡一觉。'],
    {flag:'c2_master_back'},
    ['旁白','（宗门里的人都在说秘境里的事。走走看看，再回房间睡一觉。）']], ()=>{ enterMap(zongId(),S.x,S.y); UI.hud(); Story.check(); save(); }),500); };
{ const _o=Portal.open; Portal.open=function(){ if(RT.mapId==='mj_camp'&&S.flags.c2_man_saved&&!S.flags.c2_back) return C2Y.epilogue(); return _o.apply(Portal,arguments); }; }
// the morning after: 大师姐 on the practice ground
C2Y.morning=function(){ enterMap(zongId(),12,10); RT.dir='up'; UI.hud();
  setTimeout(()=>UI.say([
    ...(S.flags.c2_mc_looked?[['我','（梦里那面镜子照出来的，是一座空荡荡的山门。）'],['我','（四个人去，两个回。镜子没有说错。）'],['我','（可是——）']]
      :S.flags.c2_mc_shard?[['我','（那天在梦里，你没有看那面镜子。）'],['我','（现在站在空了一半的宗门里，你好像知道它会照出什么了。）']]:[]),
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
    ['旁白','（大师姐的心动事件以后会加上；狂暴穷奇那里，还能听见大师兄和穷奇互相拆台。第三章，敬请期待。）']], ()=>{ UI.hud(); Story.check(); save(); }),900); };
{ const _a=Dungeon.act; Dungeon.act=function(o){ if(o.act==='c2bed'&&S.flags.c2_master_back&&!S.flags.c2_done){ UI.confirm('回房休息，结束今天？', ()=>{ sleep(false); C2Y.morning(); }); return true; } return _a.call(Dungeon,o); }; }

// the sect after: the disciples are still about, saying other things now; 大师姐 is back; 师尊 has the mirror
C2L.on=s=>!!s.sect&&!!s.flags.c2_arrive&&(!s.flags.c2_depart||!!s.flags.c2_back);
C2L.backDays=[
  [[0,'陆师兄……真的没回来？'],[1,'听说是在秘境里出的事。'],[0,'那么厉害的一个人……'],[1,'……嘘。']],
  [[0,'谢师姐回来了。'],[1,'她刚才……对我点了一下头。'],[0,'你看错了吧？'],[1,'真的！']],
  [[0,'何师兄走了。'],[1,'屋里收拾得干干净净，一块点心都没剩。'],[0,'……以后膳堂的饭，怕是要剩了。']]];
C2L.backTalks={
  c2d_zhou:[['外门弟子·周小川','（压低了声音）你在秘境里……见到陆师兄最后一面了吗？'],['外门弟子·周小川','……算了，别说了。'],['外门弟子·吴阿蛮','我墙上抄的那句「名正言顺」，昨天撕了。']],
  c2d_lin:()=>[['外门弟子·林巧儿','……那个，新来的。'],['外门弟子·林巧儿','以前那些话，你别跟谢师姐说是我说的。'],['外门弟子·孟大壮','（小声）她好像……也没那么凶。'],
    ...(S.flags.c2_defend_xie?[['外门弟子·孟大壮','你那时候问我们亲眼看见没有。'],['外门弟子·孟大壮','……没有。我们谁都没看见过。']]:[])],
  c2d_sun:[['外门弟子·孙小六','何师兄走的时候，给膳堂的大娘留了一封信。'],['外门弟子·柳青青','信上就一句话：「我吃饱了。谢谢大家这些年的饭。」'],['外门弟子·孙小六','……以前那么笑话他，怪不好意思的。']],
  c2d_zhong:[['守门弟子·老钟','四个真传，回来两个。'],['守门弟子·老钟','我守了这山门三十年，这样的事，见过不止一回。'],['守门弟子·老钟','……活着回来的，就好好活着。']]};
C2L.backTalks.c2d_wu=C2L.backTalks.c2d_zhou; C2L.backTalks.c2d_meng=C2L.backTalks.c2d_lin; C2L.backTalks.c2d_liu=C2L.backTalks.c2d_sun;
{ const _t=Story.talk; Story.talk=function(id){ const F=S&&S.flags;
    if(F&&F.c2_back&&/^zong_/.test(RT.mapId)){
      const bt=C2L.backTalks[id]; if(bt) return UI.say(typeof bt==='function'?bt():bt);
      if(id==='xie') return UI.say(F.c2_done?[['谢霁月','……早课，别迟到。']]:[['谢霁月','……早些歇着吧。'],['谢霁月','（她看了一眼大师兄和二师兄的房间，没有再说话。）']]);
      if(id===SECTS[S.sect].master.id) return UI.say([[SECTS[S.sect].master.name,'镜子，我封好了。'],[SECTS[S.sect].master.name,'修道先修心。你们这一趟，修的就是心。']]); }
    return _t.call(Story,id); }; }
for(const k in SECTS){ const o=MAPS['zong_'+k].objects.find(o=>o.id==='xie'); if(o){ const c=o.cond; o.cond=s=>c(s)||(s.sect===k&&!!s.flags.c2_back); } }
// what you overhear walking past: their talk after you came back
{ const day0=C2L.pairs.map(p=>p.days); Object.defineProperty(C2L,'backOn',{get(){ return !!(S&&S.flags.c2_back); }});
  C2L.pairs.forEach((p,i)=>{ const d=p.days; Object.defineProperty(p,'days',{configurable:true, get(){ return C2L.backOn?[C2L.backDays[i],C2L.backDays[i],C2L.backDays[i]]:d; }}); }); }

/* ---------- the quests ---------- */
{ const q=QUESTS.find(q=>q.id==='c2h'), pr=q.progress, tg=q.target;
  q.progress=s=>s.flags.c2_awake&&!s.flags.c2_sealed?'打败饕餮，把二师兄救出来（和洞底的饕餮说话）':pr(s);
  q.target=s=>s.flags.c2_awake&&!s.flags.c2_sealed?(RT.mapId==='mj_cave'?['mj_cave',12,3,'饕餮']:['mj_south',11,17,'洞口']):tg(s);
  QUESTS.splice(QUESTS.indexOf(q)+1,0,
    {id:'c2i', title:'尾声', desc:'二师兄跟着顾长歌走了。秘境的雾散了，该回宗门了。', check:s=>!!s.flags.c2_done, progress:s=>!s.flags.c2_back?'回营地，用传送阵离开秘境':'在宗门里走走，然后回房间睡一觉', target:s=>!s.flags.c2_back?['mj_camp',2,14,'传送阵']:[zongId(),3,14,'你的房间']},
    {id:'c2z', title:'第二章 完', desc:'第二章「秘境」完。第三章敬请期待。可以继续做日常、钓鱼、刷狂暴穷奇。', check:s=>false}); }

// once it is sealed, the wood and the cave are quiet again
{ const _at=areaTheme; areaTheme=function(){ if((RT.mapId==='mj_cave'||RT.mapId==='mj_south')&&S&&S.flags.c2_sealed) return 'calm'; return _at(); }; }

// outermost: a timer can land while the next fight's title card is up (no screen yet), or after the win (the result panel
// has replaced the bars) — 大师姐's follow-up blow in the 穷奇 fight, for one
{ const _u=Battle.ui; Battle.ui=function(){ if(!Battle.s||!$('#bEhp')||!$('#bPhp')) return; return _u.apply(Battle,arguments); }; }

/* ---------- 第三幕之后: the first night back at camp without 大师兄 — four bowls, one poured back; 大师姐 folding his clothes ---------- */
C2Y.mourn=()=>[
  ['旁白','回到营地的时候，天已经黑了。'],
  ['旁白','篝火是二师兄生的。锅里煮着粥，他盛了四碗，摆在火边。'],
  ['何满仓','大师兄，你的——'],
  ['旁白','他的手停在半空。'],
  ['旁白','过了很久，他把第四碗粥端起来，倒回锅里。勺子碰着锅沿，叮的一声。'],
  ['何满仓','……我、我盛多了。'],
  ['旁白','大师姐一个人进了大师兄的帐篷。'],
  ['旁白','你掀开帘子。她跪坐在铺盖前，把大师兄的衣服一件一件叠好。叠得方方正正，一道褶子都没有——他最讲规矩。'],
  ['谢霁月','……他第一天教我剑的时候，说过一句话。'],
  ['谢霁月','「剑要正，人才能正。」'],
  ...(count(S,'c2_lutoken')?[['旁白','你把那块「正」字玉牌拿了出来。她接过去，用袖子擦了很久，又放回你手里。'],['谢霁月','……你留着吧。']]:[]),
  ['谢霁月','他自己，大概也是这么信的。信到最后，连自己都骗过去了。'],
  ['我','大师姐……'],
  ['谢霁月','没事。'],
  ['谢霁月','早些睡吧。明天……还要往前走。'],
  ['旁白','那一夜，营地里谁都没有说话。只有篝火噼啪地响。'],
  {flag:'c2_lu_mourn'}];
{ const _em=enterMap; enterMap=function(id,x,y){ const r=_em(id,x,y);
    if(id==='mj_camp'&&S.flags.c2_qq_sealed&&!S.flags.c2_lu_mourn&&!S.flags.c2_xin_night) setTimeout(()=>{ if(RT.mapId==='mj_camp'&&!S.flags.c2_lu_mourn&&!UI.busy()) UI.say(C2Y.mourn(), ()=>{ UI.hud(); }); },400);
    return r; }; }

/* ---------- 满仓的梦: the mirror pulls you into 丰年村 as he remembers it — walk to the well, the kitchen, the cellar, and see
   for yourself; then a shard of the mirror turns to you, and you choose whether to look at what you fear ---------- */
Object.assign(SPR, {
  mj_well:['................','................','................','................','.....nnnnnn.....','....n......n....','....n......n....','.....nnnnnn.....','..eeeeeeeeeeee..','.eEeeeeeeeeeEe..','.eekkkkkkkkkee..','.eEeeeeeeeeeEe..','..eeeeeeeeeeee..'],
  mj_cellar:['................','................','................','................','................','................','..NN.NNN.NN.....','.NkkNkkkNkkN....','.NkNNkkNNkkN....','.NkkNkrkNkkN....','..NNNNNNNNN.....'],
  mj_shard:['................','................','................','................','................','......ll........','.....lxll.......','....lllxll......','.....llll.......','......ll........'],
});
C2Y.DREAM=[[5,5,'c2dwell','枯井'],[13,6,'c2dhouse','满仓家的灶房'],[14,10,'c2dcellar','烧塌的地窖']];
{ const W=20, H=14, G=[...Array(H)].map((_,y)=>[...Array(W)].map((_,x)=>(x===0||y===0||x===W-1||y===H-1)?'W':'D'));
  for(let x=2;x<=17;x++) G[8][x]='='; for(let y=2;y<=12;y++) G[y][10]='='; for(let x=5;x<=10;x++) G[6][x]='=';
  const objects=[
    {type:'mj_well', x:5, y:5, spr:'mj_well', act:'c2dwell'},
    {type:'building', x:11, y:3, w:5, h:3, style:'house', roof:['#2e2620','#463a30','#5a4a3a','#7a6a58'], label:'满仓家的灶房', door:[13,6], act:'c2dhouse'},
    {type:'mj_cellar', x:14, y:10, spr:'mj_cellar', act:'c2dcellar'},
    {type:'mj_shard', x:10, y:9, spr:'mj_shard', act:'c2dshard', cond:s=>!!(s.c2y&&s.c2y.dream&&s.c2y.dream.length>=3)&&!s.flags.c2_mc_shard},
    {type:'npc', id:'c2_kid', x:7, y:5, look:LOOK_MAN_SMALL, name:'小满仓', act:'talk', cond:s=>!(s.c2y&&s.c2y.dream&&s.c2y.dream.length>=3)},
  ];
  for(const [x,y] of [[2,2],[3,11],[17,2],[17,12],[8,11],[16,7],[2,8]]) objects.push({type:'mj_deadtree', x, y, spr:'mj_deadtree'});
  for(const [x,y] of [[4,10],[12,11],[7,2]]) objects.push({type:'building', x, y, w:3, h:2, style:'house', roof:['#26221e','#38322c','#4a4038','#6a5e52'], label:'没有人的屋子'});
  MAPS.mj_dream={ name:'梦 · 丰年村', w:W, h:H, ground:G.map(r=>r.join('')), objects, exits:[] }; }
// the dream: washed out, ash drifting, the word 饿 in the air
{ const _r=render; render=function(){ _r(); if(RT.mapId!=='mj_dream'||!RT.map) return;
    const g=ctx, W=cv.width, H=cv.height, Z=RT.scale*RT.dpr, T=TILE*Z, ox=Math.round(-RT.cam.x*Z), oy=Math.round(-RT.cam.y*Z);
    g.fillStyle='rgba(236,220,186,.28)'; g.fillRect(0,0,W,H);
    for(let i=0;i<40;i++){ const u=(RT.t*.04+i*.071)%1, x=((i*97.3)%W)+Math.sin(RT.t+i)*T*.4, y=H*(1-u); g.fillStyle=`rgba(90,80,70,${Math.sin(u*Math.PI)*.5})`; g.fillRect(x,y,Math.max(2,Z*1.2),Math.max(2,Z*1.2)); }
    for(let i=0;i<5;i++){ const u=(RT.t*.04+i*.2)%1, x=ox+(3+((i*3.7)%14))*T, y=oy+(3+((i*2.3)%8)-u*1.5)*T; g.save(); g.globalAlpha=Math.sin(u*Math.PI)*.3; g.font=`${Math.round(T*.6)}px "Ma Shan Zheng",KaiTi,serif`; g.textAlign='center'; g.fillStyle='#6a4a3a'; g.fillText('饿',x,y); g.restore(); }
    const vg=g.createRadialGradient(W/2,H/2,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.75); vg.addColorStop(0,'rgba(240,230,210,0)'); vg.addColorStop(1,'rgba(240,230,210,.75)'); g.fillStyle=vg; g.fillRect(0,0,W,H);
    // the place the mirror is showing glimmers
    for(const [x,y,act] of C2Y.DREAM){ const i=C2Y.DREAM.findIndex(d=>d[2]===act); if((S.c2y&&S.c2y.dream||[]).includes(i)) continue; if(i===2&&(S.c2y&&S.c2y.dream||[]).length<2) continue;
      const a=.35+.25*Math.sin(RT.t*3), cx=ox+(x+.5)*T, cy=oy+(y+.5)*T, gr=g.createRadialGradient(cx,cy,0,cx,cy,T*1.4); gr.addColorStop(0,`rgba(200,230,255,${a})`); gr.addColorStop(1,'rgba(200,230,255,0)'); g.fillStyle=gr; g.fillRect(cx-T*1.4,cy-T*1.4,T*2.8,T*2.8); } }; }
C2Y.enterDream=function(){ PixCG.close(); S.c2y=S.c2y||{}; S.c2y.dream=[]; S.flags.c2_dream_in=true; enterMap('mj_dream',10,12); RT.dir='up'; UI.hud(); Music.play('night',true);
  setTimeout(()=>UI.say([
    ['旁白','你站在一条土路上。'],
    ['旁白','天是白的，地是裂的。风里有一股烧焦的味道。四周静得出奇——连你自己的脚步声都听不见。'],
    ['谢霁月','（声音很远，像隔着一层水）{称}……你在哪儿？'],
    ['顾长歌','（很远）别乱走——'],
    ['旁白','这是二师兄的梦。'],
    ['旁白','（在丰年村里走走。镜光亮着的地方，就是他最不敢想起的事。）']], ()=>{ UI.hud(); }),400); };
C2Y.seeMem=function(i,after){ S.c2y=S.c2y||{dream:[]}; const seen=S.c2y.dream.includes(i);
  UI.say([{run:()=>C2Y.memCG(i)}, ...C2Y.memLines(i), {run:()=>{ PixCG.close(); C2Y.eyes=0; if(!seen) S.c2y.dream.push(i); save(); enterMap('mj_dream',S.x,S.y); UI.hud(); }}, ...(after||[])]); };
C2Y.leaveDream=function(){ enterMap('mj_cave',12,5); RT.dir='up'; UI.hud(); Music.play(areaTheme(),true); setTimeout(()=>UI.say(C2Y.found2()),300); };
SCRIPTS.c2y_shard_look=[['旁白','你看着镜子。'],['旁白','镜子里是一座山门。台阶很长，长得望不到头。'],['旁白','大师兄不在。二师兄不在。大师姐也不在。'],['旁白','台阶上，只坐着一个人。'],['旁白','是你。你坐在那里等，从天亮等到天黑，一直等，一直等。'],
  ['我','（……原来我最怕的，是这个。）'],['我','（一个一个，都走了。只剩我一个。）'],['旁白','镜子里的你抬起头，看了你一眼。然后，镜面碎了。'],{flag:'c2_mc_looked'},{flag:'c2_mc_shard'}];
SCRIPTS.c2y_shard_no=[['旁白','你伸出手，把镜子扣了下去。'],['我','（不看。）'],['我','（至少现在……我还不想知道。）'],['旁白','手心里，镜子的背面烫了一下，又凉了。'],{flag:'c2_mc_shard'}];
{ const _a=Dungeon.act; Dungeon.act=function(o){
    if(o.act==='c2dwell'){ C2Y.seeMem(0); return true; }
    if(o.act==='c2dhouse'){ C2Y.seeMem(1); return true; }
    if(o.act==='c2dcellar'){ const n=(S.c2y&&S.c2y.dream||[]).filter(i=>i<2).length;
      if(n<2) return UI.say([['旁白','地窖板烫得碰不得，缝里透出一点红光。'],['旁白','（先去村子里别的地方看看。）']]), true;
      C2Y.seeMem(2,[['旁白','灰烬里，有什么东西亮了一下。']]); return true; }
    if(o.act==='c2dshard'){ UI.say([['旁白','灰烬里躺着一片镜子的碎片，青白的光一闪一闪。'],['旁白','你蹲下去捡。镜面慢慢转了过来——这一次，它照的不是二师兄。'],['旁白','是你。'],
        {choice:'镜子要照出你心里最怕的东西。你——', options:[{text:'看', go:'c2y_shard_look'},{text:'（把镜子扣过去）', go:'c2y_shard_no'}]}], ()=>C2Y.leaveDream()); return true; }
    return _a.call(Dungeon,o); }; }
{ const _t=Story.talk; Story.talk=function(id){ if(id==='c2_kid'&&RT.mapId==='mj_dream') return UI.say([['小满仓','娘说，藏好。谁也别给看见。'],['旁白','他把袖子攥得紧紧的，没有看你。']]); return _t.call(Story,id); }; }
// the task while you are in the dream
{ const q=QUESTS.find(q=>q.id==='c2h'), pr=q.progress, tg=q.target;
  q.progress=s=>{ const F=s.flags; if(F.c2_dream_in&&!F.c2_mc_shard){ const n=(s.c2y&&s.c2y.dream||[]).length; return n<3?`在二师兄的梦里，找到镜光照着的地方 ${n}/3`:'灰烬里有一片镜子的碎片'; } return pr(s); };
  q.target=s=>{ const F=s.flags; if(F.c2_dream_in&&!F.c2_mc_shard){ const d=(s.c2y&&s.c2y.dream)||[]; if(d.length>=3) return ['mj_dream',10,9,'镜子的碎片'];
      const i=[0,1,2].find(i=>!d.includes(i)&&(i<2||d.length>=2)); const [x,y,,l]=C2Y.DREAM[i]; return ['mj_dream',x,y,l]; } return tg(s); }; }
