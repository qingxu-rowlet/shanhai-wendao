/* ============================================================
   山海问道 · 第三章「京城」 · 第二幕 · 大比开幕 — the morning after the alley the 礼部's clerk comes for the entrants, and
   大师姐 knows you went out. The square before the 贡院, north up the avenue from the cross street: the 擂台 in the
   middle, the 高台 under its yellow canopy, war drums, the four sects' banners, the crowd. The 天子 comes; everyone
   kneels; and at his right hand stands the young man from the alley, in a black court robe: 萧大人. Behind the throne,
   someone in a bronze 饕餮 mask. Then a new rule: each entrant stands before the 观天鉴, which records their root and
   realm (why?) — 结丹初期 makes the crowd gasp. Lots are drawn; the bracket; tomorrow the fighting starts. Picture:
   「开幕式的高台」.
   ============================================================ */
{ const W=28, H=24, G=[...Array(H)].map((_,y)=>[...Array(W)].map((_,x)=>y===0||x===0||x===W-1||y===H-1?'X':y===1?'Y':'P'));
  for(let x=12;x<=15;x++) G[H-1][x]='P';
  const P=(id,x,y,name,look,cond)=>({type:'npc', id, x, y, look, name, act:'talk', cond});
  const not=k=>s=>s.sect!==k;
  const objects=[
    {type:'jc_gaotai', x:14, y:5, spr:'jc_gaotai', act:'kmgaotai', rect:[9,2,19,5]},
    {type:'jc_leitai', x:14, y:13, spr:'jc_leitai', act:'kmleitai', rect:[11,10,18,13]},
    {type:'jc_jian', x:22, y:11, spr:'jc_jian', act:'kmjian'},
    {type:'jc_drum', x:6, y:8, spr:'jc_drum'}, {type:'jc_drum', x:22, y:7, spr:'jc_drum'},
    ...['jian','dan','shou','tianji'].map((k,i)=>({type:'jc_banner', x:i<2?3:24, y:i%2?11:7, spr:'jc_banner_'+k, flagText:SECT_CH[k], flagInk:'#f8f0d8', flagX:12.5, flagY:21})),
    {type:'jc_willow', x:3, y:20, spr:'jc_willow'}, {type:'jc_willow', x:24, y:20, spr:'jc_willow'},
    P('km_libu',14,7,'礼部尚书',{g:'m',skin:1,hair:0,hairColor:3,style:'robe',cloth:2,face:'small',beard:'#d8d4cc'}),
    P('km_g1',8,6,'禁军',{g:'m',skin:2,hair:0,hairColor:0,style:'jin',cloth:2,face:'mid'}),
    P('km_g2',20,6,'禁军',{g:'m',skin:1,hair:1,hairColor:0,style:'jin',cloth:2,face:'mid'}),
    P('xie',11,16,'谢霁月',LOOK_XIE), P('tang',12,16,'苏小棠',LOOK_TANG),
    P('sf_lin',14,16,'林沧',{g:'m',skin:0,hair:2,hairColor:0,style:'robe',cloth:0,face:'small'},not('jian')),
    P('sf_wulan',16,16,'乌兰',{g:'f',skin:3,hair:3,hairColor:1,style:'jin',cloth:3,face:'mid'},not('shou')),
    P('sf_wenxuan',17,16,'温玄',{g:'m',skin:0,hair:5,hairColor:5,style:'robe',cloth:4,face:'small'},not('tianji')),
    P('sf_cheng',9,19,'程小剑',{g:'m',skin:1,hair:1,hairColor:0,style:'jin',cloth:0,face:'small'},not('jian')),
    P('sf_bu',19,19,'卜小鱼',{g:'f',skin:0,hair:3,hairColor:0,style:'qun',cloth:4,face:'small'},not('tianji')),
    P('km_c1',3,15,'看热闹的人',{g:'m',skin:3,hair:1,hairColor:0,style:'jin',cloth:6,face:'mid'}),
    P('km_c2',24,15,'看热闹的人',{g:'f',skin:1,hair:4,hairColor:1,style:'qun',cloth:2,face:'mid'}),
    P('km_c3',6,20,'看热闹的人',{g:'m',skin:2,hair:0,hairColor:3,style:'robe',cloth:5,face:'small',beard:'#d8d4cc'}),
    P('km_c4',21,20,'看热闹的人',{g:'f',skin:0,hair:3,hairColor:0,style:'qun',cloth:6,face:'small'}),
  ];
  MAPS.jc_gongyuan={ name:'京城 · 贡院前', w:W, h:H, ground:G.map(r=>r.join('')), objects, exits:[12,13,14,15].map(x=>({x, y:23, to:'jc_zhuque', tx:x<14?13:14, ty:1})) }; }
