/* ============================================================
   山海问道 · 第三章「京城」 · 第五幕 · 鼎 — 窫窳 climbs out of the cracked 鼎: 《北山经》 "its form is an ox's, red-bodied,
   with a man's face and horse's feet". A god once, killed unjustly; brought back, it became a thing that eats people.
   You fight it with 顾长歌 and 大师姐 striking after each of your turns (萧烬 walked away; halfway through, his
   red-headed wolves — still under the 国师's command without him — come in on its side). Brought low, its man's face speaks: "the one who
   killed me was not a man…" Then it turns and takes the 国师 into the black water. After: the freed people (an old 剑修 among
   them knows 顾长歌's sword: his 师叔, the "someone of the sect still living"); the court notice — "国师病故，妖物作乱，
   已由萧大人平定"; at 朱雀门, leaving: 萧烬 on the city wall in his court robe, watching you go (one ending — he
   stays where he is), and the chapter ends.
   ============================================================ */
// 窫窳: a red ox body, horse's legs, a pale man's face with long black hair, eyes that weep black water
FineArt.yayu=function(){ if(FineArt.cache.yayu) return FineArt.cache.yayu; const R=rng(4207);
  const c=FineArt.paint(140,100,P=>{ const r='#8a1e18', rm='#a42a20', rl='#c8483a', rk='#5a1210', rd='#3e0c0a', hoof='#1e1a18', face='#ece2d4', fs='#c8b8a8', hair='#121018', ink='#0c0a10';
    P.ell(72,96,58,4,'#00000070');
    // the far legs first, darker: a horse's, with knees and fetlocks
    for(const [x,back] of [[50,0],[104,1]]){ const kx=x+(back?6:-2); P.cap(x,58,kx,76,4,rd); P.cap(kx,76,kx-2,90,2.4,rd); P.ell(kx-2,92,4,2.4,hoof); }
    // the body: a heavy ox with a hump over the shoulders, belly hanging, rump high
    P.poly([[36,46],[44,30],[58,24],[74,28],[96,30],[116,34],[124,44],[122,58],[110,66],[84,68],[60,68],[44,62]],rk);
    P.poly([[40,44],[46,32],[58,26],[74,30],[96,32],[114,36],[120,44],[118,54],[108,60],[84,62],[60,62],[46,58]],r);
    P.poly([[48,36],[58,28],[74,32],[96,34],[112,38],[114,44],[96,42],[74,40],[58,40]],rm);                                // the back, catching the fire's light
    P.poly([[56,30],[66,27],[72,31],[62,34]],rl); P.poly([[98,34],[110,37],[106,40],[96,38]],rl);
    for(const [x,y] of [[66,48],[80,50],[94,48],[106,46]]) P.line(x,y,x+4,y+8,rk);                                          // ribs under the hide
    P.ell(84,64,22,4,rd);                                                                                                 // the belly's shadow
    // the near legs, in front: a horse's, long and wrong under that body
    for(const [x,back] of [[58,0],[112,1]]){ const kx=x+(back?7:-3); P.cap(x,60,kx,78,5,rk); P.cap(x-1,60,kx-1,78,3,r); P.cap(kx,78,kx-1,92,2.8,rk); P.ell(kx-1,94,4.6,2.6,hoof); P.rect(kx-5,93,9,1,'#3a3430'); }
    P.cap(122,44,132,34,1.6,rk); P.cap(132,34,136,40,1.2,rk); P.ell(136,42,2.4,3.4,hair);                                    // a cow's tail with a black tuft
    // the neck reaching forward and down, too long
    P.poly([[40,46],[30,40],[22,44],[20,54],[30,58],[44,58]],rk); P.poly([[40,47],[31,43],[25,46],[24,53],[31,55],[42,55]],r);
    // the head: a man's face, pale and too large, wet black hair hanging down over the shoulder
    P.ell(16,40,15,18,hair); P.poly([[4,44],[8,72],[14,78],[12,60]],hair); P.poly([[26,46],[30,70],[24,66]],hair);
    P.ell(15,44,11,14,face); P.ell(18,48,7,9,fs);                                                                        // the face, a shadow down one side
    P.poly([[8,34],[16,30],[24,34],[22,38],[10,38]],hair);                                                               // hair across the brow
    P.ell(11,42,2.6,1.4,ink); P.ell(19,42,2.6,1.4,ink); P.set(11,42,'#c8402a'); P.set(19,42,'#c8402a');                    // the eyes, a red point in each
    for(const [x,len] of [[11,14],[19,18],[10,9]]) P.rect(x,44,1,len,ink);                                              // black tears running down
    P.ell(15,52,3.4,2.2,'#4a1414'); P.rect(13,51,5,1,'#e8e0d0');                                                         // the mouth a little open, teeth
    // black water dripping from it
    for(let k=0;k<26;k++){ const x=36+R()*90, y=40+R()*26; P.set(x,y,ink); if(R()<.4) P.rect(x,y,1,2+R()*3|0,ink); } });
  c.bottom=c.height; return FineArt.cache.yayu=c; };
