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
BEASTS.c3_xinmo={name:'心魔 · 独影', self:true, selfMul:{hp:2.6, atk:.95, def:1}, boss:true, hp:1500, atk:38, def:10, exp:0, stones:[0,0], moves:['atk','charm','atk','charge','big'],
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
// after a lost 心魔 fight, 大师姐 says what to do next: guard on its warnings, where pills are sold, and — if you're short — where to earn
JD.loseTips=()=>{ const L=[], pills=count(S,'huichun'), F=S.flags, cheap=50;
  L.push(['谢霁月','它要「心神一荡」、要蓄力重击的时候，你看得出来的。那一下，护体。']);
  if(pills<2){ L.push(['谢霁月',`身上${pills?'只剩一颗':'一颗'}回春丹${pills?'':'都没有'}？朱雀大街的回春堂，柜台后面的掌柜卖，五十灵石一颗。当铺也有，贵一点。`]);
    if(S.stones<cheap*2){ const w=[];
      if(F.c3_hc_ru) w.push('回春堂的孙大夫每天缺人抓药'); w.push('西市琅琊阁的阁主要人抄书，一天一回');
      w.push('四方馆里别的宗门的人，每天都能找他们切磋，赢了有彩头');
      w.push('护城河边的船家借钓竿，钓上来的鱼当铺按原价收');
      L.push(['谢霁月',`钱不够的话——${w.join('；')}。`]); L.push(['旁白',`（你有 ${S.stones} 灵石。回春丹在回春堂 50 一颗。）`]); } }
  L.push(['谢霁月','结丹丹的药力散不了。准备好了，再来。']); return L; };
JD.after=r=>{ if(r!=='win'){ S.hp=Math.max(1,S.hp); return UI.say([['旁白','心魔的笑声在耳边回荡。你从入定里惊醒，一身冷汗。'],['旁白','结丹丹的药力还在丹田里，没有散。'],['谢霁月','（她还坐在门槛上）……歇一歇，再来。'],...JD.loseTips()]); }
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
  JD.feet=JD.feet||[.74,.4]; PixCG.open({ink:(g,W,H,R)=>JD.paint(g,W,H,R), cast:[{get cv(){ return C3A.sil(LOOK_XIAO,'stand'); }, get x(){ return JD.feet[0]; }, get y(){ return JD.feet[1]; }, s:.26, face:-1}], title:'雷云', small:'第三章 · 结丹', seed:7302}); };
// painted in ink like the other chapter-3 pictures: the storm piled over the west of the city, bolts forking down onto the
// roofs there; the rest of the capital lit up — 朱雀大街 a river of lanterns running to the gate; and in the east, on the
// city wall, the corner tower, three tiers of upturned eaves. On the topmost eave stands 萧烬 (silver hair loose in the
// wind, black robe), his red-headed wolf sitting beside him, both edged with the lightning's light.
JD.paint=(g,W,H,R)=>{ const M=Math.min(W,H), HZ=H*.6;
  Land.paper(g,W,H,R,'#c9c6cf');
  Land.sky(g,W,H,['rgba(8,8,20,.96)','rgba(18,18,40,.92)','rgba(40,32,60,.86)','rgba(22,18,30,.94)','rgba(12,10,18,.97)']);
  // the warm haze the city throws up into the low sky, strongest over the middle and the east
  for(const [x,r,a] of [[.5,.5,.32],[.78,.34,.26],[.3,.3,.14]]){ const gr=g.createRadialGradient(W*x,HZ,0,W*x,HZ,W*r); gr.addColorStop(0,`rgba(255,170,90,${a})`); gr.addColorStop(1,'rgba(255,170,90,0)'); g.fillStyle=gr; g.fillRect(0,0,W,H); }
  // the storm: a heap of cloud over the west, ink washes, the undersides lit violet-white from inside
  const cl=(x,y,rx,ry,c,a)=>{ const gr=g.createRadialGradient(x,y,0,x,y,rx); gr.addColorStop(0,`rgba(${c},${a})`); gr.addColorStop(1,`rgba(${c},0)`); g.save(); g.translate(x,y); g.scale(1,ry/rx); g.translate(-x,-y); g.fillStyle=gr; g.fillRect(x-rx,y-rx,rx*2,rx*2); g.restore(); };
  for(let k=0;k<40;k++){ const u=R(); cl(W*(-.05+u*.75),H*(.04+R()*.2+u*.06),W*(.08+R()*.12),H*(.05+R()*.06),`${6+R()*10|0},${6+R()*10|0},${16+R()*12|0}`,.5+R()*.35); }
  for(let k=0;k<26;k++){ const u=R(); cl(W*(.04+u*.5),H*(.2+R()*.1),W*(.05+R()*.08),H*(.025+R()*.03),`${150+R()*50|0},${150+R()*40|0},${210+R()*40|0}`,.16+R()*.2); }
  // far off: the western hills, just a darker line under the storm
  Land.peaks(g,W,H,R,{y:HZ-H*.02,amp:H*.05,n:6,a:.4,tint:'#14142a'});
  // the bolts: jagged, forking, each with a glow; where they land the roofs flare
  const bolt=(x0,y0,x1,y1,w,depth)=>{ const pts=[[x0,y0]], n=9+depth*2; for(let i=1;i<n;i++){ const u=i/n; pts.push([x0+(x1-x0)*u+(R()-.5)*W*.05*(1-u*.4), y0+(y1-y0)*u+(R()-.5)*H*.012]); } pts.push([x1,y1]);
    const line=(lw,col,blur)=>{ g.save(); g.shadowColor='rgba(170,180,255,.95)'; g.shadowBlur=blur; g.strokeStyle=col; g.lineWidth=lw; g.lineJoin='miter'; g.beginPath(); pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y)); g.stroke(); g.restore(); };
    line(w*4,'rgba(150,160,255,.18)',M*.06); line(w*1.8,'rgba(200,205,255,.55)',M*.025); line(w,'rgba(250,250,255,.98)',M*.01);
    if(depth>0) for(let i=2;i<pts.length-2;i++) if(R()<.18){ const [bx,by]=pts[i], dir=R()<.5?-1:1; bolt(bx,by,bx+dir*W*(.04+R()*.08),by+H*(.06+R()*.12),w*.55,depth-1); } };
  const hits=[[.2,.62],[.33,.64],[.1,.6]];
  hits.forEach(([hx,hy],i)=>{ const x0=W*(hx+(R()-.5)*.08); bolt(x0,H*(.1+R()*.05),W*hx,H*hy,Math.max(2.5,W*(.0045-i*.001)),2);
    const gl=g.createRadialGradient(W*hx,H*hy,0,W*hx,H*hy,W*.16); gl.addColorStop(0,'rgba(215,220,255,.55)'); gl.addColorStop(.3,'rgba(170,180,255,.22)'); gl.addColorStop(1,'rgba(170,180,255,0)'); g.fillStyle=gl; g.fillRect(0,0,W,H); });
  const flash=g.createRadialGradient(W*.22,H*.24,0,W*.22,H*.24,W*.45); flash.addColorStop(0,'rgba(220,225,255,.22)'); flash.addColorStop(1,'rgba(220,225,255,0)'); g.fillStyle=flash; g.fillRect(0,0,W,H);
  // the city wall far off, with the gate tower over 朱雀门 where the avenue ends
  g.fillStyle=SUMI.ink(.78); g.fillRect(0,HZ-H*.012,W,H*.03); for(let x=0;x<W;x+=W*.012) g.fillRect(x,HZ-H*.02,W*.007,H*.01);
  { const gx=W*.5, gy=HZ-H*.012; g.fillStyle=SUMI.ink(.85); g.fillRect(gx-W*.03,gy-H*.03,W*.06,H*.03); Land.roof(g,gx,gy-H*.034,W*.085,H*.022,.9); Land.roof(g,gx,gy-H*.056,W*.06,H*.018,.9);
    for(const dx of [-.022,0,.022]){ const lg=g.createRadialGradient(gx+W*dx,gy-H*.015,0,gx+W*dx,gy-H*.015,W*.012); lg.addColorStop(0,'rgba(255,190,110,.9)'); lg.addColorStop(1,'rgba(255,190,110,0)'); g.fillStyle=lg; g.fillRect(gx+W*dx-W*.012,gy-H*.027,W*.024,H*.024); } }
  // the roofs of the capital, row on row toward you, windows lit — more of them to the east and in the middle
  const row=(y,s,n,a,litP)=>{ for(let k=0;k<n;k++){ const x=W*(k+.5)/n+(R()-.5)*W*.03, w=s*(1+R()*.5), h=s*.34, yy=y+(R()-.5)*s*.12, warm=x/W>.4;
      if(Math.abs(x-W*.5)<w*.55+W*(.012+.13*Math.max(0,(yy-HZ)/(H-HZ)))) continue;      // leave the avenue open: no roof may reach over it
      g.fillStyle=SUMI.ink(a*.95); g.fillRect(x-w*.42,yy+h*.2,w*.84,s*.9); Land.roof(g,x,yy,w,h,a);
      const nw=1+(R()*2|0); for(let j=0;j<nw;j++) if(R()<litP*(warm?1.3:.7)){ const wx=x+(R()-.5)*w*.55, wy=yy+h*.55+R()*s*.25, ww=Math.max(2,s*.09), wh=Math.max(2,s*.12);
        const lg=g.createRadialGradient(wx,wy,0,wx,wy,s*.35); lg.addColorStop(0,'rgba(255,180,90,.5)'); lg.addColorStop(1,'rgba(255,180,90,0)'); g.fillStyle=lg; g.fillRect(wx-s*.35,wy-s*.35,s*.7,s*.7);
        g.fillStyle=`rgba(255,${200+R()*30|0},${120+R()*30|0},.95)`; g.fillRect(wx-ww/2,wy-wh/2,ww,wh); } } };
  row(HZ+H*.025,W*.028,40,.62,.55); row(HZ+H*.06,W*.036,32,.68,.6);
  // 朱雀大街: a straight avenue from the gate down toward you, lanterns strung along both sides, the paving glowing
  { const pg=g.createLinearGradient(0,HZ,0,H); pg.addColorStop(0,'rgba(255,170,90,.55)'); pg.addColorStop(1,'rgba(200,120,60,.28)'); g.fillStyle=pg;
    g.beginPath(); g.moveTo(W*.5-W*.006,HZ+H*.005); g.lineTo(W*.5+W*.006,HZ+H*.005); g.lineTo(W*.63,H); g.lineTo(W*.37,H); g.closePath(); g.fill();
    for(let i=0;i<40;i++){ const t=(i/40)**1.7, y=HZ+H*.008+(H-HZ)*t*.95; for(const sd of [-1,1]){ const x=W*.5+sd*(W*.008+W*.12*t), r=Math.max(1.5,W*.0022+W*.006*t);
        const lg=g.createRadialGradient(x,y,0,x,y,r*4.5); lg.addColorStop(0,'rgba(255,150,80,.55)'); lg.addColorStop(1,'rgba(255,150,80,0)'); g.fillStyle=lg; g.fillRect(x-r*4.5,y-r*4.5,r*9,r*9);
        g.fillStyle='#e8503a'; g.beginPath(); g.ellipse(x,y,r*.8,r,0,0,Math.PI*2); g.fill(); g.fillStyle='rgba(255,220,150,.9)'; g.fillRect(x-r*.25,y-r*.4,r*.5,r*.5); } }
    for(let i=0;i<70;i++){ const t=R()**1.5, y=HZ+H*.01+(H-HZ)*t*.95, x=W*.5+(R()-.5)*W*.22*t; g.fillStyle=SUMI.ink(.55); g.fillRect(x,y-H*.012*t,Math.max(1,W*.003*t),Math.max(1,H*.012*t)); } }   // people in the street
  row(HZ+H*.1,W*.05,24,.76,.5); row(HZ+H*.16,W*.068,17,.84,.45); row(HZ+H*.25,W*.095,12,.92,.4);
  // the east wall in front, and on it the corner tower
  const wy=H*.8; g.fillStyle=SUMI.ink(.95); g.beginPath(); g.moveTo(W*.56,wy+H*.03); g.lineTo(W*1.02,wy-H*.02); g.lineTo(W*1.02,H); g.lineTo(W*.52,H); g.closePath(); g.fill();
  for(let i=0;i<=22;i++){ const u=i/22, x=W*.56+(W*.46)*u, y=wy+H*.03-H*.05*u; g.fillRect(x,y-H*.018,W*.011,H*.02); }
  g.strokeStyle='rgba(190,196,240,.22)'; g.lineWidth=Math.max(1,W*.0012); for(let i=1;i<7;i++){ g.beginPath(); g.moveTo(W*.56,wy+H*.03+i*H*.025); g.lineTo(W*1.02,wy-H*.02+i*H*.025); g.stroke(); }
  JD.tower(g,W,H,R,W*.8,wy-H*.006); };
