/* ============================================================
   山海问道 · collecting: more spirit plants, 金品 harvests, farm automation, glowing fishing spots,
   山海经 fish kings, and the 图鉴 that records it all
   ============================================================ */
Object.assign(SPR, {
  i_xuelian:['............','.....ww.....','...w.ww.w...','..wwzwwzww..','..wzwwwwzw..','...wwlwww...','..wwwwwwww..','....wzzw....','.....GG.....','....G..G....','............','............'],
  i_tanhua:['............','....vzzv....','...zwwwwz...','..zwwywwwz..','..vwyyywwv..','...zwwwwz...','....vzzv....','.....GG.....','......G.....','.....GG.....','............','............'],
  i_jiao:['............','.......G....','......GG....','.....rrG....','....rrr.....','...rrwr.....','...rrr......','..rrr.......','..rr........','.R..........','............','............'],
  i_seedw:['............','.....l......','....lw......','...tnnnt....','..tnnnnnt...','..nnnnnnn...','..nnnTnnn...','..nnnnnnn...','...nnnnn....','............','............','............'],
  i_seedv:['............','.....v......','....vV......','...tnnnt....','..tnnnnnt...','..nnnnnnn...','..nnnTnnn...','..nnnnnnn...','...nnnnn....','............','............','............'],
  i_seedo:['............','.....o......','....oO......','...tnnnt....','..tnnnnnt...','..nnnnnnn...','..nnnTnnn...','..nnnnnnn...','...nnnnn....','............','............','............'],
  xuelian_2:['................','................','................','................','.......G........','......GgG.......','.....G.g.G......','....GGgggGG.....','.....GgggG......','.......g........','.......g........','................','................','................','................','................'],
  xuelian_3:['................','.......w........','.....w.w.w......','....wzwwwzw.....','...wwzwlwzww....','....wwwwwww.....','..G..wzzzw..G...','..GG..GgG..GG...','...GGGgggGGG....','.....GgggG......','.......g........','................','................','................','................','................'],
  tanhua_2:['................','................','................','.......v........','......vGv.......','.......G........','.....G.G.G......','....GG.G.GG.....','......GGG.......','.......G........','.......G........','................','................','................','................','................'],
  tanhua_3:['................','.....v.z.v......','....zwwwwwz.....','...vwwyyywwv....','...zwyyyyywz....','....wwyyyww.....','.....zwwwz......','......vGv.......','.....G.G.G......','....GG.G.GG.....','......GGG.......','.......G........','................','................','................','................'],
  jiao_2:['................','................','................','................','................','......G.G.......','.....GgGgG......','....GgggggG.....','.....GgggG......','.......g........','.......g........','................','................','................','................','................'],
  jiao_3:['................','................','....r.....r.....','...rr.GG.rr.....','...r.GgggG.r....','....GgrgrggG....','...GgrgggrggG...','....GrgggrgG....','.....rGgGr......','......rgr.......','.......g........','................','................','................','................','................'],
  sprinkler:['................','................','.......l........','....l..l..l.....','.....l.l.l......','......lll.......','....eeeeeee.....','...eEllllllEe...','...eElllllllEe..','...eeEEEEEEEe...','....eeeeeeee....','................','................','................','................','................'],
  puppet:['................','......tttt......','....tttttttt....','.....nnnnnn.....','.....nknnkn.....','.....nnnnnn.....','......nnnn......','....rrrrrrrr....','...nrrrrrrrrn...','...n.rrrrrr.n...','.....rrrrrr.....','.....nn..nn.....','.....nn..nn.....','................','................','................'],
  i_wenyao:['............','..ww........','..wzw.......','...wz.XXXX..','....XXXXwkX.','..XXXXXXXXXX','....XXXXXX..','...wz.XXX...','..wzw.......','..ww........','............','............'],
  i_heluo:['............','..X.X.X.....','..X.X.X.....','...XXXX.....','..XXXXXXXX..','..XXXXXXwkX.','..XXXXXXXXXX','...XXXX.....','..X.X.X.....','..X.X.X.....','............','............'],
  i_chiru:['............','............','.....ssss...','....sksks...','..X.ssmss...','..XXXXssXXX.','..XXXXXXXXXX','..X.XXXXXX..','.....XXX....','............','............','............'],
});
PAL.m=PAL.m||'#c04a8a';
Object.assign(ITEMS, {
  seed_xl:{name:'雪莲种', icon:'i_seedw', seed:'xuelian', price:60, desc:'六日成熟。雪山上才有的灵种，开出的雪莲能入药。'},
  seed_th:{name:'月光昙种', icon:'i_seedv', seed:'tanhua', price:40, desc:'四日成熟。昙花一现，在月光下最美。'},
  seed_jj:{name:'赤焰椒种', icon:'i_seedo', seed:'jiao', price:15, desc:'两日成熟。辣得人直冒火，修士拿它驱寒。'},
  xuelian:{name:'雪莲', icon:'i_xuelian', sell:120, desc:'冰清玉洁的雪莲，云游子说能炼成好丹。'},
  tanhua:{name:'月光昙', icon:'i_tanhua', sell:70, desc:'泛着淡淡月光的昙花。'},
  jiao:{name:'赤焰椒', icon:'i_jiao', sell:28, desc:'红得发亮的辣椒。'},
  sprinkler:{name:'灵泉阵', icon:'i_stone', tool:false, place:true, price:300, sell:0, desc:'选中后点灵田的格子安放。每天清晨自动浇灌周围 8 格。用锄头可以收回。'},
  puppet:{name:'播种傀儡', icon:'i_slip', price:500, sell:0, desc:'买下后它会守在灵田旁：每天清晨自动收获成熟的灵植，并用你行囊里的种子补种。'},
  fish_wenyao:{name:'文鳐鱼', icon:'i_wenyao', color:'#7fb6e8', sell:220, desc:'《西山经》：状如鲤鱼，鱼身而鸟翼……夜飞，见则天下大穰。'},
  fish_lu:{name:'鯥鱼', icon:'i_fish', color:'#a86a3a', sell:180, desc:'《南山经》：其状如牛，陵居，蛇尾有翼，其羽在魼下。'},
  fish_heluo:{name:'何罗鱼', icon:'i_heluo', color:'#e8b84a', sell:600, desc:'【鱼王】《北山经》：一首而十身，其音如吠犬，食之已痈。'},
  fish_chiru:{name:'赤鱬', icon:'i_chiru', color:'#e0503a', sell:666, desc:'【鱼王】《南山经》：青丘之山……英水出焉，其中多赤鱬，其状如鱼而人面，其音如鸳鸯，食之不疥。'},
});
Object.assign(CROPS, {
  xuelian:{name:'雪莲', days:6, stages:['crop_seed','crop_sprout','xuelian_2','xuelian_3'], yield:['xuelian',1]},
  tanhua:{name:'月光昙', days:4, stages:['crop_seed','crop_sprout','tanhua_2','tanhua_3'], yield:['tanhua',2]},
  jiao:{name:'赤焰椒', days:2, stages:['crop_seed','crop_sprout','jiao_2','jiao_3'], yield:['jiao',3]},
});
SHOP.sell.push('zhuguo');
NPCS.yunyou.loves.push('xuelian'); NPCS.tang.likes.push('tanhua','xuelian'); NPCS.ahe.loves.push('tanhua'); NPCS.ge.likes.push('jiao'); NPCS.qian.likes.push('fish_wenyao');
MAPS.home.objects.push({type:'npc_obj', x:9, y:9, spr:'puppet', act:'puppet', cond:s=>!!s.puppet});

