/* ============================================================
   山海问道 · 第二章 第五幕「饿鬼洞」(前半) — 二师兄's footprints lead south of the camp, through a wood whose bark has been
   gnawed off tree by tree. At the mouth of a cave stands 顾长歌, who has followed 饕餮 for ten years. Deep inside, 何满仓
   crouches with his back to you over a beast he has eaten, crying that he is hungry. The 八卦镜 burns and shows where the
   hunger came from: 丰年村 in the famine year, the half 馒头 his mother gave him, the cellar she pushed him into, the fire,
   and the thing in the dark that answered 「我也是」. Then 饕餮 stands up out of his shadow, and 顾长歌's sword shakes.
   (后半: the fight with 饕餮, pulling its soul out of him, and the ending.)
   ============================================================ */
Object.assign(SPR, {
  i_bun:['............','....cccc....','..cczzzccc..','.czzwwzzzcc.','.czwwwwzzzc.','.ccccccccccc','............'],
  mj_deadtree:['......t.....t...','.....tt...tt....','......t..tt.....','.......tttt.....','........tt..t...','.......ttttt....','........tt......','........tt......','........tz......','........tt......','.......ttzt.....','........tt......','.......tttt.....','......tNttNt....'],
  mj_bones:['................','................','................','................','................','................','................','.....z..........','....zzz...zz....','..zzezzzzzezz...','...zz.z.z.zz....','.....zzz........','......z..zz.....'],
  mj_bun:['................','................','................','................','................','................','................','................','................','......cccc......','....cczzzcc.....','....czwwzzc.....','....cccccccc....'],
  mj_gnaw:['................','................','..eeee..........','.eEeeEee...ee...','eeeEeeeEee.eEe..','.eeeeeEeee.eee..','..eEeeee........','...ee...........'],
});
Object.assign(ITEMS, {
  c2_bun:{name:'半个馒头', icon:'i_bun', quest:true, keep:true, desc:'二师兄掉在南边林子里的半个馒头，硬得像石头。他总揣在袖子里，你从来没见他吃过。'},
});

/* ---------- tiles: dry dead earth (D), the cave floor (K), rock (X, solid) ---------- */
{ const _tc=tileCanvas; tileCanvas=function(ch,v,frame){ if(!'DKX'.includes(ch)) return _tc(ch,v,frame);
    const key=ch+v+(frame||0); if(TILEC[key]) return TILEC[key];
    const c=document.createElement('canvas'); c.width=c.height=TILE; const g=c.getContext('2d'), R=rng(ch.charCodeAt(0)*977+v*131);
    if(ch==='D'){ g.fillStyle='#8f7a58'; g.fillRect(0,0,16,16); for(let i=0;i<10;i++){ g.fillStyle=R()<.5?'#9c875f':'#7f6a4a'; g.fillRect(R()*15|0,R()*15|0,1+(R()*2|0),1); }
      g.fillStyle='#5e4c34'; let x=R()*16|0, y=R()*16|0; for(let k=0;k<7;k++){ g.fillRect(x,y,1,1); x+=R()<.5?1:-1; y+=R()<.6?1:0; x=Math.max(0,Math.min(15,x)); y=Math.min(15,y); } }
    if(ch==='K'){ g.fillStyle='#3b3434'; g.fillRect(0,0,16,16); for(let i=0;i<12;i++){ g.fillStyle=R()<.5?'#463e3d':'#2f2929'; g.fillRect(R()*15|0,R()*15|0,1+(R()*3|0),1); }
      if(R()<.2){ g.fillStyle='#d8d0c4'; g.fillRect(R()*13|0,R()*14|0,3,1); } }
    if(ch==='X'){ g.fillStyle='#231d1d'; g.fillRect(0,0,16,16); for(let i=0;i<5;i++){ const x=R()*12|0, y=R()*12|0, w=3+(R()*5|0); g.fillStyle='#3a302e'; g.fillRect(x,y,w,2); g.fillStyle='#4c403c'; g.fillRect(x,y,w,1); } }
    return TILEC[key]=c; }; }
{ const _em=enterMap; enterMap=function(id,x,y){ const r=_em(id,x,y);
    if(id==='mj_south'||id==='mj_cave'){ const m=RT.map; for(let yy=0;yy<m.h;yy++) for(let xx=0;xx<m.w;xx++) if(m.ground[yy][xx]==='X') RT.solid[yy][xx]=true;
      if(id==='mj_south'&&!S.flags.c2_south_in) setTimeout(()=>{ if(RT.mapId==='mj_south'&&!S.flags.c2_south_in) UI.say(C2Y.south); },350);
      if(id==='mj_cave'&&!S.flags.c2_cave_in) setTimeout(()=>{ if(RT.mapId==='mj_cave'&&!S.flags.c2_cave_in) UI.say(C2Y.cave); },350); }
    return r; }; }