SPRC.c3_yayu=FineArt.yayu(); SPR.c3_yayu=['x'];
BEASTS.c3_yayu={name:'窫窳', spr:'c3_yayu', boss:true, big:true, hp:4400, atk:62, def:16, exp:600, stones:[400,400], theme:'qiongqi',
  lore:'《山海经·北山经》：其状如牛，而赤身、人面、马足，名曰窫窳，其音如婴儿，是食人。《海内西经》：贰负之臣曰危，危与贰负杀窫窳。本是天神，被冤杀，复活以后，成了吃人的东西。',
  moves:['flood','weep','trample','devour','weep','flood'],
  phase2:{at:.55, moves:['devour','trample','flood','weep','devour','trample'], line:'窫窳仰头长嚎，声音像婴儿在哭——鼎里的黑水全涌了出来！'}};
SCENES.c3_yayu={...SCENES.qiongqi, sky:['#0a0608','#1a0c0c','#2a1212'], moon:'#c8402a', hills:['#1a0e0e','#140a0a','#0e0606','#080404'], fx:null, title:'窫窳', sub:'其状如牛，而赤身、人面、马足　——　《北山经》', ink:'#050203'};
DODGE.c3_yayu={
  // 黑水: a black flood rising from below, and drops falling
  flood:{name:'黑水', hit:.6, dur:4.8, spawn(P,t,dt,m){ for(const at of [.3,1.6,2.9]) P.once('f'+at,t>=at,()=>P.add({k:'band', dir:'h', at:Math.min(92,P.me.y), w:18, warn:.8/m, act:.35}));
      P.every('d',.35/m,()=>P.add({k:'stone', x:Math.random()*100, y:-4, vx:0, vy:(30+Math.random()*12)*m, r:2.2})); }},
  // 婴啼: its cry, in rings from its face
  weep:{name:'婴啼', hit:.5, dur:4.6, spawn(P,t,dt,m){ P.every('w',.95/m,()=>P.add({k:'ring', cx:20, cy:30, R:2, vr:32*m, gap:Math.random()*Math.PI*2, gw:1.1, th:3})); }},
  // 马蹄: hooves come down where you stand, and either side
  trample:{name:'马蹄', hit:.7, dur:4.4, spawn(P,t,dt,m){ P.every('t',.8/m,()=>{ P.add({k:'pillar', at:P.me.x, w:12, warn:.75/m, act:.4}); P.add({k:'pillar', at:(P.me.x+40)%100, w:10, warn:.75/m, act:.4}); }); }},
  devour:{...DODGE.c2_taotie.devour, name:'吞人'},
  pack:{...DODGE.c3_hejv.pack, name:'狼群'},
};
const YY={
  is:s=>!!s&&s.kind==='c3_yayu',
  side:()=>false,   // 萧烬 never takes a side (see c3act4)
  LINES:[[['窫窳','（像婴儿一样地哭）……饿……']],[['顾长歌','它的腿！砍它的腿！']],[['谢霁月','别让黑水沾上——']],[['国师','（在鼎边大笑）吃！吃了他们！']],[['窫窳','……疼……好疼……']]],
  lines(s){ s.etn=(s.etn||0)+1; if(s.pendingTalk){ const t=s.pendingTalk; s.pendingTalk=null; return t; } return s.etn%2?null:YY.LINES[(s.etn/2|0)%YY.LINES.length]; },
  allies:()=>[['allyStand',LOOK_GE,'3%','顾长歌'],['allyStand2',LOOK_XIE,'19%','谢霁月']],
  stands(){ const st=$('#battle .b-stage'); if(!st) return; for(const [id,look,left] of YY.allies()){ let c=$('#'+id); if(!c){ c=document.createElement('canvas'); c.id=id; st.appendChild(c); }
      const sp=cgChibi(look,'stand','normal',id==='allyStand3'?null:'sword',null,false); c.width=sp.width; c.height=sp.height; c.getContext('2d').drawImage(sp,0,0);
      c.style.cssText=`position:absolute;left:${left};bottom:4%;width:min(24vw,140px);image-rendering:pixelated;animation:allyBob 1.9s ease-in-out infinite;filter:drop-shadow(0 4px 0 rgba(0,0,0,.25))`; } },
  strike(s,id,who,delay){ setTimeout(()=>{ if(Battle.s!==s||s.dead||s.ending) return; const d=Math.round(38+Math.random()*12); s.hp-=d;
      const st=$('#'+id); if(st){ st.classList.remove('hit'); void st.offsetWidth; st.classList.add('hit'); }
      BossBg.flash('rgba(255,200,180,.35)'); Battle.float(who+' -'+d,'pet'); Battle.hitFx(); Battle.ui(); if(s.hp<=s.max*.12) YY.end(s); },delay); },
};
{ const _b=Battle._begin; Battle._begin=function(kind,cb){ const r=_b.call(Battle,kind,cb); const s=Battle.s; if(YY.is(s)){ YY.stands();
      s.pendingTalk=[['窫窳','（它从鼎里爬出来，一张人脸，哭得像个婴儿）……'],['顾长歌','{名}，大师姐——一起上！']]; } return r; }; }
{ const _pc=Battle.phaseCheck; Battle.phaseCheck=function(){ const s=Battle.s, p2=s&&s.phase2; _pc.call(Battle);
    if(YY.is(s)&&s.phase2&&!p2){
      s.moves=s.moves.concat(['pack','pack']); s.pendingTalk=[['旁白','黑暗里亮起一片红色的眼睛。是萧烬的狼群。'],['旁白','它们扑上来——扑向的是你们。'],['谢霁月','……他不在，狼还认国师的令！']]; } }; }
{ const _et=Battle.enemyTurn; Battle.enemyTurn=function(){ const s=Battle.s; if(!YY.is(s)) return _et.call(Battle); if(s.ending) return;
    if(!s.stun&&!s.talked&&!Dodge.auto){ const lines=YY.lines(s); if(lines){ s.talked=true; s.busy=true; Battle.ui(); return QQLU.talk(lines,()=>{ if(Battle.s!==s||s.dead) return; s.busy=false; Battle.enemyTurn(); }); } }
    s.talked=false; return _et.call(Battle); }; }
{ const _act=Battle.act; Battle.act=function(a){ const s=Battle.s; if(!YY.is(s)||s.over||s.busy||s.dead||s.ending) return _act.call(Battle,a);
    const r=_act.call(Battle,a); if(Battle.s!==s) return r;
    if(s.hp<=s.max*.12){ s.dead=false; s.hp=Math.max(1,s.hp); YY.end(s); return r; }
    if(a!=='pill'&&!s.dead){ let k=0; for(const [id,,,who] of YY.allies()) YY.strike(s,id,who,380*(++k)); }
    return r; }; }
{ const _end=Battle.end; Battle.end=function(r){ const s=Battle.s; if(YY.is(s)&&r==='win'&&!s.endDone){ s.over=false; s.dead=false; s.hp=Math.max(1,s.hp); YY.end(s); return; } return _end.call(Battle,r); }; }
// brought low it speaks, and then it eats the one who raised it
YY.end=s=>{ if(s.ending) return; s.ending=true; s.busy=true; Battle.ui(); BossBg.flash('rgba(255,230,210,.8)');
  QQLU.talk([['旁白','窫窳跪倒了。那张人脸抬起来，黑色的眼泪一道一道往下流。'],['窫窳','……我……本来……不是这样的……'],['窫窳','杀我的……不是人……'],['窫窳','是天上的……'],
    ['国师','（他扑过来，抓住窫窳的角）起来！起来！老夫养了你十年——'],['旁白','窫窳转过头，看着他。'],['旁白','然后，张开了嘴。'],['旁白','国师的面具掉在地上，「当」的一声。黑水合拢了。'],
    ['旁白','窫窳慢慢沉进了鼎里。鼎上那张兽脸，闭上了嘴。']],()=>{ if(Battle.s!==s) return; s.endDone=true; s.dead=true; s.hp=0; Battle.ui(); setTimeout(()=>Battle.end('win'),300); }); };