const FISH = {
  fish_li:{min:18,max:45, rare:1}, fish_yin:{min:20,max:50, rare:1}, fish_mo:{min:25,max:60, rare:2}, fish_jin:{min:30,max:70, rare:3},
  fish_wenyao:{min:30,max:80, rare:3}, fish_lu:{min:40,max:110, rare:3}, fish_heluo:{min:120,max:260, rare:4, king:true}, fish_chiru:{min:90,max:200, rare:4, king:true},
};
const FISH_ORDER=['fish_li','fish_yin','fish_mo','fish_jin','fish_wenyao','fish_lu','fish_heluo','fish_chiru'];
const CROP_ORDER=['lingcao','lingmo','zhuguo','flower'];

const Life = {
  col(){ S.col=S.col||{crops:{},fish:{}}; return S.col; },
  /* ---------- harvesting with a chance of 金品 ---------- */
  harvest(k,p,x,y,auto){
    const c=CROPS[p.crop], gold=Math.random()<.12, n=c.yield[1]*(gold?2:1), id=c.yield[0];
    addItem(id,n); S.st.harvested++; const rec=Life.col().crops[id]=Life.col().crops[id]||{n:0,gold:false}; rec.n++; if(gold) rec.gold=true;
    delete p.crop; p.stage=0; p.days=0;
    if(!auto){ Sound.pick(); UI.float(x,y,`${gold?'★金品 ':''}+${n} ${ITEMS[id].name}`); if(gold) Sound.levelup(); Story.check(); }
    Life.checkSets(); return n;
  },
  checkSets(){
    const C=Life.col();
    if(!S.flags.crop_set && CROP_ORDER.every(id=>C.crops[id])){ S.flags.crop_set=true; addItem('huichun',3); UI.banner('灵材图鉴集齐！'); UI.toast('奖励：回春丹 ×3'); }
    if(!S.flags.fish_set && FISH_ORDER.every(id=>C.fish[id])){ S.flags.fish_set=true; S.flags.goldrod=true; UI.banner('鱼类图鉴集齐！'); UI.toast('奖励：钓竿升级为金钓竿（收线框更大）'); }
  },
  /* ---------- each morning ---------- */
  newDay(){
    if(S.inv.puppet){ addItem('puppet',-S.inv.puppet); S.puppet=true; S.puppetSeed=S.puppetSeed||'auto'; UI.toast('播种傀儡已经守在灵田旁了'); }
    // sprinklers water their neighbours
    for(const k in S.farm){ const p=S.farm[k]; if(!p.sprinkler) continue; const [map,xy]=k.split(':'), [x,y]=xy.split(',').map(Number);
      for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){ const q=S.farm[map+':'+(x+dx)+','+(y+dy)]; if(q&&q.tilled&&!q.sprinkler) q.water=1; } }
    // the puppet harvests and replants
    if(S.puppet){ let got=0, planted=0;
      for(const k in S.farm){ const p=S.farm[k]; if(p.sprinkler||!p.tilled) continue;
        if(p.crop&&p.stage>=3) got+=Life.harvest(k,p,0,0,true);
        if(!p.crop){ const seed=Life.puppetSeed(); if(seed){ addItem(seed,-1); p.crop=ITEMS[seed].seed; p.stage=0; p.days=0; planted++; } } }
      if(got||planted) S._puppetNote=`播种傀儡：收获 ${got} 份，补种 ${planted} 格`; }
    // glowing water: one spot in each pond
    S.glow=[]; for(const m of ['town','forest']){ const w=Life.waterSpots(m); if(w.length&&Math.random()<.85){ const [x,y]=w[Math.floor(Math.random()*w.length)]; S.glow.push({map:m,x,y}); } }
  },
  puppetSeed(){ const pref=S.puppetSeed; if(pref&&pref!=='auto') return S.inv[pref]?pref:null;
    const seeds=Object.keys(S.inv).filter(k=>ITEMS[k].seed&&S.inv[k]>0).sort((a,b)=>S.inv[b]-S.inv[a]); return seeds[0]||null; },
  puppetMenu(){
    const seeds=Object.keys(ITEMS).filter(k=>ITEMS[k].seed);
    UI.say([{choice:`播种傀儡咔哒咔哒地点头。要它补种什么？（现在：${S.puppetSeed==='auto'?'自动选最多的种子':ITEMS[S.puppetSeed].name}）`,
      options:[{text:'自动（种得最多的）', fn:()=>{ S.puppetSeed='auto'; UI.toast('傀儡：自动补种'); }}, ...seeds.filter(k=>S.inv[k]).map(k=>({text:`${ITEMS[k].name}（有 ${S.inv[k]}）`, fn:()=>{ S.puppetSeed=k; UI.toast('傀儡：补种'+ITEMS[k].name); }})), {text:'没事了', fn:()=>{}}]}]);
  },
  waterSpots(m){ const M=MAPS[m], out=[];
    for(let y=0;y<M.h;y++) for(let x=0;x<M.w;x++){ if(M.ground[y][x]!=='~') continue;
      if([[0,1],[1,0],[0,-1],[-1,0]].some(([dx,dy])=>{ const c=(M.ground[y+dy]||'')[x+dx]; return c&&!'~WB'.includes(c); })) out.push([x,y]); }
    return out; },
  glowAt(m,x,y){ return (S.glow||[]).find(g=>g.map===m&&g.x===x&&g.y===y); },
  drawGround(g, ox, oy, T, Z){
    if(S.glow===undefined){ S.glow=[]; for(const m of ['town','forest']){ const w=Life.waterSpots(m); if(w.length){ const [x,y]=w[Math.floor(Math.random()*w.length)]; S.glow.push({map:m,x,y}); } } }
    for(const gl of S.glow||[]){ if(gl.map!==RT.mapId) continue; const cx=ox+(gl.x+.5)*T, cy=oy+(gl.y+.5)*T, r=T*(.55+.12*Math.sin(RT.t*3));
      const gr=g.createRadialGradient(cx,cy,0,cx,cy,r); gr.addColorStop(0,'rgba(255,240,160,.85)'); gr.addColorStop(.5,'rgba(255,210,90,.35)'); gr.addColorStop(1,'rgba(255,210,90,0)');
      g.fillStyle=gr; g.fillRect(cx-r,cy-r,r*2,r*2);
      for(let i=0;i<4;i++){ const a=RT.t*2+i*1.57, rr=T*.35; g.fillStyle='rgba(255,255,220,.9)'; g.fillRect(Math.round(cx+Math.cos(a)*rr), Math.round(cy+Math.sin(a)*rr*.5), Z, Z); } }
    for(const k in S.farm){ if(!k.startsWith(RT.mapId+':')||!S.farm[k].sprinkler) continue; const [x,y]=k.split(':')[1].split(',').map(Number); drawSprite('sprinkler', ox+x*T, oy+y*T, Z, 0); }
  },
  /* ---------- fishing tables ---------- */
  pick(spot){
    const night=S.min/60>=19||S.min/60<6, r=Math.random(), forest=RT.mapId==='forest';
    const F=(id,speed,jumpy)=>({id,speed,jumpy});
    if(spot){
      const king=r<(night?.15:.06);
      if(forest){ if(king) return F('fish_chiru',2.1,1.9); if(r<.4) return F('fish_jin',1.9,1.6); if(r<.7) return F('fish_wenyao',2.1,1.8); return F('fish_mo',1.5,1.2); }
      if(king) return F('fish_heluo',2.0,2.0); if(r<.45) return F('fish_wenyao',2.1,1.8); if(r<.8) return F('fish_lu',1.8,1.5); return F('fish_yin',1.2,.9);
    }
    if(forest && r<(night?.1:.05)) return F('fish_jin',1.9,1.6);
    if(night && r<.35) return F('fish_mo',1.5,1.2);
    if(r<.6) return F('fish_li',.8,.6); return F('fish_yin',1.2,.9);
  },
  bookHTML(tab){
    const C=Life.col(), sub=`<div class="tabs sub">${[['beast','妖兽'],['crop','灵材'],['fish','鱼类']].map(([k,n])=>`<button data-bk="${k}" class="${k===tab?'on':''}">${n}</button>`).join('')}</div>`;
    if(tab==='crop'){ const got=CROP_ORDER.filter(id=>C.crops[id]).length;
      return sub+`<p class="muted">已收集 ${got}/${CROP_ORDER.length}　${S.flags.crop_set?'✓ 已领取集齐奖励（回春丹 ×3）':'集齐奖励：回春丹 ×3'}</p><div class="book">${CROP_ORDER.map(id=>{ const r=C.crops[id], it=ITEMS[id];
        return `<div class="bk ${r?'':'unk'}"><img class="px" src="${iconURL(it.icon,it.color)}" alt=""><div><b>${r?it.name:'？？？'}${r&&r.gold?' <span class="goldstar">★金品</span>':''}</b><p>${r?`${esc(it.desc)}<br>采集 ${r.n} 次`:'采集到就会记录在这里。'}</p></div></div>`; }).join('')}</div>`; }
    if(tab==='fish'){ const got=FISH_ORDER.filter(id=>C.fish[id]).length;
      return sub+`<p class="muted">已收集 ${got}/${FISH_ORDER.length}　${S.flags.fish_set?'✓ 已获得金钓竿':'集齐奖励：金钓竿'}　·　水面泛起金光的地方，能钓到稀有鱼和鱼王。</p><div class="book">${FISH_ORDER.map(id=>{ const r=C.fish[id], it=ITEMS[id], f=FISH[id];
        return `<div class="bk ${r?'':'unk'}${f.king?' king':''}"><img class="px" src="${iconURL(it.icon,it.color)}" alt=""><div><b>${r?it.name:'？？？'} <span class="rare">${'◆'.repeat(f.rare)}</span></b><p>${r?`${esc(it.desc)}<br>钓到 ${r.n} 条 · 最大 ${r.max} 厘米`:f.king?'传说中的鱼王……只在金光水面出没。':'还没有钓到过。'}</p></div></div>`; }).join('')}</div>`; }
    return sub+`<div class="book">${Object.keys(BEASTS).filter(k=>!BEASTS[k].self).map(k=>{ const B=BEASTS[k], s=S.seen[k]; return `<div class="bk ${s?'':'unk'}"><img class="px" src="${iconURL(B.spr)}" alt=""><div><b>${s?B.name:'？？？'}</b><p>${s?esc(B.lore):'尚未遇见。'}</p></div></div>`; }).join('')}</div>`;
  },
};

