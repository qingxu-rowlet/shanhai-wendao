/* ============================================================
   山海问道 · 第三章「京城」 · 城里的东西（三）：西市 — what the market of rare things is made of: a 牌坊 over the lane in
   from the north with its 「西市」 plaque, a 旧书 stall, a stall of yellow 符纸 hanging on strings, a pole hung with bird
   cages, a curio stall of vases and bronzes, racks of herbs drying in round baskets, and the 琅琊榜, a red board on which
   this year's 大比 entrants are ranked.
   ============================================================ */
const JA3={
  // the 牌坊: two stone posts on drums, a beam with a tiled roof, the plaque in the middle (its letters drawn sharp)
  paifang(){ return FineArt.paint(100,72,P=>{ const st='#9a948a', stl='#b8b2a6', stk='#6a655c', rf='#3a3e48', rfl='#565c68', rfk='#22252c', red='#8a2a22';
    for(const x of [6,90]){ P.rect(x-3,64,10,8,stk); P.rect(x-2,63,8,2,stl); P.rect(x,18,4,46,st); P.rect(x,18,1,46,stl); P.rect(x+3,18,1,46,stk); }   // the posts on their drums
    P.rect(4,26,92,5,red); P.rect(4,26,92,1,'#b03a30'); P.rect(4,31,92,1,'#5a1410');                                                         // the lower beam
    for(let x=14;x<88;x+=8) P.rect(x,22,2,4,'#5a1410');                                                                                        // its brackets
    P.rect(36,12,28,14,'#1a1614'); P.rect(37,13,26,12,'#22201c'); P.rect(35,11,30,1,'#c8a050'); P.rect(35,26,30,1,'#c8a050');               // the plaque
    P.poly([[0,14],[8,6],[92,6],[100,14],[94,12],[6,12]],rf); P.poly([[6,11],[12,7],[88,7],[94,11]],rfl); P.rect(8,4,84,3,rfk);               // the roof
    P.poly([[8,4],[3,0],[12,3]],rfk); P.poly([[92,4],[97,0],[88,3]],rfk); P.rect(48,1,4,3,'#d8b048'); }); },
  books(P){ for(const [x,n] of [[5,4],[12,3],[19,5],[26,3]]) for(let k=0;k<n;k++){ const c=['#5e3a20','#3a4a6a','#6a2a22','#4a5a3a','#8a7a5a'][(x+k)%5]; P.rect(x,21-k*2,6,2,c); P.rect(x,21-k*2,6,1,'#efe6cc'); } },
  fu(P){ P.rect(2,13,30,1,'#5e3a20'); for(let k=0;k<7;k++){ const x=4+k*4; P.rect(x,14,3,8,'#e8c840'); P.rect(x+1,15,1,5,'#b02820'); P.set(x+1,16,'#e8c840'); } },
  curio(P){ P.ell(8,19,3,4,'#3a7a8a'); P.rect(7,14,2,2,'#3a7a8a'); P.ell(8,18,2,1,'#e8f0f0');                          // a celadon vase
    P.rect(14,16,8,5,'#5a6a4a'); P.rect(13,15,10,1,'#7a8a6a'); P.rect(14,21,1,2,'#5a6a4a'); P.rect(21,21,1,2,'#5a6a4a');   // a little bronze 鼎
    P.ell(27,20,3,2.6,'#e8e0d0'); P.ell(27,19,2,1.4,'#4a6fa5'); },                                                        // a blue-and-white bowl
  cages(){ return FineArt.paint(34,46,P=>{ P.rect(16,4,2,40,'#5e3a20'); P.rect(4,6,26,2,'#5e3a20'); P.ell(17,44,8,2,'#00000033');
    for(const [x,y,c] of [[7,10,'#e8b84a'],[27,10,'#c8413b'],[7,28,'#5fa35a']]){ P.rect(x,y,1,3,'#3a2418'); P.ell(x,y+9,6,7,'#8a6a3a'); P.ell(x,y+9,5,6,'#f0e6cc'); for(let i=-4;i<=4;i+=2) P.rect(x+i,y+3,1,12,'#8a6a3a');
      P.rect(x-5,y+15,11,2,'#5e3a20'); P.ell(x,y+11,2,1.6,c); P.set(x+2,y+10,'#2a1e1a'); P.set(x+2,y+11,'#e8b84a'); } }); },
  // a low bamboo rack with round 竹匾 of herbs drying on it, seen from the front and a little above
  herbs(){ return FineArt.paint(40,28,P=>{ const R=rng(7); P.ell(20,26,18,2,'#00000030');
    for(const x of [4,20,36]){ P.rect(x-1,14,2,12,'#8a7440'); P.rect(x-1,14,1,12,'#a89058'); } P.rect(2,15,36,2,'#9a8448'); P.rect(2,15,36,1,'#b8a060');
    for(const [x,y,c,d] of [[11,12,'#7a8a3a','#5a6a2a'],[29,12,'#a0583a','#7a3a24'],[20,7,'#c8a048','#9a7a30']]){
      P.ell(x,y,9,4,'#7a6438'); P.ell(x,y-.5,8.4,3.4,'#c8b070'); P.ell(x,y-.5,7,2.6,'#b09858');            // the 竹匾's rim and weave
      for(let k=0;k<26;k++){ const a=R()*Math.PI*2, r=Math.sqrt(R()); P.set(x+Math.cos(a)*6*r, y-.5+Math.sin(a)*2.2*r, R()<.5?c:d); } } }); },
  bang(){ return FineArt.paint(40,44,P=>{ for(const x of [4,34]) P.rect(x,10,3,33,'#5e3a20'); P.rect(2,6,36,28,'#7a1a14'); P.rect(3,7,34,26,'#9a2a22');
    P.rect(2,6,36,2,'#c8a050'); P.rect(2,32,36,2,'#c8a050'); for(let k=0;k<6;k++){ P.rect(7+k*5,11,3,1,'#e8c870'); for(let j=13;j<30;j+=3) P.rect(7+k*5,j,3,1,'#e0c080'); }
    P.poly([[0,7],[20,0],[40,7]],'#3c3a44'); P.rect(0,6,40,1,'#22252c'); P.ell(20,43,14,2,'#00000033'); }); },
};
Object.assign(SPR,{jc_paifang:['x'], jc_paifang_dim:['x'], jc_stall_book:['x'], jc_stall_fu:['x'], jc_stall_curio:['x'], jc_cages:['x'], jc_herbs:['x'], jc_bang:['x']});
Object.assign(SPRC,{jc_stall_book:JA.stall('#3a4a6a','#e8dcc4',JA3.books), jc_stall_fu:JA.stall('#b02820','#e8c840',JA3.fu), jc_stall_curio:JA.stall('#3a7a8a','#efe6cc',JA3.curio),
  jc_cages:JA3.cages(), jc_herbs:JA3.herbs(), jc_bang:JA3.bang()});
// the 牌坊 stands on its west post's row; padded on the left by 16px so its middle falls between its two posts
for(const dim of [0,1]){ const p0=JA3.paifang(), c=document.createElement('canvas'); c.width=16+p0.width; c.height=p0.height; const g=c.getContext('2d'); if(dim) g.globalAlpha=.45; g.drawImage(p0,16,0); c.bottom=c.height; SPRC[dim?'jc_paifang_dim':'jc_paifang']=c; }
// icons: a lump of 龙血竭 (dark red resin), a thread-bound book of 功法
Object.assign(SPR,{
  i_xue:['............','............','....RRr.....','...RrrRR....','..RRrRRRr...','..RrRRrRR...','...RRRRR....','....RRR.....','............','............'],
  i_book:['............','..NNNNNNNN..','..NccccccN..','..NcyyyycN..','..NccccccN..','..NckkkkcN..','..NccccccN..','..NckkkkcN..','..NccccccN..','..NNNNNNNN..','............'],
});