// big things stop you over their whole footprint
On.enter(id=>{ if(id!=='jc_gongyuan') return; for(const o of RT.ents) if(o.rect){ const [a,b,c,d]=o.rect; for(let y=b;y<=d;y++) for(let x=a;x<=c;x++) RT.solid[y][x]=true; } });
// once the 大比 has opened, the avenue north from the cross street leads here
for(const o of MAPS.jc_zhuque.objects) if(o.way==='north') o.cond=s=>!s.flags.c3_km_done;
MAPS.jc_zhuque.exits.push(...[12,13,14,15].map(x=>({x, y:0, to:'jc_gongyuan', tx:x<14?13:14, ty:22})));

const KM={
  st(){ const c=C3.st(); c.km=c.km||{}; return c.km; },
  NAME:{sf_cheng:'程小剑（青云剑宗）', sf_bu:'卜小鱼（天机阁）', tang:'苏小棠（药王谷）', sf_lin:'林沧（青云剑宗）', sf_wulan:'乌兰（万兽谷）', sf_wenxuan:'温玄（天机阁）'},
  // the draw: an easy first round, 苏小棠 in the second, then the other sects' best; 林沧 in the final if he's in it
  bracket(){ const R=SF.rivals(), fin=R.includes('sf_lin')?'sf_lin':R[R.length-1], third=R.find(id=>id!==fin)||R[0];
    return [S.sect==='tianji'?'sf_cheng':'sf_bu', 'tang', third, fin]; },
  show(){ const b=KM.st().bracket||KM.bracket(), rounds=['第一轮','第二轮','第三轮','决赛'];
    UI.panel('四宗大比 · 对阵表', `<p class="muted">三月十五起，贡院前设擂。每日一轮。</p>`+b.map((id,i)=>`<div class="row"><div><b>${rounds[i]}</b><small>${esc(S.name)}（${esc(sectName())}）　对　${esc(KM.NAME[id])}</small></div></div>`).join('')); },
  CHAT:{km_libu:['肃静——'], km_g1:['……'], km_g2:['……'], km_c1:['那就是四宗的弟子？'], km_c2:['哪个是谢霁月？'], km_c3:['今年的头名，押谁？'], km_c4:['天子来了！']},
};
Object.assign(JC.CHAT,KM.CHAT);

/* ---------- the morning: the clerk comes for you ---------- */
On.enter(id=>{ if(id!=='jc_sifang'||!S.flags.c3_xj_met||S.flags.c3_km_call||S.min<5*60||S.min>14*60) return;
  setTimeout(()=>{ if(RT.mapId==='jc_sifang'&&!S.flags.c3_km_call) UI.say(KM.call(),()=>{ UI.hud(); Story.check(); }); },700); });
KM.call=()=>[
  ['旁白','天刚亮，院子里就响起了锣声。'],
  ['礼部小吏','四宗弟子听着——大比今日开幕！收拾好了，随我去贡院！'],
  ['谢霁月','（她从你身边走过，脚步停了一下）……你昨晚出去了。'],
  ['我','……'],
  ['谢霁月','（她没有再问）走吧。'],
  ...(S.sect==='dan'?[]:[['苏小棠','（她跑过来，一边走一边系头绳）{名}！我昨晚紧张得一宿没睡！你呢？']]),
  {flag:'c3_km_call'},
  {run:()=>C3.move('jc_gongyuan',14,21,'up',9,()=>setTimeout(()=>UI.say(KM.open(),()=>{ UI.hud(); Story.check(); }),500))}];

