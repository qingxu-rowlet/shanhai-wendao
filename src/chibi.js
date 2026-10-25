/* ============================================================
   山海问道 · CG 小人 — a finer chibi for the CG scenes.
   The in-game 16-pixel sprite is too coarse when blown up, so the CG chibi is drawn at twice the detail:
   the body keeps the posed templates (each cell becomes 2×2), and the head is painted pixel by pixel —
   big shiny eyes, lashes, brows, a small mouth, blush — with readable expressions (smile, blush, sad, blink).
   Faces three-quarter right; the viewer mirrors it for characters facing left.
   ============================================================ */
// fine poses: lean of the upper body, lower-body shape, near / far arm angles (0 = hanging, + = forward), seat line for sitting
const FPOSE = {
  stand:{low:'skirt', near:[.2,.3], far:[-.12,.15]},
  walk: {low:'walk', lean:.05, near:[.55,.25], far:[-.45,.2]},
  hold: {low:'skirt', near:[1.25,.75], far:[1.05,.95]},
  lantern:{low:'skirt', near:[.6,-.35], far:[.15,.25]},
  point:{low:'skirt', near:[2.0,.05], far:[-.1,.2]},
  sitedge:{low:'edge', near:[.6,.95], far:[.45,1.0], seat:47},
  sit:  {low:'cross', near:[.65,1.0], far:[.5,1.0], seat:49},
  kneel:{low:'kneel', lean:.05, near:[.55,.8], far:[.3,.9], seat:49},
  reach:{low:'kneel', lean:.35, near:[.95,.3], far:[.4,.8], seat:49},
  crouch:{low:'crouch', lean:.2, near:[1.35,1.1], far:[1.2,1.2], seat:49},
  sword:{low:'lunge', lean:.15, near:[1.57,0], far:[-1.9,-.5]},
  guard:{low:'lunge', lean:.05, near:[2.5,.35], far:[-.7,.3]},
  bow:  {low:'skirt', lean:.35, near:[1.2,1.0], far:[1.1,1.1], drop:2},
};
const CHIBIC={};
function cgChibi(look, pose, mood, prop, wear, back){
  const key=JSON.stringify([look,pose,mood,prop,wear,back]); if(CHIBIC[key]) return CHIBIC[key];
  const W=PCW*2, H=PCH*2, pal={...lookPalette(look), ...PROP_PAL, l:'#9fd3ef'};
  const px=new Array(W*H).fill(null);
  const set=(x,y,c)=>{ x=Math.round(x); y=Math.round(y); if(x>=0&&y>=0&&x<W&&y<H&&c) px[y*W+x]=c; };
  const rect=(x,y,w,h,c)=>{ for(let j=0;j<h;j++) for(let i=0;i<w;i++) set(x+i,y+j,c); };
  const ell=(cx,cy,rx,ry,c,test)=>{ for(let y=Math.floor(cy-ry);y<=cy+ry;y++) for(let x=Math.floor(cx-rx);x<=cx+rx;x++){ const d=((x+.5-cx)/rx)**2+((y+.5-cy)/ry)**2; if(d<=1&&(!test||test(x,y))) set(x,y,c); } };
  const FP2=FPOSE[pose]||FPOSE.stand, hd=FP2.drop||0, st=(LOOK.hairstyles[look.hair]||{}).id||'short';
  const HAIR=pal.H, HAIR2=pal.h, SK=pal.S, SK2=pal.s, OUT='#2a1e1a';
  const lt=c=>shade(c,.18), dk=c=>shade(c,-.22);
  const C=pal.C, P=pal.P, A=pal.A, TR=pal.W, SHOE=pal.F, jin=look.style==='jin', qun=look.style==='qun';
  // drawing helpers on the fine grid
  const capsule=(ax,ay,bx,by,r,col)=>{ for(let y=Math.floor(Math.min(ay,by)-r-1);y<=Math.max(ay,by)+r+1;y++) for(let x=Math.floor(Math.min(ax,bx)-r-1);x<=Math.max(ax,bx)+r+1;x++){
      const vx=bx-ax, vy=by-ay, L=vx*vx+vy*vy||1, u=Math.max(0,Math.min(1,((x+.5-ax)*vx+(y+.5-ay)*vy)/L)), dx=x+.5-(ax+u*vx), dy=y+.5-(ay+u*vy); if(dx*dx+dy*dy<=r*r) set(x,y,col); } };
  const poly=(pts,col)=>{ const xs=pts.map(p=>p[0]), ys=pts.map(p=>p[1]);
    for(let y=Math.floor(Math.min(...ys));y<=Math.max(...ys);y++) for(let x=Math.floor(Math.min(...xs));x<=Math.max(...xs);x++){ let inside=false;
      for(let i=0,j=pts.length-1;i<pts.length;j=i++){ const [xi,yi]=pts[i],[xj,yj]=pts[j]; if(((yi>y+.5)!==(yj>y+.5))&&(x+.5<(xj-xi)*(y+.5-yi)/(yj-yi)+xi)) inside=!inside; }
      if(inside) set(x,y,col); } };
  const line=(ax,ay,bx,by,col)=>{ const n=Math.max(Math.abs(bx-ax),Math.abs(by-ay))||1; for(let i=0;i<=n;i++) set(ax+(bx-ax)*i/n, ay+(by-ay)*i/n, col); };
  // draw a part, then give it volume (light left edge, dark right edge) and a dark seam where it overlaps earlier parts
  const part=(fn,col,{shadeIt=true,seam=true}={})=>{ const before=px.slice(); fn(col); const mask=new Set(); for(let i=0;i<px.length;i++) if(px[i]===col&&before[i]!==col) mask.add(i);
    for(const i of mask){
      if(shadeIt){ if(!mask.has(i-1)) px[i]=lt(col); else if(!mask.has(i+1)) px[i]=dk(col); }
      if(seam) for(const j of [i-1,i+1,i-W,i+W]) if(j>=0&&j<px.length&&!mask.has(j)&&before[j]&&px[j]===before[j]) px[j]=OUT; }
    return mask; };
  // the skeleton
  const sx=Math.round((FP2.lean||0)*9), hipX=34+Math.round(sx*.4);
  const SN=[38+sx,34], SF=[30+sx,34];
  const arm=(S,[a1,a2])=>{ const E=[S[0]+Math.sin(a1)*5.5, S[1]+Math.cos(a1)*5.5], Hn=[E[0]+Math.sin(a1+a2)*5, E[1]+Math.cos(a1+a2)*5]; return [S,E,Hn]; };
  const AN=arm(SN,FP2.near), AF=arm(SF,FP2.far);
  // things worn behind the body
  if(!back){ for(const w of wear||[]){
    if(w==='backsword'){ line(25,29,40,47,'#3a2a22'); line(26,29,41,47,'#9aa6b0'); rect(23,26,3,3,'#3a2a22'); set(22,29,'#d8413b'); set(22,30,'#d8413b'); set(21,31,'#d8413b'); }
    if(w==='bow'){ for(let i=0;i<16;i++){ const y=31+i, x=24-Math.round(Math.sin(i/15*Math.PI)*3); set(x,y,'#7a4a2a'); } line(25,31,25,46,'#d8d0c0'); }
    if(w==='bookbox'){ part(c=>rect(21,30,7,14,c),'#b08a5a'); rect(21,34,7,1,'#7a5a3a'); rect(21,39,7,1,'#7a5a3a'); } } }
  // long hair and ponytail fall behind the back
  if(!back&&st==='long') part(c=>poly([[24,14],[31,14],[31,46],[26,48],[22,44]],c),HAIR,{seam:false});
  if(!back&&st==='pony') part(c=>{ for(let i=0;i<24;i++){ const y=12+i, x=23-Math.round(Math.sin(i/24*Math.PI)*6)-(i>16?(i-16)*.6:0); rect(x-2,y,i>18?3:4,1,c); } },HAIR,{seam:false});
  // a wide 汉服 sleeve: shoulder to elbow, elbow to cuff, a drape hanging under the forearm, a cuff, then the hand
  const sleeve=(Ar,col,front)=>{ const [S,E,Hn]=Ar, Hc=[E[0]+(Hn[0]-E[0])*.72, E[1]+(Hn[1]-E[1])*.72];
    part(c=>{ capsule(S[0],S[1],E[0],E[1],2.4,c); capsule(E[0],E[1],Hc[0],Hc[1],2.8,c);
      const dx=Hc[0]-E[0], dy=Hc[1]-E[1], L=Math.hypot(dx,dy)||1, nx=-dy/L, ny=dx/L, dn=ny<0?-1:1;
      poly([[E[0]+nx*dn*1.5,E[1]+ny*dn*1.5],[Hc[0]+nx*dn*1.5,Hc[1]+ny*dn*1.5],[Hc[0]+nx*dn*4+dx/L,Hc[1]+ny*dn*4.5+1.5],[E[0]+nx*dn*3,E[1]+ny*dn*3+.5]],c); },col,{seam:front});
    capsule(Hc[0]-(Hn[0]-E[0])*.06,Hc[1]-(Hn[1]-E[1])*.06,Hc[0],Hc[1],2.2,TR);
    part(c=>{ capsule(Hc[0],Hc[1],Hn[0],Hn[1],1.5,c); set(Hn[0]+1,Hn[1]-1,c); },SK,{shadeIt:false,seam:front}); };
  if(!back) sleeve(AF,dk(C),false);
  // lower body
  const Lw=FP2.low||'skirt', LOW=jin?shade(P,-.05):P;
  if(Lw==='skirt'||Lw==='walk'){ const spread=Lw==='walk'?3:0;
    if(jin){ part(c=>{ poly([[hipX-6,43],[hipX,43],[hipX-1,52],[hipX-6-spread,52]],c); poly([[hipX,43],[hipX+6,43],[hipX+6+spread,52],[hipX+1,52]],c); },LOW);
      rect(hipX-7-spread,51,6,3,SHOE); rect(hipX+1+spread,51,6,3,SHOE); }
    else { part(c=>poly([[hipX-6,43],[hipX+6,43],[hipX+9+spread,54],[hipX-9-spread,54]],c),LOW);
      for(let x=hipX-5;x<=hipX+5;x+=3) line(x,45,x+Math.round((x-hipX)*.3),53,dk(LOW));
      rect(hipX-9-spread,53,19+spread*2,1,qun?A:dk(LOW)); rect(hipX-5-spread,54,4,2,SHOE); rect(hipX+2+spread,54,4,2,SHOE); } }
  if(Lw==='lunge'){ part(c=>{ poly([[hipX-6,43],[hipX,43],[hipX-6,54],[hipX-12,54]],c); poly([[hipX,43],[hipX+6,43],[hipX+13,54],[hipX+6,54]],c); },LOW);
    rect(hipX-13,53,6,2,SHOE); rect(hipX+7,53,7,2,SHOE); if(!jin){ line(hipX-12,53,hipX-7,53,qun?A:dk(LOW)); line(hipX+6,53,hipX+12,53,qun?A:dk(LOW)); } }
  if(Lw==='edge'){ // sitting on an edge: lap, the skirt falling over the knees, two shins hanging straight down, two shoes
    const leg=jin?LOW:shade(TR,-.05);
    part(c=>rect(hipX+4,47,3,6,c),dk(leg),{seam:false}); part(c=>rect(hipX+7,47,3,6,c),leg);
    rect(hipX+3,52,4,2,dk(SHOE)); rect(hipX+7,52,5,2,SHOE);
    part(c=>poly([[hipX-6,42],[hipX+8,42],[hipX+11,44],[hipX+12,48],[hipX+3,48],[hipX-6,46]],c),LOW);
    rect(hipX+3,47,10,1,qun?A:dk(LOW)); line(hipX+1,44,hipX+2,47,dk(LOW)); line(hipX+6,44,hipX+7,47,dk(LOW)); }
  if(Lw==='cross'){ part(c=>poly([[hipX-8,42],[hipX+8,42],[hipX+13,46],[hipX+12,49],[hipX-11,49],[hipX-12,46]],c),LOW);
    rect(hipX-11,48,24,1,qun?A:dk(LOW)); line(hipX-2,44,hipX-6,48,dk(LOW)); line(hipX+3,44,hipX+7,48,dk(LOW)); rect(hipX+11,47,3,2,SHOE); }
  if(Lw==='kneel'){ rect(hipX-11,47,5,2,SHOE); part(c=>poly([[hipX-6,42],[hipX+7,42],[hipX+11,46],[hipX+11,49],[hipX-8,49]],c),LOW);
    rect(hipX-8,48,20,1,qun?A:dk(LOW)); line(hipX+3,44,hipX+6,48,dk(LOW)); }
  if(Lw==='crouch'){ part(c=>poly([[hipX-6,40],[hipX+6,36],[hipX+10,40],[hipX+10,49],[hipX-7,49]],c),LOW); rect(hipX+6,48,5,2,SHOE); rect(hipX-7,48,17,1,qun?A:dk(LOW)); }
  // torso and the crossed collar (交领)
  part(c=>poly([[29+sx,33],[39+sx,33],[40+Math.round(sx*.5),42],[28+Math.round(sx*.5),42]],c),C);
  if(!back){ rect(32+sx,30,5,4,SK); set(32+sx,31,SK2); set(32+sx,32,SK2);
    poly([[31.5+sx,33],[37.5+sx,33],[34.5+sx,38.5]],SK); for(let y=33;y<35;y++) set(33+sx,y,SK2);
    line(31+sx,33,34+sx,38,TR); line(32+sx,33,35+sx,38,TR); line(38+sx,33,35+sx,36,TR); line(33+sx,33,35+sx,37,dk(C)); }
  else { rect(32+sx,28,5,5,SK); rect(32+sx,28,1,5,SK2); rect(36+sx,28,1,5,SK2); rect(31+sx,32,7,1,dk(C)); }   // from behind: the nape of the neck between the hair and the collar
  // sash with a knot and two ribbons
  const sy=41, sa=Math.round(sx*.5); rect(28+sa,sy,13,2,A); rect(28+sa,sy+1,13,1,dk(A));
  if(!back){ const kx=39+sa; rect(kx-1,sy-1,3,3,dk(A)); set(kx,sy-1,lt(A)); if(jin) set(kx,sy,'#e8b84a');
    if(Lw==='skirt'||Lw==='walk'||Lw==='lunge'){ line(kx-1,sy+2,kx-2,sy+8,A); line(kx+1,sy+2,kx+2,sy+7,dk(A)); } else { line(kx,sy+2,kx+3,sy+4,A); } }
  // near arm on top; from behind, both arms hang at the sides
  if(!back) sleeve(AN,C,true);
  else part(c=>{ capsule(SN[0],SN[1],SN[0]+1,SN[1]+9,2.4,c); capsule(SF[0],SF[1],SF[0]-1,SF[1]+9,2.4,c); },C);
  // what's in the hand
  const [,E1,H1]=AN, dxh=H1[0]-E1[0], dyh=H1[1]-E1[1], dl=Math.hypot(dxh,dyh)||1, ux=dxh/dl, uy=dyh/dl;
  if(!back&&(prop==='sword'||prop==='swordup'||prop==='wood')){
    const wood=prop==='wood'; for(let i=2;i<23;i++){ set(H1[0]+ux*i,H1[1]+uy*i,wood?'#c8945a':'#eef3f6'); set(H1[0]+ux*i-uy,H1[1]+uy*i+ux,wood?'#8a5a36':'#9aa6b0'); }
    for(let k=-2;k<=2;k++) set(H1[0]+ux*2-uy*k,H1[1]+uy*2+ux*k,wood?'#5e3a20':'#e8b84a');
    for(let i=-3;i<2;i++) set(H1[0]+ux*i,H1[1]+uy*i,'#3a2a22');
    if(!wood){ set(H1[0]-ux*3,H1[1]-uy*3+1,'#d8413b'); set(H1[0]-ux*3,H1[1]-uy*3+2,'#d8413b'); set(H1[0]-ux*3-1,H1[1]-uy*3+3,'#d8413b'); } }
  if(!back&&prop==='lantern'){ line(H1[0],H1[1]+1,H1[0],H1[1]+3,'#3a2a22'); const lx=Math.round(H1[0]), ly=Math.round(H1[1])+4;
    rect(lx-2,ly,5,1,'#e8b84a'); part(c=>ell(lx+.5,ly+4,3,3.5,c),'#d8413b',{seam:false}); rect(lx-1,ly+2,3,4,'#ffd27a'); set(lx,ly+3,'#fff4c0'); rect(lx-2,ly+8,5,1,'#e8b84a'); set(lx,ly+9,'#e8b84a'); set(lx,ly+10,'#e8b84a'); }
  if(!back&&prop==='sachet'){ set(H1[0]+1,H1[1]-2,'#e8b84a'); part(c=>rect(H1[0],H1[1]-1,3,4,c),'#ec7090',{seam:false}); set(H1[0]+1,H1[1],'#f8c8d4'); }
  if(!back&&prop==='herb'){ line(H1[0],H1[1],H1[0]+1,H1[1]-6,'#3f7a3a'); set(H1[0]+2,H1[1]-3,'#5fa35a'); set(H1[0]-1,H1[1]-4,'#5fa35a'); set(H1[0]+2,H1[1]-6,'#7fca5c'); set(H1[0]+1,H1[1]-7,'#f2f2a0'); }
  if(!back&&prop==='jade'){ rect(H1[0],H1[1]-1,3,3,'#7fd0a0'); set(H1[0]+1,H1[1],'#c8f0d8'); line(H1[0]+1,H1[1]+2,H1[0]+1,H1[1]+5,'#d8413b'); }
  if(!back&&prop==='swordlap'){ for(let x=22;x<48;x++){ set(x,42,x<26?'#3a2a22':'#eef3f6'); set(x,43,x<26?'#3a2a22':'#9aa6b0'); } rect(26,41,1,4,'#e8b84a'); }
  // things worn in front
  if(!back) for(const w of wear||[]){
    if(w==='basket'){ part(c=>poly([[hipX+5,43],[hipX+12,43],[hipX+11,49],[hipX+6,49]],c),'#c8a060'); for(let y=44;y<49;y+=2) line(hipX+6,y,hipX+11,y,'#8a6a3a'); line(hipX+6,43,hipX+8,39,'#8a6a3a'); line(hipX+8,39,hipX+11,43,'#8a6a3a'); set(hipX+8,42,'#5fa35a'); set(hipX+9,41,'#7fca5c'); }
    if(w==='pole'){ line(6,33,62,33,'#7a4a2a'); for(const bx of [7,60]){ line(bx,34,bx-2,40,'#3a2a22'); line(bx,34,bx+2,40,'#3a2a22'); part(c=>rect(bx-4,40,9,6,c),'#c8a060'); } }
    if(w==='cane'){ line(H1[0]+1,H1[1],H1[0]+3,55,'#7a4a2a'); }
    if(w==='blood'){ for(const [x,y] of [[33,36],[35,38],[31,44],[36,47]]) set(x,y,'#c8282a'); }
    if(w==='wet'){ for(const [x,y] of [[30,36],[38,40],[33,48],[27,22],[42,25]]){ set(x,y,'#9fd3ef'); set(x,y+1,'#cfeeff'); } }
  }
  // 2) the head, painted at full detail (three-quarter view to the right)
  // faces differ by person (chapter 2): 'small' dot eyes like the map sprites, 'mid' eyes in between; either way the head sits higher so the neck shows
  const small=look.face==='small', mid=look.face==='mid';
  const cx=2*(PCX+7), cy=2*PCY+12+hd-(small||mid?2:0);          // face centre, over the shoulders
  if(back){
    ell(cx-1,cy-2,11,11,HAIR); for(let x=cx-8;x<cx+7;x+=3) rect(x,cy-10,1,3,HAIR2);
    if(st==='topknot'){ ell(cx-1,cy-14,3,3,HAIR); rect(cx-3,cy-12,5,1,'#e8b84a'); }
    if(st==='buns'){ ell(cx-8,cy-11,4,4,HAIR); ell(cx+6,cy-11,4,4,HAIR); }
    if(st==='pony'){ rect(cx-2,cy+6,4,14,HAIR); rect(cx-2,cy+4,4,2,'#d84a4a'); }
    if(st==='long') rect(cx-9,cy+4,17,14,HAIR);
  } else {
    // hair mass behind the face
    ell(cx-1,cy-3,13,11.5,HAIR);
    if(st==='buns'){ ell(cx-10,cy-12,5,5,HAIR); ell(cx+6,cy-14,5,5,HAIR); set(cx-11,cy-15,HAIR2); set(cx+5,cy-17,HAIR2); rect(cx-13,cy-9,4,1,'#d84a4a'); }
    if(st==='topknot'){ ell(cx-1,cy-15,4,4,HAIR); rect(cx-5,cy-12,8,2,'#e8b84a'); set(cx-2,cy-17,HAIR2); }
    if(st==='pony'){ rect(cx-14,cy-9,3,3,'#d84a4a'); }
    // a big round face, chin over the collar
    ell(cx+2,cy+2.5,10.5,9.5,SK);
    for(let y=cy+5;y<cy+11;y++) set(cx-7,y,SK2);
    // fringe: soft jagged bangs
    const fr=[4,5,7,6,4,6,8,7,5,6,8,6,4,5,3,2]; for(let i=0;i<fr.length;i++) rect(cx-7+i,cy-11,1,fr[i]+4,HAIR);
    for(let y=cy-7;y<cy+7;y++){ set(cx-9,y,HAIR); set(cx-8,y,HAIR); if(y<cy+4) set(cx-7,y,HAIR); }
    for(let y=cy-5;y<cy+5;y++){ set(cx+11,y,HAIR); if(y<cy+1) set(cx+10,y,HAIR); }
    if(st==='bob'||st==='long'){ for(let y=cy-2;y<cy+10;y++){ set(cx+11,y,HAIR); set(cx+12,y,HAIR); set(cx-10,y,HAIR); } }
    for(let x=cx-5;x<cx+4;x++) set(x,cy-12+(x>cx-2&&x<cx+2?0:1),HAIR2);
    if(look.g==='f'&&st!=='buns'){ const fx=cx-7, fy=cy-10; for(const [dx,dy] of [[0,-1],[-1,0],[1,0],[0,1]]) set(fx+dx,fy+dy,'#f2a0b0'); set(fx,fy,'#e8b84a'); }
    // eyes: big, with a lash line, two-tone iris and white highlights
    const eye=(ex,ey,w,h)=>{ const iris='#3a2430', iris2=look.g==='f'?'#a8607e':'#5a70a8';
      if(mood==='smile'){ set(ex,ey+3,OUT); set(ex+1,ey+2,OUT); for(let i=2;i<w-2;i++) set(ex+i,ey+1,OUT); set(ex+w-2,ey+2,OUT); set(ex+w-1,ey+3,OUT); return; }
      if(mood==='blink'){ for(let i=0;i<w;i++) set(ex+i,ey+3,OUT); if(look.g==='f') set(ex+w,ey+2,OUT); return; }
      if(mood==='subtle'||mood==='dim'){ const top=mood==='dim'?ey+2:ey+1;
        for(let i=0;i<w;i++) set(ex+i,top,OUT); set(ex-1,top+1,OUT);
        for(let y=top+1;y<ey+h-(mood==='subtle'?1:0);y++) for(let i=0;i<w;i++) set(ex+i,y, y<ey+h-2?iris:iris2);
        if(mood==='subtle'){ for(let i=0;i<w;i++) set(ex+i,ey+h-1,SK2); set(ex+1,top+1,'#ffffff'); }
        else { set(ex+1,ey+h-2,'#c8c8d0'); }
        return; }
      const top=mood==='sad'?ey+2:ey;
      for(let i=0;i<w;i++) set(ex+i,top,OUT); set(ex-1,top+1,OUT);
      if(look.g==='f'){ set(ex+w,top,OUT); set(ex+w,top-1,OUT); }
      for(let y=top+1;y<ey+h;y++) for(let i=0;i<w;i++) set(ex+i,y, y<ey+h-2?iris:iris2);
      set(ex+1,top+1,'#ffffff'); set(ex+2,top+1,'#ffffff'); set(ex+1,top+2,'#ffffff'); if(w>4) set(ex+w-2,ey+h-2,'#ffffff');
      if(mood==='sad') for(let i=0;i<w;i++) set(ex+i,top+1,SK2);
    };
    if(small){ const D='#2a2230', se=(ex,ey)=>{
        if(mood==='smile'){ set(ex,ey+1,OUT); set(ex+1,ey,OUT); set(ex+2,ey+1,OUT); return; }
        if(mood==='blink'){ for(let i=0;i<3;i++) set(ex+i,ey+2,OUT); return; }
        const top=mood==='sad'||mood==='dim'?ey+1:ey; rect(ex,top,2,ey+3-top,D); if(mood!=='angry'&&mood!=='dim') set(ex+1,top,'#e8e6f0'); };
      se(cx+5,cy); se(cx-2,cy);
      if(mood==='angry'){ for(const [x,y] of [[cx+4,cy-1],[cx+5,cy-2],[cx+6,cy-2],[cx+7,cy-3],[cx-1,cy-1],[cx-2,cy-2],[cx-3,cy-3]]) set(x,y,OUT); }
      if(mood==='sad'){ for(const [x,y] of [[cx+4,cy-2],[cx+5,cy-1],[cx+6,cy-1],[cx-1,cy-2],[cx-2,cy-1],[cx-3,cy-1]]) set(x,y,OUT); } }
    else if(mid){ eye(cx+4,cy-1,4,4); eye(cx-3,cy-1,3,4); }
    else { eye(cx+4,cy-2,5,6); eye(cx-4,cy-2,4,6); }
    // brows
    if(!small&&mood==='sad'){ set(cx+4,cy-4,HAIR); set(cx+5,cy-5,HAIR); set(cx+6,cy-5,HAIR); set(cx-1,cy-4,HAIR); set(cx-2,cy-5,HAIR); set(cx-3,cy-5,HAIR); }
    if(!small&&mood==='dim'){ for(let i=0;i<4;i++) set(cx+4+i,cy-3,HAIR); for(let i=0;i<3;i++) set(cx-4+i,cy-3,HAIR); }
    // cheeks
    if(mood==='blush'||mood==='smile'){ for(const [bx,n] of [[cx+5,3],[cx-3,2]]){ for(let i=0;i<n;i++) set(bx+i,cy+5,'#f4909e'); for(let i=0;i<n;i+=2) set(bx+i,cy+6,'#f8b0bc'); } }
    else if(mood!=='dim'){ set(cx+6,cy+5,'#f6c8c4'); }
    // mouth
    const M='#a8483e';
    if(mood==='smile'){ set(cx+1,cy+7,M); set(cx+2,cy+8,M); set(cx+3,cy+8,M); set(cx+2,cy+7,'#e86a6a'); set(cx+3,cy+7,'#e86a6a'); set(cx+4,cy+7,M); }
    else if(mood==='angry'){ set(cx+1,cy+8,M); set(cx+2,cy+7,M); set(cx+3,cy+7,M); set(cx+4,cy+8,M); }
    else if(mood==='sad'){ set(cx+1,cy+9,M); set(cx+2,cy+8,M); set(cx+3,cy+8,M); set(cx+4,cy+9,M); set(cx+9,cy+3,'#9fd3ef'); set(cx+9,cy+4,'#9fd3ef'); set(cx+9,cy+5,'#cfeeff'); }
    else if(mood==='blush'){ set(cx+1,cy+8,M); set(cx+2,cy+7,M); set(cx+3,cy+8,M); set(cx+4,cy+7,M); }
    else if(mood==='subtle'){ set(cx+1,cy+7,M); set(cx+2,cy+8,M); set(cx+3,cy+8,M); set(cx+4,cy+7,M); }
    else if(mood==='dim'){ set(cx+2,cy+8,M); set(cx+3,cy+8,M); set(cx+4,cy+8,M); }
    else { set(cx+2,cy+8,M); set(cx+3,cy+8,M); }
    // an old man's beard and moustache
    if(look.beard){ const B=look.beard, B2=shade(B,-.2); rect(cx-1,cy+9,7,2,B); rect(cx,cy+11,5,2,B); rect(cx+1,cy+13,3,1,B); set(cx+2,cy+14,B2); for(let i=0;i<7;i++) set(cx-1+i,cy+7,i===2||i===3?M:B); set(cx-1,cy+10,B2); set(cx+5,cy+10,B2); }
  }
  // 3) one dark outline around everything
  const c=document.createElement('canvas'); c.width=W; c.height=H; const g=c.getContext('2d');
  const on=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&px[y*W+x];
  g.fillStyle=OUT; for(let y=0;y<H;y++) for(let x=0;x<W;x++){ if(on(x,y)) continue; if(on(x-1,y)||on(x+1,y)||on(x,y-1)||on(x,y+1)) g.fillRect(x,y,1,1); }
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){ const col=px[y*W+x]; if(col){ g.fillStyle=col; g.fillRect(x,y,1,1); } }
  let bottom=H-1; while(bottom>0&&!px.slice(bottom*W,bottom*W+W).some(Boolean)) bottom--; c.bottom=(FP2.seat?FP2.seat+1:bottom+2); c.fine=true;
  return CHIBIC[key]=c;
}