/* ---------- hook into farming, fishing and the morning ---------- */
{ const _farm=farmAct;
  farmAct=function(x,y){
    const k=farmKey(x,y), p=S.farm[k];
    if(p&&p.sprinkler){ if(S.sel==='hoe'){ delete S.farm[k]; addItem('sprinkler'); Sound.dig(); UI.toast('收回了灵泉阵'); } else UI.toast('灵泉阵：每天清晨浇灌周围 8 格（用锄头收回）'); return; }
    if(p&&p.crop&&p.stage>=3) return Life.harvest(k,p,x,y);
    if(S.sel==='sprinkler'){ if(!S.inv.sprinkler) return; if(p&&p.crop) return UI.toast('这里种着灵植，换个空格吧');
      addItem('sprinkler',-1); S.farm[k]={tilled:1,sprinkler:1,water:0,stage:0,days:0}; Sound.dig(); UI.toast('安放了灵泉阵'); return; }
    return _farm(x,y);
  };
}
{ const _fish=Mini.fish; Mini.fish=function(tx,ty){ if(!S.inv.rod) return UI.toast('需要钓竿（钱掌柜那里有卖）'); if(tx==null){ const p=findPrompt(); if(p&&p.fish){ tx=p.x; ty=p.y; } } Mini._spot=(tx!=null)?Life.glowAt(RT.mapId,tx,ty):null; S.sel='rod'; RT.fishing=tx!=null?{x:tx,y:ty,bite:false}:null; _fish.call(Mini); $('#minigame').classList.add('sheet'); }; }
{ const _close=Mini.close; Mini.close=function(){ RT.fishing=null; $('#minigame').classList.remove('sheet'); return _close.apply(Mini,arguments); }; }
Mini.fishPick=()=>Life.pick(Mini._spot);
Mini.reel=function(fish){
  const el=$('#minigame'), it=ITEMS[fish.id], king=FISH[fish.id].king;
  el.innerHTML=`<div class="mg wood fishg ${king?'kingfish':''}"><h3>${king?'鱼王上钩了！！':'收线！'}</h3><div class="reel-wrap"><div class="reel"><div class="catch" id="rcBox"></div><div class="fishi" id="rcFish"><img class="px" src="${iconURL(it.icon,it.color)}" alt=""></div></div>
    <div class="rprog"><i id="rcProg"></i></div></div><p class="mg-tip">${king?'它的力气大得惊人——稳住！':'按住「提竿」让绿框上升，把鱼框住！'}</p><button class="btn main big" id="rcBtn">提竿（按住）</button></div>`;
  if(king){ Music.stinger('boss'); }
  let b=.1, bv=0, f=.5, fTarget=.5, p=.3, holding=false, t=0; const box=(S.flags.goldrod?.34:.26)*(king?.9:1); const unbind=Mini.hold($('#rcBtn'), x=>holding=x);
  Mini.run(dt=>{
    t+=dt; bv+=(holding?1.8:-1.6)*dt; bv*=.93; b=Math.max(0,Math.min(1-box,b+bv*dt*2)); if(b===0||b===1-box) bv=0;
    if(Math.random()<dt*fish.jumpy) fTarget=Math.random(); f+=(fTarget-f)*Math.min(1,dt*fish.speed*2);
    const inside=f>=b&&f<=b+box; p=Math.max(0,Math.min(1,p+(inside?(king?.28:.32):(king?-.2:-.22))*dt));
    $('#rcBox').style.bottom=(b*100)+'%'; $('#rcBox').style.height=(box*100)+'%'; $('#rcFish').style.bottom=`calc(${f*100}% - 12px)`; $('#rcProg').style.height=(p*100)+'%';
    $('#rcBox').classList.toggle('on',inside);
    if(p>=1||p<=0){ Mini.stop(); unbind(); const ok=p>=1; let size=0, first=false, record=false;
      if(ok){ addItem(fish.id); const F=FISH[fish.id]; size=Math.round(F.min+(F.max-F.min)*Math.pow(Math.random(),1.6));
        const C=Life.col(), r=C.fish[fish.id]=C.fish[fish.id]||{n:0,max:0}; first=!r.n; record=size>r.max; r.n++; r.max=Math.max(r.max,size);
        if(Mini._spot){ S.glow=S.glow.filter(g=>g!==Mini._spot); }
        if(king&&first){ S.stones+=300; UI.banner('钓到鱼王！'); }
        Sound.levelup(); Life.checkSets(); } else Sound.hurt();
      el.querySelector('.fishg').innerHTML=`<h3>${ok?(king?'钓到了鱼王！':'钓到了！'):'鱼跑了……'}</h3>${ok?`<p class="mg-tip"><img class="px" style="width:56px" src="${iconURL(it.icon,it.color)}" alt=""><br><b>${it.name}</b>　${size} 厘米${record&&!first?'　<span class="goldstar">新纪录！</span>':''}${first?'　<span class="goldstar">图鉴新收录</span>':''}<br><small>${esc(it.desc)}</small>${king&&first?'<br><b>首次钓到鱼王，奖励 300 灵石！</b>':''}</p>`:''}<button class="btn main" id="rcOk">好</button>`;
      $('#rcOk').onclick=()=>{ Mini.close(); Music.play(areaTheme()); }; }
  });
};
{ const _nd=Hooks.newDay; Hooks.newDay=function(){ _nd.apply(this,arguments); Life.newDay(); }; }
