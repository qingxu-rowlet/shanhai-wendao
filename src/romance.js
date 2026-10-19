/* ============================================================
   山海问道 · 心动事件: illustrated "CG" scenes (painted background + large character art) for 苏小棠 and 顾长歌
   A heart event is an ordinary script; {cg:'scene', who:'tang', title:'…'} opens the picture, {cgend:true} closes it,
   {love:{tang:50}} changes affection.
   ============================================================ */
const CG_SCENES = {
  herb:   {sky:['#bfe3f2','#e6f4d8','#f8f0d0'], sun:'#fff6d0', sunY:.18, hills:['#a8cf9a','#86b874','#6aa05c'], fx:'petals', fore:'meadow'},
  sunset: {sky:['#3c2a5a','#e0765a','#f8c48a'], sun:'#ffdca0', sunY:.52, hills:['#7a4a6a','#5a3456','#3a2240'], fx:'fireflies', fore:'pond'},
  rain:   {sky:['#4a5a6a','#7a8a96','#a0aab0'], sun:null, hills:['#5a6a72','#46545a','#343e44'], fx:'rain', fore:'pavilion'},
  lantern:{sky:['#0a1030','#1a2458','#3a3a78'], sun:'#f6f0d6', sunY:.14, hills:['#1a1a3a','#141430','#0e0e24'], fx:'lanterns', fore:'roofs'},
  bamboo: {sky:['#d8ecd0','#eef6e0','#fbf8e8'], sun:'#fffbe0', sunY:.12, hills:['#9cc79a','#7fb07c','#5f9460'], fx:'leaves', fore:'bamboo'},
  moon:   {sky:['#0c1228','#1c2850','#3a4a7a'], sun:'#f6f2dc', sunY:.22, hills:['#28305a','#1e2448','#141834'], fx:'fireflies', fore:'cliff'},
  campfire:{sky:['#05070e','#0e1420','#1a2030'], sun:null, hills:['#141a22','#0e1218','#080a0e'], fx:'sparks', fore:'fire'},
  dusk:   {sky:['#2a1a3a','#9a4a5a','#f0a070'], sun:'#ffc890', sunY:.48, hills:['#5a2a40','#401c30','#28101e'], fx:'leaves', fore:'meadow'},
};
const CG = {
  parts:[], on:false,
  paint(c, sc, t, dt){
    const g=c.getContext('2d'), w=c.width, h=c.height;
    if(!c._base){ const b=document.createElement('canvas'); b.width=w; b.height=h; const bg=b.getContext('2d');
      const sky=bg.createLinearGradient(0,0,0,h); sc.sky.forEach((col,i)=>sky.addColorStop(i/(sc.sky.length-1),col)); bg.fillStyle=sky; bg.fillRect(0,0,w,h);
      if(sc.sun){ const sx=w*.7, sy=h*sc.sunY, r=Math.min(w,h)*.08, gl=bg.createRadialGradient(sx,sy,r*.4,sx,sy,r*4); gl.addColorStop(0,sc.sun+'aa'); gl.addColorStop(1,sc.sun+'00'); bg.fillStyle=gl; bg.fillRect(0,0,w,h); bg.fillStyle=sc.sun; bg.beginPath(); bg.arc(sx,sy,r,0,7); bg.fill(); }
      const R=rng(sc.hills.join('').length*31);
      sc.hills.forEach((col,li)=>{ const base=h*(.45+li*.1), amp=h*(.12-li*.02), ph=R()*9;
        for(let pass=0;pass<4;pass++){ bg.globalAlpha=pass===3?1:.2; bg.fillStyle=col; bg.beginPath(); bg.moveTo(0,h);
          for(let x=0;x<=w;x+=4) bg.lineTo(x, base-amp*(.6*Math.sin(x/w*Math.PI*2+ph)+.3*Math.sin(x/w*Math.PI*6+ph*2))+(3-pass)*3*(R()-.3)); bg.lineTo(w,h); bg.fill(); }
        bg.globalAlpha=1; });
      CG.fore(bg, sc.fore, w, h, R); c._base=b; }
    g.drawImage(c._base,0,0);
    if(sc.fore==='pond'){ for(let i=0;i<14;i++){ const y=h*.7+i*h*.018, a=.25-i*.015; g.fillStyle=`rgba(255,210,150,${a})`; const wv=Math.sin(t*1.5+i)*12; g.fillRect(w*.62+wv-30+i*2, y, 60-i*3, 2); } }
    if(sc.fore==='fire'){ const fx=w*.5, fy=h*.82, r=h*.35*(1+.05*Math.sin(t*9)), gl=g.createRadialGradient(fx,fy,0,fx,fy,r); gl.addColorStop(0,'rgba(255,170,60,.55)'); gl.addColorStop(1,'rgba(255,120,40,0)'); g.fillStyle=gl; g.fillRect(0,0,w,h);
      g.fillStyle='#ffcf60'; g.beginPath(); g.ellipse(fx,fy-8,14+3*Math.sin(t*12),26+5*Math.sin(t*9),0,0,7); g.fill(); g.fillStyle='#ff7a30'; g.beginPath(); g.ellipse(fx,fy,20,16,0,0,7); g.fill(); }
    const P=CG.parts, want={petals:30,fireflies:26,rain:120,lanterns:22,leaves:24,sparks:40}[sc.fx]||0;
    while(P.length<want) P.push({x:Math.random()*w, y:Math.random()*h, s:Math.random(), v:.5+Math.random()});
    for(const p of P){
      if(sc.fx==='petals'||sc.fx==='leaves'){ p.y+=dt*h*.06*p.v; p.x+=Math.sin(t+p.s*9)*dt*30; if(p.y>h+10){ p.y=-10; p.x=Math.random()*w; }
        g.fillStyle=sc.fx==='petals'?`rgba(245,170,190,${.6+.4*p.s})`:`rgba(${120+p.s*60|0},${170+p.s*40|0},90,.8)`; g.save(); g.translate(p.x,p.y); g.rotate(t*p.v+p.s*6); g.fillRect(-3,-1.5,6,3); g.restore(); }
      if(sc.fx==='fireflies'){ p.x+=Math.sin(t*.7+p.s*9)*dt*20; p.y+=Math.cos(t*.5+p.s*7)*dt*14; const a=.4+.6*Math.abs(Math.sin(t*2+p.s*10)); const r=6;
        const gl=g.createRadialGradient(p.x,p.y,0,p.x,p.y,r*3); gl.addColorStop(0,`rgba(255,250,170,${a})`); gl.addColorStop(1,'rgba(255,250,170,0)'); g.fillStyle=gl; g.fillRect(p.x-r*3,p.y-r*3,r*6,r*6); }
      if(sc.fx==='rain'){ p.y+=dt*h*1.6*p.v; p.x-=dt*60; if(p.y>h){ p.y=-20; p.x=Math.random()*w*1.1; } g.strokeStyle='rgba(220,230,240,.35)'; g.lineWidth=1; g.beginPath(); g.moveTo(p.x,p.y); g.lineTo(p.x-4,p.y+16); g.stroke(); }
      if(sc.fx==='lanterns'){ p.y-=dt*h*.03*p.v; p.x+=Math.sin(t*.6+p.s*5)*dt*8; if(p.y<-30){ p.y=h+20; p.x=Math.random()*w; } const s=8+p.s*10;
        const gl=g.createRadialGradient(p.x,p.y,0,p.x,p.y,s*2.5); gl.addColorStop(0,'rgba(255,200,110,.6)'); gl.addColorStop(1,'rgba(255,160,80,0)'); g.fillStyle=gl; g.fillRect(p.x-s*2.5,p.y-s*2.5,s*5,s*5);
        g.fillStyle='#ffb050'; g.fillRect(p.x-s/2,p.y-s*.6,s,s*1.2); g.fillStyle='#ffe0a0'; g.fillRect(p.x-s/4,p.y-s*.3,s/2,s*.6); }
      if(sc.fx==='sparks'){ p.y-=dt*h*.25*p.v; p.x=w*.5+Math.sin(t*3+p.s*20)*40*p.s+(p.s-.5)*30; if(p.y<h*.3){ p.y=h*.8; } g.fillStyle=`rgba(255,${150+p.s*90|0},60,${.4+.6*p.s})`; g.fillRect(p.x,p.y,2,2); }
    }
  },
  fore(g, kind, w, h, R){
    if(kind==='meadow'){ g.fillStyle='#5f9a4a'; g.fillRect(0,h*.78,w,h*.22); for(let i=0;i<220;i++){ g.fillStyle=R()<.5?'#4f8a3a':'#7ab85c'; g.fillRect(R()*w,h*.76+R()*h*.24,2,6); }
      for(let i=0;i<40;i++){ g.fillStyle=['#f2a0b0','#fff0a0','#ffffff'][i%3]; g.fillRect(R()*w,h*.8+R()*h*.18,4,4); } }
    if(kind==='pond'){ const wg=g.createLinearGradient(0,h*.66,0,h); wg.addColorStop(0,'#e0866a'); wg.addColorStop(1,'#3a2440'); g.fillStyle=wg; g.fillRect(0,h*.66,w,h*.34);
      g.fillStyle='#24142a'; for(let i=0;i<30;i++){ const x=R()*w*.4, hh=h*(.08+R()*.12); g.fillRect(x,h*.7-hh,2,hh); g.fillRect(x-2,h*.7-hh,6,4); } }
    if(kind==='pavilion'){ g.fillStyle='#202a30'; const px=w*.15, pw=w*.7, top=h*.18; g.beginPath(); g.moveTo(px-40,top+60); g.quadraticCurveTo(px+pw*.2,top+30,px+pw*.5,top); g.quadraticCurveTo(px+pw*.8,top+30,px+pw+40,top+60); g.lineTo(px+pw,top+70); g.lineTo(px,top+70); g.fill();
      g.fillRect(px+10,top+70,12,h); g.fillRect(px+pw-22,top+70,12,h); g.fillStyle='#3a464c'; g.fillRect(0,h*.86,w,h*.14); }
    if(kind==='roofs'){ g.fillStyle='#0a0a1c'; for(let i=0;i<6;i++){ const x=i*w/5-30, y=h*(.72+(i%2)*.05), rw=w/4; g.beginPath(); g.moveTo(x,y); g.quadraticCurveTo(x+rw*.5,y-40,x+rw,y); g.lineTo(x+rw,h); g.lineTo(x,h); g.fill(); }
      for(let i=0;i<14;i++){ g.fillStyle='rgba(255,190,90,.8)'; g.fillRect(R()*w,h*(.8+R()*.15),5,7); } }
    if(kind==='bamboo'){ for(let i=0;i<16;i++){ const x=R()*w, ww=8+R()*10; g.fillStyle=`rgba(${70+R()*40|0},${130+R()*40|0},70,${.6+R()*.4})`; g.fillRect(x,0,ww,h); g.fillStyle='rgba(30,70,30,.5)'; for(let y=R()*60;y<h;y+=60+R()*30) g.fillRect(x-1,y,ww+2,3); }
      g.fillStyle='rgba(255,255,220,.12)'; for(let i=0;i<4;i++){ g.beginPath(); g.moveTo(w*(.2+i*.2),0); g.lineTo(w*(.3+i*.2),0); g.lineTo(w*(.1+i*.2),h); g.lineTo(w*(.0+i*.2),h); g.fill(); } }
    if(kind==='cliff'){ g.fillStyle='#0c1020'; g.beginPath(); g.moveTo(0,h); g.lineTo(0,h*.72); g.lineTo(w*.35,h*.7); g.lineTo(w*.55,h*.78); g.lineTo(w,h*.76); g.lineTo(w,h); g.fill(); }
    if(kind==='fire'){ g.fillStyle='#06080c'; g.fillRect(0,h*.86,w,h*.14); for(let i=0;i<12;i++){ const x=R()*w, th=h*(.3+R()*.4); g.fillStyle='#0a0e14'; g.beginPath(); g.moveTo(x,h*.86-th); g.lineTo(x-30,h*.86); g.lineTo(x+30,h*.86); g.fill(); } }
  },
  open(scene, who, title){
    const el=$('#cg'); el.hidden=false; CG.parts=[]; CG.on=true; const token=CG.token=(CG.token||0)+1;
    el.innerHTML=`<canvas id="cgBg"></canvas><div class="cg-chars"><canvas id="cgMe" class="px"></canvas><canvas id="cgHer" class="px"></canvas></div><div class="cg-title"><small>心动事件</small><b>${esc(title)}</b></div>`;
    const bg=$('#cgBg'), dpr=Math.min(2,devicePixelRatio||1); bg.width=innerWidth*dpr; bg.height=innerHeight*dpr;
    const draw=(id,sp,flip)=>{ const c=$(id); c.width=sp.width; c.height=sp.height; const g=c.getContext('2d'); if(flip){ g.translate(sp.width,0); g.scale(-1,1); } g.drawImage(sp,0,0); };
    draw('#cgMe', lookSprite(S.look,'side',0), false); draw('#cgHer', npcSprite(who), false);
    const sc=CG_SCENES[scene]; let t0=performance.now(), last=t0;
    const loop=now=>{ if(!CG.on||CG.token!==token) return; const dt=Math.min(.05,(now-last)/1000); last=now; CG.paint(bg,sc,(now-t0)/1000,dt); requestAnimationFrame(loop); };
    CG.paint(bg,sc,0,0); requestAnimationFrame(loop);
    el.classList.remove('go'); void el.offsetWidth; el.classList.add('go');
    Music.play('romance', true);
  },
  close(){ CG.on=false; const el=$('#cg'); el.hidden=true; el.innerHTML=''; Music.play(areaTheme(),true); },
};