/* ---------- the camp opens to the south once 二师兄 is gone ---------- */
{ const m=MAPS.mj_camp, G=m.ground.map(r=>r.split('')); G[15][11]='='; G[15][12]='='; G[14][11]='='; G[14][12]='='; m.ground=G.map(r=>r.join(''));
  m.objects=m.objects.filter(o=>!((o.type==='pine'||o.type==='tree'||o.type==='bush')&&o.x>=10&&o.x<=13&&o.y>=13));
  m.objects.push({type:'mj_reeds', x:11, y:15, spr:'mj_reeds', act:'c2ysouth', cond:s=>!s.flags.c2_man_gone},{type:'mj_reeds', x:12, y:15, spr:'mj_reeds', act:'c2ysouth', cond:s=>!s.flags.c2_man_gone});
  m.exits.push({x:11,y:15,to:'mj_south',tx:11,ty:1},{x:12,y:15,to:'mj_south',tx:12,ty:1}); }

/* ---------- 南边的林子: gnawed white trees, bones, his half 馒头, and 顾长歌 at the mouth of the cave ---------- */
{ const W=22, H=18, G=[...Array(H)].map((_,y)=>[...Array(W)].map((_,x)=>(x===0||y===0||x===W-1||y===H-1)?'W':'D'));
  const line=(x0,y0,x1,y1)=>{ for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++) for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++) G[y][x]='='; };
  line(11,0,12,4); line(6,4,12,4); line(6,4,7,10); line(6,10,15,10); line(14,10,15,13); line(11,13,15,13); line(11,13,12,17);
  for(let y=14;y<H;y++) for(let x=1;x<W-1;x++) if(G[y][x]!=='=') G[y][x]='X';
  for(let x=8;x<=15;x++) if(G[14][x]!=='=') G[14][x]='X';
  const objects=[
    {type:'mj_deadtree', x:3, y:3, spr:'mj_deadtree', act:'c2ytrace', ti:0},
    {type:'mj_bones', x:9, y:8, spr:'mj_bones', act:'c2ytrace', ti:1},
    {type:'mj_bun', x:5, y:7, spr:'mj_bun', act:'c2ybun', cond:s=>!s.flags.c2_bun},
    {type:'mj_gnaw', x:17, y:11, spr:'mj_gnaw', act:'c2ytrace', ti:2},
    {type:'npc', id:'ge', x:11, y:13, look:LOOK_GE, name:'顾长歌', act:'talk', cond:s=>!s.flags.c2_ge_met},
  ];
  for(const [x,y] of [[2,6],[4,11],[9,2],[15,2],[18,5],[19,8],[16,6],[3,13],[9,12],[18,13],[13,7],[2,9]]) objects.push({type:'mj_deadtree', x, y, spr:'mj_deadtree'});
  MAPS.mj_south={ name:'秘境 · 南边的林子', w:W, h:H, ground:G.map(r=>r.join('')), objects,
    exits:[{x:11,y:0,to:'mj_camp',tx:11,ty:14},{x:12,y:0,to:'mj_camp',tx:12,ty:14},{x:11,y:17,to:'mj_cave',tx:10,ty:14},{x:12,y:17,to:'mj_cave',tx:10,ty:14}] }; }