// the corner tower: a stone base, two storeys of posts and railings with lit windows, three tiers of roofs whose eave
// corners sweep up into points, lanterns hung at the corners, a rim of cold light along the side facing the storm
JD.tower=(g,W,H,R,cx,base)=>{ const ink=a=>SUMI.ink(a), U=W*.01;
  const eave=(y,w,h,a)=>{ g.fillStyle=ink(a); g.beginPath(); g.moveTo(cx-w,y-h*1.1); g.quadraticCurveTo(cx-w*.82,y+h*.2,cx-w*.55,y+h*.25); g.lineTo(cx+w*.55,y+h*.25); g.quadraticCurveTo(cx+w*.82,y+h*.2,cx+w,y-h*1.1);
      g.quadraticCurveTo(cx+w*.8,y-h*.15,cx+w*.5,y-h*.55); g.lineTo(cx+w*.28,y-h*1.6); g.lineTo(cx-w*.28,y-h*1.6); g.lineTo(cx-w*.5,y-h*.55); g.quadraticCurveTo(cx-w*.8,y-h*.15,cx-w,y-h*1.1); g.fill();
    g.strokeStyle='rgba(225,228,255,.45)'; g.lineWidth=Math.max(1.5,U*.25); g.beginPath(); g.moveTo(cx-w,y-h*1.1); g.quadraticCurveTo(cx-w*.8,y-h*.15,cx-w*.5,y-h*.55); g.lineTo(cx-w*.28,y-h*1.6); g.stroke();   // lightning catches the west slope
    g.strokeStyle='rgba(200,190,170,.18)'; g.lineWidth=1; for(let i=-8;i<=8;i++){ g.beginPath(); g.moveTo(cx+i*w*.03,y-h*1.5); g.lineTo(cx+i*w*.065,y+h*.15); g.stroke(); }
    brush(g,[[cx-w*.55,y+h*.25],[cx+w*.55,y+h*.25]],Math.max(2,h*.18),.95);
    for(const sd of [-1,1]){ const lx=cx+sd*w*.62, ly=y+h*.75, r=U*.55; g.strokeStyle=ink(.8); g.lineWidth=1; g.beginPath(); g.moveTo(lx,y+h*.2); g.lineTo(lx,ly-r); g.stroke();
      const lg=g.createRadialGradient(lx,ly,0,lx,ly,r*5); lg.addColorStop(0,'rgba(255,160,80,.6)'); lg.addColorStop(1,'rgba(255,160,80,0)'); g.fillStyle=lg; g.fillRect(lx-r*5,ly-r*5,r*10,r*10);
      g.fillStyle='#d8442e'; g.beginPath(); g.ellipse(lx,ly,r*.85,r,0,0,Math.PI*2); g.fill(); g.fillStyle='rgba(255,220,150,.9)'; g.fillRect(lx-r*.3,ly-r*.45,r*.6,r*.5); } };
  const storey=(y0,y1,w)=>{ g.fillStyle=ink(.9); g.fillRect(cx-w,y1,w*2,y0-y1);
    for(let i=0;i<=6;i++){ const x=cx-w+i*w/3; g.fillStyle=ink(1); g.fillRect(x-U*.12,y1,U*.24,y0-y1); }
    for(let i=0;i<6;i++){ const x=cx-w+(i+.5)*w/3, wy=y1+(y0-y1)*.28, ww=w/3*.62, wh=(y0-y1)*.42;
      g.fillStyle=i===1||i===4?'rgba(255,186,100,.9)':'rgba(255,186,100,.35)'; g.fillRect(x-ww/2,wy,ww,wh); g.strokeStyle=ink(.9); g.lineWidth=Math.max(1,U*.08); for(let k=1;k<4;k++){ g.beginPath(); g.moveTo(x-ww/2+ww*k/4,wy); g.lineTo(x-ww/2+ww*k/4,wy+wh); g.stroke(); } }
    g.fillStyle=ink(1); g.fillRect(cx-w*1.06,y0-(y0-y1)*.16,w*2.12,U*.25); for(let i=0;i<=14;i++) g.fillRect(cx-w*1.06+i*w*2.12/14,y0-(y0-y1)*.16,U*.1,(y0-y1)*.16); };
  g.fillStyle=ink(.97); g.beginPath(); g.moveTo(cx-U*9,base); g.lineTo(cx-U*8,base-U*4); g.lineTo(cx+U*8,base-U*4); g.lineTo(cx+U*9,base); g.closePath(); g.fill();
  const b=base-U*4; storey(b,b-U*5.2,U*6); eave(b-U*5.2,U*11,U*1.4,.97); storey(b-U*6.6,b-U*10.6,U*4.6); eave(b-U*10.6,U*8.6,U*1.2,.97);
  g.fillStyle=ink(.95); g.fillRect(cx-U*3,b-U*14,U*6,U*2.6); eave(b-U*14,U*6.4,U*1.1,.98);
  g.fillStyle=ink(1); g.fillRect(cx-U*.25,b-U*16.4,U*.5,U*1.2); g.beginPath(); g.arc(cx,b-U*16.6,U*.45,0,Math.PI*2); g.fill();     // the finial
  // 萧烬 on the west tip of the top eave, the wolf crouched on the slope beside him
  const fx=cx-U*5.6, fy=b-U*15.1; JD.feet=[fx/W, fy/H]; C3A.wolf(g,fx+U*2.4,fy+U*.4,U*2.2,-1,R); };