/* ---------- the ceremony ---------- */
KM.open=()=>{ const ge6=!!(S.rel&&S.rel.ge&&S.rel.ge.ev&&S.rel.ge.ev[6]); return [
  ['旁白','贡院前的广场上，人山人海。正中搭着擂台，北边一座高台，罩着明黄的华盖。'],
  ['旁白','鼓响了九声。'],
  ['礼部尚书','天子驾到——'],
  ['旁白','所有人都跪了下去。你跟着跪下，从人缝里往高台上看。'],
  {run:()=>KM.cg()},
  ['旁白','华盖底下，一个穿明黄袍子的人坐了下来。隔得太远，看不清脸。'],
  ['旁白','他的右手边，站着一个穿玄色朝服的年轻人。灰白的长发没有束，垂到腰上。'],
  ['我','（……是他。）'],
  ['看热闹的人','（压低了声音）那就是萧大人。天子跟前最红的人。'],
  ['看热闹的人','听说才二十出头……'],
  ['苏小棠','（她拽了拽你的袖子）{名}，那个人……是不是一直在看我们这边？'],
  ['旁白','萧烬的目光落在你身上，停了一下。然后他微微抬了抬手里的茶盏，像是在跟老朋友打招呼。'],
  ['谢霁月','（她看了看高台，又看了看你，什么也没说）'],
  ['旁白','高台的最里面，天子身后的阴影里，还站着一个人。'],
  ['旁白','一身黑袍，脸上戴着一张青铜面具。面具上的纹路，像一张只有嘴的兽脸。'],
  ...(ge6?[['我','（……顾长歌说过。那一夜火光冲天，废墟中间站着一个人，戴着一张饕餮纹的青铜面具。）']]:[]),
  ...(S.flags.c3_xs_ding?[['我','（博古斋里那只小铜鼎上，也是这样一张兽脸。）']]:[]),
  ['看热闹的人','那是国师。替天子炼长生丹的。'],
  {run:()=>PixCG.close()},
  ['礼部尚书','（他展开一卷黄绢）奉天子谕：今年大比，添一条新规矩——'],
  ['礼部尚书','凡参赛弟子，上擂台之前，须在「观天鉴」前站一站，记下灵根与修为，存档备查。'],
  ['旁白','广场东边，立着一面一人多高的铜镜。镜面磨得雪亮，照得出天上的云。'],
  ...(()=>{ const L=[...(KB.present('sf_wulan')?[['乌兰','（小声）……记这个做什么？']]:[]), ...(KB.present('sf_wenxuan')?[['温玄','（他盯着那面镜子，没有说话，手里的铜钱攥得紧紧的）']]:[])];   // only whoever is here this year
    return L.length?L:[['旁白','人群里有人小声嘀咕：记这个做什么？'],['旁白','没有人回答。']]; })(),
  {choice:'轮到你了。', options:[{text:'走到观天鉴前', fn:()=>UI.say(KM.mirror(),()=>{ UI.hud(); Story.check(); })}]}]; };
KM.mirror=()=>[
  ['旁白','你站到镜子前面。镜面晃了一下，浮出两行字：'],
  ['旁白',`「${S.name}，${Sect.rootName()}。${realmName(S.L)}。」`],
  ['看热闹的人','结……结丹了？！'],
  ['看热闹的人','新弟子就结丹了？不是说上一届的魁首，也就是个结丹吗？'],
  ['旁白','人群一下子嗡嗡地响起来。高台上，戴面具的人往前倾了倾身子。'],
  ['我','（镜子……）'],
  ['我','（昨晚他说：「你比镜子里看起来，要小一些。」……是这面镜子？可我是第一次站到它跟前。）'],
  ['旁白','大师姐和苏小棠也一个一个站过去了。镜子照完最后一个人，礼部的人把一本册子合上，捧着送上了高台。'],
  ['礼部尚书','抽签——'],
  {run:()=>{ KM.st().bracket=KM.bracket(); save(); }},
  ['旁白','签筒摇了三下。你抽出一支竹签。'],
  {run:()=>KM.show()},
  ['礼部尚书','明日辰时开擂。每日一轮，胜者进，败者……送回宗门。'],
  ['苏小棠','（她看着对阵表，愣住了）……要是我们第一轮都赢了，第二轮就是我和你。'],
  ['苏小棠','（她笑了一下，笑得有点勉强）那、那我要好好准备了！'],
  ['旁白','高台上，萧烬拍了两下手。没有人知道他在为谁鼓掌。'],
  {run:()=>{ KM.st().openDay=S.day; }},{flag:'c3_km_done'},
  ['旁白','（大比明日开擂。对阵表可以找礼部尚书再看。）']];

