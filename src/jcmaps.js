/* ============================================================
   山海问道 · 第三章「京城」 · 地图一：朱雀门 · 朱雀大街 — you come in through the south gate: outside, the road, willows
   and two stone lions; the wall, and over its gate the 朱雀门 tower; inside, the avenue running north to the palace, with
   酒楼, 当铺, 布庄 on the west, 药铺, the 听雨轩 teahouse and an inn on the east, stalls along the cross street, a 糖葫芦
   post, steamer baskets, a sedan waiting with its bearers, lanterns strung over the street, and people with things to
   say. The cross street runs west (西市, 四方馆) and east (东市), the avenue north (皇城): those are the next maps; for now
   barriers stand across them.
   ============================================================ */
{ const W=28, H=34, G=[...Array(H)].map(()=>Array(W).fill('P'));
  for(let y=0;y<27;y++){ G[y][0]='X'; G[y][W-1]='X'; } for(let x=0;x<W;x++) G[0][x]='X';
  for(const y of [14,15]){ G[y][0]='P'; G[y][W-1]='P'; } for(let x=12;x<=15;x++) G[0][x]='P';      // the streets run on, to maps still to come
  for(let x=0;x<W;x++){ G[27][x]='X'; G[28][x]='Y'; } for(let x=12;x<=15;x++){ G[27][x]='A'; G[28][x]='A'; }   // the wall, and the gate through it
  for(let y=29;y<H;y++) for(let x=0;x<W;x++) G[y][x]=(x===0||x===W-1||y===H-1)?'W':(x>=12&&x<=15)?'P':'.';
  for(let y=29;y<H-1;y++) for(const x of [11,16]) G[y][x]=',';
  for(let y=24;y<=26;y++) for(const [a,b] of [[1,9],[18,26]]) for(let x=a;x<=b;x++) G[y][x]=(x+y)%5?'.':':';   // two small greens inside the wall
  G[H-1][13]='P'; G[H-1][14]='P';
  const roofs={grey:['#22262c','#2e343c','#3e4650','#68727e'], green:['#1c3028','#28423a','#36584c','#5e8a78'], brown:['#2c2018','#3e2e22','#56402e','#86684c'], red:['#3a1612','#561e18','#742a20','#a84a3a']};
  const shop=(x,y,w,h,label,id,roof,fa)=>({type:'building', x, y, w, h, style:'shop', roof:roofs[roof], label, door:[x+Math.floor(w/2),y+h], act:'jcshop', id, fa:{...fa, roof:roofs[roof]}});
  const P=(id,x,y,name,look,extra)=>({type:'npc', id, x, y, look, name, act:'talk', ...(extra||{})});
  // fw: how many tiles either side a wide thing also takes up, so what you see is what stops you
  const objects=[
    shop(2,2,8,4,'醉仙居 · 酒楼','jiulou','red',{storeys:2, wall:'wood', sign:'醉仙居', lit:true, open:true, deco:['balconyLanterns','jars']}),
    shop(2,8,8,4,'当铺','dang','grey',{wall:'brick', sign:'当铺', signBg:'#f0e8d8', signInk:'#1a1410', pillar:'#3a3632', deco:['bigDang','bars'], windows:false}),
    shop(2,17,8,4,'锦绣布庄','bu','brown',{wall:'wood', sign:'锦绣布庄', open:true, deco:['cloth'], windows:false}),
    shop(18,2,8,4,'回春堂 · 药铺','yao','green',{wall:'plaster', sign:'回春堂', pillar:'#2a4a3a', open:true, deco:['drawers','gourd']}),
    shop(18,8,8,4,'听雨轩 · 茶楼','cha','green',{storeys:2, wall:'plaster', sign:'听雨轩', pillar:'#2a4a3a', lit:true, deco:['blinds','moon']}),
    shop(18,17,8,4,'悦来客栈','kezhan','grey',{storeys:2, wall:'wood', sign:'悦来客栈', lit:true, open:true, lanternText:'客', deco:['doorLanterns','post']}),
    {type:'jc_flag', x:10, y:4, spr:'jc_flag_jiu', flagText:'酒'}, {type:'jc_flag', x:17, y:4, spr:'jc_flag_yao', flagText:'药'},
    {type:'jc_sedan', x:4, y:7, spr:'jc_sedan', act:'jcsedan', fw:1}, {type:'jc_barrels', x:10, y:7, spr:'jc_barrels'},
    {type:'jc_stall', x:3, y:12, spr:'jc_stall_bao', act:'jcbao', fw:1},
    {type:'jc_stall', x:9, y:16, spr:'jc_stall_cloth', act:'jcstall', si:0, fw:1}, {type:'jc_stall', x:21, y:16, spr:'jc_stall_trinket', act:'jcstall', si:1, fw:1},
    {type:'jc_stall', x:24, y:12, spr:'jc_stall_fruit', act:'jcstall', si:2, fw:1},
    {type:'jc_hulu', x:16, y:20, spr:'jc_hulu', act:'jchulu'},
    {type:'jc_board', x:19, y:13, spr:'jc_board', act:'jcboard', fw:1},
    {type:'lantern', x:11, y:6}, {type:'lantern', x:16, y:6}, {type:'lantern', x:11, y:22}, {type:'lantern', x:16, y:22},
    {type:'jc_willow', x:3, y:25, spr:'jc_willow'}, {type:'jc_willow', x:8, y:25, spr:'jc_willow'}, {type:'jc_willow', x:19, y:25, spr:'jc_willow'}, {type:'jc_willow', x:24, y:25, spr:'jc_willow'},
    {type:'jc_willow', x:4, y:31, spr:'jc_willow'}, {type:'jc_willow', x:23, y:31, spr:'jc_willow'}, {type:'jc_willow', x:7, y:31, spr:'jc_willow'},
    {type:'jc_lion', x:10, y:30, spr:'jc_lionL'}, {type:'jc_lion', x:17, y:30, spr:'jc_lionR'},
    {type:'jc_barrier', x:1, y:14, spr:'jc_barrier', act:'jcway', way:'west'}, {type:'jc_barrier', x:1, y:15, spr:'jc_barrier', act:'jcway', way:'west'},
    {type:'jc_barrier', x:26, y:14, spr:'jc_barrier', act:'jcway', way:'east'}, {type:'jc_barrier', x:26, y:15, spr:'jc_barrier', act:'jcway', way:'east'},
    {type:'jc_barrier', x:13, y:1, spr:'jc_barrier', act:'jcway', way:'north'}, {type:'jc_barrier', x:14, y:1, spr:'jc_barrier', act:'jcway', way:'north'},
    {type:'c2_portal', x:2, y:31, spr:'c2_portal', act:'portal'},
    // the gatehouse and its tower, drawn in order with everything else (it stands on the wall's tile at x 9: the wall is solid
    // there anyway); seen from behind, inside the city, it goes half see-through
    {type:'jc_gate', x:9, y:28, get spr(){ return typeof RT!=='undefined'&&RT.fx>=8&&RT.fx<=19&&RT.fy>=20&&RT.fy<=27?'jc_gate_dim':'jc_gate'; }},
    // people
    P('jc_guard1',11,31,'守城兵',{g:'m',skin:2,hair:0,hairColor:0,style:'jin',cloth:7,face:'small'}),
    P('jc_guard2',16,31,'守城兵',{g:'m',skin:1,hair:1,hairColor:0,style:'jin',cloth:7,face:'small'}),
    P('jc_patrol',14,12,'巡街兵丁',{g:'m',skin:3,hair:0,hairColor:0,style:'jin',cloth:7,face:'mid'}),
    P('jc_baoniang',2,13,'包子铺老板娘',{g:'f',skin:2,hair:3,hairColor:0,style:'qun',cloth:0,face:'mid'}),
    P('jc_hulu',17,21,'卖糖葫芦的老汉',{g:'m',skin:2,hair:0,hairColor:3,style:'robe',cloth:5,face:'small',beard:'#d8d4cc'}),
    P('jc_huolang',23,14,'货郎',{g:'m',skin:3,hair:1,hairColor:1,style:'jin',cloth:3,face:'mid'}),
    P('jc_suanming',25,16,'算命先生',{g:'m',skin:1,hair:0,hairColor:3,style:'robe',cloth:4,face:'small',beard:'#ece8e0'}),
    P('jc_kid1',6,15,'小孩',{g:'m',skin:1,hair:1,hairColor:0,style:'jin',cloth:1,face:'small'}),
    P('jc_kid2',7,16,'小孩',{g:'f',skin:0,hair:3,hairColor:0,style:'qun',cloth:4,face:'small'}),
    P('jc_scholar',19,15,'书生',{g:'m',skin:0,hair:2,hairColor:0,style:'robe',cloth:2,face:'small'}),
    P('jc_bearer1',2,7,'轿夫',{g:'m',skin:3,hair:0,hairColor:0,style:'jin',cloth:6,face:'mid'}),
    P('jc_bearer2',7,7,'轿夫',{g:'m',skin:2,hair:1,hairColor:0,style:'jin',cloth:6,face:'mid'}),
    P('jc_traveler',15,32,'赶路的人',{g:'f',skin:1,hair:4,hairColor:1,style:'qun',cloth:3,face:'mid'}),
  ];
  MAPS.jc_zhuque={ name:'京城 · 朱雀大街', w:W, h:H, ground:G.map(r=>r.join('')), objects, exits:[] }; }