// a standing figure in ink, ~h tall, feet at (x,y): a slim man in a long black robe, sash at the waist, the hem and one
// sleeve streaming east in the storm wind, long loose silver hair blown out behind him; lit along the west edge
JD.figure=(g,x,y,h,R)=>{ const P=(u,v)=>[x+u*h,y+v*h], path=(pts)=>{ g.beginPath(); pts.forEach(([u,v],i)=>{ const [px,py]=P(u,v); i?g.lineTo(px,py):g.moveTo(px,py); }); g.closePath(); };
  const curve=(pts)=>{ g.beginPath(); const [x0,y0]=P(...pts[0]); g.moveTo(x0,y0); for(let i=1;i<pts.length-1;i++){ const [ax,ay]=P(...pts[i]), [bx,by]=P(...pts[i+1]); g.quadraticCurveTo(ax,ay,(ax+bx)/2,(ay+by)/2); } const [lx,ly]=P(...pts[pts.length-1]); g.lineTo(lx,ly); g.closePath(); };
  g.fillStyle=SUMI.ink(1);
  // the robe: shoulders, a narrow waist, the skirt flaring and torn out east by the wind
  curve([[-.035,-.83],[-.11,-.8],[-.1,-.66],[-.07,-.5],[-.09,-.25],[-.12,0],[-.04,.01],[.06,-.01],[.16,.0],[.27,-.04],[.4,-.1],[.3,-.12],[.36,-.18],[.2,-.2],[.12,-.32],[.07,-.5],[.1,-.66],[.11,-.8],[.035,-.83]]); g.fill();
  // the sleeves: the west one hangs, the east one streams out
  curve([[-.1,-.79],[-.15,-.62],[-.16,-.46],[-.12,-.42],[-.1,-.5],[-.08,-.66]]); g.fill();
  curve([[.1,-.79],[.2,-.72],[.33,-.66],[.44,-.64],[.34,-.6],[.38,-.56],[.22,-.57],[.1,-.62]]); g.fill();
  // neck and head
  path([[-.025,-.86],[.025,-.86],[.03,-.8],[-.03,-.8]]); g.fill();
  g.beginPath(); g.ellipse(x,y-h*.9,h*.05,h*.062,0,0,Math.PI*2); g.fill();
  // the sash, a little lighter, its ends flying
  g.strokeStyle='rgba(120,116,130,.9)'; g.lineWidth=Math.max(1,h*.018); g.beginPath(); g.moveTo(...P(-.075,-.52)); g.lineTo(...P(.075,-.52)); g.stroke();
  g.lineWidth=Math.max(1,h*.012); g.beginPath(); g.moveTo(...P(.07,-.52)); g.quadraticCurveTo(...P(.18,-.5),...P(.28,-.44)); g.stroke(); g.beginPath(); g.moveTo(...P(.07,-.51)); g.quadraticCurveTo(...P(.16,-.46),...P(.24,-.38)); g.stroke();
  // silver hair: a cap over the crown, then long strands streaming east, each a tapering brush line
  g.fillStyle='rgba(212,216,226,.96)'; g.beginPath(); g.ellipse(x+h*.006,y-h*.925,h*.052,h*.045,0,Math.PI,Math.PI*2); g.fill();
  for(let i=0;i<11;i++){ const v0=-.94+i*.012, sx=.02+R()*.02, ex=.26+i*.022+R()*.06, ev=-.98+i*.035+(R()-.5)*.03, mv=(v0+ev)/2-.04-R()*.03;
    const w0=h*(.016-i*.0009);
    g.strokeStyle=`rgba(${205+R()*25|0},${210+R()*20|0},${222+R()*20|0},${.75+R()*.2})`; g.lineCap='round';
    for(const [t0,t1,lw] of [[0,.45,w0],[.4,.8,w0*.65],[.75,1,w0*.35]]){ g.lineWidth=Math.max(1,lw); g.beginPath();
      const q=(t)=>{ const a=(1-t)*(1-t), b=2*(1-t)*t, c=t*t; return [x+h*(a*sx+b*(sx+ex)*.5+c*ex), y+h*(a*v0+b*mv+c*ev)]; };
      g.moveTo(...q(t0)); for(let k=1;k<=6;k++) g.lineTo(...q(t0+(t1-t0)*k/6)); g.stroke(); } }
  // the storm's light along his west edge
  g.strokeStyle='rgba(200,208,255,.8)'; g.lineWidth=Math.max(1,h*.012); g.beginPath(); g.moveTo(...P(-.12,0)); g.quadraticCurveTo(...P(-.09,-.25),...P(-.07,-.5)); g.quadraticCurveTo(...P(-.1,-.66),...P(-.11,-.8)); g.stroke();
  g.beginPath(); g.moveTo(...P(-.15,-.62)); g.lineTo(...P(-.16,-.46)); g.stroke();
  g.beginPath(); g.arc(x,y-h*.9,h*.055,Math.PI*.65,Math.PI*1.3); g.stroke(); };
