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
  ['乌兰','（小声）……记这个做什么？'],
  ['温玄','（他盯着那面镜子，没有说话，手里的铜钱攥得紧紧的）'],
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
  ['苏小棠','（她看着对阵表，愣住了）……第二轮，是我和你。'],
  ['苏小棠','（她笑了一下，笑得有点勉强）那、那我要好好准备了！'],
  ['旁白','高台上，萧烬拍了两下手。没有人知道他在为谁鼓掌。'],
  {flag:'c3_km_done'},
  ['旁白','（大比明日开擂。对阵表可以找礼部尚书再看。）']];

/* ---------- 插画「开幕式的高台」 ---------- */
KM.cg=function(){ const gs=JA7_mask(cgChibi(LOOK_GUOSHI,'stand',null,null,null,false),.43);
  PixCG.open({ink:(g,W,H,R)=>{ Land.sky(g,W,H,['#8ab4d8','#a8c8e0','#c8dce8','#e0e8e8','#ece8d8']);
      // the palace roofs far off, and the 贡院's wall
      for(let k=0;k<6;k++){ const x=W*(.05+k*.18), y=H*.34; g.fillStyle='rgba(90,70,70,.45)'; g.beginPath(); g.moveTo(x-W*.09,y); g.quadraticCurveTo(x-W*.04,y-H*.02,x,y-H*.06); g.quadraticCurveTo(x+W*.04,y-H*.02,x+W*.09,y); g.closePath(); g.fill(); g.fillRect(x-W*.06,y,W*.12,H*.04); }
      g.fillStyle='#8a5a4a'; g.fillRect(0,H*.38,W,H*.06); g.fillStyle='#6a3a30'; g.fillRect(0,H*.38,W,H*.008);
      // the 高台: stone base, red balustrade, yellow canopy on red posts, the throne
      g.fillStyle='#7a746a'; g.fillRect(W*.16,H*.58,W*.68,H*.42); for(let r=0;r<6;r++) for(let k=0;k<17;k++){ g.fillStyle=(r+k)%2?'#8a847a':'#827c72'; g.fillRect(W*(.16+k*.04)+(r%2?W*.02:0),H*(.6+r*.065),W*.038,H*.06); }
      g.fillStyle='#5a3a24'; g.fillRect(W*.14,H*.56,W*.72,H*.03); g.fillStyle='#9a2a22'; g.fillRect(W*.14,H*.5,W*.72,H*.012); for(let x=W*.15;x<W*.86;x+=W*.02) g.fillRect(x,H*.5,W*.005,H*.06);
      g.fillStyle='#9a2a22'; g.fillRect(W*.2,H*.12,W*.012,H*.44); g.fillRect(W*.788,H*.12,W*.012,H*.44);
      g.fillStyle='#e0aa3e'; g.beginPath(); g.moveTo(W*.1,H*.16); g.quadraticCurveTo(W*.5,H*.02,W*.9,H*.16); g.lineTo(W*.82,H*.18); g.lineTo(W*.18,H*.18); g.closePath(); g.fill();
      g.fillStyle='#b8862d'; g.fillRect(W*.18,H*.18,W*.64,H*.012); for(let x=W*.19;x<W*.81;x+=W*.03){ g.beginPath(); g.moveTo(x,H*.19); g.lineTo(x+W*.03,H*.19); g.lineTo(x+W*.015,H*.23); g.closePath(); g.fill(); }
      g.fillStyle='#5e2018'; g.fillRect(W*.45,H*.28,W*.1,H*.22); g.fillStyle='#d8b048'; g.fillRect(W*.455,H*.29,W*.09,H*.04);
      // the shade at the back of the stand, where the masked one stands
      const sg=g.createLinearGradient(0,H*.18,0,H*.5); sg.addColorStop(0,'rgba(30,20,20,.35)'); sg.addColorStop(1,'rgba(30,20,20,0)'); g.fillStyle=sg; g.fillRect(W*.2,H*.18,W*.6,H*.32);
      // the crowd's heads below, kneeling
      for(let k=0;k<60;k++){ const x=R()*W, y=H*(.9+R()*.1); g.fillStyle=['#2a2420','#3a3028','#22201e'][k%3]; g.beginPath(); g.ellipse(x,y,W*.014,H*.022,0,0,7); g.fill(); } },
    cast:[{cv:gs, x:.36, y:.49, s:.34, face:1},{look:LOOK_TIANZI, x:.5, y:.52, pose:'sit', face:1, s:.9},{look:LOOK_XIAO, x:.64, y:.52, pose:'stand', face:-1, s:.9}],
    title:'开幕式的高台', small:'第三章 · 京城', seed:7501}); };