/* ---------- starting the fight: right after the 鼎 cracks ---------- */
YY.go=()=>Battle.start('c3_yayu',r=>{ if(r!=='win') return UI.say([['旁白','黑水漫过了你的膝盖。顾长歌一把把你拽了回来。'],['顾长歌','再来！它也快撑不住了！']]); YY.after(); });
YY.after=()=>{ UI.say([
  ['旁白','鼎底下的火灭了。地宫里只剩下火把的光。'],
  ['旁白','最深处的几间牢房里，还关着人。你们一间一间地打开。'],
  ['旁白','安平村的人。北边几个村子的人。前几届大比「送回宗门」的弟子。'],
  ['旁白','加起来，不到三十个。'],
  ['旁白','一个满头白发的老人扶着墙走出来，看见顾长歌手里的剑，忽然站住了。'],
  ['白发老剑修','……这把剑……'],
  ['白发老剑修','长歌？'],
  ['顾长歌','（他的剑「当」地掉在地上）……师叔？'],
  ['顾长歌','（他跪下去，很久很久没有起来）'],
  ['我','（……「门中尚有人在」。原来是这里。）'],
  {flag:'c3_a5_win'},
  ['旁白','（天快亮了。离开地宫。）']],()=>{ C3.move('jc_zhuque',19,14,'up',8,()=>setTimeout(()=>UI.say(YY.notice(),()=>{ UI.hud(); Story.check(); }),500)); }); };
