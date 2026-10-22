/* ============================================================
   山海问道 · 悬赏榜 — a notice board in 桃源镇 with three fresh requests every morning.
   Requests reuse what the game already tracks: beasts slain by kind, items in the bag (handed in),
   gifts given today, today's 奇遇. Rewards are spirit stones and 声望 (renown), which buys rare goods.
   ============================================================ */
// the board: a little roofed notice board, painted like the trees
SPR.board=SPR.sign; SPRC.board=(()=>{ const c=document.createElement('canvas'); c.width=20; c.height=24; const g=c.getContext('2d'), f=(x,y,w,h,col)=>{ g.fillStyle=col; g.fillRect(x,y,w,h); };
  f(3,8,2,15,'#4a2e1a'); f(15,8,2,15,'#4a2e1a'); f(3,8,1,15,'#6b4428'); f(15,8,1,15,'#6b4428');           // posts
  f(0,3,20,3,'#7a3636'); f(1,2,18,1,'#a0504a'); f(2,1,16,1,'#642a2a'); f(0,6,20,1,'#4a1f1f'); f(0,1,2,2,'#2a1e1a'); f(18,1,2,2,'#2a1e1a');  // little roof
  f(2,7,16,11,'#2a1e1a'); f(3,8,14,9,'#a8743f'); f(3,8,14,1,'#c8945a');                                     // board
  f(4,9,5,6,'#f3e6c8'); f(10,10,6,5,'#fbf3e4'); f(5,11,3,1,'#8a6a4a'); f(5,13,3,1,'#8a6a4a'); f(11,12,4,1,'#8a6a4a'); f(6,9,1,1,'#c8413b'); f(12,10,1,1,'#c8413b');  // posted notes
  f(1,22,18,2,'rgba(0,0,0,0)'); c.bottom=23; return c; })();
MAPS.town.objects.push({type:'board', x:14, y:7, act:'board', spr:'board'});