// switched off after the first try: big shiny eyes on everyone (elders, 钱掌柜) looked silly. Faces by age come first.
const CHIBI_MAP=false;
/* ---------- people on the map are chibis too ----------
   The 16-pixel sprites were too coarse to be cute; the CG chibi has twice the detail, so on the map each of its pixels is half a map pixel
   (crisp on a phone's 2× screen). Three-quarter view, mirrored for left; the back view walking up. People stand facing you and blink. */
const MapChibi = {
  box:new Map(),
  // the opaque part of a chibi canvas (for feet and portrait crops)
  bounds(c){ if(MapChibi.box.has(c)) return MapChibi.box.get(c); const g=c.getContext('2d'), d=g.getImageData(0,0,c.width,c.height).data; let x0=c.width,y0=c.height,x1=0,y1=0;
    for(let y=0;y<c.height;y++) for(let x=0;x<c.width;x++) if(d[(y*c.width+x)*4+3]>0){ if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; }
    const b={x0,y0,x1,y1}; MapChibi.box.set(c,b); return b; },
  draw(g,c,flip,x,y,Z,lift){ const k=Z/2, b=MapChibi.bounds(c), w=c.width*k, h=c.height*k;
    const cx=(b.x0+b.x1+1)/2*k, dx=Math.round(x+TILE*Z/2-(flip?w-cx:cx)), dy=Math.round(y+TILE*Z-1*Z-(b.y1+1)*k-(lift||0));
    g.imageSmoothingEnabled=false; if(flip){ g.save(); g.translate(dx+w,dy); g.scale(-1,1); g.drawImage(c,0,0,w,h); g.restore(); } else g.drawImage(c,dx,dy,w,h); },
  blink(seed){ return (Math.floor(RT.t*10+seed*37)%46)===0; },
};
if(CHIBI_MAP) drawPlayer=function(x,y,Z){
  drawShadow(x,y,Z);
  if(RT.dir==='left'||RT.dir==='right') RT.lastH=RT.dir;
  const f=RT.moving?Math.floor(RT.walk*3.2)%4:0, pose=RT.moving&&f%2?'walk':'stand';
  const c=cgChibi(S.look, pose, MapChibi.blink(1)&&!RT.moving?'blink':'normal', null, null, RT.dir==='up');
  MapChibi.draw(ctx, c, RT.dir==='left'||(RT.dir==='down'&&RT.lastH==='left'), x, y, Z, RT.moving&&f%2?Z*.5:0);
  if(isRod(S.sel)&&S.inv[S.sel]){ const o=lookSprite(S.look,'down',0), w=o.width*Z; drawRod(Math.round(x+(TILE*Z-w)/2), Math.round(y+TILE*Z-o.bottom*Z), w, Z); }
};
if(CHIBI_MAP) drawLookNpc=function(g,o,ox,oy,T,Z){
  const c=cgChibi(o.look, 'stand', MapChibi.blink(o.x*3+o.y)?'blink':'normal', null, null, false);
  MapChibi.draw(g, c, RT.fx<o.x-.3, ox+o.x*T, oy+o.y*T, Z, Math.sin(RT.t*2+o.x)>.85?Z*.5:0);
};
// dialogue portraits: the chibi's head and shoulders
if(CHIBI_MAP){ const _line=UI.line; UI.line=function(who,text){ const r=_line.apply(UI,arguments); const cv=$('#dPort'); if(!cv) return r;
    let look=null; if(who==='我'||who===S.name) look=S.look; else { for(const m in MAPS){ const o=MAPS[m].objects.find(o=>o.name===who&&o.look); if(o){ look=o.look; break; } } }
    if(!look) return r;
    const c=cgChibi(look,'stand','normal',null,null,false), b=MapChibi.bounds(c), side=Math.min(b.x1-b.x0+9, b.y1-b.y0+1), sx=Math.round((b.x0+b.x1+1)/2-side/2), sy=b.y0-2;
    cv.width=side; cv.height=side; const g=cv.getContext('2d'); g.imageSmoothingEnabled=false; g.clearRect(0,0,side,side); g.drawImage(c, sx, sy, side, side, 0, 0, side, side); return r; }; }

