/* ============================================================
   山海问道 · 第二章 第四幕「心镜湖」 — the night after the sealing, the 八卦镜 shows 大师姐 alone, the slander she has heard
   scratched across the glass. By morning she is gone, her wet footprints leading east down the stream to a lake as still as a
   mirror. Three ripples on the way show three times the dirt was thrown at her; on the island her reflection stands up out of
   the water: 心魔 · 霁影, fighting with her sword and with words (流言). The fox hair in your pack lights up and 九尾狐 comes —
   feared for three hundred years, never having harmed anyone — and talks the knot loose. 大师姐 smiles. Back at camp,
   二师兄 is gone.
   ============================================================ */
// the fox hair cannot be sold or given away any more: 九尾狐 comes by it
Object.assign(ITEMS.hu_wei, {sell:0, keep:true});

Object.assign(SPR, {
  mj_reeds:['................','..n....n...n....','..n.n..n..nn....','.nn.n.nn..n..n..','.n..nn.n.nn..n..','.n..n..nnn...n..','nn.nn..nn..n.nn.','n..n...n...n.n..','g.gg.g.gg.gg.g..','.ggg.gggggg.ggg.'],
  mj_echo:['................','................','................','................','.....llll.......','...ll....ll.....','..l..wwww..l....','..l.w....w.l....','..l..wwww..l....','...ll....ll.....','.....llll.......'],
  mj_stones:['................','................','................','................','................','................','....eeee........','...eEeeEe.......','....eeee........'],
});

/* ---------- the camp: a way east along the stream (closed by reeds until she is gone), and her footprints ---------- */
{ const m=MAPS.mj_camp, G=m.ground.map(r=>r.split('')); G[13][21]='='; G[13][20]='='; G[14][21]='W'; m.ground=G.map(r=>r.join(''));
  m.exits.push({x:21,y:13,to:'mj_lake',tx:1,ty:8});
  m.objects=m.objects.filter(o=>!((o.type==='pine'||o.type==='tree')&&((o.x===20&&o.y>=12&&o.y<=14)||(o.x===19&&o.y===13))));
  m.objects.push({type:'mj_reeds', x:20, y:13, spr:'mj_reeds', act:'mjreeds', cond:s=>!s.flags.c2_xin_start}); }
// 大师姐 and 二师兄 at camp: she is away while it lasts, he is gone at the end of the act
for(const o of MAPS.mj_camp.objects){ if(o.id==='xie'){ const c=o.cond; o.cond=s=>c(s)&&!(s.flags.c2_xin_start&&!s.flags.c2_xin_done); }
  if(o.id==='man'){ const c=o.cond; o.cond=s=>c(s)&&!s.flags.c2_man_gone; } }
// on the cliff they stand only until you are back at camp
for(const o of MAPS.mj_cliff.objects) if(o.id==='xie'||o.id==='man'){ const c=o.cond; o.cond=s=>c(s)&&!s.flags.c2_qq_sealed; }

/* ---------- 心镜湖: 'L' is the still lake (solid), a stone path out to the island ---------- */
{ const W=24, H=16, G=[...Array(H)].map((_,y)=>[...Array(W)].map((_,x)=>(x===0||y===0||x===W-1||y===H-1)?'W':'L'));
  for(let y=1;y<H-1;y++){ G[y][1]=':'; G[y][2]=y%3?'.':':'; }
  const path=[]; const line=(x0,y0,x1,y1)=>{ for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++) for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++) path.push([x,y]); };
  line(1,8,6,8); line(6,4,6,8); line(6,4,10,4); line(10,4,10,11); line(10,11,14,11); line(14,8,14,11); line(14,8,16,8);
  for(const [x,y] of path) G[y][x]='=';
  for(let y=4;y<=12;y++) for(let x=16;x<=22;x++){ const d=((x-19)/3.6)**2+((y-8)/4.2)**2; if(d<=1) G[y][x]=d>.7?':':'.'; }
  G[8][0]='=';
  const objects=[
    {type:'mj_echo', x:7, y:3, spr:'mj_echo', act:'c2echo', ei:0},
    {type:'mj_echo', x:11, y:8, spr:'mj_echo', act:'c2echo', ei:1},
    {type:'mj_echo', x:13, y:12, spr:'mj_echo', act:'c2echo', ei:2},
    {type:'mj_reeds', x:16, y:8, spr:'mj_reeds', act:'c2fogwall', cond:s=>(s.c2x&&s.c2x.echo||[]).length<3},
    {type:'npc', id:'xie', x:20, y:8, look:LOOK_XIE, name:'谢霁月', act:'talk', cond:s=>!s.flags.c2_xin_done},
    {type:'mj_stones', x:19, y:6, spr:'mj_stones'},{type:'mj_stones', x:21, y:10, spr:'mj_stones'},
    {type:'mj_reeds', x:2, y:3, spr:'mj_reeds'},{type:'mj_reeds', x:1, y:12, spr:'mj_reeds'},{type:'mj_reeds', x:18, y:11, spr:'mj_reeds'},
  ];
  MAPS.mj_lake={ name:'秘境 · 心镜湖', w:W, h:H, ground:G.map(r=>r.join('')), objects, exits:[{x:0,y:8,to:'mj_camp',tx:20,ty:13}] }; }
{ const _tc=tileCanvas; tileCanvas=function(ch,v,frame){ if(ch!=='L') return _tc(ch,v,frame);
    const key=ch+v+(frame||0); if(TILEC[key]) return TILEC[key];
    const c=document.createElement('canvas'); c.width=c.height=TILE; const g=c.getContext('2d'), R=rng(ch.charCodeAt(0)*977+v*131+(frame||0)*7);
    const gr=g.createLinearGradient(0,0,0,16); gr.addColorStop(0,'#1c2436'); gr.addColorStop(1,'#141a28'); g.fillStyle=gr; g.fillRect(0,0,16,16);
    for(let i=0;i<3;i++){ g.fillStyle='rgba(150,170,210,.16)'; g.fillRect((R()*12|0)+((frame||0)?1:0),R()*16|0,3+(R()*5|0),1); }
    if(R()<.25){ g.fillStyle='rgba(240,240,255,.7)'; g.fillRect(R()*15|0,R()*15|0,1,1); }    // a star in the water
    return TILEC[key]=c; }; }
{ const _em=enterMap; enterMap=function(id,x,y){ const r=_em(id,x,y);
    if(id==='mj_lake'){ const m=RT.map; for(let yy=0;yy<m.h;yy++) for(let xx=0;xx<m.w;xx++) if(m.ground[yy][xx]==='L') RT.solid[yy][xx]=true;
      if(!S.flags.c2_lake_in) setTimeout(()=>{ if(RT.mapId==='mj_lake'&&!S.flags.c2_lake_in) UI.say(C2X.arrive()); },350); }
    // back at camp after the lake: 二师兄 is gone
    if(id==='mj_camp'&&S.flags.c2_xin_done&&!S.flags.c2_man_gone) setTimeout(()=>{ if(RT.mapId==='mj_camp'&&!S.flags.c2_man_gone) UI.say(C2X.gone(), ()=>{ enterMap('mj_camp',S.x,S.y); UI.hud(); Story.check(); }); },350);
    return r; }; }