/* ---------- 插画「开幕式的高台」 ---------- */
// painted in ink, looking up from the kneeling crowd: palace roofs in the morning haze; the 高台 — a stone terrace with a
// stair up its middle, red columns, a yellow-glazed roof with sweeping eaves, a gold-and-red screen behind the throne.
// The three stand ON the deck (the cast's feet at KM.DY); the vermilion balustrade along the deck's front edge is drawn
// in front of them, so it hides their feet the way a real railing would. Below, the crowd kneels in rows.
KM.DY=.5;
KM.paint=(g,W,H,R)=>{ const DY=H*KM.DY, DB=DY-H*.04, DF=DY+H*.035, M=Math.min(W,H);
  Land.paper(g,W,H,R,'#ece4d2');
  Land.sky(g,W,H*.7,['rgba(150,186,214,.55)','rgba(186,208,224,.4)','rgba(226,226,214,.15)']);
  // the palace far off: hall roofs one behind another, pale in the haze
  for(const [y,s,a,n] of [[.3,.07,.22,7],[.34,.09,.3,5]]) for(let k=0;k<n;k++){ const x=W*(k+.5)/n+(R()-.5)*W*.04; Land.roof(g,x,H*y,W*s,H*s*.45,a); g.fillStyle=SUMI.ink(a*.8); g.fillRect(x-W*s*.4,H*y+H*s*.1,W*s*.8,H*.05); }
  Land.mist(g,W,H,H*.38,H*.1,.5);
  // the 贡院 wall behind the square
  g.fillStyle='rgba(150,70,56,.55)'; g.fillRect(0,H*.4,W,H*.07); brush(g,[[0,H*.4],[W,H*.4]],Math.max(3,H*.01),.75);
  for(let x=0;x<W;x+=W*.03) brush(g,[[x,H*.395],[x+W*.02,H*.395]],2,.5);
  // the terrace: stone, coursed, a little narrower at the top; the stair up the middle, with a carved slab between the flights
  const tx0=W*.12, tx1=W*.88, by=H*.8;
  g.fillStyle='#b8b2a4'; g.beginPath(); g.moveTo(tx0,DF); g.lineTo(tx1,DF); g.lineTo(tx1+W*.03,by); g.lineTo(tx0-W*.03,by); g.closePath(); g.fill();
  for(let r=0;r<7;r++){ const y=DF+(by-DF)*(r+1)/8; brush(g,[[tx0-W*.03*(r+1)/8,y],[tx1+W*.03*(r+1)/8,y]],1,.35); for(let k=0;k<16;k++){ const x=tx0+(tx1-tx0)*(k+(r%2)*.5)/16; brush(g,[[x,y-(by-DF)/8],[x,y]],1,.25); } }
  g.fillStyle='rgba(60,50,40,.18)'; g.fillRect(tx0-W*.03,by-H*.03,tx1-tx0+W*.06,H*.03);
  { const sx0=W*.42, sx1=W*.58; g.fillStyle='#d4cec0'; g.beginPath(); g.moveTo(sx0,DF); g.lineTo(sx1,DF); g.lineTo(sx1+W*.04,by); g.lineTo(sx0-W*.04,by); g.closePath(); g.fill();
    for(let i=1;i<14;i++){ const u=i/14, y=DF+(by-DF)*u; brush(g,[[sx0-W*.04*u,y],[sx1+W*.04*u,y]],Math.max(1,H*.003),.45); }
    g.fillStyle='rgba(200,170,110,.6)'; g.beginPath(); g.moveTo(W*.48,DF); g.lineTo(W*.52,DF); g.lineTo(W*.53,by); g.lineTo(W*.47,by); g.closePath(); g.fill();      // the carved 御路 slab
    for(let i=0;i<6;i++){ const y=DF+(by-DF)*(i+.5)/6; brush(g,[[W*.485,y],[W*.5,y-H*.012],[W*.515,y]],1,.5); }                                                    // clouds and a dragon, worn
    for(const sd of [-1,1]){ const x=W*.5+sd*W*.08; brush(g,[[x,DF],[x+sd*W*.04,by]],Math.max(2,W*.004),.7); } }
  // the deck: its floor, seen a little from below, running back from the front edge
  g.fillStyle='#8a6a4a'; g.fillRect(W*.1,DB,W*.8,DF-DB); g.fillStyle='rgba(255,240,210,.18)'; g.fillRect(W*.1,DB,W*.8,(DF-DB)*.4);
  // behind the throne: a screen, gold on red; and the throne's seat
  g.fillStyle='#8a2418'; g.fillRect(W*.42,H*.27,W*.16,DB-H*.27+H*.01); g.fillStyle='rgba(225,180,80,.85)'; g.fillRect(W*.43,H*.285,W*.14,DB-H*.3);
  for(let i=0;i<4;i++){ const x=W*(.435+i*.035); brush(g,[[x,H*.29],[x,DB-H*.02]],1,.5); brush(g,[[x+W*.005,H*.33],[x+W*.015,H*.31],[x+W*.025,H*.34]],1,.5); }
  g.fillStyle='#6a1c12'; g.fillRect(W*.455,DY-H*.075,W*.09,H*.075); g.fillStyle='#d8a848'; g.fillRect(W*.455,DY-H*.075,W*.09,H*.008);
  // the columns and the roof: red posts, a deep yellow-glazed roof with the eaves sweeping up at the corners
  for(const x of [.16,.3,.7,.84]){ g.fillStyle='#a82a1e'; g.fillRect(W*x-W*.009,H*.19,W*.018,DB-H*.19+H*.01); g.fillStyle='rgba(0,0,0,.2)'; g.fillRect(W*x+W*.003,H*.19,W*.006,DB-H*.19); }
  g.fillStyle='#2a6a5a'; g.fillRect(W*.12,H*.175,W*.76,H*.025); for(let x=W*.12;x<W*.88;x+=W*.03){ g.fillStyle=['#2a6a5a','#3a5a8a','#c8a040'][(x/W*33|0)%3]; g.fillRect(x,H*.178,W*.028,H*.018); }   // the painted beam
  g.fillStyle='#d8a838'; g.beginPath(); g.moveTo(W*.02,H*.12); g.quadraticCurveTo(W*.1,H*.17,W*.14,H*.18); g.lineTo(W*.86,H*.18); g.quadraticCurveTo(W*.9,H*.17,W*.98,H*.12);
  g.quadraticCurveTo(W*.86,H*.13,W*.76,H*.06); g.lineTo(W*.24,H*.06); g.quadraticCurveTo(W*.14,H*.13,W*.02,H*.12); g.fill();
  g.strokeStyle='rgba(150,100,30,.6)'; g.lineWidth=Math.max(1,W*.0018); for(let i=0;i<=40;i++){ const u=i/40, xt=W*(.24+.52*u), xb=W*(.14+.72*u); g.beginPath(); g.moveTo(xt,H*.065); g.lineTo(xb,H*.175); g.stroke(); }
  brush(g,[[W*.02,H*.12],[W*.14,H*.18],[W*.86,H*.18],[W*.98,H*.12]],Math.max(3,H*.008),.85); brush(g,[[W*.24,H*.06],[W*.76,H*.06]],Math.max(4,H*.012),.9);
  for(const x of [.24,.76]){ g.fillStyle=SUMI.ink(.9); g.beginPath(); g.moveTo(W*x,H*.06); g.quadraticCurveTo(W*x+(x<.5?-1:1)*W*.01,H*.035,W*x+(x<.5?1:-1)*W*.006,H*.025); g.lineTo(W*x+(x<.5?1:-1)*W*.02,H*.06); g.fill(); }   // the ridge-end beasts
  // silk banners hanging from the beam
  for(const x of [.22,.78]){ g.fillStyle='rgba(200,50,40,.85)'; g.beginPath(); g.moveTo(W*x-W*.015,H*.2); g.lineTo(W*x+W*.015,H*.2); g.lineTo(W*x+W*.012,H*.36); g.lineTo(W*x,H*.38); g.lineTo(W*x-W*.012,H*.36); g.closePath(); g.fill(); }
  // the shade under the roof, where the masked one stands
  const sg=g.createLinearGradient(0,H*.18,0,DB); sg.addColorStop(0,'rgba(40,24,18,.35)'); sg.addColorStop(1,'rgba(40,24,18,0)'); g.fillStyle=sg; g.fillRect(W*.12,H*.18,W*.76,DB-H*.18);
  // the crowd below, kneeling, seen from behind
  const robes=['#3a4a62','#5a4a3a','#6a6a72','#7a6040','#4a5a4a','#8a4a3a','#5a5a6a','#a08050'];
  for(const [ry,sc,n] of [[.84,.72,22],[.92,.86,18],[1.0,1.0,15]]){ const s=W*.022*sc;
    for(let k=0;k<n;k++){ const x=W*(k+.5)/n+(R()-.5)*s*1.2, y=H*ry+(R()-.5)*s*.3, col=robes[(k*5+Math.round(ry*10))%robes.length];
      if(ry<.9&&Math.abs(x-W*.5)<W*.09) continue;                                                                                 // the stair's foot is kept clear
      g.fillStyle='rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(x,y+s*.9,s*1.25,s*.3,0,0,7); g.fill();
      g.fillStyle=col; g.beginPath(); g.moveTo(x-s*1.15,y+s*.95); g.quadraticCurveTo(x-s*1.1,y-s*.35,x,y-s*.45); g.quadraticCurveTo(x+s*1.1,y-s*.35,x+s*1.15,y+s*.95); g.closePath(); g.fill();
      g.fillStyle='rgba(255,255,255,.12)'; g.fillRect(x-s*.9,y-s*.05,s*.5,s*.8); g.fillStyle='rgba(0,0,0,.18)'; g.fillRect(x+s*.2,y,s*.8,s*.9);
      g.fillStyle='#e8d8b8'; g.fillRect(x-s*.12,y-s*.5,s*.24,s*.1);
      g.fillStyle='#1e1a18'; g.beginPath(); g.ellipse(x,y-s*.62,s*.42,s*.36,0,0,7); g.fill(); g.beginPath(); g.ellipse(x,y-s*.98,s*.16,s*.14,0,0,7); g.fill();
      if(R()<.22){ g.fillStyle='#141210'; g.fillRect(x-s*.38,y-s*1.08,s*.76,s*.3); g.fillRect(x-s*1.1,y-s*.92,s*2.2,s*.07); } } } };