const RANKS=[[0,'无名小卒'],[5,'小有名气'],[15,'桃源侠士'],[30,'青丘名士'],[60,'名动一方']];
const REP_SHOP=[{id:'juqi',n:1,cost:1},{id:'huichun',n:2,cost:2},{id:'xueshen',n:1,cost:3},{id:'peiyuan',n:1,cost:4},{id:'zhuguo',n:2,cost:4},{id:'wuse',n:1,cost:6},{id:'rod_bamboo',n:1,cost:8,once:true}];
// request templates; `make` returns the request (or null when it doesn't fit today)
const BOUNTY_KINDS = [
  {kind:'kill', make:()=>{ const pool=[['dangkang','当康又拱了镇外的菜地','钱掌柜'],['xingxing','狌狌溜进镇里偷鸡','阿禾']]; if(S.L>=4) pool.push(['guidiao','山林里有蛊雕伤人','猎户']);
    const [k,why,who]=pool[Math.random()*pool.length|0], n=2+(Math.random()*3|0); return {key:k, n, base:(S.st.kb||{})[k]||0, who, text:`${why}——击败 ${n} 只${BEASTS[k].name}`, pay:15*n+(k==='guidiao'?30:0), rep:k==='guidiao'?2:1}; }},
  {kind:'item', make:()=>{ const pool=[['lingcao',3,'城里药铺订了一批灵草','钱掌柜',30],['lingmo',2,'奶奶想喝灵菇汤','阿禾',25],['hide',2,'要给孩子们做冬衣','裁缝',40],
      ['huichun',1,'镇上有人受了伤','云游子',45],['juqi',1,'有位书生想试试修仙','书生',40],['zhuguo',1,'过寿要用朱果做寿桃','王大娘',70],['fish_li',1,'今晚想吃红烧鲤鱼','钱掌柜',30],['fish_yin',1,'要一条银鱼熬汤','阿禾',30]];
    const [id,n,why,who,pay]=pool[Math.random()*pool.length|0]; return {key:id, n, who, text:`${why}——交 ${n} 个${ITEMS[id].name}`, pay, rep:1}; }},
  {kind:'gift', make:()=>{ const pool=['ahe','qian','yunyou','tang','ge'].filter(k=>NPCS[k]); const k=pool[Math.random()*pool.length|0];
    return {key:k, n:1, who:'镇上的热心人', text:`${NPCS[k].name}最近闷闷不乐——今天之内送份礼物，哄哄开心`, pay:25, rep:1}; }},
  {kind:'qiyu', make:()=>S.qiyu&&!S.qiyu.done ? {key:S.qiyu.ev, n:1, who:'云游子', text:'听说'+MAPS[S.qiyu.map||'forest'].name+'里今天有异象——去看看是什么（找到奇遇）', pay:40, rep:2} : null},
];
const Bounty = {
  rep(){ return S.rep||0; },
  rank(){ let r=0; RANKS.forEach(([n],i)=>{ if(Bounty.rep()>=n) r=i; }); return r; },
  // the day's requests: three (four from 桃源侠士 up), never two of the same kind+target
  roll(){
    const want=Bounty.rank()>=2?4:3, list=[], mul=1+.25*Bounty.rank();
    for(let tries=0; list.length<want && tries<40; tries++){
      const K=BOUNTY_KINDS[Math.random()*BOUNTY_KINDS.length|0], b=K.make(); if(!b) continue;
      // different kinds first; repeats of a kind only once every kind is on the board
      const kinds=new Set(list.map(x=>x.kind)), avail=BOUNTY_KINDS.filter(k=>k.kind!=='qiyu'||(S.qiyu&&!S.qiyu.done)).length;
      if(kinds.has(K.kind)&&kinds.size<avail) continue;
      if(list.some(x=>x.kind===K.kind&&x.key===b.key)) continue;
      if(K.kind==='qiyu'&&kinds.has('qiyu')) continue;
      list.push({...b, kind:K.kind, pay:Math.round(b.pay*mul), done:false});
    }
    S.bounty={day:S.day, list, bonus:false};
  },
  today(){ if(!S.bounty||S.bounty.day!==S.day) Bounty.roll(); return S.bounty; },
  prog(b){
    if(b.kind==='kill') return Math.min(b.n, ((S.st.kb||{})[b.key]||0)-b.base);
    if(b.kind==='item') return Math.min(b.n, S.inv[b.key]||0);
    if(b.kind==='gift') return Social.rel(b.key).gifted===S.day?1:0;
    if(b.kind==='qiyu') return S.qiyu&&S.qiyu.ev===b.key&&S.qiyu.done?1:0;
    return 0; },
  ready(b){ return !b.done && Bounty.prog(b)>=b.n; },
  claim(i){
    const B=Bounty.today(), b=B.list[i]; if(!b||!Bounty.ready(b)) return;
    if(b.kind==='item') addItem(b.key,-b.n);
    const r0=Bounty.rank(); b.done=true; S.stones+=b.pay; S.rep=Bounty.rep()+b.rep; Sound.coin();
    let msg=`完成悬赏：灵石 +${b.pay}，声望 +${b.rep}`;
    if(!B.bonus && B.list.every(x=>x.done)){ B.bonus=true; S.rep+=1; addItem('juqi',1); msg+='　·　今日悬赏全部完成！额外 声望 +1、聚气丹 ×1'; }
    UI.toast(msg); UI.hud();
    if(Bounty.rank()>r0){ Sound.levelup(); UI.banner('声望提升：'+RANKS[Bounty.rank()][1]); }
    UI.closePanel(); Bounty.open();
  },
  buy(i){ const it=REP_SHOP[i]; if(Bounty.rep()<it.cost) return UI.toast('声望不够'); if(it.once&&S.inv[it.id]) return UI.toast('已经有了'); S.rep-=it.cost; addItem(it.id,it.n); Sound.coin(); UI.toast(`换得 ${ITEMS[it.id].name} ×${it.n}`); UI.closePanel(); Bounty.open(); },
  open(){
    const B=Bounty.today(), rk=Bounty.rank(), next=RANKS[rk+1];
    UI.panel('桃源镇 · 悬赏榜', `<div class="bounty">
      <p class="muted">声望 <b>${Bounty.rep()}</b>　·　${RANKS[rk][1]}${next?`（${next[0]} 声望升为「${next[1]}」）`:''}　·　每天清晨换一批悬赏，全部完成有额外奖励。${rk<2?'到「桃源侠士」后每天有 4 个悬赏。':''}</p>
      <div class="blist">${B.list.map((b,i)=>{ const p=Bounty.prog(b);
        return `<div class="bnote ${b.done?'done':Bounty.ready(b)?'ready':''}"><small>${esc(b.who)}</small><b>${esc(b.text)}</b>
          <div class="brow"><span>${b.done?'✓ 已完成':`进度 ${p}/${b.n}`}</span><span class="bpay">灵石 ${b.pay}　声望 ${b.rep}</span>
          ${b.done?'':`<button class="btn mini ${Bounty.ready(b)?'main':''}" data-c="${i}" ${Bounty.ready(b)?'':'disabled'}>${b.kind==='item'?'交付':'领赏'}</button>`}</div></div>`; }).join('')}</div>
      <h4>声望兑换</h4><div class="bshop">${REP_SHOP.map((it,i)=>`<button class="bitem" data-b="${i}" ${Bounty.rep()<it.cost||(it.once&&S.inv[it.id])?'disabled':''}><img class="px" src="${iconURL(ITEMS[it.id].icon,ITEMS[it.id].color)}" alt=""><span>${ITEMS[it.id].name}×${it.n}</span><em>${it.cost} 声望</em></button>`).join('')}</div></div>`, b=>{
      b.querySelectorAll('[data-c]').forEach(x=>x.onclick=()=>Bounty.claim(+x.dataset.c));
      b.querySelectorAll('[data-b]').forEach(x=>x.onclick=()=>Bounty.buy(+x.dataset.b)); });
  },
  // for the HUD task list: how many requests are ready to hand in
  readyCount(){ return S.bounty&&S.bounty.day===S.day ? S.bounty.list.filter(Bounty.ready).length : 0; },
};
{ const _nd=Hooks.newDay; Hooks.newDay=function(){ _nd.apply(this,arguments); Bounty.roll(); }; }