/* ---------- 饿鬼洞: a winding tunnel to a chamber; dark beyond the torchlight ---------- */
{ const W=20, H=16, G=[...Array(H)].map(()=>[...Array(W)].map(()=>'X'));
  const floor=(x0,y0,x1,y1)=>{ for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++) for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++) G[y][x]='K'; };
  floor(9,9,11,15); floor(4,9,11,11); floor(4,5,6,11); floor(4,5,9,7);
  for(let y=1;y<=7;y++) for(let x=6;x<=17;x++){ const d=((x-12)/5.6)**2+((y-4)/3.2)**2; if(d<=1) G[y][x]='K'; }
  const objects=[
    {type:'mj_bones', x:5, y:10, spr:'mj_bones'},{type:'mj_bones', x:11, y:12, spr:'mj_bones'},{type:'mj_bones', x:15, y:6, spr:'mj_bones'},{type:'mj_bones', x:8, y:3, spr:'mj_bones'},
    {type:'npc', id:'man', x:12, y:3, look:LOOK_MAN, name:'何满仓', act:'talk', cond:s=>!s.flags.c2_awake},
  ];
  MAPS.mj_cave={ name:'秘境 · 饿鬼洞', w:W, h:H, ground:G.map(r=>r.join('')), objects, exits:[{x:10,y:15,to:'mj_south',tx:11,ty:16}] }; }

// the dark: torchlight around you, and the word 饿 drifting in it
const C2Y_WORDS=['饿','好饿','饿啊','还要','不够','饿'];
{ const _r=render; render=function(){ _r(); if((RT.mapId!=='mj_cave'&&RT.mapId!=='mj_south')||!RT.map) return;
    const g=ctx, W=cv.width, H=cv.height, Z=RT.scale*RT.dpr, T=TILE*Z, ox=Math.round(-RT.cam.x*Z), oy=Math.round(-RT.cam.y*Z);
    if(RT.mapId==='mj_south'){ g.fillStyle='rgba(70,60,50,.18)'; g.fillRect(0,0,W,H); return; }
    const px=ox+(RT.fx+.5)*T, py=oy+(RT.fy+.5)*T, fl=1+Math.sin(RT.t*9)*.03+Math.sin(RT.t*13)*.02;
    const gr=g.createRadialGradient(px,py,T*1.2*fl,px,py,T*4.6*fl); gr.addColorStop(0,'rgba(10,6,6,0)'); gr.addColorStop(.6,'rgba(10,6,6,.72)'); gr.addColorStop(1,'rgba(10,6,6,.94)');
    g.fillStyle=gr; g.fillRect(0,0,W,H); g.fillStyle='rgba(255,140,60,.06)'; g.beginPath(); g.arc(px,py,T*2.4*fl,0,7); g.fill();
    if(!S.flags.c2_awake) for(let i=0;i<C2Y_WORDS.length;i++){ const u=(RT.t*.05+i*.17)%1, x=ox+(5+((i*5.3)%11)+Math.sin(RT.t*.4+i)*.5)*T, y=oy+(2+((i*3.7)%9)-u*1.2)*T, al=Math.sin(u*Math.PI)*.4;
      g.save(); g.globalAlpha=al; g.font=`${Math.round(T*.6)}px "Ma Shan Zheng",KaiTi,serif`; g.textAlign='center'; g.fillStyle='#c8a090'; g.fillText(C2Y_WORDS[i],x,y); g.restore(); }
    for(const [ex,ey,k] of [[2,3,0],[17,10,1],[15,13,2]]){ if((Math.floor(RT.t*.7+k*1.3)%4)===0) continue; g.fillStyle='rgba(220,60,40,.8)'; const x=ox+ex*T, y=oy+ey*T; g.fillRect(x,y,Z*1.5,Z); g.fillRect(x+Z*4,y,Z*1.5,Z); } }; }