// drawn over the cast: the deck's front beam and the vermilion balustrade, so the three stand behind it
KM.front=(g,W,H)=>{ const DF=H*(KM.DY+.035), top=DF-H*.07;
  g.fillStyle='#5a2a1a'; g.fillRect(W*.1,DF-H*.008,W*.8,H*.02);
  g.fillStyle='#b8321e'; g.fillRect(W*.1,top,W*.8,H*.012); g.fillRect(W*.1,DF-H*.024,W*.8,H*.01);
  for(let i=0;i<=32;i++){ const x=W*.1+W*.8*i/32; if(x>W*.415&&x<W*.585) continue; g.fillStyle=i%4?'#a82a1a':'#8a2014'; g.fillRect(x-W*.003,top,W*.006,DF-top); if(i%4===0){ g.fillStyle='#d8a848'; g.fillRect(x-W*.005,top-H*.008,W*.01,H*.01); } }
  g.fillStyle='rgba(0,0,0,.18)'; g.fillRect(W*.1,top+H*.012,W*.8,H*.004); };
KM.cg=function(){ const gs=JA7_mask(cgChibi(LOOK_GUOSHI,'stand',null,null,null,false),.43);
  PixCG.open({ink:(g,W,H,R)=>KM.paint(g,W,H,R),
    cast:[{cv:gs, x:.35, y:KM.DY, s:.24, face:1},{look:LOOK_TIANZI, x:.5, y:KM.DY-.005, pose:'sit', face:1, s:.85},{look:LOOK_XIAO, x:.65, y:KM.DY, pose:'stand', face:-1, s:.85}],
    title:'开幕式的高台', small:'第三章 · 京城', seed:7501});
  PixCG.cur.front=KM.front; };