// the lake at night: mist, the moon in the water, and the words people said about her drifting on it
const C2X_WORDS=['狐媚','妖女','靠脸','狐狸精','勾引人','装清高','不检点','祸水','不要脸','靠的什么'];
{ const _r=render; render=function(){ _r(); if(RT.mapId!=='mj_lake'||!RT.map) return;
    const g=ctx, W=cv.width, H=cv.height, Z=RT.scale*RT.dpr, T=TILE*Z, ox=Math.round(-RT.cam.x*Z), oy=Math.round(-RT.cam.y*Z);
    g.fillStyle='rgba(30,26,60,.28)'; g.fillRect(0,0,W,H);
    const mx=ox+12*T, my=oy+6*T, gr=g.createRadialGradient(mx,my,0,mx,my,T*2); gr.addColorStop(0,'rgba(240,236,214,.35)'); gr.addColorStop(1,'rgba(240,236,214,0)'); g.fillStyle=gr; g.fillRect(mx-T*2,my-T*2,T*4,T*4);
    g.fillStyle='rgba(240,236,214,.55)'; g.beginPath(); g.ellipse(mx,my,T*.55,T*.2+Math.sin(RT.t)*T*.03,0,0,7); g.fill();
    if(!S.flags.c2_xin_done) for(let i=0;i<C2X_WORDS.length;i++){ const u=(RT.t*.03+i*.137)%1, x=ox+(3.5+((i*7.3)%18)+Math.sin(RT.t*.3+i)*.6)*T, y=oy+(2+((i*5.1)%11)+u*.8)*T, al=Math.sin(u*Math.PI)*.55;
      g.save(); g.globalAlpha=al; g.font=`${Math.round(T*.62)}px "Ma Shan Zheng",KaiTi,serif`; g.textAlign='center'; g.fillStyle='#d8d0e8'; g.fillText(C2X_WORDS[i],x,y); g.restore(); }
    for(let k=0;k<3;k++){ const yy=H*(.3+k*.25), drift=Math.sin(RT.t*.2+k)*W*.1; const fg=g.createRadialGradient(W/2+drift,yy,0,W/2+drift,yy,W*.7); fg.addColorStop(0,'rgba(200,206,226,.12)'); fg.addColorStop(1,'rgba(200,206,226,0)'); g.fillStyle=fg; g.fillRect(0,yy-H*.3,W,H*.6); } }; }
// her wet footprints in the camp, from her tent to the stream
{ const _dg=Life.drawGround; Life.drawGround=function(g,ox,oy,T,Z){ _dg.call(Life,g,ox,oy,T,Z);
    if(RT.mapId!=='mj_camp'||!S.flags.c2_xin_start||S.flags.c2_xin_done) return;
    g.fillStyle='rgba(60,80,110,.55)'; const pts=[[15,5.4],[15.6,6.2],[16.1,7.2],[16.8,8.4],[17.2,10.6],[17.9,11.6],[18.6,12.4],[19.4,13.1],[20.2,13.4]];
    for(let i=0;i<pts.length;i++){ const [x,y]=pts[i]; g.beginPath(); g.ellipse(ox+(x+(i%2?.15:-.15))*T, oy+y*T, Z*1.6, Z*2.4, .4, 0, 7); g.fill(); } }; }