/* ---------- the events ---------- */
const HEART_CG = {
  tang:{
    2:{scene:'herb', title:'药香', steps:[['旁白','清晨，你路过镇外的药圃。苏小棠蹲在田垄间，裙摆上沾着露水。'],['苏小棠','{名}！你来得正好，帮我扶一下这株……对，就是这样，轻一点。'],
      ['旁白','她小心翼翼地把灵草移进药篓，抬头冲你笑了笑，又从袖子里摸出一样东西。'],['旁白','一个绣着山茶花的小香囊，被塞进了你手里。'],
      {choice:'你要怎么说？', options:[{text:'好香，是你亲手绣的？', go:'tang2a'},{text:'谢谢，我会一直带着。', go:'tang2b'}]}]},
    4:{scene:'sunset', title:'池畔晚霞', steps:[['旁白','夕阳把池塘染成了橘红色。苏小棠坐在池边的石头上，轻轻哼着一首小调。'],['旁白','你在她身边坐下。歌声停了一瞬，又继续唱了下去。'],
      ['苏小棠','这是我娘以前唱给我听的。她说……等我遇见想一起看夕阳的人，就唱给他听。'],
      {choice:'……', options:[{text:'那我能一直听你唱吗？', go:'tang4a'},{text:'（安静地陪她看完夕阳）', go:'tang4b'},{text:'这首歌叫什么名字？', go:'tang4c'}]}]},
    6:{scene:'rain', title:'雨中药庐', steps:[['旁白','一场急雨落下。你躲进山脚的旧药庐，却撞见了浑身湿透的苏小棠。'],['苏小棠','阿嚏！……我、我只是想多采一株雪莲，没想到雨这么大。'],
      ['旁白','她冻得嘴唇发白，怀里的药篓却护得好好的——雪莲上一滴雨都没沾。'],
      {choice:'你要怎么做？', options:[{text:'把外衣披在她身上', go:'tang6a'},{text:'运转灵力帮她烘干衣裳', go:'tang6b'},{text:'数落她不要命', go:'tang6c'}]}]},
    8:{scene:'lantern', title:'灯会花笺', steps:[['旁白','桃源镇的灯会。千盏花灯顺着河水漂向远方，夜空亮如白昼。'],['苏小棠','{名}，这边！'],
      ['旁白','她提着一盏小小的山茶花灯，在人群里朝你招手。'],['苏小棠','花笺做好了……就是用你帮我采的那些野山茶。'],
      ['旁白','花笺上是一行娟秀的小字——「青丘晚霞好，愿与君同看」。'],
      {choice:'你……', options:[{text:'我也愿意。', go:'tang8a'},{text:'（郑重地把花笺收进怀里）', go:'tang8b'}]}]},
  },
  ge:{
    2:{scene:'bamboo', title:'木剑', steps:[['顾长歌','你来得正好。'],['旁白','竹林里，顾长歌把一柄木剑抛给你。'],['顾长歌','陪我练一招。'],
      {choice:'你要怎么出剑？', options:[{text:'全力出手', go:'ge2a'},{text:'留三分力，看看他的剑路', go:'ge2b'}]}]},
    4:{scene:'moon', title:'月下拭剑', steps:[['旁白','月色下，顾长歌独自坐在崖边，擦拭着他的佩剑。'],['顾长歌','这把剑，是我师父留下的。'],['顾长歌','他死在饕餮口中。我追了它十年。'],
      ['顾长歌','……我从没跟别人说过这件事。'],
      {choice:'你要说什么？', options:[{text:'我陪你一起找饕餮。', go:'ge4a'},{text:'（在他身边坐下，什么也不说）', go:'ge4b'}]}]},
    6:{scene:'campfire', title:'北方来信', steps:[['旁白','深夜的山林里，你循着火光找到了顾长歌。他坐在篝火旁，手里捏着一块碎掉的玉牌。'],['顾长歌','……你来了。坐吧。'],
      ['旁白','玉牌上刻着半个模糊的徽记，像一柄剑，又像一团火焰。'],['顾长歌','这是我师门留下的最后一样东西。十年前，一夜之间，满门尽灭。'],
      {choice:'你要问吗？', options:[{text:'是谁做的？', go:'ge6a'},{text:'（不再追问，往火堆里添一根柴）', go:'ge6b'}]}]},
    8:{scene:'dusk', title:'并肩', steps:[['旁白','黄昏的山林，妖气骤然翻涌。三只蛊雕从林梢扑下，直冲你们而来！'],['顾长歌','背靠背。别分心。'],
      ['旁白','剑光与灵光交织。最后一只蛊雕坠地时，夕阳正好沉进山后。'],['顾长歌','……你的剑，可以托付后背了。'],['顾长歌','饕餮醒了。我要往北走。'],
      {choice:'你……', options:[{text:'我跟你一起去。', go:'ge8a'},{text:'我等你回来。', go:'ge8b'}]}]},
  },
};
Object.assign(SCRIPTS, {
  tang2a:[['苏小棠','嗯……绣得歪歪扭扭的，你别笑。里面是安神的药草，打坐的时候戴着会好一些。'],{love:{tang:30}},{give:{huichun:1}},{cgend:true}],
  tang2b:[['苏小棠','……一、一直？那你可要说话算话。'],{love:{tang:50}},{give:{huichun:1}},{cgend:true}],
  tang4a:[['苏小棠','你、你在说什么呀！'],['旁白','她把脸埋进膝盖里，耳朵红得像晚霞。'],{love:{tang:50}},{cgend:true}],
  tang4b:[['旁白','谁都没有说话。最后一缕阳光沉进山后，她悄悄靠近了一点点。'],['苏小棠','……谢谢你，{名}。'],{love:{tang:60}},{cgend:true}],
  tang4c:[['苏小棠','叫《青丘谣》。……下次，我教你唱。'],{love:{tang:30}},{cgend:true}],
  tang6a:[['旁白','你把外衣披在她肩上。她愣了一下，把脸藏进衣领里。'],['苏小棠','……有你的味道。啊！我是说，有、有灵草的味道！'],{love:{tang:60}},{cgend:true}],
  tang6b:[['旁白','你掌心泛起暖暖的灵光，衣裳上的水汽化作白雾散去。'],['苏小棠','好厉害……{名}，你越来越像个真正的修士了。'],{love:{tang:40}},{cgend:true}],
  tang6c:[['苏小棠','……我知道错了嘛。可是你下次受伤的时候，用得上雪莲的。'],['旁白','你一下子说不出话来。'],{love:{tang:20}},{cgend:true}],
  tang8a:[['苏小棠','……嗯！'],['苏小棠','等你在宗门里站稳了脚跟，我们再一起看一次灯会，好不好？'],['旁白','【小棠的故事，将在第二章继续……】'],{love:{tang:60}},{flag:'tang_promise'},{cgend:true}],
  tang8b:[['旁白','她看着你把花笺收好，笑得眼睛弯成了月牙。'],['苏小棠','等你在宗门里站稳了脚跟，我们再一起看一次灯会，好不好？'],['旁白','【小棠的故事，将在第二章继续……】'],{love:{tang:50}},{flag:'tang_promise'},{cgend:true}],
  ge2a:[['旁白','木剑相交，你被震得虎口发麻，连退三步。'],['顾长歌','……不错，够狠。'],['顾长歌','这个给你，路上用得着。'],{give:{juqi:1}},{love:{ge:50}},{cgend:true}],
  ge2b:[['旁白','你只守不攻。几个回合后，顾长歌收剑而立，嘴角难得地扬了一下。'],['顾长歌','你在看我的剑路？……眼力不错。'],{give:{juqi:1}},{love:{ge:40}},{cgend:true}],
  ge4a:[['顾长歌','……那是我的仇，不是你的。'],['旁白','他沉默了很久，最后把一枚剑穗放在了你手里。'],['顾长歌','可若真有那一天……我不会拒绝。'],{love:{ge:60}},{cgend:true}],
  ge4b:[['旁白','月光照在剑身上，像一道细长的河。你们就这样坐到了天明。'],['顾长歌','……{名}，谢谢你听我说完。'],{love:{ge:50}},{cgend:true}],
  ge6a:[['顾长歌','……我不确定。'],['顾长歌','那天晚上，我只看见了一张青铜面具。上面的纹路……像极了饕餮。'],{flag:'ge_mask'},{love:{ge:30}},{cgend:true}],
  ge6b:[['旁白','火光噼啪作响。过了很久，顾长歌低声开口。'],['顾长歌','谢谢你没有问。……总有一天，我会全都告诉你。'],{love:{ge:60}},{cgend:true}],
  ge8a:[['顾长歌','……傻子。你有你的宗门。'],['顾长歌','不过——等你修为稳了，北边见。'],['旁白','【长歌的故事，将在第二章继续……】'],{love:{ge:60}},{flag:'ge_promise'},{cgend:true}],
  ge8b:[['顾长歌','……好。'],['旁白','他转过身，背影在晚霞里拉得很长很长。'],['旁白','【长歌的故事，将在第二章继续……】'],{love:{ge:50}},{flag:'ge_promise'},{cgend:true}],
});

/* chat triggers the next heart event once the hearts are there */
{ const _chat=Social.chat;
  Social.chat=function(id){
    const ev=HEART_CG[id];
    if(ev){ const r=Social.rel(id), h=Social.hearts(id);
      for(const lv of [2,4,6,8]) if(h>=lv && !r.ev[lv]){ r.ev[lv]=true; if(r.talked!==S.day){ r.talked=S.day; } Sound.levelup();
        const e=ev[lv]; return UI.say([{cg:e.scene, who:id, title:e.title}, ...e.steps]); } }
    return _chat.call(Social,id);
  };
}
// replay any event from the 人物 tab once it has been seen
CG.replay=(id,lv)=>{ const e=HEART_CG[id][lv]; UI.closePanel(); UI.say([{cg:e.scene, who:id, title:e.title}, ...e.steps.map(s=>s.choice?{...s, options:s.options.map(o=>({...o}))}:s)]); };
