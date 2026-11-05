/* ============================================================
   山海问道 · 第三章「京城」 · 城里的东西（九）：东市、千金坊 — a 糖人 stall (a straw pole stuck with sugar figures, a
   little copper pan of syrup on a brazier), a wonton stall, the juggler's ribboned pole, the dice tables of 千金坊 (green
   felt, a bamboo cup, bowls of chips), the locked counting-room door, and in the back hall a gilt 财神.
   ============================================================ */
const JA9={
  tangren(){ return FineArt.paint(30,40,P=>{ P.rect(4,24,22,4,'#8a5a36'); P.rect(4,28,22,10,'#5e3a20'); P.rect(6,29,18,1,'#8a5a36');   // the cart
    P.ell(22,22,5,2,'#3a2a20'); P.ell(22,21,4,1.4,'#c88a2a'); P.rect(20,23,4,2,'#e8702a');                                        // the pan of syrup over coals
    P.rect(9,2,2,22,'#7a5a3a'); P.ell(10,6,5,5,'#d8c070'); P.ell(10,5,4,3,'#ecd890');                                              // the straw pole
    for(const [x,y,c] of [[5,3,'#e8b84a'],[15,4,'#d8902a'],[6,9,'#e8a83a'],[14,9,'#f0c050']]){ P.rect(x,y,1,4,'#8a6a3a'); P.ell(x,y,1.8,1.6,c); P.set(x-1,y-2,c); P.set(x+1,y-2,c); } }); },
  diceTable(){ return FineArt.paint(36,26,P=>{ P.ell(18,23,15,2,'#00000030'); for(const x of [5,31]) P.rect(x-1,12,2,11,'#4a2a16');
    P.rect(2,8,32,6,'#5e3a20'); P.rect(3,8,30,5,'#2a6a3a'); P.rect(3,8,30,1,'#3a8a4a'); P.line(18,8,18,12,'#e8d8a8');
    P.rect(16,1,5,7,'#a8803a'); P.rect(16,1,5,1,'#c8a050'); P.ell(18.5,8,3,1,'#6a5020');                                              // the bamboo dice cup
    for(const [x,c] of [[7,'#e8e0d0'],[27,'#c8413b']]) for(let k=0;k<3;k++) P.rect(x,10-k,4,1,c); }); },                              // stacks of chips
  door(){ return FineArt.paint(20,30,P=>{ P.rect(1,2,18,28,'#3a1a10'); P.rect(2,3,16,26,'#6a2418'); P.rect(9,3,1,26,'#3a1a10'); for(let y=6;y<28;y+=6) for(const x of [4,12]) P.rect(x,y,4,1,'#4a1a10');
    P.rect(8,14,4,5,'#c8a050'); P.rect(9,12,2,3,'#a88030'); P.set(10,16,'#3a2410'); }); },                                              // a brass lock
  caishen(){ return FineArt.paint(32,46,P=>{ P.rect(2,38,28,8,'#5e2018'); P.rect(2,38,28,1,'#8a3a2a'); P.rect(4,36,24,3,'#c8a050');   // the altar
    P.ell(16,24,10,13,'#c89a3a'); P.ell(16,22,8,11,'#e0b84a'); P.rect(9,30,14,6,'#c8413b'); P.ell(16,10,6,6,'#e8c070'); P.rect(10,3,12,4,'#2a2020'); P.rect(8,6,16,2,'#2a2020');   // the 财神, his hat
    P.set(14,10,'#2a1e1a'); P.set(18,10,'#2a1e1a'); P.rect(13,13,6,1,'#8a3a2a'); P.rect(12,20,8,6,'#f0d070'); P.set(16,22,'#c8413b');                      // face, the gold ingot
    for(const x of [5,27]){ P.rect(x,32,2,4,'#e8d8b0'); P.set(x,31,'#f0a040'); } }); },                                              // candles
};
Object.assign(SPR,{ds_tangren:['x'], qj_table:['x'], qj_door:['x'], qj_caishen:['x'], ds_stall_wonton:['x']});
Object.assign(SPRC,{ds_tangren:JA9.tangren(), qj_table:JA9.diceTable(), qj_door:JA9.door(), qj_caishen:JA9.caishen(), ds_stall_wonton:JA.stall('#c8413b','#f0e6d0',JA_GOODS.bao)});