/* ---------- where the 大比 stands today ----------
   'open' before the draw; 'eve' the rest of the opening day (first round tomorrow); 'fight' a day you still have a round
   to fight; 'rest' after today's round (the next one tomorrow); 'over' once the final is won. (Saves from before the
   opening day was recorded count as already past it.) */
KM.phase=()=>{ if(!S.flags.c3_km_done) return 'open'; const c=KM.st(); if((c.round||0)>=4) return 'over';
  if(c.openDay===S.day) return 'eve'; if(c.day===S.day) return 'rest'; return 'fight'; };
// 大师姐 and 苏小棠 on the fighting days (the square and 四方馆 alike)
KM.day=id=>{ const ph=KM.phase(), c=LT.st(), r=LT.ROUND[c.round], nm=ph==='over'?'':KM.NAME[LT.opp()].replace(/（.*/,'');
  if(id==='xie') return ph==='eve'?[['谢霁月','明天，第一轮。'],['谢霁月','别想高台上的事。先赢。']]
    :ph==='fight'?[['谢霁月',`今天，${r}。对面是${nm}。`],S.flags.c3_lt_lost?['谢霁月','输过一回不要紧。这一回，看清楚了再出手。']:['谢霁月',c.round?'上台之前，先把气息调匀。':'别想高台上的事。先赢。']]
    :ph==='rest'?[['谢霁月','今天这一场，赢得不难看。'],['谢霁月',`明天，${r}。回去睡觉。`]]
    :[['谢霁月','（她看着你，过了一会儿）……魁首。'],['谢霁月','别得意。京城的事，还没完。']];
  if(ph==='over') return [['苏小棠','{名}是魁首了！我要写信告诉谷里所有人！']];
  if(c.round>=2) return [['苏小棠','我说了不难过的……真的。'],['苏小棠',`{名}，你一定要站到最上面。`]];
  if(c.round===1&&ph==='fight') return [['苏小棠','（她攥着衣角）……今天，是我们俩了。'],['苏小棠','{名}，你不许让我。']];
  return [['苏小棠',ph==='rest'?'明天……就是我们俩了。':'第二轮……'],['苏小棠','{名}，你不许让我。']]; };

