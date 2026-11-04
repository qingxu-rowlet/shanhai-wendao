/* ============================================================
   山海问道 · 第三章「京城」 · 第二幕 · 闭关结丹 — on the cushion in 四方馆's back courtyard you take the 结丹丹 and go in.
   心魔: in the dark, the people who matter most come one by one, each says the thing you are most afraid to hear, turns
   and walks away — 云游子, your sect's master, 大师兄, 二师兄, 大师姐, 苏小棠, 顾长歌 (one more line if in chapter two you
   looked into the broken mirror and saw yourself alone). Then it takes your own shape and fights you; near the end the
   real voices come from outside. Then the 雷劫, harder than 筑基's: five waves. 结丹初期. And that night the whole
   capital sees thunder over the west of the city; on the highest roof in the east someone stands with a red-headed wolf
   and watches the clouds a long time.
   ============================================================ */
const JD={
  // who leaves, and what each of them says
  people:()=>{ const m=SECTS[S.sect].master; return [
    {name:'云游子', look:LOOK_YUNYOU, line:'为师要云游去了。这一回，你不必再等。'},
    {name:m.name, look:m.look, line:'宗门不缺你一个。走吧。'},
    {name:'陆正衡', look:LOOK_LU, line:'……你来晚了。'},
    {name:'何满仓', look:LOOK_MAN, line:'北边的事，你帮不上忙的。我跟顾兄走了。'},
    {name:'谢霁月', look:LOOK_XIE, line:'我一个人，也能拿头名。'},
    {name:'苏小棠', look:LOOK_TANG, line:S.sect==='dan'?'师兄师姐都说你不行……我、我也觉得。':'我看错你了。'},
    {name:'顾长歌', look:LOOK_GE, line:'你和那些宗门的人，有什么不一样？'}]; },
  void:(g,W,H,R)=>{ g.fillStyle='#07060c'; g.fillRect(0,0,W,H); const rg=g.createRadialGradient(W*.42,H*.72,0,W*.42,H*.72,W*.6); rg.addColorStop(0,'rgba(80,60,110,.35)'); rg.addColorStop(1,'rgba(10,8,16,0)'); g.fillStyle=rg; g.fillRect(0,0,W,H);
    g.fillStyle='rgba(120,100,150,.18)'; g.fillRect(0,H*.86,W,H*.004); for(let k=0;k<40;k++){ g.fillStyle=`rgba(160,140,200,${R()*.25})`; g.fillRect(R()*W,H*(.2+R()*.6),1,R()*H*.05); } },
};
BEASTS.c3_xinmo={name:'心魔 · 独影', self:true, selfMul:{hp:5, atk:1.05, def:1}, boss:true, hp:1500, atk:38, def:10, exp:0, stones:[0,0], moves:['atk','charm','atk','charge','big'],
  lore:'结丹时的心魔。它变成你最怕的样子：一个人站在空地上，所有人都走了。'};

/* ---------- the cushion ---------- */
JD.futon=()=>{ if(S.flags.c3_jd_done) return meditate();
  if(!count(S,'c3_jiedan')) return UI.say([['旁白','后院僻静，一块太湖石，一个蒲团。']]);
  UI.say([...(S.flags.c3_jd_tried?[['谢霁月','（她坐在月洞门的门槛上，剑横在膝头）……再来。我还在。']]:[
      ['谢霁月','（她在月洞门的门槛上坐下，剑横在膝头）我在外面。'],['谢霁月','谁也进不来。'],['苏小棠','（她趴在墙头上，只露出半个脑袋）……我、我也在！']]),
    {choice:'服下结丹丹，闭关吗？（将面对心魔与雷劫）', options:[{text:'闭关', fn:()=>JD.begin()},{text:'再等等', fn:()=>{}}]}]); };
JD.begin=()=>{ S.flags.c3_jd_tried=true; const P=JD.people(), lines=[
    ['旁白','你服下结丹丹，盘膝坐下。'],['旁白','药力像一团火，从丹田一路烧上来。周围的声音一点一点地远了。'],
    {run:()=>{ PixCG.open({ink:JD.void, cast:[{who:'me', x:.24, pose:'stand', face:1}], title:'心魔', small:'第三章 · 结丹', seed:7301}); }},
    ['旁白','……一片黑。'],['旁白','有人从黑暗里走过来。']];
  for(const p of P) lines.push(
    {run:()=>{ const c=PixCG.cur; if(!c) return; CG.lines=1; c.st=[]; c.cast=[{who:'me', x:.24, pose:'stand', face:1},{look:p.look, x:.62, pose:'stand', beats:[{at:0, x:.62, face:-1},{at:1, x:1.25, face:1}]}]; }},
    [p.name, p.line],
    {run:()=>{ CG.lines=2; }},
    ['旁白',`${p.name}转过身，走了。`]);
  lines.push({run:()=>{ const c=PixCG.cur; if(c){ c.st=[]; c.cast=[{who:'me', x:.24, pose:'stand', face:1}]; } CG.lines=0; }},
    ['旁白','黑暗里，只剩下你一个人。'],
    ...(S.flags.c2_mc_looked?[['我','（……和那面碎镜子里一模一样。）'],['我','（台阶上，只剩我一个。）']]:[]),
    ['心魔','（它从你自己的影子里站起来，长着你的脸）你看。'],['心魔','他们都走了。'],['心魔','从来都是这样。你对谁好，谁就会走。'],
    {run:()=>{ PixCG.close(); CG.lines=0; }});
  UI.say(lines,()=>Battle.start('c3_xinmo',r=>JD.after(r))); };