// a sitting wolf in ink, s tall at the shoulder, feet at (x,y), facing west at the storm: deep chest, straight forelegs,
// the haunch folded under, a heavy tail laid along the roof; its head red, one eye catching the light
JD.wolf=(g,x,y,s,R)=>{ const P=(u,v)=>[x+u*s,y+v*s];
  const curve=(pts)=>{ g.beginPath(); g.moveTo(...P(...pts[0])); for(let i=1;i<pts.length-1;i++){ const [ax,ay]=P(...pts[i]), [bx,by]=P(...pts[i+1]); g.quadraticCurveTo(ax,ay,(ax+bx)/2,(ay+by)/2); } g.lineTo(...P(...pts[pts.length-1])); g.closePath(); };
  g.fillStyle=SUMI.ink(1);
  curve([[.5,0],[.62,-.2],[.55,-.48],[.32,-.72],[.12,-.95],[-.05,-1.0],[-.2,-.9],[-.22,-.6],[-.2,-.3],[-.24,0],[-.14,0],[-.12,-.3],[-.06,-.25],[-.04,0],[.1,0]]); g.fill();   // body, chest, forelegs
  curve([[.45,-.02],[.75,.02],[1.0,-.05],[1.15,-.16],[1.05,-.1],[.8,-.1],[.55,-.12]]); g.fill();                                               // the tail
  // the head: skull, ears, the long muzzle — red
  const head=()=>curve([[.04,-.92],[.06,-1.12],[.02,-1.3],[-.04,-1.48],[-.1,-1.28],[-.16,-1.4],[-.2,-1.22],[-.34,-1.18],[-.56,-1.1],[-.55,-1.05],[-.36,-1.0],[-.2,-.9]]);
  head(); g.fillStyle='#a8231a'; g.fill(); g.save(); head(); g.clip(); const sh=g.createLinearGradient(...P(-.5,-1.3),...P(.1,-.9)); sh.addColorStop(0,'rgba(255,90,60,.5)'); sh.addColorStop(1,'rgba(40,0,0,.6)'); g.fillStyle=sh; g.fillRect(...P(-.6,-1.6),s*.8,s*.8); g.restore();
  g.fillStyle='rgba(255,226,140,.98)'; g.beginPath(); g.ellipse(...P(-.22,-1.17),Math.max(1.5,s*.035),Math.max(1,s*.022),-.2,0,Math.PI*2); g.fill();     // the eye
  g.strokeStyle='rgba(200,208,255,.7)'; g.lineWidth=Math.max(1,s*.025); g.beginPath(); g.moveTo(...P(-.24,0)); g.quadraticCurveTo(...P(-.22,-.5),...P(-.2,-.9)); g.stroke(); };

/* ---------- the quests ---------- */
{ const q=QUESTS.find(q=>q.id==='c3i'); Object.assign(q,{check:s=>!!s.flags.c3_jd_done,
    progress:s=>!count(s,'c3_jiedan')&&!s.flags.c3_jd_done?'（结丹丹不见了）':s.flags.c3_jd_tried?'在后院的蒲团上，再试一次':'在后院的蒲团上闭关：心魔、雷劫', target:s=>['jc_sifang',6,19,'蒲团']}); }
QUESTS.splice(QUESTS.findIndex(q=>q.id==='c3i')+1,0,
  {id:'c3j', title:'大比之前', desc:'结丹了。离大比还有几天。京城还有很多地方没有去过。', check:s=>false,
    progress:s=>'在京城走走（之后的地图正在做）', target:s=>['jc_sifang',12,10,'大师姐']});