// three days later: the notice on the board at the cross street
YY.notice=()=>[
  ['旁白','三天以后。十字街口的墙上，贴了一张新告示。'],
  ['旁白','「国师病故。宗庙妖物作乱，已由钦差萧大人平定。失踪弟子，悉数寻回。」'],
  ['看热闹的人','萧大人真是能人啊……'],
  ['看热闹的人','那个狐仙呢？不是说她吸人精气吗？'],
  ['看热闹的人','嗐，谁知道呢。'],
  ['谢霁月','（她站在告示前面，看了很久）……'],
  ['谢霁月','名声，又一次压过了真相。'],
  ['谢霁月','（她转过身）可是那些人回家了。这就够了。'],
  {flag:'c3_a5_notice'},
  ['旁白','（该回宗门了。去朱雀门。）']];

/* ---------- leaving: 萧烬's ending at 朱雀门 ---------- */
YY.ending=()=>{ S.flags.c3_xj_end='stay'; return [
  ['旁白','清早，朱雀门。来的时候城门口排着长队，走的时候，门口空荡荡的。'],
  ['苏小棠',S.sect==='dan'?'（她背着药篓，回头看了一眼京城）……走吧，回谷里！':'（她背着药篓）我先回药王谷啦。长老的信一封比一封凶……'],
  ...(S.sect==='dan'?[]:[['苏小棠','（她走出几步，又跑回来，往你手里塞了一包东西）路上吃！'],['旁白','是一包糖人。'],{give:{jc_tangren:2}}]),
  ['何满仓','{称}，我跟你们回宗门。'],
  ['何满仓','（他笑了一下）我……好像不饿了。'],
  ['顾长歌','（他扶着白发的师叔）我送师叔回北边。门中还有几个人，在等我们。'],
  ['顾长歌','{名}。……谢谢。'],
  ['旁白','出了城门，你回头看了一眼。'],['旁白','城楼上站着一个穿玄色朝服的人。灰白的长发，被风吹起来。'],['旁白','萧烬。钦差萧大人。'],
  ['旁白','他看着你，看了很久。然后转身，走下了城楼。'],['谢霁月','……他会是个好官吗？'],['我','……不知道。'],
  ['旁白','怀里的八卦镜，裂缝里透出一点光。你拿出来看，镜面上浮出两个字，一闪就没了：'],
  ['旁白','「贰负」。'],
  ['我','（窫窳说，杀它的，是天上的……）'],
  {run:()=>{ S.flags.c3_done=true; save(); }},
  ['旁白','（第三章「京城」完。）']]; };

/* ---------- hooks ---------- */
// (the 鼎 cracking at the end of act 4 leads straight into the fight; after a loss, the 鼎 starts it again: both in c3act4)
// the old 朱雀门 guards' spot: leaving the city
MAPS.jc_zhuque.objects.push({type:'npc', id:'c3_leave', x:13, y:30, look:LOOK_XIE, name:'谢霁月', act:'talk', cond:s=>!!s.flags.c3_a5_notice&&!s.flags.c3_done});
On.talk(id=>{ if(id!=='c3_leave') return false; UI.say([{choice:'离开京城？', options:[{text:'走吧', fn:()=>UI.say(YY.ending(),()=>{ UI.hud(); Story.check(); })},{text:'再逛逛', fn:()=>{}}]}]); return true; });

/* ---------- the quests ---------- */
{ const q=QUESTS.find(q=>q.id==='c3p'); Object.assign(q,{check:s=>!!s.flags.c3_a5_notice,
    progress:s=>!s.flags.c3_a5_win?'窫窳：和顾长歌、大师姐一起打':'三天以后',
    target:s=>!s.flags.c3_a5_win?['jc_digong',13,5,'鼎']:['jc_zhuque',19,14,'告示']}); }
QUESTS.splice(QUESTS.findIndex(q=>q.id==='c3p')+1,0,
  {id:'c3q', title:'离开京城', desc:'国师病故，妖物作乱，已由萧大人平定。名声又一次压过了真相。可是那些人回家了。', check:s=>!!s.flags.c3_done,
    progress:s=>'去朱雀门，找大师姐', target:s=>['jc_zhuque',13,29,'朱雀门']},
  {id:'c3zz', title:'第三章「京城」完', desc:'八卦镜的裂缝里，浮出两个字：「贰负」。', check:s=>false, progress:s=>'（第四章正在构思）', target:s=>null});