/* ---------- the gate tower over 朱雀门, and lanterns strung across the avenue ---------- */
JA.tower=()=>JA._tower||(JA._tower=FineArt.paint(150,92,P=>{ const br='#6a645c', brl='#8a847a', red='#9a2a22', redk='#6a1a14', rf='#2c3038', rfl='#454c58', rfk='#1c1e24', gd='#d8b048';
  P.rect(8,66,134,26,br); for(let r=0;r<6;r++) for(let k=0;k<17;k++) P.rect(9+k*8+(r%2?4:0),68+r*4,7,3,brl);       // the platform on the wall
  P.rect(8,64,134,3,'#4e4a45'); for(let k=0;k<17;k++) P.rect(9+k*8,61,5,3,br);                                        // its parapet
  P.rect(22,40,106,24,'#3a2a24'); for(const x of [24,44,64,84,104,124]) P.rect(x,40,4,24,red);                       // lower storey: red pillars, dark lattice
  for(let k=0;k<5;k++) for(let y=44;y<62;y+=4) P.rect(29+k*20,y,14,1,redk);
  P.rect(20,58,110,3,'#8a2a22'); for(let x=22;x<128;x+=4) P.rect(x,55,1,3,'#8a2a22');                                // the railing
  P.poly([[2,42],[18,30],[132,30],[148,42],[138,40],[12,40]],rf); P.poly([[10,38],[22,31],[128,31],[140,38]],rfl); P.rect(18,30,114,2,rfk);   // the lower roof, eaves turned up
  P.rect(40,14,70,17,'#3a2a24'); for(const x of [42,60,86,104]) P.rect(x,14,4,17,red); P.rect(62,17,26,9,'#1e1e44'); P.rect(63,18,24,7,'#2a2a5a');   // upper storey, the plaque
  P.poly([[24,16],[40,4],[110,4],[126,16],[116,14],[34,14]],rf); P.poly([[32,13],[44,5],[106,5],[118,13]],rfl); P.rect(40,3,70,2,rfk);         // the upper roof
  P.poly([[40,3],[36,0],[44,2]],rfk); P.poly([[110,3],[114,0],[106,2]],rfk); P.set(75,1,gd); P.rect(73,2,5,1,gd); }));