// in the fight it talks between your blows; near the end the real voices come in from outside
{ const _et=Battle.enemyTurn; Battle.enemyTurn=function(){ const s=Battle.s; if(!s||s.kind!=='c3_xinmo'||Dodge.auto) return _et.call(Battle);
    s.jt=(s.jt||0)+1; let L=null;
    if(!s.voices&&s.hp<=s.max*.4){ s.voices=true; L=[['谢霁月','（很远很远的地方）……我在。'],['苏小棠','{名}！我们都在外面！'],['我','（……她们没有走。）']]; }
    else if(s.jt%2===0) L=[[['心魔','你以为结了丹，他们就会留下？']],[['心魔','大师兄等过你。你没有来。']],[['心魔','你救不了任何人。']],[['心魔','一个人，多清静。']]][(s.jt/2-1)%4];
    if(!L||s.talking) return _et.call(Battle); s.talking=true; s.busy=true; Battle.ui();
    return QQLU.talk(L,()=>{ s.talking=false; if(Battle.s!==s||s.dead) return; s.busy=false; _et.call(Battle); }); }; }

/* ---------- after the fight: the 雷劫 ---------- */
JD.after=r=>{ if(r!=='win'){ S.hp=Math.max(1,S.hp); return UI.say([['旁白','心魔的笑声在耳边回荡。你从入定里惊醒，一身冷汗。'],['旁白','结丹丹的药力还在丹田里，没有散。'],['谢霁月','（她还坐在门槛上）……歇一歇，再来。']]); }
  UI.say([['心魔','（它的脸裂开了，像一面碎掉的镜子）……'],['旁白','心魔散了。黑暗里亮起一点光。'],['旁白','可是头顶上，四方馆的上空，雷云已经压下来了。'],['谢霁月','（她站起来，拔出了剑）……来了。']],
    ()=>Mini.tribulation(ok=>{ if(!ok){ S.hp=Math.max(1,Math.round(stats().hp*.3)); UI.hud(); return UI.say([['旁白','最后一道雷劈下来，你眼前一黑。'],['苏小棠','{名}！{名}！'],['旁白','你被拖出了后院。结丹丹的药力还在，下回再来。']]); }
      JD.done(); }, {waves:5, warn:.75, gap:1.85, title:'雷劫', failText:'雷劫未过……结丹丹的药力还在，养好伤再来。'})); };
JD.done=()=>{ addItem('c3_jiedan',-1); S.L=Math.max(S.L,13); S.exp=0; const st=stats(); S.hp=st.hp; S.mp=st.mp; Sound.levelup(); UI.banner('结丹成功！'+realmName(S.L)); UI.hud(); save();
  UI.say([
    ['旁白','雷云散了。后院的地上焦黑一片，太湖石被劈掉了一个角。只有你坐着的蒲团，干干净净的。'],
    ['旁白','丹田里，那团火凝成了一颗珠子，慢慢地转。'],
    ['苏小棠','（她从墙头上跳下来，差点摔一跤，扑过来抱住你）你结丹了！你结丹了！'],
    ['苏小棠','（她哭得一脸黑灰）吓死我了……吓死我了……'],
    ['谢霁月','（她把剑收回鞘里，站在月洞门口，看了你很久）……'],
    ['谢霁月','结丹初期。'],
    ['谢霁月','现在，你和我当年一样了。'],
    {flag:'c3_jd_done'},
    {run:()=>JD.cg()},
    ['旁白','那一夜，整个京城的人都看见了。'],
    ['旁白','城西的天上，雷一道一道地往下劈，劈了足足一炷香。'],
    ['旁白','城东，最高的那座角楼的檐角上，站着一个人。'],
    ['旁白','他身边蹲着一只狼。狼的头，是红的。'],
    ['旁白','他看着那片雷云，看了很久。'],
    ['旁白','雷停了。他转身，从檐角上跳了下去。'],
    {run:()=>PixCG.close()},
    ['旁白',`（${realmName(S.L)}。离大比，还有几天。）`]],()=>{ UI.hud(); Story.check(); }); };