/* ---------- the scenes ---------- */
const C2Y = {
  south:[
    ['旁白','营地南边的林子，比雾林还要静。'],
    ['旁白','树皮被剥光了，一棵挨着一棵，白森森地立在雾里，像一排排站着的骨头。'],
    ['谢霁月','……这是牙印。'],
    ['旁白','她摸着树干上的痕迹。牙印很小，很密，一圈压着一圈，像是有人抱着树，一口一口地啃。'],
    ['我','（二师兄……）'],
    {flag:'c2_south_in'},
    ['旁白','（脚印和那道湿痕一直往南，通向林子尽头的山坳。）']],
  traces:[
    [['旁白','这棵树连根都被刨了出来，根须上全是牙印。'],['谢霁月','秘境里的妖兽，不会这样吃东西。']],
    [['旁白','一只鹿妖的骨头，干干净净地码在路边。骨头缝里的髓，都被吸空了。'],['旁白','骨头摆得整整齐齐，像是吃完了，还舍不得扔。']],
    [['旁白','一堆碎石头，上面也有牙印。'],['谢霁月','……连石头都啃。'],['旁白','她没有再往下说。']]],
  bun:[
    ['旁白','泥地里有半个馒头，被踩扁了，沾着土，硬得像石头。'],
    ['旁白','是二师兄的。他总在袖子里揣着半个馒头。你从来没见他吃过。'],
    ['我','（连这个都掉了……）'],
    {give:{c2_bun:1}}, {flag:'c2_bun'}],
  meet:()=>{ const F=S.flags; return [
    ['旁白','山坳尽头是一个洞口，黑漆漆的，往外吐着一股说不出的味道。像是饭馊了，又像是血。'],
    ['旁白','洞口蹲着一个人，背着剑，正低头看地上的脚印。'],
    ['顾长歌','……谁。'],
    {run:()=>C2Y.meetCG()},
    ['旁白','他回过头来。'],
    ['顾长歌','……{名}？'],
    ...(F.ge_promise?[['顾长歌','我说过，北边见。……没想到，是在这里见。']]:[['顾长歌','你怎么会在这里。']]),
    ['我','长歌！你怎么……'],
    ['顾长歌','我一路追着饕餮的踪迹。三个月前，它在北边吞了两个村子，然后就没了动静。'],
    ['顾长歌','十天前，踪迹忽然又出现了。在这座秘境里。'],
    ['谢霁月','（剑出鞘半寸）你是谁。'],
    ['顾长歌','散修，顾长歌。'],
    ['顾长歌','（他看了一眼她的剑）……剑不错。'],
    ['谢霁月','……'],
    ['我','大师姐，他是我在桃源镇的朋友。'],
    ['旁白','大师姐的剑收了回去。手还按在剑柄上。'],
    ['顾长歌','你们在找人？'],
    ['我','我们的二师兄。他昨晚一个人往这边来了。'],
    ['顾长歌','（他看着洞口，沉默了一会儿）'],
    ['顾长歌','这些牙印，我追了十年，见过很多次。'],
    ['顾长歌','是饕餮吃东西的样子。'],
    ['谢霁月','不可能。满仓他——'],
    ['顾长歌','我没说是他。'],
    ['顾长歌','……我只说，洞里有饕餮的味道。'],
    ...(F.ge_mask?[['我','（你想起他在篝火边说过的话：那天晚上，火光里站着一个戴青铜面具的人。面具上的纹路，像极了饕餮。）']]:[]),
    ['顾长歌','走吧。我和你们一起进去。'],
    {run:()=>PixCG.close()},
    {flag:'c2_ge_met'},
    {run:()=>{ enterMap('mj_south',S.x,S.y); UI.hud(); }}]; },
  cave:[
    ['旁白','洞里很黑。顾长歌点起一支火折子，火光只照得见脚下三步远。'],
    ['旁白','越往里走，那股馊味越重。脚边全是骨头，大的、小的，都啃得干干净净。'],
    ['旁白','黑暗深处，传来一阵声音。'],
    ['旁白','咯吱。咯吱。像是有人在嚼什么很硬的东西。'],
    ['？？？','……饿……'],
    ['谢霁月','（很轻）满仓？'],
    {flag:'c2_cave_in'}],
  // the big scene: him, the mirror, where the hunger came from, and what wakes up
  found:()=>{ const F=S.flags, shi=(SECTS[S.sect]||{master:{name:'师尊'}}).master.name; return [
    {run:()=>C2Y.caveCG()},
    ['旁白','火光照到洞底。一个瘦小的背影蹲在那里，背对着你们。'],
    ['旁白','他面前躺着一只山猪大小的妖兽。已经不动了。'],
    ['旁白','咯吱。咯吱。'],
    ['何满仓','饿啊……饿啊……'],
    ['谢霁月','……满仓。'],
    {run:()=>{ C2Y.turned=1; }},
    ['旁白','他回过头来。'],
    ['旁白','满嘴都是血。眼睛是空的，像两口枯井。'],
    ['何满仓','……{称}？大师姐？'],
    ['旁白','他看看你们，又低头看看手里的东西，像是第一次看见它。'],
    ['何满仓','我……我停不下来。'],
    ['何满仓','我吃了好多好多，可是好饿。肚子里像有个洞，怎么填都填不满。'],
    ['何满仓','{称}，别看我……别看我……'],
    ['旁白','你行囊里的八卦镜，忽然烫得像一块炭。'],
    ['顾长歌','那是什么？'],
    ['谢霁月','……它又要照人了。'],
    ['旁白','镜面自己亮了起来。青白的光照在二师兄身上，又从他身上，照进了很多年以前。'],
    {run:()=>C2Y.memCG(0)},
    ['旁白','那是一个叫丰年村的地方。'],
    ['旁白','那一年，一滴雨都没有下。地裂开了口子，庄稼烂在地里，连野草都枯成了灰。'],
    ['旁白','村里人先吃存粮，再吃树皮，再吃草根、虫子、观音土。'],
    ['小满仓','娘，我饿。'],
    ['满仓娘','乖，娘这儿还有半个馒头。'],
    ['旁白','她把馒头掰开，大的那一半塞进孩子手里。小的那一半，她看了很久，也塞给了他。'],
    ['满仓娘','藏好。别让人看见。'],
    ['旁白','孩子把馒头揣进袖子里。他舍不得吃。'],
    {run:()=>C2Y.memCG(1)},
    ['旁白','后来，树皮也没有了。'],
    ['旁白','村里的大人们聚在祠堂里，压低了声音说话。说完，他们抬起头，看向村里的孩子。'],
    ['旁白','那种眼神，小满仓一辈子都忘不了。'],
    ['满仓娘','满仓，到娘这儿来。'],
    ['旁白','她掀开灶台下的地窖板，把他推了进去。'],
    ['满仓娘','别出声。不管听见什么，都别出声。等娘回来。'],
    ['旁白','地窖板合上了。外面传来很多人的脚步声，还有娘的声音，越来越远。'],
    ['旁白','娘再也没有回来。'],
    {run:()=>C2Y.memCG(2)},
    ['旁白','第七天，地窖外面亮了起来。'],
    ['旁白','有人放了一把火。整个丰年村都在烧，火光从地窖板的缝里漏进来，一道一道，红得像血。'],
    ['旁白','孩子缩在地窖的角落里。袖子里的半个馒头，早就硬得像石头。'],
    ['小满仓','……我好饿。'],
    {run:()=>{ C2Y.eyes=1; }},
    ['旁白','黑暗里，有什么东西睁开了眼睛。'],
    ['？？？','……我也是。'],
    ['旁白','那个声音很大，又很空，像是从地底下很深很深的地方传上来的。'],
    ['？？？','我们一起，吃饱吧。'],
    ['旁白','有什么东西钻进了他的身体里。然后，睡着了。'],
    ['旁白',`第二天，一位路过的修士从灰烬里抱出了一个孩子。那位修士，就是你们的师尊，${shi}。`],
    {run:()=>{ C2Y.eyes=0; C2Y.caveCG(true); }},
    ['旁白','镜子的光暗了下去。'],
    ['何满仓','……原来是这样。'],
    ['何满仓','我一直以为，是我自己太馋了。'],
    ['何满仓','营地里少的那半锅饭，是我吃的。我梦见我在吃，醒来嘴里什么都没有，可是饭没了。'],
    ['何满仓','我的干粮袋，是我自己撕开的。'],
    ...(F.c2_trust_man?[['何满仓','{称}，那天早上，大家都看着我。只有你说，你相信我。'],['何满仓','……可那真的是我。对不起。对不起……']]
      :[['何满仓','那天早上，大家都看着我。我说不是我……我是真的以为，不是我。']]),
    ...(F.c2_bun?[['旁白','你从行囊里拿出那半个馒头。'],['何满仓','（他愣愣地看着它）……我娘给的。'],['何满仓','我舍不得吃。我怕吃了，就什么都没有了。']]:[]),
    ['谢霁月','满仓。'],
    ['旁白','大师姐走过去，在他面前蹲下。'],
    ['谢霁月','不是你。是那个睡在你身体里的东西。'],
    ['何满仓','可它饿，就是我饿啊……'],
    ['何满仓','（他捂住肚子，弯下腰）……大师姐，快走。它……它醒了——'],
    {run:()=>C2Y.wakeCG()},
    ['旁白','二师兄的影子，忽然变得很大。'],
    ['旁白','影子从地上站了起来。羊的身子，人的脸，两只眼睛长在腋下，嘴里是一排老虎的牙。'],
    ['饕餮','……饿……'],
    ['饕餮','好饿……好饿……好饿……'],
    ['旁白','它的脸是青铜色的。纹路一圈套着一圈，像一张永远合不上的嘴。'],
    ...(F.ge_mask?[['顾长歌','（他的手在发抖）……这张脸。'],['顾长歌','那天晚上，火光里那个人戴的面具……就是这张脸。']]:[['顾长歌','（他的手在发抖）……是它。']]),
    ['顾长歌','十年。'],
    ['顾长歌','十年前，我师父挡在我身前，被它一口吞了下去。剑掉在我脚边，还是热的。'],
    {run:()=>{ C2Y.geDraw=1; }},
    ['旁白','顾长歌拔出了剑。剑尖指着饕餮。'],
    ['饕餮','（它没有看他。它在哭）……饿……娘……我饿……'],
    ['旁白','剑尖晃了一下。'],
    ['顾长歌','……它在哭什么。'],
    ['谢霁月','它吃了满仓十几年的饿。它在用他的声音哭。'],
    ['顾长歌','（他咬紧了牙）我追了它十年，就是为了这一剑。'],
    ['顾长歌','可我看着它……只看见一个饿了一千年的东西。'],
    {choice:'顾长歌的剑在发抖。你——', options:[
      {text:'你想报仇，我陪你。但先把二师兄救出来', go:'c2y_r_side'},
      {text:'吞了你师父的是它，不是二师兄', go:'c2y_r_split'},
      {text:'（握住他发抖的手）', go:'c2y_r_hand'}]}]; },
  part1end:[
    ['旁白','饕餮张开了嘴。洞里所有的风，都朝那张嘴涌了过去。'],
    ['谢霁月','来了！'],
    {flag:'c2_awake'},
    {run:()=>{ PixCG.close(); C2Y.reset(); enterMap(RT.mapId,S.x,S.y); UI.hud(); }},
    ['旁白','（第五幕前半完。饕餮之战、剥离神魂和结局正在制作中，敬请期待。）']],
  turned:0, eyes:0, geDraw:0,
  reset(){ C2Y.turned=0; C2Y.eyes=0; C2Y.geDraw=0; },
};
Object.assign(SCRIPTS, {
  c2y_r_side:[['我','长歌，你想报仇，我陪你。'],['我','但二师兄还在它身体里。先把他救出来。'],['顾长歌','……好。'],['旁白','剑尖稳了下来。'],['顾长歌','先救人。'],{love:{ge:40}},{go:'c2y_end1'}],
  c2y_r_split:[['我','吞了你师父的，是它。不是二师兄。'],['我','二师兄那年才几岁？他什么都不知道。'],['顾长歌','……我知道。'],['顾长歌','（他深吸了一口气）我知道的。我只是……要有个人，替我把这句话说出来。'],{love:{ge:50}},{go:'c2y_end1'}],
  c2y_r_hand:[['旁白','你伸手，握住了他握剑的手。那只手很冷，抖得厉害。'],['顾长歌','……'],['旁白','过了一会儿，那只手不抖了。'],['顾长歌','（很轻）……谢谢。'],{love:{ge:60}},{flag:'c2_ge_hand'},{go:'c2y_end1'}],
  c2y_end1:C2Y.part1end,
});
// talking: 顾长歌 at the cave mouth, 二师兄 in the cave; 大师姐 on the way
{ const _t=Story.talk; Story.talk=function(id){
    if(RT.mapId==='mj_south'&&id==='ge'&&!S.flags.c2_ge_met) return UI.say(C2Y.meet());
    if(RT.mapId==='mj_cave'&&id==='man'&&!S.flags.c2_awake) return UI.say(C2Y.found());
    return _t.call(Story,id); }; }
{ const _a=Dungeon.act; Dungeon.act=function(o){
    if(o.act==='c2ytrace'){ UI.say(C2Y.traces[o.ti]); return true; }
    if(o.act==='c2ybun'){ UI.say(C2Y.bun, ()=>{ enterMap(RT.mapId,S.x,S.y); UI.hud(); }); return true; }
    if(o.act==='c2ysouth'){ UI.say([['旁白','营地南边的林子很密。没有理由往那边去。']]); return true; }
    return _a.call(Dungeon,o); }; }