// the gatehouse's front: brick, two tiles tall over the wall, the arched passage through it
JA.gateface=()=>JA._gf||(JA._gf=FineArt.paint(150,32,P=>{ const br='#5a5550', brl='#7a746a', dk='#14100e';
  P.rect(0,0,150,32,br); for(let r=0;r<8;r++) for(let k=-1;k<19;k++) P.rect(1+k*8+(r%2?4:0),1+r*4,7,3,brl);
  P.rect(0,0,150,2,'#8a847a');
  P.rect(43,12,64,20,dk); P.ell(75,12,32,10,dk); P.rect(43,30,64,2,'#2a2420');                         // the arch, dark inside
  for(let k=0;k<9;k++){ const a=Math.PI*(k/8), x=75-Math.cos(a)*34, y=12-Math.sin(a)*11; P.rect(x-2,y-1,4,3,'#9a948a'); }   // its voussoirs
  P.rect(72,0,6,4,'#b8b0a2'); }));
// the gatehouse sprite: tower on top, brick front with the arch below; drawn on tile (9,28), so it is padded on the left
// by 144px to bring its middle to x 14 (the gate's middle)
JA.gate=dim=>{ const tw=JA.tower(), gf=JA.gateface(), c=document.createElement('canvas'); c.width=144+150; c.height=tw.height+gf.height; const g=c.getContext('2d');
  if(dim) g.globalAlpha=.45; g.drawImage(tw,144,0); g.drawImage(gf,144,tw.height);
  g.globalAlpha=dim?.45:1; g.fillStyle='#e8d090'; g.font='9px "Ma Shan Zheng",KaiTi,serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('朱雀门',144+75,22);
  c.bottom=c.height; return c; };
SPR.jc_gate=['x']; SPR.jc_gate_dim=['x']; SPRC.jc_gate=JA.gate(false); SPRC.jc_gate_dim=JA.gate(true);
On.draw(({g,T,ox,oy})=>{ if(RT.mapId!=='jc_zhuque') return; const Z=T/16;
  // lanterns strung across the avenue on two lines, swaying a little
  for(const row of [6.6,19.6]){ const x0=ox+11*T, x1=ox+17*T, y0=oy+row*T-T*1.1; g.strokeStyle='rgba(40,30,24,.8)'; g.lineWidth=Math.max(1,Z*.6); g.beginPath(); g.moveTo(x0,y0); g.quadraticCurveTo((x0+x1)/2,y0+T*.5,x1,y0); g.stroke();
    for(let k=1;k<6;k++){ const u=k/6, lx=x0+(x1-x0)*u+Math.sin(RT.t*1.5+k)*Z, ly=y0+T*.5*4*u*(1-u)*.5+T*.15; g.fillStyle='rgba(255,170,80,.25)'; g.beginPath(); g.arc(lx,ly+T*.12,T*.32,0,7); g.fill();
      g.fillStyle='#c8302a'; g.fillRect(lx-T*.13,ly,T*.26,T*.28); g.fillStyle='#f0c050'; g.fillRect(lx-T*.13,ly,T*.26,T*.04); g.fillRect(lx-T*.13,ly+T*.24,T*.26,T*.04); g.fillRect(lx-T*.02,ly+T*.28,T*.04,T*.1); } } });

// wide things take up every tile they cover
On.enter(id=>{ if(!String(id).startsWith('jc_')) return; for(const o of RT.ents) if(o.fw) for(let x=o.x-o.fw;x<=o.x+o.fw;x++) if(RT.solid[o.y]&&x>=0&&x<RT.map.w) RT.solid[o.y][x]=true; });