/* ---------- 插画「雷云」: the capital at night under the thunder, and someone on a roof in the east ---------- */
JD.cg=function(){
  PixCG.open({ink:(g,W,H,R)=>{ Land.sky(g,W,H,['#06060c','#10101e','#1c1a30','#2a2640','#3a3450']);
      // the clouds over the west of the city, lit from inside
      for(let k=0;k<26;k++){ const cx=W*(.05+R()*.45), cy=H*(.12+R()*.18), rx=W*(.06+R()*.08); const cg=g.createRadialGradient(cx,cy,0,cx,cy,rx); cg.addColorStop(0,`rgba(${150+R()*40|0},${150+R()*40|0},${200+R()*40|0},.32)`); cg.addColorStop(1,'rgba(40,40,70,0)'); g.fillStyle=cg; g.fillRect(cx-rx,cy-rx,rx*2,rx*2); }
      // the bolts, forking down onto the roofs of the west
      for(const [x0,len] of [[.22,.5],[.3,.44],[.14,.4]]){ let x=W*x0, y=H*.22; g.strokeStyle='rgba(230,236,255,.9)'; g.lineWidth=Math.max(2,W*.003); g.beginPath(); g.moveTo(x,y);
        while(y<H*(.22+len)){ x+=(R()-.5)*W*.03; y+=H*(.03+R()*.03); g.lineTo(x,y); if(R()<.25){ g.stroke(); g.beginPath(); g.moveTo(x,y); } } g.stroke();
        const gl=g.createRadialGradient(x,y,0,x,y,W*.12); gl.addColorStop(0,'rgba(200,210,255,.45)'); gl.addColorStop(1,'rgba(200,210,255,0)'); g.fillStyle=gl; g.fillRect(0,0,W,H); }
      // the capital's roofs, row on row, black; a few windows lit
      for(const [base,col,n] of [[.72,'#141420',34],[.8,'#0e0e18',26],[.9,'#09090f',18]]){ g.fillStyle=col; g.beginPath(); g.moveTo(0,H);
        for(let k=0;k<=n;k++){ const x=W*k/n, w=W/n, y=H*(base-R()*.03); g.lineTo(x,y+H*.01); g.lineTo(x+w*.15,y); g.lineTo(x+w*.85,y); g.lineTo(x+w,y+H*.01); } g.lineTo(W,H); g.closePath(); g.fill();
        for(let k=0;k<n*.6;k++){ g.fillStyle=`rgba(255,${180+R()*40|0},110,${.3+R()*.4})`; g.fillRect(R()*W,H*(base+.02+R()*.05),Math.max(1,W*.003),Math.max(1,H*.004)); } }
      // the corner tower in the east: tiered roofs, eaves turned up, black against the sky
      const tx=W*.8, tb=H*.74; g.fillStyle='#08080e'; g.fillRect(tx-W*.035,tb-H*.22,W*.07,H*.22);
      for(const [y,w] of [[.2,.11],[.3,.085],[.38,.06]]){ const yy=tb-H*y; g.beginPath(); g.moveTo(tx-W*w,yy+H*.012); g.quadraticCurveTo(tx-W*w*.6,yy,tx,yy-H*.035); g.quadraticCurveTo(tx+W*w*.6,yy,tx+W*w,yy+H*.012); g.lineTo(tx+W*w*.7,yy+H*.02); g.lineTo(tx-W*w*.7,yy+H*.02); g.closePath(); g.fill(); }
      g.strokeStyle='rgba(170,176,230,.4)'; g.lineWidth=Math.max(1,W*.0015); g.beginPath(); g.moveTo(tx-W*.11,tb-H*.188); g.quadraticCurveTo(tx-W*.066,tb-H*.2,tx,tb-H*.235); g.stroke();
      C3A.wolf(g,tx-W*.07,tb-H*.2,H*.05,-1,R); },
    cast:[{get cv(){ return C3A.sil(LOOK_XIAO,'stand'); }, x:.755, y:.43, s:.6, face:-1}],
    title:'雷云', small:'第三章 · 结丹', seed:7302}); };

/* ---------- the quests ---------- */
{ const q=QUESTS.find(q=>q.id==='c3i'); Object.assign(q,{check:s=>!!s.flags.c3_jd_done,
    progress:s=>!count(s,'c3_jiedan')&&!s.flags.c3_jd_done?'（结丹丹不见了）':s.flags.c3_jd_tried?'在后院的蒲团上，再试一次':'在后院的蒲团上闭关：心魔、雷劫', target:s=>['jc_sifang',6,19,'蒲团']}); }
QUESTS.splice(QUESTS.findIndex(q=>q.id==='c3i')+1,0,
  {id:'c3j', title:'大比之前', desc:'结丹了。离大比还有几天。京城还有很多地方没有去过。', check:s=>false,
    progress:s=>'在京城走走（之后的地图正在做）', target:s=>['jc_sifang',12,10,'大师姐']});