/* ---------- the quest ---------- */
{ const q=QUESTS.find(q=>q.id==='c2h');
  Object.assign(q,{title:'饿鬼洞', desc:'二师兄不见了，锅底被舔得发亮。脚印和一道湿漉漉的痕迹往营地南边去了。',
    check:s=>!!s.flags.c2_man_saved,
    progress:s=>{ const F=s.flags; return !F.c2_south_in?'顺着二师兄的脚印，往营地南边走':!F.c2_ge_met?'往南，去林子尽头的山坳':!F.c2_cave_in?'进洞':!F.c2_awake?'往洞里走，找到二师兄':'（第五幕后半正在制作中）'; },
    target:s=>{ const F=s.flags, m=RT.mapId;
      if(F.c2_awake) return null;
      if(m==='mj_cave') return ['mj_cave',12,3,'二师兄'];
      if(!F.c2_ge_met) return m==='mj_south'?['mj_south',11,13,'洞口的人']:['mj_south',11,2,'南边的林子'];
      return ['mj_south',11,17,'洞口']; }});}
{ const _g=C2X.gone; C2X.gone=()=>_g().map(st=>Array.isArray(st)&&/第五幕「何满仓与饕餮」正在制作中/.test(st[1])?['旁白','（第四幕「心镜湖」完。顺着脚印，往营地南边追。）']:st); }
{ const _at=areaTheme; areaTheme=function(){ if(RT.mapId==='mj_cave'||RT.mapId==='mj_south') return 'qiongqi'; return _at(); }; }