/* ---------- talking on the square ---------- */
KM.TALK={
  km_libu:()=>{ const ph=KM.phase(), r=LT.ROUND[LT.st().round]; return ph==='open'?[['礼部尚书','肃静。']]:[['礼部尚书',ph==='eve'?'明日辰时开擂。':ph==='fight'?`今日，${r}。上擂台去吧。`:ph==='rest'?`今日的比完了。明日辰时，${r}。`:'大比已经结束了。'],{run:()=>KM.show()}]; },
  km_g1:[['禁军','（他目不斜视）……']], km_g2:[['禁军','退后。高台三丈之内，不得靠近。']],
  // the opening day's lines (the 天子 and the mask on the 高台) only that day; on the fighting days the 高台 is empty
  sf_lin:()=>KM.phase()==='eve'?[['林沧','（他抱着剑，看着高台）……天子跟前站着的那个，修为看不透。'],['林沧','比我高。']]:[['林沧','（他抱着剑，看着擂台）……'],['林沧','我在等。等你，或者等下一个。']],
  sf_wulan:()=>KM.phase()==='eve'?[['乌兰','阿毛今天一直在发抖。'],['乌兰','它怕那个戴面具的。']]:[['乌兰','阿毛今天好多了。'],['乌兰','那个戴面具的，没再来。']],
  sf_wenxuan:()=>KM.phase()==='eve'?[['温玄','那面镜子……不是用来照人的。'],['温玄','（他把铜钱收了起来，没有再算）']]:[['温玄','（他在数台下的人）……每天，都少几个。'],['温玄','我算不出，他们去了哪儿。']],
  // 程小剑 and 卜小鱼 are in the draw too (one of them is often your first opponent); the crowd bets on whoever is the
  // strongest name in this year's draw (林沧 when he's in it — he isn't when you are 青云剑宗 yourself)
  sf_cheng:()=>KM.first()==='sf_cheng'?[['程小剑','（他攥着竹签，脸都白了）第一轮……是你。'],['程小剑','我、我会尽力的！']]:[['程小剑','我第一回上这么大的擂台……'],['程小剑','腿有点软。']],
  sf_bu:()=>KM.first()==='sf_bu'?[['卜小鱼','我算过了。第一轮，是你和我。'],['卜小鱼','……卦上说我会输。不过我还是要打的。']]:[['卜小鱼','我给自己算了一卦。'],['卜小鱼','……不告诉你。']],
  km_c1:()=>[['看热闹的人',`我押了${KM.fav()}！一两银子呢！`]], km_c2:[['看热闹的人','哪个是谢霁月？……哦，果然长得好看。'],['看热闹的人','怪不得。']],
  km_c3:()=>KM.phase()==='eve'?[['看热闹的人','老汉看了三届大比了。头一回见天子亲自来。']]:[['看热闹的人','老汉看了三届大比了。'],['看热闹的人','今年这届，打得最狠。']], km_c4:[['看热闹的人','我家小子说，长大了也要当仙人。'],['看热闹的人','……我才不让。']],
};
On.talk(id=>{ if(RT.mapId!=='jc_gongyuan') return false; const F=S.flags;
  if(id==='xie'){ C3.menu('xie',F.c3_km_done?KM.day('xie'):[['谢霁月','跪下。']]); return true; }
  if(id==='tang'){ C3.menu('tang',F.c3_km_done?KM.day('tang'):[['苏小棠','好多人……']]); return true; }
  const L=KM.TALK[id]; if(!L) return false; UI.say(typeof L==='function'?L():L); return true; });