/* ---------- talking on the square ---------- */
KM.TALK={
  km_libu:()=>S.flags.c3_km_done?[['礼部尚书','明日辰时开擂。'],{run:()=>KM.show()}]:[['礼部尚书','肃静。']],
  km_g1:[['禁军','（他目不斜视）……']], km_g2:[['禁军','退后。高台三丈之内，不得靠近。']],
  sf_lin:[['林沧','（他抱着剑，看着高台）……天子跟前站着的那个，修为看不透。'],['林沧','比我高。']],
  sf_wulan:[['乌兰','阿毛今天一直在发抖。'],['乌兰','它怕那个戴面具的。']],
  sf_wenxuan:[['温玄','那面镜子……不是用来照人的。'],['温玄','（他把铜钱收了起来，没有再算）']],
  sf_cheng:[['程小剑','我没抽上签……我是来给师兄喊加油的！']], sf_bu:[['卜小鱼','我也是来看热闹的。'],['卜小鱼','你第一轮的对手，好像很弱哦。']],
  km_c1:[['看热闹的人','我押了林沧！一两银子呢！']], km_c2:[['看热闹的人','哪个是谢霁月？……哦，果然长得好看。'],['看热闹的人','怪不得。']],
  km_c3:[['看热闹的人','老汉看了三届大比了。头一回见天子亲自来。']], km_c4:[['看热闹的人','我家小子说，长大了也要当仙人。'],['看热闹的人','……我才不让。']],
};
On.talk(id=>{ if(RT.mapId!=='jc_gongyuan') return false; const F=S.flags;
  if(id==='xie'){ C3.menu('xie',F.c3_km_done?[['谢霁月','明天，第一轮。'],['谢霁月','别想高台上的事。先赢。']]:[['谢霁月','跪下。']]); return true; }
  if(id==='tang'){ C3.menu('tang',F.c3_km_done?[['苏小棠','第二轮……'],['苏小棠','{名}，你不许让我。']]:[['苏小棠','好多人……']]); return true; }
  const L=KM.TALK[id]; if(!L) return false; UI.say(typeof L==='function'?L():L); return true; });
On.act('kmgaotai',o=>UI.say(S.flags.c3_km_done?[['旁白','高台上已经空了。华盖底下，只剩一把明黄的椅子。']]:[['旁白','高台。']]));
On.act('kmleitai',o=>UI.say([['旁白','擂台是新砌的。青石面上铺着红毡，四角立着红柱子，拴着一圈金绳。'],['旁白','明天，你要站上去。']]));
On.act('kmjian',o=>UI.say([['旁白','观天鉴。一人多高的铜镜，镜面雪亮。'],['旁白','你凑近了看。镜子里的你，好像比你自己，慢了半拍。']]));
On.theme(id=>id==='jc_gongyuan'?'village':null);
{ const _d=Portal.dests; Portal.dests=function(){ const l=_d.call(Portal); if(S.flags.c3_km_done&&RT.mapId!=='jc_gongyuan') l.push({name:'京城 · 贡院前', map:'jc_gongyuan', x:13, y:21}); return l; }; }

/* ---------- the quests ---------- */
{ const q=QUESTS.find(q=>q.id==='c3k'); Object.assign(q,{check:s=>!!s.flags.c3_km_done,
    progress:s=>!s.flags.c3_km_call?'天亮了，在四方馆等礼部来接':'贡院前：开幕式',
    target:s=>!s.flags.c3_km_call?['jc_sifang',15,7,'礼部小吏']:['jc_gongyuan',14,8,'礼部尚书']}); }
QUESTS.splice(QUESTS.findIndex(q=>q.id==='c3k')+1,0,
  {id:'c3l', title:'擂台赛', desc:'四宗大比，每日一轮。第二轮是苏小棠。', check:s=>false,
    progress:s=>'擂台赛 · 第一轮（之后的剧情正在做）', target:s=>['jc_gongyuan',14,14,'擂台']});