// the town folk get looks too, so everyone on the map shares the chibi style
const LOOK_YUNYOU={g:'m',skin:1,hair:0,hairColor:3,style:'robe',cloth:1}, LOOK_QIAN={g:'m',skin:2,hair:0,hairColor:0,style:'robe',cloth:7}, LOOK_AHE={g:'f',skin:1,hair:3,hairColor:0,style:'qun',cloth:2};
if(CHIBI_MAP) for(const [id,look] of [['yunyou',LOOK_YUNYOU],['qian',LOOK_QIAN],['ahe',LOOK_AHE]]) for(const m in MAPS) for(const o of MAPS[m].objects) if(o.id===id) o.look=look;
// a chibi fitted into a card canvas (the 18:22 slots on the title screen, sect cards, the 人物 page, the creator): 'full' body or 'bust'
function chibiCard(look, mode, opt){ opt=opt||{};
  if(!CHIBI_MAP){ const sp=lookSprite(look, opt.back?'up':opt.pose==='walk'||opt.flip?'side':'down', opt.pose==='walk'?1:0); if(!opt.flip) return sp;
    const o=document.createElement('canvas'); o.width=sp.width; o.height=sp.height; const g=o.getContext('2d'); g.translate(o.width,0); g.scale(-1,1); g.drawImage(sp,0,0); return o; }
  const c=cgChibi(look, opt.pose||'stand', opt.mood||'normal', null, null, !!opt.back), b=MapChibi.bounds(c), bw=b.x1-b.x0+1, bh=b.y1-b.y0+1;
  let H,W,sx,sy; if(mode==='full'){ H=bh+6; W=Math.round(H*18/22); sx=Math.round((b.x0+b.x1+1)/2-W/2); sy=b.y0-3; }
  else { W=Math.min(bw+8, Math.round(bh*.62)); H=Math.round(W*22/18); sx=Math.round((b.x0+b.x1+1)/2-W/2); sy=b.y0-2; }
  const out=document.createElement('canvas'); out.width=W; out.height=H; const g=out.getContext('2d'); g.imageSmoothingEnabled=false;
  if(opt.flip){ g.translate(W,0); g.scale(-1,1); } g.drawImage(c, sx, sy, W, H, 0, 0, W, H); return out; }
function drawCard(canvas, look, mode, opt){ const sp=chibiCard(look, mode, opt); canvas.width=sp.width; canvas.height=sp.height; canvas.getContext('2d').drawImage(sp,0,0); }
if(CHIBI_MAP) npcSprite=function(id){ for(const m in MAPS) for(const o of MAPS[m].objects) if(o.id===id) return o.look?chibiCard(o.look,'bust'):sprite(o.spr); return null; };