On.act('kmgaotai',o=>UI.say(S.flags.c3_km_done?[['旁白','高台上已经空了。华盖底下，只剩一把明黄的椅子。']]:[['旁白','高台。']]));
On.act('kmleitai',o=>S.flags.c3_km_done?LT.go():UI.say([['旁白','擂台是新砌的。青石面上铺着红毡，四角立着红柱子，拴着一圈金绳。'],['旁白','明天，你要站上去。']]));
On.act('kmjian',o=>UI.say([['旁白','观天鉴。一人多高的铜镜，镜面雪亮。'],['旁白','你凑近了看。镜子里的你，好像比你自己，慢了半拍。']]));
On.theme(id=>id==='jc_gongyuan'?'village':null);
{ const _d=Portal.dests; Portal.dests=function(){ const l=_d.call(Portal); if(S.flags.c3_km_done&&RT.mapId!=='jc_gongyuan') l.push({name:'京城 · 贡院前', map:'jc_gongyuan', x:13, y:21}); return l; }; }

/* ---------- the quests ---------- */
{ const q=QUESTS.find(q=>q.id==='c3k'); Object.assign(q,{check:s=>!!s.flags.c3_km_done,
    progress:s=>!s.flags.c3_km_call?'天亮了，在四方馆等礼部来接':'贡院前：开幕式',
    target:s=>!s.flags.c3_km_call?['jc_sifang',11,7,'礼部小吏']:['jc_gongyuan',14,8,'礼部尚书']}); }
QUESTS.splice(QUESTS.findIndex(q=>q.id==='c3k')+1,0,
  {id:'c3l', title:'擂台赛', desc:'四宗大比，每日一轮。第二轮是苏小棠。', check:s=>false,
    progress:s=>'擂台赛 · 第一轮（之后的剧情正在做）', target:s=>['jc_gongyuan',14,14,'擂台']});