/* ---------- the scenes ---------- */
const C2X = {
  night:[
    ['旁白','这一夜，营地里只剩下两顶帐篷亮着灯。'],
    ['旁白','半夜，行囊里的八卦镜忽然自己翻了个面。'],
    ['旁白','镜子里是大师姐。她背对着你坐在溪边，肩膀一下一下地抖。'],
    ['旁白','镜面上浮出一行行小字，像有人拿指甲在上面刻——「狐媚」「靠脸」「不知廉耻」……'],
    ['旁白','你伸手去碰，镜面冰得刺骨。那些字一碰就散了，又从别处慢慢浮出来。']],
  morning:[
    ['何满仓','{称}！{称}！大师姐的帐篷是空的！'],
    ['旁白','大师姐的被褥没有动过。帐篷门口留着一串湿漉漉的脚印，一直通到营地东边的溪水里。'],
    ['何满仓','她、她不会也像大师兄那样……'],
    ['我','八卦镜……昨晚照见她了。她在溪边。'],
    ['何满仓','那你快去！我、我在营地守着，万一大师姐自己回来了呢。'],
    ['旁白','溪边那丛芦苇被人分开了。溪水往东，流进了雾里。'],
    {flag:'c2_xin_start'}],
  arrive:()=>[
    ['旁白','溪水的尽头，是一片湖。'],
    ['旁白','湖面平得像一面镜子，连雾都映得清清楚楚。没有风，也听不见虫鸣。'],
    ['旁白','湖上漂着一些字，像墨滴进了水里，慢慢化开，又慢慢聚拢。'],
    ['我','（这些字……就是八卦镜里那些。）'],
    ['旁白','湖心有一座小岛。岛上跪着一个白衣的人影。'],
    {flag:'c2_lake_in'},
    ['旁白','（顺着石板路走过去。路边的水面上，好像映着什么。）']],
  echoes:[
    [['旁白','你低头看向水面。水里映出的，是很多年前的一座山门。'],
     ['旁白','一个十三四岁的小姑娘站在测灵石前。石头亮得发白。'],
     ['路人甲','啧，长成这样，测灵石都要多亮三分。'],
     ['路人乙','听说执事收她，是看在脸的份上。'],
     ['旁白','小姑娘没有回头。她攥着衣角，攥得指节发白。']],
    [['旁白','水面一晃，换成了一间灯火通明的屋子。'],
     ['旁白','一个锦衣的内门师兄拦在门口，伸手去拉她的袖子。她拔剑，剑尖停在他喉前一寸。'],
     ['旁白','第二天，满宗门都在传：是谢霁月半夜去敲师兄的门，被拒了，恼羞成怒。'],
     ['路人甲','她那张脸，谁知道背地里干过什么。'],
     ['旁白','没有一个人来问过她。']],
    [['旁白','水面上，是宗门大比的擂台。少女一剑挑落对手的发冠，拿了头名。'],
     ['旁白','台下响起来的不是掌声，是窃窃私语。'],
     ['路人乙','评判的长老，是不是被她……'],
     ['路人甲','狐媚子。'],
     ['旁白','她站在台上，捧着头名的玉牌，谁也没有看。']]],
  island:()=>[
    ['旁白','你走上湖心岛。大师姐跪在水边，长发垂进了湖里。'],
    {run:()=>C2X.lakeCG()},
    ['我','大师姐！'],
    ['谢霁月','……别过来。'],
    ['旁白','她没有回头。水里映着她的倒影——可那个倒影，是站着的。'],
    {run:()=>{ C2X.risen=1; }},
    ['旁白','倒影慢慢抬起头，眼睛是红的。它在笑。'],
    ['心魔','你听见了吗，{称}？他们说的，都是真的。'],
    ['心魔','她就是靠这张脸进的山门，靠这张脸拿的头名。她自己心里，也是这么想的。'],
    ['谢霁月','……不是。'],
    ['心魔','那你为什么从来不笑？你一笑，他们就说你又在勾引人。所以你不敢。'],
    ['谢霁月','（握剑的手在发抖）……'],
    ['心魔','大师兄是假的。你也是假的。——不如，就让我来做谢霁月吧。'],
    {run:()=>{ C2X.risen=2; }},
    ['旁白','倒影从水里走了出来。它穿着大师姐的衣服，握着大师姐的剑。'],
    {run:()=>{ PixCG.close(); C2X.cgOn=false; }},
    {battle:'c2_xinmo', win:'c2x_fox', lose:'c2x_lose'}],
  again:[
    ['心魔','又回来了？你帮她做什么？她连一声谢谢都不会说。'],
    {battle:'c2_xinmo', win:'c2x_fox', lose:'c2x_lose'}],
  lose:[
    ['旁白','剑光一闪，你被逼退到了湖岸边。'],
    ['旁白','湖心岛上，那个影子还站在大师姐身后，一动不动地看着你。'],
    ['旁白','（回到了湖边。准备好了，再去湖心岛。）']],
  fox:()=>[
    {run:()=>C2X.foxCG()},
    ['旁白','一团雪白的狐火落在湖面上，化作一只九尾的白狐。九条尾巴展开，把整片湖都照亮了。'],
    ['九尾狐', count(S,'hu_wei')?'小修士，又见面了。你带着的尾毛告诉我，这里有人在哭。':'小修士，又见面了。青丘的风告诉我，这里有人在哭。'],
    ['心魔','九尾狐……你也是来看笑话的？人人都说，你会魅惑人心——'],
    ['九尾狐','是啊。人人都说。'],
    ['九尾狐','我在青丘守了三百年，没吃过一个人，也没害过一个人。他们照样怕我，照样说我吃人。'],
    ['九尾狐','后来我想明白了。他们怕的不是我，是他们自己心里想出来的那只狐狸。'],
    ['九尾狐','（她看向大师姐）你也一样。他们骂的那个「谢霁月」，是他们自己捏出来的。'],
    ['九尾狐','你不必变成她，也不必拿一辈子去证明你不是她。'],
    ['谢霁月','……那我该怎么办？'],
    ['九尾狐','做你自己想做的事。练你的剑，护你想护的人。累了，就笑一笑。'],
    ['九尾狐','笑，又不是笑给他们看的。'],
    {run:()=>{ C2X.fade=1; }},
    ['旁白','心魔看着大师姐，红色的眼睛一点一点暗了下去。它张了张嘴，最后什么也没说，化成一捧水，落回了湖里。'],
    ['旁白','湖面上漂着的那些字，一个接一个，沉了下去。'],
    {run:()=>C2X.smile()},
    ['旁白','大师姐低下头，看着湖水里自己的倒影。过了很久，她的嘴角轻轻弯了一下。'],
    ['旁白','那是你第一次看见她笑。'],
    ['谢霁月','{称}。……谢谢你。'],
    ['九尾狐','（尾巴尖扫过大师姐的头顶）这孩子，笑起来比我还好看。'],
    ['谢霁月','（脸一下子红了）……'],
    ['九尾狐','我该回青丘了。小修士——饕餮已经醒了，比穷奇难对付得多。你们身边的人，要多留个心。'],
    {run:()=>{ C2X.foxGone=1; }},
    ['旁白','狐火一闪，白狐不见了。湖面上只剩一轮月亮。'],
    {run:()=>{ PixCG.close(); C2X.cgOn=false; }},
    {flag:'c2_xin_done'},
    {love:{xie:80}},
    ['谢霁月','……回营地吧。满仓一个人，该等急了。']],
  gone:()=>[
    ['旁白','营地里静悄悄的。篝火已经灭了。'],
    ['谢霁月','满仓？'],
    ['旁白','没有人回答。锅里的饭一粒都不剩，连锅底都被舔得发亮。二师兄的帐篷门口，散着一地空了的干粮袋。'],
    ['旁白','泥地上有一串脚印，往南边去了。脚印旁边，拖着一道长长的、湿漉漉的痕迹，像是有人一边走，一边在流口水。'],
    ['谢霁月','（握紧了剑）……走。'],
    {flag:'c2_man_gone'},
    ['旁白','（第四幕「心镜湖」完。第五幕「何满仓与饕餮」正在制作中，敬请期待。）']],
  // CG 1: the island at night; she kneels at the water, and her reflection rises out of it, red-eyed
  risen:0, cgOn:false, fade:0, foxGone:0,
  lakeCG(){ C2X.risen=0; C2X.cgOn=true;
    PixCG.open({ink:(g,W,H,R)=>{ Land.paper(g,W,H,R,'#9aa0b8'); Land.sky(g,W,H,['rgba(12,14,34,.96)','rgba(30,34,70,.88)','rgba(60,60,100,.7)']);
        Land.orb(g,W*.7,H*.16,Math.min(W,H)*.06,'#ece8d6',4); Land.peaks(g,W,H,R,{y:H*.46,amp:H*.12,n:5,a:.5}); Land.mist(g,W,H,H*.48,H*.14,.3);
        g.fillStyle='rgba(16,20,36,.96)'; g.fillRect(0,H*.6,W,H*.4);                                           // the lake
        g.fillStyle='rgba(236,232,214,.4)'; g.beginPath(); g.ellipse(W*.7,H*.84,W*.05,H*.012,0,0,7); g.fill();     // the moon in the water
        g.fillStyle='rgba(40,48,60,.95)'; g.beginPath(); g.ellipse(W*.4,H*.6,W*.36,H*.035,0,0,7); g.fill(); },     // the island's edge
      cast:[{look:LOOK_XIE, x:.42, pose:'kneel', face:1, mood:'sad'},{who:'me', x:.12, pose:'stand', face:1}], title:'心镜湖', small:'第二章 · 第四幕', seed:4141 });
    const c=PixCG.cur; c.gy=.6;
    c.front=(g,W,H,fp,t)=>{
      // her reflection under the water line: upside down at first, then standing up out of the lake
      const sp=cgChibi(LOOK_XIE, C2X.risen?'stand':'kneel', 'normal', C2X.risen>1?'sword':null, null, false), s=fp, w=sp.width*s, h=sp.height*s, x=W*.42, wl=H*.6+fp;
      const tint=C2X.xinmoTint(sp); g.save(); g.imageSmoothingEnabled=false;
      if(!C2X.risen){ g.globalAlpha=.55; g.translate(x,wl); g.scale(1,-1); g.drawImage(tint,-w/2,-h,w,h); }
      else { const rise=Math.min(1,(t-(C2X.riseT||(C2X.riseT=t)))/1.6); g.globalAlpha=.6+.3*rise; g.translate(x+(C2X.risen>1?W*.14:W*.07),wl); g.scale(1,-1+2*rise); g.drawImage(tint,-w/2,-h,w,h);
        if(rise>.8){ g.fillStyle='#ff3040'; g.fillRect(-w/2+39*s,-h+19*s,3*s,3*s); g.fillRect(-w/2+31*s,-h+19*s,2*s,3*s); } }
      g.restore();
      // ripples and the words drifting on the water
      g.strokeStyle='rgba(200,210,240,.25)'; g.lineWidth=Math.max(1,fp*.4); for(let k=0;k<3;k++){ const r=((t*.6+k/3)%1); g.globalAlpha=1-r; g.beginPath(); g.ellipse(W*.42,H*.62,W*.05+r*W*.25,H*.008+r*H*.04,0,0,7); g.stroke(); } g.globalAlpha=1;
      g.font=`${Math.round(H*.035)}px "Ma Shan Zheng",KaiTi,serif`; g.textAlign='center';
      for(let i=0;i<6;i++){ const u=(t*.05+i/6)%1; g.fillStyle=`rgba(216,208,232,${Math.sin(u*Math.PI)*.5})`; g.fillText(C2X_WORDS[i],W*(.1+i*.16),H*(.7+((i*37)%20)/100)+Math.sin(t+i)*fp*2); }
      const vg=g.createRadialGradient(W/2,H*.55,Math.min(W,H)*.25,W/2,H*.55,Math.max(W,H)*.75); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,10,.55)'); g.fillStyle=vg; g.fillRect(0,0,W,H); }; },
  // her colours drained, the eyes red: the 心魔
  tintC:new Map(),
  xinmoTint(sp){ if(C2X.tintC.has(sp)) return C2X.tintC.get(sp); const c=document.createElement('canvas'); c.width=sp.width; c.height=sp.height; const g=c.getContext('2d'); g.drawImage(sp,0,0);
    const d=g.getImageData(0,0,c.width,c.height), D=d.data; for(let i=0;i<D.length;i+=4){ if(!D[i+3]) continue; const l=(D[i]*.3+D[i+1]*.55+D[i+2]*.15)/255; D[i]=30+l*120; D[i+1]=24+l*90; D[i+2]=50+l*140; } g.putImageData(d,0,0); C2X.tintC.set(sp,c); return c; },
  // CG 2: 九尾狐 on the lake; she, you and the shadow; the shadow fades, and 大师姐 smiles
  foxCG(){ C2X.cgOn=true; C2X.fade=0; C2X.foxGone=0; C2X.smiled=false;
    PixCG.open({ink:(g,W,H,R)=>{ Land.paper(g,W,H,R,'#a8acc4'); Land.sky(g,W,H,['rgba(14,18,44,.94)','rgba(40,46,92,.82)','rgba(90,84,130,.6)']);
        Land.orb(g,W*.5,H*.14,Math.min(W,H)*.07,'#f4f0dc',5); Land.peaks(g,W,H,R,{y:H*.46,amp:H*.12,n:5,a:.45}); Land.mist(g,W,H,H*.5,H*.14,.3);
        g.fillStyle='rgba(18,22,40,.96)'; g.fillRect(0,H*.62,W,H*.38); g.fillStyle='rgba(40,48,60,.95)'; g.beginPath(); g.ellipse(W*.3,H*.62,W*.32,H*.035,0,0,7); g.fill(); },
      cast:C2X.foxCast('sad'), title:'九尾', small:'第二章 · 第四幕', seed:9090 });
    const c=PixCG.cur; c.gy=.62;
    c.stage=(g,W,H,fp,t)=>{ if(C2X.foxGone) return; const fox=FineArt.fox(), s=fp*.8, w=fox.width*s, h=fox.height*s, x=W-w*.55, y=H*.66+Math.sin(t*1.2)*fp;
      const gl=g.createRadialGradient(x,y-h*.5,0,x,y-h*.5,w*.9); gl.addColorStop(0,'rgba(200,220,255,.35)'); gl.addColorStop(1,'rgba(200,220,255,0)'); g.fillStyle=gl; g.fillRect(x-w,y-h*1.4,w*2,h*1.8);
      g.save(); g.imageSmoothingEnabled=false; g.translate(x+w/2,y-h); g.scale(-1,1); g.drawImage(fox,0,0,w,h); g.restore();
      for(let k=0;k<7;k++){ const u=((t*.2+k/7)%1), fx=x+Math.sin(t+k*2)*w*.6, fy=y-h*.3-u*h; const r=fp*(1.2+Math.sin(t*3+k)*.3); const fg=g.createRadialGradient(fx,fy,0,fx,fy,r*4); fg.addColorStop(0,`rgba(150,200,255,${.8*(1-u)})`); fg.addColorStop(1,'rgba(150,200,255,0)'); g.fillStyle=fg; g.fillRect(fx-r*4,fy-r*4,r*8,r*8); }
      g.fillStyle='rgba(220,236,255,.25)'; g.beginPath(); g.ellipse(x,y+fp,w*.45,fp*2.5,0,0,7); g.fill(); };
    c.front=(g,W,H,fp,t)=>{ if(C2X.fade>=1&&!C2X.fadeT) C2X.fadeT=t; const fa=C2X.fadeT?Math.max(0,1-(t-C2X.fadeT)/2):1;
      if(fa>0){ const sp=C2X.xinmoTint(cgChibi(LOOK_XIE,'stand','normal','sword',null,false)), w=sp.width*fp*.8, h=sp.height*fp*.8, x=W*.4, y=H*.62;
        g.save(); g.globalAlpha=.75*fa; g.imageSmoothingEnabled=false; g.drawImage(sp,x-w/2,y-h,w,h); g.restore(); } }; },
  foxCast(mood){ return [{who:'me', x:.08, pose:'stand', face:1, s:.8},{look:LOOK_XIE, x:.22, s:.8, pose:mood==='smile'?'stand':'kneel', face:1, mood}]; },
  smile(){ if(!PixCG.cur) return; PixCG.cur.cast=C2X.foxCast('smile'); PixCG.cur.st=[]; },
};
SCRIPTS.c2x_lose=C2X.lose;
// SCRIPTS.c2x_fox is built when the fight is won, so it can ask whether you still carry the fox hair
Object.defineProperty(SCRIPTS,'c2x_fox',{configurable:true, get(){ return C2X.fox(); }});

// the fox: white, nine tails fanned out behind her, a red mark on the brow
FineArt.fox=function(){ return FineArt.cache.fox||(FineArt.cache.fox=FineArt.paint(90,56,P=>{
  const Wt='#f8f4ec', Sh='#dcd4c8', Tip='#c8d8ff', Dk='#9a9488', Red='#d8413b';
  for(let i=0;i<9;i++){ const a=-Math.PI*.95+i*Math.PI*.105, L=24+((i*5)%7); const bx=26, by=34, ex=bx+Math.cos(a)*L, ey=by+Math.sin(a)*L*.85;
    P.cap(bx,by,ex,ey,3.6,i%2?Sh:Wt); P.cap(ex-Math.cos(a)*3,ey-Math.sin(a)*3,ex,ey,3,Tip); }
  P.ell(40,40,15,9,Wt); P.ell(40,45,12,4,Sh);                                   // body, sitting
  P.cap(33,44,31,54,2.6,Sh); P.cap(49,44,51,54,2.8,Wt); P.rect(28,53,5,2,Dk); P.rect(49,53,5,2,Dk);
  P.poly([[50,30],[60,26],[62,40],[52,44]],Wt);                                  // neck ruff
  P.ell(63,26,8,7,Wt); P.poly([[68,24],[80,28],[80,31],[68,32]],Wt); P.set(80,28,'#2a2220');   // head and snout
  P.poly([[57,21],[58,10],[63,19]],Wt); P.poly([[63,19],[67,9],[69,21]],Wt); P.set(59,15,'#f2b0c0'); P.set(66,15,'#f2b0c0');
  P.line(67,24,70,24,'#2a2220'); P.set(65,21,Red); P.set(65,20,Red); P.set(64,22,Red); })); };

/* ---------- the boss: 心魔 · 霁影 ---------- */
BEASTS.c2_xinmo={name:'心魔 · 霁影', spr:'c2_xinmo', boss:true, hp:2000, atk:42, def:12, exp:320, stones:[160,160], theme:'huli',
  lore:'秘境里的湖，照出了大师姐心里最深的那一句话。它穿着她的衣服，握着她的剑，说着别人说过的话。',
  moves:['cross','rumor','dash','atk','rumor','cross'],
  phase2:{at:.6, moves:['rumor','dash','rumor','cross','rumor','dash'], line:'湖面上所有的字都飞了起来——流言越来越密了！'}};
SCENES.c2_xinmo={...SCENES.huli, title:'心魔 · 霁影', sub:'众口铄金，积毁销骨　——　《史记》'};
DODGE.c2_xinmo={
  cross:{name:'剑光十字斩', hit:.6, dur:4.6, spawn(P,t,dt,m){ P.every('x',1.05/m,()=>{ const a=Math.random()*Math.PI; for(const b of [a,a+Math.PI/2]) P.add({k:'slash', cx:P.me.x, cy:P.me.y, a:b, w:7, warn:.7/m, act:.22}); }); }},
  dash:{name:'残影突刺', hit:.7, dur:4.4, spawn(P,t,dt,m){ P.every('d',.85/m,()=>{ const a=Math.random()*Math.PI; P.add({k:'slash', cx:P.me.x+(Math.random()-.5)*10, cy:P.me.y+(Math.random()-.5)*10, a, w:11, warn:.8/m, act:.18}); }); }},
  rumor:{name:'流言', hit:.5, dur:4.8, spawn(P,t,dt,m){ P.every('w',.42/m,()=>{ const side=Math.random()*4|0, p=Math.random()*100, x=[p,104,p,-4][side], y=[-4,p,104,p][side], d=Math.hypot(P.me.x-x,P.me.y-y)||1, sp=(26+Math.random()*10)*m;
      P.add({k:'word', text:C2X_WORDS[Math.random()*C2X_WORDS.length|0], x, y, vx:(P.me.x-x)/d*sp, vy:(P.me.y-y)/d*sp, r:3.4}); }); }},
  atk:{...DODGE.qiongqi.double, name:'寒光一剑'},
};
// its art: 大师姐's own sprite, drained of colour, with red eyes
C2X.art=function(){ if(SPRC.c2_xinmo) return; const sp=lookSprite(LOOK_XIE,'down',0), c=C2X.xinmoTint(sp), o=document.createElement('canvas'); o.width=c.width; o.height=c.height; const g=o.getContext('2d'); g.drawImage(c,0,0);
      g.fillStyle='#ff3040'; for(const [x,y] of [[6,9],[7,9],[10,9],[11,9]]) g.fillRect(x,y,1,1); g.fillStyle='#ffb0b0'; g.fillRect(7,9,1,1); g.fillRect(10,9,1,1); o.bottom=c.bottom||c.height; SPRC.c2_xinmo=o; };
{ const _s=Battle.start; Battle.start=function(kind,cb){ if(kind==='c2_xinmo') C2X.art(); return _s.call(Battle,kind,cb); }; }
const XM = {
  is(s){ return !!s&&s.kind==='c2_xinmo'; },
  LINES:[[['心魔','你越强，他们越恨你。']],[['心魔','没有人会信你的。']],[['心魔','笑啊。你怎么不笑？']],[['谢霁月','（远远地）……{称}，别听它的。']],[['心魔','你帮她做什么？她连一声谢谢都不会说。']],[['心魔','狐媚。妖女。靠脸。——这些字，她听了多少年了？']]],
  lines(s){ s.etn=(s.etn||0)+1; if(s.pendingTalk){ const t=s.pendingTalk; s.pendingTalk=null; return t; } return s.etn%2?null:XM.LINES[(s.etn/2|0)%XM.LINES.length]; },
};
// the fight turns into story: hold out long enough, or bring it low, and 九尾狐 comes
{ const _b=Battle._begin; Battle._begin=function(kind,cb){ if(kind==='c2_xinmo') C2X.art(); const r=_b.call(Battle,kind,cb); const s=Battle.s; if(XM.is(s)){ const en=$('#bEnemy'); en&&en.classList.add('xinmo'); s.pendingTalk=[['心魔','狐媚。妖女。靠脸。——这些字，你听了多少年了，{称}？']]; } return r; }; }
{ const _pc=Battle.phaseCheck; Battle.phaseCheck=function(){ const s=Battle.s, p2=s&&s.phase2; _pc.call(Battle);
    if(XM.is(s)&&s.phase2&&!p2) s.pendingTalk=[['心魔','流言是杀不完的！'],['谢霁月','……可我也没有被它们杀死。']]; }; }
XM.fox=function(s){ if(s.foxed) return; s.foxed=true; s.busy=true; Battle.ui(); BossBg.flash('rgba(200,220,255,.85)'); Sound.magic();
  const host=$('#battle'), el=document.createElement('div'); el.className='ally-in'; el.innerHTML='<canvas></canvas><b>九尾狐 现身！</b>'; const c=el.querySelector('canvas'), sp=FineArt.fox(); c.width=sp.width; c.height=sp.height; c.getContext('2d').drawImage(sp,0,0); host.appendChild(el);
  setTimeout(()=>{ el.remove(); QQLU.talk([['旁白','你行囊里的狐尾毛忽然亮了起来，烫得像一团火。'],['九尾狐','……够了。']],()=>{ if(Battle.s!==s) return; s.dead=true; s.foxDone=true; Battle.end('win'); }); },2200); };
{ const _et=Battle.enemyTurn; Battle.enemyTurn=function(){ const s=Battle.s;
    if(!XM.is(s)) return _et.call(Battle);
    s.turns=(s.turns||0)+1;
    if(!s.foxed&&(s.hp<=s.max*.3||s.turns>13)) return XM.fox(s);
    if(!s.stun&&!s.talked&&!Dodge.auto){ const lines=XM.lines(s); if(lines){ s.talked=true; s.turns--; s.busy=true; Battle.ui(); return QQLU.talk(lines,()=>{ if(Battle.s!==s||s.dead) return; s.busy=false; Battle.enemyTurn(); }); } }
    s.talked=false; return _et.call(Battle); }; }
// a blow that would finish it ends in 九尾狐's arrival instead
{ const _act=Battle.act; Battle.act=function(a){ const s=Battle.s; const r=_act.call(Battle,a); if(XM.is(s)&&Battle.s===s&&!s.foxed&&s.hp<=s.max*.3&&!s.over){ s.dead=false; s.hp=Math.max(1,s.hp); XM.fox(s); } return r; }; }
// it cannot simply be beaten: until 九尾狐 has spoken, a win becomes her arrival
{ const _end=Battle.end; Battle.end=function(r){ const s=Battle.s; if(XM.is(s)&&r==='win'&&!s.foxDone){ if(!s.foxed){ s.hp=Math.max(1,Math.round(s.max*.3)); s.over=false; s.dead=false; XM.fox(s); } return; } return _end.call(Battle,r); }; }

/* ---------- actions, talk, falls ---------- */
{ const _a=Dungeon.act; Dungeon.act=function(o){
    if(o.act==='mjreeds'){ UI.say([['旁白','溪边一丛高高的芦苇，挡住了往东去的水路。']]); return true; }
    if(o.act==='c2fogwall'){ UI.say([['旁白','湖心起了一团浓雾，看不清岛上的样子。'],['旁白','（先看清路边水面上映着的东西。已看 '+((S.c2x&&S.c2x.echo||[]).length)+'/3）']]); return true; }
    if(o.act==='c2echo'){ S.c2x=S.c2x||{echo:[]}; const seen=S.c2x.echo.includes(o.ei); UI.say([...C2X.echoes[o.ei], {run:()=>{ if(!seen){ S.c2x.echo.push(o.ei); if(S.c2x.echo.length===3){ enterMap('mj_lake',S.x,S.y); UI.toast('湖心的雾散开了'); } save(); UI.hud(); } }}]); return true; }
    // the night after the sealing, back in your tent
    if(o.act==='mjtent'&&Story.quest()?.id==='c2g'&&!S.flags.c2_xin_night){ UI.confirm('回帐篷休息，结束今天？', ()=>{ MJ.dark(true); MJ.nightOn=true;
        UI.say(C2X.night, ()=>{ MJ.nightOn=false; sleep(false); S.flags.c2_xin_night=true; enterMap('mj_camp',5,11); RT.dir='down'; MJ.dark(false); save(); UI.hud();
          setTimeout(()=>UI.say(C2X.morning, ()=>{ enterMap('mj_camp',S.x,S.y); UI.hud(); }),400); }); }); return true; }
    return _a.call(Dungeon,o); }; }
{ const _t=Story.talk; Story.talk=function(id){ const q=Story.quest()?.id;
    if(RT.mapId==='mj_lake'&&id==='xie'&&!S.flags.c2_xin_done){ return UI.say(S.flags.c2_xin_met?C2X.again:(S.flags.c2_xin_met=true, C2X.island())); }
    if(q==='c2g'&&(id==='xie'||id==='man')){ const F=S.flags; const L={
        xie: F.c2_xin_done?[['谢霁月','（她看了你一眼，嘴角又轻轻弯了一下）……别看了。']]:[['谢霁月','……我没事。早些歇着吧。']],
        man: F.c2_xin_start?[['何满仓','大师姐顺着溪往东去了……你快去吧，我、我守着营地。']]:[['何满仓','（他在嚼着什么，嚼得很用力）今天……今天好饿啊。']]}[id];
      return UI.say(L); }
    return _t.call(Story,id); }; }
{ const _sl=sleep; sleep=function(passedOut){ const lake=passedOut&&RT.mapId==='mj_lake'; const r=_sl(passedOut); if(lake){ enterMap('mj_lake',3,8); RT.dir='right'; UI.hud(); } return r; }; }
{ const _at=areaTheme; areaTheme=function(){ if(RT.mapId==='mj_lake') return 'huli'; return _at(); }; }

/* ---------- quests: 第四幕, and the placeholder for 第五幕 ---------- */
{ const q=QUESTS.find(q=>q.id==='c2g');
  Object.assign(q,{title:'心镜湖', desc:'穷奇被封回了风穴，大师兄永远留在了它肚子里。那一夜，八卦镜照见了大师姐。',
    check:s=>!!s.flags.c2_man_gone,
    progress:s=>{ const F=s.flags, n=(s.c2x&&s.c2x.echo||[]).length; return !F.c2_xin_night?'回营地，在自己的帐篷里歇一晚':!F.c2_lake_in?'顺着大师姐的脚印，沿溪水往东':n<3?`看清湖面上映着的往事 ${n}/3`:!F.c2_xin_done?'去湖心岛找大师姐':'回营地'; },
    target:s=>{ const F=s.flags, m=RT.mapId, n=(s.c2x&&s.c2x.echo||[]).length;
      if(!F.c2_xin_night) return ['mj_camp',5,11,'你的帐篷'];
      if(F.c2_xin_done) return ['mj_camp',10,8,'营地'];
      if(m==='mj_lake'){ if(n<3){ const E=MAPS.mj_lake.objects.find(o=>o.act==='c2echo'&&!(s.c2x&&s.c2x.echo||[]).includes(o.ei)); return ['mj_lake',E.x,E.y,'水面上的倒影']; } return ['mj_lake',20,8,'湖心岛']; }
      return ['mj_camp',21,13,'东边的溪水']; }});
  QUESTS.splice(QUESTS.indexOf(q)+1,0,{id:'c2h', title:'第五幕 · 何满仓与饕餮（制作中）', desc:'二师兄不见了，锅底被舔得发亮。第五幕正在制作中，敬请期待。', check:s=>false}); }
// the end of 第三幕 now points the way
{ const i=SCRIPTS.c2c_win.findIndex(st=>Array.isArray(st)&&/第四幕「大师姐的心魔」正在制作中/.test(st[1]));
  if(i>=0) SCRIPTS.c2c_win[i]=['旁白','（第三幕「白羽崖」完。天快黑了——回营地，在自己的帐篷里歇一晚吧。）']; }
